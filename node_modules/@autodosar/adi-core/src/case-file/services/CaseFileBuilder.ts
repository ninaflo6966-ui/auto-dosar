import { CaseStatus } from "../../enums/CaseStatus";
import type { OperationType } from "../../enums/OperationType";
import type { OperationAnswers } from "../../operations/models/QuestionDefinition";
import type { CaseFileState } from "../models/CaseFileState";
import type { CaseFileMetadata } from "../models/CaseFileMetadata";

export interface CreateCaseFileInput {
  id: string;
  reference: string;
  operation: OperationType;
  operationSlug?: string;
  answers?: OperationAnswers;
  metadata?: CaseFileMetadata;
  now?: Date;
}

export class CaseFileBuilder {
  create(input: CreateCaseFileInput): CaseFileState {
    const now = input.now ?? new Date();

    return {
      id: input.id,
      reference: input.reference,
      operation: input.operation,
      operationSlug: input.operationSlug,
      status: CaseStatus.Draft,
      persons: [],
      companies: [],
      vehicles: [],
      documents: [],
      answers: { ...(input.answers ?? {}) },
      score: 0,
      version: 1,
      progress: {
        completedSteps: 0,
        totalSteps: 0,
        percent: 0,
        missingDocuments: [],
        blockingErrors: [],
      },
      timeline: [
        {
          id: `${input.id}-created`,
          date: now,
          type: "CASE_FILE_CREATED",
          description: "Dosarul a fost creat.",
          createdBy: input.metadata?.createdBy ? "USER" : "SYSTEM",
        },
      ],
      metadata: input.metadata,
      createdAt: now,
      updatedAt: now,
    };
  }
}
