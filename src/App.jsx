import { useState, useEffect } from "react";

// ============================================================
// STYLES GLOBAUX
// ============================================================
const GLOBAL_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500;600;700&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --bg: #080808; --bg2: #101010; --bg3: #181818;
    --yellow: #e8ff47; --red: #ff4747; --green: #39ff80; --orange: #ff9a3c; --purple: #a78bfa;
    --white: #f0f0f0; --gray: #555; --gray2: #333;
    --font-title: 'Bebas Neue', sans-serif; --font-body: 'DM Sans', sans-serif;
  }
  html, body { background: var(--bg); color: var(--white); font-family: var(--font-body); min-height: 100vh; overflow-x: hidden; }
  #root { min-height: 100vh; }
  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: var(--bg2); }
  ::-webkit-scrollbar-thumb { background: var(--yellow); border-radius: 2px; }
  .bebas { font-family: var(--font-title); letter-spacing: 0.04em; }
  button { cursor: pointer; border: none; outline: none; font-family: var(--font-body); transition: all 0.18s; }
  input, select, textarea { font-family: var(--font-body); }
  input:focus, select:focus, textarea:focus { outline: 2px solid var(--yellow); outline-offset: 2px; }
  @keyframes fadeIn { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes fadeInFast { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes slideInRight { from { opacity: 0; transform: translateX(28px); } to { opacity: 1; transform: translateX(0); } }
  @keyframes slideInLeft { from { opacity: 0; transform: translateX(-28px); } to { opacity: 1; transform: translateX(0); } }
  .tab-slide-right { animation: slideInRight 0.28s cubic-bezier(0.25, 1, 0.5, 1) both; }
  .tab-slide-left { animation: slideInLeft 0.28s cubic-bezier(0.25, 1, 0.5, 1) both; }
  @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
  @keyframes pulse { 0%, 100% { opacity: 0.3; transform: scale(0.8); } 50% { opacity: 1; transform: scale(1.2); } }
  @keyframes shimmer { 0% { background-position: -200px 0; } 100% { background-position: 200px 0; } }
  @keyframes ringFill { from { stroke-dashoffset: 283; } to { stroke-dashoffset: var(--ring-offset); } }
  @keyframes countUp { from { opacity: 0; transform: scale(0.7); } to { opacity: 1; transform: scale(1); } }
  @keyframes floatUp { from { opacity: 0; transform: translateY(30px) scale(0.95); } to { opacity: 1; transform: translateY(0) scale(1); } }
  .fade-in { animation: fadeIn 0.35s ease both; }
  .fade-in-fast { animation: fadeInFast 0.2s ease both; }
  .slide-in-right { animation: slideInRight 0.3s ease both; }
  .float-up { animation: floatUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) both; }
  button:active { transform: scale(0.96); }
  input, textarea, select { transition: border-color 0.2s; }
  .card-hover { transition: transform 0.2s, box-shadow 0.2s; }
  .card-hover:active { transform: scale(0.98); }
`;

// ============================================================
// STORAGE
// ============================================================
// Storage localStorage uniquement — persistant sur tous les navigateurs
const storage = {
  async get(key) {
    try {
      const val = localStorage.getItem("fitrace_" + key);
      return val ? JSON.parse(val) : null;
    } catch { return null; }
  },
  async set(key, value) {
    try {
      localStorage.setItem("fitrace_" + key, JSON.stringify(value));
    } catch (e) {
      console.error("Storage set error:", e);
    }
  },
  async list(prefix) {
    try {
      const fullPrefix = "fitrace_" + prefix;
      const keys = [];
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k && k.startsWith(fullPrefix)) {
          keys.push(k.replace("fitrace_", ""));
        }
      }
      return keys;
    } catch { return []; }
  },
  async del(key) {
    try { localStorage.removeItem("fitrace_" + key); } catch {}
  }
};

// ============================================================
// CONSTANTES & HELPERS
// ============================================================
const LEVELS = [
  { id: 1, label: "Découverte", color: "#39ff80", emoji: "🟢" },
  { id: 2, label: "Développement", color: "#e8ff47", emoji: "🟡" },
  { id: 3, label: "Performance", color: "#ff9a3c", emoji: "🟠" },
  { id: 4, label: "Compétition", color: "#ff4747", emoji: "🔴" },
];

const ZONES = [
  { z: "Z1", label: "Récupération", pct: [50, 60] },
  { z: "Z2", label: "Endurance", pct: [60, 70] },
  { z: "Z3", label: "Tempo", pct: [70, 80] },
  { z: "Z4", label: "Seuil", pct: [80, 90] },
  { z: "Z5", label: "VO2Max", pct: [90, 100] },
];

// ============================================================
// STANDARDS HYROX OFFICIELS (poids sled + charges stations)
// ============================================================
const HYROX_STANDARDS = {
  open: {
    homme: {
      sled_push: { poids: 152, unite: "kg", note: "Sled vide ~50kg + 102kg de poids" },
      sled_pull: { poids: 103, unite: "kg", note: "Sled vide ~50kg + 53kg de poids" },
      wall_balls: { poids: 9, unite: "kg", note: "Médecine-ball 9kg, cible à 3m" },
      sandbag: { poids: 20, unite: "kg", note: "Sandbag 20kg porté sur une épaule" },
      farmers_carry: { poids: 24, unite: "kg/main", note: "2 kettlebells de 24kg" },
      ski_erg: { distance: 1000, note: "1000m SkiErg" },
      rowing: { distance: 1000, note: "1000m Rowing" },
      burpee: { distance: 80, note: "80m Burpee Broad Jump" },
    },
    femme: {
      sled_push: { poids: 102, unite: "kg", note: "Sled vide ~50kg + 52kg de poids" },
      sled_pull: { poids: 78, unite: "kg", note: "Sled vide ~50kg + 28kg de poids" },
      wall_balls: { poids: 6, unite: "kg", note: "Médecine-ball 6kg, cible à 2.7m" },
      sandbag: { poids: 10, unite: "kg", note: "Sandbag 10kg porté sur une épaule" },
      farmers_carry: { poids: 16, unite: "kg/main", note: "2 kettlebells de 16kg" },
      ski_erg: { distance: 1000, note: "1000m SkiErg" },
      rowing: { distance: 1000, note: "1000m Rowing" },
      burpee: { distance: 80, note: "80m Burpee Broad Jump" },
    },
  },
  pro: {
    homme: {
      sled_push: { poids: 202, unite: "kg", note: "Sled vide ~50kg + 152kg de poids" },
      sled_pull: { poids: 153, unite: "kg", note: "Sled vide ~50kg + 103kg de poids" },
      wall_balls: { poids: 9, unite: "kg", note: "Médecine-ball 9kg, cible à 3m" },
      sandbag: { poids: 30, unite: "kg", note: "Sandbag 30kg porté sur une épaule" },
      farmers_carry: { poids: 32, unite: "kg/main", note: "2 kettlebells de 32kg" },
      ski_erg: { distance: 1000, note: "1000m SkiErg" },
      rowing: { distance: 1000, note: "1000m Rowing" },
      burpee: { distance: 80, note: "80m Burpee Broad Jump" },
    },
    femme: {
      sled_push: { poids: 127, unite: "kg", note: "Sled vide ~50kg + 77kg de poids" },
      sled_pull: { poids: 103, unite: "kg", note: "Sled vide ~50kg + 53kg de poids" },
      wall_balls: { poids: 6, unite: "kg", note: "Médecine-ball 6kg, cible à 2.7m" },
      sandbag: { poids: 20, unite: "kg", note: "Sandbag 20kg porté sur une épaule" },
      farmers_carry: { poids: 24, unite: "kg/main", note: "2 kettlebells de 24kg" },
      ski_erg: { distance: 1000, note: "1000m SkiErg" },
      rowing: { distance: 1000, note: "1000m Rowing" },
      burpee: { distance: 80, note: "80m Burpee Broad Jump" },
    },
  },
};

function getHyroxStandards(profile) {
  const categorie = profile.hyroxCategorie || "open";
  const sexe = profile.sexe === "femme" ? "femme" : "homme";
  return HYROX_STANDARDS[categorie]?.[sexe] || HYROX_STANDARDS.open.homme;
}

function formatHyroxStandards(profile) {
  const s = getHyroxStandards(profile);
  const cat = (profile.hyroxCategorie || "open").toUpperCase();
  const sexe = profile.sexe === "femme" ? "F" : "H";
  return `STANDARDS HYROX OFFICIELS ${cat} ${sexe}:
- Sled Push: ${s.sled_push.poids}kg total (${s.sled_push.note})
- Sled Pull: ${s.sled_pull.poids}kg total (${s.sled_pull.note})
- Wall Balls: ${s.wall_balls.poids}kg
- Sandbag Lunges: ${s.sandbag.poids}kg
- Farmers Carry: ${s.farmers_carry.poids}
- SkiErg & Rowing: ${s.ski_erg.distance}m chacun
- Burpee Broad Jump: ${s.burpee.distance}m`;
}

const CITATIONS_HYROX = [
  "Le HYROX ne récompense pas celui qui part fort. Il récompense celui qui finit fort.",
  "La station la plus dure, c'est le kilomètre après chaque station.",
  "Ton moteur aérobie est ta vraie arme. Construis-le d'abord.",
  "En HYROX, la force sans endurance est une illusion. L'endurance sans force est une limite.",
  "La régularité bat l'intensité. Toujours.",
  "Ce que tu ressens à la station 7, tu l'as construit à l'entraînement.",
  "Ne cours pas après le chrono. Cours après la technique. Le chrono suivra.",
  "Chaque séance Zone 2 que tu veux sauter est exactement celle qu'il faut faire.",
  "La transition est une compétence. Entraîne-la comme une compétence.",
  "J-1 ne change rien. Les 47 jours avant, si.",
];

function getCitationDuJour() {
  const day = new Date().getDay();
  return CITATIONS_HYROX[day % CITATIONS_HYROX.length];
}

function calcVMA(distanceMeters) { return parseFloat((distanceMeters / 100).toFixed(1)); }
function epley1RM(weight, reps) { return Math.round(weight * (1 + reps / 30)); }
function paceFromVMA(vmaKmh, pct) {
  const speed = vmaKmh * (pct / 100);
  const minPerKm = 60 / speed;
  const min = Math.floor(minPerKm);
  const sec = Math.round((minPerKm - min) * 60);
  return `${min}:${sec.toString().padStart(2, "0")}/km`;
}
function daysUntil(dateStr) {
  if (!dateStr) return null;
  return Math.max(0, Math.ceil((new Date(dateStr) - new Date()) / (1000 * 60 * 60 * 24)));
}

function totalWeeksFromDate(dateStr) {
  if (!dateStr) return 8; // fallback si pas de date
  const days = Math.ceil((new Date(dateStr) - new Date()) / (1000 * 60 * 60 * 24));
  return Math.max(4, Math.min(52, Math.ceil(days / 7))); // entre 4 et 52 semaines
}

function getPhase(week, totalWeeks) {
  const pct = week / totalWeeks;
  if (pct <= 0.35) return "base";
  if (pct <= 0.65) return "développement";
  if (pct <= 0.85) return "pic";
  return "affûtage";
}

// ============================================================
// CALCUL SCORE CONDITION PHYSIQUE
// ============================================================
function calcFitnessScore(profile) {
  const sessions = profile.sessions || [];
  const nbSessions = sessions.length;
  if (nbSessions === 0) return { global: 0, force: 0, endurance: 0, puissance: 0 };

  const poids = parseFloat(profile.poids) || 70;

  // ── ENDURANCE ──────────────────────────────────────────────
  // Base VMA
  const vmaBase = profile.vmaKmh || 10;
  const vmaScore = Math.min(100, ((vmaBase - 8) / 12) * 100);
  // Bonus séances cardio (zone2 + qualite)
  const seancesCardio = sessions.filter(s => s.type === "running_zone2" || s.type === "running_qualite").length;
  const sessionCardioBonus = Math.min(15, seancesCardio * 2);
  // Bonus VMA extrait des feedbacks (ex: "5:10/km" → progression)
  const dernierRPECardio = sessions.filter(s => s.type?.includes("running")).slice(-3).map(s => s.difficulte || 5);
  const rpeCardioMoy = dernierRPECardio.length > 0 ? dernierRPECardio.reduce((a,b) => a+b,0) / dernierRPECardio.length : 5;
  const rpeCardioBonus = rpeCardioMoy <= 5 ? 5 : rpeCardioMoy >= 8 ? -3 : 0; // Séances faciles → on progresse
  const endurance = Math.min(100, Math.max(0, Math.round(vmaScore * 0.75 + sessionCardioBonus + rpeCardioBonus + Math.min(5, nbSessions * 0.5))));

  // ── FORCE ──────────────────────────────────────────────────
  // 1RM initial
  let squat1RM = parseFloat(profile.squat1RM_final) || 0;
  // Extraire les charges réelles des feedbacks (exercicesLog)
  sessions.forEach(s => {
    (s.exercicesLog || []).forEach(ex => {
      const nom = (ex.nom || "").toLowerCase();
      if ((nom.includes("squat") || nom.includes("back squat")) && ex.charge) {
        const charge = parseFloat(ex.charge);
        const repsEx = parseInt(ex.reps) || 1;
        const est1RM = charge * (1 + repsEx / 30); // Epley
        if (est1RM > squat1RM) squat1RM = Math.round(est1RM);
      }
    });
    // Extraire aussi depuis le champ texte charges
    const chargesText = s.charges || "";
    const squatMatch = chargesText.match(/squat[^0-9]*([0-9]+(?:\.[0-9]+)?)\s*kg/i);
    if (squatMatch) {
      const c = parseFloat(squatMatch[1]);
      if (c > squat1RM) squat1RM = c;
    }
  });
  // Extraire depuis adaptations IA
  (profile.adaptations || []).forEach(a => {
    const m = (a.adaptation || "").match(/squat[^0-9]*([0-9]+(?:\.[0-9]+)?)\s*kg/i);
    if (m) { const c = parseFloat(m[1]); if (c > squat1RM) squat1RM = c; }
  });
  const ratioSquat = squat1RM / poids;
  const forceBase = Math.min(100, Math.round((ratioSquat / 2.2) * 100));
  // Bonus séances force + RPE force
  const seancesForce = sessions.filter(s => s.type === "force_stations").length;
  const forceBonus = Math.min(12, seancesForce * 2);
  // Pénalité si RPE force trop élevé en continu (surmenage)
  const dernierRPEForce = sessions.filter(s => s.type === "force_stations").slice(-3).map(s => s.difficulte || 5);
  const surmenageForce = dernierRPEForce.every(r => r >= 9) ? -5 : 0;
  const force = Math.min(100, Math.max(0, Math.round(forceBase * 0.85 + forceBonus + surmenageForce)));

  // ── PUISSANCE ──────────────────────────────────────────────
  // Basé sur séances hybrides + énergie post-séance + progressions détectées
  const seancesHybrides = sessions.filter(s => s.type === "hybride_compromis").length;
  const hybridesBonus = Math.min(15, seancesHybrides * 3);
  // Energie moyenne post-séance (1-5 → indicateur de récupération/surcompensation)
  const energies = sessions.filter(s => s.energie).map(s => s.energie);
  const energieMoy = energies.length > 0 ? energies.reduce((a,b) => a+b,0) / energies.length : 3;
  const energieBonus = energieMoy >= 4 ? 5 : energieMoy <= 2 ? -3 : 0;
  // Adaptations positives dans les feedbacks
  const adaptPositives = (profile.adaptations || []).filter(a => {
    const txt = a.adaptation || "";
    return txt.includes("+") || txt.includes("augmenter") || txt.includes("passe à");
  }).length;
  const adaptBonus = Math.min(10, adaptPositives * 2);
  const puissanceBase = (force + endurance) / 2;
  const puissance = Math.min(100, Math.max(0, Math.round(puissanceBase * 0.75 + hybridesBonus + energieBonus + adaptBonus)));

  // ── SCORE GLOBAL ───────────────────────────────────────────
  const global = Math.round(endurance * 0.38 + force * 0.38 + puissance * 0.24);

  return { global, force, endurance, puissance, details: { squat1RM, vmaBase, seancesCardio, seancesForce, seancesHybrides } };
}

// ============================================================
// CALCUL GRAPHIQUE PROGRESSION DES CHARGES
// ============================================================
function buildProgressionData(profile) {
  const sessions = profile.sessions || [];
  const adaptations = profile.adaptations || [];
  const data = { squat: [], deadlift: [], farmer: [], vma: [] };

  // Point de départ depuis les tests initiaux
  if (profile.squat1RM_final) data.squat.push({ label: "Init", value: profile.squat1RM_final, session: 0 });
  if (profile.deadlift1RM_final) data.deadlift.push({ label: "Init", value: profile.deadlift1RM_final, session: 0 });
  if (profile.vmaKmh) data.vma.push({ label: "Init", value: Math.round(profile.vmaKmh * 10) / 10, session: 0 });

  // Extraire les charges depuis les adaptations IA
  adaptations.forEach((a, i) => {
    const txt = a.adaptation || "";
    const sNum = i + 1;
    const sqM = txt.match(/squat[^0-9]*([0-9]+(?:\.[0-9]+)?)\s*kg/i);
    if (sqM) data.squat.push({ label: `S${sNum}`, value: parseFloat(sqM[1]), session: sNum });
    const dlM = txt.match(/deadlift[^0-9]*([0-9]+(?:\.[0-9]+)?)\s*kg/i);
    if (dlM) data.deadlift.push({ label: `S${sNum}`, value: parseFloat(dlM[1]), session: sNum });
    const fM = txt.match(/farmer[^0-9]*([0-9]+(?:\.[0-9]+)?)\s*kg/i);
    if (fM) data.farmer.push({ label: `S${sNum}`, value: parseFloat(fM[1]), session: sNum });
    const vM = txt.match(/([0-9]+(?:\.[0-9]+)?)\s*km\/h/i);
    if (vM) data.vma.push({ label: `S${sNum}`, value: parseFloat(vM[1]), session: sNum });
  });

  return data;
}

function getProgressionPct(data) {
  if (!data || data.length < 2) return null;
  const first = data[0].value;
  const last = data[data.length - 1].value;
  return Math.round(((last - first) / first) * 100);
}

// ============================================================
// GRAPHIQUE COURBE RPE (Line chart SVG)
// ============================================================
function RPELineChart({ profile }) {
  const [tooltip, setTooltip] = useState(null);
  const sessions = profile.sessions || [];
  if (sessions.length < 2) return (
    <div style={{ textAlign: "center", padding: "24px 16px", color: "#444", fontSize: 13 }}>
      <div style={{ fontSize: 28, marginBottom: 8 }}>📈</div>
      Fais au moins 2 séances pour voir ta courbe RPE.
    </div>
  );

  const W = 320, H = 120, PAD = { top: 12, right: 12, bottom: 28, left: 28 };
  const innerW = W - PAD.left - PAD.right;
  const innerH = H - PAD.top - PAD.bottom;

  const data = sessions.slice(-20).map((s, i) => ({
    x: i,
    y: s.difficulte || 5,
    label: new Date(s.date).toLocaleDateString("fr-FR", { day: "numeric", month: "short" }),
    ressenti: s.ressenti,
    titre: s.titre,
  }));

  const xScale = (i) => (i / (data.length - 1)) * innerW;
  const yScale = (v) => innerH - ((v - 1) / 9) * innerH;

  // Ligne SVG
  const linePath = data.map((d, i) => `${i === 0 ? "M" : "L"} ${xScale(d.x)} ${yScale(d.y)}`).join(" ");
  // Aire de remplissage
  const areaPath = `${linePath} L ${xScale(data.length - 1)} ${innerH} L ${xScale(0)} ${innerH} Z`;

  // Moyenne
  const avg = Math.round(data.reduce((a, b) => a + b.y, 0) / data.length * 10) / 10;
  const trend = data.length >= 4 ? (data.slice(-3).reduce((a,b) => a+b.y,0)/3 - data.slice(0,3).reduce((a,b) => a+b.y,0)/3).toFixed(1) : null;

  return (
    <Card style={{ marginBottom: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
        <div className="bebas" style={{ fontSize: 18, color: "var(--yellow)" }}>ÉVOLUTION RPE</div>
        <div style={{ display: "flex", gap: 8 }}>
          <div style={{ background: "rgba(232,255,71,0.1)", borderRadius: 6, padding: "2px 10px", fontSize: 11, color: "var(--yellow)", fontWeight: 700 }}>Moy {avg}/10</div>
          {trend !== null && (
            <div style={{ background: parseFloat(trend) > 0 ? "rgba(255,71,71,0.1)" : "rgba(57,255,128,0.1)", borderRadius: 6, padding: "2px 10px", fontSize: 11, fontWeight: 700, color: parseFloat(trend) > 0 ? "var(--red)" : "var(--green)" }}>
              {parseFloat(trend) > 0 ? "▲" : "▼"} {Math.abs(trend)}
            </div>
          )}
        </div>
      </div>

      <div style={{ overflowX: "auto" }}>
        <svg width={Math.max(W, data.length * 24)} height={H} style={{ overflow: "visible" }}>
          <g transform={`translate(${PAD.left},${PAD.top})`}>
            {/* Grille horizontale */}
            {[2,4,6,8,10].map(v => (
              <g key={v}>
                <line x1={0} y1={yScale(v)} x2={innerW} y2={yScale(v)} stroke="rgba(255,255,255,0.04)" strokeWidth={1} />
                <text x={-4} y={yScale(v)+4} textAnchor="end" fill="#333" fontSize={8}>{v}</text>
              </g>
            ))}
            {/* Zone couleur RPE */}
            <rect x={0} y={0} width={innerW} height={yScale(4)} fill="rgba(255,71,71,0.05)" />
            <rect x={0} y={yScale(7)} width={innerW} height={yScale(4)-yScale(7)} fill="rgba(232,255,71,0.04)" />
            <rect x={0} y={yScale(10)} width={innerW} height={yScale(7)-yScale(10)} fill="rgba(57,255,128,0.04)" />
            {/* Ligne de moyenne */}
            <line x1={0} y1={yScale(avg)} x2={innerW} y2={yScale(avg)} stroke="rgba(232,255,71,0.25)" strokeWidth={1} strokeDasharray="4,4" />
            {/* Aire */}
            <path d={areaPath} fill="rgba(232,255,71,0.06)" />
            {/* Courbe */}
            <path d={linePath} fill="none" stroke="var(--yellow)" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
            {/* Points */}
            {data.map((d, i) => {
              const cx = xScale(d.x), cy = yScale(d.y);
              const color = d.ressenti === "dur" ? "var(--red)" : d.ressenti === "facile" ? "var(--green)" : "var(--yellow)";
              return (
                <g key={i} onClick={() => setTooltip(tooltip === i ? null : i)} style={{ cursor: "pointer" }}>
                  <circle cx={cx} cy={cy} r={6} fill="transparent" />
                  <circle cx={cx} cy={cy} r={i === data.length-1 ? 4 : 3} fill={color} stroke="var(--bg)" strokeWidth={1.5} />
                  {tooltip === i && (
                    <g>
                      <rect x={cx-40} y={cy-46} width={80} height={38} rx={6} fill="var(--bg2)" stroke={color} strokeWidth={1} />
                      <text x={cx} y={cy-30} textAnchor="middle" fill={color} fontSize={11} fontWeight="700">{d.y}/10</text>
                      <text x={cx} y={cy-18} textAnchor="middle" fill="#888" fontSize={9}>{d.label}</text>
                      <text x={cx} y={cy-8} textAnchor="middle" fill="#555" fontSize={8}>{(d.titre||"").slice(0,18)}</text>
                    </g>
                  )}
                  {/* Label date pour premier/dernier */}
                  {(i === 0 || i === data.length-1) && (
                    <text x={cx} y={innerH+16} textAnchor="middle" fill="#444" fontSize={8}>{d.label}</text>
                  )}
                </g>
              );
            })}
          </g>
        </svg>
      </div>

      <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
        {[{ c: "var(--green)", l: "Facile (RPE ≤4)" }, { c: "var(--yellow)", l: "Bon (5-7)" }, { c: "var(--red)", l: "Dur (≥8)" }].map(item => (
          <div key={item.l} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 10, color: "#555" }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: item.c }} />{item.l}
          </div>
        ))}
      </div>
    </Card>
  );
}

// ============================================================
// HEATMAP CALENDRIER (GitHub-style)
// ============================================================
function TrainingHeatmap({ profile }) {
  const sessions = profile.sessions || [];
  const [hoveredDay, setHoveredDay] = useState(null);

  // Construire un dictionnaire date → séance
  const byDate = {};
  sessions.forEach(s => {
    const d = s.date?.split("T")[0];
    if (d) byDate[d] = s;
  });

  // 84 derniers jours (12 semaines)
  const today = new Date();
  const days = Array.from({ length: 84 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() - (83 - i));
    const key = d.toISOString().split("T")[0];
    const s = byDate[key];
    return { date: d, key, session: s || null, dayOfWeek: d.getDay() };
  });

  // Grouper par semaine
  const weeks = [];
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7));
  }

  const getColor = (day) => {
    if (!day.session) return "var(--bg3)";
    const rpe = day.session.difficulte || 5;
    if (rpe >= 8) return "rgba(255,71,71,0.7)";
    if (rpe >= 6) return "rgba(232,255,71,0.7)";
    return "rgba(57,255,128,0.7)";
  };

  const totalSeances = sessions.filter(s => {
    const d = new Date(s.date);
    return (today - d) <= 84 * 24 * 60 * 60 * 1000;
  }).length;

  const JOURS_SHORT = ["L","M","M","J","V","S","D"];

  return (
    <Card style={{ marginBottom: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <div className="bebas" style={{ fontSize: 18, color: "var(--yellow)" }}>RÉGULARITÉ — 12 SEMAINES</div>
        <div style={{ background: "rgba(232,255,71,0.1)", borderRadius: 6, padding: "2px 10px", fontSize: 11, color: "var(--yellow)", fontWeight: 700 }}>
          {totalSeances} séances
        </div>
      </div>

      <div style={{ overflowX: "auto" }}>
        <div style={{ display: "flex", gap: 3, minWidth: "max-content" }}>
          {/* Labels jours */}
          <div style={{ display: "flex", flexDirection: "column", gap: 3, marginRight: 4 }}>
            {JOURS_SHORT.map((j, i) => (
              <div key={i} style={{ height: 12, fontSize: 8, color: "#333", lineHeight: "12px" }}>{i % 2 === 0 ? j : ""}</div>
            ))}
          </div>
          {/* Grille semaines */}
          {weeks.map((week, wi) => (
            <div key={wi} style={{ display: "flex", flexDirection: "column", gap: 3 }}>
              {week.map((day, di) => {
                const isToday = day.key === today.toISOString().split("T")[0];
                const isHover = hoveredDay === day.key;
                return (
                  <div
                    key={di}
                    onMouseEnter={() => setHoveredDay(day.key)}
                    onMouseLeave={() => setHoveredDay(null)}
                    onClick={() => setHoveredDay(isHover ? null : day.key)}
                    title={day.session ? `${day.session.titre} — RPE ${day.session.difficulte}/10` : day.key}
                    style={{
                      width: 12, height: 12, borderRadius: 3,
                      background: getColor(day),
                      border: isToday ? "1.5px solid var(--yellow)" : isHover && day.session ? "1px solid rgba(255,255,255,0.3)" : "1px solid transparent",
                      cursor: day.session ? "pointer" : "default",
                      transition: "transform 0.1s",
                      transform: isHover && day.session ? "scale(1.3)" : "scale(1)",
                    }}
                  />
                );
              })}
              {/* Label mois si 1er du mois dans la semaine */}
              <div style={{ height: 10, fontSize: 8, color: "#333", textAlign: "center" }}>
                {week.some(d => d.date.getDate() === 1) ? week.find(d => d.date.getDate() === 1)?.date.toLocaleDateString("fr-FR", { month: "short" }) : ""}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tooltip séance survolée */}
      {hoveredDay && byDate[hoveredDay] && (
        <div className="fade-in" style={{ marginTop: 10, background: "var(--bg3)", borderRadius: 8, padding: "8px 12px", fontSize: 12, color: "#ccc" }}>
          <span style={{ fontWeight: 700, color: "var(--yellow)" }}>{byDate[hoveredDay].titre}</span>
          {" · "}RPE {byDate[hoveredDay].difficulte}/10
          {" · "}<span style={{ color: byDate[hoveredDay].ressenti === "bien" ? "var(--green)" : byDate[hoveredDay].ressenti === "dur" ? "var(--red)" : "var(--yellow)" }}>
            {byDate[hoveredDay].ressenti}
          </span>
        </div>
      )}

      <div style={{ display: "flex", gap: 12, marginTop: 8, alignItems: "center" }}>
        <span style={{ fontSize: 10, color: "#444" }}>Intensité:</span>
        {[{ c: "rgba(57,255,128,0.7)", l: "Facile" }, { c: "rgba(232,255,71,0.7)", l: "Modérée" }, { c: "rgba(255,71,71,0.7)", l: "Intense" }, { c: "var(--bg3)", l: "Repos" }].map(item => (
          <div key={item.l} style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 10, color: "#555" }}>
            <div style={{ width: 10, height: 10, borderRadius: 2, background: item.c }} />{item.l}
          </div>
        ))}
      </div>
    </Card>
  );
}

// ============================================================
// RADAR CHART Force / Endurance / Puissance
// ============================================================
function RadarChart({ profile }) {
  const score = calcFitnessScore(profile);
  const axes = [
    { label: "Force", value: score.force, color: "var(--yellow)" },
    { label: "Endurance", value: score.endurance, color: "var(--green)" },
    { label: "Puissance", value: score.puissance, color: "var(--red)" },
    { label: "Technique", value: Math.min(100, Math.round((profile.sessions?.length || 0) * 4 + 20)), color: "#a78bfa" },
    { label: "Régularité", value: Math.min(100, Math.round((profile.streak || 0) * 10 + ((profile.sessions?.length || 0) * 2))), color: "#ff9a3c" },
  ];

  const CX = 110, CY = 110, R = 80;
  const n = axes.length;
  const angleStep = (2 * Math.PI) / n;
  const startAngle = -Math.PI / 2;

  const getPoint = (angle, r) => ({
    x: CX + r * Math.cos(angle),
    y: CY + r * Math.sin(angle),
  });

  // Points du polygone athlète
  const athletePoints = axes.map((a, i) => {
    const angle = startAngle + i * angleStep;
    const r = (a.value / 100) * R;
    return getPoint(angle, r);
  });

  const polygonPath = athletePoints.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ") + " Z";

  return (
    <Card style={{ marginBottom: 16 }}>
      <div className="bebas" style={{ fontSize: 18, color: "var(--yellow)", marginBottom: 12 }}>PROFIL ATHLÈTE</div>
      <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
        <svg width={220} height={220} style={{ flexShrink: 0 }}>
          {/* Grilles concentriques */}
          {[20, 40, 60, 80, 100].map(pct => {
            const pts = axes.map((_, i) => getPoint(startAngle + i * angleStep, (pct / 100) * R));
            const path = pts.map((p, i) => `${i===0?"M":"L"} ${p.x} ${p.y}`).join(" ") + " Z";
            return <path key={pct} d={path} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth={1} />;
          })}
          {/* Axes */}
          {axes.map((_, i) => {
            const angle = startAngle + i * angleStep;
            const outer = getPoint(angle, R);
            return <line key={i} x1={CX} y1={CY} x2={outer.x} y2={outer.y} stroke="rgba(255,255,255,0.07)" strokeWidth={1} />;
          })}
          {/* Polygone athlète */}
          <path d={polygonPath} fill="rgba(232,255,71,0.12)" stroke="var(--yellow)" strokeWidth={2} />
          {/* Points sur les axes */}
          {athletePoints.map((p, i) => (
            <circle key={i} cx={p.x} cy={p.y} r={4} fill={axes[i].color} stroke="var(--bg)" strokeWidth={1.5} />
          ))}
          {/* Labels axes */}
          {axes.map((a, i) => {
            const angle = startAngle + i * angleStep;
            const lp = getPoint(angle, R + 18);
            return (
              <text key={i} x={lp.x} y={lp.y} textAnchor="middle" dominantBaseline="middle" fill={a.color} fontSize={10} fontWeight="700">
                {a.label}
              </text>
            );
          })}
        </svg>
        {/* Légende avec valeurs */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10, flex: 1 }}>
          {axes.map(a => (
            <div key={a.label}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                <span style={{ fontSize: 12, color: "#888" }}>{a.label}</span>
                <span style={{ fontSize: 12, fontWeight: 700, color: a.color }}>{a.value}%</span>
              </div>
              <div style={{ background: "rgba(255,255,255,0.06)", borderRadius: 99, height: 4 }}>
                <div style={{ width: `${a.value}%`, height: 4, background: a.color, borderRadius: 99, transition: "width 0.8s" }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}

// ============================================================
// GRAPHIQUE MULTI-CHARGES (Squat + Deadlift ligne)
// ============================================================
function MultiChargesChart({ profile }) {
  const progression = buildProgressionData(profile);
  const [tooltip, setTooltip] = useState(null);

  const datasets = [
    { key: "squat", label: "Squat", color: "var(--yellow)", data: progression.squat },
    { key: "deadlift", label: "Deadlift", color: "var(--green)", data: progression.deadlift },
  ].filter(d => d.data.length >= 2);

  if (datasets.length === 0) return null;

  // Toutes les valeurs pour l'échelle
  const allValues = datasets.flatMap(d => d.data.map(p => p.value));
  const maxVal = Math.max(...allValues);
  const minVal = Math.min(...allValues) * 0.9;
  const range = maxVal - minVal || 1;

  const maxLen = Math.max(...datasets.map(d => d.data.length));
  const W = 320, H = 110, PAD = { top: 12, right: 12, bottom: 24, left: 32 };
  const innerW = W - PAD.left - PAD.right;
  const innerH = H - PAD.top - PAD.bottom;

  const xScale = (i, len) => len <= 1 ? innerW/2 : (i / (len - 1)) * innerW;
  const yScale = (v) => innerH - ((v - minVal) / range) * innerH;

  return (
    <Card style={{ marginBottom: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
        <div className="bebas" style={{ fontSize: 18, color: "var(--yellow)" }}>CHARGES (kg)</div>
        <div style={{ display: "flex", gap: 10 }}>
          {datasets.map(d => {
            const pct = getProgressionPct(d.data);
            return (
              <div key={d.key} style={{ display: "flex", alignItems: "center", gap: 5 }}>
                <div style={{ width: 12, height: 3, background: d.color, borderRadius: 99 }} />
                <span style={{ fontSize: 11, color: d.color, fontWeight: 700 }}>{d.label}</span>
                {pct !== null && <span style={{ fontSize: 10, color: "#555" }}>+{pct}%</span>}
              </div>
            );
          })}
        </div>
      </div>

      <svg width={W} height={H} style={{ overflow: "visible" }}>
        <g transform={`translate(${PAD.left},${PAD.top})`}>
          {/* Grille */}
          {[0, 33, 66, 100].map(pct => {
            const y = yScale(minVal + (range * pct / 100));
            return (
              <g key={pct}>
                <line x1={0} y1={y} x2={innerW} y2={y} stroke="rgba(255,255,255,0.04)" strokeWidth={1} />
                <text x={-4} y={y+4} textAnchor="end" fill="#2a2a2a" fontSize={8}>{Math.round(minVal + range * pct / 100)}</text>
              </g>
            );
          })}
          {/* Lignes par dataset */}
          {datasets.map(ds => {
            const d = ds.data;
            const linePath = d.map((p, i) => `${i===0?"M":"L"} ${xScale(i, d.length)} ${yScale(p.value)}`).join(" ");
            const areaPath = `${linePath} L ${xScale(d.length-1, d.length)} ${innerH} L ${xScale(0, d.length)} ${innerH} Z`;
            return (
              <g key={ds.key}>
                <path d={areaPath} fill={ds.color.replace("var(--yellow)", "rgba(232,255,71").replace("var(--green)", "rgba(57,255,128") + ",0.05)"} />
                <path d={linePath} fill="none" stroke={ds.color} strokeWidth={2} strokeLinecap="round" />
                {d.map((p, i) => (
                  <g key={i} onClick={() => setTooltip(tooltip === `${ds.key}-${i}` ? null : `${ds.key}-${i}`)}>
                    <circle cx={xScale(i, d.length)} cy={yScale(p.value)} r={5} fill="transparent" style={{ cursor: "pointer" }} />
                    <circle cx={xScale(i, d.length)} cy={yScale(p.value)} r={i===d.length-1?4:2.5} fill={ds.color} stroke="var(--bg)" strokeWidth={1.5} />
                    {tooltip === `${ds.key}-${i}` && (
                      <g>
                        <rect x={xScale(i, d.length)-28} y={yScale(p.value)-34} width={56} height={28} rx={5} fill="var(--bg2)" stroke={ds.color} strokeWidth={1} />
                        <text x={xScale(i, d.length)} y={yScale(p.value)-20} textAnchor="middle" fill={ds.color} fontSize={11} fontWeight="700">{p.value}kg</text>
                        <text x={xScale(i, d.length)} y={yScale(p.value)-10} textAnchor="middle" fill="#666" fontSize={9}>{p.label}</text>
                      </g>
                    )}
                    {(i === 0 || i === d.length-1) && (
                      <text x={xScale(i, d.length)} y={innerH+14} textAnchor="middle" fill="#444" fontSize={8}>{p.label}</text>
                    )}
                  </g>
                ))}
              </g>
            );
          })}
        </g>
      </svg>
    </Card>
  );
}

// ============================================================
// RÉSUMÉ HEBDOMADAIRE (généré le dimanche)
// ============================================================
function buildWeeklySummary(profile) {
  const sessions = profile.sessions || [];
  const now = new Date();
  const weekAgo = new Date(now - 7 * 24 * 60 * 60 * 1000);
  const thisWeek = sessions.filter(s => new Date(s.date) >= weekAgo);

  const bien = thisWeek.filter(s => s.ressenti === "bien").length;
  const dur = thisWeek.filter(s => s.ressenti === "dur").length;
  const facile = thisWeek.filter(s => s.ressenti === "facile").length;

  return { count: thisWeek.length, bien, dur, facile, sessions: thisWeek };
}

// ============================================================
// API ANTHROPIC
// ============================================================
async function callClaude(systemPrompt, userPrompt, maxTokens = 1000) {
  try {
    const response = await fetch("/api/claude", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "claude-sonnet-4-5",
        max_tokens: maxTokens,
        system: systemPrompt,
        messages: [{ role: "user", content: userPrompt }],
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("API HTTP error:", response.status, errText);
      throw new Error(`HTTP ${response.status}: ${errText.slice(0, 100)}`);
    }

    const data = await response.json();

    if (data.error) {
      console.error("API error:", data.error);
      throw new Error(data.error.message || JSON.stringify(data.error));
    }

    const result = data.content?.map(b => b.text || "").join("") || "";
    if (!result) throw new Error("Réponse vide de l'API");

    // Tracking usage API
    try {
      const today = new Date().toISOString().split("T")[0];
      const usageKey = `api_usage_${today}`;
      const existing = await storage.get(usageKey);
      const usage = (existing && typeof existing === "object") ? existing : { calls: 0, tokens: 0, date: today };
      usage.calls += 1;
      usage.tokens += (data.usage?.input_tokens || 0) + (data.usage?.output_tokens || 0);
      await storage.set(usageKey, usage);
    } catch {}

    return result;
  } catch (e) {
    console.error("callClaude error:", e.message);
    // Retourner l'erreur pour que l'appelant puisse l'afficher
    return `__ERROR__${e.message}`;
  }
}

// ── STREAMING (texte en temps réel) ─────────────────────────
async function callClaudeStream(systemPrompt, userPrompt, maxTokens = 1200, onChunk) {
  try {
    const response = await fetch("/api/claude", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "claude-sonnet-4-5",
        max_tokens: maxTokens,
        stream: true,
        system: systemPrompt,
        messages: [{ role: "user", content: userPrompt }],
      }),
    });

    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let fullText = "";
    let buffer = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop(); // garder la ligne incomplète pour le prochain chunk

      for (const line of lines) {
        if (!line.startsWith("data: ")) continue;
        const data = line.slice(6).trim();
        if (data === "[DONE]") continue;
        try {
          const parsed = JSON.parse(data);
          if (parsed.type === "content_block_delta" && parsed.delta?.type === "text_delta") {
            fullText += parsed.delta.text;
            onChunk(fullText);
          }
        } catch {}
      }
    }
    return fullText || "__ERROR__Réponse vide";
  } catch (e) {
    return `__ERROR__${e.message}`;
  }
}

async function getApiUsageStats() {
  try {
    const allKeys = await storage.list("api_usage_");
    const stats = await Promise.all(allKeys.map(async k => {
      return await storage.get(k);
    }));
    return stats.filter(Boolean).sort((a, b) => b.date.localeCompare(a.date));
  } catch { return []; }
}

// Coût estimé : Claude Sonnet ~$3/MTok input, ~$15/MTok output — moyenne ~$0.003/appel
function estimateCost(tokens) {
  return ((tokens / 1000000) * 9).toFixed(4); // moyenne $9/MTok
}

// ============================================================
// COMPOSANTS UI
// ============================================================
function Btn({ children, onClick, variant = "primary", size = "md", disabled, style }) {
  const styles = {
    primary: { background: "var(--yellow)", color: "#0a0a0a", fontWeight: 700 },
    danger: { background: "var(--red)", color: "#fff", fontWeight: 700 },
    success: { background: "var(--green)", color: "#0a0a0a", fontWeight: 700 },
    ghost: { background: "transparent", color: "var(--yellow)", border: "1.5px solid var(--yellow)" },
    dark: { background: "var(--bg3)", color: "var(--white)", border: "1px solid var(--gray2)" },
  };
  const sizes = { sm: { padding: "6px 14px", fontSize: 13 }, md: { padding: "11px 22px", fontSize: 15 }, lg: { padding: "15px 32px", fontSize: 18 } };
  return (
    <button onClick={onClick} disabled={disabled} style={{ borderRadius: 8, opacity: disabled ? 0.45 : 1, ...styles[variant], ...sizes[size], ...style }}>
      {children}
    </button>
  );
}

function Card({ children, style, onClick }) {
  return (
    <div onClick={onClick} style={{ background: "var(--bg2)", border: "1px solid var(--bg3)", borderRadius: 12, padding: 18, cursor: onClick ? "pointer" : "default", ...style }}>
      {children}
    </div>
  );
}

function Input({ label, value, onChange, type = "text", placeholder, style, min, max, step }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      {label && <label style={{ fontSize: 12, color: "#aaa", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.06em" }}>{label}</label>}
      <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} min={min} max={max} step={step}
        style={{ background: "var(--bg3)", border: "1px solid var(--gray2)", borderRadius: 8, padding: "10px 14px", color: "var(--white)", fontSize: 15, width: "100%", ...style }} />
    </div>
  );
}

function Select({ label, value, onChange, options, style }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      {label && <label style={{ fontSize: 12, color: "#aaa", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.06em" }}>{label}</label>}
      <select value={value} onChange={e => onChange(e.target.value)}
        style={{ background: "var(--bg3)", border: "1px solid var(--gray2)", borderRadius: 8, padding: "10px 14px", color: "var(--white)", fontSize: 15, width: "100%", ...style }}>
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  );
}

function Badge({ label, color = "var(--yellow)" }) {
  return <span style={{ background: color + "22", color, border: `1px solid ${color}44`, borderRadius: 20, padding: "3px 10px", fontSize: 12, fontWeight: 600 }}>{label}</span>;
}

function Spinner() {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16, padding: 40 }}>
      <div style={{ width: 40, height: 40, border: "3px solid var(--bg3)", borderTop: "3px solid var(--yellow)", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
      <span style={{ color: "#aaa", fontSize: 14 }}>Ton coach prépare ta séance…</span>
    </div>
  );
}

function ProgressBar({ value, max = 100, color = "var(--yellow)", height = 6 }) {
  return (
    <div style={{ background: "var(--bg3)", borderRadius: 99, height, overflow: "hidden" }}>
      <div style={{ width: `${Math.min(100, (value / max) * 100)}%`, height: "100%", background: color, borderRadius: 99, transition: "width 0.8s ease" }} />
    </div>
  );
}

function Section({ title, children, action }) {
  return (
    <div style={{ marginBottom: 28 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
        <h2 className="bebas" style={{ fontSize: 22, color: "var(--yellow)" }}>{title}</h2>
        {action}
      </div>
      {children}
    </div>
  );
}

// ============================================================
// JAUGE CONDITION PHYSIQUE
// ============================================================
function FitnessScoreCard({ profile }) {
  const score = calcFitnessScore(profile);
  const getColor = (v) => v >= 70 ? "var(--green)" : v >= 40 ? "var(--yellow)" : "var(--red)";

  return (
    <Card style={{ border: "1.5px solid var(--yellow)33", marginBottom: 16 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 20 }}>
        <div style={{ textAlign: "center" }}>
          <div className="bebas" style={{ fontSize: 64, color: getColor(score.global), lineHeight: 1 }}>{score.global}</div>
          <div style={{ fontSize: 11, color: "#888", textTransform: "uppercase", letterSpacing: "0.1em" }}>Score Global</div>
        </div>
        <div style={{ flex: 1 }}>
          {[
            { label: "Force", value: score.force, color: "var(--yellow)" },
            { label: "Endurance", value: score.endurance, color: "var(--green)" },
            { label: "Puissance", value: score.puissance, color: "var(--red)" },
          ].map(item => (
            <div key={item.label} style={{ marginBottom: 10 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                <span style={{ fontSize: 13, color: "#aaa" }}>{item.label}</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: item.color }}>{item.value}%</span>
              </div>
              <ProgressBar value={item.value} color={item.color} height={5} />
            </div>
          ))}
        </div>
      </div>
      <div style={{ fontSize: 12, color: "#555", textAlign: "center" }}>
        Basé sur {profile.sessions?.length || 0} séances · Se met à jour après chaque séance
      </div>
    </Card>
  );
}

// ============================================================
// AUTH — Email / Mot de passe
// ============================================================
const COACH_CODE = "FITRACE2025";

async function hashPassword(password) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password + "fitrace_salt_2025");
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
}

function LoginScreen({ onLogin }) {
  const [mode, setMode] = useState("choose"); // choose | login | register | coach
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleRegister() {
    if (!email.trim() || !password || !name.trim()) return;
    setLoading(true); setError("");
    try {
      const key = `user_${email.trim().toLowerCase()}`;
      const existing = await storage.get(key);
      if (existing) { setError("Un compte existe déjà avec cet email."); setLoading(false); return; }
      const hash = await hashPassword(password);
      const userData = { email: email.trim().toLowerCase(), name: name.trim(), hash, createdAt: new Date().toISOString() };
      await storage.set(key, userData);
      // Sauvegarder la session avec email ET nom pour double sécurité
      await storage.set("session_current", { email: userData.email, name: userData.name, role: "athlete", loginAt: new Date().toISOString() });
      onLogin("athlete", name.trim(), email.trim().toLowerCase());
    } catch (e) { setError("Erreur lors de l'inscription."); }
    setLoading(false);
  }

  async function handleLogin() {
    if (!email.trim() || !password) return;
    setLoading(true); setError("");
    try {
      const key = `user_${email.trim().toLowerCase()}`;
      const userData = await storage.get(key);
      if (!userData) { setError("Aucun compte trouvé avec cet email."); setLoading(false); return; }
      const hash = await hashPassword(password);
      if (hash !== userData.hash) { setError("Mot de passe incorrect."); setLoading(false); return; }
      await storage.set("session_current", { email: userData.email, name: userData.name, role: "athlete", loginAt: new Date().toISOString() });
      onLogin("athlete", userData.name, userData.email);
    } catch (e) { setError("Erreur de connexion."); }
    setLoading(false);
  }

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "var(--bg)", overflow: "hidden" }}>
      <style>{GLOBAL_STYLES}</style>

      {/* Hero section */}
      <div style={{ position: "relative", padding: "60px 24px 40px", textAlign: "center", flexShrink: 0 }}>
        {/* Glow behind logo */}
        <div style={{ position: "absolute", top: 40, left: "50%", transform: "translateX(-50%)", width: 200, height: 200, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,213,0,0.12) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div className="bebas fade-in" style={{ fontSize: 80, color: "var(--yellow)", lineHeight: 0.85, letterSpacing: 3, position: "relative" }}>FIT</div>
        <div className="bebas fade-in" style={{ fontSize: 80, color: "var(--white)", lineHeight: 0.85, letterSpacing: 3, position: "relative" }}>RACE</div>
        <div style={{ marginTop: 14, color: "#555", fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", position: "relative" }}>Entraînement HYROX · IA Adaptative</div>
      </div>

      {/* Content card */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-start", padding: "0 24px 40px" }}>
        <div style={{ width: "100%", maxWidth: 360 }}>

          {mode === "choose" && (
            <div className="fade-in" style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {/* Feature pills */}
              <div style={{ display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap", marginBottom: 8 }}>
                {["🤖 Coach IA", "📊 Progression", "🏁 Race Sim"].map(f => (
                  <span key={f} style={{ background: "rgba(255,213,0,0.08)", border: "1px solid rgba(255,213,0,0.2)", borderRadius: 20, padding: "4px 12px", fontSize: 12, color: "#aaa" }}>{f}</span>
                ))}
              </div>

              <div style={{ height: 1, background: "rgba(255,255,255,0.06)", marginBottom: 4 }} />

              <button onClick={() => setMode("register")} style={{ width: "100%", background: "var(--yellow)", color: "#000", border: "none", borderRadius: 14, padding: "16px 24px", fontSize: 15, fontWeight: 700, cursor: "pointer", letterSpacing: "0.04em" }}>
                ✨ Créer mon compte gratuitement
              </button>

              <button onClick={() => setMode("login")} style={{ width: "100%", background: "rgba(255,255,255,0.05)", color: "var(--white)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 14, padding: "14px 24px", fontSize: 15, fontWeight: 600, cursor: "pointer" }}>
                👤 Se connecter
              </button>

              <div style={{ textAlign: "center", marginTop: 4 }}>
                <span onClick={() => setMode("coach")} style={{ fontSize: 12, color: "#444", cursor: "pointer" }}>🏅 Accès Coach</span>
              </div>
            </div>
          )}

          {mode === "login" && (
            <div className="fade-in" style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div style={{ textAlign: "center", marginBottom: 4 }}>
                <div className="bebas" style={{ fontSize: 28, color: "var(--yellow)" }}>CONNEXION</div>
                <div style={{ fontSize: 13, color: "#555", marginTop: 2 }}>Bon retour 👋</div>
              </div>
              <Input label="Email" value={email} onChange={setEmail} placeholder="ton@email.com" type="email" />
              <Input label="Mot de passe" value={password} onChange={setPassword} placeholder="••••••••" type="password" />
              {error && (
                <div style={{ background: "rgba(255,60,60,0.1)", border: "1px solid rgba(255,60,60,0.3)", borderRadius: 10, padding: "10px 14px", color: "#ff6b6b", fontSize: 13, textAlign: "center" }}>
                  {error}
                </div>
              )}
              <button disabled={!email || !password || loading} onClick={handleLogin} style={{ width: "100%", background: !email || !password || loading ? "rgba(255,213,0,0.3)" : "var(--yellow)", color: "#000", border: "none", borderRadius: 14, padding: "16px", fontSize: 15, fontWeight: 700, cursor: loading ? "default" : "pointer", transition: "background 0.2s" }}>
                {loading ? "Connexion…" : "Se connecter →"}
              </button>
              <button onClick={() => { setMode("choose"); setError(""); }} style={{ width: "100%", background: "transparent", color: "#555", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, padding: "12px", fontSize: 13, cursor: "pointer" }}>
                ← Retour
              </button>
              <div style={{ textAlign: "center", fontSize: 12, color: "#444" }}>
                Pas encore de compte ?{" "}
                <span onClick={() => { setMode("register"); setError(""); }} style={{ color: "var(--yellow)", cursor: "pointer", fontWeight: 600 }}>Créer un compte</span>
              </div>
            </div>
          )}

          {mode === "register" && (
            <div className="fade-in" style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div style={{ textAlign: "center", marginBottom: 4 }}>
                <div className="bebas" style={{ fontSize: 28, color: "var(--yellow)" }}>INSCRIPTION</div>
                <div style={{ fontSize: 13, color: "#555", marginTop: 2 }}>Prêt·e à relever le défi 💪</div>
              </div>
              <Input label="Prénom" value={name} onChange={setName} placeholder="ex: Sophie" />
              <Input label="Email" value={email} onChange={setEmail} placeholder="ton@email.com" type="email" />
              <Input label="Mot de passe" value={password} onChange={setPassword} placeholder="min. 6 caractères" type="password" />
              {password && password.length < 6 && (
                <div style={{ fontSize: 12, color: "#666", marginTop: -8 }}>🔒 Au moins 6 caractères requis</div>
              )}
              {error && (
                <div style={{ background: "rgba(255,60,60,0.1)", border: "1px solid rgba(255,60,60,0.3)", borderRadius: 10, padding: "10px 14px", color: "#ff6b6b", fontSize: 13, textAlign: "center" }}>
                  {error}
                </div>
              )}
              <button disabled={!email || !password || !name || loading || password.length < 6} onClick={handleRegister} style={{ width: "100%", background: (!email || !password || !name || loading || password.length < 6) ? "rgba(255,213,0,0.3)" : "var(--yellow)", color: "#000", border: "none", borderRadius: 14, padding: "16px", fontSize: 15, fontWeight: 700, cursor: (loading || password.length < 6) ? "default" : "pointer", transition: "background 0.2s" }}>
                {loading ? "Création…" : "Créer mon compte →"}
              </button>
              <button onClick={() => { setMode("choose"); setError(""); }} style={{ width: "100%", background: "transparent", color: "#555", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, padding: "12px", fontSize: 13, cursor: "pointer" }}>
                ← Retour
              </button>
              <div style={{ textAlign: "center", fontSize: 12, color: "#444" }}>
                Déjà un compte ?{" "}
                <span onClick={() => { setMode("login"); setError(""); }} style={{ color: "var(--yellow)", cursor: "pointer", fontWeight: 600 }}>Se connecter</span>
              </div>
            </div>
          )}

          {mode === "coach" && (
            <div className="fade-in" style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div style={{ textAlign: "center", marginBottom: 4 }}>
                <div className="bebas" style={{ fontSize: 28, color: "var(--yellow)" }}>ACCÈS COACH</div>
                <div style={{ fontSize: 13, color: "#555", marginTop: 2 }}>Espace réservé aux entraîneurs</div>
              </div>
              <Input label="Code coach" value={code} onChange={setCode} placeholder="Code secret" type="password" />
              {error && (
                <div style={{ background: "rgba(255,60,60,0.1)", border: "1px solid rgba(255,60,60,0.3)", borderRadius: 10, padding: "10px 14px", color: "#ff6b6b", fontSize: 13, textAlign: "center" }}>
                  {error}
                </div>
              )}
              <button disabled={!code || loading} onClick={() => { if (code === COACH_CODE) onLogin("coach", "Coach"); else setError("Code incorrect !"); }} style={{ width: "100%", background: !code ? "rgba(255,213,0,0.3)" : "var(--yellow)", color: "#000", border: "none", borderRadius: 14, padding: "16px", fontSize: 15, fontWeight: 700, cursor: !code ? "default" : "pointer", transition: "background 0.2s" }}>
                Accès Coach →
              </button>
              <button onClick={() => { setMode("choose"); setError(""); }} style={{ width: "100%", background: "transparent", color: "#555", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, padding: "12px", fontSize: 13, cursor: "pointer" }}>
                ← Retour
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

// ============================================================
// ONBOARDING
// ============================================================
function OnboardingScreen({ athleteName, athleteEmail, onComplete }) {
  const [showWelcome, setShowWelcome] = useState(true);
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState({
    name: athleteName || "", poids: "", age: "", sexe: "homme", raceDate: "",
    niveauRessenti: "intermédiaire", dejaFaitHyrox: "non", previousChrono: "", previousDate: "",
    squat1RM: "", deadlift1RM: "", squatReps: "", squatWeight: "", deadliftReps: "", deadliftWeight: "", aiProfile: "",
    objectifPrincipal: "", sousObjectif: "", hyroxCategorie: "open",
    seancesParSemaine: "auto", repartition: "auto", nbRun: "2", nbMuscu: "2", nbHybride: "1",
  });
  const set = (k, v) => setProfile(p => ({ ...p, [k]: v }));

  const steps = [
    { title: "Profil de base", icon: "👤" },
    { title: "Ton objectif", icon: "🎯" },
    { title: "Planning semaine", icon: "📅" },
    { title: "Niveau & historique", icon: "📊" },
    { title: "Profil IA généré", icon: "🤖" },
  ];

  // Écran de bienvenue
  if (showWelcome) return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", display: "flex", flexDirection: "column", padding: "0" }}>
      <style>{GLOBAL_STYLES}</style>
      {/* Hero */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 24px 24px", textAlign: "center" }}>
        <div style={{ marginBottom: 24 }}>
          <div className="bebas" style={{ fontSize: 64, color: "var(--yellow)", lineHeight: 1, letterSpacing: 4 }}>FITRACE</div>
          <div style={{ fontSize: 15, color: "#666", marginTop: 6, letterSpacing: 2, textTransform: "uppercase" }}>Coach IA · HYROX</div>
        </div>
        <div style={{ width: 60, height: 2, background: "var(--yellow)", borderRadius: 99, marginBottom: 32, opacity: 0.4 }} />
        <div style={{ fontSize: 18, color: "var(--white)", fontWeight: 700, marginBottom: 8, lineHeight: 1.4 }}>
          Ton programme HYROX<br/>généré par l'IA.
        </div>
        <div style={{ fontSize: 14, color: "#666", lineHeight: 1.7, marginBottom: 36, maxWidth: 340 }}>
          Adapté à ton profil, tes performances et ta date de course. Chaque séance évolue avec toi.
        </div>
        {/* 3 bénéfices */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12, width: "100%", maxWidth: 360, marginBottom: 36 }}>
          {[
            { icon: "⚡", title: "Séances personnalisées", sub: "Générées selon ta VMA, ta force et ta fatigue du jour" },
            { icon: "📈", title: "Progression tracée", sub: "Graphiques de charges, RPE, régularité et condition physique" },
            { icon: "🏁", title: "Stratégie de course", sub: "Split par station, simulation HYROX, checklist J-Day" },
          ].map(b => (
            <div key={b.icon} style={{ display: "flex", gap: 14, alignItems: "flex-start", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 14, padding: "14px 16px", textAlign: "left" }}>
              <div style={{ fontSize: 24, flexShrink: 0 }}>{b.icon}</div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 14, color: "var(--white)", marginBottom: 2 }}>{b.title}</div>
                <div style={{ fontSize: 12, color: "#555", lineHeight: 1.5 }}>{b.sub}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* CTA */}
      <div style={{ padding: "0 24px 40px" }}>
        <button onClick={() => setShowWelcome(false)} style={{
          width: "100%", padding: "18px", background: "var(--yellow)", border: "none",
          borderRadius: 16, fontSize: 18, fontFamily: "'Bebas Neue',sans-serif", letterSpacing: 2,
          color: "#0a0a0a", cursor: "pointer", boxShadow: "0 8px 32px rgba(232,255,71,0.25)",
        }}>
          CRÉER MON PROFIL →
        </button>
        <div style={{ textAlign: "center", marginTop: 14, fontSize: 12, color: "#333" }}>
          Configuration en 2 minutes · Gratuit
        </div>
      </div>
    </div>
  );

  async function generateAIProfile() {
    setLoading(true);
    setStep(4); // passer à l'étape résultat pour voir le streaming
    set("aiProfile", "");
    const squat = profile.squat1RM || (profile.squatWeight && profile.squatReps ? epley1RM(parseFloat(profile.squatWeight), parseInt(profile.squatReps)) : Math.round(parseFloat(profile.poids || 70) * 1.2));
    const dl = profile.deadlift1RM || (profile.deadliftWeight && profile.deadliftReps ? epley1RM(parseFloat(profile.deadliftWeight), parseInt(profile.deadliftReps)) : Math.round(parseFloat(profile.poids || 70) * 1.5));

    const result = await callClaudeStream(
      "Tu es un coach HYROX expert et bienveillant. Réponds toujours en français.",
      `Génère un profil athlète court (200 mots max) pour :
- Prénom: ${profile.name}, Âge: ${profile.age} ans, Poids: ${profile.poids}kg, Sexe: ${profile.sexe}
- Objectif: ${profile.objectifPrincipal === "hyrox" ? `HYROX ${profile.hyroxCategorie?.toUpperCase()}` : profile.objectifPrincipal === "course" ? `Course à pied — ${profile.sousObjectif}` : profile.objectifPrincipal === "muscu" ? `Musculation — ${profile.sousObjectif}` : "Perte de poids"}
- Séances/semaine: ${profile.seancesParSemaine === "auto" ? "automatique" : profile.seancesParSemaine}
- Niveau: ${profile.niveauRessenti}
- Date de course: ${profile.raceDate ? new Date(profile.raceDate).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" }) : "non définie"}
- Jours avant la course: ${profile.raceDate ? Math.max(0, Math.ceil((new Date(profile.raceDate) - new Date()) / (1000*60*60*24))) : "?"}
- Semaines de préparation disponibles: ${profile.raceDate ? Math.max(1, Math.ceil((new Date(profile.raceDate) - new Date()) / (1000*60*60*24*7))) : "?"}
- Aujourd'hui: ${new Date().toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}
IMPORTANT: Utilise les dates EXACTES ci-dessus. Inclus: analyse selon l'objectif, objectif réaliste, encouragement. Emojis bienvenus.`,
      800,
      (chunk) => set("aiProfile", chunk) // mise à jour en temps réel
    );

    set("aiProfile", result.startsWith("__ERROR__") ? "Profil généré — complète tes tests pour affiner !" : result);
    set("squat1RM_calc", squat);
    set("deadlift1RM_calc", dl);
    setLoading(false);
  }

  async function finishOnboarding(skipTests = false) {
    const finalProfile = {
      ...profile,
      createdAt: new Date().toISOString(),
      tests: {}, sessions: [], adaptations: [], alerts: [], week: 1,
      onboardingComplete: skipTests, // false = lance la batterie, true = passe directement
    };
    // Sauvegarder avec email si disponible, sinon par nom
    const key = athleteEmail ? `athlete_email_${athleteEmail}` : `athlete_${athleteName}`;
    await storage.set(key, finalProfile);
    // Mettre à jour la session avec le bon email
    if (athleteEmail) {
      await storage.set("session_current", { email: athleteEmail, name: athleteName, role: "athlete", loginAt: new Date().toISOString() });
    }
    onComplete(finalProfile);
  }

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", padding: "20px 20px 32px" }}>
      <style>{GLOBAL_STYLES}</style>

      {/* Header compact */}
      <div style={{ maxWidth: 480, margin: "0 auto", marginBottom: 28 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <div className="bebas" style={{ fontSize: 26, color: "var(--yellow)", letterSpacing: 2 }}>FITRACE</div>
          <div style={{ fontSize: 12, color: "#555" }}>
            {step + 1} / {steps.length}
          </div>
        </div>
        {/* Barre de progression avec titres */}
        <div style={{ display: "flex", gap: 4 }}>
          {steps.map((s, i) => (
            <div key={i} style={{ flex: 1 }}>
              <div style={{ height: 3, borderRadius: 99, background: i < step ? "var(--yellow)" : i === step ? "var(--yellow)" : "var(--bg3)", transition: "background 0.3s" }} />
            </div>
          ))}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 12 }}>
          <span style={{ fontSize: 18 }}>{steps[step].icon}</span>
          <span style={{ fontSize: 14, fontWeight: 700, color: "var(--white)" }}>{steps[step].title}</span>
        </div>
      </div>

      <div className="fade-in" key={step} style={{ maxWidth: 480, margin: "0 auto" }}>
        {/* STEP 0 — Profil de base */}
        {step === 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ fontSize: 13, color: "#666", lineHeight: 1.6, marginBottom: 4 }}>
              Quelques infos pour personnaliser ton programme. Tout peut être modifié plus tard.
            </div>
            <Card>
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {!athleteName && (
                  <Input label="Ton prénom" value={profile.name} onChange={v => set("name", v)} placeholder="ex: Lucas" />
                )}
                <Input label="Poids (kg)" value={profile.poids} onChange={v => set("poids", v)} type="number" placeholder="ex: 72" />
                <Input label="Âge" value={profile.age} onChange={v => set("age", v)} type="number" placeholder="ex: 28" />
                <div>
                  <div style={{ fontSize: 12, color: "#aaa", fontWeight: 600, textTransform: "uppercase", marginBottom: 10 }}>Sexe</div>
                  <div style={{ display: "flex", gap: 10 }}>
                    {[{ v: "homme", label: "👨 Homme" }, { v: "femme", label: "👩 Femme" }].map(s => (
                      <button key={s.v} onClick={() => set("sexe", s.v)} style={{
                        flex: 1, padding: "14px", borderRadius: 12, fontSize: 14, fontWeight: 700,
                        background: profile.sexe === s.v ? "var(--yellow)22" : "var(--bg3)",
                        border: profile.sexe === s.v ? "2px solid var(--yellow)" : "1.5px solid var(--bg3)",
                        color: profile.sexe === s.v ? "var(--yellow)" : "#888", cursor: "pointer", transition: "all 0.2s",
                      }}>{s.label}</button>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
            <Btn size="lg" disabled={!profile.poids || !profile.age || (!athleteName && !profile.name)} onClick={() => setStep(1)} style={{ width: "100%" }}>Suivant →</Btn>
          </div>
        )}

        {/* STEP 1 — Objectif principal */}
        {step === 1 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            <Card>
              <div style={{ fontSize: 14, color: "#aaa", marginBottom: 16, lineHeight: 1.5 }}>Quel est ton objectif principal ? Cela permettra à l'IA de personnaliser ton programme.</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {[
                  { v: "hyrox", icon: "🏅", label: "Préparer un HYROX", sub: "Course officielle HYROX" },
                  { v: "course", icon: "🏃", label: "Améliorer ma course à pied", sub: "VMA, 5k, 10k, Semi, Marathon" },
                  { v: "muscu", icon: "💪", label: "Objectif musculation", sub: "Force, Hypertrophie, Puissance" },
                  { v: "perte_poids", icon: "⚖️", label: "Perte de poids", sub: "Composition corporelle + santé" },
                ].map(o => (
                  <button key={o.v} onClick={() => { set("objectifPrincipal", o.v); set("sousObjectif", ""); }} style={{
                    display: "flex", alignItems: "center", gap: 14, padding: "14px 16px", borderRadius: 12, textAlign: "left",
                    background: profile.objectifPrincipal === o.v ? "var(--yellow)15" : "var(--bg3)",
                    border: profile.objectifPrincipal === o.v ? "2px solid var(--yellow)" : "1.5px solid transparent",
                    color: "var(--white)", cursor: "pointer",
                  }}>
                    <span style={{ fontSize: 26 }}>{o.icon}</span>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 15, color: profile.objectifPrincipal === o.v ? "var(--yellow)" : "var(--white)" }}>{o.label}</div>
                      <div style={{ fontSize: 12, color: "#555", marginTop: 2 }}>{o.sub}</div>
                    </div>
                    {profile.objectifPrincipal === o.v && <span style={{ marginLeft: "auto", color: "var(--yellow)" }}>✓</span>}
                  </button>
                ))}
              </div>

              {/* Sous-objectifs HYROX */}
              {profile.objectifPrincipal === "hyrox" && (
                <div style={{ marginTop: 16 }}>
                  <div style={{ fontSize: 12, color: "#aaa", fontWeight: 700, textTransform: "uppercase", marginBottom: 10 }}>Catégorie HYROX</div>
                  <div style={{ display: "flex", gap: 10 }}>
                    {[{ v: "open", label: "🟢 Open", sub: "Tous niveaux" }, { v: "pro", label: "🔴 Pro", sub: "Élite" }].map(c => (
                      <button key={c.v} onClick={() => set("hyroxCategorie", c.v)} style={{
                        flex: 1, padding: "12px", borderRadius: 10, textAlign: "center",
                        background: profile.hyroxCategorie === c.v ? "var(--yellow)15" : "var(--bg3)",
                        border: profile.hyroxCategorie === c.v ? "2px solid var(--yellow)" : "1.5px solid transparent",
                        color: "var(--white)", cursor: "pointer",
                      }}>
                        <div style={{ fontWeight: 700 }}>{c.label}</div>
                        <div style={{ fontSize: 11, color: "#555" }}>{c.sub}</div>
                      </button>
                    ))}
                  </div>
                  <div style={{ marginTop: 10 }}>
                    <Input label="Date de ta course HYROX" value={profile.raceDate} onChange={v => set("raceDate", v)} type="date" />
                  </div>
                </div>
              )}

              {/* Sous-objectifs Course */}
              {profile.objectifPrincipal === "course" && (
                <div style={{ marginTop: 16 }}>
                  <div style={{ fontSize: 12, color: "#aaa", fontWeight: 700, textTransform: "uppercase", marginBottom: 10 }}>Objectif spécifique</div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {["Améliorer ma VMA", "5 km", "10 km", "Semi-marathon", "Marathon"].map(o => (
                      <button key={o} onClick={() => set("sousObjectif", o)} style={{
                        padding: "8px 14px", borderRadius: 20, fontSize: 13, fontWeight: 600,
                        background: profile.sousObjectif === o ? "var(--yellow)22" : "var(--bg3)",
                        border: profile.sousObjectif === o ? "1.5px solid var(--yellow)" : "1px solid var(--bg3)",
                        color: profile.sousObjectif === o ? "var(--yellow)" : "#666", cursor: "pointer",
                      }}>{o}</button>
                    ))}
                  </div>
                </div>
              )}

              {/* Sous-objectifs Muscu */}
              {profile.objectifPrincipal === "muscu" && (
                <div style={{ marginTop: 16 }}>
                  <div style={{ fontSize: 12, color: "#aaa", fontWeight: 700, textTransform: "uppercase", marginBottom: 10 }}>Objectif spécifique</div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {["Hypertrophie", "Force", "Endurance musculaire", "Puissance", "Full body"].map(o => (
                      <button key={o} onClick={() => set("sousObjectif", o)} style={{
                        padding: "8px 14px", borderRadius: 20, fontSize: 13, fontWeight: 600,
                        background: profile.sousObjectif === o ? "var(--yellow)22" : "var(--bg3)",
                        border: profile.sousObjectif === o ? "1.5px solid var(--yellow)" : "1px solid var(--bg3)",
                        color: profile.sousObjectif === o ? "var(--yellow)" : "#666", cursor: "pointer",
                      }}>{o}</button>
                    ))}
                  </div>
                </div>
              )}
            </Card>
            <div style={{ display: "flex", gap: 12 }}>
              <Btn variant="dark" onClick={() => setStep(0)} style={{ flex: 1 }}>← Retour</Btn>
              <Btn disabled={!profile.objectifPrincipal} onClick={() => setStep(2)} style={{ flex: 2 }}>Suivant →</Btn>
            </div>
          </div>
        )}

        {/* STEP 2 — Planning semaine */}
        {step === 2 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            <Card>
              <div style={{ fontSize: 14, color: "#aaa", marginBottom: 16, lineHeight: 1.5 }}>Combien de séances veux-tu faire par semaine ? L'IA peut choisir automatiquement selon ta disponibilité.</div>
              <div style={{ marginBottom: 20 }}>
                <div style={{ fontSize: 12, color: "#aaa", fontWeight: 700, textTransform: "uppercase", marginBottom: 10 }}>Séances par semaine</div>
                <div style={{ display: "flex", gap: 8 }}>
                  {[{ v: "auto", label: "🤖 Auto" }, { v: "3", label: "3" }, { v: "4", label: "4" }, { v: "5", label: "5" }].map(s => (
                    <button key={s.v} onClick={() => set("seancesParSemaine", s.v)} style={{
                      flex: 1, padding: "12px 6px", borderRadius: 10, fontSize: 14, fontWeight: 700, textAlign: "center",
                      background: profile.seancesParSemaine === s.v ? "var(--yellow)22" : "var(--bg3)",
                      border: profile.seancesParSemaine === s.v ? "2px solid var(--yellow)" : "1.5px solid transparent",
                      color: profile.seancesParSemaine === s.v ? "var(--yellow)" : "#888", cursor: "pointer",
                    }}>{s.label}</button>
                  ))}
                </div>
              </div>

              <div>
                <div style={{ fontSize: 12, color: "#aaa", fontWeight: 700, textTransform: "uppercase", marginBottom: 10 }}>Répartition des types</div>
                <div style={{ display: "flex", gap: 10, marginBottom: 12 }}>
                  {[{ v: "auto", label: "🤖 Automatique" }, { v: "custom", label: "✏️ Personnalisée" }].map(r => (
                    <button key={r.v} onClick={() => set("repartition", r.v)} style={{
                      flex: 1, padding: "10px", borderRadius: 10, fontSize: 13, fontWeight: 700,
                      background: profile.repartition === r.v ? "var(--yellow)22" : "var(--bg3)",
                      border: profile.repartition === r.v ? "2px solid var(--yellow)" : "1.5px solid transparent",
                      color: profile.repartition === r.v ? "var(--yellow)" : "#888", cursor: "pointer",
                    }}>{r.label}</button>
                  ))}
                </div>
                {profile.repartition === "custom" && (
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
                    <Input label="🏃 Run" value={profile.nbRun} onChange={v => set("nbRun", v)} type="number" placeholder="ex: 2" />
                    <Input label="🏋️ Muscu" value={profile.nbMuscu} onChange={v => set("nbMuscu", v)} type="number" placeholder="ex: 2" />
                    <Input label="⚡ Hybride" value={profile.nbHybride} onChange={v => set("nbHybride", v)} type="number" placeholder="ex: 1" />
                  </div>
                )}
              </div>
            </Card>
            <div style={{ display: "flex", gap: 12 }}>
              <Btn variant="dark" onClick={() => setStep(1)} style={{ flex: 1 }}>← Retour</Btn>
              <Btn onClick={() => setStep(3)} style={{ flex: 2 }}>Suivant →</Btn>
            </div>
          </div>
        )}

        {/* STEP 3 — Niveau & historique */}
        {step === 3 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            <Card>
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <Select label="Niveau ressenti" value={profile.niveauRessenti} onChange={v => set("niveauRessenti", v)} options={[
                  { value: "débutant", label: "🟢 Débutant" }, { value: "intermédiaire", label: "🟡 Intermédiaire" },
                  { value: "avancé", label: "🟠 Avancé" }, { value: "compétiteur", label: "🔴 Compétiteur" },
                ]} />
                {profile.objectifPrincipal === "hyrox" && (
                  <>
                    <Select label="Déjà fait une course HYROX ?" value={profile.dejaFaitHyrox} onChange={v => set("dejaFaitHyrox", v)} options={[
                      { value: "non", label: "Non, c'est ma première" }, { value: "oui", label: "Oui" },
                    ]} />
                    {profile.dejaFaitHyrox === "oui" && (
                      <>
                        <Input label="Ton chrono (ex: 1:45:30)" value={profile.previousChrono} onChange={v => set("previousChrono", v)} placeholder="hh:mm:ss" />
                        <Input label="Date de cette course" value={profile.previousDate} onChange={v => set("previousDate", v)} type="date" />
                      </>
                    )}
                  </>
                )}
              </div>
            </Card>
            <div style={{ display: "flex", gap: 12 }}>
              <Btn variant="dark" onClick={() => setStep(2)} style={{ flex: 1 }}>← Retour</Btn>
              <Btn onClick={generateAIProfile} style={{ flex: 2 }}>Générer mon profil ✨</Btn>
            </div>
          </div>
        )}

        {/* STEP 4 — Profil IA + proposition batterie de tests */}
        {step === 4 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {/* Profil IA streamé */}
            <Card style={{ border: "1.5px solid rgba(232,255,71,0.25)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(232,255,71,0.1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>🤖</div>
                <div>
                  <div className="bebas" style={{ fontSize: 18, color: "var(--yellow)", lineHeight: 1 }}>TON PROFIL COACH IA</div>
                  <div style={{ fontSize: 11, color: "#555" }}>Personnalisé par l'IA</div>
                </div>
              </div>
              {loading ? (
                <div>
                  <div style={{ fontSize: 14, color: "#ccc", lineHeight: 1.8, minHeight: 80 }}>
                    {profile.aiProfile || <span style={{ color: "#444", fontStyle: "italic" }}>Ton coach analyse ton profil...</span>}
                  </div>
                  {!profile.aiProfile && (
                    <div style={{ display: "flex", gap: 6, marginTop: 12 }}>
                      {[0,1,2].map(i => <div key={i} style={{ width: 7, height: 7, borderRadius: "50%", background: "var(--yellow)", opacity: 0.6, animation: `pulse 1.2s ${i*0.2}s ease-in-out infinite` }} />)}
                    </div>
                  )}
                </div>
              ) : (
                <div style={{ fontSize: 14, color: "#ccc", lineHeight: 1.8 }}>{profile.aiProfile}</div>
              )}
            </Card>

            {/* Option batterie de tests */}
            {!loading && (
              <div className="fade-in">
                <div style={{ background: "rgba(232,255,71,0.04)", border: "1px solid rgba(232,255,71,0.15)", borderRadius: 14, padding: "16px", marginBottom: 12 }}>
                  <div className="bebas" style={{ fontSize: 17, color: "var(--yellow)", marginBottom: 6 }}>🧪 CALIBRER TON PROGRAMME</div>
                  <div style={{ fontSize: 13, color: "#888", lineHeight: 1.6, marginBottom: 12 }}>
                    Une batterie de tests rapide pour personnaliser les charges et allures au kilo près.
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 14 }}>
                    {["VMA Demi-Cooper", "Squat 1RM", "Deadlift", "SkiErg", "Rowing", "Wall Balls", "Sled Push"].map(t => (
                      <span key={t} style={{ fontSize: 11, background: "var(--bg3)", color: "#666", padding: "3px 8px", borderRadius: 6 }}>{t}</span>
                    ))}
                  </div>
                  <Btn size="lg" onClick={finishOnboarding} style={{ width: "100%" }}>
                    Commencer la batterie →
                  </Btn>
                </div>
                <Btn variant="dark" onClick={async () => {
                  await finishOnboarding(true);
                }} style={{ width: "100%", color: "#555", fontSize: 13 }}>
                  Passer — accéder directement à l'app →
                </Btn>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================
// BATTERIE DE TESTS
// ============================================================
function TestsBattery({ profile, onComplete }) {
  const [activeTest, setActiveTest] = useState(null);
  const [results, setResults] = useState(profile.tests || {});
  const [loading, setLoading] = useState(false);
  const [levelResult, setLevelResult] = useState(null);

  const tests = [
    { id: "vma", label: "Test VMA Demi-Cooper", icon: "🏃", desc: "6 min de course, note la distance en mètres", unit: "mètres" },
    { id: "squat", label: "Back Squat 1RM", icon: "🏋️", desc: "3-5 reps pour estimer ton max", sub: true },
    { id: "deadlift", label: "Deadlift 1RM", icon: "⚡", desc: "3-5 reps pour estimer ton max", sub: true },
    { id: "bench", label: "Bench Press 1RM", icon: "💪", desc: "3-5 reps pour estimer ton max", sub: true },
    { id: "ski", label: "SkiErg 500m", icon: "⛷️", desc: "Chrono sur 500m au SkiErg", unit: "secondes" },
    { id: "row", label: "Rowing 500m", icon: "🚣", desc: "Chrono sur 500m au rameur", unit: "secondes" },
    { id: "wallball", label: "Wall Balls max 2min", icon: "🏀", desc: `Nombre de reps en 2 minutes · Ton poids de compétition : ${getPoidsHyrox(profile).wall_balls}`, unit: "reps" },
    { id: "sled", label: "Sled Push 25m", icon: "🛷", desc: `Chrono sur 25m · Ton poids de compétition : ${getPoidsHyrox(profile).sled_push}`, unit: "secondes" },
    { id: "burpee", label: "Burpee Broad Jump 20m", icon: "💥", desc: "Chrono sur 20m", unit: "secondes" },
    { id: "farmers", label: "Farmers Carry 50m", icon: "🧳", desc: `Chrono sur 50m · Ton poids de compétition : ${getPoidsHyrox(profile).farmers_carry}`, unit: "secondes" },
  ];

  const completedCount = Object.keys(results).length;

  async function analyzeAndLevel() {
    setLoading(true);
    const vma = results.vma?.distance ? calcVMA(results.vma.distance) : null;
    const fcMax = results.vma?.fcMax || null;
    const fcMin = results.vma?.fcMin || null;
    const squat1RM = results.squat?.poids && results.squat?.reps ? epley1RM(results.squat.poids, results.squat.reps) : profile.squat1RM_calc;
    const dl1RM = results.deadlift?.poids && results.deadlift?.reps ? epley1RM(results.deadlift.poids, results.deadlift.reps) : profile.deadlift1RM_calc;

    const raw = await callClaude(
      "Tu es coach HYROX expert. Réponds uniquement JSON valide sans backticks.",
      `Analyse ces tests HYROX et classe l'athlète :
- ${profile.name}, ${profile.poids}kg, ${profile.age}ans, ${profile.sexe}
- VMA: ${vma || "non testé"}km/h, Squat: ${squat1RM || "?"}kg, Deadlift: ${dl1RM || "?"}kg
- SkiErg: ${results.ski?.value || "?"}s, Rowing: ${results.row?.value || "?"}s
- WallBalls: ${results.wallball?.value || "?"}reps, Sled: ${results.sled?.value || "?"}s
Niveaux: 1=Découverte, 2=Développement(finir), 3=Performance(sub-1h30), 4=Compétition(sub-1h)
JSON: {"level":1,"objectif":"","analyse":"","pointsForts":[],"axesTravail":[],"vmaKmh":0,"squat1RM":0,"deadlift1RM":0}`
    );

    try {
      const tCleaned = raw?.replace(/```json|```/g, "").trim() || "{}";
      const tMatch = tCleaned.match(/\{[\s\S]*\}/);
      const parsed = JSON.parse(tMatch ? tMatch[0] : "{}");
      setLevelResult(parsed);
      const today = new Date().toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
      const jAvant = profile.raceDate ? Math.max(0, Math.ceil((new Date(profile.raceDate) - new Date()) / (1000*60*60*24))) : null;
      const aiProf = await callClaude("Tu es coach HYROX expert. 150 mots max, en français.", `Profil pour ${profile.name}, ${profile.age}ans, ${profile.poids}kg, ${profile.sexe}. Objectif: ${profile.objectifPrincipal || "hyrox"} ${profile.hyroxCategorie || ""}. Niveau ${parsed.level}/4. VMA:${parsed.vmaKmh || vma}km/h | Squat:${parsed.squat1RM || squat1RM}kg. Aujourd'hui:${today}${jAvant !== null ? ` | J-${jAvant} avant la course` : ""}. Analyse courte et encourageante avec objectif réaliste. Emojis.`);
      const updatedProfile = { ...profile, tests: { ...results, analyzed: true }, level: parsed.level, vmaKmh: parsed.vmaKmh || vma, squat1RM_final: parsed.squat1RM || squat1RM, deadlift1RM_final: parsed.deadlift1RM || dl1RM, levelAnalysis: parsed, onboardingComplete: true, fcMax: fcMax, fcMin: fcMin, aiProfile: aiProf || "" };
      const saveKey = profile.email ? `athlete_email_${profile.email}` : `athlete_${profile.name}`;
      await storage.set(saveKey, updatedProfile);
    } catch (e) { console.error(e, raw); }
    setLoading(false);
  }

  function saveTestResult(testId, data) {
    const newResults = { ...results, [testId]: { ...data, date: new Date().toISOString() } };
    setResults(newResults);
    setActiveTest(null);
  }

  const lvlColors = ["", "#39ff80", "#e8ff47", "#ff9a3c", "#ff4747"];

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", padding: "20px 16px" }}>
      <style>{GLOBAL_STYLES}</style>
      <div style={{ maxWidth: 480, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div className="bebas" style={{ fontSize: 36, color: "var(--yellow)" }}>BATTERIE DE TESTS</div>
          <div style={{ color: "#888", fontSize: 13, marginTop: 4 }}>Semaine 1 · Calibration</div>
          <div style={{ marginTop: 12 }}>
            <ProgressBar value={completedCount} max={tests.length} />
            <div style={{ color: "#aaa", fontSize: 12, marginTop: 6 }}>{completedCount}/{tests.length} tests complétés</div>
          </div>
        </div>

        {levelResult ? (
          <div className="fade-in">
            <Card style={{ border: `2px solid ${lvlColors[levelResult.level]}44`, marginBottom: 20 }}>
              <div style={{ textAlign: "center", marginBottom: 16 }}>
                <div className="bebas" style={{ fontSize: 56, color: lvlColors[levelResult.level] }}>NIVEAU {levelResult.level}</div>
                <div style={{ color: lvlColors[levelResult.level], fontWeight: 700, fontSize: 18 }}>{LEVELS[levelResult.level - 1]?.emoji} {LEVELS[levelResult.level - 1]?.label}</div>
                <div style={{ color: "#888", fontSize: 13, marginTop: 4 }}>Objectif : {levelResult.objectif}</div>
              </div>
              <p style={{ fontSize: 14, color: "#ccc", lineHeight: 1.7, marginBottom: 16 }}>{levelResult.analyse}</p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div style={{ background: "var(--bg3)", borderRadius: 8, padding: 12 }}>
                  <div style={{ color: "var(--green)", fontSize: 12, fontWeight: 700, marginBottom: 8 }}>✅ POINTS FORTS</div>
                  {(levelResult.pointsForts || []).map((p, i) => <div key={i} style={{ fontSize: 13, color: "#ccc", marginBottom: 4 }}>• {p}</div>)}
                </div>
                <div style={{ background: "var(--bg3)", borderRadius: 8, padding: 12 }}>
                  <div style={{ color: "var(--yellow)", fontSize: 12, fontWeight: 700, marginBottom: 8 }}>🎯 À TRAVAILLER</div>
                  {(levelResult.axesTravail || []).map((p, i) => <div key={i} style={{ fontSize: 13, color: "#ccc", marginBottom: 4 }}>• {p}</div>)}
                </div>
              </div>
            </Card>
            <Btn size="lg" onClick={() => onComplete({ ...profile, level: levelResult.level, vmaKmh: levelResult.vmaKmh, squat1RM_final: levelResult.squat1RM, deadlift1RM_final: levelResult.deadlift1RM, levelAnalysis: levelResult, tests: results, onboardingComplete: true })} style={{ width: "100%" }}>
              Accéder à mon programme 🏆
            </Btn>
          </div>
        ) : (
          <>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 20 }}>
              {tests.map(test => {
                const done = !!results[test.id];
                return (
                  <Card key={test.id} onClick={() => setActiveTest(test)} style={{ border: done ? "1.5px solid var(--green)44" : "1px solid var(--bg3)", display: "flex", alignItems: "center", gap: 14 }}>
                    <div style={{ fontSize: 24 }}>{test.icon}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, fontSize: 14, color: done ? "var(--green)" : "var(--white)" }}>{test.label}</div>
                      <div style={{ fontSize: 12, color: "#666" }}>{test.desc}</div>
                    </div>
                    <div style={{ fontSize: 18 }}>{done ? "✅" : "→"}</div>
                  </Card>
                );
              })}
            </div>
            {completedCount >= 3 && !loading && <Btn size="lg" onClick={analyzeAndLevel} style={{ width: "100%", marginBottom: 12 }}>Analyser mes résultats ✨</Btn>}
            {loading && <Spinner />}

            {/* Bouton passer */}
            {!loading && !levelResult && (
              <div style={{ marginTop: 16 }}>
                <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 12, padding: "14px 16px", marginBottom: 12, textAlign: "center" }}>
                  <div style={{ fontSize: 13, color: "#555", lineHeight: 1.6 }}>
                    ℹ️ Ton coach aura besoin de ces informations pour créer le programme le plus adapté à ton profil. Tu pourras compléter ces tests plus tard dans l'onglet Profil.
                  </div>
                </div>
                <Btn variant="dark" size="md" onClick={() => onComplete({ ...profile, onboardingComplete: true, tests: results, level: 2, sessions: [], adaptations: [], alerts: [], week: 1 })} style={{ width: "100%", color: "#666" }}>
                  Passer cette étape pour le moment →
                </Btn>
              </div>
            )}
          </>
        )}

        {activeTest && <TestModal test={activeTest} onSave={saveTestResult} onClose={() => setActiveTest(null)} existing={results[activeTest.id]} />}
      </div>
    </div>
  );
}

function TestModal({ test, onSave, onClose, existing }) {
  const [val, setVal] = useState(existing?.value || "");
  const [poids, setPoids] = useState(existing?.poids || "");
  const [reps, setReps] = useState(existing?.reps || "");
  const [distance, setDistance] = useState(existing?.distance || "");
  const [fcMax, setFcMax] = useState(existing?.fcMax || "");
  const [fcMin, setFcMin] = useState(existing?.fcMin || "");

  // Zones Karvonen = FC réserve
  function karvonenZone(pct) {
    const fcR = parseInt(fcMax) - parseInt(fcMin);
    return Math.round(parseInt(fcMin) + fcR * (pct / 100));
  }
  const hasFC = fcMax && fcMin && parseInt(fcMax) > parseInt(fcMin);
  const vmaResult = distance ? calcVMA(parseFloat(distance)) : null;

  function save() {
    if (test.sub) onSave(test.id, { poids: parseFloat(poids), reps: parseInt(reps) });
    else if (test.id === "vma") onSave(test.id, {
      distance: parseFloat(distance),
      vma: vmaResult,
      fcMax: fcMax ? parseInt(fcMax) : null,
      fcMin: fcMin ? parseInt(fcMin) : null,
    });
    else onSave(test.id, { value: parseFloat(val) });
  }

  return (
    <div style={{ position: "fixed", inset: 0, background: "#000a", display: "flex", alignItems: "flex-end", zIndex: 1000 }}>
      <div className="fade-in" style={{ background: "var(--bg2)", borderRadius: "16px 16px 0 0", padding: 24, width: "100%", maxWidth: 480, margin: "0 auto", border: "1.5px solid var(--bg3)", maxHeight: "90vh", overflowY: "auto" }}>
        <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 6 }}>{test.icon} {test.label}</div>
        <div style={{ color: "#888", fontSize: 13, marginBottom: 20 }}>{test.desc}</div>

        {test.id === "vma" ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <Input label="Distance (mètres)" value={distance} onChange={setDistance} type="number" placeholder="ex: 1580" />

            {/* FC optionnelles */}
            <div style={{ background: "var(--bg3)", borderRadius: 10, padding: "12px 14px" }}>
              <div style={{ fontSize: 12, color: "var(--yellow)", fontWeight: 700, textTransform: "uppercase", marginBottom: 4 }}>
                Fréquence cardiaque <span style={{ color: "#555", fontWeight: 400, fontSize: 11 }}>(optionnel · améliore la précision)</span>
              </div>
              <div style={{ fontSize: 12, color: "#666", marginBottom: 10, lineHeight: 1.5 }}>
                FC max mesurée pendant le test · FC min au réveil (au repos)
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <Input label="FC max (bpm)" value={fcMax} onChange={setFcMax} type="number" placeholder="ex: 187" />
                <Input label="FC min repos (bpm)" value={fcMin} onChange={setFcMin} type="number" placeholder="ex: 52" />
              </div>
            </div>

            {/* Résultats */}
            {vmaResult && (
              <div style={{ background: "var(--bg3)", borderRadius: 8, padding: "12px 14px" }}>
                <div style={{ fontSize: 14, marginBottom: hasFC ? 10 : 0 }}>
                  VMA : <strong style={{ color: "var(--yellow)" }}>{vmaResult} km/h</strong>
                </div>
                {hasFC && (
                  <>
                    <div style={{ fontSize: 11, color: "#555", textTransform: "uppercase", fontWeight: 700, marginBottom: 8 }}>
                      Zones Karvonen (FC réserve)
                    </div>
                    {[
                      { z: "Z1", label: "Récup", pct: 50, color: "#555" },
                      { z: "Z2", label: "Endurance", pct: 60, color: "#39ff80" },
                      { z: "Z3", label: "Tempo", pct: 70, color: "#e8ff47" },
                      { z: "Z4", label: "Seuil", pct: 80, color: "#ff9a3c" },
                      { z: "Z5", label: "VO2max", pct: 90, color: "#ff4747" },
                    ].map(z => (
                      <div key={z.z} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                          <span style={{ fontSize: 11, fontWeight: 700, color: z.color, width: 20 }}>{z.z}</span>
                          <span style={{ fontSize: 12, color: "#888" }}>{z.label}</span>
                        </div>
                        <span style={{ fontSize: 12, fontWeight: 700, color: z.color }}>
                          {karvonenZone(z.pct)}–{karvonenZone(z.pct + 10)} bpm
                        </span>
                      </div>
                    ))}
                    <div style={{ marginTop: 8, fontSize: 11, color: "#444", fontStyle: "italic" }}>
                      FC max: {fcMax} bpm · FC repos: {fcMin} bpm · Réserve: {parseInt(fcMax) - parseInt(fcMin)} bpm
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        ) : test.sub ? (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <Input label="Poids (kg)" value={poids} onChange={setPoids} type="number" />
            <Input label="Reps" value={reps} onChange={setReps} type="number" placeholder="3-5" />
          </div>
        ) : (
          <Input label={test.unit === "secondes" ? "Temps (secondes)" : "Reps"} value={val} onChange={setVal} type="number" />
        )}

        {test.sub && poids && reps && (
          <div style={{ marginTop: 12, padding: "10px 14px", background: "var(--bg3)", borderRadius: 8, fontSize: 14 }}>
            1RM estimé : <strong style={{ color: "var(--yellow)" }}>{epley1RM(parseFloat(poids), parseInt(reps))} kg</strong>
          </div>
        )}

        <div style={{ display: "flex", gap: 12, marginTop: 20 }}>
          <Btn variant="dark" onClick={onClose} style={{ flex: 1 }}>Annuler</Btn>
          <Btn onClick={save} disabled={test.sub ? (!poids || !reps) : test.id === "vma" ? !distance : !val} style={{ flex: 2 }}>Enregistrer ✓</Btn>
        </div>
      </div>
    </div>
  );
}


// ============================================================
// COMPOSANT NIVEAU VISUEL
// ============================================================
function NiveauVisuelCard({ profile }) {
  const level = profile.level || 1;
  const lvl = LEVELS[level - 1];
  const nextLvl = LEVELS[level] || null;
  const sessions = profile.sessions || [];
  const score = calcFitnessScore(profile);
  // Progression vers niveau suivant: basé sur score global
  const thresholds = [0, 30, 55, 75, 100];
  const currentThreshold = thresholds[level - 1];
  const nextThreshold = thresholds[level] || 100;
  const pct = Math.min(100, Math.round(((score.global - currentThreshold) / (nextThreshold - currentThreshold)) * 100));

  return (
    <Card style={{ border: `1.5px solid ${lvl?.color}33`, marginBottom: 16 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 16 }}>
        <div style={{ width: 64, height: 64, borderRadius: "50%", border: `3px solid ${lvl?.color}`, display: "flex", alignItems: "center", justifyContent: "center", background: "var(--bg)", flexShrink: 0 }}>
          <div style={{ textAlign: "center" }}>
            <div className="bebas" style={{ fontSize: 28, color: lvl?.color, lineHeight: 1 }}>{level}</div>
            <div style={{ fontSize: 9, color: "#666" }}>niveau</div>
          </div>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 700, fontSize: 16, color: lvl?.color }}>{lvl?.emoji} {lvl?.label}</div>
          <div style={{ fontSize: 12, color: "#666", marginTop: 2 }}>{sessions.length} séances · Score {score.global}%</div>
          {nextLvl && (
            <div style={{ marginTop: 8 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                <span style={{ fontSize: 11, color: "#555" }}>Vers {nextLvl.label}</span>
                <span style={{ fontSize: 11, color: lvl?.color, fontWeight: 700 }}>{pct}%</span>
              </div>
              <ProgressBar value={pct} color={lvl?.color} height={6} />
            </div>
          )}
          {!nextLvl && (
            <div style={{ marginTop: 6, fontSize: 12, color: "var(--yellow)" }}>🏆 Niveau maximum atteint !</div>
          )}
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 6 }}>
        {LEVELS.map(l => (
          <div key={l.id} style={{ background: l.id <= level ? l.color + "22" : "var(--bg3)", border: `1px solid ${l.id <= level ? l.color + "66" : "var(--bg3)"}`, borderRadius: 8, padding: "6px 4px", textAlign: "center" }}>
            <div style={{ fontSize: 14 }}>{l.emoji}</div>
            <div style={{ fontSize: 9, color: l.id <= level ? l.color : "#555", marginTop: 2 }}>{l.label}</div>
          </div>
        ))}
      </div>
    </Card>
  );
}

// ============================================================
// GRAPHIQUE PROGRESSION DES CHARGES
// ============================================================
function ProgressionChargesCard({ profile }) {
  const [activeMetric, setActiveMetric] = useState("squat");
  const [tooltip, setTooltip] = useState(null);
  const progression = buildProgressionData(profile);
  const metrics = [
    { key: "squat", label: "Squat", color: "var(--yellow)", unit: "kg", icon: "🏋️" },
    { key: "deadlift", label: "Deadlift", color: "var(--green)", unit: "kg", icon: "⚡" },
    { key: "farmer", label: "Farmer", color: "#ff9a3c", unit: "kg", icon: "🧳" },
    { key: "vma", label: "VMA", color: "var(--red)", unit: "km/h", icon: "🏃" },
  ];
  const currentMetric = metrics.find(m => m.key === activeMetric);
  const data = progression[activeMetric] || [];
  const pct = getProgressionPct(data);
  const maxVal = data.length > 0 ? Math.max(...data.map(d => d.value)) : 1;
  const minVal = data.length > 0 ? Math.min(...data.map(d => d.value)) : 0;
  const range = maxVal - minVal || 1;
  const hasData = data.length >= 2;

  return (
    <Card style={{ marginBottom: 16 }}>
      {/* Titre */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
        <div className="bebas" style={{ fontSize: 18, color: "var(--yellow)" }}>PROGRESSION DES CHARGES</div>
        {hasData && pct !== null && (
          <div style={{ background: "rgba(57,255,128,0.1)", border: "1px solid rgba(57,255,128,0.3)", borderRadius: 8, padding: "3px 10px", fontSize: 12, fontWeight: 700, color: "var(--green)" }}>
            +{pct}% depuis le début
          </div>
        )}
      </div>

      {/* Sélecteur de métrique */}
      <div style={{ display: "flex", gap: 6, marginBottom: 16 }}>
        {metrics.map(m => {
          const d = progression[m.key] || [];
          const p = getProgressionPct(d);
          return (
            <button key={m.key} onClick={() => { setActiveMetric(m.key); setTooltip(null); }} style={{
              flex: 1, padding: "8px 4px", borderRadius: 10, fontSize: 11, fontWeight: 700,
              background: activeMetric === m.key ? m.color + "18" : "var(--bg3)",
              border: activeMetric === m.key ? `1.5px solid ${m.color}` : "1px solid var(--bg3)",
              color: activeMetric === m.key ? m.color : "#555", cursor: "pointer",
              transition: "all 0.2s",
            }}>
              <div style={{ fontSize: 14, marginBottom: 2 }}>{m.icon}</div>
              <div>{m.label}</div>
              {d.length >= 2 && p !== null && (
                <div style={{ fontSize: 9, marginTop: 2, color: activeMetric === m.key ? m.color : "#444" }}>+{p}%</div>
              )}
            </button>
          );
        })}
      </div>

      {!hasData ? (
        <div style={{ textAlign: "center", padding: "28px 16px", color: "#444", fontSize: 13, lineHeight: 1.6 }}>
          <div style={{ fontSize: 28, marginBottom: 8 }}>{currentMetric.icon}</div>
          Pas encore de données pour {currentMetric.label}.<br/>
          <span style={{ color: "#333" }}>Le graphique se construit séance après séance.</span>
        </div>
      ) : (
        <>
          {/* Stats comparatives */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 6, marginBottom: 16 }}>
            {[
              { label: "Début", value: data[0]?.value, color: "#555" },
              { label: "Mi-parcours", value: data[Math.floor(data.length / 2)]?.value, color: "#888" },
              { label: "Actuel", value: data[data.length - 1]?.value, color: currentMetric.color },
              { label: "Gain", value: pct !== null ? `+${pct}%` : "—", color: "var(--green)" },
            ].map((s, i) => (
              <div key={i} style={{ background: "var(--bg3)", borderRadius: 8, padding: "8px 4px", textAlign: "center" }}>
                <div style={{ fontSize: 9, color: "#444", marginBottom: 3, textTransform: "uppercase" }}>{s.label}</div>
                <div className="bebas" style={{ fontSize: 16, color: s.color, lineHeight: 1 }}>
                  {s.value ?? "—"}{i < 3 && s.value ? currentMetric.unit : ""}
                </div>
              </div>
            ))}
          </div>

          {/* Graphique barres interactif */}
          <div style={{ position: "relative" }}>
            {/* Lignes de grille */}
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 20, display: "flex", flexDirection: "column", justifyContent: "space-between", pointerEvents: "none" }}>
              {[100, 75, 50, 25].map(pct => (
                <div key={pct} style={{ borderTop: "1px solid rgba(255,255,255,0.04)", position: "relative" }}>
                  <span style={{ position: "absolute", left: 0, top: -8, fontSize: 8, color: "#2a2a2a" }}>
                    {Math.round(minVal + (range * pct / 100))}{currentMetric.unit}
                  </span>
                </div>
              ))}
            </div>

            {/* Barres */}
            <div style={{ display: "flex", alignItems: "flex-end", gap: 3, height: 120, paddingBottom: 20, paddingLeft: 24 }}>
              {data.map((d, i) => {
                const h = Math.max(6, Math.round(((d.value - minVal) / range) * 90) + 6);
                const isLast = i === data.length - 1;
                const isFirst = i === 0;
                const isTooltip = tooltip === i;
                return (
                  <div key={i} onClick={() => setTooltip(isTooltip ? null : i)}
                    style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 0, cursor: "pointer", position: "relative" }}>
                    {/* Tooltip */}
                    {isTooltip && (
                      <div style={{ position: "absolute", bottom: "100%", left: "50%", transform: "translateX(-50%)", background: "var(--bg2)", border: `1px solid ${currentMetric.color}44`, borderRadius: 8, padding: "6px 10px", fontSize: 11, color: "var(--white)", whiteSpace: "nowrap", zIndex: 10, marginBottom: 6 }}>
                        <div style={{ fontWeight: 700, color: currentMetric.color }}>{d.value}{currentMetric.unit}</div>
                        <div style={{ color: "#555", fontSize: 10 }}>{d.label}</div>
                      </div>
                    )}
                    {/* Valeur au dessus */}
                    {(isFirst || isLast) && (
                      <div style={{ fontSize: 8, color: isLast ? currentMetric.color : "#444", marginBottom: 2, fontWeight: isLast ? 700 : 400 }}>{d.value}</div>
                    )}
                    {/* Barre */}
                    <div style={{
                      width: "100%", height: h,
                      background: isLast
                        ? currentMetric.color
                        : isFirst
                          ? currentMetric.color + "44"
                          : currentMetric.color + "66",
                      borderRadius: "3px 3px 0 0",
                      transition: "height 0.7s cubic-bezier(0.16,1,0.3,1)",
                      border: isLast ? `1px solid ${currentMetric.color}` : "none",
                    }} />
                    {/* Label */}
                    <div style={{ fontSize: 8, color: isLast ? currentMetric.color : "#333", fontWeight: isLast ? 700 : 400, marginTop: 3, textAlign: "center" }}>{d.label}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Ligne de tendance texte */}
          {data.length >= 3 && (
            <div style={{ marginTop: 8, padding: "8px 12px", background: "var(--bg3)", borderRadius: 8, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 12, color: "#666" }}>Gain moyen par séance</span>
              <span style={{ fontSize: 13, fontWeight: 700, color: currentMetric.color }}>
                +{((data[data.length-1].value - data[0].value) / Math.max(data.length - 1, 1)).toFixed(1)}{currentMetric.unit}
              </span>
            </div>
          )}
        </>
      )}
    </Card>
  );
}

// ============================================================
// RÉSUMÉ HEBDOMADAIRE
// ============================================================
function WeeklySummaryCard({ profile }) {
  const summary = buildWeeklySummary(profile);
  const week = profile.week || 1;
  const nextTypes = ["Zone 2 + technique", "Force stations", "Running qualité"];

  return (
    <Card style={{ border: "1.5px solid var(--yellow)55", marginBottom: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <div className="bebas" style={{ fontSize: 20, color: "var(--yellow)" }}>RÉSUMÉ SEMAINE {week}</div>
        <Badge label="📅 Dimanche" color="var(--yellow)" />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 14 }}>
        <div style={{ background: "var(--bg3)", borderRadius: 8, padding: 10, textAlign: "center" }}>
          <div className="bebas" style={{ fontSize: 28, color: "var(--yellow)" }}>{summary.count}</div>
          <div style={{ fontSize: 10, color: "#666" }}>séances</div>
        </div>
        <div style={{ background: "var(--bg3)", borderRadius: 8, padding: 10, textAlign: "center" }}>
          <div className="bebas" style={{ fontSize: 28, color: "var(--green)" }}>{summary.bien}</div>
          <div style={{ fontSize: 10, color: "#666" }}>bien calibré</div>
        </div>
        <div style={{ background: "var(--bg3)", borderRadius: 8, padding: 10, textAlign: "center" }}>
          <div className="bebas" style={{ fontSize: 28, color: summary.dur > 1 ? "var(--red)" : "#888" }}>{summary.dur}</div>
          <div style={{ fontSize: 10, color: "#666" }}>trop dur</div>
        </div>
      </div>
      {summary.dur >= 2 && (
        <div style={{ background: "var(--red)11", border: "1px solid var(--red)33", borderRadius: 8, padding: 10, fontSize: 12, color: "#ff9a9a", marginBottom: 12 }}>
          ⚠️ 2 séances difficiles cette semaine — ton coach a été alerté. Récupère bien ce soir.
        </div>
      )}
      <div style={{ background: "var(--bg3)", borderRadius: 8, padding: 12 }}>
        <div style={{ fontSize: 11, color: "var(--green)", fontWeight: 700, textTransform: "uppercase", marginBottom: 8 }}>Semaine {week + 1} — au programme</div>
        {nextTypes.map((t, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--yellow)", flexShrink: 0 }} />
            <span style={{ fontSize: 12, color: "#ccc" }}>{t}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}

// ============================================================
// APP ATHLÈTE
// ============================================================
function AthleteApp({ profile, user, onUpdateProfile, onLogout }) {
  const [tab, setTab] = useState("home");
  const [tabDir, setTabDir] = useState(1); // 1=droite, -1=gauche

  // ── PWA Install prompt
  const [installPrompt, setInstallPrompt] = useState(null);
  const [showInstallBanner, setShowInstallBanner] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Détecter si déjà installée
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setIsInstalled(true);
      return;
    }
    // Capturer le prompt d'installation Chrome/Android
    const handler = (e) => {
      e.preventDefault();
      setInstallPrompt(e);
      // Afficher le banner après 3s si pas encore installé
      setTimeout(() => setShowInstallBanner(true), 3000);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  async function triggerInstall() {
    if (!installPrompt) return;
    installPrompt.prompt();
    const { outcome } = await installPrompt.userChoice;
    if (outcome === "accepted") { setIsInstalled(true); setShowInstallBanner(false); }
    setInstallPrompt(null);
  }

  // ── Notifications push locales
  const [notifGranted, setNotifGranted] = useState(Notification?.permission === "granted");

  async function requestNotifPermission() {
    if (!("Notification" in window)) return;
    const perm = await Notification.requestPermission();
    setNotifGranted(perm === "granted");
    if (perm === "granted") scheduleLocalNotifications();
  }

  function scheduleLocalNotifications() {
    if (!("serviceWorker" in navigator)) return;
    navigator.serviceWorker.ready.then(reg => {
      // Notification séance — 8h00 le lendemain
      const now = new Date();
      const tomorrow8h = new Date(now);
      tomorrow8h.setDate(tomorrow8h.getDate() + 1);
      tomorrow8h.setHours(8, 0, 0, 0);
      const delay8h = tomorrow8h - now;
      reg.active?.postMessage({ type: "SCHEDULE_NOTIF", delay: delay8h,
        title: "💪 FitRace — Séance du jour",
        body: `${profile.name}, ta séance est prête. Lance-toi !`,
        url: "/?tab=today"
      });
      // Notification nutrition — 12h30
      const midi = new Date(now);
      midi.setHours(now.getHours() >= 12 ? 24 + 12 : 12, 30, 0, 0);
      if (now.getHours() >= 12) midi.setDate(midi.getDate() + 1);
      const delayMidi = midi - now;
      reg.active?.postMessage({ type: "SCHEDULE_NOTIF", delay: delayMidi,
        title: "🥗 FitRace — Journal nutrition",
        body: "As-tu pensé à enregistrer ton repas de midi ?",
        url: "/?tab=nutri"
      });
    });
  }
  const TAB_ORDER = ["home","today","progress","race","planning","technique","profil","zones"];
  const navigateTo = (newTab) => {
    const cur = TAB_ORDER.indexOf(tab); const nxt = TAB_ORDER.indexOf(newTab);
    setTabDir(nxt >= cur ? 1 : -1);
    setTab(newTab);
  };
  const [dailyData, setDailyData] = useState({ fatigue: 3, sommeil: 3, temps: 60, materiel: "tout", typeSeance: "auto" });
  const [showSeancePerso, setShowSeancePerso] = useState(false);
  const [seancePerso, setSeancePerso] = useState({ titre: "", exercices: [{ nom: "", detail: "", note: "" }] });
  const [session, setSession] = useState(null);
  const [loadingSession, setLoadingSession] = useState(false);
  const [checkedExercices, setCheckedExercices] = useState({});
  const [showFeedback, setShowFeedback] = useState(false);
  const [loadingFeedback, setLoadingFeedback] = useState(false);
  const [feedbackData, setFeedbackData] = useState({
    ressenti: "bien",
    difficulte: 5,
    exercicesLog: [],       // [{nom, charge, reps, sets, ressenti}]
    charges: "",
    temps: "",
    douleurs: "",
    energie: 3,
    notes: "",
  });
  const [feedback, setFeedback] = useState(null);
  const [coachSession, setCoachSession] = useState(null);
  const [chronoMode, setChronoMode] = useState(false);
  const [chronoSeconds, setChronoSeconds] = useState(0);
  const [chronoRunning, setChronoRunning] = useState(false);
  const [currentExIdx, setCurrentExIdx] = useState(0);
  const [reposMode, setReposMode] = useState(false);       // true = timer de repos actif
  const [reposSeconds, setReposSeconds] = useState(0);     // durée repos choisie
  const [reposCountdown, setReposCountdown] = useState(0); // compte à rebours
  const [reposRunning, setReposRunning] = useState(false);
  const [lapTimes, setLapTimes] = useState([]);            // historique des laps
  const [showShareCard, setShowShareCard] = useState(false);
  const [videoModal, setVideoModal] = useState(null);
  const [planningWeek, setPlanningWeek] = useState(null);
  const [loadingPlanning, setLoadingPlanning] = useState(false);
  const [streak, setStreak] = useState(0);
  const [streakData, setStreakData] = useState(null);
  const [messageIA, setMessageIA] = useState(null);
  const [loadingMessage, setLoadingMessage] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [sessionStreamText, setSessionStreamText] = useState("");
  const [feedbackStreamText, setFeedbackStreamText] = useState("");
  const [showCoachChat, setShowCoachChat] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);

  const days = daysUntil(profile.raceDate);

  // Charger la séance coach du jour
  useEffect(() => {
    storage.get("coach_session_today").then(s => {
      if (s && s.date === new Date().toISOString().split("T")[0]) setCoachSession(s);
    });
  }, []);

  // Chrono séance
  useEffect(() => {
    let interval;
    if (chronoRunning) interval = setInterval(() => setChronoSeconds(s => s + 1), 1000);
    return () => clearInterval(interval);
  }, [chronoRunning]);

  // Timer de repos (compte à rebours)
  useEffect(() => {
    let interval;
    if (reposRunning && reposCountdown > 0) {
      interval = setInterval(() => {
        setReposCountdown(c => {
          if (c <= 1) {
            setReposRunning(false);
            setReposMode(false);
            // Vibration si disponible
            if (navigator.vibrate) navigator.vibrate([200, 100, 200]);
            return 0;
          }
          return c - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [reposRunning, reposCountdown]);

  // Rappels intelligents — vérifier au chargement
  useEffect(() => {
    checkNotifications();
  }, []);

  async function checkNotifications() {
    const sessions = profile.sessions || [];
    const days = daysUntil(profile.raceDate);
    const notifKey = `notif_${new Date().toISOString().split("T")[0]}`;
    const alreadySent = await storage.get(notifKey).catch(() => null);
    if (alreadySent) return;

    const notifs = [];
    // Pas de séance depuis 2 jours
    if (sessions.length > 0) {
      const last = new Date(sessions[sessions.length - 1].date);
      const diffDays = Math.floor((new Date() - last) / (1000 * 60 * 60 * 24));
      if (diffDays >= 2) notifs.push({ type: "rappel", msg: `Ça fait ${diffDays} jours sans séance — ta Zone 2 t'attend !`, color: "var(--yellow)" });
    }
    // J-7 avant la course
    if (days !== null && days <= 7 && days > 0) notifs.push({ type: "course", msg: `J-${days} avant ta course HYROX ! Vérifie ta stratégie.`, color: "var(--red)" });
    // Record battu (progression charges)
    const progression = buildProgressionData(profile);
    const sqPct = getProgressionPct(progression.squat);
    if (sqPct && sqPct >= 20) notifs.push({ type: "record", msg: `Record ! Squat +${sqPct}% depuis le début. Continue comme ça !`, color: "var(--green)" });

    if (notifs.length > 0) {
      await storage.set(notifKey, JSON.stringify({ notifs, sent: true }));
      // Stocker pour affichage dans l'app
      await storage.set("pending_notifs", JSON.stringify(notifs));
    }
  }

  // ─── STREAK ─────────────────────────────────────────────────
  useEffect(() => { calcStreak(); }, []);

  async function calcStreak() {
    const sessions = profile.sessions || [];
    if (sessions.length === 0) { setStreak(0); setStreakData({ current: 0, best: 0, lastDays: [] }); return; }

    const today = new Date(); today.setHours(0,0,0,0);
    const sessionDays = [...new Set(sessions.map(s => {
      const d = new Date(s.date); d.setHours(0,0,0,0); return d.getTime();
    }))].sort((a,b) => b-a);

    let current = 0;
    let cursor = today.getTime();
    for (const day of sessionDays) {
      const diff = Math.round((cursor - day) / (1000*60*60*24));
      if (diff <= 1) { current++; cursor = day - 86400000; }
      else break;
    }

    // Meilleur streak historique
    let best = 0; let tmp = 1;
    for (let i = 1; i < sessionDays.length; i++) {
      const diff = Math.round((sessionDays[i-1] - sessionDays[i]) / (1000*60*60*24));
      if (diff === 1) { tmp++; best = Math.max(best, tmp); }
      else tmp = 1;
    }
    best = Math.max(best, current);

    // 7 derniers jours
    const lastDays = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(today); d.setDate(d.getDate() - (6-i));
      const t = d.getTime();
      return { date: d, done: sessionDays.includes(t), isToday: i === 6 };
    });

    setStreak(current);
    setStreakData({ current, best, lastDays });

    // Sauvegarder le streak dans le profil si changé
    if (current !== profile.streak) {
      const updated = { ...profile, streak: current, bestStreak: Math.max(profile.bestStreak || 0, current) };
      await storage.set(`athlete_${profile.name}`, updated);
      onUpdateProfile(updated);
    }
  }

  // ─── MESSAGE IA QUOTIDIEN ────────────────────────────────────
  useEffect(() => { loadOrGenerateMessage(); }, []);

  async function loadOrGenerateMessage() {
    const today = new Date().toISOString().split("T")[0];
    const msgKey = `msg_ia_${profile.name}_${today}`;
    const cached = await storage.get(msgKey).catch(() => null);
    if (cached) { setMessageIA(cached); return; }
    await generateMessageIA(msgKey);
  }

  async function generateMessageIA(msgKey) {
    setLoadingMessage(true);
    const sessions = profile.sessions || [];
    const lastSess = sessions.slice(-1)[0];
    const lastAdapt = (profile.adaptations || []).slice(-1)[0];
    const score = calcFitnessScore(profile);
    const streakVal = profile.streak || 0;
    const days = daysUntil(profile.raceDate);
    const hour = new Date().getHours();
    const moment = hour < 11 ? "matin" : hour < 14 ? "midi" : hour < 18 ? "après-midi" : "soir";

    const raw = await callClaude(
      "Tu es le coach IA personnel de cet athlète HYROX. Tu parles directement à l'athlète, de façon chaleureuse, motivante et précise. Tu utilises son prénom. Maximum 3 phrases courtes. Pas de markdown, pas de listes.",
      `Écris le message d'encouragement du ${moment} pour ${profile.name}.

Contexte:
- Niveau HYROX ${profile.level}/4 | VMA ${profile.vmaKmh || "?"}km/h | Squat ${profile.squat1RM_final || "?"}kg
- Streak actuel: ${streakVal} jour${streakVal > 1 ? "s" : ""} consécutif${streakVal > 1 ? "s" : ""}
- Score condition: ${score.global}% (Force ${score.force}% | Endurance ${score.endurance}%)
- Dernière séance: ${lastSess ? `"${lastSess.titre}" — ressenti: ${lastSess.ressenti}` : "aucune encore"}
- Prochaine adaptation prévue: ${lastAdapt?.adaptation || "aucune"}
- Jours avant la course: ${days !== null ? days : "non défini"}
- Nombre de séances total: ${sessions.length}

Génère UN message court (2-3 phrases max) qui:
1. Mentionne quelque chose de PRÉCIS sur sa progression (charge, VMA, streak...)
2. Donne UN conseil concret pour aujourd'hui
3. Se termine par une phrase motivante courte liée à HYROX`
    );

    const msg = { text: raw || `Prêt pour une nouvelle séance, ${profile.name} ? Continue sur ta lancée !`, date: new Date().toISOString().split("T")[0] };
    setMessageIA(msg);
    await storage.set(msgKey, msg);
    setLoadingMessage(false);
  }

  async function sendChatMessage() {
    if (!chatInput.trim() || chatLoading) return;
    const userMsg = { role: "user", content: chatInput.trim() };
    const newMessages = [...chatMessages, userMsg];
    setChatMessages(newMessages);
    setChatInput("");
    setChatLoading(true);

    const score = calcFitnessScore(profile);
    const lastSess = (profile.sessions || []).slice(-1)[0];
    const days = daysUntil(profile.raceDate);

    const systemPrompt = `Tu es le Coach IA personnel de ${profile.name}, athlète HYROX. Tu parles directement à l'athlète en français, avec bienveillance et expertise.

PROFIL COMPLET:
- ${profile.name}, ${profile.age} ans, ${profile.poids}kg, ${profile.sexe}
- Niveau HYROX: ${profile.level}/4 | VMA: ${profile.vmaKmh || "?"}km/h
- Squat 1RM: ${profile.squat1RM_final || "?"}kg | Deadlift: ${profile.deadlift1RM_final || "?"}kg
- Score condition: ${score.global}% (Force ${score.force}% | Endurance ${score.endurance}%)
- Objectif: ${profile.objectifPrincipal || "HYROX"} ${profile.hyroxCategorie || ""}
- Jours avant la course: ${days !== null ? days : "non défini"}
- Séances réalisées: ${(profile.sessions || []).length}
- Dernière séance: ${lastSess ? `"${lastSess.titre}" — RPE ${lastSess.difficulte}/10, ressenti: ${lastSess.ressenti}` : "aucune"}
- Streak: ${profile.streak || 0} jours

DOMAINES D'EXPERTISE: HYROX, running, force fonctionnelle, nutrition sportive, récupération, planification, technique des stations (SkiErg, Rowing, Wall Balls, Sled Push/Pull, Burpee Broad Jump, Farmers Carry, Sandbag Lunges).

Réponds de façon conversationnelle, précise et personnalisée. Utilise le prénom de l'athlète. Sois concret et actionnable.`;

    const historyForAPI = newMessages.map(m => ({ role: m.role, content: m.content }));

    // Add streaming response
    const assistantMsgIdx = newMessages.length;
    setChatMessages(prev => [...prev, { role: "assistant", content: "" }]);

    const result = await callClaudeStream(
      systemPrompt,
      // Build conversation history as context in user message
      historyForAPI.length > 1
        ? `[Historique de notre conversation]\n${historyForAPI.slice(0, -1).map(m => `${m.role === "user" ? "Athlète" : "Coach"}: ${m.content}`).join("\n")}\n\n[Nouvelle question]\n${userMsg.content}`
        : userMsg.content,
      800,
      (chunk) => {
        setChatMessages(prev => {
          const updated = [...prev];
          updated[assistantMsgIdx] = { role: "assistant", content: chunk };
          return updated;
        });
      }
    );

    setChatMessages(prev => {
      const updated = [...prev];
      updated[assistantMsgIdx] = { role: "assistant", content: result.startsWith("__ERROR__") ? "Désolé, une erreur est survenue. Réessaie." : result };
      return updated;
    });
    setChatLoading(false);
  }

  function formatChrono(secs) {
    const m = Math.floor(secs / 60).toString().padStart(2, "0");
    const s = (secs % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  }

  // Dernière adaptation pour influencer la prochaine séance
  const lastAdaptation = (profile.adaptations || []).slice(-1)[0];
  const lastSession = (profile.sessions || []).slice(-1)[0];

  async function generateSession() {
    setLoadingSession(true);
    const week = profile.week || 1;
    const totalWeeksP = totalWeeksFromDate(profile.raceDate);
    const phase = getPhase(week, totalWeeksP);
    const fitnessScore = calcFitnessScore(profile);

    // ─── MÉMOIRE COMPLÈTE DE L'ATHLÈTE ───────────────────────────────
    const allSessions = profile.sessions || [];
    const allAdaptations = profile.adaptations || [];
    const nbSessions = allSessions.length;

    // Résumé des 5 dernières séances
    const recentSessionsText = allSessions.slice(-5).map((s, i) => {
      const num = allSessions.length - Math.min(5, allSessions.length) + i + 1;
      return `  S${num}: "${s.titre}" | ressenti: ${s.ressenti} | ${s.performances ? `perfs: ${s.performances}` : "performances non saisies"} | ${new Date(s.date).toLocaleDateString("fr-FR")}`;
    }).join("\n");

    // Toutes les adaptations IA depuis le début
    const allAdaptationsText = allAdaptations.map((a, i) =>
      `  Adapt.${i + 1} (${new Date(a.date).toLocaleDateString("fr-FR")}): ${a.adaptation}`
    ).join("\n");

    // Détection de patterns automatique
    const dernierRessentis = allSessions.slice(-3).map(s => s.ressenti);
    const pattern = dernierRessentis.length === 0 ? "première séance"
      : dernierRessentis.every(r => r === "facile") ? "STAGNATION — séances trop faciles, augmenter intensité"
      : dernierRessentis.every(r => r === "dur") ? "SURCHARGE — séances trop dures, réduire le volume"
      : dernierRessentis.filter(r => r === "bien").length >= 2 ? "PROGRESSION STABLE — continuer à progresser"
      : "VARIABLE — adapter au cas par cas";

    const adaptationContext = nbSessions === 0
      ? "PREMIÈRE SÉANCE — pas d'historique, calibrer sur le profil de base."
      : `HISTORIQUE COMPLET (${nbSessions} séances réalisées):

DERNIÈRES SÉANCES:
${recentSessionsText}

TOUTES LES ADAPTATIONS IA DÉCIDÉES DEPUIS LE DÉBUT:
${allAdaptationsText || "  Aucune encore"}

PATTERN DÉTECTÉ sur les 3 derniers ressentis (${dernierRessentis.join(", ") || "—"}): ${pattern}

ADAPTATION À APPLIQUER OBLIGATOIREMENT AUJOURD'HUI: ${allAdaptations.slice(-1)[0]?.adaptation || "Aucune — calibrer sur profil de base"}`;
    // ─────────────────────────────────────────────────────────────────

    // Déterminer le type de séance à faire selon la semaine
    // Structure HYROX validée : 3 running + 2 force/stations par semaine
    // Phase 1 (S1-S3) : base aérobie + technique stations
    // Phase 2 (S4-S6) : volume running + compromised running + intensité stations
    // Phase 3 (S7) : simulation complète + pic de forme
    // Phase 4 (S8) : affûtage -40% volume, garder intensité
    // Type de séance : choix athlète ou rotation automatique IA
    const sessionTypes = ["running_zone2", "force_stations", "running_qualite", "hybride_compromis", "force_stations"];
    const sessionType = dailyData.typeSeance && dailyData.typeSeance !== "auto"
      ? dailyData.typeSeance
      : sessionTypes[nbSessions % 5];
    const choixManuel = dailyData.typeSeance && dailyData.typeSeance !== "auto";

    const sessionTypeDescriptions = {
      running_zone2: `SESSION RUNNING ZONE 2 + TECHNIQUE STATIONS
- Objectif: construire le moteur aérobie (60-70% FCmax, allure conversationnelle)
- Structure: 25-40min Zone 2 continu + 10-15min technique une station HYROX (forme, pas intensité)
- Allure Zone 2 basée sur VMA: ${profile.vmaKmh ? paceFromVMA(profile.vmaKmh, 65) : "?"}/km
- Station technique du jour: choisir parmi SkiErg, Rowing, Wall Balls (charges légères, focus mécanique)
- NE PAS dépasser Zone 2 sur le running — c'est intentionnellement facile`,

      force_stations: `SESSION FORCE TRANSFERT + BRICK RUN COURT
- Objectif: force spécifique aux stations HYROX (force répétable sous fatigue, pas 1RM)
- Structure validée: 
  * Sled Push: 4x20m progressifs
  * Sled Pull: 4x20m
  * Romanian Deadlift ou Trap Bar: 4x6-8 @ 70-75% 1RM (Deadlift 1RM: ${profile.deadlift1RM_final || "?"}kg → charge: ${profile.deadlift1RM_final ? Math.round(profile.deadlift1RM_final * 0.72) : "?"}kg)
  * Goblet/Front Squat: 3x10 @ charge modérée
  * Farmer Carry: 3x40m (KB lourdes)
  * Brick run facile: 800m-1km après la séance de force (RPE 6) pour apprendre à retrouver les jambes
- Charges: Force HYROX = force RÉPÉTABLE, pas maximale`,

      running_qualite: `SESSION RUNNING QUALITÉ (TEMPO/INTERVALLES)
- Objectif: améliorer le seuil et VO2max — séance de performance
- ${phase === "base" ? `TEMPO: 3x8min à allure seuil (${profile.vmaKmh ? paceFromVMA(profile.vmaKmh, 83) : "??"}/km) récup 3min marche` : ""}
- ${phase === "développement" || phase === "pic" ? `INTERVALLES 1KM: 4-6x1km au rythme de course (${profile.vmaKmh ? paceFromVMA(profile.vmaKmh, 88) : "??"}/km) récup 2min` : ""}
- ${phase === "affûtage" ? `INTERVALLES COURTS: 6x400m vifs + récup — volume réduit mais intensité maintenue` : ""}
- Protocole scientifique: 4x4min à 90-95% FCmax = amélioration VO2max 3x supérieure au steady-state
- Échauffement 10min OBLIGATOIRE, retour au calme 10min`,

      hybride_compromis: `SESSION HYBRIDE — COMPROMISED RUNNING (compétence clé HYROX)
- Objectif: apprendre à courir après un effort musculaire intense = LA compétence HYROX
- Structure: enchaînements station → run → station → run (simulation partielle)
- ${phase === "base" ? "Format débutant: 3 rounds de (1 station @ charges légères + 500m run récup)" : ""}
- ${phase === "développement" ? "Format intermédiaire: 4-5 rounds de (1-2 stations + 1km au rythme de course)" : ""}
- ${phase === "pic" ? "Simulation: 6-8 rounds (run 1km + station complète) — simulation quasi-complète" : ""}
- ${phase === "affûtage" ? "Simulation courte: 3-4 rounds légers — rappel musculaire, pas d'épuisement" : ""}
- Stations prioritaires: Wall Balls, Burpee Broad Jump, Farmers Carry, Sandbag Lunges
- Wall Balls: ${profile.squat1RM_final ? `utiliser ${Math.round(profile.squat1RM_final * 0.05)}kg (5% 1RM squat comme guide)` : "charge légère en phase base"}`,
    };

    const lastAdapt = allAdaptations.slice(-1)[0]?.adaptation || "";
    const lastSessions3 = allSessions.slice(-3).map(s => `${s.titre}(RPE:${s.difficulte||"?"},${s.ressenti})`).join(" | ");
    const poidsComp = getPoidsHyrox(profile);

    setSessionStreamText("🤖 Coach IA analyse ton profil...");
    const raw = await callClaudeStream(
      "Coach HYROX expert. Réponds UNIQUEMENT en JSON valide, sans texte autour, sans backticks.",
      `Génère une séance ${sessionType} en JSON pour: ${profile.name}, ${profile.poids}kg, Niv.${profile.level}, VMA ${profile.vmaKmh||"?"}km/h, Squat ${profile.squat1RM_final||"?"}kg, Fatigue ${dailyData.fatigue}/4, ${dailyData.temps}min, phase ${phase}.
${adaptationContext}
TYPE DE SÉANCE À GÉNÉRER:
${sessionTypeDescriptions[sessionType] || "Séance générale HYROX"}
Retourne UNIQUEMENT ce JSON complété (4-5 exercices avec charges précises):
{"titre":"","type":"${sessionType}","duree":${dailyData.temps},"explication":"","echauffement":"","exercices":[{"nom":"","detail":"","rpe":"","note":""}],"retourCalme":"","nutrition":{"avant":"","apres":""},"metrique":""}`,
      1400,
      (chunk) => {
        // Extraire le titre en cours de streaming pour affichage
        const titreMatch = chunk.match(/"titre"\s*:\s*"([^"]{3,})"/);
        if (titreMatch) setSessionStreamText(`📋 ${titreMatch[1]}...`);
        else if (chunk.length > 50) setSessionStreamText("🤖 Génération en cours...");
      }
    );

    try {
      if (!raw || raw.startsWith("__ERROR__")) {
        throw new Error(raw ? raw.replace("__ERROR__", "") : "Pas de réponse de l'API");
      }
      // Nettoyer la réponse — extraire le JSON même s'il y a du texte autour
      const cleaned = raw.replace(/```json|```/g, "").trim();
      const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error("Pas de JSON valide dans la réponse");
      const parsed = JSON.parse(jsonMatch[0]);
      if (!parsed.titre) throw new Error("JSON incomplet");
      setSession(parsed);
      setFeedback(null); setShowFeedback(false);
      setCheckedExercices({});
    } catch (e) {
      console.error("Erreur parse séance:", e.message, "Raw:", raw?.slice(0, 500));
      setSession({
        titre: "Erreur — Réessaie",
        explication: e.message || "Erreur inconnue. Réessaie.",
        exercices: [],
        type: "erreur",
      });
    }
    setSessionStreamText("");
    setLoadingSession(false);
  }

  async function submitFeedback() {
    setLoadingFeedback(true);

    const allSessionsFb = profile.sessions || [];
    const allAdaptationsFb = profile.adaptations || [];
    const nbSessions = allSessionsFb.length;
    const sessionTypes = ["running_zone2", "force_stations", "running_qualite", "hybride_compromis", "force_stations"];
    const nextSessionType = sessionTypes[(nbSessions + 1) % 5];
    const nextSessionLabels = {
      running_zone2: "Running Zone 2 + technique station",
      force_stations: "Force transfert stations + brick run",
      running_qualite: "Running qualité (tempo/intervalles)",
      hybride_compromis: "Hybride compromised running",
    };

    // Historique complet enrichi
    const historyFb = allSessionsFb.slice(-8).map((s, i) => {
      const num = allSessionsFb.length - Math.min(8, allSessionsFb.length) + i + 1;
      return `  S${num}: "${s.titre}" | RPE:${s.difficulte || "?"}/10 | ${s.ressenti} | énergie:${s.energie || "?"}/5 | douleurs:${s.douleurs || "aucune"} | charges: ${s.charges || "?"}`;
    }).join("\n");

    const adaptsFb = allAdaptationsFb.map((a, i) =>
      `  A${i + 1} (${new Date(a.date).toLocaleDateString("fr-FR")}): ${a.adaptation}`
    ).join("\n");

    // Détection gravité douleur
    const douloursGraves = ["blessure", "douleur aiguë", "claquage", "entorse", "tendon", "genou droit", "dos bas"].some(
      kw => (feedbackData.douleurs || "").toLowerCase().includes(kw)
    );
    const rpeExcessif = feedbackData.difficulte >= 9 && feedbackData.energie <= 2;
    const deuxFoisDur = allSessionsFb.slice(-2).every(s => s.ressenti === "dur");

    setFeedbackStreamText("🔍 Analyse de tes performances...");
    const raw = await callClaudeStream(
      `Tu es un coach HYROX expert et bienveillant. Tu analyses PRÉCISÉMENT chaque donnée du feedback pour individualiser le programme.
Tu connais la science de l'entraînement : surcompensation, fenêtre anabolique, RPE, périodisation.
Tu détectes les signaux d'alarme : surmenage, blessure, stagnation, régression.
RÈGLE ABSOLUE : Sois PRÉCIS ET CHIFFRÉ dans tes adaptations. "Squat passe de 82kg à 87kg" pas "augmenter les charges".
Réponds UNIQUEMENT en JSON valide sans backticks.`,
      `═══════════════════════════════════════
BILAN COMPLET POST-SÉANCE
${profile.name} | ${profile.sexe || "H"} | ${profile.poids}kg | Niv.${profile.level}/4 | Obj: ${profile.objectifPrincipal || "hyrox"} ${profile.hyroxCategorie || ""}
═══════════════════════════════════════

SÉANCE TERMINÉE: "${session?.titre}" (${session?.type === "perso" ? "SÉANCE PERSO créée par l'athlète" : session?.type || "général"})
Prévu: ${session?.duree || "?"}min | Réel: ${feedbackData.temps || "non renseigné"}

── INDICATEURS CLÉS ──
Ressenti: ${feedbackData.ressenti === "facile" ? "TROP FACILE" : feedbackData.ressenti === "bien" ? "BIEN CALIBRÉ" : "TROP DUR"}
RPE: ${feedbackData.difficulte}/10 ${feedbackData.difficulte >= 9 ? "(⚠️ TRÈS ÉLEVÉ)" : feedbackData.difficulte <= 3 ? "(très facile)" : ""}
Énergie post-séance: ${feedbackData.energie}/5 ${feedbackData.energie <= 1 ? "(⚠️ À PLAT)" : ""}
Douleurs: ${feedbackData.douleurs || "aucune"} ${douloursGraves ? "(⚠️ POTENTIELLEMENT GRAVE)" : ""}

── PERFORMANCES EXERCICE PAR EXERCICE ──
${feedbackData.exercicesLog ? feedbackData.exercicesLog.map(e => `${e.nom}: ${e.charge || "-"}kg × ${e.reps || "-"} reps | ${e.sets || "-"} sets | ressenti: ${e.ressenti || "/"}`).join("\n") : ""}
Photo/montre analysée: ${feedbackData._photoAnalyse || "aucune photo"}
Données extraites photo: ${feedbackData.charges || "aucune"}

── NOTES LIBRES ──
${feedbackData.notes || "aucune"}

── HISTORIQUE 8 DERNIÈRES SÉANCES ──
${historyFb || "  Première séance"}

── TOUTES LES ADAPTATIONS IA DEPUIS LE DÉBUT ──
${adaptsFb || "  Aucune encore"}

── DONNÉES PHYSIQUES DE RÉFÉRENCE ──
VMA: ${profile.vmaKmh || "?"}km/h | Squat 1RM: ${profile.squat1RM_final || "?"}kg | Deadlift 1RM: ${profile.deadlift1RM_final || "?"}kg
Catégorie: ${getPoidsHyrox(profile).categorie}
Poids compétition: Sled Push ${getPoidsHyrox(profile).sled_push} | Sled Pull ${getPoidsHyrox(profile).sled_pull} | Farmers ${getPoidsHyrox(profile).farmers_carry} | Wall Balls ${getPoidsHyrox(profile).wall_balls}
Force: ${calcFitnessScore(profile).force}% | Endurance: ${calcFitnessScore(profile).endurance}% | Puissance: ${calcFitnessScore(profile).puissance}%

── ALERTES DÉTECTÉES ──
${douloursGraves ? "⚠️ DOULEUR POTENTIELLEMENT GRAVE signalée" : ""}
${rpeExcessif ? "⚠️ RPE très élevé + énergie très basse = risque de surmenage" : ""}
${deuxFoisDur ? "⚠️ 2 séances consécutives jugées trop dures" : ""}
${!douloursGraves && !rpeExcessif && !deuxFoisDur ? "Aucune alerte particulière" : ""}

── PROCHAINE SÉANCE PRÉVUE ──
Type: ${nextSessionLabels[nextSessionType]}

═══ RÈGLES STRICTES D'ADAPTATION ═══
1. Analyse CHAQUE exercice renseigné pour détecter ce qui progresse, stagne ou régresse
2. Si RPE <= 5 ou ressenti "facile" → augmenter la charge ou le volume (pas les deux)
3. Si RPE >= 8 ou ressenti "dur" → réduire le volume 20% (pas les charges), surveiller la récupération
4. Si douleur signalée → OBLIGATOIREMENT recommander repos de la zone + alerte coach si grave
5. Adaptation PRÉCISE et CHIFFRÉE par exercice clé
6. La séance suivante doit être GÉNÉRÉE complète avec les nouvelles charges
7. Cohérence absolue avec l'historique des adaptations

JSON:
{
  "analyse": "Analyse détaillée 3-4 phrases: ce que les données révèlent, les points forts, les signaux d'alerte",
  "progressions": [{"exercice":"","avant":"","apres":"","raison":""}],
  "adaptation": "Description complète et chiffrée de la prochaine séance avec TOUTES les charges adaptées",
  "prochaine_seance": {
    "titre": "",
    "type": "${nextSessionType}",
    "exercices": [{"nom":"","detail":"sets x reps @ charge précise","note":""}],
    "conseil": ""
  },
  "signaux_alarme": [],
  "alerteCoach": ${douloursGraves || rpeExcessif || deuxFoisDur ? "true" : "false"},
  "niveauAlerte": "${douloursGraves ? "blessure" : rpeExcessif || deuxFoisDur ? "surmenage" : "info"}",
  "raisonAlerte": ""
}`,
      2000,
      (chunk) => {
        // Extraire des infos de l'analyse en cours pour afficher à l'athlète
        const analyseMatch = chunk.match(/"analyse"\s*:\s*"([^"]{20,})/);
        if (analyseMatch) setFeedbackStreamText(`📊 ${analyseMatch[1].slice(0, 60)}...`);
        else if (chunk.includes('"progressions"')) setFeedbackStreamText("📈 Détection des progressions...");
        else if (chunk.includes('"adaptation"')) setFeedbackStreamText("⚡ Calcul de la prochaine séance...");
        else if (chunk.length > 100) setFeedbackStreamText("🤖 Coach IA analyse ta séance...");
      }
    );

    try {
      const fbCleaned = raw?.replace(/```json|```/g, "").trim() || "{}";
      const fbMatch = fbCleaned.match(/\{[\s\S]*\}/);
      const adapt = JSON.parse(fbMatch ? fbMatch[0] : "{}");

      // Sauvegarder session complète
      const sessionData = {
        date: new Date().toISOString(),
        titre: session?.titre,
        type: session?.type || "général",
        ressenti: feedbackData.ressenti,
        difficulte: feedbackData.difficulte,
        exercicesLog: feedbackData.exercicesLog || [],
        charges: feedbackData.charges,
        photoAnalyse: feedbackData._photoAnalyse || null,
        tempsReel: feedbackData.temps,
        douleurs: feedbackData.douleurs,
        energie: feedbackData.energie,
        notes: feedbackData.notes,
        summary: `${session?.titre} — RPE ${feedbackData.difficulte}/10 — ${feedbackData.ressenti}`,
        // Sauvegarder aussi la prochaine séance générée
        prochaineSéance: adapt.prochaine_seance || null,
      };

      const newSessions = [...(profile.sessions || []), sessionData];
      const newAdaptations = [...(profile.adaptations || []), {
        ...adapt,
        date: new Date().toISOString(),
        adaptation: adapt.adaptation,
        progressions: adapt.progressions || [],
      }];

      // Alertes avec niveaux de gravité
      const newAlerts = adapt.alerteCoach
        ? [...(profile.alerts || []), {
            type: adapt.niveauAlerte || "info",
            athlete: profile.name,
            message: adapt.raisonAlerte || "Alerte post-séance",
            details: `RPE:${feedbackData.difficulte} | Douleurs:${feedbackData.douleurs} | Énergie:${feedbackData.energie}/5`,
            date: new Date().toISOString(),
            read: false,
            urgent: adapt.niveauAlerte === "blessure",
          }]
        : (profile.alerts || []);

      const updated = { ...profile, sessions: newSessions, adaptations: newAdaptations, alerts: newAlerts };
      const storageKey = (profile.email || user?.email) ? `athlete_email_${profile.email || user?.email}` : `athlete_${profile.name}`;
      await storage.set(storageKey, { ...updated, email: profile.email || user?.email });
      onUpdateProfile(updated);
      setTimeout(() => calcStreak(), 500);
      setFeedback(adapt);
      setShowFeedback(false);
    } catch (e) { console.error(e, raw); }
    setFeedbackStreamText("");
    setLoadingFeedback(false);
  }

  const tabs = [
    { id: "home", label: "Accueil", icon: "🏠" },
    { id: "today", label: "Séance", icon: "⚡", badge: coachSession && !session },
    { id: "progress", label: "Stats", icon: "📈" },
    { id: "planning", label: "Planning", icon: "📅", badge: !planningWeek && !loadingPlanning },
    { id: "profil", label: "Profil", icon: "👤" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", paddingBottom: 80 }}>
      <style>{GLOBAL_STYLES}</style>

      {/* ── PWA Install Banner ── */}
      {showInstallBanner && !isInstalled && (
        <div className="slide-up" style={{ position: "fixed", bottom: 90, left: 16, right: 16, zIndex: 500, maxWidth: 480, margin: "0 auto" }}>
          <div style={{ background: "linear-gradient(135deg, #131500 0%, #0a0a00 100%)", border: "1.5px solid rgba(232,255,71,0.35)", borderRadius: 18, padding: "14px 16px", display: "flex", alignItems: "center", gap: 12, boxShadow: "0 8px 32px rgba(0,0,0,0.6)" }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: "rgba(232,255,71,0.12)", border: "1px solid rgba(232,255,71,0.25)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>📲</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: "var(--white)", marginBottom: 2 }}>Installer FitRace</div>
              <div style={{ fontSize: 11, color: "#555", lineHeight: 1.4 }}>Accès rapide depuis ton écran d'accueil</div>
            </div>
            <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
              <button onClick={() => setShowInstallBanner(false)} style={{ background: "rgba(255,255,255,0.05)", border: "none", borderRadius: 8, padding: "7px 10px", color: "#444", fontSize: 12, cursor: "pointer" }}>Plus tard</button>
              <button onClick={triggerInstall} style={{ background: "var(--yellow)", border: "none", borderRadius: 8, padding: "7px 14px", color: "#000", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>Installer</button>
            </div>
          </div>
        </div>
      )}

      {/* Video Modal */}
      {videoModal && <VideoModal mouvement={videoModal} onClose={() => setVideoModal(null)} />}

      {/* Coach Chat Modal */}
      {showCoachChat && (
        <div style={{ position: "fixed", inset: 0, background: "#050505", zIndex: 300, display: "flex", flexDirection: "column" }}>
          <div style={{ flex: 1, display: "flex", flexDirection: "column", maxWidth: 520, margin: "0 auto", width: "100%", height: "100%" }}>
            {/* Header */}
            <div style={{ padding: "14px 20px 12px", borderBottom: "1px solid rgba(255,255,255,0.05)", background: "rgba(8,8,8,0.95)", backdropFilter: "blur(20px)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 40, height: 40, borderRadius: 12, background: "linear-gradient(135deg, rgba(232,255,71,0.2), rgba(57,255,128,0.1))", border: "1px solid rgba(232,255,71,0.3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>🤖</div>
                <div>
                  <div className="bebas" style={{ fontSize: 20, color: "var(--yellow)", letterSpacing: 1, lineHeight: 1 }}>COACH IA</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 5, marginTop: 2 }}>
                    <div style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--green)" }} />
                    <span style={{ fontSize: 11, color: "#555" }}>En ligne · Répond en temps réel</span>
                  </div>
                </div>
              </div>
              <button onClick={() => setShowCoachChat(false)} style={{ width: 34, height: 34, borderRadius: "50%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", color: "#666", cursor: "pointer", fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center" }}>✕</button>
            </div>

            {/* Messages */}
            <div style={{ flex: 1, overflowY: "auto", padding: "20px 16px", display: "flex", flexDirection: "column", gap: 10 }}>
              {chatMessages.length === 0 && (
                <div style={{ padding: "20px 0" }}>
                  {/* Bulle d'accueil du coach */}
                  <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
                    <div style={{ width: 34, height: 34, borderRadius: 10, background: "rgba(232,255,71,0.1)", border: "1px solid rgba(232,255,71,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0 }}>🤖</div>
                    <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "4px 16px 16px 16px", padding: "14px 16px", maxWidth: "85%" }}>
                      <div style={{ fontSize: 14, color: "#ccc", lineHeight: 1.7 }}>Salut <strong style={{ color: "var(--yellow)" }}>{profile.name}</strong> ! 👋 Je suis ton coach IA HYROX personnel. Connais ton profil, tes forces et tes objectifs. Pose-moi n'importe quelle question.</div>
                    </div>
                  </div>
                  {/* Questions suggérées — contextuelles selon le tab */}
                  <div style={{ fontSize: 10, color: "#333", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 10 }}>Suggestions</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                    {((() => {
                      const lastSession = (profile.sessions||[]).slice(-1)[0];
                      const byTab = {
                        today: [
                          `Quelle intensité pour ma séance aujourd'hui ? (fatigue actuelle: ${dailyData.fatigue}/4)`,
                          lastSession ? `Comment récupérer après ma séance "${lastSession.titre?.slice(0,30)}" ?` : "Comment s'échauffer efficacement pour HYROX ?",
                          "Combien de temps de repos entre les séries ?",
                          "Que faire si je ressens une douleur pendant la séance ?",
                        ],
                        race: [
                          `Comment optimiser mon objectif de course de ${profile.raceDate ? daysUntil(profile.raceDate) + " jours" : "?"} ?`,
                          "Quelle stratégie adopter pour le Sled Push en course ?",
                          "Comment gérer le running entre les stations ?",
                          "Que faire la semaine avant la course ?",
                        ],
                        nutri: [
                          `Quels macros pour mon poids de ${profile.poids || "?"}kg en phase d'entraînement intense ?`,
                          "Que manger 2h avant une séance de force HYROX ?",
                          "Comment optimiser ma récupération nutritionnelle ?",
                          "Quels suppléments sont utiles pour HYROX ?",
                        ],
                        planning: [
                          "Comment répartir mes séances dans la semaine ?",
                          `Avec ${profile.seancesParSemaine || 4} séances/semaine, quelle périodisation choisir ?`,
                          "Quand intégrer les sessions de mobilité ?",
                          "Comment adapter le planning si je suis fatigué ?",
                        ],
                        progress: [
                          profile.vmaKmh ? `Comment progresser au-delà de ma VMA de ${profile.vmaKmh}km/h ?` : "Comment calculer et améliorer ma VMA ?",
                          profile.squat1RM_final ? `Mon squat est à ${profile.squat1RM_final}kg, comment dépasser ce plateau ?` : "Comment progresser en force pour HYROX ?",
                          "Pourquoi mon RPE reste élevé même après 3 mois d'entraînement ?",
                          "Comment lire et interpréter mes stats de progression ?",
                        ],
                        technique: [
                          "Quelle est la technique optimale pour le Wall Ball ?",
                          "Comment améliorer ma cadence sur le SkiErg ?",
                          "Quelles erreurs éviter sur le Sandbag Lunge ?",
                          "Comment respirer pendant le Rowing ergomètre ?",
                        ],
                      };
                      return byTab[tab] || [
                        "Comment améliorer mon Sled Push ?",
                        `Comment progresser avec ma VMA de ${profile.vmaKmh || "?"}km/h ?`,
                        "Combien de jours de repos par semaine ?",
                        "Quelle est ta recommandation pour ce mois-ci ?",
                      ];
                    })()).map((q, i) => (
                      <button key={i} onClick={() => setChatInput(q)} style={{ background: "rgba(232,255,71,0.04)", border: "1px solid rgba(232,255,71,0.15)", borderRadius: 12, padding: "11px 14px", color: "#aaa", fontSize: 13, cursor: "pointer", textAlign: "left", display: "flex", alignItems: "center", gap: 10 }}>
                        <span style={{ fontSize: 14, flexShrink: 0 }}>💬</span>
                        <span>{q}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {chatMessages.map((msg, i) => (
                <div key={i} style={{ display: "flex", gap: 8, justifyContent: msg.role === "user" ? "flex-end" : "flex-start", alignItems: "flex-end" }}>
                  {msg.role === "assistant" && (
                    <div style={{ width: 28, height: 28, borderRadius: 8, background: "rgba(232,255,71,0.08)", border: "1px solid rgba(232,255,71,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, flexShrink: 0, marginBottom: 2 }}>🤖</div>
                  )}
                  <div style={{
                    maxWidth: "82%",
                    background: msg.role === "user"
                      ? "linear-gradient(135deg, #e8ff47, #b8cc00)"
                      : "rgba(255,255,255,0.04)",
                    color: msg.role === "user" ? "#000" : "#ddd",
                    borderRadius: msg.role === "user" ? "16px 16px 4px 16px" : "4px 16px 16px 16px",
                    padding: "11px 15px",
                    fontSize: 14,
                    lineHeight: 1.65,
                    border: msg.role === "assistant" ? "1px solid rgba(255,255,255,0.07)" : "none",
                    fontWeight: msg.role === "user" ? 600 : 400,
                  }}>
                    {msg.role === "assistant" && !msg.content ? (
                      <div style={{ display: "flex", gap: 5, alignItems: "center", padding: "2px 0" }}>
                        {[0,1,2].map(j => <div key={j} style={{ width: 7, height: 7, borderRadius: "50%", background: "var(--yellow)", animation: `pulse 1.2s ${j*0.2}s ease-in-out infinite` }} />)}
                      </div>
                    ) : msg.content}
                  </div>
                  {msg.role === "user" && (
                    <div style={{ width: 28, height: 28, borderRadius: 8, background: "linear-gradient(135deg, var(--yellow), #b8cc00)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: "#000", flexShrink: 0, marginBottom: 2 }}>
                      {profile.name[0].toUpperCase()}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Input */}
            <div style={{ padding: "12px 16px 20px", borderTop: "1px solid rgba(255,255,255,0.05)", background: "rgba(8,8,8,0.95)", display: "flex", gap: 10, alignItems: "flex-end" }}>
              <input
                value={chatInput}
                onChange={e => setChatInput(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendChatMessage(); } }}
                placeholder="Pose ta question..."
                style={{ flex: 1, background: "rgba(255,255,255,0.05)", border: "1.5px solid rgba(255,255,255,0.08)", borderRadius: 14, padding: "12px 16px", color: "var(--white)", fontSize: 14, outline: "none", fontFamily: "'DM Sans', sans-serif" }}
              />
              <button onClick={sendChatMessage} disabled={!chatInput.trim() || chatLoading} style={{
                width: 46, height: 46, borderRadius: 14, border: "none", flexShrink: 0,
                background: chatInput.trim() && !chatLoading ? "var(--yellow)" : "rgba(255,255,255,0.05)",
                color: chatInput.trim() && !chatLoading ? "#000" : "#333",
                fontSize: 20, cursor: chatInput.trim() && !chatLoading ? "pointer" : "default",
                transition: "all 0.2s", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700,
              }}>{chatLoading ? "…" : "↑"}</button>
            </div>
          </div>
        </div>
      )}

      {/* Chrono Mode — plein écran premium */}
      {chronoMode && session && (
        <div style={{ position: "fixed", inset: 0, background: "#050505", zIndex: 200, display: "flex", flexDirection: "column", fontFamily: "'DM Sans', sans-serif", overflow: "hidden" }}>

          {/* Header sticky */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 20px", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: chronoRunning ? "var(--green)" : "#444", boxShadow: chronoRunning ? "0 0 8px var(--green)" : "none" }} />
              <div className="bebas" style={{ fontSize: 15, color: "var(--yellow)", letterSpacing: 2 }}>MODE ENTRAÎNEMENT</div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ fontSize: 12, color: "#444", fontVariantNumeric: "tabular-nums" }}>
                {currentExIdx + 1}/{(session.exercices||[]).length}
              </div>
              <button onClick={() => { setChronoMode(false); setChronoRunning(false); setReposMode(false); setReposRunning(false); setLapTimes([]); }}
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid #1a1a1a", borderRadius: 8, padding: "6px 12px", color: "#555", fontSize: 12, cursor: "pointer" }}>✕ Quitter</button>
            </div>
          </div>

          {/* Progress bar séance */}
          <div style={{ height: 3, background: "#111" }}>
            <div style={{ height: "100%", background: "linear-gradient(90deg, var(--yellow), var(--green))", width: `${((currentExIdx) / Math.max((session.exercices||[]).length, 1)) * 100}%`, transition: "width 0.5s" }} />
          </div>

          {/* MODE REPOS */}
          {reposMode ? (
            <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "0 24px", background: reposCountdown <= 10 ? "radial-gradient(circle at 50% 40%, rgba(255,71,71,0.06) 0%, transparent 70%)" : "radial-gradient(circle at 50% 40%, rgba(57,255,128,0.06) 0%, transparent 70%)" }}>

              <div style={{ fontSize: 11, color: "#333", textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: 16 }}>Temps de repos</div>

              {/* Grand compteur repos */}
              <div style={{ position: "relative", marginBottom: 20 }}>
                {/* Anneau SVG */}
                {(() => {
                  const maxSec = 120;
                  const pct = Math.min(reposCountdown / maxSec, 1);
                  const r = 90; const circ = 2 * Math.PI * r;
                  const col = reposCountdown <= 10 ? "var(--red)" : "var(--green)";
                  return (
                    <svg width="220" height="220" viewBox="0 0 220 220">
                      <circle cx="110" cy="110" r={r} fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="8" />
                      <circle cx="110" cy="110" r={r} fill="none" stroke={col} strokeWidth="8" strokeLinecap="round"
                        strokeDasharray={circ} strokeDashoffset={circ - pct * circ}
                        transform="rotate(-90 110 110)" style={{ transition: "stroke-dashoffset 1s linear, stroke 0.5s" }} />
                      <text x="110" y="100" textAnchor="middle" fontFamily="'Bebas Neue',sans-serif" fontSize="72" fill={col} style={{ transition: "fill 0.5s" }}>
                        {reposCountdown > 0 ? reposCountdown : "GO"}
                      </text>
                      {reposCountdown > 0 && <text x="110" y="128" textAnchor="middle" fontFamily="'DM Sans',sans-serif" fontSize="14" fill="#333">secondes</text>}
                      {reposCountdown === 0 && <text x="110" y="136" textAnchor="middle" fontFamily="'Bebas Neue',sans-serif" fontSize="24" fill={col}>C'EST PARTI !</text>}
                    </svg>
                  );
                })()}
              </div>

              {/* Sélecteur durée repos */}
              <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
                {[30, 60, 90, 120, 180].map(sec => (
                  <button key={sec} onClick={() => { setReposCountdown(sec); setReposRunning(true); }} style={{
                    padding: "8px 12px", borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: "pointer",
                    background: reposCountdown === sec ? "rgba(57,255,128,0.1)" : "rgba(255,255,255,0.03)",
                    border: reposCountdown === sec ? "1.5px solid var(--green)" : "1px solid #1a1a1a",
                    color: reposCountdown === sec ? "var(--green)" : "#444",
                    transition: "all 0.2s",
                  }}>{sec < 60 ? sec + "s" : sec/60 + "min"}</button>
                ))}
              </div>

              <div style={{ display: "flex", gap: 10, width: "100%", maxWidth: 320 }}>
                <button onClick={() => setReposRunning(r => !r)} style={{
                  flex: 1, padding: "14px 0", borderRadius: 14, fontSize: 18, fontFamily: "'Bebas Neue',sans-serif", letterSpacing: 1, cursor: "pointer",
                  background: reposRunning ? "rgba(255,71,71,0.08)" : "rgba(57,255,128,0.08)",
                  border: reposRunning ? "1px solid rgba(255,71,71,0.4)" : "1px solid rgba(57,255,128,0.4)",
                  color: reposRunning ? "var(--red)" : "var(--green)",
                }}>{reposRunning ? "⏸ PAUSE" : "▶ REPRENDRE"}</button>
                <button onClick={() => { setReposMode(false); setReposRunning(false); }} style={{
                  flex: 1, padding: "14px 0", borderRadius: 14, fontSize: 18, fontFamily: "'Bebas Neue',sans-serif", letterSpacing: 1, cursor: "pointer",
                  background: "var(--yellow)", border: "none", color: "#000", fontWeight: 700,
                }}>PASSER →</button>
              </div>

              {/* Exercice suivant */}
              {(session.exercices||[])[currentExIdx + 1] && (
                <div style={{ marginTop: 20, background: "rgba(255,255,255,0.02)", border: "1px solid #181818", borderRadius: 12, padding: "12px 16px", width: "100%", maxWidth: 320 }}>
                  <div style={{ fontSize: 10, color: "#333", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 4 }}>Prochain exercice</div>
                  <div style={{ fontSize: 15, color: "#666", fontWeight: 600 }}>{(session.exercices||[])[currentExIdx + 1].nom}</div>
                  <div style={{ fontSize: 13, color: "#444" }}>{(session.exercices||[])[currentExIdx + 1].detail}</div>
                </div>
              )}
            </div>
          ) : (
            <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: "20px 20px 24px" }}>
              {/* Exercice en cours — hero */}
              {(session.exercices||[])[currentExIdx] && (
                <div style={{ background: "rgba(232,255,71,0.04)", border: "1.5px solid rgba(232,255,71,0.18)", borderRadius: 20, padding: "18px 20px", marginBottom: 12, position: "relative", overflow: "hidden" }}>
                  <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: "linear-gradient(90deg, var(--yellow), transparent)" }} />
                  <div style={{ fontSize: 10, color: "var(--yellow)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 8 }}>⚡ En cours</div>
                  <div className="bebas" style={{ fontSize: 28, color: "var(--white)", lineHeight: 1.1, marginBottom: 4 }}>{(session.exercices||[])[currentExIdx].nom}</div>
                  <div className="bebas" style={{ fontSize: 24, color: "var(--yellow)" }}>{(session.exercices||[])[currentExIdx].detail}</div>
                  {(session.exercices||[])[currentExIdx].note && (
                    <div style={{ fontSize: 12, color: "#444", marginTop: 8, borderTop: "1px solid rgba(255,255,255,0.04)", paddingTop: 8 }}>💬 {(session.exercices||[])[currentExIdx].note}</div>
                  )}
                </div>
              )}

              {/* Grand chrono central */}
              <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                <div className="bebas" style={{
                  fontSize: 88, color: chronoRunning ? "var(--white)" : "#333",
                  lineHeight: 1, letterSpacing: 4, fontVariantNumeric: "tabular-nums",
                  textShadow: chronoRunning ? "0 0 40px rgba(232,255,71,0.15)" : "none",
                  transition: "color 0.4s, text-shadow 0.4s",
                }}>
                  {formatChrono(chronoSeconds)}
                </div>

                {/* Laps inline */}
                {lapTimes.length > 0 && (
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap", justifyContent: "center", marginTop: 12, maxWidth: 280 }}>
                    {lapTimes.map((l, i) => (
                      <div key={i} style={{ background: "rgba(57,255,128,0.06)", border: "1px solid rgba(57,255,128,0.15)", borderRadius: 8, padding: "3px 10px", fontSize: 12, color: "var(--green)", fontWeight: 700 }}>
                        S{i+1} {formatChrono(l)}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Exercice suivant (compact) */}
              {(session.exercices||[])[currentExIdx + 1] && (
                <div style={{ display: "flex", alignItems: "center", gap: 10, background: "rgba(255,255,255,0.02)", border: "1px solid #151515", borderRadius: 12, padding: "10px 14px", marginBottom: 12 }}>
                  <div style={{ fontSize: 18 }}>→</div>
                  <div>
                    <div style={{ fontSize: 10, color: "#333", textTransform: "uppercase", letterSpacing: "0.1em" }}>Suivant</div>
                    <div style={{ fontSize: 14, color: "#555", fontWeight: 600 }}>{(session.exercices||[])[currentExIdx + 1].nom} · <span style={{ color: "#444" }}>{(session.exercices||[])[currentExIdx + 1].detail}</span></div>
                  </div>
                </div>
              )}

              {/* Contrôles principaux */}
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <div style={{ display: "flex", gap: 10 }}>
                  <button onClick={() => setChronoRunning(r => !r)} style={{
                    flex: 2, padding: 18, borderRadius: 16, fontSize: 22, fontFamily: "'Bebas Neue',sans-serif", letterSpacing: 2, cursor: "pointer",
                    background: chronoRunning ? "rgba(255,71,71,0.08)" : "var(--yellow)",
                    border: chronoRunning ? "1.5px solid rgba(255,71,71,0.4)" : "none",
                    color: chronoRunning ? "var(--red)" : "#000",
                    transition: "all 0.2s",
                  }}>{chronoRunning ? "⏸ PAUSE" : "▶ START"}</button>
                  <button onClick={() => {
                    setLapTimes(l => [...l, chronoSeconds]);
                    setChronoSeconds(0);
                    setReposMode(true);
                    setReposCountdown(90);
                    setReposRunning(true);
                    setChronoRunning(false);
                  }} style={{
                    flex: 1, padding: 18, borderRadius: 16, fontSize: 20, fontFamily: "'Bebas Neue',sans-serif", letterSpacing: 1, cursor: "pointer",
                    background: "rgba(255,154,60,0.08)", border: "1.5px solid rgba(255,154,60,0.3)", color: "var(--orange)",
                  }}>LAP</button>
                </div>
                {currentExIdx < (session.exercices||[]).length - 1 ? (
                  <button onClick={() => {
                    setCurrentExIdx(i => i + 1);
                    setChronoSeconds(0);
                    setLapTimes([]);
                    setChronoRunning(true);
                  }} style={{ width: "100%", padding: 16, borderRadius: 16, fontSize: 20, fontFamily: "'Bebas Neue',sans-serif", letterSpacing: 1, cursor: "pointer", background: "rgba(255,255,255,0.04)", border: "1px solid #1a1a1a", color: "#888" }}>
                    EXERCICE SUIVANT →
                  </button>
                ) : (
                  <button onClick={() => { setChronoMode(false); setChronoRunning(false); setReposMode(false); setReposRunning(false); setLapTimes([]); setShowFeedback(true); }} style={{
                    width: "100%", padding: 16, borderRadius: 16, fontSize: 20, fontFamily: "'Bebas Neue',sans-serif", letterSpacing: 1, cursor: "pointer",
                    background: "linear-gradient(135deg, rgba(57,255,128,0.15), rgba(57,255,128,0.05))",
                    border: "1.5px solid rgba(57,255,128,0.4)", color: "var(--green)",
                  }}>
                    SÉANCE TERMINÉE ✓
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Share Card Modal */}
      {showShareCard && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
          <div style={{ width: "100%", maxWidth: 340 }}>
            <div style={{ background: "#0a0a0a", border: "1.5px solid rgba(232,255,71,0.3)", borderRadius: 20, padding: 24, marginBottom: 16 }}>
              <div style={{ fontSize: 10, color: "rgba(232,255,71,0.6)", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 8 }}>FITRACE · HYROX IA</div>
              <div className="bebas" style={{ fontSize: 42, color: "var(--yellow)", lineHeight: 1, letterSpacing: 2 }}>{profile.name.toUpperCase()}</div>
              <div style={{ fontSize: 13, color: "#555", marginTop: 4 }}>Semaine {profile.week || 1} · Niveau {profile.level} · {days !== null ? `J-${days}` : ""}</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginTop: 16 }}>
                {[
                  { val: calcFitnessScore(profile).global, lbl: "Condition", color: "var(--yellow)" },
                  { val: profile.sessions?.length || 0, lbl: "Séances", color: "var(--green)" },
                  { val: `${profile.vmaKmh || "?"}`, lbl: "VMA km/h", color: "#aaa" },
                ].map((s, i) => (
                  <div key={i} style={{ background: "rgba(255,255,255,0.03)", borderRadius: 10, padding: 10, textAlign: "center" }}>
                    <div className="bebas" style={{ fontSize: 26, color: s.color }}>{s.val}</div>
                    <div style={{ fontSize: 9, color: "#444", marginTop: 2 }}>{s.lbl}</div>
                  </div>
                ))}
              </div>
              <div style={{ display: "flex", gap: 4, marginTop: 14, height: 4 }}>
                {[
                  { color: "var(--yellow)", w: calcFitnessScore(profile).force },
                  { color: "var(--green)", w: calcFitnessScore(profile).endurance },
                  { color: "var(--red)", w: calcFitnessScore(profile).puissance },
                ].map((b, i) => <div key={i} style={{ flex: b.w, background: b.color, borderRadius: 99, height: 4 }} />)}
              </div>
              <div style={{ marginTop: 6, display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontSize: 10, color: "var(--yellow)" }}>Force {calcFitnessScore(profile).force}%</span>
                <span style={{ fontSize: 10, color: "var(--green)" }}>Endurance {calcFitnessScore(profile).endurance}%</span>
                <span style={{ fontSize: 10, color: "var(--red)" }}>Puissance {calcFitnessScore(profile).puissance}%</span>
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <button onClick={() => {
                const score = calcFitnessScore(profile);
                const txt = encodeURIComponent("🏋️ Mon bilan FITRACE HYROX\n\n👤 " + profile.name + " — Niveau " + profile.level + "\n📊 Condition: " + score.global + "% | Force: " + score.force + "% | Endurance: " + score.endurance + "%\n🏃 VMA: " + (profile.vmaKmh || "?") + "km/h | Squat: " + (profile.squat1RM_final || "?") + "kg\n💪 " + (profile.sessions?.length || 0) + " séances\nFITRACE · fitrace-lemon.vercel.app");
                window.open("https://wa.me/?text=" + txt, "_blank");
              }} style={{ width: "100%", padding: 13, background: "#25D366", border: "none", borderRadius: 10, color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>
                📱 Partager sur WhatsApp
              </button>
              <button onClick={() => {
                const score = calcFitnessScore(profile);
                if (navigator.share) { navigator.share({ title: "Mon bilan FITRACE HYROX", text: profile.name + " · Condition " + score.global + "% · " + (profile.sessions?.length || 0) + " séances · Niveau " + profile.level, url: "https://fitrace-lemon.vercel.app" }); }
              }} style={{ width: "100%", padding: 13, background: "linear-gradient(135deg,#f58529,#dd2a7b)", border: "none", borderRadius: 10, color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>
                📸 Partager sur les réseaux
              </button>
              <button onClick={() => {
                const score = calcFitnessScore(profile);
                const txt = "🏋️ Mon bilan FITRACE HYROX\n👤 " + profile.name + " — Niveau " + profile.level + "\n📊 Condition: " + score.global + "% | Force: " + score.force + "% | Endurance: " + score.endurance + "%\n🏃 VMA: " + (profile.vmaKmh || "?") + "km/h | Squat: " + (profile.squat1RM_final || "?") + "kg\n💪 " + (profile.sessions?.length || 0) + " séances\nfitrace-lemon.vercel.app";
                navigator.clipboard?.writeText(txt).then(() => alert("Copié ! 📋"));
              }} style={{ width: "100%", padding: 11, background: "rgba(255,255,255,0.04)", border: "1px solid #222", borderRadius: 10, color: "#888", fontSize: 13, cursor: "pointer" }}>
                📋 Copier le texte
              </button>
              <button onClick={() => setShowShareCard(false)} style={{ width: "100%", padding: 8, background: "none", border: "none", color: "#444", fontSize: 12, cursor: "pointer" }}>Fermer</button>
            </div>
          </div>
        </div>
      )}

      {/* Header sticky premium */}
      {(() => {
        const tabMeta = {
          home: { label: "Accueil", color: "var(--yellow)" },
          today: { label: "Séance", color: "var(--green)" },
          progress: { label: "Progression", color: "var(--purple)" },
          planning: { label: "Planning", color: "var(--yellow)" },
          race: { label: "Course", color: "var(--red)" },
          technique: { label: "Technique", color: "var(--yellow)" },
          nutri: { label: "Nutrition", color: "var(--green)" },
          zones: { label: "Zones", color: "var(--green)" },
          profil: { label: "Profil", color: "var(--yellow)" },
        };
        const meta = tabMeta[tab] || { label: "FITRACE", color: "var(--yellow)" };
        return (
          <div style={{ background: "rgba(8,8,8,0.92)", padding: "12px 20px 10px", borderBottom: "1px solid rgba(255,255,255,0.04)", position: "sticky", top: 0, zIndex: 100, backdropFilter: "blur(24px)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div className="bebas" style={{ fontSize: 22, color: "var(--yellow)", letterSpacing: 2 }}>FIT<span style={{ color: "var(--white)" }}>RACE</span></div>
                <div style={{ width: 1, height: 18, background: "rgba(255,255,255,0.08)" }} />
                <div className="bebas" style={{ fontSize: 16, color: meta.color, letterSpacing: 1 }}>{meta.label.toUpperCase()}</div>
              </div>
              <div style={{ display: "flex", gap: 7, alignItems: "center" }}>
                {streak > 0 && (
                  <div style={{ display: "flex", alignItems: "center", gap: 3, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 20, padding: "3px 9px" }}>
                    <span style={{ fontSize: 11 }}>{streak >= 7 ? "🔥" : "⚡"}</span>
                    <span className="bebas" style={{ fontSize: 13, color: streak >= 7 ? "var(--yellow)" : "#ff9a3c" }}>{streak}</span>
                  </div>
                )}
                {days !== null && tab !== "race" && (
                  <div onClick={() => setTab("race")} style={{ background: "rgba(255,71,71,0.08)", border: "1px solid rgba(255,71,71,0.18)", borderRadius: 10, padding: "4px 10px", textAlign: "center", cursor: "pointer" }}>
                    <div className="bebas" style={{ fontSize: 20, color: "var(--red)", lineHeight: 1 }}>{days}</div>
                    <div style={{ fontSize: 8, color: "rgba(255,71,71,0.5)", letterSpacing: "0.08em" }}>JOURS</div>
                  </div>
                )}
                <button onClick={() => setShowCoachChat(true)} style={{ width: 34, height: 34, borderRadius: "50%", background: "rgba(57,255,128,0.08)", border: "1px solid rgba(57,255,128,0.2)", color: "var(--green)", fontSize: 16, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>🤖</button>
              </div>
            </div>
          </div>
        );
      })()}

      <div key={tab} className={tabDir >= 0 ? "tab-slide-right" : "tab-slide-left"} style={{ padding: "20px 16px", maxWidth: 480, margin: "0 auto" }}>

        {/* HOME — Accueil glassmorphism */}
        {tab === "home" && (
          <div>
            {/* Fond halo */}
            <div style={{ position: "absolute", top: 60, right: -40, width: 200, height: 200, background: "radial-gradient(circle, rgba(232,255,71,0.06) 0%, transparent 70%)", pointerEvents: "none", borderRadius: "50%" }} />
            <div style={{ position: "absolute", top: 300, left: -60, width: 180, height: 180, background: "radial-gradient(circle, rgba(57,255,128,0.04) 0%, transparent 70%)", pointerEvents: "none", borderRadius: "50%" }} />

            {/* Message IA Modal */}
            {showMessageModal && messageIA && (
              <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.88)", zIndex: 400, display: "flex", alignItems: "flex-end" }}
                onClick={() => setShowMessageModal(false)}>
                <div className="slide-up" onClick={e => e.stopPropagation()}
                  style={{ background: "var(--bg2)", borderRadius: "20px 20px 0 0", padding: 28, width: "100%", maxWidth: 480, margin: "0 auto", border: "1px solid rgba(232,255,71,0.2)" }}>
                  <div style={{ width: 40, height: 4, borderRadius: 99, background: "#333", margin: "0 auto 20px" }} />
                  <div style={{ fontSize: 11, color: "var(--yellow)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 12 }}>
                    🤖 Message de ton coach
                  </div>
                  <div style={{ fontSize: 16, color: "var(--white)", lineHeight: 1.7, marginBottom: 20 }}>
                    {messageIA.text}
                  </div>
                  <button onClick={() => setShowMessageModal(false)}
                    style={{ width: "100%", padding: 14, background: "var(--yellow)", border: "none", borderRadius: 12, fontSize: 15, fontFamily: "'Bebas Neue',sans-serif", letterSpacing: 1, color: "#000", cursor: "pointer" }}>
                    C'est parti ! ⚡
                  </button>
                </div>
              </div>
            )}

            {/* WIDGET PROCHAINE SÉANCE */}
            {(() => {
              const todaySession = session || coachSession;
              if (!todaySession) return null;
              const typeConf = {
                running_zone2: { label: "Running Zone 2", icon: "🏃", color: "var(--green)", bg: "linear-gradient(135deg, rgba(57,255,128,0.08) 0%, rgba(0,0,0,0) 60%)", border: "rgba(57,255,128,0.2)" },
                force_stations: { label: "Force Stations", icon: "🏋️", color: "var(--yellow)", bg: "linear-gradient(135deg, rgba(232,255,71,0.06) 0%, rgba(0,0,0,0) 60%)", border: "rgba(232,255,71,0.2)" },
                running_qualite: { label: "Running Qualité", icon: "⚡", color: "var(--orange)", bg: "linear-gradient(135deg, rgba(255,154,60,0.07) 0%, rgba(0,0,0,0) 60%)", border: "rgba(255,154,60,0.2)" },
                hybride_compromis: { label: "Hybride HYROX", icon: "🔀", color: "var(--purple)", bg: "linear-gradient(135deg, rgba(167,139,250,0.07) 0%, rgba(0,0,0,0) 60%)", border: "rgba(167,139,250,0.2)" },
              };
              const conf = typeConf[todaySession.type] || { label: "Séance", icon: "💪", color: "var(--yellow)", bg: "linear-gradient(135deg, rgba(232,255,71,0.06) 0%, rgba(0,0,0,0) 60%)", border: "rgba(232,255,71,0.15)" };
              const exs = todaySession.exercices || [];
              return (
                <div className="float-up card-hover" style={{ background: conf.bg, border: `1.5px solid ${conf.border}`, borderRadius: 20, padding: "18px 18px 16px", marginBottom: 16, position: "relative", overflow: "hidden" }}
                  onClick={() => setTab("today")}>
                  <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, ${conf.color}, transparent)` }} />
                  <div style={{ position: "absolute", top: -20, right: -10, fontSize: 70, opacity: 0.05 }}>{conf.icon}</div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 5 }}>
                        <div style={{ width: 6, height: 6, borderRadius: "50%", background: conf.color }} />
                        <div style={{ fontSize: 10, color: conf.color, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em" }}>Séance du jour</div>
                      </div>
                      <div className="bebas" style={{ fontSize: 22, color: "var(--white)", lineHeight: 1.15 }}>{todaySession.titre}</div>
                    </div>
                    <div style={{ background: conf.color, borderRadius: 10, padding: "8px 14px", flexShrink: 0, marginLeft: 10 }}>
                      <div className="bebas" style={{ fontSize: 16, color: "#000", lineHeight: 1 }}>▶ START</div>
                    </div>
                  </div>
                  {/* Exercices clés */}
                  {exs.length > 0 && (
                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                      {exs.slice(0, 3).map((ex, i) => (
                        <div key={i} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 8, padding: "4px 10px", fontSize: 11, color: "#888" }}>
                          {ex.nom}
                        </div>
                      ))}
                      {exs.length > 3 && <div style={{ background: "rgba(255,255,255,0.03)", borderRadius: 8, padding: "4px 10px", fontSize: 11, color: "#444" }}>+{exs.length - 3}</div>}
                    </div>
                  )}
                  {todaySession.duree && (
                    <div style={{ marginTop: 10, fontSize: 11, color: "#444" }}>⏱ {todaySession.duree} min · {conf.label}</div>
                  )}
                </div>
              );
            })()}

            {/* STREAK CARD */}
            {streakData && (() => {
              const streakColor = streak >= 14 ? "#ff6b35" : streak >= 7 ? "var(--yellow)" : streak >= 3 ? "var(--orange)" : "#333";
              const streakBg = streak >= 14 ? "linear-gradient(135deg, #1a0800 0%, #080808 60%)" : streak >= 7 ? "linear-gradient(135deg, #131500 0%, #080808 60%)" : streak >= 3 ? "linear-gradient(135deg, #120800 0%, #080808 60%)" : "rgba(255,255,255,0.01)";
              const streakBorder = streak >= 7 ? `${streakColor}44` : "rgba(255,255,255,0.05)";
              const milestones = [3, 7, 14, 30];
              const nextMilestone = milestones.find(m => m > streak) || 30;
              const prevMilestone = milestones.filter(m => m <= streak).pop() || 0;
              const milestoneProgress = ((streak - prevMilestone) / (nextMilestone - prevMilestone)) * 100;
              return (
              <div style={{ background: streakBg, border: `1.5px solid ${streakBorder}`, borderRadius: 18, padding: "16px 18px", marginBottom: 10, position: "relative", overflow: "hidden" }}>
                {streak >= 7 && <div style={{ position: "absolute", top: -30, right: -30, width: 120, height: 120, borderRadius: "50%", background: `radial-gradient(circle, ${streakColor}15 0%, transparent 70%)`, pointerEvents: "none" }} />}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ fontSize: 30 }}>{streak >= 14 ? "🔥" : streak >= 7 ? "🔥" : streak >= 3 ? "⚡" : "💤"}</span>
                    <div>
                      <div className="bebas" style={{ fontSize: 40, color: streakColor, lineHeight: 1, letterSpacing: 1 }}>{streak}<span style={{ fontSize: 18, color: "#444", letterSpacing: 0, marginLeft: 4 }}>JOURS</span></div>
                      <div style={{ fontSize: 11, color: "#444", marginTop: 1 }}>
                        {streak === 0 ? "Lance ta série aujourd'hui !" : streak === 1 ? "Jour 1 — la séquence commence !" : `Série active · record ${streakData.best}j`}
                      </div>
                    </div>
                  </div>
                  <div style={{ textAlign: "center", background: "rgba(0,0,0,0.3)", borderRadius: 12, padding: "8px 14px" }}>
                    <div style={{ fontSize: 9, color: "#333", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 2 }}>Record</div>
                    <div className="bebas" style={{ fontSize: 26, color: "#555", lineHeight: 1 }}>{streakData.best}</div>
                  </div>
                </div>
                {/* 7-day visual */}
                <div style={{ display: "flex", gap: 5, marginBottom: streak > 0 ? 12 : 0 }}>
                  {(streakData.lastDays || []).map((d, i) => {
                    const dayLabel = ["L","M","M","J","V","S","D"][d.date.getDay() === 0 ? 6 : d.date.getDay() - 1];
                    return (
                      <div key={i} style={{ flex: 1, textAlign: "center" }}>
                        <div style={{ fontSize: 9, color: d.isToday ? streakColor : "#2a2a2a", marginBottom: 5, fontWeight: d.isToday ? 700 : 400, textTransform: "uppercase" }}>{dayLabel}</div>
                        <div style={{ width: "100%", aspectRatio: "1", borderRadius: 8, background: d.done ? (d.isToday ? streakColor : `${streakColor}55`) : "rgba(255,255,255,0.03)", border: d.isToday ? `2px solid ${streakColor}` : "1px solid rgba(255,255,255,0.04)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, color: d.done ? "#000" : "#111", fontWeight: 700 }}>
                          {d.done ? "✓" : ""}
                        </div>
                      </div>
                    );
                  })}
                </div>
                {/* Milestone progress */}
                {streak > 0 && (
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                      <span style={{ fontSize: 10, color: "#333", textTransform: "uppercase", letterSpacing: "0.08em" }}>Prochain objectif</span>
                      <span style={{ fontSize: 10, color: streakColor, fontWeight: 700 }}>{nextMilestone} jours</span>
                    </div>
                    <div style={{ height: 4, background: "rgba(255,255,255,0.04)", borderRadius: 99, overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${milestoneProgress}%`, background: streakColor, borderRadius: 99, transition: "width 0.6s ease" }} />
                    </div>
                  </div>
                )}
              </div>
              );
            })()}

            {/* MESSAGE IA DU JOUR */}
            <div onClick={() => !loadingMessage && setShowMessageModal(true)}
              style={{ background: "rgba(57,255,128,0.03)", border: "1px solid rgba(57,255,128,0.12)", borderRadius: 14, padding: "12px 16px", marginBottom: 10, cursor: "pointer" }}>
              <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(57,255,128,0.1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>🤖</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 10, color: "var(--green)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 4 }}>Ton coach · Aujourd'hui</div>
                  {loadingMessage ? (
                    <div style={{ fontSize: 12, color: "#444", fontStyle: "italic" }}>Ton coach prépare ton message du jour…</div>
                  ) : (
                    <div style={{ fontSize: 13, color: "#ccc", lineHeight: 1.5 }}>
                      {messageIA ? messageIA.text.slice(0, 80) + (messageIA.text.length > 80 ? "…" : "") : "Charge en cours…"}
                    </div>
                  )}
                </div>
                {!loadingMessage && <span style={{ color: "#333", fontSize: 16, flexShrink: 0 }}>→</span>}
              </div>
            </div>

            {/* ═══ WIDGET FORME DU JOUR ═══ */}
            {(profile.sessions||[]).length >= 2 && (() => {
              const last3 = (profile.sessions||[]).slice(-3);
              const avgRPE = Math.round(last3.reduce((a,s) => a+(s.difficulte||5),0)/last3.length);
              const avgEnergie = (last3.reduce((a,s) => a+(s.energie||3),0)/last3.length).toFixed(1);
              const lastRessenti = last3[last3.length-1]?.ressenti;
              const forme = avgRPE <= 5 && avgEnergie >= 3.5 ? "top"
                : avgRPE >= 9 || avgEnergie < 2 ? "fatigue"
                : avgRPE >= 7 ? "charge" : "normal";
              const formeConf = {
                top:     { label: "Forme optimale",    emoji: "🚀", color: "var(--green)",  bg: "rgba(57,255,128,0.06)",  border: "rgba(57,255,128,0.18)",  msg: "Intensité max autorisée." },
                normal:  { label: "Bonne forme",       emoji: "💪", color: "var(--yellow)", bg: "rgba(232,255,71,0.04)",  border: "rgba(232,255,71,0.15)",  msg: "Continue sur ta lancée." },
                charge:  { label: "Charge élevée",     emoji: "⚠️", color: "var(--orange)", bg: "rgba(255,154,60,0.05)",  border: "rgba(255,154,60,0.18)",  msg: "Pense à la récup active." },
                fatigue: { label: "Récupération",      emoji: "😴", color: "var(--red)",    bg: "rgba(255,71,71,0.05)",   border: "rgba(255,71,71,0.18)",   msg: "Zone 2 ou repos conseillé." },
              }[forme];
              return (
                <div style={{ background: formeConf.bg, border: `1px solid ${formeConf.border}`, borderRadius: 14, padding: "12px 16px", marginBottom: 10, display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ fontSize: 26, flexShrink: 0 }}>{formeConf.emoji}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 3 }}>
                      <div style={{ fontSize: 12, fontWeight: 700, color: formeConf.color }}>{formeConf.label}</div>
                      <div style={{ fontSize: 10, color: "#333" }}>Sur {last3.length} séances</div>
                    </div>
                    <div style={{ fontSize: 11, color: "#555" }}>{formeConf.msg}</div>
                  </div>
                  <div style={{ textAlign: "right", flexShrink: 0 }}>
                    <div className="bebas" style={{ fontSize: 22, color: formeConf.color, lineHeight: 1 }}>RPE {avgRPE}</div>
                    <div style={{ fontSize: 10, color: "#333" }}>⚡{avgEnergie}/5</div>
                  </div>
                </div>
              );
            })()}

            {/* ═══ HERO SCORE RING ═══ */}
            {(() => {
              const sc = calcFitnessScore(profile);
              const r = 54; const circ = 2 * Math.PI * r;
              const offset = circ - (sc.global / 100) * circ;
              const tw = totalWeeksFromDate(profile.raceDate);
              const cw = profile.week || 1;
              return (
                <div className="float-up" style={{ background: "linear-gradient(145deg, #0f1200 0%, #080808 50%, #001208 100%)", border: "1.5px solid rgba(232,255,71,0.12)", borderRadius: 24, padding: "22px 20px 18px", marginBottom: 12, position: "relative", overflow: "hidden" }}>
                  {/* Halo */}
                  <div style={{ position: "absolute", top: -60, left: "50%", transform: "translateX(-50%)", width: 300, height: 200, background: "radial-gradient(ellipse, rgba(232,255,71,0.07) 0%, transparent 70%)", pointerEvents: "none" }} />

                  {/* Top row: name + share */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
                    <div>
                      <div style={{ fontSize: 11, color: "#444", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 4 }}>Bonjour 👋</div>
                      <div className="bebas" style={{ fontSize: 34, color: "var(--white)", letterSpacing: 1, lineHeight: 1 }}>{profile.name.toUpperCase()}</div>
                      <div style={{ fontSize: 11, color: "#444", marginTop: 4 }}>{LEVELS[(profile.level || 1) - 1]?.label} · S{cw}/{tw || "?"}</div>
                    </div>
                    <button onClick={() => setShowShareCard(true)} style={{ background: "rgba(232,255,71,0.08)", border: "1px solid rgba(232,255,71,0.2)", borderRadius: 10, padding: "8px 12px", color: "var(--yellow)", fontSize: 12, fontWeight: 700, display: "flex", alignItems: "center", gap: 6 }}>
                      📤 Partager
                    </button>
                  </div>

                  {/* Score ring + stats */}
                  <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
                    {/* SVG Ring */}
                    <div style={{ position: "relative", flexShrink: 0 }}>
                      <svg width="140" height="140" viewBox="0 0 140 140">
                        {/* bg ring */}
                        <circle cx="70" cy="70" r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="10" />
                        {/* colored ring */}
                        <circle cx="70" cy="70" r={r} fill="none"
                          stroke={sc.global >= 75 ? "#39ff80" : sc.global >= 50 ? "#e8ff47" : "#ff9a3c"}
                          strokeWidth="10" strokeLinecap="round"
                          strokeDasharray={circ} strokeDashoffset={offset}
                          transform="rotate(-90 70 70)"
                          style={{ transition: "stroke-dashoffset 1s ease, stroke 0.5s" }}
                        />
                        {/* inner glow ring */}
                        <circle cx="70" cy="70" r={r} fill="none"
                          stroke={sc.global >= 75 ? "rgba(57,255,128,0.15)" : sc.global >= 50 ? "rgba(232,255,71,0.15)" : "rgba(255,154,60,0.15)"}
                          strokeWidth="18" strokeLinecap="round"
                          strokeDasharray={circ} strokeDashoffset={offset}
                          transform="rotate(-90 70 70)"
                        />
                        {/* Score text */}
                        <text x="70" y="62" textAnchor="middle" fontFamily="'Bebas Neue',sans-serif" fontSize="42" fill={sc.global >= 75 ? "#39ff80" : sc.global >= 50 ? "#e8ff47" : "#ff9a3c"}>{sc.global}</text>
                        <text x="70" y="80" textAnchor="middle" fontFamily="'DM Sans',sans-serif" fontSize="11" fill="#444" letterSpacing="2">/ 100</text>
                        <text x="70" y="96" textAnchor="middle" fontFamily="'DM Sans',sans-serif" fontSize="9" fill="#333" letterSpacing="1">SCORE FITNESS</text>
                      </svg>
                    </div>

                    {/* Bars */}
                    <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 12 }}>
                      {[
                        { label: "Force", val: sc.force, color: "var(--yellow)", icon: "🏋️" },
                        { label: "Endurance", val: sc.endurance, color: "var(--green)", icon: "🏃" },
                        { label: "Puissance", val: sc.puissance, color: "var(--red)", icon: "⚡" },
                      ].map(b => (
                        <div key={b.label}>
                          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                            <span style={{ fontSize: 12, color: "#666", display: "flex", alignItems: "center", gap: 5 }}><span>{b.icon}</span>{b.label}</span>
                            <span className="bebas" style={{ fontSize: 16, color: b.color, lineHeight: 1 }}>{b.val}<span style={{ fontSize: 10, color: "#333" }}>%</span></span>
                          </div>
                          <div style={{ background: "rgba(255,255,255,0.04)", borderRadius: 99, height: 6, overflow: "hidden" }}>
                            <div style={{ width: `${b.val}%`, height: "100%", background: `linear-gradient(90deg, ${b.color}88, ${b.color})`, borderRadius: 99, transition: "width 0.8s ease" }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Programme week bar */}
                  {tw > 0 && (
                    <div style={{ marginTop: 16, paddingTop: 14, borderTop: "1px solid rgba(255,255,255,0.04)" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                        <span style={{ fontSize: 10, color: "#444", textTransform: "uppercase", letterSpacing: "0.1em" }}>Progression programme</span>
                        <span className="bebas" style={{ fontSize: 13, color: "var(--yellow)" }}>S{cw} / {tw}</span>
                      </div>
                      <div style={{ display: "flex", gap: 2 }}>
                        {Array.from({ length: Math.min(tw, 20) }, (_, i) => {
                          const ratio = tw / Math.min(tw, 20);
                          const w = Math.floor(i * ratio) + 1;
                          const isPast = cw > Math.floor((i + 1) * ratio);
                          const isActive = !isPast && cw >= w;
                          return <div key={i} style={{ flex: 1, height: 5, borderRadius: 99, background: isPast ? "var(--yellow)" : isActive ? "rgba(232,255,71,0.5)" : "rgba(255,255,255,0.05)", border: isActive ? "1px solid rgba(232,255,71,0.6)" : "none" }} />;
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            })()}

            {/* Séance coach dispo */}
            {coachSession && (
              <div onClick={() => setTab("today")} className="card-hover" style={{ background: "linear-gradient(135deg, rgba(232,255,71,0.08) 0%, rgba(232,255,71,0.03) 100%)", border: "1.5px solid rgba(232,255,71,0.25)", borderRadius: 16, padding: "14px 16px", marginBottom: 10, cursor: "pointer", display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: "var(--yellow)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>📋</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 10, color: "var(--yellow)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 3 }}>Séance du coach disponible</div>
                  <div style={{ fontSize: 14, color: "var(--white)", fontWeight: 700 }}>{coachSession.titre}</div>
                </div>
                <span className="bebas" style={{ color: "var(--yellow)", fontSize: 20 }}>→</span>
              </div>
            )}

            {/* CTA séance — GRAND BOUTON */}
            <button onClick={() => setTab("today")} style={{ width: "100%", background: "var(--yellow)", border: "none", borderRadius: 18, padding: "18px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer", marginBottom: 12, position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", right: 60, top: -20, width: 100, height: 100, borderRadius: "50%", background: "rgba(0,0,0,0.06)", pointerEvents: "none" }} />
              <div style={{ textAlign: "left" }}>
                <div className="bebas" style={{ fontSize: 24, color: "#080808", letterSpacing: 1, lineHeight: 1 }}>MA SÉANCE DU JOUR</div>
                <div style={{ fontSize: 12, color: "rgba(0,0,0,0.45)", marginTop: 3 }}>Coach IA · Programme adaptatif</div>
              </div>
              <div style={{ width: 44, height: 44, borderRadius: "50%", background: "rgba(0,0,0,0.12)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span className="bebas" style={{ fontSize: 22, color: "#080808" }}>→</span>
              </div>
            </button>

            {/* Historique — scroll horizontal */}
            {(profile.sessions || []).length > 0 && (() => {
              const TYPE_CONF = {
                running_zone2: { icon: "🏃", color: "var(--green)", bg: "rgba(57,255,128,0.08)", border: "rgba(57,255,128,0.2)", label: "Zone 2" },
                force_stations: { icon: "💪", color: "var(--yellow)", bg: "rgba(232,255,71,0.06)", border: "rgba(232,255,71,0.2)", label: "Force" },
                running_qualite: { icon: "⚡", color: "var(--orange)", bg: "rgba(255,154,60,0.08)", border: "rgba(255,154,60,0.2)", label: "Qualité" },
                hybride_compromis: { icon: "🔀", color: "var(--purple)", bg: "rgba(167,139,250,0.08)", border: "rgba(167,139,250,0.2)", label: "Hybride" },
              };
              const sessions = (profile.sessions || []).slice(-5).reverse();
              return (
                <div style={{ marginBottom: 12 }}>
                  <div style={{ fontSize: 11, color: "#333", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 10 }}>Dernières séances</div>
                  <div style={{ display: "flex", gap: 10, overflowX: "auto", paddingBottom: 4, scrollbarWidth: "none" }}>
                    {sessions.map((s, i) => {
                      const conf = TYPE_CONF[s.type] || { icon: "🏋️", color: "var(--yellow)", bg: "rgba(232,255,71,0.06)", border: "rgba(232,255,71,0.15)", label: "Séance" };
                      const rpe = s.difficulte || 5;
                      const rpeColor = rpe <= 4 ? "var(--green)" : rpe <= 7 ? "var(--yellow)" : "var(--red)";
                      return (
                        <div key={i} style={{ flexShrink: 0, width: 140, background: conf.bg, border: `1.5px solid ${conf.border}`, borderRadius: 16, padding: "14px 12px", position: "relative", overflow: "hidden" }}>
                          {/* type stripe */}
                          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: conf.color, borderRadius: "16px 16px 0 0", opacity: 0.7 }} />
                          <div style={{ fontSize: 26, marginBottom: 8, marginTop: 4 }}>{conf.icon}</div>
                          <div style={{ fontSize: 11, fontWeight: 700, color: "var(--white)", lineHeight: 1.3, marginBottom: 6, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>{s.titre}</div>
                          <div style={{ fontSize: 10, color: "#444", marginBottom: 8 }}>{new Date(s.date).toLocaleDateString("fr-FR", { day: "numeric", month: "short" })}</div>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <span style={{ fontSize: 9, background: `${conf.color}20`, color: conf.color, borderRadius: 4, padding: "2px 6px", fontWeight: 700 }}>{conf.label}</span>
                            <span className="bebas" style={{ fontSize: 20, color: rpeColor, lineHeight: 1 }}>{rpe}<span style={{ fontSize: 9, color: "#333" }}>/10</span></span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })()}

            {/* ── TIP DU JOUR HYROX ── */}
            {(() => {
              const TIPS = [
                { icon: "⛷️", cat: "SkiErg", tip: "Garde les épaules basses et tire avec tout le corps, pas seulement les bras. La puissance vient des hanches.", color: "#a78bfa" },
                { icon: "🛷", cat: "Sled Push", tip: "Incline-toi à 45°, pousse avec les jambes en extension complète. Gardez le dos droit, regardez le sol.", color: "var(--yellow)" },
                { icon: "🔗", cat: "Sled Pull", tip: "Marche en arrière avec des pas courts et rapides. Bras tendus, cordes bien tendues à chaque traction.", color: "var(--orange)" },
                { icon: "🤸", cat: "Burpee BJ", tip: "Saut le plus loin possible, pas le plus haut. Atterris en flexion pour absorber et enchaîne immédiatement.", color: "var(--red)" },
                { icon: "🚣", cat: "Rowing", tip: "Jambes → hanches → bras dans cet ordre. Le drive commence par les jambes. Tire les poignées sous les côtes.", color: "#38bdf8" },
                { icon: "🧳", cat: "Farmers Carry", tip: "Chest up, abdos gainés, pas réguliers. Évite de balancer les kettlebells — ça coûte de l'énergie.", color: "var(--green)" },
                { icon: "🎒", cat: "Sandbag Lunges", tip: "Pose le sac sur les épaules, pas dans le cou. Genou avant à 90°, genou arrière effleure le sol.", color: "var(--orange)" },
                { icon: "🏀", cat: "Wall Balls", tip: "Squatte sous le parallèle à chaque rep. Lance la balle au point le plus haut de ton extension, pas avec les bras.", color: "var(--yellow)" },
                { icon: "🏃", cat: "Running HYROX", tip: "Entre les stations, trottine à un rythme conversationnel (Zone 2). Le running est ta récupération active.", color: "var(--green)" },
                { icon: "🧠", cat: "Mental Race", tip: "Divise la race en 2 blocs : km 1-4 et km 5-8. Garde 30% d'énergie pour la seconde moitié.", color: "#ec4899" },
                { icon: "🍌", cat: "Nutrition J-1", tip: "Charge glucidique la veille (pâtes, riz, pommes de terre). Évite les graisses et les fibres en excès.", color: "var(--yellow)" },
                { icon: "💤", cat: "Récupération", tip: "48h après une séance intense, priorise le sommeil. C'est pendant le repos que tu progresses, pas pendant l'effort.", color: "#a78bfa" },
                { icon: "🎯", cat: "Stratégie", tip: "Les 3 premières stations déterminent souvent ta course. Pars 10% en dessous de ton objectif, accélère après.", color: "var(--red)" },
              ];
              const dayIdx = Math.floor(Date.now() / 86400000) % TIPS.length;
              const tip = TIPS[dayIdx];
              return (
                <div style={{ background: `${tip.color}06`, border: `1px solid ${tip.color}22`, borderRadius: 14, padding: "14px 16px", marginBottom: 10 }}>
                  <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                    <div style={{ width: 40, height: 40, borderRadius: 10, background: `${tip.color}15`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>{tip.icon}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                        <div style={{ fontSize: 10, fontWeight: 700, color: tip.color, textTransform: "uppercase", letterSpacing: "0.08em" }}>Tip · {tip.cat}</div>
                        <div style={{ fontSize: 9, color: "#2a2a2a" }}>J+{dayIdx % 13 + 1}/13</div>
                      </div>
                      <div style={{ fontSize: 12, color: "#888", lineHeight: 1.55 }}>{tip.tip}</div>
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* Bouton Mon Profil */}
            <button onClick={() => setTab("profil")} className="card-hover" style={{ width: "100%", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: "14px 16px", display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 40, height: 40, borderRadius: 11, background: "linear-gradient(135deg, rgba(232,255,71,0.15), rgba(232,255,71,0.05))", border: "1px solid rgba(232,255,71,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>👤</div>
                <div style={{ textAlign: "left" }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: "var(--white)" }}>Mon profil</div>
                  <div style={{ fontSize: 11, color: "#444", marginTop: 1 }}>
                    {profile.tests && Object.keys(profile.tests).length > 0
                      ? `${Object.keys(profile.tests).filter(k => k !== "analyzed").length} tests complétés`
                      : "Batterie de tests à compléter"}
                  </div>
                </div>
              </div>
              <div style={{ color: "var(--yellow)", fontSize: 16 }}>→</div>
            </button>
          </div>
        )}

        {/* TODAY */}
        {tab === "today" && (
          <div className="fade-in">
            {/* Citation du jour */}
            <div style={{ background: "linear-gradient(135deg, rgba(232,255,71,0.05) 0%, rgba(57,255,128,0.03) 100%)", border: "1px solid rgba(232,255,71,0.1)", borderRadius: 16, padding: "16px 18px", marginBottom: 14, position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", top: 10, right: 14, fontSize: 40, opacity: 0.06, fontFamily: "Georgia, serif" }}>"</div>
              <div style={{ fontSize: 9, color: "var(--yellow)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.14em", marginBottom: 8 }}>💬 Citation du jour</div>
              <div style={{ fontSize: 14, color: "#ccc", lineHeight: 1.7, fontStyle: "italic", position: "relative" }}>"{getCitationDuJour()}"</div>
            </div>

            {/* Séance coach du jour */}
            {coachSession && !session && (
              <div style={{ marginBottom: 14 }}>
                <div style={{ fontSize: 11, color: "#555", textTransform: "uppercase", fontWeight: 700, letterSpacing: "0.08em", marginBottom: 10 }}>
                  Séance disponible aujourd'hui
                </div>
                <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
                  {/* Option séance du coach */}
                  <div style={{ flex: 1, background: "rgba(232,255,71,0.06)", border: "1.5px solid rgba(232,255,71,0.3)", borderRadius: 14, padding: "14px 14px 10px" }}>
                    <div style={{ fontSize: 10, color: "var(--yellow)", fontWeight: 700, textTransform: "uppercase", marginBottom: 6 }}>📋 Séance du coach</div>
                    <div style={{ fontWeight: 700, fontSize: 14, color: "var(--white)", marginBottom: 4, lineHeight: 1.3 }}>{coachSession.titre}</div>
                    <div style={{ fontSize: 12, color: "#888", lineHeight: 1.5, marginBottom: 10 }}>{coachSession.description?.slice(0, 80)}{coachSession.description?.length > 80 ? "…" : ""}</div>
                    <button onClick={() => {
                      setSession({
                        titre: coachSession.titre,
                        type: "coach",
                        duree: coachSession.duree || 60,
                        explication: "Séance programmée par ton coach.",
                        echauffement: coachSession.echauffement || "",
                        exercices: (coachSession.description || "").split("\n").filter(l => l.trim()).map(l => ({ nom: l.trim(), detail: "", rpe: "", note: "" })),
                        retourCalme: "",
                        nutrition: { avant: "", apres: "" },
                        metrique: "",
                      });
                    }} style={{ width: "100%", padding: "8px", background: "var(--yellow)", border: "none", borderRadius: 8, fontSize: 13, fontFamily: "'Bebas Neue',sans-serif", letterSpacing: 1, color: "#000", cursor: "pointer" }}>
                      FAIRE CETTE SÉANCE
                    </button>
                  </div>
                  {/* OU */}
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, color: "#333", fontWeight: 700 }}>OU</div>
                  {/* Option IA */}
                  <div style={{ flex: 1, background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 14, padding: "14px 14px 10px" }}>
                    <div style={{ fontSize: 10, color: "var(--green)", fontWeight: 700, textTransform: "uppercase", marginBottom: 6 }}>🤖 Séance personnalisée</div>
                    <div style={{ fontSize: 13, color: "#888", lineHeight: 1.5, marginBottom: 10 }}>Générée par ton coach IA selon ton profil, ta fatigue et ton historique</div>
                    <button onClick={generateSession} style={{ width: "100%", padding: "8px", background: "rgba(57,255,128,0.1)", border: "1px solid rgba(57,255,128,0.3)", borderRadius: 8, fontSize: 13, fontFamily: "'Bebas Neue',sans-serif", letterSpacing: 1, color: "var(--green)", cursor: "pointer" }}>
                      GÉNÉRER MA SÉANCE
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Check-in */}
            <Section title="Comment tu vas ?">
              <Card>
                {/* Fatigue physique */}
                <div style={{ marginBottom: 14 }}>
                  <div style={{ fontSize: 11, color: "#444", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 10 }}>⚡ Fatigue physique</div>
                  <div style={{ display: "flex", gap: 6 }}>
                    {[
                      { v: 1, emoji: "😴", label: "Fatigué", color: "var(--red)" },
                      { v: 2, emoji: "😐", label: "Moyen", color: "var(--orange)" },
                      { v: 3, emoji: "😊", label: "Bien", color: "var(--yellow)" },
                      { v: 4, emoji: "🔥", label: "Frais", color: "var(--green)" },
                    ].map(f => (
                      <button key={f.v} onClick={() => setDailyData(d => ({ ...d, fatigue: f.v }))} style={{
                        flex: 1, padding: "10px 4px", borderRadius: 12, textAlign: "center",
                        background: dailyData.fatigue === f.v ? `${f.color}15` : "rgba(255,255,255,0.02)",
                        border: dailyData.fatigue === f.v ? `2px solid ${f.color}` : "1.5px solid rgba(255,255,255,0.06)",
                        color: "var(--white)", cursor: "pointer", transition: "all 0.18s",
                      }}>
                        <div style={{ fontSize: 22 }}>{f.emoji}</div>
                        <div style={{ fontSize: 9, marginTop: 4, color: dailyData.fatigue === f.v ? f.color : "#444", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em" }}>{f.label}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Score de sommeil */}
                <div style={{ marginBottom: 14 }}>
                  <div style={{ fontSize: 11, color: "#444", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 10 }}>🌙 Score de sommeil</div>
                  <div style={{ display: "flex", gap: 6 }}>
                    {[
                      { v: 1, emoji: "💤", label: "Mauvais", color: "var(--red)" },
                      { v: 2, emoji: "😐", label: "Moyen", color: "var(--orange)" },
                      { v: 3, emoji: "🙂", label: "Bon", color: "var(--yellow)" },
                      { v: 4, emoji: "⭐", label: "Excellent", color: "var(--green)" },
                    ].map(s => (
                      <button key={s.v} onClick={() => setDailyData(d => ({ ...d, sommeil: s.v }))} style={{
                        flex: 1, padding: "10px 4px", borderRadius: 12, textAlign: "center",
                        background: dailyData.sommeil === s.v ? `${s.color}15` : "rgba(255,255,255,0.02)",
                        border: dailyData.sommeil === s.v ? `2px solid ${s.color}` : "1.5px solid rgba(255,255,255,0.06)",
                        color: "var(--white)", cursor: "pointer", transition: "all 0.18s",
                      }}>
                        <div style={{ fontSize: 22 }}>{s.emoji}</div>
                        <div style={{ fontSize: 9, marginTop: 4, color: dailyData.sommeil === s.v ? s.color : "#444", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em" }}>{s.label}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Type de séance */}
                <div style={{ marginBottom: 16 }}>
                  <div style={{ fontSize: 11, color: "#444", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 10 }}>🎯 Type de séance</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    {[
                      { v: "auto", icon: "🏅", label: "Choix du coach", sub: "Le coach décide selon ta semaine", color: "var(--yellow)" },
                      { v: "force_stations", icon: "🏋️", label: "Musculation", sub: "Squat, Deadlift, Sled, Farmer Carry…", color: "var(--yellow)" },
                      { v: "running_zone2", icon: "🏃", label: "Running / Cardio", sub: "Zone 2, tempo, intervalles…", color: "var(--green)" },
                      { v: "hybride_compromis", icon: "⚡", label: "Hybride HYROX", sub: "Stations + run enchaînés", color: "var(--purple)" },
                      { v: "running_qualite", icon: "🎯", label: "Running qualité", sub: "Intervalles, seuil, VO2max", color: "var(--orange)" },
                      { v: "perso", icon: "✏️", label: "Séance perso", sub: "Je crée ma propre séance", color: "#888" },
                    ].map(t => {
                      const active = dailyData.typeSeance === t.v;
                      return (
                        <button key={t.v} onClick={() => setDailyData(d => ({ ...d, typeSeance: t.v }))} style={{
                          display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", borderRadius: 12, textAlign: "left", width: "100%",
                          background: active ? `${t.color}10` : "rgba(255,255,255,0.02)",
                          border: active ? `1.5px solid ${t.color}55` : "1px solid rgba(255,255,255,0.05)",
                          color: "var(--white)", cursor: "pointer", transition: "all 0.18s",
                        }}>
                          <div style={{ width: 38, height: 38, borderRadius: 10, background: active ? `${t.color}20` : "rgba(255,255,255,0.04)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>{t.icon}</div>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontSize: 13, fontWeight: 700, color: active ? t.color : "var(--white)" }}>{t.label}</div>
                            <div style={{ fontSize: 11, color: "#444", marginTop: 1 }}>{t.sub}</div>
                          </div>
                          {active && <div style={{ width: 20, height: 20, borderRadius: "50%", background: t.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, color: "#000", fontWeight: 700, flexShrink: 0 }}>✓</div>}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Temps + Matériel */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  <Select label="Temps dispo" value={dailyData.temps} onChange={v => setDailyData(d => ({ ...d, temps: v }))} options={[
                    { value: 30, label: "30 min" }, { value: 45, label: "45 min" }, { value: 60, label: "1h" }, { value: 90, label: "1h30" }, { value: 120, label: "2h" }
                  ]} />
                  <Select label="Matériel" value={dailyData.materiel} onChange={v => setDailyData(d => ({ ...d, materiel: v }))} options={[
                    { value: "tout", label: "Tout (Box)" }, { value: "cardio", label: "Cardio seul" }, { value: "halteres", label: "Haltères" }, { value: "rien", label: "Sans matériel" }
                  ]} />
                </div>

                {/* Dernière adaptation */}
                {lastAdaptation && !session && (
                  <div style={{ marginTop: 12, padding: "10px 14px", background: "var(--bg3)", borderRadius: 8, fontSize: 13, color: "var(--green)", lineHeight: 1.5 }}>
                    🤖 <strong>Adapté depuis ta dernière séance :</strong> {lastAdaptation.adaptation}
                  </div>
                )}
              </Card>
            </Section>

            {!session && !loadingSession && (
              dailyData.typeSeance === "perso" ? (
                <div className="fade-in" style={{ marginBottom: 20 }}>
                  {!showSeancePerso ? (
                    <Btn size="lg" onClick={() => setShowSeancePerso(true)} style={{ width: "100%" }}>✏️ Créer ma séance perso</Btn>
                  ) : (
                    <div style={{ background: "var(--bg2)", border: "1.5px solid rgba(232,255,71,0.25)", borderRadius: 14, padding: 18 }}>
                      <div className="bebas" style={{ fontSize: 20, color: "var(--yellow)", marginBottom: 14 }}>MA SÉANCE PERSO</div>
                      <div style={{ marginBottom: 14 }}>
                        <Input label="Titre de la séance" value={seancePerso.titre} onChange={v => setSeancePerso(s => ({ ...s, titre: v }))} placeholder="ex: Force Lower Body" />
                      </div>
                      <div style={{ fontSize: 11, color: "#aaa", fontWeight: 700, textTransform: "uppercase", marginBottom: 10 }}>Exercices</div>
                      {seancePerso.exercices.map((ex, i) => (
                        <div key={i} style={{ background: "var(--bg3)", borderRadius: 10, padding: "12px", marginBottom: 8 }}>
                          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 8 }}>
                            <Input label="Exercice" value={ex.nom} onChange={v => {
                              const exs = [...seancePerso.exercices]; exs[i] = { ...exs[i], nom: v };
                              setSeancePerso(s => ({ ...s, exercices: exs }));
                            }} placeholder="ex: Squat" />
                            <Input label="Détail" value={ex.detail} onChange={v => {
                              const exs = [...seancePerso.exercices]; exs[i] = { ...exs[i], detail: v };
                              setSeancePerso(s => ({ ...s, exercices: exs }));
                            }} placeholder="ex: 4x6 @ 80kg" />
                          </div>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <Input label="Note (optionnel)" value={ex.note} onChange={v => {
                              const exs = [...seancePerso.exercices]; exs[i] = { ...exs[i], note: v };
                              setSeancePerso(s => ({ ...s, exercices: exs }));
                            }} placeholder="conseil technique..." style={{ flex: 1 }} />
                            {seancePerso.exercices.length > 1 && (
                              <button onClick={() => setSeancePerso(s => ({ ...s, exercices: s.exercices.filter((_, j) => j !== i) }))}
                                style={{ marginLeft: 8, marginTop: 16, background: "none", border: "none", color: "var(--red)", fontSize: 18, cursor: "pointer" }}>×</button>
                            )}
                          </div>
                        </div>
                      ))}
                      <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
                        <Btn variant="dark" size="sm" onClick={() => setSeancePerso(s => ({ ...s, exercices: [...s.exercices, { nom: "", detail: "", note: "" }] }))}>+ Exercice</Btn>
                      </div>
                      <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
                        <Btn variant="dark" onClick={() => setShowSeancePerso(false)} style={{ flex: 1 }}>← Retour</Btn>
                        <Btn disabled={!seancePerso.titre || !seancePerso.exercices[0].nom} onClick={() => {
                          setSession({
                            titre: seancePerso.titre,
                            type: "perso",
                            duree: dailyData.temps,
                            explication: "Séance que tu as créée toi-même.",
                            echauffement: "Échauffement 10 min à ton rythme",
                            exercices: seancePerso.exercices.map(e => ({ nom: e.nom, detail: e.detail, rpe: "selon toi", note: e.note })),
                            retourCalme: "Étirements 5-10 min",
                            nutrition: { avant: "", apres: "" },
                            metrique: "Note tes charges pour suivre ta progression",
                          });
                          setShowSeancePerso(false);
                        }} style={{ flex: 2 }}>✓ Commencer la séance</Btn>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Btn size="lg" onClick={generateSession} style={{ width: "100%", marginBottom: 20 }}>⚡ Générer ma séance du jour</Btn>
              )
            )}
            {loadingSession && (
              <div className="fade-in" style={{ textAlign: "center", padding: "32px 20px", background: "var(--bg2)", borderRadius: 14, border: "1.5px solid rgba(232,255,71,0.15)", marginBottom: 20 }}>
                <div style={{ fontSize: 28, marginBottom: 12 }}>🤖</div>
                <div className="bebas" style={{ fontSize: 18, color: "var(--yellow)", marginBottom: 8 }}>{sessionStreamText || "Coach IA réfléchit..."}</div>
                <div style={{ display: "flex", gap: 6, justifyContent: "center" }}>
                  {[0,1,2].map(i => (
                    <div key={i} style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--yellow)", opacity: 0.6, animation: `pulse 1.2s ${i * 0.2}s ease-in-out infinite` }} />
                  ))}
                </div>
                <div style={{ fontSize: 12, color: "#555", marginTop: 12 }}>Adapté à ton profil et à tes dernières séances</div>
              </div>
            )}

            {session && !showFeedback && !feedback && (
              <div className="slide-up">
                {/* ── HERO SÉANCE ── */}
                {(() => {
                  const typeConf = {
                    running_zone2: { label: "Running Zone 2", color: "var(--green)", bg: "linear-gradient(135deg, #003318 0%, #080808 60%)", border: "rgba(57,255,128,0.25)", icon: "🏃" },
                    force_stations: { label: "Force Stations", color: "var(--yellow)", bg: "linear-gradient(135deg, #131500 0%, #080808 60%)", border: "rgba(232,255,71,0.25)", icon: "🏋️" },
                    running_qualite: { label: "Running Qualité", color: "var(--orange)", bg: "linear-gradient(135deg, #1a0a00 0%, #080808 60%)", border: "rgba(255,154,60,0.25)", icon: "⚡" },
                    hybride_compromis: { label: "Hybride HYROX", color: "var(--purple)", bg: "linear-gradient(135deg, #0d0020 0%, #080808 60%)", border: "rgba(167,139,250,0.25)", icon: "🔀" },
                    coach: { label: "Séance Coach", color: "var(--yellow)", bg: "linear-gradient(135deg, #131500 0%, #080808 60%)", border: "rgba(232,255,71,0.25)", icon: "👨‍💼" },
                    perso: { label: "Séance Perso", color: "#888", bg: "linear-gradient(135deg, #111 0%, #080808 60%)", border: "rgba(255,255,255,0.1)", icon: "✏️" },
                  };
                  const conf = typeConf[session.type] || typeConf.force_stations;
                  const doneCount = Object.values(checkedExercices).filter(Boolean).length;
                  const totalEx = (session.exercices || []).length;
                  const pct = totalEx > 0 ? Math.round((doneCount / totalEx) * 100) : 0;
                  return (
                    <div style={{ background: conf.bg, border: `1.5px solid ${conf.border}`, borderRadius: 20, padding: "20px 18px", marginBottom: 14, position: "relative", overflow: "hidden" }}>
                      {/* Halo */}
                      <div style={{ position: "absolute", top: -40, right: -40, width: 180, height: 180, borderRadius: "50%", background: `radial-gradient(circle, ${conf.color}18 0%, transparent 70%)`, pointerEvents: "none" }} />
                      {/* Type badge */}
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                        <span style={{ fontSize: 18 }}>{conf.icon}</span>
                        <span style={{ fontSize: 10, color: conf.color, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em" }}>{conf.label}</span>
                        <span style={{ fontSize: 10, color: "#333", marginLeft: "auto" }}>⏱ {session.duree} min</span>
                      </div>
                      {/* Titre */}
                      <div className="bebas" style={{ fontSize: 30, color: "var(--white)", lineHeight: 1, letterSpacing: 0.5, marginBottom: 10 }}>{session.titre}</div>
                      {/* Explication */}
                      <div style={{ fontSize: 12, color: "#666", lineHeight: 1.6, marginBottom: 14 }}>{session.explication}</div>
                      {/* Progress ring inline */}
                      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                            <span style={{ fontSize: 11, color: "#444", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em" }}>Exercices</span>
                            <span style={{ fontSize: 11, color: doneCount === totalEx && totalEx > 0 ? "var(--green)" : conf.color, fontWeight: 700 }}>{doneCount}/{totalEx}</span>
                          </div>
                          <div style={{ height: 6, background: "rgba(255,255,255,0.06)", borderRadius: 99, overflow: "hidden" }}>
                            <div style={{ height: "100%", width: `${pct}%`, background: doneCount === totalEx && totalEx > 0 ? "var(--green)" : conf.color, borderRadius: 99, transition: "width 0.4s ease" }} />
                          </div>
                        </div>
                        <div className="bebas" style={{ fontSize: 28, color: doneCount === totalEx && totalEx > 0 ? "var(--green)" : conf.color, lineHeight: 1 }}>{pct}%</div>
                      </div>
                    </div>
                  );
                })()}

                {/* Échauffement */}
                {session.echauffement && (
                  <div style={{ background: "rgba(167,139,250,0.05)", border: "1px solid rgba(167,139,250,0.15)", borderRadius: 14, padding: "12px 16px", marginBottom: 10, display: "flex", gap: 12, alignItems: "flex-start" }}>
                    <div style={{ fontSize: 22, flexShrink: 0 }}>🔥</div>
                    <div>
                      <div style={{ fontSize: 10, color: "var(--purple)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 4 }}>Échauffement</div>
                      <div style={{ fontSize: 13, color: "#bbb", lineHeight: 1.6 }}>{session.echauffement}</div>
                    </div>
                  </div>
                )}

                {/* Programme */}
                <div style={{ marginBottom: 10 }}>
                  {(session.exercices || []).map((ex, i) => {
                    const done = checkedExercices[i];
                    const typeConf2 = {
                      running_zone2: "var(--green)", force_stations: "var(--yellow)",
                      running_qualite: "var(--orange)", hybride_compromis: "var(--purple)",
                    };
                    const accentColor = typeConf2[session.type] || "var(--yellow)";
                    return (
                      <div key={i} className="fade-in-fast"
                        onClick={() => setCheckedExercices(c => ({ ...c, [i]: !c[i] }))}
                        style={{
                          background: done ? "rgba(57,255,128,0.04)" : "rgba(255,255,255,0.02)",
                          border: done ? "1.5px solid rgba(57,255,128,0.3)" : "1px solid rgba(255,255,255,0.05)",
                          borderLeft: done ? "3px solid var(--green)" : `3px solid ${accentColor}66`,
                          borderRadius: 14, padding: "14px 14px 12px 16px", marginBottom: 8,
                          animationDelay: `${i * 0.06}s`, cursor: "pointer",
                          transition: "all 0.2s", opacity: done ? 0.6 : 1,
                        }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 10, flex: 1 }}>
                            {/* Numéro / checkmark */}
                            <div style={{
                              width: 28, height: 28, borderRadius: "50%", flexShrink: 0,
                              background: done ? "var(--green)" : `${accentColor}18`,
                              border: done ? "none" : `2px solid ${accentColor}44`,
                              display: "flex", alignItems: "center", justifyContent: "center",
                              fontSize: done ? 14 : 12, fontWeight: 700,
                              color: done ? "#000" : accentColor, transition: "all 0.25s",
                            }}>{done ? "✓" : i + 1}</div>
                            <div style={{ fontWeight: 700, fontSize: 15, color: done ? "#666" : "var(--white)", textDecoration: done ? "line-through" : "none" }}>{ex.nom}</div>
                          </div>
                          <div style={{ display: "flex", gap: 6, flexShrink: 0, alignItems: "center" }}>
                            {ex.rpe && <div style={{ fontSize: 10, color: "#555", background: "rgba(255,255,255,0.04)", borderRadius: 6, padding: "2px 7px", fontWeight: 700 }}>RPE {ex.rpe}</div>}
                            {findVideoForExercice(ex.nom) && (
                              <button onClick={e => { e.stopPropagation(); setVideoModal(findVideoForExercice(ex.nom)); }} style={{
                                background: "rgba(232,255,71,0.08)", border: "1px solid rgba(232,255,71,0.2)",
                                borderRadius: 6, padding: "2px 8px", fontSize: 10, color: "var(--yellow)",
                                cursor: "pointer", fontWeight: 700,
                              }}>▶</button>
                            )}
                          </div>
                        </div>
                        {ex.detail && <div className="bebas" style={{ fontSize: 24, color: done ? "#555" : accentColor, marginTop: 6, letterSpacing: "0.04em", paddingLeft: 38 }}>{ex.detail}</div>}
                        {ex.note && <div style={{ fontSize: 11, color: "#555", marginTop: 5, lineHeight: 1.5, paddingLeft: 38, borderLeft: "2px solid rgba(255,255,255,0.04)", marginLeft: 38 }}>💬 {ex.note}</div>}
                      </div>
                    );
                  })}

                  {/* Completion card */}
                  {(session.exercices || []).length > 0 && Object.values(checkedExercices).filter(Boolean).length === (session.exercices || []).length && (
                    <div className="float-up" style={{ background: "linear-gradient(135deg, rgba(57,255,128,0.1) 0%, rgba(57,255,128,0.04) 100%)", border: "2px solid rgba(57,255,128,0.4)", borderRadius: 18, padding: "20px", textAlign: "center", marginTop: 6 }}>
                      <div style={{ fontSize: 40, marginBottom: 8 }}>🏆</div>
                      <div className="bebas" style={{ fontSize: 26, color: "var(--green)", letterSpacing: 1, marginBottom: 4 }}>SÉANCE COMPLÈTE !</div>
                      <div style={{ fontSize: 13, color: "#666", marginBottom: 16 }}>Analyse de ton coach IA en cours de génération…</div>
                      <button onClick={() => setShowFeedback(true)} style={{ width: "100%", background: "var(--green)", border: "none", borderRadius: 14, padding: "16px", color: "#000", fontFamily: "'Bebas Neue',sans-serif", fontSize: 20, letterSpacing: 1, cursor: "pointer" }}>
                        VALIDER & ANALYSER MA SÉANCE →
                      </button>
                    </div>
                  )}
                </div>

                {/* Retour au calme + Nutrition */}
                {(session.retourCalme || session.nutrition) && (
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 12 }}>
                    {session.retourCalme && (
                      <div style={{ background: "rgba(167,139,250,0.05)", border: "1px solid rgba(167,139,250,0.12)", borderRadius: 12, padding: "12px 14px" }}>
                        <div style={{ fontSize: 9, color: "var(--purple)", textTransform: "uppercase", fontWeight: 700, letterSpacing: "0.1em", marginBottom: 6 }}>🧘 Retour calme</div>
                        <div style={{ fontSize: 12, color: "#999", lineHeight: 1.5 }}>{session.retourCalme}</div>
                      </div>
                    )}
                    {session.nutrition && (
                      <div style={{ background: "rgba(57,255,128,0.04)", border: "1px solid rgba(57,255,128,0.12)", borderRadius: 12, padding: "12px 14px" }}>
                        <div style={{ fontSize: 9, color: "var(--green)", textTransform: "uppercase", fontWeight: 700, letterSpacing: "0.1em", marginBottom: 6 }}>🥗 Nutrition</div>
                        <div style={{ fontSize: 11, color: "#888", lineHeight: 1.5 }}>🍌 {session.nutrition.avant}</div>
                        <div style={{ fontSize: 11, color: "#888", marginTop: 3 }}>🥤 {session.nutrition.apres}</div>
                      </div>
                    )}
                  </div>
                )}

                {session.metrique && (
                  <div style={{ background: "rgba(232,255,71,0.05)", border: "1px solid rgba(232,255,71,0.15)", borderRadius: 12, padding: "12px 14px", fontSize: 12, color: "var(--yellow)", marginBottom: 14, display: "flex", gap: 8, alignItems: "flex-start" }}>
                    <span style={{ fontSize: 16 }}>🎯</span>
                    <span style={{ lineHeight: 1.5 }}>À noter : {session.metrique}</span>
                  </div>
                )}

                <div style={{ display: "flex", gap: 8 }}>
                  <button onClick={() => setSession(null)} style={{ flex: 1, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, padding: "13px", color: "#666", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>↺ Refaire</button>
                  <button onClick={() => { setChronoMode(true); setChronoRunning(true); setChronoSeconds(0); setCurrentExIdx(0); }} style={{ flex: 1, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, padding: "13px", color: "var(--white)", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>⏱ Chrono</button>
                  <button onClick={() => setShowFeedback(true)} style={{ flex: 2, background: "var(--green)", border: "none", borderRadius: 12, padding: "13px", color: "#000", fontFamily: "'Bebas Neue',sans-serif", fontSize: 18, letterSpacing: 1, cursor: "pointer" }}>✓ TERMINÉE</button>
                </div>
              </div>
            )}

            {showFeedback && (
              <div className="fade-in">
                <div style={{ background: "linear-gradient(145deg, #001a0a 0%, #080808 60%)", border: "1.5px solid rgba(57,255,128,0.25)", borderRadius: 20, padding: "20px 18px" }}>
                  {/* Header */}
                  <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
                    <div style={{ width: 46, height: 46, borderRadius: 14, background: "rgba(57,255,128,0.12)", border: "1px solid rgba(57,255,128,0.3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>📊</div>
                    <div>
                      <div className="bebas" style={{ fontSize: 26, color: "var(--green)", letterSpacing: 1, lineHeight: 1 }}>BILAN DE SÉANCE</div>
                      <div style={{ fontSize: 11, color: "#444", marginTop: 3 }}>Aide ton coach IA à adapter la prochaine séance</div>
                    </div>
                  </div>

                  {/* 1. Ressenti global */}
                  <div style={{ marginBottom: 18 }}>
                    <div style={{ fontSize: 10, color: "#444", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 10 }}>Comment c'était ?</div>
                    <div style={{ display: "flex", gap: 8 }}>
                      {[
                        { v: "facile", emoji: "😪", label: "Trop facile", color: "var(--green)" },
                        { v: "bien", emoji: "💪", label: "Bien calibré", color: "var(--yellow)" },
                        { v: "dur", emoji: "🔥", label: "Trop dur", color: "var(--red)" },
                      ].map(r => {
                        const active = feedbackData.ressenti === r.v;
                        return (
                          <button key={r.v} onClick={() => setFeedbackData(d => ({ ...d, ressenti: r.v }))} style={{
                            flex: 1, padding: "14px 6px", borderRadius: 14, textAlign: "center",
                            background: active ? `${r.color}12` : "rgba(255,255,255,0.02)",
                            border: active ? `2px solid ${r.color}` : "1.5px solid rgba(255,255,255,0.06)",
                            color: "var(--white)", cursor: "pointer", transition: "all 0.2s",
                          }}>
                            <div style={{ fontSize: 28 }}>{r.emoji}</div>
                            <div style={{ fontSize: 10, marginTop: 6, color: active ? r.color : "#444", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em" }}>{r.label}</div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* 2. Difficulté RPE 1-10 */}
                  <div style={{ marginBottom: 18 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                      <div style={{ fontSize: 10, color: "#444", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em" }}>Difficulté (RPE)</div>
                      <div className="bebas" style={{ fontSize: 28, color: feedbackData.difficulte <= 4 ? "var(--green)" : feedbackData.difficulte <= 7 ? "var(--yellow)" : "var(--red)", lineHeight: 1 }}>
                        {feedbackData.difficulte}<span style={{ fontSize: 14, color: "#333" }}>/10</span>
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: 4 }}>
                      {[1,2,3,4,5,6,7,8,9,10].map(v => {
                        const rpeColor = feedbackData.difficulte <= 4 ? "var(--green)" : feedbackData.difficulte <= 7 ? "var(--yellow)" : "var(--red)";
                        return (
                        <button key={v} onClick={() => setFeedbackData(d => ({ ...d, difficulte: v }))} style={{
                          flex: 1, height: 36, borderRadius: 8, border: "none", cursor: "pointer",
                          background: v <= feedbackData.difficulte ? rpeColor : "rgba(255,255,255,0.04)",
                          fontSize: 11, fontWeight: 700,
                          color: v <= feedbackData.difficulte ? "#000" : "#2a2a2a",
                          transition: "all 0.15s",
                        }}>{v}</button>
                      )})}
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4, fontSize: 10, color: "#444" }}>
                      <span>Très facile</span><span>Modéré</span><span>Maximum</span>
                    </div>
                  </div>

                  {/* 3. Photo montre / séance + charges */}
                  <div style={{ marginBottom: 14 }}>
                    <label style={{ fontSize: 11, color: "#aaa", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", display: "block", marginBottom: 8 }}>
                      📸 Photo de ta montre ou de ta séance
                    </label>
                    <label style={{ display: "block", background: "var(--bg3)", border: "1.5px dashed rgba(57,255,128,0.3)", borderRadius: 10, padding: 14, textAlign: "center", cursor: "pointer", marginBottom: 10 }}>
                      <input type="file" accept="image/*" capture="environment" style={{ display: "none" }}
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          setFeedbackData(d => ({ ...d, _analysing: true }));
                          const reader = new FileReader();
                          reader.onload = async (ev) => {
                            const base64 = ev.target.result.split(",")[1];
                            try {
                              const response = await fetch("/api/claude", {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({
                                  model: "claude-sonnet-4-5",
                                  max_tokens: 600,
                                  messages: [{ role: "user", content: [
                                    { type: "image", source: { type: "base64", media_type: file.type, data: base64 } },
                                    { type: "text", text: `Analyse cette photo (montre GPS, résumé séance, capture appli sport). Extrais TOUTES les données visibles : temps total, distance, allure/pace, FC moyenne, FC max, calories, intervalles, temps de travail/repos, charges, reps, sets, tout ce qui est lisible. Réponds en JSON sans backticks : {"resume":"résumé en 1-2 phrases de ce que tu vois","donnees":"toutes les données extraites formatées clairement","temps":"temps total si visible","fcMoy":"FC moyenne si visible","fcMax":"FC max si visible","allure":"allure/pace si visible","calories":"calories si visibles","notes":"autres infos utiles"}` }
                                  ]}]
                                })
                              });
                              const data = await response.json();
                              const text = data.content?.map(b => b.text || "").join("") || "";
                              try {
                                const parsed = JSON.parse(text.replace(/```json|```/g, "").trim());
                                // Pré-remplir les champs avec les données extraites
                                setFeedbackData(d => ({
                                  ...d,
                                  _analysing: false,
                                  _photoAnalyse: parsed.resume || "Photo analysée",
                                  charges: d.charges ? d.charges + "\n" + parsed.donnees : parsed.donnees || "",
                                  temps: d.temps || parsed.temps || "",
                                }));
                              } catch {
                                setFeedbackData(d => ({ ...d, _analysing: false, _photoAnalyse: text.slice(0, 200) }));
                              }
                            } catch (err) {
                              console.error(err);
                              setFeedbackData(d => ({ ...d, _analysing: false }));
                            }
                          };
                          reader.readAsDataURL(file);
                        }}
                      />
                      {feedbackData._analysing ? (
                        <div style={{ color: "var(--green)", fontSize: 13, padding: 8 }}>🤖 Analyse en cours…</div>
                      ) : feedbackData._photoAnalyse ? (
                        <div style={{ textAlign: "left" }}>
                          <div style={{ fontSize: 11, color: "var(--green)", fontWeight: 700, marginBottom: 4 }}>✅ Photo analysée</div>
                          <div style={{ fontSize: 12, color: "#ccc", lineHeight: 1.5 }}>{feedbackData._photoAnalyse}</div>
                          <div style={{ fontSize: 10, color: "#444", marginTop: 6 }}>Tape pour changer la photo</div>
                        </div>
                      ) : (
                        <>
                          <div style={{ fontSize: 22, marginBottom: 6 }}>⌚</div>
                          <div style={{ fontSize: 13, color: "var(--green)", fontWeight: 600 }}>Photo de ta montre ou séance</div>
                          <div style={{ fontSize: 11, color: "#444", marginTop: 4 }}>Garmin · Apple Watch · Polar · Résumé appli</div>
                          <div style={{ fontSize: 10, color: "#333", marginTop: 2 }}>L'IA extrait automatiquement temps, FC, allure, calories…</div>
                        </>
                      )}
                    </label>

                    <label style={{ fontSize: 11, color: "#aaa", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", display: "block", marginBottom: 6 }}>
                      Charges & performances (complète ou corrige)
                    </label>
                    <div style={{ fontSize: 11, color: "#444", marginBottom: 6 }}>
                      {(session?.exercices || []).slice(0,3).map(ex => ex.nom).join(" · ")}…
                    </div>
                    <textarea
                      value={feedbackData.charges}
                      onChange={e => setFeedbackData(d => ({ ...d, charges: e.target.value }))}
                      placeholder="ex: Squat 85kg × 5 · SkiErg 1000m en 4min12 · Run 5km en 24:30"
                      style={{ width: "100%", background: "var(--bg3)", border: "1px solid var(--gray2)", borderRadius: 10, padding: "10px 14px", color: "var(--white)", fontSize: 13, minHeight: 80, resize: "vertical", fontFamily: "var(--font-body)", lineHeight: 1.6 }}
                    />
                  </div>

                  {/* 4. Temps total */}
                  <div style={{ marginBottom: 14 }}>
                    <label style={{ fontSize: 11, color: "#aaa", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", display: "block", marginBottom: 8 }}>
                      Durée réelle de la séance
                    </label>
                    <Input value={feedbackData.temps} onChange={v => setFeedbackData(d => ({ ...d, temps: v }))} placeholder="ex: 58 min" />
                  </div>

                  {/* 5. Douleurs */}
                  <div style={{ marginBottom: 14 }}>
                    <label style={{ fontSize: 11, color: "#aaa", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", display: "block", marginBottom: 8 }}>
                      Douleurs ou inconforts
                    </label>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 8 }}>
                      {["Aucune", "Genou", "Dos", "Épaule", "Cheville", "Hanche", "Coude", "Nuque"].map(z => (
                        <button key={z} onClick={() => {
                          const current = feedbackData.douleurs;
                          if (z === "Aucune") { setFeedbackData(d => ({ ...d, douleurs: "Aucune douleur" })); return; }
                          const arr = current.split(",").map(s => s.trim()).filter(s => s && s !== "Aucune douleur");
                          const idx = arr.indexOf(z);
                          if (idx >= 0) arr.splice(idx, 1); else arr.push(z);
                          setFeedbackData(d => ({ ...d, douleurs: arr.join(", ") }));
                        }} style={{
                          padding: "6px 12px", borderRadius: 20, fontSize: 12, fontWeight: 600,
                          background: feedbackData.douleurs.includes(z) ? "rgba(255,71,71,0.15)" : "var(--bg3)",
                          border: feedbackData.douleurs.includes(z) ? "1.5px solid var(--red)" : "1px solid var(--bg3)",
                          color: feedbackData.douleurs.includes(z) ? "var(--red)" : "#666", cursor: "pointer",
                        }}>{z}</button>
                      ))}
                    </div>
                    <textarea
                      value={feedbackData.douleurs}
                      onChange={e => setFeedbackData(d => ({ ...d, douleurs: e.target.value }))}
                      placeholder="Précise si besoin (intensité, moment...)"
                      style={{ width: "100%", background: "var(--bg3)", border: "1px solid var(--gray2)", borderRadius: 10, padding: "10px 14px", color: "var(--white)", fontSize: 13, minHeight: 50, resize: "vertical", fontFamily: "var(--font-body)" }}
                    />
                  </div>

                  {/* 6. Énergie post-séance */}
                  <div style={{ marginBottom: 18 }}>
                    <div style={{ fontSize: 11, color: "#aaa", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 10 }}>Énergie après la séance</div>
                    <div style={{ display: "flex", gap: 6 }}>
                      {[
                        { v: 1, emoji: "💀", label: "À plat" },
                        { v: 2, emoji: "😓", label: "Fatigué" },
                        { v: 3, emoji: "😊", label: "Normal" },
                        { v: 4, emoji: "💪", label: "Bien" },
                        { v: 5, emoji: "⚡", label: "Plein d'énergie" },
                      ].map(e => (
                        <button key={e.v} onClick={() => setFeedbackData(d => ({ ...d, energie: e.v }))} style={{
                          flex: 1, padding: "8px 4px", borderRadius: 10, textAlign: "center",
                          background: feedbackData.energie === e.v ? "rgba(232,255,71,0.1)" : "var(--bg3)",
                          border: feedbackData.energie === e.v ? "2px solid var(--yellow)" : "1.5px solid transparent",
                          color: "var(--white)", cursor: "pointer",
                        }}>
                          <div style={{ fontSize: 18 }}>{e.emoji}</div>
                          <div style={{ fontSize: 8, marginTop: 3, color: feedbackData.energie === e.v ? "var(--yellow)" : "#555" }}>{e.label}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* 7. Exercices détaillés */}
                  {(session?.exercices || []).length > 0 && (
                    <div style={{ marginBottom: 18 }}>
                      <div style={{ fontSize: 11, color: "#aaa", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 4 }}>Détail exercice par exercice</div>
                      <div style={{ fontSize: 11, color: "#444", marginBottom: 10 }}>Remplis ce que tu as réellement fait — laisse vide si tu n'as pas fait l'exercice</div>
                      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                        {(session.exercices || []).map((ex, i) => {
                          const log = feedbackData.exercicesLog[i] || { nom: ex.nom, charge: "", reps: "", sets: "", ressenti: "bien" };
                          const updateLog = (field, val) => {
                            const newLog = [...(feedbackData.exercicesLog || [])];
                            newLog[i] = { ...log, [field]: val };
                            setFeedbackData(d => ({ ...d, exercicesLog: newLog }));
                          };
                          return (
                            <div key={i} style={{ background: "var(--bg3)", borderRadius: 10, padding: "12px 14px" }}>
                              <div style={{ fontWeight: 700, fontSize: 13, color: "var(--white)", marginBottom: 8 }}>{ex.nom}</div>
                              <div style={{ fontSize: 11, color: "#555", marginBottom: 8 }}>Prévu: {ex.detail}</div>
                              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 8 }}>
                                <Input label="Charge (kg)" value={log.charge} onChange={v => updateLog("charge", v)} type="number" placeholder="ex: 85" />
                                <Input label="Reps" value={log.reps} onChange={v => updateLog("reps", v)} type="number" placeholder="ex: 5" />
                                <Input label="Sets" value={log.sets} onChange={v => updateLog("sets", v)} type="number" placeholder="ex: 4" />
                              </div>
                              <div style={{ display: "flex", gap: 6 }}>
                                {[{ v: "facile", label: "😴 Facile" }, { v: "bien", label: "✓ OK" }, { v: "dur", label: "🔥 Dur" }].map(r => (
                                  <button key={r.v} onClick={() => updateLog("ressenti", r.v)} style={{
                                    flex: 1, padding: "5px", borderRadius: 6, fontSize: 11, fontWeight: 600,
                                    background: log.ressenti === r.v ? "rgba(232,255,71,0.1)" : "var(--bg2)",
                                    border: log.ressenti === r.v ? "1.5px solid var(--yellow)" : "1px solid transparent",
                                    color: log.ressenti === r.v ? "var(--yellow)" : "#555", cursor: "pointer",
                                  }}>{r.label}</button>
                                ))}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* 8. Notes libres */}
                  <div style={{ marginBottom: 18 }}>
                    <label style={{ fontSize: 11, color: "#aaa", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", display: "block", marginBottom: 8 }}>Notes libres</label>
                    <textarea
                      value={feedbackData.notes}
                      onChange={e => setFeedbackData(d => ({ ...d, notes: e.target.value }))}
                      placeholder="Tout ce qui te semble important pour la prochaine fois..."
                      style={{ width: "100%", background: "var(--bg3)", border: "1px solid var(--gray2)", borderRadius: 10, padding: "10px 14px", color: "var(--white)", fontSize: 13, minHeight: 60, resize: "vertical", fontFamily: "var(--font-body)" }}
                    />
                  </div>

                  {loadingFeedback ? (
                    <div className="fade-in" style={{ textAlign: "center", padding: "28px 20px", background: "var(--bg3)", borderRadius: 14 }}>
                      <div style={{ fontSize: 28, marginBottom: 10 }}>🤖</div>
                      <div className="bebas" style={{ fontSize: 16, color: "var(--green)", marginBottom: 8 }}>{feedbackStreamText || "Coach IA analyse ta séance..."}</div>
                      <div style={{ display: "flex", gap: 6, justifyContent: "center" }}>
                        {[0,1,2].map(i => (
                          <div key={i} style={{ width: 7, height: 7, borderRadius: "50%", background: "var(--green)", opacity: 0.6, animation: `pulse 1.2s ${i * 0.2}s ease-in-out infinite` }} />
                        ))}
                      </div>
                      <div style={{ fontSize: 11, color: "#444", marginTop: 10 }}>Individualisation du programme en cours...</div>
                    </div>
                  ) : (
                    <div style={{ display: "flex", gap: 12 }}>
                      <Btn variant="dark" onClick={() => setShowFeedback(false)} style={{ flex: 1 }}>← Retour</Btn>
                      <Btn variant="success" onClick={submitFeedback} style={{ flex: 2 }}>Envoyer au coach 🚀</Btn>
                    </div>
                  )}
                </div>
              </div>
            )}

            {feedback && (
              <div className="fade-in">
                {/* 🎉 ÉCRAN DE CÉLÉBRATION */}
                {(() => {
                  const sc = calcFitnessScore(profile);
                  const nbSessions = (profile.sessions||[]).length;
                  const isMilestone = [1,5,10,25,50].includes(nbSessions);
                  const milestoneLabel = nbSessions === 1 ? "PREMIÈRE SÉANCE ! 🎯" : `${nbSessions}ÈME SÉANCE ! 🔥`;
                  const ressentiEmoji = feedbackData.ressenti === "bien" ? "💪" : feedbackData.ressenti === "facile" ? "😪" : "🔥";
                  return (
                    <div style={{ background: "linear-gradient(145deg, #001a0a 0%, #080808 50%, #001208 100%)", border: "1.5px solid rgba(57,255,128,0.25)", borderRadius: 22, padding: "24px 20px", marginBottom: 16, position: "relative", overflow: "hidden" }}>
                      {/* Confettis CSS */}
                      <div style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden" }}>
                        {[...Array(12)].map((_, i) => (
                          <div key={i} style={{
                            position: "absolute",
                            width: 6, height: 6, borderRadius: i % 3 === 0 ? "50%" : 2,
                            background: ["var(--yellow)","var(--green)","var(--orange)","var(--purple)","var(--red)"][i % 5],
                            left: `${8 + i * 7.5}%`,
                            top: `-10px`,
                            opacity: 0.7,
                            animation: `floatUp ${0.8 + i * 0.15}s cubic-bezier(0.16, 1, 0.3, 1) ${i * 0.07}s both`,
                            transform: `rotate(${i * 30}deg)`,
                          }} />
                        ))}
                      </div>
                      <div style={{ position: "absolute", top: -40, right: -40, fontSize: 120, opacity: 0.04 }}>✓</div>

                      {/* Titre */}
                      <div style={{ textAlign: "center", marginBottom: 18 }}>
                        <div style={{ fontSize: 36, marginBottom: 8 }}>{ressentiEmoji}</div>
                        <div className="bebas" style={{ fontSize: 32, color: "var(--green)", letterSpacing: 2, lineHeight: 1 }}>SÉANCE TERMINÉE</div>
                        {isMilestone && (
                          <div style={{ marginTop: 8, background: "rgba(232,255,71,0.1)", border: "1px solid rgba(232,255,71,0.3)", borderRadius: 10, padding: "6px 16px", display: "inline-block" }}>
                            <span className="bebas" style={{ fontSize: 16, color: "var(--yellow)", letterSpacing: 1 }}>{milestoneLabel}</span>
                          </div>
                        )}
                      </div>

                      {/* Stats live */}
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 16 }}>
                        {[
                          { label: "Séances", value: nbSessions, color: "var(--yellow)" },
                          { label: "Score", value: sc.global, color: "var(--green)" },
                          { label: "RPE", value: `${feedbackData.difficulte}/10`, color: feedbackData.difficulte >= 8 ? "var(--red)" : feedbackData.difficulte >= 5 ? "var(--orange)" : "var(--green)" },
                        ].map(item => (
                          <div key={item.label} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 12, padding: "12px 8px", textAlign: "center" }}>
                            <div className="bebas" style={{ fontSize: 30, color: item.color, lineHeight: 1 }}>{item.value}</div>
                            <div style={{ fontSize: 9, color: "#444", textTransform: "uppercase", marginTop: 3, letterSpacing: "0.1em" }}>{item.label}</div>
                          </div>
                        ))}
                      </div>

                      {/* Message motivation */}
                      <div style={{ background: "rgba(57,255,128,0.06)", border: "1px solid rgba(57,255,128,0.12)", borderRadius: 12, padding: "12px 14px", textAlign: "center" }}>
                        <div style={{ fontSize: 13, color: "#999", lineHeight: 1.6, fontStyle: "italic" }}>
                          {feedbackData.ressenti === "bien" ? '"Parfaitement calibré. C\'est dans cette zone que tu progresses le plus."'
                            : feedbackData.ressenti === "dur" ? '"Les séances difficiles sont celles qui te construisent. Récupère bien."'
                            : '"Ton corps récupère vite. Pense à augmenter l\'intensité."'}
                        </div>
                      </div>
                    </div>
                  );
                })()}

                {/* Alerte urgente */}
                {feedback.alerteCoach && (
                  <div style={{ background: feedback.niveauAlerte === "blessure" ? "rgba(255,71,71,0.1)" : "rgba(255,154,60,0.1)", border: `1.5px solid ${feedback.niveauAlerte === "blessure" ? "var(--red)" : "#ff9a3c"}`, borderRadius: 12, padding: 14, marginBottom: 12 }}>
                    <div style={{ fontWeight: 700, fontSize: 14, color: feedback.niveauAlerte === "blessure" ? "var(--red)" : "#ff9a3c", marginBottom: 6 }}>
                      {feedback.niveauAlerte === "blessure" ? "🚨 ALERTE BLESSURE — Coach prévenu" : "⚠️ Signal de surmenage — Coach prévenu"}
                    </div>
                    <div style={{ fontSize: 13, color: "#ccc" }}>{feedback.raisonAlerte}</div>
                  </div>
                )}

                {/* Analyse */}
                <Card style={{ border: "1.5px solid rgba(57,255,128,0.3)", marginBottom: 12 }}>
                  <div className="bebas" style={{ fontSize: 18, color: "var(--green)", marginBottom: 10 }}>📊 ANALYSE DE TA SÉANCE</div>
                  <p style={{ fontSize: 13, color: "#ccc", lineHeight: 1.7, marginBottom: 12 }}>{feedback.analyse || feedback.message}</p>

                  {/* Progressions par exercice */}
                  {(feedback.progressions || []).length > 0 && (
                    <div style={{ marginBottom: 10 }}>
                      <div style={{ fontSize: 11, color: "#555", textTransform: "uppercase", fontWeight: 700, marginBottom: 8 }}>Progressions détectées</div>
                      {feedback.progressions.map((p, i) => (
                        <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 0", borderBottom: i < feedback.progressions.length - 1 ? "1px solid var(--bg3)" : "none" }}>
                          <span style={{ fontSize: 13, color: "#aaa" }}>{p.exercice}</span>
                          <div style={{ textAlign: "right" }}>
                            <span style={{ fontSize: 12, color: "#555", textDecoration: "line-through", marginRight: 6 }}>{p.avant}</span>
                            <span style={{ fontSize: 13, fontWeight: 700, color: "var(--green)" }}>{p.apres}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Adaptation résumé */}
                  <div style={{ background: "rgba(232,255,71,0.06)", border: "1px solid rgba(232,255,71,0.2)", borderRadius: 8, padding: 10 }}>
                    <div style={{ fontSize: 11, color: "var(--yellow)", fontWeight: 700, marginBottom: 4 }}>📋 Adaptation pour la prochaine séance</div>
                    <div style={{ fontSize: 12, color: "#ccc", lineHeight: 1.6 }}>{feedback.adaptation}</div>
                  </div>
                </Card>

                {/* Prochaine séance prête */}
                {feedback.prochaine_seance && (
                  <Card style={{ border: "1.5px solid rgba(232,255,71,0.3)", marginBottom: 12 }}>
                    <div className="bebas" style={{ fontSize: 18, color: "var(--yellow)", marginBottom: 4 }}>⚡ PROCHAINE SÉANCE PRÊTE</div>
                    <div style={{ fontSize: 12, color: "#666", marginBottom: 10 }}>{feedback.prochaine_seance.titre}</div>
                    {(feedback.prochaine_seance.exercices || []).map((ex, i) => (
                      <div key={i} style={{ background: "var(--bg3)", borderRadius: 8, padding: "8px 12px", marginBottom: 6 }}>
                        <div style={{ fontWeight: 700, fontSize: 13 }}>{ex.nom}</div>
                        <div style={{ color: "var(--yellow)", fontSize: 13, marginTop: 2 }}>{ex.detail}</div>
                        {ex.note && <div style={{ color: "#555", fontSize: 11, marginTop: 2 }}>💬 {ex.note}</div>}
                      </div>
                    ))}
                    {feedback.prochaine_seance.conseil && (
                      <div style={{ marginTop: 8, fontSize: 12, color: "#888", fontStyle: "italic" }}>💡 {feedback.prochaine_seance.conseil}</div>
                    )}
                  </Card>
                )}

                <Btn variant="success" onClick={() => {
                  // Si prochaine séance prête, la charger directement
                  if (feedback.prochaine_seance) setSession(feedback.prochaine_seance);
                  setFeedback(null);
                  setFeedbackData({ ressenti: "bien", difficulte: 5, exercicesLog: [], charges: "", temps: "", douleurs: "", energie: 3, notes: "" });
      setSeancePerso({ titre: "", exercices: [{ nom: "", detail: "", note: "" }] });
      setShowSeancePerso(false);
                  if (!feedback.prochaine_seance) setSession(null);
                }} style={{ width: "100%" }}>
                  {feedback.prochaine_seance ? "Voir ma prochaine séance →" : "Nouvelle séance →"}
                </Btn>
              </div>
            )}
          </div>
        )}

        {/* PROGRESSION / FORME */}
        {tab === "progress" && (
          <div className="fade-in">
            {/* Graphique courbe fitness score SVG */}
            {(profile.sessions||[]).length >= 2 && (() => {
              const sessions = (profile.sessions||[]).slice(-10);
              const scores = sessions.map((s, i) => {
                // Simule une progression du score basée sur l'index et le ressenti
                const base = calcFitnessScore(profile).global;
                const delta = (i - sessions.length + 1) * 1.2;
                const ressentiBump = s.ressenti === "bien" ? 1 : s.ressenti === "dur" ? -0.5 : 0.5;
                return Math.max(10, Math.min(100, Math.round(base + delta + ressentiBump)));
              });
              const W = 320; const H = 100; const pad = 16;
              const minS = Math.max(0, Math.min(...scores) - 10);
              const maxS = Math.min(100, Math.max(...scores) + 10);
              const range = maxS - minS || 1;
              const pts = scores.map((v, i) => {
                const x = pad + (i / (scores.length - 1)) * (W - 2 * pad);
                const y = H - pad - ((v - minS) / range) * (H - 2 * pad);
                return [x, y];
              });
              const lineD = pts.map((p, i) => `${i === 0 ? "M" : "L"}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(" ");
              // Courbe lissée avec cubic bezier
              const smoothD = pts.reduce((acc, p, i) => {
                if (i === 0) return `M${p[0].toFixed(1)},${p[1].toFixed(1)}`;
                const prev = pts[i - 1];
                const cpx = (prev[0] + p[0]) / 2;
                return acc + ` C${cpx.toFixed(1)},${prev[1].toFixed(1)} ${cpx.toFixed(1)},${p[1].toFixed(1)} ${p[0].toFixed(1)},${p[1].toFixed(1)}`;
              }, "");
              const areaD = smoothD + ` L${pts[pts.length-1][0].toFixed(1)},${H - pad} L${pts[0][0].toFixed(1)},${H - pad} Z`;
              const lastScore = scores[scores.length - 1];
              const firstScore = scores[0];
              const delta = lastScore - firstScore;
              const scoreColor = delta >= 0 ? "var(--green)" : "var(--red)";
              return (
                <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 18, padding: "16px 16px 12px", marginBottom: 16, overflow: "hidden", position: "relative" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                    <div>
                      <div style={{ fontSize: 10, color: "#333", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 4 }}>Score Fitness · {sessions.length} séances</div>
                      <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                        <div className="bebas" style={{ fontSize: 42, color: scoreColor, lineHeight: 1 }}>{lastScore}</div>
                        <div style={{ fontSize: 13, color: delta >= 0 ? "var(--green)" : "var(--red)", fontWeight: 700 }}>{delta >= 0 ? "+" : ""}{delta}</div>
                      </div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: 10, color: "#333", marginBottom: 4 }}>Tendance</div>
                      <div style={{ fontSize: 22 }}>{delta >= 5 ? "🚀" : delta >= 0 ? "📈" : "📉"}</div>
                    </div>
                  </div>
                  <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ overflow: "visible" }}>
                    <defs>
                      <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={delta >= 0 ? "#39ff80" : "#ff4747"} stopOpacity="0.18" />
                        <stop offset="100%" stopColor={delta >= 0 ? "#39ff80" : "#ff4747"} stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    {/* Grille horizontale */}
                    {[0.25, 0.5, 0.75].map((p, i) => (
                      <line key={i} x1={pad} y1={pad + p * (H - 2 * pad)} x2={W - pad} y2={pad + p * (H - 2 * pad)}
                        stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
                    ))}
                    {/* Zone remplie */}
                    <path d={areaD} fill="url(#areaGrad)" />
                    {/* Courbe principale */}
                    <path d={smoothD} fill="none" stroke={delta >= 0 ? "var(--green)" : "var(--red)"} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                    {/* Points */}
                    {pts.map((p, i) => (
                      <circle key={i} cx={p[0]} cy={p[1]} r={i === pts.length - 1 ? 5 : 3}
                        fill={i === pts.length - 1 ? (delta >= 0 ? "var(--green)" : "var(--red)") : "#080808"}
                        stroke={delta >= 0 ? "var(--green)" : "var(--red)"} strokeWidth="2" />
                    ))}
                    {/* Score sur le dernier point */}
                    <text x={pts[pts.length-1][0]} y={pts[pts.length-1][1] - 10} textAnchor="middle"
                      fontFamily="'Bebas Neue',sans-serif" fontSize="13" fill={delta >= 0 ? "var(--green)" : "var(--red)"}>{lastScore}</text>
                  </svg>
                  {/* Labels séances */}
                  <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4, paddingLeft: pad, paddingRight: pad }}>
                    <div style={{ fontSize: 9, color: "#222" }}>S1</div>
                    <div style={{ fontSize: 9, color: "#222" }}>S{sessions.length}</div>
                  </div>
                </div>
              );
            })()}

            {/* Résumé hebdo si dimanche */}
            {new Date().getDay() === 0 && <WeeklySummaryCard profile={profile} />}

            {/* Heatmap régularité */}
            <TrainingHeatmap profile={profile} />

            {/* Radar profil athlète */}
            <RadarChart profile={profile} />

            {/* Courbe RPE */}
            <RPELineChart profile={profile} />

            {/* Multi-charges Squat + Deadlift */}
            <MultiChargesChart profile={profile} />

            <Section title="Condition physique">
              <FitnessScoreCard profile={profile} />
            </Section>

            {/* Niveau visuel avec progression */}
            <Section title="Niveau & objectif">
              <NiveauVisuelCard profile={profile} />
            </Section>

            {/* Graphique progression des charges (barres) */}
            <Section title="Progression des charges">
              <ProgressionChargesCard profile={profile} />
            </Section>

            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 11, color: "#333", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 12 }}>Stats globales</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                {[
                  { label: "Séances", value: profile.sessions?.length || 0, unit: "réalisées", color: "var(--yellow)", bg: "linear-gradient(135deg, #131500 0%, #0a0a00 100%)", border: "rgba(232,255,71,0.2)", icon: "📅" },
                  { label: "Niveau", value: profile.level || "?", unit: LEVELS[(profile.level||1)-1]?.label || "HYROX", color: LEVELS[(profile.level||1)-1]?.color || "var(--green)", bg: "linear-gradient(135deg, #001a0a 0%, #000a05 100%)", border: "rgba(57,255,128,0.2)", icon: "🏆" },
                  { label: "VMA", value: profile.vmaKmh || "—", unit: "km/h", color: "var(--green)", bg: "linear-gradient(135deg, #001a0a 0%, #000a05 100%)", border: "rgba(57,255,128,0.15)", icon: "🏃" },
                  { label: "Squat 1RM", value: profile.squat1RM_final || "—", unit: "kg", color: "var(--orange)", bg: "linear-gradient(135deg, #1a0800 0%, #0a0400 100%)", border: "rgba(255,154,60,0.2)", icon: "🏋️" },
                ].map(item => (
                  <div key={item.label} style={{ background: item.bg, border: `1.5px solid ${item.border}`, borderRadius: 16, padding: "16px 14px", position: "relative", overflow: "hidden" }}>
                    <div style={{ position: "absolute", top: -20, right: -20, fontSize: 50, opacity: 0.06 }}>{item.icon}</div>
                    <div style={{ fontSize: 10, color: "#333", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>{item.label}</div>
                    <div className="bebas" style={{ fontSize: 38, color: item.color, lineHeight: 1 }}>{item.value}</div>
                    <div style={{ fontSize: 11, color: "#444", marginTop: 4 }}>{item.unit}</div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                <div style={{ fontSize: 11, color: "#333", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em" }}>Journal de séances</div>
                <div style={{ fontSize: 12, color: "#444", fontWeight: 600 }}>{(profile.sessions||[]).length} séances</div>
              </div>
              {(profile.sessions || []).length === 0 ? (
                <div style={{ background: "rgba(255,255,255,0.02)", border: "1px dashed rgba(255,255,255,0.08)", borderRadius: 16, padding: "32px 20px", textAlign: "center" }}>
                  <div style={{ fontSize: 40, marginBottom: 12 }}>🏋️</div>
                  <div style={{ fontSize: 14, color: "#555", lineHeight: 1.6 }}>Aucune séance enregistrée.<br/>Lance ta première séance !</div>
                </div>
              ) : (
                <>
                  {/* Résumé rapide — visuel */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 16 }}>
                    {[
                      { label: "Facile", emoji: "😪", count: (profile.sessions||[]).filter(s=>s.ressenti==="facile").length, color: "var(--green)", bg: "rgba(57,255,128,0.06)" },
                      { label: "Calibré", emoji: "💪", count: (profile.sessions||[]).filter(s=>s.ressenti==="bien").length, color: "var(--yellow)", bg: "rgba(232,255,71,0.05)" },
                      { label: "Dur", emoji: "🔥", count: (profile.sessions||[]).filter(s=>s.ressenti==="dur").length, color: "var(--red)", bg: "rgba(255,71,71,0.06)" },
                    ].map(item => (
                      <div key={item.label} style={{ background: item.bg, border: `1px solid ${item.color}22`, borderRadius: 12, padding: "14px 8px", textAlign: "center" }}>
                        <div style={{ fontSize: 22, marginBottom: 4 }}>{item.emoji}</div>
                        <div className="bebas" style={{ fontSize: 28, color: item.color, lineHeight: 1 }}>{item.count}</div>
                        <div style={{ fontSize: 10, color: "#444", marginTop: 3, textTransform: "uppercase", letterSpacing: "0.06em" }}>{item.label}</div>
                      </div>
                    ))}
                  </div>
                  {/* Liste séances */}
                  {(profile.sessions || []).slice().reverse().map((s, i) => {
                    const num = (profile.sessions||[]).length - i;
                    const adapt = (profile.adaptations||[])[num - 1];
                    const ressentiColor = s.ressenti === "bien" ? "var(--green)" : s.ressenti === "facile" ? "var(--yellow)" : "var(--red)";
                    const typeIco = s.type === "running_zone2" ? "🏃" : s.type === "force_stations" ? "🏋️" : s.type === "running_qualite" ? "⚡" : s.type === "hybride_compromis" ? "🔀" : "💪";
                    return (
                      <div key={i} style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", borderLeft: `3px solid ${ressentiColor}`, borderRadius: 14, padding: "14px 16px", marginBottom: 8 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 3 }}>
                              <span style={{ fontSize: 14 }}>{typeIco}</span>
                              <span style={{ fontSize: 10, color: "#333", fontWeight: 600 }}>#{num}</span>
                              <span style={{ fontSize: 9, color: "#333" }}>·</span>
                              <span style={{ fontSize: 10, color: "#444" }}>{new Date(s.date).toLocaleDateString("fr-FR", { weekday: "short", day: "numeric", month: "short" })}</span>
                            </div>
                            <div style={{ fontWeight: 700, fontSize: 14, color: "var(--white)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{s.titre}</div>
                          </div>
                          <div style={{ textAlign: "right", flexShrink: 0, marginLeft: 10 }}>
                            <div className="bebas" style={{ fontSize: 24, color: ressentiColor, lineHeight: 1 }}>{s.difficulte || "—"}<span style={{ fontSize: 10, color: "#333" }}>/10</span></div>
                            <div style={{ fontSize: 9, color: ressentiColor, fontWeight: 700, textTransform: "uppercase" }}>{s.ressenti === "bien" ? "Calibré" : s.ressenti === "facile" ? "Facile" : "Dur"}</div>
                          </div>
                        </div>
                        <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
                          {s.tempsReel && <span style={{ fontSize: 9, color: "#444", background: "rgba(255,255,255,0.04)", borderRadius: 5, padding: "2px 7px" }}>⏱ {s.tempsReel}</span>}
                          {s.energie && <span style={{ fontSize: 9, color: "#444", background: "rgba(255,255,255,0.04)", borderRadius: 5, padding: "2px 7px" }}>⚡ {s.energie}/5</span>}
                          {s.douleurs && s.douleurs !== "Aucune douleur" && <span style={{ fontSize: 9, color: "var(--red)", background: "rgba(255,71,71,0.08)", borderRadius: 5, padding: "2px 7px" }}>⚠️ {s.douleurs}</span>}
                        </div>
                        {s.charges && <div style={{ fontSize: 11, color: "#444", marginTop: 6, lineHeight: 1.5 }}>{s.charges.slice(0, 80)}{s.charges.length > 80 ? "…" : ""}</div>}
                        {adapt && (
                          <div style={{ marginTop: 8, background: "rgba(232,255,71,0.05)", borderRadius: 8, padding: "6px 10px", fontSize: 11, color: "var(--yellow)", lineHeight: 1.4 }}>
                            🤖 {adapt.adaptation}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </>
              )}
            </div>

            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 11, color: "#333", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 12 }}>Adaptations IA</div>
              {(profile.adaptations || []).length === 0 ? (
                <div style={{ background: "rgba(255,255,255,0.02)", border: "1px dashed rgba(255,255,255,0.06)", borderRadius: 12, padding: "20px", textAlign: "center", fontSize: 13, color: "#444" }}>🤖 Pas encore d'adaptations IA.</div>
              ) : (
                (profile.adaptations || []).slice(-5).reverse().map((a, i) => (
                  <div key={i} style={{ background: "rgba(57,255,128,0.03)", border: "1px solid rgba(57,255,128,0.1)", borderLeft: "3px solid rgba(57,255,128,0.4)", borderRadius: 12, padding: "12px 14px", marginBottom: 8 }}>
                    <div style={{ fontSize: 12, color: "#aaa", lineHeight: 1.6, marginBottom: 6 }}>{a.message}</div>
                    <div style={{ fontSize: 12, color: "var(--green)", fontWeight: 600 }}>→ {a.adaptation}</div>
                    <div style={{ fontSize: 10, color: "#333", marginTop: 4 }}>{new Date(a.date).toLocaleDateString("fr-FR")}</div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* ZONES */}
        {tab === "zones" && (
          <div className="fade-in">
            {/* Header */}
            <div style={{ marginBottom: 16 }}>
              <div className="bebas" style={{ fontSize: 28, color: "var(--green)", letterSpacing: 1, marginBottom: 2 }}>ZONES D'ENTRAÎNEMENT</div>
              <div style={{ fontSize: 12, color: "#444" }}>Basé sur ta VMA · {profile.vmaKmh ? `${profile.vmaKmh} km/h` : "VMA non renseignée"}</div>
            </div>

            {profile.vmaKmh ? (
              <>
                {/* FC info card */}
                {profile.fcMax && profile.fcMin && (
                  <div style={{ background: "rgba(255,71,71,0.05)", border: "1px solid rgba(255,71,71,0.15)", borderRadius: 14, padding: "12px 16px", marginBottom: 14, display: "flex", gap: 16 }}>
                    <div style={{ textAlign: "center" }}>
                      <div className="bebas" style={{ fontSize: 24, color: "var(--red)", lineHeight: 1 }}>{profile.fcMax}</div>
                      <div style={{ fontSize: 9, color: "#444", textTransform: "uppercase", marginTop: 2 }}>FC max</div>
                    </div>
                    <div style={{ width: 1, background: "rgba(255,255,255,0.06)" }} />
                    <div style={{ textAlign: "center" }}>
                      <div className="bebas" style={{ fontSize: 24, color: "#888", lineHeight: 1 }}>{profile.fcMin}</div>
                      <div style={{ fontSize: 9, color: "#444", textTransform: "uppercase", marginTop: 2 }}>FC repos</div>
                    </div>
                    <div style={{ flex: 1, display: "flex", alignItems: "center" }}>
                      <div style={{ fontSize: 11, color: "#444" }}>Méthode Karvonen · FC de réserve {parseInt(profile.fcMax) - parseInt(profile.fcMin)} bpm</div>
                    </div>
                  </div>
                )}

                {/* Zones visuelles */}
                {(() => {
                  const zoneColors = ["#3b82f6","#22c55e","#eab308","#f97316","#ef4444"];
                  const zoneDescs = ["Récupération active","Endurance fondamentale","Tempo · Seuil aérobie","Seuil anaérobie","VO2max · Sprint"];
                  return ZONES.map((z, idx) => {
                    const midPct = (z.pct[0] + z.pct[1]) / 2;
                    const hasKarvo = profile.fcMax && profile.fcMin;
                    const fcR = hasKarvo ? parseInt(profile.fcMax) - parseInt(profile.fcMin) : 0;
                    const fcLow = hasKarvo ? Math.round(parseInt(profile.fcMin) + fcR * z.pct[0] / 100) : null;
                    const fcHigh = hasKarvo ? Math.round(parseInt(profile.fcMin) + fcR * z.pct[1] / 100) : null;
                    const col = zoneColors[idx] || "var(--yellow)";
                    const barWidth = z.pct[1] - z.pct[0];
                    return (
                      <div key={z.z} style={{ background: `${col}08`, border: `1px solid ${col}22`, borderLeft: `3px solid ${col}`, borderRadius: 14, padding: "14px 16px", marginBottom: 8 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                            <div style={{ width: 32, height: 32, borderRadius: 10, background: `${col}20`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                              <span className="bebas" style={{ fontSize: 18, color: col }}>{z.z}</span>
                            </div>
                            <div>
                              <div style={{ fontWeight: 700, fontSize: 14, color: "var(--white)" }}>{z.label}</div>
                              <div style={{ fontSize: 11, color: "#444", marginTop: 1 }}>{zoneDescs[idx]}</div>
                            </div>
                          </div>
                          <div style={{ textAlign: "right" }}>
                            <div className="bebas" style={{ fontSize: 20, color: col, lineHeight: 1 }}>{paceFromVMA(profile.vmaKmh, midPct)}</div>
                            <div style={{ fontSize: 10, color: "#444" }}>min/km</div>
                          </div>
                        </div>
                        {/* Barre d'intensité */}
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <div style={{ flex: 1, height: 4, background: "rgba(255,255,255,0.04)", borderRadius: 99, position: "relative", overflow: "hidden" }}>
                            <div style={{ position: "absolute", left: `${z.pct[0]}%`, width: `${barWidth}%`, height: "100%", background: col, borderRadius: 99 }} />
                          </div>
                          <div style={{ fontSize: 10, color: "#444", flexShrink: 0 }}>{z.pct[0]}–{z.pct[1]}%</div>
                        </div>
                        {hasKarvo && fcLow && (
                          <div style={{ marginTop: 6, fontSize: 11, color: `${col}99` }}>❤️ {fcLow}–{fcHigh} bpm</div>
                        )}
                      </div>
                    );
                  });
                })()}

                {/* Pourcentages charge */}
                {profile.squat1RM_final && (
                  <div style={{ marginTop: 16 }}>
                    <div className="bebas" style={{ fontSize: 18, color: "var(--yellow)", marginBottom: 10 }}>CHARGES AU SQUAT</div>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 6 }}>
                      {[50, 60, 70, 75, 80, 85, 90, 95].map(pct => {
                        const kg = Math.round(profile.squat1RM_final * pct / 100);
                        const intensity = pct >= 90 ? "var(--red)" : pct >= 80 ? "var(--orange)" : pct >= 70 ? "var(--yellow)" : "var(--green)";
                        return (
                          <div key={pct} style={{ background: `${intensity}08`, border: `1px solid ${intensity}22`, borderRadius: 12, padding: "12px 8px", textAlign: "center" }}>
                            <div className="bebas" style={{ fontSize: 22, color: intensity, lineHeight: 1 }}>{kg}</div>
                            <div style={{ fontSize: 9, color: "#333", marginTop: 3 }}>kg</div>
                            <div style={{ fontSize: 10, color: "#444", marginTop: 1, fontWeight: 700 }}>{pct}%</div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div style={{ background: "rgba(255,255,255,0.02)", border: "1px dashed rgba(255,255,255,0.08)", borderRadius: 16, padding: "40px 20px", textAlign: "center" }}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>🏃</div>
                <div style={{ fontSize: 14, color: "#555", lineHeight: 1.6 }}>Complète le test VMA pour calculer tes zones.</div>
              </div>
            )}
          </div>
        )}

        {/* COURSE & TECHNIQUE */}
        {tab === "nutri" && <NutritionTab profile={profile} />}
        {tab === "technique" && <TechniqueTab />}
        {tab === "profil" && <ProfilTab profile={profile} onUpdateProfile={onUpdateProfile} onLogout={onLogout} installPrompt={installPrompt} isInstalled={isInstalled} triggerInstall={triggerInstall} notifGranted={notifGranted} requestNotifPermission={requestNotifPermission} />}
        {tab === "planning" && (
          <PlanningTab
            profile={profile}
            planningWeek={planningWeek}
            loadingPlanning={loadingPlanning}
            setPlanningWeek={setPlanningWeek}
            setLoadingPlanning={setLoadingPlanning}
            onGoToSeance={(type) => { setDailyData(d => ({ ...d, typeSeance: type })); setTab("today"); }}
          />
        )}
        {tab === "race" && <RaceTab profile={profile} />}

        {/* PROFIL */}
        {tab === "profil" && <ProfilTab profile={profile} onUpdateProfile={onUpdateProfile} onLogout={onLogout} installPrompt={installPrompt} isInstalled={isInstalled} triggerInstall={triggerInstall} notifGranted={notifGranted} requestNotifPermission={requestNotifPermission} />}

      </div>

      {/* Floating Coach Chat Button */}
      {!showCoachChat && (
        <button
          onClick={() => setShowCoachChat(true)}
          style={{
            position: "fixed", bottom: 76, right: 16, zIndex: 99,
            width: 52, height: 52, borderRadius: "50%",
            background: "var(--yellow)", border: "none",
            fontSize: 22, cursor: "pointer", boxShadow: "0 4px 20px rgba(232,255,71,0.35)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}
          title="Coach IA"
        >🤖</button>
      )}

      {/* Bottom Nav */}
      <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: "rgba(17,17,17,0.97)", backdropFilter: "blur(12px)", borderTop: "1px solid rgba(255,255,255,0.05)", display: "flex", justifyContent: "space-around", padding: "6px 0 10px", zIndex: 100 }}>
        {tabs.map(t => {
          const active = tab === t.id;
          return (
            <button key={t.id} onClick={() => navigateTo(t.id)} style={{ background: "none", color: active ? "var(--yellow)" : "#444", padding: "6px 10px", borderRadius: 10, display: "flex", flexDirection: "column", alignItems: "center", gap: 3, minWidth: 52, transition: "color 0.2s", border: "none", cursor: "pointer" }}>
              <div style={{ position: "relative" }}>
                <span style={{ fontSize: 21, display: "block", transition: "transform 0.2s", transform: active ? "scale(1.1)" : "scale(1)" }}>{t.icon}</span>
                {active && <div style={{ position: "absolute", bottom: -4, left: "50%", transform: "translateX(-50%)", width: 4, height: 4, borderRadius: "50%", background: "var(--yellow)" }} />}
                {t.badge && !active && <div style={{ position: "absolute", top: -3, right: -3, width: 8, height: 8, borderRadius: "50%", background: "var(--green)", border: "1.5px solid var(--bg)", boxShadow: "0 0 6px rgba(57,255,128,0.6)" }} />}
              </div>
              <span style={{ fontSize: 9, fontWeight: active ? 700 : 500, letterSpacing: "0.03em" }}>{t.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ============================================================
// ONGLET PROFIL (modifiable)
// ============================================================
function ProfilTab({ profile, onUpdateProfile, onLogout, installPrompt, isInstalled, triggerInstall, notifGranted, requestNotifPermission }) {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    poids: profile.poids || "",
    age: profile.age || "",
    sexe: profile.sexe || "homme",
    raceDate: profile.raceDate || "",
    niveauRessenti: profile.niveauRessenti || "intermédiaire",
  });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  async function saveProfile() {
    const updated = { ...profile, ...form };
    await storage.set(`athlete_${profile.name}`, updated);
    onUpdateProfile(updated);
    setEditing(false);
  }

  const [showTests, setShowTests] = useState(false);

  const score = calcFitnessScore(profile);
  const totalWeeks = totalWeeksFromDate(profile.raceDate);
  const currentWeek = profile.week || 1;
  const sessionsDone = (profile.sessions || []).length;

  return (
    <div className="fade-in">
      {showTests && (
        <div style={{ position: "fixed", inset: 0, background: "var(--bg)", zIndex: 200, overflowY: "auto" }}>
          <div style={{ padding: "20px 16px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
              <button onClick={() => setShowTests(false)} style={{ background: "var(--bg3)", border: "none", color: "var(--white)", padding: "8px 14px", borderRadius: 8, cursor: "pointer", fontSize: 14 }}>← Retour</button>
              <div className="bebas" style={{ fontSize: 22, color: "var(--yellow)" }}>BATTERIE DE TESTS</div>
            </div>
            <TestsBattery profile={profile} onComplete={(updatedProfile) => { onUpdateProfile(updatedProfile); setShowTests(false); }} />
          </div>
        </div>
      )}

      {/* ── HERO CARD ── */}
      <div style={{ background: "linear-gradient(145deg, rgba(232,255,71,0.06) 0%, rgba(0,0,0,0) 60%)", border: "1.5px solid rgba(232,255,71,0.15)", borderRadius: 20, padding: "20px 18px", marginBottom: 12, position: "relative", overflow: "hidden" }}>
        {/* Glow */}
        <div style={{ position: "absolute", top: -30, right: -30, width: 150, height: 150, borderRadius: "50%", background: "radial-gradient(circle, rgba(232,255,71,0.08) 0%, transparent 70%)", pointerEvents: "none" }} />

        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 18 }}>
          {/* Avatar large */}
          <div style={{ width: 64, height: 64, borderRadius: "50%", background: "linear-gradient(135deg, var(--yellow) 0%, #b8cc00 100%)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Bebas Neue',sans-serif", fontSize: 30, color: "#000", flexShrink: 0, boxShadow: "0 0 20px rgba(232,255,71,0.3)" }}>
            {profile.name[0].toUpperCase()}
          </div>
          <div style={{ flex: 1 }}>
            <div className="bebas" style={{ fontSize: 30, color: "var(--white)", letterSpacing: 1, lineHeight: 1 }}>{profile.name.toUpperCase()}</div>
            <div style={{ fontSize: 12, color: "#666", marginTop: 3 }}>
              {LEVELS[(profile.level || 1) - 1]?.label} · Semaine {currentWeek}/{totalWeeks || "?"}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 6 }}>
              <span className="bebas" style={{ fontSize: 26, color: "var(--yellow)", lineHeight: 1 }}>{score.global}</span>
              <span style={{ fontSize: 10, color: "#555", textTransform: "uppercase" }}>/ 100 Score Fitness</span>
            </div>
          </div>
          <button onClick={editing ? saveProfile : () => setEditing(true)} style={{ background: editing ? "rgba(57,255,128,0.15)" : "rgba(255,255,255,0.05)", border: editing ? "1px solid rgba(57,255,128,0.4)" : "1px solid rgba(255,255,255,0.1)", color: editing ? "var(--green)" : "#888", borderRadius: 10, padding: "8px 12px", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>
            {editing ? "💾 OK" : "✏️"}
          </button>
        </div>

        {editing ? (
          <div className="fade-in" style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <Input label="Poids (kg)" value={form.poids} onChange={v => set("poids", v)} type="number" />
              <Input label="Âge" value={form.age} onChange={v => set("age", v)} type="number" />
            </div>
            <Select label="Sexe" value={form.sexe} onChange={v => set("sexe", v)} options={[{ value: "homme", label: "Homme" }, { value: "femme", label: "Femme" }]} />
            <Input label="Date de course HYROX" value={form.raceDate} onChange={v => set("raceDate", v)} type="date" />
            <Select label="Niveau ressenti" value={form.niveauRessenti} onChange={v => set("niveauRessenti", v)} options={[
              { value: "débutant", label: "🟢 Débutant" }, { value: "intermédiaire", label: "🟡 Intermédiaire" },
              { value: "avancé", label: "🟠 Avancé" }, { value: "compétiteur", label: "🔴 Compétiteur" },
            ]} />
            <Btn variant="dark" size="sm" onClick={() => setEditing(false)}>Annuler</Btn>
          </div>
        ) : (
          <>
            {/* Stats bento */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
              {[
                { icon: "⚖️", label: "Poids", value: profile.poids ? `${profile.poids}kg` : "—" },
                { icon: "🎂", label: "Âge", value: profile.age ? `${profile.age}ans` : "—" },
                { icon: "🏃", label: "VMA", value: profile.vmaKmh ? `${profile.vmaKmh}km/h` : "—" },
                { icon: "🏋️", label: "Squat", value: profile.squat1RM_final ? `${profile.squat1RM_final}kg` : "—" },
                { icon: "💀", label: "Deadlift", value: profile.deadlift1RM_final ? `${profile.deadlift1RM_final}kg` : "—" },
                { icon: "📅", label: "Séances", value: `${sessionsDone}` },
              ].map(item => (
                <div key={item.label} style={{ background: "rgba(255,255,255,0.03)", borderRadius: 10, padding: "10px 8px", textAlign: "center", border: "1px solid rgba(255,255,255,0.05)" }}>
                  <div style={{ fontSize: 16, marginBottom: 2 }}>{item.icon}</div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: "var(--white)", lineHeight: 1 }}>{item.value}</div>
                  <div style={{ fontSize: 10, color: "#555", marginTop: 2 }}>{item.label}</div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* ── RACE COUNTDOWN ── */}
      {profile.raceDate && (
        <div style={{ background: "rgba(255,60,60,0.05)", border: "1.5px solid rgba(255,60,60,0.2)", borderRadius: 16, padding: "16px 18px", marginBottom: 12, display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ textAlign: "center" }}>
            <div className="bebas" style={{ fontSize: 52, color: "var(--red)", lineHeight: 1 }}>{daysUntil(profile.raceDate)}</div>
            <div style={{ fontSize: 10, color: "#555", textTransform: "uppercase", letterSpacing: "0.08em" }}>jours</div>
          </div>
          <div style={{ flex: 1, borderLeft: "1px solid rgba(255,255,255,0.06)", paddingLeft: 16 }}>
            <div style={{ fontSize: 11, color: "var(--red)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 4 }}>🏁 Ta prochaine course</div>
            <div style={{ fontSize: 14, color: "var(--white)", fontWeight: 600 }}>HYROX {profile.hyroxCategorie?.toUpperCase() || "OPEN"}</div>
            <div style={{ fontSize: 12, color: "#555", marginTop: 3 }}>{new Date(profile.raceDate).toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}</div>
            {/* Progress bar */}
            {totalWeeks > 0 && (
              <div style={{ marginTop: 8 }}>
                <div style={{ height: 4, background: "rgba(255,255,255,0.06)", borderRadius: 99, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${Math.min(100, (currentWeek / totalWeeks) * 100)}%`, background: "var(--red)", borderRadius: 99, transition: "width 0.5s" }} />
                </div>
                <div style={{ fontSize: 10, color: "#444", marginTop: 4 }}>Semaine {currentWeek} / {totalWeeks} de préparation</div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── PR BOARD ── */}
      {(profile.squat1RM_final || profile.deadlift1RM_final || profile.vmaKmh || profile.tests) && (() => {
        const tests = profile.tests || {};
        const prs = [
          { label: "Squat 1RM", value: profile.squat1RM_final, unit: "kg", icon: "🏋️", color: "var(--orange)" },
          { label: "Deadlift 1RM", value: profile.deadlift1RM_final, unit: "kg", icon: "💀", color: "var(--red)" },
          { label: "VMA", value: profile.vmaKmh, unit: "km/h", icon: "🏃", color: "var(--green)" },
          { label: "SkiErg 1km", value: tests.skierg_1000, unit: "", icon: "⛷️", color: "#a78bfa" },
          { label: "Rowing 1km", value: tests.rowing_1000, unit: "", icon: "🚣", color: "#38bdf8" },
          { label: "Burpee BJ", value: tests.burpee_broad_jump ? `${tests.burpee_broad_jump}m` : null, unit: "", icon: "🤸", color: "var(--yellow)" },
        ].filter(p => p.value);
        if (!prs.length) return null;
        return (
          <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: 16, padding: "14px", marginBottom: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#555", textTransform: "uppercase", letterSpacing: "0.12em" }}>🏆 Personal Records</div>
              <div style={{ fontSize: 10, color: "#2a2a2a" }}>Mis à jour via les tests</div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
              {prs.map((pr, i) => (
                <div key={i} style={{ background: `${pr.color}08`, border: `1px solid ${pr.color}22`, borderRadius: 12, padding: "12px 8px", textAlign: "center", position: "relative", overflow: "hidden" }}>
                  <div style={{ position: "absolute", top: -10, right: -10, fontSize: 36, opacity: 0.04 }}>{pr.icon}</div>
                  <div style={{ fontSize: 18, marginBottom: 4 }}>{pr.icon}</div>
                  <div className="bebas" style={{ fontSize: 22, color: pr.color, lineHeight: 1 }}>{pr.value}</div>
                  {pr.unit && <div style={{ fontSize: 9, color: "#333", marginTop: 1 }}>{pr.unit}</div>}
                  <div style={{ fontSize: 9, color: "#444", marginTop: 3 }}>{pr.label}</div>
                </div>
              ))}
            </div>
          </div>
        );
      })()}

      {/* Bouton batterie de tests */}
      <Section title="Batterie de tests">
        <button onClick={() => setShowTests(true)} style={{ width: "100%", background: "var(--bg2)", border: "1px solid rgba(232,255,71,0.2)", borderRadius: 14, padding: "14px 16px", display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: "rgba(232,255,71,0.08)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>🧪</div>
            <div style={{ textAlign: "left" }}>
              <div style={{ fontWeight: 700, fontSize: 14, color: "var(--white)" }}>Compléter mes tests</div>
              <div style={{ fontSize: 11, color: "#555", marginTop: 2 }}>
                {profile.tests && Object.keys(profile.tests).filter(k => k !== "analyzed").length > 0
                  ? `${Object.keys(profile.tests).filter(k => k !== "analyzed").length} / 10 tests complétés`
                  : "VMA, Force, SkiErg, Rowing…"}
              </div>
            </div>
          </div>
          <span style={{ color: "var(--yellow)", fontSize: 16 }}>→</span>
        </button>
        {profile.tests && Object.keys(profile.tests).filter(k => k !== "analyzed").length > 0 && (
          <div style={{ marginTop: 8, display: "flex", flexWrap: "wrap", gap: 6 }}>
            {Object.keys(profile.tests).filter(k => k !== "analyzed").map(k => (
              <div key={k} style={{ background: "rgba(57,255,128,0.08)", border: "1px solid rgba(57,255,128,0.2)", borderRadius: 20, padding: "3px 10px", fontSize: 11, color: "var(--green)" }}>
                ✓ {k.toUpperCase()}
              </div>
            ))}
          </div>
        )}
      </Section>

      {profile.aiProfile && (
        <Section title="Profil IA">
          <Card style={{ border: "1px solid var(--yellow)22" }}>
            <p style={{ fontSize: 14, color: "#ccc", lineHeight: 1.7, whiteSpace: "pre-wrap" }}>{profile.aiProfile}</p>
          </Card>
        </Section>
      )}

      {/* ── CODE ACCÈS HYBRIDE COACHING ── */}
      <Section title="Hybride Coaching">
        <Card style={{ border: "1.5px solid var(--yellow)55", background: "rgba(232,255,71,0.04)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 14 }}>
            <div style={{ fontSize: 32 }}>🔑</div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 15, color: "var(--white)" }}>Ton code d'accès Coach IA</div>
              <div style={{ fontSize: 12, color: "#888", marginTop: 2 }}>Débloque le générateur de programmes sur hybride-coaching.fr</div>
            </div>
          </div>
          <div style={{ background: "var(--bg)", border: "2px dashed rgba(232,255,71,0.4)", borderRadius: 10, padding: "14px 18px", display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <span className="bebas" style={{ fontSize: 28, color: "var(--yellow)", letterSpacing: 4 }}>HYBRIDE2026</span>
            <button
              onClick={() => { navigator.clipboard.writeText("HYBRIDE2026"); }}
              style={{ background: "var(--yellow)", border: "none", borderRadius: 8, padding: "6px 12px", fontSize: 12, fontWeight: 700, color: "#000", cursor: "pointer" }}
            >📋 Copier</button>
          </div>
          <a href="https://hybride-coaching.fr" target="_blank" rel="noreferrer" style={{ display: "block", textAlign: "center", fontSize: 13, color: "var(--yellow)", textDecoration: "none", fontWeight: 600 }}>
            Aller sur hybride-coaching.fr →
          </a>
        </Card>
      </Section>

      {/* ── BADGES / ACHIEVEMENTS ── */}
      {(() => {
        const nbSessions = (profile.sessions||[]).length;
        const streak = (() => {
          const sessions = (profile.sessions||[]).slice().sort((a,b) => new Date(b.date)-new Date(a.date));
          let s = 0; let d = new Date(); d.setHours(0,0,0,0);
          for (const sess of sessions) {
            const sd = new Date(sess.date); sd.setHours(0,0,0,0);
            const diff = Math.round((d - sd) / 86400000);
            if (diff <= 1) { s++; d = sd; } else break;
          }
          return s;
        })();
        const BADGES = [
          { id: "first", icon: "🎯", label: "Première séance", desc: "Tu as lancé l'aventure", unlocked: nbSessions >= 1, color: "var(--yellow)" },
          { id: "5sessions", icon: "💪", label: "5 séances", desc: "La régularité commence", unlocked: nbSessions >= 5, color: "var(--orange)" },
          { id: "10sessions", icon: "🔥", label: "10 séances", desc: "Athlète confirmé", unlocked: nbSessions >= 10, color: "var(--red)" },
          { id: "25sessions", icon: "⚡", label: "25 séances", desc: "Niveau élite", unlocked: nbSessions >= 25, color: "var(--purple)" },
          { id: "streak3", icon: "📅", label: "Streak 3j", desc: "3 jours consécutifs", unlocked: streak >= 3, color: "var(--green)" },
          { id: "streak7", icon: "🗓️", label: "Streak 7j", desc: "Une semaine parfaite", unlocked: streak >= 7, color: "var(--yellow)" },
          { id: "streak14", icon: "🚀", label: "Streak 14j", desc: "Machine de guerre", unlocked: streak >= 14, color: "#ff6b35" },
          { id: "simulation", icon: "🏁", label: "Simulation HYROX", desc: "Tu as simulé une race", unlocked: !!(profile.lastSimulation), color: "var(--red)" },
          { id: "vma", icon: "🏃", label: "VMA renseignée", desc: "Profil physique complet", unlocked: !!(profile.vmaKmh), color: "var(--green)" },
          { id: "race", icon: "🏆", label: "Race programmée", desc: "Objectif fixé", unlocked: !!(profile.raceDate), color: "var(--yellow)" },
          { id: "technique", icon: "🎓", label: "Technique maîtrisée", desc: "3 exercices HYROX vus", unlocked: (() => { try { return Object.keys(JSON.parse(localStorage.getItem("fitrace_technique_viewed")||"{}")).length >= 3; } catch { return false; } })(), color: "var(--purple)" },
          { id: "feedback", icon: "📊", label: "Bilan réalisé", desc: "Analyse IA complète", unlocked: (profile.adaptations||[]).length >= 1, color: "var(--green)" },
        ];
        const unlocked = BADGES.filter(b => b.unlocked);
        const locked = BADGES.filter(b => !b.unlocked);
        return (
          <div style={{ marginBottom: 24 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <div style={{ fontSize: 11, color: "#333", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em" }}>Badges</div>
              <div style={{ fontSize: 12, color: "var(--yellow)", fontWeight: 700 }}>{unlocked.length}/{BADGES.length}</div>
            </div>
            {/* Barre progression */}
            <div style={{ height: 4, background: "#111", borderRadius: 99, marginBottom: 14, overflow: "hidden" }}>
              <div style={{ height: "100%", background: "linear-gradient(90deg, var(--yellow), var(--green))", width: `${(unlocked.length/BADGES.length)*100}%`, borderRadius: 99, transition: "width 0.8s" }} />
            </div>
            {/* Grille badges */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 }}>
              {BADGES.map(b => (
                <div key={b.id} style={{ textAlign: "center", position: "relative" }}>
                  <div style={{
                    width: "100%", aspectRatio: "1", borderRadius: 14,
                    background: b.unlocked ? `${b.color}18` : "rgba(255,255,255,0.02)",
                    border: b.unlocked ? `1.5px solid ${b.color}44` : "1px solid rgba(255,255,255,0.05)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 26, marginBottom: 5,
                    filter: b.unlocked ? "none" : "grayscale(1) opacity(0.25)",
                    transition: "all 0.3s",
                    boxShadow: b.unlocked ? `0 0 12px ${b.color}20` : "none",
                  }}>{b.icon}</div>
                  <div style={{ fontSize: 9, color: b.unlocked ? "#888" : "#333", fontWeight: 600, lineHeight: 1.2 }}>{b.label}</div>
                  {b.unlocked && <div style={{ position: "absolute", top: 4, right: 4, width: 10, height: 10, borderRadius: "50%", background: b.color, boxShadow: `0 0 6px ${b.color}` }} />}
                </div>
              ))}
            </div>
          </div>
        );
      })()}

      {/* ── PWA + NOTIFICATIONS ── */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 11, color: "#333", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 10 }}>Application</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>

          {/* Install PWA */}
          {!isInstalled ? (
            <button onClick={triggerInstall || (() => {})} style={{ display: "flex", alignItems: "center", gap: 14, background: "linear-gradient(135deg, rgba(232,255,71,0.06) 0%, rgba(0,0,0,0) 60%)", border: "1.5px solid rgba(232,255,71,0.2)", borderRadius: 14, padding: "14px 16px", cursor: installPrompt ? "pointer" : "default", width: "100%", textAlign: "left" }}>
              <div style={{ width: 38, height: 38, borderRadius: 10, background: "rgba(232,255,71,0.1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>📲</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: "var(--yellow)", marginBottom: 2 }}>Installer l'app</div>
                <div style={{ fontSize: 11, color: "#444" }}>{installPrompt ? "Ajouter à l'écran d'accueil" : "Ouvre dans Chrome → ⋮ → Installer l'application"}</div>
              </div>
              {installPrompt && <div style={{ fontSize: 12, color: "var(--yellow)", fontWeight: 700 }}>INSTALLER →</div>}
            </button>
          ) : (
            <div style={{ display: "flex", alignItems: "center", gap: 14, background: "rgba(57,255,128,0.04)", border: "1px solid rgba(57,255,128,0.15)", borderRadius: 14, padding: "14px 16px" }}>
              <div style={{ width: 38, height: 38, borderRadius: 10, background: "rgba(57,255,128,0.1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>✅</div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: "var(--green)", marginBottom: 2 }}>App installée</div>
                <div style={{ fontSize: 11, color: "#444" }}>FitRace est sur ton écran d'accueil</div>
              </div>
            </div>
          )}

          {/* Notifications */}
          <button onClick={notifGranted ? null : requestNotifPermission} style={{ display: "flex", alignItems: "center", gap: 14, background: notifGranted ? "rgba(57,255,128,0.04)" : "rgba(255,255,255,0.02)", border: `1px solid ${notifGranted ? "rgba(57,255,128,0.15)" : "rgba(255,255,255,0.06)"}`, borderRadius: 14, padding: "14px 16px", cursor: notifGranted ? "default" : "pointer", width: "100%", textAlign: "left" }}>
            <div style={{ width: 38, height: 38, borderRadius: 10, background: notifGranted ? "rgba(57,255,128,0.1)" : "rgba(255,255,255,0.04)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>{notifGranted ? "🔔" : "🔕"}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: notifGranted ? "var(--green)" : "#888", marginBottom: 2 }}>{notifGranted ? "Notifications actives" : "Activer les notifications"}</div>
              <div style={{ fontSize: 11, color: "#444" }}>{notifGranted ? "Rappels séance, nutrition & streak" : "Séance du jour · Bilan nutrition · Streak"}</div>
            </div>
            {!notifGranted && <div style={{ fontSize: 12, color: "var(--yellow)", fontWeight: 700 }}>ACTIVER →</div>}
          </button>
        </div>
      </div>

      {/* ── DÉCONNEXION ── */}
      <div style={{ marginTop: 8, marginBottom: 32 }}>
        <Btn variant="danger" onClick={onLogout} style={{ width: "100%", opacity: 0.8 }}>
          🚪 Se déconnecter
        </Btn>
      </div>
    </div>
  );
}

function StatBox({ label, value, unit, color }) {
  return (
    <div style={{ background: "var(--bg3)", borderRadius: 10, padding: "14px 12px", textAlign: "center" }}>
      <div className="bebas" style={{ fontSize: 36, color, lineHeight: 1 }}>{value}</div>
      <div style={{ fontSize: 11, color: "#888", marginTop: 2 }}>{label}</div>
      {unit && <div style={{ fontSize: 11, color: "#555" }}>{unit}</div>}
    </div>
  );
}



// ============================================================
// BASE DE DONNÉES VIDÉOS YOUTUBE HYROX
// ============================================================
const VIDEOS_HYROX = {
  skierg: {
    nom: "SkiErg", emoji: "⛷️", station: 1, distance: "1000m",
    muscles: "Dos, épaules, core, jambes",
    cles: ["Tirer fort vers le bas", "Pousser les hanches en arrière", "Dos plat, genoux légèrement fléchis", "Rythme régulier — ne pas sprinter"],
    erreurs: ["Rester trop droit", "Ne pas engager le bas du corps", "Partir trop vite"],
    videos: [
      { id: "9RJiSvgaiJU", titre: "Mat Fraser — Tips & Tricks SkiErg", niveau: "Tous niveaux", duree: "8 min" },
      { id: "t8teWM7jbDI", titre: "Ultimate SkiErg Tutorial HYROX", niveau: "Débutant", duree: "12 min" },
      { id: "kjEzM776MVY", titre: "Jan Bannasch x Concept2 — Technique", niveau: "Avancé", duree: "6 min" },
      { id: "iy97I6PhSco", titre: "Stop Wasting Energy — Boost Speed", niveau: "Intermédiaire", duree: "10 min" },
    ],
  },
  sled_push: {
    nom: "Sled Push", emoji: "🛷", station: 2, distance: "50m",
    muscles: "Quadriceps, fessiers, mollets, core",
    cles: ["Corps incliné vers l'avant à 45°", "Avant-bras sur les barres (pas les mains)", "Petits pas rapides", "Ne jamais s'arrêter — repartir coûte plus d'énergie"],
    erreurs: ["Rester trop droit", "Grandes enjambées", "S'épuiser trop tôt", "Mauvaises chaussures"],
    videos: [
      { id: "HvjeefVELGg", titre: "Sled Push — Technique & Standards", niveau: "Tous niveaux", duree: "9 min" },
      { id: "_gipeeBinKo", titre: "HYROX Sled Push Technique Guide", niveau: "Débutant", duree: "7 min" },
      { id: "pk3Ha_pCArU", titre: "5 Tips Essentiels — Elite Coach", niveau: "Avancé", duree: "5 min" },
      { id: "tVSdUyJCnjU", titre: "Comment faire le Sled Push (FR)", niveau: "Débutant", duree: "8 min" },
    ],
  },
  sled_pull: {
    nom: "Sled Pull", emoji: "🔗", station: 3, distance: "50m",
    muscles: "Dos, biceps, épaules, jambes",
    cles: ["Reculer en tirant la corde", "Dos plat, core engagé", "Utiliser les jambes — pas que les bras", "Gérer la corde au sol pour éviter de trébucher"],
    erreurs: ["Tirer uniquement avec les bras", "Dos arrondi", "Trop de corde au sol", "Bloquer la respiration"],
    videos: [
      { id: "eziTXjH9yw8", titre: "Mat Fraser — Sleds, Farmers, Burpees", niveau: "Tous niveaux", duree: "15 min" },
      { id: "wV1tR9Y1pS0", titre: "Technique & Transitions Sled Pull", niveau: "Intermédiaire", duree: "10 min" },
    ],
  },
  burpee_broad_jump: {
    nom: "Burpee Broad Jump", emoji: "💥", station: 4, distance: "80m",
    muscles: "Full body — cardio + explosivité",
    cles: ["Avancer les pieds un par un (économiser l'énergie)", "Saut en longueur — pas en hauteur", "Pieds parallèles au décollage ET à l'atterrissage", "Rythme constant — ne pas sprinter"],
    erreurs: ["Sauter avec les pieds décalés (pénalité)", "Sprinter et s'épuiser", "Chest qui ne touche pas le sol", "Mains trop loin des pieds"],
    videos: [
      { id: "W5gc1Inyha0", titre: "Burpee Broad Jump Technique HYROX", niveau: "Débutant", duree: "5 min" },
      { id: "UTO-GzRXF-Q", titre: "Correct Form — Master HYROX Trainer", niveau: "Tous niveaux", duree: "6 min" },
      { id: "3eXUefIatHk", titre: "Top Tips Burpee Broad Jump", niveau: "Intermédiaire", duree: "8 min" },
      { id: "cRH_5GIkD4k", titre: "Form & Training Tips", niveau: "Avancé", duree: "7 min" },
    ],
  },
  rowing: {
    nom: "Rowing", emoji: "🚣", station: 5, distance: "1000m",
    muscles: "Jambes, dos, core, bras",
    cles: ["Jambes d'abord — puis dos — puis bras", "Retour : bras — dos — jambes", "Assis droit, tirer vers le sternum", "Station active récup — ne pas sprinter"],
    erreurs: ["Tirer avec les bras en premier", "Dos arrondi", "Partir trop vite (gros impact sur la suite)", "Pieds mal attachés"],
    videos: [
      { id: "eziTXjH9yw8", titre: "Mat Fraser — All HYROX Stations", niveau: "Tous niveaux", duree: "15 min" },
      { id: "f-vRkAcQ1Ls", titre: "SkiErg & Row — Form & Pacing", niveau: "Intermédiaire", duree: "11 min" },
    ],
  },
  farmers_carry: {
    nom: "Farmers Carry", emoji: "🧳", station: 6, distance: "200m",
    muscles: "Grip, trapèzes, core, posture",
    cles: ["Épaules en arrière et basses", "Regard droit devant", "Pas rapides et réguliers", "Unbroken si possible — poser coûte du temps"],
    erreurs: ["Épaules qui s'affaissent", "Pencher sur le côté", "Poser trop souvent", "Oublier le core"],
    videos: [
      { id: "eziTXjH9yw8", titre: "Mat Fraser — Farmers Carry Tips", niveau: "Tous niveaux", duree: "15 min" },
      { id: "wV1tR9Y1pS0", titre: "Stations & Transitions HYROX", niveau: "Intermédiaire", duree: "10 min" },
    ],
  },
  sandbag_lunges: {
    nom: "Sandbag Lunges", emoji: "🎒", station: 7, distance: "100m",
    muscles: "Quadriceps, fessiers, stabilisateurs",
    cles: ["Genou arrière DOIT toucher le sol (pénalité sinon)", "Alterner les genoux obligatoirement", "Coudes hauts pour dégager les poumons", "Corps droit — pas de penché"],
    erreurs: ["Genou qui ne touche pas le sol", "Mêmes genoux deux fois de suite", "Corps penché en avant", "Poser le sac (disqualification au 2e)"],
    videos: [
      { id: "eziTXjH9yw8", titre: "Mat Fraser — All Stations", niveau: "Tous niveaux", duree: "15 min" },
      { id: "LN4TOySOQL4", titre: "Dominate Every HYROX Station", niveau: "Intermédiaire", duree: "8 min" },
    ],
  },
  wall_balls: {
    nom: "Wall Balls", emoji: "🏀", station: 8, distance: "100 reps",
    muscles: "Cuisses, fessiers, épaules, core",
    cles: ["Squat profond — utiliser le rebond pour propulser", "Lancer vers le CENTRE de la cible", "Attraper en amorçant le squat suivant", "Séries de 20-30 au début — puis 10"],
    erreurs: ["Squat pas assez profond (no rep)", "Rater la cible (15s de pénalité)", "Trop s'épuiser sur les premières séries", "Lâcher la balle au sol"],
    videos: [
      { id: "XFbGAhXcyoQ", titre: "Wall Balls Training — Elite Methods", niveau: "Avancé", duree: "12 min" },
      { id: "7_93Y85Y2Tw", titre: "Proven Wall Ball Strategies", niveau: "Intermédiaire", duree: "9 min" },
      { id: "eziTXjH9yw8", titre: "Mat Fraser — All Stations", niveau: "Tous niveaux", duree: "15 min" },
    ],
  },
};

const MOUVEMENT_ALIASES = {
  "skierg": "skierg", "ski erg": "skierg", "ski ergo": "skierg",
  "sled push": "sled_push", "sled": "sled_push",
  "sled pull": "sled_pull", "sled traction": "sled_pull",
  "burpee": "burpee_broad_jump", "burpee broad jump": "burpee_broad_jump", "broad jump": "burpee_broad_jump",
  "rowing": "rowing", "row": "rowing", "rameur": "rowing",
  "farmer": "farmers_carry", "farmers carry": "farmers_carry", "farmer carry": "farmers_carry",
  "sandbag": "sandbag_lunges", "lunge": "sandbag_lunges", "lunges": "sandbag_lunges",
  "wall ball": "wall_balls", "wall balls": "wall_balls",
};

function findVideoForExercice(nomEx) {
  if (!nomEx) return null;
  const lower = nomEx.toLowerCase();
  for (const [key, videoKey] of Object.entries(MOUVEMENT_ALIASES)) {
    if (lower.includes(key)) return VIDEOS_HYROX[videoKey];
  }
  return null;
}

// ============================================================
// MODAL VIDÉO
// ============================================================
function VideoModal({ mouvement, onClose }) {
  const [activeVideo, setActiveVideo] = useState(0);
  if (!mouvement) return null;
  const video = mouvement.videos[activeVideo];

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.92)", zIndex: 500, display: "flex", flexDirection: "column" }} onClick={onClose}>
      <div style={{ padding: "16px 20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <div className="bebas" style={{ fontSize: 22, color: "var(--yellow)", letterSpacing: 1 }}>{mouvement.emoji} {mouvement.nom}</div>
          <div style={{ fontSize: 11, color: "#555" }}>Station {mouvement.station} · {mouvement.distance}</div>
        </div>
        <button onClick={onClose} style={{ background: "rgba(255,255,255,0.08)", border: "none", color: "#fff", fontSize: 18, borderRadius: 8, padding: "6px 12px", cursor: "pointer" }}>✕</button>
      </div>

      <div onClick={e => e.stopPropagation()} style={{ flex: 1, overflow: "auto", padding: "0 16px 24px" }}>
        {/* Player YouTube */}
        <div style={{ borderRadius: 12, overflow: "hidden", marginBottom: 12, position: "relative", paddingTop: "56.25%" }}>
          <iframe
            src={`https://www.youtube.com/embed/${video.id}?autoplay=1&rel=0`}
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: "none" }}
            allow="autoplay; encrypted-media"
            allowFullScreen
          />
        </div>

        {/* Info vidéo active */}
        <div style={{ marginBottom: 12 }}>
          <div style={{ fontWeight: 700, fontSize: 14, color: "var(--white)" }}>{video.titre}</div>
          <div style={{ fontSize: 12, color: "#555", marginTop: 2 }}>⏱ {video.duree} · {video.niveau}</div>
        </div>

        {/* Autres vidéos */}
        {mouvement.videos.length > 1 && (
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 11, color: "#444", textTransform: "uppercase", fontWeight: 700, marginBottom: 8 }}>Autres vidéos</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {mouvement.videos.map((v, i) => i !== activeVideo && (
                <button key={i} onClick={() => setActiveVideo(i)} style={{
                  background: "var(--bg3)", border: "1px solid var(--bg3)", borderRadius: 10,
                  padding: "10px 14px", display: "flex", justifyContent: "space-between",
                  alignItems: "center", cursor: "pointer", color: "var(--white)", textAlign: "left",
                }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600 }}>{v.titre}</div>
                    <div style={{ fontSize: 11, color: "#555", marginTop: 2 }}>{v.duree} · {v.niveau}</div>
                  </div>
                  <span style={{ color: "var(--yellow)", fontSize: 18 }}>▶</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Points clés */}
        <div style={{ background: "rgba(232,255,71,0.04)", border: "1px solid rgba(232,255,71,0.15)", borderRadius: 12, padding: 14, marginBottom: 12 }}>
          <div style={{ fontSize: 11, color: "var(--yellow)", fontWeight: 700, textTransform: "uppercase", marginBottom: 10 }}>✅ Points clés</div>
          {mouvement.cles.map((c, i) => <div key={i} style={{ fontSize: 13, color: "#ccc", marginBottom: 6, paddingLeft: 8, borderLeft: "2px solid rgba(232,255,71,0.3)" }}>{c}</div>)}
        </div>

        {/* Erreurs communes */}
        <div style={{ background: "rgba(255,71,71,0.04)", border: "1px solid rgba(255,71,71,0.15)", borderRadius: 12, padding: 14 }}>
          <div style={{ fontSize: 11, color: "var(--red)", fontWeight: 700, textTransform: "uppercase", marginBottom: 10 }}>⚠️ Erreurs à éviter</div>
          {mouvement.erreurs.map((e, i) => <div key={i} style={{ fontSize: 13, color: "#ccc", marginBottom: 6 }}>× {e}</div>)}
        </div>
      </div>
    </div>
  );
}

// ============================================================
// ONGLET TECHNIQUE — BIBLIOTHÈQUE COMPLÈTE
// ============================================================
function TechniqueTab() {
  const [activeStation, setActiveStation] = useState(null);
  const [viewed, setViewed] = useState(() => {
    try { return JSON.parse(localStorage.getItem("fitrace_technique_viewed") || "{}"); } catch { return {}; }
  });
  const stations = Object.values(VIDEOS_HYROX);

  function openStation(s) {
    const newViewed = { ...viewed, [s.nom]: true };
    setViewed(newViewed);
    localStorage.setItem("fitrace_technique_viewed", JSON.stringify(newViewed));
    setActiveStation(s);
  }

  const viewedCount = Object.keys(viewed).length;

  // Difficulté par station (approximatif)
  const DIFFICULTY = {
    "SkiErg": { label: "Technique", color: "#a78bfa" },
    "Sled Push": { label: "Force", color: "var(--red)" },
    "Sled Pull": { label: "Force", color: "var(--red)" },
    "Burpee Broad Jump": { label: "Cardio", color: "var(--yellow)" },
    "Rowing": { label: "Technique", color: "#a78bfa" },
    "Farmers Carry": { label: "Résistance", color: "#ff9a3c" },
    "Sandbag Lunges": { label: "Force", color: "var(--red)" },
    "Wall Balls": { label: "Cardio", color: "var(--yellow)" },
  };

  const [filterCat, setFilterCat] = useState("all");
  const cats = ["all", "Technique", "Force", "Cardio", "Résistance"];
  const filtered = filterCat === "all" ? stations : stations.filter(s => (DIFFICULTY[s.nom]?.label || "Multi") === filterCat);
  const pct = Math.round((viewedCount / stations.length) * 100);

  return (
    <div className="fade-in">
      {activeStation && <VideoModal mouvement={activeStation} onClose={() => setActiveStation(null)} />}

      {/* ── HERO ── */}
      <div style={{ background: "linear-gradient(145deg, #131500 0%, #080808 55%, #001308 100%)", border: "1.5px solid rgba(232,255,71,0.15)", borderRadius: 20, padding: "20px 18px", marginBottom: 14, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -30, right: -20, fontSize: 120, opacity: 0.04 }}>🏋️</div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
          <div>
            <div style={{ fontSize: 10, color: "#333", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 6 }}>Maîtrise technique</div>
            <div className="bebas" style={{ fontSize: 52, color: pct === 100 ? "var(--green)" : "var(--yellow)", lineHeight: 1 }}>{pct}<span style={{ fontSize: 22, color: "#555" }}>%</span></div>
            <div style={{ fontSize: 12, color: "#444", marginTop: 2 }}>{viewedCount}/{stations.length} stations vues</div>
          </div>
          {/* Mini anneau */}
          <svg width="72" height="72" viewBox="0 0 72 72">
            <circle cx="36" cy="36" r="28" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="6"/>
            <circle cx="36" cy="36" r="28" fill="none" stroke={pct === 100 ? "var(--green)" : "var(--yellow)"} strokeWidth="6" strokeLinecap="round"
              strokeDasharray={2*Math.PI*28} strokeDashoffset={2*Math.PI*28*(1-pct/100)} transform="rotate(-90 36 36)" style={{transition:"stroke-dashoffset 0.8s"}}/>
            <text x="36" y="40" textAnchor="middle" fontFamily="'Bebas Neue',sans-serif" fontSize="16" fill={pct===100?"#39ff80":"#e8ff47"}>{viewedCount}/{stations.length}</text>
          </svg>
        </div>
        {/* Barre progression */}
        <div style={{ height: 5, background: "rgba(255,255,255,0.05)", borderRadius: 99, overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${pct}%`, background: pct === 100 ? "var(--green)" : "linear-gradient(90deg, var(--yellow), #b8cc00)", borderRadius: 99, transition: "width 0.6s" }}/>
        </div>
        {pct === 100 && (
          <div style={{ marginTop: 10, display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--green)" }}/>
            <span style={{ fontSize: 12, color: "var(--green)", fontWeight: 700 }}>Toutes les stations maîtrisées 🏆</span>
          </div>
        )}
      </div>

      {/* ── FILTRES ── */}
      <div style={{ display: "flex", gap: 6, marginBottom: 14, overflowX: "auto", paddingBottom: 2, scrollbarWidth: "none" }}>
        {cats.map(c => (
          <button key={c} onClick={() => setFilterCat(c)} style={{
            flexShrink: 0, padding: "7px 14px", borderRadius: 20, fontSize: 12, fontWeight: 700, cursor: "pointer",
            background: filterCat === c ? "rgba(232,255,71,0.12)" : "rgba(255,255,255,0.03)",
            border: filterCat === c ? "1.5px solid rgba(232,255,71,0.4)" : "1px solid rgba(255,255,255,0.06)",
            color: filterCat === c ? "var(--yellow)" : "#444", transition: "all 0.2s",
          }}>{c === "all" ? `Toutes (${stations.length})` : c}</button>
        ))}
      </div>

      {/* ── LISTE STATIONS ── */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {filtered.map((s, i) => {
          const isViewed = viewed[s.nom];
          const diff = DIFFICULTY[s.nom] || { label: "Multi", color: "#555" };
          const diffColors = { "Technique": "#a78bfa", "Force": "var(--red)", "Cardio": "var(--yellow)", "Résistance": "var(--orange)", "Multi": "#555" };
          const dc = diffColors[diff.label] || "#555";
          return (
            <div key={i} onClick={() => openStation(s)} className="card-hover" style={{
              background: isViewed ? "rgba(57,255,128,0.04)" : "rgba(255,255,255,0.02)",
              border: isViewed ? "1.5px solid rgba(57,255,128,0.2)" : "1px solid rgba(255,255,255,0.05)",
              borderRadius: 16, padding: "14px 16px", cursor: "pointer",
              display: "flex", alignItems: "center", gap: 14, position: "relative", overflow: "hidden",
            }}>
              {/* Accent left */}
              <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 3, background: isViewed ? "var(--green)" : `${dc}55`, borderRadius: "3px 0 0 3px" }}/>
              {/* Numéro station */}
              <div style={{ width: 48, height: 48, borderRadius: 12, background: isViewed ? "rgba(57,255,128,0.08)" : `${dc}12`, border: `1px solid ${isViewed ? "rgba(57,255,128,0.25)" : `${dc}30`}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", flexShrink: 0, position: "relative" }}>
                <div style={{ fontSize: 20 }}>{s.emoji}</div>
                <div className="bebas" style={{ fontSize: 9, color: isViewed ? "var(--green)" : dc, letterSpacing: 0.5 }}>S{s.station}</div>
                {isViewed && <div style={{ position: "absolute", top: -5, right: -5, width: 16, height: 16, borderRadius: "50%", background: "var(--green)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, color: "#000", fontWeight: 900 }}>✓</div>}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4, flexWrap: "wrap" }}>
                  <div className="bebas" style={{ fontSize: 17, color: isViewed ? "var(--white)" : "#ccc", letterSpacing: 0.5 }}>{s.nom}</div>
                  <div style={{ fontSize: 9, background: `${dc}18`, color: dc, border: `1px solid ${dc}40`, borderRadius: 5, padding: "2px 7px", fontWeight: 700 }}>{diff.label}</div>
                </div>
                <div style={{ fontSize: 11, color: "#444" }}>{s.distance}</div>
                <div style={{ fontSize: 10, color: "#333", marginTop: 2 }}>{s.muscles}</div>
              </div>
              <div style={{ width: 36, height: 36, borderRadius: "50%", background: isViewed ? "rgba(57,255,128,0.12)" : "rgba(232,255,71,0.08)", border: `1.5px solid ${isViewed ? "rgba(57,255,128,0.3)" : "rgba(232,255,71,0.2)"}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, color: isViewed ? "var(--green)" : "var(--yellow)", flexShrink: 0 }}>
                {isViewed ? "↺" : "▶"}
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div style={{ textAlign: "center", padding: "32px 20px", color: "#333", fontSize: 13 }}>Aucune station dans cette catégorie</div>
      )}
    </div>
  );
}


// ============================================================
// PLANNING HEBDOMADAIRE
// ============================================================
const JOURS = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];
const JOURS_FULL = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];
const TYPE_COLORS = {
  force_stations: { color: "#e8ff47", bg: "rgba(232,255,71,0.1)", label: "Force", icon: "🏋️" },
  running_zone2: { color: "#39ff80", bg: "rgba(57,255,128,0.08)", label: "Zone 2", icon: "🏃" },
  running_qualite: { color: "#39ff80", bg: "rgba(57,255,128,0.08)", label: "Run", icon: "🎯" },
  hybride_compromis: { color: "#ff9a3c", bg: "rgba(255,154,60,0.08)", label: "Hybride", icon: "⚡" },
  repos: { color: "#444", bg: "rgba(255,255,255,0.02)", label: "Repos", icon: "😴" },
  mobilite: { color: "#a78bfa", bg: "rgba(167,139,250,0.08)", label: "Mobilité", icon: "🧘" },
};

async function generateWeekPlanning(profile, setPlanningWeek, setLoadingPlanning, planningPrefs = {}, setStreamText = null) {
  setLoadingPlanning(true);
  if (setStreamText) setStreamText("📅 Coach analyse ton profil...");

  const week = profile.week || 1;
  const totalWeeks = totalWeeksFromDate(profile.raceDate);
  const phase = getPhase(week, totalWeeks);
  const sessions = profile.sessions || [];
  const lastSession = sessions.slice(-1)[0];
  const adaptations = profile.adaptations || [];
  const lastAdapt = adaptations.slice(-1)[0]?.adaptation || "";
  const days = profile.raceDate ? Math.max(0, Math.ceil((new Date(profile.raceDate) - new Date()) / (1000*60*60*24))) : null;

  // Calcul des jours à planifier : aujourd'hui → dimanche
  const today = new Date();
  const todayIdx = (today.getDay() + 6) % 7; // 0=Lundi, 6=Dimanche
  const startIdx = todayIdx === 6 ? 0 : todayIdx;
  const joursAplanifier = JOURS_FULL.slice(startIdx);

  // Préférences de planning
  const nbSeances = planningPrefs.nbSeances || profile.seancesParSemaine || "auto";
  const repartition = planningPrefs.repartition || profile.repartition || "auto";
  const nbRun = planningPrefs.nbRun || profile.nbRun || "auto";
  const nbMuscu = planningPrefs.nbMuscu || profile.nbMuscu || "auto";
  const nbHybride = planningPrefs.nbHybride || profile.nbHybride || "auto";

  const cacheKey = `planning_${profile.name}_from${startIdx}`;
  const cached = await storage.get(cacheKey);
  if (cached) {
    try {
      const data = typeof cached === "string" ? JSON.parse(cached) : cached;
      if (data?.jours?.length > 0) {
        setPlanningWeek(data);
        setLoadingPlanning(false);
        if (setStreamText) setStreamText("");
        return;
      }
    } catch (e) { console.error("Cache parse error:", e); }
  }

  const repartitionInstr = repartition === "auto"
    ? "Répartition optimale selon la science HYROX (alternance run/force/repos)"
    : `${nbRun !== "auto" ? nbRun + " séance(s) running" : ""} ${nbMuscu !== "auto" ? nbMuscu + " séance(s) force" : ""} ${nbHybride !== "auto" ? nbHybride + " séance(s) hybride" : ""}`.trim();

  const nbSeancesTarget = nbSeances === "auto"
    ? (phase === "base" ? 3 : phase === "développement" ? 4 : phase === "pic" ? 4 : 3)
    : parseInt(nbSeances);

  const joursList = joursAplanifier.join(", ");
  const paceZ2 = profile.vmaKmh ? paceFromVMA(profile.vmaKmh, 65) : "?";
  const paceTempo = profile.vmaKmh ? paceFromVMA(profile.vmaKmh, 83) : "?";

  // Résumé des 3 dernières séances
  const recentText = sessions.slice(-3).map(s => `${s.titre}(RPE:${s.difficulte||"?"},${s.ressenti})`).join(" → ");

  const raw = await callClaudeStream(
    "Tu es coach HYROX expert. Réponds UNIQUEMENT avec du JSON valide, sans texte autour, sans backticks.",
    `Planifie la semaine HYROX pour ${profile.name}.

PROFIL:
- Niveau ${profile.level}/4 | Phase: ${phase} (semaine ${week}/${totalWeeks})
- VMA: ${profile.vmaKmh || "?"}km/h | Squat: ${profile.squat1RM_final || "?"}kg | Deadlift: ${profile.deadlift1RM_final || "?"}kg
- Jours avant la course: ${days !== null ? days : "non défini"}
- Séances réalisées total: ${sessions.length}
- 3 dernières séances: ${recentText || "aucune encore"}
- Dernière adaptation IA: ${lastAdapt || "aucune"}
- Fatigue estimée: ${lastSession?.difficulte >= 8 ? "élevée (dernière séance RPE "+lastSession.difficulte+")" : "normale"}

RÈGLES SCIENTIFIQUES HYROX:
- Phase BASE: 70% aérobie (Zone 2), 30% force. Fréquence: 3-4 séances/semaine. Repos: 2-3 jours.
- Phase DÉVELOPPEMENT: mix run qualité + force stations + hybride compromised running
- Phase PIC: intensité max, volume réduit, simulation race
- Phase AFFÛTAGE: volume -40%, intensité conservée, repos++
- Ne jamais mettre 2 séances dures consécutives (running qualité + force = ok, 2x running qualité = non)
- Après RPE ≥ 8 → imposer un repos ou une mobilité le lendemain

JOURS À PLANIFIER: ${joursList}
NOMBRE DE SÉANCES: ${nbSeancesTarget} séances d'entraînement
RÉPARTITION: ${repartitionInstr}

Allures de référence:
- Zone 2: ${paceZ2}/km
- Tempo: ${paceTempo}/km

Génère ce JSON (modifie chaque jour selon le plan optimal):
{"semaine":${week},"phase":"${phase}","debut":"${joursAplanifier[0]}","fin":"${joursAplanifier[joursAplanifier.length-1]}","charge_semaine":"faible|modérée|élevée","conseil":"conseil stratégique en 1 phrase précise et chiffrée","jours":[${joursAplanifier.map(j => `{"jour":"${j}","type":"repos","titre":"","duree":0,"intensite":"","focus":"","exercices_cles":[],"objectif_seance":""}`).join(",")}]}

Types valides: force_stations, running_zone2, running_qualite, hybride_compromis, repos, mobilite
Pour chaque séance: "exercices_cles" = array de 2-3 strings (ex: "Squat 4x6@80kg", "Run 30min Z2@5:45/km", "SkiErg 4x500m")`,
    1800,
    (chunk) => {
      if (setStreamText) {
        if (chunk.includes('"conseil"')) setStreamText("💡 Stratégie de semaine...");
        else if (chunk.includes('"jours"')) setStreamText("📋 Planification jour par jour...");
        else if (chunk.includes('running_qualite') || chunk.includes('force_stations')) setStreamText("⚡ Équilibrage charge/repos...");
        else if (chunk.length > 100) setStreamText("🤖 Coach IA planifie ta semaine...");
      }
    }
  );

  try {
    if (!raw) throw new Error("Pas de réponse");
    const cleaned = raw.replace(/```json|```/g, "").trim();
    const jsonStart = cleaned.indexOf("{");
    const jsonEnd = cleaned.lastIndexOf("}");
    if (jsonStart === -1 || jsonEnd === -1) throw new Error("Pas de JSON trouvé");
    const data = JSON.parse(cleaned.slice(jsonStart, jsonEnd + 1));
    if (data?.jours?.length > 0) {
      setPlanningWeek(data);
      await storage.set(cacheKey, data);
    } else {
      throw new Error("JSON sans jours");
    }
  } catch (e) {
    console.error("Planning error:", e.message, raw?.slice(0, 300));
    const fallback = {
      semaine: week, phase, debut: joursAplanifier[0], fin: joursAplanifier[joursAplanifier.length-1],
      charge_semaine: "modérée",
      conseil: "Programme de la semaine",
      jours: joursAplanifier.map((j, i) => ({
        jour: j,
        type: i % 2 === 0 ? ["force_stations","running_zone2","hybride_compromis"][i % 3] : "repos",
        titre: i % 2 === 0 ? ["Force stations","Zone 2","Hybride"][i % 3] : "Repos",
        duree: i % 2 === 0 ? 60 : 0, intensite: i % 2 === 0 ? "modérée" : "",
        focus: "", exercices_cles: [], objectif_seance: ""
      }))
    };
    setPlanningWeek(fallback);
  }
  if (setStreamText) setStreamText("");
  setLoadingPlanning(false);
}

function PlanningTab({ profile, planningWeek, loadingPlanning, setPlanningWeek, setLoadingPlanning, onGoToSeance }) {
  const [selectedJour, setSelectedJour] = useState(null);
  const [showPrefs, setShowPrefs] = useState(false);
  const [streamText, setStreamText] = useState("");
  const [joursFaits, setJoursFaits] = useState(() => {
    try { return JSON.parse(localStorage.getItem(`fitrace_planning_done_${profile.name}`) || "{}"); } catch { return {}; }
  });
  const [prefs, setPrefs] = useState({
    nbSeances: profile.seancesParSemaine || "auto",
    repartition: profile.repartition || "auto",
    nbRun: profile.nbRun || "2",
    nbMuscu: profile.nbMuscu || "2",
    nbHybride: profile.nbHybride || "1",
  });

  const today = new Date();
  const todayIdx = (today.getDay() + 6) % 7;
  const isDimanche = todayIdx === 6;
  const startIdx = isDimanche ? 0 : todayIdx;

  const toggleJourFait = (jourNom) => {
    const newState = { ...joursFaits, [jourNom]: !joursFaits[jourNom] };
    setJoursFaits(newState);
    localStorage.setItem(`fitrace_planning_done_${profile.name}`, JSON.stringify(newState));
  };

  const refreshPlanning = async (newPrefs = prefs) => {
    const cacheKey = `planning_${profile.name}_from${startIdx}`;
    await storage.del(cacheKey);
    await generateWeekPlanning(profile, setPlanningWeek, setLoadingPlanning, newPrefs, setStreamText);
    setShowPrefs(false);
  };

  // Générer au premier chargement
  useEffect(() => {
    if (!planningWeek && !loadingPlanning) {
      generateWeekPlanning(profile, setPlanningWeek, setLoadingPlanning, prefs, setStreamText);
    }
  }, []);

  return (
    <div className="fade-in">

      {/* Modal préférences */}
      {showPrefs && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.88)", zIndex: 300, display: "flex", alignItems: "flex-end" }}>
          <div className="slide-up" style={{ background: "var(--bg2)", borderRadius: "20px 20px 0 0", padding: 24, width: "100%", maxWidth: 480, margin: "0 auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <div className="bebas" style={{ fontSize: 22, color: "var(--yellow)" }}>PARAMÈTRES SEMAINE</div>
              <button onClick={() => setShowPrefs(false)} style={{ background: "none", border: "none", color: "#666", fontSize: 20, cursor: "pointer" }}>×</button>
            </div>

            {/* Nb séances */}
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 12, color: "#aaa", fontWeight: 700, textTransform: "uppercase", marginBottom: 10 }}>Séances dans la semaine</div>
              <div style={{ display: "flex", gap: 8 }}>
                {[{ v: "auto", label: "🏅 Coach" }, { v: "3", label: "3" }, { v: "4", label: "4" }, { v: "5", label: "5" }].map(s => (
                  <button key={s.v} onClick={() => setPrefs(p => ({ ...p, nbSeances: s.v }))} style={{
                    flex: 1, padding: "10px 4px", borderRadius: 10, fontSize: 13, fontWeight: 700,
                    background: prefs.nbSeances === s.v ? "var(--yellow)22" : "var(--bg3)",
                    border: prefs.nbSeances === s.v ? "2px solid var(--yellow)" : "1.5px solid transparent",
                    color: prefs.nbSeances === s.v ? "var(--yellow)" : "#666", cursor: "pointer",
                  }}>{s.label}</button>
                ))}
              </div>
            </div>

            {/* Répartition */}
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 12, color: "#aaa", fontWeight: 700, textTransform: "uppercase", marginBottom: 10 }}>Répartition des séances</div>
              <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
                {[{ v: "auto", label: "🏅 Choix du coach" }, { v: "custom", label: "✏️ Personnalisée" }].map(r => (
                  <button key={r.v} onClick={() => setPrefs(p => ({ ...p, repartition: r.v }))} style={{
                    flex: 1, padding: "10px", borderRadius: 10, fontSize: 12, fontWeight: 700,
                    background: prefs.repartition === r.v ? "var(--yellow)22" : "var(--bg3)",
                    border: prefs.repartition === r.v ? "2px solid var(--yellow)" : "1.5px solid transparent",
                    color: prefs.repartition === r.v ? "var(--yellow)" : "#666", cursor: "pointer",
                  }}>{r.label}</button>
                ))}
              </div>
              {prefs.repartition === "custom" && (
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
                  <Input label="🏃 Run" value={prefs.nbRun} onChange={v => setPrefs(p => ({ ...p, nbRun: v }))} type="number" placeholder="ex: 2" />
                  <Input label="🏋️ Muscu" value={prefs.nbMuscu} onChange={v => setPrefs(p => ({ ...p, nbMuscu: v }))} type="number" placeholder="ex: 2" />
                  <Input label="⚡ Hybride" value={prefs.nbHybride} onChange={v => setPrefs(p => ({ ...p, nbHybride: v }))} type="number" placeholder="ex: 1" />
                </div>
              )}
            </div>

            <Btn size="lg" onClick={() => refreshPlanning(prefs)} style={{ width: "100%" }}>
              📅 Générer le planning
            </Btn>
          </div>
        </div>
      )}

      {/* ── MINI-CALENDRIER MENSUEL ── */}
      {(() => {
        const now = new Date();
        const year = now.getFullYear();
        const month = now.getMonth();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const firstDow = (new Date(year, month, 1).getDay() + 6) % 7; // 0=Lun
        const sessionDates = new Set((profile.sessions||[]).map(s => s.date?.slice(0,10)));
        const monthName = now.toLocaleDateString("fr-FR", { month: "long", year: "numeric" });
        const cells = [];
        for (let i = 0; i < firstDow; i++) cells.push(null);
        for (let d = 1; d <= daysInMonth; d++) cells.push(d);
        return (
          <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: 16, padding: "14px", marginBottom: 14 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: "var(--yellow)", textTransform: "capitalize" }}>{monthName}</div>
              <div style={{ fontSize: 10, color: "#333" }}>{sessionDates.size} séances ce mois</div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 3, marginBottom: 6 }}>
              {["L","M","M","J","V","S","D"].map((d,i) => (
                <div key={i} style={{ textAlign: "center", fontSize: 8, color: "#2a2a2a", fontWeight: 700, paddingBottom: 4 }}>{d}</div>
              ))}
              {cells.map((d, i) => {
                if (!d) return <div key={`e${i}`} />;
                const iso = `${year}-${String(month+1).padStart(2,"0")}-${String(d).padStart(2,"0")}`;
                const done = sessionDates.has(iso);
                const isToday = d === now.getDate();
                const isPast = new Date(iso) < new Date(now.toDateString());
                return (
                  <div key={i} style={{ textAlign: "center", padding: "2px 0" }}>
                    <div style={{
                      width: "100%", aspectRatio: "1", borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 9, fontWeight: isToday ? 700 : 400,
                      background: done ? "rgba(57,255,128,0.15)" : isToday ? "rgba(232,255,71,0.12)" : "transparent",
                      border: done ? "1px solid rgba(57,255,128,0.3)" : isToday ? "1.5px solid var(--yellow)" : "none",
                      color: done ? "var(--green)" : isToday ? "var(--yellow)" : isPast ? "#2a2a2a" : "#444",
                    }}>{d}</div>
                  </div>
                );
              })}
            </div>
            <div style={{ display: "flex", gap: 12, justifyContent: "center", marginTop: 4 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 9, color: "#333" }}>
                <div style={{ width: 8, height: 8, borderRadius: 2, background: "rgba(57,255,128,0.3)", border: "1px solid rgba(57,255,128,0.4)" }} />Séance réalisée
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 9, color: "#333" }}>
                <div style={{ width: 8, height: 8, borderRadius: 2, border: "1.5px solid var(--yellow)" }} />Aujourd'hui
              </div>
            </div>
          </div>
        );
      })()}

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
        <div>
          <div className="bebas" style={{ fontSize: 26, color: "var(--yellow)", letterSpacing: 1 }}>
            {isDimanche ? "PLANNING SEMAINE PROCHAINE" : `PLANNING — ${JOURS_FULL[startIdx].toUpperCase()} → DIM`}
          </div>
          {planningWeek && (
            <div style={{ fontSize: 12, color: "#555", marginTop: 2 }}>
              {planningWeek.debut} → {planningWeek.fin} · {planningWeek.jours?.filter(j => j.type !== "repos" && j.type !== "mobilite").length} séances
            </div>
          )}
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={() => setShowPrefs(true)} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid #222", borderRadius: 8, padding: "6px 10px", fontSize: 12, color: "#888", cursor: "pointer" }}>⚙️</button>
          <button onClick={() => refreshPlanning(prefs)} style={{ background: "rgba(232,255,71,0.08)", border: "1px solid rgba(232,255,71,0.2)", borderRadius: 8, padding: "6px 12px", fontSize: 12, color: "var(--yellow)", cursor: "pointer", fontWeight: 600 }}>↺</button>
        </div>
      </div>

      {loadingPlanning ? (
        <div className="fade-in" style={{ textAlign: "center", padding: "40px 20px", background: "var(--bg2)", borderRadius: 14, border: "1.5px solid rgba(232,255,71,0.12)" }}>
          <div style={{ fontSize: 28, marginBottom: 12 }}>📅</div>
          <div className="bebas" style={{ fontSize: 18, color: "var(--yellow)", marginBottom: 8 }}>{streamText || "Coach IA planifie ta semaine..."}</div>
          <div style={{ display: "flex", gap: 6, justifyContent: "center" }}>
            {[0,1,2].map(i => (
              <div key={i} style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--yellow)", opacity: 0.6, animation: `pulse 1.2s ${i * 0.2}s ease-in-out infinite` }} />
            ))}
          </div>
          <div style={{ fontSize: 12, color: "#555", marginTop: 12 }}>Basé sur ta phase, tes performances et tes récupérations</div>
        </div>
      ) : planningWeek ? (
        <>
          {/* Header charge semaine + conseil */}
          <div style={{ background: "rgba(232,255,71,0.04)", border: "1px solid rgba(232,255,71,0.15)", borderRadius: 12, padding: "12px 14px", marginBottom: 14 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: planningWeek.conseil ? 8 : 0 }}>
              <div style={{ fontSize: 11, color: "var(--yellow)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em" }}>Charge semaine</div>
              <div style={{
                fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 20,
                background: planningWeek.charge_semaine === "élevée" ? "rgba(255,71,71,0.15)" : planningWeek.charge_semaine === "faible" ? "rgba(57,255,128,0.15)" : "rgba(232,255,71,0.12)",
                color: planningWeek.charge_semaine === "élevée" ? "var(--red)" : planningWeek.charge_semaine === "faible" ? "var(--green)" : "var(--yellow)",
              }}>{planningWeek.charge_semaine || "modérée"}</div>
            </div>
            {planningWeek.conseil && (
              <div style={{ fontSize: 13, color: "#ccc", lineHeight: 1.5, fontStyle: "italic" }}>💡 {planningWeek.conseil}</div>
            )}
          </div>

          {/* Vue grid jours — cartes visuelles */}
          <div style={{ display: "grid", gridTemplateColumns: `repeat(${Math.min((planningWeek.jours || []).length, 7)}, 1fr)`, gap: 6, marginBottom: 16 }}>
            {(planningWeek.jours || []).map((j, i) => {
              const t = TYPE_COLORS[j.type] || TYPE_COLORS.repos;
              const globalIdx = JOURS_FULL.indexOf(j.jour);
              const isToday = globalIdx === todayIdx;
              const isSelected = selectedJour?.jour === j.jour;
              const isDone = joursFaits[j.jour];
              return (
                <button key={i} onClick={() => setSelectedJour(isSelected ? null : j)} style={{
                  background: isDone ? "rgba(57,255,128,0.05)" : isSelected ? t.bg : isToday ? "rgba(232,255,71,0.04)" : "rgba(255,255,255,0.02)",
                  border: isDone ? "1.5px solid rgba(57,255,128,0.3)" : isSelected ? `1.5px solid ${t.color}88` : isToday ? "1.5px solid rgba(232,255,71,0.35)" : "1px solid rgba(255,255,255,0.05)",
                  borderRadius: 14, padding: "12px 4px 10px", textAlign: "center", cursor: "pointer",
                  position: "relative", overflow: "hidden", transition: "all 0.2s",
                }}>
                  {/* Top color stripe */}
                  <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: isDone ? "var(--green)" : isToday ? "var(--yellow)" : t.color, opacity: isDone ? 1 : isToday ? 1 : 0.4, borderRadius: "14px 14px 0 0" }} />
                  <div style={{ fontSize: 9, color: isToday ? "var(--yellow)" : isDone ? "var(--green)" : "#333", fontWeight: isToday ? 700 : 500, marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.06em" }}>{j.jour.slice(0, 3)}</div>
                  <div style={{ fontSize: 20, marginBottom: 4 }}>{isDone ? "✅" : t.icon}</div>
                  {j.duree > 0 && <div style={{ fontSize: 8, color: "#333", letterSpacing: "0.04em" }}>{j.duree}m</div>}
                </button>
              );
            })}
          </div>

          {/* Détail du jour sélectionné */}
          {selectedJour && (
            <div className="fade-in" style={{ background: TYPE_COLORS[selectedJour.type]?.bg || "var(--bg2)", border: `1.5px solid ${TYPE_COLORS[selectedJour.type]?.color || "#333"}44`, borderRadius: 14, padding: 16, marginBottom: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 11, color: TYPE_COLORS[selectedJour.type]?.color || "#888", fontWeight: 700, textTransform: "uppercase", marginBottom: 4 }}>{selectedJour.jour}</div>
                  <div className="bebas" style={{ fontSize: 22, color: "var(--white)", lineHeight: 1 }}>{selectedJour.titre || TYPE_COLORS[selectedJour.type]?.label}</div>
                  <div style={{ display: "flex", gap: 8, marginTop: 6, flexWrap: "wrap" }}>
                    {selectedJour.duree > 0 && <span style={{ fontSize: 11, color: "#666", background: "rgba(255,255,255,0.06)", padding: "2px 8px", borderRadius: 6 }}>⏱ {selectedJour.duree} min</span>}
                    {selectedJour.intensite && <span style={{ fontSize: 11, color: "#666", background: "rgba(255,255,255,0.06)", padding: "2px 8px", borderRadius: 6 }}>💥 {selectedJour.intensite}</span>}
                  </div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8 }}>
                  <div style={{ fontSize: 28 }}>{TYPE_COLORS[selectedJour.type]?.icon}</div>
                  {/* Bouton Fait / Non fait */}
                  <button
                    onClick={(e) => { e.stopPropagation(); toggleJourFait(selectedJour.jour); }}
                    style={{
                      padding: "5px 12px", borderRadius: 20, fontSize: 11, fontWeight: 700,
                      background: joursFaits[selectedJour.jour] ? "rgba(57,255,128,0.15)" : "rgba(255,255,255,0.05)",
                      border: joursFaits[selectedJour.jour] ? "1.5px solid var(--green)" : "1px solid #333",
                      color: joursFaits[selectedJour.jour] ? "var(--green)" : "#555", cursor: "pointer",
                    }}
                  >{joursFaits[selectedJour.jour] ? "✓ Fait" : "Marquer fait"}</button>
                </div>
              </div>

              {/* Objectif de la séance */}
              {selectedJour.objectif_seance && (
                <div style={{ background: "rgba(0,0,0,0.3)", borderRadius: 8, padding: "8px 12px", fontSize: 12, color: "#aaa", lineHeight: 1.5, marginBottom: 10 }}>
                  🎯 <strong>Objectif :</strong> {selectedJour.objectif_seance}
                </div>
              )}
              {!selectedJour.objectif_seance && selectedJour.focus && (
                <div style={{ background: "rgba(0,0,0,0.3)", borderRadius: 8, padding: "8px 12px", fontSize: 12, color: "#aaa", lineHeight: 1.5, marginBottom: 10 }}>
                  🎯 {selectedJour.focus}
                </div>
              )}

              {/* Exercices clés */}
              {(selectedJour.exercices_cles || []).length > 0 && (
                <div style={{ marginBottom: 12 }}>
                  <div style={{ fontSize: 10, color: TYPE_COLORS[selectedJour.type]?.color || "#666", fontWeight: 700, textTransform: "uppercase", marginBottom: 8 }}>Programme prévu</div>
                  {(selectedJour.exercices_cles || []).map((ex, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "7px 0", borderBottom: i < selectedJour.exercices_cles.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none" }}>
                      <div style={{ width: 6, height: 6, borderRadius: "50%", background: TYPE_COLORS[selectedJour.type]?.color || "#666", flexShrink: 0 }} />
                      <span style={{ fontSize: 13, color: "#ccc" }}>{ex}</span>
                    </div>
                  ))}
                </div>
              )}

              {selectedJour.type !== "repos" && selectedJour.type !== "mobilite" && (
                <button onClick={() => onGoToSeance(selectedJour.type)} style={{ width: "100%", padding: "12px", background: "var(--yellow)", border: "none", borderRadius: 10, fontSize: 14, fontFamily: "'Bebas Neue', sans-serif", letterSpacing: 1, color: "#000", cursor: "pointer" }}>
                  ⚡ GÉNÉRER CETTE SÉANCE
                </button>
              )}
            </div>
          )}

          {/* Liste complète */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
            <div className="bebas" style={{ fontSize: 16, color: "var(--yellow)" }}>PROGRAMME COMPLET</div>
            <div style={{ fontSize: 11, color: "#555" }}>
              {Object.values(joursFaits).filter(Boolean).length}/{(planningWeek.jours || []).filter(j => j.type !== "repos").length} séances faites
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {(planningWeek.jours || []).map((j, i) => {
              const t = TYPE_COLORS[j.type] || TYPE_COLORS.repos;
              const globalIdx2 = JOURS_FULL.indexOf(j.jour);
              const isToday = globalIdx2 === todayIdx;
              const isFait = joursFaits[j.jour];
              const isSelected = selectedJour?.jour === j.jour;
              return (
                <div key={i}
                  onClick={() => setSelectedJour(isSelected ? null : j)}
                  style={{
                    background: isFait ? "rgba(57,255,128,0.04)" : "var(--bg2)",
                    border: isSelected ? `1.5px solid ${t.color}66` : isFait ? "1.5px solid rgba(57,255,128,0.25)" : isToday ? "1.5px solid rgba(232,255,71,0.4)" : "1px solid var(--bg3)",
                    borderRadius: 12, padding: "12px 14px", display: "flex", alignItems: "center", gap: 12,
                    cursor: "pointer", opacity: isFait ? 0.7 : 1, transition: "all 0.2s",
                  }}>
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: isFait ? "rgba(57,255,128,0.15)" : t.bg, border: `1px solid ${isFait ? "rgba(57,255,128,0.3)" : t.color+"33"}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>
                    {isFait ? "✓" : t.icon}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                      <span style={{ fontSize: 13, fontWeight: 700, color: isFait ? "var(--green)" : isToday ? "var(--yellow)" : "var(--white)", textDecoration: isFait ? "line-through" : "none" }}>{j.jour}</span>
                      {isToday && !isFait && <span style={{ fontSize: 9, background: "var(--yellow)", color: "#000", borderRadius: 4, padding: "1px 5px", fontWeight: 700 }}>AUJOURD'HUI</span>}
                      {isFait && <span style={{ fontSize: 9, background: "rgba(57,255,128,0.2)", color: "var(--green)", borderRadius: 4, padding: "1px 5px", fontWeight: 700 }}>FAIT</span>}
                    </div>
                    <div style={{ fontSize: 12, color: isFait ? "var(--green)" : t.color, fontWeight: 600, marginTop: 2 }}>{j.titre || t.label}</div>
                    {(j.exercices_cles || []).length > 0 && (
                      <div style={{ fontSize: 10, color: "#444", marginTop: 3 }}>{j.exercices_cles.slice(0,2).join(" · ")}{j.exercices_cles.length > 2 ? "…" : ""}</div>
                    )}
                    {!(j.exercices_cles?.length) && j.focus && <div style={{ fontSize: 11, color: "#444", marginTop: 2 }}>{j.focus}</div>}
                  </div>
                  <div style={{ textAlign: "right", flexShrink: 0, display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4 }}>
                    {j.duree > 0 && <div style={{ fontSize: 12, color: "#666" }}>{j.duree}min</div>}
                    <div style={{ fontSize: 14, color: isSelected ? "var(--yellow)" : "#333" }}>{isSelected ? "▲" : "▼"}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      ) : (
        <div style={{ textAlign: "center", padding: 40 }}>
          <div style={{ fontSize: 13, color: "#555", marginBottom: 16 }}>Génère ton planning de la semaine</div>
          <Btn onClick={() => generateWeekPlanning(profile, setPlanningWeek, setLoadingPlanning, {}, setStreamText)}>📅 Générer le planning</Btn>
        </div>
      )}
    </div>
  );
}

// Vue compacte pour l'accueil
function PlanningMiniCard({ profile, planningWeek, loadingPlanning, setPlanningWeek, setLoadingPlanning, onOpenPlanning }) {
  const todayIdx = (new Date().getDay() + 6) % 7;

  useEffect(() => {
    if (!planningWeek && !loadingPlanning) {
      generateWeekPlanning(profile, setPlanningWeek, setLoadingPlanning);
    }
  }, []);

  if (loadingPlanning) return (
    <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 14, padding: 12, marginBottom: 10 }}>
      <div style={{ fontSize: 11, color: "#444", textAlign: "center" }}>Chargement du planning…</div>
    </div>
  );

  if (!planningWeek) return null;

  return (
    <div onClick={onOpenPlanning} style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 14, padding: "12px 14px", marginBottom: 10, cursor: "pointer" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
        <div style={{ fontSize: 11, color: "#555", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em" }}>Planning S{profile.week || 1}</div>
        <div style={{ fontSize: 11, color: "var(--yellow)" }}>Voir tout →</div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 3 }}>
        {(planningWeek.jours || []).map((j, i) => {
          const t = TYPE_COLORS[j.type] || TYPE_COLORS.repos;
          const isToday = i === todayIdx;
          return (
            <div key={i} style={{ textAlign: "center" }}>
              <div style={{ fontSize: 8, color: isToday ? "var(--yellow)" : "#333", fontWeight: isToday ? 700 : 400, marginBottom: 3, textTransform: "uppercase" }}>{JOURS[i]}</div>
              <div style={{ width: "100%", aspectRatio: "1", borderRadius: 6, background: j.type === "repos" ? "var(--bg3)" : t.bg, border: isToday ? `1.5px solid ${t.color}` : `1px solid ${t.color}22`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12 }}>
                {t.icon}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ============================================================
// ONGLET NUTRITION
// ============================================================
// Catégories de recettes pour éviter les répétitions
// ============================================================
// POIDS OFFICIELS HYROX PAR STATION ET CATÉGORIE
// ============================================================
const HYROX_POIDS = {
  sled_push: {
    homme_open: "152kg (sled inclus)", homme_pro: "202kg (sled inclus)",
    femme_open: "102kg (sled inclus)", femme_pro: "152kg (sled inclus)",
  },
  sled_pull: {
    homme_open: "103kg (sled inclus)", homme_pro: "153kg (sled inclus)",
    femme_open: "78kg (sled inclus)", femme_pro: "103kg (sled inclus)",
  },
  farmers_carry: {
    homme_open: "2 × 24kg (kettlebells)", homme_pro: "2 × 32kg",
    femme_open: "2 × 16kg (kettlebells)", femme_pro: "2 × 24kg",
    distance: "200m",
  },
  wall_balls: {
    homme_open: "6kg → cible 3.05m (10 pieds)", homme_pro: "9kg → cible 3.05m",
    femme_open: "4kg → cible 2.74m (9 pieds)", femme_pro: "6kg → cible 2.74m",
    reps: "100 reps",
  },
  sandbag_lunges: {
    homme_open: "20kg", homme_pro: "30kg",
    femme_open: "10kg", femme_pro: "20kg",
    distance: "100m",
  },
  skierg: {
    tous: "Sans lest — 1000m",
  },
  rowing: {
    tous: "Sans lest — 1000m",
  },
  burpee_broad_jump: {
    tous: "Sans lest — 80m",
  },
};

function getPoidsHyrox(profile) {
  const cat = profile.hyroxCategorie === "pro" ? "pro" : "open";
  const genre = profile.sexe === "femme" ? "femme" : "homme";
  const key = `${genre}_${cat}`;
  return {
    sled_push: HYROX_POIDS.sled_push[key],
    sled_pull: HYROX_POIDS.sled_pull[key],
    farmers_carry: HYROX_POIDS.farmers_carry[key],
    wall_balls: HYROX_POIDS.wall_balls[key],
    sandbag_lunges: HYROX_POIDS.sandbag_lunges[key],
    skierg: "1000m sans lest",
    rowing: "1000m sans lest",
    burpee: "80m sans lest",
    categorie: `${genre === "femme" ? "Femme" : "Homme"} ${cat.toUpperCase()}`,
  };
}

const CATEGORIES_RECETTES = {
  petitdej: [
    "bowl protéiné aux céréales",
    "smoothie / shake pré-entraînement",
    "toast / tartine haute protéine",
    "pancakes / crêpes protéinées",
    "omelette / œufs travaillés",
    "overnight oats",
    "porridge chaud",
    "wrap petit-déjeuner",
    "açaï bowl",
    "muffins protéinés",
  ],
  recup: [
    "bowl riz + protéine animale",
    "shaker récupération maison",
    "pasta + viande maigre",
    "bowl quinoa + poisson",
    "wrap récupération",
    "soupe protéinée",
    "salade composée haute protéine",
    "bowl patate douce + poulet",
    "buddha bowl végétarien",
    "smoothie bowl récupération",
  ],
  snack: [
    "snack pré-séance rapide",
    "barre énergétique maison",
    "mix fruits secs et noix",
    "fromage blanc + fruits",
    "galettes de riz + protéine",
    "edamames vapeur",
    "smoothie inter-séance",
    "cottage cheese + baies",
  ],
};

const ALIMENTS_RAPIDES = [
  { nom: "Banane", emoji: "🍌", kcal: 89, p: 1, g: 23, l: 0 },
  { nom: "Shaker whey", emoji: "🥛", kcal: 130, p: 25, g: 5, l: 2 },
  { nom: "Œuf", emoji: "🥚", kcal: 70, p: 6, g: 0, l: 5 },
  { nom: "Riz 100g", emoji: "🍚", kcal: 130, p: 3, g: 28, l: 0 },
  { nom: "Pomme", emoji: "🍎", kcal: 52, p: 0, g: 14, l: 0 },
  { nom: "Amandes 30g", emoji: "🥜", kcal: 174, p: 6, g: 6, l: 15 },
  { nom: "Barre protéinée", emoji: "🍫", kcal: 200, p: 20, g: 22, l: 6 },
  { nom: "Avocat ½", emoji: "🥑", kcal: 120, p: 2, g: 6, l: 11 },
  { nom: "Fromage blanc", emoji: "🫙", kcal: 60, p: 8, g: 4, l: 1 },
  { nom: "Pain complet", emoji: "🍞", kcal: 80, p: 3, g: 15, l: 1 },
  { nom: "Lait 200ml", emoji: "🥛", kcal: 100, p: 7, g: 10, l: 3 },
  { nom: "Poulet 100g", emoji: "🍗", kcal: 165, p: 31, g: 0, l: 4 },
];

const OBJECTIFS_NUTRI = (poids) => ({
  kcal: Math.round(poids * 30 + 500),
  p: Math.round(poids * 2.0),
  g: Math.round(poids * 4.5),
  l: Math.round(poids * 1.0),
});

function NutritionTab({ profile }) {
  const [subTab, setSubTab] = useState("journal");
  const [repasJour, setRepasJour] = useState([]);
  const [showAdd, setShowAdd] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [customAliment, setCustomAliment] = useState({ nom: "", kcal: "", p: "", g: "", l: "" });
  const [loadingMacros, setLoadingMacros] = useState(false);
  const [loadingBilan, setLoadingBilan] = useState(false);
  const [bilanIA, setBilanIA] = useState(null);
  const [recetteIA, setRecetteIA] = useState(null);
  const [loadingRecette, setLoadingRecette] = useState(false);
  const [activeRecette, setActiveRecette] = useState(null);
  const [recetteType, setRecetteType] = useState("petitdej");

  const today = new Date().toISOString().split("T")[0];
  const storageKey = `nutri_${profile.name}_${today}`;
  const bilanKey = `bilan_nutri_${profile.name}_${today}`;

  useEffect(() => {
    storage.get(storageKey).then(d => { if (d) setRepasJour(d); });
    storage.get(bilanKey).then(d => { if (d) setBilanIA(d); });
  }, []);

  const totaux = repasJour.reduce((acc, r) => ({
    kcal: acc.kcal + (r.kcal || 0),
    p: acc.p + (r.p || 0),
    g: acc.g + (r.g || 0),
    l: acc.l + (r.l || 0),
  }), { kcal: 0, p: 0, g: 0, l: 0 });

  const objectifs = OBJECTIFS_NUTRI(profile.poids || 75);

  async function estimer() {
    if (!searchText.trim()) return;
    setLoadingMacros(true);
    const raw = await callClaude(
      "Tu es nutritionniste sportif expert. Réponds UNIQUEMENT en JSON valide sans backticks.",
      `Estime les valeurs nutritionnelles pour: "${searchText}"
JSON: {"nom":"${searchText}","kcal":0,"p":0,"g":0,"l":0,"portion":""}
Valeurs pour 1 portion normale. Arrondis à l'unité.`
    );
    try {
      const data = JSON.parse(raw?.replace(/\`\`\`json|\`\`\`/g, "").trim() || "{}");
      setCustomAliment({ nom: data.nom || searchText, kcal: data.kcal || "", p: data.p || "", g: data.g || "", l: data.l || "" });
    } catch { setCustomAliment(a => ({ ...a, nom: searchText })); }
    setLoadingMacros(false);
  }

  async function ajouterAliment(aliment) {
    const newRepas = [...repasJour, { ...aliment, id: Date.now(), heure: new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }) }];
    setRepasJour(newRepas);
    await storage.set(storageKey, newRepas);
    setShowAdd(false);
    setSearchText("");
    setCustomAliment({ nom: "", kcal: "", p: "", g: "", l: "" });
  }

  async function supprimerAliment(id) {
    const newRepas = repasJour.filter(r => r.id !== id);
    setRepasJour(newRepas);
    await storage.set(storageKey, newRepas);
  }

  const [bilanStreamText, setBilanStreamText] = useState("");

  async function genererBilan() {
    setLoadingBilan(true);
    setBilanStreamText("🔍 Analyse de tes apports nutritionnels...");
    const lastSession = (profile.sessions || []).slice(-1)[0];
    const raw = await callClaudeStream(
      "Tu es nutritionniste sportif spécialisé HYROX. Réponds JSON valide sans backticks.",
      `Analyse nutritionnelle journalière pour ${profile.name} (${profile.poids}kg, Niveau HYROX ${profile.level}) :

Consommé aujourd'hui:
${repasJour.map(r => `- ${r.nom}: ${r.kcal}kcal, ${r.p}g prot, ${r.g}g gluc, ${r.l}g lip`).join("\n")}

TOTAUX: ${totaux.kcal}kcal | ${totaux.p}g protéines | ${totaux.g}g glucides | ${totaux.l}g lipides
OBJECTIFS: ${objectifs.kcal}kcal | ${objectifs.p}g protéines | ${objectifs.g}g glucides | ${objectifs.l}g lipides
Dernière séance: ${lastSession?.titre || "aucune"}

JSON: {
  "note": 0,
  "message": "analyse personnalisée courte (2-3 phrases)",
  "manque": "ce qui manque concrètement aujourd'hui",
  "top": "le point positif principal",
  "conseil_demain": "1 conseil concret pour demain matin",
  "aliment_recommande": "1 aliment spécifique à ajouter maintenant si possible"
}`,
      600,
      (chunk) => {
        if (chunk.includes('"message"')) setBilanStreamText("📊 Évaluation de l'équilibre nutritionnel...");
        else if (chunk.includes('"conseil')) setBilanStreamText("💡 Génération des conseils personnalisés...");
      }
    );
    try {
      const data = JSON.parse(raw?.replace(/\`\`\`json|\`\`\`/g, "").trim() || "{}");
      setBilanIA(data);
      await storage.set(bilanKey, data);
    } catch {}
    setBilanStreamText("");
    setLoadingBilan(false);
  }

  async function genererRecetteIA(categorieForce = null) {
    setLoadingRecette(true);
    const lastSession = (profile.sessions || []).slice(-1)[0];
    const sessionType = lastSession?.type || "force_stations";

    // Choisir une catégorie en évitant les répétitions
    const cacheKey = `recettes_vues_${profile.name}_${recetteType}`;
    const vuesRaw = await storage.get(cacheKey).catch(() => null);
    const vues = vuesRaw ? vuesRaw : [];
    const categories = CATEGORIES_RECETTES[recetteType] || CATEGORIES_RECETTES.petitdej;
    const nonVues = categories.filter(c => !vues.includes(c));
    const pool = nonVues.length > 0 ? nonVues : categories; // reset si tout vu
    const categorie = categorieForce || pool[Math.floor(Math.random() * pool.length)];

    // Adapter les besoins selon la séance
    const besoinGlucides = sessionType === "running_zone2" || sessionType === "running_qualite" ? "élevé (séance cardio)" : "modéré";
    const besoinProteines = sessionType === "force_stations" ? "très élevé (séance de force)" : "normal";
    const timing = recetteType === "petitdej" ? "pré-entraînement (1-2h avant)" : recetteType === "recup" ? "post-séance (dans les 45 min)" : "entre les séances";

    const raw = await callClaude(
      "Tu es nutritionniste sportif expert spécialisé HYROX. Tu génères des recettes précises, réalistes, savoureuses et optimisées pour la performance. Réponds UNIQUEMENT en JSON valide sans backticks.",
      `Génère une recette de TYPE "${categorie}" pour un athlète HYROX.

PROFIL ATHLÈTE:
- ${profile.name}, ${profile.poids}kg, Niveau HYROX ${profile.level}/4
- Objectifs: ${objectifs.kcal}kcal/j | ${objectifs.p}g prot | ${objectifs.g}g gluc | ${objectifs.l}g lip
- Séance récente: ${lastSession?.titre || "Force Stations"}
- Besoin glucides: ${besoinGlucides}
- Besoin protéines: ${besoinProteines}
- Timing: ${timing}

CONTRAINTES:
- Recettes simples, ingrédients accessibles en supermarché
- Portions adaptées à ${profile.poids}kg
- Jamais la même recette deux fois (recettes déjà vues: ${vues.slice(-5).join(", ") || "aucune"})
- Être créatif et original

JSON: {
  "nom": "nom accrocheur et original",
  "emoji": "1 emoji représentatif",
  "temps": "X min",
  "kcal": 0,
  "p": 0,
  "g": 0,
  "l": 0,
  "ingredients": ["quantité + ingrédient précis", "..."],
  "prep": "étapes de préparation claires et courtes",
  "pourquoi": "explication scientifique courte pourquoi cette recette est optimale pour la performance/récupération",
  "categorie": "${categorie}"
}`
    );
    try {
      const data = JSON.parse(raw?.replace(/\`\`\`json|\`\`\`/g, "").trim() || "{}");
      setRecetteIA(data);
      // Sauvegarder dans le cache anti-répétition
      const newVues = [...vues.filter(v => v !== categorie), categorie].slice(-20);
      await storage.set(cacheKey, newVues);
    } catch (e) { console.error(e); }
    setLoadingRecette(false);
  }

  const getColor = (val, obj) => val >= obj ? "var(--green)" : val >= obj * 0.7 ? "var(--yellow)" : "var(--red)";

  const kcalColor = getColor(totaux.kcal, objectifs.kcal);
  const kcalPct = Math.min(100, Math.round((totaux.kcal / objectifs.kcal) * 100));

  return (
    <div className="fade-in">

      {/* ── HERO CALORIES ── */}
      <div style={{ background: "linear-gradient(145deg, #001a00 0%, #080808 60%)", border: `1.5px solid ${kcalColor === "var(--green)" ? "rgba(57,255,128,0.2)" : kcalColor === "var(--yellow)" ? "rgba(232,255,71,0.2)" : "rgba(255,71,71,0.2)"}`, borderRadius: 20, padding: "20px 20px 16px", marginBottom: 14, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -30, right: -20, fontSize: 110, opacity: 0.04 }}>🥗</div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
          <div>
            <div style={{ fontSize: 10, color: "#333", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 6 }}>Calories aujourd'hui</div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
              <div className="bebas" style={{ fontSize: 64, color: kcalColor, lineHeight: 1 }}>{totaux.kcal}</div>
              <div style={{ fontSize: 14, color: "#333" }}>/ {objectifs.kcal}</div>
            </div>
            <div style={{ fontSize: 11, color: "#444", marginTop: 2 }}>{objectifs.kcal - totaux.kcal > 0 ? `${objectifs.kcal - totaux.kcal} kcal restantes` : "Objectif atteint ✓"}</div>
          </div>
          {/* Anneau SVG */}
          <svg width="72" height="72" viewBox="0 0 72 72">
            <circle cx="36" cy="36" r="28" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="7" />
            <circle cx="36" cy="36" r="28" fill="none" stroke={kcalColor} strokeWidth="7" strokeLinecap="round"
              strokeDasharray={2 * Math.PI * 28} strokeDashoffset={2 * Math.PI * 28 * (1 - kcalPct / 100)}
              transform="rotate(-90 36 36)" style={{ transition: "stroke-dashoffset 0.8s" }} />
            <text x="36" y="40" textAnchor="middle" fontFamily="'Bebas Neue',sans-serif" fontSize="16" fill={kcalColor}>{kcalPct}%</text>
          </svg>
        </div>
        {/* Macros barres */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
          {[
            { label: "Protéines", val: totaux.p, obj: objectifs.p, color: "var(--green)" },
            { label: "Glucides", val: totaux.g, obj: objectifs.g, color: "var(--yellow)" },
            { label: "Lipides", val: totaux.l, obj: objectifs.l, color: "var(--orange)" },
          ].map(m => {
            const pct = Math.min(100, Math.round((m.val / m.obj) * 100));
            return (
              <div key={m.label}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                  <span style={{ fontSize: 9, color: "#444", textTransform: "uppercase" }}>{m.label}</span>
                  <span className="bebas" style={{ fontSize: 13, color: m.color }}>{m.val}<span style={{ fontSize: 9, color: "#333" }}>g</span></span>
                </div>
                <div style={{ height: 4, background: "rgba(255,255,255,0.05)", borderRadius: 99, overflow: "hidden" }}>
                  <div style={{ width: `${pct}%`, height: "100%", background: m.color, borderRadius: 99, transition: "width 0.6s" }} />
                </div>
                <div style={{ fontSize: 9, color: "#333", marginTop: 3 }}>/ {m.obj}g</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── SUB-TABS ── */}
      <div style={{ display: "flex", gap: 6, marginBottom: 16, background: "rgba(255,255,255,0.02)", borderRadius: 14, padding: 4 }}>
        {[
          { id: "journal", label: "📋 Journal" },
          { id: "recettes", label: "👨‍🍳 Recettes" },
          { id: "bilan", label: "🤖 Bilan IA" },
        ].map(t => (
          <button key={t.id} onClick={() => setSubTab(t.id)} style={{
            flex: 1, padding: "10px 4px", borderRadius: 10, fontSize: 12, fontWeight: 700,
            background: subTab === t.id ? "rgba(232,255,71,0.12)" : "transparent",
            border: subTab === t.id ? "1.5px solid rgba(232,255,71,0.3)" : "1.5px solid transparent",
            color: subTab === t.id ? "var(--yellow)" : "#444", cursor: "pointer", transition: "all 0.2s",
          }}>{t.label}</button>
        ))}
      </div>

      {/* ══ JOURNAL ══ */}
      {subTab === "journal" && (
        <div>
          {/* ── SUGGESTIONS RAPIDES ── */}
          {(() => {
            const QUICK_FOODS = [
              { emoji: "🍌", nom: "Banane", kcal: 89, p: 1, g: 23, l: 0 },
              { emoji: "🥚", nom: "Œufs x2", kcal: 156, p: 12, g: 1, l: 11 },
              { emoji: "🍗", nom: "Blanc poulet 150g", kcal: 165, p: 31, g: 0, l: 3 },
              { emoji: "🥛", nom: "Yaourt grec 200g", kcal: 130, p: 10, g: 9, l: 4 },
              { emoji: "🌾", nom: "Flocons avoine 60g", kcal: 220, p: 7, g: 40, l: 4 },
              { emoji: "🥜", nom: "Amandes 30g", kcal: 174, p: 6, g: 5, l: 15 },
              { emoji: "🍚", nom: "Riz cuit 150g", kcal: 195, p: 4, g: 43, l: 0 },
              { emoji: "🥤", nom: "Whey shake", kcal: 130, p: 25, g: 5, l: 2 },
            ];
            return (
              <div style={{ marginBottom: 14 }}>
                <div style={{ fontSize: 10, color: "#2a2a2a", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>⚡ Ajout rapide HYROX</div>
                <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 4, scrollbarWidth: "none" }}>
                  {QUICK_FOODS.map((f, i) => (
                    <button key={i} onClick={() => ajouterAliment(f)} style={{
                      flexShrink: 0, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)",
                      borderRadius: 12, padding: "10px 12px", cursor: "pointer", textAlign: "center", minWidth: 76,
                    }}>
                      <div style={{ fontSize: 20, marginBottom: 4 }}>{f.emoji}</div>
                      <div style={{ fontSize: 9, color: "#888", lineHeight: 1.3, marginBottom: 3 }}>{f.nom.split(" ")[0]}</div>
                      <div style={{ fontSize: 10, fontWeight: 700, color: "var(--yellow)" }}>{f.kcal}</div>
                      <div style={{ fontSize: 8, color: "#333" }}>kcal</div>
                    </button>
                  ))}
                </div>
              </div>
            );
          })()}

          {/* Liste repas */}
          <div style={{ marginBottom: 14 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
              <div style={{ fontSize: 11, color: "#333", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em" }}>Repas · {repasJour.length} aliments</div>
              <button onClick={() => setShowAdd(true)} style={{ background: "var(--yellow)", border: "none", borderRadius: 10, padding: "7px 14px", fontSize: 13, fontFamily: "'Bebas Neue',sans-serif", letterSpacing: 1, color: "#000", cursor: "pointer" }}>+ AJOUTER</button>
            </div>

            {repasJour.length === 0 ? (
              <div style={{ background: "rgba(255,255,255,0.02)", border: "1px dashed rgba(255,255,255,0.07)", borderRadius: 16, padding: "32px 20px", textAlign: "center" }}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>🍽️</div>
                <div style={{ fontSize: 13, color: "#444", lineHeight: 1.7 }}>Aucun aliment aujourd'hui.<br/>Commence par ton petit-déjeuner !</div>
                <button onClick={() => setShowAdd(true)} style={{ marginTop: 14, background: "rgba(232,255,71,0.08)", border: "1px solid rgba(232,255,71,0.2)", borderRadius: 10, padding: "10px 20px", fontSize: 13, color: "var(--yellow)", cursor: "pointer", fontWeight: 600 }}>
                  Ajouter un aliment
                </button>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {repasJour.map((r, i) => {
                  const kcalPctItem = Math.round((r.kcal / objectifs.kcal) * 100);
                  return (
                    <div key={r.id || i} style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: 14, padding: "12px 14px", display: "flex", alignItems: "center", gap: 12, position: "relative", overflow: "hidden" }}>
                      <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: `${Math.min(100, kcalPctItem * 3)}%`, background: "rgba(57,255,128,0.03)", pointerEvents: "none" }} />
                      <div style={{ width: 38, height: 38, borderRadius: 10, background: "rgba(255,255,255,0.04)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>{r.emoji || "🍽️"}</div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: 600, fontSize: 14, color: "var(--white)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.nom}</div>
                        <div style={{ display: "flex", gap: 8, marginTop: 4, flexWrap: "wrap" }}>
                          <span style={{ fontSize: 11, color: "var(--yellow)", fontWeight: 700 }}>{r.kcal} kcal</span>
                          <span style={{ fontSize: 11, color: "var(--green)" }}>{r.p}g P</span>
                          <span style={{ fontSize: 11, color: "#aaa" }}>{r.g}g G</span>
                          <span style={{ fontSize: 11, color: "var(--orange)" }}>{r.l}g L</span>
                        </div>
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4 }}>
                        {r.heure && <div style={{ fontSize: 10, color: "#333" }}>{r.heure}</div>}
                        <button onClick={() => supprimerAliment(r.id)} style={{ background: "rgba(255,71,71,0.08)", border: "1px solid rgba(255,71,71,0.15)", borderRadius: 6, padding: "3px 8px", color: "var(--red)", fontSize: 13, cursor: "pointer" }}>×</button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Modal ajout aliment */}
          {showAdd && (
            <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.88)", zIndex: 300, display: "flex", alignItems: "flex-end" }}>
              <div className="slide-up" style={{ background: "#0d0d0d", borderRadius: "22px 22px 0 0", padding: "0 0 32px", width: "100%", maxWidth: 480, margin: "0 auto", maxHeight: "92vh", overflowY: "auto", border: "1px solid rgba(255,255,255,0.06)" }}>
                {/* Poignée */}
                <div style={{ padding: "14px 0 0", textAlign: "center" }}>
                  <div style={{ width: 36, height: 4, background: "#222", borderRadius: 99, margin: "0 auto" }} />
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 20px 16px" }}>
                  <div className="bebas" style={{ fontSize: 22, color: "var(--yellow)", letterSpacing: 1 }}>AJOUTER UN ALIMENT</div>
                  <button onClick={() => { setShowAdd(false); setSearchText(""); setCustomAliment({ nom: "", kcal: "", p: "", g: "", l: "" }); }}
                    style={{ width: 32, height: 32, borderRadius: "50%", background: "rgba(255,255,255,0.05)", border: "none", color: "#555", fontSize: 16, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>✕</button>
                </div>

                <div style={{ padding: "0 16px" }}>
                  {/* PHOTO */}
                  <label style={{ display: "block", background: "rgba(232,255,71,0.04)", border: "1.5px dashed rgba(232,255,71,0.25)", borderRadius: 14, padding: 16, textAlign: "center", cursor: "pointer", marginBottom: 14 }}>
                    <input type="file" accept="image/*" capture="environment" style={{ display: "none" }}
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        setLoadingMacros(true);
                        const reader = new FileReader();
                        reader.onload = async (ev) => {
                          const base64 = ev.target.result.split(",")[1];
                          try {
                            const response = await fetch("/api/claude", { method: "POST", headers: { "Content-Type": "application/json" },
                              body: JSON.stringify({ model: "claude-sonnet-4-5", max_tokens: 400, messages: [{ role: "user", content: [
                                { type: "image", source: { type: "base64", media_type: file.type, data: base64 } },
                                { type: "text", text: 'Analyse cette photo de repas. Réponds UNIQUEMENT en JSON sans backticks: {"nom":"nom du plat","kcal":0,"p":0,"g":0,"l":0}' }
                              ]}]})
                            });
                            const data = await response.json();
                            const parsed = JSON.parse((data.content?.map(b=>b.text||"").join("")||"").replace(/```json|```/g,"").trim());
                            setCustomAliment({ nom: parsed.nom||"Repas", kcal: String(parsed.kcal||""), p: String(parsed.p||""), g: String(parsed.g||""), l: String(parsed.l||"") });
                          } catch(err) { console.error(err); }
                          setLoadingMacros(false);
                        };
                        reader.readAsDataURL(file);
                      }}
                    />
                    {loadingMacros ? (
                      <div style={{ display: "flex", gap: 6, justifyContent: "center", alignItems: "center", padding: 8 }}>
                        {[0,1,2].map(i => <div key={i} style={{ width: 7, height: 7, borderRadius: "50%", background: "var(--yellow)", animation: `pulse 1.2s ${i*0.2}s ease-in-out infinite` }} />)}
                        <span style={{ fontSize: 13, color: "var(--yellow)", marginLeft: 8 }}>Analyse en cours…</span>
                      </div>
                    ) : (
                      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <div style={{ width: 44, height: 44, borderRadius: 12, background: "rgba(232,255,71,0.1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>📸</div>
                        <div style={{ textAlign: "left" }}>
                          <div style={{ fontSize: 14, color: "var(--yellow)", fontWeight: 700 }}>Photo du repas</div>
                          <div style={{ fontSize: 11, color: "#444", marginTop: 2 }}>L'IA estime les macros automatiquement</div>
                        </div>
                      </div>
                    )}
                  </label>

                  {/* Ajout rapide */}
                  <div style={{ marginBottom: 14 }}>
                    <div style={{ fontSize: 10, color: "#333", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 700, marginBottom: 8 }}>Ajout rapide</div>
                    <div style={{ display: "flex", gap: 6, overflowX: "auto", paddingBottom: 4, scrollbarWidth: "none" }}>
                      {ALIMENTS_RAPIDES.map((a, i) => (
                        <button key={i} onClick={() => ajouterAliment(a)} style={{
                          flexShrink: 0, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 12,
                          padding: "10px 12px", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 4, minWidth: 70,
                        }}>
                          <span style={{ fontSize: 22 }}>{a.emoji}</span>
                          <span style={{ fontSize: 10, color: "#888", textAlign: "center", lineHeight: 1.2 }}>{a.nom}</span>
                          <span style={{ fontSize: 9, color: "var(--yellow)" }}>{a.kcal}kcal</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Recherche IA */}
                  <div style={{ marginBottom: 14 }}>
                    <div style={{ fontSize: 10, color: "#333", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 700, marginBottom: 8 }}>Recherche IA</div>
                    <div style={{ display: "flex", gap: 8 }}>
                      <input value={searchText} onChange={e => setSearchText(e.target.value)} onKeyDown={e => e.key === "Enter" && estimer()}
                        placeholder="ex: 2 œufs brouillés, tartine beurre..."
                        style={{ flex: 1, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, padding: "12px 14px", color: "var(--white)", fontSize: 14, minWidth: 0, outline: "none" }} />
                      <button onClick={estimer} disabled={!searchText.trim() || loadingMacros} style={{
                        background: searchText.trim() && !loadingMacros ? "var(--yellow)" : "rgba(255,255,255,0.04)", border: "none", borderRadius: 12, padding: "0 18px",
                        fontSize: 16, fontFamily: "'Bebas Neue',sans-serif", letterSpacing: 1, color: searchText.trim() && !loadingMacros ? "#000" : "#333", cursor: "pointer", flexShrink: 0,
                      }}>{loadingMacros ? "…" : "GO"}</button>
                    </div>
                  </div>

                  {/* Champs manuels */}
                  <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: 14, padding: "14px", marginBottom: 14 }}>
                    <div style={{ fontSize: 10, color: "#333", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 700, marginBottom: 10 }}>Valeurs nutritionnelles</div>
                    <div style={{ marginBottom: 10 }}>
                      <Input label="Nom de l'aliment" value={customAliment.nom} onChange={v => setCustomAliment(a => ({ ...a, nom: v }))} placeholder="ex: Riz blanc cuit 200g" />
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 8 }}>
                      {[
                        { key: "kcal", label: "Kcal", color: "var(--yellow)" },
                        { key: "p", label: "Prot. g", color: "var(--green)" },
                        { key: "g", label: "Gluc. g", color: "#aaa" },
                        { key: "l", label: "Lip. g", color: "var(--orange)" },
                      ].map(f => (
                        <div key={f.key}>
                          <div style={{ fontSize: 9, color: f.color, textTransform: "uppercase", fontWeight: 700, marginBottom: 4 }}>{f.label}</div>
                          <input type="number" value={customAliment[f.key]} onChange={e => setCustomAliment(a => ({ ...a, [f.key]: e.target.value }))}
                            placeholder="0" style={{ width: "100%", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 8, padding: "8px 10px", color: f.color, fontSize: 16, fontFamily: "'Bebas Neue',sans-serif", outline: "none", textAlign: "center" }} />
                        </div>
                      ))}
                    </div>
                  </div>

                  <button onClick={() => ajouterAliment({ ...customAliment, kcal: parseInt(customAliment.kcal)||0, p: parseInt(customAliment.p)||0, g: parseInt(customAliment.g)||0, l: parseInt(customAliment.l)||0 })}
                    disabled={!customAliment.nom} style={{
                      width: "100%", padding: 16, borderRadius: 14, border: "none",
                      background: customAliment.nom ? "var(--yellow)" : "rgba(255,255,255,0.04)",
                      color: customAliment.nom ? "#000" : "#333",
                      fontSize: 18, fontFamily: "'Bebas Neue',sans-serif", letterSpacing: 1, cursor: customAliment.nom ? "pointer" : "default",
                    }}>AJOUTER AU JOURNAL ✓</button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ══ RECETTES ══ */}
      {subTab === "recettes" && (
        <div>
          {/* Sélecteur type */}
          <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
            {[
              { id: "petitdej", icon: "🌅", label: "Petit-déj", color: "var(--yellow)", rgb: "232,255,71" },
              { id: "recup", icon: "💪", label: "Récup", color: "var(--green)", rgb: "57,255,128" },
              { id: "snack", icon: "⚡", label: "Snack", color: "var(--orange)", rgb: "255,154,60" },
            ].map(t => (
              <button key={t.id} onClick={() => { setRecetteType(t.id); setRecetteIA(null); }} style={{
                flex: 1, padding: "12px 4px", borderRadius: 12, fontSize: 12, fontWeight: 700,
                background: recetteType === t.id ? `rgba(${t.rgb},0.1)` : "rgba(255,255,255,0.02)",
                border: recetteType === t.id ? `1.5px solid rgba(${t.rgb},0.4)` : "1px solid rgba(255,255,255,0.05)",
                color: recetteType === t.id ? t.color : "#444", cursor: "pointer", transition: "all 0.2s",
              }}><div style={{ fontSize: 18, marginBottom: 4 }}>{t.icon}</div>{t.label}</button>
            ))}
          </div>

          {!recetteIA && !loadingRecette && (
            <div>
              {/* CTA principal */}
              <div style={{ background: "linear-gradient(135deg, rgba(232,255,71,0.06) 0%, rgba(0,0,0,0) 60%)", border: "1.5px solid rgba(232,255,71,0.2)", borderRadius: 18, padding: "20px 18px", marginBottom: 14, position: "relative", overflow: "hidden" }}>
                <div style={{ position: "absolute", top: -20, right: -10, fontSize: 80, opacity: 0.05 }}>👨‍🍳</div>
                <div className="bebas" style={{ fontSize: 24, color: "var(--yellow)", letterSpacing: 1, marginBottom: 6 }}>RECETTE IA PERSO</div>
                <div style={{ fontSize: 13, color: "#555", lineHeight: 1.6, marginBottom: 14 }}>
                  Adaptée à ton profil {profile.poids}kg, ta séance du jour et tes objectifs. Jamais la même deux fois.
                </div>
                <button onClick={() => genererRecetteIA()} style={{ width: "100%", padding: 14, borderRadius: 12, border: "none", background: "var(--yellow)", color: "#000", fontSize: 18, fontFamily: "'Bebas Neue',sans-serif", letterSpacing: 1, cursor: "pointer" }}>
                  ✨ GÉNÉRER UNE RECETTE
                </button>
              </div>
              {/* Styles rapides */}
              <div style={{ fontSize: 10, color: "#333", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 700, marginBottom: 8 }}>Choisir un style</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {(CATEGORIES_RECETTES[recetteType] || []).map((cat, i) => (
                  <button key={i} onClick={() => genererRecetteIA(cat)} style={{
                    background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 20,
                    padding: "7px 14px", fontSize: 12, color: "#666", cursor: "pointer",
                  }}>{cat}</button>
                ))}
              </div>
            </div>
          )}

          {loadingRecette && (
            <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: 18, padding: "40px 20px", textAlign: "center" }}>
              <div style={{ display: "flex", gap: 8, justifyContent: "center", marginBottom: 16 }}>
                {[0,1,2].map(i => <div key={i} style={{ width: 10, height: 10, borderRadius: "50%", background: "var(--yellow)", animation: `pulse 1.2s ${i*0.2}s ease-in-out infinite` }} />)}
              </div>
              <div style={{ fontSize: 13, color: "#555" }}>Ton coach prépare ta recette…</div>
            </div>
          )}

          {recetteIA && !loadingRecette && (
            <div className="float-up">
              {/* Header recette */}
              <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 18, overflow: "hidden", marginBottom: 10 }}>
                <div style={{ background: "linear-gradient(135deg, rgba(232,255,71,0.06) 0%, rgba(0,0,0,0) 60%)", padding: "18px 18px 14px", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                  <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                    <div style={{ width: 56, height: 56, borderRadius: 14, background: "rgba(232,255,71,0.1)", border: "1px solid rgba(232,255,71,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 30, flexShrink: 0 }}>{recetteIA.emoji || "🍽️"}</div>
                    <div style={{ flex: 1 }}>
                      <div className="bebas" style={{ fontSize: 22, color: "var(--white)", lineHeight: 1.1, marginBottom: 4 }}>{recetteIA.nom}</div>
                      <div style={{ display: "flex", gap: 8 }}>
                        <span style={{ fontSize: 11, color: "#444" }}>⏱ {recetteIA.temps}</span>
                        {recetteIA.categorie && <span style={{ fontSize: 11, color: "#333" }}>· {recetteIA.categorie}</span>}
                      </div>
                    </div>
                  </div>
                  {/* Macros recette */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 8, marginTop: 14 }}>
                    {[
                      { l: "Kcal", v: recetteIA.kcal, c: "var(--yellow)", u: "" },
                      { l: "Prot.", v: recetteIA.p, c: "var(--green)", u: "g" },
                      { l: "Gluc.", v: recetteIA.g, c: "#ccc", u: "g" },
                      { l: "Lip.", v: recetteIA.l, c: "var(--orange)", u: "g" },
                    ].map(m => (
                      <div key={m.l} style={{ background: "rgba(255,255,255,0.03)", borderRadius: 10, padding: "8px 6px", textAlign: "center" }}>
                        <div className="bebas" style={{ fontSize: 20, color: m.c, lineHeight: 1 }}>{m.v}{m.u}</div>
                        <div style={{ fontSize: 9, color: "#444", marginTop: 2 }}>{m.l}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Ingrédients */}
                <div style={{ padding: "14px 18px", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                  <div style={{ fontSize: 10, color: "var(--yellow)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 10 }}>Ingrédients</div>
                  {(recetteIA.ingredients || []).map((ing, i) => (
                    <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start", marginBottom: 7 }}>
                      <div style={{ width: 5, height: 5, borderRadius: "50%", background: "var(--yellow)", marginTop: 6, flexShrink: 0 }} />
                      <span style={{ fontSize: 13, color: "#ccc", lineHeight: 1.4 }}>{ing}</span>
                    </div>
                  ))}
                </div>

                {/* Préparation */}
                <div style={{ padding: "14px 18px", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                  <div style={{ fontSize: 10, color: "var(--green)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>Préparation</div>
                  <div style={{ fontSize: 13, color: "#ccc", lineHeight: 1.75 }}>{recetteIA.prep}</div>
                </div>

                {/* Pourquoi */}
                {recetteIA.pourquoi && (
                  <div style={{ padding: "14px 18px", background: "rgba(57,255,128,0.03)" }}>
                    <div style={{ fontSize: 10, color: "var(--green)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 6 }}>💡 Pourquoi cette recette ?</div>
                    <div style={{ fontSize: 12, color: "#888", lineHeight: 1.7 }}>{recetteIA.pourquoi}</div>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
                <button onClick={() => setRecetteIA(null)} style={{ flex: 1, padding: "13px 0", borderRadius: 12, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", color: "#888", fontSize: 16, fontFamily: "'Bebas Neue',sans-serif", cursor: "pointer" }}>↺ AUTRE</button>
                <button onClick={() => ajouterAliment({ nom: recetteIA.nom, emoji: recetteIA.emoji || "🍽️", kcal: recetteIA.kcal, p: recetteIA.p, g: recetteIA.g, l: recetteIA.l })} style={{ flex: 2, padding: "13px 0", borderRadius: 12, background: "var(--green)", border: "none", color: "#000", fontSize: 16, fontFamily: "'Bebas Neue',sans-serif", fontWeight: 700, cursor: "pointer" }}>
                  + AJOUTER AU JOURNAL
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ══ BILAN IA ══ */}
      {subTab === "bilan" && (
        <div>
          {/* Recap macros */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 14 }}>
            {[
              { label: "Calories", val: totaux.kcal, obj: objectifs.kcal, unit: "kcal", color: kcalColor, bg: "rgba(232,255,71,0.05)", border: "rgba(232,255,71,0.15)" },
              { label: "Protéines", val: totaux.p, obj: objectifs.p, unit: "g", color: "var(--green)", bg: "rgba(57,255,128,0.05)", border: "rgba(57,255,128,0.15)" },
              { label: "Glucides", val: totaux.g, obj: objectifs.g, unit: "g", color: "#aaa", bg: "rgba(255,255,255,0.02)", border: "rgba(255,255,255,0.06)" },
              { label: "Lipides", val: totaux.l, obj: objectifs.l, unit: "g", color: "var(--orange)", bg: "rgba(255,154,60,0.05)", border: "rgba(255,154,60,0.15)" },
            ].map(m => {
              const pct = Math.min(100, Math.round((m.val / m.obj) * 100));
              return (
                <div key={m.label} style={{ background: m.bg, border: `1px solid ${m.border}`, borderRadius: 14, padding: "14px 12px" }}>
                  <div style={{ fontSize: 9, color: "#333", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 6 }}>{m.label}</div>
                  <div className="bebas" style={{ fontSize: 30, color: m.color, lineHeight: 1 }}>{m.val}<span style={{ fontSize: 13, color: "#444" }}>{m.unit}</span></div>
                  <div style={{ fontSize: 10, color: "#333", marginBottom: 6 }}>obj. {m.obj}{m.unit}</div>
                  <div style={{ height: 3, background: "rgba(255,255,255,0.05)", borderRadius: 99, overflow: "hidden" }}>
                    <div style={{ width: `${pct}%`, height: "100%", background: m.color, borderRadius: 99 }} />
                  </div>
                  <div style={{ fontSize: 9, color: m.color, marginTop: 4, fontWeight: 700 }}>{pct}%</div>
                </div>
              );
            })}
          </div>

          {/* Bouton / loading bilan */}
          {repasJour.length === 0 ? (
            <div style={{ background: "rgba(255,255,255,0.02)", border: "1px dashed rgba(255,255,255,0.06)", borderRadius: 14, padding: "24px 20px", textAlign: "center" }}>
              <div style={{ fontSize: 32, marginBottom: 10 }}>📋</div>
              <div style={{ fontSize: 13, color: "#444" }}>Ajoute des aliments dans le journal d'abord.</div>
            </div>
          ) : loadingBilan ? (
            <div style={{ background: "rgba(57,255,128,0.04)", border: "1px solid rgba(57,255,128,0.15)", borderRadius: 16, padding: "20px 16px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: "rgba(57,255,128,0.1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>🤖</div>
                <div className="bebas" style={{ fontSize: 16, color: "var(--green)", letterSpacing: 1 }}>COACH NUTRITIONNEL IA</div>
              </div>
              <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                {[0,1,2].map(i => <div key={i} style={{ width: 7, height: 7, borderRadius: "50%", background: "var(--green)", animation: `pulse 1.2s ${i*0.2}s ease-in-out infinite` }} />)}
                <span style={{ fontSize: 12, color: "#555", marginLeft: 6 }}>{bilanStreamText}</span>
              </div>
            </div>
          ) : !bilanIA ? (
            <button onClick={genererBilan} style={{ width: "100%", padding: 16, borderRadius: 14, border: "none", background: "linear-gradient(135deg, rgba(57,255,128,0.12), rgba(57,255,128,0.05))", color: "var(--green)", fontSize: 18, fontFamily: "'Bebas Neue',sans-serif", letterSpacing: 1, cursor: "pointer", border: "1.5px solid rgba(57,255,128,0.25)" }}>
              🤖 GÉNÉRER LE BILAN IA
            </button>
          ) : null}

          {/* Résultat bilan */}
          {bilanIA && (
            <div className="float-up">
              {/* Score note */}
              <div style={{ background: "linear-gradient(135deg, rgba(57,255,128,0.06) 0%, rgba(0,0,0,0) 60%)", border: "1.5px solid rgba(57,255,128,0.2)", borderRadius: 18, padding: "18px", marginBottom: 10, display: "flex", alignItems: "center", gap: 16 }}>
                <div style={{ width: 60, height: 60, borderRadius: "50%", background: bilanIA.note >= 7 ? "rgba(57,255,128,0.12)" : bilanIA.note >= 5 ? "rgba(232,255,71,0.1)" : "rgba(255,71,71,0.1)", border: `2px solid ${bilanIA.note >= 7 ? "rgba(57,255,128,0.4)" : bilanIA.note >= 5 ? "rgba(232,255,71,0.3)" : "rgba(255,71,71,0.3)"}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <div className="bebas" style={{ fontSize: 26, color: bilanIA.note >= 7 ? "var(--green)" : bilanIA.note >= 5 ? "var(--yellow)" : "var(--red)", lineHeight: 1 }}>{bilanIA.note}</div>
                  <div style={{ fontSize: 9, color: "#444" }}>/10</div>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 10, color: "#333", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 5 }}>Analyse du coach</div>
                  <div style={{ fontSize: 13, color: "#ccc", lineHeight: 1.65 }}>{bilanIA.message}</div>
                </div>
              </div>

              {/* Cards feedback */}
              {[
                { key: "top", label: "✅ Point positif", color: "var(--green)", bg: "rgba(57,255,128,0.05)", border: "rgba(57,255,128,0.15)" },
                { key: "manque", label: "⚠️ Ce qui manque", color: "var(--red)", bg: "rgba(255,71,71,0.05)", border: "rgba(255,71,71,0.12)" },
                { key: "conseil_demain", label: "💡 Demain matin", color: "var(--yellow)", bg: "rgba(232,255,71,0.04)", border: "rgba(232,255,71,0.12)" },
                { key: "aliment_recommande", label: "🛒 À ajouter maintenant", color: "var(--orange)", bg: "rgba(255,154,60,0.05)", border: "rgba(255,154,60,0.12)" },
              ].filter(f => bilanIA[f.key]).map(f => (
                <div key={f.key} style={{ background: f.bg, border: `1px solid ${f.border}`, borderRadius: 14, padding: "12px 14px", marginBottom: 8 }}>
                  <div style={{ fontSize: 10, color: f.color, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 5 }}>{f.label}</div>
                  <div style={{ fontSize: 13, color: "#ccc", lineHeight: 1.6 }}>{bilanIA[f.key]}</div>
                </div>
              ))}

              <button onClick={genererBilan} style={{ width: "100%", padding: "13px 0", borderRadius: 12, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", color: "#555", fontSize: 14, fontFamily: "'Bebas Neue',sans-serif", cursor: "pointer", marginTop: 4 }}>
                ↺ Relancer l'analyse
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ============================================================
// ONGLET COURSE
// ============================================================
function ChecklistJDay({ items }) {
  const [checked, setChecked] = useState({});
  const toggle = (i) => setChecked(c => ({ ...c, [i]: !c[i] }));
  const done = Object.values(checked).filter(Boolean).length;
  return (
    <Card style={{ border: "1.5px solid rgba(232,255,71,0.2)", marginBottom: 12 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <div className="bebas" style={{ fontSize: 16, color: "var(--yellow)" }}>✅ CHECKLIST J-DAY</div>
        <div style={{ fontSize: 11, color: "#555" }}>{done}/{items.length}</div>
      </div>
      <ProgressBar value={done} max={items.length} color="var(--green)" height={3} />
      <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 8 }}>
        {items.map((item, i) => (
          <div key={i} onClick={() => toggle(i)} style={{ display: "flex", alignItems: "center", gap: 12, cursor: "pointer", padding: "4px 0", opacity: checked[i] ? 0.5 : 1, transition: "opacity 0.2s" }}>
            <div style={{ width: 22, height: 22, borderRadius: 6, border: checked[i] ? "none" : "2px solid #444", background: checked[i] ? "var(--green)" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, flexShrink: 0, transition: "all 0.2s" }}>
              {checked[i] ? "✓" : ""}
            </div>
            <span style={{ fontSize: 13, color: checked[i] ? "var(--green)" : "#ccc", textDecoration: checked[i] ? "line-through" : "none" }}>{item}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}

const HYROX_SEGMENTS = [
  { id: "run1", type: "run", label: "Run 1", distance: "1 km", icon: "🏃", color: "var(--green)" },
  { id: "ski", type: "station", label: "SkiErg", distance: "1 000 m", icon: "⛷️", color: "var(--yellow)" },
  { id: "run2", type: "run", label: "Run 2", distance: "1 km", icon: "🏃", color: "var(--green)" },
  { id: "sled_push", type: "station", label: "Sled Push", distance: "50 m", icon: "🛷", color: "var(--yellow)" },
  { id: "run3", type: "run", label: "Run 3", distance: "1 km", icon: "🏃", color: "var(--green)" },
  { id: "sled_pull", type: "station", label: "Sled Pull", distance: "50 m", icon: "🔗", color: "var(--yellow)" },
  { id: "run4", type: "run", label: "Run 4", distance: "1 km", icon: "🏃", color: "var(--green)" },
  { id: "burpee", type: "station", label: "Burpee BJ", distance: "80 m", icon: "💥", color: "var(--yellow)" },
  { id: "run5", type: "run", label: "Run 5", distance: "1 km", icon: "🏃", color: "var(--green)" },
  { id: "rowing", type: "station", label: "Rowing", distance: "1 000 m", icon: "🚣", color: "var(--yellow)" },
  { id: "run6", type: "run", label: "Run 6", distance: "1 km", icon: "🏃", color: "var(--green)" },
  { id: "farmers", type: "station", label: "Farmers Carry", distance: "200 m", icon: "🧳", color: "var(--yellow)" },
  { id: "run7", type: "run", label: "Run 7", distance: "1 km", icon: "🏃", color: "var(--green)" },
  { id: "sandbag", type: "station", label: "Sandbag Lunges", distance: "100 m", icon: "🎒", color: "var(--yellow)" },
  { id: "run8", type: "run", label: "Run 8", distance: "1 km", icon: "🏃", color: "var(--green)" },
  { id: "wallball", type: "station", label: "Wall Balls", distance: "100 reps", icon: "🏀", color: "var(--red)" },
];

function fmtTime(secs) {
  if (secs == null) return "--:--";
  const h = Math.floor(secs / 3600);
  const m = Math.floor((secs % 3600) / 60).toString().padStart(2, "0");
  const s = (secs % 60).toString().padStart(2, "0");
  return h > 0 ? `${h}:${m}:${s}` : `${m}:${s}`;
}

function SimulationRace({ profile, onClose }) {
  const [phase, setPhase] = useState("ready"); // ready | running | done
  const [currentIdx, setCurrentIdx] = useState(0);
  const [splits, setSplits] = useState({}); // id → secs
  const [segStart, setSegStart] = useState(null);
  const [elapsed, setElapsed] = useState(0);
  const [totalElapsed, setTotalElapsed] = useState(0);
  const [raceStart, setRaceStart] = useState(null);
  const [analysisText, setAnalysisText] = useState("");
  const [loadingAnalysis, setLoadingAnalysis] = useState(false);

  // Timer tick
  useEffect(() => {
    if (phase !== "running") return;
    const id = setInterval(() => {
      const now = Date.now();
      setElapsed(Math.floor((now - segStart) / 1000));
      setTotalElapsed(Math.floor((now - raceStart) / 1000));
    }, 500);
    return () => clearInterval(id);
  }, [phase, segStart, raceStart]);

  const seg = HYROX_SEGMENTS[currentIdx];

  function startRace() {
    const now = Date.now();
    setPhase("running");
    setRaceStart(now);
    setSegStart(now);
    setElapsed(0);
    setTotalElapsed(0);
  }

  function nextSegment() {
    const secs = elapsed;
    const id = seg.id;
    setSplits(prev => ({ ...prev, [id]: secs }));
    if (currentIdx + 1 >= HYROX_SEGMENTS.length) {
      setPhase("done");
      analyzeRace({ ...splits, [id]: secs });
    } else {
      setCurrentIdx(i => i + 1);
      setSegStart(Date.now());
      setElapsed(0);
    }
  }

  async function analyzeRace(finalSplits) {
    setLoadingAnalysis(true);
    const totalSecs = Object.values(finalSplits).reduce((a, b) => a + b, 0);
    const splitsText = HYROX_SEGMENTS.map(s => `${s.label}: ${fmtTime(finalSplits[s.id] || 0)}`).join(", ");
    const runSplits = HYROX_SEGMENTS.filter(s => s.type === "run").map(s => finalSplits[s.id] || 0);
    const stationSplits = HYROX_SEGMENTS.filter(s => s.type === "station").map(s => finalSplits[s.id] || 0);
    const avgRun = Math.round(runSplits.reduce((a,b)=>a+b,0)/runSplits.length);
    const avgStation = Math.round(stationSplits.reduce((a,b)=>a+b,0)/stationSplits.length);

    const result = await callClaudeStream(
      "Tu es coach HYROX expert. Analyse post-simulation concise et motivante. Pas de JSON.",
      `Analyse cette simulation HYROX pour ${profile.name} (Niveau ${profile.level}/4, VMA ${profile.vmaKmh||"?"}km/h):
Temps total: ${fmtTime(totalSecs)}
Splits: ${splitsText}
Run moyen: ${fmtTime(avgRun)} | Station moyenne: ${fmtTime(avgStation)}
Objectif: ${profile.levelAnalysis?.objectif || "finir"}

Points forts, points à améliorer, conseil concret pour la vraie race. 150 mots max. Utilise des emojis.`,
      500,
      (chunk) => setAnalysisText(chunk)
    );
    setAnalysisText(result.startsWith("__ERROR__") ? "Super simulation ! Analyse tes splits pour identifier les segments à améliorer." : result);
    setLoadingAnalysis(false);
  }

  const totalSecs = Object.values(splits).reduce((a,b)=>a+b,0) + (phase === "running" ? totalElapsed - Object.values(splits).reduce((a,b)=>a+b,0) : 0);
  const completedCount = Object.keys(splits).length;

  return (
    <div style={{ position: "fixed", inset: 0, background: "#050505", zIndex: 300, display: "flex", flexDirection: "column", padding: "0" }}>
      {/* Header */}
      <div style={{ padding: "14px 20px", borderBottom: "1px solid rgba(255,255,255,0.07)", display: "flex", justifyContent: "space-between", alignItems: "center", background: "var(--bg)" }}>
        <div>
          <div className="bebas" style={{ fontSize: 20, color: "var(--red)", letterSpacing: 2 }}>🏁 SIMULATION HYROX</div>
          {phase === "running" && <div style={{ fontSize: 11, color: "#555" }}>{completedCount}/{HYROX_SEGMENTS.length} segments</div>}
        </div>
        <div style={{ textAlign: "right" }}>
          {phase !== "ready" && <div className="bebas" style={{ fontSize: 28, color: "var(--yellow)", lineHeight: 1 }}>{fmtTime(totalElapsed)}</div>}
          <button onClick={onClose} style={{ background: "none", border: "none", color: "#555", fontSize: 13, cursor: "pointer", marginTop: 4 }}>✕ Quitter</button>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "20px 16px" }}>
        {phase === "ready" && (
          <div className="fade-in" style={{ textAlign: "center", padding: "40px 20px" }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🏁</div>
            <div className="bebas" style={{ fontSize: 32, color: "var(--red)", marginBottom: 8 }}>SIMULATION RACE</div>
            <div style={{ fontSize: 14, color: "#888", lineHeight: 1.7, marginBottom: 24 }}>
              16 segments à chronomètrer.<br/>
              Tape sur le bouton à chaque fin de segment.
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 28, textAlign: "left" }}>
              {HYROX_SEGMENTS.map((s, i) => (
                <div key={i} style={{ display: "flex", gap: 10, alignItems: "center", padding: "4px 0" }}>
                  <span style={{ fontSize: 14, width: 24 }}>{s.icon}</span>
                  <span style={{ fontSize: 13, color: s.type === "run" ? "var(--green)" : "var(--yellow)" }}>{s.label}</span>
                  <span style={{ fontSize: 11, color: "#444", marginLeft: "auto" }}>{s.distance}</span>
                </div>
              ))}
            </div>
            <button onClick={startRace} style={{ width: "100%", padding: "18px", background: "var(--red)", border: "none", borderRadius: 14, fontSize: 20, fontFamily: "'Bebas Neue',sans-serif", letterSpacing: 2, color: "#fff", cursor: "pointer" }}>
              🏁 DÉMARRER LA SIMULATION
            </button>
          </div>
        )}

        {phase === "running" && (
          <div style={{ display: "flex", flexDirection: "column", height: "100%", gap: 16 }}>
            {/* Segment actuel — GRAND */}
            <div className="fade-in" style={{ background: seg.type === "run" ? "rgba(57,255,128,0.06)" : "rgba(232,255,71,0.06)", border: `2px solid ${seg.color}44`, borderRadius: 18, padding: "28px 20px", textAlign: "center" }}>
              <div style={{ fontSize: 48, marginBottom: 8 }}>{seg.icon}</div>
              <div className="bebas" style={{ fontSize: 30, color: seg.color, letterSpacing: 1, lineHeight: 1 }}>{seg.label}</div>
              <div style={{ fontSize: 14, color: "#666", marginTop: 4 }}>{seg.distance}</div>
              <div className="bebas" style={{ fontSize: 60, color: "var(--white)", marginTop: 16, lineHeight: 1, letterSpacing: 2 }}>{fmtTime(elapsed)}</div>
              <div style={{ fontSize: 12, color: "#444", marginTop: 4 }}>sur ce segment</div>
            </div>

            {/* Bouton Terminer segment */}
            <button
              onClick={nextSegment}
              style={{ width: "100%", padding: "20px", background: seg.color, border: "none", borderRadius: 14, fontSize: 18, fontFamily: "'Bebas Neue',sans-serif", letterSpacing: 2, color: seg.type === "run" ? "#000" : "#000", cursor: "pointer" }}
            >
              ✓ {currentIdx + 1 < HYROX_SEGMENTS.length ? `SEGMENT SUIVANT : ${HYROX_SEGMENTS[currentIdx + 1].label}` : "🏁 TERMINER LA RACE"}
            </button>

            {/* Mini-tableau des splits */}
            {completedCount > 0 && (
              <div style={{ background: "var(--bg2)", borderRadius: 12, padding: 14 }}>
                <div style={{ fontSize: 10, color: "#555", fontWeight: 700, textTransform: "uppercase", marginBottom: 8 }}>Splits</div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 4 }}>
                  {HYROX_SEGMENTS.slice(0, completedCount).map(s => (
                    <div key={s.id} style={{ display: "flex", justifyContent: "space-between", padding: "4px 8px", background: "var(--bg3)", borderRadius: 6 }}>
                      <span style={{ fontSize: 11, color: s.type === "run" ? "var(--green)" : "var(--yellow)" }}>{s.label}</span>
                      <span style={{ fontSize: 11, fontWeight: 700, color: "var(--white)" }}>{fmtTime(splits[s.id])}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {phase === "done" && (() => {
          const totalSecs = Object.values(splits).reduce((a,b)=>a+b,0);
          const runSplits = HYROX_SEGMENTS.filter(s => s.type === "run");
          const stationSplits = HYROX_SEGMENTS.filter(s => s.type === "station");
          const totalRun = runSplits.reduce((a,s) => a+(splits[s.id]||0), 0);
          const totalStation = stationSplits.reduce((a,s) => a+(splits[s.id]||0), 0);
          return (
          <div className="fade-in">
            {/* Hero résultat */}
            <div style={{ position: "relative", overflow: "hidden", background: "linear-gradient(135deg, #1a0000 0%, #0a0000 50%, #080808 100%)", border: "1.5px solid rgba(255,71,71,0.25)", borderRadius: 20, padding: "28px 20px", marginBottom: 14, textAlign: "center" }}>
              <div style={{ position: "absolute", top: -30, right: -30, fontSize: 120, opacity: 0.04 }}>🏆</div>
              <div style={{ fontSize: 11, color: "#555", textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: 6 }}>Simulation HYROX terminée</div>
              <div className="bebas" style={{ fontSize: 76, color: "var(--red)", lineHeight: 1, letterSpacing: 2 }}>{fmtTime(totalSecs)}</div>
              <div style={{ fontSize: 12, color: "#555", marginTop: 4 }}>{Object.values(splits).length} segments · {fmtTime(totalRun)} course · {fmtTime(totalStation)} stations</div>
              {/* Barres run vs station */}
              <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
                <div style={{ flex: totalRun, background: "rgba(57,255,128,0.15)", border: "1px solid rgba(57,255,128,0.3)", borderRadius: 8, padding: "8px 0", textAlign: "center" }}>
                  <div style={{ fontSize: 10, color: "var(--green)", textTransform: "uppercase", letterSpacing: "0.1em" }}>Course</div>
                  <div className="bebas" style={{ fontSize: 22, color: "var(--green)" }}>{fmtTime(totalRun)}</div>
                </div>
                <div style={{ flex: totalStation, background: "rgba(232,255,71,0.08)", border: "1px solid rgba(232,255,71,0.2)", borderRadius: 8, padding: "8px 0", textAlign: "center" }}>
                  <div style={{ fontSize: 10, color: "var(--yellow)", textTransform: "uppercase", letterSpacing: "0.1em" }}>Stations</div>
                  <div className="bebas" style={{ fontSize: 22, color: "var(--yellow)" }}>{fmtTime(totalStation)}</div>
                </div>
              </div>
            </div>

            {/* Splits visuels */}
            <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: 18, overflow: "hidden", marginBottom: 14 }}>
              <div style={{ padding: "12px 16px 8px", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                <div className="bebas" style={{ fontSize: 15, color: "#666", letterSpacing: 1 }}>SPLITS DÉTAILLÉS</div>
              </div>
              {HYROX_SEGMENTS.map((s, i) => {
                const t = splits[s.id] || 0;
                const isRun = s.type === "run";
                const col = isRun ? "var(--green)" : "var(--yellow)";
                const bg = isRun ? "rgba(57,255,128,0.03)" : "rgba(232,255,71,0.03)";
                // Calcul pct relatif au total
                const pct = totalSecs > 0 ? (t / totalSecs) * 100 : 0;
                return (
                  <div key={s.id} style={{ background: bg, borderBottom: i < HYROX_SEGMENTS.length - 1 ? "1px solid rgba(255,255,255,0.03)" : "none", position: "relative", overflow: "hidden" }}>
                    {/* Barre de fond proportionnelle */}
                    <div style={{ position: "absolute", inset: 0, width: `${pct}%`, background: isRun ? "rgba(57,255,128,0.05)" : "rgba(232,255,71,0.04)" }} />
                    <div style={{ position: "relative", display: "flex", alignItems: "center", gap: 10, padding: "10px 16px" }}>
                      <div style={{ width: 26, height: 26, borderRadius: 8, background: isRun ? "rgba(57,255,128,0.12)" : "rgba(232,255,71,0.08)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, flexShrink: 0 }}>{s.icon}</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 13, color: col, fontWeight: 700, lineHeight: 1.2 }}>{s.label}</div>
                        <div style={{ fontSize: 10, color: "#333" }}>{s.distance}</div>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <div className="bebas" style={{ fontSize: 22, color: "var(--white)", lineHeight: 1 }}>{fmtTime(t)}</div>
                        <div style={{ fontSize: 10, color: "#333" }}>{pct.toFixed(0)}% total</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Analyse IA */}
            <div style={{ background: "rgba(57,255,128,0.04)", border: "1px solid rgba(57,255,128,0.15)", borderRadius: 16, padding: "16px", marginBottom: 14 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                <div style={{ width: 30, height: 30, borderRadius: 8, background: "rgba(57,255,128,0.1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>🤖</div>
                <div className="bebas" style={{ fontSize: 15, color: "var(--green)", letterSpacing: 1 }}>ANALYSE DU COACH</div>
              </div>
              {loadingAnalysis ? (
                <div style={{ display: "flex", gap: 6, alignItems: "center", padding: "4px 0" }}>
                  {[0,1,2].map(i => <div key={i} style={{ width: 7, height: 7, borderRadius: "50%", background: "var(--green)", animation: `pulse 1.2s ${i*0.2}s ease-in-out infinite` }} />)}
                </div>
              ) : (
                <div style={{ fontSize: 13, color: "#bbb", lineHeight: 1.75 }}>{analysisText}</div>
              )}
            </div>

            <button onClick={onClose} style={{ width: "100%", padding: "16px", background: "var(--yellow)", border: "none", borderRadius: 16, fontSize: 18, fontFamily: "'Bebas Neue',sans-serif", letterSpacing: 2, color: "#000", cursor: "pointer", fontWeight: 700 }}>
              ← RETOUR AU PROFIL RACE
            </button>
          </div>
          );
        })()}
      </div>
    </div>
  );
}

function RaceTab({ profile }) {
  const [strategy, setStrategy] = useState(null);
  const [loading, setLoading] = useState(false);
  const [strategyStream, setStrategyStream] = useState("");
  const [showSim, setShowSim] = useState(false);
  const days = daysUntil(profile.raceDate);
  const poidsHyrox = getPoidsHyrox(profile);

  async function generateStrategy() {
    setLoading(true);
    setStrategyStream("🏁 Analyse de ton profil...");
    const raw = await callClaudeStream(
      "Coach HYROX expert. JSON uniquement sans backticks.",
      `Stratégie de course HYROX pour ${profile.name}, Niveau ${profile.level}, VMA ${profile.vmaKmh || "?"}km/h, Squat ${profile.squat1RM_final || "?"}kg, Catégorie: ${poidsHyrox.categorie}.
Objectif: ${profile.levelAnalysis?.objectif || "finir"}.
Jours avant la course: ${days !== null ? days : "?"}.
JSON: {"objectifTemps":"","strategieCourse":"","stations":[{"nom":"","objectif":"","chrono":"","conseil":""}],"runningRythme":"","piege":"","mental":"","checklist":[]}
Stations dans l'ordre: SkiErg 1000m, Sled Push 50m, Sled Pull 50m, Burpee Broad Jump 80m, Rowing 1000m, Farmers Carry 200m, Sandbag Lunges 100m, Wall Balls 100 reps
Pour checklist: 5 items essentiels J-1/J de course (matériel, nutrition, échauffement).`,
      1400,
      (chunk) => {
        if (chunk.includes('"stations"')) setStrategyStream("📋 Station par station...");
        else if (chunk.includes('"runningRythme"')) setStrategyStream("🏃 Allures de running...");
        else if (chunk.includes('"mental"')) setStrategyStream("🧠 Préparation mentale...");
        else if (chunk.length > 100) setStrategyStream("🤖 Coach élabore ta stratégie...");
      }
    );
    try {
      const stCleaned = raw?.replace(/```json|```/g, "").trim() || "{}";
      const stMatch = stCleaned.match(/\{[\s\S]*\}/);
      setStrategy(JSON.parse(stMatch ? stMatch[0] : "{}"));
    } catch (e) { console.error("Stratégie parse error:", e); }
    setStrategyStream("");
    setLoading(false);
  }

  const phaseLabel = days === null ? null : days <= 1 ? { text: "C'EST LE JOUR J !", color: "var(--red)", bg: "linear-gradient(135deg, #1a0000 0%, #080808 60%)" } : days <= 7 ? { text: "SEMAINE DE COURSE", color: "#ff6b6b", bg: "linear-gradient(135deg, #150000 0%, #080808 60%)" } : days <= 30 ? { text: "PHASE PIC", color: "var(--yellow)", bg: "linear-gradient(135deg, #131500 0%, #080808 60%)" } : { text: days > 50 ? "PHASE BASE" : "PHASE DÉVELOPPEMENT", color: "var(--green)", bg: "linear-gradient(135deg, #001a0a 0%, #080808 60%)" };

  return (
    <div className="fade-in">
      {showSim && <SimulationRace profile={profile} onClose={() => setShowSim(false)} />}

      {/* ── HERO RACE COUNTDOWN ── */}
      {profile.raceDate ? (
        <div style={{ background: phaseLabel?.bg || "linear-gradient(135deg, #150000 0%, #080808 60%)", border: "1.5px solid rgba(255,71,71,0.2)", borderRadius: 22, padding: "22px 20px", marginBottom: 12, position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: -50, right: -50, width: 200, height: 200, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,71,71,0.1) 0%, transparent 70%)", pointerEvents: "none" }} />
          <div style={{ fontSize: 10, color: "rgba(255,71,71,0.7)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.16em", marginBottom: 12 }}>🏁 {phaseLabel?.text}</div>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 12, marginBottom: 14 }}>
            <div className="bebas" style={{ fontSize: 80, color: phaseLabel?.color || "var(--red)", lineHeight: 0.9, letterSpacing: -1 }}>{days}</div>
            <div style={{ marginBottom: 8 }}>
              <div style={{ fontSize: 16, color: "#555" }}>jours</div>
              <div style={{ fontSize: 11, color: "#333" }}>avant le départ</div>
            </div>
          </div>
          <div style={{ fontSize: 12, color: "#444", marginBottom: 16 }}>{new Date(profile.raceDate).toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}</div>
          {/* Message contextuel */}
          <div style={{ background: "rgba(0,0,0,0.35)", borderRadius: 12, padding: "10px 14px", fontSize: 12, color: "#888", lineHeight: 1.6 }}>
            {days <= 1 ? "🔥 Hydrate-toi, mange tes glucides, fais confiance à ton entraînement." : days <= 7 ? "⚡ Réduis le volume de 50%, maintiens 2 sessions d'activation courtes. Dors bien." : days <= 30 ? "🎯 Maximise la spécificité — simulations, allures de course, transitions enchaînées." : "📈 Construis ta base aérobie. Chaque séance compte."}
          </div>
          {/* Bouton simulation intégré */}
          <button onClick={() => setShowSim(true)} style={{ width: "100%", marginTop: 14, background: "var(--red)", border: "none", borderRadius: 14, padding: "14px", color: "#fff", fontFamily: "'Bebas Neue',sans-serif", fontSize: 18, letterSpacing: 2, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
            <span>🏁</span> LANCER LA SIMULATION RACE
          </button>
        </div>
      ) : (
        <div style={{ background: "rgba(255,71,71,0.04)", border: "1px dashed rgba(255,71,71,0.2)", borderRadius: 16, padding: "24px", textAlign: "center", marginBottom: 12 }}>
          <div style={{ fontSize: 32, marginBottom: 10 }}>🏁</div>
          <div style={{ fontSize: 14, color: "#555" }}>Aucune date renseignée.<br/>Ajoute ta date de course dans ton profil.</div>
        </div>
      )}

      {/* ── CTA STRATÉGIE ── */}
      {!strategy && !loading && (
        <button onClick={generateStrategy} style={{ width: "100%", background: "linear-gradient(135deg, rgba(255,71,71,0.12) 0%, rgba(255,71,71,0.04) 100%)", border: "1.5px solid rgba(255,71,71,0.3)", borderRadius: 16, padding: "18px 20px", marginBottom: 14, display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer" }}>
          <div style={{ textAlign: "left" }}>
            <div className="bebas" style={{ fontSize: 22, color: "var(--red)", letterSpacing: 1 }}>MA STRATÉGIE DE COURSE</div>
            <div style={{ fontSize: 12, color: "#444", marginTop: 3 }}>Objectif temps · Stations · Mental · Checklist</div>
          </div>
          <div style={{ width: 42, height: 42, borderRadius: "50%", background: "var(--red)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span className="bebas" style={{ fontSize: 20, color: "#fff" }}>→</span>
          </div>
        </button>
      )}
      {loading && (
        <div className="fade-in" style={{ background: "linear-gradient(135deg, #150000 0%, #080808 100%)", border: "1.5px solid rgba(255,71,71,0.2)", borderRadius: 16, padding: "28px 20px", marginBottom: 14, textAlign: "center" }}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>🏁</div>
          <div className="bebas" style={{ fontSize: 20, color: "var(--red)", marginBottom: 10 }}>{strategyStream || "Élaboration de ta stratégie..."}</div>
          <div style={{ display: "flex", gap: 6, justifyContent: "center" }}>
            {[0,1,2].map(i => <div key={i} style={{ width: 9, height: 9, borderRadius: "50%", background: "var(--red)", animation: `pulse 1.2s ${i*0.2}s ease-in-out infinite` }} />)}
          </div>
        </div>
      )}

      {strategy && (
        <div className="fade-in">
          {/* Objectif + stratégie */}
          <div style={{ background: "linear-gradient(135deg, rgba(255,71,71,0.08) 0%, rgba(255,71,71,0.02) 100%)", border: "1.5px solid rgba(255,71,71,0.25)", borderRadius: 18, padding: "18px", marginBottom: 12, position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: -30, right: -30, width: 130, height: 130, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,71,71,0.08) 0%, transparent 70%)", pointerEvents: "none" }} />
            <div style={{ fontSize: 10, color: "rgba(255,71,71,0.7)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 8 }}>🎯 Objectif</div>
            <div className="bebas" style={{ fontSize: 36, color: "var(--red)", lineHeight: 1, marginBottom: 10 }}>{strategy.objectifTemps}</div>
            <div style={{ fontSize: 13, color: "#aaa", lineHeight: 1.7, marginBottom: strategy.runningRythme ? 12 : 0 }}>{strategy.strategieCourse}</div>
            {strategy.runningRythme && (
              <div style={{ background: "rgba(57,255,128,0.06)", border: "1px solid rgba(57,255,128,0.15)", borderRadius: 10, padding: "10px 14px", fontSize: 12, color: "var(--green)", display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 16 }}>🏃</span> <span>{strategy.runningRythme}</span>
              </div>
            )}
          </div>

          {/* Poids officiels — grid visuelle */}
          <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 16, padding: "16px", marginBottom: 12 }}>
            <div style={{ fontSize: 10, color: "#333", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 4 }}>Poids de compétition</div>
            <div style={{ fontSize: 11, color: "#2a2a2a", marginBottom: 12 }}>{poidsHyrox.categorie}</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              {[
                { label: "Sled Push", val: poidsHyrox.sled_push, icon: "🛷" },
                { label: "Sled Pull", val: poidsHyrox.sled_pull, icon: "🔗" },
                { label: "Farmers Carry", val: poidsHyrox.farmers_carry, icon: "🧳" },
                { label: "Wall Balls", val: poidsHyrox.wall_balls, icon: "🏀" },
                { label: "Sandbag Lunges", val: poidsHyrox.sandbag_lunges, icon: "🎒" },
              ].map((s, i) => (
                <div key={i} style={{ background: "rgba(255,255,255,0.03)", borderRadius: 10, padding: "10px 12px", display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ fontSize: 20 }}>{s.icon}</span>
                  <div>
                    <div style={{ fontSize: 10, color: "#444", marginBottom: 1 }}>{s.label}</div>
                    <div style={{ fontSize: 15, fontWeight: 700, color: "var(--white)" }}>{s.val}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Stations — cartes numérotées */}
          <div style={{ marginBottom: 12 }}>
            <div style={{ fontSize: 10, color: "#333", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 12 }}>Station par station</div>
            {(strategy.stations || []).map((s, i) => {
              const isRun = i % 2 === 0;
              const col = isRun ? "var(--green)" : "var(--yellow)";
              return (
                <div key={i} style={{ background: isRun ? "rgba(57,255,128,0.03)" : "rgba(232,255,71,0.03)", border: `1px solid ${isRun ? "rgba(57,255,128,0.12)" : "rgba(232,255,71,0.1)"}`, borderLeft: `3px solid ${col}`, borderRadius: 14, padding: "14px 16px", marginBottom: 8 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 5 }}>
                        <div style={{ width: 22, height: 22, borderRadius: "50%", background: col, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: "#000", flexShrink: 0 }}>{i+1}</div>
                        <div style={{ fontWeight: 700, fontSize: 14, color: "var(--white)" }}>{s.nom}</div>
                      </div>
                      <div style={{ fontSize: 12, color: col, marginBottom: s.conseil ? 4 : 0, paddingLeft: 30 }}>🎯 {s.objectif}</div>
                      {s.conseil && <div style={{ fontSize: 11, color: "#555", paddingLeft: 30, lineHeight: 1.5 }}>💬 {s.conseil}</div>}
                    </div>
                    {s.chrono && <div style={{ background: `${col}18`, border: `1px solid ${col}44`, borderRadius: 8, padding: "4px 10px", fontSize: 12, fontWeight: 700, color: col, flexShrink: 0, marginLeft: 10 }}>{s.chrono}</div>}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Piège + Mental — côte à côte */}
          {(strategy.piege || strategy.mental) && (
            <div style={{ display: "grid", gridTemplateColumns: strategy.piege && strategy.mental ? "1fr 1fr" : "1fr", gap: 8, marginBottom: 12 }}>
              {strategy.piege && (
                <div style={{ background: "rgba(255,71,71,0.05)", border: "1px solid rgba(255,71,71,0.15)", borderRadius: 14, padding: "14px" }}>
                  <div style={{ fontSize: 9, color: "var(--red)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>⚠️ Piège principal</div>
                  <div style={{ fontSize: 12, color: "#aaa", lineHeight: 1.6 }}>{strategy.piege}</div>
                </div>
              )}
              {strategy.mental && (
                <div style={{ background: "rgba(57,255,128,0.04)", border: "1px solid rgba(57,255,128,0.12)", borderRadius: 14, padding: "14px" }}>
                  <div style={{ fontSize: 9, color: "var(--green)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>🧠 Mental</div>
                  <div style={{ fontSize: 12, color: "#aaa", lineHeight: 1.6 }}>{strategy.mental}</div>
                </div>
              )}
            </div>
          )}

          {(strategy.checklist || []).length > 0 && <ChecklistJDay items={strategy.checklist} />}

          <button onClick={() => setStrategy(null)} style={{ width: "100%", marginTop: 8, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 12, padding: "13px", color: "#555", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
            ↺ Regénérer la stratégie
          </button>
        </div>
      )}

      {/* ── TEMPS DE RÉFÉRENCE HYROX ── */}
      {(() => {
        const REFS = [
          { label: "Elite H", time: "3:45", mins: 225, color: "#ff4747" },
          { label: "Elite F", time: "4:15", mins: 255, color: "#ff4747" },
          { label: "Pro H", time: "4:30", mins: 270, color: "#ff9a3c" },
          { label: "Pro F", time: "5:00", mins: 300, color: "#ff9a3c" },
          { label: "Semi-Pro H", time: "5:30", mins: 330, color: "#e8ff47" },
          { label: "Semi-Pro F", time: "6:15", mins: 375, color: "#e8ff47" },
          { label: "Amateur H", time: "6:00", mins: 360, color: "#39ff80" },
          { label: "Amateur F", time: "7:00", mins: 420, color: "#39ff80" },
        ];
        const gender = profile.genre === "F" ? "F" : "H";
        const levelRefs = REFS.filter(r => r.label.endsWith(gender));
        const objStr = strategy?.objectifTemps || "";
        const objMatch = objStr.match(/(\d+)[h:](\d+)/);
        const objMins = objMatch ? parseInt(objMatch[1]) * 60 + parseInt(objMatch[2]) : null;
        const minTime = Math.min(...levelRefs.map(r => r.mins));
        const maxTime = Math.max(...levelRefs.map(r => r.mins)) + 30;
        return (
          <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 16, padding: "16px", marginTop: 12 }}>
            <div style={{ fontSize: 10, color: "#333", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 14 }}>🏆 Temps de référence HYROX ({gender === "H" ? "Homme" : "Femme"})</div>
            <div style={{ position: "relative", paddingBottom: 8 }}>
              {levelRefs.map((ref, i) => {
                const pct = ((ref.mins - minTime) / (maxTime - minTime)) * 80 + 5;
                return (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                    <div style={{ width: 72, fontSize: 10, color: "#444", textAlign: "right", flexShrink: 0 }}>{ref.label.replace(/ [HF]$/,'')}</div>
                    <div style={{ flex: 1, position: "relative", height: 6, background: "rgba(255,255,255,0.05)", borderRadius: 3 }}>
                      <div style={{ position: "absolute", left: 0, top: 0, width: `${pct}%`, height: "100%", background: ref.color, borderRadius: 3, opacity: 0.6 }} />
                      {objMins && Math.abs(objMins - ref.mins) <= 15 && (
                        <div style={{ position: "absolute", top: -14, left: `${pct}%`, transform: "translateX(-50%)", fontSize: 14, filter: "drop-shadow(0 0 4px #e8ff47)" }}>🎯</div>
                      )}
                    </div>
                    <div style={{ width: 36, fontSize: 11, fontWeight: 700, color: ref.color, flexShrink: 0 }}>{ref.time}</div>
                  </div>
                );
              })}
              {objMins && (() => {
                const pct = ((objMins - minTime) / (maxTime - minTime)) * 80 + 5;
                const closest = levelRefs.reduce((a, b) => Math.abs(b.mins - objMins) < Math.abs(a.mins - objMins) ? b : a);
                return (
                  <div style={{ marginTop: 14, background: `${closest.color}10`, border: `1px solid ${closest.color}33`, borderRadius: 12, padding: "10px 14px", display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ fontSize: 22, flexShrink: 0 }}>🎯</div>
                    <div>
                      <div style={{ fontSize: 11, fontWeight: 700, color: closest.color }}>Objectif {strategy.objectifTemps}</div>
                      <div style={{ fontSize: 11, color: "#555" }}>Niveau {closest.label.replace(/ [HF]$/, '')} · {Math.abs(objMins - closest.mins) <= 5 ? "Dans la cible !" : objMins < closest.mins ? `${closest.mins - objMins} min sous le seuil` : `${objMins - closest.mins} min au-dessus du seuil`}</div>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        );
      })()}
    </div>
  );
}


// ============================================================
// COMPTEUR USAGE API
// ============================================================
function ApiUsageCard() {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getApiUsageStats().then(s => { setStats(s); setLoading(false); });
  }, []);

  const today = stats[0]?.date === new Date().toISOString().split("T")[0] ? stats[0] : null;
  const week = stats.slice(0, 7);
  const totalCalls = week.reduce((s, d) => s + (d.calls || 0), 0);
  const totalTokens = week.reduce((s, d) => s + (d.tokens || 0), 0);
  const totalMonth = stats.reduce((s, d) => s + (d.calls || 0), 0);
  const costWeek = estimateCost(totalTokens);
  const costMonth = estimateCost(stats.reduce((s, d) => s + (d.tokens || 0), 0));

  if (loading) return <div style={{ color: "#555", fontSize: 13, padding: 12 }}>Chargement usage...</div>;

  return (
    <Card style={{ border: "1px solid var(--yellow)33", marginBottom: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
        <div className="bebas" style={{ fontSize: 18, color: "var(--yellow)" }}>USAGE API ANTHROPIC</div>
        <Badge label="🤖 Claude Sonnet" color="var(--yellow)" />
      </div>

      {/* Stats aujourd'hui + semaine + mois */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 14 }}>
        <div style={{ background: "var(--bg3)", borderRadius: 8, padding: "10px 8px", textAlign: "center" }}>
          <div style={{ fontSize: 9, color: "#555", textTransform: "uppercase", marginBottom: 4 }}>Aujourd'hui</div>
          <div className="bebas" style={{ fontSize: 24, color: "var(--yellow)", lineHeight: 1 }}>{today?.calls || 0}</div>
          <div style={{ fontSize: 10, color: "#666", marginTop: 2 }}>appels</div>
        </div>
        <div style={{ background: "var(--bg3)", borderRadius: 8, padding: "10px 8px", textAlign: "center" }}>
          <div style={{ fontSize: 9, color: "#555", textTransform: "uppercase", marginBottom: 4 }}>7 jours</div>
          <div className="bebas" style={{ fontSize: 24, color: "var(--green)", lineHeight: 1 }}>{totalCalls}</div>
          <div style={{ fontSize: 10, color: "#666", marginTop: 2 }}>appels</div>
        </div>
        <div style={{ background: "var(--bg3)", borderRadius: 8, padding: "10px 8px", textAlign: "center" }}>
          <div style={{ fontSize: 9, color: "#555", textTransform: "uppercase", marginBottom: 4 }}>Ce mois</div>
          <div className="bebas" style={{ fontSize: 24, color: "var(--white)", lineHeight: 1 }}>{totalMonth}</div>
          <div style={{ fontSize: 10, color: "#666", marginTop: 2 }}>appels</div>
        </div>
      </div>

      {/* Coût estimé */}
      <div style={{ background: "var(--bg3)", borderRadius: 8, padding: "10px 12px", marginBottom: 12 }}>
        <div style={{ fontSize: 10, color: "#555", textTransform: "uppercase", marginBottom: 8 }}>Coût estimé</div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontSize: 12, color: "#888", marginBottom: 2 }}>7 jours</div>
            <div className="bebas" style={{ fontSize: 22, color: "var(--green)" }}>${costWeek}</div>
          </div>
          <div style={{ width: 1, height: 36, background: "var(--bg2)" }} />
          <div>
            <div style={{ fontSize: 12, color: "#888", marginBottom: 2 }}>Ce mois</div>
            <div className="bebas" style={{ fontSize: 22, color: "var(--yellow)" }}>${costMonth}</div>
          </div>
          <div style={{ width: 1, height: 36, background: "var(--bg2)" }} />
          <div>
            <div style={{ fontSize: 12, color: "#888", marginBottom: 2 }}>Tokens</div>
            <div className="bebas" style={{ fontSize: 22, color: "#aaa" }}>{(totalTokens / 1000).toFixed(1)}k</div>
          </div>
        </div>
      </div>

      {/* Historique par jour */}
      {week.length > 0 && (
        <div>
          <div style={{ fontSize: 10, color: "#555", textTransform: "uppercase", marginBottom: 8 }}>Historique (7j)</div>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 4, height: 48, marginBottom: 4 }}>
            {week.slice(0, 7).reverse().map((d, i) => {
              const maxCalls = Math.max(...week.map(x => x.calls), 1);
              const h = Math.max(4, Math.round((d.calls / maxCalls) * 40));
              const isToday = d.date === new Date().toISOString().split("T")[0];
              return (
                <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
                  <div style={{ width: "100%", height: h, background: isToday ? "var(--yellow)" : "var(--yellow)44", borderRadius: "2px 2px 0 0" }} />
                  <div style={{ fontSize: 8, color: isToday ? "var(--yellow)" : "#444" }}>
                    {new Date(d.date).toLocaleDateString("fr-FR", { weekday: "short" }).slice(0, 2)}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {week.length === 0 && (
        <div style={{ textAlign: "center", color: "#555", fontSize: 12, padding: 8 }}>
          Les données s'accumuleront au fil des séances générées.
        </div>
      )}

      <div style={{ marginTop: 10, padding: "8px 10px", background: "var(--bg)", borderRadius: 6, fontSize: 11, color: "#555", lineHeight: 1.5 }}>
        💡 ~$0.003 par séance générée · Recharge sur <span style={{ color: "var(--yellow)" }}>console.anthropic.com</span>
      </div>
    </Card>
  );
}

// ============================================================
// APP COACH
// ============================================================
function CoachApp() {
  const [athletes, setAthletes] = useState([]);
  const [selected, setSelected] = useState(null);
  const [tab, setTab] = useState("dashboard");
  const [loading, setLoading] = useState(true);
  const [coachSession, setCoachSession] = useState({ titre: "", description: "" });
  const [sessionSaved, setSessionSaved] = useState(false);

  useEffect(() => { loadAthletes(); loadCoachSession(); }, []);

  async function loadAthletes() {
    setLoading(true);
    const keys = await storage.list("athlete_");
    const data = await Promise.all(keys.map(k => storage.get(k)));
    setAthletes(data.filter(Boolean));
    setLoading(false);
  }

  async function loadCoachSession() {
    const s = await storage.get("coach_session_today");
    if (s) setCoachSession(s);
  }

  async function saveCoachSession() {
    const session = { ...coachSession, date: new Date().toISOString().split("T")[0] };
    await storage.set("coach_session_today", session);
    setSessionSaved(true);
    setTimeout(() => setSessionSaved(false), 3000);
  }

  const alerts = athletes.flatMap(a => (a.alerts || []).filter(al => !al.read));
  const avgAdherence = athletes.length > 0
    ? Math.round(athletes.reduce((acc, a) => acc + Math.min(100, ((a.sessions?.length || 0) / 8) * 100), 0) / athletes.length)
    : 0;

  const tabs = [
    { id: "dashboard", label: "Dashboard", icon: "📊" },
    { id: "seance", label: "Séance", icon: "📋" },
    { id: "athletes", label: "Athlètes", icon: "👥" },
    { id: "alerts", label: `Alertes${alerts.length > 0 ? `(${alerts.length})` : ""}`, icon: "🔔" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", paddingBottom: 80 }}>
      <style>{GLOBAL_STYLES}</style>

      <div style={{ background: "var(--bg2)", padding: "16px 20px", borderBottom: "1px solid var(--bg3)", position: "sticky", top: 0, zIndex: 100 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div className="bebas" style={{ fontSize: 26, color: "var(--yellow)", lineHeight: 1 }}>FITRACE COACH</div>
            <div style={{ fontSize: 12, color: "#888" }}>{athletes.length} athlètes · {alerts.length} alertes</div>
          </div>
          <Btn variant="dark" size="sm" onClick={loadAthletes}>↺ Actualiser</Btn>
        </div>
      </div>

      <div style={{ padding: "20px 16px", maxWidth: 480, margin: "0 auto" }}>

        {/* DASHBOARD */}
        {tab === "dashboard" && (
          <div className="fade-in">
            {loading ? <Spinner /> : (
              <>
                <Section title="Vue d'ensemble">
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
                    <StatBox label="Athlètes" value={athletes.length} unit="inscrits" color="var(--yellow)" />
                    <StatBox label="Adhérence" value={avgAdherence + "%"} unit="moy." color="var(--green)" />
                    <StatBox label="Alertes" value={alerts.length} unit="actives" color={alerts.length > 0 ? "var(--red)" : "var(--gray)"} />
                    <StatBox label="Adaptations" value={athletes.reduce((a, b) => a + (b.adaptations?.length || 0), 0)} unit="total IA" color="var(--yellow)" />
                  </div>
                </Section>

                <Section title="Niveaux">
                  <Card>
                    {LEVELS.map(lvl => {
                      const count = athletes.filter(a => a.level === lvl.id).length;
                      return (
                        <div key={lvl.id} style={{ marginBottom: 12 }}>
                          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                            <span style={{ fontSize: 14 }}>{lvl.emoji} {lvl.label}</span>
                            <span style={{ fontSize: 14, fontWeight: 700 }}>{count} athlète{count > 1 ? "s" : ""}</span>
                          </div>
                          <ProgressBar value={count} max={Math.max(athletes.length, 1)} color={lvl.color} />
                        </div>
                      );
                    })}
                  </Card>
                </Section>

                <Section title="Condition physique moyenne">
                  <Card>
                    {athletes.length === 0 ? (
                      <div style={{ color: "#555", textAlign: "center", fontSize: 14 }}>Aucun athlète</div>
                    ) : (() => {
                      const scores = athletes.map(a => calcFitnessScore(a));
                      const avg = (key) => Math.round(scores.reduce((s, sc) => s + sc[key], 0) / scores.length);
                      return [
                        { label: "Force", value: avg("force"), color: "var(--yellow)" },
                        { label: "Endurance", value: avg("endurance"), color: "var(--green)" },
                        { label: "Puissance", value: avg("puissance"), color: "var(--red)" },
                      ].map(item => (
                        <div key={item.label} style={{ marginBottom: 12 }}>
                          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                            <span style={{ fontSize: 14, color: "#aaa" }}>{item.label}</span>
                            <span style={{ fontSize: 14, fontWeight: 700, color: item.color }}>{item.value}%</span>
                          </div>
                          <ProgressBar value={item.value} color={item.color} height={5} />
                        </div>
                      ));
                    })()}
                  </Card>
                </Section>

                <Section title="Coût API">
                  <ApiUsageCard />
                </Section>
              </>
            )}
          </div>
        )}

        {/* SÉANCE DU JOUR COACH */}
        {tab === "seance" && (
          <div className="fade-in">
            <Section title="Séance du jour">
              <div style={{ marginBottom: 12, padding: "10px 14px", background: "var(--bg3)", borderRadius: 8, fontSize: 13, color: "#888" }}>
                📢 Cette séance sera visible par tous tes athlètes aujourd'hui dans leur espace "Séance".
              </div>
              <Card>
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  <Input label="Titre de la séance" value={coachSession.titre} onChange={v => setCoachSession(s => ({ ...s, titre: v }))} placeholder="ex: Force Lower Body · Semaine 3" />
                  <div>
                    <label style={{ fontSize: 12, color: "#aaa", fontWeight: 600, textTransform: "uppercase", display: "block", marginBottom: 6 }}>Description / Programme</label>
                    <textarea
                      value={coachSession.description}
                      onChange={e => setCoachSession(s => ({ ...s, description: e.target.value }))}
                      placeholder={`ex: Échauffement 10min\n\nSquat Back : 4x6 @ 80%\nDeadlift : 3x5 @ 75%\nWall Balls : 4x15\n\nFinisher : 3 rounds\n- SkiErg 250m\n- 20 Burpees`}
                      style={{ width: "100%", background: "var(--bg3)", border: "1px solid var(--gray2)", borderRadius: 8, padding: "12px 14px", color: "var(--white)", fontSize: 14, minHeight: 200, resize: "vertical", fontFamily: "var(--font-body)", lineHeight: 1.6 }}
                    />
                  </div>
                  <Btn size="lg" onClick={saveCoachSession} disabled={!coachSession.titre || !coachSession.description} style={{ width: "100%" }}>
                    {sessionSaved ? "✅ Séance publiée !" : "📢 Publier la séance du jour"}
                  </Btn>
                  {sessionSaved && (
                    <div style={{ textAlign: "center", color: "var(--green)", fontSize: 14, fontWeight: 600 }}>
                      Tous tes athlètes la verront maintenant ! 🎉
                    </div>
                  )}
                </div>
              </Card>

              {coachSession.titre && (
                <div style={{ marginTop: 20 }}>
                  <div style={{ fontSize: 12, color: "#666", textTransform: "uppercase", marginBottom: 10 }}>Aperçu athlète</div>
                  <Card style={{ border: "1.5px solid var(--yellow)44" }}>
                    <div style={{ fontSize: 12, color: "var(--yellow)", fontWeight: 700, textTransform: "uppercase", marginBottom: 6 }}>📋 Séance du coach aujourd'hui</div>
                    <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 8 }}>{coachSession.titre}</div>
                    <div style={{ fontSize: 14, color: "#ccc", lineHeight: 1.7, whiteSpace: "pre-wrap" }}>{coachSession.description}</div>
                  </Card>
                </div>
              )}
            </Section>
          </div>
        )}

        {/* ATHLÈTES */}
        {tab === "athletes" && (
          <div className="fade-in">
            {selected ? (
              <AthleteDetail athlete={selected} onBack={() => setSelected(null)} onUpdate={async (updated) => {
                await storage.set(`athlete_${updated.name}`, updated);
                setSelected(updated);
                loadAthletes();
              }} />
            ) : (
              <Section title={`Athlètes (${athletes.length})`}>
                {loading ? <Spinner /> : athletes.length === 0 ? (
                  <div style={{ color: "#555", textAlign: "center", padding: 24 }}>Aucun athlète inscrit.</div>
                ) : (
                  athletes.map((a, i) => {
                    const score = calcFitnessScore(a);
                    return (
                      <Card key={i} onClick={() => setSelected(a)} style={{ marginBottom: 10, display: "flex", alignItems: "center", gap: 14 }}>
                        <div style={{ width: 44, height: 44, borderRadius: "50%", background: "var(--yellow)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, color: "#000", fontWeight: 700, flexShrink: 0 }}>
                          {a.name[0].toUpperCase()}
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 700, fontSize: 16 }}>{a.name}</div>
                          <div style={{ fontSize: 12, color: "#888" }}>
                            Niv. {a.level || "?"} · {a.sessions?.length || 0} séances · Forme : {score.global}%
                          </div>
                          <div style={{ marginTop: 4 }}>
                            <ProgressBar value={score.global} height={3} color={score.global >= 60 ? "var(--green)" : score.global >= 30 ? "var(--yellow)" : "var(--red)"} />
                          </div>
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4 }}>
                          {(a.alerts || []).filter(al => !al.read).length > 0 && (
                            <Badge label={`⚠️ ${(a.alerts || []).filter(al => !al.read).length}`} color="var(--red)" />
                          )}
                          <span style={{ color: "#555", fontSize: 18 }}>→</span>
                        </div>
                      </Card>
                    );
                  })
                )}
              </Section>
            )}
          </div>
        )}

        {/* ALERTES */}
        {tab === "alerts" && (
          <div className="fade-in">
            <Section title="Alertes">
              {alerts.length === 0 ? (
                <div style={{ color: "#555", textAlign: "center", padding: 24, fontSize: 14 }}>✅ Aucune alerte — tout le monde est en forme !</div>
              ) : (
                alerts.map((al, i) => (
                  <Card key={i} style={{ marginBottom: 10, border: "1.5px solid var(--red)44" }}>
                    <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                      <span style={{ fontSize: 24 }}>⚠️</span>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: 15, color: "var(--red)" }}>{al.athlete}</div>
                        <div style={{ fontSize: 14, color: "#ccc", marginTop: 4 }}>{al.message}</div>
                        <div style={{ fontSize: 12, color: "#555", marginTop: 6 }}>{new Date(al.date).toLocaleDateString("fr-FR")}</div>
                      </div>
                    </div>
                  </Card>
                ))
              )}
            </Section>
          </div>
        )}
      </div>

      {/* Bottom Nav */}
      <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: "var(--bg2)", borderTop: "1px solid var(--bg3)", display: "flex", justifyContent: "space-around", padding: "8px 0", zIndex: 100 }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{ background: "none", color: tab === t.id ? "var(--yellow)" : "#555", padding: "8px 12px", borderRadius: 8, display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
            <span style={{ fontSize: 20 }}>{t.icon}</span>
            <span style={{ fontSize: 9, fontWeight: 600 }}>{t.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function AthleteDetail({ athlete, onBack, onUpdate }) {
  const [editNote, setEditNote] = useState("");
  const score = calcFitnessScore(athlete);

  async function addNote() {
    if (!editNote.trim()) return;
    const updated = { ...athlete, coachNotes: [...(athlete.coachNotes || []), { text: editNote, date: new Date().toISOString() }] };
    await onUpdate(updated);
    setEditNote("");
  }

  return (
    <div className="fade-in">
      <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 24 }}>
        <Btn variant="dark" size="sm" onClick={onBack}>←</Btn>
        <div>
          <div className="bebas" style={{ fontSize: 28, color: "var(--yellow)" }}>{athlete.name}</div>
          <div style={{ color: "#888", fontSize: 12 }}>Niveau {athlete.level} · {athlete.age} ans · {athlete.poids}kg</div>
        </div>
      </div>

      {/* Score condition */}
      <FitnessScoreCard profile={athlete} />

      {/* Stats */}
      <Card style={{ marginBottom: 16 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
          <div style={{ textAlign: "center" }}>
            <div className="bebas" style={{ fontSize: 28, color: "var(--yellow)" }}>{athlete.sessions?.length || 0}</div>
            <div style={{ fontSize: 11, color: "#888" }}>Séances</div>
          </div>
          <div style={{ textAlign: "center" }}>
            <div className="bebas" style={{ fontSize: 28, color: "var(--green)" }}>{athlete.vmaKmh || "?"}</div>
            <div style={{ fontSize: 11, color: "#888" }}>VMA</div>
          </div>
          <div style={{ textAlign: "center" }}>
            <div className="bebas" style={{ fontSize: 28, color: "var(--red)" }}>{daysUntil(athlete.raceDate) ?? "?"}</div>
            <div style={{ fontSize: 11, color: "#888" }}>J-Course</div>
          </div>
        </div>
      </Card>

      {/* Dernières adaptations IA */}
      {athlete.adaptations?.length > 0 && (
        <Card style={{ marginBottom: 16 }}>
          <div style={{ fontWeight: 700, fontSize: 12, color: "var(--green)", textTransform: "uppercase", marginBottom: 10 }}>Dernières adaptations IA</div>
          {athlete.adaptations.slice(-3).reverse().map((a, i) => (
            <div key={i} style={{ borderBottom: i < 2 ? "1px solid var(--bg3)" : "none", paddingBottom: 8, marginBottom: 8 }}>
              <div style={{ fontSize: 13, color: "#ccc" }}>{a.message}</div>
              <div style={{ fontSize: 12, color: "var(--yellow)", marginTop: 4 }}>→ {a.adaptation}</div>
              <div style={{ fontSize: 11, color: "#555", marginTop: 4 }}>{new Date(a.date).toLocaleDateString("fr-FR")}</div>
            </div>
          ))}
        </Card>
      )}

      {/* Alertes */}
      {(athlete.alerts || []).filter(a => !a.read).length > 0 && (
        <Card style={{ marginBottom: 16, border: "1.5px solid var(--red)44" }}>
          <div style={{ fontWeight: 700, fontSize: 12, color: "var(--red)", textTransform: "uppercase", marginBottom: 10 }}>Alertes</div>
          {athlete.alerts.filter(a => !a.read).map((a, i) => (
            <div key={i} style={{ fontSize: 13, color: "#ccc", marginBottom: 8 }}>
              ⚠️ {a.message}
              <div style={{ fontSize: 11, color: "#555", marginTop: 2 }}>{new Date(a.date).toLocaleDateString("fr-FR")}</div>
            </div>
          ))}
          <Btn variant="dark" size="sm" onClick={() => onUpdate({ ...athlete, alerts: athlete.alerts.map(a => ({ ...a, read: true })) })}>
            Marquer comme lues
          </Btn>
        </Card>
      )}

      {/* Notes coach */}
      <Card>
        <div style={{ fontWeight: 700, fontSize: 12, color: "var(--yellow)", textTransform: "uppercase", marginBottom: 10 }}>Notes coach</div>
        {(athlete.coachNotes || []).map((n, i) => (
          <div key={i} style={{ fontSize: 13, color: "#ccc", marginBottom: 8, paddingBottom: 8, borderBottom: "1px solid var(--bg3)" }}>
            {n.text}
            <div style={{ fontSize: 11, color: "#555", marginTop: 2 }}>{new Date(n.date).toLocaleDateString("fr-FR")}</div>
          </div>
        ))}
        <textarea value={editNote} onChange={e => setEditNote(e.target.value)} placeholder="Ajouter une note..."
          style={{ width: "100%", background: "var(--bg3)", border: "1px solid var(--gray2)", borderRadius: 8, padding: "10px 14px", color: "var(--white)", fontSize: 14, minHeight: 60, resize: "vertical", fontFamily: "var(--font-body)", marginTop: 8 }} />
        <Btn size="sm" onClick={addNote} disabled={!editNote.trim()} style={{ marginTop: 10 }}>Ajouter</Btn>
      </Card>
    </div>
  );
}

// ============================================================
// MAIN APP
// ============================================================
export default function App() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [needTests, setNeedTests] = useState(false);

  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = GLOBAL_STYLES;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  // Vérifier session existante au démarrage — setLoading(false) SEULEMENT ici
  useEffect(() => {
    storage.get("session_current").then(async session => {
      if (session && session.role === "athlete" && session.email) {
        try {
          // Chercher par email en priorité
          const keyEmail = `athlete_email_${session.email}`;
          let existing = await storage.get(keyEmail);
          // Fallback par nom
          if (!existing && session.name) {
            existing = await storage.get(`athlete_${session.name}`);
          }
          if (existing) {
            setProfile(existing);
            setNeedTests(!existing.onboardingComplete);
            setUser({ role: "athlete", name: session.name, email: session.email });
          }
        } catch (e) { console.error("Session restore error:", e); }
      }
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  async function handleLogin(role, name, email) {
    if (role === "coach") { setUser({ role: "coach", name }); return; }

    // Clé basée sur email si disponible
    const key = email ? `athlete_email_${email}` : `athlete_${name}`;
    const existing = await storage.get(key);
    if (existing) {
      setProfile(existing);
      setNeedTests(!existing.onboardingComplete);
    }
    setUser({ role: "athlete", name, email });
  }

  async function handleLogout() {
    await storage.del("session_current");
    setUser(null); setProfile(null); setNeedTests(false);
  }

  function handleOnboardingComplete(newProfile) {
    setProfile(newProfile);
    setNeedTests(true);
  }

  function handleTestsComplete(updatedProfile) {
    setProfile(updatedProfile);
    setNeedTests(false);
  }

  if (loading) return (
    <div style={{ minHeight: "100vh", background: "#080808", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", fontFamily: "'DM Sans', sans-serif" }}>
      <style>{GLOBAL_STYLES}</style>
      <style>{`
        @keyframes splashRing { from { stroke-dashoffset: 352; } to { stroke-dashoffset: 0; } }
        @keyframes splashFade { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes splashPulse { 0%,100% { opacity: 0.4; } 50% { opacity: 1; } }
      `}</style>
      {/* Logo animé */}
      <div style={{ position: "relative", marginBottom: 24 }}>
        <svg width="120" height="120" viewBox="0 0 120 120">
          <circle cx="60" cy="60" r="50" fill="rgba(232,255,71,0.06)" />
          <circle cx="60" cy="60" r="50" fill="none" stroke="rgba(232,255,71,0.08)" strokeWidth="6"/>
          <circle cx="60" cy="60" r="50" fill="none" stroke="#e8ff47" strokeWidth="6" strokeLinecap="round"
            strokeDasharray="352" strokeDashoffset="352"
            transform="rotate(-90 60 60)"
            style={{ animation: "splashRing 1.4s cubic-bezier(0.16,1,0.3,1) 0.2s forwards" }}/>
        </svg>
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 36, color: "#e8ff47", letterSpacing: 3, lineHeight: 1, animation: "splashFade 0.6s 0.5s both" }}>FIT<span style={{ color: "#f0f0f0" }}>RACE</span></div>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#39ff80", marginTop: 4, animation: "splashPulse 1.2s 0.8s ease-in-out infinite" }}/>
        </div>
      </div>
      {/* Tagline */}
      <div style={{ fontSize: 13, color: "#333", letterSpacing: "0.08em", animation: "splashFade 0.6s 0.9s both" }}>
        Ton coach HYROX IA
      </div>
    </div>
  );

  if (!user) return <LoginScreen onLogin={handleLogin} />;
  if (user.role === "coach") return <CoachApp />;
  if (!profile) return <OnboardingScreen athleteName={user.name} athleteEmail={user.email} onComplete={handleOnboardingComplete} />;
  if (needTests && !profile.onboardingComplete) return <TestsBattery profile={profile} onComplete={handleTestsComplete} />;

  return (
    <AthleteApp
      profile={profile}
      user={user}
      onLogout={handleLogout}
      onUpdateProfile={async (updated) => {
        setProfile(updated);
        const key = (user?.email || updated.email) ? `athlete_email_${user?.email || updated.email}` : `athlete_${updated.name}`;
        await storage.set(key, { ...updated, email: user?.email || updated.email });
      }}
    />
  );
}
