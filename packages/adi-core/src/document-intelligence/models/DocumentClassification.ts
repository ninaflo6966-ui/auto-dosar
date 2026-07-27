import { DocumentType } from "../../documents/enums/DocumentType";

export interface DocumentClassification {
  type: DocumentType;
  confidence: number;
  matchedSignals: string[];
}