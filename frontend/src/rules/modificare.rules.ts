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

export function buildModificareDosar(data: ModificareInput): RuleResult {
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

  documents.push("Certificat de înmatriculare vechi");
  documents.push("Carte identitate vehicul, dacă este cazul");

  switch (data.modificationType) {
    case "domiciliu":
      documents.push("Document justificativ schimbare domiciliu");
      break;

    case "sediu":
      documents.push("Document justificativ schimbare sediu");
      break;

    case "nume":
      documents.push("Document justificativ schimbare nume");
      break;

    case "denumire-firma":
      documents.push("Document justificativ schimbare denumire firmă");
      break;

    case "tehnice":
      documents.push("Document RAR / CIV actualizată");
      break;
  }

  forms.push("Cerere modificare date certificat înmatriculare");
  taxes.push("Taxă certificat de înmatriculare");

  return { documents, taxes, forms };
}