import type { Rule } from "../entities/Rule";
import type { RuleCategory } from "../entities/RuleCategory";
import type { RulePack } from "./RulePack";

export class RuleRegistry {
  private readonly rules = new Map<string, Rule>();
  private key(rule: Pick<Rule, "id" | "version">): string { return `${rule.id}@${rule.version}`; }

  register(rule: Rule): this {
    const key = this.key(rule);
    if (this.rules.has(key)) throw new Error(`Rule ${key} is already registered`);
    this.rules.set(key, structuredClone(rule));
    return this;
  }
  registerMany(rules: readonly Rule[]): this { rules.forEach((item) => this.register(item)); return this; }
  registerPack(pack: RulePack): this { return this.registerMany(pack.rules); }
  unregister(id: string, version?: string): number {
    if (version) return this.rules.delete(`${id}@${version}`) ? 1 : 0;
    let count = 0;
    for (const key of [...this.rules.keys()]) if (key.startsWith(`${id}@`) && this.rules.delete(key)) count += 1;
    return count;
  }
  find(id: string, version?: string): Rule | undefined {
    const candidates = [...this.rules.values()].filter((item) => item.id === id && (!version || item.version === version)).sort((a, b) => b.version.localeCompare(a.version));
    return candidates[0] ? structuredClone(candidates[0]) : undefined;
  }
  findByCategory(category: RuleCategory): readonly Rule[] { return this.all().filter((item) => item.category === category); }
  findByTag(tag: string): readonly Rule[] { return this.all().filter((item) => item.tags?.includes(tag)); }
  findByOperation(operation: string): readonly Rule[] { return this.findByTag(`operation:${operation}`); }
  all(): readonly Rule[] { return [...this.rules.values()].sort((a, b) => a.priority - b.priority || a.id.localeCompare(b.id)).map((item) => structuredClone(item)); }
}
