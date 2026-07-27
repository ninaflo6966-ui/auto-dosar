import {
  DocumentGenerationContext,
  DocumentGenerator,
} from "../models/DocumentGeneration";

export class DocumentRegistry {
  private readonly generators = new Map<string, DocumentGenerator>();

  public register(generator: DocumentGenerator): this {
    if (this.generators.has(generator.id)) {
      throw new Error(
        `Generatorul de documente ${generator.id} este deja înregistrat.`
      );
    }

    this.generators.set(generator.id, generator);
    return this;
  }

  public getApplicable(
    context: DocumentGenerationContext
  ): DocumentGenerator[] {
    return [...this.generators.values()].filter((generator) =>
      generator.supports(context)
    );
  }

  public getAll(): DocumentGenerator[] {
    return [...this.generators.values()];
  }
}
