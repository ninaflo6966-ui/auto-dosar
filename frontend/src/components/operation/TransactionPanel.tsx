import type {
  OwnershipMode,
  SellerType,
} from "@/types/operation";

interface TransactionPanelProps {
  sellerType: SellerType;
  ownershipMode: OwnershipMode;
  onSellerTypeChange: (sellerType: SellerType) => void;
  onOwnershipModeChange: (ownershipMode: OwnershipMode) => void;
}

export default function TransactionPanel({
  sellerType,
  ownershipMode,
  onSellerTypeChange,
  onOwnershipModeChange,
}: TransactionPanelProps) {
  return (
    <section style={panelStyle}>
      <h2 style={{ marginTop: 0 }}>1. Situația tranzacției</h2>

      <div style={{ marginTop: 22 }}>
        <strong>Tipul vânzătorului</strong>

        <div style={optionGridStyle}>
          <button
            type="button"
            onClick={() => onSellerTypeChange("PF")}
            style={optionButtonStyle(sellerType === "PF")}
          >
            👤 Persoană fizică
          </button>

          <button
            type="button"
            onClick={() => onSellerTypeChange("PJ")}
            style={optionButtonStyle(sellerType === "PJ")}
          >
            🏢 Persoană juridică
          </button>
        </div>
      </div>

      {sellerType === "PF" && (
        <div style={{ marginTop: 24 }}>
          <strong>Contractul de înstrăinare-dobândire</strong>

          <div style={optionGridStyle}>
            <button
              type="button"
              onClick={() => onOwnershipModeChange("EXISTING")}
              style={optionButtonStyle(ownershipMode === "EXISTING")}
            >
              📄 Am deja contractul
            </button>

            <button
              type="button"
              onClick={() => onOwnershipModeChange("GENERATE")}
              style={optionButtonStyle(ownershipMode === "GENERATE")}
            >
              ✨ Generează contractul prin AutoDosar
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

const panelStyle: React.CSSProperties = {
  marginBottom: 28,
  padding: "26px 28px",
  borderRadius: 18,
  background: "#ffffff",
  boxShadow: "0 10px 30px rgba(24, 39, 75, 0.07)",
};

const optionGridStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  gap: 12,
  marginTop: 12,
};

function optionButtonStyle(selected: boolean): React.CSSProperties {
  return {
    padding: "15px 16px",
    borderRadius: 12,
    border: selected ? "2px solid #1769aa" : "1px solid #d9e0e8",
    background: selected ? "#eef7ff" : "#ffffff",
    color: "#17202a",
    textAlign: "left",
    fontWeight: 700,
    cursor: "pointer",
  };
}
