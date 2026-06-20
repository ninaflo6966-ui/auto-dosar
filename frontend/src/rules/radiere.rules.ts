export interface RuleResult {
  documents: string[];
  taxes: string[];
  forms: string[];
}

export interface RadiereInput {
  personType: string;
  proxy: string;
  reason: string;
}

export function buildRadiereDosar(
  data: RadiereInput
): RuleResult {
  const documents: string[] = [];
  const taxes: string[] = [];
  const forms: string[] = [];

  if (data.personType === "pf") {
    documents.push("Carte identitate");
  }

  if (data.personType === "pj") {
    documents.push("Certificat înregistrare firmă");
    documents.push("Act identitate reprezentant legal");
  }

  if (data.proxy === "da") {
    documents.push("Împuternicire");
    documents.push("Act identitate împuternicit");
  }

  documents.push("Certificat de înmatriculare");
  documents.push("Cartea de identitate a vehiculului");

  forms.push("Cerere radiere");

  switch (data.reason) {
    case "export":
      documents.push("Document justificativ export");
      break;

    case "casare":
      documents.push("Certificat distrugere");
      break;

    case "furt":
      documents.push("Dovadă declarare furt");
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