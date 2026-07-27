function assertEqual(actual: unknown, expected: unknown): void {
  if (actual !== expected) throw new Error(`Expected ${String(expected)}, received ${String(actual)}`);
}
function assertTrue(value: boolean): void {
  if (!value) throw new Error("Expected true");
}

import { InMemoryKnowledgeRepository } from "../repository/InMemoryKnowledgeRepository";
import { KnowledgeEngine } from "../services/KnowledgeEngine";
import { ROMANIA_DGPCI_BASELINE } from "../storage/romania-dgpci-baseline";

async function run(): Promise<void> {
  const repository = new InMemoryKnowledgeRepository();
  const engine = new KnowledgeEngine(repository);
  await engine.publish(ROMANIA_DGPCI_BASELINE);
  const result = await engine.resolve({
    asOf: "2026-07-27",
    jurisdiction: "RO",
    operationType: "PERMANENT_REGISTRATION",
    variant: "USED_NON_EU",
    facts: { vehicle: { origin: "NON_EU" }, representedByProxy: false },
  });
  assertEqual(result.operation.operationType, "PERMANENT_REGISTRATION");
  assertEqual(result.requirements.find((x) => x.id === "REQ-CUSTOMS")?.applies, true);
  assertEqual(result.requirements.find((x) => x.id === "REQ-VAT")?.applies, false);
  assertTrue(result.documents.some((x) => x.id === "CUSTOMS_DOCUMENT"));
  assertTrue(result.legalSources.every((x) => x.verificationStatus === "NEEDS_REVIEW"));
  console.log("Knowledge Engine test passed");
}
void run();
