import type { KnowledgePackage } from "../entities/KnowledgeTypes";

export class KnowledgeVersionService {
  select(packages: KnowledgePackage[], asOf: string): KnowledgePackage {
    const eligible = packages
      .filter((p) => p.status === "ACTIVE")
      .filter((p) => p.validFrom <= asOf && (!p.validUntil || p.validUntil >= asOf))
      .sort((a, b) => b.validFrom.localeCompare(a.validFrom) || b.version.localeCompare(a.version));
    if (!eligible[0]) throw new Error(`No active knowledge package for ${asOf}`);
    return eligible[0];
  }
}
