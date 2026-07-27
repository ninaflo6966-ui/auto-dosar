import type { KnowledgePackage, KnowledgeStatus } from "../entities/KnowledgeTypes";
import type { IKnowledgeRepository } from "./IKnowledgeRepository";

export class InMemoryKnowledgeRepository implements IKnowledgeRepository {
  private readonly packages = new Map<string, KnowledgePackage>();

  async save(pkg: KnowledgePackage): Promise<void> {
    this.packages.set(`${pkg.id}@${pkg.version}`, structuredClone(pkg));
  }

  async getById(id: string, version?: string): Promise<KnowledgePackage | undefined> {
    if (version) {
      const found = this.packages.get(`${id}@${version}`);
      return found ? structuredClone(found) : undefined;
    }
    const matches = [...this.packages.values()].filter((p) => p.id === id);
    const found = matches.sort((a, b) => b.version.localeCompare(a.version))[0];
    return found ? structuredClone(found) : undefined;
  }

  async list(status?: KnowledgeStatus): Promise<KnowledgePackage[]> {
    return [...this.packages.values()]
      .filter((p) => !status || p.status === status)
      .map((p) => structuredClone(p));
  }

  async findActive(asOf: string, jurisdiction?: string): Promise<KnowledgePackage[]> {
    return [...this.packages.values()]
      .filter((p) => p.status === "ACTIVE")
      .filter((p) => !jurisdiction || p.jurisdiction === jurisdiction)
      .filter((p) => p.validFrom <= asOf && (!p.validUntil || p.validUntil >= asOf))
      .map((p) => structuredClone(p));
  }
}
