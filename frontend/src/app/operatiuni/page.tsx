import { createDefaultOperationRegistry } from "@autodosar/adi-core/operations";

const iconByName: Record<string, string> = {
  "arrow-left-right": "↔",
};

export default function OperatiuniPage() {
  const operations = createDefaultOperationRegistry().list();

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#f4f7fb",
        padding: "50px 24px",
      }}
    >
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        <a href="/" style={{ textDecoration: "none", color: "#374151" }}>
          ← Înapoi acasă
        </a>

        <h1 style={{ fontSize: "42px", marginTop: "24px", marginBottom: "12px" }}>
          Alege operațiunea
        </h1>

        <p style={{ color: "#6b7280", marginBottom: "36px", fontSize: "18px" }}>
          Selectează un flux disponibil în versiunea curentă AutoDosar.
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "20px",
          }}
        >
          {operations.map((operation) => (
            <article
              key={operation.id}
              style={{
                background: "white",
                borderRadius: "18px",
                padding: "24px",
                border: "1px solid #e5e7eb",
                boxShadow: "0 10px 25px rgba(15,23,42,0.05)",
              }}
            >
              <div style={{ fontSize: "28px", marginBottom: "12px" }} aria-hidden="true">
                {iconByName[operation.icon] ?? "🚗"}
              </div>
              <h2 style={{ fontSize: "22px", marginBottom: "12px" }}>
                {operation.shortTitle}
              </h2>
              <p style={{ color: "#6b7280", marginBottom: "8px", lineHeight: 1.55 }}>
                {operation.description}
              </p>
              <p style={{ color: "#64748b", marginBottom: "20px", fontSize: "14px" }}>
                Timp estimat: {operation.estimatedMinutes ?? 5} minute
              </p>
              <a
                href={`/expert-dosar?operatiune=${operation.slug}`}
                style={{
                  display: "inline-block",
                  padding: "12px 18px",
                  borderRadius: "10px",
                  background: "#111827",
                  color: "white",
                  textDecoration: "none",
                }}
              >
                Pornește Expert Dosar
              </a>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}
