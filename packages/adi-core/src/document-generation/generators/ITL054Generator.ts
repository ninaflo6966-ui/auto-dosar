import { OperationType } from "../../enums/OperationType";
import { PersonType } from "../../enums/PersonType";
import {
  DocumentGenerationContext,
  DocumentGenerator,
  DocumentGeneratorOutput,
} from "../models/DocumentGeneration";

export class ITL054Generator implements DocumentGenerator {
  public readonly id = "ITL054_GENERATOR";

  public supports(context: DocumentGenerationContext): boolean {
    return (
      context.operation === OperationType.OwnershipTransfer &&
      context.sellerType === PersonType.Individual &&
      context.ownershipMode === "GENERATE"
    );
  }

  public generate(
    _context: DocumentGenerationContext
  ): DocumentGeneratorOutput {
    return {
      documents: [
        {
          id: "CONTRACT_ITL_054",
          title: "Contract de înstrăinare-dobândire ITL-054",
          description:
            "Contractul utilizat pentru transferul proprietății și pentru declararea fiscală a vehiculului.",
          destination: "BOTH",
          status: "WAITING_FOR_DATA",
          generatorId: this.id,
          requiredData: [
            "date cumpărător",
            "date vânzător",
            "date vehicul",
            "preț",
            "data tranzacției",
          ],
          previewAvailable: true,
          downloadableFiles: [],
        },
      ],
      nextActions: [
        "Verifică și completează datele contractului ITL-054.",
      ],
    };
  }
}
