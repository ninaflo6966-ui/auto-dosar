import type { KnowledgePackage, KnowledgeStatus } from "../entities/KnowledgeTypes";

export interface IKnowledgeRepository {
  save(pkg: KnowledgePackage): Promise<void>;
  getById(id: string, version?: string): Promise<KnowledgePackage | undefined>;
  list(status?: KnowledgeStatus): Promise<KnowledgePackage[]>;
  findActive(asOf: string, jurisdiction?: string): Promise<KnowledgePackage[]>;
}
