import { ValidationProfile } from "../models/ValidationProfile";

export const TranscriereValidationProfile: ValidationProfile = {
  id: "PROFILE_TRANSCRIERE_001",
  name: "Profil validare transcriere",
  description:
    "Profilul de validare pentru operațiunea de transcriere a dreptului de proprietate asupra vehiculului.",
  operationType: "OWNERSHIP_TRANSFER",
  ruleIds: [
    "RCA_001",
    "VIN_001",
    "VIN_002",
  ],
};