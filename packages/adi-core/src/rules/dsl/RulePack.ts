import type { Rule } from "../entities/Rule";

export interface RulePackManifest {
  id: string;
  version: string;
  name: string;
  description?: string;
  owner?: string;
  tags?: readonly string[];
}

export interface RulePack {
  manifest: RulePackManifest;
  rules: readonly Rule[];
}

export function rulePack(manifest: RulePackManifest, rules: readonly Rule[]): RulePack {
  const identities = new Set<string>();
  for (const rule of rules) {
    const identity = `${rule.id}@${rule.version}`;
    if (identities.has(identity)) throw new Error(`Duplicate rule ${identity} in pack ${manifest.id}`);
    identities.add(identity);
  }
  return { manifest: structuredClone(manifest), rules: rules.map((rule) => structuredClone(rule)) };
}
