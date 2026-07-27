import DocumentUploadCard from "@/components/documents/DocumentUploadCard";
import type {
  DocumentSlot,
  DocumentSlotId,
  UploadedDocuments,
} from "@/types/operation";

interface UploadPanelProps {
  documentSlots: DocumentSlot[];
  documents: UploadedDocuments;
  uploadingSlot: DocumentSlotId | null;
  recalculating: boolean;
  onFileSelected: (slotId: string, file: File) => Promise<void>;
}

export default function UploadPanel({
  documentSlots,
  documents,
  uploadingSlot,
  recalculating,
  onFileSelected,
}: UploadPanelProps) {
  return (
    <>
      {uploadingSlot && (
        <div style={informationStyle}>
          Documentul este trimis și clasificat...
        </div>
      )}

      {recalculating && (
        <div style={informationStyle}>
          AutoDosar recalculează starea dosarului...
        </div>
      )}

      <section
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(245px, 1fr))",
          gap: 18,
          marginBottom: 28,
        }}
      >
        {documentSlots.map((slot) => (
          <DocumentUploadCard
            key={slot.id}
            id={slot.id}
            icon={slot.icon}
            title={slot.title}
            description={slot.description}
            document={documents[slot.id] ?? null}
            onFileSelected={onFileSelected}
          />
        ))}
      </section>
    </>
  );
}

const informationStyle: React.CSSProperties = {
  marginBottom: 20,
  padding: 14,
  borderRadius: 12,
  background: "#eef7ff",
  border: "1px solid #b8daf5",
  color: "#124f7d",
  fontWeight: 700,
};
