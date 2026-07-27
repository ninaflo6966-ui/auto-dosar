"use client";

import { useState } from "react";
import Tesseract from "tesseract.js";

type FileState = File | null;

function formatDateInput(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 8);

  if (digits.length <= 2) {
    return digits;
  }

  if (digits.length <= 4) {
    return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  }

  return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
}

export default function ContractITLPage() {
  const [buyerPersonType, setBuyerPersonType] = useState<"pf" | "pj" | "">("");

  const [ocrText, setOcrText] = useState("");
  const [isOcrLoading, setIsOcrLoading] = useState(false);

  const [buyerIdType, setBuyerIdType] = useState<"ci" | "cie" | "">("");
  const [sellerIdType, setSellerIdType] = useState<"ci" | "cie" | "">("");

  const [buyerIdFront, setBuyerIdFront] = useState<FileState>(null);
  const [buyerIdBack, setBuyerIdBack] = useState<FileState>(null);
  const [buyerResidenceProof, setBuyerResidenceProof] = useState<FileState>(null);
  const [buyerCompanyCertificate, setBuyerCompanyCertificate] = useState<FileState>(null);
  const [buyerLegalRepresentativeId, setBuyerLegalRepresentativeId] = useState<FileState>(null);

  const [sellerIdFront, setSellerIdFront] = useState<FileState>(null);
  const [sellerIdBack, setSellerIdBack] = useState<FileState>(null);
  const [sellerResidenceProof, setSellerResidenceProof] = useState<FileState>(null);

  const [vehicleCiv, setVehicleCiv] = useState<FileState>(null);

  const [salePrice, setSalePrice] = useState("");
  const [contractDate, setContractDate] = useState("");
  const [contractPlace, setContractPlace] = useState("");

  const buyerIndividualComplete =
    buyerIdType === "ci"
      ? buyerIdFront
      : buyerIdType === "cie"
      ? buyerIdFront && buyerIdBack && buyerResidenceProof
      : false;

  const sellerComplete =
    sellerIdType === "ci"
      ? sellerIdFront
      : sellerIdType === "cie"
      ? sellerIdFront && sellerIdBack && sellerResidenceProof
      : false;

  const buyerComplete =
    buyerPersonType === "pf"
      ? buyerIndividualComplete
      : buyerPersonType === "pj"
      ? buyerCompanyCertificate && buyerLegalRepresentativeId
      : false;

  const contractDataComplete = salePrice && contractDate.length === 10 && contractPlace;

  const canContinue =
    buyerComplete && sellerComplete && vehicleCiv && contractDataComplete;

  function resetBuyerFiles() {
    setBuyerIdType("");
    setBuyerIdFront(null);
    setBuyerIdBack(null);
    setBuyerResidenceProof(null);
    setBuyerCompanyCertificate(null);
    setBuyerLegalRepresentativeId(null);
    setOcrText("");
  }

  async function testOCR() {
    if (!buyerIdFront) {
      alert("Încarcă întâi cartea de identitate a cumpărătorului.");
      return;
    }

    try {
      setIsOcrLoading(true);
      setOcrText("");

      const result = await Tesseract.recognize(
        buyerIdFront,
        "ron"
      );

      console.log(result.data.text);
      setOcrText(result.data.text);
      alert("OCR finalizat");
    } catch (error) {
      console.error(error);
      alert("Eroare OCR");
    } finally {
      setIsOcrLoading(false);
    }
  }

  function saveAndContinue() {
    const data = {
      buyerPersonType,
      sellerPersonType: "pf",
      buyerIdType,
      sellerIdType,
      salePrice,
      contractDate,
      contractPlace,
      ocr: {
        buyerIdFrontText: ocrText || null,
      },
      files: {
        buyerIdFront: buyerIdFront?.name || null,
        buyerIdBack: buyerIdBack?.name || null,
        buyerResidenceProof: buyerResidenceProof?.name || null,
        buyerCompanyCertificate: buyerCompanyCertificate?.name || null,
        buyerLegalRepresentativeId: buyerLegalRepresentativeId?.name || null,

        sellerIdFront: sellerIdFront?.name || null,
        sellerIdBack: sellerIdBack?.name || null,
        sellerResidenceProof: sellerResidenceProof?.name || null,

        vehicleCiv: vehicleCiv?.name || null,
      },
    };

    localStorage.setItem("autoDosarContractITL", JSON.stringify(data));
    window.location.href = "/contract-itl/review";
  }

  return (
    <main style={{ minHeight: "100vh", background: "#f4f7fb", padding: "50px 24px" }}>
      <div style={{ maxWidth: "1050px", margin: "0 auto" }}>
        <a href="/" style={{ textDecoration: "none", color: "#374151" }}>
          ← Înapoi acasă
        </a>

        <div
          style={{
            marginTop: "24px",
            background: "white",
            borderRadius: "24px",
            padding: "36px",
            border: "1px solid #e5e7eb",
            boxShadow: "0 10px 25px rgba(15, 23, 42, 0.06)",
          }}
        >
          <h1 style={{ fontSize: "38px", marginBottom: "12px" }}>
            Contract ITL-054
          </h1>

          <p style={{ fontSize: "18px", color: "#4b5563", marginBottom: "30px" }}>
            Încarcă actele cumpărătorului, actul vânzătorului persoană fizică și CIV-ul vehiculului.
            Datele vor fi extrase automat și verificate înainte de generarea contractului.
          </p>

          <Section title="1. Date contract">
            <InputField
              label="Preț vânzare"
              placeholder="ex. 25000"
              value={salePrice}
              onChange={(value) => setSalePrice(value.replace(/\D/g, ""))}
            />

            <label style={{ display: "grid", gap: "6px", color: "#374151" }}>
              Data încheierii contractului
              <input
                value={contractDate}
                placeholder="zz/ll/aaaa"
                maxLength={10}
                onChange={(event) =>
                  setContractDate(formatDateInput(event.target.value))
                }
                style={{
                  padding: "12px",
                  borderRadius: "10px",
                  border: "1px solid #d1d5db",
                  fontSize: "16px",
                }}
              />
              <span style={{ color: "#6b7280", fontSize: "14px" }}>
                Introdu doar cifrele. Exemplu: 22062026 devine 22/06/2026.
              </span>
            </label>

            <InputField
              label="Locul încheierii contractului"
              placeholder="ex. Cluj-Napoca"
              value={contractPlace}
              onChange={setContractPlace}
            />
          </Section>

          <Section title="2. Cumpărător">
            <PersonTypeSelector
              value={buyerPersonType}
              onChange={(value) => {
                setBuyerPersonType(value);
                resetBuyerFiles();
              }}
            />

            {buyerPersonType === "pf" && (
              <>
                <IdentityTypeSelector
                  value={buyerIdType}
                  onChange={(value) => {
                    setBuyerIdType(value);
                    setBuyerIdFront(null);
                    setBuyerIdBack(null);
                    setBuyerResidenceProof(null);
                    setOcrText("");
                  }}
                />

                {buyerIdType === "ci" && (
                  <UploadCard
                    title="Carte identitate cumpărător - față"
                    file={buyerIdFront}
                    onChange={(file) => {
                      setBuyerIdFront(file);
                      setOcrText("");
                    }}
                  />
                )}

                {buyerIdType === "cie" && (
                  <>
                    <UploadCard
                      title="Carte identitate electronică cumpărător - față"
                      file={buyerIdFront}
                      onChange={(file) => {
                        setBuyerIdFront(file);
                        setOcrText("");
                      }}
                    />
                    <UploadCard
                      title="Carte identitate electronică cumpărător - spate"
                      file={buyerIdBack}
                      onChange={setBuyerIdBack}
                    />
                    <UploadCard
                      title="Adeverință domiciliu cumpărător"
                      file={buyerResidenceProof}
                      onChange={setBuyerResidenceProof}
                    />
                  </>
                )}

                {buyerIdFront && (
                  <button
                    type="button"
                    onClick={testOCR}
                    disabled={isOcrLoading}
                    style={{
                      marginTop: "12px",
                      padding: "14px 22px",
                      borderRadius: "10px",
                      border: "none",
                      background: isOcrLoading ? "#9ca3af" : "#2563eb",
                      color: "white",
                      cursor: isOcrLoading ? "not-allowed" : "pointer",
                      fontSize: "16px",
                    }}
                  >
                    {isOcrLoading ? "Se citește documentul..." : "Test OCR act cumpărător"}
                  </button>
                )}

                {ocrText && (
                  <div
                    style={{
                      marginTop: "20px",
                      padding: "16px",
                      background: "#f3f4f6",
                      borderRadius: "10px",
                      whiteSpace: "pre-wrap",
                      maxHeight: "300px",
                      overflow: "auto",
                      border: "1px solid #e5e7eb",
                    }}
                  >
                    {ocrText}
                  </div>
                )}
              </>
            )}

            {buyerPersonType === "pj" && (
              <>
                <UploadCard
                  title="Certificat de înregistrare firmă cumpărător / CUI"
                  file={buyerCompanyCertificate}
                  onChange={setBuyerCompanyCertificate}
                />
                <UploadCard
                  title="Act identitate reprezentant legal cumpărător"
                  file={buyerLegalRepresentativeId}
                  onChange={setBuyerLegalRepresentativeId}
                />
              </>
            )}
          </Section>

          <Section title="3. Vânzător persoană fizică">
            <IdentityTypeSelector
              value={sellerIdType}
              onChange={(value) => {
                setSellerIdType(value);
                setSellerIdFront(null);
                setSellerIdBack(null);
                setSellerResidenceProof(null);
              }}
            />

            {sellerIdType === "ci" && (
              <UploadCard
                title="Carte identitate vânzător - față"
                file={sellerIdFront}
                onChange={setSellerIdFront}
              />
            )}

            {sellerIdType === "cie" && (
              <>
                <UploadCard
                  title="Carte identitate electronică vânzător - față"
                  file={sellerIdFront}
                  onChange={setSellerIdFront}
                />
                <UploadCard
                  title="Carte identitate electronică vânzător - spate"
                  file={sellerIdBack}
                  onChange={setSellerIdBack}
                />
                <UploadCard
                  title="Adeverință domiciliu vânzător"
                  file={sellerResidenceProof}
                  onChange={setSellerResidenceProof}
                />
              </>
            )}
          </Section>

          <Section title="4. Vehicul">
            <UploadCard
              title="Carte identitate vehicul - CIV"
              file={vehicleCiv}
              onChange={setVehicleCiv}
            />
          </Section>

          <div
            style={{
              marginTop: "30px",
              padding: "18px",
              borderRadius: "14px",
              background: canContinue ? "#ecfdf5" : "#fffbeb",
              border: canContinue ? "1px solid #a7f3d0" : "1px solid #fde68a",
              color: canContinue ? "#065f46" : "#92400e",
              fontWeight: "bold",
            }}
          >
            {canContinue
              ? "Documentele și datele contractului sunt completate. Poți continua."
              : "Completează prețul, data, locul și încarcă documentele obligatorii."}
          </div>

          <button
            disabled={!canContinue}
            onClick={saveAndContinue}
            style={{
              marginTop: "24px",
              padding: "14px 22px",
              borderRadius: "10px",
              border: "none",
              background: canContinue ? "#111827" : "#9ca3af",
              color: "white",
              cursor: canContinue ? "pointer" : "not-allowed",
              fontSize: "16px",
            }}
          >
            Continuă la extragerea datelor
          </button>
        </div>
      </div>
    </main>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section style={{ marginTop: "34px" }}>
      <h2 style={{ fontSize: "24px", marginBottom: "16px" }}>{title}</h2>
      <div style={{ display: "grid", gap: "14px" }}>{children}</div>
    </section>
  );
}

function InputField({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <label style={{ display: "grid", gap: "6px", color: "#374151" }}>
      {label}
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        style={{
          padding: "12px",
          borderRadius: "10px",
          border: "1px solid #d1d5db",
          fontSize: "16px",
        }}
      />
    </label>
  );
}

function PersonTypeSelector({
  value,
  onChange,
}: {
  value: "pf" | "pj" | "";
  onChange: (value: "pf" | "pj") => void;
}) {
  return (
    <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
      <button
        type="button"
        onClick={() => onChange("pf")}
        style={{
          padding: "12px 18px",
          borderRadius: "12px",
          border: value === "pf" ? "2px solid #111827" : "1px solid #d1d5db",
          background: value === "pf" ? "#111827" : "white",
          color: value === "pf" ? "white" : "#111827",
          cursor: "pointer",
        }}
      >
        Persoană fizică
      </button>

      <button
        type="button"
        onClick={() => onChange("pj")}
        style={{
          padding: "12px 18px",
          borderRadius: "12px",
          border: value === "pj" ? "2px solid #111827" : "1px solid #d1d5db",
          background: value === "pj" ? "#111827" : "white",
          color: value === "pj" ? "white" : "#111827",
          cursor: "pointer",
        }}
      >
        Persoană juridică
      </button>
    </div>
  );
}

function IdentityTypeSelector({
  value,
  onChange,
}: {
  value: "ci" | "cie" | "";
  onChange: (value: "ci" | "cie") => void;
}) {
  return (
    <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
      <button
        type="button"
        onClick={() => onChange("ci")}
        style={{
          padding: "12px 18px",
          borderRadius: "12px",
          border: value === "ci" ? "2px solid #111827" : "1px solid #d1d5db",
          background: value === "ci" ? "#111827" : "white",
          color: value === "ci" ? "white" : "#111827",
          cursor: "pointer",
        }}
      >
        Carte de identitate
      </button>

      <button
        type="button"
        onClick={() => onChange("cie")}
        style={{
          padding: "12px 18px",
          borderRadius: "12px",
          border: value === "cie" ? "2px solid #111827" : "1px solid #d1d5db",
          background: value === "cie" ? "#111827" : "white",
          color: value === "cie" ? "white" : "#111827",
          cursor: "pointer",
        }}
      >
        Carte de identitate electronică
      </button>
    </div>
  );
}

function UploadCard({
  title,
  file,
  onChange,
}: {
  title: string;
  file: FileState;
  onChange: (file: FileState) => void;
}) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: "20px",
        padding: "18px",
        borderRadius: "14px",
        background: "#f9fafb",
        border: "1px solid #e5e7eb",
      }}
    >
      <div>
        <div style={{ fontWeight: "bold", marginBottom: "6px" }}>{title}</div>
        <div style={{ color: file ? "#047857" : "#9ca3af" }}>
          {file ? file.name : "Niciun fișier selectat"}
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
          onChange={(event) => onChange(event.target.files?.[0] || null)}
        />
      </label>
    </div>
  );
}
