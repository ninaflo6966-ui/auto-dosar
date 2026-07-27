export * from "./entities/KnowledgeTypes";
export * from "./repository/IKnowledgeRepository";
export * from "./repository/InMemoryKnowledgeRepository";
export * from "./loaders/JsonKnowledgeLoader";
export * from "./validators/KnowledgeValidator";
export * from "./services/KnowledgeEngine";
export * from "./services/KnowledgeVersionService";
export * from "./services/RequirementResolver";
export * from "./storage/romania-dgpci-baseline";

// Legacy exports retained during migration.
export * from "./models/UserJourneyEvent";
export * from "./events/boughtVehicle";
