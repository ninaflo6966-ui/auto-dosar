import { documentsCatalog } from "./documents.catalog";

export interface RuleResult {
  documents: string[];
  taxes: string[];
  forms: string[];
}

export interface AutorizatieInput {
  personType: string;
  proxy: string;
  origin: string;
  temporaryAuthNumber: string;
}

export function buildAutorizatieDosar(
  data: AutorizatieInput
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

  documents.push(documentsCatalog.rca.name);

  if (data.origin === "romania") {
    documents.push(
      documentsCatalog.document_proprietate.name
    );
  }

  if (data.origin === "ue") {
    documents.push(
      documentsCatalog.document_proprietate.name
    );
    documents.push(
      documentsCatalog.acte_straine.name
    );
  }

  if (data.origin === "non-ue") {
    documents.push(
      documentsCatalog.document_proprietate.name
    );
    documents.push(
      documentsCatalog.acte_straine.name
    );
    documents.push(
      documentsCatalog.documente_vamale.name
    );
  }

  // Formular

  forms.push("Cerere autorizație provizorie");

  // Taxe

  taxes.push("Taxă autorizație provizorie");
  taxes.push("Contravaloare plăcuțe provizorii");

  // Număr autorizație

  switch (data.temporaryAuthNumber) {
    case "prima":
      documents.push(
        "Declarație pe proprie răspundere - prima autorizație"
      );
      break;

    case "a-doua":
      documents.push(
        "Declarație pe proprie răspundere - a doua autorizație"
      );
      break;

    case "a-treia":
      documents.push(
        "Declarație pe proprie răspundere - a treia autorizație"
      );
      break;
  }

  return {
    documents,
    taxes,
    forms,
  };
}