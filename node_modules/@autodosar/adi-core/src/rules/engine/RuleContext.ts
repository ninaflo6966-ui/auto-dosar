import type { DomainOperationType } from "../../domain/CoreDomain";
import type { KnowledgePackage } from "../../knowledge";
import type { DigitalCaseTwin } from "../../twin";

export interface RuleContextMetadata {
  actorId?: string;
  source?: string;
  changedPaths?: readonly string[];
  [key: string]: unknown;
}

export interface RuleContext {
  twin: DigitalCaseTwin;
  knowledgePackage?: KnowledgePackage;
  operationType?: DomainOperationType;
  correlationId: string;
  asOf?: string;
  facts?: Readonly<Record<string, unknown>>;
  metadata?: Readonly<RuleContextMetadata>;
}
