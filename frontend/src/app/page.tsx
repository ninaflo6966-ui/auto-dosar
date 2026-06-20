export default function HomePage() {
  return (
    <main style={{ minHeight: "100vh", background: "#f4f7fb", color: "#111827" }}>
      <header
        style={{
          height: "72px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 48px",
          background: "white",
          borderBottom: "1px solid #e5e7eb",
        }}
      >
        <div style={{ fontSize: "24px", fontWeight: "bold" }}>AutoDosar</div>

        <nav style={{ display: "flex", gap: "24px", fontSize: "15px" }}>
          <span>Cum funcționează</span>
          <span>Operațiuni</span>
          <span>Prețuri</span>
          <span>Contact</span>
        </nav>
      </header>

      <section
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
          padding: "90px 24px 50px",
          textAlign: "center",
        }}
      >
        <h1 style={{ fontSize: "54px", lineHeight: 1.1, marginBottom: "24px" }}>
          Dosarul tău auto,
          <br />
          completat online
        </h1>

        <p
          style={{
            fontSize: "21px",
            color: "#4b5563",
            maxWidth: "760px",
            margin: "0 auto 36px",
          }}
        >
          Încarci documentele, sistemul organizează dosarul și primești un PDF complet
          pentru operațiunea ta de înmatriculare auto.
        </p>

        <div style={{ display: "flex", justifyContent: "center", gap: "16px" }}>
          <a
            href="/operatiuni"
            style={{
              padding: "16px 28px",
              borderRadius: "12px",
              border: "none",
              background: "#111827",
              color: "white",
              fontSize: "17px",
              cursor: "pointer",
              textDecoration: "none",
            }}
          >
            Începe dosarul
          </a>

          <button
            style={{
              padding: "16px 28px",
              borderRadius: "12px",
              border: "1px solid #d1d5db",
              background: "white",
              color: "#111827",
              fontSize: "17px",
              cursor: "pointer",
            }}
          >
            Vezi operațiunile
          </button>
        </div>
      </section>
    </main>
  );
}