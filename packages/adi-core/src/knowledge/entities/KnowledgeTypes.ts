import type { DomainOperationType, InstitutionType, ISODate } from "../../domain/CoreDomain";

export type KnowledgeStatus = "DRAFT" | "ACTIVE" | "RETIRED";
export type RequirementLevel = "MANDATORY" | "CONDITIONAL" | "OPTIONAL";
export type KnowledgeEntityKind = "OPERATION" | "DOCUMENT" | "INSTITUTION" | "LEGAL_SOURCE";

export interface KnowledgeValidity {
  validFrom: ISODate;
  validUntil?: ISODate;
}

export interface LegalReference {
  id: string;
  title: string;
  issuer?: string;
  article?: string;
  officialUrl?: string;
  note?: string;
  verificationStatus: "VERIFIED" | "NEEDS_REVIEW";
}

export interface DocumentDefinition extends KnowledgeValidity {
  id: string;
  version: string;
  status: KnowledgeStatus;
  name: string;
  category: "IDENTITY" | "VEHICLE" | "OWNERSHIP" | "FISCAL" | "INSURANCE" | "PAYMENT" | "AUTHORIZATION" | "OTHER";
  acceptedFormats: string[];
  extractedFields?: string[];
  legalReferenceIds: string[];
}

export interface InstitutionDefinition extends KnowledgeValidity {
  id: string;
  version: string;
  status: KnowledgeStatus;
  type: InstitutionType;
  name: string;
  jurisdiction: "NATIONAL" | "COUNTY" | "LOCAL";
  services: string[];
  legalReferenceIds: string[];
}

export interface RequirementCondition {
  path: string;
  operator: "EQUALS" | "NOT_EQUALS" | "IN" | "EXISTS" | "NOT_EXISTS";
  value?: unknown;
}

export interface RequirementDefinition {
  id: string;
  label: string;
  level: RequirementLevel;
  documentTypeIds: string[];
  institutionId: string;
  conditions?: RequirementCondition[];
  legalReferenceIds: string[];
  explanation: string;
  priority: number;
}

export interface OperationDefinition extends KnowledgeValidity {
  id: string;
  version: string;
  status: KnowledgeStatus;
  operationType: DomainOperationType;
  name: string;
  description: string;
  variants: string[];
  institutionIds: string[];
  requirements: RequirementDefinition[];
  generatedDocumentTypeIds: string[];
  legalReferenceIds: string[];
}

export interface KnowledgePackage extends KnowledgeValidity {
  id: string;
  version: string;
  status: KnowledgeStatus;
  jurisdiction: string;
  publisher: string;
  publishedAt?: ISODate;
  operations: OperationDefinition[];
  documents: DocumentDefinition[];
  institutions: InstitutionDefinition[];
  legalSources: LegalReference[];
}

export interface KnowledgeContext {
  asOf: ISODate;
  jurisdiction?: string;
  operationType?: DomainOperationType;
  variant?: string;
  facts?: Record<string, unknown>;
}

export interface ResolvedRequirement extends RequirementDefinition {
  applies: boolean;
  conditionTrace: string[];
}

export interface KnowledgeResolution {
  packageId: string;
  packageVersion: string;
  operation: OperationDefinition;
  requirements: ResolvedRequirement[];
  documents: DocumentDefinition[];
  institutions: InstitutionDefinition[];
  legalSources: LegalReference[];
}
