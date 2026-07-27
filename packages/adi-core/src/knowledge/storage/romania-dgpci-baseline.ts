import type { DocumentDefinition, InstitutionDefinition, KnowledgePackage, OperationDefinition, RequirementDefinition } from "../entities/KnowledgeTypes";

const validity = { validFrom: "2026-01-01" as const };
const legal = [{
  id: "LEGAL-DGPCI-BASELINE",
  title: "Cerințe administrative DGPCI – referințe de completat și verificat",
  issuer: "AutoDosar Knowledge Team",
  note: "Pachet tehnic inițial. Referințele juridice exacte și cerințele locale trebuie validate înainte de producție.",
  verificationStatus: "NEEDS_REVIEW" as const,
}];
const institutions: InstitutionDefinition[] = [
  { id: "DGPCI", version: "1.0.0", status: "ACTIVE", type: "DGPCI", name: "Serviciul public comunitar regim permise și înmatriculare", jurisdiction: "COUNTY", services: ["REGISTRATION", "DEREGISTRATION", "TEMPORARY_AUTHORIZATION", "PLATES"], legalReferenceIds: ["LEGAL-DGPCI-BASELINE"], ...validity },
  { id: "DITL", version: "1.0.0", status: "ACTIVE", type: "DITL", name: "Direcția de impozite și taxe locale", jurisdiction: "LOCAL", services: ["FISCAL_REGISTRATION", "FISCAL_CLEARANCE"], legalReferenceIds: ["LEGAL-DGPCI-BASELINE"], ...validity },
  { id: "RAR", version: "1.0.0", status: "ACTIVE", type: "RAR", name: "Registrul Auto Român", jurisdiction: "NATIONAL", services: ["VEHICLE_IDENTITY", "AUTHENTICITY", "TECHNICAL_DATA"], legalReferenceIds: ["LEGAL-DGPCI-BASELINE"], ...validity },
  { id: "ANAF", version: "1.0.0", status: "ACTIVE", type: "ANAF", name: "Agenția Națională de Administrare Fiscală", jurisdiction: "NATIONAL", services: ["VAT_CERTIFICATE"], legalReferenceIds: ["LEGAL-DGPCI-BASELINE"], ...validity },
];
const doc=(id:string,name:string,category:DocumentDefinition["category"],fields:string[]=[]):DocumentDefinition=>({id,version:"1.0.0",status:"ACTIVE",name,category,acceptedFormats:["application/pdf","image/jpeg","image/png"],extractedFields:fields,legalReferenceIds:["LEGAL-DGPCI-BASELINE"],...validity});
const documents: DocumentDefinition[] = [
  doc("IDENTITY_DOCUMENT","Act de identitate","IDENTITY",["name","cnp","address","series","number","validUntil"]),
  doc("CIV","Cartea de identitate a vehiculului","VEHICLE",["vin","brand","model","civSeries"]),
  doc("REGISTRATION_CERTIFICATE","Certificatul de înmatriculare","VEHICLE",["registrationNumber","vin","owner"]),
  doc("OWNERSHIP_DOCUMENT","Actul de dobândire / proprietate","OWNERSHIP",["seller","buyer","vehicle","date"]),
  doc("RCA","Polița RCA valabilă","INSURANCE",["vin","insured","validFrom","validUntil"]),
  doc("FISCAL_EVIDENCE","Dovada înregistrării fiscale / document fiscal","FISCAL"),
  doc("PAYMENT_PROOF","Dovada plății taxelor aplicabile","PAYMENT"),
  doc("RAR_DOCUMENT","Document RAR aplicabil","VEHICLE"),
  doc("FOREIGN_REGISTRATION_DOCUMENTS","Documente străine de înmatriculare","VEHICLE"),
  doc("CUSTOMS_DOCUMENT","Document vamal, când este aplicabil","FISCAL"),
  doc("VAT_CERTIFICATE","Certificat privind TVA, când este aplicabil","FISCAL"),
  doc("POWER_OF_ATTORNEY","Împuternicire / procură","AUTHORIZATION"),
  doc("LOSS_THEFT_DAMAGE_DECLARATION","Declarație privind pierderea, furtul sau deteriorarea","OTHER"),
  doc("DEREGISTRATION_EVIDENCE","Document justificativ pentru radiere","OTHER"),
];
const req=(id:string,label:string,docs:string[],institutionId="DGPCI",level:RequirementDefinition["level"]="MANDATORY",conditions?:RequirementDefinition["conditions"],priority=10):RequirementDefinition=>({id,label,level,documentTypeIds:docs,institutionId,conditions,legalReferenceIds:["LEGAL-DGPCI-BASELINE"],explanation:label,priority});
const common=[req("REQ-ID","Identificarea solicitantului",["IDENTITY_DOCUMENT"],"DGPCI","MANDATORY",undefined,1),req("REQ-CIV","Identificarea vehiculului prin CIV",["CIV"],"DGPCI","MANDATORY",undefined,2),req("REQ-RCA","Existența unei polițe RCA aplicabile",["RCA"],"DGPCI","MANDATORY",undefined,4),req("REQ-REP","Dovada reprezentării",["POWER_OF_ATTORNEY"],"DGPCI","CONDITIONAL",[{path:"representedByProxy",operator:"EQUALS",value:true}],8)];
const op=(id:string,operationType:OperationDefinition["operationType"],name:string,requirements:RequirementDefinition[],variants:string[]=[]):OperationDefinition=>({id,version:"1.0.0",status:"ACTIVE",operationType,name,description:`Definiție declarativă inițială pentru ${name}.`,variants,institutionIds:["DGPCI","DITL","RAR","ANAF"],requirements,generatedDocumentTypeIds:[],legalReferenceIds:["LEGAL-DGPCI-BASELINE"],...validity});
const operations: OperationDefinition[] = [
  op("OP-TRANSCRIPTION","TRANSCRIPTION","Transcrierea transmiterii dreptului de proprietate",[...common,req("REQ-OWN","Actul de dobândire",["OWNERSHIP_DOCUMENT"],"DGPCI","MANDATORY",undefined,3),req("REQ-CERT","Certificatul anterior",["REGISTRATION_CERTIFICATE"],"DGPCI","MANDATORY",undefined,5),req("REQ-FISCAL","Formalități fiscale aplicabile",["FISCAL_EVIDENCE"],"DITL","MANDATORY",undefined,6),req("REQ-PAY","Plata tarifelor aplicabile",["PAYMENT_PROOF"],"DGPCI","MANDATORY",undefined,7)], ["PF_PF","PF_PJ","PJ_PF","PJ_PJ"]),
  op("OP-PERMANENT","PERMANENT_REGISTRATION","Înmatriculare definitivă",[...common,req("REQ-OWN-REG","Actul de dobândire",["OWNERSHIP_DOCUMENT"],"DGPCI","MANDATORY",undefined,3),req("REQ-RAR","Documente RAR aplicabile",["RAR_DOCUMENT"],"RAR","MANDATORY",undefined,5),req("REQ-FOREIGN","Documentele străine",["FOREIGN_REGISTRATION_DOCUMENTS"],"DGPCI","CONDITIONAL",[{path:"vehicle.origin",operator:"IN",value:["EU","NON_EU"]}],6),req("REQ-CUSTOMS","Document vamal",["CUSTOMS_DOCUMENT"],"ANAF","CONDITIONAL",[{path:"vehicle.origin",operator:"EQUALS",value:"NON_EU"}],7),req("REQ-VAT","Certificat TVA",["VAT_CERTIFICATE"],"ANAF","CONDITIONAL",[{path:"vehicle.origin",operator:"EQUALS",value:"EU"}],8),req("REQ-PAY-REG","Plata tarifelor aplicabile",["PAYMENT_PROOF"],"DGPCI","MANDATORY",undefined,9)], ["NEW_ROMANIA","NEW_EU","NEW_NON_EU","USED_EU","USED_NON_EU"]),
  op("OP-TEMP","TEMPORARY_AUTHORIZATION","Autorizație de circulație provizorie",[req("REQ-ID-TEMP","Identificarea solicitantului",["IDENTITY_DOCUMENT"]),req("REQ-OWN-TEMP","Dovada proprietății",["OWNERSHIP_DOCUMENT"]),req("REQ-RCA-TEMP","RCA aplicabilă perioadei",["RCA"]),req("REQ-VEH-TEMP","Documente de identificare ale vehiculului",["CIV","FOREIGN_REGISTRATION_DOCUMENTS"]),req("REQ-PAY-TEMP","Plata tarifelor aplicabile",["PAYMENT_PROOF"])]),
  op("OP-TEST","TEST_PLATES","Autorizație și numere pentru probe",[req("REQ-ID-TEST","Identificarea solicitantului",["IDENTITY_DOCUMENT"]),req("REQ-ORG-TEST","Documente justificative solicitant",["OWNERSHIP_DOCUMENT"]),req("REQ-RCA-TEST","Asigurare aplicabilă",["RCA"]),req("REQ-PAY-TEST","Plata tarifelor",["PAYMENT_PROOF"])]),
  op("OP-DEREG","DEREGISTRATION","Radiere din circulație",[req("REQ-ID-DEREG","Identificarea solicitantului",["IDENTITY_DOCUMENT"]),req("REQ-CERT-DEREG","Certificatul de înmatriculare",["REGISTRATION_CERTIFICATE"]),req("REQ-CIV-DEREG","CIV",["CIV"]),req("REQ-REASON","Dovada motivului radierii",["DEREGISTRATION_EVIDENCE"]),req("REQ-FISCAL-DEREG","Formalități fiscale",["FISCAL_EVIDENCE"],"DITL")], ["EXPORT","SCRAPPING","THEFT","ON_REQUEST"]),
  op("OP-MOD","DATA_MODIFICATION","Modificarea datelor din evidențe",[...common,req("REQ-CERT-MOD","Certificatul existent",["REGISTRATION_CERTIFICATE"]),req("REQ-PROOF-MOD","Documentul justificativ al modificării",["OWNERSHIP_DOCUMENT"]),req("REQ-PAY-MOD","Plata tarifelor aplicabile",["PAYMENT_PROOF"])], ["ADDRESS","NAME","COMPANY_NAME","TECHNICAL"]),
  op("OP-DUP-CERT","DUPLICATE_REGISTRATION_CERTIFICATE","Duplicat certificat de înmatriculare",[req("REQ-ID-DUP","Identificarea solicitantului",["IDENTITY_DOCUMENT"]),req("REQ-CIV-DUP","CIV",["CIV"]),req("REQ-DECL-DUP","Declarație / dovada situației",["LOSS_THEFT_DAMAGE_DECLARATION"]),req("REQ-RCA-DUP","RCA",["RCA"]),req("REQ-PAY-DUP","Plata tarifului",["PAYMENT_PROOF"])], ["LOST","STOLEN","DAMAGED"]),
];
export const ROMANIA_DGPCI_BASELINE: KnowledgePackage = {id:"RO-DGPCI",version:"1.0.0",status:"ACTIVE",jurisdiction:"RO",publisher:"AutoDosar",validFrom:"2026-01-01",operations,documents,institutions,legalSources:legal};
