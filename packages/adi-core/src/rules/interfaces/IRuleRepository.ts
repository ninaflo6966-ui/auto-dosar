import type { Rule } from "../entities/Rule";
import type { RuleCategory } from "../entities/RuleCategory";

export interface RuleQuery {
  category?: RuleCategory;
  tags?: readonly string[];
  activeAt?: string;
}

export interface IRuleRepository {
  save(rule: Rule): Promise<void>;
  saveMany(rules: readonly Rule[]): Promise<void>;
  findById(id: string, version?: string): Promise<Rule | undefined>;
  findAll(query?: RuleQuery): Promise<readonly Rule[]>;
  remove(id: string, version?: string): Promise<number>;
}
