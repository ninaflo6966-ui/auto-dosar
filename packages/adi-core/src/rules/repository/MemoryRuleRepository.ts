import type { Rule } from "../entities/Rule";
import type { IRuleRepository, RuleQuery } from "../interfaces/IRuleRepository";

export class MemoryRuleRepository implements IRuleRepository {
  private readonly rules = new Map<string, Rule>();
  private key(id: string, version: string): string { return `${id}@${version}`; }

  async save(rule: Rule): Promise<void> { this.rules.set(this.key(rule.id, rule.version), structuredClone(rule)); }
  async saveMany(rules: readonly Rule[]): Promise<void> { for (const rule of rules) await this.save(rule); }

  async findById(id: string, version?: string): Promise<Rule | undefined> {
    if (version) return this.clone(this.rules.get(this.key(id, version)));
    const candidates = [...this.rules.values()].filter((rule) => rule.id === id).sort((a, b) => b.version.localeCompare(a.version));
    return this.clone(candidates[0]);
  }

  async findAll(query: RuleQuery = {}): Promise<readonly Rule[]> {
    const activeAt = query.activeAt ? Date.parse(query.activeAt) : undefined;
    return [...this.rules.values()]
      .filter((rule) => rule.status === "ACTIVE")
      .filter((rule) => !query.category || rule.category === query.category)
      .filter((rule) => !query.tags?.length || query.tags.every((tag) => rule.tags?.includes(tag)))
      .filter((rule) => activeAt === undefined || this.isValidAt(rule, activeAt))
      .sort((a, b) => a.priority - b.priority || a.id.localeCompare(b.id))
      .map((rule) => structuredClone(rule));
  }

  async remove(id: string, version?: string): Promise<number> {
    if (version) return this.rules.delete(this.key(id, version)) ? 1 : 0;
    let removed = 0;
    for (const key of [...this.rules.keys()]) if (key.startsWith(`${id}@`) && this.rules.delete(key)) removed += 1;
    return removed;
  }

  private clone(rule?: Rule): Rule | undefined { return rule ? structuredClone(rule) : undefined; }
  private isValidAt(rule: Rule, timestamp: number): boolean {
    const from = rule.validFrom ? Date.parse(rule.validFrom) : Number.NEGATIVE_INFINITY;
    const until = rule.validUntil ? Date.parse(rule.validUntil) : Number.POSITIVE_INFINITY;
    return from <= timestamp && timestamp <= until;
  }
}
