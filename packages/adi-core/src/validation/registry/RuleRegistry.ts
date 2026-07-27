import { BusinessRule } from "../models/BusinessRule";
import { RcaNotOnBuyerRule } from "../rules/RcaBusinessRules";

export class RuleRegistry {
  private rules: BusinessRule[] = [RcaNotOnBuyerRule];

  getAllRules(): BusinessRule[] {
    return this.rules;
  }

  getRuleById(id: string): BusinessRule | undefined {
    return this.rules.find((rule) => rule.id === id);
  }

  getRulesByCategory(category: BusinessRule["category"]): BusinessRule[] {
    return this.rules.filter((rule) => rule.category === category);
  }
}