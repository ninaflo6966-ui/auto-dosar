import { documentsCatalog } from "./documents.catalog";

export interface RuleResult {
  documents: string[];
  taxes: string[];
  forms: string[];
}

export interface ModificareInput {
  personType: string;
  proxy: string;
  modificationType: string;
}

export function buildModificareDosar(
  data: ModificareInput
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

  // Documente de bază

  documents.push(documentsCatalog.talon.name);

  switch (data.modificationType) {
    case "domiciliu":
      documents.push(
        "Document justificativ schimbare domiciliu"
      );
      break;

    case "sediu":
      documents.push(
        "Document justificativ schimbare sediu"
      );
      break;

    case "nume":
      documents.push(
        "Document justificativ schimbare nume"
      );
      break;

    case "denumire-firma":
      documents.push(
        "Document justificativ schimbare denumire firmă"
      );
      break;

    case "tehnice":
      documents.push(
        "Document RAR / CIV actualizată"
      );
      documents.push(documentsCatalog.civ.name);
      break;
  }

  forms.push(
    "Cerere modificare date certificat de înmatriculare"
  );

  taxes.push(
    "Taxă certificat de înmatriculare"
  );

  return {
    documents,
    taxes,
    forms,
  };
}