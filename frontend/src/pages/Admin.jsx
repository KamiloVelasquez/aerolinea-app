/*const POWERBI_URL = "https://app.powerbi.com/reportEmbed?...";
const POWERBI_IMAGE = "../maquetacion de BI.png";


const Admin = () => {
  return (
    <section style={{ maxWidth: "1200px", margin: "0 auto", padding: "24px" }}>
      <h1>Modulo de administracion</h1>
      <p>Espacio para integrar el tablero de Power BI.</p>

      <div style={{
        background: "#ffffff",
        border: "1px solid #e2e8f0",
        borderRadius: "8px",
        padding: "18px",
        marginTop: "20px"
      }}>
        <h2>Tablero Power BI</h2>

        {/* {POWERBI_URL ? (
          <iframe
            title="Power BI Dashboard"
            src={POWERBI_URL}
            width="100%"
            height="620"
            style={{ border: 0, borderRadius: "8px" }}
            allowFullScreen
          />
        ) : (
          <div style={{
            minHeight: "420px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: "1px dashed #cbd5e1",
            borderRadius: "8px",
            color: "#64748b"
          }}>
            Aqui se mostrara el tablero cuando pegues el enlace de Power BI.
          </div>
        )}}
      </div>
    </section>
  );
};
export default Admin; */


const POWERBI_IMAGE = "/maquetacion de BI.png";

const Admin = () => {
  return (
    <section style={{ maxWidth: "1200px", margin: "0 auto", padding: "24px" }}>
      <h1>Modulo de administracion</h1>
      <p>Espacio para integrar el tablero de Power BI.</p>

      <div style={{
        background: "#ffffff",
        border: "1px solid #e2e8f0",
        borderRadius: "8px",
        padding: "18px",
        marginTop: "20px"
      }}>
        <h2>Tablero Power BI</h2>

        <img
          src={POWERBI_IMAGE}
          alt="Maquetacion del tablero Power BI"
          style={{
            width: "100%",
            maxHeight: "720px",
            objectFit: "contain",
            borderRadius: "8px",
            border: "1px solid #e2e8f0"
          }}
        />
      </div>
    </section>
  );
};

export default Admin;

