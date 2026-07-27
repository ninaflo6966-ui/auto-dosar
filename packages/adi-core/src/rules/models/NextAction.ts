export interface NextActionDefinition {
  code: string;
  label: string;
  order?: number;
  blocking?: boolean;
  description?: string;
  appliesOn?: "FAILED" | "PASSED" | "ALWAYS";
}

export interface NextAction {
  code: string;
  ruleId: string;
  label: string;
  order: number;
  blocking: boolean;
  description?: string;
}
