import { useState } from "react";

export default function App() {

  const [screen, setScreen] = useState("giris");

  const [seviye, setSeviye] = useState(1);

  const [renk, setRenk] = useState("");

  const [sonuc, setSonuc] = useState("=");

  const [eller, setEller] = useState([]);

  function hesaplaSkor() {

    let temel = 0;

    if (renk === "Sinek" || renk === "Karo") {
      temel = seviye * 20;
    }

    if (renk === "Kupa" || renk === "Maça") {
      temel = seviye * 30;
    }

    if (renk === "NT") {
      temel = 40 + ((seviye - 1) * 30);
    }

    if (sonuc === "+1") temel += 30;
    if (sonuc === "+2") temel += 60;

    if (sonuc === "-1") temel -= 50;
    if (sonuc === "-2") temel -= 100;
    if (sonuc === "-3") temel -= 150;

    return temel;
  }

  function eliKaydet() {

    if (renk === "") {
      alert("Renk seç");
      return;
    }

    const yeniEl = {
      kontrat: `${seviye} ${renk}`,
      sonuc: sonuc,
      skor: hesaplaSkor()
    };

    setEller([yeniEl, ...eller]);

    setScreen("skor");
  }

  const toplamSkor = eller.reduce(
    (toplam, el) => toplam + el.skor,
    0
  );

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
                textAlign: "center",
                marginBottom: "20px"
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

              <div
                style={{
                  marginTop: "10px",
                  fontSize: "24px",
                  color: "#10b981"
                }}
              >
                {hesaplaSkor()} puan
              </div>

            </div>

            <button
              onClick={eliKaydet}
              style={{
                width: "100%",
                padding: "22px",
                borderRadius: "16px",
                border: "none",
                background: "#10b981",
                color: "white",
                fontSize: "24px",
                fontWeight: "bold"
              }}
            >
              ELİ KAYDET
            </button>

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
                fontSize: "28px",
                marginBottom: "20px"
              }}
            >
              Skorbord
            </h2>

            <div
              style={{
                background: "#10b981",
                padding: "20px",
                borderRadius: "16px",
                marginBottom: "20px",
                textAlign: "center"
              }}
            >

              <div
                style={{
                  fontSize: "20px"
                }}
              >
                Toplam Skor
              </div>

              <div
                style={{
                  fontSize: "42px",
                  fontWeight: "bold"
                }}
              >
                {toplamSkor}
              </div>

            </div>

            {eller.length === 0 && (

              <div
                style={{
                  background: "#1f2937",
                  padding: "20px",
                  borderRadius: "16px"
                }}
              >
                Henüz skor yok
              </div>

            )}

            {eller.map((el, index) => (

              <div
                key={index}
                style={{
                  background: "#1f2937",
                  padding: "18px",
                  borderRadius: "16px",
                  marginBottom: "12px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center"
                }}
              >

                <div>

                  <div
                    style={{
                      fontSize: "24px",
                      fontWeight: "bold"
                    }}
                  >
                    {el.kontrat}
                  </div>

                  <div
                    style={{
                      color: "#9ca3af",
                      marginTop: "5px"
                    }}
                  >
                    Sonuç: {el.sonuc}
                  </div>

                </div>

                <div
                  style={{
                    fontSize: "28px",
                    fontWeight: "bold",
                    color:
                      el.skor >= 0
                        ? "#10b981"
                        : "#ef4444"
                  }}
                >
                  {el.skor}
                </div>

              </div>

            ))}

          </div>

        )}

      </div>

    </div>
  );
}
