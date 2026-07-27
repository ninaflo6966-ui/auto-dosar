import type { DigitalCaseTwin } from "../../twin";
import type { Rule } from "../entities/Rule";
import { RuleEngine } from "../engine/RuleEngine";
import { MemoryRuleRepository } from "../repository/MemoryRuleRepository";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(`Assertion failed: ${message}`);
}

const twin = {
  id: "twin-1", caseId: "case-1", version: 2, status: "DRAFT", createdAt: "2026-07-27T10:00:00.000Z", updatedAt: "2026-07-27T10:00:00.000Z",
  operation: { id: "op-1", type: "TRANSCRIPTION", options: {} }, parties: [], entities: [], documents: [], payments: [], appointments: [], generatedDocuments: [],
  metadata: { schemaVersion: "1.0", lastChangeSource: "USER_INPUT", lastChangeReason: "test", lastActor: { type: "USER", id: "u-1" }, updatedAt: "2026-07-27T10:00:00.000Z" }, auditTrail: [],
} as unknown as DigitalCaseTwin;

const rules: Rule[] = [
  { id: "DGPCI.REG.TRANSCRIERE.001", version: "1.0.0", name: "Transcription", description: "Operation check", category: "WORKFLOW", severity: "ERROR", status: "ACTIVE", priority: 10,
    conditions: [{ path: "twin.operation.type", operator: "EQUALS", value: "TRANSCRIPTION", description: "Selected operation is transcription" }], message: "Transcription selected", reason: "The rule applies to transcription.",
    explanation: { title: "Operation is eligible", passedDescription: "The selected operation is transcription." } },
  { id: "DGPCI.REG.TRANSCRIERE.002", version: "1.0.0", name: "RCA", description: "RCA required", category: "DOCUMENTS", severity: "CRITICAL", status: "ACTIVE", priority: 20,
    conditions: [{ path: "facts.rcaPresent", operator: "EQUALS", value: true, description: "A valid RCA policy is present" }], message: "RCA is missing", reason: "An RCA policy is required.", recommendation: "Upload a valid RCA policy.",
    explanation: { title: "RCA policy is required", failedDescription: "The file cannot continue because the RCA policy is missing." },
    recommendations: [{ id: "REC-RCA", priority: "CRITICAL", action: "Upload a valid RCA policy.", description: "The policy must be valid on the submission date.", estimatedImpact: "Removes a critical dossier blocker." }],
    nextActions: [{ code: "UPLOAD_RCA", label: "Upload RCA policy", order: 1, blocking: true, description: "Attach the valid policy to the dossier." }],
    legalReferences: [{ id: "LEGAL-RCA", title: "RCA legal source", verificationStatus: "NEEDS_REVIEW" }] },
];

async function run(): Promise<void> {
  const repository = new MemoryRuleRepository();
  await repository.saveMany(rules);
  const report = await new RuleEngine(repository).evaluate({ twin, correlationId: "corr-1", asOf: "2026-07-27", facts: { rcaPresent: false } });
  assert(report.results[0]?.ruleId === "DGPCI.REG.TRANSCRIERE.001", "rules must execute by priority");
  assert(report.summary.passedRules === 1, "one rule must pass");
  assert(report.summary.failedRules === 1, "one rule must fail");
  assert(report.summary.criticalFailures === 1, "critical failure must be counted");
  assert(report.summary.completenessScore === 50, "completeness score must reflect pass ratio");
  assert(report.summary.blockingActions === 1, "blocking actions must be counted");
  assert(report.recommendations[0] === "Upload a valid RCA policy.", "legacy recommendation view must be preserved");
  assert(report.detailedRecommendations[0]?.priority === "CRITICAL", "structured recommendation must preserve priority");
  assert(report.actionPlan[0]?.code === "UPLOAD_RCA", "action plan must expose the next action");
  assert(report.actionPlan[0]?.blocking === true, "action plan must preserve blocking state");

  const failed = report.results.find((result) => result.ruleId === "DGPCI.REG.TRANSCRIERE.002");
  assert(failed?.explanation.title === "RCA policy is required", "custom explanation title must be generated");
  assert(failed?.explanation.confidence === 0, "failed single-condition rule must have zero condition confidence");
  assert(failed?.trace.evaluatedConditions === 1, "trace must count evaluated conditions");
  assert(failed?.trace.failedConditions === 1, "trace must count failed conditions");
  assert(failed?.trace.evaluationPath[0]?.description === "A valid RCA policy is present", "trace must preserve condition description");
  assert(failed?.legalReferences[0]?.id === "LEGAL-RCA", "legal references must be preserved");

  console.log("ISSUE-004.2 Explainable Rule System tests passed");
}
void run();
