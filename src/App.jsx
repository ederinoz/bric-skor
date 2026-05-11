import { useState } from "react";

export default function App() {

  const [screen, setScreen] = useState("giris");

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0f172a",
        color: "white",
        padding: "20px",
        fontFamily: "Arial"
      }}
    >

      <div
        style={{
          maxWidth: "500px",
          margin: "0 auto"
        }}
      >

        <div
          style={{
            background: "#111827",
            padding: "20px",
            borderRadius: "20px",
            marginBottom: "20px"
          }}
        >
          <h1
            style={{
              fontSize: "32px",
              marginBottom: "10px"
            }}
          >
            Briç Skorbord
          </h1>

          <div
            style={{
              display: "flex",
              gap: "10px"
            }}
          >
            <button
              onClick={() => setScreen("giris")}
              style={{
                flex: 1,
                padding: "15px",
                borderRadius: "12px",
                border: "none",
                background:
                  screen === "giris"
                    ? "#10b981"
                    : "#374151",
                color: "white",
                fontSize: "18px"
              }}
            >
              Giriş
            </button>

            <button
              onClick={() => setScreen("skor")}
              style={{
                flex: 1,
                padding: "15px",
                borderRadius: "12px",
                border: "none",
                background:
                  screen === "skor"
                    ? "#10b981"
                    : "#374151",
                color: "white",
                fontSize: "18px"
              }}
            >
              Skor
            </button>
          </div>
        </div>

        {screen === "giris" && (
          <div
            style={{
              background: "#111827",
              padding: "20px",
              borderRadius: "20px"
            }}
          >

            <h2
              style={{
                fontSize: "24px",
                marginBottom: "20px"
              }}
            >
              Yeni El Girişi
            </h2>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "10px"
              }}
            >

              <button style={btn}>
                Sinek
              </button>

              <button style={btn}>
                Karo
              </button>

              <button style={btn}>
                Kupa
              </button>

              <button style={btn}>
                Maça
              </button>

              <button style={btn}>
                NT
              </button>

            </div>

          </div>
        )}

        {screen === "skor" && (
          <div
            style={{
              background: "#111827",
              padding: "20px",
              borderRadius: "20px"
            }}
          >

            <h2
              style={{
                fontSize: "24px",
                marginBottom: "20px"
              }}
            >
              Skorbord
            </h2>

            <div
              style={{
                background: "#1f2937",
                padding: "20px",
                borderRadius: "16px"
              }}
            >
              Henüz skor yok
            </div>

          </div>
        )}

      </div>

    </div>
  );
}

const btn = {
  padding: "20px",
  borderRadius: "14px",
  border: "none",
  background: "#2563eb",
  color: "white",
  fontSize: "20px"
};
