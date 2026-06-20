"use client";

import { useSearchParams } from "next/navigation";
import { buildDosar } from "@/rules";
import { useState } from "react";

const operationLabels: Record<string, string> = {
  "inmatriculare-definitiva": "Înmatriculare definitivă",
  "transcriere-auto": "Transcriere auto",
  "autorizatie-provizorie": "Autorizație provizorie",
  "radiere-vehicul": "Radiere vehicul",
  "modificare-date": "Modificare date",
  "duplicat-talon": "Duplicat talon",
};

function getBaseDocuments(operationSlug: string): string[] {
  switch (operationSlug) {
    case "inmatriculare-definitiva":
      return [
        "Cerere înmatriculare",
        "Carte identitate vehicul (CIV)",
        "Document proprietate / factură",
        "RCA valabil",
        "Dovadă plată certificat înmatriculare",
        "Dovadă plată plăcuțe",
      ];

    case "transcriere-auto":
      return [
        "Contract vânzare-cumpărare",
        "Carte identitate vehicul (CIV)",
        "Certificat de înmatriculare / talon",
        "RCA pe noul proprietar",
        "Certificat fiscal vânzător de la taxe și impozite locale",
      ];

    case "autorizatie-provizorie":
      return [
        "Cerere autorizare provizorie",
        "Document proprietate",
        "RCA provizorie",
        "Dovadă plată plăcuțe provizorii",
      ];

    case "radiere-vehicul":
      return [
        "Cerere radiere",
        "Certificat de înmatriculare",
        "Plăcuțe de înmatriculare",
        "Act justificativ radiere",
      ];

    case "modificare-date":
      return [
        "Cerere modificare date",
        "Certificat de înmatriculare vechi",
        "Document justificativ modificare",
        "CIV actualizat, dacă este cazul",
      ];

    case "duplicat-talon":
      return [
        "Cerere duplicat talon",
        "Declarație pierdere / furt / deteriorare",
        "Act identitate solicitant",
        "Dovadă plată duplicat",
      ];

    default:
      return ["Documente dosar auto"];
  }
}

function getPersonDocuments(personType: string): string[] {
  if (personType === "pj") {
    return [
      "Certificat de înregistrare firmă / CUI",
      "Certificat constatator ONRC",
      "Act identitate reprezentant legal",
    ];
  }

  return ["Carte identitate solicitant"];
}

function getOriginDocuments(origin: string): string[] {
  if (origin === "ue") {
    return [
      "Acte străine vehicul",
      "Certificat autenticitate RAR",
      "Certificat ANAF privind TVA, dacă este cazul",
      "Traduceri autorizate, dacă este cazul",
    ];
  }

  if (origin === "non-ue") {
    return [
      "Acte străine vehicul",
      "Documente vamale",
      "Dovadă achitare taxe vamale",
      "Certificat autenticitate RAR",
      "Traduceri autorizate",
    ];
  }

  return [];
}

function getProxyDocuments(proxy: string): string[] {
  if (proxy === "da") {
    return [
      "Împuternicire / procură",
      "Act identitate împuternicit",
    ];
  }

  return [];
}

function removeDuplicates(items: string[]): string[] {
  return Array.from(new Set(items));
}

export default function UploadPage() {
  const searchParams = useSearchParams();
 const operationSlug =
  searchParams.get("operatiune") || "transcriere-auto";

const personType =
  searchParams.get("tip") || "pf";

const origin =
  searchParams.get("origine") || "romania";

const proxy =
  searchParams.get("imputernicit") || "nu";

const sameCounty =
  searchParams.get("acelasiJudet") || "";

const plateStaysOnCar =
  searchParams.get("numarRamanePeMasina") || "";

const plateType =
  searchParams.get("tipPlacute") || "";

const reason =
  searchParams.get("motivRadiere") || "";

const vehicleCondition =
  searchParams.get("stareVehicul") || "";

const temporaryAuthNumber =
  searchParams.get("numarAutorizatieProvizorie") || "";

const modificationType =
  searchParams.get("tipModificare") || "";

const duplicateReason =
  searchParams.get("motivDuplicat") || "";

const operationTitle =
  operationLabels[operationSlug] || "Dosar auto";

const personLabel =
  personType === "pj" ? "Persoană juridică" : "Persoană fizică";

const originLabel =
  origin === "ue"
    ? "Uniunea Europeană"
    : origin === "non-ue"
    ? "Non-UE"
    : "România";

const proxyLabel =
  proxy === "da" ? "Cu împuternicit" : "Fără împuternicit";

const dosar = buildDosar(operationSlug, {
  personType,
  proxy,
  origin,
  sameCounty,
  plateStaysOnCar,
  plateType,
  reason,
  vehicleCondition,
  temporaryAuthNumber,
  modificationType,
  duplicateReason,
});

const documents = dosar.documents;
const taxes = dosar.taxes;
const forms = dosar.forms;

const [uploadedFiles, setUploadedFiles] = useState<
  Record<string, File | null>
>({});

function handleFileChange(
  documentName: string,
  file: File | null
) {
  setUploadedFiles((prev) => ({
    ...prev,
    [documentName]: file,
  }));
}

const uploadedCount =
  Object.values(uploadedFiles).filter(Boolean).length;
      
    return (
  <main
    style={{
      minHeight: "100vh",
      background: "#f4f7fb",
      padding: "50px 24px",
    }}
  >
      <div
        style={{
          maxWidth: "1000px",
          margin: "0 auto",
        }}
      >
        <a
          href={`/expert-dosar?operatiune=${operationSlug}`}
          style={{
            display: "inline-block",
            marginBottom: "24px",
            textDecoration: "none",
            color: "#374151",
          }}
        >
          ← Înapoi la Expert Dosar
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
          <h1
            style={{
              fontSize: "36px",
              marginBottom: "10px",
            }}
          >
            Upload documente
            <div
  style={{
    marginTop: "30px",
    padding: "20px",
    background: "#f9fafb",
    borderRadius: "12px",
    border: "1px solid #e5e7eb",
  }}
>
  <h3>Taxe estimate</h3>

  {taxes.map((tax: string) => (
    <div key={tax}>
      • {tax}
    </div>
  ))}
</div>
          </h1>

          <p
            style={{
              marginBottom: "8px",
              color: "#4b5563",
              fontSize: "17px",
            }}
          >
            Operațiune: <strong>{operationTitle}</strong>
          </p>

          <p
            style={{
              marginBottom: "8px",
              color: "#4b5563",
              fontSize: "17px",
            }}
          >
            Tip solicitant: <strong>{personLabel}</strong>
          </p>

          <p
            style={{
              marginBottom: "8px",
              color: "#4b5563",
              fontSize: "17px",
            }}
          >
            Origine vehicul: <strong>{originLabel}</strong>
          </p>

          <p
            style={{
              marginBottom: "28px",
              color: "#4b5563",
              fontSize: "17px",
            }}
          >
            Reprezentare: <strong>{proxyLabel}</strong>
          </p>

          <div
            style={{
              marginBottom: "24px",
              padding: "16px",
              background: "#f9fafb",
              borderRadius: "12px",
              border: "1px solid #e5e7eb",
            }}
          >
            <strong>Progres:</strong>{" "}
            {uploadedCount} / {documents.length} documente selectate
          </div>

          <div
            style={{
              display: "grid",
              gap: "16px",
            }}
          >
            {documents.map((documentName: string) => {
              const file = uploadedFiles[documentName];

              return (
                <div
                  key={documentName}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: "20px",
                    padding: "18px",
                    borderRadius: "12px",
                    background: "#f9fafb",
                    border: "1px solid #e5e7eb",
                  }}
                >
                  <div>
                    <div
                      style={{
                        fontWeight: "bold",
                        marginBottom: "6px",
                      }}
                    >
                      {documentName}
                    </div>

                    <div
                      style={{
                        color: file
                          ? "#047857"
                          : "#9ca3af",
                      }}
                    >
                      {file
                        ? file.name
                        : "Niciun fișier selectat"}
                    </div>
                  </div>

                  <label
                    style={{
                      background: "#111827",
                      color: "white",
                      padding: "12px 18px",
                      borderRadius: "10px",
                      cursor: "pointer",
                      whiteSpace: "nowrap",
                    }}
                  >
                    Alege fișier

                    <input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      style={{ display: "none" }}
                      onChange={(e) =>
                        handleFileChange(
                          documentName,
                          e.target.files?.[0] || null
                        )
                      }
                    />
                  </label>
                </div>
              );
            })}
          </div>

          <div
            style={{
              marginTop: "30px",
              display: "flex",
              justifyContent: "space-between",
              gap: "16px",
            }}
          >
            <a
              href={`/expert-dosar?operatiune=${operationSlug}`}
              style={{
                textDecoration: "none",
                padding: "14px 22px",
                border: "1px solid #d1d5db",
                borderRadius: "10px",
                color: "#111827",
                background: "white",
              }}
            >
              Modifică răspunsurile
            </a>

            <button
              style={{
                padding: "14px 22px",
                borderRadius: "10px",
                border: "none",
                background:
                  uploadedCount > 0
                    ? "#111827"
                    : "#9ca3af",
                color: "white",
                cursor:
                  uploadedCount > 0
                    ? "pointer"
                    : "not-allowed",
              }}
              disabled={uploadedCount === 0}
              onClick={() => {
                const previewData = {
                  operationSlug,
                  operationTitle,
                  personType,
                  personLabel,
                  origin,
                  originLabel,
                  proxy,
                  proxyLabel,
                  documents: documents.map(
                    (documentName: string) => ({
                      name: documentName,
                      fileName:
                        uploadedFiles[
                          documentName
                        ]?.name || null,
                      uploaded: Boolean(
                        uploadedFiles[
                          documentName
                        ]
                      ),
                    })
                  ),
                };

                localStorage.setItem(
                  "autoDosarPreview",
                  JSON.stringify(previewData)
                );

                window.location.href =
                  "/preview";
              }}
            >
              Continuă
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}