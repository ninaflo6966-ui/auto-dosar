import { OperationType } from "../../enums/OperationType";
import {
  DocumentGenerationContext,
  DocumentGenerator,
  DocumentGeneratorOutput,
} from "../models/DocumentGeneration";

export class DGPCIGenerator implements DocumentGenerator {
  public readonly id = "DGPCI_TRANSCRIPTION_GENERATOR";

  public supports(context: DocumentGenerationContext): boolean {
    return context.operation === OperationType.OwnershipTransfer;
  }

  public generate(
    _context: DocumentGenerationContext
  ): DocumentGeneratorOutput {
    return {
      documents: [
        {
          id: "DGPCI_TRANSCRIPTION_CASE",
          title: "Dosar DGPCI pentru transcriere",
          description:
            "Pachetul documentelor necesare pentru transcrierea transmiterii dreptului de proprietate.",
          destination: "DGPCI",
          status: "WAITING_FOR_DATA",
          generatorId: this.id,
          requiredData: [
            "date nou proprietar",
            "date vehicul",
            "document de proprietate",
            "RCA valabilă",
            "dovada luării în evidență fiscală",
          ],
          previewAvailable: true,
          downloadableFiles: [],
        },
      ],
      nextActions: [
        "După finalizarea impunerii fiscale, verifică și exportă dosarul DGPCI.",
      ],
    };
  }
}
