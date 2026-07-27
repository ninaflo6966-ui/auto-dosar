import type { DomainOperationType } from "../../domain/CoreDomain";
import type { IKnowledgeRepository } from "../repository/IKnowledgeRepository";
import type { KnowledgeContext, KnowledgePackage, KnowledgeResolution } from "../entities/KnowledgeTypes";
import { KnowledgeVersionService } from "./KnowledgeVersionService";
import { RequirementResolver } from "./RequirementResolver";
import { KnowledgeValidator } from "../validators/KnowledgeValidator";

export class KnowledgeEngine {
  constructor(
    private readonly repository: IKnowledgeRepository,
    private readonly versions = new KnowledgeVersionService(),
    private readonly requirements = new RequirementResolver(),
    private readonly validator = new KnowledgeValidator(),
  ) {}

  async publish(pkg: KnowledgePackage): Promise<void> {
    this.validator.assertValid(pkg);
    await this.repository.save(pkg);
  }

  async resolve(context: KnowledgeContext & { operationType: DomainOperationType }): Promise<KnowledgeResolution> {
    const candidates = await this.repository.findActive(context.asOf, context.jurisdiction);
    const pkg = this.versions.select(candidates, context.asOf);
    const operation = pkg.operations.find((op) =>
      op.operationType === context.operationType &&
      op.status === "ACTIVE" &&
      op.validFrom <= context.asOf &&
      (!op.validUntil || op.validUntil >= context.asOf) &&
      (!context.variant || op.variants.length === 0 || op.variants.includes(context.variant)));
    if (!operation) throw new Error(`Operation ${context.operationType} not found for ${context.asOf}`);

    const resolved = this.requirements.resolve(operation.requirements, context.facts);
    const documentIds = new Set(resolved.flatMap((r) => r.documentTypeIds));
    const institutionIds = new Set(operation.institutionIds);
    const legalIds = new Set([...operation.legalReferenceIds, ...resolved.flatMap((r) => r.legalReferenceIds)]);
    return {
      packageId: pkg.id,
      packageVersion: pkg.version,
      operation: structuredClone(operation),
      requirements: resolved,
      documents: pkg.documents.filter((d) => documentIds.has(d.id)).map((d) => structuredClone(d)),
      institutions: pkg.institutions.filter((i) => institutionIds.has(i.id)).map((i) => structuredClone(i)),
      legalSources: pkg.legalSources.filter((l) => legalIds.has(l.id)).map((l) => structuredClone(l)),
    };
  }
}
