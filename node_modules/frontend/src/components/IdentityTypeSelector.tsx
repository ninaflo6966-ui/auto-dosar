export function IdentityTypeSelector({
  value,
  onChange,
}: {
  value: "ci" | "cie" | "";
  onChange: (value: "ci" | "cie") => void;
}) {
  return (
    <div
      style={{
        display: "flex",
        gap: "12px",
        flexWrap: "wrap",
      }}
    >
      <button
        type="button"
        onClick={() => onChange("ci")}
        style={{
          padding: "12px 18px",
          borderRadius: "12px",
          border:
            value === "ci"
              ? "2px solid #111827"
              : "1px solid #d1d5db",
          background:
            value === "ci"
              ? "#111827"
              : "white",
          color:
            value === "ci"
              ? "white"
              : "#111827",
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
          border:
            value === "cie"
              ? "2px solid #111827"
              : "1px solid #d1d5db",
          background:
            value === "cie"
              ? "#111827"
              : "white",
          color:
            value === "cie"
              ? "white"
              : "#111827",
          cursor: "pointer",
        }}
      >
        Carte de identitate electronică
      </button>
    </div>
  );
}