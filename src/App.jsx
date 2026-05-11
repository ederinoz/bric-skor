import { useEffect, useState } from "react";

export default function App() {

  const [screen, setScreen] =
    useState("giris");

  const [seviye, setSeviye] =
    useState(1);

  const [renk, setRenk] =
    useState("");

  const [sonuc, setSonuc] =
    useState("=");

  const [takim1Adi, setTakim1Adi] =
    useState("Takım 1");

  const [takim2Adi, setTakim2Adi] =
    useState("Takım 2");

  const [takim, setTakim] =
    useState("Takım 1");

  const [eller, setEller] =
    useState(() => {

      const kayit =
        localStorage.getItem(
          "bricSkor"
        );

      return kayit
        ? JSON.parse(kayit)
        : [];
    });

  useEffect(() => {

    localStorage.setItem(
      "bricSkor",
      JSON.stringify(eller)
    );

  }, [eller]);

  function hesaplaSkor() {

    let puan = 0;

    if (
      renk === "Sinek" ||
      renk === "Karo"
    ) {
      puan = seviye * 20;
    }

    if (
      renk === "Kupa" ||
      renk === "Maça"
    ) {
      puan = seviye * 30;
    }

    if (renk === "NT") {
      puan =
        40 +
        ((seviye - 1) * 30);
    }

    if (sonuc === "+1")
      puan += 30;

    if (sonuc === "+2")
      puan += 60;

    if (sonuc === "-1")
      puan = -50;

    if (sonuc === "-2")
      puan = -100;

    if (sonuc === "-3")
      puan = -150;

    return puan;
  }

  function eliKaydet() {

    if (renk === "") {
      alert("Renk seç");
      return;
    }

    const yeniEl = {
      id: Date.now(),
      takim,
      kontrat:
        `${seviye} ${renk}`,
      sonuc,
      puan: hesaplaSkor(),
    };

    setEller([
      yeniEl,
      ...eller,
    ]);

    setScreen("skor");
  }

  function eliSil(id) {

    const yeniListe =
      eller.filter(
        (el) => el.id !== id
      );

    setEller(yeniListe);
  }

  function takim1Toplam() {

    return eller
      .filter(
        (e) =>
          e.takim === takim1Adi
      )
      .reduce(
        (toplam, e) =>
          toplam + e.puan,
        0
      );
  }

  function takim2Toplam() {

    return eller
      .filter(
        (e) =>
          e.takim === takim2Adi
      )
      .reduce(
        (toplam, e) =>
          toplam + e.puan,
        0
      );
  }

  return (
    <div
      style={{
        background: "#081530",
        minHeight: "100vh",
        color: "white",
        padding: 20,
        fontFamily: "Arial",
      }}
    >

      <div
        style={{
          maxWidth: 500,
          margin: "0 auto",
        }}
      >

        <h1
          style={{
            fontSize: 40,
            marginBottom: 20,
          }}
        >
          Briç Skorboard
        </h1>

        <div
          style={{
            display: "flex",
            gap: 10,
            marginBottom: 25,
          }}
        >

          <button
            onClick={() =>
              setScreen("giris")
            }
            style={{
              flex: 1,
              padding: 16,
              borderRadius: 14,
              border: "none",
              background:
                screen === "giris"
                  ? "#19c37d"
                  : "#374151",
              color: "white",
              fontSize: 22,
            }}
          >
            Giriş
          </button>

          <button
            onClick={() =>
              setScreen("skor")
            }
            style={{
              flex: 1,
              padding: 16,
              borderRadius: 14,
              border: "none",
              background:
                screen === "skor"
                  ? "#19c37d"
                  : "#374151",
              color: "white",
              fontSize: 22,
            }}
          >
            Skor
          </button>

        </div>

        {screen === "giris" && (
          <>

            <div
              style={{
                background: "#111827",
                padding: 20,
                borderRadius: 18,
                marginBottom: 20,
              }}
            >

              <div
                style={{
                  fontSize: 24,
                  marginBottom: 15,
                }}
              >
                Takım İsimleri
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "1fr 1fr",
                  gap: 10,
                  marginBottom: 20,
                }}
              >

                <input
                  value={takim1Adi}
                  onChange={(e) =>
                    setTakim1Adi(
                      e.target.value
                    )
                  }
                  placeholder="Takım 1"
                  style={{
                    padding: 16,
                    borderRadius: 12,
                    border: "none",
                    fontSize: 20,
                  }}
                />

                <input
                  value={takim2Adi}
                  onChange={(e) =>
                    setTakim2Adi(
                      e.target.value
                    )
                  }
                  placeholder="Takım 2"
                  style={{
                    padding: 16,
                    borderRadius: 12,
                    border: "none",
                    fontSize: 20,
                  }}
                />

              </div>

              <div
                style={{
                  fontSize: 24,
                  marginBottom: 15,
                }}
              >
                Kontratı Alan Takım
              </div>

              <div
                style={{
                  display: "flex",
                  gap: 10,
                }}
              >

                <button
                  onClick={() =>
                    setTakim(
                      takim1Adi
                    )
                  }
                  style={{
                    flex: 1,
                    padding: 20,
                    borderRadius: 16,
                    border: "none",
                    background:
                      takim ===
                      takim1Adi
                        ? "#19c37d"
                        : "#2563eb",
                    color: "white",
                    fontSize: 26,
                    fontWeight:
                      "bold",
                  }}
                >
                  {takim1Adi}
                </button>

                <button
                  onClick={() =>
                    setTakim(
                      takim2Adi
                    )
                  }
                  style={{
                    flex: 1,
                    padding: 20,
                    borderRadius: 16,
                    border: "none",
                    background:
                      takim ===
                      takim2Adi
                        ? "#19c37d"
                        : "#dc2626",
                    color: "white",
                    fontSize: 26,
                    fontWeight:
                      "bold",
                  }}
                >
                  {takim2Adi}
                </button>

              </div>

            </div>

            <div
              style={{
                background: "#111827",
                padding: 20,
                borderRadius: 18,
              }}
            >

              <h2>
                Yeni El
              </h2>

              <h3>
                Seviye
              </h3>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "repeat(7,1fr)",
                  gap: 8,
                  marginBottom: 20,
                }}
              >

                {[1,2,3,4,5,6,7]
                  .map((s) => (

                  <button
                    key={s}
                    onClick={() =>
                      setSeviye(s)
                    }
                    style={{
                      padding: 16,
                      borderRadius: 12,
                      border: "none",
                      background:
                        seviye === s
                          ? "#19c37d"
                          : "#374151",
                      color: "white",
                      fontSize: 24,
                    }}
                  >
                    {s}
                  </button>

                ))}

              </div>

              <h3>
                Renk
              </h3>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "1fr 1fr",
                  gap: 10,
                  marginBottom: 20,
                }}
              >

                {[
                  "Sinek",
                  "Karo",
                  "Kupa",
                  "Maça",
                  "NT",
                ].map((r) => (

                  <button
                    key={r}
                    onClick={() =>
                      setRenk(r)
                    }
                    style={{
                      padding: 24,
                      borderRadius: 14,
                      border: "none",
                      background:
                        renk === r
                          ? "#19c37d"
                          : "#2563eb",
                      color: "white",
                      fontSize: 28,
                    }}
                  >
                    {r}
                  </button>

                ))}

              </div>

              <h3>
                Sonuç
              </h3>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "1fr 1fr 1fr",
                  gap: 10,
                  marginBottom: 25,
                }}
              >

                {[
                  "=",
                  "+1",
                  "+2",
                  "-1",
                  "-2",
                  "-3",
                ].map((s) => (

                  <button
                    key={s}
                    onClick={() =>
                      setSonuc(s)
                    }
                    style={{
                      padding: 20,
                      borderRadius: 14,
                      border: "none",
                      background:
                        sonuc === s
                          ? "#19c37d"
                          : "#7c3aed",
                      color: "white",
                      fontSize: 28,
                    }}
                  >
                    {s}
                  </button>

                ))}

              </div>

              <div
                style={{
                  background: "#1f2937",
                  padding: 25,
                  borderRadius: 18,
                  marginBottom: 25,
                  textAlign: "center",
                }}
              >

                <div
                  style={{
                    fontSize: 24,
                  }}
                >
                  Seçilen El
                </div>

                <div
                  style={{
                    fontSize: 42,
                    fontWeight:
                      "bold",
                    marginTop: 10,
                  }}
                >
                  {takim}
                </div>

                <div
                  style={{
                    fontSize: 48,
                    fontWeight:
                      "bold",
                    marginTop: 10,
                  }}
                >
                  {seviye}
                  {" "}
                  {renk}
                  {" "}
                  {sonuc}
                </div>

                <div
                  style={{
                    marginTop: 14,
                    fontSize: 40,
                    color: "#19c37d",
                  }}
                >
                  {hesaplaSkor()}
                </div>

              </div>

              <button
                onClick={eliKaydet}
                style={{
                  width: "100%",
                  padding: 24,
                  borderRadius: 18,
                  border: "none",
                  background:
                    "#19c37d",
                  color: "white",
                  fontSize: 34,
                  fontWeight:
                    "bold",
                }}
              >
                ELİ KAYDET
              </button>

            </div>

          </>
        )}

        {screen === "skor" && (
          <>

            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "1fr 1fr",
                gap: 15,
                marginBottom: 25,
              }}
            >

              <div
                style={{
                  background:
                    "#2563eb",
                  padding: 25,
                  borderRadius: 18,
                  textAlign:
                    "center",
                }}
              >

                <div
                  style={{
                    fontSize: 24,
                  }}
                >
                  {takim1Adi}
                </div>

                <div
                  style={{
                    fontSize: 60,
                    fontWeight:
                      "bold",
                    marginTop: 10,
                  }}
                >
                  {takim1Toplam()}
                </div>

              </div>

              <div
                style={{
                  background:
                    "#dc2626",
                  padding: 25,
                  borderRadius: 18,
                  textAlign:
                    "center",
                }}
              >

                <div
                  style={{
                    fontSize: 24,
                  }}
                >
                  {takim2Adi}
                </div>

                <div
                  style={{
                    fontSize: 60,
                    fontWeight:
                      "bold",
                    marginTop: 10,
                  }}
                >
                  {takim2Toplam()}
                </div>

              </div>

            </div>

            {eller.map((el) => (

              <div
                key={el.id}
                style={{
                  background:
                    "#111827",
                  padding: 20,
                  borderRadius: 18,
                  marginBottom: 14,
                }}
              >

                <div
                  style={{
                    display: "flex",
                    justifyContent:
                      "space-between",
                    alignItems:
                      "center",
                  }}
                >

                  <div>

                    <div
                      style={{
                        fontSize: 28,
                        fontWeight:
                          "bold",
                      }}
                    >
                      {el.takim}
                    </div>

                    <div
                      style={{
                        fontSize: 24,
                        marginTop: 4,
                      }}
                    >
                      {el.kontrat}
                    </div>

                    <div
                      style={{
                        fontSize: 20,
                        color:
                          "#9ca3af",
                        marginTop: 6,
                      }}
                    >
                      Sonuç:
                      {" "}
                      {el.sonuc}
                    </div>

                  </div>

                  <div
                    style={{
                      fontSize: 36,
                      fontWeight:
                        "bold",
                      color:
                        el.puan >= 0
                          ? "#19c37d"
                          : "#ef4444",
                    }}
                  >
                    {el.puan}
                  </div>

                </div>

                <button
                  onClick={() =>
                    eliSil(el.id)
                  }
                  style={{
                    marginTop: 14,
                    padding:
                      "12px 16px",
                    borderRadius: 12,
                    border: "none",
                    background:
                      "#ef4444",
                    color: "white",
                    fontSize: 18,
                  }}
                >
                  Sil
                </button>

              </div>

            ))}

          </>
        )}

      </div>

    </div>
    
  );
}