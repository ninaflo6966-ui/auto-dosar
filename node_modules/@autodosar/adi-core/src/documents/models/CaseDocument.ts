import { DocumentSource } from "../enums/DocumentSource";
import { DocumentStatus } from "../enums/DocumentStatus";
import { DocumentType } from "../enums/DocumentType";

export interface CaseDocument {
  id: string;

  type: DocumentType;
  status: DocumentStatus;
  source: DocumentSource;

  /** ID-ul documentului din definiția operațiunii/checklist (ex. rca, civ). */
  operationDocumentId?: string;

  originalFileName?: string;
  mimeType?: string;
  fileSizeBytes?: number;
  storageKey?: string;
  checksumSha256?: string;
  pageCount?: number;

  confidence?: number;
  rawText?: string;
  parsedData?: unknown;

  createdAt: Date;
  updatedAt?: Date;
}