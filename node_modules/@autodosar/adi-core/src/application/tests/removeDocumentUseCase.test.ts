import { InMemoryCaseFileRepository } from "../../case-file/repository/InMemoryCaseFileRepository";
import { DocumentType } from "../../documents/enums/DocumentType";
import { OperationType } from "../../enums/OperationType";
import { InMemoryEventBus } from "../../events/bus/InMemoryEventBus";
import { createDefaultOperationRegistry } from "../../operations";
import { CreateCaseFileUseCase } from "../use-cases/CreateCaseFileUseCase";
import { RemoveDocumentUseCase } from "../use-cases/RemoveDocumentUseCase";
import { UpdateAnswerUseCase } from "../use-cases/UpdateAnswerUseCase";
import { UploadDocumentUseCase } from "../use-cases/UploadDocumentUseCase";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(`Assertion failed: ${message}`);
}

async function run(): Promise<void> {
  const repository = new InMemoryCaseFileRepository();
  const eventBus = new InMemoryEventBus();
  const operationRegistry = createDefaultOperationRegistry();
  const create = new CreateCaseFileUseCase({
    repository,
    eventBus,
    idFactory: () => "case-remove-001",
    referenceFactory: () => "AD-REMOVE-001",
  });
  const created = await create.execute({
    operation: OperationType.OwnershipTransfer,
    operationSlug: "transcriere-auto",
  });
  const update = new UpdateAnswerUseCase({ repository, eventBus, operationRegistry });
  const answered = await update.execute({
    caseId: created.caseId,
    expectedVersion: created.version,
    answers: { personType: "pf", proxy: "nu", sameCounty: "da", plateStaysOnCar: "da" },
  });
  const upload = new UploadDocumentUseCase({
    repository,
    eventBus,
    operationRegistry,
    idFactory: () => "doc-remove-001",
  });
  const uploaded = await upload.execute({
    caseId: created.caseId,
    checklistDocumentId: "rca",
    documentType: DocumentType.RCA,
    fileName: "rca.pdf",
    mimeType: "application/pdf",
    sizeBytes: 1000,
    expectedVersion: answered.version,
  });
  assert(uploaded.checklist?.items.find((item) => item.id === "rca")?.status === "uploaded", "RCA must be uploaded");

  const remove = new RemoveDocumentUseCase({ repository, eventBus, operationRegistry });
  const removed = await remove.execute({
    caseId: created.caseId,
    documentId: "doc-remove-001",
    expectedVersion: uploaded.version,
  });
  assert(removed.documents?.length === 0, "document must be removed");
  assert(removed.checklist?.items.find((item) => item.id === "rca")?.status === "missing", "RCA must become missing");
  assert(removed.score < uploaded.score, "score must decrease after removal");

  console.log("M-001.8 RemoveDocumentUseCase tests passed");
}

void run();
