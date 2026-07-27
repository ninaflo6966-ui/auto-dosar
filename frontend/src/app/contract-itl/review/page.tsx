"use client";

import { useEffect, useState } from "react";
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
} from "docx";

type PersonData = {
  lastName: string;
  firstName: string;
  cnp: string;
  idSeries: string;
  idNumber: string;
  address: string;
};

type CompanyData = {
  companyName: string;
  cui: string;
  registrationNumber: string;
  address: string;
  representativeName: string;
  representativeCnp: string;
};

type VehicleData = {
  brand: string;
  model: string;
  vin: string;
  civSeries: string;
  engineCapacity: string;
  manufactureYear: string;
  color: string;
  maxWeight: string;
};

type ContractStorageData = {
  buyerPersonType?: "pf" | "pj" | "";
  sellerPersonType?: "pf";
  salePrice?: string;
  contractDate?: string;
  contractPlace?: string;
  files?: Record<string, string | null>;
};

function numberToRomanianWords(value: string) {
  const amount = Number(value || 0);

  if (!amount) {
    return "";
  }

  const units = [
    "",
    "unu",
    "doi",
    "trei",
    "patru",
    "cinci",
    "șase",
    "șapte",
    "opt",
    "nouă",
  ];

  const teens = [
    "zece",
    "unsprezece",
    "doisprezece",
    "treisprezece",
    "paisprezece",
    "cincisprezece",
    "șaisprezece",
    "șaptesprezece",
    "optsprezece",
    "nouăsprezece",
  ];

  const tens = [
    "",
    "",
    "douăzeci",
    "treizeci",
    "patruzeci",
    "cincizeci",
    "șaizeci",
    "șaptezeci",
    "optzeci",
    "nouăzeci",
  ];

  function underHundred(n: number): string {
    if (n < 10) return units[n];
    if (n < 20) return teens[n - 10];

    const ten = Math.floor(n / 10);
    const unit = n % 10;

    return unit ? `${tens[ten]} și ${units[unit]}` : tens[ten];
  }

  function underThousand(n: number): string {
    if (n < 100) return underHundred(n);

    const hundred = Math.floor(n / 100);
    const rest = n % 100;

    const hundredText =
      hundred === 1 ? "o sută" : `${units[hundred]} sute`;

    return rest ? `${hundredText} ${underHundred(rest)}` : hundredText;
  }

  if (amount < 1000) {
    return `${underThousand(amount)} lei`;
  }

  const thousands = Math.floor(amount / 1000);
  const rest = amount % 1000;

  const thousandsText =
    thousands === 1
      ? "o mie"
      : `${underThousand(thousands)} mii`;

  return rest
    ? `${thousandsText} ${underThousand(rest)} lei`
    : `${thousandsText} lei`;
}

export default function ContractITLReviewPage() {
  const [storedData, setStoredData] = useState<ContractStorageData | null>(null);

  const [buyerPf, setBuyerPf] = useState<PersonData>({
    lastName: "",
    firstName: "",
    cnp: "",
    idSeries: "",
    idNumber: "",
    address: "",
  });

  const [buyerPj, setBuyerPj] = useState<CompanyData>({
    companyName: "",
    cui: "",
    registrationNumber: "",
    address: "",
    representativeName: "",
    representativeCnp: "",
  });

  const [seller, setSeller] = useState<PersonData>({
    lastName: "",
    firstName: "",
    cnp: "",
    idSeries: "",
    idNumber: "",
    address: "",
  });

  const [vehicle, setVehicle] = useState<VehicleData>({
    brand: "",
    model: "",
    vin: "",
    civSeries: "",
    engineCapacity: "",
    manufactureYear: "",
    color: "",
    maxWeight: "",
  });

  useEffect(() => {
    const saved = localStorage.getItem("autoDosarContractITL");

    if (saved) {
      const parsed = JSON.parse(saved);
      setStoredData(parsed);
    }
  }, []);

  if (!storedData) {
    return (
      <main style={{ minHeight: "100vh", background: "#f4f7fb", padding: "50px 24px" }}>
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
          <h1>Nu există date pentru verificare.</h1>
          <a href="/contract-itl">Înapoi la Contract ITL-054</a>
        </div>
      </main>
    );
  }

  const priceInWords = numberToRomanianWords(storedData.salePrice || "");

  function buildReviewData() {
    return {
      contract: {
        salePrice: storedData.salePrice || "",
        salePriceWords: priceInWords,
        contractDate: storedData.contractDate || "",
        contractPlace: storedData.contractPlace || "",
      },
      buyerPersonType: storedData.buyerPersonType,
      buyer: storedData.buyerPersonType === "pj" ? buyerPj : buyerPf,
      seller,
      vehicle,
    };
  }

  function saveReviewData() {
    const reviewData = buildReviewData();
    localStorage.setItem("autoDosarContractITLReview", JSON.stringify(reviewData));
    alert("Datele au fost salvate.");
  }

  async function generateDocx() {
    const buyerText =
      storedData.buyerPersonType === "pj"
        ? `${buyerPj.companyName}, CUI ${buyerPj.cui}, sediu ${buyerPj.address}, reprezentată prin ${buyerPj.representativeName}`
        : `${buyerPf.lastName} ${buyerPf.firstName}, CNP ${buyerPf.cnp}, domiciliat(ă) în ${buyerPf.address}`;

    const sellerText =
      `${seller.lastName} ${seller.firstName}, CNP ${seller.cnp}, domiciliat(ă) în ${seller.address}`;

    const doc = new Document({
      sections: [
        {
          children: [
            new Paragraph({
              children: [
                new TextRun({
                  text: "CONTRACT DE ÎNSTRĂINARE - DOBÂNDIRE A UNUI MIJLOC DE TRANSPORT",
                  bold: true,
                }),
              ],
            }),

            new Paragraph(""),
            new Paragraph(`Încheiat la: ${storedData.contractPlace || ""}`),
            new Paragraph(`Data: ${storedData.contractDate || ""}`),
            new Paragraph(""),

            new Paragraph(`Vânzător: ${sellerText}`),
            new Paragraph(`Act identitate vânzător: seria ${seller.idSeries}, nr. ${seller.idNumber}`),
            new Paragraph(""),

            new Paragraph(`Cumpărător: ${buyerText}`),
            new Paragraph(
              storedData.buyerPersonType === "pj"
                ? `Nr. Registrul Comerțului: ${buyerPj.registrationNumber}; CNP reprezentant: ${buyerPj.representativeCnp}`
                : `Act identitate cumpărător: seria ${buyerPf.idSeries}, nr. ${buyerPf.idNumber}`
            ),
            new Paragraph(""),

            new Paragraph(
              `Obiectul contractului îl constituie vehiculul marca ${vehicle.brand}, model/tip ${vehicle.model}, ` +
              `număr de identificare ${vehicle.vin}, serie CIV ${vehicle.civSeries}, capacitate cilindrică ${vehicle.engineCapacity}, ` +
              `an fabricație ${vehicle.manufactureYear}, culoare ${vehicle.color}, masă maximă autorizată ${vehicle.maxWeight}.`
            ),

            new Paragraph(""),
            new Paragraph(`Prețul vânzării este de ${storedData.salePrice || ""} lei (${priceInWords}).`),
            new Paragraph(""),

            new Paragraph("Semnătura vânzătorului: ____________________"),
            new Paragraph(""),
            new Paragraph("Semnătura cumpărătorului: ____________________"),
          ],
        },
      ],
    });

    const reviewData = buildReviewData();
    localStorage.setItem("autoDosarContractITLReview", JSON.stringify(reviewData));

    const blob = await Packer.toBlob(doc);
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "Contract_ITL_054.docx";
    link.click();

    window.URL.revokeObjectURL(url);
  }

  return (
    <main style={{ minHeight: "100vh", background: "#f4f7fb", padding: "50px 24px" }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        <a href="/contract-itl" style={{ textDecoration: "none", color: "#374151" }}>
          ← Înapoi la încărcare documente
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
            Verificare date contract ITL-054
          </h1>

          <p style={{ fontSize: "18px", color: "#4b5563", marginBottom: "28px" }}>
            În această etapă vor apărea datele extrase prin OCR. Pentru MVP,
            le completăm sau le corectăm manual înainte de generarea contractului.
          </p>

          <Section title="1. Date contract">
            <InfoLine label="Preț vânzare" value={`${storedData.salePrice || "-"} lei`} />
            <InfoLine label="Preț în litere" value={priceInWords || "-"} />
            <InfoLine label="Data contractului" value={storedData.contractDate || "-"} />
            <InfoLine label="Locul încheierii" value={storedData.contractPlace || "-"} />
          </Section>

          {storedData.buyerPersonType === "pj" ? (
            <Section title="2. Cumpărător persoană juridică">
              <InputField label="Denumire firmă" value={buyerPj.companyName} onChange={(v) => setBuyerPj({ ...buyerPj, companyName: v })} />
              <InputField label="CUI" value={buyerPj.cui} onChange={(v) => setBuyerPj({ ...buyerPj, cui: v })} />
              <InputField label="Nr. înregistrare Registrul Comerțului" value={buyerPj.registrationNumber} onChange={(v) => setBuyerPj({ ...buyerPj, registrationNumber: v })} />
              <InputField label="Sediu" value={buyerPj.address} onChange={(v) => setBuyerPj({ ...buyerPj, address: v })} />
              <InputField label="Reprezentant legal" value={buyerPj.representativeName} onChange={(v) => setBuyerPj({ ...buyerPj, representativeName: v })} />
              <InputField label="CNP reprezentant legal" value={buyerPj.representativeCnp} onChange={(v) => setBuyerPj({ ...buyerPj, representativeCnp: v })} />
            </Section>
          ) : (
            <Section title="2. Cumpărător persoană fizică">
              <InputField label="Nume" value={buyerPf.lastName} onChange={(v) => setBuyerPf({ ...buyerPf, lastName: v })} />
              <InputField label="Prenume" value={buyerPf.firstName} onChange={(v) => setBuyerPf({ ...buyerPf, firstName: v })} />
              <InputField label="CNP" value={buyerPf.cnp} onChange={(v) => setBuyerPf({ ...buyerPf, cnp: v })} />
              <InputField label="Serie act identitate" value={buyerPf.idSeries} onChange={(v) => setBuyerPf({ ...buyerPf, idSeries: v.toUpperCase() })} />
              <InputField label="Număr act identitate" value={buyerPf.idNumber} onChange={(v) => setBuyerPf({ ...buyerPf, idNumber: v })} />
              <InputField label="Adresă domiciliu" value={buyerPf.address} onChange={(v) => setBuyerPf({ ...buyerPf, address: v })} />
            </Section>
          )}

          <Section title="3. Vânzător persoană fizică">
            <InputField label="Nume" value={seller.lastName} onChange={(v) => setSeller({ ...seller, lastName: v })} />
            <InputField label="Prenume" value={seller.firstName} onChange={(v) => setSeller({ ...seller, firstName: v })} />
            <InputField label="CNP" value={seller.cnp} onChange={(v) => setSeller({ ...seller, cnp: v })} />
            <InputField label="Serie act identitate" value={seller.idSeries} onChange={(v) => setSeller({ ...seller, idSeries: v.toUpperCase() })} />
            <InputField label="Număr act identitate" value={seller.idNumber} onChange={(v) => setSeller({ ...seller, idNumber: v })} />
            <InputField label="Adresă domiciliu" value={seller.address} onChange={(v) => setSeller({ ...seller, address: v })} />
          </Section>

          <Section title="4. Vehicul">
            <InputField label="Marcă" value={vehicle.brand} onChange={(v) => setVehicle({ ...vehicle, brand: v })} />
            <InputField label="Model / tip" value={vehicle.model} onChange={(v) => setVehicle({ ...vehicle, model: v })} />
            <InputField label="Număr identificare / VIN" value={vehicle.vin} onChange={(v) => setVehicle({ ...vehicle, vin: v.toUpperCase() })} />
            <InputField label="Serie CIV" value={vehicle.civSeries} onChange={(v) => setVehicle({ ...vehicle, civSeries: v.toUpperCase() })} />
            <InputField label="Capacitate cilindrică" value={vehicle.engineCapacity} onChange={(v) => setVehicle({ ...vehicle, engineCapacity: v })} />
            <InputField label="An fabricație" value={vehicle.manufactureYear} onChange={(v) => setVehicle({ ...vehicle, manufactureYear: v })} />
            <InputField label="Culoare" value={vehicle.color} onChange={(v) => setVehicle({ ...vehicle, color: v })} />
            <InputField label="Masă maximă autorizată" value={vehicle.maxWeight} onChange={(v) => setVehicle({ ...vehicle, maxWeight: v })} />
          </Section>

          <div
            style={{
              marginTop: "30px",
              display: "flex",
              justifyContent: "space-between",
              gap: "16px",
              flexWrap: "wrap",
            }}
          >
            <a
              href="/contract-itl"
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
              onClick={saveReviewData}
              style={{
                padding: "14px 22px",
                borderRadius: "10px",
                border: "none",
                background: "#111827",
                color: "white",
                cursor: "pointer",
                fontSize: "16px",
              }}
            >
              Salvează datele
            </button>

            <button
              onClick={generateDocx}
              style={{
                padding: "14px 22px",
                borderRadius: "10px",
                border: "none",
                background: "#059669",
                color: "white",
                cursor: "pointer",
                fontSize: "16px",
              }}
            >
              Generează Contract ITL-054 DOCX
            </button>
          </div>
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

function InfoLine({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div
      style={{
        padding: "14px",
        borderRadius: "10px",
        background: "#f9fafb",
        border: "1px solid #e5e7eb",
      }}
    >
      <strong>{label}:</strong> {value}
    </div>
  );
}
