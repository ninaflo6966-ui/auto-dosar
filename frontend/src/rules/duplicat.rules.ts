import { documentsCatalog } from "./documents.catalog";

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

export function buildDuplicatDosar(
  data: DuplicatInput
): RuleResult {
  const documents: string[] = [];
  const taxes: string[] = [];
  const forms: string[] = [];

  // PF / PJ

  if (data.personType === "pf") {
    documents.push(documentsCatalog.ci_pf.name);
  }

  if (data.personType === "pj") {
    documents.push(documentsCatalog.cui_pj.name);
    documents.push(documentsCatalog.ci_reprezentant.name);
  }

  // Împuternicit

  if (data.proxy === "da") {
    documents.push(documentsCatalog.imputernicire.name);
    documents.push(documentsCatalog.ci_imputernicit.name);
  }

  // Cerere

  documents.push("Cerere duplicat talon");

  // Motiv

  if (data.duplicateReason === "pierdut") {
    documents.push("Declarație pierdere talon");
  }

  if (data.duplicateReason === "furat") {
    documents.push(documentsCatalog.dovada_furt.name);
  }

  if (data.duplicateReason === "deteriorat") {
    documents.push("Talon deteriorat");
  }

  // Formulare

  forms.push(
    "Cerere duplicat certificat de înmatriculare"
  );

  // Taxe

  taxes.push(
    "Taxă duplicat certificat de înmatriculare"
  );

  return {
    documents,
    taxes,
    forms,
  };
}