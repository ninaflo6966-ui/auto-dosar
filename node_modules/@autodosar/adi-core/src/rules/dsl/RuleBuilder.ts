import type { LegalReference } from "../../knowledge";
import type { Rule } from "../entities/Rule";
import type { RuleCategory } from "../entities/RuleCategory";
import type { RuleSeverity } from "../entities/RuleSeverity";
import type { RuleStatus } from "../entities/RuleStatus";
import type { ExplanationTemplate } from "../models/Explanation";
import type { NextActionDefinition } from "../models/NextAction";
import type { RecommendationDefinition, RecommendationPriority } from "../models/Recommendation";
import type { RuleExpression } from "./Expression";
import { allOf, anyOf } from "./LogicalOperators";

export class RuleBuilder {
  private value: Partial<Rule> & Pick<Rule, "id">;
  private expression?: RuleExpression;

  constructor(id: string) {
    if (!id.trim()) throw new Error("Rule id is required");
    this.value = { id, version: "1.0.0", name: id, description: id, category: "WORKFLOW", severity: "ERROR", status: "ACTIVE", priority: 100, conditions: [], message: id, reason: id };
  }

  version(value: string): this { this.value.version = value; return this; }
  name(value: string): this { this.value.name = value; return this; }
  description(value: string): this { this.value.description = value; return this; }
  category(value: RuleCategory): this { this.value.category = value; return this; }
  severity(value: RuleSeverity): this { this.value.severity = value; return this; }
  status(value: RuleStatus): this { this.value.status = value; return this; }
  priority(value: number): this { this.value.priority = value; return this; }
  message(value: string): this { this.value.message = value; return this; }
  reason(value: string): this { this.value.reason = value; return this; }
  tags(...values: readonly string[]): this { this.value.tags = values; return this; }
  validFrom(value: string): this { this.value.validFrom = value; return this; }
  validUntil(value: string): this { this.value.validUntil = value; return this; }
  owner(value: string): this { this.value.metadata = { ...(this.value.metadata ?? {}), owner: value }; return this; }
  metadata(value: NonNullable<Rule["metadata"]>): this { this.value.metadata = { ...(this.value.metadata ?? {}), ...value }; return this; }

  when(expression: RuleExpression): this { this.expression = expression; return this; }
  and(expression: RuleExpression): this { this.expression = this.expression ? allOf(this.expression, expression) : expression; return this; }
  or(expression: RuleExpression): this { this.expression = this.expression ? anyOf(this.expression, expression) : expression; return this; }

  explain(value: ExplanationTemplate): this { this.value.explanation = value; return this; }
  because(reference: LegalReference | string): this {
    const legalReference: LegalReference = typeof reference === "string"
      ? { id: `LEGAL-${this.value.id}-${(this.value.legalReferences?.length ?? 0) + 1}`, title: reference, verificationStatus: "NEEDS_REVIEW" }
      : reference;
    this.value.legalReferences = [...(this.value.legalReferences ?? []), legalReference];
    return this;
  }
  recommend(action: string, priority: RecommendationPriority = "HIGH", details: Omit<RecommendationDefinition, "action" | "priority"> = {}): this {
    this.value.recommendation ??= action;
    this.value.recommendations = [...(this.value.recommendations ?? []), { ...details, action, priority }];
    return this;
  }
  nextAction(code: string, label = code, options: Omit<NextActionDefinition, "code" | "label"> = {}): this {
    this.value.nextActions = [...(this.value.nextActions ?? []), { ...options, code, label }];
    return this;
  }
  blockWorkflow(code = "BLOCK_WORKFLOW", label = "Resolve blocking rule"): this {
    return this.nextAction(code, label, { blocking: true, order: 0, appliesOn: "FAILED" });
  }

  build(): Rule {
    if (!this.expression) throw new Error(`Rule ${this.value.id} must define a when expression`);
    const value = this.value as Rule;
    return { ...value, conditions: value.conditions ?? [], expression: this.expression };
  }
}

export function rule(id: string): RuleBuilder { return new RuleBuilder(id); }
