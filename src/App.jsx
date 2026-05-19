<!DOCTYPE html>
<html lang="tr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>Briç Skorboard</title>
    <script src="https://unpkg.com/react@18/umd/react.production.min.js" crossorigin></script>
    <script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js" crossorigin></script>
    <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
    <style>
        body { margin: 0; background: #081530; font-family: Arial, sans-serif; color: white; overscroll-behavior: none; }
        button { cursor: pointer; border: none; font-weight: bold; transition: all 0.15s ease; }
        input::placeholder { color: #9ca3af; }
    </style>
</head>
<body>
    <div id="root"></div>

    <script type="text/babel">
        const { useState, useEffect } = React;

        function App() {
            const [eller, setEller] = useState(() => {
                try {
                    const kayit = localStorage.getItem("eller");
                    return kayit ? JSON.parse(kayit) : [];
                } catch { return []; }
            });

            const [takim1Adi, setTakim1Adi] = useState(() => localStorage.getItem("takim1Adi") || "");
            const [takim2Adi, setTakim2Adi] = useState(() => localStorage.getItem("takim2Adi") || "");
            const [screen, setScreen] = useState(() => eller.length > 0 ? "skor" : "giris");

            useEffect(() => { localStorage.setItem("eller", JSON.stringify(eller)); }, [eller]);
            useEffect(() => { localStorage.setItem("takim1Adi", takim1Adi); }, [takim1Adi]);
            useEffect(() => { localStorage.setItem("takim2Adi", takim2Adi); }, [takim2Adi]);

            const [takim1Mi, setTakim1Mi] = useState(true);
            const [zon, setZon] = useState("Yok");
            const [renk, setRenk] = useState("NT");
            const [seviye, setSeviye] = useState(1);
            const [kontur, setKontur] = useState("");
            const [sonuc, setSonuc] = useState("Tam");

            function hesaplaSkor() {
                const vulnerable = zon === "Herkes Zon" || (zon === "Biz Zon" && takim1Mi) || (zon === "Onlar Zon" && !takim1Mi);
                const major = renk === "Kupa" || renk === "Maça";
                const minor = renk === "Sinek" || renk === "Karo";
                let eksik = sonuc.startsWith("-") ? Math.abs(Number(sonuc)) : 0;
                let fazla = sonuc.startsWith("+") ? Number(sonuc.replace("+", "")) : 0;

                if (eksik > 0) {
                    let ceza = 0;
                    if (kontur === "") ceza = eksik * (vulnerable ? 100 : 50);
                    else if (kontur === "X") {
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

                let lovePuani = 0;
                if (minor) lovePuani = seviye * 20;
                if (major) lovePuani = seviye * 30;
                if (renk === "NT") lovePuani = 40 + (seviye - 1) * 30;

                let asilLovePuani = lovePuani;
                if (kontur === "X") asilLovePuani *= 2;
                if (kontur === "XX") asilLovePuani *= 4;

                let ikramiye = 0;
                if (lovePuani >= 100) ikramiye += vulnerable ? 500 : 300;
                else ikramiye += 50;

                if (seviye === 6) ikramiye += vulnerable ? 750 : 500;
                if (seviye === 7) ikramiye += vulnerable ? 1500 : 1000;
                if (kontur === "X") ikramiye += 50;
                if (kontur === "XX") ikramiye += 100;

                let overtrick = 0;
                if (fazla > 0) {
                    if (kontur === "") overtrick = fazla * (minor ? 20 : 30);
                    else if (kontur === "X") overtrick = fazla * (vulnerable ? 200 : 100);
                    else if (kontur === "XX") overtrick = fazla * (vulnerable ? 400 : 200);
                }

                const toplam = asilLovePuani + ikramiye + overtrick;
                return takim1Mi ? { t1: toplam, t2: 0 } : { t1: 0, t2: toplam };
            }

            function eliKaydet() {
                const skor = hesaplaSkor();
                const yeniEl = {
                    id: Date.now(),
                    oynayanTakim: takim1Mi ? (takim1Adi || "Takım 1") : (takim2Adi || "Takım 2"),
                    kontrat: seviye + " " + renk,
                    kontur, sonuc, zon,
                    t1: skor.t1, t2: skor.t2,
                };
                setEller((prev) => [yeniEl, ...prev]);
                setScreen("skor");
                setSeviye(1); setRenk("NT"); setKontur(""); setSonuc("Tam");
            }

            function getKozButonStyle(butonRengi) {
                const isSelected = renk === butonRengi;
                let baseBg = "#374151";
                const renkPaleti = { Sinek: "#19c37d", Karo: "#f97316", Kupa: "#ef4444", Maça: "#2563eb", NT: "#eab308" };
                return {
                    padding: 12, borderRadius: 10, background: isSelected ? renkPaleti[butonRengi] : "#374151",
                    color: isSelected ? "#ffffff" : renkPaleti[butonRengi], fontSize: 16, fontWeight: "bold"
                };
            }

            return (
                <div style={{ padding: 20, maxWidth: 520, margin: "0 auto" }}>
                    <h1 style={{ fontSize: 36, marginBottom: 20, textAlign: "center" }}>Briç Skorboard</h1>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 20 }}>
                        <button onClick={() => setScreen("giris")} style={{ padding: 16, borderRadius: 14, background: screen === "giris" ? "#19c37d" : "#374151", color: "white", fontSize: 20 }}>Veri Girişi</button>
                        <button onClick={() => setScreen("skor")} style={{ padding: 16, borderRadius: 14, background: screen === "skor" ? "#19c37d" : "#374151", color: "white", fontSize: 20 }}>Skor Tahtası</button>
                    </div>

                    {screen === "giris" && (
                        <div style={{ background: "#111827", padding: 20, borderRadius: 20 }}>
                            <label style={{ display: "block", marginBottom: 8, color: "#9ca3af" }}>Kontratı Alan Takım:</label>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 20 }}>
                                <button onClick={() => setTakim1Mi(true)} style={{ padding: 16, borderRadius: 12, background: takim1Mi ? "#2563eb" : "#374151", color: "white" }}>{takim1Adi || "Takım 1"}</button>
                                <button onClick={() => setTakim1Mi(false)} style={{ padding: 16, borderRadius: 12, background: !takim1Mi ? "#2563eb" : "#374151", color: "white" }}>{takim2Adi || "Takım 2"}</button>
                            </div>
                            <label style={{ display: "block", marginBottom: 8, color: "#9ca3af" }}>Koz / NT:</label>
                            <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 6, marginBottom: 20 }}>
                                {["Sinek", "Karo", "Kupa", "Maça", "NT"].map(r => (
                                    <button key={r} onClick={() => setRenk(r)} style={getKozButonStyle(r)}>{r === "NT" ? "NT" : r === "Sinek" ? "♣ S" : r === "Karo" ? "♦ K" : r === "Kupa" ? "♥ K" : "♠ M"}</button>
                                ))}
                            </div>
                            <label style={{ display: "block", marginBottom: 8, color: "#9ca3af" }}>Kontrat Seviyesi:</label>
                            <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 6, marginBottom: 20 }}>
                                {[1,2,3,4,5,6,7].map(s => <button key={s} onClick={() => setSeviye(s)} style={{ padding: 12, borderRadius: 10, background: seviye === s ? "#19c37d" : "#374151", color: "white" }}>{s}</button>)}
                            </div>
                            <label style={{ display: "block", marginBottom: 8, color: "#9ca3af" }}>Kontur:</label>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 20 }}>
                                {["", "X", "XX"].map(k => <button key={k} onClick={() => setKontur(k)} style={{ padding: 12, borderRadius: 10, background: kontur === k ? "#7c3aed" : "#374151", color: "white" }}>{k === "" ? "Yok" : k : "XX"}</button>)}
                            </div>
                            <label style={{ display: "block", marginBottom: 8, color: "#9ca3af" }}>Sonuç:</label>
                            <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 6, marginBottom: 20 }}>
                                {["Tam", "+1", "+2", "+3", "-1", "-2", "-3", "-4"].map(s => <button key={s} onClick={() => setSonuc(s)} style={{ padding: 12, borderRadius: 10, background: sonuc === s ? "#ec4899" : "#374151", color: "white" }}>{s}</button>)}
                            </div>
                            <label style={{ display: "block", marginBottom: 8, color: "#9ca3af" }}>Zon Durumu:</label>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 20 }}>
                                {["Yok", "Biz Zon", "Onlar Zon", "Herkes Zon"].map(z => <button key={z} onClick={() => setZon(z)} style={{ padding: 12, borderRadius: 10, background: zon === z ? "#06b6d4" : "#374151", color: "white" }}>{z}</button>)}
                            </div>
                            <button onClick={eliKaydet} style={{ width: "100%", padding: 20, borderRadius: 14, background: "#2563eb", color: "white", fontSize: 22 }}>ELİ KAYDET</button>
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
                            {eller.length === 0 ? <p style={{ textAlign: "center", color: "#6b7280" }}>Henüz oynanmış el yok.</p> : eller.map((el) => (
                                <div key={el.id} style={{ background: "#111827", padding: 18, borderRadius: 16, marginBottom: 10, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                    <div>
                                        <div style={{ fontSize: 18, fontWeight: "bold" }}>Oynayan: {el.oynayanTakim}</div>
                                        <div style={{ color: "#9ca3af", fontSize: 14, marginTop: 4 }}>{el.kontrat} {el.kontur} ({el.sonuc}) | {el.zon}</div>
                                    </div>
                                    <div style={{ textAlign: "right" }}>
                                        <div>T1: <span style={{ color: el.t1 > 0 ? "#19c37d" : "white" }}>+{el.t1}</span></div>
                                        <div>T2: <span style={{ color: el.t2 > 0 ? "#19c37d" : "white" }}>+{el.t2}</span></div>
                                        <button onClick={() => { if(window.confirm("Silinsin mi?")) setEller(prev => prev.filter(e => e.id !== el.id)); }} style={{ marginTop: 6, padding: "4px 10px", borderRadius: 8, background: "#dc2626", color: "white", fontSize: 12 }}>Sil</button>
                                    </div>
                                </div>
                            ))}
                            {eller.length > 0 && <button onClick={() => { if (window.confirm("Sıfırlansın mı?")) { setEller([]); setTakim1Adi(""); setTakim2Adi(""); localStorage.clear(); setScreen("giris"); } }} style={{ width: "100%", marginTop: 20, padding: 16, borderRadius: 14, background: "#dc2626", color: "white", fontSize: 18 }}>Oyunu Sıfırla</button>}
                        </>
                    )}
                </div>
            );
        }

        const root = ReactDOM.createRoot(document.getElementById('root'));
        root.render(<App />);
    </script>
</body>
</html>
