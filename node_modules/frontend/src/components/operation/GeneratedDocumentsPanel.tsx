import type {
  OwnershipMode,
  SellerType,
} from "@/types/operation";

interface GeneratedDocumentsPanelProps {
  sellerType: SellerType;
  ownershipMode: OwnershipMode;
}

export default function GeneratedDocumentsPanel({
  sellerType,
  ownershipMode,
}: GeneratedDocumentsPanelProps) {
  return (
    <section style={panelStyle}>
      <h2 style={{ marginTop: 0 }}>
        3. Documentele pregătite de AutoDosar
      </h2>

      {sellerType === "PF" && ownershipMode === "GENERATE" && (
        <GeneratedItem
          title="Contract ITL-054"
          description="Va fi generat din datele cumpărătorului, vânzătorului și vehiculului."
        />
      )}

      <GeneratedItem
        title="Dosarul pentru Taxe și Impozite"
        description="Pachet separat pentru declararea și impunerea vehiculului la autoritatea locală."
      />

      <GeneratedItem
        title="Dosarul pentru transcriere"
        description="Pachetul documentelor necesare operațiunii de transcriere."
      />

      <GeneratedItem
        title="Checklist final"
        description="Lista documentelor, validărilor și pașilor rămași."
      />
    </section>
  );
}

function GeneratedItem({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "34px 1fr",
        gap: 10,
        padding: "14px 0",
        borderBottom: "1px solid #edf0f3",
      }}
    >
      <div style={{ fontSize: 20 }}>⚙️</div>

      <div>
        <strong>{title}</strong>

        <div
          style={{
            marginTop: 4,
            color: "#667085",
            lineHeight: 1.45,
          }}
        >
          {description}
        </div>
      </div>
    </div>
  );
}

const panelStyle: React.CSSProperties = {
  marginBottom: 28,
  padding: "26px 28px",
  borderRadius: 18,
  background: "#ffffff",
  boxShadow: "0 10px 30px rgba(24, 39, 75, 0.07)",
};
