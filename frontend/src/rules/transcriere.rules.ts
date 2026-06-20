import { documentsCatalog } from "./documents.catalog";

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

  if (data.personType === "pf") {
    documents.push(documentsCatalog.ci_pf.name);
  }

  if (data.personType === "pj") {
    documents.push(documentsCatalog.cui_pj.name);
    documents.push(documentsCatalog.certificat_onrc.name);
    documents.push(documentsCatalog.ci_reprezentant.name);
  }

  if (data.proxy === "da") {
    documents.push(documentsCatalog.imputernicire.name);
    documents.push(documentsCatalog.ci_imputernicit.name);
  }

  documents.push(documentsCatalog.contract_vc.name);
  documents.push(documentsCatalog.civ.name);
  documents.push(documentsCatalog.talon.name);
  documents.push(documentsCatalog.rca.name);
  documents.push(documentsCatalog.certificat_fiscal.name);

  forms.push("Cerere transcriere");

  taxes.push("Taxă certificat de înmatriculare");

  const needsNewPlates =
    data.sameCounty === "nu" ||
    data.plateStaysOnCar === "nu";

  if (needsNewPlates) {
    taxes.push("Contravaloare plăcuțe de înmatriculare");

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