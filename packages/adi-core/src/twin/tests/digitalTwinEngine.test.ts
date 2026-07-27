import assert from "node:assert/strict";
import { DigitalTwinEngine } from "../services/DigitalTwinEngine";
import { InMemoryTwinRepository } from "../repository/InMemoryTwinRepository";
import { TwinDiffService } from "../services/TwinDiffService";
import { TwinHistoryService } from "../services/TwinHistoryService";

const repository = new InMemoryTwinRepository();
const engine = new DigitalTwinEngine(repository);
const created = await engine.create({
  case: {
    id: "case-1", referenceNumber: "AD-2026-0001", operationId: "operation-1", parties: [], status: "DRAFT",
    createdAt: "2026-07-25T08:00:00.000Z", updatedAt: "2026-07-25T08:00:00.000Z",
  },
  operation: { id: "operation-1", type: "TRANSCRIPTION", options: {} },
  context: { reason: "Test creare" },
});
assert.equal(created.version, 1);
assert.equal(created.readyForSubmission, false);
assert.ok(Object.isFrozen(created));

const updated = await engine.applyEvent({
  eventId: "event-1", caseId: "case-1", expectedVersion: 1, eventType: "VEHICLE_UPDATED",
  source: "OCR", actor: { type: "SYSTEM" }, reason: "Extragere CIV", occurredAt: "2026-07-25T08:05:00.000Z",
  changes: [{ op: "set", path: "vehicle", value: { id: "vehicle-1", vin: "WVWZZZ1JZXW000001", origin: "ROMANIA", condition: "USED" } }],
});
assert.equal(updated.version, 2);
assert.equal(updated.vehicle?.vin, "WVWZZZ1JZXW000001");
assert.equal(updated.auditTrail.length, 2);

const diff = new TwinDiffService().compare(created, updated);
assert.equal(diff.hasChanges, true);
assert.ok(diff.entries.some(entry => entry.path === "vehicle" || entry.path.startsWith("vehicle.")));

const history = await new TwinHistoryService(repository).list("case-1");
assert.deepEqual(history.map(item => item.version), [1, 2]);

await assert.rejects(() => engine.applyEvent({
  eventId: "event-conflict", caseId: "case-1", expectedVersion: 1, eventType: "OWNER_UPDATED",
  source: "USER_INPUT", actor: { type: "USER", id: "user-1" }, reason: "Conflict", occurredAt: "2026-07-25T08:06:00.000Z",
  changes: [{ op: "set", path: "completenessScore", value: 20 }],
}), /Conflict de versiune/);

console.log("Digital Twin Engine: toate testele au trecut.");
