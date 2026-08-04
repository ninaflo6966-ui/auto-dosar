import type { ICaseFileRepository } from "../../case-file/repository/ICaseFileRepository";
import { CaseFileManager } from "../../case-file/services/CaseFileManager";
import { SmartChecklistEngine } from "../../checklist/engine/SmartChecklistEngine";
import { DocumentStatus } from "../../documents/enums/DocumentStatus";
import type { IEventBus } from "../../events/contracts/IEventBus";
import { AutoDosarEvents } from "../../events/domain-events/AutoDosarEvents";
import type { OperationRegistry } from "../../operations/registry/OperationRegistry";
import type { CaseFileProjection, CaseFileProjectionDocument } from "../models/CaseFileProjection";
import {
  CaseFileNotFoundError,
  CaseFileVersionConflictError,
} from "./UpdateAnswerUseCase";

export interface RemoveDocumentRequest {
  caseId: string;
  documentId: string;
  expectedVersion?: number;
  actorId?: string;
  correlationId?: string;
}

export interface RemoveDocumentUseCaseDependencies {
  repository: ICaseFileRepository;
  eventBus: IEventBus;
  operationRegistry: OperationRegistry;
  manager?: CaseFileManager;
  checklistEngine?: SmartChecklistEngine;
  clock?: () => Date;
}

export class UploadedDocumentNotFoundError extends Error {
  constructor(documentId: string) {
    super(`Uploaded document not found: ${documentId}`);
    this.name = "UploadedDocumentNotFoundError";
  }
}

export class RemoveDocumentUseCase {
  private readonly manager: CaseFileManager;
  private readonly checklistEngine: SmartChecklistEngine;
  private readonly clock: () => Date;

  constructor(private readonly dependencies: RemoveDocumentUseCaseDependencies) {
    this.manager = dependencies.manager ?? new CaseFileManager();
    this.checklistEngine = dependencies.checklistEngine ?? new SmartChecklistEngine();
    this.clock = dependencies.clock ?? (() => new Date());
  }

  async execute(request: RemoveDocumentRequest): Promise<CaseFileProjection> {
    const current = await this.dependencies.repository.findById(request.caseId);
    if (!current) throw new CaseFileNotFoundError(request.caseId);

    if (request.expectedVersion !== undefined && request.expectedVersion !== current.version) {
      throw new CaseFileVersionConflictError(request.expectedVersion, current.version);
    }

    const document = current.documents.find((item) => item.id === request.documentId);
    if (!document) throw new UploadedDocumentNotFoundError(request.documentId);

    const now = this.clock();
    const withoutDocument = this.manager.removeDocument(current, request.documentId, "USER", now);
    const operationKey = withoutDocument.operationSlug ?? String(withoutDocument.operation);
    const operation = this.dependencies.operationRegistry.require(operationKey);
    const checklist = this.checklistEngine.build({
      operation,
      answers: withoutDocument.answers,
      uploadedDocumentIds: withoutDocument.documents
        .filter((item) => item.status !== DocumentStatus.Invalid)
        .map((item) => item.operationDocumentId)
        .filter((id): id is string => Boolean(id)),
      validatedDocumentIds: withoutDocument.documents
        .filter((item) => item.status === DocumentStatus.Validated)
        .map((item) => item.operationDocumentId)
        .filter((id): id is string => Boolean(id)),
    });
    const updated = this.manager.applyChecklist(withoutDocument, checklist, now);
    await this.dependencies.repository.save(updated);

    const correlationId = request.correlationId ?? request.caseId;
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
      documents: caseFile.documents.map((item): CaseFileProjectionDocument => ({
        id: item.id,
        checklistDocumentId: item.operationDocumentId,
        type: item.type,
        status: item.status,
        fileName: item.originalFileName,
        mimeType: item.mimeType,
        sizeBytes: item.fileSizeBytes,
        storageKey: item.storageKey,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
      })),
      createdAt: caseFile.createdAt,
      updatedAt: caseFile.updatedAt,
    };
  }
}
