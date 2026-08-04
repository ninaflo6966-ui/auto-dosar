"use client";

import { SmartChecklistView } from "@/components/checklist/SmartChecklistView";
import { generateChecklist } from "@/services/checklist.service";
import type { SmartChecklistResult } from "@autodosar/adi-core";
import type { OperationAnswers } from "@autodosar/adi-core/operations";
import { useEffect, useState } from "react";

interface StoredExpertState {
  operationSlug: string;
  answers: OperationAnswers;
}

export default function ChecklistPage() {
  const [checklist, setChecklist] = useState<SmartChecklistResult | null>(null);
  const [expertState, setExpertState] = useState<StoredExpertState | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const raw = localStorage.getItem("autoDosarExpert");
    if (!raw) {
      setError("Nu există răspunsuri salvate. Reia Expert Dosar.");
      return;
    }

    let stored: StoredExpertState;
    try {
      stored = JSON.parse(raw) as StoredExpertState;
    } catch {
      setError("Datele salvate nu mai pot fi citite. Reia Expert Dosar.");
      return;
    }

    setExpertState(stored);

    const controller = new AbortController();
    generateChecklist(stored.operationSlug, { answers: stored.answers }, controller.signal)
      .then(setChecklist)
      .catch((reason: unknown) => {
        if (controller.signal.aborted) return;
        setError(reason instanceof Error ? reason.message : "Checklist-ul nu a putut fi generat.");
      });

    return () => controller.abort();
  }, []);

  if (error) {
    return (
      <main className="expert-page">
        <div className="expert-state error">
          <h1>Checklist indisponibil</h1>
          <p>{error}</p>
          <a href="/expert-dosar">Reia Expert Dosar</a>
        </div>
      </main>
    );
  }

  if (!checklist) {
    return <main className="expert-page"><div className="expert-state">Se generează checklist-ul personalizat…</div></main>;
  }

  if (!expertState) return null;

  return <main className="expert-page"><SmartChecklistView checklist={checklist} operationSlug={expertState.operationSlug} answers={expertState.answers} /></main>;
}
