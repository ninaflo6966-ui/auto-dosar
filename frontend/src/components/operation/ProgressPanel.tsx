interface ProgressPanelProps {
  uploadedCount: number;
  requiredDocumentCount: number;
  uploadProgress: number;
}

export default function ProgressPanel({
  uploadedCount,
  requiredDocumentCount,
  uploadProgress,
}: ProgressPanelProps) {
  return (
    <section style={panelStyle}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: 16,
          alignItems: "center",
        }}
      >
        <div>
          <h2 style={{ margin: 0 }}>2. Documentele dosarului</h2>

          <p style={{ margin: "7px 0 0", color: "#667085" }}>
            {uploadedCount} din {requiredDocumentCount} documente încărcate
          </p>
        </div>

        <strong style={{ fontSize: 22 }}>{uploadProgress}%</strong>
      </div>

      <div
        style={{
          height: 12,
          marginTop: 18,
          borderRadius: 999,
          background: "#e8edf3",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${uploadProgress}%`,
            height: "100%",
            borderRadius: 999,
            background: "#1769aa",
            transition: "width 250ms ease",
          }}
        />
      </div>
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
