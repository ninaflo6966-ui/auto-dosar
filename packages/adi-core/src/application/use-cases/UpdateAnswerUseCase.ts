import type { ICaseFileRepository } from "../../case-file/repository/ICaseFileRepository";
import { CaseFileManager } from "../../case-file/services/CaseFileManager";
import { SmartChecklistEngine } from "../../checklist/engine/SmartChecklistEngine";
import type { CaseDocument } from "../../documents/models/CaseDocument";
import { DocumentType } from "../../documents/enums/DocumentType";
import type { IEventBus } from "../../events/contracts/IEventBus";
import { AutoDosarEvents } from "../../events/domain-events/AutoDosarEvents";
import type { OperationAnswers } from "../../operations/models/QuestionDefinition";
import type { OperationRegistry } from "../../operations/registry/OperationRegistry";
import type { CaseFileProjection } from "../models/CaseFileProjection";

export interface UpdateAnswerRequest {
  caseId: string;
  answers: OperationAnswers;
  expectedVersion?: number;
  actorId?: string;
  correlationId?: string;
}

export interface UpdateAnswerUseCaseDependencies {
  repository: ICaseFileRepository;
  eventBus: IEventBus;
  operationRegistry: OperationRegistry;
  manager?: CaseFileManager;
  checklistEngine?: SmartChecklistEngine;
  clock?: () => Date;
}

export class CaseFileNotFoundError extends Error {
  constructor(caseId: string) {
    super(`Case file not found: ${caseId}`);
    this.name = "CaseFileNotFoundError";
  }
}

export class CaseFileVersionConflictError extends Error {
  constructor(expected: number, actual: number) {
    super(`Case file version conflict. Expected ${expected}, actual ${actual}.`);
    this.name = "CaseFileVersionConflictError";
  }
}

/**
 * Actualizează răspunsurile unui dosar și reconstruiește imediat checklist-ul.
 * Use case-ul coordonează domeniul; nu conține reguli specifice operațiunilor.
 */
export class UpdateAnswerUseCase {
  private readonly manager: CaseFileManager;
  private readonly checklistEngine: SmartChecklistEngine;
  private readonly clock: () => Date;

  constructor(private readonly dependencies: UpdateAnswerUseCaseDependencies) {
    this.manager = dependencies.manager ?? new CaseFileManager();
    this.checklistEngine = dependencies.checklistEngine ?? new SmartChecklistEngine();
    this.clock = dependencies.clock ?? (() => new Date());
  }

  async execute(request: UpdateAnswerRequest): Promise<CaseFileProjection> {
    const current = await this.dependencies.repository.findById(request.caseId);
    if (!current) throw new CaseFileNotFoundError(request.caseId);

    if (request.expectedVersion !== undefined && request.expectedVersion !== current.version) {
      throw new CaseFileVersionConflictError(request.expectedVersion, current.version);
    }

    const now = this.clock();
    const withAnswers = this.manager.updateAnswers(current, request.answers, "USER", now);
    const operationKey = withAnswers.operationSlug ?? String(withAnswers.operation);
    const operation = this.dependencies.operationRegistry.require(operationKey);

    const checklist = this.checklistEngine.build({
      operation,
      answers: withAnswers.answers,
      uploadedDocumentIds: this.getUploadedDocumentIds(withAnswers.documents),
      validatedDocumentIds: this.getValidatedDocumentIds(withAnswers.documents),
    });

    const updated = this.manager.applyChecklist(withAnswers, checklist, now);
    if (request.actorId && updated.metadata) {
      updated.metadata.lastModifiedBy = request.actorId;
    }

    await this.dependencies.repository.save(updated);

    const correlationId = request.correlationId ?? request.caseId;
    await this.dependencies.eventBus.publish(
      AutoDosarEvents.caseAnswersUpdated({
        aggregateId: updated.id,
        actorId: request.actorId,
        correlationId,
        occurredAt: now.toISOString(),
        payload: {
          caseId: updated.id,
          changedAnswerIds: Object.keys(request.answers),
          version: updated.version,
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

  private project(caseFile: Awaited<ReturnType<ICaseFileRepository["findById"]>> extends infer T ? Exclude<T, undefined> : never): CaseFileProjection {
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
      createdAt: caseFile.createdAt,
      updatedAt: caseFile.updatedAt,
    };
  }

  private getUploadedDocumentIds(documents: CaseDocument[]): string[] {
    return documents.map((document) => this.toOperationDocumentId(document.type)).filter((id): id is string => Boolean(id));
  }

  private getValidatedDocumentIds(documents: CaseDocument[]): string[] {
    return documents
      .filter((document) => String(document.status).toUpperCase() === "VALIDATED")
      .map((document) => this.toOperationDocumentId(document.type))
      .filter((id): id is string => Boolean(id));
  }

  private toOperationDocumentId(type: DocumentType): string | undefined {
    const mapping: Partial<Record<DocumentType, string>> = {
      [DocumentType.CIV]: "civ",
      [DocumentType.RegistrationCertificate]: "talon",
      [DocumentType.RCA]: "rca",
      [DocumentType.ContractITL054]: "contract_vc",
      [DocumentType.Invoice]: "contract_vc",
      [DocumentType.FiscalCertificate]: "certificat_fiscal",
      [DocumentType.PowerOfAttorney]: "imputernicire",
      [DocumentType.Delegation]: "imputernicire",
      [DocumentType.IdentityCard]: "ci_pf",
    };
    return mapping[type];
  }
}
