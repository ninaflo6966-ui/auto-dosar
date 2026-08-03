"use client";

import type { OperationDefinition } from "@autodosar/adi-core/operations";
import { useWizard } from "@/hooks/useWizard";
import { ProgressHeader } from "./ProgressHeader";
import { QuestionRenderer } from "./QuestionRenderer";
import { Summary } from "./Summary";
import { useRouter } from "next/navigation";

interface ExpertDosarProps {
  operation: OperationDefinition;
}

export function ExpertDosar({ operation }: ExpertDosarProps) {
  const router = useRouter();
  const wizard = useWizard(operation.questions);
  const question = wizard.currentQuestion;

  function saveForChecklist() {
    localStorage.setItem("autoDosarExpert", JSON.stringify({
      operationSlug: operation.slug,
      operationId: operation.id,
      operationTitle: operation.title,
      answers: wizard.answers,
    }));
    router.push("/checklist");
  }

  return (
    <div className="expert-shell">
      <a href="/operatiuni" className="expert-back">← Înapoi la operațiuni</a>

      <article className="expert-card">
        <ProgressHeader
          title={operation.shortTitle}
          current={Math.min(wizard.currentIndex + 1, wizard.visibleQuestions.length)}
          total={wizard.visibleQuestions.length}
          progress={wizard.progress}
          completed={wizard.completed}
        />

        <div className="expert-content">
          {wizard.completed ? (
            <Summary
              questions={wizard.visibleQuestions}
              answers={wizard.answers}
              onEdit={wizard.edit}
            />
          ) : question ? (
            <section className="expert-question">
              <p className="expert-eyebrow">Expert Dosar</p>
              <h2>{question.label}</h2>
              {question.help ? <p className="expert-help">{question.help}</p> : null}
              <QuestionRenderer
                question={question}
                value={wizard.answers[question.id]}
                onChange={(value) => wizard.answer(question.id, value)}
              />
            </section>
          ) : (
            <p>Operațiunea nu conține întrebări configurate.</p>
          )}
        </div>

        <footer className="expert-actions">
          <button
            type="button"
            className="expert-button secondary"
            onClick={wizard.previous}
            disabled={!wizard.completed && wizard.currentIndex === 0}
          >
            Înapoi
          </button>

          {wizard.completed ? (
            <button type="button" className="expert-button primary" onClick={saveForChecklist}>
              Salvează și continuă
            </button>
          ) : (
            <button
              type="button"
              className="expert-button primary"
              onClick={wizard.next}
              disabled={!wizard.canGoNext}
            >
              {wizard.currentIndex === wizard.visibleQuestions.length - 1 ? "Vezi rezumatul" : "Continuă"}
            </button>
          )}
        </footer>
      </article>
    </div>
  );
}
