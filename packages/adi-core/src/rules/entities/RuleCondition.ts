import type { RuleOperator } from "./RuleOperator";

export interface RuleCondition {
  path: string;
  operator: RuleOperator;
  value?: unknown;
  description?: string;
}
