export type PersonType = "PF" | "PJ";

export interface IdentityDocument {
  type: "CI" | "CIE" | "PASSPORT";
  series?: string;
  number?: string;
  issuedBy?: string;
  validFrom?: string;
  validUntil?: string;
}

export interface Person {
  id?: string;
  type: PersonType;

  lastName?: string;
  firstName?: string;

  companyName?: string;
  cnp?: string;
  cui?: string;

  address?: string;
  email?: string;
  phone?: string;

  identityDocument?: IdentityDocument;
}