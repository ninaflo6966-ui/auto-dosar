import type { RequirementCondition, RequirementDefinition, ResolvedRequirement } from "../entities/KnowledgeTypes";

function getPath(source: Record<string, unknown>, path: string): unknown {
  return path.split(".").reduce<unknown>((value, key) =>
    value && typeof value === "object" ? (value as Record<string, unknown>)[key] : undefined, source);
}

export class RequirementResolver {
  resolve(requirements: RequirementDefinition[], facts: Record<string, unknown> = {}): ResolvedRequirement[] {
    return requirements
      .map((r) => {
        const trace: string[] = [];
        const applies = (r.conditions ?? []).every((condition) => {
          const actual = getPath(facts, condition.path);
          const result = this.evaluate(condition, actual);
          trace.push(`${condition.path} ${condition.operator} ${JSON.stringify(condition.value)} => ${result}`);
          return result;
        });
        return { ...r, applies, conditionTrace: trace };
      })
      .sort((a, b) => a.priority - b.priority);
  }

  private evaluate(condition: RequirementCondition, actual: unknown): boolean {
    switch (condition.operator) {
      case "EQUALS": return actual === condition.value;
      case "NOT_EQUALS": return actual !== condition.value;
      case "IN": return Array.isArray(condition.value) && condition.value.includes(actual);
      case "EXISTS": return actual !== undefined && actual !== null;
      case "NOT_EXISTS": return actual === undefined || actual === null;
    }
  }
}
