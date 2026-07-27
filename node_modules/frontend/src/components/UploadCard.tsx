type FileState = File | null;

export function UploadCard({
  title,
  file,
  onChange,
}: {
  title: string;
  file: FileState;
  onChange: (file: FileState) => void;
}) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: "20px",
        padding: "18px",
        borderRadius: "14px",
        background: "#f9fafb",
        border: "1px solid #e5e7eb",
      }}
    >
      <div>
        <div style={{ fontWeight: "bold", marginBottom: "6px" }}>{title}</div>
        <div style={{ color: file ? "#047857" : "#9ca3af" }}>
          {file ? file.name : "Niciun fișier selectat"}
        </div>
      </div>

      <label
        style={{
          background: "#111827",
          color: "white",
          padding: "12px 18px",
          borderRadius: "10px",
          cursor: "pointer",
          whiteSpace: "nowrap",
        }}
      >
        Alege fișier
        <input
          type="file"
          accept=".pdf,.jpg,.jpeg,.png"
          style={{ display: "none" }}
          onChange={(event) => onChange(event.target.files?.[0] || null)}
        />
      </label>
    </div>
  );
}