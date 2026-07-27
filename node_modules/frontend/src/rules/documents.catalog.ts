export type DocumentDefinition = {
  id: string;
  name: string;
  description?: string;
  mandatory: boolean;
};

export const documentsCatalog: Record<string, DocumentDefinition> = {
  ci_pf: {
    id: "ci_pf",
    name: "Carte identitate solicitant",
    mandatory: true,
  },

  cui_pj: {
    id: "cui_pj",
    name: "Certificat de înregistrare firmă / CUI",
    mandatory: true,
  },

  certificat_onrc: {
    id: "certificat_onrc",
    name: "Certificat constatator ONRC",
    mandatory: true,
  },

  ci_reprezentant: {
    id: "ci_reprezentant",
    name: "Act identitate reprezentant legal",
    mandatory: true,
  },

  imputernicire: {
    id: "imputernicire",
    name: "Împuternicire / procură",
    mandatory: true,
  },

  ci_imputernicit: {
    id: "ci_imputernicit",
    name: "Act identitate împuternicit",
    mandatory: true,
  },

  contract_vc: {
    id: "contract_vc",
    name: "Contract vânzare-cumpărare",
    mandatory: true,
  },

  civ: {
    id: "civ",
    name: "Carte identitate vehicul (CIV)",
    mandatory: true,
  },

  talon: {
    id: "talon",
    name: "Certificat de înmatriculare / talon",
    mandatory: true,
  },

  rca: {
    id: "rca",
    name: "RCA valabil",
    mandatory: true,
  },

  certificat_fiscal: {
    id: "certificat_fiscal",
    name: "Certificat fiscal de la taxe și impozite locale",
    mandatory: true,
  },

  dovada_furt: {
    id: "dovada_furt",
    name: "Dovadă declarare furt",
    mandatory: true,
  },

  document_proprietate: {
  id: "document_proprietate",
  name: "Document proprietate vehicul",
  mandatory: true,
},

acte_straine: {
  id: "acte_straine",
  name: "Acte străine vehicul",
  mandatory: true,
},

certificat_rar: {
  id: "certificat_rar",
  name: "Certificat autenticitate RAR",
  mandatory: true,
},

documente_vamale: {
  id: "documente_vamale",
  name: "Documente vamale",
  mandatory: true,
},

traduceri: {
  id: "traduceri",
  name: "Traduceri autorizate",
  mandatory: true,
},

factura: {
  id: "factura",
  name: "Factură achiziție",
  mandatory: true,
},
};