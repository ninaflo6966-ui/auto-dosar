import { documentsCatalog } from "./documents.catalog";

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
  sellerType: string;
  plateType: string;
}

export function buildInmatriculareDosar(
  data: InmatriculareInput
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

  documents.push(documentsCatalog.civ.name);
  documents.push(documentsCatalog.rca.name);

  forms.push("Cerere înmatriculare");

  taxes.push("Taxă certificat de înmatriculare");

  if (data.origin === "romania") {
    documents.push(documentsCatalog.document_proprietate.name);
  }

  if (data.origin === "ue") {
    documents.push(documentsCatalog.acte_straine.name);
    documents.push(documentsCatalog.certificat_rar.name);
  }

  if (data.origin === "non-ue") {
    documents.push(documentsCatalog.acte_straine.name);
    documents.push(documentsCatalog.documente_vamale.name);
    documents.push(documentsCatalog.certificat_rar.name);
    documents.push(documentsCatalog.traduceri.name);
  }

  if (data.vehicleCondition === "nou") {
    documents.push(documentsCatalog.factura.name);
  }

  if (data.vehicleCondition === "second-hand") {
    if (data.sellerType === "pf") {
      documents.push(documentsCatalog.contract_vc.name);
    }

    if (data.sellerType === "pj") {
      documents.push(documentsCatalog.factura.name);
    }
  }

  taxes.push("Contravaloare plăcuțe de înmatriculare");

  if (data.plateType === "preferentiale") {
    taxes.push("Rezervare număr preferențial");
  }

  return {
    documents,
    taxes,
    forms,
  };
}