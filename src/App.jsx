import { useEffect, useState } from "react";

export default function App() {
  const [screen, setScreen] = useState("giris");
  const [takim1Adi, setTakim1Adi] = useState("Takım 1");
  const [takim2Adi, setTakim2Adi] = useState("Takım 2");
  const [takim, setTakim] = useState("Takım 1");
  const [zon, setZon] = useState("Yok");
  const [seviye, setSeviye] = useState(1);
  const [renk, setRenk] = useState("Sinek");
  const [sonuc, setSonuc] = useState("=");
  const [kontur, setKontur] = useState("Yok");

  const [eller, setEller] = useState(() => {
    try {
      const kayit = localStorage.getItem("bricSkor");
      return kayit ? JSON.parse(kayit) : [];
    } catch (e) {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("bricSkor", JSON.stringify(eller));
  }, [eller]);

  function hesaplaSkor() {
    let puan = 0;
    const isVulnerable = (zon === "Biz Zon" || zon === "Herkes Zon");
    const katsayi = kontur === "Kontr" ? 2 : kontur === "Sürkontr" ? 4 : 1;

    if (sonuc.startsWith("-")) {
      const batarSayisi = Math.abs(parseInt(sonuc));
      if (kontur === "Yok") {
        puan = batarSayisi * (isVulnerable ? -100 : -50);
      } else {
        const ilkBatar = isVulnerable ? -200 : -100;
        const ekBatarPuan = isVulnerable ? -300 : -200;
        puan = (ilkBatar + (batarSayisi - 1) * ekBatarPuan) * (kontur === "Sürkontr" ? 2 : 1);
      }
    } else {
      let temelPuan = 0;
      if (renk === "Sinek" || renk === "Karo") temelPuan = seviye * 20;
      else if (renk === "Kupa" || renk === "Maça") temelPuan = seviye * 30;
      else if (renk === "NT") temelPuan = 40 + (seviye - 1) * 30;

      puan = temelPuan * katsayi;

      if (sonuc !== "=") {
        const fazla = parseInt(sonuc);
        if (kontur === "Yok") {
          puan += fazla * (renk === "Sinek" || renk === "Karo" ? 20 : 30);
        } else {
          puan += fazla * (isVulnerable ? 200 : 100) * (kontur === "Sürkontr" ? 2 : 1);
        }
      }
      if (kontur !== "Yok") puan += (kontur === "Kontr" ? 50 : 100);
    }
    return puan;
  }

  function eliKaydet() {
    const yeniEl = {
      id: Date.now(),
      takim,
      kontrat: `${seviye}${renk === 'NT' ? 'NT' : (renk === 'Sinek' ? '♣' : renk === 'Karo' ? '♦' : renk === 'Kupa' ? '♥' : '♠')}`,
      sonuc,
      zon,
      kontur: kontur === "Yok" ? "" : kontur,
      puan: hesaplaSkor(),
    };
    
    setEller(prev => [yeniEl, ...prev]);
    setScreen("skor");
    setSonuc("=");
    setKontur("Yok");
  }

  function eliSil(id) {
    setEller(prev => prev.filter(el => el.id !== id));
  }

  function tabelayiSifirla() {
    if (window.confirm("Tabelayı sıfırlamak istediğine emin misin?")) {
      setEller([]);
    }
  }

  const t1Top = eller.filter(e => e.takim === takim1Adi).reduce((s, e) => s + e.puan, 0);
  const t2Top = eller.filter(e => e.takim === takim2Adi).reduce((s, e) => s + e.puan, 0);

  return (
    <div style={{ minHeight: "100vh", background: "#081530", color: "white", padding: "15px", fontFamily: "Arial, sans-serif" }}>
      <div style={{ maxWidth: 500, margin: "0 auto" }}>
        
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 20 }}>
          <button onClick={() => setScreen("giris")} style={{ padding: 14, borderRadius: 12, border: 'none', background: screen === "giris" ? "#19c37d" : "#374151", color: 'white', fontWeight: 'bold' }}>Giriş</button>
          <button onClick={() => setScreen("skor")} style={{ padding: 14, borderRadius: 12, border: 'none', background: screen === "skor" ? "#19c37d" : "#374151", color: 'white', fontWeight: 'bold' }}>Skor</button>
          <button onClick={tabelayiSifirla} style={{ padding: 14, borderRadius: 12, border: 'none', background: "#ef4444", color: 'white', fontSize: '11px' }}>Sıfırla</button>
        </div>

        {screen === "giris" && (
          <div style={{ background: "#111827", padding: 20, borderRadius: 20 }}>
            <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
              <input value={takim1Adi} onChange={e => setTakim1Adi(e.target.value)} style={{ width: '50%', padding: 12, borderRadius: 10, border: 'none', background: '#374151', color: 'white', textAlign: 'center' }} />
              <input value={takim2Adi} onChange={e => setTakim2Adi(e.target.value)} style={{ width: '50%', padding: 12, borderRadius: 10, border: 'none', background: '#374151', color: 'white', textAlign: 'center' }} />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 25 }}>
              <button onClick={() => setTakim(takim1Adi)} style={{ padding: 16, borderRadius: 12, border: "none", background: takim === takim1Adi ? "#19c37d" : "#2563eb", color: "white", fontWeight: 'bold' }}>{takim1Adi}</button>
              <button onClick={() => setTakim(takim2Adi)} style={{ padding: 16, borderRadius: 12, border: "none", background: takim === takim2Adi ? "#19c37d" : "#dc2626", color: "white", fontWeight: 'bold' }}>{takim2Adi}</button>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 5, marginBottom: 15 }}>
              {["Sinek", "Karo", "Kupa", "Maça", "NT"].map(r => (
                <button key={r} onClick={() => setRenk(r)} style={{ padding: 12, fontSize: 11, borderRadius: 8, border: 'none', background: renk === r ? "#2563eb" : "#374151", color: 'white' }}>{r}</button>
              ))}
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 5, marginBottom: 25 }}>
              {[1, 2, 3, 4, 5, 6, 7].map(s => (
                <button key={s} onClick={() => setSeviye(s)} style={{ padding: 12, borderRadius: 8, border: 'none', background: seviye === s ? "#19c37d" : "#374151", color: 'white', fontWeight: 'bold' }}>{s}</button>
              ))}
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 15 }}>
              {["Yok", "Kontr", "Sürkontr"].map(k => (
                <button key={k} onClick={() => setKontur(k)} style={{ padding: 12, borderRadius: 8, border: 'none', background: kontur === k ? "#8b5cf6" : "#4b5563", color: 'white' }}>{k}</button>
              ))}
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 5, marginBottom: 25 }}>
              {["-3", "-2", "-1", "=", "+1", "+2", "+3"].map(s => (
                <button key={s} onClick={() => setSonuc(s)} style={{ padding: 12, borderRadius: 8, border: 'none', background: sonuc === s ? "#f59e0b" : "#374151", color: 'white' }}>{s}</button>
              ))}
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 8, marginBottom: 30 }}>
              {["Yok", "Biz Zon", "Onlar Zon", "Herkes Zon"].map(z => (
                <button key={z} onClick={() => setZon(z)} style={{ padding: 10, fontSize: 13, borderRadius: 8, border: 'none', background: zon === z ? "#19c37d" : "#374151", color: 'white' }}>{z}</button>
              ))}
            </div>

            <button onClick={eliKaydet} style={{ width: "100%", padding: 22, borderRadius: 15, border: "none", background: "#19c37d", color: "white", fontSize: 24, fontWeight: "bold" }}>ELİ KAYDET</button>
          </div>
        )}

        {screen === "skor" && (
          <div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 15, marginBottom: 25 }}>
              <div style={{ background: "#2563eb", padding: 20, borderRadius: 20, textAlign: 'center' }}>
                <div style={{ fontSize: 14 }}>{takim1Adi}</div>
                <div style={{ fontSize: 44, fontWeight: 'bold' }}>{t1Top}</div>
              </div>
              <div style={{ background: "#dc2626", padding: 20, borderRadius: 20, textAlign: 'center' }}>
                <div style={{ fontSize: 14 }}>{takim2Adi}</div>
                <div style={{ fontSize: 44, fontWeight: 'bold' }}>{t2Top}</div>
              </div>
            </div>
            
            {eller.map(el => (
              <div key={el.id} style={{ background: "#111827", padding: 18, borderRadius: 18, marginBottom: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderLeft: `6px solid ${el.takim === takim1Adi ? '#2563eb' : '#dc2626'}` }}>
                <div>
                  <div style={{ fontWeight: 'bold' }}>{el.takim}</div>
                  <div style={{ fontSize: 14, color: '#9ca3af' }}>{el.kontrat} {el.kontur} {el.sonuc} | {el.zon}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 24, fontWeight: 'bold', color: el.puan >= 0 ? '#19c37d' : '#ef4444' }}>{el.puan > 0 ? `+${el.puan}` : el.puan}</div>
                  <button onClick={() => eliSil(el.id)} style={{ color: '#ef4444', background: 'none', border: 'none', fontSize: 13, cursor: 'pointer' }}>Sil</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}