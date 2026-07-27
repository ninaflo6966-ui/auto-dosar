"use client";

import { useState } from "react";
import type {
  GenerateCaseResponse,
  GeneratedDocumentDestination,
} from "@/types/generation";
import type {
  OwnershipMode,
  SellerType,
} from "@/types/operation";

interface CaseGenerationPanelProps {
  sellerType: SellerType;
  ownershipMode: OwnershipMode;
  documentTypes: string[];
  uploadedDocumentCount: number;
  requiredDocumentCount: number;
}

function getDestinationLabel(
  destination: GeneratedDocumentDestination
): string {
  if (destination === "LOCAL_TAX") {
    return "Taxe și Impozite";
  }

  if (destination === "DGPCI") {
    return "DGPCI";
  }

  return "Taxe și Impozite + DGPCI";
}

export default function CaseGenerationPanel({
  sellerType,
  ownershipMode,
  documentTypes,
  uploadedDocumentCount,
  requiredDocumentCount,
}: CaseGenerationPanelProps) {
  const [result, setResult] =
    useState<GenerateCaseResponse | null>(null);

  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState("");

  const allDocumentsUploaded =
    requiredDocumentCount > 0 &&
    uploadedDocumentCount === requiredDocumentCount;

  async function generateCase() {
    try {
      setGenerating(true);
      setError("");
      setResult(null);

      const response = await fetch("/api/transcriere/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sellerType,
          ownershipMode,
          documentTypes,
        }),
      });

      const data = (await response.json()) as GenerateCaseResponse;

      if (!response.ok) {
        throw new Error(
          data.error || "Dosarul nu a putut fi generat."
        );
      }

      setResult(data);
    } catch (generationError) {
      console.error(generationError);

      setError(
        generationError instanceof Error
          ? generationError.message
          : "A apărut o eroare la generarea dosarului."
      );
    } finally {
      setGenerating(false);
    }
  }

  return (
    <section style={panelStyle}>
      <h2 style={{ marginTop: 0 }}>5. Generarea dosarului</h2>

      <p
        style={{
          color: "#667085",
          lineHeight: 1.55,
          marginBottom: 20,
        }}
      >
        AutoDosar va pregăti separat documentele pentru Taxe și
        Impozite și documentele pentru transcriere.
      </p>

      {!allDocumentsUploaded && (
        <div style={warningStyle}>
          Ai încărcat {uploadedDocumentCount} din{" "}
          {requiredDocumentCount} documente solicitate. În versiunea
          demonstrativă poți genera structura dosarului și înainte de
          completarea tuturor documentelor.
        </div>
      )}

      <button
        type="button"
        onClick={generateCase}
        disabled={generating}
        style={{
          width: "100%",
          padding: "15px 20px",
          border: "none",
          borderRadius: 12,
          background: generating ? "#8baac2" : "#1769aa",
          color: "#ffffff",
          fontSize: 17,
          fontWeight: 800,
          cursor: generating ? "wait" : "pointer",
        }}
      >
        {generating
          ? "Se generează dosarul..."
          : "✨ Generează dosarul"}
      </button>

      {error && <div style={errorStyle}>{error}</div>}

      {result && (
        <div style={resultStyle}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: 16,
              flexWrap: "wrap",
              marginBottom: 18,
            }}
          >
            <div>
              <strong style={{ fontSize: 18 }}>
                Structura dosarului a fost generată
              </strong>

              <div style={{ marginTop: 5, color: "#52606d" }}>
                Referință: {result.caseReference}
              </div>
            </div>

            <span style={generatedBadgeStyle}>Generat</span>
          </div>

          <div style={{ display: "grid", gap: 12 }}>
            {result.generatedDocuments.map((document) => (
              <div key={document.id} style={documentCardStyle}>
                <strong>{document.title}</strong>

                <div
                  style={{
                    marginTop: 7,
                    display: "flex",
                    gap: 8,
                    flexWrap: "wrap",
                    color: "#52606d",
                    fontSize: 14,
                  }}
                >
                  <span>
                    Destinație:{" "}
                    {getDestinationLabel(document.destination)}
                  </span>

                  <span>•</span>

                  <span>
                    Status:{" "}
                    {document.status === "READY"
                      ? "Pregătit"
                      : "Așteaptă datele extrase"}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <p
            style={{
              margin: "18px 0 0",
              color: "#52606d",
              lineHeight: 1.5,
            }}
          >
            {result.message}
          </p>
        </div>
      )}
    </section>
  );
}

const panelStyle: React.CSSProperties = {
  marginBottom: 28,
  padding: "26px 28px",
  borderRadius: 18,
  background: "#ffffff",
  boxShadow: "0 10px 30px rgba(24, 39, 75, 0.07)",
};

const warningStyle: React.CSSProperties = {
  marginBottom: 18,
  padding: 14,
  borderRadius: 12,
  background: "#fff8dc",
  border: "1px solid #e6d690",
};

const errorStyle: React.CSSProperties = {
  marginTop: 18,
  padding: 14,
  borderRadius: 12,
  background: "#fff2f2",
  border: "1px solid #f2b8b8",
  color: "#a12626",
};

const resultStyle: React.CSSProperties = {
  marginTop: 22,
  padding: 20,
  borderRadius: 14,
  border: "1px solid #b9dfc8",
  background: "#f3fbf6",
};

const generatedBadgeStyle: React.CSSProperties = {
  alignSelf: "flex-start",
  padding: "6px 11px",
  borderRadius: 999,
  background: "#dff4e7",
  color: "#187443",
  fontWeight: 800,
};

const documentCardStyle: React.CSSProperties = {
  padding: 15,
  borderRadius: 12,
  background: "#ffffff",
  border: "1px solid #d9eadf",
};
