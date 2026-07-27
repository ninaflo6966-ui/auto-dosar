"use client";

import { useEffect, useMemo, useState } from "react";
import type {
  CaseState,
  ClassificationResponse,
  DocumentSlot,
  DocumentSlotId,
  OwnershipMode,
  SellerType,
  UploadedDocuments,
} from "@/types/operation";

function formatFileSize(size: number): string {
  if (size < 1024) {
    return `${size} B`;
  }

  if (size < 1024 * 1024) {
    return `${Math.round(size / 1024)} KB`;
  }

  return `${(size / (1024 * 1024)).toFixed(2)} MB`;
}

const initialDocuments: UploadedDocuments = {
  buyerIdentity: null,
  sellerIdentity: null,
  ownershipContract: null,
  invoice: null,
  civ: null,
  registrationCertificate: null,
  rca: null,
};

export function useTranscriereOperation() {
  const [caseState, setCaseState] = useState<CaseState | null>(null);
  const [caseStateError, setCaseStateError] = useState("");

  const [sellerType, setSellerType] = useState<SellerType>("PF");
  const [ownershipMode, setOwnershipMode] =
    useState<OwnershipMode>("GENERATE");

  const [documents, setDocuments] =
    useState<UploadedDocuments>(initialDocuments);

  const [uploadingSlot, setUploadingSlot] =
    useState<DocumentSlotId | null>(null);

  const [recalculating, setRecalculating] = useState(false);

  const documentSlots = useMemo<DocumentSlot[]>(() => {
    const slots: DocumentSlot[] = [
      {
        id: "buyerIdentity",
        icon: "🪪",
        title: "CI/CIE cumpărător",
        description: "Documentul de identitate al noului proprietar.",
      },
    ];

    if (sellerType === "PF") {
      slots.push({
        id: "sellerIdentity",
        icon: "👤",
        title: "CI/CIE vânzător",
        description:
          ownershipMode === "GENERATE"
            ? "Necesară pentru verificarea vânzătorului și generarea contractului."
            : "Necesară pentru verificarea identității vânzătorului.",
      });

      if (ownershipMode === "EXISTING") {
        slots.push({
          id: "ownershipContract",
          icon: "📄",
          title: "Contractul existent",
          description:
            "Contractul de înstrăinare-dobândire întocmit anterior.",
        });
      }
    }

    if (sellerType === "PJ") {
      slots.push({
        id: "invoice",
        icon: "🧾",
        title: "Factura de achiziție",
        description:
          "Documentul de proprietate emis de persoana juridică vânzătoare.",
      });
    }

    slots.push(
      {
        id: "civ",
        icon: "🚗",
        title: "Cartea de identitate a vehiculului",
        description: "CIV aferentă vehiculului care va fi transcris.",
      },
      {
        id: "registrationCertificate",
        icon: "📋",
        title: "Certificatul de înmatriculare",
        description: "Certificatul actual al vehiculului.",
      },
      {
        id: "rca",
        icon: "🛡️",
        title: "Polița RCA",
        description:
          "RCA valabilă și emisă pe numele cumpărătorului.",
      }
    );

    return slots;
  }, [sellerType, ownershipMode]);

  const activeDocumentTypes = useMemo(() => {
    return documentSlots
      .map((slot) => documents[slot.id]?.type)
      .filter((type): type is string => Boolean(type));
  }, [documentSlots, documents]);

  const uploadedCount = useMemo(() => {
    return documentSlots.filter((slot) => Boolean(documents[slot.id])).length;
  }, [documentSlots, documents]);

  const uploadProgress =
    documentSlots.length === 0
      ? 0
      : Math.round((uploadedCount / documentSlots.length) * 100);

  useEffect(() => {
    async function loadInitialState() {
      try {
        setCaseStateError("");

        const response = await fetch("/api/transcriere/state");
        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.error || "Starea dosarului nu a putut fi încărcată."
          );
        }

        setCaseState(data);
      } catch (error) {
        console.error(error);

        setCaseStateError(
          error instanceof Error
            ? error.message
            : "A apărut o eroare la încărcarea dosarului."
        );
      }
    }

    loadInitialState();
  }, []);

  useEffect(() => {
    async function recalculateCaseState() {
      try {
        setRecalculating(true);
        setCaseStateError("");

        const response = await fetch("/api/transcriere/state", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            documentTypes: activeDocumentTypes,
            sellerType,
            ownershipMode,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.error || "Starea dosarului nu a putut fi recalculată."
          );
        }

        setCaseState(data);
      } catch (error) {
        console.error(error);

        setCaseStateError(
          error instanceof Error
            ? error.message
            : "A apărut o eroare la recalcularea dosarului."
        );
      } finally {
        setRecalculating(false);
      }
    }

    recalculateCaseState();
  }, [activeDocumentTypes, sellerType, ownershipMode]);

  async function handleFileSelected(slotId: string, file: File) {
    const typedSlotId = slotId as DocumentSlotId;
    const formData = new FormData();

    formData.append("file", file);

    try {
      setUploadingSlot(typedSlotId);

      const response = await fetch("/api/documents/classify", {
        method: "POST",
        body: formData,
      });

      const data = (await response.json()) as ClassificationResponse;

      if (!response.ok) {
        throw new Error(
          data.error || "Clasificarea documentului a eșuat."
        );
      }

      setDocuments((current) => ({
        ...current,
        [typedSlotId]: {
          fileName: data.fileName,
          fileSize: formatFileSize(data.fileSize),
          detectedType: data.detectedType,
          confidence: data.confidence,
          type: data.type,
        },
      }));
    } catch (error) {
      console.error(error);

      window.alert(
        error instanceof Error
          ? error.message
          : "A apărut o eroare la încărcarea documentului."
      );
    } finally {
      setUploadingSlot(null);
    }
  }

  function changeSellerType(type: SellerType) {
    setSellerType(type);

    if (type === "PJ") {
      setOwnershipMode("EXISTING");
    }
  }

  return {
    activeDocumentTypes,
    caseState,
    caseStateError,
    changeSellerType,
    documentSlots,
    documents,
    handleFileSelected,
    ownershipMode,
    recalculating,
    sellerType,
    setOwnershipMode,
    uploadedCount,
    uploadingSlot,
    uploadProgress,
  };
}
