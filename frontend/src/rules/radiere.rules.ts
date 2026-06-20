import { documentsCatalog } from "./documents.catalog";

export interface RuleResult {
  documents: string[];
  taxes: string[];
  forms: string[];
}

export interface RadiereInput {
  personType: string;
  proxy: string;
  reason: string;
  ownerKeepsPlateCombination: string;
}

export function buildRadiereDosar(
  data: RadiereInput
): RuleResult {
  const documents: string[] = [];
  const taxes: string[] = [];
  const forms: string[] = [];

  if (data.personType === "pf") {
    documents.push(documentsCatalog.ci_pf.name);
  }

  if (data.personType === "pj") {
    documents.push(documentsCatalog.cui_pj.name);
    documents.push(documentsCatalog.ci_reprezentant.name);
  }

  if (data.proxy === "da") {
    documents.push(documentsCatalog.imputernicire.name);
    documents.push(documentsCatalog.ci_imputernicit.name);
  }

  documents.push(documentsCatalog.talon.name);
  documents.push(documentsCatalog.civ.name);

  forms.push("Cerere radiere");

  if (data.ownerKeepsPlateCombination === "da") {
    forms.push("Cerere păstrare număr");
  }

  switch (data.reason) {
    case "export":
      documents.push("Document justificativ export");
      break;

    case "casare":
      documents.push("Certificat de distrugere / casare");
      break;

    case "furt":
      documents.push(documentsCatalog.dovada_furt.name);
      break;

    case "la-cerere":
      break;
  }

  return {
    documents,
    taxes,
    forms,
  };
}
