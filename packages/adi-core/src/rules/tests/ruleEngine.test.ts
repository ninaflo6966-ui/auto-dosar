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
  { id: "RULE-TRANSCRIPTION", version: "1.0.0", name: "Transcription", description: "Operation check", category: "WORKFLOW", severity: "ERROR", status: "ACTIVE", priority: 10,
    conditions: [{ path: "twin.operation.type", operator: "EQUALS", value: "TRANSCRIPTION" }], message: "Transcription selected", reason: "The rule applies to transcription." },
  { id: "RULE-RCA", version: "1.0.0", name: "RCA", description: "RCA required", category: "DOCUMENTS", severity: "WARNING", status: "ACTIVE", priority: 20,
    conditions: [{ path: "facts.rcaPresent", operator: "EQUALS", value: true }], message: "RCA is missing", reason: "An RCA policy is required.", recommendation: "Upload a valid RCA policy." },
];

async function run(): Promise<void> {
  const repository = new MemoryRuleRepository();
  await repository.saveMany(rules);
  const report = await new RuleEngine(repository).evaluate({ twin, correlationId: "corr-1", asOf: "2026-07-27", facts: { rcaPresent: false } });
  assert(report.results[0]?.ruleId === "RULE-TRANSCRIPTION", "rules must execute by priority");
  assert(report.summary.passedRules === 1, "one rule must pass");
  assert(report.summary.failedRules === 1, "one rule must fail");
  assert(report.summary.warnings === 1, "failed warning must be counted");
  assert(report.summary.confidenceScore === 50, "confidence score must reflect pass ratio");
  assert(report.recommendations[0] === "Upload a valid RCA policy.", "recommendation must be aggregated");
  console.log("ISSUE-004.1 Rule Engine Core tests passed");
}
void run();
