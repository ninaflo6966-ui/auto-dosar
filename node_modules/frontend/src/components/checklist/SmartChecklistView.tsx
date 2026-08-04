"use client";

import {
  createCaseSession,
  removeCaseDocument,
  uploadCaseDocument,
  type UiCaseDocument,
  type UiCaseProjection,
} from "@/services/case-file.service";
import type { SmartChecklistResult } from "@autodosar/adi-core";
import type { OperationAnswers } from "@autodosar/adi-core/operations";
import { useMemo, useRef, useState } from "react";

interface SmartChecklistViewProps {
  checklist: SmartChecklistResult;
  operationSlug: string;
  answers: OperationAnswers;
}

const statusLabel = {
  required: "Necesar",
  optional: "Opțional",
  missing: "Lipsește",
  uploaded: "Încărcat",
  validated: "Validat",
} as const;

const acceptedFiles = ".pdf,.png,.jpg,.jpeg,application/pdf,image/png,image/jpeg";

export function SmartChecklistView({ checklist, operationSlug, answers }: SmartChecklistViewProps) {
  const [projection, setProjection] = useState<UiCaseProjection | null>(null);
  const [initializing, setInitializing] = useState(false);
  const [busyDocumentId, setBusyDocumentId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const inputRefs = useRef(new Map<string, HTMLInputElement>());

  const activeChecklist = projection?.checklist ?? checklist;
  const documents = projection?.documents ?? [];
  const documentsByChecklistId = useMemo(() => {
    const map = new Map<string, UiCaseDocument>();
    for (const document of documents) {
      if (document.checklistDocumentId) map.set(document.checklistDocumentId, document);
    }
    return map;
  }, [documents]);

  async function ensureSession(): Promise<UiCaseProjection> {
    if (projection) return projection;
    setInitializing(true);
    setError(null);
    try {
      const created = await createCaseSession(operationSlug, answers);
      setProjection(created);
      return created;
    } finally {
      setInitializing(false);
    }
  }

  async function handleUpload(checklistDocumentId: string, file?: File): Promise<void> {
    if (!file) return;
    setBusyDocumentId(checklistDocumentId);
    setError(null);
    try {
      const current = await ensureSession();
      const next = await uploadCaseDocument({
        caseId: current.caseId,
        checklistDocumentId,
        file,
        expectedVersion: current.version,
      });
      setProjection(next);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Documentul nu a putut fi încărcat.");
    } finally {
      setBusyDocumentId(null);
      const input = inputRefs.current.get(checklistDocumentId);
      if (input) input.value = "";
    }
  }

  async function handleRemove(document: UiCaseDocument): Promise<void> {
    if (!projection || !window.confirm(`Ștergi fișierul „${document.fileName ?? "document"}”?`)) return;
    setBusyDocumentId(document.checklistDocumentId ?? document.id);
    setError(null);
    try {
      setProjection(await removeCaseDocument({
        caseId: projection.caseId,
        documentId: document.id,
        expectedVersion: projection.version,
      }));
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Documentul nu a putut fi șters.");
    } finally {
      setBusyDocumentId(null);
    }
  }

  return (
    <div className="checklist-shell">
      <a href={`/expert-dosar?operatiune=${encodeURIComponent(operationSlug)}`} className="expert-back">
        ← Modifică răspunsurile
      </a>

      <section className="checklist-card">
        <header className="checklist-header">
          <div>
            <p className="expert-eyebrow">Smart Checklist</p>
            <h1>{activeChecklist.operationTitle}</h1>
            <p>Încarcă documentele direct în listă. Scorul se actualizează automat.</p>
          </div>
          <div className="checklist-score" aria-label={`Completitudine ${activeChecklist.score}%`}>
            <strong>{activeChecklist.score}%</strong>
            <span>complet</span>
          </div>
        </header>

        <div className="checklist-metrics">
          <div><strong>{activeChecklist.requiredCount}</strong><span>documente necesare</span></div>
          <div><strong>{activeChecklist.completedRequiredCount}</strong><span>încărcate sau validate</span></div>
          <div><strong>{activeChecklist.missingRequiredCount}</strong><span>documente lipsă</span></div>
        </div>

        {error ? <div className="checklist-error" role="alert">{error}</div> : null}

        {activeChecklist.nextAction ? (
          <div className="checklist-next">
            <strong>Următorul pas</strong>
            <span>{activeChecklist.nextAction}</span>
          </div>
        ) : null}

        <div className="checklist-list">
          {activeChecklist.items.map((item) => {
            const uploaded = documentsByChecklistId.get(item.id);
            const isBusy = busyDocumentId === item.id || (initializing && !projection);
            const displayStatus = uploaded ? "uploaded" : item.status;
            return (
              <article key={item.id} className={`checklist-item status-${displayStatus}`}>
                <div className="checklist-icon" aria-hidden="true">
                  {displayStatus === "validated" ? "✓" : displayStatus === "uploaded" ? "↑" : displayStatus === "optional" ? "○" : "!"}
                </div>
                <div className="checklist-item-content">
                  <div className="checklist-item-heading">
                    <div>
                      <h2>{item.title}</h2>
                      {uploaded ? (
                        <p className="upload-file-meta">
                          <strong>{uploaded.fileName}</strong>
                          {uploaded.sizeBytes ? <span>{formatFileSize(uploaded.sizeBytes)}</span> : null}
                        </p>
                      ) : null}
                    </div>
                    <span>{uploaded ? "Încărcat" : statusLabel[item.status]}</span>
                  </div>
                  {item.description ? <p>{item.description}</p> : null}

                  <div className="upload-actions">
                    <input
                      ref={(node) => {
                        if (node) inputRefs.current.set(item.id, node);
                        else inputRefs.current.delete(item.id);
                      }}
                      className="upload-input-hidden"
                      type="file"
                      accept={acceptedFiles}
                      onChange={(event) => void handleUpload(item.id, event.target.files?.[0])}
                    />
                    <button
                      type="button"
                      className="upload-button primary"
                      disabled={isBusy}
                      onClick={() => inputRefs.current.get(item.id)?.click()}
                    >
                      {isBusy ? "Se încarcă…" : uploaded ? "Înlocuiește" : "Încarcă document"}
                    </button>
                    {uploaded && projection ? (
                      <>
                        <a
                          className="upload-button secondary"
                          href={`/api/case-files/${encodeURIComponent(projection.caseId)}/documents/${encodeURIComponent(uploaded.id)}/content`}
                          target="_blank"
                          rel="noreferrer"
                        >
                          Vezi
                        </a>
                        <button type="button" className="upload-button danger" disabled={isBusy} onClick={() => void handleRemove(uploaded)}>
                          Șterge
                        </button>
                      </>
                    ) : null}
                  </div>

                  <details>
                    <summary>De ce este necesar?</summary>
                    <p>{item.reason}</p>
                  </details>
                </div>
              </article>
            );
          })}
        </div>

        <footer className="checklist-actions">
          <a className="expert-button secondary checklist-link" href={`/expert-dosar?operatiune=${encodeURIComponent(operationSlug)}`}>
            Înapoi la Expert Dosar
          </a>
          <button className="expert-button primary" type="button" disabled={activeChecklist.missingRequiredCount > 0}>
            {activeChecklist.missingRequiredCount > 0 ? `Mai lipsesc ${activeChecklist.missingRequiredCount} documente` : "Continuă cu validarea"}
          </button>
        </footer>
      </section>
    </div>
  );
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
