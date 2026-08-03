import { transcriereOperation } from "../../operations/definitions/transcriere";
import { SmartChecklistEngine } from "../engine/SmartChecklistEngine";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const engine = new SmartChecklistEngine();

const pfChecklist = engine.build({
  operation: transcriereOperation,
  answers: {
    personType: "pf",
    proxy: "nu",
    sameCounty: "da",
    plateStaysOnCar: "da",
  },
});

assert(pfChecklist.items.some((item) => item.id === "ci_pf"), "CI PF trebuie inclusă");
assert(!pfChecklist.items.some((item) => item.id === "cui_pj"), "CUI PJ nu trebuie inclus");
assert(!pfChecklist.items.some((item) => item.id === "imputernicire"), "Împuternicirea nu trebuie inclusă");
assert(pfChecklist.missingRequiredCount > 0, "Documentele neîncărcate trebuie marcate lipsă");

const proxyChecklist = engine.build({
  operation: transcriereOperation,
  answers: {
    personType: "pj",
    proxy: "da",
    sameCounty: "nu",
  },
  uploadedDocumentIds: ["cui_pj", "contract_vc", "civ"],
  validatedDocumentIds: ["civ"],
});

assert(proxyChecklist.items.some((item) => item.id === "imputernicire"), "Împuternicirea trebuie inclusă");
assert(proxyChecklist.items.find((item) => item.id === "civ")?.status === "validated", "CIV trebuie validată");
assert(proxyChecklist.score > 0, "Scorul trebuie să reflecte documentele încărcate");

console.log("M-001.3 Smart Checklist tests passed");
