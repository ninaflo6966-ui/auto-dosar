import type { OperationType } from "../../enums/OperationType";
import type { OperationAnswers } from "../../operations/models/QuestionDefinition";
import type { IEventBus } from "../../events/contracts/IEventBus";
import { AutoDosarEvents } from "../../events/domain-events/AutoDosarEvents";
import type { ICaseFileRepository } from "../../case-file/repository/ICaseFileRepository";
import { CaseFileBuilder } from "../../case-file/services/CaseFileBuilder";
import type { CaseFileProjection } from "../models/CaseFileProjection";

export interface CreateCaseFileRequest {
  operation: OperationType;
  operationSlug?: string;
  answers?: OperationAnswers;
  actorId?: string;
  source?: "WEB" | "API" | "ADMIN" | "IMPORT";
  correlationId?: string;
}

export interface CreateCaseFileUseCaseDependencies {
  repository: ICaseFileRepository;
  eventBus: IEventBus;
  builder?: CaseFileBuilder;
  idFactory?: () => string;
  referenceFactory?: () => string;
  clock?: () => Date;
}

export class CreateCaseFileUseCase {
  private readonly builder: CaseFileBuilder;
  private readonly idFactory: () => string;
  private readonly referenceFactory: () => string;
  private readonly clock: () => Date;

  constructor(private readonly dependencies: CreateCaseFileUseCaseDependencies) {
    this.builder = dependencies.builder ?? new CaseFileBuilder();
    this.idFactory = dependencies.idFactory ?? (() => crypto.randomUUID());
    this.referenceFactory = dependencies.referenceFactory ?? (() => `AD-${Date.now()}`);
    this.clock = dependencies.clock ?? (() => new Date());
  }

  async execute(request: CreateCaseFileRequest): Promise<CaseFileProjection> {
    const now = this.clock();
    const caseFile = this.builder.create({
      id: this.idFactory(),
      reference: this.referenceFactory(),
      operation: request.operation,
      operationSlug: request.operationSlug,
      answers: request.answers,
      metadata: {
        createdBy: request.actorId,
        lastModifiedBy: request.actorId,
        source: request.source ?? "WEB",
      },
      now,
    });

    await this.dependencies.repository.save(caseFile);

    await this.dependencies.eventBus.publish(
      AutoDosarEvents.caseCreated({
        aggregateId: caseFile.id,
        actorId: request.actorId,
        correlationId: request.correlationId ?? caseFile.id,
        occurredAt: now.toISOString(),
        payload: {
          caseId: caseFile.id,
          reference: caseFile.reference,
          operation: caseFile.operation,
          operationSlug: caseFile.operationSlug,
          status: caseFile.status,
        },
      }),
    );

    return {
      caseId: caseFile.id,
      reference: caseFile.reference,
      operation: caseFile.operation,
      operationSlug: caseFile.operationSlug,
      status: caseFile.status,
      score: caseFile.score,
      version: caseFile.version,
      createdAt: caseFile.createdAt,
      updatedAt: caseFile.updatedAt,
    };
  }
}
