"use client";

import type { SmartChecklistResult } from "@autodosar/adi-core";

interface SmartChecklistViewProps {
  checklist: SmartChecklistResult;
}

const statusLabel = {
  required: "Necesar",
  optional: "Opțional",
  missing: "Lipsește",
  uploaded: "Încărcat",
  validated: "Validat",
} as const;

export function SmartChecklistView({ checklist }: SmartChecklistViewProps) {
  return (
    <div className="checklist-shell">
      <a href={`/expert-dosar?operatiune=${encodeURIComponent(checklist.operationSlug)}`} className="expert-back">
        ← Modifică răspunsurile
      </a>

      <section className="checklist-card">
        <header className="checklist-header">
          <div>
            <p className="expert-eyebrow">Smart Checklist</p>
            <h1>{checklist.operationTitle}</h1>
            <p>Lista este personalizată pe baza răspunsurilor tale.</p>
          </div>
          <div className="checklist-score" aria-label={`Completitudine ${checklist.score}%`}>
            <strong>{checklist.score}%</strong>
            <span>complet</span>
          </div>
        </header>

        <div className="checklist-metrics">
          <div><strong>{checklist.requiredCount}</strong><span>documente necesare</span></div>
          <div><strong>{checklist.completedRequiredCount}</strong><span>încărcate sau validate</span></div>
          <div><strong>{checklist.missingRequiredCount}</strong><span>documente lipsă</span></div>
        </div>

        {checklist.nextAction ? (
          <div className="checklist-next">
            <strong>Următorul pas</strong>
            <span>{checklist.nextAction}</span>
          </div>
        ) : null}

        <div className="checklist-list">
          {checklist.items.map((item) => (
            <article key={item.id} className={`checklist-item status-${item.status}`}>
              <div className="checklist-icon" aria-hidden="true">
                {item.status === "validated" ? "✓" : item.status === "uploaded" ? "↑" : item.status === "optional" ? "○" : "!"}
              </div>
              <div className="checklist-item-content">
                <div className="checklist-item-heading">
                  <h2>{item.title}</h2>
                  <span>{statusLabel[item.status]}</span>
                </div>
                {item.description ? <p>{item.description}</p> : null}
                <details>
                  <summary>De ce este necesar?</summary>
                  <p>{item.reason}</p>
                </details>
              </div>
            </article>
          ))}
        </div>

        <footer className="checklist-actions">
          <a className="expert-button secondary checklist-link" href={`/expert-dosar?operatiune=${encodeURIComponent(checklist.operationSlug)}`}>
            Înapoi la Expert Dosar
          </a>
          <a className="expert-button primary checklist-link" href="/upload">
            Încarcă documentele
          </a>
        </footer>
      </section>
    </div>
  );
}
