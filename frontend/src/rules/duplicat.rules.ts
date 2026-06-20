export interface RuleResult {
  documents: string[];
  taxes: string[];
  forms: string[];
}

export interface DuplicatInput {
  personType: string;
  proxy: string;
  duplicateReason: string;
}

export function buildDuplicatDosar(data: DuplicatInput): RuleResult {
  const documents: string[] = [];
  const taxes: string[] = [];
  const forms: string[] = [];

  if (data.personType === "pf") {
    documents.push("Carte identitate solicitant");
  }

  if (data.personType === "pj") {
    documents.push("Certificat înregistrare firmă");
    documents.push("Act identitate reprezentant legal");
  }

  if (data.proxy === "da") {
    documents.push("Împuternicire");
    documents.push("Act identitate împuternicit");
  }

  documents.push("Cerere duplicat talon");

  if (data.duplicateReason === "pierdut") {
    documents.push("Declarație pierdere talon");
  }

  if (data.duplicateReason === "furat") {
    documents.push("Dovadă declarare furt");
  }

  if (data.duplicateReason === "deteriorat") {
    documents.push("Talon deteriorat");
  }

  forms.push("Cerere duplicat certificat înmatriculare");
  taxes.push("Taxă duplicat certificat înmatriculare");

  return { documents, taxes, forms };
}