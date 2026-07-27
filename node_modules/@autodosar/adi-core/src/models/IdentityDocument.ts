import { IdentityDocumentType } from "../enums/IdentityDocumentType";

export interface IdentityDocument {
  type: IdentityDocumentType;

  series?: string;
  number?: string;

  issuedBy?: string;
  issuedAt?: string;

  validFrom?: string;
  validUntil?: string;

  domicileCertificateRequired?: boolean;
}