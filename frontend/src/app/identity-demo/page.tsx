"use client";

import { useState } from "react";

type IdentityAnalysisResult = {
  identityCard: {
    documentType?: string;
    series?: string;
    number?: string;
    cnp?: string;
    lastName?: string;
    firstName?: string;
    address?: string;
    issuingAuthority?: string;
    validFrom?: string;
    validUntil?: string;
    confidence?: number;
  };
  validation: {
    isValid: boolean;
    errors: {
      field: string;
      message: string;
      severity: "error" | "warning";
    }[];
    warnings: {
      field: string;
      message: string;
      severity: "error" | "warning";
    }[];
    score: number;
  };
};

const sampleText = `ROMANIA
CARTE DE IDENTITATE

SERIA CJ NR 123456

CNP 1900512123451

NUME: POPESCU
PRENUME: ION

DOMICILIU: MUN. CLUJ-NAPOCA, STR. EXEMPLU NR. 10, AP. 3

EMIS DE SPCLEP CLUJ-NAPOCA

VALABIL 01.01.2020 01.01.2030`;

export default function IdentityDemoPage() {
  const [rawText, setRawText] = useState(sampleText);
  const [result, setResult] = useState<IdentityAnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function analyzeIdentity() {
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const response = await fetch("/api/identity/analyze-text", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ rawText }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Analiza a eșuat.");
      }

      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Eroare necunoscută.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={{ padding: 32, maxWidth: 1100, margin: "0 auto" }}>
      <h1 style={{ fontSize: 36, marginBottom: 8 }}>
        AutoDosar – Identity Demo
      </h1>

      <p style={{ fontSize: 18, color: "#555", marginBottom: 24 }}>
        Primul demo ADI Core: text OCR → parser → validator → date identitate.
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 24,
          alignItems: "start",
        }}
      >
        <section>
          <h2>Text OCR</h2>

          <textarea
            value={rawText}
            onChange={(event) => setRawText(event.target.value)}
            rows={18}
            style={{
              width: "100%",
              padding: 16,
              fontSize: 14,
              borderRadius: 12,
              border: "1px solid #ccc",
              fontFamily: "monospace",
            }}
          />

          <button
            onClick={analyzeIdentity}
            disabled={loading}
            style={{
              marginTop: 16,
              padding: "12px 18px",
              borderRadius: 10,
              border: "none",
              cursor: loading ? "not-allowed" : "pointer",
              fontWeight: 700,
            }}
          >
            {loading ? "Se analizează..." : "Analizează identitatea"}
          </button>

          {error && (
            <p style={{ color: "crimson", marginTop: 16 }}>
              {error}
            </p>
          )}
        </section>

        <section>
          <h2>Rezultat</h2>

          {!result && (
            <div
              style={{
                padding: 20,
                border: "1px dashed #aaa",
                borderRadius: 12,
                color: "#666",
              }}
            >
              Apasă „Analizează identitatea” pentru a vedea rezultatul.
            </div>
          )}

          {result && (
            <div
              style={{
                padding: 20,
                border: "1px solid #ddd",
                borderRadius: 12,
              }}
            >
              <h3>
                Status:{" "}
                <span
                  style={{
                    color: result.validation.isValid ? "green" : "crimson",
                  }}
                >
                  {result.validation.isValid ? "Valid" : "Invalid"}
                </span>
              </h3>

              <p>
                Scor validare: <strong>{result.validation.score}</strong>
              </p>

              <hr />

              <p><strong>Tip document:</strong> {result.identityCard.documentType}</p>
              <p><strong>Serie:</strong> {result.identityCard.series}</p>
              <p><strong>Număr:</strong> {result.identityCard.number}</p>
              <p><strong>CNP:</strong> {result.identityCard.cnp}</p>
              <p><strong>Nume:</strong> {result.identityCard.lastName}</p>
              <p><strong>Prenume:</strong> {result.identityCard.firstName}</p>
              <p><strong>Adresă:</strong> {result.identityCard.address}</p>
              <p><strong>Emitent:</strong> {result.identityCard.issuingAuthority}</p>
              <p><strong>Valabil de la:</strong> {result.identityCard.validFrom}</p>
              <p><strong>Valabil până la:</strong> {result.identityCard.validUntil}</p>
              <p><strong>Confidence:</strong> {result.identityCard.confidence}</p>

              {result.validation.errors.length > 0 && (
                <>
                  <h4>Erori</h4>
                  <ul>
                    {result.validation.errors.map((issue, index) => (
                      <li key={index}>{issue.message}</li>
                    ))}
                  </ul>
                </>
              )}

              {result.validation.warnings.length > 0 && (
                <>
                  <h4>Avertismente</h4>
                  <ul>
                    {result.validation.warnings.map((issue, index) => (
                      <li key={index}>{issue.message}</li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}