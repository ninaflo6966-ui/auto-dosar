import type { RuleConditionTrace } from "../entities/RuleResult";
import { RuleEvaluatorFactory } from "../evaluators/RuleEvaluatorFactory";
import type { RuleContext } from "../engine/RuleContext";
import type { PredicateExpression, RuleExpression } from "./Expression";

export interface ExpressionEvaluation {
  matched: boolean;
  traces: readonly RuleConditionTrace[];
}

export class ExpressionEvaluator {
  constructor(private readonly evaluatorFactory = new RuleEvaluatorFactory()) {}

  evaluate(expression: RuleExpression, context: RuleContext): ExpressionEvaluation {
    switch (expression.type) {
      case "CONDITION": {
        const trace = this.evaluatorFactory.get(expression.condition).evaluate(expression.condition, context);
        return { matched: trace.matched, traces: [trace] };
      }
      case "PREDICATE": {
        const trace = this.evaluatePredicate(expression, context);
        return { matched: trace.matched, traces: [trace] };
      }
      case "AND": {
        const results = expression.children.map((child) => this.evaluate(child, context));
        return { matched: results.every((item) => item.matched), traces: results.flatMap((item) => item.traces) };
      }
      case "OR": {
        const results = expression.children.map((child) => this.evaluate(child, context));
        return { matched: results.some((item) => item.matched), traces: results.flatMap((item) => item.traces) };
      }
      case "NOT": {
        const result = this.evaluate(expression.child, context);
        return { matched: !result.matched, traces: result.traces };
      }
    }
  }

  private evaluatePredicate(expression: PredicateExpression, context: RuleContext): RuleConditionTrace {
    const documents = context.twin.documents ?? [];
    const parties = context.twin.parties ?? [];
    const documentType = String(expression.args.type ?? "");
    let actual: unknown;
    let expected: unknown;
    let matched = false;

    switch (expression.predicate) {
      case "DOCUMENT_EXISTS":
        actual = documents.some((item) => item.type === documentType);
        expected = true;
        matched = actual === true;
        break;
      case "DOCUMENT_MISSING":
        actual = documents.some((item) => item.type === documentType);
        expected = false;
        matched = actual === false;
        break;
      case "DOCUMENT_VALID":
        actual = documents.some((item) => item.type === documentType && item.status === "VALID");
        expected = true;
        matched = actual === true;
        break;
      case "VEHICLE_ORIGIN": {
        actual = context.twin.vehicle?.origin;
        const values = expression.args.values as readonly unknown[];
        expected = values;
        matched = Array.isArray(values) && values.includes(actual);
        break;
      }
      case "VEHICLE_CONDITION":
        actual = context.twin.vehicle?.condition;
        expected = expression.args.value;
        matched = actual === expected;
        break;
      case "APPLICANT_KIND": {
        expected = expression.args.value;
        actual = parties.find((party) => {
          const caseParty = context.twin.case.parties.find((item) => item.partyId === party.id);
          return caseParty?.role === "APPLICANT" || caseParty?.role === "OWNER" || caseParty?.role === "BUYER";
        })?.kind;
        matched = actual === expected;
        break;
      }
      case "PROXY_EXISTS":
        actual = context.twin.case.parties.some((item) => item.role === "AUTHORIZED_PERSON" || item.role === "DELEGATE" || Boolean(item.representedPartyId));
        expected = true;
        matched = actual === true;
        break;
      case "OPERATION_TYPE":
        actual = context.operationType ?? context.twin.operation.type;
        expected = expression.args.value;
        matched = actual === expected;
        break;
    }

    return {
      path: `dsl.${expression.predicate}`,
      operator: expression.predicate,
      expected,
      actual,
      matched,
      description: expression.description,
    };
  }
}
