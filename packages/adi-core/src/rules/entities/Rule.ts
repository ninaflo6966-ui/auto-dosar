import type { LegalReference } from "../../knowledge";
import type { RuleCategory } from "./RuleCategory";
import type { RuleCondition } from "./RuleCondition";
import type { RuleSeverity } from "./RuleSeverity";
import type { RuleStatus } from "./RuleStatus";
import type { ExplanationTemplate } from "../models/Explanation";
import type { RecommendationDefinition } from "../models/Recommendation";
import type { NextActionDefinition } from "../models/NextAction";

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
  explanation?: ExplanationTemplate;
  recommendations?: readonly RecommendationDefinition[];
  nextActions?: readonly NextActionDefinition[];
  legalReferences?: readonly LegalReference[];
  tags?: readonly string[];
  validFrom?: string;
  validUntil?: string;
}
