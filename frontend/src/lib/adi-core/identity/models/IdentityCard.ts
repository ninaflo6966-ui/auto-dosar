import { IdentityDocumentType } from "../../enums/IdentityDocumentType";

export interface IdentityCard {
  documentType: IdentityDocumentType;

  series?: string;
  number?: string;

  cnp?: string;

  lastName?: string;
  firstName?: string;

  address?: string;

  issuingAuthority?: string;
  issuedAt?: string;

  validFrom?: string;
  validUntil?: string;

  confidence?: number;

  rawText?: string;
}