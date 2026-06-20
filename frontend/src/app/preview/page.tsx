"use client";

import { useEffect, useState } from "react";

type PreviewDocument = {
  name: string;
  fileName: string | null;
  uploaded: boolean;
};

type PreviewData = {
  operationSlug: string;
  operationTitle: string;
  documents: PreviewDocument[];
  taxes?: string[];
  forms?: string[];
};

export default function PreviewPage() {
  const [data, setData] = useState<PreviewData | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("autoDosarPreview");
    if (saved) {
      setData(JSON.parse(saved));
    }
  }, []);

  if (!data) {
    return (
      <main style={{ minHeight: "100vh", background: "#f4f7fb", padding: "60px 24px" }}>
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
          <h1>Nu există date de preview.</h1>
          <a href="/operatiuni">Înapoi la operațiuni</a>
        </div>
      </main>
    );
  }

  const uploadedCount = data.documents.filter((doc) => doc.uploaded).length;
  const totalCount = data.documents.length;
  const completionPercent =
    totalCount > 0 ? Math.round((uploadedCount / totalCount) * 100) : 0;
  const isComplete = uploadedCount === totalCount;

  const taxes = data.taxes || [];
  const forms = data.forms || [];

  return (
    <main style={{ minHeight: "100vh", background: "#f4f7fb", padding: "50px 24px" }}>
      <div style={{ maxWidth: "1050px", margin: "0 auto" }}>
        <a
          href={`/upload?operatiune=${data.operationSlug}`}
          style={{
            display: "inline-block",
            marginBottom: "24px",
            color: "#374151",
            textDecoration: "none",
          }}
        >
          ← Înapoi la upload
        </a>

        <div
          style={{
            background: "white",
            borderRadius: "24px",
            padding: "36px",
            border: "1px solid #e5e7eb",
            boxShadow: "0 10px 25px rgba(15, 23, 42, 0.06)",
          }}
        >
          <h1 style={{ fontSize: "38px", marginBottom: "12px" }}>
            Preview dosar
          </h1>

          <p style={{ fontSize: "18px", color: "#4b5563", marginBottom: "8px" }}>
            Operațiune: <strong>{data.operationTitle}</strong>
          </p>

          <div
            style={{
              marginTop: "24px",
              marginBottom: "28px",
              padding: "18px",
              borderRadius: "14px",
              background: isComplete ? "#ecfdf5" : "#fffbeb",
              border: isComplete ? "1px solid #a7f3d0" : "1px solid #fde68a",
              color: isComplete ? "#065f46" : "#92400e",
              fontWeight: "bold",
            }}
          >
            Status dosar:{" "}
            {isComplete
              ? "Complet pentru această etapă"
              : `Incomplet – ${uploadedCount}/${totalCount} documente selectate`}
            <div style={{ marginTop: "8px" }}>
              Grad completare: {completionPercent}%
            </div>
          </div>

          <SectionTitle title="Documente necesare" />

          <div style={{ display: "grid", gap: "14px" }}>
            {data.documents.map((doc) => (
              <StatusRow
                key={doc.name}
                title={doc.name}
                subtitle={doc.uploaded ? `Fișier selectat: ${doc.fileName}` : "Lipsă"}
                status={doc.uploaded ? "OK" : "Lipsă"}
                success={doc.uploaded}
              />
            ))}
          </div>

          <SectionTitle title="Taxe estimate" />

          {taxes.length > 0 ? (
            <div style={{ display: "grid", gap: "12px" }}>
              {taxes.map((tax) => (
                <SimpleRow key={tax} text={tax} />
              ))}
            </div>
          ) : (
            <EmptyText text="Nu există taxe estimate pentru această etapă." />
          )}

          <SectionTitle title="Formulare generate" />

          {forms.length > 0 ? (
            <div style={{ display: "grid", gap: "12px" }}>
              {forms.map((form) => (
                <SimpleRow key={form} text={form} />
              ))}
            </div>
          ) : (
            <EmptyText text="Nu există formulare generate pentru această etapă." />
          )}

          <div
            style={{
              marginTop: "32px",
              display: "flex",
              justifyContent: "space-between",
              gap: "16px",
            }}
          >
            <a
              href={`/upload?operatiune=${data.operationSlug}`}
              style={{
                padding: "14px 22px",
                borderRadius: "10px",
                border: "1px solid #d1d5db",
                background: "white",
                color: "#111827",
                textDecoration: "none",
              }}
            >
              Modifică documentele
            </a>

            <button
              style={{
                padding: "14px 22px",
                borderRadius: "10px",
                border: "none",
                background: isComplete ? "#111827" : "#9ca3af",
                color: "white",
                cursor: isComplete ? "pointer" : "not-allowed",
              }}
              disabled={!isComplete}
              onClick={() => alert("Următorul pas va fi generarea PDF-ului.")}
            >
              Generează dosar PDF
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}

function SectionTitle({ title }: { title: string }) {
  return (
    <h2
      style={{
        fontSize: "24px",
        marginTop: "34px",
        marginBottom: "18px",
      }}
    >
      {title}
    </h2>
  );
}

function StatusRow({
  title,
  subtitle,
  status,
  success,
}: {
  title: string;
  subtitle: string;
  status: string;
  success: boolean;
}) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "18px",
        borderRadius: "14px",
        background: "#f9fafb",
        border: "1px solid #e5e7eb",
      }}
    >
      <div>
        <div style={{ fontSize: "17px", fontWeight: "bold" }}>{title}</div>
        <div
          style={{
            marginTop: "6px",
            color: success ? "#047857" : "#9ca3af",
          }}
        >
          {subtitle}
        </div>
      </div>

      <div
        style={{
          padding: "8px 12px",
          borderRadius: "999px",
          background: success ? "#d1fae5" : "#fee2e2",
          color: success ? "#065f46" : "#991b1b",
          fontWeight: "bold",
          fontSize: "14px",
        }}
      >
        {status}
      </div>
    </div>
  );
}

function SimpleRow({ text }: { text: string }) {
  return (
    <div
      style={{
        padding: "16px",
        borderRadius: "12px",
        background: "#f9fafb",
        border: "1px solid #e5e7eb",
      }}
    >
      ✓ {text}
    </div>
  );
}

function EmptyText({ text }: { text: string }) {
  return (
    <div
      style={{
        padding: "16px",
        borderRadius: "12px",
        background: "#f9fafb",
        border: "1px solid #e5e7eb",
        color: "#6b7280",
      }}
    >
      {text}
    </div>
  );
}