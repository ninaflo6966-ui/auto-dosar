import { CaseStatus } from "../../enums/CaseStatus";
import type { CaseDocument } from "../../documents/models/CaseDocument";
import type { OperationAnswers } from "../../operations/models/QuestionDefinition";
import type { SmartChecklistResult } from "../../checklist/models/SmartChecklistResult";
import type { CaseFileState } from "../models/CaseFileState";

export class CaseFileManager {
  updateAnswers(
    caseFile: CaseFileState,
    answers: OperationAnswers,
    actor: "SYSTEM" | "USER" = "USER",
    now: Date = new Date(),
  ): CaseFileState {
    return this.next(caseFile, now, {
      answers: { ...caseFile.answers, ...answers },
      status: CaseStatus.CollectingDocuments,
      timelineMessage: "Răspunsurile Expert Dosar au fost actualizate.",
      timelineType: "CASE_FILE_ANSWERS_UPDATED",
      actor,
    });
  }

  applyChecklist(
    caseFile: CaseFileState,
    checklist: SmartChecklistResult,
    now: Date = new Date(),
  ): CaseFileState {
    return this.next(caseFile, now, {
      smartChecklist: checklist,
      score: checklist.score,
      progress: {
        completedSteps: checklist.completedRequiredCount,
        totalSteps: checklist.requiredCount,
        percent: checklist.score,
        missingDocuments: checklist.items
          .filter((item) => item.status === "missing")
          .map((item) => item.id),
        blockingErrors: checklist.warnings,
      },
      status: checklist.readyForSubmission
        ? CaseStatus.ReadyForSubmission
        : CaseStatus.CollectingDocuments,
      timelineMessage: "Checklist-ul inteligent a fost recalculat.",
      timelineType: "CASE_FILE_CHECKLIST_UPDATED",
      actor: "SYSTEM",
    });
  }

  addDocument(
    caseFile: CaseFileState,
    document: CaseDocument,
    actor: "SYSTEM" | "USER" = "USER",
    now: Date = new Date(),
  ): CaseFileState {
    const documents = [
      ...caseFile.documents.filter((existing) => existing.id !== document.id),
      document,
    ];

    return this.next(caseFile, now, {
      documents,
      status: CaseStatus.CollectingDocuments,
      timelineMessage: `Document încărcat: ${document.originalFileName ?? document.type}.`,
      timelineType: "CASE_FILE_DOCUMENT_ADDED",
      actor,
    });
  }

  removeDocument(
    caseFile: CaseFileState,
    documentId: string,
    actor: "SYSTEM" | "USER" = "USER",
    now: Date = new Date(),
  ): CaseFileState {
    return this.next(caseFile, now, {
      documents: caseFile.documents.filter((document) => document.id !== documentId),
      status: CaseStatus.CollectingDocuments,
      timelineMessage: `Document eliminat: ${documentId}.`,
      timelineType: "CASE_FILE_DOCUMENT_REMOVED",
      actor,
    });
  }

  changeStatus(
    caseFile: CaseFileState,
    status: CaseStatus,
    actor: "SYSTEM" | "USER" = "SYSTEM",
    now: Date = new Date(),
  ): CaseFileState {
    return this.next(caseFile, now, {
      status,
      timelineMessage: `Starea dosarului a devenit ${status}.`,
      timelineType: "CASE_FILE_STATUS_CHANGED",
      actor,
    });
  }

  private next(
    caseFile: CaseFileState,
    now: Date,
    changes: Partial<CaseFileState> & {
      timelineMessage: string;
      timelineType: string;
      actor: "SYSTEM" | "USER";
    },
  ): CaseFileState {
    const { timelineMessage, timelineType, actor, ...stateChanges } = changes;

    return {
      ...caseFile,
      ...stateChanges,
      version: caseFile.version + 1,
      updatedAt: now,
      metadata: caseFile.metadata
        ? {
            ...caseFile.metadata,
            lastModifiedBy: actor,
          }
        : undefined,
      timeline: [
        ...caseFile.timeline,
        {
          id: `${caseFile.id}-${caseFile.version + 1}-${now.getTime()}`,
          date: now,
          type: timelineType,
          description: timelineMessage,
          createdBy: actor,
        },
      ],
    };
  }
}
