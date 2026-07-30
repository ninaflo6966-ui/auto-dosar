import type { RuleExpression } from "./Expression";

export class ExpressionSerializer {
  serialize(expression: RuleExpression): string {
    return JSON.stringify(expression);
  }

  deserialize(serialized: string): RuleExpression {
    const value: unknown = JSON.parse(serialized);
    if (!value || typeof value !== "object" || !("type" in value)) throw new Error("Invalid rule expression");
    return value as RuleExpression;
  }
}
