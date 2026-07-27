import type { UploadedFileInfo } from "@/components/documents/DocumentUploadCard";

export interface ChecklistItem {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  mandatory: boolean;
  blocking: boolean;
  recommendation?: string;
}

export interface CaseState {
  progress: number;
  currentStep: string;
  nextStep: string;
  score: number;
  readyForSubmission: boolean;
  checklist: ChecklistItem[];
}

export type SellerType = "PF" | "PJ";

export type OwnershipMode = "EXISTING" | "GENERATE";

export type DocumentSlotId =
  | "buyerIdentity"
  | "sellerIdentity"
  | "ownershipContract"
  | "invoice"
  | "civ"
  | "registrationCertificate"
  | "rca";

export interface UploadedCaseDocument extends UploadedFileInfo {
  type: string;
}

export type UploadedDocuments = Partial<
  Record<DocumentSlotId, UploadedCaseDocument | null>
>;

export interface DocumentSlot {
  id: DocumentSlotId;
  icon: string;
  title: string;
  description: string;
}

export interface ClassificationResponse {
  fileName: string;
  fileSize: number;
  mimeType: string;
  type: string;
  detectedType: string;
  confidence: number;
  matchedSignals: string[];
  error?: string;
}
