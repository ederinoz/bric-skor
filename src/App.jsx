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
    const kayit = localStorage.getItem("bricSkor");
    return kayit ? JSON.parse(kayit) : [];
  });

  useEffect(() => {
    localStorage.setItem("bricSkor", JSON.stringify(eller));
  }, [eller]);

  function hesaplaSkor() {
    let puan = 0;
    // Kontrat Puanı (Baz)
    if (renk === "Sinek" || renk === "Karo") puan = seviye * 20;
    if (renk === "Kupa" || renk === "Maça") puan = seviye * 30;
    if (renk === "NT") puan = 40 + (seviye - 1) * 30;

    // Fazla Löve Puanları (Kontursuz basit hesap)
    if (sonuc === "+1") puan += (renk === "Sinek" || renk === "Karo" ? 20 : 30);
    if (sonuc === "+2") puan += (renk === "Sinek" || renk === "Karo" ? 40 : 60);
    if (sonuc === "+3") puan += (renk === "Sinek" || renk === "Karo" ? 60 : 90);

    // Batarlar (Kontursuz basit hesap)
    const isVulnerable = (zon === "Onlar Zon" || zon === "Herkes Zon");
    if (sonuc === "-1") puan = isVulnerable ? -100 : -50;
    if (sonuc === "-2") puan = isVulnerable ? -200 : -100;
    if (sonuc === "-3") puan = isVulnerable ? -300 : -150;
    if (kontur === "Kontr") {
  puan *= 2;
}

if (kontur === "Sürkontr") {
  puan *= 4;
}

    return puan;
  }

  function eliKaydet() {
    const yeniEl = {
      id: Date.now(),
      takim,
      kontrat: `${seviye} ${renk}`,
      sonuc,
      zon,
      kontur,
      puan: hesaplaSkor(),
    };
    setEller([yeniEl, ...eller]);
    setScreen("skor");
  }

  function eliSil(id) {
    const yeniListe = eller.filter((el) => el.id !== id);
    setEller(yeniListe);
  }

  function takim1Toplam() {
    return eller
      .filter((e) => e.takim === takim1Adi)
      .reduce((toplam, e) => toplam + e.puan, 0);
  }

  function takim2Toplam() {
    return eller
      .filter((e) => e.takim === takim2Adi)
      .reduce((toplam, e) => toplam + e.puan, 0);
  }

  return (
    <div style={{ minHeight: "100vh", background: "#081530", color: "white", padding: 20, fontFamily: "Arial" }}>
      <div style={{ maxWidth: 500, margin: "0 auto" }}>
        <h1 style={{ fontSize: 40, marginBottom: 20, textAlign: 'center' }}>Briç Skorboard</h1>
        
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 20 }}>
          <button onClick={() => setScreen("giris")} style={{ padding: 15, borderRadius: 14, border: "none", background: screen === "giris" ? "#19c37d" : "#374151", color: "white", fontSize: 20 }}>Giriş</button>
          <button onClick={() => setScreen("skor")} style={{ padding: 15, borderRadius: 14, border: "none", background: screen === "skor" ? "#19c37d" : "#374151", color: "white", fontSize: 20 }}>Skor</button>
        </div>

        {screen === "giris" && (
          <div style={{ background: "#111827", padding: 20, borderRadius: 20 }}>
            <h3>Takım İsimleri</h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 20 }}>
              <input value={takim1Adi} onChange={(e) => setTakim1Adi(e.target.value)} style={{ padding: 12, borderRadius: 8, border: "none" }} />
              <input value={takim2Adi} onChange={(e) => setTakim2Adi(e.target.value)} style={{ padding: 12, borderRadius: 8, border: "none" }} />
            </div>

            <h3>Kontratı Alan</h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 20 }}>
              <button onClick={() => setTakim(takim1Adi)} style={{ padding: 15, borderRadius: 10, border: "none", background: takim === takim1Adi ? "#19c37d" : "#2563eb", color: "white" }}>{takim1Adi}</button>
              <button onClick={() => setTakim(takim2Adi)} style={{ padding: 15, borderRadius: 10, border: "none", background: takim === takim2Adi ? "#19c37d" : "#dc2626", color: "white" }}>{takim2Adi}</button>
            </div>

            <h3>Zon / Renk / Seviye / Sonuç</h3>
            <div style={{ marginBottom: 20 }}>
  <h3>Renk</h3>

  <div
    style={{
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: 10,
      marginBottom: 20,
    }}
  >
    {["Sinek", "Karo", "Kupa", "Maça", "NT"].map((r) => (
      <button
        key={r}
        onClick={() => setRenk(r)}
        style={{
          padding: 16,
          borderRadius: 10,
          border: "none",
          background:
            renk === r ? "#2563eb" : "#374151",
          color: "white",
          fontSize: 18,
        }}
      >
        {r}
      </button>
    ))}
  </div>

  <h3>Seviye</h3>

  <div
    style={{
      display: "grid",
      gridTemplateColumns: "repeat(7,1fr)",
      gap: 8,
      marginBottom: 20,
    }}
  >
    {[1,2,3,4,5,6,7].map((s) => (
      <button
        key={s}
        onClick={() => setSeviye(s)}
        style={{
          padding: 14,
          borderRadius: 10,
          border: "none",
          background:
            seviye === s
              ? "#19c37d"
              : "#374151",
          color: "white",
          fontSize: 20,
        }}
      >
        {s}
      </button>
    ))}
  </div>

  <h3>Sonuç</h3>
<h3>Kontür</h3>

<div
  style={{
    display: "grid",
    gridTemplateColumns: "1fr 1fr 1fr",
    gap: 8,
    marginBottom: 20,
  }}
>
  {["Yok", "Kontr", "Sürkontr"].map((k) => (
    <button
      key={k}
      onClick={() => setKontur(k)}
      style={{
        padding: 14,
        borderRadius: 10,
        border: "none",
        background:
          kontur === k
            ? "#8b5cf6"
            : "#374151",
        color: "white",
        fontSize: 18,
      }}
    >
      {k}
    </button>
  ))}
</div>
  <div
    style={{
      display: "grid",
      gridTemplateColumns: "repeat(3,1fr)",
      gap: 8,
      marginBottom: 20,
    }}
  >
    {["-3","-2","-1","=","+1","+2","+3"].map((s) => (
      <button
        key={s}
        onClick={() => setSonuc(s)}
        style={{
          padding: 14,
          borderRadius: 10,
          border: "none",
          background:
            sonuc === s
              ? "#f59e0b"
              : "#374151",
          color: "white",
          fontSize: 18,
        }}
      >
        {s}
      </button>
    ))}
  </div>
</div>
            {/* ... Diğer butonlar (Seviye, Renk vs.) burada yer alıyor ... */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', marginBottom: '20px' }}>
                {["Yok", "Biz Zon", "Onlar Zon", "Herkes Zon"].map(z => (
                    <button key={z} onClick={() => setZon(z)} style={{ padding: '10px', background: zon === z ? '#19c37d' : '#374151', color: 'white', border: 'none', borderRadius: '5px' }}>{z}</button>
                ))}
            </div>

            <button onClick={eliKaydet} style={{ width: "100%", padding: 20, borderRadius: 12, border: "none", background: "#19c37d", color: "white", fontSize: 24, fontWeight: "bold" }}>ELİ KAYDET</button>
          </div>
        )}

        {screen === "skor" && (
          <>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 20 }}>
              <div style={{ background: "#2563eb", padding: 20, borderRadius: 18, textAlign: "center" }}>
                <div>{takim1Adi}</div>
                <div style={{ fontSize: 40, fontWeight: "bold" }}>{takim1Toplam()}</div>
              </div>
              <div style={{ background: "#dc2626", padding: 20, borderRadius: 18, textAlign: "center" }}>
                <div>{takim2Adi}</div>
                <div style={{ fontSize: 40, fontWeight: "bold" }}>{takim2Toplam()}</div>
              </div>
            </div>
            {eller.map((el) => (
              <div key={el.id} style={{ background: "#111827", padding: 15, borderRadius: 15, marginBottom: 10 }}>
                <div style={{ fontWeight: "bold" }}>{el.takim} - {el.kontrat}</div>
                <div style={{ color: "#9ca3af" }}>{el.zon} | {el.sonuc}| {el.kontur}</div>
                <div style={{ fontSize: 24, fontWeight: "bold", color: el.puan >= 0 ? "#19c37d" : "#ef4444" }}>{el.puan} Puan</div>
                <button onClick={() => eliSil(el.id)} style={{ marginTop: 10, background: "#ef4444", color: "white", border: "none", padding: "5px 10px", borderRadius: 5 }}>Sil</button>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}