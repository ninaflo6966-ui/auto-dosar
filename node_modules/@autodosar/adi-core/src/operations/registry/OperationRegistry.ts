import type { OperationDefinition } from "../models/OperationDefinition";
import type { OperationAnswers, VisibilityCondition } from "../models/QuestionDefinition";
import type { OperationDocumentDefinition } from "../models/OperationDocumentDefinition";

function isConditionMet(condition: VisibilityCondition, answers: OperationAnswers): boolean {
  const answer = answers[condition.questionId];

  if (condition.equals !== undefined) return answer === condition.equals;
  if (condition.notEquals !== undefined) return answer !== condition.notEquals;
  if (condition.oneOf) return condition.oneOf.includes(answer as string | number | boolean);

  return false;
}

function isVisible(
  condition: VisibilityCondition | VisibilityCondition[] | undefined,
  answers: OperationAnswers,
): boolean {
  if (!condition) return true;
  const conditions = Array.isArray(condition) ? condition : [condition];
  return conditions.every((item) => isConditionMet(item, answers));
}

export class OperationRegistry {
  private readonly operations = new Map<string, OperationDefinition>();

  constructor(definitions: OperationDefinition[] = []) {
    this.registerMany(definitions);
  }

  register(definition: OperationDefinition): this {
    this.validate(definition);

    if (this.operations.has(definition.id) || this.operations.has(definition.slug)) {
      throw new Error(`Operation already registered: ${definition.id}`);
    }

    this.operations.set(definition.id, definition);
    this.operations.set(definition.slug, definition);
    return this;
  }

  registerMany(definitions: OperationDefinition[]): this {
    definitions.forEach((definition) => this.register(definition));
    return this;
  }

  get(idOrSlug: string): OperationDefinition | undefined {
    return this.operations.get(idOrSlug);
  }

  require(idOrSlug: string): OperationDefinition {
    const operation = this.get(idOrSlug);
    if (!operation) throw new Error(`Unknown operation: ${idOrSlug}`);
    return operation;
  }

  list(options: { activeOnly?: boolean } = { activeOnly: true }): OperationDefinition[] {
    const unique = new Map<string, OperationDefinition>();
    this.operations.forEach((definition) => unique.set(definition.id, definition));

    return [...unique.values()]
      .filter((definition) => !options.activeOnly || definition.active)
      .sort((left, right) => left.title.localeCompare(right.title, "ro"));
  }

  getVisibleQuestions(idOrSlug: string, answers: OperationAnswers = {}) {
    return this.require(idOrSlug).questions
      .filter((question) => isVisible(question.visibleWhen, answers))
      .sort((left, right) => left.order - right.order);
  }

  getRequiredDocuments(idOrSlug: string, answers: OperationAnswers = {}): OperationDocumentDefinition[] {
    return this.require(idOrSlug).documents.filter((document) => isVisible(document.visibleWhen, answers));
  }

  unregister(idOrSlug: string): boolean {
    const definition = this.get(idOrSlug);
    if (!definition) return false;
    this.operations.delete(definition.id);
    this.operations.delete(definition.slug);
    return true;
  }

  private validate(definition: OperationDefinition): void {
    if (!definition.id.trim()) throw new Error("Operation id is required");
    if (!definition.slug.trim()) throw new Error("Operation slug is required");
    if (!definition.title.trim()) throw new Error("Operation title is required");
    if (!/^\d+\.\d+\.\d+$/.test(definition.version)) {
      throw new Error(`Invalid operation version: ${definition.version}`);
    }

    const questionIds = new Set<string>();
    for (const question of definition.questions) {
      if (questionIds.has(question.id)) throw new Error(`Duplicate question id: ${question.id}`);
      questionIds.add(question.id);
      if (question.options && question.options.length === 0) {
        throw new Error(`Question options cannot be empty: ${question.id}`);
      }
    }

    const documentIds = new Set<string>();
    for (const document of definition.documents) {
      if (documentIds.has(document.id)) throw new Error(`Duplicate document id: ${document.id}`);
      documentIds.add(document.id);
    }
  }
}
