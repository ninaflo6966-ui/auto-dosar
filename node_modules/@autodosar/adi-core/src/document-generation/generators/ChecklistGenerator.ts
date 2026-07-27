import { OperationType } from "../../enums/OperationType";
import {
  DocumentGenerationContext,
  DocumentGenerator,
  DocumentGeneratorOutput,
} from "../models/DocumentGeneration";

export class ChecklistGenerator implements DocumentGenerator {
  public readonly id = "FINAL_CHECKLIST_GENERATOR";

  public supports(context: DocumentGenerationContext): boolean {
    return context.operation === OperationType.OwnershipTransfer;
  }

  public generate(
    context: DocumentGenerationContext
  ): DocumentGeneratorOutput {
    const warnings: string[] = [];

    if (context.availableDocumentTypes.length === 0) {
      warnings.push(
        "Nu a fost încărcat niciun document. Structura dosarului poate fi previzualizată, dar documentele oficiale nu pot fi completate."
      );
    }

    return {
      documents: [
        {
          id: "FINAL_CHECKLIST",
          title: "Checklist final al transcrierii",
          description:
            "Lista centralizată a documentelor încărcate, documentelor generate, validărilor și pașilor rămași.",
          destination: "BOTH",
          status: "READY",
          generatorId: this.id,
          requiredData: [],
          previewAvailable: true,
          downloadableFiles: [],
        },
      ],
      warnings,
    };
  }
}
