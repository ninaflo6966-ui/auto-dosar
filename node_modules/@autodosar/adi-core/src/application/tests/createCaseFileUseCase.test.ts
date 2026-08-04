import { OperationType } from "../../enums/OperationType";
import { InMemoryCaseFileRepository } from "../../case-file/repository/InMemoryCaseFileRepository";
import { InMemoryEventBus } from "../../events/bus/InMemoryEventBus";
import { EventRecorder } from "../../events/testing/EventRecorder";
import { EventTypes } from "../../events/domain-events/EventTypes";
import { CreateCaseFileUseCase } from "../use-cases/CreateCaseFileUseCase";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(`Assertion failed: ${message}`);
}

async function run(): Promise<void> {
  const repository = new InMemoryCaseFileRepository();
  const eventBus = new InMemoryEventBus();
  const recorder = new EventRecorder();
  recorder.start(eventBus);

  const useCase = new CreateCaseFileUseCase({
    repository,
    eventBus,
    idFactory: () => "case-001",
    referenceFactory: () => "AD-2026-0001",
    clock: () => new Date("2026-08-04T12:00:00.000Z"),
  });

  const result = await useCase.execute({
    operation: OperationType.OwnershipTransfer,
    operationSlug: "transcriere",
    actorId: "user-1",
    correlationId: "corr-1",
    answers: { buyerType: "PF" },
  });

  assert(result.caseId === "case-001", "projection must expose created case id");
  assert(result.reference === "AD-2026-0001", "projection must expose reference");
  assert(result.score === 0, "new case starts with score zero");

  const stored = await repository.findById("case-001");
  assert(stored?.answers.buyerType === "PF", "repository must persist initial answers");
  assert(stored?.metadata?.createdBy === "user-1", "repository must persist actor metadata");

  const createdEvent = recorder.events().find((event) => event.eventType === EventTypes.CASE_CREATED);
  assert(Boolean(createdEvent), "use case must publish case.created");
  assert(createdEvent?.correlationId === "corr-1", "event must preserve correlation id");

  console.log("M-001.5 CreateCaseFileUseCase tests passed");
}

void run();
