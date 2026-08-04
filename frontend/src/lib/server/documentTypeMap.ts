import { DocumentType } from "@autodosar/adi-core";

const documentTypes: Record<string, DocumentType> = {
  ci_pf: DocumentType.IdentityCard,
  cui_pj: DocumentType.CompanyRegistrationCertificate,
  certificat_onrc: DocumentType.TradeRegistryCertificate,
  ci_reprezentant: DocumentType.IdentityCard,
  imputernicire: DocumentType.PowerOfAttorney,
  ci_imputernicit: DocumentType.IdentityCard,
  contract_vc: DocumentType.ContractITL054,
  civ: DocumentType.CIV,
  talon: DocumentType.RegistrationCertificate,
  rca: DocumentType.RCA,
  certificat_fiscal: DocumentType.FiscalCertificate,
};

export function mapChecklistDocumentType(documentId: string): DocumentType {
  return documentTypes[documentId] ?? DocumentType.GeneratedApplication;
}
