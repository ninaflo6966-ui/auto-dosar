export interface CaseFileMetadata {
  createdBy?: string;
  lastModifiedBy?: string;
  source?: "WEB" | "API" | "ADMIN" | "IMPORT";
  tags?: string[];
}
