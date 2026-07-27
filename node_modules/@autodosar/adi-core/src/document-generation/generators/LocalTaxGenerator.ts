import { OperationType } from "../../enums/OperationType";
import {
  DocumentGenerationContext,
  DocumentGenerator,
  DocumentGeneratorOutput,
} from "../models/DocumentGeneration";

export class LocalTaxGenerator implements DocumentGenerator {
  public readonly id = "LOCAL_TAX_GENERATOR";

  public supports(context: DocumentGenerationContext): boolean {
    return context.operation === OperationType.OwnershipTransfer;
  }

  public generate(
    _context: DocumentGenerationContext
  ): DocumentGeneratorOutput {
    return {
      documents: [
        {
          id: "LOCAL_TAX_CASE",
          title: "Dosar pentru impunerea vehiculului la Taxe și Impozite",
          description:
            "Subdosarul fiscal pentru declararea și luarea în evidență a vehiculului la DITL/primărie.",
          destination: "LOCAL_TAX",
          status: "WAITING_FOR_DATA",
          generatorId: this.id,
          requiredData: [
            "date proprietar",
            "date vehicul",
            "document de proprietate",
            "autoritate fiscală locală",
          ],
          previewAvailable: true,
          downloadableFiles: [],
        },
      ],
      nextActions: [
        "Finalizează dosarul fiscal și obține dovada luării în evidență la DITL.",
      ],
    };
  }
}
