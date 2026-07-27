import { NextRequest, NextResponse } from "next/server";
import {
  DocumentType,
  RuleBasedDocumentClassifier,
} from "@autodosar/adi-core";

function getDocumentLabel(type: DocumentType): string {
  const labels: Partial<Record<DocumentType, string>> = {
    [DocumentType.IdentityCard]: "Carte de identitate",
    [DocumentType.ElectronicIdentityCardFront]:
      "Carte electronică de identitate – față",
    [DocumentType.ElectronicIdentityCardBack]:
      "Carte electronică de identitate – verso",
    [DocumentType.DomicileCertificate]: "Certificat de domiciliu",
    [DocumentType.CIV]: "Carte de identitate a vehiculului",
    [DocumentType.RegistrationCertificate]:
      "Certificat de înmatriculare",
    [DocumentType.RCA]: "Poliță RCA",
    [DocumentType.ContractITL054]:
      "Contract de înstrăinare-dobândire ITL-054",
    [DocumentType.Invoice]: "Factură de achiziție",
    [DocumentType.FiscalCertificate]: "Certificat fiscal",
    [DocumentType.PowerOfAttorney]: "Împuternicire",
    [DocumentType.Delegation]: "Delegație",
    [DocumentType.PaymentProof]: "Dovadă de plată",
    [DocumentType.GeneratedApplication]: "Document necunoscut",
    [DocumentType.GeneratedContract]: "Contract generat",
  };

  return labels[type] ?? type;
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const uploadedFile = formData.get("file");

    if (!(uploadedFile instanceof File)) {
      return NextResponse.json(
        { error: "Nu a fost primit niciun fișier." },
        { status: 400 }
      );
    }

    /*
     * Clasificare demonstrativă:
     * momentan folosim numele fișierului ca text de intrare.
     * Ulterior, aici va intra textul rezultat din OCR.
     */
    const classifier = new RuleBasedDocumentClassifier();
    const classification = classifier.classify(uploadedFile.name);

    return NextResponse.json({
      fileName: uploadedFile.name,
      fileSize: uploadedFile.size,
      mimeType: uploadedFile.type || "application/octet-stream",
      type: classification.type,
      detectedType: getDocumentLabel(classification.type),
      confidence: Math.round(classification.confidence * 100),
      matchedSignals: classification.matchedSignals,
    });
  } catch (error) {
    console.error("Document classification error:", error);

    return NextResponse.json(
      { error: "Documentul nu a putut fi clasificat." },
      { status: 500 }
    );
  }
}