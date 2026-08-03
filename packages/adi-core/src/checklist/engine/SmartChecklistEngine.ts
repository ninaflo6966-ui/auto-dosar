import type { OperationDefinition } from "../../operations/models/OperationDefinition";
import type { OperationAnswers } from "../../operations/models/QuestionDefinition";
import { OperationRegistry } from "../../operations/registry/OperationRegistry";
import type { SmartChecklistItem } from "../models/SmartChecklistItem";
import type {
  SmartChecklistHealth,
  SmartChecklistResult,
} from "../models/SmartChecklistResult";

export interface SmartChecklistInput {
  operation: OperationDefinition;
  answers?: OperationAnswers;
  uploadedDocumentIds?: string[];
  validatedDocumentIds?: string[];
}

export class SmartChecklistEngine {
  build(input: SmartChecklistInput): SmartChecklistResult {
    const answers = input.answers ?? {};
    const uploaded = new Set(input.uploadedDocumentIds ?? []);
    const validated = new Set(input.validatedDocumentIds ?? []);
    const registry = new OperationRegistry([input.operation]);
    const visibleDocuments = registry.getRequiredDocuments(input.operation.id, answers);

    const items: SmartChecklistItem[] = visibleDocuments.map((document) => {
      const mandatory = document.requirement !== "recommended";
      const isValidated = validated.has(document.id);
      const isUploaded = uploaded.has(document.id);
      const status = isValidated
        ? "validated"
        : isUploaded
          ? "uploaded"
          : mandatory
            ? "missing"
            : "optional";

      return {
        id: document.id,
        title: document.title,
        description: document.description,
        requirement: document.requirement,
        mandatory,
        blocking: mandatory,
        status,
        reason: this.buildReason(document.requirement, input.operation.shortTitle),
        recommendation: isUploaded
          ? "Documentul a fost încărcat. Urmează verificarea lui."
          : `Încarcă documentul „${document.title}”.`,
        issuer: document.issuer,
        acceptedFormats: document.acceptedFormats,
        validationRuleIds: document.validationRuleIds,
      };
    });

    const requiredItems = items.filter((item) => item.mandatory);
    const completedRequired = requiredItems.filter(
      (item) => item.status === "uploaded" || item.status === "validated",
    );
    const missingRequired = requiredItems.filter((item) => item.status === "missing");
    const score = requiredItems.length === 0
      ? 100
      : Math.round((completedRequired.length / requiredItems.length) * 100);
    const health = this.calculateHealth(score, missingRequired.length);
    const warnings = missingRequired.map((item) => `Lipsește: ${item.title}`);
    const recommendations = missingRequired.map((item) => item.recommendation);

    return {
      operationId: input.operation.id,
      operationSlug: input.operation.slug,
      operationTitle: input.operation.title,
      generatedAt: new Date().toISOString(),
      items,
      requiredCount: requiredItems.length,
      optionalCount: items.length - requiredItems.length,
      completedRequiredCount: completedRequired.length,
      missingRequiredCount: missingRequired.length,
      score,
      health,
      readyForUpload: items.length > 0,
      readyForSubmission: missingRequired.length === 0 && requiredItems.length > 0,
      warnings,
      recommendations,
      nextAction: missingRequired[0]?.recommendation,
    };
  }

  private buildReason(requirement: SmartChecklistItem["requirement"], operationTitle: string): string {
    if (requirement === "required") {
      return `Document obligatoriu pentru operațiunea „${operationTitle}”.`;
    }
    if (requirement === "conditional") {
      return `Document necesar pe baza răspunsurilor oferite pentru „${operationTitle}”.`;
    }
    return `Document recomandat pentru pregătirea completă a operațiunii „${operationTitle}”.`;
  }

  private calculateHealth(score: number, missingRequiredCount: number): SmartChecklistHealth {
    if (missingRequiredCount === 0) return "READY";
    if (score >= 50) return "IN_PROGRESS";
    return "NEEDS_ATTENTION";
  }
}
