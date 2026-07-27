import type { KnowledgePackage } from "../entities/KnowledgeTypes";

export interface KnowledgeValidationIssue {
  path: string;
  message: string;
  severity: "ERROR" | "WARNING";
}

export class KnowledgeValidationError extends Error {
  constructor(public readonly issues: KnowledgeValidationIssue[]) {
    super(`Knowledge package invalid: ${issues.length} issue(s)`);
  }
}

export class KnowledgeValidator {
  validate(pkg: KnowledgePackage): KnowledgeValidationIssue[] {
    const issues: KnowledgeValidationIssue[] = [];
    const ensureUnique = (items: { id: string }[], path: string) => {
      const seen = new Set<string>();
      for (const item of items) {
        if (seen.has(item.id)) issues.push({ path: `${path}.${item.id}`, message: "Duplicate id", severity: "ERROR" });
        seen.add(item.id);
      }
    };
    ensureUnique(pkg.operations, "operations");
    ensureUnique(pkg.documents, "documents");
    ensureUnique(pkg.institutions, "institutions");
    ensureUnique(pkg.legalSources, "legalSources");

    const docs = new Set(pkg.documents.map((x) => x.id));
    const inst = new Set(pkg.institutions.map((x) => x.id));
    const legal = new Set(pkg.legalSources.map((x) => x.id));
    for (const op of pkg.operations) {
      if (op.validUntil && op.validUntil < op.validFrom) issues.push({ path: `operations.${op.id}`, message: "Invalid validity interval", severity: "ERROR" });
      for (const institutionId of op.institutionIds) if (!inst.has(institutionId)) issues.push({ path: `operations.${op.id}.institutionIds`, message: `Unknown institution ${institutionId}`, severity: "ERROR" });
      for (const req of op.requirements) {
        if (!inst.has(req.institutionId)) issues.push({ path: `operations.${op.id}.requirements.${req.id}`, message: `Unknown institution ${req.institutionId}`, severity: "ERROR" });
        for (const id of req.documentTypeIds) if (!docs.has(id)) issues.push({ path: `operations.${op.id}.requirements.${req.id}`, message: `Unknown document ${id}`, severity: "ERROR" });
        for (const id of req.legalReferenceIds) if (!legal.has(id)) issues.push({ path: `operations.${op.id}.requirements.${req.id}`, message: `Unknown legal reference ${id}`, severity: "ERROR" });
      }
    }
    return issues;
  }

  assertValid(pkg: KnowledgePackage): void {
    const issues = this.validate(pkg).filter((x) => x.severity === "ERROR");
    if (issues.length) throw new KnowledgeValidationError(issues);
  }
}
