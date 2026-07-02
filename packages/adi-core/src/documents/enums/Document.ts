import { DocumentSource } from "../enums/DocumentSource";
import { DocumentStatus } from "../enums/DocumentStatus";
import { DocumentType } from "../enums/DocumentType";

export interface Document {
  id: string;

  type: DocumentType;
  status: DocumentStatus;
  source: DocumentSource;

  originalFileName?: string;
  mimeType?: string;
  pageCount?: number;

  confidence?: number;
  rawText?: string;
  parsedData?: unknown;

  createdAt: Date;
  updatedAt?: Date;
}