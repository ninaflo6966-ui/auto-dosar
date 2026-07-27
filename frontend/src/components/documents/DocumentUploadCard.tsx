"use client";

import { ChangeEvent, useRef } from "react";

export interface UploadedFileInfo {
  fileName: string;
  fileSize: string;
  detectedType: string;
  confidence: number;
}

interface DocumentUploadCardProps {
  id: string;
  icon: string;
  title: string;
  description: string;
  document: UploadedFileInfo | null;
  onFileSelected: (id: string, file: File) => void;
}

export default function DocumentUploadCard({
  id,
  icon,
  title,
  description,
  document,
  onFileSelected,
}: DocumentUploadCardProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (file) {
      onFileSelected(id, file);
    }

    event.target.value = "";
  }

  return (
    <article
      style={{
        border: document ? "1px solid #86c9a4" : "1px solid #d9e0e8",
        borderRadius: 16,
        padding: 20,
        background: document ? "#f3fbf6" : "#ffffff",
        boxShadow: "0 8px 24px rgba(24, 39, 75, 0.06)",
      }}
    >
      <input
        ref={inputRef}
        type="file"
        accept=".pdf,image/*"
        onChange={handleChange}
        hidden
      />

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: 16,
          alignItems: "flex-start",
        }}
      >
        <div>
          <div style={{ fontSize: 30, marginBottom: 10 }}>{icon}</div>

          <h3 style={{ margin: 0, fontSize: 19 }}>{title}</h3>

          <p
            style={{
              margin: "7px 0 0",
              color: "#667085",
              lineHeight: 1.5,
            }}
          >
            {description}
          </p>
        </div>

        <span
          style={{
            whiteSpace: "nowrap",
            borderRadius: 999,
            padding: "6px 10px",
            fontSize: 13,
            fontWeight: 700,
            background: document ? "#dff4e7" : "#f1f3f6",
            color: document ? "#187443" : "#667085",
          }}
        >
          {document ? "Încărcat" : "Lipsește"}
        </span>
      </div>

      {document ? (
        <div
          style={{
            marginTop: 18,
            padding: 14,
            borderRadius: 12,
            background: "#ffffff",
            border: "1px solid #d9eadf",
          }}
        >
          <strong style={{ display: "block", wordBreak: "break-word" }}>
            {document.fileName}
          </strong>

          <div
            style={{
              marginTop: 8,
              color: "#52606d",
              fontSize: 14,
              lineHeight: 1.6,
            }}
          >
            <div>Dimensiune: {document.fileSize}</div>
            <div>Tip detectat: {document.detectedType}</div>
            <div>Încredere: {document.confidence}%</div>
          </div>

          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            style={{
              marginTop: 13,
              border: "none",
              background: "transparent",
              padding: 0,
              color: "#1769aa",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Înlocuiește documentul
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          style={{
            width: "100%",
            marginTop: 20,
            padding: "12px 16px",
            border: "1px solid #1769aa",
            borderRadius: 10,
            background: "#1769aa",
            color: "#ffffff",
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          + Încarcă document
        </button>
      )}
    </article>
  );
}