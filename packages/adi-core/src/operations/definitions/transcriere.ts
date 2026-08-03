import { OperationType } from "../../enums/OperationType";
import type { OperationDefinition } from "../models/OperationDefinition";

export const transcriereOperation: OperationDefinition = {
  id: "dgpci.ownership-transfer",
  type: OperationType.OwnershipTransfer,
  slug: "transcriere-auto",
  title: "Transcrierea transmiterii dreptului de proprietate",
  shortTitle: "Transcriere auto",
  description: "Pregătirea dosarului pentru un vehicul deja înmatriculat în România, după schimbarea proprietarului.",
  category: "ownership",
  icon: "arrow-left-right",
  version: "1.0.0",
  active: true,
  estimatedMinutes: 5,
  rulePackId: "dgpci.transcriere.v1",
  workflowId: "dgpci.transcriere.standard",
  questions: [
    {
      id: "personType",
      type: "single-choice",
      label: "Solicitantul este persoană fizică sau persoană juridică?",
      required: true,
      order: 10,
      options: [
        { value: "pf", label: "Persoană fizică" },
        { value: "pj", label: "Persoană juridică" },
      ],
    },
    {
      id: "proxy",
      type: "single-choice",
      label: "Dosarul este depus prin împuternicit?",
      required: true,
      order: 20,
      options: [
        { value: "nu", label: "Nu" },
        { value: "da", label: "Da" },
      ],
    },
    {
      id: "sameCounty",
      type: "single-choice",
      label: "Noul proprietar are domiciliul sau sediul în același județ?",
      help: "Răspunsul stabilește dacă numărul de înmatriculare poate rămâne neschimbat.",
      required: true,
      order: 30,
      options: [
        { value: "da", label: "Da" },
        { value: "nu", label: "Nu" },
      ],
    },
    {
      id: "plateStaysOnCar",
      type: "single-choice",
      label: "Numărul de înmatriculare rămâne pe vehicul?",
      required: true,
      order: 40,
      visibleWhen: { questionId: "sameCounty", equals: "da" },
      options: [
        { value: "da", label: "Da" },
        { value: "nu", label: "Nu" },
      ],
    },
    {
      id: "plateType",
      type: "single-choice",
      label: "Ce tip de număr dorești?",
      required: true,
      order: 50,
      visibleWhen: [
        { questionId: "sameCounty", equals: "da" },
        { questionId: "plateStaysOnCar", equals: "nu" },
      ],
      options: [
        { value: "rand", label: "Număr la rând" },
        { value: "preferentiale", label: "Număr preferențial" },
      ],
    },
  ],
  documents: [
    { id: "ci_pf", title: "Actul de identitate al solicitantului", requirement: "conditional", visibleWhen: { questionId: "personType", equals: "pf" } },
    { id: "cui_pj", title: "Certificatul de înregistrare al persoanei juridice", requirement: "conditional", visibleWhen: { questionId: "personType", equals: "pj" } },
    { id: "certificat_onrc", title: "Certificat constatator ONRC", requirement: "conditional", visibleWhen: { questionId: "personType", equals: "pj" } },
    { id: "ci_reprezentant", title: "Actul de identitate al reprezentantului legal", requirement: "conditional", visibleWhen: { questionId: "personType", equals: "pj" } },
    { id: "imputernicire", title: "Împuternicire sau procură", requirement: "conditional", visibleWhen: { questionId: "proxy", equals: "da" } },
    { id: "ci_imputernicit", title: "Actul de identitate al împuternicitului", requirement: "conditional", visibleWhen: { questionId: "proxy", equals: "da" } },
    { id: "contract_vc", title: "Documentul care atestă dreptul de proprietate", requirement: "required" },
    { id: "civ", title: "Cartea de identitate a vehiculului (CIV)", requirement: "required", validationRuleIds: ["VIN_FORMAT"] },
    { id: "talon", title: "Certificatul de înmatriculare", requirement: "required" },
    { id: "rca", title: "Polița RCA valabilă", requirement: "required", validationRuleIds: ["RCA_VALIDITY"] },
    { id: "certificat_fiscal", title: "Dovada înregistrării la organul fiscal local", requirement: "required" },
  ],
  metadata: {
    authority: "DGPCI",
    country: "RO",
    mvp: true,
  },
};
