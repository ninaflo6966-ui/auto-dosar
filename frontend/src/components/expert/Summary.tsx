import type { OperationAnswers, QuestionDefinition } from "@autodosar/adi-core/operations";

interface SummaryProps {
  questions: QuestionDefinition[];
  answers: OperationAnswers;
  onEdit: (questionId: string) => void;
}

function answerLabel(question: QuestionDefinition, value: OperationAnswers[string]): string {
  if (Array.isArray(value)) {
    return value
      .map((item) => question.options?.find((option) => option.value === item)?.label ?? String(item))
      .join(", ");
  }
  if (typeof value === "boolean") return value ? "Da" : "Nu";
  return question.options?.find((option) => option.value === value)?.label ?? String(value ?? "—");
}

export function Summary({ questions, answers, onEdit }: SummaryProps) {
  return (
    <section className="expert-summary">
      <div className="expert-summary-heading">
        <div className="expert-success-icon">✓</div>
        <div>
          <h2>Răspunsurile sunt complete</h2>
          <p>Verifică datele înainte de generarea checklist-ului.</p>
        </div>
      </div>

      <div className="expert-summary-list">
        {questions.map((question) => (
          <div key={question.id} className="expert-summary-row">
            <div>
              <span>{question.label}</span>
              <strong>{answerLabel(question, answers[question.id])}</strong>
            </div>
            <button type="button" onClick={() => onEdit(question.id)}>Modifică</button>
          </div>
        ))}
      </div>
    </section>
  );
}
