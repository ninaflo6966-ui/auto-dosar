import type { LegalReference } from "../../knowledge";
import type { RuleCategory } from "./RuleCategory";
import type { RuleCondition } from "./RuleCondition";
import type { RuleSeverity } from "./RuleSeverity";
import type { RuleStatus } from "./RuleStatus";

export interface Rule {
  id: string;
  version: string;
  name: string;
  description: string;
  category: RuleCategory;
  severity: RuleSeverity;
  status: RuleStatus;
  priority: number;
  conditions: readonly RuleCondition[];
  message: string;
  reason: string;
  recommendation?: string;
  legalReferences?: readonly LegalReference[];
  tags?: readonly string[];
  validFrom?: string;
  validUntil?: string;
}
