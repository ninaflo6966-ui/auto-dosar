import type { CaseState } from "@/types/operation";

interface ValidationPanelProps {
  caseState: CaseState | null;
  caseStateError: string;
}

export default function ValidationPanel({
  caseState,
  caseStateError,
}: ValidationPanelProps) {
  return (
    <section style={panelStyle}>
      <h2 style={{ marginTop: 0 }}>4. Verificarea dosarului</h2>

      {caseStateError && (
        <div
          style={{
            padding: 14,
            borderRadius: 10,
            background: "#fff2f2",
            border: "1px solid #f2b8b8",
            color: "#a12626",
            marginBottom: 18,
          }}
        >
          {caseStateError}
        </div>
      )}

      {!caseState && !caseStateError ? (
        <p>Se încarcă starea dosarului...</p>
      ) : (
        caseState && (
          <>
            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fit, minmax(180px, 1fr))",
                gap: 14,
                marginBottom: 22,
              }}
            >
              <div style={summaryCardStyle}>
                <small>Progres validare</small>
                <strong>{caseState.progress}%</strong>
              </div>

              <div style={summaryCardStyle}>
                <small>Scor dosar</small>
                <strong>{caseState.score}/100</strong>
              </div>

              <div style={summaryCardStyle}>
                <small>Pregătit pentru depunere</small>
                <strong>
                  {caseState.readyForSubmission ? "Da" : "Nu"}
                </strong>
              </div>
            </div>

            <div
              style={{
                padding: 16,
                borderRadius: 12,
                background: "#fff8dc",
                border: "1px solid #e6d690",
                marginBottom: 24,
              }}
            >
              <strong>Următorul pas recomandat</strong>

              <div style={{ marginTop: 6 }}>{caseState.nextStep}</div>
            </div>

            <div style={{ display: "grid", gap: 10 }}>
              {caseState.checklist.map((item) => (
                <div
                  key={item.id}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "36px 1fr",
                    gap: 10,
                    padding: 14,
                    borderRadius: 12,
                    border: "1px solid #e1e6ec",
                  }}
                >
                  <div style={{ fontSize: 20 }}>
                    {item.completed ? "✅" : "❌"}
                  </div>

                  <div>
                    <strong>{item.title}</strong>

                    <div
                      style={{
                        marginTop: 4,
                        color: "#667085",
                        lineHeight: 1.45,
                      }}
                    >
                      {item.description}
                    </div>

                    {!item.completed && item.recommendation && (
                      <div
                        style={{
                          marginTop: 8,
                          color: "#9b5c00",
                          fontWeight: 700,
                        }}
                      >
                        {item.recommendation}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        )
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

const summaryCardStyle: React.CSSProperties = {
  padding: 16,
  borderRadius: 12,
  background: "#f6f8fb",
  border: "1px solid #e1e6ec",
  display: "flex",
  flexDirection: "column",
  gap: 7,
};
