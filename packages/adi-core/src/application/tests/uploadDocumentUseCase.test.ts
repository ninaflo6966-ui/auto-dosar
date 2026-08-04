import { OperationType } from "../../enums/OperationType";
import { DocumentType } from "../../documents/enums/DocumentType";
import { DocumentStatus } from "../../documents/enums/DocumentStatus";
import { InMemoryCaseFileRepository } from "../../case-file/repository/InMemoryCaseFileRepository";
import { InMemoryEventBus } from "../../events/bus/InMemoryEventBus";
import { EventRecorder } from "../../events/testing/EventRecorder";
import { EventTypes } from "../../events/domain-events/EventTypes";
import { createDefaultOperationRegistry } from "../../operations";
import { CreateCaseFileUseCase } from "../use-cases/CreateCaseFileUseCase";
import { UpdateAnswerUseCase } from "../use-cases/UpdateAnswerUseCase";
import {
  UnsupportedUploadTypeError,
  UploadDocumentUseCase,
} from "../use-cases/UploadDocumentUseCase";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(`Assertion failed: ${message}`);
}

async function run(): Promise<void> {
  const repository = new InMemoryCaseFileRepository();
  const eventBus = new InMemoryEventBus();
  const recorder = new EventRecorder();
  recorder.start(eventBus);
  const operationRegistry = createDefaultOperationRegistry();

  const create = new CreateCaseFileUseCase({
    repository,
    eventBus,
    idFactory: () => "case-upload-001",
    referenceFactory: () => "AD-2026-UP-001",
    clock: () => new Date("2026-08-04T16:00:00.000Z"),
  });

  await create.execute({
    operation: OperationType.OwnershipTransfer,
    operationSlug: "transcriere-auto",
    actorId: "user-1",
  });

  const updateAnswers = new UpdateAnswerUseCase({
    repository,
    eventBus,
    operationRegistry,
    clock: () => new Date("2026-08-04T16:01:00.000Z"),
  });

  const beforeUpload = await updateAnswers.execute({
    caseId: "case-upload-001",
    expectedVersion: 1,
    answers: {
      personType: "pf",
      proxy: "nu",
      sameCounty: "da",
      plateStaysOnCar: "da",
    },
  });

  const rcaBefore = beforeUpload.checklist?.items.find((item) => item.id === "rca");
  assert(rcaBefore?.status === "missing", "RCA must be missing before upload");

  const upload = new UploadDocumentUseCase({
    repository,
    eventBus,
    operationRegistry,
    idFactory: () => "document-rca-001",
    clock: () => new Date("2026-08-04T16:02:00.000Z"),
  });

  const afterUpload = await upload.execute({
    caseId: "case-upload-001",
    checklistDocumentId: "rca",
    documentType: DocumentType.RCA,
    fileName: "polita-rca.pdf",
    mimeType: "application/pdf",
    sizeBytes: 245_760,
    storageKey: "case-upload-001/rca/polita-rca.pdf",
    expectedVersion: beforeUpload.version,
    actorId: "user-1",
    correlationId: "corr-upload-1",
  });

  assert(afterUpload.version === beforeUpload.version + 2, "document add and checklist rebuild must create two versions");
  assert(afterUpload.documents?.length === 1, "projection must contain uploaded document");
  assert(afterUpload.documents?.[0]?.status === DocumentStatus.Uploaded, "document status must be uploaded");
  assert(afterUpload.documents?.[0]?.checklistDocumentId === "rca", "document must preserve checklist id");
  assert(afterUpload.checklist?.items.find((item) => item.id === "rca")?.status === "uploaded", "checklist must update RCA status");
  assert(afterUpload.score > beforeUpload.score, "score must increase after mandatory document upload");

  const stored = await repository.findById("case-upload-001");
  assert(stored?.documents[0]?.storageKey === "case-upload-001/rca/polita-rca.pdf", "storage key must be persisted");
  assert(stored?.timeline.some((item) => item.type === "CASE_FILE_DOCUMENT_ADDED"), "timeline must record upload");

  const uploadEvent = recorder.events().find((event) => event.eventType === EventTypes.DOCUMENT_UPLOADED);
  const checklistEvent = recorder.events().filter((event) => event.eventType === EventTypes.CHECKLIST_UPDATED).at(-1);
  assert(Boolean(uploadEvent), "use case must publish document.uploaded");
  assert(uploadEvent?.correlationId === "corr-upload-1", "upload event must preserve correlation id");
  assert(Boolean(checklistEvent), "use case must publish checklist.updated");

  let invalidTypeDetected = false;
  try {
    await upload.execute({
      caseId: "case-upload-001",
      checklistDocumentId: "civ",
      documentType: DocumentType.CIV,
      fileName: "civ.exe",
      mimeType: "application/x-msdownload",
      sizeBytes: 100,
      expectedVersion: afterUpload.version,
    });
  } catch (error) {
    invalidTypeDetected = error instanceof UnsupportedUploadTypeError;
  }
  assert(invalidTypeDetected, "unsupported MIME types must be rejected");

  console.log("M-001.7 UploadDocumentUseCase tests passed");
}

void run();
