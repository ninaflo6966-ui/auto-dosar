import { OperationType } from "../../enums/OperationType";
import { InMemoryCaseFileRepository } from "../../case-file/repository/InMemoryCaseFileRepository";
import { InMemoryEventBus } from "../../events/bus/InMemoryEventBus";
import { EventRecorder } from "../../events/testing/EventRecorder";
import { EventTypes } from "../../events/domain-events/EventTypes";
import { createDefaultOperationRegistry } from "../../operations";
import { CreateCaseFileUseCase } from "../use-cases/CreateCaseFileUseCase";
import {
  CaseFileVersionConflictError,
  UpdateAnswerUseCase,
} from "../use-cases/UpdateAnswerUseCase";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(`Assertion failed: ${message}`);
}

async function run(): Promise<void> {
  const repository = new InMemoryCaseFileRepository();
  const eventBus = new InMemoryEventBus();
  const recorder = new EventRecorder();
  recorder.start(eventBus);
  const registry = createDefaultOperationRegistry();

  const create = new CreateCaseFileUseCase({
    repository,
    eventBus,
    idFactory: () => "case-answers-001",
    referenceFactory: () => "AD-2026-ANS-001",
    clock: () => new Date("2026-08-04T15:00:00.000Z"),
  });

  await create.execute({
    operation: OperationType.OwnershipTransfer,
    operationSlug: "transcriere-auto",
    actorId: "user-1",
  });

  const update = new UpdateAnswerUseCase({
    repository,
    eventBus,
    operationRegistry: registry,
    clock: () => new Date("2026-08-04T15:05:00.000Z"),
  });

  const result = await update.execute({
    caseId: "case-answers-001",
    expectedVersion: 1,
    actorId: "user-1",
    correlationId: "corr-update-1",
    answers: {
      personType: "pf",
      proxy: "nu",
      sameCounty: "da",
      plateStaysOnCar: "da",
    },
  });

  assert(result.version === 3, "answers and checklist must each create a new domain version");
  assert(result.answers?.personType === "pf", "projection must expose merged answers");
  assert(Boolean(result.checklist), "projection must expose rebuilt checklist");
  assert(result.checklist?.items.some((item) => item.id === "ci_pf"), "PF identity document must be required");
  assert(!result.checklist?.items.some((item) => item.id === "cui_pj"), "PJ documents must remain hidden");
  assert(result.score === 0, "score remains zero before document uploads");

  const stored = await repository.findById("case-answers-001");
  assert(stored?.timeline.length === 3, "timeline must record create, answer update and checklist rebuild");
  assert(stored?.progress.missingDocuments.includes("rca"), "progress must include missing mandatory documents");

  const answerEvent = recorder.events().find((event) => event.eventType === EventTypes.CASE_ANSWERS_UPDATED);
  const checklistEvent = recorder.events().find((event) => event.eventType === EventTypes.CHECKLIST_UPDATED);
  assert(Boolean(answerEvent), "use case must publish case.answers.updated");
  assert(Boolean(checklistEvent), "use case must publish case.checklist.updated");
  assert(answerEvent?.correlationId === "corr-update-1", "events must preserve correlation id");

  let conflictDetected = false;
  try {
    await update.execute({
      caseId: "case-answers-001",
      expectedVersion: 1,
      answers: { proxy: "da" },
    });
  } catch (error) {
    conflictDetected = error instanceof CaseFileVersionConflictError;
  }
  assert(conflictDetected, "stale updates must be rejected");

  console.log("M-001.6 UpdateAnswerUseCase tests passed");
}

void run();
