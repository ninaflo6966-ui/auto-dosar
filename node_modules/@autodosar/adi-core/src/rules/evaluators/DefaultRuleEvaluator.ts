import type { RuleCondition } from "../entities/RuleCondition";
import type { RuleConditionTrace } from "../entities/RuleResult";
import type { RuleContext } from "../engine/RuleContext";
import type { IRuleEvaluator } from "../interfaces/IRuleEvaluator";
import { PathValueResolver } from "./PathValueResolver";

export class DefaultRuleEvaluator implements IRuleEvaluator {
  constructor(private readonly resolver = new PathValueResolver()) {}

  supports(): boolean { return true; }

  evaluate(condition: RuleCondition, context: RuleContext): RuleConditionTrace {
    const actual = this.resolver.resolve(context, condition.path);
    const expected = condition.value;
    let matched = false;

    switch (condition.operator) {
      case "EQUALS": matched = actual === expected; break;
      case "NOT_EQUALS": matched = actual !== expected; break;
      case "IN": matched = Array.isArray(expected) && expected.includes(actual); break;
      case "NOT_IN": matched = Array.isArray(expected) && !expected.includes(actual); break;
      case "EXISTS": matched = actual !== undefined && actual !== null; break;
      case "NOT_EXISTS": matched = actual === undefined || actual === null; break;
      case "GREATER_THAN": matched = typeof actual === "number" && typeof expected === "number" && actual > expected; break;
      case "GREATER_THAN_OR_EQUAL": matched = typeof actual === "number" && typeof expected === "number" && actual >= expected; break;
      case "LESS_THAN": matched = typeof actual === "number" && typeof expected === "number" && actual < expected; break;
      case "LESS_THAN_OR_EQUAL": matched = typeof actual === "number" && typeof expected === "number" && actual <= expected; break;
      case "CONTAINS": matched = typeof actual === "string" ? actual.includes(String(expected)) : Array.isArray(actual) && actual.includes(expected); break;
      case "MATCHES": matched = typeof actual === "string" && typeof expected === "string" && new RegExp(expected).test(actual); break;
    }

    return { path: condition.path, operator: condition.operator, expected, actual, matched, description: condition.description };
  }
}
