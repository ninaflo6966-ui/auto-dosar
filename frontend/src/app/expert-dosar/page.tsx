"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";

const operationLabels: Record<string, string> = {
  "inmatriculare-definitiva": "Înmatriculare definitivă",
  "transcriere-auto": "Transcriere auto",
  "autorizatie-provizorie": "Autorizație provizorie",
  "radiere-vehicul": "Radiere vehicul",
  "modificare-date": "Modificare date",
  "duplicat-talon": "Duplicat talon",
};

const operationsWithOriginQuestion = [
  "inmatriculare-definitiva",
  "autorizatie-provizorie",
];

const counties = [
  "AB", "AR", "AG", "BC", "BH", "BN", "BT", "BR", "BV", "BZ",
  "CS", "CL", "CJ", "CT", "CV", "DB", "DJ", "GL", "GR", "GJ",
  "HR", "HD", "IL", "IS", "IF", "MM", "MH", "MS", "NT", "OT",
  "PH", "SM", "SJ", "SB", "SV", "TR", "TM", "TL", "VS", "VL",
  "VN", "B",
];

export default function ExpertDosarPage() {
  const searchParams = useSearchParams();
  const operationSlug = searchParams.get("operatiune") || "transcriere-auto";
  const operationTitle = operationLabels[operationSlug] || "Dosar auto";

  const shouldAskOrigin = operationsWithOriginQuestion.includes(operationSlug);

  const [personType, setPersonType] = useState<"pf" | "pj" | "">("");
  const [county, setCounty] = useState("");
  const [proxy, setProxy] = useState<"da" | "nu" | "">("");
  const [origin, setOrigin] = useState<"romania" | "ue" | "non-ue" | "">(
    shouldAskOrigin ? "" : "romania"
  );

  const [vehicleCondition, setVehicleCondition] = useState<"nou" | "second-hand" | "">("");
  const [sellerType, setSellerType] = useState<"pf" | "pj" | "">("");
  const [plateType, setPlateType] = useState<"rand" | "preferentiale" | "">("");

  const [preferredPlate1, setPreferredPlate1] = useState("");
  const [preferredPlate2, setPreferredPlate2] = useState("");
  const [preferredPlate3, setPreferredPlate3] = useState("");

  const [sameCounty, setSameCounty] = useState<"da" | "nu" | "">("");
  const [plateStaysOnCar, setPlateStaysOnCar] = useState<"da" | "nu" | "">("");

  const [temporaryAuthNumber, setTemporaryAuthNumber] = useState<"prima" | "a-doua" | "a-treia" | "">("");

  const [deregistrationReason, setDeregistrationReason] = useState<
    "export" | "casare" | "furt" | "la-cerere" | ""
  >("");
  const [ownerKeepsPlateCombination, setOwnerKeepsPlateCombination] = useState<"da" | "nu" | "">("");

  const [modificationType, setModificationType] = useState<
    "domiciliu" | "sediu" | "nume" | "denumire-firma" | "tehnice" | ""
  >("");

  const [duplicateReason, setDuplicateReason] = useState<
    "pierdut" | "furat" | "deteriorat" | ""
  >("");

  const transcriereNeedsNewPlates =
    operationSlug === "transcriere-auto" &&
    (sameCounty === "nu" || plateStaysOnCar === "nu");

  const shouldShowPreferredPlates =
    plateType === "preferentiale" &&
    (operationSlug === "inmatriculare-definitiva" || transcriereNeedsNewPlates);

  const isBaseComplete = personType && county && proxy && (!shouldAskOrigin || origin);

  const isInmatriculareComplete =
    operationSlug !== "inmatriculare-definitiva" ||
    (
      vehicleCondition &&
      plateType &&
      (
        vehicleCondition !== "second-hand" ||
        sellerType
      )
    );

  const isTranscriereComplete =
    operationSlug !== "transcriere-auto" ||
    (
      sameCounty &&
      (
        sameCounty === "nu"
          ? plateType
          : plateStaysOnCar && (plateStaysOnCar === "da" || plateType)
      )
    );

  const isAutorizatieComplete =
    operationSlug !== "autorizatie-provizorie" || temporaryAuthNumber;

  const isRadiereComplete =
    operationSlug !== "radiere-vehicul" ||
    (deregistrationReason && ownerKeepsPlateCombination);

  const isModificareComplete =
    operationSlug !== "modificare-date" || modificationType;

  const isDuplicatComplete =
    operationSlug !== "duplicat-talon" || duplicateReason;

  const canContinue =
    isBaseComplete &&
    isInmatriculareComplete &&
    isTranscriereComplete &&
    isAutorizatieComplete &&
    isRadiereComplete &&
    isModificareComplete &&
    isDuplicatComplete;

  function continueToUpload() {
    const finalOrigin = shouldAskOrigin ? origin : "romania";

    const expertData = {
      operationSlug,
      operationTitle,
      personType,
      county,
      proxy,
      origin: finalOrigin,
      vehicleCondition,
      sellerType,
      plateType,
      preferredPlate1,
      preferredPlate2,
      preferredPlate3,
      sameCounty,
      plateStaysOnCar,
      temporaryAuthNumber,
      deregistrationReason,
      ownerKeepsPlateCombination,
      modificationType,
      duplicateReason,
    };

    localStorage.setItem("autoDosarExpert", JSON.stringify(expertData));

    const params = new URLSearchParams({
      operatiune: operationSlug,
      tip: personType,
      judet: county,
      origine: finalOrigin,
      imputernicit: proxy,
      stareVehicul: vehicleCondition,
      tipVanzator: sellerType,
      tipPlacute: plateType,
      numarPreferential1: preferredPlate1,
      numarPreferential2: preferredPlate2,
      numarPreferential3: preferredPlate3,
      acelasiJudet: sameCounty,
      numarRamanePeMasina: plateStaysOnCar,
      numarAutorizatieProvizorie: temporaryAuthNumber,
      motivRadiere: deregistrationReason,
      proprietarPastreazaNumarul: ownerKeepsPlateCombination,
      tipModificare: modificationType,
      motivDuplicat: duplicateReason,
    });

    window.location.href = `/upload?${params.toString()}`;
  }

  return (
    <main style={{ minHeight: "100vh", background: "#f4f7fb", padding: "50px 24px" }}>
      <div style={{ maxWidth: "950px", margin: "0 auto" }}>
        <a href="/operatiuni" style={{ textDecoration: "none", color: "#374151" }}>
          ← Înapoi la operațiuni
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
          <h1 style={{ fontSize: "38px", marginBottom: "10px" }}>Expert Dosar</h1>

          <p style={{ color: "#4b5563", fontSize: "18px", marginBottom: "30px" }}>
            Operațiune selectată: <strong>{operationTitle}</strong>
          </p>

          <Question title="1. Dosarul se face pe:">
            <Option label="Persoană fizică" active={personType === "pf"} onClick={() => setPersonType("pf")} />
            <Option label="Persoană juridică" active={personType === "pj"} onClick={() => setPersonType("pj")} />
          </Question>

          <Question title="2. Județ înmatriculare:">
            <select
              value={county}
              onChange={(event) => setCounty(event.target.value)}
              style={{
                padding: "12px",
                borderRadius: "10px",
                border: "1px solid #d1d5db",
                minWidth: "220px",
                fontSize: "16px",
              }}
            >
              <option value="">Selectează județul</option>
              {counties.map((countyCode) => (
                <option key={countyCode} value={countyCode}>
                  {countyCode}
                </option>
              ))}
            </select>
          </Question>

          <Question title="3. Există împuternicit?">
            <Option label="Da" active={proxy === "da"} onClick={() => setProxy("da")} />
            <Option label="Nu" active={proxy === "nu"} onClick={() => setProxy("nu")} />
          </Question>

          {shouldAskOrigin && (
            <Question title="3. Vehiculul provine din:">
              <Option label="România" active={origin === "romania"} onClick={() => setOrigin("romania")} />
              <Option label="Uniunea Europeană" active={origin === "ue"} onClick={() => setOrigin("ue")} />
              <Option label="Non-UE" active={origin === "non-ue"} onClick={() => setOrigin("non-ue")} />
            </Question>
          )}

          {operationSlug === "inmatriculare-definitiva" && (
            <>
              <Question title="4. Vehiculul este:">
                <Option
                  label="Nou"
                  active={vehicleCondition === "nou"}
                  onClick={() => {
                    setVehicleCondition("nou");
                    setSellerType("");
                  }}
                />
                <Option
                  label="Second-hand"
                  active={vehicleCondition === "second-hand"}
                  onClick={() => setVehicleCondition("second-hand")}
                />
              </Question>

              {vehicleCondition === "second-hand" && (
                <Question title="5. Vânzătorul este:">
                  <Option
                    label="Persoană fizică"
                    active={sellerType === "pf"}
                    onClick={() => setSellerType("pf")}
                  />
                  <Option
                    label="Persoană juridică"
                    active={sellerType === "pj"}
                    onClick={() => setSellerType("pj")}
                  />
                </Question>
              )}

              <Question title={vehicleCondition === "second-hand" ? "6. Tip plăcuțe:" : "5. Tip plăcuțe:"}>
                <Option label="La rând" active={plateType === "rand"} onClick={() => setPlateType("rand")} />
                <Option label="Preferențiale" active={plateType === "preferentiale"} onClick={() => setPlateType("preferentiale")} />
              </Question>
            </>
          )}

          {operationSlug === "transcriere-auto" && (
            <>
              <Question title="3. Județul noului proprietar este același cu județul actual al vehiculului?">
                <Option
                  label="Da"
                  active={sameCounty === "da"}
                  onClick={() => {
                    setSameCounty("da");
                    setPlateStaysOnCar("");
                    setPlateType("");
                  }}
                />
                <Option
                  label="Nu"
                  active={sameCounty === "nu"}
                  onClick={() => {
                    setSameCounty("nu");
                    setPlateStaysOnCar("");
                    setPlateType("");
                  }}
                />
              </Question>

              {sameCounty === "da" && (
                <Question title="4. Numărul de înmatriculare rămâne pe mașină?">
                  <Option
                    label="Da"
                    active={plateStaysOnCar === "da"}
                    onClick={() => {
                      setPlateStaysOnCar("da");
                      setPlateType("");
                    }}
                  />
                  <Option
                    label="Nu"
                    active={plateStaysOnCar === "nu"}
                    onClick={() => {
                      setPlateStaysOnCar("nu");
                      setPlateType("");
                    }}
                  />
                </Question>
              )}

              {sameCounty === "nu" && (
                <InfoBox text="Județul este diferit, deci va fi necesar un număr nou de înmatriculare." />
              )}

              {transcriereNeedsNewPlates && (
                <Question title={sameCounty === "nu" ? "4. Tip plăcuțe:" : "5. Tip plăcuțe:"}>
                  <Option label="La rând" active={plateType === "rand"} onClick={() => setPlateType("rand")} />
                  <Option label="Preferențiale" active={plateType === "preferentiale"} onClick={() => setPlateType("preferentiale")} />
                </Question>
              )}
            </>
          )}

          {shouldShowPreferredPlates && (
            <div
              style={{
                marginBottom: "28px",
                padding: "18px",
                borderRadius: "14px",
                background: "#f9fafb",
                border: "1px solid #e5e7eb",
              }}
            >
              <h2 style={{ fontSize: "22px", marginBottom: "10px" }}>
                Combinații număr preferențial
              </h2>
              <p style={{ color: "#6b7280", marginBottom: "14px" }}>
                Poți introduce maximum 3 combinații de cifre și litere. Județul selectat este {county || "nespecificat"} și se va completa separat în numărul final.
              </p>
              <div style={{ display: "grid", gap: "12px" }}>
                <PreferredPlateInput label="Varianta 1" value={preferredPlate1} onChange={setPreferredPlate1} />
                <PreferredPlateInput label="Varianta 2" value={preferredPlate2} onChange={setPreferredPlate2} />
                <PreferredPlateInput label="Varianta 3" value={preferredPlate3} onChange={setPreferredPlate3} />
              </div>
            </div>
          )}

          {operationSlug === "autorizatie-provizorie" && (
            <Question title="4. A câta autorizație provizorie se solicită?">
              <Option label="Prima" active={temporaryAuthNumber === "prima"} onClick={() => setTemporaryAuthNumber("prima")} />
              <Option label="A doua" active={temporaryAuthNumber === "a-doua"} onClick={() => setTemporaryAuthNumber("a-doua")} />
              <Option label="A treia" active={temporaryAuthNumber === "a-treia"} onClick={() => setTemporaryAuthNumber("a-treia")} />
            </Question>
          )}

          {operationSlug === "radiere-vehicul" && (
            <>
              <Question title="3. Motiv radiere:">
                <Option
                  label="Export"
                  active={deregistrationReason === "export"}
                  onClick={() => {
                    setDeregistrationReason("export");
                    setOwnerKeepsPlateCombination("");
                  }}
                />
                <Option
                  label="Casare / dezmembrare"
                  active={deregistrationReason === "casare"}
                  onClick={() => {
                    setDeregistrationReason("casare");
                    setOwnerKeepsPlateCombination("");
                  }}
                />
                <Option
                  label="Furt"
                  active={deregistrationReason === "furt"}
                  onClick={() => {
                    setDeregistrationReason("furt");
                    setOwnerKeepsPlateCombination("");
                  }}
                />
                <Option
                  label="La cerere"
                  active={deregistrationReason === "la-cerere"}
                  onClick={() => {
                    setDeregistrationReason("la-cerere");
                    setOwnerKeepsPlateCombination("");
                  }}
                />
              </Question>

              {deregistrationReason && (
                <Question title="4. Vechiul proprietar păstrează combinația numărului de înmatriculare?">
                  <Option label="Da" active={ownerKeepsPlateCombination === "da"} onClick={() => setOwnerKeepsPlateCombination("da")} />
                  <Option label="Nu" active={ownerKeepsPlateCombination === "nu"} onClick={() => setOwnerKeepsPlateCombination("nu")} />
                </Question>
              )}
            </>
          )}

          {operationSlug === "modificare-date" && (
            <Question title="3. Ce tip de modificare se solicită?">
              <Option label="Schimbare domiciliu" active={modificationType === "domiciliu"} onClick={() => setModificationType("domiciliu")} />
              <Option label="Schimbare sediu" active={modificationType === "sediu"} onClick={() => setModificationType("sediu")} />
              <Option label="Schimbare nume" active={modificationType === "nume"} onClick={() => setModificationType("nume")} />
              <Option label="Schimbare denumire firmă" active={modificationType === "denumire-firma"} onClick={() => setModificationType("denumire-firma")} />
              <Option label="Modificări tehnice vehicul" active={modificationType === "tehnice"} onClick={() => setModificationType("tehnice")} />
            </Question>
          )}

          {operationSlug === "duplicat-talon" && (
            <Question title="3. Motiv duplicat talon:">
              <Option label="Pierdut" active={duplicateReason === "pierdut"} onClick={() => setDuplicateReason("pierdut")} />
              <Option label="Furat" active={duplicateReason === "furat"} onClick={() => setDuplicateReason("furat")} />
              <Option label="Deteriorat" active={duplicateReason === "deteriorat"} onClick={() => setDuplicateReason("deteriorat")} />
            </Question>
          )}

          <SummaryBox
            operationTitle={operationTitle}
            personType={personType}
            county={county}
            proxy={proxy}
            origin={shouldAskOrigin ? origin : "romania"}
            vehicleCondition={vehicleCondition}
            sellerType={sellerType}
            plateType={plateType}
            preferredPlate1={preferredPlate1}
            preferredPlate2={preferredPlate2}
            preferredPlate3={preferredPlate3}
            sameCounty={sameCounty}
            plateStaysOnCar={plateStaysOnCar}
            temporaryAuthNumber={temporaryAuthNumber}
            deregistrationReason={deregistrationReason}
            ownerKeepsPlateCombination={ownerKeepsPlateCombination}
            modificationType={modificationType}
            duplicateReason={duplicateReason}
          />

          <button
            disabled={!canContinue}
            onClick={continueToUpload}
            style={{
              marginTop: "28px",
              padding: "14px 22px",
              borderRadius: "10px",
              border: "none",
              background: canContinue ? "#111827" : "#9ca3af",
              color: "white",
              cursor: canContinue ? "pointer" : "not-allowed",
            }}
          >
            Continuă la upload
          </button>
        </div>
      </div>
    </main>
  );
}

function Question({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: "28px" }}>
      <h2 style={{ fontSize: "22px", marginBottom: "14px" }}>{title}</h2>
      <div style={{ display: "flex", gap: "14px", flexWrap: "wrap" }}>{children}</div>
    </div>
  );
}

function Option({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "14px 18px",
        borderRadius: "12px",
        border: active ? "2px solid #111827" : "1px solid #d1d5db",
        background: active ? "#111827" : "white",
        color: active ? "white" : "#111827",
        cursor: "pointer",
        fontSize: "16px",
      }}
    >
      {label}
    </button>
  );
}

function PreferredPlateInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label style={{ display: "grid", gap: "6px", color: "#374151" }}>
      {label}
      <input
        value={value}
        maxLength={6}
        placeholder="ex. 99ABC"
        onChange={(event) => onChange(event.target.value.toUpperCase())}
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

function InfoBox({ text }: { text: string }) {
  return (
    <div
      style={{
        marginBottom: "28px",
        padding: "16px",
        borderRadius: "12px",
        background: "#eff6ff",
        border: "1px solid #bfdbfe",
        color: "#1e40af",
      }}
    >
      {text}
    </div>
  );
}

function SummaryBox(props: Record<string, string>) {
  return (
    <div
      style={{
        marginTop: "28px",
        padding: "18px",
        borderRadius: "14px",
        background: "#f9fafb",
        border: "1px solid #e5e7eb",
      }}
    >
      <strong>Rezumat:</strong>
      <div style={{ marginTop: "10px", color: "#4b5563", lineHeight: 1.7 }}>
        Operațiune: {props.operationTitle}
        <br />
        Tip persoană: {props.personType === "pf" ? "Persoană fizică" : props.personType === "pj" ? "Persoană juridică" : "-"}
        <br />
        Județ înmatriculare: {props.county || "-"}
        <br />
        Împuternicit: {props.proxy || "-"}
        <br />
        Origine vehicul: {props.origin || "-"}
        <br />
        Stare vehicul: {props.vehicleCondition || "-"}
        <br />
        Vânzător: {props.sellerType === "pf" ? "Persoană fizică" : props.sellerType === "pj" ? "Persoană juridică" : "-"}
        <br />
        Tip plăcuțe: {props.plateType || "-"}
        <br />
        Combinații preferențiale: {[props.preferredPlate1, props.preferredPlate2, props.preferredPlate3].filter(Boolean).join(", ") || "-"}
        <br />
        Același județ: {props.sameCounty || "-"}
        <br />
        Numărul rămâne pe mașină: {props.plateStaysOnCar || "-"}
        <br />
        Autorizație provizorie: {props.temporaryAuthNumber || "-"}
        <br />
        Motiv radiere: {props.deregistrationReason || "-"}
        <br />
        Proprietarul păstrează numărul: {props.ownerKeepsPlateCombination || "-"}
        <br />
        Tip modificare: {props.modificationType || "-"}
        <br />
        Motiv duplicat: {props.duplicateReason || "-"}
      </div>
    </div>
  );
}
