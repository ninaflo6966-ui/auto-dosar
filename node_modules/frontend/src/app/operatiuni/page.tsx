const operations = [
  {
    slug: "inmatriculare-definitiva",
    title: "Înmatriculare definitivă",
  },
  {
    slug: "transcriere-auto",
    title: "Transcriere auto",
  },
  {
    slug: "autorizatie-provizorie",
    title: "Autorizație provizorie",
  },
  {
    slug: "radiere-vehicul",
    title: "Radiere vehicul",
  },
  {
    slug: "modificare-date",
    title: "Modificare date",
  },
  {
    slug: "duplicat-talon",
    title: "Duplicat talon",
  },
];

export default function OperatiuniPage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#f4f7fb",
        padding: "50px 24px",
      }}
    >
      <div
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
        }}
      >
        <a
          href="/"
          style={{
            textDecoration: "none",
            color: "#374151",
          }}
        >
          ← Înapoi acasă
        </a>

        <h1
          style={{
            fontSize: "42px",
            marginTop: "24px",
            marginBottom: "12px",
          }}
        >
          Alege operațiunea
        </h1>

        <p
          style={{
            color: "#6b7280",
            marginBottom: "36px",
            fontSize: "18px",
          }}
        >
          Selectează tipul de dosar pe care dorești să îl generezi.
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "20px",
          }}
        >
          {operations.map((operation) => (
            <div
              key={operation.slug}
              style={{
                background: "white",
                borderRadius: "18px",
                padding: "24px",
                border: "1px solid #e5e7eb",
                boxShadow: "0 10px 25px rgba(15,23,42,0.05)",
              }}
            >
              <h2
                style={{
                  fontSize: "22px",
                  marginBottom: "12px",
                }}
              >
                {operation.title}
              </h2>

              <p
                style={{
                  color: "#6b7280",
                  marginBottom: "20px",
                }}
              >
                Creează dosarul pentru această operațiune.
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
                Continuă
              </a>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}