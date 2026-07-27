import type { RuleContext } from "../engine/RuleContext";

export class PathValueResolver {
  resolve(context: RuleContext, path: string): unknown {
    const root: Record<string, unknown> = {
      twin: context.twin,
      knowledgePackage: context.knowledgePackage,
      operationType: context.operationType,
      facts: context.facts ?? {},
      metadata: context.metadata ?? {},
    };

    return path.split(".").reduce<unknown>((value, key) => {
      if (value === null || value === undefined || typeof value !== "object") return undefined;
      return (value as Record<string, unknown>)[key];
    }, root);
  }
}
