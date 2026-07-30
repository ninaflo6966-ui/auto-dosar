import type { DomainOperationType } from "../../domain/CoreDomain";
import type { PredicateExpression, RuleExpression } from "./Expression";

function predicate(predicateName: PredicateExpression["predicate"], args: Record<string, unknown>, description?: string): PredicateExpression {
  return { type: "PREDICATE", predicate: predicateName, args, description };
}

export function document(type: string) {
  if (!type.trim()) throw new Error("document type is required");
  return {
    exists: (): RuleExpression => predicate("DOCUMENT_EXISTS", { type }, `Document ${type} exists`),
    missing: (): RuleExpression => predicate("DOCUMENT_MISSING", { type }, `Document ${type} is missing`),
    isValid: (): RuleExpression => predicate("DOCUMENT_VALID", { type }, `Document ${type} is valid`),
  };
}

export const vehicle = {
  isImported: (): RuleExpression => predicate("VEHICLE_ORIGIN", { values: ["EU", "NON_EU"] }, "Vehicle is imported"),
  isDomestic: (): RuleExpression => predicate("VEHICLE_ORIGIN", { values: ["ROMANIA"] }, "Vehicle is domestic"),
  isNew: (): RuleExpression => predicate("VEHICLE_CONDITION", { value: "NEW" }, "Vehicle is new"),
  isUsed: (): RuleExpression => predicate("VEHICLE_CONDITION", { value: "USED" }, "Vehicle is used"),
};

export const applicant = {
  isNaturalPerson: (): RuleExpression => predicate("APPLICANT_KIND", { value: "NATURAL_PERSON" }, "Applicant is a natural person"),
  isCompany: (): RuleExpression => predicate("APPLICANT_KIND", { value: "LEGAL_PERSON" }, "Applicant is a legal person"),
  hasProxy: (): RuleExpression => predicate("PROXY_EXISTS", {}, "Applicant has a proxy"),
};

export const proxy = {
  exists: (): RuleExpression => predicate("PROXY_EXISTS", {}, "A proxy exists"),
  missing: (): RuleExpression => ({ type: "NOT", child: predicate("PROXY_EXISTS", {}, "A proxy exists") }),
};

function operationPredicate(type: DomainOperationType, description: string): RuleExpression {
  return predicate("OPERATION_TYPE", { value: type }, description);
}

export const operation = {
  isRegistration: (): RuleExpression => operationPredicate("PERMANENT_REGISTRATION", "Operation is permanent registration"),
  isTranscription: (): RuleExpression => operationPredicate("TRANSCRIPTION", "Operation is transcription"),
  isTemporaryAuthorization: (): RuleExpression => operationPredicate("TEMPORARY_AUTHORIZATION", "Operation is temporary authorization"),
  isRadiation: (): RuleExpression => operationPredicate("DEREGISTRATION", "Operation is deregistration"),
  is: (type: DomainOperationType): RuleExpression => operationPredicate(type, `Operation is ${type}`),
};
