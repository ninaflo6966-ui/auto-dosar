import type { RuleExpression } from "./Expression";

function requireExpressions(expressions: readonly RuleExpression[], operator: string): void {
  if (expressions.length === 0) throw new Error(`${operator} requires at least one expression`);
}

export function allOf(...expressions: readonly RuleExpression[]): RuleExpression {
  requireExpressions(expressions, "allOf");
  return expressions.length === 1 ? expressions[0] : { type: "AND", children: expressions };
}

export function anyOf(...expressions: readonly RuleExpression[]): RuleExpression {
  requireExpressions(expressions, "anyOf");
  return expressions.length === 1 ? expressions[0] : { type: "OR", children: expressions };
}

export function not(expression: RuleExpression): RuleExpression {
  return { type: "NOT", child: expression };
}
