/**
 * AutoDosar Core Domain Model v1.0
 *
 * Aceste tipuri descriu realitatea administrativă și sunt independente de UI,
 * OCR, persistență sau un anumit flux instituțional.
 */

export type EntityId = string;
export type ISODate = string;
export type ISODateTime = string;

export type NaturalPersonRole =
  | "APPLICANT"
  | "BUYER"
  | "SELLER"
  | "OWNER"
  | "AUTHORIZED_PERSON"
  | "LEGAL_REPRESENTATIVE"
  | "DELEGATE";

export interface PostalAddress {
  countryCode: string;
  county?: string;
  locality: string;
  street?: string;
  number?: string;
  building?: string;
  entrance?: string;
  floor?: string;
  apartment?: string;
  postalCode?: string;
  fullText?: string;
}

export interface ContactDetails {
  email?: string;
  phone?: string;
}

export type IdentityDocumentKind = "CI" | "CIE" | "PASSPORT" | "OTHER";

export interface DomainIdentityDocument {
  id: EntityId;
  kind: IdentityDocumentKind;
  series?: string;
  number?: string;
  issuedBy?: string;
  issuedAt?: ISODate;
  validFrom?: ISODate;
  validUntil?: ISODate;
  domicileCertificateRequired?: boolean;
}

export interface DomainPerson {
  id: EntityId;
  kind: "NATURAL_PERSON";
  firstName: string;
  lastName: string;
  cnp?: string;
  birthDate?: ISODate;
  address?: PostalAddress;
  contact?: ContactDetails;
  identityDocument?: DomainIdentityDocument;
}

export interface DomainCompany {
  id: EntityId;
  kind: "LEGAL_PERSON";
  name: string;
  cui?: string;
  tradeRegisterNumber?: string;
  registeredOffice?: PostalAddress;
  contact?: ContactDetails;
  legalRepresentativeId?: EntityId;
}

export type DomainParty = DomainPerson | DomainCompany;

export interface CaseParty {
  partyId: EntityId;
  role: NaturalPersonRole;
  representedPartyId?: EntityId;
}

export type VehicleOrigin = "ROMANIA" | "EU" | "NON_EU" | "UNKNOWN";
export type VehicleCondition = "NEW" | "USED" | "UNKNOWN";

export interface DomainVehicle {
  id: EntityId;
  vin?: string;
  registrationNumber?: string;
  brand?: string;
  model?: string;
  commercialName?: string;
  category?: string;
  bodyType?: string;
  color?: string;
  fuelType?: string;
  engineCapacityCm3?: number;
  enginePowerKw?: number;
  emissionStandard?: string;
  firstRegistrationDate?: ISODate;
  manufactureYear?: number;
  civSeries?: string;
  engineSeries?: string;
  maximumMassKg?: number;
  seats?: number;
  origin: VehicleOrigin;
  condition: VehicleCondition;
}

export type DomainOperationType =
  | "TRANSCRIPTION"
  | "PERMANENT_REGISTRATION"
  | "TEMPORARY_AUTHORIZATION"
  | "TEST_PLATES"
  | "DEREGISTRATION"
  | "DATA_MODIFICATION"
  | "DUPLICATE_REGISTRATION_CERTIFICATE"
  | "DUPLICATE_PLATES"
  | "DUPLICATE_CIV";

export interface DomainOperation {
  id: EntityId;
  type: DomainOperationType;
  variant?: string;
  options: Record<string, string | number | boolean | null>;
}

export type InstitutionType = "DGPCI" | "DITL" | "RAR" | "ANAF" | "PAYMENT_PROVIDER" | "OTHER";

export interface DomainInstitution {
  id: EntityId;
  type: InstitutionType;
  name: string;
  county?: string;
  locality?: string;
}

export type DomainDocumentSource = "UPLOAD" | "GENERATED" | "INTEGRATION" | "MANUAL";
export type DomainDocumentStatus = "EXPECTED" | "UPLOADED" | "PROCESSING" | "VALID" | "INVALID" | "EXPIRED" | "SUPERSEDED";

export interface DomainDocument {
  id: EntityId;
  caseId: EntityId;
  type: string;
  source: DomainDocumentSource;
  status: DomainDocumentStatus;
  fileName?: string;
  storageKey?: string;
  issuedAt?: ISODate;
  validUntil?: ISODate;
  version: number;
  supersedesDocumentId?: EntityId;
  extractedData?: Record<string, unknown>;
}

export type PaymentStatus = "PENDING" | "AUTHORIZED" | "PAID" | "FAILED" | "REFUNDED";

export interface DomainPayment {
  id: EntityId;
  caseId: EntityId;
  purpose: string;
  amountMinor: number;
  currency: "RON" | string;
  status: PaymentStatus;
  provider?: string;
  externalReference?: string;
  paidAt?: ISODateTime;
}

export type ValidationSeverity = "INFO" | "WARNING" | "ERROR" | "BLOCKING";

export interface DomainValidationResult {
  id: EntityId;
  caseId: EntityId;
  ruleId: string;
  ruleVersion: string;
  passed: boolean;
  severity: ValidationSeverity;
  message: string;
  legalSourceIds: string[];
  evaluatedAt: ISODateTime;
}

export interface DomainGeneratedDocument {
  id: EntityId;
  caseId: EntityId;
  templateId: string;
  templateVersion: string;
  sourceTwinVersion: number;
  status: "DRAFT" | "FINAL" | "INVALIDATED";
  generatedAt: ISODateTime;
  storageKey?: string;
}

export interface DomainAuditEvent {
  id: EntityId;
  caseId?: EntityId;
  eventType: string;
  actorType: "USER" | "SYSTEM" | "INTEGRATION" | "ADMIN";
  actorId?: EntityId;
  occurredAt: ISODateTime;
  payload?: Record<string, unknown>;
}

export type DomainCaseStatus =
  | "DRAFT"
  | "DATA_COLLECTION"
  | "DOCUMENT_UPLOAD"
  | "DATA_REVIEW"
  | "CONTRACT_READY"
  | "DITL_PACKAGE_READY"
  | "DITL_CONFIRMED"
  | "DGPCI_PACKAGE_READY"
  | "READY_FOR_SUBMISSION"
  | "SUBMITTED"
  | "COMPLETED"
  | "CANCELLED";

export interface DomainCase {
  id: EntityId;
  referenceNumber: string;
  operationId: EntityId;
  vehicleId?: EntityId;
  parties: CaseParty[];
  status: DomainCaseStatus;
  createdAt: ISODateTime;
  updatedAt: ISODateTime;
}

/**
 * CaseTwin este proiecția coerentă și versionată a tuturor datelor cunoscute
 * despre dosar. Documentele generate și deciziile motoarelor folosesc această
 * proiecție, nu date disparate din interfață.
 */
export interface DomainCaseTwin {
  caseId: EntityId;
  version: number;
  case: DomainCase;
  operation: DomainOperation;
  vehicle?: DomainVehicle;
  parties: DomainParty[];
  documents: DomainDocument[];
  payments: DomainPayment[];
  validations: DomainValidationResult[];
  completenessScore: number;
  readyForSubmission: boolean;
  createdAt: ISODateTime;
}
