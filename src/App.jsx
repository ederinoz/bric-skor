import { useState, useEffect } from "react";

export default function App() {

  // =========================
  // OTOMATİK ZON MOTORU
  // =========================

  function otomatikZon(board) {
    const dongu = ((board - 1) % 16) + 1;

    const tablo = {
      1: "Yok",
      2: "Biz Zon",
      3: "Onlar Zon",
      4: "Herkes Zon",
      5: "Biz Zon",
      6: "Onlar Zon",
      7: "Herkes Zon",
      8: "Yok",
      9: "Onlar Zon",
      10: "Herkes Zon",
      11: "Yok",
      12: "Biz Zon",
      13: "Herkes Zon",
      14: "Yok",
      15: "Biz Zon",
      16: "Onlar Zon",
    };

    return tablo[dongu];
  }

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

  const [screen, setScreen] = useState(
    () => (eller.length > 0 ? "skor" : "giris")
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
  // BOARD
  // =========================

  const boardNo = eller.length + 1;

  // =========================
  // STATES
  // =========================

  const [takim1Mi, setTakim1Mi] = useState(true);

  const [zon, setZon] = useState(() =>
    otomatikZon(eller.length + 1)
  );

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

    let eksik = sonuc.startsWith("-")
      ? Math.abs(Number(sonuc))
      : 0;

    let fazla = sonuc.startsWith("+")
      ? Number(sonuc.replace("+", ""))
      : 0;

    // =========================
    // BATTI
    // =========================

    if (eksik > 0) {

      let ceza = 0;

      if (kontur === "") {
        ceza = eksik * (vulnerable ? 100 : 50);
      }

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
      }

      else if (kontur === "XX") {

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

      return takim1Mi
        ? { t1: 0, t2: ceza }
        : { t1: ceza, t2: 0 };
    }

    // =========================
    // LÖVE PUANI
    // =========================

    let lovePuani = 0;

    if (minor) lovePuani = seviye * 20;
    if (major) lovePuani = seviye * 30;

    if (renk === "NT") {
      lovePuani = 40 + (seviye - 1) * 30;
    }

    let asilLovePuani = lovePuani;

    if (kontur === "X") asilLovePuani *= 2;
    if (kontur === "XX") asilLovePuani *= 4;

    // =========================
    // BONUS
    // =========================

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

    // =========================
    // OVERTRICK
    // =========================

    let overtrick = 0;

    if (fazla > 0) {

      if (kontur === "") {
        overtrick = fazla * (minor ? 20 : 30);
      }

      else if (kontur === "X") {
        overtrick = fazla * (vulnerable ? 200 : 100);
      }

      else if (kontur === "XX") {
        overtrick = fazla * (vulnerable ? 400 : 200);
      }
    }

    const toplam =
      asilLovePuani +
      ikramiye +
      overtrick;

    return takim1Mi
      ? { t1: toplam, t2: 0 }
      : { t1: 0, t2: toplam };
  }

  // =========================
  // ELİ KAYDET
  // =========================

  function eliKaydet() {

    const skor = hesaplaSkor();

    const yeniEl = {
      id: Date.now(),
      board: boardNo,
      oynayanTakim: takim1Mi
        ? (takim1Adi || "Takım 1")
        : (takim2Adi || "Takım 2"),

      kontrat: seviye + " " + renk,

      kontur,
      sonuc,
      zon,

      t1: skor.t1,
      t2: skor.t2,
    };

    setEller((prev) => [yeniEl, ...prev]);

    setScreen("skor");

    // SONRAKİ BOARD İÇİN ZON
    setZon(otomatikZon(boardNo + 1));

    // RESET
    setSeviye(1);
    setRenk("NT");
    setKontur("");
    setSonuc("Tam");
  }

  function eliSil(id) {
    setEller((prev) =>
      prev.filter((el) => el.id !== id)
    );
  }

  // =========================
  // RENK STİL MOTORU
  // =========================

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
    <div style={{
      background: "#081530",
      minHeight: "100vh",
      color: "white",
      padding: 20,
      fontFamily: "Arial, sans-serif"
    }}>

      <div style={{
        maxWidth: 520,
        margin: "0 auto"
      }}>

        <h1 style={{
          fontSize: 36,
          marginBottom: 10,
          textAlign: "center"
        }}>
          Briç Skorboard
        </h1>

        <div style={{
          textAlign: "center",
          marginBottom: 20,
          fontSize: 20,
          fontWeight: "bold",
          color: "#06b6d4"
        }}>
          Board #{boardNo} | {zon}
        </div>

        {/* DEVAMI ESKİ KODLA AYNI */}
      </div>
    </div>
  );
}
