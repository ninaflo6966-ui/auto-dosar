import type { CaseStatus } from "../../enums/CaseStatus";
import type { OperationType } from "../../enums/OperationType";

export interface CaseFileProjection {
  caseId: string;
  reference: string;
  operation: OperationType;
  operationSlug?: string;
  status: CaseStatus;
  score: number;
  version: number;
  createdAt: Date;
  updatedAt: Date;
}
