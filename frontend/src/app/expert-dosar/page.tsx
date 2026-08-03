"use client";

import { ExpertDosar } from "@/components/expert/ExpertDosar";
import { useOperation } from "@/hooks/useOperation";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function ExpertDosarContent() {
  const searchParams = useSearchParams();
  const slug = searchParams.get("operatiune") ?? "transcriere-auto";
  const { operation, loading, error } = useOperation(slug);

  if (loading) {
    return <main className="expert-page"><div className="expert-state">Se încarcă Expert Dosar…</div></main>;
  }

  if (error || !operation) {
    return (
      <main className="expert-page">
        <div className="expert-state error">
          <h1>Operațiunea nu poate fi încărcată</h1>
          <p>{error ?? "Încearcă din nou."}</p>
          <a href="/operatiuni">Înapoi la operațiuni</a>
        </div>
      </main>
    );
  }

  return <main className="expert-page"><ExpertDosar operation={operation} /></main>;
}

export default function ExpertDosarPage() {
  return (
    <Suspense fallback={<main className="expert-page"><div className="expert-state">Se încarcă…</div></main>}>
      <ExpertDosarContent />
    </Suspense>
  );
}
