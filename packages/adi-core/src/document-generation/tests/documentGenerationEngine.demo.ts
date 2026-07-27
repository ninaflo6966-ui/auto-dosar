import { OperationType } from "../../enums/OperationType";
import { PersonType } from "../../enums/PersonType";
import { DocumentGenerationEngine } from "../services/DocumentGenerationEngine";

const engine = new DocumentGenerationEngine();

const result = engine.generate({
  operation: OperationType.OwnershipTransfer,
  sellerType: PersonType.Individual,
  ownershipMode: "GENERATE",
  availableDocumentTypes: ["IDENTITY_CARD", "CIV", "RCA"],
  caseReference: "AD-DEMO-0001",
});

if (result.generatedDocuments.length !== 4) {
  throw new Error(
    `Erau așteptate 4 documente, dar au fost generate ${result.generatedDocuments.length}.`
  );
}

if (
  !result.generatedDocuments.some(
    (document) => document.id === "CONTRACT_ITL_054"
  )
) {
  throw new Error("Contractul ITL-054 nu a fost inclus în rezultat.");
}

console.log(JSON.stringify(result, null, 2));
