"use client";

import CaseGenerationPanel from "@/components/operation/CaseGenerationPanel";
import GeneratedDocumentsPanel from "@/components/operation/GeneratedDocumentsPanel";
import OperationHeader from "@/components/operation/OperationHeader";
import ProgressPanel from "@/components/operation/ProgressPanel";
import TransactionPanel from "@/components/operation/TransactionPanel";
import UploadPanel from "@/components/operation/UploadPanel";
import ValidationPanel from "@/components/operation/ValidationPanel";
import { useTranscriereOperation } from "@/hooks/useTranscriereOperation";

export default function TranscriereDemoPage() {
  const operation = useTranscriereOperation();

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#f5f7fa",
        padding: "36px 20px 70px",
        color: "#17202a",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div style={{ maxWidth: 1120, margin: "0 auto" }}>
        <OperationHeader />

        <TransactionPanel
          sellerType={operation.sellerType}
          ownershipMode={operation.ownershipMode}
          onSellerTypeChange={operation.changeSellerType}
          onOwnershipModeChange={operation.setOwnershipMode}
        />

        <ProgressPanel
          uploadedCount={operation.uploadedCount}
          requiredDocumentCount={operation.documentSlots.length}
          uploadProgress={operation.uploadProgress}
        />

        <UploadPanel
          documentSlots={operation.documentSlots}
          documents={operation.documents}
          uploadingSlot={operation.uploadingSlot}
          recalculating={operation.recalculating}
          onFileSelected={operation.handleFileSelected}
        />

        <GeneratedDocumentsPanel
          sellerType={operation.sellerType}
          ownershipMode={operation.ownershipMode}
        />

        <ValidationPanel
          caseState={operation.caseState}
          caseStateError={operation.caseStateError}
        />

        <CaseGenerationPanel
          sellerType={operation.sellerType}
          ownershipMode={operation.ownershipMode}
          documentTypes={operation.activeDocumentTypes}
          uploadedDocumentCount={operation.uploadedCount}
          requiredDocumentCount={operation.documentSlots.length}
        />
      </div>
    </main>
  );
}
