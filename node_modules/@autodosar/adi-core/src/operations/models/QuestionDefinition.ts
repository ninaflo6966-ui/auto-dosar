export type QuestionType = "single-choice" | "multiple-choice" | "boolean" | "text" | "number" | "date";

export type PrimitiveAnswer = string | number | boolean;
export type OperationAnswers = Record<string, PrimitiveAnswer | PrimitiveAnswer[] | undefined>;

export interface VisibilityCondition {
  questionId: string;
  equals?: PrimitiveAnswer;
  notEquals?: PrimitiveAnswer;
  oneOf?: PrimitiveAnswer[];
}

export interface QuestionOption {
  value: string;
  label: string;
  description?: string;
}

export interface QuestionDefinition {
  id: string;
  type: QuestionType;
  label: string;
  help?: string;
  required: boolean;
  order: number;
  options?: QuestionOption[];
  visibleWhen?: VisibilityCondition | VisibilityCondition[];
}
