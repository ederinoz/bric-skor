import { useState, useEffect } from "react";

export default function App() {
  // =========================
  // LOCAL STORAGE SAFE
  // =========================
  const [eller, setEller] = useState(() => {
    try {
      const kayit = localStorage.getItem("eller");
      return kayit ? JSON.parse(kayit) : [];
    } catch {
      return [];
    }
  });

  const [takim1Adi, setTakim1Adi] = useState(
    () => localStorage.getItem("takim1Adi") || ""
  );

  const [takim2Adi, setTakim2Adi] = useState(
    () => localStorage.getItem("takim2Adi") || ""
  );

  // Sayfa yenilenirse skor ekranından devam
  const [screen, setScreen] = useState(() =>
    eller.length > 0 ? "skor" : "giris"
  );

  // =========================
  // STORAGE SAVE
  // =========================
  useEffect(() => {
    localStorage.setItem("eller", JSON.stringify(eller));
    
    // Pull-to-refresh engeli
    document.documentElement.style.overscrollBehavior = "none";
    document.body.style.overscrollBehavior = "none";
  }, [eller]);

  useEffect(() => {
    localStorage.setItem("takim1Adi", takim1Adi);
  }, [takim1Adi]);

  useEffect(() => {
    localStorage.setItem("takim2Adi", takim2Adi);
  }, [takim2Adi]);

  // =========================
  // STATES
  // =========================
  const [takim1Mi, setTakim1Mi] = useState(true);
  const [zon, setZon] = useState("Yok");
  const [renk, setRenk] = useState("NT");
  const [seviye, setSeviye] = useState(1);
  const [kontur, setKontur] = useState("");
  const [sonuc, setSonuc] = useState("Tam");

  // =========================
  // SCORE ENGINE
  // =========================
  function hesaplaSkor() {
    const vulnerable =
      zon === "Herkes Zon" ||
      (zon === "Biz Zon" && takim1Mi) ||
      (zon === "Onlar Zon" && !takim1Mi);

    const major = renk === "Kupa" || renk === "Maça";
    const minor = renk === "Sinek" || renk === "Karo";

    let eksik = sonuc.startsWith("-") ? Math.abs(Number(sonuc)) : 0;
    let fazla = sonuc.startsWith("+") ? Number(sonuc.replace("+", "")) : 0;

    // =====================
    // BATTI
    // =====================
    if (eksik > 0) {
      let ceza = 0;

      // KONTRSUZ
      if (kontur === "") {
        ceza = eksik * (vulnerable ? 100 : 50);
      }
      // KONTRLU
      else if (kontur === "X") {
        if (!vulnerable) {
          if (eksik === 1) ceza = 100;
          else if (eksik === 2) ceza = 300;
          else if (eksik === 3) ceza = 500;
          else {
            ceza = 500 + (eksik - 3) * 300;
          }
        } else {
          if (eksik === 1) ceza = 200;
          else if (eksik === 2) ceza = 500;
          else if (eksik === 3) ceza = 800;
          else {
            ceza = 800 + (eksik - 3) * 300;
          }
        }
      }
      // SURKONTR
      else if (kontur === "XX") {
        if (!vulnerable) {
          if (eksik === 1) ceza = 200;
          else if (eksik === 2) ceza = 600;
          else if (eksik === 3) ceza = 1000;
          else {
            ceza = 1000 + (eksik - 3) * 600;
          }
        } else {
          if (eksik === 1) ceza = 400;
          else if (eksik === 2) ceza = 1000;
          else if (eksik === 3) ceza = 1600;
          else {
            ceza = 1600 + (eksik - 3) * 600;
          }
        }
      }

      return takim1Mi ? { t1: 0, t2: ceza } : { t1: ceza, t2: 0 };
    }

    // =====================
    // LOVE PUANI
    // =====================
    let lovePuani = 0;
    if (minor) lovePuani = seviye * 20;
    if (major) lovePuani = seviye * 30;
    if (renk === "NT") lovePuani = 40 + (seviye - 1) * 30;

    let asilLovePuani = lovePuani;
    if (kontur === "X") asilLovePuani *= 2;
    if (kontur === "XX") asilLovePuani *= 4;

    // =====================
    // BONUSLAR
    // =====================
    let ikramiye = 0;

    // GAME / PARTSCORE
    if (lovePuani >= 100) {
      ikramiye += vulnerable ? 500 : 300;
    } else {
      ikramiye += 50;
    }

    // ŞILEM
    if (seviye === 6) ikramiye += vulnerable ? 750 : 500;
    // GRAND ŞILEM
    if (seviye === 7) ikramiye += vulnerable ? 1500 : 1000;

    // INSULT BONUS
    if (kontur === "X") ikramiye += 50;
    if (kontur === "XX") ikramiye += 100;

    // =====================
    // OVERTRICK
    // =====================
    let overtrick = 0;
    if (fazla > 0) {
      if (kontur === "") {
        overtrick = fazla * (minor ? 20 : 30);
      } else if (kontur === "X") {
        overtrick = fazla * (vulnerable ? 200 : 100);
      } else if (kontur === "XX") {
        overtrick = fazla * (vulnerable ? 400 : 200);
      }
    }

    // =====================
    // TOTAL
    // =====================
    const toplam = asilLovePuani + ikramiye + overtrick;

    return takim1Mi ? { t1: toplam, t2: 0 } : { t1: 0, t2: toplam };
  }

  // =========================
  // SAVE HAND
  // =========================
  function eliKaydet() {
    const skor = hesaplaSkor();
    const t1Name = takim1Adi || "Takım 1";
    const t2Name = takim2Adi || "Takım 2";

    const yeniEl = {
      id: Date.now(),
      oynayanTakim: takim1Mi ? t1Name : t2Name,
      kontrat: seviye + " " + renk,
      kontur,
      sonuc,
      zon,
      t1: skor.t1,
      t2: skor.t2,
    };

    setEller((prev) => [yeniEl, ...prev]);
    setScreen("skor");

    // FORM RESET
    setSeviye(1);
    setRenk("NT");
    setKontur("");
    setSonuc("Tam");
  }

  // =========================
  // TOTALS
  // =========================
  function takim1Toplam() {
    return eller.reduce((toplam, el) => toplam + el.t1, 0);
  }

  function takim2Toplam() {
    return eller.reduce((toplam, el) => toplam + el.t2, 0);
  }

  // =========================
  // DELETE
  // =========================
  function eliSil(id) {
    setEller((prev) => prev.filter((el) => el.id !== id));
  }

  // =========================
  // UI
  // =========================
  return (
    <div
      style={{
        background: "#081530",
        minHeight: "100vh",
        color: "white",
        padding: 20,
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div style={{ maxWidth: 520, margin: "0 auto" }}>
        <h1 style={{ fontSize: 36, marginBottom: 20, textAlign: "center" }}>
          Briç Skorboard
        </h1>

        {/* SEKMELER */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 20 }}>
          <button
            onClick={() => setScreen("giris")}
            style={{
              padding: 16,
              borderRadius: 14,
              border: "none",
              background: screen === "giris" ? "#19c37d" : "#374151",
              color: "white",
              fontSize: 20,
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            Veri Girişi
          </button>
          <button
            onClick={() => setScreen("skor")}
            style={{
              padding: 16,
              borderRadius: 14,
              border: "none",
              background: screen === "skor" ? "#19c37d" : "#374151",
              color: "white",
              fontSize: 20,
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            Skor Tahtası
          </button>
        </div>

        {/* 1. EKRAN: GİRİŞ */}
        {screen === "giris" && (
          <div style={{ background: "#111827", padding: 20, borderRadius: 20 }}>
            {/* TAKIM ADLARI INPUTLARI */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 20 }}>
              <input
                value={takim1Adi}
                onChange={(e) => setTakim1Adi(e.target.value)}
                placeholder="Takım 1"
                style={{ padding: 14, borderRadius: 12, border: "none", fontSize: 16 }}
              />
              <input
                value={takim2Adi}
                onChange={(e) => setTakim2Adi(e.target.value)}
                placeholder="Takım 2"
                style={{ padding: 14, borderRadius: 12, border: "none", fontSize: 16 }}
              />
            </div>

            {/* DEKLARE EDEN TAKIM */}
            <label style={{ display: "block", marginBottom: 8, color: "#9ca3af" }}>Kontratı Alan Takım:</label>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 20 }}>
              <button
                onClick={() => setTakim1Mi(true)}
                style={{
                  padding: 16,
                  borderRadius: 12,
                  border: "none",
                  background: takim1Mi ? "#2563eb" : "#374151",
                  color: "white",
                  fontWeight: "bold",
                  cursor: "pointer"
                }}
              >
                {takim1Adi || "Takım 1"}
              </button>
              <button
                onClick={() => setTakim1Mi(false)}
                style={{
                  padding: 16,
                  borderRadius: 12,
                  border: "none",
                  background: !takim1Mi ? "#2563eb" : "#374151",
                  color: "white",
                  fontWeight: "bold",
                  cursor: "pointer"
                }}
              >
                {takim2Adi || "Takım 2"}
              </button>
            </div>

            {/* KOZ / NT SEÇİMİ */}
            <label style={{ display: "block", marginBottom: 8, color: "#9ca3af" }}>Koz / NT:</label>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 6, marginBottom: 20 }}>
              {["Sinek", "Karo", "Kupa", "Maça", "NT"].map((r) => (
                <button
                  key={r}
                  onClick={() => setRenk(r)}
                  style={{
                    padding: 12,
                    borderRadius: 10,
                    border: "none",
                    background: renk === r ? "#f59e0b" : "#374151",
                    color: "white",
                    fontWeight: "bold",
                    cursor: "pointer"
                  }}
                >
                  {r === "NT" ? "NT" : r === "Sinek" ? "♣ S" : r === "Karo" ? "♦ K" : r === "Kupa" ? "♥ K" : "♠ M"}
                </button>
              ))}
            </div>

            {/* SEVİYE SEÇİMİ */}
            <label style={{ display: "block", marginBottom: 8, color: "#9ca3af" }}>Kontrat Seviyesi:</label>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 6, marginBottom: 20 }}>
              {[1, 2, 3, 4, 5, 6, 7].map((s) => (
                <button
                  key={s}
                  onClick={() => setSeviye(s)}
                  style={{
                    padding: 12,
                    borderRadius: 10,
                    border: "none",
                    background: seviye === s ? "#19c37d" : "#374151",
                    color: "white",
                    fontWeight: "bold",
                    cursor: "pointer"
                  }}
                >
                  {s}
                </button>
              ))}
            </div>

            {/* KONTUR DURUMU */}
            <label style={{ display: "block", marginBottom: 8, color: "#9ca3af" }}>Kontur:</label>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 20 }}>
              {["", "X", "XX"].map((k) => (
                <button
                  key={k}
                  onClick={() => setKontur(k)}
                  style={{
                    padding: 12,
                    borderRadius: 10,
                    border: "none",
                    background: kontur === k ? "#7c3aed" : "#374151",
                    color: "white",
                    fontWeight: "bold",
                    cursor: "pointer"
                  }}
                >
                  {k === "" ? "Yok" : k === "X" ? "X" : "XX"}
                </button>
              ))}
            </div>

            {/* SONUÇ SEÇİMİ */}
            <label style={{ display: "block", marginBottom: 8, color: "#9ca3af" }}>Sonuç:</label>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 6, marginBottom: 20 }}>
              {["Tam", "+1", "+2", "+3", "-1", "-2", "-3", "-4"].map((s) => (
                <button
                  key={s}
                  onClick={() => setSonuc(s)}
                  style={{
                    padding: 12,
                    borderRadius: 10,
                    border: "none",
                    background: sonuc === s ? "#ec4899" : "#374151",
                    color: "white",
                    cursor: "pointer"
                  }}
                >
                  {s}
                </button>
              ))}
            </div>

            {/* ZON DURUMU */}
            <label style={{ display: "block", marginBottom: 8, color: "#9ca3af" }}>Zon Durumu:</label>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 20 }}>
              {["Yok", "Biz Zon", "Onlar Zon", "Herkes Zon"].map((z) => (
                <button
                  key={z}
                  onClick={() => setZon(z)}
                  style={{
                    padding: 12,
                    borderRadius: 10,
                    border: "none",
                    background: zon === z ? "#06b6d4" : "#374151",
                    color: "white",
                    cursor: "pointer"
                  }}
                >
                  {z}
                </button>
              ))}
            </div>

            {/* KAYDET BUTONU */}
            <button
              onClick={eliKaydet}
              style={{
                width: "100%",
                padding: 20,
                borderRadius: 14,
                border: "none",
                background: "#2563eb",
                color: "white",
                fontSize: 22,
                fontWeight: "bold",
                cursor: "pointer",
              }}
            >
              ELİ KAYDET
            </button>
          </div>
        )}

        {/* 2. EKRAN: SKOR TAHTASI */}
        {screen === "skor" && (
          <>
            {/* TOPLAM PUAN KUTULARI */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 20 }}>
              <div style={{ background: "#2563eb", padding: 20, borderRadius: 18, textAlign: "center" }}>
                <div style={{ fontSize: 16, marginBottom: 8, opacity: 0.9 }}>{takim1Adi || "Takım 1"}</div>
                <div style={{ fontSize: 38, fontWeight: "bold" }}>{takim1Toplam()}</div>
              </div>
              <div style={{ background: "#dc2626", padding: 20, borderRadius: 18, textAlign: "center" }}>
                <div style={{ fontSize: 16, marginBottom: 8, opacity: 0.9 }}>{takim2Adi || "Takım 2"}</div>
                <div style={{ fontSize: 38, fontWeight: "bold" }}>{takim2Toplam()}</div>
              </div>
            </div>

            {/* GEÇMİŞ EL KARTLARI */}
            {eller.length === 0 ? (
              <p style={{ textAlign: "center", color: "#6b7280", marginTop: 40 }}>Henüz oynanmış el yok.</p>
            ) : (
              eller.map((el) => (
                <div
                  key={el.id}
                  style={{
                    background: "#111827",
                    padding: 18,
                    borderRadius: 16,
                    marginBottom: 10,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center"
                  }}
                >
                  <div>
                    <div style={{ fontSize: 18, fontWeight: "bold" }}>Oynayan: {el.oynayanTakim}</div>
                    <div style={{ color: "#9ca3af", fontSize: 14, marginTop: 4 }}>
                      {el.kontrat} {el.kontur} ({el.sonuc}) | {el.zon}
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: 15, fontWeight: "bold" }}>
                      T1: <span style={{ color: el.t1 > 0 ? "#19c37d" : "white" }}>+{el.t1}</span>
                    </div>
                    <div style={{ fontSize: 15, fontWeight: "bold" }}>
                      T2: <span style={{ color: el.t2 > 0 ? "#19c37d" : "white" }}>+{el.t2}</span>
                    </div>
                    <button
                      onClick={() => { if(window.confirm("Bu eli silmek istiyor musunuz?")) eliSil(el.id); }}
                      style={{
                        marginTop: 6,
                        padding: "4px 10px",
                        borderRadius: 8,
                        border: "none",
                        background: "#dc2626",
                        color: "white",
                        fontSize: 12,
                        cursor: "pointer"
                      }}
                    >
                      Sil
                    </button>
                  </div>
                </div>
              ))
            )}

            {/* SIFIRLA BUTONU */}
            {eller.length > 0 && (
              <button
                onClick={() => {
                  if (window.confirm("Tüm oyun geçmişini sıfırlamak istediğinize emin misiniz?")) {
                    setEller([]);
                    setTakim1Adi("");
                    setTakim2Adi("");
                    localStorage.removeItem("eller");
                    localStorage.removeItem("takim1Adi");
                    localStorage.removeItem("takim2Adi");
                    setScreen("giris");
                  }
                }}
                style={{
                  width: "100%",
                  marginTop: 20,
                  padding: 16,
                  borderRadius: 14,
                  border: "none",
                  background: "#dc2626",
                  color: "white",
                  fontSize: 18,
                  fontWeight: "bold",
                  cursor: "pointer",
                }}
              >
                Oyunu Sıfırla
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}
