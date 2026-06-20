export interface RuleResult {
  documents: string[];
  taxes: string[];
  forms: string[];
}

export interface TranscriereInput {
  personType: string;
  proxy: string;
  sameCounty: string;
  plateStaysOnCar: string;
  plateType: string;
}

export function buildTranscriereDosar(
  data: TranscriereInput
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

  documents.push("Contract vânzare-cumpărare");
  documents.push("Carte identitate vehicul");
  documents.push("Certificat de înmatriculare");
  documents.push("RCA");
  documents.push("Certificat fiscal");

  // formulare

  forms.push("Cerere transcriere");

  // taxe

  taxes.push("Certificat de înmatriculare");

  const needsNewPlates =
    data.sameCounty === "nu" ||
    data.plateStaysOnCar === "nu";

  if (needsNewPlates) {
    taxes.push("Plăcuțe de înmatriculare");

    if (data.plateType === "preferentiale") {
      taxes.push("Rezervare număr preferențial");
    }
  }

  return {
    documents,
    taxes,
    forms,
  };
}