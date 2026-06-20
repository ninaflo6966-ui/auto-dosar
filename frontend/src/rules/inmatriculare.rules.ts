export interface RuleResult {
  documents: string[];
  taxes: string[];
  forms: string[];
}

export interface InmatriculareInput {
  personType: string;
  proxy: string;
  origin: string;
  vehicleCondition: string;
  plateType: string;
}

export function buildInmatriculareDosar(
  data: InmatriculareInput
): RuleResult {
  const documents: string[] = [];
  const taxes: string[] = [];
  const forms: string[] = [];

  // PF / PJ

  if (data.personType === "pf") {
    documents.push("Carte identitate proprietar");
  }

  if (data.personType === "pj") {
    documents.push("Certificat înregistrare firmă");
    documents.push("Certificat constatator ONRC");
    documents.push("Act identitate reprezentant legal");
  }

  // împuternicit

  if (data.proxy === "da") {
    documents.push("Împuternicire");
    documents.push("Act identitate împuternicit");
  }

  // documente comune

  documents.push("Carte identitate vehicul");
  documents.push("RCA");

  forms.push("Cerere înmatriculare");

  taxes.push("Certificat de înmatriculare");

  // origine

  if (data.origin === "romania") {
    documents.push("Document proprietate");
  }

  if (data.origin === "ue") {
    documents.push("Acte străine vehicul");
    documents.push("Certificat autenticitate RAR");
  }

  if (data.origin === "non-ue") {
    documents.push("Acte străine vehicul");
    documents.push("Documente vamale");
    documents.push("Certificat autenticitate RAR");
    documents.push("Traduceri autorizate");
  }

  // nou / SH

  if (data.vehicleCondition === "nou") {
    documents.push("Factură achiziție");
  }

  if (data.vehicleCondition === "second-hand") {
    documents.push("Contract vânzare-cumpărare");
  }

  // plăcuțe

  taxes.push("Plăcuțe de înmatriculare");

  if (data.plateType === "preferentiale") {
    taxes.push("Rezervare număr preferențial");
  }

  return {
    documents,
    taxes,
    forms,
  };
}