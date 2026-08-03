export * from "./models/QuestionDefinition";
export * from "./models/OperationDocumentDefinition";
export * from "./models/OperationDefinition";
export * from "./registry/OperationRegistry";
export * from "./definitions/transcriere";

import { transcriereOperation } from "./definitions/transcriere";
import { OperationRegistry } from "./registry/OperationRegistry";

export function createDefaultOperationRegistry(): OperationRegistry {
  return new OperationRegistry([transcriereOperation]);
}
