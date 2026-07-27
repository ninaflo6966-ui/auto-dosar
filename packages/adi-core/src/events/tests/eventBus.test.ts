import { InMemoryEventBus } from "../bus/InMemoryEventBus";
import { AutoDosarEvents } from "../domain-events/AutoDosarEvents";
import { EventTypes } from "../domain-events/EventTypes";
import { TwinRuleEvaluationBridge } from "../handlers/TwinRuleEvaluationBridge";
import { InMemoryDeadLetterQueue } from "../middleware/InMemoryDeadLetterQueue";
import { EventMetricsMiddleware } from "../middleware/EventMetricsMiddleware";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(`Assertion failed: ${message}`);
}

async function run(): Promise<void> {
  const deadLetters = new InMemoryDeadLetterQueue();
  const metrics = new EventMetricsMiddleware();
  const bus = new InMemoryEventBus({ maxRetries: 1, deadLetterQueue: deadLetters, middleware: [metrics] });
  const order: string[] = [];

  bus.subscribe(EventTypes.DOCUMENT_UPLOADED, () => { order.push("low"); }, { priority: 1 });
  bus.subscribe(EventTypes.DOCUMENT_UPLOADED, () => { order.push("high"); }, { priority: 10 });

  const upload = AutoDosarEvents.documentUploaded({
    aggregateId: "case-1",
    payload: { documentId: "doc-1", fileName: "civ.pdf", mimeType: "application/pdf", sizeBytes: 1000 },
  });
  const result = await bus.publish(upload);
  assert(order.join(",") === "high,low", "handlers must execute by descending priority");
  assert(result.successfulHandlers === 2, "both handlers must succeed");

  let requested = false;
  new TwinRuleEvaluationBridge(bus).register();
  bus.subscribe(EventTypes.RULE_EVALUATION_REQUESTED, (event) => {
    requested = event.correlationId === "corr-1" && event.causationId === "twin-event-1";
  });
  await bus.publish(AutoDosarEvents.twinUpdated({
    eventId: "twin-event-1",
    aggregateId: "twin-1",
    correlationId: "corr-1",
    payload: { twinId: "twin-1", previousVersion: 1, currentVersion: 2, changedPaths: ["vehicle.vin"] },
  }));
  assert(requested, "bridge must preserve correlation and causation");

  bus.subscribe("broken.event", () => { throw new Error("boom"); }, { handlerId: "broken-handler" });
  await bus.publish({ ...upload, eventId: "broken-1", eventType: "broken.event", correlationId: "broken-1" });
  assert(deadLetters.list().length === 1, "failed event must enter DLQ after retries");
  assert(deadLetters.list()[0]?.attempts === 2, "initial attempt plus one retry expected");
  assert((metrics.snapshot()[EventTypes.DOCUMENT_UPLOADED]?.count ?? 0) === 2, "metrics count handler executions");
  console.log("ISSUE-003.5 Event Bus tests passed");
}

void run();
