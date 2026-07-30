import type { RuleCondition } from "../entities/RuleCondition";

export type DomainPredicateName =
  | "DOCUMENT_EXISTS"
  | "DOCUMENT_MISSING"
  | "DOCUMENT_VALID"
  | "VEHICLE_ORIGIN"
  | "VEHICLE_CONDITION"
  | "APPLICANT_KIND"
  | "PROXY_EXISTS"
  | "OPERATION_TYPE";

export interface ConditionExpression {
  readonly type: "CONDITION";
  readonly condition: RuleCondition;
}

export interface PredicateExpression {
  readonly type: "PREDICATE";
  readonly predicate: DomainPredicateName;
  readonly args: Readonly<Record<string, unknown>>;
  readonly description?: string;
}

export interface LogicalExpression {
  readonly type: "AND" | "OR";
  readonly children: readonly RuleExpression[];
}

export interface NotExpression {
  readonly type: "NOT";
  readonly child: RuleExpression;
}

export type RuleExpression = ConditionExpression | PredicateExpression | LogicalExpression | NotExpression;

export function condition(expression: RuleCondition): ConditionExpression {
  return { type: "CONDITION", condition: expression };
}
