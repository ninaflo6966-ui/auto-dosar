import { OperationType } from "../../enums/OperationType";
import { ChecklistGenerator } from "../generators/ChecklistGenerator";
import { DGPCIGenerator } from "../generators/DGPCIGenerator";
import { ITL054Generator } from "../generators/ITL054Generator";
import { LocalTaxGenerator } from "../generators/LocalTaxGenerator";
import {
  DocumentGenerationContext,
  DocumentGenerationResult,
} from "../models/DocumentGeneration";
import { DocumentRegistry } from "../registry/DocumentRegistry";

export class DocumentGenerationEngine {
  public constructor(
    private readonly registry: DocumentRegistry =
      DocumentGenerationEngine.createDefaultRegistry()
  ) {}

  public generate(
    context: DocumentGenerationContext
  ): DocumentGenerationResult {
    const caseReference =
      context.caseReference ?? this.createCaseReference();

    if (context.operation !== OperationType.OwnershipTransfer) {
      return {
        caseReference,
        operation: context.operation,
        generatedDocuments: [],
        warnings: [],
        errors: [
          "În această versiune, motorul de generare este activ pentru operațiunea de transcriere.",
        ],
        nextActions: [],
        downloadableFiles: [],
        generatedAt: new Date().toISOString(),
      };
    }

    const outputs = this.registry
      .getApplicable(context)
      .map((generator) => generator.generate(context));

    const generatedDocuments = outputs.flatMap(
      (output) => output.documents
    );

    return {
      caseReference,
      operation: context.operation,
      generatedDocuments,
      warnings: this.unique(
        outputs.flatMap((output) => output.warnings ?? [])
      ),
      errors: this.unique(
        outputs.flatMap((output) => output.errors ?? [])
      ),
      nextActions: this.unique(
        outputs.flatMap((output) => output.nextActions ?? [])
      ),
      downloadableFiles: this.unique(
        generatedDocuments.flatMap(
          (document) => document.downloadableFiles
        )
      ),
      generatedAt: new Date().toISOString(),
    };
  }

  public static createDefaultRegistry(): DocumentRegistry {
    return new DocumentRegistry()
      .register(new ITL054Generator())
      .register(new LocalTaxGenerator())
      .register(new DGPCIGenerator())
      .register(new ChecklistGenerator());
  }

  private createCaseReference(): string {
    const year = new Date().getFullYear();
    const randomPart = Math.floor(100000 + Math.random() * 900000);

    return `AD-${year}-${randomPart}`;
  }

  private unique(values: string[]): string[] {
    return [...new Set(values)];
  }
}
