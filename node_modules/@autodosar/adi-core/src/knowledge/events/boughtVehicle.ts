import { UserJourneyEvent } from "../models/UserJourneyEvent";

export const BoughtVehicleEvent: UserJourneyEvent = {
  id: "BOUGHT_VEHICLE",
  title: "Am cumpărat un vehicul",
  description:
    "Parcursul utilizatorului care a cumpărat un vehicul și dorește să pregătească dosarul complet.",

  userGoal:
    "Utilizatorul trebuie să obțină rapid documentele corecte pentru declarare fiscală și transcriere.",

  traditionalDuration: "2-5 zile, în funcție de instituții și programări",
  autodosarTargetDuration: "5-15 minute pentru pregătirea digitală a dosarului",

  physicalTripsTarget: "ZERO",

  steps: [
    "introducere sau extragere date vânzător",
    "introducere sau extragere date cumpărător",
    "extragere date vehicul",
    "generare contract ITL-054, dacă este cazul",
    "verificare RCA pe cumpărător",
    "verificare VIN în toate documentele",
    "generare documente pentru impunere locală",
    "generare documente pentru transcriere",
    "pregătire pachet final de depunere",
  ],

  relatedOperations: [
    "CONTRACT_ITL_054",
    "LOCAL_TAX_REGISTRATION",
    "OWNERSHIP_TRANSFER",
  ],

  requiredDocuments: [
    "CI/CIE cumpărător",
    "CI vânzător",
    "CIV",
    "RCA pe cumpărător",
  ],

  generatedDocuments: [
    "Contract ITL-054",
    "Documente impunere locală",
    "Cerere DRPCIV",
    "Checklist dosar",
  ],

  validationRules: [
    "RCA_001",
    "VIN_001",
    "VIN_002",
  ],
};