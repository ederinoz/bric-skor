import { useState } from "react";

export default function App() {

  const [screen, setScreen] = useState("giris");

  const [seviye, setSeviye] = useState(1);

  const [renk, setRenk] = useState("");

  const [sonuc, setSonuc] = useState("=");

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
                marginBottom: "20px"
              }}
            >

              <div
                style={{
                  marginBottom: "10px",
                  fontSize: "20px"
                }}
              >
                Seviye
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(7,1fr)",
                  gap: "5px"
                }}
              >

                {[1,2,3,4,5,6,7].map((item) => (

                  <button
                    key={item}
                    onClick={() => setSeviye(item)}
                    style={{
                      padding: "15px",
                      borderRadius: "10px",
                      border: "none",
                      background:
                        seviye === item
                          ? "#10b981"
                          : "#374151",
                      color: "white",
                      fontSize: "18px"
                    }}
                  >
                    {item}
                  </button>

                ))}

              </div>

            </div>

            <div
              style={{
                marginBottom: "20px"
              }}
            >

              <div
                style={{
                  marginBottom: "10px",
                  fontSize: "20px"
                }}
              >
                Renk
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "10px"
                }}
              >

                {["Sinek","Karo","Kupa","Maça","NT"].map((item) => (

                  <button
                    key={item}
                    onClick={() => setRenk(item)}
                    style={{
                      padding: "20px",
                      borderRadius: "14px",
                      border: "none",
                      background:
                        renk === item
                          ? "#10b981"
                          : "#2563eb",
                      color: "white",
                      fontSize: "22px"
                    }}
                  >
                    {item}
                  </button>

                ))}

              </div>

            </div>

            <div
              style={{
                marginBottom: "20px"
              }}
            >

              <div
                style={{
                  marginBottom: "10px",
                  fontSize: "20px"
                }}
              >
                Sonuç
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr 1fr",
                  gap: "10px"
                }}
              >

                {["=","+1","+2","-1","-2","-3"].map((item) => (

                  <button
                    key={item}
                    onClick={() => setSonuc(item)}
                    style={{
                      padding: "18px",
                      borderRadius: "12px",
                      border: "none",
                      background:
                        sonuc === item
                          ? "#10b981"
                          : "#7c3aed",
                      color: "white",
                      fontSize: "20px"
                    }}
                  >
                    {item}
                  </button>

                ))}

              </div>

            </div>

            <div
              style={{
                background: "#1f2937",
                padding: "20px",
                borderRadius: "16px",
                textAlign: "center"
              }}
            >

              <div
                style={{
                  fontSize: "18px",
                  marginBottom: "10px"
                }}
              >
                Seçilen Kontrat
              </div>

              <div
                style={{
                  fontSize: "36px",
                  fontWeight: "bold"
                }}
              >
                {seviye} {renk} {sonuc}
              </div>

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
