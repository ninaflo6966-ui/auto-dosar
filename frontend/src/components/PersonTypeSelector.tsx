export function PersonTypeSelector({
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