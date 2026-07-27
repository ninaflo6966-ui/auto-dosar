import { BusinessRule } from "../models/BusinessRule";
import { ValidationIssue } from "../models/ValidationResult";
import { RcaValidationInput, validateRcaForBuyer } from "./RcaRules";

export const RcaNotOnBuyerRule: BusinessRule = {
  id: "RCA_001",
  title: "RCA emisă pe numele cumpărătorului",
  description:
    "Polița RCA trebuie să fie valabilă și emisă pe numele cumpărătorului sau noului proprietar.",
  category: "insurance",
  severity: "error",
  userMessage: "RCA nu este emisă pe numele cumpărătorului.",
  solution:
    "Solicitați emiterea unei polițe RCA pe numele cumpărătorului înainte de depunerea dosarului.",
  execute(context): ValidationIssue[] {
    return validateRcaForBuyer(context as unknown as RcaValidationInput).filter(
      (issue) => issue.code === "RCA_NOT_ON_BUYER"
    );
  },
};