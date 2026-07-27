import type {
  OwnershipMode,
  SellerType,
} from "@/types/operation";

export type GeneratedDocumentDestination =
  | "LOCAL_TAX"
  | "DGPCI"
  | "BOTH";

export type GeneratedDocumentStatus =
  | "READY"
  | "WAITING_FOR_DATA"
  | "NOT_APPLICABLE";

export interface GeneratedDocument {
  id: string;
  title: string;
  description: string;
  destination: GeneratedDocumentDestination;
  status: GeneratedDocumentStatus;
  generatorId: string;
  requiredData: string[];
  previewAvailable: boolean;
  downloadableFiles: string[];
}

export interface GenerateCaseRequest {
  sellerType: SellerType;
  ownershipMode: OwnershipMode;
  documentTypes: string[];
}

export interface GenerateCaseResponse extends GenerateCaseRequest {
  caseReference: string;
  operation: string;
  receivedDocumentTypes: string[];
  generatedDocuments: GeneratedDocument[];
  warnings: string[];
  errors: string[];
  nextActions: string[];
  downloadableFiles: string[];
  generatedAt: string;
  message: string;
  error?: string;
}
