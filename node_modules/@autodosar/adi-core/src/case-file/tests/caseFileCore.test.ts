import { SmartChecklistEngine } from "../../checklist/engine/SmartChecklistEngine";
import { DocumentSource } from "../../documents/enums/DocumentSource";
import { DocumentStatus } from "../../documents/enums/DocumentStatus";
import { DocumentType } from "../../documents/enums/DocumentType";
import { OperationType } from "../../enums/OperationType";
import { transcriereOperation } from "../../operations/definitions/transcriere";
import { InMemoryCaseFileRepository } from "../repository/InMemoryCaseFileRepository";
import { CaseFileBuilder } from "../services/CaseFileBuilder";
import { CaseFileManager } from "../services/CaseFileManager";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

async function run(): Promise<void> {
  const builder = new CaseFileBuilder();
  const manager = new CaseFileManager();
  const repository = new InMemoryCaseFileRepository();
  const checklistEngine = new SmartChecklistEngine();

  let caseFile = builder.create({
    id: "CASE-M0014-001",
    reference: "AD-2026-000001",
    operation: OperationType.OwnershipTransfer,
    operationSlug: "transcriere",
    answers: { personType: "pf", proxy: "nu" },
  });

  assert(caseFile.version === 1, "Dosarul trebuie creat la versiunea 1");
  assert(caseFile.score === 0, "Scorul inițial trebuie să fie 0");

  const checklist = checklistEngine.build({
    operation: transcriereOperation,
    answers: caseFile.answers,
  });
  caseFile = manager.applyChecklist(caseFile, checklist);

  assert(caseFile.smartChecklist?.operationSlug === "transcriere-auto", "Checklist-ul trebuie atașat dosarului");
  assert(caseFile.progress.totalSteps === checklist.requiredCount, "Progresul trebuie sincronizat");

  caseFile = manager.addDocument(caseFile, {
    id: "DOC-CIV-001",
    type: DocumentType.CIV,
    status: DocumentStatus.Uploaded,
    source: DocumentSource.Upload,
    originalFileName: "civ.pdf",
    mimeType: "application/pdf",
    createdAt: new Date("2026-08-03T10:00:00Z"),
  });

  assert(caseFile.documents.length === 1, "Documentul trebuie adăugat în dosar");
  assert(caseFile.version === 3, "Fiecare schimbare trebuie să creeze o versiune nouă");
  assert(caseFile.timeline.length === 3, "Timeline-ul trebuie să păstreze istoricul");

  await repository.save(caseFile);
  const restored = await repository.findById(caseFile.id);
  assert(restored?.reference === caseFile.reference, "Repository-ul trebuie să restaureze dosarul");
  assert(restored !== caseFile, "Repository-ul trebuie să returneze o copie sigură");

  console.log("M-001.4 CaseFile Core tests passed");
}

void run();
