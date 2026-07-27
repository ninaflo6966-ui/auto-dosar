import type { KnowledgePackage } from "../entities/KnowledgeTypes";
import { KnowledgeValidator } from "../validators/KnowledgeValidator";

export class JsonKnowledgeLoader {
  constructor(private readonly validator = new KnowledgeValidator()) {}

  fromString(json: string): KnowledgePackage {
    const parsed: unknown = JSON.parse(json);
    return this.fromObject(parsed);
  }

  fromObject(input: unknown): KnowledgePackage {
    if (!input || typeof input !== "object") throw new Error("Knowledge package must be an object");
    const pkg = input as KnowledgePackage;
    this.validator.assertValid(pkg);
    return structuredClone(pkg);
  }
}
