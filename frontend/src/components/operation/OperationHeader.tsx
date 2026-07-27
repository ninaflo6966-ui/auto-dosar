export default function OperationHeader() {
  return (
    <header style={panelStyle}>
      <div style={{ color: "#1769aa", fontWeight: 800 }}>AUTODOSAR</div>

      <h1 style={{ margin: "8px 0 6px", fontSize: 34 }}>
        Transcrierea vehiculului
      </h1>

      <p style={{ margin: 0, color: "#667085", fontSize: 17 }}>
        Adaugă documentele, iar AutoDosar pregătește dosarele necesare.
      </p>
    </header>
  );
}

const panelStyle: React.CSSProperties = {
  marginBottom: 28,
  padding: "26px 28px",
  borderRadius: 18,
  background: "#ffffff",
  boxShadow: "0 10px 30px rgba(24, 39, 75, 0.07)",
};
