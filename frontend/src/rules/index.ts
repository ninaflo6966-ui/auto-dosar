import {
  buildInmatriculareDosar,
} from "./inmatriculare.rules";

import {
  buildTranscriereDosar,
} from "./transcriere.rules";

import {
  buildRadiereDosar,
} from "./radiere.rules";

export function buildDosar(operation: string, data: any) {
  switch (operation) {
    case "inmatriculare-definitiva":
  return buildInmatriculareDosar(data);
  
    case "transcriere-auto":
      return buildTranscriereDosar(data);

    case "radiere-vehicul":
      return buildRadiereDosar(data);

    default:
      return {
        documents: [],
        taxes: [],
        forms: [],
      };
  }
}