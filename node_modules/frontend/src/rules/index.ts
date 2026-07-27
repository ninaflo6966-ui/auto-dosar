import { buildInmatriculareDosar } from "./inmatriculare.rules";
import { buildTranscriereDosar } from "./transcriere.rules";
import { buildRadiereDosar } from "./radiere.rules";
import { buildDuplicatDosar } from "./duplicat.rules";
import { buildModificareDosar } from "./modificare.rules";
import { buildAutorizatieDosar } from "./autorizatie.rules";

export function buildDosar(operation: string, data: any) {
  switch (operation) {
    case "inmatriculare-definitiva":
      return buildInmatriculareDosar(data);

    case "transcriere-auto":
      return buildTranscriereDosar(data);

    case "radiere-vehicul":
      return buildRadiereDosar(data);

    case "duplicat-talon":
      return buildDuplicatDosar(data);

    case "modificare-date":
      return buildModificareDosar(data);

    case "autorizatie-provizorie":
      return buildAutorizatieDosar(data);

    default:
      return {
        documents: [],
        taxes: [],
        forms: [],
      };
  }
}