import type {
  PrimitiveAnswer,
  QuestionDefinition,
} from "@autodosar/adi-core/operations";

interface QuestionRendererProps {
  question: QuestionDefinition;
  value: PrimitiveAnswer | PrimitiveAnswer[] | undefined;
  onChange: (value: PrimitiveAnswer | PrimitiveAnswer[]) => void;
}

export function QuestionRenderer({ question, value, onChange }: QuestionRendererProps) {
  if (question.type === "single-choice" || question.type === "boolean") {
    const options = question.type === "boolean"
      ? [
          { value: "true", label: "Da" },
          { value: "false", label: "Nu" },
        ]
      : question.options ?? [];

    return (
      <div className="expert-options" role="radiogroup" aria-label={question.label}>
        {options.map((option) => {
          const optionValue = question.type === "boolean" ? option.value === "true" : option.value;
          const active = value === optionValue;
          return (
            <button
              key={option.value}
              type="button"
              className={`expert-option ${active ? "is-active" : ""}`}
              role="radio"
              aria-checked={active}
              onClick={() => onChange(optionValue)}
            >
              <span className="expert-option-dot" />
              <span>
                <strong>{option.label}</strong>
                {"description" in option && option.description ? <small>{option.description}</small> : null}
              </span>
            </button>
          );
        })}
      </div>
    );
  }

  if (question.type === "multiple-choice") {
    const selected = Array.isArray(value) ? value : [];
    return (
      <div className="expert-options">
        {(question.options ?? []).map((option) => {
          const active = selected.includes(option.value);
          return (
            <button
              key={option.value}
              type="button"
              className={`expert-option ${active ? "is-active" : ""}`}
              aria-pressed={active}
              onClick={() => onChange(
                active
                  ? selected.filter((item) => item !== option.value)
                  : [...selected, option.value],
              )}
            >
              <span className="expert-option-dot" />
              <strong>{option.label}</strong>
            </button>
          );
        })}
      </div>
    );
  }

  const inputType = question.type === "number" ? "number" : question.type === "date" ? "date" : "text";
  return (
    <input
      className="expert-input"
      type={inputType}
      value={typeof value === "string" || typeof value === "number" ? value : ""}
      onChange={(event) => onChange(question.type === "number" ? Number(event.target.value) : event.target.value)}
      aria-label={question.label}
    />
  );
}
