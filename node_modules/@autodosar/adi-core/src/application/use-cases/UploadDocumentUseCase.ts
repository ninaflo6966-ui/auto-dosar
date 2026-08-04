import type { ICaseFileRepository } from "../../case-file/repository/ICaseFileRepository";
import { CaseFileManager } from "../../case-file/services/CaseFileManager";
import { SmartChecklistEngine } from "../../checklist/engine/SmartChecklistEngine";
import { DocumentSource } from "../../documents/enums/DocumentSource";
import { DocumentStatus } from "../../documents/enums/DocumentStatus";
import type { DocumentType } from "../../documents/enums/DocumentType";
import type { CaseDocument } from "../../documents/models/CaseDocument";
import type { IEventBus } from "../../events/contracts/IEventBus";
import { AutoDosarEvents } from "../../events/domain-events/AutoDosarEvents";
import type { OperationRegistry } from "../../operations/registry/OperationRegistry";
import type { CaseFileProjection, CaseFileProjectionDocument } from "../models/CaseFileProjection";
import {
  CaseFileNotFoundError,
  CaseFileVersionConflictError,
} from "./UpdateAnswerUseCase";

export interface UploadDocumentRequest {
  caseId: string;
  checklistDocumentId: string;
  documentType: DocumentType;
  fileName: string;
  mimeType: string;
  sizeBytes: number;
  storageKey?: string;
  checksumSha256?: string;
  expectedVersion?: number;
  actorId?: string;
  correlationId?: string;
}

export interface UploadDocumentUseCaseDependencies {
  repository: ICaseFileRepository;
  eventBus: IEventBus;
  operationRegistry: OperationRegistry;
  manager?: CaseFileManager;
  checklistEngine?: SmartChecklistEngine;
  idFactory?: () => string;
  clock?: () => Date;
  maximumFileSizeBytes?: number;
  acceptedMimeTypes?: readonly string[];
}

export class ChecklistDocumentNotFoundError extends Error {
  constructor(documentId: string) {
    super(`Checklist document not found or not currently required: ${documentId}`);
    this.name = "ChecklistDocumentNotFoundError";
  }
}

export class UnsupportedUploadTypeError extends Error {
  constructor(mimeType: string) {
    super(`Unsupported upload MIME type: ${mimeType}`);
    this.name = "UnsupportedUploadTypeError";
  }
}

export class UploadFileTooLargeError extends Error {
  constructor(sizeBytes: number, maximumBytes: number) {
    super(`Uploaded file is too large: ${sizeBytes} bytes; maximum is ${maximumBytes} bytes.`);
    this.name = "UploadFileTooLargeError";
  }
}

/**
 * Adaugă metadatele unui fișier încărcat în CaseFileState, reconstruiește
 * checklist-ul și publică evenimentele necesare. Persistența binară a fișierului
 * este responsabilitatea stratului de infrastructură; use case-ul primește doar
 * storageKey-ul rezultat.
 */
export class UploadDocumentUseCase {
  private readonly manager: CaseFileManager;
  private readonly checklistEngine: SmartChecklistEngine;
  private readonly idFactory: () => string;
  private readonly clock: () => Date;
  private readonly maximumFileSizeBytes: number;
  private readonly acceptedMimeTypes: ReadonlySet<string>;

  constructor(private readonly dependencies: UploadDocumentUseCaseDependencies) {
    this.manager = dependencies.manager ?? new CaseFileManager();
    this.checklistEngine = dependencies.checklistEngine ?? new SmartChecklistEngine();
    this.idFactory = dependencies.idFactory ?? (() => crypto.randomUUID());
    this.clock = dependencies.clock ?? (() => new Date());
    this.maximumFileSizeBytes = dependencies.maximumFileSizeBytes ?? 15 * 1024 * 1024;
    this.acceptedMimeTypes = new Set(
      dependencies.acceptedMimeTypes ?? [
        "application/pdf",
        "image/jpeg",
        "image/png",
      ],
    );
  }

  async execute(request: UploadDocumentRequest): Promise<CaseFileProjection> {
    const current = await this.dependencies.repository.findById(request.caseId);
    if (!current) throw new CaseFileNotFoundError(request.caseId);

    if (request.expectedVersion !== undefined && request.expectedVersion !== current.version) {
      throw new CaseFileVersionConflictError(request.expectedVersion, current.version);
    }

    this.validateUpload(request);

    const operationKey = current.operationSlug ?? String(current.operation);
    const operation = this.dependencies.operationRegistry.require(operationKey);
    const visibleDocuments = this.dependencies.operationRegistry.getRequiredDocuments(
      operation.id,
      current.answers,
    );
    const definition = visibleDocuments.find(
      (document) => document.id === request.checklistDocumentId,
    );
    if (!definition) {
      throw new ChecklistDocumentNotFoundError(request.checklistDocumentId);
    }

    const now = this.clock();
    const document: CaseDocument = {
      id: this.idFactory(),
      operationDocumentId: request.checklistDocumentId,
      type: request.documentType,
      status: DocumentStatus.Uploaded,
      source: DocumentSource.Upload,
      originalFileName: request.fileName,
      mimeType: request.mimeType,
      fileSizeBytes: request.sizeBytes,
      storageKey: request.storageKey,
      checksumSha256: request.checksumSha256,
      createdAt: now,
      updatedAt: now,
    };

    const previousDocuments = current.documents.filter(
      (item) => item.operationDocumentId === request.checklistDocumentId,
    );
    const baseCase = previousDocuments.reduce(
      (state, item) => this.manager.removeDocument(state, item.id, "USER", now),
      current,
    );
    const withDocument = this.manager.addDocument(baseCase, document, "USER", now);
    const checklist = this.checklistEngine.build({
      operation,
      answers: withDocument.answers,
      uploadedDocumentIds: this.getUploadedDocumentIds(withDocument.documents),
      validatedDocumentIds: this.getValidatedDocumentIds(withDocument.documents),
    });
    const updated = this.manager.applyChecklist(withDocument, checklist, now);

    if (request.actorId && updated.metadata) {
      updated.metadata.lastModifiedBy = request.actorId;
    }

    await this.dependencies.repository.save(updated);

    const correlationId = request.correlationId ?? request.caseId;
    await this.dependencies.eventBus.publish(
      AutoDosarEvents.documentUploaded({
        aggregateId: updated.id,
        actorId: request.actorId,
        correlationId,
        occurredAt: now.toISOString(),
        payload: {
          documentId: document.id,
          fileName: request.fileName,
          mimeType: request.mimeType,
          sizeBytes: request.sizeBytes,
          documentType: String(request.documentType),
        },
      }),
    );

    await this.dependencies.eventBus.publish(
      AutoDosarEvents.checklistUpdated({
        aggregateId: updated.id,
        actorId: request.actorId,
        correlationId,
        occurredAt: now.toISOString(),
        payload: {
          caseId: updated.id,
          score: updated.score,
          requiredCount: checklist.requiredCount,
          missingRequiredCount: checklist.missingRequiredCount,
          readyForSubmission: checklist.readyForSubmission,
          version: updated.version,
        },
      }),
    );

    return this.project(updated);
  }

  private validateUpload(request: UploadDocumentRequest): void {
    if (!this.acceptedMimeTypes.has(request.mimeType)) {
      throw new UnsupportedUploadTypeError(request.mimeType);
    }
    if (!Number.isFinite(request.sizeBytes) || request.sizeBytes <= 0) {
      throw new Error("Uploaded file size must be a positive number.");
    }
    if (request.sizeBytes > this.maximumFileSizeBytes) {
      throw new UploadFileTooLargeError(request.sizeBytes, this.maximumFileSizeBytes);
    }
    if (!request.fileName.trim()) {
      throw new Error("Uploaded file name is required.");
    }
  }

  private project(caseFile: NonNullable<Awaited<ReturnType<ICaseFileRepository["findById"]>>>): CaseFileProjection {
    return {
      caseId: caseFile.id,
      reference: caseFile.reference,
      operation: caseFile.operation,
      operationSlug: caseFile.operationSlug,
      status: caseFile.status,
      score: caseFile.score,
      version: caseFile.version,
      answers: { ...caseFile.answers },
      checklist: caseFile.smartChecklist,
      progress: { ...caseFile.progress },
      documents: caseFile.documents.map((document): CaseFileProjectionDocument => ({
        id: document.id,
        checklistDocumentId: document.operationDocumentId,
        type: document.type,
        status: document.status,
        fileName: document.originalFileName,
        mimeType: document.mimeType,
        sizeBytes: document.fileSizeBytes,
        storageKey: document.storageKey,
        createdAt: document.createdAt,
        updatedAt: document.updatedAt,
      })),
      createdAt: caseFile.createdAt,
      updatedAt: caseFile.updatedAt,
    };
  }

  private getUploadedDocumentIds(documents: CaseDocument[]): string[] {
    return documents
      .filter((document) => document.status !== DocumentStatus.Invalid)
      .map((document) => document.operationDocumentId)
      .filter((id): id is string => Boolean(id));
  }

  private getValidatedDocumentIds(documents: CaseDocument[]): string[] {
    return documents
      .filter((document) => document.status === DocumentStatus.Validated)
      .map((document) => document.operationDocumentId)
      .filter((id): id is string => Boolean(id));
  }
}
