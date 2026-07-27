export * from "./enums";

export * from "./identity";
export * from "./validation";
export * from "./documents";
export * from "./vehicle";
export * from "./case-file";
export * from "./knowledge";
export * from "./orchestration";
export * from "./checklist";
export * from "./twin";
export * from "./events";
export * from "./document-intelligence";
export * from "./document-generation";

// Canonical Core Domain Model v1.0. Exportat ca namespace pentru a evita
// coliziunile temporare cu modelele legacy, până la migrarea acestora.
export * as Domain from "./domain";

export * from "./rules";
