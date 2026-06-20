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

export function buildAutorizatieDosar(data: AutorizatieInput): RuleResult {
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

  documents.push("Document proprietate");
  documents.push("RCA provizorie");

  if (data.origin === "ue") {
    documents.push("Acte străine vehicul");
  }

  if (data.origin === "non-ue") {
    documents.push("Acte străine vehicul");
    documents.push("Documente vamale");
  }

  forms.push("Cerere autorizare provizorie");
  taxes.push("Taxă autorizație provizorie");
  taxes.push("Taxă plăcuțe provizorii");

  return { documents, taxes, forms };
}