import type { DigitalCaseTwin } from "../../twin";
import { RuleEngine } from "../engine/RuleEngine";
import { MemoryRuleRepository } from "../repository/MemoryRuleRepository";
import { allOf, anyOf, applicant, document, not, operation, proxy, rule, rulePack, RuleRegistry, vehicle, ExpressionSerializer } from "../dsl";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(`Assertion failed: ${message}`);
}

const twin = {
  id: "twin-dsl", caseId: "case-dsl", version: 1, status: "DRAFT",
  case: { id: "case-dsl", referenceNumber: "AD-1", operationId: "op-1", parties: [{ partyId: "p-1", role: "APPLICANT" }], status: "DRAFT", createdAt: "2026-07-29T00:00:00.000Z", updatedAt: "2026-07-29T00:00:00.000Z" },
  operation: { id: "op-1", type: "TRANSCRIPTION", options: {} },
  vehicle: { id: "v-1", origin: "EU", condition: "USED" },
  parties: [{ id: "p-1", kind: "NATURAL_PERSON", firstName: "Ana", lastName: "Pop" }],
  documents: [{ id: "d-1", caseId: "case-dsl", type: "CI", source: "UPLOAD", status: "VALID" }],
  payments: [], validations: [], completenessScore: 0, readyForSubmission: false,
  createdAt: "2026-07-29T00:00:00.000Z", updatedAt: "2026-07-29T00:00:00.000Z",
  metadata: { schemaVersion: "1.0", lastChangeSource: "USER_INPUT", lastChangeReason: "test", lastActor: { type: "USER", id: "u-1" }, updatedAt: "2026-07-29T00:00:00.000Z" }, auditTrail: [],
} as unknown as DigitalCaseTwin;

async function run(): Promise<void> {
  const rcaRule = rule("DGPCI.REG.TRANSCRIERE.001")
    .name("RCA required")
    .description("RCA is required for an imported used vehicle transcription")
    .category("DOCUMENTS")
    .severity("CRITICAL")
    .priority(10)
    .tags("transcription", "operation:TRANSCRIPTION", "RCA")
    .owner("DGPCI")
    .when(allOf(operation.isTranscription(), applicant.isNaturalPerson(), vehicle.isImported(), vehicle.isUsed(), document("RCA").missing()))
    .message("RCA is missing")
    .reason("The dossier needs a valid RCA policy")
    .explain({ title: "RCA policy required", failedDescription: "Upload a valid RCA policy." })
    .because("RCA legal source")
    .recommend("Upload a valid RCA policy.", "CRITICAL")
    .nextAction("UPLOAD_RCA", "Upload RCA policy", { blocking: true, order: 1 })
    .build();

  const alternativeRule = rule("DGPCI.REG.TRANSCRIERE.002")
    .when(anyOf(document("RCA").exists(), document("CI").isValid()))
    .message("At least one accepted document is present")
    .reason("Alternative document condition")
    .build();

  const noProxyRule = rule("DGPCI.REG.TRANSCRIERE.003")
    .when(not(proxy.exists()))
    .message("No proxy")
    .reason("Applicant acts personally")
    .build();

  assert(rcaRule.expression?.type === "AND", "allOf must create an AND expression");
  assert(rcaRule.metadata?.owner === "DGPCI", "metadata owner must be preserved");
  assert(rcaRule.conditions.length === 0, "DSL rules remain compatible with legacy conditions");

  const serializer = new ExpressionSerializer();
  const serialized = serializer.serialize(rcaRule.expression!);
  assert(serializer.deserialize(serialized).type === "AND", "expression must round-trip through JSON");

  const pack = rulePack({ id: "transcription", version: "1.0.0", name: "Transcription rules" }, [rcaRule, alternativeRule, noProxyRule]);
  const registry = new RuleRegistry().registerPack(pack);
  assert(registry.all().length === 3, "registry must register a rule pack");
  assert(registry.find(rcaRule.id)?.id === rcaRule.id, "registry must find a rule by id");
  assert(registry.findByCategory("DOCUMENTS").length === 1, "registry must filter by category");
  assert(registry.findByTag("RCA").length === 1, "registry must filter by tag");
  assert(registry.findByOperation("TRANSCRIPTION").length === 1, "registry must filter by operation tag");

  let duplicateRejected = false;
  try { registry.register(rcaRule); } catch { duplicateRejected = true; }
  assert(duplicateRejected, "registry must reject duplicate rule versions");

  const repository = new MemoryRuleRepository();
  await repository.saveMany(registry.all());
  const report = await new RuleEngine(repository).evaluate({ twin, correlationId: "corr-dsl" });
  assert(report.results.length === 3, "engine must execute DSL-built rules");
  assert(report.results.find((item) => item.ruleId === rcaRule.id)?.outcome === "PASSED", "missing RCA rule condition must match");
  assert(report.results.find((item) => item.ruleId === alternativeRule.id)?.outcome === "PASSED", "OR expression must match valid CI");
  assert(report.results.find((item) => item.ruleId === noProxyRule.id)?.outcome === "PASSED", "NOT expression must negate proxy predicate");
  assert(report.results.find((item) => item.ruleId === rcaRule.id)?.trace.evaluatedConditions === 5, "expression trace must include predicate leaves");

  assert(registry.unregister(noProxyRule.id) === 1, "registry must unregister a rule");
  assert(registry.all().length === 2, "unregistered rule must be removed");

  let emptyAllOfRejected = false;
  try { allOf(); } catch { emptyAllOfRejected = true; }
  assert(emptyAllOfRejected, "allOf must reject an empty expression list");

  console.log("ISSUE-004.3 Rule DSL tests passed");
}
void run();
