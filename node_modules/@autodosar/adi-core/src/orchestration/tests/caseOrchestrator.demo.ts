import { CaseOrchestrator } from "../services/CaseOrchestrator";
import { CaseStatus } from "../../enums/CaseStatus";
import { OperationType } from "../../enums/OperationType";

const caseFile = {
  id: "CASE-001",
  reference: "AD-2026-000001",
  operation: OperationType.OwnershipTransfer,
  status: CaseStatus.Validation,

  persons: [],
  companies: [],
  vehicles: [],
  documents: [],

  progress: {
    completedSteps: 3,
    totalSteps: 8,
    percent: 38,
    missingDocuments: ["RCA"],
    blockingErrors: ["RCA_NOT_ON_BUYER"],
  },

  timeline: [],

  createdAt: new Date(),
  updatedAt: new Date(),
};

const orchestrator = new CaseOrchestrator();
const state = orchestrator.getState(caseFile);

console.log(JSON.stringify(state, null, 2));