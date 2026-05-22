import { useState, useEffect } from "react";

export default function App() {

  // ==========================================
  // ERGUN BEY'İN GÜNEY MERKEZLİ ŞAŞMAZ ZON MOTORU
  // 1: Herkes, 2: Onlar, 3: Biz, 4: Hiç Kimse
  // ==========================================
  function otomatikZon(board) {
    const dongu = (board - 1) % 4; // 0, 1, 2, 3 şeklinde döner
    
    if (dongu === 0) return "Herkes Zon";
    if (dongu === 1) return "Onlar Zon";
    if (dongu === 2) return "Biz Zon";
    if (dongu === 3) return "Hiç Kimse";
    return "Hiç Kimse";
  }

  // =========================
  // LOCAL STORAGE GÜVENLİĞİ
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

  const [screen, setScreen] = useState(
    () => eller.length > 0 ? "skor" : "giris"
  );

  useEffect(() => {
    localStorage.setItem("eller", JSON.stringify(eller));
  }, [eller]);

  useEffect(() => {
    localStorage.setItem("takim1Adi", takim1Adi);
  }, [takim1Adi]);

  useEffect(() => {
    localStorage.setItem("takim2Adi", takim2Adi);
  }, [takim2Adi]);

  // =========================
  // BOARD HESAPLAMA
  // =========================
  const boardNo = eller.length + 1;

  // =========================
  // SEÇİM DURUMLARI (STATES)
  // =========================
  const [takim1Mi, setTakim1Mi] = useState(true);
  const [zon, setZon] = useState(() => otomatikZon(eller.length + 1));
  const [renk, setRenk] = useState("NT");
  const [seviye, setSeviye] = useState(1);
  const [kontur, setKontur] = useState("");
  const [sonuc, setSonuc] = useState("Tam");

  // =========================
  // SKOR MOTORU
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

    // --- BATTI CEZALARI ---
    if (eksik > 0) {
      let ceza = 0;
      if (kontur === "") {
        ceza = eksik * (vulnerable ? 100 : 50);
      } else if (kontur === "X") {
        if (!vulnerable) {
          if (eksik === 1) ceza = 100;
          else if (eksik === 2) ceza = 300;
          else if (eksik === 3) ceza = 500;
          else ceza = 500 + (eksik - 3) * 300;
        } else {
          if (eksik === 1) ceza = 200;
          else if (eksik === 2) ceza = 500;
          else if (eksik === 3) ceza = 800;
          else ceza = 800 + (eksik - 3) * 300;
        }
      } else if (kontur === "XX") {
        if (!vulnerable) {
          if (eksik === 1) ceza = 200;
          else if (eksik === 2) ceza = 600;
          else if (eksik === 3) ceza = 1000;
          else ceza = 1000 + (eksik - 3) * 600;
        } else {
          if (eksik === 1) ceza = 400;
          else if (eksik === 2) ceza = 1000;
          else if (eksik === 3) ceza = 1600;
          else ceza = 1600 + (eksik - 3) * 600;
        }
      }
      return takim1Mi ? { t1: 0, t2: ceza } : { t1: ceza, t2: 0 };
    }

    // --- LÖVE PUANI ---
    let lovePuani = 0;
    if (minor) lovePuani = seviye * 20;
    if (major) lovePuani = seviye * 30;
    if (renk === "NT") {
      lovePuani = 40 + (seviye - 1) * 30;
    }

    let asilLovePuani = lovePuani;
    if (kontur === "X") asilLovePuani *= 2;
    if (kontur === "XX") asilLovePuani *= 4;

    // --- IKRAMIYE / BONUS ---
    let ikramiye = 0;
    if (lovePuani >= 100) {
      ikramiye += vulnerable ? 500 : 300;
    } else {
      ikramiye += 50;
    }

    if (seviye === 6) {
      ikramiye += vulnerable ? 750 : 500;
    }
    if (seviye === 7) {
      ikramiye += vulnerable ? 1500 : 1000;
    }
    if (kontur === "X") ikramiye += 50;
    if (kontur === "XX") ikramiye += 100;

    // --- OVERTRICK (FAZLA LÖVE) ---
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

    const toplam = asilLovePuani + ikramiye + overtrick;
    return takim1Mi ? { t1: toplam, t2: 0 } : { t1: 0, t2: toplam };
  }

  // =========================
  // ELİ KAYDET SİSTEMİ
  // =========================
  function eliKaydet() {
    const skor = hesaplaSkor();

    const yeniEl = {
      id: Date.now(),
      board: boardNo,
      oynayanTakim: takim1Mi ? (takim1Adi || "Takım 1") : (takim2Adi || "Takım 2"),
      kontrat: seviye + " " + renk,
      kontur,
      sonuc,
      zon,
      t1: skor.t1,
      t2: skor.t2,
    };

    const guncelEller = [yeniEl, ...eller];
    setEller(guncelEller);
    setScreen("skor");

    // Formu temizle ve sonraki elin zonunu otomatik belirle
    setSeviye(1);
    setRenk("NT");
    setKontur("");
    setSonuc("Tam");
    setZon(otomatikZon(guncelEller.length + 1));
  }

  function eliSil(id) {
    const kalanEller = eller.filter((el) => el.id !== id);
    setEller(kalanEller);
    setZon(otomatikZon(kalanEller.length + 1));
  }

  // ===================================
  // KOZ / NT DİNAMİK RENK MOTORU
  // ===================================
  function getKozButonStyle(butonRengi) {
    const isSelected = renk === butonRengi;
    let baseBg = "#374151";
    let textColor = "#ffffff";

    const renkPaleti = {
      Sinek: "#19c37d",
      Karo: "#f97316",
      Kupa: "#ef4444",
      Maça: "#2563eb",
      NT: "#eab308"
    };

    if (isSelected) {
      baseBg = renkPaleti[butonRengi];
      textColor = "#ffffff";
    } else {
      textColor = renkPaleti[butonRengi];
    }

    return {
      padding: 12,
      borderRadius: 10,
      border: "none",
      background: baseBg,
      color: textColor,
      fontWeight: "bold",
      fontSize: 16,
      cursor: "pointer",
      transition: "all 0.15s ease"
    };
  }

  return (
    <div style={{ background: "#081530", minHeight: "100vh", color: "white", padding: 20, fontFamily: "Arial, sans-serif" }}>
      <div style={{ maxWidth: 520, margin: "0 auto" }}>
        <h1 style={{ fontSize: 36, marginBottom: 10, textAlign: "center" }}>Briç Skorboard</h1>
        
        <div style={{ textAlign: "center", marginBottom: 20, fontSize: 20, fontWeight: "bold", color: "#06b6d4" }}>
          Board #{boardNo} | {zon}
        </div>
        
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 20 }}>
          <button onClick={() => setScreen("giris")} style={{ padding: 16, borderRadius: 14, border: "none", background: screen === "giris" ? "#19c37d" : "#374151", color: "white", fontSize: 20, fontWeight: "bold", cursor: "pointer" }}>Veri Girişi</button>
          <button onClick={() => setScreen("skor")} style={{ padding: 16, borderRadius: 14, border: "none", background: screen === "skor" ? "#19c37d" : "#374151", color: "white", fontSize: 20, fontWeight: "bold", cursor: "pointer" }}>Skor Tahtası</button>
        </div>

        {screen === "giris" && (
          <div style={{ background: "#111827", padding: 20, borderRadius: 20 }}>
            <label style={{ display: "block", marginBottom: 8, color: "#9ca3af" }}>Kontratı Alan Takım:</label>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 20 }}>
              <button onClick={() => setTakim1Mi(true)} style={{ padding: 16, borderRadius: 12, border: "none", background: takim1Mi ? "#2563eb" : "#374151", color: "white", fontWeight: "bold", cursor: "pointer" }}>{takim1Adi || "Takım 1"}</button>
              <button onClick={() => setTakim1Mi(false)} style={{ padding: 16, borderRadius: 12, border: "none", background: !takim1Mi ? "#2563eb" : "#374151", color: "white", fontWeight: "bold", cursor: "pointer" }}>{takim2Adi || "Takım 2"}</button>
            </div>

            <label style={{ display: "block", marginBottom: 8, color: "#9ca3af" }}>Koz / NT:</label>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 6, marginBottom: 20 }}>
              <button type="button" onClick={() => setRenk("Sinek")} style={getKozButonStyle("Sinek")}>♣ S</button>
              <button type="button" onClick={() => setRenk("Karo")} style={getKozButonStyle("Karo")}>♦ K</button>
              <button type="button" onClick={() => setRenk("Kupa")} style={getKozButonStyle("Kupa")}>♥ K</button>
              <button type="button" onClick={() => setRenk("Maça")} style={getKozButonStyle("Maça")}>♠ M</button>
              <button type="button" onClick={() => setRenk("NT")} style={getKozButonStyle("NT")}>NT</button>
            </div>

            <label style={{ display: "block", marginBottom: 8, color: "#9ca3af" }}>Kontrat Seviyesi:</label>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 6, marginBottom: 20 }}>
              {[1, 2, 3, 4, 5, 6, 7].map((s) => (
                <button key={s} onClick={() => setSeviye(s)} style={{ padding: 12, borderRadius: 10, border: "none", background: seviye === s ? "#19c37d" : "#374151", color: "white", fontWeight: "bold", cursor: "pointer" }}>{s}</button>
              ))}
            </div>

            <label style={{ display: "block", marginBottom: 8, color: "#9ca3af" }}>Kontur:</label>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 20 }}>
              {["", "X", "XX"].map((k) => (
                <button key={k} onClick={() => setKontur(k)} style={{ padding: 12, borderRadius: 10, border: "none", background: kontur === k ? "#7c3aed" : "#374151", color: "white", fontWeight: "bold", cursor: "pointer" }}>{k === "" ? "Yok" : k}</button>
              ))}
            </div>

            <label style={{ display: "block", marginBottom: 8, color: "#9ca3af" }}>Sonuç:</label>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 6, marginBottom: 20 }}>
              {["Tam", "+1", "+2", "+3", "-1", "-2", "-3", "-4"].map((s) => (
                <button key={s} onClick={() => setSonuc(s)} style={{ padding: 12, borderRadius: 10, border: "none", background: sonuc === s ? "#ec4899" : "#374151", color: "white", cursor: "pointer" }}>{s}</button>
              ))}
            </div>

            <button onClick={eliKaydet} style={{ width: "100%", padding: 20, borderRadius: 14, border: "none", background: "#2563eb", color: "white", fontSize: 22, fontWeight: "bold", cursor: "pointer" }}>ELİ KAYDET</button>
          </div>
        )}

        {screen === "skor" && (
          <>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 20 }}>
              <input value={takim1Adi} onChange={(e) => setTakim1Adi(e.target.value)} placeholder="Takım 1 İsmi" style={{ padding: 14, borderRadius: 12, border: "none", fontSize: 16, background: "#111827", color: "white" }} />
              <input value={takim2Adi} onChange={(e) => setTakim2Adi(e.target.value)} placeholder="Takım 2 İsmi" style={{ padding: 14, borderRadius: 12, border: "none", fontSize: 16, background: "#111827", color: "white" }} />
            </div>
            
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 20 }}>
              <div style={{ background: "#111827", padding: 20, borderRadius: 18, textAlign: "center", borderTop: "4px solid #19c37d" }}>
                <div style={{ fontSize: 18, marginBottom: 8, color: "#9ca3af" }}>{takim1Adi || "Takım 1"}</div>
                <div style={{ fontSize: 36, fontWeight: "bold" }}>{eller.reduce((a, b) => a + b.t1, 0)}</div>
              </div>
              <div style={{ background: "#111827", padding: 20, borderRadius: 18, textAlign: "center", borderTop: "4px solid #ef4444" }}>
                <div style={{ fontSize: 18, marginBottom: 8, color: "#9ca3af" }}>{takim2Adi || "Takım 2"}</div>
                <div style={{ fontSize: 36, fontWeight: "bold" }}>{eller.reduce((a, b) => a + b.t2, 0)}</div>
              </div>
            </div>
            
            {eller.length === 0 ? (
              <p style={{ textAlign: "center", color: "#6b7280", marginTop: 40 }}>Henüz oynanmış el yok.</p>
            ) : (
              eller.map((el) => (
                <div key={el.id} style={{ background: "#111827", padding: 18, borderRadius: 16, marginBottom: 10, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <div style={{ fontSize: 18, fontWeight: "bold" }}>Board {el.board}: {el.oynayanTakim}</div>
                    <div style={{ color: "#9ca3af", fontSize: 14, marginTop: 4 }}>{el.kontrat} {el.kontur} ({el.sonuc}) | {el.zon}</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: 15, fontWeight: "bold" }}>T1: <span style={{ color: el.t1 > 0 ? "#19c37d" : "white" }}>+{el.t1}</span></div>
                    <div style={{ fontSize: 15, fontWeight: "bold" }}>T2: <span style={{ color: el.t2 > 0 ? "#19c37d" : "white" }}>+{el.t2}</span></div>
                    <button onClick={() => { if(window.confirm("Bu eli silmek istiyor musunuz?")) eliSil(el.id); }} style={{ marginTop: 6, padding: "4px 10px", borderRadius: 8, border: "none", background: "#dc2626", color: "white", fontSize: 12, cursor: "pointer" }}>Sil</button>
                  </div>
                </div>
              ))
            )}
            {eller.length > 0 && (
              <button onClick={() => { if (window.confirm("Tüm oyun geçmişini sıfırlamak istediğinize emin misiniz?")) { setEller([]); setTakim1Adi(""); setTakim2Adi(""); localStorage.removeItem("eller"); localStorage.removeItem("takim1Adi"); localStorage.removeItem("takim2Adi"); setScreen("giris"); } }} style={{ width: "100%", marginTop: 20, padding: 16, borderRadius: 14, border: "none", background: "#dc2626", color: "white", fontSize: 18, fontWeight: "bold", cursor: "pointer" }}>Oyunu Sıfırla</button>
            )}
          </>
        )}
      </div>
    </div>
  );
}
