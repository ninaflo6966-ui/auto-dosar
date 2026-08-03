import { createDefaultOperationRegistry, OperationRegistry, transcriereOperation } from "../index";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(`Assertion failed: ${message}`);
}

function run(): void {
  const registry = createDefaultOperationRegistry();

  assert(registry.list().length === 1, "default registry must contain the transcription operation");
  assert(registry.get("transcriere-auto")?.id === transcriereOperation.id, "operation must be available by slug");
  assert(registry.get(transcriereOperation.id)?.slug === "transcriere-auto", "operation must be available by id");

  const initialQuestions = registry.getVisibleQuestions("transcriere-auto", {});
  assert(initialQuestions.map((item) => item.id).join(",") === "personType,proxy,sameCounty", "conditional questions must remain hidden initially");

  const sameCountyQuestions = registry.getVisibleQuestions("transcriere-auto", { sameCounty: "da" });
  assert(sameCountyQuestions.some((item) => item.id === "plateStaysOnCar"), "plate retention question must appear for the same county");
  assert(!sameCountyQuestions.some((item) => item.id === "plateType"), "plate type must wait for the retention answer");

  const allPlateQuestions = registry.getVisibleQuestions("transcriere-auto", { sameCounty: "da", plateStaysOnCar: "nu" });
  assert(allPlateQuestions.some((item) => item.id === "plateType"), "plate type must appear when new plates are needed");

  const pfDocuments = registry.getRequiredDocuments("transcriere-auto", { personType: "pf", proxy: "nu" });
  assert(pfDocuments.some((item) => item.id === "ci_pf"), "PF identity document must be required");
  assert(!pfDocuments.some((item) => item.id === "cui_pj"), "PJ documents must be hidden for PF");
  assert(!pfDocuments.some((item) => item.id === "imputernicire"), "proxy documents must be hidden without proxy");

  const pjProxyDocuments = registry.getRequiredDocuments("transcriere-auto", { personType: "pj", proxy: "da" });
  assert(pjProxyDocuments.some((item) => item.id === "cui_pj"), "PJ registration certificate must be included");
  assert(pjProxyDocuments.some((item) => item.id === "imputernicire"), "proxy document must be included");
  assert(pjProxyDocuments.some((item) => item.id === "rca"), "common mandatory documents must always be included");

  let duplicateRejected = false;
  try { registry.register(transcriereOperation); } catch { duplicateRejected = true; }
  assert(duplicateRejected, "duplicate operations must be rejected");

  let invalidVersionRejected = false;
  try {
    new OperationRegistry().register({ ...transcriereOperation, id: "invalid", slug: "invalid", version: "1" });
  } catch { invalidVersionRejected = true; }
  assert(invalidVersionRejected, "invalid semantic versions must be rejected");

  assert(registry.unregister("transcriere-auto"), "operation must be removable by slug");
  assert(registry.list().length === 0, "registry must be empty after removal");

  console.log("M-001.1 Operation Registry tests passed");
}

run();
