import React, { useState, useEffect, Component } from "react";

class ErrorBoundary extends Component {
  constructor(props) { super(props); this.state = { error: null }; }
  static getDerivedStateFromError(error) { return { error }; }
  componentDidCatch(error, info) { console.error("APP CRASH:", error, info); }
  render() {
    if (this.state.error) {
      return (
        <div style={{ minHeight:"100vh", background:"#080808", color:"#f0f0f0", fontFamily:"monospace", padding:"24px", overflowY:"auto" }}>
          <div style={{ color:"#ff4747", fontSize:18, fontWeight:700, marginBottom:16 }}>💥 Erreur détectée</div>
          <div style={{ background:"#111", border:"1px solid #333", borderRadius:8, padding:16, fontSize:12, lineHeight:1.6, whiteSpace:"pre-wrap", wordBreak:"break-all" }}>
            {String(this.state.error)}
          </div>
          <button onClick={() => this.setState({ error: null })} style={{ marginTop:16, padding:"10px 20px", background:"#007AFF", color:"#000", border:"none", borderRadius:8, fontWeight:700, cursor:"pointer" }}>
            Réessayer
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}


// ============================================================
// STYLES GLOBAUX
// ============================================================
const GLOBAL_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500;600;700&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --bg: #F5F5F7; --bg2: #FFFFFF; --bg3: #E8E8ED;
    --yellow: #007AFF; --red: #FF3B30; --green: #28A745; --orange: #E07A00; --purple: #7B3FCE;
    --yellow-bright: #007AFF;
    --white: #1D1D1F; --gray: #8E8E93; --gray2: #48484A;
    --font-title: 'Bebas Neue', sans-serif; --font-body: 'DM Sans', sans-serif;
    --spring: cubic-bezier(0.34, 1.56, 0.64, 1);
    --ease-out: cubic-bezier(0.16, 1, 0.3, 1);
    --ease-in-out: cubic-bezier(0.65, 0, 0.35, 1);
    --shadow-sm: 0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04);
    --shadow-md: 0 4px 16px rgba(0,0,0,0.08), 0 2px 4px rgba(0,0,0,0.04);
    --shadow-lg: 0 8px 32px rgba(0,0,0,0.1), 0 4px 8px rgba(0,0,0,0.06);
  }
  html, body { background: var(--bg); color: var(--white); font-family: var(--font-body); min-height: 100vh; overflow-x: hidden; scroll-behavior: smooth; }
  #root { min-height: 100vh; }
  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.15); border-radius: 2px; }
  .bebas { font-family: var(--font-title); letter-spacing: 0.04em; }

  /* ── Buttons ── */
  button { cursor: pointer; border: none; outline: none; font-family: var(--font-body); transition: transform 0.15s var(--spring), opacity 0.15s, box-shadow 0.15s; -webkit-tap-highlight-color: transparent; user-select: none; }
  button:active { transform: scale(0.94) !important; opacity: 0.85; }
  button:disabled { opacity: 0.4; cursor: not-allowed; }
  input, select, textarea { font-family: var(--font-body); -webkit-tap-highlight-color: transparent; }
  input:focus, select:focus, textarea:focus { outline: 2px solid rgba(0,122,255,0.6); outline-offset: 2px; transition: outline 0.15s; }

  /* ── Tab transitions ── */
  @keyframes slideInRight { from { opacity: 0; transform: translateX(32px); } to { opacity: 1; transform: translateX(0); } }
  @keyframes slideInLeft { from { opacity: 0; transform: translateX(-32px); } to { opacity: 1; transform: translateX(0); } }
  .tab-slide-right { animation: slideInRight 0.24s var(--ease-out) both; }
  .tab-slide-left { animation: slideInLeft 0.24s var(--ease-out) both; }

  /* ── Core animations ── */
  @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes fadeInFast { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes slideUp { from { opacity: 0; transform: translateY(40px); } to { opacity: 1; transform: translateY(0); } }
  .slide-up { animation: slideUp 0.32s var(--ease-out) both; }
  @keyframes floatUp { from { opacity: 0; transform: translateY(24px) scale(0.96); } to { opacity: 1; transform: translateY(0) scale(1); } }
  @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
  @keyframes pulse { 0%, 100% { opacity: 0.3; transform: scale(0.8); } 50% { opacity: 1; transform: scale(1.2); } }
  @keyframes shimmer { 0% { background-position: -300px 0; } 100% { background-position: 300px 0; } }
  @keyframes countUp { from { opacity: 0; transform: scale(0.7); } to { opacity: 1; transform: scale(1); } }
  @keyframes bounceIn { 0% { opacity: 0; transform: scale(0.4); } 60% { transform: scale(1.15); } 80% { transform: scale(0.95); } 100% { opacity: 1; transform: scale(1); } }
  @keyframes toastIn { from { opacity: 0; transform: translateY(20px) scale(0.95); } to { opacity: 1; transform: translateY(0) scale(1); } }
  @keyframes toastOut { from { opacity: 1; transform: translateY(0) scale(1); } to { opacity: 0; transform: translateY(10px) scale(0.95); } }
  @keyframes ripple { 0% { transform: scale(0); opacity: 0.5; } 100% { transform: scale(4); opacity: 0; } }
  @keyframes glow { 0%, 100% { box-shadow: 0 0 8px rgba(0,122,255,0.3); } 50% { box-shadow: 0 0 20px rgba(0,122,255,0.6); } }
  @keyframes confetti { 0% { transform: translateY(0) rotate(0deg); opacity: 1; } 100% { transform: translateY(-80px) rotate(360deg); opacity: 0; } }
  @keyframes scoreIn { 0% { stroke-dashoffset: 251; } 100% { } }
  @keyframes progressFill { from { width: 0; } }
  @keyframes numberPop { 0% { transform: scale(0.5); opacity: 0; } 70% { transform: scale(1.15); } 100% { transform: scale(1); opacity: 1; } }

  .fade-in { animation: fadeIn 0.3s var(--ease-out) both; }
  .fade-in-fast { animation: fadeInFast 0.18s var(--ease-out) both; }
  .slide-in-right { animation: slideInRight 0.28s var(--ease-out) both; }
  .float-up { animation: floatUp 0.4s var(--ease-out) both; }
  .bounce-in { animation: bounceIn 0.45s var(--spring) both; }
  .number-pop { animation: numberPop 0.45s var(--spring) both; }

  /* ── Cards ── */
  .card-hover { transition: transform 0.18s var(--spring), box-shadow 0.18s; will-change: transform; }
  .card-hover:active { transform: scale(0.975) !important; }
  .card-press { transition: transform 0.1s ease, background 0.15s; }
  .card-press:active { transform: scale(0.97); }

  /* ── Skeleton loader ── */
  .skeleton { background: linear-gradient(90deg, rgba(0,0,0,0.04) 0%, rgba(0,0,0,0.07) 50%, rgba(0,0,0,0.04) 100%); background-size: 300px 100%; animation: shimmer 1.4s ease infinite; border-radius: 8px; }
  .skeleton-card { background: linear-gradient(90deg, rgba(0,0,0,0.03) 0%, rgba(0,0,0,0.06) 50%, rgba(0,0,0,0.03) 100%); background-size: 400px 100%; animation: shimmer 1.6s ease infinite; border-radius: 18px; }

  /* ── Touch feedback ── */
  * { -webkit-tap-highlight-color: transparent; }
  [role="button"], a { -webkit-tap-highlight-color: transparent; }

  /* ── Safe area ── */
  .safe-bottom { padding-bottom: max(env(safe-area-inset-bottom, 16px), 16px); }

  /* ── Input range (sliders) ── */
  input[type="range"] { -webkit-appearance: none; appearance: none; width: 100%; height: 6px; border-radius: 99px; background: rgba(0,0,0,0.1); outline: none; cursor: pointer; }
  input[type="range"]::-webkit-slider-thumb { -webkit-appearance: none; appearance: none; width: 22px; height: 22px; border-radius: 50%; background: var(--yellow-bright); cursor: pointer; box-shadow: 0 2px 8px rgba(0,0,0,0.2); border: 2px solid #FFFFFF; transition: transform 0.15s var(--spring); }
  input[type="range"]::-webkit-slider-thumb:active { transform: scale(1.3); }
  input[type="range"]::-moz-range-thumb { width: 22px; height: 22px; border-radius: 50%; background: var(--yellow-bright); cursor: pointer; border: 2px solid #FFFFFF; }

  /* ── Text inputs premium ── */
  input[type="text"], input[type="number"], input[type="email"], input[type="date"], textarea, select {
    background: #FFFFFF; border: 1px solid rgba(0,0,0,0.1); color: var(--white);
    border-radius: 12px; padding: 12px 14px; transition: border-color 0.2s, background 0.2s, box-shadow 0.2s;
    box-shadow: 0 1px 2px rgba(0,0,0,0.04);
  }
  input[type="text"]:focus, input[type="number"]:focus, input[type="email"]:focus, input[type="date"]:focus, textarea:focus, select:focus {
    background: #FFFFFF; border-color: var(--yellow-bright); box-shadow: 0 0 0 3px rgba(0,122,255,0.15);
  }

  /* ── Scrollbar slim ── */
  * { scrollbar-width: thin; scrollbar-color: rgba(0,122,255,0.2) transparent; }

  /* ── Selection color ── */
  ::selection { background: rgba(0,122,255,0.25); color: var(--white); }

  /* ── Focus ring ── */
  :focus-visible { outline: 2px solid rgba(0,122,255,0.5); outline-offset: 2px; }
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
  { id: 2, label: "Développement", color: "#007AFF", emoji: "🟡" },
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
    (s.exercicesLog || []).filter(ex => ex && ex.nom).forEach(ex => {
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
    <div style={{ textAlign: "center", padding: "24px 16px", color: "#777", fontSize: 13 }}>
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
          <div style={{ background: "rgba(0,122,255,0.1)", borderRadius: 6, padding: "2px 10px", fontSize: 11, color: "var(--yellow)", fontWeight: 700 }}>Moy {avg}/10</div>
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
                <line x1={0} y1={yScale(v)} x2={innerW} y2={yScale(v)} stroke="rgba(0,0,0,0.04)" strokeWidth={1} />
                <text x={-4} y={yScale(v)+4} textAnchor="end" fill="#333" fontSize={8}>{v}</text>
              </g>
            ))}
            {/* Zone couleur RPE */}
            <rect x={0} y={0} width={innerW} height={yScale(4)} fill="rgba(255,71,71,0.05)" />
            <rect x={0} y={yScale(7)} width={innerW} height={yScale(4)-yScale(7)} fill="rgba(0,122,255,0.04)" />
            <rect x={0} y={yScale(10)} width={innerW} height={yScale(7)-yScale(10)} fill="rgba(57,255,128,0.04)" />
            {/* Ligne de moyenne */}
            <line x1={0} y1={yScale(avg)} x2={innerW} y2={yScale(avg)} stroke="rgba(0,122,255,0.25)" strokeWidth={1} strokeDasharray="4,4" />
            {/* Aire */}
            <path d={areaPath} fill="rgba(0,122,255,0.06)" />
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
    if (rpe >= 6) return "rgba(0,122,255,0.7)";
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
        <div style={{ background: "rgba(0,122,255,0.1)", borderRadius: 6, padding: "2px 10px", fontSize: 11, color: "var(--yellow)", fontWeight: 700 }}>
          {totalSeances} séances
        </div>
      </div>

      <div style={{ overflowX: "auto" }}>
        <div style={{ display: "flex", gap: 3, minWidth: "max-content" }}>
          {/* Labels jours */}
          <div style={{ display: "flex", flexDirection: "column", gap: 3, marginRight: 4 }}>
            {JOURS_SHORT.map((j, i) => (
              <div key={i} style={{ height: 12, fontSize: 8, color: "#555", lineHeight: "12px" }}>{i % 2 === 0 ? j : ""}</div>
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
                      border: isToday ? "1.5px solid var(--yellow)" : isHover && day.session ? "1px solid rgba(0,0,0,0.2)" : "1px solid transparent",
                      cursor: day.session ? "pointer" : "default",
                      transition: "transform 0.1s",
                      transform: isHover && day.session ? "scale(1.3)" : "scale(1)",
                    }}
                  />
                );
              })}
              {/* Label mois si 1er du mois dans la semaine */}
              <div style={{ height: 10, fontSize: 8, color: "#555", textAlign: "center" }}>
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
        <span style={{ fontSize: 10, color: "#777" }}>Intensité:</span>
        {[{ c: "rgba(57,255,128,0.7)", l: "Facile" }, { c: "rgba(0,122,255,0.7)", l: "Modérée" }, { c: "rgba(255,71,71,0.7)", l: "Intense" }, { c: "var(--bg3)", l: "Repos" }].map(item => (
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
            return <path key={pct} d={path} fill="none" stroke="rgba(0,0,0,0.05)" strokeWidth={1} />;
          })}
          {/* Axes */}
          {axes.map((_, i) => {
            const angle = startAngle + i * angleStep;
            const outer = getPoint(angle, R);
            return <line key={i} x1={CX} y1={CY} x2={outer.x} y2={outer.y} stroke="rgba(0,0,0,0.07)" strokeWidth={1} />;
          })}
          {/* Polygone athlète */}
          <path d={polygonPath} fill="rgba(0,122,255,0.12)" stroke="var(--yellow)" strokeWidth={2} />
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
              <div style={{ background: "rgba(0,0,0,0.06)", borderRadius: 99, height: 4 }}>
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
                <line x1={0} y1={y} x2={innerW} y2={y} stroke="rgba(0,0,0,0.04)" strokeWidth={1} />
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
// RECOVERY SCORE — Score composite 0-100 pour le suivi pro
// ============================================================
function calcRecoveryScore(dailyData, profile) {
  const sleepH = parseFloat(dailyData.sleepHours) || 7;
  const sleepQ = parseInt(dailyData.sommeil) || 3;
  const fatigue = parseInt(dailyData.fatigue) || 3;

  // Sleep score: optimal 8h, quality 1-4
  const sleepHScore = Math.min(1, sleepH / 8) * 0.7 + (sleepH >= 7 ? 0.3 : sleepH >= 6 ? 0.15 : 0);
  const sleepFull = (sleepHScore * 0.55 + (sleepQ / 4) * 0.45) * 100;

  // Fatigue score (frais = 4 = bon)
  const fatigueScore = (fatigue / 4) * 100;

  // Training load score
  const lastSession = (profile.sessions || []).slice(-1)[0];
  const daysSince = lastSession ? Math.max(0, Math.round((Date.now() - new Date(lastSession.date)) / 86400000)) : 7;
  const lastRPE = lastSession?.difficulte || 5;
  let loadScore = 80;
  if (daysSince === 0) loadScore = Math.max(10, 80 - lastRPE * 7);
  else if (daysSince === 1) loadScore = Math.max(30, 90 - lastRPE * 4);
  else if (daysSince >= 2) loadScore = Math.min(100, 80 + daysSince * 3);

  const score = Math.round(sleepFull * 0.42 + fatigueScore * 0.35 + loadScore * 0.23);
  return Math.max(5, Math.min(100, score));
}

function recoveryLabel(score) {
  if (score >= 80) return { label: "OPTIMAL", color: "var(--green)",  emoji: "🟢", tip: "Corps reposé — séance intense possible" };
  if (score >= 65) return { label: "BON",     color: "var(--yellow)", emoji: "🟡", tip: "Bonne forme — séance normale recommandée" };
  if (score >= 45) return { label: "MODÉRÉ",  color: "var(--orange)", emoji: "🟠", tip: "Fatigue accumulée — réduis le volume" };
  return               { label: "FAIBLE",  color: "var(--red)",    emoji: "🔴", tip: "Récupère — sortie douce ou repos" };
}

// Storage clé quotidienne
const getDailyLogKey = (name, dateStr) => `fitrace_daily_log_${name}_${dateStr}`;

// ============================================================
// PMC — Performance Management Chart (CTL / ATL / TSB)
// Modèle Banister impulse-response, standard coaching pro
// ============================================================
function calcPMC(sessions) {
  if (!sessions || sessions.length === 0) return [];

  // Trier par date croissante
  const sorted = [...sessions].sort((a, b) => new Date(a.date) - new Date(b.date));
  const first = new Date(sorted[0].date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Training Stress Score simplifié: RPE × durée_minutes × facteur_type
  const sessionLoad = (s) => {
    const rpe = s.difficulte || 5;
    const durMin = s.tempsReel
      ? parseInt(s.tempsReel.split(":")[0] || 0) * 60 + parseInt(s.tempsReel.split(":")[1] || 0)
      : 50;
    const typeMultiplier = s.type === "running_qualite" ? 1.2 : s.type === "hybride_compromis" ? 1.15 : 1.0;
    return Math.round((rpe / 10) * durMin * 10 * typeMultiplier);
  };

  // Index sessions par date
  const loadByDate = {};
  sorted.forEach(s => {
    const d = new Date(s.date).toISOString().split("T")[0];
    loadByDate[d] = (loadByDate[d] || 0) + sessionLoad(s);
  });

  // EMA constants
  const k_ctl = 1 - Math.exp(-1 / 42);
  const k_atl = 1 - Math.exp(-1 / 7);

  let ctl = 0, atl = 0;
  const points = [];
  const nDays = Math.ceil((today - first) / 86400000) + 1;

  for (let i = 0; i < nDays; i++) {
    const d = new Date(first);
    d.setDate(first.getDate() + i);
    const ds = d.toISOString().split("T")[0];
    const load = loadByDate[ds] || 0;

    ctl = ctl + k_ctl * (load - ctl);
    atl = atl + k_atl * (load - atl);
    const tsb = ctl - atl;

    points.push({ date: ds, ctl: Math.round(ctl), atl: Math.round(atl), tsb: Math.round(tsb), load });
  }

  return points;
}

function tsbLabel(tsb) {
  if (tsb > 15)  return { label: "Très frais",   color: "#38bdf8", tip: "Forme de pointe — idéal pour la compétition" };
  if (tsb > 5)   return { label: "Frais",         color: "var(--green)", tip: "Prêt pour les séances intenses" };
  if (tsb > -10) return { label: "Entraînement",  color: "var(--yellow)", tip: "Zone optimale de progression" };
  if (tsb > -25) return { label: "Fatigué",       color: "var(--orange)", tip: "Charge élevée — surveille ta récupération" };
  return              { label: "Surentraîné",   color: "var(--red)", tip: "Réduis la charge — risque de blessure" };
}

// ============================================================
// SYSTÈME XP / GAMIFICATION
// ============================================================
const XP_REWARDS = {
  session_done:    { xp: 100, label: "+100 XP", icon: "🏋️", msg: "Séance complète !" },
  streak_3:        { xp: 50,  label: "+50 XP",  icon: "🔥", msg: "3 jours consécutifs !" },
  streak_7:        { xp: 150, label: "+150 XP", icon: "⚡", msg: "1 semaine non-stop !" },
  streak_14:       { xp: 300, label: "+300 XP", icon: "💪", msg: "2 semaines !" },
  checkin_done:    { xp: 20,  label: "+20 XP",  icon: "✅", msg: "Check-in matinal !" },
  nutrition_log:   { xp: 15,  label: "+15 XP",  icon: "🥗", msg: "Nutrition trackée !" },
  hydration_full:  { xp: 25,  label: "+25 XP",  icon: "💧", msg: "Hydratation complète !" },
  hrv_logged:      { xp: 10,  label: "+10 XP",  icon: "💓", msg: "VFC enregistrée !" },
  weight_logged:   { xp: 10,  label: "+10 XP",  icon: "⚖️", msg: "Poids enregistré !" },
  benchmark_set:   { xp: 50,  label: "+50 XP",  icon: "🏅", msg: "Nouveau benchmark !" },
};

const XP_LEVELS = [
  { level: 1, name: "Rookie",       min: 0,    max: 300,  color: "#888",     icon: "🌱" },
  { level: 2, name: "Challenger",   min: 300,  max: 800,  color: "#38bdf8",  icon: "⚡" },
  { level: 3, name: "Warrior",      min: 800,  max: 1800, color: "var(--green)", icon: "💪" },
  { level: 4, name: "Elite",        min: 1800, max: 4000, color: "var(--yellow)", icon: "🔥" },
  { level: 5, name: "HYROX Pro",    min: 4000, max: 10000, color: "var(--orange)", icon: "🏆" },
  { level: 6, name: "Légende",      min: 10000, max: 999999, color: "var(--purple)", icon: "👑" },
];

function getXPLevel(totalXP) {
  const lvl = [...XP_LEVELS].reverse().find(l => totalXP >= l.min) || XP_LEVELS[0];
  const next = XP_LEVELS[lvl.level] || lvl;
  const progress = Math.min(100, Math.round(((totalXP - lvl.min) / (next.min - lvl.min || 1)) * 100));
  return { ...lvl, totalXP, progress, nextName: next.name, xpToNext: Math.max(0, next.min - totalXP) };
}

function calcTotalXP(profile) {
  const sessions = profile.sessions || [];
  let xp = 0;
  xp += sessions.length * XP_REWARDS.session_done.xp;
  const streak = profile.streak || 0;
  if (streak >= 14) xp += XP_REWARDS.streak_14.xp;
  else if (streak >= 7) xp += XP_REWARDS.streak_7.xp;
  else if (streak >= 3) xp += XP_REWARDS.streak_3.xp;
  xp += (profile.xpBonus || 0); // manual XP from actions
  return xp;
}

const BADGES = [
  { id: "first_session",  icon: "🏋️", name: "Première séance",    desc: "Tu as complété ta première séance !",         check: p => (p.sessions||[]).length >= 1 },
  { id: "week_warrior",   icon: "📅", name: "Semaine complète",    desc: "4+ séances en une semaine",                   check: p => { const w=new Date(); w.setDate(w.getDate()-7); return (p.sessions||[]).filter(s=>new Date(s.date)>=w).length>=4; } },
  { id: "streak_7",       icon: "🔥", name: "7 jours de feu",     desc: "7 jours d'entraînement consécutifs",           check: p => (p.streak||0) >= 7 },
  { id: "nutrition_pro",  icon: "🥗", name: "Nutrition consciente", desc: "5 jours de journal nutritionnel rempli",     check: p => (p.nutriDays||0) >= 5 },
  { id: "early_bird",     icon: "🌅", name: "Lève-tôt",            desc: "Check-in avant 7h du matin",                  check: p => (p.earlyBird||false) },
  { id: "iron_will",      icon: "💪", name: "Volonté de fer",       desc: "Séance réalisée malgré RPE déclaré 8+",       check: p => (p.sessions||[]).some(s => s.difficulte >= 8) },
  { id: "data_nerd",      icon: "📊", name: "Data addict",          desc: "VFC + poids + hydratation logués le même jour", check: p => (p.dataNerd||false) },
  { id: "podium",         icon: "🏆", name: "Podium HYROX",         desc: "Résultat de course enregistré",               check: p => (p.raceResults||[]).length >= 1 },
  { id: "ten_sessions",   icon: "⚡", name: "10 séances",           desc: "10 séances complètes dans l'app",             check: p => (p.sessions||[]).length >= 10 },
  { id: "level5",         icon: "👑", name: "Elite",                desc: "Atteindre le niveau Elite (1800 XP)",         check: p => calcTotalXP(p) >= 1800 },
];

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
            if (onChunk) onChunk(fullText);
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
  const [email, setEmail] = useState(() => {
    try { return localStorage.getItem("fitrace_last_email") || ""; } catch { return ""; }
  });
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
      // Mémoriser l'email pour pré-remplir
      try { localStorage.setItem("fitrace_last_email", email.trim().toLowerCase()); } catch {}
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
      // Mémoriser l'email pour pré-remplir
      try { localStorage.setItem("fitrace_last_email", email.trim().toLowerCase()); } catch {}
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

              <div style={{ height: 1, background: "rgba(0,0,0,0.06)", marginBottom: 4 }} />

              <button onClick={() => setMode("register")} style={{ width: "100%", background: "var(--yellow)", color: "#000", border: "none", borderRadius: 14, padding: "16px 24px", fontSize: 15, fontWeight: 700, cursor: "pointer", letterSpacing: "0.04em" }}>
                ✨ Créer mon compte gratuitement
              </button>

              <button onClick={() => setMode("login")} style={{ width: "100%", background: "rgba(0,0,0,0.05)", color: "var(--white)", border: "1px solid rgba(0,0,0,0.1)", borderRadius: 14, padding: "14px 24px", fontSize: 15, fontWeight: 600, cursor: "pointer" }}>
                👤 Se connecter
              </button>

              <div style={{ textAlign: "center", marginTop: 4 }}>
                <span onClick={() => setMode("coach")} style={{ fontSize: 12, color: "#777", cursor: "pointer" }}>🏅 Accès Coach</span>
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
                  {error.includes("Aucun compte") && (
                    <div style={{ marginTop: 6, fontSize: 11, color: "#ff9999" }}>
                      ⚠️ Les données sont stockées sur cet appareil. Si tu as changé de navigateur ou vidé le cache, ton compte n'est plus accessible.
                    </div>
                  )}
                </div>
              )}
              <button disabled={!email || !password || loading} onClick={handleLogin} style={{ width: "100%", background: !email || !password || loading ? "rgba(255,213,0,0.3)" : "var(--yellow)", color: "#000", border: "none", borderRadius: 14, padding: "16px", fontSize: 15, fontWeight: 700, cursor: loading ? "default" : "pointer", transition: "background 0.2s" }}>
                {loading ? "Connexion…" : "Se connecter →"}
              </button>
              <button onClick={() => { setMode("choose"); setError(""); }} style={{ width: "100%", background: "transparent", color: "#555", border: "1px solid rgba(0,0,0,0.08)", borderRadius: 12, padding: "12px", fontSize: 13, cursor: "pointer" }}>
                ← Retour
              </button>
              <div style={{ textAlign: "center", fontSize: 12, color: "#777" }}>
                Pas encore de compte ?{" "}
                <span onClick={() => { setMode("register"); setError(""); }} style={{ color: "var(--yellow)", cursor: "pointer", fontWeight: 600 }}>Créer un compte</span>
              </div>
              <div style={{ background: "rgba(0,0,0,0.02)", border: "1px solid rgba(0,0,0,0.06)", borderRadius: 10, padding: "10px 12px", fontSize: 10, color: "#555", textAlign: "center", lineHeight: 1.5 }}>
                Tes données sont sauvegardées localement sur cet appareil. Utilise toujours le même navigateur pour retrouver ton compte.
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
              <button onClick={() => { setMode("choose"); setError(""); }} style={{ width: "100%", background: "transparent", color: "#555", border: "1px solid rgba(0,0,0,0.08)", borderRadius: 12, padding: "12px", fontSize: 13, cursor: "pointer" }}>
                ← Retour
              </button>
              <div style={{ textAlign: "center", fontSize: 12, color: "#777" }}>
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
              <button onClick={() => { setMode("choose"); setError(""); }} style={{ width: "100%", background: "transparent", color: "#555", border: "1px solid rgba(0,0,0,0.08)", borderRadius: 12, padding: "12px", fontSize: 13, cursor: "pointer" }}>
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
            <div key={b.icon} style={{ display: "flex", gap: 14, alignItems: "flex-start", background: "rgba(0,0,0,0.03)", border: "1px solid rgba(0,0,0,0.06)", borderRadius: 14, padding: "14px 16px", textAlign: "left" }}>
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
          color: "#0a0a0a", cursor: "pointer", boxShadow: "0 8px 32px rgba(0,122,255,0.25)",
        }}>
          CRÉER MON PROFIL →
        </button>
        <div style={{ textAlign: "center", marginTop: 14, fontSize: 12, color: "#555" }}>
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
            <Card style={{ border: "1.5px solid rgba(0,122,255,0.25)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(0,122,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>🤖</div>
                <div>
                  <div className="bebas" style={{ fontSize: 18, color: "var(--yellow)", lineHeight: 1 }}>TON PROFIL COACH IA</div>
                  <div style={{ fontSize: 11, color: "#555" }}>Personnalisé par l'IA</div>
                </div>
              </div>
              {loading ? (
                <div>
                  <div style={{ fontSize: 14, color: "#ccc", lineHeight: 1.8, minHeight: 80 }}>
                    {profile.aiProfile || <span style={{ color: "#777", fontStyle: "italic" }}>Ton coach analyse ton profil...</span>}
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
                <div style={{ background: "rgba(0,122,255,0.04)", border: "1px solid rgba(0,122,255,0.15)", borderRadius: 14, padding: "16px", marginBottom: 12 }}>
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

  const lvlColors = ["", "#39ff80", "#007AFF", "#ff9a3c", "#ff4747"];

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
                <div style={{ background: "rgba(0,0,0,0.02)", border: "1px solid rgba(0,0,0,0.06)", borderRadius: 12, padding: "14px 16px", marginBottom: 12, textAlign: "center" }}>
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
                      { z: "Z3", label: "Tempo", pct: 70, color: "#007AFF" },
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
                    <div style={{ marginTop: 8, fontSize: 11, color: "#777", fontStyle: "italic" }}>
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
        <div style={{ textAlign: "center", padding: "28px 16px", color: "#777", fontSize: 13, lineHeight: 1.6 }}>
          <div style={{ fontSize: 28, marginBottom: 8 }}>{currentMetric.icon}</div>
          Pas encore de données pour {currentMetric.label}.<br/>
          <span style={{ color: "#555" }}>Le graphique se construit séance après séance.</span>
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
                <div style={{ fontSize: 9, color: "#777", marginBottom: 3, textTransform: "uppercase" }}>{s.label}</div>
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
                <div key={pct} style={{ borderTop: "1px solid rgba(0,0,0,0.04)", position: "relative" }}>
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
  // Calcul des jours de la semaine en cours (lundi → dimanche)
  const now = new Date();
  const dow = (now.getDay() + 6) % 7; // 0=lundi
  const weekStart = new Date(now); weekStart.setDate(now.getDate() - dow); weekStart.setHours(0,0,0,0);
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(weekStart); d.setDate(weekStart.getDate() + i);
    return d;
  });
  const sessionsByDate = {};
  (profile.sessions||[]).forEach(s => {
    const d = s.date?.slice(0,10);
    if (d) sessionsByDate[d] = s;
  });
  const dayLabels = ["L","M","M","J","V","S","D"];
  const totalMinutes = summary.count > 0 ? summary.count * 50 : 0; // estimation 50min/séance
  const scoreColor = summary.count >= 4 ? "var(--green)" : summary.count >= 2 ? "var(--yellow)" : "var(--orange)";

  return (
    <div style={{ background: "linear-gradient(135deg, rgba(0,122,255,0.04) 0%, rgba(0,0,0,0) 100%)", border: "1.5px solid rgba(0,122,255,0.15)", borderRadius: 18, padding: "16px", marginBottom: 12 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
        <div>
          <div style={{ fontSize: 10, color: "rgba(0,122,255,0.6)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 4 }}>📅 Semaine {week} en cours</div>
          <div className="bebas" style={{ fontSize: 32, color: scoreColor, lineHeight: 1 }}>{summary.count} <span style={{ fontSize: 16, color: "#555" }}>séances</span></div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 10, color: "#555", marginBottom: 2 }}>Volume</div>
          <div className="bebas" style={{ fontSize: 22, color: "#555" }}>{totalMinutes}<span style={{ fontSize: 11, color: "#555" }}>min</span></div>
        </div>
      </div>

      {/* Jours de la semaine */}
      <div style={{ display: "flex", gap: 4, marginBottom: 12 }}>
        {weekDays.map((d, i) => {
          const iso = d.toISOString().slice(0,10);
          const s = sessionsByDate[iso];
          const isToday = iso === now.toISOString().slice(0,10);
          const isPast = d < new Date(now.toDateString()) && !isToday;
          const ressentiColor = s?.ressenti === "bien" ? "var(--green)" : s?.ressenti === "facile" ? "var(--yellow)" : s ? "var(--red)" : null;
          return (
            <div key={i} style={{ flex: 1, textAlign: "center" }}>
              <div style={{ fontSize: 8, color: isToday ? "var(--yellow)" : "#2a2a2a", fontWeight: isToday ? 700 : 400, marginBottom: 4, textTransform: "uppercase" }}>{dayLabels[i]}</div>
              <div style={{
                width: "100%", aspectRatio: "1", borderRadius: 7,
                background: s ? `${ressentiColor}20` : isPast ? "rgba(0,0,0,0.02)" : "rgba(255,255,255,0.01)",
                border: s ? `1.5px solid ${ressentiColor}66` : isToday ? "1.5px solid rgba(0,122,255,0.4)" : `1px solid rgba(0,0,0,0.04)`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 12,
              }}>
                {s ? <span style={{ color: ressentiColor }}>✓</span> : isToday ? <span style={{ color: "var(--yellow)", fontSize: 8 }}>●</span> : ""}
              </div>
            </div>
          );
        })}
      </div>

      {/* Stats inline */}
      <div style={{ display: "flex", gap: 8 }}>
        {[
          { label: "Calibré", count: summary.bien, color: "var(--green)" },
          { label: "Facile", count: summary.facile || 0, color: "var(--yellow)" },
          { label: "Dur", count: summary.dur, color: "var(--red)" },
        ].map((s, i) => s.count > 0 && (
          <div key={i} style={{ background: `${s.color}10`, border: `1px solid ${s.color}22`, borderRadius: 8, padding: "5px 10px", display: "flex", alignItems: "center", gap: 5 }}>
            <span className="bebas" style={{ fontSize: 16, color: s.color, lineHeight: 1 }}>{s.count}</span>
            <span style={{ fontSize: 9, color: "#777" }}>{s.label}</span>
          </div>
        ))}
        {summary.dur >= 2 && (
          <div style={{ background: "rgba(255,71,71,0.06)", border: "1px solid rgba(255,71,71,0.2)", borderRadius: 8, padding: "5px 10px", fontSize: 10, color: "var(--red)" }}>
            ⚠️ Récup conseillée
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================
// ANALYTICS COMPONENTS — Premium UX
// ============================================================

function WeeklyPerformanceCard({ profile }) {
  const sessions = profile.sessions || [];
  const goal = profile.seancesParSemaine || 4;

  const now = new Date();
  const dow = now.getDay() === 0 ? 7 : now.getDay();
  const startThis = new Date(now); startThis.setDate(now.getDate() - dow + 1); startThis.setHours(0,0,0,0);
  const startLast = new Date(startThis); startLast.setDate(startThis.getDate() - 7);

  const thisWeek = sessions.filter(s => new Date(s.date) >= startThis);
  const lastWeek = sessions.filter(s => new Date(s.date) >= startLast && new Date(s.date) < startThis);

  const sessionScore = Math.min(100, Math.round((thisWeek.length / goal) * 100));
  const avgRPE = thisWeek.length ? thisWeek.reduce((a,s) => a+(s.difficulte||5),0)/thisWeek.length : null;
  const rpeScore = avgRPE !== null ? Math.round(Math.max(0, 100 - Math.abs(avgRPE - 6) * 12)) : 50;
  const goodSessions = thisWeek.filter(s => s.ressenti === "bien").length;
  const qualScore = thisWeek.length ? Math.round((goodSessions / thisWeek.length) * 100) : 50;

  const score = Math.round(sessionScore * 0.5 + rpeScore * 0.25 + qualScore * 0.25);
  const lastScore = lastWeek.length
    ? Math.min(100, Math.round((Math.min(100, (lastWeek.length/goal)*100)) * 0.5 + 50 * 0.5))
    : null;
  const delta = lastScore !== null ? score - lastScore : null;

  const scoreColor = score >= 80 ? "var(--green)" : score >= 55 ? "var(--yellow)" : score >= 30 ? "var(--orange)" : "var(--red)";
  const label = score >= 80 ? "EXCELLENT" : score >= 55 ? "BON" : score >= 30 ? "MOYEN" : "FAIBLE";

  // Circular gauge SVG
  const R = 40; const circ = 2 * Math.PI * R;
  const offset = circ - (score / 100) * circ;

  const DAYS = ["L","M","M","J","V","S","D"];

  return (
    <div style={{ background: "linear-gradient(135deg, rgba(0,0,0,0.03) 0%, rgba(255,255,255,0.01) 100%)", border: "1px solid rgba(0,0,0,0.07)", borderRadius: 20, padding: "18px 16px", marginBottom: 14, position: "relative", overflow: "hidden" }}>
      {/* Halo couleur */}
      <div style={{ position: "absolute", top: -30, right: -30, width: 130, height: 130, borderRadius: "50%", background: `radial-gradient(circle, ${scoreColor}12 0%, transparent 70%)`, pointerEvents: "none" }} />

      <div style={{ fontSize: 10, color: "#777", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 14 }}>⚡ Score de la semaine</div>

      <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
        {/* Gauge circulaire */}
        <div style={{ position: "relative", flexShrink: 0 }}>
          <svg width="100" height="100" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r={R} fill="none" stroke="rgba(0,0,0,0.05)" strokeWidth="7" />
            <circle cx="50" cy="50" r={R} fill="none" stroke={scoreColor} strokeWidth="7"
              strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={offset}
              transform="rotate(-90 50 50)" style={{ transition: "stroke-dashoffset 1s ease, stroke 0.5s" }} />
            <text x="50" y="45" textAnchor="middle" fontFamily="'Bebas Neue',sans-serif" fontSize="24" fill={scoreColor}>{score}</text>
            <text x="50" y="60" textAnchor="middle" fontFamily="'DM Sans',sans-serif" fontSize="9" fill="#444">{label}</text>
          </svg>
        </div>

        {/* Stats breakdown */}
        <div style={{ flex: 1 }}>
          {[
            { label: "Séances", val: `${thisWeek.length}/${goal}`, score: sessionScore, color: "var(--yellow)" },
            { label: "Intensité", val: avgRPE !== null ? `RPE ${avgRPE.toFixed(1)}` : "—", score: rpeScore, color: "var(--orange)" },
            { label: "Qualité", val: `${goodSessions}/${thisWeek.length} bien`, score: qualScore, color: "var(--green)" },
          ].map(item => (
            <div key={item.label} style={{ marginBottom: 8 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                <span style={{ fontSize: 10, color: "#555" }}>{item.label}</span>
                <span style={{ fontSize: 10, color: item.color, fontWeight: 700 }}>{item.val}</span>
              </div>
              <div style={{ height: 3, background: "rgba(0,0,0,0.05)", borderRadius: 99, overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${item.score}%`, background: item.color, borderRadius: 99, transition: "width 0.8s ease" }} />
              </div>
            </div>
          ))}
          {delta !== null && (
            <div style={{ marginTop: 6, fontSize: 10, color: delta >= 0 ? "var(--green)" : "var(--red)", fontWeight: 700 }}>
              {delta >= 0 ? "▲" : "▼"} {Math.abs(delta)} pts vs semaine précédente
            </div>
          )}
        </div>
      </div>

      {/* Heatmap jours */}
      <div style={{ display: "flex", gap: 4, marginTop: 14, justifyContent: "space-between" }}>
        {DAYS.map((d, i) => {
          const had = thisWeek.some(s => { const sd = new Date(s.date); return (sd.getDay() === 0 ? 7 : sd.getDay()) === i+1; });
          const isPast = i+1 <= dow;
          const isToday = i+1 === dow;
          return (
            <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
              <div style={{ width: "100%", aspectRatio: "1", borderRadius: 6, background: had ? `${scoreColor}20` : isPast ? "rgba(0,0,0,0.02)" : "transparent", border: `1px solid ${had ? scoreColor+"40" : isToday ? "rgba(0,0,0,0.12)" : "rgba(0,0,0,0.04)"}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10 }}>
                {had ? "✓" : ""}
              </div>
              <span style={{ fontSize: 8, color: isToday ? "var(--yellow)" : "#2a2a2a", fontWeight: isToday ? 700 : 400 }}>{d}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function TrainingMixChart({ profile }) {
  const sessions = profile.sessions || [];
  if (sessions.length < 3) return null;

  const TYPE_CONFIG = {
    running_zone2:     { label: "Zone 2",   color: "#39ff80", icon: "🏃" },
    force_stations:    { label: "Force",    color: "#007AFF", icon: "💪" },
    running_qualite:   { label: "Qualité",  color: "#ff9a3c", icon: "⚡" },
    hybride_compromis: { label: "Hybride",  color: "#a78bfa", icon: "🔀" },
    coach:             { label: "Coach",    color: "#38bdf8", icon: "👨‍💼" },
  };

  // Count par type
  const counts = {};
  sessions.forEach(s => { counts[s.type] = (counts[s.type]||0)+1; });
  const total = sessions.length;
  const slices = Object.entries(counts)
    .map(([type, count]) => ({ type, count, pct: count/total, ...TYPE_CONFIG[type] || { label: type, color: "#555", icon: "📊" } }))
    .sort((a, b) => b.count - a.count);

  // SVG donut
  const cx = 50, cy = 50, r = 36, stroke = 12;
  let cursor = -Math.PI / 2;
  const arcs = slices.map(s => {
    const angle = s.pct * 2 * Math.PI;
    const x1 = cx + r * Math.cos(cursor);
    const y1 = cy + r * Math.sin(cursor);
    cursor += angle;
    const x2 = cx + r * Math.cos(cursor);
    const y2 = cy + r * Math.sin(cursor);
    const large = angle > Math.PI ? 1 : 0;
    return { ...s, d: `M ${x1.toFixed(2)} ${y1.toFixed(2)} A ${r} ${r} 0 ${large} 1 ${x2.toFixed(2)} ${y2.toFixed(2)}` };
  });

  const top = slices[0];

  return (
    <div style={{ background: "rgba(0,0,0,0.02)", border: "1px solid rgba(0,0,0,0.06)", borderRadius: 18, padding: "14px 16px", marginBottom: 14 }}>
      <div style={{ fontSize: 10, color: "#777", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 12 }}>🎯 Mix d'entraînement</div>
      <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
        {/* Donut */}
        <div style={{ flexShrink: 0, position: "relative" }}>
          <svg width="100" height="100" viewBox="0 0 100 100">
            <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(0,0,0,0.04)" strokeWidth={stroke} />
            {arcs.map((arc, i) => (
              <path key={i} d={arc.d} fill="none" stroke={arc.color} strokeWidth={stroke} strokeLinecap="butt" />
            ))}
            <text x={cx} y={cy-4} textAnchor="middle" fontFamily="'DM Sans',sans-serif" fontSize="9" fill="#555">TOP</text>
            <text x={cx} y={cy+8} textAnchor="middle" fontFamily="'Bebas Neue',sans-serif" fontSize="13" fill={top?.color}>{top?.label}</text>
          </svg>
        </div>

        {/* Légende */}
        <div style={{ flex: 1 }}>
          {slices.map(s => (
            <div key={s.type} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
              <div style={{ width: 8, height: 8, borderRadius: 2, background: s.color, flexShrink: 0 }} />
              <span style={{ fontSize: 11, color: "#888", flex: 1 }}>{s.icon} {s.label}</span>
              <span style={{ fontSize: 11, fontWeight: 700, color: s.color }}>{Math.round(s.pct*100)}%</span>
              <div style={{ width: 40, height: 3, background: "rgba(0,0,0,0.05)", borderRadius: 99, overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${s.pct*100}%`, background: s.color, borderRadius: 99 }} />
              </div>
            </div>
          ))}
          <div style={{ marginTop: 6, fontSize: 10, color: "#555" }}>{total} séances au total</div>
        </div>
      </div>

      {/* Conseil équilibre */}
      {(() => {
        const zone2Pct = (counts.running_zone2||0)/total;
        if (zone2Pct < 0.4) return (
          <div style={{ marginTop: 10, padding: "8px 10px", background: "rgba(56,189,248,0.06)", border: "1px solid rgba(56,189,248,0.15)", borderRadius: 10, fontSize: 10, color: "#38bdf8", lineHeight: 1.5 }}>
            💡 Les pros font 80% en Zone 2. Augmente le ratio cardio.
          </div>
        );
        return null;
      })()}
    </div>
  );
}

// ============================================================
// EXTRACTED IIFE HOOK COMPONENTS (fix React error #311)
// ============================================================

function Hyrox101Card({ profile, navigateTo }) {
  const [showHyrox101, setShowHyrox101] = React.useState(() => {
    try { return !localStorage.getItem("fitrace_hyrox101_done"); } catch { return true; }
  });
  if (!showHyrox101) return null;
  const STATIONS = [
    { icon: "⛷️", name: "SkiErg", dist: "1000m" },
    { icon: "🛷", name: "Sled Push", dist: "50m" },
    { icon: "🔗", name: "Sled Pull", dist: "50m" },
    { icon: "💥", name: "Burpee Jump", dist: "80m" },
    { icon: "🚣", name: "Rowing", dist: "1000m" },
    { icon: "🧳", name: "Farmers Carry", dist: "200m" },
    { icon: "🎒", name: "Sandbag Lunges", dist: "100m" },
    { icon: "🏐", name: "Wall Balls", dist: "75/100 reps" },
  ];
  return (
    <div style={{ background: "rgba(0,0,0,0.02)", border: "1px solid rgba(0,0,0,0.07)", borderRadius: 18, padding: "16px 16px", marginBottom: 14 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
        <div>
          <div style={{ fontSize: 9, color: "#777", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 3 }}>HYROX — C'est quoi ?</div>
          <div style={{ fontSize: 15, fontWeight: 700, color: "var(--white)" }}>1 km run + 1 station × 8</div>
        </div>
        <button onClick={() => { localStorage.setItem("fitrace_hyrox101_done","1"); setShowHyrox101(false); }}
          style={{ background: "rgba(0,0,0,0.05)", border: "1px solid rgba(0,0,0,0.08)", borderRadius: 8, color: "#666", fontSize: 14, cursor: "pointer", padding: "4px 8px", lineHeight: 1 }}>×</button>
      </div>
      <div style={{ fontSize: 11, color: "#666", lineHeight: 1.65, marginBottom: 12 }}>
        <strong style={{ color: "#999" }}>8 km de running</strong> entrecoupés de <strong style={{ color: "#999" }}>8 stations fonctionnelles</strong>. Endurance, force et régularité.
      </div>
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 12 }}>
        {STATIONS.map((s, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 5, padding: "4px 8px", background: "rgba(0,0,0,0.03)", border: "1px solid rgba(0,0,0,0.06)", borderRadius: 20 }}>
            <span style={{ fontSize: 12 }}>{s.icon}</span>
            <span style={{ fontSize: 10, color: "#888" }}>{s.name}</span>
          </div>
        ))}
      </div>
      <button onClick={() => { navigateTo("technique"); }}
        style={{ width: "100%", padding: "10px", background: "rgba(0,0,0,0.04)", border: "1px solid rgba(0,0,0,0.08)", borderRadius: 12, fontSize: 12, fontWeight: 700, color: "#888", cursor: "pointer" }}>
        Voir la technique →
      </button>
    </div>
  );
}

function SessionHistoryCard({ profile, haptic, navigateTo }) {
  const TYPE_CONF = {
    running_zone2: { icon: "🏃", color: "var(--green)", bg: "rgba(57,255,128,0.08)", border: "rgba(57,255,128,0.2)", label: "Zone 2" },
    force_stations: { icon: "💪", color: "var(--yellow)", bg: "rgba(0,122,255,0.06)", border: "rgba(0,122,255,0.2)", label: "Force" },
    running_qualite: { icon: "⚡", color: "var(--orange)", bg: "rgba(255,154,60,0.08)", border: "rgba(255,154,60,0.2)", label: "Qualité" },
    hybride_compromis: { icon: "🔀", color: "var(--purple)", bg: "rgba(167,139,250,0.08)", border: "rgba(167,139,250,0.2)", label: "Hybride" },
  };
  const sessions = (profile.sessions || []).slice(-5).reverse();
  const [selectedSession, setSelectedSession] = React.useState(null);
  return (
    <div style={{ marginBottom: 12 }}>
      {selectedSession && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.88)", zIndex: 500, display: "flex", alignItems: "flex-end" }}
          onClick={() => setSelectedSession(null)}>
          <div className="slide-up" onClick={e => e.stopPropagation()}
            style={{ background: "var(--bg2)", borderRadius: "20px 20px 0 0", padding: "24px 20px 36px", width: "100%", maxWidth: 480, margin: "0 auto", border: "1px solid rgba(0,0,0,0.08)", maxHeight: "75vh", overflowY: "auto" }}>
            <div style={{ width: 40, height: 4, borderRadius: 99, background: "#333", margin: "0 auto 20px" }} />
            {(() => {
              const s = selectedSession;
              const conf = TYPE_CONF[s.type] || { icon: "💪", color: "var(--yellow)", label: "Séance" };
              const rpe = s.difficulte || 5;
              const rpeColor = rpe <= 4 ? "var(--green)" : rpe <= 7 ? "var(--yellow)" : "var(--red)";
              return (
                <>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                    <span style={{ fontSize: 28 }}>{conf.icon}</span>
                    <div>
                      <div style={{ fontSize: 10, color: conf.color, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em" }}>{conf.label}</div>
                      <div style={{ fontSize: 16, fontWeight: 700, color: "var(--white)" }}>{s.titre}</div>
                    </div>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 14 }}>
                    <div style={{ background: `${rpeColor}10`, border: `1px solid ${rpeColor}25`, borderRadius: 12, padding: "10px 6px", textAlign: "center" }}>
                      <div className="bebas" style={{ fontSize: 22, color: rpeColor }}>{rpe}/10</div>
                      <div style={{ fontSize: 9, color: "#777", textTransform: "uppercase" }}>RPE</div>
                    </div>
                    {s.energie && <div style={{ background: "rgba(255,154,60,0.08)", border: "1px solid rgba(255,154,60,0.2)", borderRadius: 12, padding: "10px 6px", textAlign: "center" }}>
                      <div className="bebas" style={{ fontSize: 22, color: "var(--orange)" }}>{s.energie}/5</div>
                      <div style={{ fontSize: 9, color: "#777", textTransform: "uppercase" }}>Énergie</div>
                    </div>}
                    {s.tempsReel && <div style={{ background: "rgba(0,0,0,0.03)", border: "1px solid rgba(0,0,0,0.06)", borderRadius: 12, padding: "10px 6px", textAlign: "center" }}>
                      <div style={{ fontSize: 14, fontWeight: 700, color: "var(--white)" }}>{s.tempsReel}</div>
                      <div style={{ fontSize: 9, color: "#777", textTransform: "uppercase" }}>Durée</div>
                    </div>}
                  </div>
                  <div style={{ fontSize: 11, color: "#555", marginBottom: 12 }}>
                    📅 {new Date(s.date).toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" })}
                  </div>
                  {s.charges && <div style={{ background: "rgba(0,0,0,0.02)", borderRadius: 10, padding: "10px 12px", fontSize: 12, color: "#888", lineHeight: 1.6, marginBottom: 10 }}>{s.charges}</div>}
                  {s.douleurs && s.douleurs !== "Aucune douleur" && (
                    <div style={{ background: "rgba(255,71,71,0.06)", border: "1px solid rgba(255,71,71,0.15)", borderRadius: 10, padding: "8px 12px", fontSize: 12, color: "var(--red)" }}>⚠️ {s.douleurs}</div>
                  )}
                </>
              );
            })()}
          </div>
        </div>
      )}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
        <div style={{ fontSize: 11, color: "#555", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em" }}>Dernières séances</div>
        <button onClick={() => navigateTo("progress")} style={{ background: "none", border: "none", fontSize: 10, color: "#777", cursor: "pointer", fontWeight: 700, padding: "2px 0" }}>Voir tout →</button>
      </div>
      <div style={{ display: "flex", gap: 10, overflowX: "auto", paddingBottom: 4, scrollbarWidth: "none" }}>
        {sessions.map((s, i) => {
          const conf = TYPE_CONF[s.type] || { icon: "🏋️", color: "var(--yellow)", bg: "rgba(0,122,255,0.06)", border: "rgba(0,122,255,0.15)", label: "Séance" };
          const rpe = s.difficulte || 5;
          const rpeColor = rpe <= 4 ? "var(--green)" : rpe <= 7 ? "var(--yellow)" : "var(--red)";
          const rpePct = rpe / 10;
          return (
            <div key={i} onClick={() => { setSelectedSession(s); haptic([6]); }} style={{ flexShrink: 0, width: 140, background: conf.bg, border: `1.5px solid ${conf.border}`, borderRadius: 16, padding: "14px 12px", position: "relative", overflow: "hidden", cursor: "pointer", transition: "transform 0.15s var(--spring)", active: "scale(0.95)" }}>
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: conf.color, borderRadius: "16px 16px 0 0", opacity: 0.7 }} />
              <div style={{ fontSize: 26, marginBottom: 6, marginTop: 4 }}>{conf.icon}</div>
              <div style={{ fontSize: 11, fontWeight: 700, color: "var(--white)", lineHeight: 1.3, marginBottom: 5, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>{s.titre}</div>
              <div style={{ fontSize: 9, color: "#777", marginBottom: 8 }}>{new Date(s.date).toLocaleDateString("fr-FR", { day: "numeric", month: "short" })}</div>
              <div style={{ height: 3, background: "rgba(0,0,0,0.06)", borderRadius: 99, overflow: "hidden", marginBottom: 6 }}>
                <div style={{ height: "100%", width: `${rpePct * 100}%`, background: rpeColor, borderRadius: 99 }} />
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 9, background: `${conf.color}20`, color: conf.color, borderRadius: 4, padding: "2px 6px", fontWeight: 700 }}>{conf.label}</span>
                <span className="bebas" style={{ fontSize: 18, color: rpeColor, lineHeight: 1 }}>{rpe}<span style={{ fontSize: 8, color: "#555" }}>/10</span></span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function PourquoiCard({ session }) {
  const [open, setOpen] = React.useState(false);
  const POURQUOI = {
    running_zone2: { title: "Cardio Zone 2 — La base de tout", body: "La Zone 2, c'est courir à un rythme où tu peux parler normalement. C'est ennuyeux ? Oui. Mais c'est la fondation de toute progression HYROX. Tu développes ton moteur aérobie — ce qui te permet de tenir les 8 km de running en course. Les champions du monde font 80% de leur entraînement en Zone 2." },
    force_stations: { title: "Force & Stations — La puissance", body: "Les 8 stations HYROX exigent force, technique et résistance musculaire. Cette séance simule ces contraintes : charges lourdes, reps élevées, récupération incomplète. Plus tu maîtrises les stations, plus tu gagnes du temps en course." },
    running_qualite: { title: "Running qualité — La vitesse", body: "Ici on travaille au-dessus de ta vitesse de course cible. Ces intervalles intenses rendent ton allure de course \"facile\" par comparaison. 1 à 2 séances qualité/semaine suffisent — le reste doit être en Zone 2." },
    hybride_compromis: { title: "Séance hybride — La vraie simulation", body: "C'est le format HYROX : tu enchaînes running ET stations sans pause. C'est difficile parce que les jambes fatiguées en running impactent les stations. Entraîne ton cerveau ET tes muscles à changer de mode rapidement." },
    coach: { title: "Séance coach personnalisée", body: "Ton coach IA a analysé ton historique, ta fatigue, et ton niveau pour créer cette séance sur mesure. Fais confiance au programme — chaque séance prépare la suivante." },
  };
  const info = POURQUOI[session.type] || POURQUOI.coach;
  return (
    <div style={{ marginBottom: 14 }}>
      <button onClick={() => setOpen(o => !o)}
        style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "none", color: "#555", fontSize: 11, cursor: "pointer", padding: "4px 0", fontFamily: "inherit" }}>
        <span style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform 0.2s", display: "inline-block" }}>▶</span>
        <span style={{ color: "#555", fontWeight: 600 }}>🎓 Pourquoi cette séance ?</span>
      </button>
      {open && (
        <div style={{ marginTop: 6, padding: "10px 12px", background: "rgba(0,122,255,0.04)", border: "1px solid rgba(0,122,255,0.12)", borderRadius: 10 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "var(--yellow)", marginBottom: 5 }}>{info.title}</div>
          <div style={{ fontSize: 11, color: "#666", lineHeight: 1.7 }}>{info.body}</div>
        </div>
      )}
    </div>
  );
}

function WarmupWidget({ session }) {
  const WARMUPS = {
    running_zone2: [
      { icon: "🚶", label: "Marche active", duration: "3 min", desc: "Posture droite, bras actifs" },
      { icon: "🔄", label: "Rotations hanches", duration: "30 s", desc: "Cercles lents × 10 chaque sens" },
      { icon: "🦵", label: "High knees légers", duration: "45 s", desc: "Genoux montants, rythme facile" },
      { icon: "🏃", label: "Foulées progressives", duration: "2 min", desc: "70% → 80% allure zone 2" },
    ],
    force_stations: [
      { icon: "🔄", label: "Mobilité épaules", duration: "1 min", desc: "Rotations bras + cercles poignets" },
      { icon: "🦵", label: "Squat léger", duration: "45 s", desc: "15 reps poids du corps, lent" },
      { icon: "🏋️", label: "Activation fessiers", duration: "45 s", desc: "Clamshells ou glute bridge × 15" },
      { icon: "💪", label: "Bandes élastiques", duration: "1 min", desc: "Pull-apart × 15, face pull × 15" },
    ],
    running_qualite: [
      { icon: "🚶", label: "Jogging léger", duration: "5 min", desc: "Très facile, zone 1, muscles qui chauffent" },
      { icon: "⚡", label: "Strides ×4", duration: "2 min", desc: "Accélérations sur 80m, récup. marche" },
      { icon: "🦵", label: "Skipping", duration: "30 s", desc: "Montées de genoux rapides, sur place" },
      { icon: "🔥", label: "Activation neuro", duration: "30 s", desc: "2-3 accélérations courtes à allure cible" },
    ],
    hybride_compromis: [
      { icon: "🚶", label: "Marche + swings bras", duration: "2 min", desc: "Déverrouiller les épaules" },
      { icon: "🦵", label: "Lunge marchés", duration: "45 s", desc: "20 reps alternés, amplitude totale" },
      { icon: "🏃", label: "Jogging 2 min", duration: "2 min", desc: "Zone 1, facile" },
      { icon: "💪", label: "Push-ups lents", duration: "30 s", desc: "10 reps contrôlés, activation chest" },
    ],
  };
  const steps = WARMUPS[session.type] || WARMUPS.running_zone2;
  const [warmupOpen, setWarmupOpen] = React.useState(false);
  const [warmupDone, setWarmupDone] = React.useState({});
  const doneCount = Object.values(warmupDone).filter(Boolean).length;
  const allDone = doneCount === steps.length;
  return (
    <div style={{ background: allDone ? "rgba(57,255,128,0.04)" : "rgba(167,139,250,0.04)", border: `1px solid ${allDone ? "rgba(57,255,128,0.2)" : "rgba(167,139,250,0.15)"}`, borderRadius: 14, marginBottom: 10, overflow: "hidden" }}>
      <div onClick={() => setWarmupOpen(o => !o)} style={{ padding: "12px 16px", display: "flex", alignItems: "center", gap: 12, cursor: "pointer" }}>
        <div style={{ fontSize: 22, flexShrink: 0 }}>{allDone ? "✅" : "🔥"}</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 10, color: allDone ? "var(--green)" : "var(--purple)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em" }}>
            Échauffement · {steps.length} étapes
          </div>
          <div style={{ height: 3, background: "rgba(0,0,0,0.06)", borderRadius: 99, marginTop: 5, overflow: "hidden", width: "100%" }}>
            <div style={{ height: "100%", width: `${(doneCount/steps.length)*100}%`, background: allDone ? "var(--green)" : "var(--purple)", borderRadius: 99, transition: "width 0.3s" }} />
          </div>
        </div>
        <div style={{ fontSize: 12, color: allDone ? "var(--green)" : "#555", fontWeight: 700 }}>{doneCount}/{steps.length}</div>
        <div style={{ color: "#555", fontSize: 14, transform: warmupOpen ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}>▼</div>
      </div>
      {warmupOpen && (
        <div style={{ borderTop: "1px solid rgba(0,0,0,0.04)", padding: "8px 12px 12px" }}>
          {steps.map((step, i) => {
            const done = warmupDone[i];
            return (
              <div key={i} onClick={() => setWarmupDone(d => ({ ...d, [i]: !d[i] }))}
                style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 8px", borderRadius: 10, cursor: "pointer", background: done ? "rgba(57,255,128,0.04)" : "transparent", marginBottom: 4, transition: "background 0.2s" }}>
                <div style={{ width: 28, height: 28, borderRadius: "50%", flexShrink: 0, background: done ? "var(--green)" : "rgba(167,139,250,0.12)", border: done ? "none" : "2px solid rgba(167,139,250,0.3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: done ? 13 : 16, color: done ? "#000" : "var(--purple)", transition: "all 0.25s" }}>{done ? "✓" : step.icon}</div>
                <div style={{ flex: 1, opacity: done ? 0.5 : 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "var(--white)", textDecoration: done ? "line-through" : "none" }}>{step.label} <span style={{ fontSize: 10, color: "var(--purple)", fontWeight: 400 }}>· {step.duration}</span></div>
                  <div style={{ fontSize: 11, color: "#555", marginTop: 2 }}>{step.desc}</div>
                </div>
              </div>
            );
          })}
          {allDone && <div style={{ textAlign: "center", fontSize: 13, color: "var(--green)", fontWeight: 700, padding: "8px 0 4px" }}>🎯 Parfait ! Tu es prêt pour ta séance.</div>}
        </div>
      )}
    </div>
  );
}

function CooldownWidget({ session }) {
  const COOLDOWNS = {
    running_zone2: [
      { icon: "🚶", label: "Marche 3 min", duration: "3 min", desc: "Baisse progressive du rythme cardiaque" },
      { icon: "🦵", label: "Étirement quadriceps", duration: "45 s", desc: "Debout, genou plié, talon vers fesse × 2" },
      { icon: "🦵", label: "Étirement ischio", duration: "45 s", desc: "Jambe tendue au sol, penche le buste × 2" },
      { icon: "💆", label: "Respiration profonde", duration: "1 min", desc: "4 temps inspire, 6 temps expire × 5" },
    ],
    force_stations: [
      { icon: "💆", label: "Rouleau mousse dos", duration: "1 min", desc: "T4 à T12, 30s par zone douloureuse" },
      { icon: "🦵", label: "Fentes + étirement hip", duration: "1 min", desc: "Lunge bas, bras opposé vers le ciel × 2" },
      { icon: "💪", label: "Étirement pectoraux", duration: "30 s", desc: "Bras en croix contre un mur, rotation tronc" },
      { icon: "🧘", label: "Child pose", duration: "1 min", desc: "Assis sur les talons, bras tendus devant, front au sol" },
    ],
    running_qualite: [
      { icon: "🚶", label: "Trot très léger", duration: "3 min", desc: "Retour progressif, fréquence cardiaque descend" },
      { icon: "🦵", label: "Pigeon pose", duration: "1 min", desc: "Ouverture de hanche au sol × 2 côtés" },
      { icon: "🦵", label: "Mollets au mur", duration: "45 s", desc: "Pied au mur, genou tendu puis plié × 2" },
      { icon: "💆", label: "Relaxation allongé", duration: "2 min", desc: "Jambes surélevées contre un mur, respiration ample" },
    ],
    hybride_compromis: [
      { icon: "🚶", label: "Marche 2 min", duration: "2 min", desc: "Récupération active, bras décontractés" },
      { icon: "💆", label: "Rouleau mollets", duration: "45 s", desc: "10 roulages lents, pause sur zones tendues" },
      { icon: "🦵", label: "Étirement complet jambes", duration: "1 min", desc: "Quadri + ischio + fesse × chaque côté" },
      { icon: "💪", label: "Étirement dos + épaules", duration: "45 s", desc: "Bras croisé devant la poitrine, chin to chest" },
    ],
  };
  const steps = COOLDOWNS[session.type] || COOLDOWNS.running_zone2;
  const [cdOpen, setCdOpen] = React.useState(false);
  const [cdDone, setCdDone] = React.useState({});
  const doneCount = Object.values(cdDone).filter(Boolean).length;
  const allDone = doneCount === steps.length;
  return (
    <div style={{ background: allDone ? "rgba(57,255,128,0.03)" : "rgba(57,255,128,0.03)", border: `1px solid ${allDone ? "rgba(57,255,128,0.2)" : "rgba(57,255,128,0.1)"}`, borderRadius: 14, marginBottom: 10, overflow: "hidden" }}>
      <div onClick={() => setCdOpen(o => !o)} style={{ padding: "12px 16px", display: "flex", alignItems: "center", gap: 12, cursor: "pointer" }}>
        <div style={{ fontSize: 22, flexShrink: 0 }}>{allDone ? "✅" : "🧘"}</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 10, color: allDone ? "var(--green)" : "var(--green)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em" }}>Retour au calme · {steps.length} étapes</div>
          <div style={{ height: 3, background: "rgba(0,0,0,0.06)", borderRadius: 99, marginTop: 5, overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${(doneCount/steps.length)*100}%`, background: "var(--green)", borderRadius: 99, transition: "width 0.3s" }} />
          </div>
        </div>
        <div style={{ fontSize: 12, color: allDone ? "var(--green)" : "#555", fontWeight: 700 }}>{doneCount}/{steps.length}</div>
        <div style={{ color: "#555", fontSize: 14, transform: cdOpen ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}>▼</div>
      </div>
      {cdOpen && (
        <div style={{ borderTop: "1px solid rgba(0,0,0,0.04)", padding: "8px 12px 12px" }}>
          {steps.map((step, i) => {
            const done = cdDone[i];
            return (
              <div key={i} onClick={() => setCdDone(d => ({ ...d, [i]: !d[i] }))}
                style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 8px", borderRadius: 10, cursor: "pointer", background: done ? "rgba(57,255,128,0.04)" : "transparent", marginBottom: 4, transition: "background 0.2s" }}>
                <div style={{ width: 28, height: 28, borderRadius: "50%", flexShrink: 0, background: done ? "var(--green)" : "rgba(57,255,128,0.1)", border: done ? "none" : "2px solid rgba(57,255,128,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: done ? 13 : 16, color: done ? "#000" : "var(--green)", transition: "all 0.25s" }}>{done ? "✓" : step.icon}</div>
                <div style={{ flex: 1, opacity: done ? 0.5 : 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "var(--white)", textDecoration: done ? "line-through" : "none" }}>{step.label} <span style={{ fontSize: 10, color: "var(--green)", fontWeight: 400 }}>· {step.duration}</span></div>
                  <div style={{ fontSize: 11, color: "#555", marginTop: 2 }}>{step.desc}</div>
                </div>
              </div>
            );
          })}
          {allDone && <div style={{ textAlign: "center", fontSize: 13, color: "var(--green)", fontWeight: 700, padding: "8px 0 4px" }}>💚 Excellent ! Récupération complète.</div>}
        </div>
      )}
    </div>
  );
}

function PaceCalcWidget({ profile }) {
  const [targetH, setTargetH] = React.useState("1");
  const [targetM, setTargetM] = React.useState("00");
  const totalMins = parseInt(targetH||0)*60 + parseInt(targetM||0);
  const estStationsMins = 22;
  const runMins = Math.max(1, totalMins - estStationsMins);
  const runKm = 8;
  const paceSecKm = Math.round((runMins * 60) / runKm);
  const paceMin = Math.floor(paceSecKm / 60);
  const paceSec = paceSecKm % 60;
  const paceStr = totalMins > 0 ? `${paceMin}:${String(paceSec).padStart(2,"0")}/km` : "—";
  const stationTimeEach = Math.round((estStationsMins * 60) / 8);
  const stationMin = Math.floor(stationTimeEach / 60);
  const stationSec = stationTimeEach % 60;
  return (
    <div style={{ marginTop: 16, background: "rgba(57,255,128,0.04)", border: "1px solid rgba(57,255,128,0.15)", borderRadius: 16, padding: "16px" }}>
      <div className="bebas" style={{ fontSize: 18, color: "var(--green)", marginBottom: 12 }}>🎯 CALCULATEUR PACE HYROX</div>
      <div style={{ fontSize: 11, color: "#777", marginBottom: 10 }}>Ton objectif de temps total :</div>
      <div style={{ display: "flex", gap: 8, marginBottom: 14, alignItems: "center" }}>
        <select value={targetH} onChange={e => setTargetH(e.target.value)} style={{ flex: 1, background: "var(--bg3)", border: "1px solid rgba(0,0,0,0.08)", borderRadius: 10, padding: "10px", color: "var(--white)", fontSize: 16, fontFamily: "'Bebas Neue',sans-serif" }}>
          {["1","2","3","4","5"].map(h => <option key={h} value={h}>{h}h</option>)}
        </select>
        <span style={{ color: "#555", fontWeight: 700 }}>:</span>
        <select value={targetM} onChange={e => setTargetM(e.target.value)} style={{ flex: 1, background: "var(--bg3)", border: "1px solid rgba(0,0,0,0.08)", borderRadius: 10, padding: "10px", color: "var(--white)", fontSize: 16, fontFamily: "'Bebas Neue',sans-serif" }}>
          {["00","05","10","15","20","25","30","35","40","45","50","55"].map(m => <option key={m} value={m}>{m}min</option>)}
        </select>
      </div>
      {totalMins > 0 && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          <div style={{ background: "rgba(57,255,128,0.08)", border: "1px solid rgba(57,255,128,0.2)", borderRadius: 12, padding: "12px", textAlign: "center" }}>
            <div style={{ fontSize: 10, color: "var(--green)", textTransform: "uppercase", marginBottom: 4 }}>Allure running</div>
            <div className="bebas" style={{ fontSize: 26, color: "var(--green)", lineHeight: 1 }}>{paceStr}</div>
            <div style={{ fontSize: 9, color: "#777", marginTop: 2 }}>8 × 1km entre stations</div>
          </div>
          <div style={{ background: "rgba(0,122,255,0.06)", border: "1px solid rgba(0,122,255,0.18)", borderRadius: 12, padding: "12px", textAlign: "center" }}>
            <div style={{ fontSize: 10, color: "var(--yellow)", textTransform: "uppercase", marginBottom: 4 }}>Temps par station</div>
            <div className="bebas" style={{ fontSize: 26, color: "var(--yellow)", lineHeight: 1 }}>{stationMin}:{String(stationSec).padStart(2,"0")}</div>
            <div style={{ fontSize: 9, color: "#777", marginTop: 2 }}>moy. ~{estStationsMins}min total</div>
          </div>
        </div>
      )}
    </div>
  );
}

function QuickLogModal({ dailyData, setDailyData, setShowQuickLog, showToast, haptic, profile }) {
  const [ql, setQl] = React.useState({ water: dailyData.hydration, weight: dailyData.poidsJour, hrv: dailyData.hrv });
  const save = async () => {
    haptic([10,30,10]);
    setDailyData(d => ({ ...d, hydration: ql.water, poidsJour: ql.weight, hrv: ql.hrv }));
    setShowQuickLog(false);
    showToast("✅ Données enregistrées", "success", 2000);
  };
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 97, display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
      <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)" }} onClick={() => setShowQuickLog(false)} />
      <div style={{ position: "relative", background: "var(--bg2)", borderRadius: "24px 24px 0 0", padding: "20px 20px calc(env(safe-area-inset-bottom,16px) + 80px)", borderTop: "1px solid rgba(0,0,0,0.08)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: "var(--white)" }}>⚡ Log rapide</div>
          <div style={{ fontSize: 10, color: "#777" }}>Enregistrement auto</div>
        </div>
        <div style={{ marginBottom: 18 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
            <span style={{ fontSize: 12, color: "#666", fontWeight: 600 }}>💧 Eau</span>
            <span style={{ fontSize: 14, fontWeight: 700, color: ql.water >= 8 ? "var(--green)" : "var(--yellow)" }}>{ql.water}/8 verres</span>
          </div>
          <div style={{ display: "flex", gap: 5 }}>
            {Array.from({ length: 8 }, (_, i) => (
              <button key={i} onClick={() => { haptic([5]); setQl(q => ({ ...q, water: i < q.water ? i : i + 1 })); }}
                style={{ flex: 1, height: 32, borderRadius: 8, border: `1.5px solid ${i < ql.water ? "rgba(56,189,248,0.6)" : "rgba(0,0,0,0.08)"}`, background: i < ql.water ? "rgba(56,189,248,0.2)" : "rgba(0,0,0,0.03)", cursor: "pointer", fontSize: 12 }}>
                {i < ql.water ? "💧" : "○"}
              </button>
            ))}
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 18 }}>
          <div>
            <div style={{ fontSize: 11, color: "#555", fontWeight: 600, marginBottom: 6 }}>⚖️ Poids (kg)</div>
            <input type="number" step="0.1" min="40" max="150" value={ql.weight} onChange={e => setQl(q => ({ ...q, weight: e.target.value }))}
              placeholder={`${profile.poids||75}`}
              style={{ width: "100%", background: "rgba(0,0,0,0.05)", border: "1.5px solid rgba(0,0,0,0.08)", borderRadius: 12, padding: "10px 12px", color: "var(--white)", fontSize: 15, outline: "none", fontFamily: "'DM Sans',sans-serif", boxSizing: "border-box" }} />
          </div>
          <div>
            <div style={{ fontSize: 11, color: "#555", fontWeight: 600, marginBottom: 6 }}>💓 VFC (ms)</div>
            <input type="number" min="20" max="120" step="1" value={ql.hrv} onChange={e => setQl(q => ({ ...q, hrv: e.target.value }))}
              placeholder="Ex: 65"
              style={{ width: "100%", background: "rgba(0,0,0,0.05)", border: "1.5px solid rgba(0,0,0,0.08)", borderRadius: 12, padding: "10px 12px", color: "var(--white)", fontSize: 15, outline: "none", fontFamily: "'DM Sans',sans-serif", boxSizing: "border-box" }} />
          </div>
        </div>
        <button onClick={save}
          style={{ width: "100%", padding: "15px", borderRadius: 16, border: "none", background: "linear-gradient(135deg, var(--yellow), #b8cc38)", color: "#000", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans',sans-serif" }}>
          ✅ Enregistrer
        </button>
      </div>
    </div>
  );
}

// ============================================================
// APP ATHLÈTE
// ============================================================
function AthleteApp({ profile, user, onUpdateProfile, onLogout }) {
  const [tab, setTab] = useState("home");
  const [tabDir, setTabDir] = useState(1); // 1=droite, -1=gauche
  const [showQuickLog, setShowQuickLog] = useState(false);

  // ── PWA Install prompt
  const [installPrompt, setInstallPrompt] = useState(null);
  const [showInstallBanner, setShowInstallBanner] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  // Détection iOS (avec protection contre null sur Safari anciens)
  const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent || "") || ((navigator.platform || "") === "MacIntel" && (navigator.maxTouchPoints || 0) > 1);
  const isInStandalone = (window.matchMedia ? window.matchMedia("(display-mode: standalone)").matches : false) || window.navigator.standalone === true;

  useEffect(() => {
    if (isInStandalone) { setIsInstalled(true); return; }
    // Capturer le prompt d'installation Chrome/Android (pas disponible sur iOS)
    const handler = (e) => {
      e.preventDefault();
      setInstallPrompt(e);
      setTimeout(() => setShowInstallBanner(true), 3000);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  async function triggerInstall() {
    if (isIOS) { setShowIOSGuide(true); return; }
    if (!installPrompt) return;
    installPrompt.prompt();
    const { outcome } = await installPrompt.userChoice;
    if (outcome === "accepted") { setIsInstalled(true); setShowInstallBanner(false); }
    setInstallPrompt(null);
  }

  // ── Notifications push locales
  const [notifGranted, setNotifGranted] = useState(typeof Notification !== "undefined" && Notification.permission === "granted");

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
  // ── Toast system ──
  const [toasts, setToasts] = useState([]);
  const showToast = (msg, type = "success", duration = 2400) => {
    const id = Date.now();
    setToasts(t => [...t, { id, msg, type }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), duration);
  };

  // ── Haptic feedback ──
  const haptic = (pattern = [8]) => {
    try { navigator.vibrate?.(pattern); } catch {}
  };

  const TAB_ORDER = ["home","today","progress","race","planning","technique","profil","zones"];
  const navigateTo = (newTab) => {
    if (newTab === tab) return;
    const cur = TAB_ORDER.indexOf(tab); const nxt = TAB_ORDER.indexOf(newTab);
    setTabDir(nxt >= cur ? 1 : -1);
    setTab(newTab);
    haptic([6]);
    // Scroll to top on tab change
    requestAnimationFrame(() => window.scrollTo({ top: 0, behavior: "auto" }));
  };
  const todayStr = new Date().toISOString().split("T")[0];
  const [dailyData, setDailyData] = useState({ fatigue: 3, sommeil: 3, temps: 60, materiel: "tout", typeSeance: "auto", sleepHours: 7.5, poidsJour: profile.poids || "", hydration: 0, hrv: "" });
  // Load today's daily log from storage
  useEffect(() => {
    const key = getDailyLogKey(profile.name, todayStr);
    storage.get(key).then(saved => {
      if (saved) setDailyData(d => ({ ...d, ...saved }));
    });
  }, []);
  // Save daily log whenever dailyData changes (debounced)
  const saveDailyLog = React.useCallback(async (data) => {
    const key = getDailyLogKey(profile.name, todayStr);
    await storage.set(key, { fatigue: data.fatigue, sommeil: data.sommeil, sleepHours: data.sleepHours, poidsJour: data.poidsJour, hydration: data.hydration, hrv: data.hrv, date: todayStr });
  }, [profile.name, todayStr]);
  useEffect(() => {
    const t = setTimeout(() => saveDailyLog(dailyData), 600);
    return () => clearTimeout(t);
  }, [dailyData.fatigue, dailyData.sommeil, dailyData.sleepHours, dailyData.poidsJour, dailyData.hydration, dailyData.hrv]);
  const [showSeancePerso, setShowSeancePerso] = useState(false);
  const [seancePerso, setSeancePerso] = useState({ titre: "", exercices: [{ nom: "", detail: "", note: "" }] });
  const sessionCacheKey = `session_today_${profile.name}_${new Date().toISOString().split("T")[0]}`;
  const [session, setSession] = useState(() => {
    try {
      const cached = localStorage.getItem(sessionCacheKey);
      return cached ? JSON.parse(cached) : null;
    } catch { return null; }
  });
  const [loadingSession, setLoadingSession] = useState(false);
  const [checkedExercices, setCheckedExercices] = useState({});
  const [showFeedback, setShowFeedback] = useState(false);
  const [showSessionModal, setShowSessionModal] = useState(false);
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
    mentalPre: "",
    concentration: 0,
    mentalNote: "",
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
  const [tourStep, setTourStep] = useState(() => {
    try { return localStorage.getItem("fitrace_tour_done") ? -1 : 0; } catch { return -1; }
  });
  const dismissTour = () => { localStorage.setItem("fitrace_tour_done", "1"); setTourStep(-1); };
  const [videoModal, setVideoModal] = useState(null);
  const [planningWeek, setPlanningWeek] = useState(null);
  const [loadingPlanning, setLoadingPlanning] = useState(false);
  const [streak, setStreak] = useState(0);
  const [streakData, setStreakData] = useState(null);
  const [streakMilestone, setStreakMilestone] = useState(null); // { days, emoji, msg }
  const [messageIA, setMessageIA] = useState(null);
  const [loadingMessage, setLoadingMessage] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [sessionStreamText, setSessionStreamText] = useState("");
  const [generatingSilently, setGeneratingSilently] = useState(false);
  const [feedbackStreamText, setFeedbackStreamText] = useState("");
  const [miniRestTimer, setMiniRestTimer] = useState(null); // { secs: number, initial: number } | null
  const [showCoachChat, setShowCoachChat] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const chatEndRef = React.useRef(null);

  // Auto-scroll chat to bottom on new messages
  useEffect(() => {
    if (chatEndRef.current) chatEndRef.current.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  const days = daysUntil(profile.raceDate);

  // Charger la séance coach du jour
  useEffect(() => {
    storage.get("coach_session_today").then(s => {
      if (s && s.date === new Date().toISOString().split("T")[0]) setCoachSession(s);
    });
  }, []);

  // Auto-génération en arrière-plan si pas encore de séance aujourd'hui
  useEffect(() => {
    const alreadyCached = (() => { try { return !!localStorage.getItem(sessionCacheKey); } catch { return false; } })();
    if (!alreadyCached && !session && (profile.sessions || []).length >= 0) {
      // Petite temporisation pour ne pas bloquer le rendu initial
      const t = setTimeout(() => {
        setGeneratingSilently(true);
        generateSession(true); // true = mode silencieux
      }, 2000);
      return () => clearTimeout(t);
    }
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

  // Mini rest timer countdown
  useEffect(() => {
    if (!miniRestTimer || miniRestTimer.secs <= 0) return;
    const t = setTimeout(() => {
      setMiniRestTimer(r => {
        if (!r) return null;
        const next = r.secs - 1;
        if (next <= 0) {
          if (navigator.vibrate) navigator.vibrate([150, 80, 150]);
          return null; // timer done, dismiss
        }
        return { ...r, secs: next };
      });
    }, 1000);
    return () => clearTimeout(t);
  }, [miniRestTimer]);

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
      // Détecter les jalons de streak
      const MILESTONES = [
        { days: 3,  emoji: "🔥", msg: "3 jours d'affilée ! La régularité commence ici." },
        { days: 7,  emoji: "⚡", msg: "Une semaine complète ! Tu es sur une lancée incroyable !" },
        { days: 14, emoji: "💪", msg: "Deux semaines non-stop ! Tu construis une vraie habitude !" },
        { days: 30, emoji: "🏆", msg: "30 jours consécutifs ! Tu es une machine HYROX !" },
      ];
      const prevStreak = profile.streak || 0;
      const milestone = MILESTONES.find(m => current >= m.days && prevStreak < m.days);
      if (milestone) {
        haptic([20, 50, 20, 50, 40]);
        setStreakMilestone({ days: current, emoji: milestone.emoji, msg: milestone.msg });
      }
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

    const recentSessions3 = (profile.sessions || []).slice(-3).map(s => `"${s.titre}" (RPE ${s.difficulte}/10, ${s.ressenti})`).join(" → ");
    const systemPrompt = `Tu es Marc, coach HYROX certifié de niveau Pro. Tu entraînes ${profile.name} depuis le début. Tu parles directement à lui/elle en français, avec précision et bienveillance. Tu es direct, concret, actionnable — jamais vague.

━━ PROFIL ${profile.name?.toUpperCase()} ━━
${profile.age} ans | ${profile.poids}kg | ${profile.sexe || "?"} | Niveau HYROX: ${profile.level}/4 | Catégorie: ${profile.hyroxCategorie || "Open"}
VMA: ${profile.vmaKmh || "?"}km/h → Zone 2: ${profile.vmaKmh ? paceFromVMA(profile.vmaKmh, 65) : "??"}/km | Seuil: ${profile.vmaKmh ? paceFromVMA(profile.vmaKmh, 82) : "??"}/km
Deadlift 1RM: ${profile.deadlift1RM_final || "?"}kg | Squat 1RM: ${profile.squat1RM_final || "?"}kg
Score forme: ${score.global}% (Force ${score.force}% | Cardio ${score.endurance}%)
Objectif: ${profile.objectifPrincipal || "Finir HYROX"} | Course dans: ${days !== null ? days+" jours" : "non défini"}
Séances réalisées: ${(profile.sessions || []).length} | Streak: ${profile.streak || 0} jours
3 dernières: ${recentSessions3 || "aucune"}
Dernière séance: ${lastSess ? `"${lastSess.titre}" — RPE ${lastSess.difficulte}/10 | ressenti: ${lastSess.ressenti}` : "aucune"}

━━ TON EXPERTISE ━━
• Périodisation par blocs (base → développement → pic → affûtage)
• Modèle Banister charge/récupération (CTL/ATL/TSB)
• Spécificité HYROX: 8 stations + running compromis
• Charges officielles: Sled Push ${profile.sexe === "F" ? "102" : "152"}kg, Farmers ${profile.sexe === "F" ? "2x24" : "2x32"}kg, Wall Balls ${profile.sexe === "F" ? "4" : "6"}kg, Sandbag ${profile.sexe === "F" ? "10" : "20"}kg
• Nutrition sport: timing, glucides intra-effort, récupération protéique
• Technique stations: compensations à corriger, cues de coaching précis

━━ RÈGLES DE RÉPONSE ━━
• Toujours utiliser le prénom
• Donner des chiffres précis (allures en min/km, charges en kg, durées)
• Relier chaque conseil à l'objectif HYROX
• Si blessure/douleur aiguë → protocole RICE + consultation médicale recommandée
• Réponses courtes et structurées (pas de pavés de texte)
• Si question hors sport/santé → recentrer poliment sur la préparation HYROX`;

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

  async function generateSession(silent = false) {
    if (!silent) setLoadingSession(true);
    const week = profile.week || 1;
    const totalWeeksP = totalWeeksFromDate(profile.raceDate);
    const phase = getPhase(week, totalWeeksP);
    const fitnessScore = calcFitnessScore(profile);

    // ─── MÉMOIRE COMPLÈTE DE L'ATHLÈTE ───────────────────────────────
    const allSessions = profile.sessions || [];
    const allAdaptations = profile.adaptations || [];
    const nbSessions = allSessions.length;

    // ── ANALYSE APPROFONDIE DES FEEDBACKS ──────────────────────────────

    // 1. Séances récentes enrichies (exercicesLog + douleurs + énergie)
    const recentSessionsText = allSessions.slice(-5).map((s, i) => {
      const num = allSessions.length - Math.min(5, allSessions.length) + i + 1;
      const log = (s.exercicesLog || []).filter(e => e?.nom).map(e =>
        `    → ${e.nom}: ${e.charge ? e.charge+"kg" : "—"} × ${e.reps || "—"} reps × ${e.sets || "—"} sets [ressenti: ${e.ressenti || "?"}]`
      ).join("\n");
      const daysSince = s.date ? Math.round((Date.now() - new Date(s.date)) / 86400000) : "?";
      return `  S${num} (il y a ${daysSince}j) — "${s.titre}" [${s.type || "?"}]
    RPE: ${s.difficulte || "?"}/10 | Ressenti: ${s.ressenti || "?"} | Énergie post: ${s.energie || "?"}/5 | Temps réel: ${s.tempsReel || "?"}min
    Douleurs: ${s.douleurs || "aucune"}
    Notes: ${s.notes || "—"}
${log || "    (performances non saisies)"}`;
    }).join("\n\n");

    // 2. Historique des charges par exercice (toutes séances)
    const chargesParExercice = {};
    allSessions.forEach(s => {
      (s.exercicesLog || []).filter(e => e?.nom && e.charge).forEach(e => {
        if (!chargesParExercice[e.nom]) chargesParExercice[e.nom] = [];
        chargesParExercice[e.nom].push({ charge: parseFloat(e.charge) || 0, date: s.date, reps: e.reps, sets: e.sets });
      });
    });
    // Calculer la progression pour les exercices clés
    const progressionCharges = Object.entries(chargesParExercice)
      .filter(([, vals]) => vals.length >= 2)
      .map(([nom, vals]) => {
        const sorted = vals.sort((a, b) => new Date(a.date) - new Date(b.date));
        const first = sorted[0].charge;
        const last = sorted[sorted.length - 1].charge;
        const diff = last - first;
        return `  ${nom}: ${first}kg → ${last}kg (${diff >= 0 ? "+" : ""}${diff}kg sur ${vals.length} séances)`;
      })
      .join("\n");

    // 3. Séances du même type — analyse spécifique
    const sameTypeSessions = allSessions.filter(s => s.type === sessionType).slice(-3);
    const sameTypeText = sameTypeSessions.length > 0
      ? sameTypeSessions.map((s, i) => {
          const log = (s.exercicesLog || []).filter(e => e?.nom).slice(0, 4).map(e =>
            `${e.nom}: ${e.charge || "—"}kg×${e.reps || "—"}reps`
          ).join(", ");
          return `  [${new Date(s.date).toLocaleDateString("fr-FR")}] RPE:${s.difficulte}/10 ${s.ressenti} — ${log || "pas de log"}`;
        }).join("\n")
      : "  Aucune séance de ce type encore";

    // 4. Signaux douleur/blessure récents
    const douloursRecentes = allSessions.slice(-5)
      .filter(s => s.douleurs && s.douleurs.trim() && s.douleurs.toLowerCase() !== "aucune" && s.douleurs !== "non renseigné")
      .map(s => `  [${new Date(s.date).toLocaleDateString("fr-FR")}] ${s.douleurs}`);

    // 5. Recommandations IA des feedbacks précédents (prochaine séance suggérée)
    const lastFeedbackRecos = allAdaptations.slice(-3)
      .filter(a => a.adaptation)
      .map((a, i) => `  Reco IA #${i+1} (${new Date(a.date).toLocaleDateString("fr-FR")}): ${a.adaptation}${a.progressions?.length ? " | Progressions: " + a.progressions.join(", ") : ""}`)
      .join("\n");

    // 6. Patterns automatiques enrichis
    const dernierRessentis = allSessions.slice(-3).map(s => s.ressenti);
    const derniersRPE = allSessions.slice(-5).map(s => s.difficulte || 5);
    const avgRPE5 = derniersRPE.length ? (derniersRPE.reduce((a,b) => a+b,0) / derniersRPE.length).toFixed(1) : "?";
    const dernierEnergie = allSessions.slice(-3).map(s => s.energie || 3);
    const avgEnergie = dernierEnergie.length ? (dernierEnergie.reduce((a,b) => a+b,0) / dernierEnergie.length).toFixed(1) : "?";

    const pattern = dernierRessentis.length === 0 ? "PREMIÈRE SÉANCE"
      : dernierRessentis.every(r => r === "facile") ? "STAGNATION — 3 séances trop faciles → AUGMENTER INTENSITÉ +10-15%"
      : dernierRessentis.every(r => r === "dur") ? "SURCHARGE — 3 séances trop dures → RÉDUIRE VOLUME -20%, maintenir intensité"
      : dernierRessentis.filter(r => r === "dur").length >= 2 ? "FATIGUE ACCUMULATIVE → séance plus légère aujourd'hui"
      : dernierRessentis.filter(r => r === "facile").length >= 2 ? "SOUS-STIMULATION → augmenter la charge de travail"
      : dernierRessentis.filter(r => r === "bien").length >= 2 ? "PROGRESSION STABLE → continuer à progresser légèrement"
      : "VARIABLE — adapter au cas par cas";

    const adaptationContext = nbSessions === 0
      ? "PREMIÈRE SÉANCE — pas d'historique, calibrer sur le profil de base."
      : `ANALYSE COMPLÈTE DES ${nbSessions} SÉANCES RÉALISÉES:

━━ DERNIÈRES SÉANCES DÉTAILLÉES (charges, ressenti, énergie) ━━
${recentSessionsText}

━━ PROGRESSION DES CHARGES (évolution réelle) ━━
${progressionCharges || "  Pas encore de données de charges saisies"}

━━ HISTORIQUE SÉANCES MÊME TYPE [${sessionType}] ━━
${sameTypeText}

━━ SIGNAUX DOULEURS/BLESSURES RÉCENTS ━━
${douloursRecentes.length > 0 ? douloursRecentes.join("\n") + "\n  ⚠️ ADAPTER LES EXERCICES EN CONSÉQUENCE" : "  Aucune douleur signalée récemment"}

━━ RECOMMANDATIONS IA PRÉCÉDENTES (à honorer) ━━
${lastFeedbackRecos || "  Aucune encore"}

━━ PATTERN & TENDANCES ━━
Pattern 3 derniers ressentis (${dernierRessentis.join(", ") || "—"}): ${pattern}
RPE moyen 5 dernières séances: ${avgRPE5}/10
Énergie post-séance moyenne: ${avgEnergie}/5
→ DIRECTIVE PRINCIPALE AUJOURD'HUI: ${allAdaptations.slice(-1)[0]?.adaptation || "Calibrer sur profil de base"}`;
    // ─────────────────────────────────────────────────────────────────

    // Déterminer le type de séance — logique intelligente basée sur le jour + historique
    const choixManuel = dailyData.typeSeance && dailyData.typeSeance !== "auto";

    // Détection semaine de décharge : toutes les 4 semaines
    const isDeloadWeek = week > 0 && week % 4 === 0 && phase !== "affûtage";

    // Éviter de répéter le même type que la dernière séance
    const lastSessionType = allSessions.length > 0 ? allSessions[allSessions.length - 1]?.type : null;

    // Structure semaine HYROX validée par jour de la semaine
    const dayOfWeek = new Date().getDay(); // 0=dim, 1=lun, 2=mar, 3=mer, 4=jeu, 5=ven, 6=sam
    const smartTypeByDay = {
      0: "running_zone2",      // Dimanche → sortie longue Z2
      1: "force_stations",     // Lundi → force + stations
      2: "running_qualite",    // Mardi → qualité running
      3: "running_zone2",      // Mercredi → Z2 récup
      4: "force_stations",     // Jeudi → force
      5: "hybride_compromis",  // Vendredi → hybride HYROX
      6: "running_zone2",      // Samedi → sortie Z2
    };
    // Rotation de secours si conflit avec dernière séance
    const rotationFallback = ["running_zone2", "force_stations", "running_qualite", "hybride_compromis", "force_stations"];
    let autoType = smartTypeByDay[dayOfWeek];
    if (autoType === lastSessionType) {
      // Éviter répétition : prendre le suivant dans la rotation
      const idx = rotationFallback.indexOf(lastSessionType);
      autoType = rotationFallback[(idx + 1) % rotationFallback.length];
    }

    const sessionType = choixManuel ? dailyData.typeSeance : autoType;

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

    // ─── DONNÉES FORME DU JOUR ───────────────────────────────────────
    const hrv = dailyData.hrv ? parseInt(dailyData.hrv) : null;
    const sleepH = parseFloat(dailyData.sleepHours) || 7.5;
    const fatigueVal = parseInt(dailyData.fatigue) || 3;
    const hydration = parseInt(dailyData.hydration) || 0;
    const fatigueLabels = ["","Épuisé(e)","Fatigué(e)","Bien","Frais/Fraîche"];
    const sommeilLabels = ["","Mauvais","Moyen","Bien","Excellent"];

    // Calcul adaptation intensité basée sur HRV + fatigue + sommeil
    let intensityModifier = "NORMALE";
    let intensityNote = "";
    if (hrv !== null && hrv < 40) { intensityModifier = "RÉDUITE -20%"; intensityNote = `VFC très basse (${hrv}) → récupération insuffisante`; }
    else if (hrv !== null && hrv > 70) { intensityModifier = "LÉGÈREMENT AUGMENTÉE"; intensityNote = `VFC élevée (${hrv}) → système nerveux bien récupéré`; }
    else if (fatigueVal <= 1) { intensityModifier = "RÉDUITE -30%"; intensityNote = "Épuisement déclaré → séance récupération active uniquement"; }
    else if (fatigueVal <= 2 || sleepH < 6) { intensityModifier = "RÉDUITE -15%"; intensityNote = `Fatigue élevée (${sleepH < 6 ? `sommeil seulement ${sleepH}h` : "ressenti fatigué"}) → volume réduit`; }
    else if (fatigueVal === 4 && sleepH >= 7.5) { intensityModifier = "LÉGÈREMENT AUGMENTÉE"; intensityNote = "Forme optimale → possibilité de pousser"; }

    // Calculs charges précises basées sur les 1RM
    const deadliftWork = profile.deadlift1RM_final ? Math.round(profile.deadlift1RM_final * 0.72) : null;
    const squatWork = profile.squat1RM_final ? Math.round(profile.squat1RM_final * 0.70) : null;
    const paceZ2 = profile.vmaKmh ? paceFromVMA(profile.vmaKmh, 65) : null;
    const paceZ3 = profile.vmaKmh ? paceFromVMA(profile.vmaKmh, 82) : null;
    const paceZ4 = profile.vmaKmh ? paceFromVMA(profile.vmaKmh, 90) : null;
    const wallBallKg = profile.sexe === "F" ? 4 : 6;
    const farmersKg = profile.sexe === "F" ? 24 : 32;
    const sandbagKg = profile.sexe === "F" ? 10 : 20;
    // ─────────────────────────────────────────────────────────────────

    // ═══ BASE DE CONNAISSANCES HYROX ════════════════════════════════════
    // Sélectionner les données pertinentes selon le type de séance
    const hyroxDB = {
      stations: {
        skiErg: {
          officiel: "1000m",
          technique: "Tirer avec les bras ET le gainage — ne pas arrondir le dos. Rythme : 1 coup = expiration forcée. Cadence cible : 22-26 coups/min. Corps légèrement penché avant (10°). Pousser avec les épaules, pas seulement les bras.",
          erreurs: "Dos voûté, regarder le sol, coudes trop hauts, apnée",
          progression: "Débutant: 4x250m récup 90s | Intermédiaire: 3x400m récup 2min | Avancé: 2x500m récup 90s",
          temps_cibles: { debutant: "4:30-5:00", intermediaire: "3:30-4:00", avance: "3:00-3:20", pro: "2:45-3:00" },
        },
        sledPush: {
          officiel: { H: "152kg+traineau 50m aller-retour", F: "102kg+traineau 50m aller-retour" },
          technique: "Position sprint : corps à 45°, appui sur talons-milieu pied, pousser avec fessiers+quadriceps+mollets. Garder la tête dans l'axe du corps. Petits pas rapides (fréquence > amplitude). Respiration : expire à chaque poussée.",
          erreurs: "Corps trop vertical (perd la force), grandes enjambées (lent), regarder en l'air",
          progression: "Débutant: 4x10m @ 50% | Intermédiaire: 4x20m @ 65% | Avancé: 3x40m @ 75% | Simulation: 2x50m @ race pace",
          muscles: "Quadriceps, fessiers, mollets, épaules, gainage",
        },
        sledPull: {
          officiel: { H: "103kg 50m aller-retour", F: "78kg 50m aller-retour" },
          technique: "Corde entre les jambes ou latérale selon disposition. Fléchir les genoux (squat dynamique), tirer avec le dos + bras fléchis. Faire des pas en arrière courts et rapides. Garde les bras en tension constante.",
          erreurs: "Bras tendus (tire avec les bras seuls), dos arrondi, grande amplitude de pas",
          progression: "Débutant: 4x15m @ 55% | Intermédiaire: 3x25m @ 70% | Avancé: 3x40m @ 80%",
          muscles: "Ischio-jambiers, fessiers, dos (rhomboïdes, trapèzes), biceps",
        },
        rowingErg: {
          officiel: "1000m",
          technique: "Séquence OBLIGATOIRE : jambes → dos → bras (traction). Retour : bras → dos → jambes. Drive explosif avec les jambes en premier. Ratio 1:2 (drive:récupération). Cadence : 22-26 spm. Damper setting : 4-6.",
          erreurs: "Tirer avec les bras avant les jambes (erreur #1), dos arrondi, haussement d'épaules",
          progression: "4x250m récup 90s → 3x400m → 2x500m → 1000m continu",
          temps_cibles: { debutant: "4:00-4:30", intermediaire: "3:20-3:50", avance: "3:00-3:20", pro: "2:45-3:00" },
          split_cible: "Split moyen = temps objectif / 4 (ex: objectif 3:20 → split 50s/250m)",
        },
        farmers: {
          officiel: { H: "2×32kg 200m (aller-retour 2×100m)", F: "2×24kg 200m" },
          technique: "Épaules en arrière et en bas, ne pas laisser les KB descendre. Pas normaux (pas de course). Grip neutre, avant-bras serrés contre les cuisses. Respiration haute — ne pas bloquer.",
          erreurs: "Épaules qui s'affaissent, inclinaison latérale du tronc, relâchement du grip",
          progression: "Débutant: 3x40m KB légères | Intermédiaire: 3x80m @ 75% | Avancé: 2x150m race charge | Simulation: 200m complet",
          grip_training: "Dead hangs 3x30s, KB carries progressifs, towel pull-ups",
        },
        wallBalls: {
          officiel: { H: "6kg balle à 10m hauteur 75 reps", F: "4kg balle à 9m hauteur 75 reps" },
          technique: "Squat profond (cuisse parallèle ou en dessous), explosion du bas (triple extension hanches+genoux+chevilles), lancer au niveau du front. Attraper à hauteur de visage, absorber avec les jambes pour enchaîner. Rythme continu > explosif-pause.",
          erreurs: "Squat trop haut (pas assez de profondeur), lancer avec les bras seuls, regarder la balle (regarder la cible)",
          strategie_reps: "Débutant: 15-10-10-10-10-10-10 | Intermédiaire: 25-25-25 | Avancé: 50-25 | Pro: 75 non-stop",
          muscles: "Quadriceps (75%), épaules, gainage",
        },
        sandbagLunges: {
          officiel: { H: "20kg 100m", F: "10kg 100m" },
          technique: "Sac sur les épaules (trapèzes, pas le cou). Fente avant : genou arrière à 2cm du sol. Pas de lunge longs et réguliers. Tronc droit, regard devant. Alterner jambes naturellement.",
          erreurs: "Genou avant qui dépasse les orteils, pencher en avant, pas trop courts",
          progression: "Débutant: 3x20m | Intermédiaire: 3x40m | Avancé: 2x80m | Simulation: 100m continu",
          muscles: "Quadriceps, fessiers, core stabilisateur",
        },
        burpeeBroadJump: {
          officiel: "80m",
          technique: "Burpee complet (poitrine au sol) → saut en longueur bras en avant. Atterrir pieds joints, fléchir les genoux pour absorber. Enchaîner immédiatement. Rythme constant > sprints entrecoupés de pauses.",
          erreurs: "Demi-burpee (poitrine pas au sol → pénalité), saut sans élan, pause entre chaque rep",
          strategie: "Garder rythme constant du début à la fin. Distance par saut : 1.2-1.5m en moyenne → 55-65 sauts pour 80m",
          progression: "Débutant: 4x10m | Intermédiaire: 3x20m | Avancé: 2x40m | Simulation: 80m",
          muscles: "Full body — poitrine, épaules, core, quadriceps, mollets",
        },
      },

      running: {
        zones: {
          Z1: { pct_vma: "50-60%", ressenti: "Très facile, conversation aisée", role: "Récupération active post-effort intense" },
          Z2: { pct_vma: "60-70%", ressenti: "Facile, on peut parler en phrases complètes", role: "Base aérobie — 70-80% du volume total", adaptation: "Mitochondries, capillarisation, économie de course" },
          Z3: { pct_vma: "75-83%", ressenti: "Modéré, phrases courtes", role: "Seuil lactique, tempo", adaptation: "Tolérance lactique, seuil anaérobie" },
          Z4: { pct_vma: "88-95%", ressenti: "Difficile, quelques mots seulement", role: "VO2max, intervalles", adaptation: "VO2max, puissance aérobie maximale" },
        },
        protocoles: {
          sortie_longue: "1h30-2h Z2 pur — LA séance la plus importante de la semaine. Jamais plus vite. Construit le moteur.",
          tempo: "3-4x8-10min seuil (Z3) récup 3min marche active — développe le seuil lactique",
          intervalles_1km: "4-6x1km @ Z4 récup 2-3min marche/trot — améliore VO2max",
          intervalles_courts: "8-10x400m @ Z4+ récup 90s — vitesse et économie de course",
          compromised_run: "Run 1km Z3 → station → run 1km Z3 → station → répéter. LA compétence HYROX.",
          fartlek: "30min avec 6x2min d'accélérations Z4 naturelles en terrain varié",
        },
        economieCourse: {
          cues: "Cadence 170-180 pas/min, appui milieu-avant pied, bras fléchis à 90° (pas de balancement latéral), regard devant (pas au sol), épaules détendues",
          erreurs: "Surstride (attaque talon trop en avant), trop lent (< 160 pas/min), épaules crispées",
          drills: "Talons-fesses, genoux hauts, jambes tendues, skipping, marche sur pointes",
        },
      },

      force: {
        squatVariantes: {
          goblet: { utilite: "Technique squat + gainage anterior — idéal avant les Wall Balls", charge_guide: "30-40% 1RM squat", cues: "Coudes sous la barre/KB, genoux écartés (45°), profondeur cuisse parallèle minimum" },
          frontSquat: { utilite: "Quadriceps + gainage — transfert direct Wall Balls", charge_guide: "40-55% 1RM squat", cues: "Coudes hauts (parallèle sol), dos droit, genoux dans l'axe des pieds" },
          bulgarianSplit: { utilite: "Équilibre + force unijambiste — jambes pour Lunges", charge_guide: "30-40% 1RM squat par côté", cues: "Pied avant à 60cm du banc, descendre verticalement, genou arrière 2cm du sol" },
          boxSquat: { utilite: "Apprendre la profondeur + puissance concentrique — Sled Push", charge_guide: "65-75% 1RM", cues: "Asseoir sur la boîte (ne pas rebondir), exploser vers le haut" },
        },
        hinge: {
          romanianDeadlift: { utilite: "Ischio-jambiers + fessiers — prévention blessures, Sled Pull", charge_guide: "55-65% 1RM deadlift", cues: "Hanches en arrière, dos plat, barre près du corps, sentir l'étirement des ischio" },
          trapBarDeadlift: { utilite: "Développement de puissance générale sans stress spinal", charge_guide: "80-90% 1RM deadlift classique", cues: "Hanches basses, dos plat, pousser le sol (ne pas tirer la barre)" },
          kettlebellSwing: { utilite: "Puissance hanches + endurance — transfert direct Sled Push/Pull", charge_guide: "16-32kg selon niveau", cues: "Hanches en avant explosive, bras passifs (ne pas lever avec les bras), planche en haut" },
        },
        upperBody: {
          pullUps: { utilite: "Force grip + dos — Rope Climb, Sled Pull, SkiErg", cues: "Depression scapulaire d'abord, tirer coudes vers hanches" },
          pressDebout: { utilite: "Force épaules — SkiErg, Wall Balls", charge_guide: "50-60% 1RM", cues: "Gainage serré, pas de cambrure, coudes devant" },
          rowHalter: { utilite: "Équilibre push/pull, santé épaules", charge_guide: "50-60% 1RM deadlift", cues: "Dos parallèle sol, coudes dans l'axe du corps" },
        },
        conditioning: {
          circuitHyrox: "Station 1 → run 200m → station 2 → run 200m → répéter. Volume progressif sur 8 semaines.",
          emom: "Every Minute On the Minute : x reps d'un exercice, le reste de la minute = récup",
          tabata: "20s effort max / 10s repos × 8 rounds (4min) — pour la puissance aérobie",
          amrap: "As Many Rounds As Possible en X minutes — simule la fatigue de course",
        },
      },

      periodisation: {
        semaine_type: {
          lundi: "Force + stations (musculation spécifique HYROX)",
          mardi: "Running qualité (intervalles ou tempo)",
          mercredi: "Zone 2 facile (récupération active)",
          jeudi: "Force + stations (volume différent du lundi)",
          vendredi: "Hybride HYROX (compromised running)",
          samedi: "Sortie longue Zone 2 (1h-1h30)",
          dimanche: "Repos actif ou mobilité",
        },
        phases: {
          base: { duree: "S1-S3", focus: "Volume aérobie + technique stations. 80% Z2, charges légères, apprendre les mouvements." },
          developpement: { duree: "S4-S6", focus: "Intensité progressive. Intervalles, seuil, charges en hausse. Compromised running." },
          pic: { duree: "S7", focus: "Simulation complète. Race pace. Volume maximal." },
          affutage: { duree: "S8", focus: "-40% volume, garder intensité. Récup. Confiance." },
        },
        decharge: {
          frequence: "Toutes les 4 semaines",
          application: "Volume -40%, intensité maintenue, durée séances -20%. NE PAS réduire l'intensité.",
          signaux_necessaires: "3 séances consécutives 'Dur', VFC chroniquement basse, qualité de sommeil dégradée",
        },
        surcompensation: "Appliquer la surcharge puis laisser 48-72h de récupération pour adaptation. La progression vient PENDANT la récup, pas pendant l'effort.",
      },

      nutrition: {
        avant_seance: {
          moins2h: "Repas complet : 60-80g glucides complexes + 20-30g protéines + légumes. Ex: riz + poulet + brocoli",
          moins1h: "Collation légère : banane + 20g protéines. Éviter les graisses et fibres.",
          moins30min: "1 gel ou 30g de dattes + eau. Optionnel selon tolérance.",
        },
        pendant: {
          courte: "< 60min : eau suffit (500-750ml/h)",
          longue: "> 60min : 30-60g glucides/h (gels, boisson isotonique), eau",
          sels: "Si > 90min ou forte chaleur : électrolytes (sodium 500-700mg/h)",
        },
        apres: {
          fenetre: "Dans les 30-45min après l'effort",
          protocole: "25-35g protéines + 50-80g glucides rapides. Ex: shake whey + banane ou riz blanc + thon",
          hydratation: "1.5L d'eau pour chaque kg perdu à l'entraînement",
        },
      },
    };

    // Extraire le bon bloc selon le type de séance
    const dbByType = {
      running_zone2: `\n\nBASE DE CONNAISSANCES RUNNING:\n${JSON.stringify({zones: hyroxDB.running.zones, protocoles: hyroxDB.running.protocoles, economieCourse: hyroxDB.running.economieCourse, periodisation: hyroxDB.periodisation.phases}, null, 1)}`,
      running_qualite: `\n\nBASE DE CONNAISSANCES RUNNING QUALITÉ:\n${JSON.stringify({zones: hyroxDB.running.zones, protocoles: hyroxDB.running.protocoles, economieCourse: hyroxDB.running.economieCourse}, null, 1)}`,
      force_stations: `\n\nBASE DE CONNAISSANCES FORCE & STATIONS:\n${JSON.stringify({stations: hyroxDB.stations, force: hyroxDB.force}, null, 1)}`,
      hybride_compromis: `\n\nBASE DE CONNAISSANCES HYBRIDE HYROX:\n${JSON.stringify({stations: {skiErg: hyroxDB.stations.skiErg, rowingErg: hyroxDB.stations.rowingErg, wallBalls: hyroxDB.stations.wallBalls, burpeeBroadJump: hyroxDB.stations.burpeeBroadJump}, running: hyroxDB.running, force: {conditioning: hyroxDB.force.conditioning}}, null, 1)}`,
    };
    const knowledgeBlock = dbByType[sessionType] || `\n\nBASE DE CONNAISSANCES HYROX:\n${JSON.stringify({stations: hyroxDB.stations, running: hyroxDB.running.zones}, null, 1)}`;
    // ════════════════════════════════════════════════════════════════════

    const expertSystemPrompt = `Tu es Marc, coach HYROX certifié niveau Pro avec 10 ans d'expérience. Tu as préparé des centaines d'athlètes HYROX du débutant au Pro. Ta méthode est scientifique, précise et individualisée.

MÉTHODOLOGIE QUE TU APPLIQUES TOUJOURS:
1. SPÉCIFICITÉ ABSOLUE: chaque exercice a une raison précise liée à HYROX
2. CHARGES CALCULÉES SUR LES 1RM: jamais de "charge modérée" — des chiffres précis
3. ALLURES RUNNING BASÉES SUR LA VMA: pas de "facile/modéré" — des min/km précis
4. ADAPTATION TEMPS RÉEL: VFC, sommeil, fatigue modifient l'intensité AVANT de générer
5. COMPROMISED RUNNING: entraîner à courir avec les jambes fatiguées = compétence #1 HYROX
6. PROGRESSION LOGIQUE: chaque séance prépare la suivante
7. TECHNIQUE AVANT CHARGE: utilise les cues techniques de la base de données pour les cle_technique
8. CONTINUITÉ: si des charges réelles sont dans l'historique, calibre sur ces chiffres réels + progression logique
9. MÉMOIRE DES DOULEURS: si une zone douloureuse est signalée, évite ou remplace les exercices correspondants
10. PROGRESSION RÉELLE: propose +2.5 à 5kg sur un exercice déjà logué si le ressenti était "bien" ou "facile"

ZONES RUNNING (à utiliser avec allures calculées, pas des RPE vagues):
- Zone 1 (<60% VMA): récupération active — uniquement entre blocs très intenses
- Zone 2 (60-70% VMA): base aérobie — fondamental, représente 70-80% du volume total
- Zone 3 (75-85% VMA): tempo seuil — développement lactique
- Zone 4 (88-95% VMA): VO2max — intervalles

CHARGES OFFICIELLES HYROX (base de calcul pour l'entraînement à 60-80%):
- Sled Push: H=152kg+traineau / F=102kg+traineau → entraîner à 60-75%
- Sled Pull: H=103kg / F=78kg → entraîner à 65-80%
- Farmers Carry: H=2x32kg / F=2x24kg
- Wall Balls: H=6kg à 10m (75 reps) / F=4kg à 9m
- Sandbag Lunges: H=20kg 100m / F=10kg 100m
- SkiErg/Rowing: 1000m standard
- Burpee Broad Jump: 80m

STRUCTURE OBLIGATOIRE DE CHAQUE SÉANCE:
- Échauffement: 10-12min spécifique à la séance (running progressif + mobilité ciblée + exercices d'activation)
- Corps: 35-50min selon temps disponible — DENSE, pas de temps perdu
- Retour au calme: 5-8min (étirements ciblés selon muscles sollicités)
${knowledgeBlock}

Réponds UNIQUEMENT avec le JSON demandé — aucun texte avant ou après, aucun backtick.`;

    const expertUserPrompt = `GÉNÈRE UNE SÉANCE ${sessionType.toUpperCase()}${isDeloadWeek ? " [SEMAINE DE DÉCHARGE — VOLUME -40%, INTENSITÉ MAINTENUE]" : ""} POUR:

═══ PROFIL ATHLÈTE ═══
Nom: ${profile.name} | Sexe: ${profile.sexe || "H"} | Âge: ${profile.age} ans | Poids: ${profile.poids}kg
Niveau HYROX: ${profile.level}/4 | Catégorie: ${profile.hyroxCategorie || "Open"}
VMA: ${profile.vmaKmh || "?"}km/h
Deadlift 1RM: ${profile.deadlift1RM_final || "?"}kg → charge de travail (72%): ${deadliftWork ? deadliftWork+"kg" : "?"}
Squat 1RM: ${profile.squat1RM_final || "?"}kg → charge de travail (70%): ${squatWork ? squatWork+"kg" : "?"}
Objectif: ${profile.objectifPrincipal || "Finir HYROX"} | Course dans: ${daysUntil(profile.raceDate) !== null ? daysUntil(profile.raceDate)+" jours" : "non défini"}

═══ DONNÉES FORME DU JOUR ═══
Énergie: ${fatigueLabels[fatigueVal]} (${fatigueVal}/4)
Qualité sommeil: ${sommeilLabels[parseInt(dailyData.sommeil)||3]} | Durée: ${sleepH}h
VFC: ${hrv !== null ? hrv+" ms" : "non mesurée"}
Hydratation: ${hydration}/8 verres
⚡ INTENSITÉ AJUSTÉE: ${intensityModifier}${intensityNote ? " — " + intensityNote : ""}

═══ ALLURES RUNNING PERSONNALISÉES ═══
Zone 2 (base): ${paceZ2 || "?"}/km
Zone 3 (tempo): ${paceZ3 || "?"}/km
Zone 4 (intervalles): ${paceZ4 || "?"}/km

═══ CHARGES STATIONS HYROX PERSONNALISÉES ═══
Wall Balls: ${wallBallKg}kg standard | Farmers Carry: ${farmersKg}kg/main | Sandbag: ${sandbagKg}kg
${squatWork ? `Goblet Squat: ${Math.round(squatWork * 0.45)}kg | Bulgarian Split: ${Math.round(squatWork * 0.35)}kg/côté` : ""}

═══ HISTORIQUE & FEEDBACK ANALYSÉS ═══
Phase: ${phase} | Semaine: ${week}/${totalWeeksP || "?"} | Séances réalisées: ${nbSessions}${isDeloadWeek ? " | ⚠️ SEMAINE DE DÉCHARGE : réduire le volume de 40%, maintenir l'intensité sur les séries clés" : ""}

${adaptationContext}

═══ RÈGLES D'UTILISATION DES FEEDBACKS ═══
1. Si des charges réelles sont connues → utilise-les comme BASE pour calibrer (+5-10% si ressenti "facile", -10% si "dur")
2. Si des douleurs sont signalées → évite les exercices sur les zones douloureuses, propose des alternatives
3. Si RPE moyen > 8 sur 3 séances → réduire le volume total de 15-20%
4. Si énergie post-séance < 2/5 → la séance était trop longue ou trop intense, adapter
5. Honore les recommandations IA précédentes sauf si les données du jour contredisent
6. Fais progresser les charges des exercices déjà pratiqués de façon logique (+2.5-5kg max par séance)

═══ TYPE DE SÉANCE À GÉNÉRER ═══
${sessionTypeDescriptions[sessionType] || "Séance HYROX générale"}
Temps disponible: ${dailyData.temps} minutes

BASE NUTRITION À UTILISER:
Avant (<2h): repas glucides complexes + protéines | Avant (<1h): banane + protéines légères | Pendant (>60min): 30-60g glucides/h | Après (dans 30min): 25-35g protéines + glucides rapides

RETOURNE UNIQUEMENT CE JSON (5-8 exercices, charges précises en chiffres, cle_technique issue de la base de connaissances, aucune approximation):
{"titre":"","type":"${sessionType}","duree":${dailyData.temps},"objectif":"","explication":"","echauffement":"","exercices":[{"nom":"","series":"","reps":"","charge":"","repos":"","rpe_cible":"","tempo":"","cle_technique":"","note":""}],"retourCalme":"","points_attention":"","nutrition":{"avant":"","pendant":"","apres":""},"charge_seance":"","metrique":""}

RÈGLES JSON: series=nombre ex "4", reps=reps ou durée ex "8" ou "30s" ou "500m", charge=précis ex "82kg" ou "2x32kg" ou "allure ${paceZ2||"?"}/km", repos=précis ex "90s" ou "2min30", rpe_cible=ex "7/10", tempo=optionnel ex "3-1-2-0", cle_technique=1 conseil technique clé en 1 phrase courte, charge_seance=ex "Volume modéré — ~3400kg déplacés"`;

    if (!silent) setSessionStreamText("🤖 Coach Marc analyse ton profil...");
    const raw = await callClaudeStream(
      expertSystemPrompt,
      expertUserPrompt,
      2200,
      silent ? undefined : (chunk) => {
        const titreMatch = chunk.match(/"titre"\s*:\s*"([^"]{3,})"/);
        if (titreMatch) setSessionStreamText(`📋 ${titreMatch[1]}...`);
        else if (chunk.length > 50) setSessionStreamText("🤖 Génération de ta séance...");
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
      try { localStorage.setItem(sessionCacheKey, JSON.stringify(parsed)); } catch {}
      setFeedback(null); setShowFeedback(false);
      setCheckedExercices({});
      if (silent) {
        setGeneratingSilently(false);
        showToast(`⚡ Séance prête : ${parsed.titre}`, "success", 3500);
      }
    } catch (e) {
      console.error("Erreur parse séance:", e.message, "Raw:", raw?.slice(0, 500));
      if (silent) setGeneratingSilently(false);
      if (!silent) setSession({
        titre: "Erreur — Réessaie",
        explication: e.message || "Erreur inconnue. Réessaie.",
        exercices: [],
        type: "erreur",
      });
    }
    if (!silent) { setSessionStreamText(""); setLoadingSession(false); }
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

── JOURNAL MENTAL ──
État pré-séance: ${feedbackData.mentalPre || "non renseigné"}
Concentration: ${feedbackData.concentration ? feedbackData.concentration + "/5" : "non renseignée"}
Note mentale: ${feedbackData.mentalNote || "aucune"}

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
      haptic([10, 30, 10]);
      showToast("Séance enregistrée ! +50 XP 💪", "success");
    } catch (e) { console.error(e, raw); }
    setFeedbackStreamText("");
    setLoadingFeedback(false);
  }

  const tabs = [
    { id: "home", label: "Accueil", icon: "🏠" },
    { id: "today", label: "Séance", icon: "⚡", badge: coachSession && !session },
    { id: "progress", label: "Stats", icon: "📈" },
    { id: "forme", label: "Forme", icon: "◎" },
    { id: "profil", label: "Profil", icon: "👤" },
  ];

  // ── Swipe gesture state ──
  const [touchStartX, setTouchStartX] = useState(null);
  const [touchStartY, setTouchStartY] = useState(null);
  const [showSwipeHint, setShowSwipeHint] = useState(() => {
    try { return !localStorage.getItem("fitrace_swipe_hint_seen"); } catch { return false; }
  });
  const BOTTOM_TABS = ["home","today","progress","forme","profil"];

  function handleTouchStart(e) {
    setTouchStartX(e.touches[0].clientX);
    setTouchStartY(e.touches[0].clientY);
  }
  function handleTouchEnd(e) {
    if (touchStartX === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX;
    const dy = Math.abs(e.changedTouches[0].clientY - touchStartY);
    // Only horizontal swipes (dx > 55px, not mostly vertical)
    if (Math.abs(dx) > 55 && dy < 80) {
      const idx = BOTTOM_TABS.indexOf(tab);
      if (dx < 0 && idx < BOTTOM_TABS.length - 1) {
        navigateTo(BOTTOM_TABS[idx + 1]);
        if (showSwipeHint) { localStorage.setItem("fitrace_swipe_hint_seen","1"); setShowSwipeHint(false); }
      } else if (dx > 0 && idx > 0) {
        navigateTo(BOTTOM_TABS[idx - 1]);
        if (showSwipeHint) { localStorage.setItem("fitrace_swipe_hint_seen","1"); setShowSwipeHint(false); }
      }
    }
    setTouchStartX(null);
    setTouchStartY(null);
  }

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", paddingBottom: 84 }}
      onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
      <style>{GLOBAL_STYLES}</style>

      {/* ── Streak milestone celebration ── */}
      {streakMilestone && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.88)", zIndex: 1100, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}
          onClick={() => setStreakMilestone(null)}>
          <div onClick={e => e.stopPropagation()} className="bounce-in" style={{ background: "#FFFFFF", border: "2px solid var(--yellow-bright)", borderRadius: 28, padding: "36px 28px", maxWidth: 340, width: "100%", textAlign: "center", boxShadow: "0 8px 40px rgba(0,0,0,0.15)" }}>
            {/* Glow */}
            <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle, rgba(0,122,255,0.08) 0%, transparent 70%)", pointerEvents: "none" }} />
            <div style={{ fontSize: 72, marginBottom: 8, animation: "bounceIn 0.5s var(--spring) both 0.1s" }}>{streakMilestone.emoji}</div>
            <div className="bebas" style={{ fontSize: 52, color: "var(--yellow)", lineHeight: 1, letterSpacing: 2, marginBottom: 4 }}>{streakMilestone.days} JOURS</div>
            <div style={{ fontSize: 12, color: "var(--yellow)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.14em", marginBottom: 16, opacity: 0.7 }}>🔥 Streak record</div>
            <div style={{ fontSize: 16, color: "#ddd", lineHeight: 1.65, marginBottom: 28 }}>{streakMilestone.msg}</div>
            <button onClick={() => setStreakMilestone(null)} style={{ width: "100%", padding: "16px", background: "var(--yellow)", border: "none", borderRadius: 16, fontSize: 16, fontFamily: "'Bebas Neue',sans-serif", letterSpacing: 2, color: "#000", cursor: "pointer" }}>
              CONTINUER SUR MA LANCÉE 🚀
            </button>
          </div>
        </div>
      )}

      {/* ── Toast notifications ── */}
      <div style={{ position: "fixed", bottom: 96, left: 16, right: 16, zIndex: 900, pointerEvents: "none", display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
        {toasts.map(t => {
          const colors = { success: { bg: "rgba(57,255,128,0.95)", color: "#000", icon: "✓" }, error: { bg: "rgba(255,71,71,0.95)", color: "#fff", icon: "✕" }, info: { bg: "rgba(0,122,255,0.95)", color: "#000", icon: "ℹ" }, badge: { bg: "rgba(167,139,250,0.95)", color: "#fff", icon: "🏅" } };
          const c = colors[t.type] || colors.success;
          return (
            <div key={t.id} style={{ animation: "toastIn 0.3s var(--spring) both", background: c.bg, color: c.color, borderRadius: 14, padding: "11px 18px", fontSize: 14, fontWeight: 700, boxShadow: "0 8px 32px rgba(0,0,0,0.4)", display: "flex", alignItems: "center", gap: 10, maxWidth: 360, pointerEvents: "auto", backdropFilter: "blur(12px)" }}>
              <span style={{ fontSize: 16 }}>{c.icon}</span>
              <span>{t.msg}</span>
            </div>
          );
        })}
      </div>

      {/* ── PWA Install Banner ── */}
      {showInstallBanner && !isInstalled && (
        <div className="slide-up" style={{ position: "fixed", bottom: 90, left: 16, right: 16, zIndex: 500, maxWidth: 480, margin: "0 auto" }}>
          <div style={{ background: "#FFFFFF", border: "1.5px solid var(--yellow-bright)", borderRadius: 18, padding: "14px 16px", display: "flex", alignItems: "center", gap: 12, boxShadow: "0 4px 20px rgba(0,0,0,0.12)" }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: "rgba(0,122,255,0.12)", border: "1px solid rgba(0,122,255,0.25)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>📲</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: "var(--white)", marginBottom: 2 }}>Installer FitRace</div>
              <div style={{ fontSize: 11, color: "#555", lineHeight: 1.4 }}>Accès rapide depuis ton écran d'accueil</div>
            </div>
            <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
              <button onClick={() => setShowInstallBanner(false)} style={{ background: "rgba(0,0,0,0.05)", border: "none", borderRadius: 8, padding: "7px 10px", color: "#777", fontSize: 12, cursor: "pointer" }}>Plus tard</button>
              <button onClick={triggerInstall} style={{ background: "var(--yellow)", border: "none", borderRadius: 8, padding: "7px 14px", color: "#000", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>Installer</button>
            </div>
          </div>
        </div>
      )}

      {/* ── iOS Install Guide Modal ── */}
      {showIOSGuide && (
        <div onClick={() => setShowIOSGuide(false)} style={{ position: "fixed", inset: 0, zIndex: 9999, background: "rgba(0,0,0,0.85)", display: "flex", alignItems: "flex-end", justifyContent: "center", padding: "0 0 16px 0" }}>
          <div onClick={e => e.stopPropagation()} style={{ background: "#FFFFFF", border: "none", borderRadius: 24, padding: 24, width: "100%", maxWidth: 420, margin: "0 16px", boxShadow: "0 8px 40px rgba(0,0,0,0.15)" }}>
            {/* Header */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
              <div>
                <div style={{ fontSize: 17, fontWeight: 800, color: "var(--yellow)", marginBottom: 3 }}>Installer FitRace</div>
                <div style={{ fontSize: 12, color: "#666" }}>Ajouter à l'écran d'accueil iPhone</div>
              </div>
              <button onClick={() => setShowIOSGuide(false)} style={{ background: "rgba(0,0,0,0.06)", border: "none", borderRadius: 10, width: 32, height: 32, color: "#666", fontSize: 18, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>×</button>
            </div>

            {/* Steps */}
            {[
              { n: 1, icon: "🌐", text: "Ouvre cette page dans", bold: "Safari" },
              { n: 2, icon: "⎋", text: "Appuie sur le bouton", bold: "Partager (carré ↑)" },
              { n: 3, icon: "➕", text: "Choisis", bold: "« Sur l'écran d'accueil »" },
              { n: 4, icon: "✅", text: "Appuie sur", bold: "« Ajouter »" },
            ].map(({ n, icon, text, bold }) => (
              <div key={n} style={{ display: "flex", alignItems: "center", gap: 14, padding: "12px 0", borderBottom: n < 4 ? "1px solid rgba(0,0,0,0.05)" : "none" }}>
                <div style={{ width: 32, height: 32, borderRadius: 10, background: "rgba(0,122,255,0.1)", border: "1px solid rgba(0,122,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0 }}>{icon}</div>
                <div style={{ fontSize: 13, color: "#bbb", lineHeight: 1.4 }}>
                  {text} <span style={{ color: "var(--yellow)", fontWeight: 700 }}>{bold}</span>
                </div>
              </div>
            ))}

            {/* Note Chrome */}
            <div style={{ marginTop: 16, padding: "10px 14px", background: "rgba(255,154,60,0.08)", border: "1px solid rgba(255,154,60,0.2)", borderRadius: 12 }}>
              <div style={{ fontSize: 11, color: "#ff9a3c", lineHeight: 1.5 }}>
                ⚠️ <strong>Important :</strong> l'installation PWA ne fonctionne que dans <strong>Safari</strong> sur iPhone — pas dans Chrome ni Firefox.
              </div>
            </div>

            <button onClick={() => setShowIOSGuide(false)} style={{ marginTop: 16, width: "100%", background: "var(--yellow)", border: "none", borderRadius: 14, padding: "13px 0", color: "#000", fontWeight: 800, fontSize: 14, cursor: "pointer" }}>
              J'ai compris
            </button>
          </div>
        </div>
      )}

      {/* Video Modal */}
      {videoModal && <VideoModal mouvement={videoModal} onClose={() => setVideoModal(null)} />}

      {/* Coach Chat Modal */}
      {showCoachChat && (
        <div style={{ position: "fixed", inset: 0, background: "#F5F5F7", zIndex: 300, display: "flex", flexDirection: "column" }}>
          <div style={{ flex: 1, display: "flex", flexDirection: "column", maxWidth: 520, margin: "0 auto", width: "100%", height: "100%" }}>
            {/* Header */}
            <div style={{ padding: "14px 20px 12px", borderBottom: "1px solid rgba(0,0,0,0.05)", background: "rgba(250,250,252,0.97)", backdropFilter: "blur(20px)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 40, height: 40, borderRadius: 12, background: "linear-gradient(135deg, rgba(0,122,255,0.2), rgba(57,255,128,0.1))", border: "1px solid rgba(0,122,255,0.3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>🤖</div>
                <div>
                  <div className="bebas" style={{ fontSize: 20, color: "var(--yellow)", letterSpacing: 1, lineHeight: 1 }}>COACH IA</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 5, marginTop: 2 }}>
                    <div style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--green)" }} />
                    <span style={{ fontSize: 11, color: "#555" }}>En ligne · Répond en temps réel</span>
                  </div>
                </div>
              </div>
              <button onClick={() => setShowCoachChat(false)} style={{ width: 34, height: 34, borderRadius: "50%", background: "rgba(0,0,0,0.05)", border: "1px solid rgba(0,0,0,0.08)", color: "#666", cursor: "pointer", fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center" }}>✕</button>
            </div>

            {/* Messages */}
            <div style={{ flex: 1, overflowY: "auto", padding: "20px 16px", display: "flex", flexDirection: "column", gap: 10 }}>
              {chatMessages.length === 0 && (
                <div style={{ padding: "20px 0" }}>
                  {/* Bulle d'accueil du coach */}
                  <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
                    <div style={{ width: 34, height: 34, borderRadius: 10, background: "rgba(0,122,255,0.1)", border: "1px solid rgba(0,122,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0 }}>🤖</div>
                    <div style={{ background: "rgba(0,0,0,0.04)", border: "1px solid rgba(0,0,0,0.08)", borderRadius: "4px 16px 16px 16px", padding: "14px 16px", maxWidth: "85%" }}>
                      <div style={{ fontSize: 14, color: "#ccc", lineHeight: 1.7 }}>Salut <strong style={{ color: "var(--yellow)" }}>{profile.name}</strong> ! 👋 Je suis ton coach IA HYROX personnel. Connais ton profil, tes forces et tes objectifs. Pose-moi n'importe quelle question.</div>
                    </div>
                  </div>
                  {/* Questions suggérées — contextuelles selon le tab */}
                  <div style={{ fontSize: 10, color: "#555", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 10 }}>Suggestions</div>
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
                      <button key={i} onClick={() => setChatInput(q)} style={{ background: "rgba(0,122,255,0.04)", border: "1px solid rgba(0,122,255,0.15)", borderRadius: 12, padding: "11px 14px", color: "#aaa", fontSize: 13, cursor: "pointer", textAlign: "left", display: "flex", alignItems: "center", gap: 10 }}>
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
                    <div style={{ width: 28, height: 28, borderRadius: 8, background: "rgba(0,122,255,0.08)", border: "1px solid rgba(0,122,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, flexShrink: 0, marginBottom: 2 }}>🤖</div>
                  )}
                  <div style={{
                    maxWidth: "82%",
                    background: msg.role === "user"
                      ? "linear-gradient(135deg, #007AFF, #b8cc00)"
                      : "rgba(0,0,0,0.04)",
                    color: msg.role === "user" ? "#000" : "#ddd",
                    borderRadius: msg.role === "user" ? "16px 16px 4px 16px" : "4px 16px 16px 16px",
                    padding: "11px 15px",
                    fontSize: 14,
                    lineHeight: 1.65,
                    border: msg.role === "assistant" ? "1px solid rgba(0,0,0,0.07)" : "none",
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
              <div ref={chatEndRef} />
            </div>

            {/* Input */}
            <div style={{ padding: "12px 16px 20px", borderTop: "1px solid rgba(0,0,0,0.05)", background: "rgba(250,250,252,0.97)", display: "flex", gap: 10, alignItems: "flex-end" }}>
              <input
                value={chatInput}
                onChange={e => setChatInput(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendChatMessage(); } }}
                placeholder="Pose ta question..."
                style={{ flex: 1, background: "rgba(0,0,0,0.05)", border: "1.5px solid rgba(0,0,0,0.08)", borderRadius: 14, padding: "12px 16px", color: "var(--white)", fontSize: 14, outline: "none", fontFamily: "'DM Sans', sans-serif" }}
              />
              <button onClick={sendChatMessage} disabled={!chatInput.trim() || chatLoading} style={{
                width: 46, height: 46, borderRadius: 14, border: "none", flexShrink: 0,
                background: chatInput.trim() && !chatLoading ? "var(--yellow)" : "rgba(0,0,0,0.05)",
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
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 20px", borderBottom: "1px solid rgba(0,0,0,0.05)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: chronoRunning ? "var(--green)" : "#444", boxShadow: chronoRunning ? "0 0 8px var(--green)" : "none" }} />
              <div className="bebas" style={{ fontSize: 15, color: "var(--yellow)", letterSpacing: 2 }}>MODE ENTRAÎNEMENT</div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ fontSize: 12, color: "#777", fontVariantNumeric: "tabular-nums" }}>
                {currentExIdx + 1}/{(session.exercices||[]).length}
              </div>
              <button onClick={() => { setChronoMode(false); setChronoRunning(false); setReposMode(false); setReposRunning(false); setLapTimes([]); }}
                style={{ background: "rgba(0,0,0,0.04)", border: "1px solid #1a1a1a", borderRadius: 8, padding: "6px 12px", color: "#555", fontSize: 12, cursor: "pointer" }}>✕ Quitter</button>
            </div>
          </div>

          {/* Progress bar séance */}
          <div style={{ height: 3, background: "#111" }}>
            <div style={{ height: "100%", background: "linear-gradient(90deg, var(--yellow), var(--green))", width: `${((currentExIdx) / Math.max((session.exercices||[]).length, 1)) * 100}%`, transition: "width 0.5s" }} />
          </div>

          {/* MODE REPOS */}
          {reposMode ? (
            <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "0 24px", background: reposCountdown <= 10 ? "radial-gradient(circle at 50% 40%, rgba(255,71,71,0.06) 0%, transparent 70%)" : "radial-gradient(circle at 50% 40%, rgba(57,255,128,0.06) 0%, transparent 70%)" }}>

              <div style={{ fontSize: 11, color: "#555", textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: 16 }}>Temps de repos</div>

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
                      <circle cx="110" cy="110" r={r} fill="none" stroke="rgba(0,0,0,0.04)" strokeWidth="8" />
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
                    background: reposCountdown === sec ? "rgba(57,255,128,0.1)" : "rgba(0,0,0,0.03)",
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
                <div style={{ marginTop: 20, background: "rgba(0,0,0,0.02)", border: "1px solid #181818", borderRadius: 12, padding: "12px 16px", width: "100%", maxWidth: 320 }}>
                  <div style={{ fontSize: 10, color: "#555", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 4 }}>Prochain exercice</div>
                  <div style={{ fontSize: 15, color: "#666", fontWeight: 600 }}>{(session.exercices||[])[currentExIdx + 1].nom}</div>
                  <div style={{ fontSize: 13, color: "#777" }}>{(session.exercices||[])[currentExIdx + 1].detail}</div>
                </div>
              )}
            </div>
          ) : (
            <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: "20px 20px 24px" }}>
              {/* Exercice en cours — hero */}
              {(session.exercices||[])[currentExIdx] && (
                <div style={{ background: "rgba(0,122,255,0.04)", border: "1.5px solid rgba(0,122,255,0.18)", borderRadius: 20, padding: "18px 20px", marginBottom: 12, position: "relative", overflow: "hidden" }}>
                  <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: "linear-gradient(90deg, var(--yellow), transparent)" }} />
                  <div style={{ fontSize: 10, color: "var(--yellow)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 8 }}>⚡ En cours</div>
                  <div className="bebas" style={{ fontSize: 28, color: "var(--white)", lineHeight: 1.1, marginBottom: 4 }}>{(session.exercices||[])[currentExIdx].nom}</div>
                  <div className="bebas" style={{ fontSize: 24, color: "var(--yellow)" }}>{(session.exercices||[])[currentExIdx].detail}</div>
                  {(session.exercices||[])[currentExIdx].note && (
                    <div style={{ fontSize: 12, color: "#777", marginTop: 8, borderTop: "1px solid rgba(0,0,0,0.04)", paddingTop: 8 }}>💬 {(session.exercices||[])[currentExIdx].note}</div>
                  )}
                </div>
              )}

              {/* Grand chrono central */}
              <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                <div className="bebas" style={{
                  fontSize: 88, color: chronoRunning ? "var(--white)" : "#333",
                  lineHeight: 1, letterSpacing: 4, fontVariantNumeric: "tabular-nums",
                  textShadow: chronoRunning ? "0 0 40px rgba(0,122,255,0.15)" : "none",
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
                <div style={{ display: "flex", alignItems: "center", gap: 10, background: "rgba(0,0,0,0.02)", border: "1px solid #151515", borderRadius: 12, padding: "10px 14px", marginBottom: 12 }}>
                  <div style={{ fontSize: 18 }}>→</div>
                  <div>
                    <div style={{ fontSize: 10, color: "#555", textTransform: "uppercase", letterSpacing: "0.1em" }}>Suivant</div>
                    <div style={{ fontSize: 14, color: "#555", fontWeight: 600 }}>{(session.exercices||[])[currentExIdx + 1].nom} · <span style={{ color: "#777" }}>{(session.exercices||[])[currentExIdx + 1].detail}</span></div>
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
                  }} style={{ width: "100%", padding: 16, borderRadius: 16, fontSize: 20, fontFamily: "'Bebas Neue',sans-serif", letterSpacing: 1, cursor: "pointer", background: "rgba(0,0,0,0.04)", border: "1px solid #1a1a1a", color: "#888" }}>
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
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.92)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: 20, overflowY: "auto" }}>
          <div style={{ width: "100%", maxWidth: 360 }}>
            {/* ── RACE CARD PREMIUM ── */}
            {(() => {
              const sc = calcFitnessScore(profile);
              const streak = (() => {
                let s = 0; const today = new Date(); today.setHours(0,0,0,0);
                const dates = (profile.sessions||[]).map(x => x.date?.slice(0,10)).filter(Boolean).sort().reverse();
                for (let i = 0; i < dates.length; i++) {
                  const d = new Date(today); d.setDate(d.getDate() - i);
                  if (dates[i] === d.toISOString().slice(0,10)) s++; else break;
                }
                return s;
              })();
              // Mini radar SVG
              const dims = ["Force", "Endurance", "Puissance", "Vitesse"];
              const vals = [sc.force/100, sc.endurance/100, sc.puissance/100, Math.min(1,(profile.vmaKmh||0)/20)];
              const cx = 60; const cy = 60; const R = 48;
              const pts = dims.map((_, i) => {
                const angle = (i / dims.length) * Math.PI * 2 - Math.PI / 2;
                return [cx + R * Math.cos(angle) * vals[i], cy + R * Math.sin(angle) * vals[i]];
              });
              const polygon = pts.map(p => p.join(",")).join(" ");
              const gridPts = (r) => dims.map((_, i) => {
                const angle = (i / dims.length) * Math.PI * 2 - Math.PI / 2;
                return [cx + r * Math.cos(angle), cy + r * Math.sin(angle)].join(",");
              }).join(" ");
              return (
                <div style={{ background: "linear-gradient(145deg, #0a0a00 0%, #080808 40%, #000a05 100%)", border: "1.5px solid rgba(0,122,255,0.35)", borderRadius: 24, padding: "24px 22px", marginBottom: 16, position: "relative", overflow: "hidden" }}>
                  {/* Halos */}
                  <div style={{ position: "absolute", top: -40, right: -40, width: 160, height: 160, borderRadius: "50%", background: "radial-gradient(circle, rgba(0,122,255,0.08) 0%, transparent 70%)", pointerEvents: "none" }} />
                  <div style={{ position: "absolute", bottom: -40, left: -40, width: 120, height: 120, borderRadius: "50%", background: "radial-gradient(circle, rgba(57,255,128,0.06) 0%, transparent 70%)", pointerEvents: "none" }} />

                  {/* Header */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 18 }}>
                    <div>
                      <div style={{ fontSize: 9, color: "rgba(0,122,255,0.5)", textTransform: "uppercase", letterSpacing: "0.2em", marginBottom: 6 }}>FITRACE · HYROX IA</div>
                      <div className="bebas" style={{ fontSize: 34, color: "var(--yellow)", letterSpacing: 2, lineHeight: 1 }}>{profile.name.toUpperCase()}</div>
                      <div style={{ fontSize: 11, color: "#555", marginTop: 4 }}>
                        {LEVELS[(profile.level||1)-1]?.label} · S{profile.week||1} · {profile.sessions?.length||0} séances
                      </div>
                    </div>
                    <div style={{ textAlign: "center" }}>
                      <div className="bebas" style={{ fontSize: 52, color: sc.global >= 75 ? "var(--green)" : sc.global >= 50 ? "var(--yellow)" : "var(--orange)", lineHeight: 1 }}>{sc.global}</div>
                      <div style={{ fontSize: 9, color: "#777", textTransform: "uppercase" }}>/ 100</div>
                    </div>
                  </div>

                  {/* Body */}
                  <div style={{ display: "flex", gap: 16, alignItems: "center", marginBottom: 18 }}>
                    {/* Radar */}
                    <svg width="120" height="120" viewBox="0 0 120 120" style={{ flexShrink: 0 }}>
                      {[0.25, 0.5, 0.75, 1].map((r, i) => (
                        <polygon key={i} points={gridPts(R * r)} fill="none" stroke="rgba(0,0,0,0.05)" strokeWidth="1" />
                      ))}
                      {dims.map((_, i) => {
                        const angle = (i / dims.length) * Math.PI * 2 - Math.PI / 2;
                        return <line key={i} x1={cx} y1={cy} x2={cx + R * Math.cos(angle)} y2={cy + R * Math.sin(angle)} stroke="rgba(0,0,0,0.06)" strokeWidth="1" />;
                      })}
                      <polygon points={polygon} fill="rgba(0,122,255,0.12)" stroke="var(--yellow)" strokeWidth="1.5" />
                      {dims.map((d, i) => {
                        const angle = (i / dims.length) * Math.PI * 2 - Math.PI / 2;
                        const lx = cx + (R + 10) * Math.cos(angle); const ly = cy + (R + 10) * Math.sin(angle);
                        return <text key={i} x={lx} y={ly} textAnchor="middle" dominantBaseline="middle" fontSize="7" fill="#555" fontFamily="'DM Sans',sans-serif">{d}</text>;
                      })}
                    </svg>
                    {/* Stats */}
                    <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8 }}>
                      {[
                        { icon: "🏃", label: "VMA", val: profile.vmaKmh ? `${profile.vmaKmh} km/h` : "—", color: "var(--green)" },
                        { icon: "🏋️", label: "Squat 1RM", val: profile.squat1RM_final ? `${profile.squat1RM_final} kg` : "—", color: "var(--yellow)" },
                        { icon: "🔥", label: "Streak", val: `${streak} j`, color: streak >= 7 ? "var(--orange)" : "#555" },
                        { icon: "🏁", label: "Course dans", val: days !== null ? `${days} j` : "—", color: "var(--red)" },
                      ].map((s, i) => (
                        <div key={i} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <span style={{ fontSize: 14 }}>{s.icon}</span>
                          <span style={{ fontSize: 10, color: "#777", flex: 1 }}>{s.label}</span>
                          <span className="bebas" style={{ fontSize: 14, color: s.color }}>{s.val}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Barre tricolore */}
                  <div style={{ display: "flex", gap: 3, height: 5, borderRadius: 99, overflow: "hidden", marginBottom: 8 }}>
                    <div style={{ flex: sc.force, background: "var(--yellow)", borderRadius: "99px 0 0 99px" }} />
                    <div style={{ flex: sc.endurance, background: "var(--green)" }} />
                    <div style={{ flex: sc.puissance, background: "var(--red)", borderRadius: "0 99px 99px 0" }} />
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
                    <span style={{ fontSize: 9, color: "rgba(0,122,255,0.6)" }}>Force {sc.force}%</span>
                    <span style={{ fontSize: 9, color: "rgba(57,255,128,0.6)" }}>Endurance {sc.endurance}%</span>
                    <span style={{ fontSize: 9, color: "rgba(255,71,71,0.6)" }}>Puissance {sc.puissance}%</span>
                  </div>

                  {/* Footer */}
                  <div style={{ fontSize: 9, color: "#2a2a2a", textAlign: "center" }}>fitrace-lemon.vercel.app · Coach HYROX IA</div>
                </div>
              );
            })()}
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
              }} style={{ width: "100%", padding: 11, background: "rgba(0,0,0,0.04)", border: "1px solid #222", borderRadius: 10, color: "#888", fontSize: 13, cursor: "pointer" }}>
                📋 Copier le texte
              </button>
              <button onClick={() => setShowShareCard(false)} style={{ width: "100%", padding: 8, background: "none", border: "none", color: "#777", fontSize: 12, cursor: "pointer" }}>Fermer</button>
            </div>
          </div>
        </div>
      )}

      {/* ── TOUR GUIDÉ (premier lancement) ── */}
      {tourStep >= 0 && (() => {
        const STEPS = [
          { icon: "🏁", title: "Bienvenue dans FitRace", body: `Bonjour ${profile.name.split(" ")[0]} ! HYROX = 8 km de course + 8 stations de force. Cette app est ton coach personnel pour y arriver. Chaque jour, elle t'indique quoi faire, comment, et suit ta progression.`, tab: null },
          { icon: "⚡", title: "Ta séance du jour", body: "L'onglet SÉANCE génère chaque jour une séance personnalisée selon ta forme, ta fatigue et ton niveau. Fais-la, note ton ressenti, et ton coach IA adapte la suivante.", tab: "today" },
          { icon: "📊", title: "Check-in matinal", body: "Chaque matin, dis-nous comment tu vas (fatigue, sommeil, poids). En 30 secondes, le coach sait s'il faut pousser fort ou récupérer. C'est la clé de la progression.", tab: "today" },
          { icon: "📅", title: "Ton planning semaine", body: "L'onglet PLANNING génère un programme hebdomadaire sur-mesure. Il alterne intelligemment cardio, force et récupération selon ton objectif.", tab: "planning" },
          { icon: "🍽️", title: "Mange comme un athlète", body: "L'onglet NUTRITION te guide sur quoi manger, quand, et combien. Templates de repas prêts à l'emploi pour avant/après séance et jour de course.", tab: "nutri" },
          { icon: "🤖", title: "Coach IA 24h/24", body: "Le bouton 🤖 en bas à droite est ton coach personnel. Pose-lui n'importe quelle question : technique, douleur, nutrition, objectif. Il connaît ton profil !", tab: null },
        ];
        const step = STEPS[tourStep] || STEPS[0];
        return (
          <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", zIndex: 500, display: "flex", alignItems: "flex-end", justifyContent: "center", padding: 20 }}>
            <div className="slide-up" style={{ width: "100%", maxWidth: 440, background: "linear-gradient(145deg, #131500 0%, #0a0f00 100%)", border: "1.5px solid rgba(0,122,255,0.4)", borderRadius: 24, padding: 24, boxShadow: "0 20px 60px rgba(0,0,0,0.8)" }}>
              {/* Dots de progression */}
              <div style={{ display: "flex", gap: 6, justifyContent: "center", marginBottom: 20 }}>
                {STEPS.map((_, i) => (
                  <div key={i} style={{ width: i === tourStep ? 20 : 6, height: 6, borderRadius: 99, background: i === tourStep ? "var(--yellow)" : i < tourStep ? "rgba(0,122,255,0.3)" : "rgba(0,0,0,0.08)", transition: "all 0.3s" }} />
                ))}
              </div>
              <div style={{ textAlign: "center", marginBottom: 20 }}>
                <div style={{ fontSize: 44, marginBottom: 12 }}>{step.icon}</div>
                <div className="bebas" style={{ fontSize: 26, color: "var(--yellow)", letterSpacing: 1, marginBottom: 10 }}>{step.title}</div>
                <div style={{ fontSize: 14, color: "#888", lineHeight: 1.7 }}>{step.body}</div>
              </div>
              <div style={{ display: "flex", gap: 10 }}>
                <button onClick={dismissTour} style={{ flex: 1, padding: "12px", background: "rgba(0,0,0,0.04)", border: "1px solid rgba(0,0,0,0.08)", borderRadius: 12, color: "#555", fontSize: 13, cursor: "pointer" }}>
                  Passer
                </button>
                <button onClick={() => {
                  if (step.tab) navigateTo(step.tab);
                  if (tourStep < STEPS.length - 1) setTourStep(t => t + 1);
                  else dismissTour();
                }} style={{ flex: 2, padding: "12px", background: "var(--yellow)", border: "none", borderRadius: 12, color: "#000", fontSize: 14, fontFamily: "'Bebas Neue',sans-serif", letterSpacing: 1, cursor: "pointer" }}>
                  {tourStep < STEPS.length - 1 ? "SUIVANT →" : "C'EST PARTI ! 🚀"}
                </button>
              </div>
              <div style={{ textAlign: "center", fontSize: 11, color: "#555", marginTop: 12 }}>{tourStep + 1} / {STEPS.length}</div>
            </div>
          </div>
        );
      })()}

      {/* Header sticky premium */}
      {(() => {
        const tabMeta = {
          home: { label: "Accueil", color: "var(--yellow)" },
          today: { label: "Séance", color: "var(--green)" },
          progress: { label: "Stats", color: "var(--purple)" },
          forme: { label: "Forme", color: "var(--green)" },
          planning: { label: "Planning", color: "var(--yellow)" },
          race: { label: "Course", color: "var(--red)" },
          technique: { label: "Technique", color: "var(--yellow)" },
          nutri: { label: "Nutrition", color: "var(--green)" },
          zones: { label: "Zones", color: "var(--green)" },
          profil: { label: "Profil", color: "var(--yellow)" },
        };
        const meta = tabMeta[tab] || { label: "FITRACE", color: "var(--yellow)" };
        const now = new Date();
        const dayLabel = now.toLocaleDateString("fr-FR", { weekday: "long" });
        const dateLabel = now.toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
        return (
          <div style={{ background: "rgba(245,245,247,0.95)", padding: "10px 16px 8px", borderBottom: "1px solid rgba(0,0,0,0.07)", position: "sticky", top: 0, zIndex: 100, backdropFilter: "blur(32px) saturate(1.5)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div className="bebas" style={{ fontSize: 20, color: "var(--yellow)", letterSpacing: 2 }}>FIT<span style={{ color: "var(--white)" }}>RACE</span></div>
                <div style={{ width: 1, height: 14, background: "rgba(0,0,0,0.08)" }} />
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <div className="bebas" style={{ fontSize: 14, color: meta.color, letterSpacing: 1, lineHeight: 1 }}>{meta.label.toUpperCase()}</div>
                  <div style={{ fontSize: 9, color: "#555", textTransform: "capitalize", lineHeight: 1.2, marginTop: 1 }}>{dayLabel} {dateLabel}</div>
                </div>
              </div>
              <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                {streak > 0 && (
                  <div style={{ display: "flex", alignItems: "center", gap: 3, background: "rgba(0,0,0,0.04)", border: "1px solid rgba(0,0,0,0.07)", borderRadius: 20, padding: "3px 9px" }}>
                    <span className="bebas" style={{ fontSize: 13, color: "#888" }}>{streak}j</span>
                  </div>
                )}
                {days !== null && tab !== "race" && (
                  <div onClick={() => setTab("race")} style={{ background: "rgba(0,0,0,0.04)", border: "1px solid rgba(0,0,0,0.07)", borderRadius: 10, padding: "3px 9px", textAlign: "center", cursor: "pointer" }}>
                    <div className="bebas" style={{ fontSize: 18, color: "var(--white)", lineHeight: 1 }}>{days}</div>
                    <div style={{ fontSize: 7, color: "#555", letterSpacing: "0.06em" }}>jours</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })()}

      <div key={tab} className={tabDir >= 0 ? "tab-slide-right" : "tab-slide-left"} style={{ padding: "20px 16px", maxWidth: 480, margin: "0 auto" }}>

        {/* HOME — toujours rendu, caché si inactif (fix hooks) */}
        <div style={{display: tab === "home" ? "block" : "none"}}>

            {/* ── GREETING PREMIUM ── */}
            {(() => {
              const h = new Date().getHours();
              const greet = h < 6 ? "Bonne nuit" : h < 12 ? "Bonjour" : h < 18 ? "Bon après-midi" : "Bonsoir";
              const firstName = profile.name?.split(" ")[0] || profile.name;
              const sc = calcFitnessScore(profile);
              const today = new Date().toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" });
              return (
                <div style={{ paddingBottom: 14, borderBottom: "1px solid rgba(0,0,0,0.04)", marginBottom: 16 }}>
                  <div style={{ fontSize: 12, color: "#777", marginBottom: 4 }}>{today.charAt(0).toUpperCase() + today.slice(1)}</div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <div style={{ fontSize: 22, fontWeight: 800, color: "var(--white)", lineHeight: 1.1 }}>
                        {greet}, <span style={{ color: "var(--yellow)" }}>{firstName}</span>
                      </div>
                      <div style={{ fontSize: 11, color: "#777", marginTop: 4 }}>
                        {(profile.sessions||[]).length === 0
                          ? "Bienvenue sur FitRace — commence ta première séance !"
                          : streak >= 7 ? `${streak} jours de streak — continue comme ça !`
                          : streak >= 3 ? `${streak} jours consécutifs — belle régularité`
                          : `${(profile.sessions||[]).length} séances au total`}
                      </div>
                    </div>
                    {/* Mini fitness score badge */}
                    <div style={{ textAlign: "center", background: "rgba(0,0,0,0.03)", border: "1px solid rgba(0,0,0,0.07)", borderRadius: 14, padding: "8px 14px" }}>
                      <div className="bebas number-pop" style={{ fontSize: 32, color: "var(--white)", lineHeight: 1 }}>{sc.global}</div>
                      <div style={{ fontSize: 8, color: "#777", textTransform: "uppercase", letterSpacing: "0.1em" }}>Score</div>
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* ── CHECK-IN RAPIDE 10 SECONDES ── */}
            {(() => {
              const checkedIn = dailyData.fatigue > 0 || dailyData.sommeil > 0;
              if (checkedIn) return null; // Already done
              const hour = new Date().getHours();
              if (hour < 5 || hour > 22) return null; // Don't show at night
              return (
                <div style={{ background: "rgba(0,0,0,0.02)", border: "1px solid rgba(0,0,0,0.07)", borderRadius: 18, padding: "16px 16px", marginBottom: 12 }}>
                  <div style={{ fontSize: 12, color: "#555", fontWeight: 600, marginBottom: 12 }}>Comment tu te sens aujourd'hui ?</div>
                  <div style={{ display: "flex", gap: 6, marginBottom: 10 }}>
                    {[
                      { v: 1, emoji: "😴", label: "Épuisé" },
                      { v: 2, emoji: "😐", label: "Moyen" },
                      { v: 3, emoji: "😊", label: "Bien" },
                      { v: 4, emoji: "🔥", label: "En forme" },
                    ].map(f => (
                      <button key={f.v} onClick={() => {
                        haptic([8, 20, 8]);
                        setDailyData(d => ({ ...d, fatigue: f.v }));
                        showToast(`${f.emoji} Noté ! Continue → onglet Séance`, "success", 2500);
                      }} style={{
                        flex: 1, padding: "10px 4px", borderRadius: 12, border: "1px solid rgba(0,0,0,0.06)", background: "rgba(0,0,0,0.02)", cursor: "pointer", transition: "all 0.15s var(--spring)",
                      }}>
                        <div style={{ fontSize: 24, marginBottom: 3 }}>{f.emoji}</div>
                        <div style={{ fontSize: 9, color: "#555", fontWeight: 600 }}>{f.label}</div>
                      </button>
                    ))}
                  </div>
                  <div style={{ fontSize: 10, color: "#555", textAlign: "center" }}>
                    Aide ton coach IA à adapter ta séance
                  </div>
                </div>
              );
            })()}

            {/* ── XP LEVEL BAR ── */}
            {(() => {
              const totalXP = calcTotalXP(profile);
              const lvl = getXPLevel(totalXP);
              return (
                <div style={{ background: "rgba(0,0,0,0.02)", border: "1px solid rgba(0,0,0,0.07)", borderRadius: 18, padding: "12px 16px", marginBottom: 12 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
                    <div style={{ width: 38, height: 38, borderRadius: 11, background: "rgba(0,122,255,0.08)", border: "1px solid rgba(0,122,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>
                      {lvl.icon}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div style={{ display: "flex", alignItems: "baseline", gap: 5 }}>
                          <span className="bebas" style={{ fontSize: 18, color: "var(--yellow)", letterSpacing: 0.5, lineHeight: 1 }}>{lvl.name}</span>
                          <span style={{ fontSize: 9, color: "#555", fontWeight: 600 }}>Niv. {lvl.level}</span>
                        </div>
                        <div style={{ display: "flex", alignItems: "baseline", gap: 3 }}>
                          <span className="bebas" style={{ fontSize: 20, color: "var(--white)", lineHeight: 1 }}>{totalXP.toLocaleString()}</span>
                          <span style={{ fontSize: 9, color: "#555" }}>XP</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div style={{ height: 5, background: "rgba(0,0,0,0.06)", borderRadius: 99, overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${lvl.progress}%`, background: "linear-gradient(90deg, rgba(0,122,255,0.7), var(--yellow))", borderRadius: 99, transition: "width 1s var(--ease-out)", boxShadow: lvl.progress > 0 ? "0 0 8px rgba(0,122,255,0.4)" : "none" }} />
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
                    <span style={{ fontSize: 9, color: "#555" }}>{Math.round(lvl.progress)}% vers {lvl.nextName || "Max"}</span>
                    <span style={{ fontSize: 9, color: "#555" }}>{lvl.xpToNext > 0 ? `encore ${lvl.xpToNext} XP` : "Niveau max !"}</span>
                  </div>
                </div>
              );
            })()}

            {/* ── HYROX 101 BEGINNER CARD (shows for new users) ── */}
            {(profile.sessions||[]).length < 3 && <Hyrox101Card profile={profile} navigateTo={navigateTo} />}

            {/* ══════════════════════════════════════════
                COMMAND CENTER — PRO ATHLETE DASHBOARD
                ══════════════════════════════════════════ */}
            {(() => {
              const recovery = calcRecoveryScore(dailyData, profile);
              const recov = recoveryLabel(recovery);
              const todayNutrKey = `nutri_${profile.name}_${todayStr}`;
              const [todayMacros, setTodayMacros] = React.useState(null);
              const [last7Logs, setLast7Logs] = React.useState([]);

              React.useEffect(() => {
                // Load nutrition today
                storage.get(todayNutrKey).then(repas => {
                  if (repas && repas.length) {
                    const tot = repas.reduce((a, r) => ({ kcal: a.kcal + (r.kcal||0), p: a.p + (r.p||0) }), { kcal: 0, p: 0 });
                    setTodayMacros(tot);
                  }
                });
                // Load last 7 daily logs
                const loads = [];
                for (let i = 6; i >= 0; i--) {
                  const d = new Date(); d.setDate(d.getDate() - i);
                  const ds = d.toISOString().split("T")[0];
                  loads.push(storage.get(getDailyLogKey(profile.name, ds)).then(v => ({ date: ds, ...(v || {}) })));
                }
                Promise.all(loads).then(setLast7Logs);
              }, []);

              // SVG ring params
              const r = 52; const circ = 2 * Math.PI * r;
              const stroke = circ * (1 - recovery / 100);
              const objNutrKcal = Math.round((profile.poids || 75) * 35);
              const kcalPct = todayMacros ? Math.min(100, Math.round((todayMacros.kcal / objNutrKcal) * 100)) : null;
              const protObj = Math.round((profile.poids || 75) * 2.2);
              const protPct = todayMacros ? Math.min(100, Math.round((todayMacros.p / protObj) * 100)) : null;

              // Weekly training load
              const weekAgo = new Date(); weekAgo.setDate(weekAgo.getDate() - 7);
              const weekSessions = (profile.sessions||[]).filter(s => new Date(s.date) >= weekAgo);
              const weekLoadPct = Math.min(100, Math.round((weekSessions.length / (profile.seancesParSemaine || 4)) * 100));

              return (
                <div style={{ marginBottom: 14 }}>
                  {/* Recovery Score Hero */}
                  <div style={{ background: "rgba(0,0,0,0.02)", border: "1px solid rgba(0,0,0,0.07)", borderRadius: 22, padding: "18px 18px 16px", marginBottom: 10 }}>

                    <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
                      {/* SVG Ring */}
                      <div style={{ position: "relative", flexShrink: 0 }}>
                        <svg width="120" height="120" style={{ transform: "rotate(-90deg)" }}>
                          <circle cx="60" cy="60" r={r} fill="none" stroke="rgba(0,0,0,0.05)" strokeWidth="9" />
                          <circle cx="60" cy="60" r={r} fill="none" stroke={recov.color} strokeWidth="9"
                            strokeDasharray={circ} strokeDashoffset={stroke}
                            strokeLinecap="round" style={{ transition: "stroke-dashoffset 1s var(--ease-out)" }} />
                        </svg>
                        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                          <div className="bebas" style={{ fontSize: 30, color: recov.color, lineHeight: 1 }}>{recovery}</div>
                          <div style={{ fontSize: 8, color: "#777", textTransform: "uppercase", letterSpacing: "0.1em" }}>/ 100</div>
                        </div>
                      </div>

                      {/* Recovery details */}
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 9, color: "#777", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 3 }}>Récupération</div>
                        <div className="bebas" style={{ fontSize: 24, color: recov.color, letterSpacing: 1, lineHeight: 1, marginBottom: 4 }}>{recov.label}</div>
                        <div style={{ fontSize: 11, color: "#666", lineHeight: 1.5, marginBottom: 10 }}>{recov.tip}</div>

                        {/* Mini metrics */}
                        <div style={{ display: "flex", gap: 8 }}>
                          {[
                            { val: `${dailyData.sleepHours}h`, label: "Sommeil", ok: dailyData.sleepHours >= 7 },
                            { val: ["","Épuisé","Moyen","Bien","Frais"][dailyData.fatigue||3], label: "Énergie", ok: dailyData.fatigue >= 3 },
                            { val: `${dailyData.hydration}/8`, label: "Eau", ok: dailyData.hydration >= 6 },
                            ...(dailyData.hrv ? [{ val: `${dailyData.hrv}`, label: "VFC", ok: parseInt(dailyData.hrv) >= 55 }] : []),
                          ].map(m => (
                            <div key={m.label} style={{ flex: 1, background: "rgba(0,0,0,0.02)", border: "1px solid rgba(0,0,0,0.06)", borderRadius: 10, padding: "6px 4px", textAlign: "center" }}>
                              <div style={{ fontSize: 11, fontWeight: 600, color: m.ok ? "var(--white)" : "#444", marginTop: 1 }}>{m.val}</div>
                              <div style={{ fontSize: 8, color: "#555", marginTop: 2 }}>{m.label}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Nutrition progress bar */}
                    {kcalPct !== null && (
                      <div style={{ marginTop: 12, paddingTop: 10, borderTop: "1px solid rgba(0,0,0,0.05)" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                          <span style={{ fontSize: 10, color: "#777", fontWeight: 600 }}>Nutrition aujourd'hui</span>
                          <span style={{ fontSize: 10, color: kcalPct >= 80 ? "var(--green)" : "var(--orange)", fontWeight: 700 }}>{todayMacros.kcal} / {objNutrKcal} kcal</span>
                        </div>
                        <div style={{ height: 5, background: "rgba(0,0,0,0.05)", borderRadius: 99, overflow: "hidden", marginBottom: 6 }}>
                          <div style={{ height: "100%", width: `${kcalPct}%`, background: `linear-gradient(90deg, var(--orange), var(--yellow))`, borderRadius: 99, transition: "width 0.6s var(--ease-out)" }} />
                        </div>
                        <div style={{ display: "flex", gap: 10 }}>
                          <span style={{ fontSize: 10, color: "#555" }}>{todayMacros.p}g protéines ({protPct}%)</span>
                          <button onClick={() => setTab("nutri")} style={{ background: "none", border: "none", fontSize: 10, color: "var(--yellow)", cursor: "pointer", marginLeft: "auto", fontWeight: 700 }}>Log nutrition →</button>
                        </div>
                      </div>
                    )}
                    {kcalPct === null && (
                      <div style={{ marginTop: 10, paddingTop: 10, borderTop: "1px solid rgba(0,0,0,0.04)" }}>
                        <button onClick={() => setTab("nutri")} style={{ width: "100%", background: "rgba(255,154,60,0.06)", border: "1px dashed rgba(255,154,60,0.2)", borderRadius: 10, padding: "8px", fontSize: 11, color: "#555", cursor: "pointer", fontWeight: 600 }}>
                          Ajouter tes repas du jour →
                        </button>
                      </div>
                    )}
                  </div>

                  {/* ── 7-DAY METRICS SPARKLINES ── */}
                  {last7Logs.some(l => l.sleepHours || l.poidsJour) && (() => {
                    const days = ["L","M","M","J","V","S","D"];
                    const weekSeries = last7Logs.map(l => ({
                      sleep: parseFloat(l.sleepHours) || null,
                      weight: parseFloat(l.poidsJour) || null,
                      recovery: (l.fatigue && l.sleepHours) ? calcRecoveryScore(l, profile) : null,
                    }));

                    const renderSparkline = (values, color, minVal, maxVal) => {
                      const valid = values.filter(Boolean);
                      if (valid.length < 2) return null;
                      const W = 100; const H = 28; const pad = 4;
                      const range = (maxVal - minVal) || 1;
                      const pts = values.map((v, i) => {
                        const x = pad + (i / (values.length - 1)) * (W - 2 * pad);
                        const y = v !== null ? H - pad - ((v - minVal) / range) * (H - 2 * pad) : null;
                        return { x, y, v };
                      }).filter(p => p.y !== null);
                      if (pts.length < 2) return null;
                      const d = pts.map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ");
                      const lastPt = pts[pts.length - 1];
                      return (
                        <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ overflow: "visible" }}>
                          <path d={d} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" />
                          <circle cx={lastPt.x} cy={lastPt.y} r="3" fill={color} />
                        </svg>
                      );
                    };

                    return (
                      <div style={{ borderTop: "1px solid rgba(0,0,0,0.05)", paddingTop: 14, marginBottom: 10 }}>
                        <div style={{ fontSize: 10, color: "#777", fontWeight: 600, marginBottom: 12 }}>Tendances 7 jours</div>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
                          {[
                            { label: "Sommeil", values: weekSeries.map(d => d.sleep), color: "#a78bfa", unit: "h", min: 4, max: 10, fmt: v => `${v}h` },
                            { label: "Poids", values: weekSeries.map(d => d.weight), color: "var(--yellow)", unit: "kg", min: (profile.poids||70)-5, max: (profile.poids||70)+5, fmt: v => `${v}kg` },
                            { label: "Récupération", values: weekSeries.map(d => d.recovery), color: "var(--green)", unit: "", min: 0, max: 100, fmt: v => `${v}%` },
                          ].map(serie => {
                            const valid = serie.values.filter(Boolean);
                            const last = valid[valid.length - 1];
                            const sparkline = renderSparkline(serie.values, serie.color, serie.min, serie.max);
                            return (
                              <div key={serie.label} style={{ background: "rgba(0,0,0,0.02)", borderRadius: 12, padding: "10px 10px 8px" }}>
                                <div style={{ fontSize: 9, color: "#555", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 4 }}>{serie.label}</div>
                                <div style={{ fontSize: 14, fontWeight: 700, color: serie.color, marginBottom: 4 }}>{last ? serie.fmt(last) : "—"}</div>
                                <div style={{ height: 28 }}>{sparkline || <div style={{ height: 28, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, color: "#222" }}>pas de données</div>}</div>
                              </div>
                            );
                          })}
                        </div>
                        {/* Day labels */}
                        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6, paddingLeft: 2, paddingRight: 2 }}>
                          {last7Logs.map((l, i) => {
                            const d = new Date(l.date + "T12:00:00");
                            const dow = d.getDay();
                            const labels = ["D","L","M","M","J","V","S"];
                            const isToday = l.date === todayStr;
                            return <div key={i} style={{ flex: 1, textAlign: "center", fontSize: 8, color: isToday ? "var(--yellow)" : "#222", fontWeight: isToday ? 700 : 400 }}>{labels[dow]}</div>;
                          })}
                        </div>
                      </div>
                    );
                  })()}

                  {/* ── CHARGE D'ENTRAÎNEMENT ── */}
                  {/* PMC TSB badge */}
                  {(()=>{
                    const pmcPts = calcPMC(profile.sessions||[]);
                    if (pmcPts.length < 3) return null;
                    const todayPMC = pmcPts[pmcPts.length-1];
                    const tsb2 = tsbLabel(todayPMC.tsb);
                    return (
                      <div style={{ background: `${tsb2.color}08`, border: `1px solid ${tsb2.color}25`, borderRadius: 14, padding: "10px 14px", marginBottom: 8, display: "flex", alignItems: "center", gap: 12 }}>
                        <div style={{ textAlign: "center", flexShrink: 0 }}>
                          <div style={{ fontSize: 9, color: "#555", textTransform: "uppercase", letterSpacing: "0.06em" }}>Forme</div>
                          <div className="bebas" style={{ fontSize: 24, color: tsb2.color, lineHeight: 1 }}>{todayPMC.tsb > 0 ? "+" : ""}{todayPMC.tsb}</div>
                        </div>
                        <div style={{ width: 1, height: 32, background: "rgba(0,0,0,0.06)", flexShrink: 0 }} />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 11, color: tsb2.color, fontWeight: 700 }}>{tsb2.label}</div>
                          <div style={{ fontSize: 9, color: "#555", marginTop: 2, lineHeight: 1.4 }}>{tsb2.tip}</div>
                        </div>
                        <div style={{ textAlign: "right", flexShrink: 0 }}>
                          <div style={{ fontSize: 8, color: "#555", textTransform: "uppercase" }}>Fitness</div>
                          <div style={{ fontSize: 13, fontWeight: 700, color: "var(--green)" }}>{todayPMC.ctl}</div>
                          <div style={{ fontSize: 8, color: "#555", textTransform: "uppercase", marginTop: 2 }}>Fatigue</div>
                          <div style={{ fontSize: 13, fontWeight: 700, color: "var(--orange)" }}>{todayPMC.atl}</div>
                        </div>
                      </div>
                    );
                  })()}

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 10 }}>
                    {/* Volume semaine */}
                    <div style={{ background: "rgba(0,122,255,0.04)", border: "1px solid rgba(0,122,255,0.12)", borderRadius: 14, padding: "12px 14px" }}>
                      <div style={{ fontSize: 9, color: "#555", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 4 }}>Charge semaine</div>
                      <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginBottom: 6 }}>
                        <span className="bebas" style={{ fontSize: 26, color: "var(--yellow)", lineHeight: 1 }}>{weekSessions.length}</span>
                        <span style={{ fontSize: 10, color: "#777" }}>/ {profile.seancesParSemaine || 4} séances</span>
                      </div>
                      <div style={{ height: 4, background: "rgba(0,0,0,0.05)", borderRadius: 99, overflow: "hidden" }}>
                        <div style={{ height: "100%", width: `${weekLoadPct}%`, background: weekLoadPct >= 100 ? "var(--green)" : "var(--yellow)", borderRadius: 99, transition: "width 0.5s" }} />
                      </div>
                    </div>
                    {/* Streak */}
                    <div style={{ background: streak >= 7 ? "rgba(255,154,60,0.06)" : "rgba(0,0,0,0.02)", border: `1px solid ${streak >= 7 ? "rgba(255,154,60,0.2)" : "rgba(0,0,0,0.06)"}`, borderRadius: 14, padding: "12px 14px" }}>
                      <div style={{ fontSize: 9, color: "#555", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 4 }}>Streak consécutif</div>
                      <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginBottom: 2 }}>
                        <span style={{ fontSize: 18 }}>{streak >= 14 ? "🏆" : streak >= 7 ? "🔥" : streak >= 3 ? "⚡" : "📅"}</span>
                        <span className="bebas" style={{ fontSize: 26, color: streak >= 7 ? "var(--orange)" : "var(--yellow)", lineHeight: 1 }}>{streak}</span>
                        <span style={{ fontSize: 10, color: "#777" }}>jours</span>
                      </div>
                      <div style={{ fontSize: 10, color: "#555" }}>Record : {profile.bestStreak || streak} j</div>
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* Message IA Modal */}
            {showMessageModal && messageIA && (
              <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.88)", zIndex: 400, display: "flex", alignItems: "flex-end" }}
                onClick={() => setShowMessageModal(false)}>
                <div className="slide-up" onClick={e => e.stopPropagation()}
                  style={{ background: "var(--bg2)", borderRadius: "20px 20px 0 0", padding: 28, width: "100%", maxWidth: 480, margin: "0 auto", border: "1px solid rgba(0,122,255,0.2)" }}>
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
                force_stations: { label: "Force Stations", icon: "🏋️", color: "var(--yellow)", bg: "linear-gradient(135deg, rgba(0,122,255,0.06) 0%, rgba(0,0,0,0) 60%)", border: "rgba(0,122,255,0.2)" },
                running_qualite: { label: "Running Qualité", icon: "⚡", color: "var(--orange)", bg: "linear-gradient(135deg, rgba(255,154,60,0.07) 0%, rgba(0,0,0,0) 60%)", border: "rgba(255,154,60,0.2)" },
                hybride_compromis: { label: "Hybride HYROX", icon: "🔀", color: "var(--purple)", bg: "linear-gradient(135deg, rgba(167,139,250,0.07) 0%, rgba(0,0,0,0) 60%)", border: "rgba(167,139,250,0.2)" },
              };
              const conf = typeConf[todaySession.type] || { label: "Séance", icon: "💪", color: "var(--yellow)", bg: "linear-gradient(135deg, rgba(0,122,255,0.06) 0%, rgba(0,0,0,0) 60%)", border: "rgba(0,122,255,0.15)" };
              const exs = todaySession.exercices || [];
              return (
                <div className="card-hover" style={{ background: "rgba(0,0,0,0.02)", border: "1px solid rgba(0,0,0,0.07)", borderRadius: 20, padding: "18px 18px 16px", marginBottom: 16, position: "relative" }}
                  onClick={() => setTab("today")}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 5 }}>
                        <div style={{ fontSize: 10, color: "#777", fontWeight: 600 }}>Séance du jour</div>
                      </div>
                      <div className="bebas" style={{ fontSize: 22, color: "var(--white)", lineHeight: 1.15 }}>{todaySession.titre}</div>
                    </div>
                    <div style={{ background: "rgba(0,0,0,0.08)", borderRadius: 10, padding: "8px 14px", flexShrink: 0, marginLeft: 10 }}>
                      <div className="bebas" style={{ fontSize: 16, color: "var(--white)", lineHeight: 1 }}>START</div>
                    </div>
                  </div>
                  {/* Exercices clés */}
                  {exs.length > 0 && (
                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                      {exs.slice(0, 3).map((ex, i) => (
                        <div key={i} style={{ background: "rgba(0,0,0,0.04)", border: "1px solid rgba(0,0,0,0.06)", borderRadius: 8, padding: "4px 10px", fontSize: 11, color: "#888" }}>
                          {ex.nom}
                        </div>
                      ))}
                      {exs.length > 3 && <div style={{ background: "rgba(0,0,0,0.03)", borderRadius: 8, padding: "4px 10px", fontSize: 11, color: "#777" }}>+{exs.length - 3}</div>}
                    </div>
                  )}
                  {todaySession.duree && (
                    <div style={{ marginTop: 10, fontSize: 11, color: "#777" }}>⏱ {todaySession.duree} min · {conf.label}</div>
                  )}
                </div>
              );
            })()}

            {/* ── MÉTÉO D'ENTRAÎNEMENT ── */}
            {(() => {
              const hour = new Date().getHours();
              const weekSessions = buildWeeklySummary(profile);
              const lastSession = (profile.sessions||[]).slice(-1)[0];
              const lastRPE = lastSession?.difficulte || 5;
              const daysSinceLastSession = lastSession ? Math.round((Date.now() - new Date(lastSession.date)) / 86400000) : 99;

              // Calcul conditions
              const isOptimalHour = (hour >= 7 && hour <= 10) || (hour >= 16 && hour <= 20);
              const isRested = daysSinceLastSession >= 1;
              const isOverloaded = weekSessions.count >= 5 || weekSessions.dur >= 3;
              const needsRecovery = lastRPE >= 9 && daysSinceLastSession < 1;

              const meteo = needsRecovery ? {
                icon: "🌧️", label: "Récupération recommandée", color: "var(--red)",
                bg: "rgba(255,71,71,0.04)", border: "rgba(255,71,71,0.15)",
                detail: `RPE ${lastRPE}/10 hier · Laisse tes muscles récupérer`,
                cta: "Mobilité ou repos actif",
              } : isOverloaded ? {
                icon: "⚡", label: "Charge élevée cette semaine", color: "var(--orange)",
                bg: "rgba(255,154,60,0.04)", border: "rgba(255,154,60,0.15)",
                detail: `${weekSessions.count} séances · ${weekSessions.dur} dures`,
                cta: "Séance légère ou repos",
              } : !isRested ? {
                icon: "🌤️", label: "Journée de transition", color: "var(--yellow)",
                bg: "rgba(0,122,255,0.04)", border: "rgba(0,122,255,0.12)",
                detail: "Séance hier · Corps en récupération",
                cta: "Zone 2 ou technique",
              } : isOptimalHour ? {
                icon: "☀️", label: "Conditions optimales", color: "var(--green)",
                bg: "rgba(57,255,128,0.05)", border: "rgba(57,255,128,0.2)",
                detail: `${hour < 12 ? "Matin" : "Soir"} · Intensité max autorisée`,
                cta: "Lance ta séance maintenant !",
              } : {
                icon: "🌙", label: "Bonne heure pour s'entraîner", color: "#a78bfa",
                bg: "rgba(167,139,250,0.04)", border: "rgba(167,139,250,0.15)",
                detail: "Évite les séances trop intenses tard le soir",
                cta: "Yoga, mobilité ou Zone 2",
              };

              return (
                <div style={{ background: "rgba(0,0,0,0.02)", border: "1px solid rgba(0,0,0,0.06)", borderRadius: 14, padding: "12px 16px", marginBottom: 10, display: "flex", alignItems: "center", gap: 14 }} onClick={() => setTab("today")} className="card-hover">
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: "var(--white)", marginBottom: 2 }}>{meteo.label}</div>
                    <div style={{ fontSize: 11, color: "#777" }}>{meteo.detail} · {meteo.cta}</div>
                  </div>
                  <div style={{ fontSize: 11, color: "#2a2a2a" }}>{new Date().toLocaleTimeString("fr-FR",{hour:"2-digit",minute:"2-digit"})}</div>
                </div>
              );
            })()}

            {/* ── COMPLÉTION PROFIL ── */}
            {(() => {
              const checks = [
                { key: "poids", label: "Poids corporel", done: !!profile.poids, tab: "profil", icon: "⚖️" },
                { key: "vma", label: "VMA renseignée", done: !!profile.vmaKmh, tab: "profil", icon: "🏃" },
                { key: "race", label: "Date de course", done: !!profile.raceDate, tab: "profil", icon: "🏁" },
                { key: "squat", label: "Force (squat 1RM)", done: !!profile.squat1RM_final, tab: "profil", icon: "🏋️" },
                { key: "genre", label: "Sexe renseigné", done: !!profile.genre, tab: "profil", icon: "👤" },
                { key: "session1", label: "1ère séance faite", done: (profile.sessions||[]).length >= 1, tab: "today", icon: "⚡" },
              ];
              const doneCount = checks.filter(c => c.done).length;
              const pct = Math.round((doneCount / checks.length) * 100);
              if (pct === 100) return null; // Profil complet, on n'affiche pas
              const missing = checks.filter(c => !c.done);
              return (
                <div style={{ background: "rgba(0,0,0,0.02)", border: "1px solid rgba(0,0,0,0.07)", borderRadius: 16, padding: "14px 16px", marginBottom: 10 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                    <div>
                      <div style={{ fontSize: 12, color: "var(--white)", fontWeight: 600 }}>Profil</div>
                      <div style={{ fontSize: 11, color: "#777", marginTop: 2 }}>Plus de données = meilleur coaching</div>
                    </div>
                    <div className="bebas" style={{ fontSize: 28, color: "var(--white)" }}>{pct}%</div>
                  </div>
                  {/* Barre */}
                  <div style={{ height: 5, background: "rgba(0,0,0,0.05)", borderRadius: 99, overflow: "hidden", marginBottom: 10 }}>
                    <div style={{ height: "100%", width: `${pct}%`, background: pct >= 80 ? "var(--green)" : pct >= 50 ? "var(--yellow)" : "var(--orange)", borderRadius: 99, transition: "width 0.6s" }} />
                  </div>
                  {/* Actions manquantes */}
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {missing.slice(0,3).map(c => (
                      <button key={c.key} onClick={() => navigateTo(c.tab)} style={{ display: "flex", alignItems: "center", gap: 5, padding: "5px 10px", background: "rgba(0,0,0,0.03)", border: "1px solid rgba(0,0,0,0.08)", borderRadius: 20, fontSize: 11, color: "#555", cursor: "pointer" }}>
                        <span>{c.icon}</span><span>{c.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              );
            })()}

            {/* STREAK CARD */}
            {streakData && (() => {
              const streakColor = streak >= 14 ? "#ff6b35" : streak >= 7 ? "var(--yellow)" : streak >= 3 ? "var(--orange)" : "#333";
              const streakBg = streak >= 14 ? "linear-gradient(135deg, #1a0800 0%, #080808 60%)" : streak >= 7 ? "linear-gradient(135deg, #131500 0%, #080808 60%)" : streak >= 3 ? "linear-gradient(135deg, #120800 0%, #080808 60%)" : "rgba(255,255,255,0.01)";
              const streakBorder = streak >= 7 ? `${streakColor}44` : "rgba(0,0,0,0.05)";
              const milestones = [3, 7, 14, 30];
              const nextMilestone = milestones.find(m => m > streak) || 30;
              const prevMilestone = milestones.filter(m => m <= streak).pop() || 0;
              const milestoneProgress = ((streak - prevMilestone) / (nextMilestone - prevMilestone)) * 100;
              return (
              <div style={{ background: "rgba(0,0,0,0.02)", border: "1px solid rgba(0,0,0,0.07)", borderRadius: 18, padding: "16px 18px", marginBottom: 10 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
                  <div>
                    <div className="bebas" style={{ fontSize: 40, color: "var(--white)", lineHeight: 1, letterSpacing: 1 }}>{streak}<span style={{ fontSize: 16, color: "#777", letterSpacing: 0, marginLeft: 6 }}>jours</span></div>
                    <div style={{ fontSize: 11, color: "#777", marginTop: 3 }}>
                      {streak === 0 ? "Lance ta série aujourd'hui !" : streak === 1 ? "Jour 1 — la séquence commence !" : `Série active · record ${streakData.best}j`}
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: 9, color: "#2a2a2a", marginBottom: 2 }}>Record</div>
                    <div className="bebas" style={{ fontSize: 26, color: "#777", lineHeight: 1 }}>{streakData.best}</div>
                  </div>
                </div>
                {/* 7-day visual */}
                <div style={{ display: "flex", gap: 5, marginBottom: streak > 0 ? 12 : 0 }}>
                  {(streakData.lastDays || []).map((d, i) => {
                    const dayLabel = ["L","M","M","J","V","S","D"][d.date.getDay() === 0 ? 6 : d.date.getDay() - 1];
                    return (
                      <div key={i} style={{ flex: 1, textAlign: "center" }}>
                        <div style={{ fontSize: 9, color: d.isToday ? streakColor : "#2a2a2a", marginBottom: 5, fontWeight: d.isToday ? 700 : 400, textTransform: "uppercase" }}>{dayLabel}</div>
                        <div style={{ width: "100%", aspectRatio: "1", borderRadius: 8, background: d.done ? (d.isToday ? streakColor : `${streakColor}55`) : "rgba(0,0,0,0.03)", border: d.isToday ? `2px solid ${streakColor}` : "1px solid rgba(0,0,0,0.04)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, color: d.done ? "#000" : "#111", fontWeight: 700 }}>
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
                      <span style={{ fontSize: 10, color: "#555", textTransform: "uppercase", letterSpacing: "0.08em" }}>Prochain objectif</span>
                      <span style={{ fontSize: 10, color: streakColor, fontWeight: 700 }}>{nextMilestone} jours</span>
                    </div>
                    <div style={{ height: 4, background: "rgba(0,0,0,0.04)", borderRadius: 99, overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${milestoneProgress}%`, background: streakColor, borderRadius: 99, transition: "width 0.6s ease" }} />
                    </div>
                  </div>
                )}
              </div>
              );
            })()}

            {/* ── NIVEAU HYROX ── */}
            {(() => {
              const nbSessions = (profile.sessions||[]).length;
              const sc = calcFitnessScore(profile);
              const hasPR = !!(profile.squat1RM_final || profile.vmaKmh || profile.deadlift1RM_final);
              const hasRace = !!(profile.raceDate);
              const hasPlanning = !!(profile.planningWeek || profile.lastSimulation);
              const techViewed = (() => { try { return Object.keys(JSON.parse(localStorage.getItem("fitrace_technique_viewed")||"{}")).length; } catch { return 0; } })();
              // XP calculation
              let xp = 0;
              xp += nbSessions * 50;
              xp += streak * 30;
              xp += sc.global * 2;
              if (hasPR) xp += 100;
              if (hasRace) xp += 80;
              if (hasPlanning) xp += 60;
              xp += techViewed * 20;
              xp += (profile.adaptations||[]).length * 40;

              const LEVELS = [
                { min: 0,    max: 200,  name: "Rookie",     icon: "🥉", color: "#cd7f32", gradient: "linear-gradient(135deg,#2a1800,#080808)" },
                { min: 200,  max: 500,  name: "Challenger", icon: "🥈", color: "#adb5bd", gradient: "linear-gradient(135deg,#141414,#080808)" },
                { min: 500,  max: 1000, name: "Compétiteur",icon: "🥇", color: "#007AFF", gradient: "linear-gradient(135deg,#131500,#080808)" },
                { min: 1000, max: 2000, name: "Athlète",    icon: "⚡", color: "#ff9a3c", gradient: "linear-gradient(135deg,#120800,#080808)" },
                { min: 2000, max: 4000, name: "Pro",        icon: "🔥", color: "#ff4747", gradient: "linear-gradient(135deg,#1a0000,#080808)" },
                { min: 4000, max: 9999, name: "ÉLITE",      icon: "🏆", color: "#a78bfa", gradient: "linear-gradient(135deg,#120020,#080808)" },
              ];
              const lvl = LEVELS.slice().reverse().find(l => xp >= l.min) || LEVELS[0];
              const nextLvl = LEVELS[LEVELS.indexOf(lvl) + 1];
              const progressPct = nextLvl ? Math.min(100, Math.round(((xp - lvl.min) / (nextLvl.min - lvl.min)) * 100)) : 100;
              const xpToNext = nextLvl ? nextLvl.min - xp : 0;

              return (
                <div style={{ background: lvl.gradient, border: `1.5px solid ${lvl.color}33`, borderRadius: 18, padding: "16px 18px", marginBottom: 10, position: "relative", overflow: "hidden" }}>
                  {/* Glow */}
                  <div style={{ position: "absolute", top: -40, right: -40, width: 150, height: 150, borderRadius: "50%", background: `radial-gradient(circle, ${lvl.color}12 0%, transparent 70%)`, pointerEvents: "none" }} />
                  <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 14 }}>
                    {/* Badge icon */}
                    <div style={{ width: 56, height: 56, borderRadius: 16, background: `${lvl.color}18`, border: `2px solid ${lvl.color}44`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, flexShrink: 0, boxShadow: `0 0 20px ${lvl.color}20` }}>
                      {lvl.icon}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 9, color: "#777", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 2 }}>Niveau HYROX</div>
                      <div className="bebas" style={{ fontSize: 28, color: lvl.color, lineHeight: 1, letterSpacing: 1 }}>{lvl.name}</div>
                      <div style={{ fontSize: 11, color: "#555", marginTop: 1 }}>{xp} XP{nextLvl ? ` · encore ${xpToNext} XP` : " · niveau max !"}</div>
                    </div>
                    {/* XP badge */}
                    <div style={{ textAlign: "center", background: "rgba(0,0,0,0.3)", borderRadius: 12, padding: "8px 12px", minWidth: 52 }}>
                      <div style={{ fontSize: 9, color: "#555", textTransform: "uppercase", marginBottom: 2 }}>XP</div>
                      <div className="bebas" style={{ fontSize: 22, color: lvl.color, lineHeight: 1 }}>{xp}</div>
                    </div>
                  </div>
                  {/* Progress bar */}
                  {nextLvl && (
                    <div>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                        <span style={{ fontSize: 10, color: "#555", textTransform: "uppercase", letterSpacing: "0.08em" }}>→ {nextLvl.name}</span>
                        <span style={{ fontSize: 10, color: lvl.color, fontWeight: 700 }}>{progressPct}%</span>
                      </div>
                      <div style={{ height: 5, background: "rgba(0,0,0,0.04)", borderRadius: 99, overflow: "hidden", position: "relative" }}>
                        <div style={{ height: "100%", width: `${progressPct}%`, background: `linear-gradient(90deg, ${lvl.color}aa, ${lvl.color})`, borderRadius: 99, transition: "width 0.8s ease", position: "relative" }}>
                          <div style={{ position: "absolute", right: 0, top: -2, width: 9, height: 9, borderRadius: "50%", background: lvl.color, boxShadow: `0 0 8px ${lvl.color}` }} />
                        </div>
                      </div>
                      {/* XP hints */}
                      <div style={{ display: "flex", gap: 8, marginTop: 8, flexWrap: "wrap" }}>
                        {!hasPR && <span style={{ fontSize: 9, color: "#555", background: "rgba(0,0,0,0.03)", borderRadius: 6, padding: "3px 7px" }}>+100 XP : ajouter un PR</span>}
                        {!hasRace && <span style={{ fontSize: 9, color: "#555", background: "rgba(0,0,0,0.03)", borderRadius: 6, padding: "3px 7px" }}>+80 XP : fixer une race</span>}
                        {nbSessions < 5 && <span style={{ fontSize: 9, color: "#555", background: "rgba(0,0,0,0.03)", borderRadius: 6, padding: "3px 7px" }}>+50 XP par séance</span>}
                      </div>
                    </div>
                  )}
                </div>
              );
            })()}

            {/* ── TABLEAU DE BORD PRs ── */}
            {(profile.vmaKmh || profile.squat1RM_final || profile.deadlift1RM_final) && (() => {
              const prs = [
                profile.vmaKmh      && { icon: "🏃", label: "VMA",      value: `${profile.vmaKmh} km/h`,         sub: `Allure Z2 : ${paceFromVMA ? (() => { try { return paceFromVMA(profile.vmaKmh, 72); } catch { return "—"; } })() : "—"}/km`, color: "var(--green)",  bg: "rgba(57,255,128,0.06)",  border: "rgba(57,255,128,0.15)"  },
                profile.squat1RM_final && { icon: "🏋️", label: "Squat 1RM",  value: `${profile.squat1RM_final} kg`, sub: `Ratio : ${Math.round(profile.squat1RM_final / (profile.poids||75) * 10) / 10}× poids corps`, color: "var(--orange)", bg: "rgba(255,154,60,0.06)", border: "rgba(255,154,60,0.15)" },
                profile.deadlift1RM_final && { icon: "💀", label: "Deadlift 1RM", value: `${profile.deadlift1RM_final} kg`, sub: `Ratio : ${Math.round(profile.deadlift1RM_final / (profile.poids||75) * 10) / 10}× poids corps`, color: "var(--red)",    bg: "rgba(255,71,71,0.06)",   border: "rgba(255,71,71,0.15)"   },
              ].filter(Boolean);
              if (prs.length === 0) return null;
              return (
                <div style={{ marginBottom: 10 }}>
                  <div style={{ fontSize: 10, color: "#555", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 8 }}>🏅 Tes records personnels</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                    {prs.map((pr, i) => (
                      <div key={i} style={{ background: pr.bg, border: `1px solid ${pr.border}`, borderRadius: 14, padding: "12px 14px", display: "flex", alignItems: "center", gap: 12 }}>
                        <div style={{ fontSize: 24, flexShrink: 0 }}>{pr.icon}</div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 10, color: "#777", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 2 }}>{pr.label}</div>
                          <div className="bebas" style={{ fontSize: 22, color: pr.color, lineHeight: 1 }}>{pr.value}</div>
                          <div style={{ fontSize: 10, color: "#777", marginTop: 3 }}>{pr.sub}</div>
                        </div>
                        <div style={{ background: `${pr.color}18`, border: `1px solid ${pr.color}30`, borderRadius: 8, padding: "4px 8px", textAlign: "center", flexShrink: 0 }}>
                          <div style={{ fontSize: 8, color: pr.color, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em" }}>PR</div>
                        </div>
                      </div>
                    ))}
                  </div>
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
                    <div style={{ fontSize: 12, color: "#777", fontStyle: "italic" }}>Ton coach prépare ton message du jour…</div>
                  ) : (
                    <div style={{ fontSize: 13, color: "#ccc", lineHeight: 1.5 }}>
                      {messageIA ? messageIA.text.slice(0, 80) + (messageIA.text.length > 80 ? "…" : "") : "Charge en cours…"}
                    </div>
                  )}
                </div>
                {!loadingMessage && <span style={{ color: "#555", fontSize: 16, flexShrink: 0 }}>→</span>}
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
                normal:  { label: "Bonne forme",       emoji: "💪", color: "var(--yellow)", bg: "rgba(0,122,255,0.04)",  border: "rgba(0,122,255,0.15)",  msg: "Continue sur ta lancée." },
                charge:  { label: "Charge élevée",     emoji: "⚠️", color: "var(--orange)", bg: "rgba(255,154,60,0.05)",  border: "rgba(255,154,60,0.18)",  msg: "Pense à la récup active." },
                fatigue: { label: "Récupération",      emoji: "😴", color: "var(--red)",    bg: "rgba(255,71,71,0.05)",   border: "rgba(255,71,71,0.18)",   msg: "Zone 2 ou repos conseillé." },
              }[forme];
              return (
                <div style={{ background: formeConf.bg, border: `1px solid ${formeConf.border}`, borderRadius: 14, padding: "12px 16px", marginBottom: 10, display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ fontSize: 26, flexShrink: 0 }}>{formeConf.emoji}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 3 }}>
                      <div style={{ fontSize: 12, fontWeight: 700, color: formeConf.color }}>{formeConf.label}</div>
                      <div style={{ fontSize: 10, color: "#555" }}>Sur {last3.length} séances</div>
                    </div>
                    <div style={{ fontSize: 11, color: "#555" }}>{formeConf.msg}</div>
                  </div>
                  <div style={{ textAlign: "right", flexShrink: 0 }}>
                    <div className="bebas" style={{ fontSize: 22, color: formeConf.color, lineHeight: 1 }}>RPE {avgRPE}</div>
                    <div style={{ fontSize: 10, color: "#555" }}>⚡{avgEnergie}/5</div>
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
                <div className="float-up" style={{ background: "linear-gradient(145deg, #0f1200 0%, #080808 50%, #001208 100%)", border: "1.5px solid rgba(0,122,255,0.12)", borderRadius: 24, padding: "22px 20px 18px", marginBottom: 12, position: "relative", overflow: "hidden" }}>
                  {/* Halo */}
                  <div style={{ position: "absolute", top: -60, left: "50%", transform: "translateX(-50%)", width: 300, height: 200, background: "radial-gradient(ellipse, rgba(0,122,255,0.07) 0%, transparent 70%)", pointerEvents: "none" }} />

                  {/* Top row: name + share */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
                    <div>
                      <div style={{ fontSize: 11, color: "#777", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 4 }}>Bonjour 👋</div>
                      <div className="bebas" style={{ fontSize: 34, color: "var(--white)", letterSpacing: 1, lineHeight: 1 }}>{profile.name.toUpperCase()}</div>
                      <div style={{ fontSize: 11, color: "#777", marginTop: 4 }}>{LEVELS[(profile.level || 1) - 1]?.label} · S{cw}/{tw || "?"}</div>
                    </div>
                    <button onClick={() => setShowShareCard(true)} style={{ background: "rgba(0,122,255,0.08)", border: "1px solid rgba(0,122,255,0.2)", borderRadius: 10, padding: "8px 12px", color: "var(--yellow)", fontSize: 12, fontWeight: 700, display: "flex", alignItems: "center", gap: 6 }}>
                      📤 Partager
                    </button>
                  </div>

                  {/* Score ring + stats */}
                  <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
                    {/* SVG Ring */}
                    <div style={{ position: "relative", flexShrink: 0 }}>
                      <svg width="140" height="140" viewBox="0 0 140 140">
                        {/* bg ring */}
                        <circle cx="70" cy="70" r={r} fill="none" stroke="rgba(0,0,0,0.05)" strokeWidth="10" />
                        {/* colored ring */}
                        <circle cx="70" cy="70" r={r} fill="none"
                          stroke={sc.global >= 75 ? "#39ff80" : sc.global >= 50 ? "#007AFF" : "#ff9a3c"}
                          strokeWidth="10" strokeLinecap="round"
                          strokeDasharray={circ} strokeDashoffset={offset}
                          transform="rotate(-90 70 70)"
                          style={{ transition: "stroke-dashoffset 1s ease, stroke 0.5s" }}
                        />
                        {/* inner glow ring */}
                        <circle cx="70" cy="70" r={r} fill="none"
                          stroke={sc.global >= 75 ? "rgba(57,255,128,0.15)" : sc.global >= 50 ? "rgba(0,122,255,0.15)" : "rgba(255,154,60,0.15)"}
                          strokeWidth="18" strokeLinecap="round"
                          strokeDasharray={circ} strokeDashoffset={offset}
                          transform="rotate(-90 70 70)"
                        />
                        {/* Score text */}
                        <text x="70" y="62" textAnchor="middle" fontFamily="'Bebas Neue',sans-serif" fontSize="42" fill={sc.global >= 75 ? "#39ff80" : sc.global >= 50 ? "#007AFF" : "#ff9a3c"}>{sc.global}</text>
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
                            <span className="bebas" style={{ fontSize: 16, color: b.color, lineHeight: 1 }}>{b.val}<span style={{ fontSize: 10, color: "#555" }}>%</span></span>
                          </div>
                          <div style={{ background: "rgba(0,0,0,0.04)", borderRadius: 99, height: 6, overflow: "hidden" }}>
                            <div style={{ width: `${b.val}%`, height: "100%", background: `linear-gradient(90deg, ${b.color}88, ${b.color})`, borderRadius: 99, transition: "width 0.8s ease" }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Programme week bar */}
                  {tw > 0 && (
                    <div style={{ marginTop: 16, paddingTop: 14, borderTop: "1px solid rgba(0,0,0,0.04)" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                        <span style={{ fontSize: 10, color: "#777", textTransform: "uppercase", letterSpacing: "0.1em" }}>Progression programme</span>
                        <span className="bebas" style={{ fontSize: 13, color: "var(--yellow)" }}>S{cw} / {tw}</span>
                      </div>
                      <div style={{ display: "flex", gap: 2 }}>
                        {Array.from({ length: Math.min(tw, 20) }, (_, i) => {
                          const ratio = tw / Math.min(tw, 20);
                          const w = Math.floor(i * ratio) + 1;
                          const isPast = cw > Math.floor((i + 1) * ratio);
                          const isActive = !isPast && cw >= w;
                          return <div key={i} style={{ flex: 1, height: 5, borderRadius: 99, background: isPast ? "var(--yellow)" : isActive ? "rgba(0,122,255,0.5)" : "rgba(0,0,0,0.05)", border: isActive ? "1px solid rgba(0,122,255,0.6)" : "none" }} />;
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            })()}

            {/* ── ESTIMATEUR TEMPS HYROX ── */}
            {(profile.vmaKmh || profile.squat1RM_final) && (() => {
              // Estimation basée sur: VMA → temps running, Force → temps stations
              const vma = parseFloat(profile.vmaKmh) || 12;
              const squat = parseFloat(profile.squat1RM_final) || 80;
              const poids = parseFloat(profile.poids) || 75;
              const genre = profile.genre || "H";
              // Running: 8km à une allure fonction de la VMA (% VMA)
              const runPctVma = genre === "F" ? 0.72 : 0.70;
              const runSpeedKmh = vma * runPctVma;
              const runMins = (8 / runSpeedKmh) * 60;
              // Stations: base selon ratio force/poids (plus c'est élevé, plus vite)
              const forceRatio = squat / poids;
              const stationsBase = genre === "F" ? 32 : 28; // minutes
              const stationsBonus = Math.min(6, Math.max(0, (forceRatio - 0.8) * 5));
              const stationsMins = Math.max(20, stationsBase - stationsBonus);
              const totalMins = runMins + stationsMins + 4; // 4 min transitions
              const h = Math.floor(totalMins / 60);
              const m = Math.round(totalMins % 60);
              const timeStr = `${h}h${String(m).padStart(2,"0")}`;
              // Catégorie
              const cat = totalMins < 70 ? { label: "Élite", color: "#ff4747" }
                : totalMins < 85 ? { label: "Pro", color: "#ff9a3c" }
                : totalMins < 100 ? { label: "Semi-Pro", color: "var(--yellow)" }
                : totalMins < 120 ? { label: "Amateur+", color: "var(--green)" }
                : { label: "Finisher", color: "#a78bfa" };
              const hasGoal = profile.goalTargetLevel;
              return (
                <div onClick={() => navigateTo("race")} style={{ background: "rgba(0,0,0,0.02)", border: "1px solid rgba(0,0,0,0.06)", borderRadius: 14, padding: "14px 16px", marginBottom: 10, cursor: "pointer", display: "flex", alignItems: "center", gap: 16 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 10, color: "#777", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 4 }}>⏱ Temps HYROX estimé</div>
                    <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                      <div className="bebas" style={{ fontSize: 36, color: cat.color, lineHeight: 1 }}>{timeStr}</div>
                      <div style={{ background: `${cat.color}18`, border: `1px solid ${cat.color}33`, borderRadius: 20, padding: "3px 10px", fontSize: 10, color: cat.color, fontWeight: 700 }}>{cat.label}</div>
                    </div>
                    {hasGoal && (
                      <div style={{ fontSize: 10, color: "#777", marginTop: 4 }}>
                        Objectif : {profile.goalTargetLevel} · {totalMins < (profile.goalTargetLevel.replace("Sub ","").includes("h") ? parseInt(profile.goalTargetLevel.replace("Sub ",""))*60 : 999) ? "🎯 Dans les clous !" : "💪 À améliorer"}
                      </div>
                    )}
                    <div style={{ fontSize: 9, color: "#2a2a2a", marginTop: 3 }}>Basé sur VMA {vma}km/h · Squat {squat}kg</div>
                  </div>
                  <div style={{ color: "#555", fontSize: 16, flexShrink: 0 }}>→</div>
                </div>
              );
            })()}

            {/* Séance coach dispo */}
            {coachSession && (
              <div onClick={() => setTab("today")} className="card-hover" style={{ background: "linear-gradient(135deg, rgba(0,122,255,0.08) 0%, rgba(0,122,255,0.03) 100%)", border: "1.5px solid rgba(0,122,255,0.25)", borderRadius: 16, padding: "14px 16px", marginBottom: 10, cursor: "pointer", display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: "var(--yellow)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>📋</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 10, color: "var(--yellow)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 3 }}>Séance du coach disponible</div>
                  <div style={{ fontSize: 14, color: "var(--white)", fontWeight: 700 }}>{coachSession.titre}</div>
                </div>
                <span className="bebas" style={{ color: "var(--yellow)", fontSize: 20 }}>→</span>
              </div>
            )}

            {/* CTA séance — GRAND BOUTON */}
            <button onClick={() => { haptic([10]); navigateTo("today"); }} style={{ width: "100%", background: "var(--yellow)", border: "none", borderRadius: 18, padding: "18px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer", marginBottom: 12, position: "relative", overflow: "hidden", boxShadow: "0 4px 20px rgba(0,122,255,0.25)" }}>
              {/* Shine effect */}
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(105deg, transparent 30%, rgba(0,0,0,0.12) 50%, transparent 70%)", pointerEvents: "none" }} />
              <div style={{ position: "absolute", right: 60, top: -20, width: 100, height: 100, borderRadius: "50%", background: "rgba(0,0,0,0.06)", pointerEvents: "none" }} />
              <div style={{ textAlign: "left" }}>
                <div style={{ fontSize: 10, color: "rgba(0,0,0,0.5)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 4 }}>⚡ Coach IA · Aujourd'hui</div>
                <div className="bebas" style={{ fontSize: 26, color: "#080808", letterSpacing: 1, lineHeight: 1 }}>MA SÉANCE DU JOUR</div>
              </div>
              <div style={{ width: 46, height: 46, borderRadius: "50%", background: "rgba(0,0,0,0.15)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <span className="bebas" style={{ fontSize: 22, color: "#080808" }}>→</span>
              </div>
            </button>

            {/* ── RECAP SEMAINE ── */}
            {buildWeeklySummary(profile).count > 0 && <WeeklySummaryCard profile={profile} />}

            {/* Historique — scroll horizontal */}
            {(profile.sessions || []).length > 0 && <SessionHistoryCard profile={profile} haptic={haptic} navigateTo={navigateTo} />}

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

            {/* ── DÉFI DE LA SEMAINE ── */}
            {(() => {
              const DEFIS = [
                { icon: "⛷️", station: "SkiErg", challenge: "100 coups en 2 min", tip: "Focus sur la synchronisation hanches + bras. Maintiens un rythme constant.", color: "#a78bfa", xp: 80 },
                { icon: "🤸", station: "Burpee BJ", challenge: "10 reps en moins d'1 min", tip: "Explose sur le saut, atterris en douceur et enchaîne sans pause.", color: "var(--red)", xp: 100 },
                { icon: "🚣", station: "Rowing", challenge: "500m sous 2:00 min/500m", tip: "Jambes complètes avant de tirer les bras. Drive explosif, retour lent.", color: "#38bdf8", xp: 90 },
                { icon: "🏋️", station: "Force", challenge: "3×10 squats à 60% du max", tip: "Descends sous le parallèle, genoux dans l'axe, montée explosive.", color: "var(--yellow)", xp: 70 },
                { icon: "🧳", station: "Farmers Carry", challenge: "50m sans poser les kettlebells", tip: "Abdos actifs, pas réguliers, regarde loin devant toi.", color: "var(--green)", xp: 75 },
                { icon: "🏀", station: "Wall Balls", challenge: "21-15-9 reps sans pause", tip: "Balle sur les trapèzes, squat complet à chaque rep, souffle en remontant.", color: "var(--orange)", xp: 85 },
                { icon: "🛷", station: "Sled Push", challenge: "20m × 3 en moins de 45s", tip: "Corps à 45°, pousse du sol avec les jambes, pas avec le dos.", color: "#ff9a3c", xp: 95 },
                { icon: "🎒", station: "Sandbag", challenge: "20 lunges avec sac sur épaules", tip: "Sac bien haut, genou avant droit, genou arrière effleure le sol.", color: "var(--orange)", xp: 80 },
                { icon: "🏃", station: "Running", challenge: "10 min à allure HYROX cible", tip: "Rythme conversationnel, technique parfaite, bras décontractés.", color: "var(--green)", xp: 70 },
                { icon: "🧠", station: "Mental", challenge: "Visualiser ta race complète", tip: "5 min les yeux fermés : tu franchis chaque station, tu gères le souffle.", color: "#ec4899", xp: 60 },
                { icon: "🔗", station: "Sled Pull", challenge: "20m en marche arrière × 3", tip: "Dos droit, pas courts, tire avec les hanches pas les bras.", color: "var(--yellow)", xp: 85 },
                { icon: "💪", station: "Full Body", challenge: "5 rounds : 10 KB swings + 100m run", tip: "Donne tout sur le swing, récupère en courant à 70% d'intensité.", color: "var(--purple)", xp: 110 },
              ];
              // Semaine ISO
              const d = new Date(); d.setHours(0,0,0,0);
              const dayOfWeek = d.getDay() || 7;
              const monday = new Date(d); monday.setDate(d.getDate() - dayOfWeek + 1);
              const weekKey = `defi_${monday.toISOString().slice(0,10)}`;
              const defiIdx = Math.floor(monday.getTime() / (7 * 86400000)) % DEFIS.length;
              const defi = DEFIS[defiIdx];
              const [defiDone, setDefiDone] = React.useState(() => {
                try { return localStorage.getItem(weekKey) === "1"; } catch { return false; }
              });
              const daysLeft = 7 - dayOfWeek + 1;

              function complete() {
                try { localStorage.setItem(weekKey, "1"); } catch {}
                setDefiDone(true);
              }

              return (
                <div style={{ background: defiDone ? "rgba(57,255,128,0.04)" : `${defi.color}06`, border: `1.5px solid ${defiDone ? "rgba(57,255,128,0.25)" : `${defi.color}25`}`, borderRadius: 16, padding: "16px 16px", marginBottom: 10, position: "relative", overflow: "hidden" }}>
                  {/* Glow */}
                  <div style={{ position: "absolute", top: -30, right: -30, width: 120, height: 120, borderRadius: "50%", background: `radial-gradient(circle, ${defi.color}12 0%, transparent 70%)`, pointerEvents: "none" }} />
                  <div style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 12 }}>
                    <div style={{ width: 44, height: 44, borderRadius: 12, background: `${defi.color}15`, border: `1.5px solid ${defi.color}33`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>{defiDone ? "✅" : defi.icon}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div style={{ fontSize: 9, color: defiDone ? "var(--green)" : defi.color, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em" }}>{defiDone ? "✓ Défi accompli" : `Défi semaine · ${defi.station}`}</div>
                        <div style={{ fontSize: 9, color: "#555" }}>{defiDone ? `+${defi.xp} XP` : `${daysLeft}j restant${daysLeft>1?"s":""}`}</div>
                      </div>
                      <div style={{ fontSize: 15, fontWeight: 700, color: defiDone ? "var(--green)" : "var(--white)", marginTop: 4, lineHeight: 1.2 }}>{defi.challenge}</div>
                      <div style={{ fontSize: 11, color: "#555", marginTop: 4, lineHeight: 1.4 }}>{defi.tip}</div>
                    </div>
                  </div>
                  {!defiDone ? (
                    <button onClick={complete} style={{ width: "100%", padding: "10px", background: `${defi.color}15`, border: `1px solid ${defi.color}33`, borderRadius: 10, fontSize: 13, fontWeight: 700, color: defi.color, cursor: "pointer" }}>
                      🏆 Je l'ai fait · +{defi.xp} XP
                    </button>
                  ) : (
                    <div style={{ textAlign: "center", fontSize: 12, color: "var(--green)", fontWeight: 700 }}>🎉 Excellent ! Nouveau défi lundi.</div>
                  )}
                </div>
              );
            })()}

            {/* ── SEMAINE 1 ROADMAP (beginners) ── */}
            {(profile.sessions||[]).length < 5 && (() => {
              const sessionsDone = (profile.sessions||[]).length;
              const ROADMAP = [
                { step: 1, icon: "👤", label: "Profil créé", desc: "Ton point de départ est défini", done: true },
                { step: 2, icon: "📋", label: "Check-in matinal", desc: "Dis-nous comment tu vas chaque matin", done: dailyData.fatigue > 0 },
                { step: 3, icon: "🏋️", label: "1ère séance", desc: "Lance ta première séance du coach IA", done: sessionsDone >= 1 },
                { step: 4, icon: "🍽️", label: "Log nutrition", desc: "Note ce que tu manges aujourd'hui", done: false },
                { step: 5, icon: "📊", label: "3 séances", desc: "Le graphique de progression s'active", done: sessionsDone >= 3 },
                { step: 6, icon: "🔥", label: "Streak 3 jours", desc: "3 check-ins consécutifs — l'habitude commence", done: (profile.streak||0) >= 3 },
              ];
              const doneCount = ROADMAP.filter(r => r.done).length;
              const nextStep = ROADMAP.find(r => !r.done);
              return (
                <div style={{ background: "rgba(255,255,255,0.015)", border: "1px solid rgba(0,0,0,0.07)", borderRadius: 18, padding: "14px 16px", marginBottom: 14 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                    <div style={{ fontSize: 10, color: "#777", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em" }}>🚀 Prise en main ({doneCount}/{ROADMAP.length})</div>
                    <div style={{ fontSize: 10, color: "#555" }}>{Math.round(doneCount/ROADMAP.length*100)}% complété</div>
                  </div>
                  <div style={{ height: 3, background: "rgba(0,0,0,0.04)", borderRadius: 99, overflow: "hidden", marginBottom: 12 }}>
                    <div style={{ height: "100%", width: `${Math.round(doneCount/ROADMAP.length*100)}%`, background: "var(--green)", borderRadius: 99, transition: "width 0.8s" }} />
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    {ROADMAP.map((r, i) => (
                      <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, opacity: r.done ? 1 : r === nextStep ? 1 : 0.4 }}>
                        <div style={{ width: 32, height: 32, borderRadius: 10, background: r.done ? "rgba(57,255,128,0.12)" : r === nextStep ? "rgba(0,122,255,0.1)" : "rgba(0,0,0,0.02)", border: `1.5px solid ${r.done ? "rgba(57,255,128,0.4)" : r === nextStep ? "rgba(0,122,255,0.3)" : "rgba(0,0,0,0.06)"}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, flexShrink: 0 }}>
                          {r.done ? "✅" : r.icon}
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 11, fontWeight: r === nextStep ? 700 : 600, color: r.done ? "var(--green)" : r === nextStep ? "var(--yellow)" : "#555" }}>{r.label}</div>
                          <div style={{ fontSize: 9, color: "#777" }}>{r.desc}</div>
                        </div>
                        {r === nextStep && <div style={{ fontSize: 10, color: "var(--yellow)", fontWeight: 700 }}>← NEXT</div>}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })()}

            {/* ── BADGES SHOWCASE ── */}
            {(() => {
              const earnedBadges = BADGES.filter(b => b.check(profile));
              const unearned = BADGES.filter(b => !b.check(profile));
              if (earnedBadges.length === 0 && unearned.length === 0) return null;
              return (
                <div style={{ background: "rgba(255,255,255,0.015)", border: "1px solid rgba(0,0,0,0.06)", borderRadius: 18, padding: "14px 16px", marginBottom: 14 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                    <div style={{ fontSize: 10, color: "#777", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em" }}>🏅 Badges ({earnedBadges.length}/{BADGES.length})</div>
                    <div style={{ fontSize: 10, color: "#555" }}>{BADGES.length - earnedBadges.length} à débloquer</div>
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {BADGES.map(b => {
                      const earned = b.check(profile);
                      return (
                        <div key={b.id} title={b.desc} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3, width: 52, opacity: earned ? 1 : 0.3 }}>
                          <div style={{ width: 44, height: 44, borderRadius: 13, background: earned ? "rgba(0,122,255,0.1)" : "rgba(0,0,0,0.03)", border: `1.5px solid ${earned ? "rgba(0,122,255,0.3)" : "rgba(0,0,0,0.05)"}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, transition: "all 0.2s" }}>
                            {earned ? b.icon : "🔒"}
                          </div>
                          <div style={{ fontSize: 7, color: earned ? "#888" : "#333", textAlign: "center", lineHeight: 1.2, maxWidth: 52 }}>{b.name}</div>
                        </div>
                      );
                    })}
                  </div>
                  {earnedBadges.length > 0 && (
                    <div style={{ marginTop: 10, paddingTop: 8, borderTop: "1px solid rgba(0,0,0,0.04)", fontSize: 10, color: "#777" }}>
                      Dernier badge : <span style={{ color: "var(--yellow)", fontWeight: 700 }}>{earnedBadges[earnedBadges.length-1].icon} {earnedBadges[earnedBadges.length-1].name}</span>
                    </div>
                  )}
                </div>
              );
            })()}

            {/* Bouton Mon Profil */}
            <button onClick={() => setTab("profil")} className="card-hover" style={{ width: "100%", background: "rgba(0,0,0,0.02)", border: "1px solid rgba(0,0,0,0.07)", borderRadius: 14, padding: "14px 16px", display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 40, height: 40, borderRadius: 11, background: "linear-gradient(135deg, rgba(0,122,255,0.15), rgba(0,122,255,0.05))", border: "1px solid rgba(0,122,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>👤</div>
                <div style={{ textAlign: "left" }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: "var(--white)" }}>Mon profil</div>
                  <div style={{ fontSize: 11, color: "#777", marginTop: 1 }}>
                    {profile.tests && Object.keys(profile.tests).length > 0
                      ? `${Object.keys(profile.tests).filter(k => k !== "analyzed").length} tests complétés`
                      : "Batterie de tests à compléter"}
                  </div>
                </div>
              </div>
              <div style={{ color: "var(--yellow)", fontSize: 16 }}>→</div>
            </button>
          </div>

        {/* TODAY — toujours rendu */}
        <div style={{display: tab === "today" ? "block" : "none"}} className="fade-in">
            {/* Citation du jour */}
            <div style={{ borderBottom: "1px solid rgba(0,0,0,0.05)", paddingBottom: 14, marginBottom: 14 }}>
              <div style={{ fontSize: 13, color: "#555", lineHeight: 1.65, fontStyle: "italic" }}>"{getCitationDuJour()}"</div>
            </div>

            {/* ── BACKGROUND GENERATION INDICATOR ── */}
            {generatingSilently && !session && (
              <div className="fade-in" style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 12px", background: "rgba(0,122,255,0.04)", border: "1px solid rgba(0,122,255,0.1)", borderRadius: 12, marginBottom: 10 }}>
                <div style={{ display: "flex", gap: 3 }}>
                  {[0,1,2].map(j => <div key={j} style={{ width: 4, height: 4, borderRadius: "50%", background: "var(--yellow)", animation: `pulse 1s ${j*0.2}s ease infinite` }} />)}
                </div>
                <span style={{ fontSize: 11, color: "#555" }}>Ton coach IA prépare ta séance…</span>
              </div>
            )}

            {/* ── WEEKLY STRIP ── */}
            {(() => {
              const today = new Date();
              const todayStr2 = today.toISOString().split("T")[0];
              // Get Monday of current week
              const dow = today.getDay(); // 0=Sun
              const mondayOffset = dow === 0 ? -6 : 1 - dow;
              const monday = new Date(today);
              monday.setDate(today.getDate() + mondayOffset);

              const typeColors = {
                running_zone2: "var(--green)",
                force_stations: "var(--yellow)",
                running_qualite: "var(--orange)",
                hybride_compromis: "var(--purple)",
                coach: "var(--yellow)",
              };
              const typeIcons = {
                running_zone2: "🏃",
                force_stations: "🏋️",
                running_qualite: "⚡",
                hybride_compromis: "🔀",
                coach: "📋",
              };

              const days = ["L","M","M","J","V","S","D"];
              return (
                <div style={{ background: "rgba(0,0,0,0.02)", border: "1px solid rgba(0,0,0,0.05)", borderRadius: 18, padding: "14px 16px 12px", marginBottom: 14 }}>
                  <div style={{ fontSize: 9, color: "#777", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 12 }}>📅 Ma semaine</div>
                  <div style={{ display: "flex", gap: 4, justifyContent: "space-between" }}>
                    {days.map((dayLabel, i) => {
                      const d = new Date(monday);
                      d.setDate(monday.getDate() + i);
                      const ds = d.toISOString().split("T")[0];
                      const isToday = ds === todayStr2;
                      const isPast = ds < todayStr2;
                      const isFuture = ds > todayStr2;

                      // Find session done on this day
                      const doneSessions = (profile.sessions || []).filter(s => s.date === ds);
                      const doneSession = doneSessions[doneSessions.length - 1];

                      // Is this a planned training day according to profile plan?
                      // Simple heuristic: if sessions per week is 4, train M/Tu/Th/Sa (indices 0,1,3,5)
                      const spw = profile.seancesParSemaine || 4;
                      const planDays = spw >= 5 ? [0,1,2,3,4] : spw >= 4 ? [0,1,3,5] : spw >= 3 ? [0,2,4] : [0,2];
                      const isPlannedDay = planDays.includes(i);

                      const color = doneSession
                        ? (typeColors[doneSession.type] || "var(--yellow)")
                        : isToday
                        ? "var(--yellow)"
                        : "transparent";

                      const borderColor = doneSession
                        ? (typeColors[doneSession.type] || "var(--yellow)")
                        : isToday
                        ? "var(--yellow)"
                        : isPlannedDay && isFuture
                        ? "rgba(0,0,0,0.12)"
                        : "rgba(0,0,0,0.06)";

                      const borderStyle = isPlannedDay && isFuture && !doneSession ? "dashed" : "solid";

                      return (
                        <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 5 }}>
                          <div style={{ fontSize: 8, color: isToday ? "var(--yellow)" : "#333", fontWeight: isToday ? 700 : 400 }}>{dayLabel}</div>
                          <div style={{
                            width: 36, height: 36, borderRadius: "50%",
                            background: doneSession ? `${color}20` : isToday ? "rgba(0,122,255,0.08)" : "transparent",
                            border: `1.5px ${borderStyle} ${borderColor}`,
                            display: "flex", alignItems: "center", justifyContent: "center",
                            fontSize: doneSession ? 14 : 11,
                            position: "relative",
                            boxShadow: isToday ? "0 0 10px rgba(0,122,255,0.2)" : "none",
                          }}>
                            {doneSession
                              ? (typeIcons[doneSession.type] || "✓")
                              : isToday
                              ? (session ? (typeIcons[session.type] || "💪") : "•")
                              : isPlannedDay && isFuture
                              ? <span style={{ width: 5, height: 5, borderRadius: "50%", background: "rgba(0,0,0,0.1)", display: "block" }} />
                              : isPast && isPlannedDay
                              ? <span style={{ fontSize: 10, color: "var(--red)", opacity: 0.5 }}>×</span>
                              : null
                            }
                          </div>
                          {isToday && (
                            <div style={{ width: 4, height: 4, borderRadius: "50%", background: "var(--yellow)" }} />
                          )}
                        </div>
                      );
                    })}
                  </div>
                  {/* Legend */}
                  <div style={{ display: "flex", gap: 12, marginTop: 10, justifyContent: "center" }}>
                    {[
                      { color: "var(--green)", label: "Fait" },
                      { style: "dashed", color: "rgba(0,0,0,0.12)", label: "Planifié" },
                    ].map(l => (
                      <div key={l.label} style={{ display: "flex", alignItems: "center", gap: 5 }}>
                        <div style={{ width: 10, height: 10, borderRadius: "50%", border: `1.5px ${l.style || "solid"} ${l.color}`, background: l.bg || "transparent" }} />
                        <span style={{ fontSize: 9, color: "#555" }}>{l.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })()}

            {/* ── MISSION DU JOUR (beginner-friendly) ── */}
            {!session && (() => {
              const recovery = calcRecoveryScore(dailyData, profile);
              const sessionsThisWeek = (profile.sessions||[]).filter(s => { const w = new Date(); w.setDate(w.getDate()-7); return new Date(s.date) >= w; }).length;
              const target = profile.seancesParSemaine || 4;
              const isRestDay = recovery < 35 || sessionsThisWeek >= target;
              const hour = new Date().getHours();
              const greeting = hour < 12 ? "Bonjour" : hour < 18 ? "Bon après-midi" : "Bonsoir";

              if (isRestDay && recovery < 35) {
                // Active rest day
                return (
                  <div style={{ background: "rgba(0,0,0,0.02)", border: "1px solid rgba(0,0,0,0.07)", borderRadius: 18, padding: "18px 18px", marginBottom: 14 }}>
                    <div style={{ marginBottom: 12 }}>
                      <div style={{ fontSize: 10, color: "#555", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 4 }}>Récupération</div>
                      <div style={{ fontSize: 15, fontWeight: 700, color: "var(--white)" }}>{greeting}, {profile.name.split(" ")[0]} · Ton corps récupère</div>
                    </div>
                    <div style={{ fontSize: 12, color: "#555", lineHeight: 1.7, marginBottom: 14 }}>
                      Score récup {recovery}/100 — C'est pendant le repos que les muscles se renforcent.
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                      {[
                        { label: "Marche 20-30 min", desc: "Maintient la circulation sans fatiguer" },
                        { label: "10 min de mobilité", desc: "Hanches, épaules, dos — video dans Technique" },
                        { label: "Hydratation", desc: "Vise 8 verres — la récup dépend de l'eau" },
                        { label: "Protéines à chaque repas", desc: "2g/kg pour reconstruire les muscles" },
                      ].map((item, i) => (
                        <div key={i} style={{ display: "flex", gap: 10, alignItems: "center", padding: "8px 10px", background: "rgba(0,0,0,0.02)", borderRadius: 10 }}>
                          <div>
                            <div style={{ fontSize: 12, fontWeight: 600, color: "#ccc" }}>{item.label}</div>
                            <div style={{ fontSize: 10, color: "#555" }}>{item.desc}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              }

              // Active training day
              const typeIcon = { running_zone2: "🏃", force_stations: "🏋️", running_qualite: "⚡", hybride_compromis: "🔀" };
              const typeNames = { running_zone2: "Cardio Zone 2", force_stations: "Force & Stations", running_qualite: "Qualité / Vitesse", hybride_compromis: "Hybride" };
              const todayType = coachSession?.type || "force_stations";
              return (
                <div style={{ background: "rgba(0,0,0,0.02)", border: "1px solid rgba(0,0,0,0.07)", borderRadius: 18, padding: "18px 18px", marginBottom: 14 }}>
                  <div style={{ marginBottom: 12 }}>
                    <div style={{ fontSize: 10, color: "#555", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 4 }}>Aujourd'hui</div>
                    <div style={{ fontSize: 15, fontWeight: 700, color: "var(--white)" }}>{greeting}, {profile.name.split(" ")[0]}</div>
                  </div>
                  <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
                    <div style={{ flex: 1, background: "rgba(0,0,0,0.03)", borderRadius: 10, padding: "10px 12px", textAlign: "center" }}>
                      <div style={{ fontSize: 9, color: "#777", marginBottom: 2 }}>Type</div>
                      <div style={{ fontSize: 12, fontWeight: 600, color: "var(--white)" }}>{typeNames[todayType] || "Séance"}</div>
                    </div>
                    <div style={{ flex: 1, background: "rgba(0,0,0,0.03)", borderRadius: 10, padding: "10px 12px", textAlign: "center" }}>
                      <div style={{ fontSize: 9, color: "#777", marginBottom: 2 }}>Semaine</div>
                      <div style={{ fontSize: 12, fontWeight: 600, color: "var(--white)" }}>{sessionsThisWeek}/{target}</div>
                    </div>
                    <div style={{ flex: 1, background: "rgba(0,0,0,0.03)", borderRadius: 10, padding: "10px 12px", textAlign: "center" }}>
                      <div style={{ fontSize: 9, color: "#777", marginBottom: 2 }}>Récup</div>
                      <div style={{ fontSize: 12, fontWeight: 600, color: "var(--white)" }}>{recovery}/100</div>
                    </div>
                  </div>
                  <div style={{ fontSize: 11, color: "#555", lineHeight: 1.6 }}>
                    {recovery >= 70 ? "Forme excellente — tu peux pousser fort aujourd'hui." :
                     recovery >= 45 ? "Forme correcte — séance normale recommandée." :
                     "Fatigue modérée — écoute ton corps, adapte l'intensité."}
                  </div>
                </div>
              );
            })()}

            {/* Séance coach du jour */}
            {coachSession && !session && (
              <div style={{ marginBottom: 14 }}>
                <div style={{ fontSize: 11, color: "#555", textTransform: "uppercase", fontWeight: 700, letterSpacing: "0.08em", marginBottom: 10 }}>
                  Séance disponible aujourd'hui
                </div>
                <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
                  {/* Option séance du coach */}
                  <div style={{ flex: 1, background: "rgba(0,0,0,0.03)", border: "1px solid rgba(0,0,0,0.08)", borderRadius: 14, padding: "14px 14px 10px" }}>
                    <div style={{ fontSize: 10, color: "#555", fontWeight: 600, marginBottom: 6 }}>Du coach</div>
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
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, color: "#555", fontWeight: 700 }}>OU</div>
                  {/* Option IA */}
                  <div style={{ flex: 1, background: "rgba(0,0,0,0.02)", border: "1px solid rgba(0,0,0,0.07)", borderRadius: 14, padding: "14px 14px 10px" }}>
                    <div style={{ fontSize: 10, color: "#555", fontWeight: 600, marginBottom: 6 }}>Coach IA</div>
                    <div style={{ fontSize: 12, color: "#555", lineHeight: 1.5, marginBottom: 10 }}>Personnalisée selon ton profil et ta fatigue du jour</div>
                    <button onClick={generateSession} style={{ width: "100%", padding: "8px", background: "rgba(0,0,0,0.06)", border: "1px solid rgba(0,0,0,0.08)", borderRadius: 8, fontSize: 13, fontFamily: "'Bebas Neue',sans-serif", letterSpacing: 1, color: "var(--white)", cursor: "pointer" }}>
                      GÉNÉRER MA SÉANCE
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Check-in shortcut → Forme tab */}
            {(()=>{
              const recovery = calcRecoveryScore(dailyData, profile);
              const recov = recoveryLabel(recovery);
              return (
                <button onClick={() => setTab("forme")} style={{ width: "100%", marginBottom: 16, display: "flex", alignItems: "center", gap: 14, padding: "14px 16px", background: "rgba(0,0,0,0.02)", border: "1px solid rgba(0,0,0,0.07)", borderRadius: 16, cursor: "pointer", textAlign: "left" }}>
                  <div style={{ width: 44, height: 44, borderRadius: "50%", background: `${recov.color}15`, border: `2px solid ${recov.color}40`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <span style={{ fontSize: 18, fontWeight: 700, color: recov.color, fontFamily: "'Bebas Neue',sans-serif" }}>{recovery}</span>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "var(--white)" }}>Forme du jour</div>
                    <div style={{ fontSize: 11, color: "#555", marginTop: 2 }}>Fatigue · Sommeil · Hydratation · Nutrition</div>
                  </div>
                  <div style={{ fontSize: 16, color: "#555" }}>›</div>
                </button>
              );
            })()}

            {/* Type de séance */}
            {/* CTA Générer — visible immédiatement si pas de séance */}
            {!session && !loadingSession && dailyData.typeSeance !== "perso" && (
              <button onClick={generateSession} className="fade-in" style={{
                width: "100%", marginBottom: 14, padding: "16px", borderRadius: 16,
                background: "var(--yellow)", border: "none", cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
              }}>
                <span style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 18, letterSpacing: 1.5, color: "#000" }}>GÉNÉRER MA SÉANCE</span>
                <span style={{ fontSize: 18 }}>⚡</span>
              </button>
            )}

            <Section title="Ma séance">
              <Card>
                {/* Type de séance */}
                <div style={{ marginBottom: 16 }}>
                  <div style={{ fontSize: 11, color: "#777", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 10 }}>🎯 Type de séance</div>
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
                          background: active ? `${t.color}10` : "rgba(0,0,0,0.02)",
                          border: active ? `1.5px solid ${t.color}55` : "1px solid rgba(0,0,0,0.05)",
                          color: "var(--white)", cursor: "pointer", transition: "all 0.18s",
                        }}>
                          <div style={{ width: 38, height: 38, borderRadius: 10, background: active ? `${t.color}20` : "rgba(0,0,0,0.04)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>{t.icon}</div>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontSize: 13, fontWeight: 700, color: active ? t.color : "var(--white)" }}>{t.label}</div>
                            <div style={{ fontSize: 11, color: "#777", marginTop: 1 }}>{t.sub}</div>
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
                    <div style={{ background: "var(--bg2)", border: "1.5px solid rgba(0,122,255,0.25)", borderRadius: 14, padding: 18 }}>
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
              ) : null
            )}
            {loadingSession && (
              <div className="fade-in">
                {/* Premium loading card */}
                <div style={{ background: "linear-gradient(135deg, rgba(0,122,255,0.04) 0%, rgba(8,8,8,0) 60%)", border: "1px solid rgba(0,122,255,0.1)", borderRadius: 22, padding: "22px 18px", marginBottom: 14, position: "relative", overflow: "hidden" }}>
                  {/* Animated glow */}
                  <div style={{ position: "absolute", top: -20, right: -20, width: 120, height: 120, borderRadius: "50%", background: "radial-gradient(circle, rgba(0,122,255,0.08) 0%, transparent 70%)", animation: "pulse 2s ease infinite" }} />
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                    <div style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(0,122,255,0.1)", border: "1px solid rgba(0,122,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", animation: "pulse 1.5s ease infinite" }}>
                      <span style={{ fontSize: 18 }}>🤖</span>
                    </div>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: "var(--yellow)" }}>Coach IA en action</div>
                      <div style={{ fontSize: 10, color: "#555" }}>Analyse de ton profil...</div>
                    </div>
                  </div>
                  {/* Steps */}
                  {[
                    { icon: "🎯", text: "Analyse fatigue & récup.", done: true },
                    { icon: "📊", text: "Calcul charge optimale", done: true },
                    { icon: "⚡", text: "Génération de la séance", done: false },
                  ].map((step, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8, opacity: step.done ? 1 : 0.5 }}>
                      <div style={{ width: 22, height: 22, borderRadius: "50%", background: step.done ? "rgba(57,255,128,0.15)" : "rgba(0,0,0,0.04)", border: `1px solid ${step.done ? "rgba(57,255,128,0.4)" : "rgba(0,0,0,0.08)"}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, flexShrink: 0 }}>
                        {step.done ? "✓" : step.icon}
                      </div>
                      <span style={{ fontSize: 12, color: step.done ? "#888" : "#444", textDecoration: step.done ? "none" : "none" }}>{step.text}</span>
                      {!step.done && <div style={{ marginLeft: "auto", display: "flex", gap: 3 }}>
                        {[0,1,2].map(j => <div key={j} style={{ width: 4, height: 4, borderRadius: "50%", background: "var(--yellow)", animation: `pulse 1s ${j*0.2}s ease infinite` }} />)}
                      </div>}
                    </div>
                  ))}
                </div>
                {/* Skeleton exercices */}
                {[0,1,2,3].map(i => (
                  <div key={i} className="skeleton-card" style={{ height: 72, marginBottom: 8, opacity: 1 - i * 0.18 }} />
                ))}
                {/* Status text */}
                <div style={{ textAlign: "center", padding: "10px 0", color: "#555", fontSize: 11, fontStyle: "italic" }}>
                  {sessionStreamText || "Personnalisation en cours..."}
                </div>
              </div>
            )}

            {session && !showFeedback && !feedback && (() => {
              const typeConf0 = {
                running_zone2: { label: "Running Zone 2", color: "var(--green)", icon: "🏃" },
                force_stations: { label: "Force Stations", color: "var(--yellow)", icon: "🏋️" },
                running_qualite: { label: "Running Qualité", color: "var(--orange)", icon: "⚡" },
                hybride_compromis: { label: "Hybride HYROX", color: "var(--purple)", icon: "🔀" },
                perso: { label: "Séance Perso", color: "#888", icon: "✏️" },
              };
              const c0 = typeConf0[session.type] || { label: "Séance", color: "var(--yellow)", icon: "💪" };
              const doneCount0 = Object.values(checkedExercices).filter(Boolean).length;
              const totalEx0 = (session.exercices || []).length;
              return (
                <div className="slide-up" onClick={() => setShowSessionModal(true)} style={{ background: "var(--bg2)", border: `1.5px solid ${c0.color}25`, borderRadius: 20, overflow: "hidden", marginBottom: 14, cursor: "pointer", boxShadow: "var(--shadow-md)" }}>
                  {/* Barre colorée en haut */}
                  <div style={{ height: 4, background: `linear-gradient(90deg, ${c0.color}, ${c0.color}88)` }} />
                  <div style={{ padding: "16px 18px 14px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                    <div style={{ width: 34, height: 34, borderRadius: 10, background: `${c0.color}15`, border: `1px solid ${c0.color}30`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17, flexShrink: 0 }}>{c0.icon}</div>
                    <div>
                      <div style={{ fontSize: 10, color: c0.color, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.1em" }}>{c0.label}</div>
                      <div style={{ fontSize: 10, color: "var(--gray)", marginTop: 1 }}>⏱ {session.duree} min · {(session.exercices||[]).filter(ex=>ex?.nom).length} exercices</div>
                    </div>
                    <div style={{ marginLeft: "auto", background: "var(--yellow)", borderRadius: 10, padding: "6px 14px" }}>
                      <span style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 13, letterSpacing: 1, color: "#fff" }}>VOIR ›</span>
                    </div>
                  </div>
                  <div className="bebas" style={{ fontSize: 24, color: "var(--white)", lineHeight: 1.1, marginBottom: 5 }}>{session.titre}</div>
                  <div style={{ fontSize: 12, color: "var(--gray)", lineHeight: 1.5, marginBottom: 10 }}>{session.explication?.slice(0, 90)}{(session.explication?.length || 0) > 90 ? "…" : ""}</div>
                  {/* Mini exercice chips */}
                  {(session.exercices || []).length > 0 && (
                    <div style={{ display: "flex", gap: 5, flexWrap: "wrap", marginBottom: 6 }}>
                      {(session.exercices || []).filter(ex => ex?.nom).slice(0, 4).map((ex, ei) => (
                        <div key={ei} style={{ background: `${c0.color}10`, border: `1px solid ${c0.color}25`, borderRadius: 20, padding: "3px 10px", fontSize: 10, color: c0.color, fontWeight: 600, whiteSpace: "nowrap" }}>
                          {ex.nom?.length > 16 ? ex.nom.slice(0, 16) + "…" : ex.nom}
                          {ex.series && ex.reps ? <span style={{ opacity: 0.7, marginLeft: 3 }}>{ex.series}×{ex.reps}</span> : null}
                        </div>
                      ))}
                      {(session.exercices || []).length > 4 && (
                        <div style={{ background: "rgba(0,0,0,0.04)", border: "1px solid rgba(0,0,0,0.07)", borderRadius: 20, padding: "3px 9px", fontSize: 10, color: "var(--gray)" }}>
                          +{(session.exercices || []).length - 4}
                        </div>
                      )}
                    </div>
                  )}
                  {/* Progress si déjà commencé */}
                  {doneCount0 > 0 && (
                    <div style={{ marginBottom: 10 }}>
                      <div style={{ height: 4, background: "rgba(0,0,0,0.06)", borderRadius: 99, overflow: "hidden" }}>
                        <div style={{ height: "100%", width: `${Math.round(doneCount0/totalEx0*100)}%`, background: "var(--green)", borderRadius: 99, transition: "width 0.4s" }} />
                      </div>
                      <div style={{ fontSize: 10, color: "var(--green)", marginTop: 4 }}>{doneCount0}/{totalEx0} exercices faits</div>
                    </div>
                  )}
                  </div>
                </div>
              );
            })()}

            {/* ── MODAL SÉANCE ── */}
            {showSessionModal && session && !showFeedback && !feedback && (
              <div style={{ position: "fixed", inset: 0, zIndex: 500, background: "rgba(0,0,0,0.85)", display: "flex", alignItems: "flex-end" }}
                onClick={e => { if (e.target === e.currentTarget) setShowSessionModal(false); }}>
                <div className="slide-up" style={{ background: "var(--bg2)", borderRadius: "22px 22px 0 0", width: "100%", maxWidth: 480, margin: "0 auto", maxHeight: "92vh", overflowY: "auto", padding: "0 0 40px", boxShadow: "0 -8px 40px rgba(0,0,0,0.18)" }}
                  onClick={e => e.stopPropagation()}
                  onTouchStart={e => { e.currentTarget._ty = e.touches[0].clientY; }}
                  onTouchEnd={e => { const dy = e.changedTouches[0].clientY - (e.currentTarget._ty || 0); if (dy > 80) setShowSessionModal(false); }}>
                  {/* Handle bar + header */}
                  <div style={{ position: "sticky", top: 0, background: "var(--bg2)", zIndex: 10, padding: "14px 18px 12px", borderBottom: "1px solid rgba(0,0,0,0.07)" }}>
                    <div style={{ width: 40, height: 4, background: "rgba(0,0,0,0.2)", borderRadius: 99, margin: "0 auto 14px" }} />
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <div className="bebas" style={{ fontSize: 22, color: "var(--white)", letterSpacing: 0.5 }}>{session.titre}</div>
                      <button onClick={() => setShowSessionModal(false)} style={{ background: "rgba(0,0,0,0.06)", border: "none", borderRadius: 8, width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center", color: "#888", fontSize: 18, cursor: "pointer" }}>×</button>
                    </div>
                  </div>
                  {/* ── MINI REST TIMER ── */}
                  {miniRestTimer && (
                    <div className="slide-up" style={{ margin: "0 18px 0", padding: "12px 16px", background: miniRestTimer.secs <= 10 ? "rgba(255,71,71,0.12)" : "rgba(167,139,250,0.12)", border: `1.5px solid ${miniRestTimer.secs <= 10 ? "rgba(255,71,71,0.4)" : "rgba(167,139,250,0.4)"}`, borderRadius: 14, display: "flex", alignItems: "center", gap: 12 }}>
                      {/* Arc progress */}
                      <div style={{ position: "relative", flexShrink: 0 }}>
                        <svg width="48" height="48" style={{ transform: "rotate(-90deg)" }}>
                          <circle cx="24" cy="24" r="20" fill="none" stroke="rgba(0,0,0,0.06)" strokeWidth="4" />
                          <circle cx="24" cy="24" r="20" fill="none"
                            stroke={miniRestTimer.secs <= 10 ? "var(--red)" : "#a78bfa"}
                            strokeWidth="4"
                            strokeDasharray={`${2 * Math.PI * 20}`}
                            strokeDashoffset={`${2 * Math.PI * 20 * (1 - miniRestTimer.secs / miniRestTimer.initial)}`}
                            strokeLinecap="round"
                            style={{ transition: "stroke-dashoffset 0.9s linear" }}
                          />
                        </svg>
                        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <span className="bebas" style={{ fontSize: 14, color: miniRestTimer.secs <= 10 ? "var(--red)" : "#a78bfa", lineHeight: 1 }}>{miniRestTimer.secs}</span>
                        </div>
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 12, fontWeight: 700, color: miniRestTimer.secs <= 10 ? "var(--red)" : "#a78bfa", marginBottom: 2 }}>
                          {miniRestTimer.secs <= 10 ? "⚡ C'est reparti !" : "⏱ Repos"}
                        </div>
                        <div style={{ fontSize: 11, color: "#666" }}>
                          {miniRestTimer.secs <= 10 ? "Prépare-toi pour la prochaine série" : `${miniRestTimer.secs}s restantes`}
                        </div>
                      </div>
                      <button onClick={() => setMiniRestTimer(null)} style={{ background: "rgba(0,0,0,0.06)", border: "none", borderRadius: 8, width: 28, height: 28, color: "#555", fontSize: 14, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>×</button>
                    </div>
                  )}
                  <div style={{ padding: "16px 18px 16px" }}>
                {/* ── HERO SÉANCE ── */}
                {(() => {
                  const typeConf = {
                    running_zone2: { label: "Running Zone 2", color: "var(--green)", bg: "linear-gradient(135deg, rgba(40,167,69,0.08) 0%, rgba(40,167,69,0.02) 100%)", border: "rgba(40,167,69,0.3)", icon: "🏃" },
                    force_stations: { label: "Force Stations", color: "var(--yellow)", bg: "linear-gradient(135deg, rgba(0,122,255,0.08) 0%, rgba(0,122,255,0.02) 100%)", border: "rgba(0,122,255,0.25)", icon: "🏋️" },
                    running_qualite: { label: "Running Qualité", color: "var(--orange)", bg: "linear-gradient(135deg, rgba(224,122,0,0.08) 0%, rgba(224,122,0,0.02) 100%)", border: "rgba(224,122,0,0.25)", icon: "⚡" },
                    hybride_compromis: { label: "Hybride HYROX", color: "var(--purple)", bg: "linear-gradient(135deg, rgba(123,63,206,0.08) 0%, rgba(123,63,206,0.02) 100%)", border: "rgba(123,63,206,0.25)", icon: "🔀" },
                    coach: { label: "Séance Coach", color: "var(--yellow)", bg: "linear-gradient(135deg, rgba(0,122,255,0.08) 0%, rgba(0,122,255,0.02) 100%)", border: "rgba(0,122,255,0.25)", icon: "👨‍💼" },
                    perso: { label: "Séance Perso", color: "var(--gray)", bg: "linear-gradient(135deg, rgba(0,0,0,0.04) 0%, rgba(0,0,0,0.01) 100%)", border: "rgba(0,0,0,0.1)", icon: "✏️" },
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
                        <span style={{ fontSize: 10, color: "#555", marginLeft: "auto" }}>⏱ {session.duree} min</span>
                      </div>
                      {/* Titre */}
                      <div className="bebas" style={{ fontSize: 30, color: "var(--white)", lineHeight: 1, letterSpacing: 0.5, marginBottom: 10 }}>{session.titre}</div>
                      {/* Objectif séance */}
                      {session.objectif && (
                        <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(0,122,255,0.08)", border: "1px solid rgba(0,122,255,0.2)", borderRadius: 8, padding: "4px 10px", marginBottom: 8 }}>
                          <span style={{ fontSize: 10, color: "var(--yellow)", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.08em" }}>🎯 {session.objectif}</span>
                        </div>
                      )}
                      {/* Explication */}
                      <div style={{ fontSize: 12, color: "#666", lineHeight: 1.6, marginBottom: 10 }}>{session.explication}</div>
                      {/* Points d'attention */}
                      {session.points_attention && (
                        <div style={{ fontSize: 11, color: "#ff9a3c", background: "rgba(255,154,60,0.06)", border: "1px solid rgba(255,154,60,0.15)", borderRadius: 8, padding: "7px 10px", marginBottom: 10, lineHeight: 1.5 }}>
                          ⚠️ {session.points_attention}
                        </div>
                      )}
                      {/* Pourquoi cette séance ? — beginner guide */}
                      <PourquoiCard session={session} />
                      {/* Progress ring inline */}
                      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                            <span style={{ fontSize: 11, color: "#777", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em" }}>Exercices</span>
                            <span style={{ fontSize: 11, color: doneCount === totalEx && totalEx > 0 ? "var(--green)" : conf.color, fontWeight: 700 }}>{doneCount}/{totalEx}</span>
                          </div>
                          <div style={{ height: 6, background: "rgba(0,0,0,0.06)", borderRadius: 99, overflow: "hidden" }}>
                            <div style={{ height: "100%", width: `${pct}%`, background: doneCount === totalEx && totalEx > 0 ? "var(--green)" : conf.color, borderRadius: 99, transition: "width 0.4s ease" }} />
                          </div>
                        </div>
                        <div className="bebas" style={{ fontSize: 28, color: doneCount === totalEx && totalEx > 0 ? "var(--green)" : conf.color, lineHeight: 1 }}>{pct}%</div>
                      </div>
                    </div>
                  );
                })()}

                {/* Échauffement interactif */}
                <WarmupWidget session={session} />

                {/* Programme */}
                <div style={{ marginBottom: 10 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                    <div style={{ fontSize: 11, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--gray)" }}>Programme</div>
                    <div style={{ flex: 1, height: 1, background: "rgba(0,0,0,0.06)" }} />
                    <div style={{ fontSize: 11, color: "var(--gray)", fontWeight: 700 }}>{(session.exercices||[]).filter(ex=>ex?.nom).length} exercices</div>
                  </div>
                  {(session.exercices || []).filter(ex => ex && ex.nom).map((ex, i) => {
                    const done = checkedExercices[i];
                    const typeConf2 = {
                      running_zone2: "var(--green)", force_stations: "var(--yellow)",
                      running_qualite: "var(--orange)", hybride_compromis: "var(--purple)",
                    };
                    const accentColor = typeConf2[session.type] || "var(--yellow)";
                    return (
                      <div key={i} className="fade-in-fast"
                        onClick={() => {
                          const wasUndone = !checkedExercices[i];
                          setCheckedExercices(c => ({ ...c, [i]: !c[i] }));
                          if (wasUndone) haptic([8]);
                          if (wasUndone && ex.repos) {
                            const parseRepos = (str) => {
                              if (!str) return 0;
                              const minMatch = str.match(/(\d+)\s*min/i);
                              if (minMatch) return parseInt(minMatch[1]) * 60;
                              const secMatch = str.match(/(\d+)\s*s/i);
                              if (secMatch) return parseInt(secMatch[1]);
                              const colonMatch = str.match(/(\d+):(\d+)/);
                              if (colonMatch) return parseInt(colonMatch[1]) * 60 + parseInt(colonMatch[2]);
                              const numMatch = str.match(/(\d+)/);
                              if (numMatch) return parseInt(numMatch[1]);
                              return 0;
                            };
                            const secs = parseRepos(ex.repos);
                            if (secs > 0) setMiniRestTimer({ secs, initial: secs });
                          }
                          const newCount = Object.values({...checkedExercices, [i]: true}).filter(Boolean).length;
                          if (wasUndone && newCount === (session.exercices||[]).length) {
                            haptic([10, 20, 10, 20, 30]);
                            showToast("Tous les exercices complétés ! 🎉", "success");
                          }
                        }}
                        style={{
                          background: done ? "rgba(40,167,69,0.05)" : "var(--bg3)",
                          border: done ? "1.5px solid rgba(40,167,69,0.25)" : "1.5px solid rgba(0,0,0,0.06)",
                          borderRadius: 16, marginBottom: 10,
                          animationDelay: `${i * 0.06}s`, cursor: "pointer",
                          transition: "all 0.25s",
                          opacity: done ? 0.65 : 1,
                          overflow: "hidden",
                        }}>
                        {/* Barre colorée en haut */}
                        <div style={{ height: 3, background: done ? "var(--green)" : accentColor, borderRadius: "16px 16px 0 0", opacity: done ? 1 : 0.7 }} />
                        <div style={{ padding: "12px 14px 12px" }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: (ex.series || ex.reps || ex.charge || ex.repos || ex.detail || ex.cle_technique) && !done ? 10 : 0 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 10, flex: 1, minWidth: 0 }}>
                              {/* Badge numéro */}
                              <div style={{
                                width: 30, height: 30, borderRadius: 10, flexShrink: 0,
                                background: done ? "var(--green)" : accentColor,
                                display: "flex", alignItems: "center", justifyContent: "center",
                                fontSize: done ? 15 : 13, fontWeight: 800,
                                color: "#fff",
                                boxShadow: done ? "0 2px 8px rgba(40,167,69,0.3)" : `0 2px 8px ${accentColor}40`,
                              }}>{done ? "✓" : i + 1}</div>
                              <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ fontWeight: 700, fontSize: 15, color: done ? "var(--gray)" : "var(--white)", textDecoration: done ? "line-through" : "none", lineHeight: 1.2 }}>{ex.nom}</div>
                                {!done && (ex.series || ex.reps) && (
                                  <div style={{ fontSize: 12, color: accentColor, fontWeight: 800, marginTop: 2 }}>
                                    {ex.series && `${ex.series} × `}{ex.reps || ""}
                                  </div>
                                )}
                              </div>
                            </div>
                            <div style={{ display: "flex", gap: 6, flexShrink: 0, alignItems: "center", marginLeft: 8 }}>
                              {ex.repos && !done && (
                                <div style={{ background: "rgba(167,139,250,0.12)", border: "1px solid rgba(167,139,250,0.25)", borderRadius: 8, padding: "3px 8px", fontSize: 11, fontWeight: 700, color: "#a78bfa", whiteSpace: "nowrap" }}>⏱ {ex.repos}</div>
                              )}
                              {findVideoForExercice(ex.nom) && (
                                <button onClick={e => { e.stopPropagation(); setVideoModal(findVideoForExercice(ex.nom)); }} style={{
                                  background: "rgba(0,122,255,0.1)", border: "1px solid rgba(0,122,255,0.2)",
                                  borderRadius: 8, width: 30, height: 30, fontSize: 12, color: "var(--yellow)",
                                  cursor: "pointer", fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center",
                                }}>▶</button>
                              )}
                            </div>
                          </div>
                          {/* Ligne de métriques */}
                          {!done && (ex.charge || ex.rpe_cible || ex.tempo || (!ex.series && !ex.reps && ex.detail)) && (
                            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: ex.cle_technique ? 8 : 0 }}>
                              {ex.charge && <div style={{ background: "rgba(224,122,0,0.1)", border: "1px solid rgba(224,122,0,0.2)", borderRadius: 8, padding: "3px 9px", fontSize: 12, fontWeight: 700, color: "var(--orange)" }}>⚖️ {ex.charge}</div>}
                              {ex.rpe_cible && <div style={{ background: "rgba(0,0,0,0.05)", border: "1px solid rgba(0,0,0,0.08)", borderRadius: 8, padding: "3px 9px", fontSize: 11, fontWeight: 700, color: "var(--gray2)" }}>RPE {ex.rpe_cible}</div>}
                              {ex.tempo && <div style={{ background: "rgba(0,0,0,0.04)", border: "1px solid rgba(0,0,0,0.07)", borderRadius: 8, padding: "3px 9px", fontSize: 11, color: "var(--gray)" }}>Tempo {ex.tempo}</div>}
                              {!ex.series && !ex.reps && !ex.charge && ex.detail && <div className="bebas" style={{ fontSize: 20, color: accentColor, letterSpacing: "0.04em" }}>{ex.detail}</div>}
                            </div>
                          )}
                          {/* Clé technique */}
                          {ex.cle_technique && !done && (
                            <div style={{ background: `${accentColor}08`, border: `1px solid ${accentColor}20`, borderRadius: 10, padding: "7px 10px", display: "flex", gap: 7, alignItems: "flex-start" }}>
                              <span style={{ flexShrink: 0, fontSize: 13 }}>⚡</span>
                              <span style={{ fontSize: 12, color: accentColor, lineHeight: 1.45, fontWeight: 600 }}>{ex.cle_technique}</span>
                            </div>
                          )}
                          {ex.note && !done && <div style={{ fontSize: 11, color: "var(--gray)", marginTop: 6, lineHeight: 1.5 }}>💬 {ex.note}</div>}
                        </div>
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
                {/* Retour au calme interactif */}
                <CooldownWidget session={session} />

                {/* Nutrition */}
                {session.nutrition && (
                  <div style={{ background: "rgba(57,255,128,0.04)", border: "1px solid rgba(57,255,128,0.12)", borderRadius: 12, padding: "12px 14px", marginBottom: 10 }}>
                    <div style={{ fontSize: 9, color: "var(--green)", textTransform: "uppercase", fontWeight: 700, letterSpacing: "0.1em", marginBottom: 8 }}>🥗 Nutrition autour de la séance</div>
                    {session.nutrition.avant && <div style={{ fontSize: 11, color: "#888", lineHeight: 1.5, marginBottom: 4, display: "flex", gap: 6 }}><span style={{ flexShrink: 0, color: "#666" }}>Avant :</span>{session.nutrition.avant}</div>}
                    {session.nutrition.pendant && <div style={{ fontSize: 11, color: "#888", lineHeight: 1.5, marginBottom: 4, display: "flex", gap: 6 }}><span style={{ flexShrink: 0, color: "#666" }}>Pendant :</span>{session.nutrition.pendant}</div>}
                    {session.nutrition.apres && <div style={{ fontSize: 11, color: "#888", lineHeight: 1.5, display: "flex", gap: 6 }}><span style={{ flexShrink: 0, color: "#666" }}>Après :</span>{session.nutrition.apres}</div>}
                  </div>
                )}

                {(session.metrique || session.charge_seance) && (
                  <div style={{ background: "rgba(0,122,255,0.05)", border: "1px solid rgba(0,122,255,0.15)", borderRadius: 12, padding: "12px 14px", marginBottom: 14 }}>
                    {session.charge_seance && <div style={{ fontSize: 11, color: "#888", marginBottom: session.metrique ? 4 : 0 }}>📊 {session.charge_seance}</div>}
                    {session.metrique && <div style={{ fontSize: 12, color: "var(--yellow)", display: "flex", gap: 8, alignItems: "flex-start", lineHeight: 1.5 }}><span>🎯</span><span>À noter : {session.metrique}</span></div>}
                  </div>
                )}

                <div style={{ display: "flex", gap: 8 }}>
                  <button onClick={() => { setSession(null); try { localStorage.removeItem(sessionCacheKey); } catch {} setShowSessionModal(false); }} style={{ flex: 1, background: "rgba(0,0,0,0.04)", border: "1px solid rgba(0,0,0,0.08)", borderRadius: 12, padding: "13px", color: "#666", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>↺ Refaire</button>
                  <button onClick={() => { setChronoMode(true); setChronoRunning(true); setChronoSeconds(0); setCurrentExIdx(0); }} style={{ flex: 1, background: "rgba(0,0,0,0.04)", border: "1px solid rgba(0,0,0,0.08)", borderRadius: 12, padding: "13px", color: "var(--white)", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>⏱ Chrono</button>
                  <button onClick={() => { setShowFeedback(true); setShowSessionModal(false); }} style={{ flex: 2, background: "var(--green)", border: "none", borderRadius: 12, padding: "13px", color: "#000", fontFamily: "'Bebas Neue',sans-serif", fontSize: 18, letterSpacing: 1, cursor: "pointer" }}>✓ TERMINÉE</button>
                </div>
              </div>
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
                      <div style={{ fontSize: 11, color: "#777", marginTop: 3 }}>Aide ton coach IA à adapter la prochaine séance</div>
                    </div>
                  </div>

                  {/* 1. Ressenti global */}
                  <div style={{ marginBottom: 18 }}>
                    <div style={{ fontSize: 10, color: "#777", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 10 }}>Comment c'était ?</div>
                    <div style={{ display: "flex", gap: 8 }}>
                      {[
                        { v: "facile", emoji: "😪", label: "Trop facile", color: "var(--green)" },
                        { v: "bien", emoji: "💪", label: "Bien calibré", color: "var(--yellow)" },
                        { v: "dur", emoji: "🔥", label: "Trop dur", color: "var(--red)" },
                      ].map(r => {
                        const active = feedbackData.ressenti === r.v;
                        return (
                          <button key={r.v} onClick={() => { haptic([6]); setFeedbackData(d => ({ ...d, ressenti: r.v })); }} style={{
                            flex: 1, padding: "14px 6px", borderRadius: 14, textAlign: "center",
                            background: active ? `${r.color}15` : "rgba(0,0,0,0.02)",
                            border: active ? `2px solid ${r.color}` : "1.5px solid rgba(0,0,0,0.06)",
                            color: "var(--white)", cursor: "pointer",
                            transform: active ? "scale(1.04)" : "scale(1)",
                            boxShadow: active ? `0 4px 16px ${r.color}25` : "none",
                            transition: "all 0.2s var(--spring)",
                          }}>
                            <div style={{ fontSize: active ? 32 : 28, transition: "font-size 0.2s var(--spring)" }}>{r.emoji}</div>
                            <div style={{ fontSize: 10, marginTop: 6, color: active ? r.color : "#444", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em" }}>{r.label}</div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* 2. Difficulté RPE 1-10 */}
                  <div style={{ marginBottom: 18 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                      <div style={{ fontSize: 10, color: "#777", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em" }}>Difficulté (RPE)</div>
                      <div className="bebas" style={{ fontSize: 28, color: feedbackData.difficulte <= 4 ? "var(--green)" : feedbackData.difficulte <= 7 ? "var(--yellow)" : "var(--red)", lineHeight: 1 }}>
                        {feedbackData.difficulte}<span style={{ fontSize: 14, color: "#555" }}>/10</span>
                      </div>
                    </div>
                    {/* RPE label contextuel */}
                    <div style={{ textAlign: "center", marginBottom: 10 }}>
                      <span style={{ fontSize: 12, color: feedbackData.difficulte <= 4 ? "var(--green)" : feedbackData.difficulte <= 7 ? "var(--yellow)" : "var(--red)", fontWeight: 600 }}>
                        {feedbackData.difficulte <= 2 ? "😴 Repos actif" : feedbackData.difficulte <= 4 ? "😊 Facile" : feedbackData.difficulte <= 6 ? "😤 Modéré" : feedbackData.difficulte <= 8 ? "😰 Difficile" : feedbackData.difficulte <= 9 ? "🔥 Très dur" : "💀 Maximum absolu"}
                      </span>
                    </div>
                    <div style={{ display: "flex", gap: 4 }}>
                      {[1,2,3,4,5,6,7,8,9,10].map(v => {
                        const rpeColor = v <= 4 ? "var(--green)" : v <= 7 ? "var(--yellow)" : "var(--red)";
                        const active = v <= feedbackData.difficulte;
                        return (
                        <button key={v} onClick={() => { haptic([6]); setFeedbackData(d => ({ ...d, difficulte: v })); }} style={{
                          flex: 1, height: 38, borderRadius: 8, border: "none", cursor: "pointer",
                          background: active ? rpeColor : "rgba(0,0,0,0.04)",
                          fontSize: v === feedbackData.difficulte ? 13 : 11, fontWeight: 700,
                          color: active ? "#000" : "#2a2a2a",
                          transform: v === feedbackData.difficulte ? "scaleY(1.15)" : "scaleY(1)",
                          transition: "all 0.15s var(--spring)",
                          boxShadow: v === feedbackData.difficulte ? `0 2px 8px ${rpeColor}66` : "none",
                        }}>{v}</button>
                      )})}
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6, fontSize: 9, color: "#555" }}>
                      <span>Facile</span><span>Modéré</span><span>Max</span>
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
                          <div style={{ fontSize: 10, color: "#777", marginTop: 6 }}>Tape pour changer la photo</div>
                        </div>
                      ) : (
                        <>
                          <div style={{ fontSize: 22, marginBottom: 6 }}>⌚</div>
                          <div style={{ fontSize: 13, color: "var(--green)", fontWeight: 600 }}>Photo de ta montre ou séance</div>
                          <div style={{ fontSize: 11, color: "#777", marginTop: 4 }}>Garmin · Apple Watch · Polar · Résumé appli</div>
                          <div style={{ fontSize: 10, color: "#555", marginTop: 2 }}>L'IA extrait automatiquement temps, FC, allure, calories…</div>
                        </>
                      )}
                    </label>

                    <label style={{ fontSize: 11, color: "#aaa", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", display: "block", marginBottom: 6 }}>
                      Charges & performances (complète ou corrige)
                    </label>
                    <div style={{ fontSize: 11, color: "#777", marginBottom: 6 }}>
                      {(session?.exercices || []).filter(ex => ex?.nom).slice(0,3).map(ex => ex.nom).join(" · ")}…
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
                          background: feedbackData.energie === e.v ? "rgba(0,122,255,0.1)" : "var(--bg3)",
                          border: feedbackData.energie === e.v ? "2px solid var(--yellow)" : "1.5px solid transparent",
                          color: "var(--white)", cursor: "pointer",
                        }}>
                          <div style={{ fontSize: 18 }}>{e.emoji}</div>
                          <div style={{ fontSize: 8, marginTop: 3, color: feedbackData.energie === e.v ? "var(--yellow)" : "#555" }}>{e.label}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* 6b. Journal mental */}
                  <div style={{ marginBottom: 18, background: "rgba(167,139,250,0.04)", border: "1px solid rgba(167,139,250,0.15)", borderRadius: 14, padding: "14px 14px" }}>
                    <div style={{ fontSize: 10, color: "#a78bfa", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 10 }}>🧠 Journal mental</div>
                    {/* État mental pré-séance */}
                    <div style={{ marginBottom: 12 }}>
                      <div style={{ fontSize: 10, color: "#555", marginBottom: 8 }}>Comment tu te sentais AVANT la séance ?</div>
                      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                        {[
                          { v: "motivated", emoji: "🔥", label: "Motivé" },
                          { v: "neutral", emoji: "😐", label: "Neutre" },
                          { v: "stressed", emoji: "😰", label: "Stressé" },
                          { v: "tired", emoji: "😴", label: "Épuisé" },
                          { v: "confident", emoji: "💪", label: "Confiant" },
                          { v: "anxious", emoji: "😬", label: "Anxieux" },
                        ].map(s => {
                          const val = feedbackData.mentalPre || "";
                          const active = val === s.v;
                          return (
                            <button key={s.v} onClick={() => { haptic([5]); setFeedbackData(d => ({ ...d, mentalPre: s.v })); }}
                              style={{ padding: "7px 10px", borderRadius: 10, fontSize: 12, cursor: "pointer", border: `1.5px solid ${active ? "rgba(167,139,250,0.5)" : "rgba(0,0,0,0.06)"}`, background: active ? "rgba(167,139,250,0.12)" : "rgba(0,0,0,0.02)", color: active ? "#a78bfa" : "#444", fontWeight: active ? 700 : 400, transition: "all 0.15s" }}>
                              {s.emoji} {s.label}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                    {/* Concentration */}
                    <div style={{ marginBottom: 12 }}>
                      <div style={{ fontSize: 10, color: "#555", marginBottom: 8 }}>Concentration pendant la séance</div>
                      <div style={{ display: "flex", gap: 4 }}>
                        {[1,2,3,4,5].map(v => (
                          <button key={v} onClick={() => { haptic([5]); setFeedbackData(d => ({ ...d, concentration: v })); }}
                            style={{ flex: 1, height: 32, borderRadius: 8, border: "none", cursor: "pointer", fontSize: 14, background: v <= (feedbackData.concentration||0) ? "rgba(167,139,250,0.3)" : "rgba(0,0,0,0.04)", color: v <= (feedbackData.concentration||0) ? "#a78bfa" : "#333", transition: "all 0.15s" }}>
                            {v <= (feedbackData.concentration||0) ? "⭐" : "☆"}
                          </button>
                        ))}
                      </div>
                    </div>
                    {/* Note mentale libre */}
                    <textarea value={feedbackData.mentalNote||""} onChange={e => setFeedbackData(d => ({ ...d, mentalNote: e.target.value }))}
                      placeholder="Comment tu t'es senti mentalement ? Flow, blocages, pensées parasites, confiance..."
                      style={{ width: "100%", background: "rgba(0,0,0,0.03)", border: "1px solid rgba(167,139,250,0.15)", borderRadius: 10, padding: "10px 14px", color: "var(--white)", fontSize: 12, minHeight: 55, resize: "vertical", fontFamily: "var(--font-body)", outline: "none" }} />
                  </div>

                  {/* 7. Exercices détaillés */}
                  {(session?.exercices || []).length > 0 && (
                    <div style={{ marginBottom: 18 }}>
                      <div style={{ fontSize: 11, color: "#aaa", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 4 }}>Détail exercice par exercice</div>
                      <div style={{ fontSize: 11, color: "#777", marginBottom: 10 }}>Remplis ce que tu as réellement fait — laisse vide si tu n'as pas fait l'exercice</div>
                      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                        {(session.exercices || []).filter(ex => ex?.nom).map((ex, i) => {
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
                                    background: log.ressenti === r.v ? "rgba(0,122,255,0.1)" : "var(--bg2)",
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
                      <div style={{ fontSize: 11, color: "#777", marginTop: 10 }}>Individualisation du programme en cours...</div>
                    </div>
                  ) : (
                    <div style={{ display: "flex", gap: 12 }}>
                      <Btn variant="dark" onClick={() => setShowFeedback(false)} style={{ flex: 1 }}>← Retour</Btn>
                      <Btn variant="success" onClick={() => { haptic([10, 20]); submitFeedback(); }} style={{ flex: 2 }}>Envoyer au coach 🚀</Btn>
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
                        {[...Array(20)].map((_, i) => (
                          <div key={i} style={{
                            position: "absolute",
                            width: i % 4 === 0 ? 8 : i % 3 === 0 ? 5 : 6,
                            height: i % 4 === 0 ? 8 : i % 2 === 0 ? 10 : 6,
                            borderRadius: i % 3 === 0 ? "50%" : i % 2 === 0 ? 1 : 2,
                            background: ["var(--yellow)","var(--green)","var(--orange)","var(--purple)","#38bdf8","var(--red)","#fff","var(--yellow)"][i % 8],
                            left: `${Math.round(5 + (i * 4.7) % 90)}%`,
                            top: `${Math.round((i * 13) % 40)}%`,
                            opacity: 0,
                            animation: `confetti ${0.7 + (i % 5)*0.2}s ease-out ${i * 0.05}s forwards`,
                            transform: `rotate(${i * 37}deg)`,
                          }} />
                        ))}
                      </div>
                      <div style={{ position: "absolute", top: -40, right: -40, fontSize: 120, opacity: 0.04 }}>✓</div>

                      {/* Titre */}
                      <div style={{ textAlign: "center", marginBottom: 18 }}>
                        <div style={{ fontSize: 36, marginBottom: 8 }}>{ressentiEmoji}</div>
                        <div className="bebas" style={{ fontSize: 32, color: "var(--green)", letterSpacing: 2, lineHeight: 1 }}>SÉANCE TERMINÉE</div>
                        {isMilestone && (
                          <div style={{ marginTop: 8, background: "rgba(0,122,255,0.1)", border: "1px solid rgba(0,122,255,0.3)", borderRadius: 10, padding: "6px 16px", display: "inline-block" }}>
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
                          <div key={item.label} style={{ background: "rgba(0,0,0,0.03)", border: "1px solid rgba(0,0,0,0.06)", borderRadius: 12, padding: "12px 8px", textAlign: "center" }}>
                            <div className="bebas" style={{ fontSize: 30, color: item.color, lineHeight: 1 }}>{item.value}</div>
                            <div style={{ fontSize: 9, color: "#777", textTransform: "uppercase", marginTop: 3, letterSpacing: "0.1em" }}>{item.label}</div>
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
                  <div style={{ background: "rgba(0,122,255,0.06)", border: "1px solid rgba(0,122,255,0.2)", borderRadius: 8, padding: 10 }}>
                    <div style={{ fontSize: 11, color: "var(--yellow)", fontWeight: 700, marginBottom: 4 }}>📋 Adaptation pour la prochaine séance</div>
                    <div style={{ fontSize: 12, color: "#ccc", lineHeight: 1.6 }}>{feedback.adaptation}</div>
                  </div>
                </Card>

                {/* Prochaine séance prête */}
                {feedback.prochaine_seance && (
                  <Card style={{ border: "1.5px solid rgba(0,122,255,0.3)", marginBottom: 12 }}>
                    <div className="bebas" style={{ fontSize: 18, color: "var(--yellow)", marginBottom: 4 }}>⚡ PROCHAINE SÉANCE PRÊTE</div>
                    <div style={{ fontSize: 12, color: "#666", marginBottom: 10 }}>{feedback.prochaine_seance.titre}</div>
                    {(feedback.prochaine_seance.exercices || []).filter(ex => ex?.nom).map((ex, i) => (
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

        {/* PROGRESSION / FORME — toujours rendu */}
        <div style={{display: tab === "progress" ? "block" : "none"}} className="fade-in">

            {/* ── DERNIÈRES SÉANCES ── */}
            {(profile.sessions||[]).length >= 1 && (() => {
              const last5 = (profile.sessions||[]).slice(-5).reverse();
              const typeConf = {
                running_zone2: { icon: "🏃", color: "var(--green)", label: "Cardio" },
                force_stations: { icon: "🏋️", color: "var(--yellow)", label: "Force" },
                running_qualite: { icon: "⚡", color: "var(--orange)", label: "Qualité" },
                hybride_compromis: { icon: "🔀", color: "var(--purple)", label: "Hybride" },
                coach: { icon: "📋", color: "var(--yellow)", label: "Coach" },
                perso: { icon: "✏️", color: "#888", label: "Perso" },
              };
              return (
                <div style={{ marginBottom: 16 }}>
                  <div style={{ fontSize: 11, color: "#777", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 10 }}>Dernières séances</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {last5.map((s, i) => {
                      const conf = typeConf[s.type] || { icon: "💪", color: "var(--yellow)", label: "Séance" };
                      const d = new Date(s.date);
                      const dateLabel = d.toLocaleDateString("fr-FR", { weekday: "short", day: "numeric", month: "short" });
                      return (
                        <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", background: "rgba(0,0,0,0.02)", border: "1px solid rgba(0,0,0,0.06)", borderRadius: 14 }}>
                          <div style={{ width: 38, height: 38, borderRadius: 11, background: `${conf.color}12`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>{conf.icon}</div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontSize: 13, fontWeight: 700, color: "var(--white)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{s.titre || conf.label}</div>
                            <div style={{ fontSize: 10, color: "#555", marginTop: 1 }}>{dateLabel} · {s.duree || 60} min</div>
                          </div>
                          {s.rpe && <div style={{ fontSize: 11, fontWeight: 700, color: s.rpe >= 8 ? "var(--red)" : s.rpe >= 6 ? "var(--orange)" : "var(--green)" }}>RPE {s.rpe}</div>}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })()}

            {/* ── EMPTY STATE — moins de 2 séances ── */}
            {(profile.sessions||[]).length < 2 && (
              <div style={{ textAlign: "center", padding: "48px 24px" }}>
                <div style={{ fontSize: 64, marginBottom: 16, animation: "bounceIn 0.6s var(--spring) both" }}>📊</div>
                <div className="bebas" style={{ fontSize: 28, color: "var(--yellow)", letterSpacing: 1, marginBottom: 8 }}>Ta progression t'attend</div>
                <div style={{ fontSize: 13, color: "#555", lineHeight: 1.7, marginBottom: 28 }}>
                  Fais ta première séance pour voir tes graphiques de progression, ton score de forme, et les analyses de ton coach IA.
                </div>
                <button onClick={() => navigateTo("today")} style={{ padding: "14px 32px", background: "var(--yellow)", border: "none", borderRadius: 16, fontSize: 15, fontWeight: 700, color: "#000", cursor: "pointer", fontFamily: "'DM Sans',sans-serif" }}>
                  ⚡ Générer ma première séance
                </button>
              </div>
            )}

            {/* ── SCORE SEMAINE ── */}
            {(profile.sessions||[]).length >= 1 && <WeeklyPerformanceCard profile={profile} />}

            {/* ── MIX ENTRAÎNEMENT ── */}
            <TrainingMixChart profile={profile} />

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
                <div style={{ background: "rgba(0,0,0,0.02)", border: "1px solid rgba(0,0,0,0.06)", borderRadius: 18, padding: "16px 16px 12px", marginBottom: 16, overflow: "hidden", position: "relative" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                    <div>
                      <div style={{ fontSize: 10, color: "#555", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 4 }}>Score Fitness · {sessions.length} séances</div>
                      <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                        <div className="bebas" style={{ fontSize: 42, color: scoreColor, lineHeight: 1 }}>{lastScore}</div>
                        <div style={{ fontSize: 13, color: delta >= 0 ? "var(--green)" : "var(--red)", fontWeight: 700 }}>{delta >= 0 ? "+" : ""}{delta}</div>
                      </div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: 10, color: "#555", marginBottom: 4 }}>Tendance</div>
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
                        stroke="rgba(0,0,0,0.04)" strokeWidth="1" />
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

            {/* ── PERFORMANCE MANAGEMENT CHART (PMC) ── */}
            {(profile.sessions||[]).length >= 3 && (() => {
              const pmcData = calcPMC(profile.sessions || []);
              if (pmcData.length < 3) return null;
              const last30 = pmcData.slice(-30);
              const today = pmcData[pmcData.length - 1];
              const tsb = today ? tsbLabel(today.tsb) : null;

              const W = 320, H = 90, pad = 12;
              const maxVal = Math.max(...last30.map(p => Math.max(p.ctl, p.atl)));
              const minTSB = Math.min(...last30.map(p => p.tsb));
              const maxTSB = Math.max(...last30.map(p => p.tsb));

              const xOf = (i) => pad + (i / (last30.length - 1)) * (W - 2 * pad);
              const yOf = (v, min, max) => H - pad - ((v - min) / ((max - min) || 1)) * (H - 2 * pad);

              const makePath = (values, min, max) =>
                values.map((v, i) => `${i === 0 ? "M" : "L"}${xOf(i).toFixed(1)},${yOf(v, min, max).toFixed(1)}`).join(" ");

              const ctlPath = makePath(last30.map(p => p.ctl), 0, maxVal);
              const atlPath = makePath(last30.map(p => p.atl), 0, maxVal);
              const tsbPath = makePath(last30.map(p => p.tsb), minTSB - 5, maxTSB + 5);

              // Zero line for TSB
              const zeroY = yOf(0, minTSB - 5, maxTSB + 5);

              return (
                <div style={{ background: "rgba(0,0,0,0.02)", border: "1px solid rgba(0,0,0,0.06)", borderRadius: 18, padding: "16px 16px 10px", marginBottom: 14 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                    <div>
                      <div style={{ fontSize: 10, color: "#555", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 4 }}>Charge d'entraînement</div>
                      <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                        {today && (
                          <>
                            <div style={{ textAlign: "center" }}>
                              <div style={{ fontSize: 9, color: "#555", textTransform: "uppercase", marginBottom: 1 }}>Fitness</div>
                              <div className="bebas" style={{ fontSize: 20, color: "var(--green)", lineHeight: 1 }}>{today.ctl}</div>
                            </div>
                            <div style={{ width: 1, height: 28, background: "rgba(0,0,0,0.06)" }} />
                            <div style={{ textAlign: "center" }}>
                              <div style={{ fontSize: 9, color: "#555", textTransform: "uppercase", marginBottom: 1 }}>Fatigue</div>
                              <div className="bebas" style={{ fontSize: 20, color: "var(--orange)", lineHeight: 1 }}>{today.atl}</div>
                            </div>
                            <div style={{ width: 1, height: 28, background: "rgba(0,0,0,0.06)" }} />
                            <div style={{ textAlign: "center" }}>
                              <div style={{ fontSize: 9, color: "#555", textTransform: "uppercase", marginBottom: 1 }}>Forme</div>
                              <div className="bebas" style={{ fontSize: 20, color: tsb?.color, lineHeight: 1 }}>{today.tsb > 0 ? "+" : ""}{today.tsb}</div>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                    {tsb && (
                      <div style={{ background: `${tsb.color}15`, border: `1px solid ${tsb.color}30`, borderRadius: 10, padding: "6px 10px", textAlign: "center" }}>
                        <div style={{ fontSize: 9, color: tsb.color, fontWeight: 700, textTransform: "uppercase" }}>{tsb.label}</div>
                        <div style={{ fontSize: 9, color: "#777", marginTop: 2, maxWidth: 80, lineHeight: 1.4 }}>{tsb.tip}</div>
                      </div>
                    )}
                  </div>

                  {/* SVG Chart — CTL + ATL superposés */}
                  <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ overflow: "visible", marginBottom: 4 }}>
                    <defs>
                      <linearGradient id="ctlGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#39ff80" stopOpacity="0.15" />
                        <stop offset="100%" stopColor="#39ff80" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    {/* Grille */}
                    {[0.25, 0.5, 0.75].map((p, i) => (
                      <line key={i} x1={pad} y1={pad + p * (H - 2 * pad)} x2={W - pad} y2={pad + p * (H - 2 * pad)} stroke="rgba(0,0,0,0.04)" strokeWidth="1" />
                    ))}
                    {/* CTL fill */}
                    <path d={ctlPath + ` L${xOf(last30.length-1).toFixed(1)},${H-pad} L${xOf(0).toFixed(1)},${H-pad} Z`} fill="url(#ctlGrad)" />
                    {/* CTL line */}
                    <path d={ctlPath} fill="none" stroke="var(--green)" strokeWidth="2" strokeLinecap="round" />
                    {/* ATL line */}
                    <path d={atlPath} fill="none" stroke="var(--orange)" strokeWidth="2" strokeLinecap="round" strokeDasharray="5,3" />
                    {/* Derniers points */}
                    <circle cx={xOf(last30.length-1)} cy={yOf(last30[last30.length-1].ctl, 0, maxVal)} r="4" fill="var(--green)" />
                    <circle cx={xOf(last30.length-1)} cy={yOf(last30[last30.length-1].atl, 0, maxVal)} r="4" fill="var(--orange)" />
                  </svg>

                  {/* Légende */}
                  <div style={{ display: "flex", gap: 14, marginTop: 4, marginBottom: 8 }}>
                    {[
                      { color: "var(--green)", label: "Fitness long terme (42j)", dash: false },
                      { color: "var(--orange)", label: "Fatigue récente (7j)", dash: true },
                    ].map(l => (
                      <div key={l.label} style={{ display: "flex", alignItems: "center", gap: 5 }}>
                        <svg width="20" height="3" style={{ flexShrink: 0 }}>
                          <line x1="0" y1="1.5" x2="20" y2="1.5" stroke={l.color} strokeWidth="2" strokeDasharray={l.dash ? "4,2" : "none"} />
                        </svg>
                        <span style={{ fontSize: 9, color: "#777" }}>{l.label}</span>
                      </div>
                    ))}
                  </div>

                  {/* TSB mini bars — Form sur 30j */}
                  <div style={{ marginTop: 6, paddingTop: 10, borderTop: "1px solid rgba(0,0,0,0.04)" }}>
                    <div style={{ fontSize: 9, color: "#555", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>Forme du jour — 30 derniers jours</div>
                    <div style={{ display: "flex", gap: 2, alignItems: "flex-end", height: 28 }}>
                      {last30.map((p, i) => {
                        const isPos = p.tsb >= 0;
                        const height = Math.min(28, Math.abs(p.tsb) * 0.7 + 2);
                        const col = p.tsb > 10 ? "#38bdf8" : p.tsb > 0 ? "var(--green)" : p.tsb > -15 ? "var(--orange)" : "var(--red)";
                        return (
                          <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-end" }}>
                            <div style={{ width: "100%", height, background: col, borderRadius: "2px 2px 0 0", opacity: i === last30.length - 1 ? 1 : 0.6 }} />
                          </div>
                        );
                      })}
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 8, color: "#222", marginTop: 3 }}>
                      <span>J-30</span>
                      <span style={{ color: tsb?.color }}>Aujourd'hui : {today?.tsb > 0 ? "+" : ""}{today?.tsb}</span>
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* Résumé hebdo si dimanche */}
            {buildWeeklySummary(profile).count > 0 && <WeeklySummaryCard profile={profile} />}

            {/* ── COMPARAISON SEMAINE N vs N-1 ── */}
            {(profile.sessions||[]).length >= 2 && (() => {
              const now = new Date();
              const dayOfWeek = now.getDay() === 0 ? 7 : now.getDay(); // Mon=1 ... Sun=7
              const startThisWeek = new Date(now); startThisWeek.setDate(now.getDate() - dayOfWeek + 1); startThisWeek.setHours(0,0,0,0);
              const startLastWeek = new Date(startThisWeek); startLastWeek.setDate(startThisWeek.getDate() - 7);
              const endLastWeek = new Date(startThisWeek);

              const thisWeekSessions = (profile.sessions||[]).filter(s => new Date(s.date) >= startThisWeek);
              const lastWeekSessions = (profile.sessions||[]).filter(s => new Date(s.date) >= startLastWeek && new Date(s.date) < endLastWeek);

              if (thisWeekSessions.length === 0 && lastWeekSessions.length === 0) return null;

              const thisAvgRPE = thisWeekSessions.length ? Math.round(thisWeekSessions.reduce((a,s) => a + (s.difficulte||5), 0) / thisWeekSessions.length * 10) / 10 : 0;
              const lastAvgRPE = lastWeekSessions.length ? Math.round(lastWeekSessions.reduce((a,s) => a + (s.difficulte||5), 0) / lastWeekSessions.length * 10) / 10 : 0;

              const COLS = [
                { label: "Séances", this: thisWeekSessions.length, last: lastWeekSessions.length, unit: "", icon: "📅", color: "var(--yellow)" },
                { label: "RPE moy.", this: thisAvgRPE || "—", last: lastAvgRPE || "—", unit: "/10", icon: "🔥", color: "var(--orange)" },
                { label: "Dures", this: thisWeekSessions.filter(s=>s.ressenti==="dur").length, last: lastWeekSessions.filter(s=>s.ressenti==="dur").length, unit: "", icon: "💀", color: "var(--red)" },
              ];

              return (
                <div style={{ background: "rgba(0,0,0,0.02)", border: "1px solid rgba(0,0,0,0.06)", borderRadius: 18, padding: "14px 16px", marginBottom: 16 }}>
                  <div style={{ fontSize: 10, color: "#555", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 12 }}>Semaine en cours vs précédente</div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
                    {COLS.map(col => {
                      const diff = typeof col.this === "number" && typeof col.last === "number" ? col.this - col.last : null;
                      const improved = diff !== null && diff > 0;
                      const equal = diff === 0;
                      return (
                        <div key={col.label} style={{ background: "rgba(0,0,0,0.02)", borderRadius: 12, padding: "10px 8px", textAlign: "center" }}>
                          <div style={{ fontSize: 16, marginBottom: 4 }}>{col.icon}</div>
                          <div style={{ fontSize: 9, color: "#555", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>{col.label}</div>
                          <div className="bebas" style={{ fontSize: 24, color: col.color, lineHeight: 1 }}>{col.this}{col.unit}</div>
                          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 3, marginTop: 4 }}>
                            <span style={{ fontSize: 9, color: "#555" }}>vs {col.last}{col.unit}</span>
                            {diff !== null && !equal && (
                              <span style={{ fontSize: 9, color: improved ? "var(--green)" : "var(--red)", fontWeight: 700 }}>
                                {improved ? "▲" : "▼"}{Math.abs(diff)}
                              </span>
                            )}
                            {equal && <span style={{ fontSize: 9, color: "#777" }}>—</span>}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  {/* Mini heatmap days of week */}
                  <div style={{ marginTop: 12, display: "flex", gap: 5, justifyContent: "center" }}>
                    {["L","M","M","J","V","S","D"].map((d, i) => {
                      const dayHadSession = thisWeekSessions.some(s => {
                        const sd = new Date(s.date);
                        const sdow = sd.getDay() === 0 ? 7 : sd.getDay();
                        return sdow === i + 1;
                      });
                      const isPast = i + 1 <= dayOfWeek;
                      return (
                        <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
                          <div style={{ width: 28, height: 28, borderRadius: 8, background: dayHadSession ? "rgba(0,122,255,0.15)" : isPast ? "rgba(0,0,0,0.03)" : "rgba(255,255,255,0.015)", border: `1px solid ${dayHadSession ? "rgba(0,122,255,0.3)" : "rgba(0,0,0,0.05)"}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                            {dayHadSession && <span style={{ fontSize: 12 }}>✓</span>}
                          </div>
                          <div style={{ fontSize: 8, color: i + 1 === dayOfWeek ? "var(--yellow)" : "#333", fontWeight: i + 1 === dayOfWeek ? 700 : 400 }}>{d}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })()}

            {/* ── GRAPHIQUE CHARGE HEBDO ── */}
            {(profile.sessions||[]).length >= 3 && (() => {
              // Groupe les sessions par semaine (ISO week)
              const getWeekKey = (date) => {
                const d = new Date(date); d.setHours(0,0,0,0);
                d.setDate(d.getDate() + 4 - (d.getDay() || 7));
                const y = d.getFullYear();
                const w = Math.ceil(((d - new Date(y,0,1)) / 86400000 + 1) / 7);
                return `${y}-W${String(w).padStart(2,"0")}`;
              };
              const weekMap = {};
              (profile.sessions||[]).forEach(s => {
                const wk = getWeekKey(s.date);
                if (!weekMap[wk]) weekMap[wk] = { count: 0, rpeSum: 0, dur: 0 };
                weekMap[wk].count++;
                weekMap[wk].rpeSum += s.difficulte || 5;
                weekMap[wk].dur += parseInt(s.tempsReel?.split(":")[0]||0)*60 + parseInt(s.tempsReel?.split(":")[1]||0) || 50;
              });
              const weeks = Object.entries(weekMap).sort((a,b) => a[0].localeCompare(b[0])).slice(-8);
              if (weeks.length < 2) return null;
              const maxCount = Math.max(...weeks.map(([,v]) => v.count));
              const W = 320; const H = 80; const barW = Math.floor((W - 20) / weeks.length) - 4;
              return (
                <div style={{ background: "rgba(0,0,0,0.02)", border: "1px solid rgba(0,0,0,0.05)", borderRadius: 16, padding: "16px 16px 10px", marginBottom: 12 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                    <div style={{ fontSize: 10, color: "#555", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em" }}>Charge par semaine</div>
                    <div style={{ fontSize: 10, color: "#555" }}>{weeks.length} semaines</div>
                  </div>
                  <svg width="100%" viewBox={`0 0 ${W} ${H}`}>
                    {weeks.map(([wk, v], i) => {
                      const x = 10 + i * ((W - 20) / weeks.length);
                      const barH = maxCount > 0 ? Math.max(8, (v.count / maxCount) * (H - 20)) : 8;
                      const avgRPE = v.rpeSum / v.count;
                      const col = avgRPE <= 4 ? "#39ff80" : avgRPE <= 7 ? "#007AFF" : "#ff4747";
                      const isLast = i === weeks.length - 1;
                      return (
                        <g key={i}>
                          <rect x={x} y={H - barH - 16} width={barW} height={barH}
                            rx="4" fill={isLast ? col : `${col}55`} />
                          <text x={x + barW/2} y={H - barH - 20} textAnchor="middle"
                            fontSize="10" fontFamily="'Bebas Neue',sans-serif" fill={isLast ? col : "#444"}>{v.count}</text>
                          <text x={x + barW/2} y={H - 2} textAnchor="middle"
                            fontSize="8" fill={isLast ? "#888" : "#2a2a2a"}>{wk.slice(6)}</text>
                        </g>
                      );
                    })}
                  </svg>
                  <div style={{ display: "flex", gap: 10, marginTop: 4, justifyContent: "center" }}>
                    {[["#39ff80","RPE ≤4"],["#007AFF","RPE 5-7"],["#ff4747","RPE ≥8"]].map(([c,l])=>(
                      <div key={l} style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 9, color: "#777" }}>
                        <div style={{ width: 8, height: 8, borderRadius: 2, background: c }} />{l}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })()}

            {/* ── RECORDS DE SÉANCE ── */}
            {(profile.sessions||[]).length >= 2 && (() => {
              const sessions = profile.sessions || [];
              const bestRPE = sessions.reduce((best, s) => s.difficulte < (best?.difficulte||10) ? s : best, null);
              const worstRPE = sessions.reduce((best, s) => s.difficulte > (best?.difficulte||0) ? s : best, null);
              const bestEnergie = sessions.reduce((best, s) => (s.energie||0) > ((best?.energie)||0) ? s : best, null);
              const records = [
                { label: "Session la plus facile", s: bestRPE, val: `RPE ${bestRPE?.difficulte}`, color: "var(--green)", icon: "🌟" },
                { label: "Session la plus dure", s: worstRPE, val: `RPE ${worstRPE?.difficulte}`, color: "var(--red)", icon: "🔥" },
                { label: "Meilleure énergie", s: bestEnergie, val: `⚡${bestEnergie?.energie}/5`, color: "var(--yellow)", icon: "⚡" },
              ].filter(r => r.s);
              if (!records.length) return null;
              return (
                <div style={{ background: "rgba(0,0,0,0.02)", border: "1px solid rgba(0,0,0,0.05)", borderRadius: 16, padding: "14px", marginBottom: 12 }}>
                  <div style={{ fontSize: 10, color: "#555", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 12 }}>🏅 Records de séance</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {records.map((r, i) => (
                      <div key={i} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <div style={{ fontSize: 20, flexShrink: 0 }}>{r.icon}</div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 10, color: "#777", marginBottom: 1 }}>{r.label}</div>
                          <div style={{ fontSize: 12, color: "var(--white)", fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.s?.titre}</div>
                        </div>
                        <div className="bebas" style={{ fontSize: 18, color: r.color, flexShrink: 0 }}>{r.val}</div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })()}

            {/* ── BODY METRICS 30 JOURS ── */}
            {(()=>{
              const [bodyLogs, setBodyLogs] = React.useState([]);
              React.useEffect(() => {
                const loads = [];
                for (let i = 29; i >= 0; i--) {
                  const d = new Date(); d.setDate(d.getDate() - i);
                  const ds = d.toISOString().split("T")[0];
                  loads.push(storage.get(getDailyLogKey(profile.name, ds)).then(v => ({ date: ds, ...(v || {}) })));
                }
                Promise.all(loads).then(logs => setBodyLogs(logs.filter(l => l.sleepHours || l.poidsJour || l.hrv)));
              }, []);

              if (bodyLogs.length < 3) return null;

              const weightLogs = bodyLogs.filter(l => l.poidsJour);
              const sleepLogs = bodyLogs.filter(l => l.sleepHours);
              const avgWeight = weightLogs.length ? (weightLogs.reduce((a, l) => a + parseFloat(l.poidsJour), 0) / weightLogs.length).toFixed(1) : null;
              const avgSleep = sleepLogs.length ? (sleepLogs.reduce((a, l) => a + parseFloat(l.sleepHours), 0) / sleepLogs.length).toFixed(1) : null;
              const minW = weightLogs.length ? Math.min(...weightLogs.map(l => parseFloat(l.poidsJour))) : 0;
              const maxW = weightLogs.length ? Math.max(...weightLogs.map(l => parseFloat(l.poidsJour))) : 100;

              const W = 300; const H = 60; const pad = 8;

              const renderLine = (logs, valFn, color) => {
                if (logs.length < 2) return null;
                const vals = logs.map(valFn);
                const mn = Math.min(...vals) - 0.5; const mx = Math.max(...vals) + 0.5;
                const range = (mx - mn) || 1;
                const allDates = bodyLogs.map(l => l.date);
                const pts = logs.map(l => {
                  const idx = allDates.indexOf(l.date);
                  const x = pad + (idx / Math.max(allDates.length - 1, 1)) * (W - 2 * pad);
                  const y = H - pad - ((valFn(l) - mn) / range) * (H - 2 * pad);
                  return [x, y];
                });
                const d = pts.map((p, i) => `${i === 0 ? "M" : "L"}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(" ");
                const lastPt = pts[pts.length - 1];
                return (
                  <>
                    <path d={d} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" opacity="0.9" />
                    <circle cx={lastPt[0]} cy={lastPt[1]} r="3.5" fill={color} />
                  </>
                );
              };

              return (
                <div style={{ background: "rgba(0,0,0,0.02)", border: "1px solid rgba(0,0,0,0.05)", borderRadius: 18, padding: "14px 16px", marginBottom: 14 }}>
                  <div style={{ fontSize: 10, color: "#555", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 14 }}>⚖️ Suivi corporel — {bodyLogs.length} jours de données</div>

                  {/* Weight chart */}
                  {weightLogs.length >= 2 && (
                    <div style={{ marginBottom: 14 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 6 }}>
                        <div style={{ fontSize: 10, color: "#555", fontWeight: 600 }}>Poids corporel</div>
                        <div style={{ display: "flex", gap: 8, alignItems: "baseline" }}>
                          <span className="bebas" style={{ fontSize: 20, color: "var(--yellow)", lineHeight: 1 }}>{weightLogs[weightLogs.length-1] ? parseFloat(weightLogs[weightLogs.length-1].poidsJour).toFixed(1) : avgWeight}kg</span>
                          <span style={{ fontSize: 9, color: "#777" }}>moy. {avgWeight}kg</span>
                        </div>
                      </div>
                      <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ overflow: "visible" }}>
                        {/* Grid lines */}
                        {[0.25,0.5,0.75].map((p,i) => <line key={i} x1={pad} y1={pad + p*(H-2*pad)} x2={W-pad} y2={pad + p*(H-2*pad)} stroke="rgba(0,0,0,0.04)" strokeWidth="1" />)}
                        {renderLine(weightLogs, l => parseFloat(l.poidsJour), "var(--yellow)")}
                      </svg>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 8, color: "#222", marginTop: 2 }}>
                        <span>{weightLogs[0]?.date?.slice(5)}</span>
                        <span>min {minW.toFixed(1)}kg · max {maxW.toFixed(1)}kg · écart {(maxW-minW).toFixed(1)}kg</span>
                        <span>Auj.</span>
                      </div>
                    </div>
                  )}

                  {/* Sleep chart */}
                  {sleepLogs.length >= 2 && (
                    <div>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 6 }}>
                        <div style={{ fontSize: 10, color: "#555", fontWeight: 600 }}>Sommeil</div>
                        <div style={{ display: "flex", gap: 8, alignItems: "baseline" }}>
                          <span className="bebas" style={{ fontSize: 20, color: "#a78bfa", lineHeight: 1 }}>{sleepLogs[sleepLogs.length-1] ? parseFloat(sleepLogs[sleepLogs.length-1].sleepHours) : avgSleep}h</span>
                          <span style={{ fontSize: 9, color: "#777" }}>moy. {avgSleep}h</span>
                        </div>
                      </div>
                      <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ overflow: "visible" }}>
                        {[0.25,0.5,0.75].map((p,i) => <line key={i} x1={pad} y1={pad + p*(H-2*pad)} x2={W-pad} y2={pad + p*(H-2*pad)} stroke="rgba(0,0,0,0.04)" strokeWidth="1" />)}
                        {renderLine(sleepLogs, l => parseFloat(l.sleepHours), "#a78bfa")}
                        {/* 8h reference line */}
                        {(() => {
                          const mn = Math.min(...sleepLogs.map(l=>parseFloat(l.sleepHours))) - 0.5;
                          const mx = Math.max(...sleepLogs.map(l=>parseFloat(l.sleepHours))) + 0.5;
                          const range = (mx - mn) || 1;
                          if (8 >= mn && 8 <= mx) {
                            const y = H - pad - ((8 - mn) / range) * (H - 2 * pad);
                            return <line x1={pad} y1={y} x2={W-pad} y2={y} stroke="rgba(167,139,250,0.3)" strokeWidth="1" strokeDasharray="4,3" />;
                          }
                          return null;
                        })()}
                      </svg>
                      <div style={{ fontSize: 8, color: "#222", marginTop: 2, textAlign: "right" }}>--- objectif 8h</div>
                    </div>
                  )}

                  {/* HRV chart */}
                  {(()=>{
                    const hrvLogs = bodyLogs.filter(l => l.hrv && parseInt(l.hrv) > 0);
                    if (hrvLogs.length < 2) return null;
                    const avgHrv = (hrvLogs.reduce((a,l) => a + parseInt(l.hrv), 0) / hrvLogs.length).toFixed(0);
                    const lastHrv = parseInt(hrvLogs[hrvLogs.length-1].hrv);
                    const hrvColor = lastHrv>=70?"var(--green)":lastHrv>=55?"var(--yellow)":lastHrv>=40?"var(--orange)":"var(--red)";
                    return (
                      <div style={{ marginTop: 14, paddingTop: 14, borderTop: "1px solid rgba(0,0,0,0.04)" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 6 }}>
                          <div style={{ fontSize: 10, color: "#555", fontWeight: 600 }}>💓 VFC matin</div>
                          <div style={{ display: "flex", gap: 8, alignItems: "baseline" }}>
                            <span className="bebas" style={{ fontSize: 20, color: hrvColor, lineHeight: 1 }}>{lastHrv}</span>
                            <span style={{ fontSize: 9, color: "#777" }}>moy. {avgHrv}ms</span>
                          </div>
                        </div>
                        <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ overflow: "visible" }}>
                          {[0.25,0.5,0.75].map((p,i) => <line key={i} x1={pad} y1={pad + p*(H-2*pad)} x2={W-pad} y2={pad + p*(H-2*pad)} stroke="rgba(0,0,0,0.04)" strokeWidth="1" />)}
                          {renderLine(hrvLogs, l => parseInt(l.hrv), hrvColor)}
                        </svg>
                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 8, color: "#222", marginTop: 2 }}>
                          <span>{hrvLogs[0]?.date?.slice(5)}</span>
                          <span style={{ color: hrvColor }}>{lastHrv>=70?"Excellent":lastHrv>=55?"Bon":lastHrv>=40?"Modéré":"Bas"}</span>
                          <span>Auj.</span>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              );
            })()}

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

            {/* ── SIMULATEUR DE PROGRESSION ── */}
            {(profile.sessions||[]).length >= 4 && (() => {
              const sessions = profile.sessions || [];
              const n = sessions.length;
              // Taux de progression hebdo basé sur les 8 dernières séances
              const last8 = sessions.slice(-8);
              const avgRPE = last8.reduce((a,s) => a + (s.difficulte||5), 0) / last8.length;
              const avgSessions = n / Math.max(1, Math.ceil((new Date() - new Date(sessions[0].date)) / (7 * 86400000)));
              const weeklyGain = avgSessions >= 4 ? 1.2 : avgSessions >= 3 ? 0.9 : 0.6; // pts/semaine
              const currentScore = calcFitnessScore(profile).global;

              const SCENARIOS = [
                { weeks: 4,  color: "#38bdf8", label: "4 semaines" },
                { weeks: 8,  color: "var(--green)", label: "8 semaines" },
                { weeks: 12, color: "var(--yellow)", label: "12 semaines" },
              ];

              // VMA projections
              const vma = profile.vmaKmh || 0;
              const vmaGainPerWeek = avgSessions >= 3 ? 0.08 : 0.05; // km/h par semaine
              // Squat 1RM projections
              const squat = parseFloat(profile.squat1RM_final) || 0;
              const squatGainPerWeek = avgSessions >= 3 ? 0.5 : 0.3; // kg par semaine

              return (
                <div style={{ background: "rgba(0,0,0,0.02)", border: "1px solid rgba(0,0,0,0.06)", borderRadius: 18, padding: "16px 16px", marginBottom: 14 }}>
                  <div style={{ fontSize: 10, color: "#777", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 4 }}>🔮 Simulateur de progression</div>
                  <div style={{ fontSize: 10, color: "#555", marginBottom: 14 }}>Si tu maintiens ton rythme de {avgSessions.toFixed(1)} séances/semaine…</div>

                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {/* Score condition */}
                    <div>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                        <span style={{ fontSize: 11, color: "#666" }}>📊 Score condition</span>
                        <span style={{ fontSize: 11, color: "#777" }}>Actuel : <strong style={{ color: "var(--yellow)" }}>{currentScore}%</strong></span>
                      </div>
                      <div style={{ display: "flex", gap: 6 }}>
                        {SCENARIOS.map(sc => {
                          const projected = Math.min(100, Math.round(currentScore + weeklyGain * sc.weeks));
                          const gain = projected - currentScore;
                          return (
                            <div key={sc.weeks} style={{ flex: 1, background: `${sc.color}10`, border: `1px solid ${sc.color}30`, borderRadius: 10, padding: "8px 6px", textAlign: "center" }}>
                              <div style={{ fontSize: 8, color: sc.color, fontWeight: 700, textTransform: "uppercase", marginBottom: 4 }}>{sc.label}</div>
                              <div className="bebas" style={{ fontSize: 20, color: sc.color, lineHeight: 1 }}>{projected}%</div>
                              <div style={{ fontSize: 9, color: "#777", marginTop: 2 }}>+{gain} pts</div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Metrics projections */}
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                      {vma > 0 && (
                        <div style={{ background: "rgba(57,255,128,0.04)", border: "1px solid rgba(57,255,128,0.12)", borderRadius: 10, padding: "10px 12px" }}>
                          <div style={{ fontSize: 9, color: "#777", marginBottom: 6 }}>🏃 VMA actuelle : {vma} km/h</div>
                          {SCENARIOS.slice(0,2).map(sc => (
                            <div key={sc.weeks} style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                              <span style={{ fontSize: 9, color: "#555" }}>{sc.label}</span>
                              <span style={{ fontSize: 9, color: sc.color, fontWeight: 700 }}>{(vma + vmaGainPerWeek * sc.weeks).toFixed(1)} km/h</span>
                            </div>
                          ))}
                        </div>
                      )}
                      {squat > 0 && (
                        <div style={{ background: "rgba(255,154,60,0.04)", border: "1px solid rgba(255,154,60,0.12)", borderRadius: 10, padding: "10px 12px" }}>
                          <div style={{ fontSize: 9, color: "#777", marginBottom: 6 }}>🏋️ Squat actuel : {squat} kg</div>
                          {SCENARIOS.slice(0,2).map(sc => (
                            <div key={sc.weeks} style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                              <span style={{ fontSize: 9, color: "#555" }}>{sc.label}</span>
                              <span style={{ fontSize: 9, color: sc.color, fontWeight: 700 }}>{Math.round(squat + squatGainPerWeek * sc.weeks)} kg</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div style={{ fontSize: 9, color: "#555", paddingTop: 6, borderTop: "1px solid rgba(0,0,0,0.04)", lineHeight: 1.6 }}>
                      ⚠️ Estimations basées sur ton historique. Les gains réels dépendent de la qualité du sommeil, de la nutrition et de la récupération.
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* ── OBJECTIF VS RÉEL ── */}
            {(profile.sessions||[]).length >= 2 && profile.seancesParSemaine && (() => {
              const target = parseInt(profile.seancesParSemaine) || 4;
              // Last 8 weeks
              const getWeekNum = (date) => {
                const d = new Date(date); d.setHours(0,0,0,0);
                d.setDate(d.getDate() + 4 - (d.getDay() || 7));
                const y = d.getFullYear();
                const w = Math.ceil(((d - new Date(y,0,1)) / 86400000 + 1) / 7);
                return `${y}-${String(w).padStart(2,"0")}`;
              };
              const weekMap = {};
              (profile.sessions||[]).forEach(s => {
                const wk = getWeekNum(s.date);
                weekMap[wk] = (weekMap[wk]||0) + 1;
              });
              const weeks = Object.entries(weekMap).sort((a,b) => a[0].localeCompare(b[0])).slice(-8);
              if (weeks.length < 2) return null;

              const achieved = weeks.map(([,c]) => c);
              const avgAchieved = (achieved.reduce((a,b) => a+b, 0) / achieved.length).toFixed(1);
              const compliance = Math.round((achieved.reduce((a,b) => a+b, 0) / (achieved.length * target)) * 100);
              const complianceColor = compliance >= 85 ? "var(--green)" : compliance >= 65 ? "var(--yellow)" : "var(--orange)";

              return (
                <div style={{ background: "rgba(0,0,0,0.02)", border: "1px solid rgba(0,0,0,0.06)", borderRadius: 18, padding: "16px 16px", marginBottom: 14 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                    <div style={{ fontSize: 10, color: "#777", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em" }}>🎯 Objectif vs réalisé</div>
                    <div style={{ display: "flex", align: "center", gap: 6 }}>
                      <span style={{ fontSize: 10, color: "#777" }}>Compliance</span>
                      <span style={{ fontSize: 12, fontWeight: 700, color: complianceColor }}>{compliance}%</span>
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: 2, alignItems: "flex-end", height: 64, marginBottom: 8 }}>
                    {weeks.map(([wk, count], i) => {
                      const pct = count / Math.max(target, Math.max(...achieved));
                      const targetPct = target / Math.max(target, Math.max(...achieved));
                      const overTarget = count >= target;
                      return (
                        <div key={wk} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-end", gap: 2, height: "100%", position: "relative" }}>
                          {/* Target line indicator */}
                          <div style={{ position: "absolute", bottom: `${Math.round(targetPct * 60)}px`, left: 0, right: 0, height: 1, background: "rgba(0,122,255,0.3)", borderTop: "1px dashed rgba(0,122,255,0.4)" }} />
                          {/* Bar */}
                          <div style={{ width: "80%", height: `${Math.round(pct * 60)}px`, background: overTarget ? "var(--green)" : "var(--orange)", borderRadius: "3px 3px 0 0", opacity: i === weeks.length - 1 ? 1 : 0.7, minHeight: 3 }} />
                          <div style={{ fontSize: 7, color: "#555" }}>S{i+1}</div>
                        </div>
                      );
                    })}
                  </div>

                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 8, borderTop: "1px solid rgba(0,0,0,0.04)" }}>
                    <div style={{ display: "flex", gap: 10 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 9, color: "#777" }}>
                        <div style={{ width: 10, height: 3, background: "rgba(0,122,255,0.5)", borderTop: "1px dashed rgba(0,122,255,0.4)" }} />
                        Objectif {target} séances
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 9, color: "#777" }}>
                        <div style={{ width: 10, height: 8, background: "var(--green)", borderRadius: 1 }} />
                        Réalisé
                      </div>
                    </div>
                    <div style={{ fontSize: 10, color: "#555" }}>Moy. : <span style={{ color: complianceColor, fontWeight: 700 }}>{avgAchieved}/sem</span></div>
                  </div>
                </div>
              );
            })()}

            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 11, color: "#555", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 12 }}>Stats globales</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                {[
                  { label: "Séances", value: profile.sessions?.length || 0, unit: "réalisées", color: "var(--yellow)", bg: "linear-gradient(135deg, #131500 0%, #0a0a00 100%)", border: "rgba(0,122,255,0.2)", icon: "📅" },
                  { label: "Niveau", value: profile.level || "?", unit: LEVELS[(profile.level||1)-1]?.label || "HYROX", color: LEVELS[(profile.level||1)-1]?.color || "var(--green)", bg: "linear-gradient(135deg, #001a0a 0%, #000a05 100%)", border: "rgba(57,255,128,0.2)", icon: "🏆" },
                  { label: "VMA", value: profile.vmaKmh || "—", unit: "km/h", color: "var(--green)", bg: "linear-gradient(135deg, #001a0a 0%, #000a05 100%)", border: "rgba(57,255,128,0.15)", icon: "🏃" },
                  { label: "Squat 1RM", value: profile.squat1RM_final || "—", unit: "kg", color: "var(--orange)", bg: "linear-gradient(135deg, #1a0800 0%, #0a0400 100%)", border: "rgba(255,154,60,0.2)", icon: "🏋️" },
                ].map(item => (
                  <div key={item.label} style={{ background: item.bg, border: `1.5px solid ${item.border}`, borderRadius: 16, padding: "16px 14px", position: "relative", overflow: "hidden" }}>
                    <div style={{ position: "absolute", top: -20, right: -20, fontSize: 50, opacity: 0.06 }}>{item.icon}</div>
                    <div style={{ fontSize: 10, color: "#555", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>{item.label}</div>
                    <div className="bebas" style={{ fontSize: 38, color: item.color, lineHeight: 1 }}>{item.value}</div>
                    <div style={{ fontSize: 11, color: "#777", marginTop: 4 }}>{item.unit}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* ── JOURNAL DE SÉANCES PREMIUM ── */}
            {(()=>{
              const TYPE_CONF_J = {
                running_zone2:     { icon: "🏃", label: "Zone 2",    color: "var(--green)",  bg: "rgba(57,255,128,0.08)",  border: "rgba(57,255,128,0.25)" },
                force_stations:    { icon: "🏋️", label: "Force",     color: "var(--orange)", bg: "rgba(255,154,60,0.08)", border: "rgba(255,154,60,0.25)" },
                running_qualite:   { icon: "⚡",  label: "Qualité",   color: "var(--yellow)", bg: "rgba(0,122,255,0.06)",  border: "rgba(0,122,255,0.2)"  },
                hybride_compromis: { icon: "🔀",  label: "Hybride",   color: "var(--purple)", bg: "rgba(167,139,250,0.08)", border: "rgba(167,139,250,0.25)" },
              };
              const FILTER_CHIPS = [
                { id: "all",               label: "Toutes",  icon: "📋" },
                { id: "running_zone2",     label: "Zone 2",  icon: "🏃" },
                { id: "force_stations",    label: "Force",   icon: "🏋️" },
                { id: "running_qualite",   label: "Qualité", icon: "⚡"  },
                { id: "hybride_compromis", label: "Hybride", icon: "🔀" },
              ];
              const [journalFilter, setJournalFilter] = React.useState("all");
              const [expandedSessions, setExpandedSessions] = React.useState({});
              const allSessions = (profile.sessions||[]).slice().reverse();
              const filtered = journalFilter === "all" ? allSessions : allSessions.filter(s => s.type === journalFilter);
              const total = allSessions.length;
              return (
                <div style={{ marginBottom: 16 }}>
                  {/* Header */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                    <div style={{ fontSize: 11, color: "#555", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em" }}>Journal de séances</div>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <div style={{ fontSize: 12, color: "#777", fontWeight: 600 }}>{total}</div>
                      <div style={{ fontSize: 9, color: "#555", textTransform: "uppercase" }}>séances</div>
                    </div>
                  </div>

                  {total === 0 ? (
                    <div style={{ background: "rgba(0,0,0,0.02)", border: "1px dashed rgba(0,0,0,0.08)", borderRadius: 16, padding: "36px 20px", textAlign: "center" }}>
                      <div style={{ fontSize: 48, marginBottom: 12 }}>🏋️</div>
                      <div style={{ fontSize: 15, fontWeight: 700, color: "var(--white)", marginBottom: 6 }}>Aucune séance encore</div>
                      <div style={{ fontSize: 13, color: "#777", lineHeight: 1.6 }}>Lance ta première séance depuis l'onglet Aujourd'hui !</div>
                    </div>
                  ) : (
                    <>
                      {/* Résumé feeling bars */}
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 14 }}>
                        {[
                          { label: "Facile",  emoji: "😊", count: allSessions.filter(s=>s.ressenti==="facile").length, color: "var(--green)",  bg: "rgba(57,255,128,0.06)" },
                          { label: "Calibré", emoji: "💪", count: allSessions.filter(s=>s.ressenti==="bien").length,   color: "var(--yellow)", bg: "rgba(0,122,255,0.05)"  },
                          { label: "Dur",     emoji: "🔥", count: allSessions.filter(s=>s.ressenti==="dur").length,    color: "var(--red)",    bg: "rgba(255,71,71,0.06)"  },
                        ].map(item => (
                          <div key={item.label} style={{ background: item.bg, border: `1px solid ${item.color}22`, borderRadius: 12, padding: "12px 6px", textAlign: "center" }}>
                            <div style={{ fontSize: 20, marginBottom: 2 }}>{item.emoji}</div>
                            <div className="bebas" style={{ fontSize: 26, color: item.color, lineHeight: 1 }}>{item.count}</div>
                            <div style={{ fontSize: 9, color: "#777", marginTop: 2, textTransform: "uppercase", letterSpacing: "0.06em" }}>{item.label}</div>
                          </div>
                        ))}
                      </div>

                      {/* Filter chips */}
                      <div style={{ display: "flex", gap: 6, overflowX: "auto", paddingBottom: 4, marginBottom: 12, scrollbarWidth: "none" }}>
                        {FILTER_CHIPS.map(chip => {
                          const active = journalFilter === chip.id;
                          const conf = TYPE_CONF_J[chip.id];
                          const chipColor = conf ? conf.color : "var(--yellow)";
                          return (
                            <button key={chip.id} onClick={() => { haptic([6]); setJournalFilter(chip.id); }} style={{
                              flexShrink: 0, border: `1px solid ${active ? chipColor : "rgba(0,0,0,0.08)"}`,
                              borderRadius: 20, padding: "6px 12px", fontSize: 11, fontWeight: 700,
                              background: active ? `${chipColor}18` : "rgba(0,0,0,0.03)",
                              color: active ? chipColor : "#444",
                              transition: "all 0.18s var(--spring)",
                              display: "flex", alignItems: "center", gap: 5,
                            }}>
                              <span>{chip.icon}</span>
                              <span>{chip.label}</span>
                              {chip.id !== "all" && (
                                <span style={{ fontSize: 9, opacity: 0.7 }}>
                                  {allSessions.filter(s => s.type === chip.id).length}
                                </span>
                              )}
                            </button>
                          );
                        })}
                      </div>

                      {/* Session cards */}
                      {filtered.length === 0 ? (
                        <div style={{ textAlign: "center", padding: "24px 16px", color: "#777", fontSize: 13 }}>
                          Aucune séance de ce type pour l'instant.
                        </div>
                      ) : filtered.map((s, i) => {
                        const origIdx = allSessions.indexOf(s);
                        const num = total - origIdx;
                        const adapt = (profile.adaptations||[])[num - 1];
                        const conf = TYPE_CONF_J[s.type] || { icon: "💪", label: "Séance", color: "var(--white)", bg: "rgba(0,0,0,0.04)", border: "rgba(0,0,0,0.12)" };
                        const ressentiColor = s.ressenti === "bien" ? "var(--green)" : s.ressenti === "facile" ? "var(--yellow)" : s.ressenti === "dur" ? "var(--red)" : "#555";
                        const isExpanded = expandedSessions[num];
                        const rpeBar = (s.difficulte || 0) / 10;
                        return (
                          <div key={i} onClick={() => { setExpandedSessions(e => ({ ...e, [num]: !e[num] })); haptic([6]); }}
                            style={{ background: "rgba(0,0,0,0.02)", border: `1px solid ${isExpanded ? conf.color + "40" : "rgba(0,0,0,0.06)"}`, borderLeft: `3px solid ${conf.color}`, borderRadius: 16, padding: "14px 16px", marginBottom: 8, cursor: "pointer", transition: "all 0.2s var(--ease-out)" }}>
                            {/* Card header */}
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                              <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                                  <span style={{ fontSize: 15 }}>{conf.icon}</span>
                                  <span style={{ fontSize: 9, color: conf.color, fontWeight: 700, background: conf.bg, border: `1px solid ${conf.border}`, borderRadius: 8, padding: "1px 7px", textTransform: "uppercase", letterSpacing: "0.06em" }}>{conf.label}</span>
                                  <span style={{ fontSize: 9, color: "#555" }}>#{num}</span>
                                  <span style={{ fontSize: 9, color: "#555" }}>·</span>
                                  <span style={{ fontSize: 9, color: "#777" }}>{new Date(s.date).toLocaleDateString("fr-FR", { weekday: "short", day: "numeric", month: "short" })}</span>
                                </div>
                                <div style={{ fontWeight: 700, fontSize: 14, color: "var(--white)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: isExpanded ? "normal" : "nowrap" }}>{s.titre}</div>
                              </div>
                              <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0, marginLeft: 10 }}>
                                {s.difficulte && (
                                  <div style={{ textAlign: "center" }}>
                                    <div className="bebas" style={{ fontSize: 22, color: ressentiColor, lineHeight: 1 }}>{s.difficulte}<span style={{ fontSize: 9, color: "#555" }}>/10</span></div>
                                  </div>
                                )}
                                <div style={{ fontSize: 14, color: "#555", transition: "transform 0.2s", transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)" }}>▾</div>
                              </div>
                            </div>

                            {/* RPE bar */}
                            {s.difficulte && (
                              <div style={{ marginTop: 8, height: 3, background: "rgba(0,0,0,0.05)", borderRadius: 2, overflow: "hidden" }}>
                                <div style={{ height: "100%", width: `${rpeBar * 100}%`, background: ressentiColor, borderRadius: 2, transition: "width 0.4s var(--ease-out)" }} />
                              </div>
                            )}

                            {/* Pills row */}
                            <div style={{ display: "flex", gap: 5, flexWrap: "wrap", marginTop: 8 }}>
                              {s.tempsReel && <span style={{ fontSize: 9, color: "#555", background: "rgba(0,0,0,0.04)", borderRadius: 5, padding: "2px 7px" }}>⏱ {s.tempsReel}</span>}
                              {s.energie && <span style={{ fontSize: 9, color: "#555", background: "rgba(0,0,0,0.04)", borderRadius: 5, padding: "2px 7px" }}>⚡ {s.energie}/5</span>}
                              {s.ressenti && <span style={{ fontSize: 9, color: ressentiColor, background: `${ressentiColor}12`, borderRadius: 5, padding: "2px 7px", fontWeight: 700 }}>{s.ressenti === "bien" ? "Calibré" : s.ressenti === "facile" ? "Facile" : "Dur"}</span>}
                              {s.douleurs && s.douleurs !== "Aucune douleur" && <span style={{ fontSize: 9, color: "var(--red)", background: "rgba(255,71,71,0.08)", borderRadius: 5, padding: "2px 7px" }}>⚠️ {s.douleurs}</span>}
                            </div>

                            {/* Expanded details */}
                            {isExpanded && (
                              <div style={{ marginTop: 12, paddingTop: 12, borderTop: "1px solid rgba(0,0,0,0.05)", animation: "fadeIn 0.2s ease" }}>
                                {s.charges && (
                                  <div style={{ fontSize: 12, color: "#888", lineHeight: 1.6, marginBottom: 8 }}>
                                    <span style={{ fontSize: 10, color: "#555", fontWeight: 700, display: "block", marginBottom: 3, textTransform: "uppercase", letterSpacing: "0.06em" }}>Notes charges</span>
                                    {s.charges}
                                  </div>
                                )}
                                {(s.exercices||[]).length > 0 && (
                                  <div style={{ marginBottom: 8 }}>
                                    <div style={{ fontSize: 10, color: "#555", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>Exercices ({s.exercices.length})</div>
                                    {(s.exercices || []).filter(ex => ex?.nom || typeof ex === "string").slice(0,6).map((ex, ei) => (
                                      <div key={ei} style={{ display: "flex", alignItems: "center", gap: 8, padding: "4px 0", borderBottom: "1px solid rgba(0,0,0,0.03)" }}>
                                        <div style={{ width: 5, height: 5, borderRadius: "50%", background: conf.color, flexShrink: 0 }} />
                                        <div style={{ fontSize: 12, color: "#aaa", flex: 1 }}>{typeof ex === "string" ? ex : ex.label || ex.nom || JSON.stringify(ex)}</div>
                                      </div>
                                    ))}
                                  </div>
                                )}
                                {adapt && (
                                  <div style={{ background: "rgba(0,122,255,0.05)", border: "1px solid rgba(0,122,255,0.12)", borderRadius: 10, padding: "8px 12px", fontSize: 11, color: "var(--yellow)", lineHeight: 1.5 }}>
                                    🤖 <strong>Adaptation IA :</strong> {adapt.adaptation}
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </>
                  )}
                </div>
              );
            })()}

            {/* ── BENCHMARK STATIONS HYROX ── */}
            {(()=>{
              const BENCH_STATIONS = [
                { id: "ski",      icon: "⛷️",  label: "SkiErg",          dist: "1000m",   refH: "3:30", refF: "4:30", refEliteH: "3:00", color: "#a78bfa" },
                { id: "sledpush", icon: "🛷",  label: "Sled Push",       dist: "50m",     refH: "1:45", refF: "2:15", refEliteH: "1:20", color: "var(--yellow)" },
                { id: "sledpull", icon: "🔗",  label: "Sled Pull",       dist: "50m",     refH: "1:30", refF: "2:00", refEliteH: "1:10", color: "var(--orange)" },
                { id: "burpee",   icon: "🤸",  label: "Burpee BJ",       dist: "80m",     refH: "2:30", refF: "3:00", refEliteH: "2:00", color: "var(--red)" },
                { id: "rowing",   icon: "🚣",  label: "Rowing",          dist: "1000m",   refH: "3:40", refF: "4:30", refEliteH: "3:10", color: "#38bdf8" },
                { id: "farmers",  icon: "🧳",  label: "Farmers Carry",   dist: "200m",    refH: "1:30", refF: "2:00", refEliteH: "1:05", color: "var(--green)" },
                { id: "sandbag",  icon: "🎒",  label: "Sandbag Lunges",  dist: "100m",    refH: "3:20", refF: "4:10", refEliteH: "2:40", color: "var(--orange)" },
                { id: "wallball", icon: "🏀",  label: "Wall Balls",      dist: "100 reps",refH: "4:00", refF: "5:00", refEliteH: "3:20", color: "var(--yellow)" },
              ];
              const benchKey = `fitrace_benchmarks_${profile.name}`;
              const [benchmarks, setBenchmarks] = React.useState({});
              const [editingStation, setEditingStation] = React.useState(null);
              const [editMin, setEditMin] = React.useState("");
              const [editSec, setEditSec] = React.useState("");

              React.useEffect(() => {
                storage.get(benchKey).then(b => { if (b) setBenchmarks(b); });
              }, []);

              const saveBench = async (id, min, sec) => {
                const timeStr = `${String(min).padStart(2,"0")}:${String(sec).padStart(2,"0")}`;
                const updated = { ...benchmarks, [id]: { time: timeStr, date: new Date().toISOString().split("T")[0] } };
                setBenchmarks(updated);
                await storage.set(benchKey, updated);
                setEditingStation(null);
              };

              const timeToSecs = (t) => {
                if (!t) return null;
                const [m, s] = t.split(":").map(Number);
                return m * 60 + (s || 0);
              };

              const refToSecs = (ref) => timeToSecs(ref);

              const gender = (profile.sexe === "femme" || profile.sexe === "F") ? "F" : "H";

              return (
                <div style={{ marginBottom: 16 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                    <div style={{ fontSize: 11, color: "#555", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em" }}>🏁 Benchmarks Stations</div>
                    <div style={{ fontSize: 9, color: "#555" }}>{Object.keys(benchmarks).length}/8 renseignés</div>
                  </div>

                  {/* Entry modal */}
                  {editingStation && (
                    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.9)", zIndex: 500, display: "flex", alignItems: "flex-end" }}
                      onClick={() => setEditingStation(null)}>
                      <div className="slide-up" onClick={e => e.stopPropagation()}
                        style={{ background: "var(--bg2)", borderRadius: "20px 20px 0 0", padding: "24px 20px 40px", width: "100%", maxWidth: 480, margin: "0 auto" }}>
                        <div style={{ width: 40, height: 4, borderRadius: 99, background: "#333", margin: "0 auto 20px" }} />
                        {(() => {
                          const st = BENCH_STATIONS.find(s => s.id === editingStation);
                          return (
                            <>
                              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
                                <span style={{ fontSize: 28 }}>{st.icon}</span>
                                <div>
                                  <div style={{ fontSize: 10, color: st.color, fontWeight: 700, textTransform: "uppercase" }}>{st.dist}</div>
                                  <div style={{ fontSize: 18, fontWeight: 700, color: "var(--white)" }}>{st.label}</div>
                                </div>
                              </div>
                              <div style={{ fontSize: 11, color: "#555", marginBottom: 12 }}>
                                Ref. open {gender === "F" ? "femme" : "homme"}: <strong style={{ color: "#888" }}>{gender === "H" ? st.refH : st.refF}</strong> · Élite: <strong style={{ color: st.color }}>{st.refEliteH}</strong>
                              </div>
                              <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 20 }}>
                                <div style={{ flex: 1 }}>
                                  <div style={{ fontSize: 10, color: "#555", marginBottom: 6 }}>Minutes</div>
                                  <input type="number" min="0" max="30" value={editMin} onChange={e => setEditMin(e.target.value)}
                                    placeholder="ex: 3" style={{ width: "100%", background: "var(--bg3)", border: "1.5px solid rgba(0,0,0,0.08)", borderRadius: 12, padding: "14px", color: "var(--white)", fontSize: 20, textAlign: "center", outline: "none", fontFamily: "'Bebas Neue',sans-serif" }} />
                                </div>
                                <div style={{ fontSize: 24, color: "#555", marginTop: 20 }}>:</div>
                                <div style={{ flex: 1 }}>
                                  <div style={{ fontSize: 10, color: "#555", marginBottom: 6 }}>Secondes</div>
                                  <input type="number" min="0" max="59" value={editSec} onChange={e => setEditSec(String(Math.min(59, parseInt(e.target.value)||0)).padStart(2,"0"))}
                                    placeholder="ex: 45" style={{ width: "100%", background: "var(--bg3)", border: "1.5px solid rgba(0,0,0,0.08)", borderRadius: 12, padding: "14px", color: "var(--white)", fontSize: 20, textAlign: "center", outline: "none", fontFamily: "'Bebas Neue',sans-serif" }} />
                                </div>
                              </div>
                              <button onClick={() => saveBench(editingStation, parseInt(editMin)||0, parseInt(editSec)||0)}
                                disabled={!editMin}
                                style={{ width: "100%", padding: 16, background: editMin ? st.color : "rgba(0,0,0,0.05)", border: "none", borderRadius: 14, fontSize: 16, fontFamily: "'Bebas Neue',sans-serif", letterSpacing: 1.5, color: editMin ? "#000" : "#333", cursor: editMin ? "pointer" : "default" }}>
                                💾 ENREGISTRER MON TEMPS
                              </button>
                            </>
                          );
                        })()}
                      </div>
                    </div>
                  )}

                  {/* Station cards */}
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {BENCH_STATIONS.map(st => {
                      const bench = benchmarks[st.id];
                      const mySecs = bench ? timeToSecs(bench.time) : null;
                      const refSecs = timeToSecs(gender === "H" ? st.refH : st.refF);
                      const eliteSecs = timeToSecs(st.refEliteH);
                      const diffVsRef = mySecs !== null && refSecs ? refSecs - mySecs : null; // positive = better than ref
                      const pctOfElite = mySecs !== null && eliteSecs ? Math.round((eliteSecs / mySecs) * 100) : null;
                      return (
                        <div key={st.id} onClick={() => { haptic([6]); setEditingStation(st.id); if (bench) { const [m,s] = bench.time.split(":"); setEditMin(m); setEditSec(s); } else { setEditMin(""); setEditSec(""); } }}
                          style={{ background: bench ? `${st.color}07` : "rgba(0,0,0,0.02)", border: `1px solid ${bench ? st.color + "30" : "rgba(0,0,0,0.06)"}`, borderLeft: `3px solid ${bench ? st.color : "rgba(0,0,0,0.08)"}`, borderRadius: 14, padding: "12px 14px", cursor: "pointer", transition: "all 0.18s" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                            <span style={{ fontSize: 20, flexShrink: 0 }}>{st.icon}</span>
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                                <div>
                                  <div style={{ fontSize: 12, fontWeight: 700, color: "var(--white)" }}>{st.label}</div>
                                  <div style={{ fontSize: 9, color: "#777", marginTop: 1 }}>{st.dist}</div>
                                </div>
                                <div style={{ textAlign: "right" }}>
                                  {bench ? (
                                    <>
                                      <div className="bebas" style={{ fontSize: 22, color: st.color, lineHeight: 1 }}>{bench.time}</div>
                                      {diffVsRef !== null && (
                                        <div style={{ fontSize: 9, color: diffVsRef > 0 ? "var(--green)" : diffVsRef < -5 ? "var(--red)" : "var(--orange)", fontWeight: 700 }}>
                                          {diffVsRef > 0 ? `−${diffVsRef}s vs ref` : `+${Math.abs(diffVsRef)}s vs ref`}
                                        </div>
                                      )}
                                    </>
                                  ) : (
                                    <div style={{ fontSize: 10, color: "#555", fontStyle: "italic" }}>Tap pour saisir →</div>
                                  )}
                                </div>
                              </div>
                              {/* Progress bar vs ref */}
                              {bench && refSecs && eliteSecs && (
                                <div style={{ marginTop: 8 }}>
                                  <div style={{ height: 4, background: "rgba(0,0,0,0.05)", borderRadius: 99, overflow: "visible", position: "relative" }}>
                                    {/* Elite marker */}
                                    <div style={{ position: "absolute", top: -2, left: `${Math.min(98, (eliteSecs / refSecs) * 100)}%`, width: 2, height: 8, background: st.color, borderRadius: 1 }} />
                                    {/* My bar */}
                                    <div style={{ height: "100%", width: `${Math.min(100, (mySecs / refSecs) * 100)}%`, background: mySecs <= eliteSecs ? st.color : mySecs <= refSecs ? "var(--yellow)" : "var(--orange)", borderRadius: 99, transition: "width 0.5s" }} />
                                  </div>
                                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 8, color: "#222", marginTop: 3 }}>
                                    <span>0:00</span>
                                    <span style={{ color: st.color }}>Élite {st.refEliteH}</span>
                                    <span>Ref {gender === "H" ? st.refH : st.refF}</span>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })()}

            {/* ── INSIGHTS IA — observations intelligentes ── */}
            {(profile.sessions||[]).length >= 2 && (() => {
              const sessions = profile.sessions || [];
              const last5 = sessions.slice(-5);
              const insights = [];

              // Insight 1: tendance RPE
              const last3RPE = last5.slice(-3).map(s => s.difficulte||5);
              const avgLast3 = last3RPE.reduce((a,b)=>a+b,0)/last3RPE.length;
              const first3 = sessions.slice(0,3).map(s=>s.difficulte||5);
              const avgFirst3 = first3.reduce((a,b)=>a+b,0)/first3.length;
              if (avgFirst3 - avgLast3 >= 1.5) insights.push({ icon: "📈", color: "var(--green)", title: "Tu progresses en endurance", body: `Tes dernières séances sont à RPE ${avgLast3.toFixed(1)} vs ${avgFirst3.toFixed(1)} au début. L'entraînement porte ses fruits.` });
              else if (avgLast3 - avgFirst3 >= 1.5) insights.push({ icon: "⚠️", color: "var(--orange)", title: "Fatigue accumulée détectée", body: `RPE moyen en hausse : ${avgFirst3.toFixed(1)} → ${avgLast3.toFixed(1)}. Pense à intégrer une semaine de récupération.` });

              // Insight 2: mix de séances
              const types = sessions.reduce((a,s)=>({...a,[s.type]:(a[s.type]||0)+1}),{});
              const zone2Pct = (types.running_zone2||0)/sessions.length;
              if (zone2Pct < 0.3 && sessions.length >= 5) insights.push({ icon: "🏃", color: "#38bdf8", title: "Manque de cardio Zone 2", body: "Seulement " + Math.round(zone2Pct*100) + "% de tes séances sont en Zone 2. Les pros visent 70-80%. C'est la base de ta progression HYROX." });

              // Insight 3: régularité
              const weekDates = [...new Set(sessions.map(s=>{ const d=new Date(s.date); d.setDate(d.getDate()-((d.getDay()||7)-1)); return d.toISOString().slice(0,10); }))];
              if (weekDates.length >= 3) {
                const goal = profile.seancesParSemaine || 4;
                const perWeek = sessions.length / weekDates.length;
                if (perWeek >= goal * 0.9) insights.push({ icon: "🔥", color: "var(--yellow)", title: "Régularité exemplaire !", body: `Moyenne de ${perWeek.toFixed(1)} séances/semaine sur ${weekDates.length} semaines. C'est exactement ce qu'il faut pour progresser.` });
                else if (perWeek < goal * 0.6) insights.push({ icon: "📅", color: "var(--orange)", title: "Augmente la fréquence", body: `Tu fais ${perWeek.toFixed(1)} séances/semaine sur ${weekDates.length} semaines (objectif: ${goal}). La régularité est + importante que l'intensité.` });
              }

              // Insight 4: dernière session
              const last = sessions[sessions.length-1];
              if (last) {
                const daysSince = Math.round((Date.now()-new Date(last.date))/86400000);
                if (daysSince >= 5) insights.push({ icon: "⏰", color: "var(--red)", title: "Longue pause détectée", body: `${daysSince} jours depuis ta dernière séance. Une interruption > 5j impacte la condition physique. Reprends avec une séance légère.` });
                else if (daysSince === 0) insights.push({ icon: "💪", color: "var(--green)", title: "Séance faite aujourd'hui !", body: `${last.titre || "Séance"} terminée (RPE ${last.difficulte||"?"}). Hydrate-toi bien et dors 8h pour maximiser la récupération.` });
              }

              if (insights.length === 0) return null;
              return (
                <div style={{ marginBottom: 16 }}>
                  <div style={{ fontSize: 11, color: "#777", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 10 }}>🤖 Insights de ton coach</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {insights.map((ins, i) => (
                      <div key={i} className="slide-up" style={{ animationDelay: `${i*0.08}s`, background: `${ins.color}08`, border: `1px solid ${ins.color}20`, borderLeft: `3px solid ${ins.color}60`, borderRadius: 14, padding: "12px 14px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                          <span style={{ fontSize: 16 }}>{ins.icon}</span>
                          <span style={{ fontSize: 12, fontWeight: 700, color: ins.color }}>{ins.title}</span>
                        </div>
                        <p style={{ fontSize: 11, color: "#888", lineHeight: 1.6, margin: 0 }}>{ins.body}</p>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })()}

            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 11, color: "#555", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 12 }}>Adaptations IA</div>
              {(profile.adaptations || []).length === 0 ? (
                <div style={{ background: "rgba(0,0,0,0.02)", border: "1px dashed rgba(0,0,0,0.06)", borderRadius: 12, padding: "20px", textAlign: "center", fontSize: 13, color: "#777" }}>🤖 Pas encore d'adaptations IA.</div>
              ) : (
                (profile.adaptations || []).slice(-5).reverse().map((a, i) => (
                  <div key={i} style={{ background: "rgba(57,255,128,0.03)", border: "1px solid rgba(57,255,128,0.1)", borderLeft: "3px solid rgba(57,255,128,0.4)", borderRadius: 12, padding: "12px 14px", marginBottom: 8 }}>
                    <div style={{ fontSize: 12, color: "#aaa", lineHeight: 1.6, marginBottom: 6 }}>{a.message}</div>
                    <div style={{ fontSize: 12, color: "var(--green)", fontWeight: 600 }}>→ {a.adaptation}</div>
                    <div style={{ fontSize: 10, color: "#555", marginTop: 4 }}>{new Date(a.date).toLocaleDateString("fr-FR")}</div>
                  </div>
                ))
              )}
            </div>
          </div>

        {/* ZONES — toujours rendu */}
        <div style={{display: tab === "zones" ? "block" : "none"}} className="fade-in">
            {/* Header */}
            <div style={{ marginBottom: 16 }}>
              <div className="bebas" style={{ fontSize: 28, color: "var(--green)", letterSpacing: 1, marginBottom: 2 }}>ZONES D'ENTRAÎNEMENT</div>
              <div style={{ fontSize: 12, color: "#777" }}>Basé sur ta VMA · {profile.vmaKmh ? `${profile.vmaKmh} km/h` : "VMA non renseignée"}</div>
            </div>

            {profile.vmaKmh ? (
              <>
                {/* FC info card */}
                {profile.fcMax && profile.fcMin && (
                  <div style={{ background: "rgba(255,71,71,0.05)", border: "1px solid rgba(255,71,71,0.15)", borderRadius: 14, padding: "12px 16px", marginBottom: 14, display: "flex", gap: 16 }}>
                    <div style={{ textAlign: "center" }}>
                      <div className="bebas" style={{ fontSize: 24, color: "var(--red)", lineHeight: 1 }}>{profile.fcMax}</div>
                      <div style={{ fontSize: 9, color: "#777", textTransform: "uppercase", marginTop: 2 }}>FC max</div>
                    </div>
                    <div style={{ width: 1, background: "rgba(0,0,0,0.06)" }} />
                    <div style={{ textAlign: "center" }}>
                      <div className="bebas" style={{ fontSize: 24, color: "#888", lineHeight: 1 }}>{profile.fcMin}</div>
                      <div style={{ fontSize: 9, color: "#777", textTransform: "uppercase", marginTop: 2 }}>FC repos</div>
                    </div>
                    <div style={{ flex: 1, display: "flex", alignItems: "center" }}>
                      <div style={{ fontSize: 11, color: "#777" }}>Méthode Karvonen · FC de réserve {parseInt(profile.fcMax) - parseInt(profile.fcMin)} bpm</div>
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
                              <div style={{ fontSize: 11, color: "#777", marginTop: 1 }}>{zoneDescs[idx]}</div>
                            </div>
                          </div>
                          <div style={{ textAlign: "right" }}>
                            <div className="bebas" style={{ fontSize: 20, color: col, lineHeight: 1 }}>{paceFromVMA(profile.vmaKmh, midPct)}</div>
                            <div style={{ fontSize: 10, color: "#777" }}>min/km</div>
                          </div>
                        </div>
                        {/* Barre d'intensité */}
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <div style={{ flex: 1, height: 4, background: "rgba(0,0,0,0.04)", borderRadius: 99, position: "relative", overflow: "hidden" }}>
                            <div style={{ position: "absolute", left: `${z.pct[0]}%`, width: `${barWidth}%`, height: "100%", background: col, borderRadius: 99 }} />
                          </div>
                          <div style={{ fontSize: 10, color: "#777", flexShrink: 0 }}>{z.pct[0]}–{z.pct[1]}%</div>
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
                            <div style={{ fontSize: 9, color: "#555", marginTop: 3 }}>kg</div>
                            <div style={{ fontSize: 10, color: "#777", marginTop: 1, fontWeight: 700 }}>{pct}%</div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
                {/* Calculateur pace HYROX */}
                {(profile.vmaKmh || profile.squat1RM_final) && <PaceCalcWidget profile={profile} />}
              </>
            ) : (
              <div style={{ background: "rgba(0,0,0,0.02)", border: "1px dashed rgba(0,0,0,0.08)", borderRadius: 16, padding: "40px 20px", textAlign: "center" }}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>🏃</div>
                <div style={{ fontSize: 14, color: "#555", lineHeight: 1.6 }}>Complète le test VMA pour calculer tes zones.</div>
              </div>
            )}
          </div>

        {/* COURSE & TECHNIQUE */}
        {tab === "nutri" && <NutritionTab profile={profile} />}
        {tab === "technique" && <TechniqueTab profile={profile} />}
        {tab === "profil" && <ProfilTab profile={profile} onUpdateProfile={onUpdateProfile} onLogout={onLogout} installPrompt={installPrompt} isInstalled={isInstalled} isIOS={isIOS} triggerInstall={triggerInstall} notifGranted={notifGranted} requestNotifPermission={requestNotifPermission} />}
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

        {/* FORME TAB */}
        {tab === "forme" && (()=>{
          const recovery = calcRecoveryScore(dailyData, profile);
          const recov = recoveryLabel(recovery);
          const hrv = parseInt(dailyData.hrv)||0;
          const hrvColor = hrv>=70?"var(--green)":hrv>=55?"var(--yellow)":hrv>=40?"var(--orange)":hrv>0?"var(--red)":"#444";
          const hrvLabel = hrv>=70?"Excellent":hrv>=55?"Bon":hrv>=40?"Modéré":hrv>0?"Bas":"";
          return (
            <div className="fade-in" style={{ padding: "0 16px 100px" }}>
              {/* Header */}
              <div style={{ paddingTop: 20, marginBottom: 20, display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                <div>
                  <div className="bebas" style={{ fontSize: 28, color: "var(--white)", letterSpacing: 1 }}>FORME DU JOUR</div>
                  <div style={{ fontSize: 12, color: "#777", marginTop: 2 }}>
                    {new Date().toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" })}
                  </div>
                </div>
                <div style={{ fontSize: 10, color: "var(--green)", fontWeight: 700, display: "flex", alignItems: "center", gap: 4, opacity: 0.8 }}>
                  <div style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--green)" }} />
                  Sync auto
                </div>
              </div>

              {/* Recovery ring */}
              <div style={{ marginBottom: 16, padding: "18px 20px", background: "rgba(0,0,0,0.02)", border: "1px solid rgba(0,0,0,0.07)", borderRadius: 18, display: "flex", alignItems: "center", gap: 18 }}>
                <div style={{ position: "relative", width: 72, height: 72, flexShrink: 0 }}>
                  <svg width="72" height="72" viewBox="0 0 72 72">
                    <circle cx="36" cy="36" r="30" fill="none" stroke="rgba(0,0,0,0.06)" strokeWidth="7"/>
                    <circle cx="36" cy="36" r="30" fill="none" stroke={recov.color} strokeWidth="7"
                      strokeDasharray={`${(recovery/100)*188.5} 188.5`} strokeLinecap="round"
                      transform="rotate(-90 36 36)" style={{ transition: "stroke-dasharray 0.6s ease" }}/>
                  </svg>
                  <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                    <span className="bebas" style={{ fontSize: 22, color: recov.color, lineHeight: 1 }}>{recovery}</span>
                    <span style={{ fontSize: 8, color: "#777", fontWeight: 700, textTransform: "uppercase" }}>/ 100</span>
                  </div>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 11, color: "#777", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 4 }}>Score de récupération</div>
                  <div className="bebas" style={{ fontSize: 20, color: recov.color, letterSpacing: 1, marginBottom: 2 }}>{recov.label}</div>
                  <div style={{ fontSize: 11, color: "#555", lineHeight: 1.4 }}>{recov.conseil}</div>
                </div>
              </div>

              {/* Fatigue physique */}
              <div style={{ marginBottom: 12 }}>
                <div style={{ fontSize: 11, color: "#555", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 10 }}>Fatigue physique</div>
                <div style={{ display: "flex", gap: 6 }}>
                  {[
                    { v: 1, emoji: "😴", label: "Fatigué", color: "var(--red)" },
                    { v: 2, emoji: "😐", label: "Moyen", color: "var(--orange)" },
                    { v: 3, emoji: "😊", label: "Bien", color: "var(--yellow)" },
                    { v: 4, emoji: "🔥", label: "Frais", color: "var(--green)" },
                  ].map(f => (
                    <button key={f.v} onClick={() => { haptic([6]); setDailyData(d => ({ ...d, fatigue: f.v })); }} style={{
                      flex: 1, padding: "10px 4px", borderRadius: 12, textAlign: "center",
                      background: dailyData.fatigue === f.v ? `${f.color}15` : "rgba(0,0,0,0.02)",
                      border: dailyData.fatigue === f.v ? `2px solid ${f.color}` : "1.5px solid rgba(0,0,0,0.06)",
                      color: "var(--white)", cursor: "pointer", transition: "all 0.18s",
                    }}>
                      <div style={{ fontSize: 22 }}>{f.emoji}</div>
                      <div style={{ fontSize: 9, marginTop: 4, color: dailyData.fatigue === f.v ? f.color : "#444", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em" }}>{f.label}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Score de sommeil */}
              <div style={{ marginBottom: 12 }}>
                <div style={{ fontSize: 11, color: "#555", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 10 }}>Qualité du sommeil</div>
                <div style={{ display: "flex", gap: 6 }}>
                  {[
                    { v: 1, emoji: "💤", label: "Mauvais", color: "var(--red)" },
                    { v: 2, emoji: "😐", label: "Moyen", color: "var(--orange)" },
                    { v: 3, emoji: "🙂", label: "Bon", color: "var(--yellow)" },
                    { v: 4, emoji: "⭐", label: "Excellent", color: "var(--green)" },
                  ].map(s => (
                    <button key={s.v} onClick={() => { haptic([6]); setDailyData(d => ({ ...d, sommeil: s.v })); }} style={{
                      flex: 1, padding: "10px 4px", borderRadius: 12, textAlign: "center",
                      background: dailyData.sommeil === s.v ? `${s.color}15` : "rgba(0,0,0,0.02)",
                      border: dailyData.sommeil === s.v ? `2px solid ${s.color}` : "1.5px solid rgba(0,0,0,0.06)",
                      color: "var(--white)", cursor: "pointer", transition: "all 0.18s",
                    }}>
                      <div style={{ fontSize: 22 }}>{s.emoji}</div>
                      <div style={{ fontSize: 9, marginTop: 4, color: dailyData.sommeil === s.v ? s.color : "#444", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em" }}>{s.label}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Heures de sommeil */}
              <div style={{ marginBottom: 16, padding: "14px 16px", background: "rgba(0,0,0,0.02)", border: "1px solid rgba(0,0,0,0.07)", borderRadius: 14 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                  <div style={{ fontSize: 11, color: "#555", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em" }}>Heures de sommeil</div>
                  <div className="bebas" style={{ fontSize: 22, color: parseFloat(dailyData.sleepHours) >= 8 ? "var(--green)" : parseFloat(dailyData.sleepHours) >= 7 ? "var(--yellow)" : "var(--orange)" }}>{dailyData.sleepHours}h</div>
                </div>
                <input type="range" min="4" max="10" step="0.5" value={dailyData.sleepHours}
                  onChange={e => setDailyData(d => ({ ...d, sleepHours: parseFloat(e.target.value) }))}
                  style={{ width: "100%", accentColor: "var(--yellow)" }} />
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 9, color: "#555", marginTop: 4 }}>
                  <span>4h</span><span>6h</span><span style={{ color: "var(--yellow)" }}>8h ✓</span><span>10h</span>
                </div>
              </div>

              {/* Hydratation */}
              <div style={{ marginBottom: 16, padding: "14px 16px", background: "rgba(0,0,0,0.02)", border: "1px solid rgba(0,0,0,0.07)", borderRadius: 14 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                  <div style={{ fontSize: 11, color: "#555", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em" }}>Hydratation</div>
                  <div className="bebas" style={{ fontSize: 22, color: dailyData.hydration >= 8 ? "var(--green)" : dailyData.hydration >= 5 ? "var(--yellow)" : "#555" }}>{dailyData.hydration}/8</div>
                </div>
                <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
                  {Array.from({ length: 8 }, (_, i) => (
                    <button key={i} onClick={() => { haptic([6]); setDailyData(d => ({ ...d, hydration: i < d.hydration ? i : i + 1 })); }}
                      style={{ width: 36, height: 36, borderRadius: 10, border: `1.5px solid ${i < dailyData.hydration ? "rgba(56,189,248,0.6)" : "rgba(0,0,0,0.08)"}`, background: i < dailyData.hydration ? "rgba(56,189,248,0.15)" : "rgba(0,0,0,0.03)", fontSize: 16, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.15s var(--spring)" }}>
                      {i < dailyData.hydration ? "💧" : "○"}
                    </button>
                  ))}
                </div>
                <div style={{ fontSize: 10, color: "#555", marginTop: 8 }}>Objectif : 8 verres / 2L par jour</div>
              </div>

              {/* Poids du jour */}
              <div style={{ marginBottom: 16, padding: "14px 16px", background: "rgba(0,0,0,0.02)", border: "1px solid rgba(0,0,0,0.07)", borderRadius: 14 }}>
                <div style={{ fontSize: 11, color: "#555", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 10 }}>Poids du jour (kg)</div>
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <input type="number" step="0.1" min="40" max="150"
                    value={dailyData.poidsJour}
                    onChange={e => setDailyData(d => ({ ...d, poidsJour: e.target.value }))}
                    placeholder={`${profile.poids || 75} kg`}
                    style={{ flex: 1, background: "rgba(0,0,0,0.05)", border: "1.5px solid rgba(0,0,0,0.08)", borderRadius: 12, padding: "12px 16px", color: "var(--white)", fontSize: 16, outline: "none", fontFamily: "'DM Sans', sans-serif" }} />
                  <div style={{ fontSize: 12, minWidth: 52, textAlign: "right" }}>
                    {dailyData.poidsJour && profile.poids ? (
                      <span style={{ color: parseFloat(dailyData.poidsJour) <= parseFloat(profile.poids) ? "var(--green)" : "var(--orange)", fontWeight: 700 }}>
                        {parseFloat(dailyData.poidsJour) <= parseFloat(profile.poids) ? "↓" : "↑"} {Math.abs(parseFloat(dailyData.poidsJour) - parseFloat(profile.poids)).toFixed(1)}kg
                      </span>
                    ) : <span style={{ color: "#555", fontSize: 10 }}>vs profil</span>}
                  </div>
                </div>
              </div>

              {/* HRV */}
              <div style={{ marginBottom: 16, padding: "14px 16px", background: "rgba(0,0,0,0.02)", border: "1px solid rgba(0,0,0,0.07)", borderRadius: 14 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                  <div>
                    <div style={{ fontSize: 11, color: "#555", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em" }}>VFC matin (ms)</div>
                    <div style={{ fontSize: 9, color: "#555", marginTop: 2 }}>Variabilité cardiaque au réveil</div>
                  </div>
                  {hrv > 0 && <div style={{ textAlign: "right" }}>
                    <div className="bebas" style={{ fontSize: 22, color: hrvColor, lineHeight: 1 }}>{hrv}</div>
                    <div style={{ fontSize: 9, color: hrvColor, fontWeight: 700, textTransform: "uppercase" }}>{hrvLabel}</div>
                  </div>}
                </div>
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <input type="number" min="20" max="120" step="1"
                    value={dailyData.hrv}
                    onChange={e => { haptic([4]); setDailyData(d => ({ ...d, hrv: e.target.value })); }}
                    placeholder="Ex: 65"
                    style={{ flex: 1, background: "rgba(0,0,0,0.05)", border: `1.5px solid ${hrv>0?hrvColor+"40":"rgba(0,0,0,0.08)"}`, borderRadius: 12, padding: "12px 16px", color: "var(--white)", fontSize: 16, outline: "none", fontFamily: "'DM Sans', sans-serif" }} />
                  <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                    {[{r:"<40",l:"Bas",c:"var(--red)"},{r:"40-55",l:"Modéré",c:"var(--orange)"},{r:"55-70",l:"Bon",c:"var(--yellow)"},{r:">70",l:"Top",c:"var(--green)"}].map(z=>(
                      <div key={z.r} style={{ fontSize: 8, color: z.c, lineHeight: 1.2 }}>{z.r} {z.l}</div>
                    ))}
                  </div>
                </div>
                {hrv > 0 && (
                  <div style={{ marginTop: 8, padding: "8px 12px", borderRadius: 10, background: `${hrvColor}10`, border: `1px solid ${hrvColor}20`, fontSize: 10, color: hrvColor }}>
                    {hrv>=70?"Récupération optimale — séance intense possible":hrv>=55?"Bonne forme — entraînement normal recommandé":hrv>=40?"Fatigue modérée — réduis l'intensité aujourd'hui":"VFC basse — privilégie la récupération active"}
                  </div>
                )}
              </div>

              {/* Nutrition */}
              <button onClick={() => setTab("nutri")} style={{ width: "100%", marginBottom: 16, display: "flex", alignItems: "center", gap: 14, padding: "14px 16px", background: "rgba(0,0,0,0.02)", border: "1px solid rgba(0,0,0,0.07)", borderRadius: 14, cursor: "pointer", textAlign: "left" }}>
                <div style={{ width: 40, height: 40, borderRadius: 12, background: "rgba(255,154,60,0.12)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>🥗</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "var(--white)" }}>Nutrition</div>
                  <div style={{ fontSize: 11, color: "#777", marginTop: 1 }}>Voir mon plan nutritionnel</div>
                </div>
                <div style={{ fontSize: 16, color: "#555" }}>›</div>
              </button>

              {/* Planning */}
              <button onClick={() => setTab("planning")} style={{ width: "100%", marginBottom: 16, display: "flex", alignItems: "center", gap: 14, padding: "14px 16px", background: "rgba(0,0,0,0.02)", border: "1px solid rgba(0,0,0,0.07)", borderRadius: 14, cursor: "pointer", textAlign: "left" }}>
                <div style={{ width: 40, height: 40, borderRadius: 12, background: "rgba(167,139,250,0.12)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>📅</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "var(--white)" }}>Planning de la semaine</div>
                  <div style={{ fontSize: 11, color: "#777", marginTop: 1 }}>Voir mon programme hebdo</div>
                </div>
                <div style={{ fontSize: 16, color: "#555" }}>›</div>
              </button>

              {/* Bouton Enregistrer */}
              <button onClick={async () => {
                haptic([10, 30, 10]);
                const key = getDailyLogKey(profile.name, todayStr);
                const existing = await storage.get(key) || {};
                await storage.set(key, { ...existing, ...dailyData, savedAt: new Date().toISOString() });
                showToast("Forme enregistrée ✓");
              }} style={{
                width: "100%", padding: "16px", borderRadius: 16, background: "var(--yellow)",
                border: "none", cursor: "pointer", fontFamily: "'Bebas Neue',sans-serif",
                fontSize: 18, letterSpacing: 1.5, color: "#000", marginBottom: 8,
              }}>
                ENREGISTRER MA FORME
              </button>
            </div>
          );
        })()}

        {/* PROFIL */}
        {tab === "profil" && <ProfilTab profile={profile} onUpdateProfile={onUpdateProfile} onLogout={onLogout} installPrompt={installPrompt} isInstalled={isInstalled} isIOS={isIOS} triggerInstall={triggerInstall} notifGranted={notifGranted} requestNotifPermission={requestNotifPermission} />}

      </div>

      {/* Floating Coach Chat Button */}
      {!showCoachChat && (
        <button
          onClick={() => setShowCoachChat(true)}
          style={{
            position: "fixed", bottom: 80, right: 16, zIndex: 99,
            width: 42, height: 42, borderRadius: "50%",
            background: "#FFFFFF", border: "1px solid rgba(0,0,0,0.1)",
            fontSize: 15, cursor: "pointer", backdropFilter: "blur(16px)",
            display: "flex", alignItems: "center", justifyContent: "center", color: "#666",
            boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
          }}
          title="Coach IA"
        >✦</button>
      )}

      {/* Swipe hint */}
      {showSwipeHint && (
        <div style={{ position: "fixed", bottom: 92, left: "50%", transform: "translateX(-50%)", zIndex: 99, animation: "slideUp 0.4s var(--ease-out) 1.5s both", pointerEvents: "none" }}>
          <div style={{ background: "rgba(0,122,255,0.9)", borderRadius: 20, padding: "6px 14px", display: "flex", alignItems: "center", gap: 8, fontSize: 11, color: "#000", fontWeight: 700, backdropFilter: "blur(8px)", whiteSpace: "nowrap" }}>
            <span style={{ animation: "pulse 1.5s ease infinite" }}>←</span> Glisse pour naviguer <span style={{ animation: "pulse 1.5s 0.3s ease infinite" }}>→</span>
          </div>
        </div>
      )}

      {/* ── QUICK LOG FAB ── */}
      <button onClick={() => { haptic([10,20,10]); setShowQuickLog(s => !s); }}
        style={{ position: "fixed", bottom: 80, left: 16, zIndex: 98, width: 42, height: 42, borderRadius: "50%", background: "#FFFFFF", border: "1px solid rgba(0,0,0,0.1)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, color: "#666", backdropFilter: "blur(16px)", boxShadow: "0 4px 20px rgba(0,0,0,0.4)", transition: "all 0.2s var(--spring)", transform: showQuickLog ? "rotate(45deg)" : "rotate(0)" }}>
        {showQuickLog ? "✕" : "+"}
      </button>

      {/* Quick Log Modal */}
      {showQuickLog && <QuickLogModal dailyData={dailyData} setDailyData={setDailyData} setShowQuickLog={setShowQuickLog} showToast={showToast} haptic={haptic} profile={profile} />}

      {/* Bottom Nav — Premium */}
      <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 100 }}>
        <div style={{ height: 16, background: "linear-gradient(to top, rgba(245,245,247,1), transparent)", pointerEvents: "none" }} />
        <div style={{ background: "rgba(255,255,255,0.94)", backdropFilter: "blur(32px) saturate(1.8)", borderTop: "1px solid rgba(0,0,0,0.09)", display: "flex", justifyContent: "space-around", alignItems: "center", padding: "8px 4px", paddingBottom: "max(env(safe-area-inset-bottom, 12px), 12px)" }}>
          {(() => {
            const ic = {
              home:     (a) => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={a?"var(--yellow)":"#AEAEB2"} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
              today:    (a) => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={a?"var(--yellow)":"#AEAEB2"} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>,
              progress: (a) => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={a?"var(--yellow)":"#AEAEB2"} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
              forme:    (a) => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={a?"var(--yellow)":"#AEAEB2"} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>,
              profil:   (a) => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={a?"var(--yellow)":"#AEAEB2"} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
            };
            return tabs.map(t => {
              const active = tab === t.id;
              return (
                <button key={t.id} onClick={() => { haptic([8]); navigateTo(t.id); }}
                  style={{ background: "none", border: "none", flex: 1, padding: "4px 2px 6px", display: "flex", flexDirection: "column", alignItems: "center", gap: 4, position: "relative", transition: "all 0.2s var(--spring)", cursor: "pointer" }}>
                  {active && <div style={{ position: "absolute", top: -8, left: "30%", right: "30%", height: 2.5, background: "var(--yellow)", borderRadius: "0 0 4px 4px" }} />}
                  <div style={{ position: "relative", width: 24, height: 24, display: "flex", alignItems: "center", justifyContent: "center", transition: "transform 0.2s var(--spring)", transform: active ? "scale(1.1)" : "scale(1)" }}>
                    {ic[t.id]?.(active) ?? <span style={{ fontSize: 18, color: active?"var(--yellow)":"#AEAEB2" }}>{t.icon}</span>}
                    {t.badge && !active && <div style={{ position: "absolute", top: -2, right: -2, width: 7, height: 7, borderRadius: "50%", background: "var(--green)", border: "1.5px solid #FFFFFF", animation: "pulse 2s ease infinite" }} />}
                  </div>
                  <span style={{ fontSize: 9, fontWeight: active ? 700 : 500, color: active ? "var(--yellow)" : "#AEAEB2", letterSpacing: "0.02em", transition: "all 0.2s" }}>{t.label}</span>
                </button>
              );
            });
          })()}
        </div>
      </div>
    </div>
  );
}

// ============================================================
// ONGLET PROFIL (modifiable)
// ============================================================
function ProfilTab({ profile, onUpdateProfile, onLogout, installPrompt, isInstalled, isIOS, triggerInstall, notifGranted, requestNotifPermission }) {
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
      <div style={{ background: "linear-gradient(145deg, rgba(0,122,255,0.06) 0%, rgba(0,0,0,0) 60%)", border: "1.5px solid rgba(0,122,255,0.15)", borderRadius: 20, padding: "20px 18px", marginBottom: 12, position: "relative", overflow: "hidden" }}>
        {/* Glow */}
        <div style={{ position: "absolute", top: -30, right: -30, width: 150, height: 150, borderRadius: "50%", background: "radial-gradient(circle, rgba(0,122,255,0.08) 0%, transparent 70%)", pointerEvents: "none" }} />

        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 18 }}>
          {/* Avatar large */}
          <div style={{ width: 64, height: 64, borderRadius: "50%", background: "linear-gradient(135deg, var(--yellow) 0%, #b8cc00 100%)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Bebas Neue',sans-serif", fontSize: 30, color: "#000", flexShrink: 0, boxShadow: "0 0 20px rgba(0,122,255,0.3)" }}>
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
          <button onClick={editing ? saveProfile : () => setEditing(true)} style={{ background: editing ? "rgba(57,255,128,0.15)" : "rgba(0,0,0,0.05)", border: editing ? "1px solid rgba(57,255,128,0.4)" : "1px solid rgba(0,0,0,0.08)", color: editing ? "var(--green)" : "#888", borderRadius: 10, padding: "8px 12px", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>
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
                <div key={item.label} style={{ background: "rgba(0,0,0,0.03)", borderRadius: 10, padding: "10px 8px", textAlign: "center", border: "1px solid rgba(0,0,0,0.05)" }}>
                  <div style={{ fontSize: 16, marginBottom: 2 }}>{item.icon}</div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: "var(--white)", lineHeight: 1 }}>{item.value}</div>
                  <div style={{ fontSize: 10, color: "#555", marginTop: 2 }}>{item.label}</div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* ── COMPLÉTION DU PROFIL ── */}
      {(() => {
        const checks = [
          { label: "Poids", done: !!profile.poids, icon: "⚖️", hint: "Modifier le profil" },
          { label: "Âge", done: !!profile.age, icon: "🎂", hint: "Modifier le profil" },
          { label: "VMA testée", done: !!profile.vmaKmh, icon: "🏃", hint: "Tests physiques" },
          { label: "Squat 1RM", done: !!profile.squat1RM_final, icon: "🏋️", hint: "Tests physiques" },
          { label: "Deadlift 1RM", done: !!profile.deadlift1RM_final, icon: "💀", hint: "Tests physiques" },
          { label: "Date de course", done: !!profile.raceDate, icon: "📅", hint: "Modifier le profil" },
          { label: "1ère séance", done: (profile.sessions||[]).length > 0, icon: "✅", hint: "Onglet Aujourd'hui" },
          { label: "Objectif temps", done: !!profile.goalTargetLevel, icon: "🎯", hint: "Objectifs ci-dessous" },
        ];
        const done = checks.filter(c => c.done).length;
        const pct = Math.round((done / checks.length) * 100);
        if (pct === 100) return null; // hide when complete
        const barColor = pct < 40 ? "var(--red)" : pct < 75 ? "var(--orange)" : "var(--green)";
        return (
          <div style={{ background: "rgba(0,0,0,0.02)", border: "1px solid rgba(0,0,0,0.06)", borderRadius: 16, padding: "14px 16px", marginBottom: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <div style={{ fontSize: 11, color: "#555", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em" }}>Profil complété</div>
              <div className="bebas" style={{ fontSize: 22, color: barColor, lineHeight: 1 }}>{pct}<span style={{ fontSize: 11, color: "#777" }}>%</span></div>
            </div>
            <div style={{ height: 6, background: "rgba(0,0,0,0.05)", borderRadius: 99, overflow: "hidden", marginBottom: 10 }}>
              <div style={{ height: "100%", width: `${pct}%`, background: barColor, borderRadius: 99, transition: "width 0.6s var(--ease-out)" }} />
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {checks.filter(c => !c.done).map((c, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 5, background: "rgba(0,0,0,0.03)", border: "1px solid rgba(0,0,0,0.06)", borderRadius: 20, padding: "4px 10px" }}>
                  <span style={{ fontSize: 12 }}>{c.icon}</span>
                  <span style={{ fontSize: 10, color: "#555" }}>{c.label}</span>
                </div>
              ))}
            </div>
          </div>
        );
      })()}

      {/* ── RACE COUNTDOWN ── */}
      {profile.raceDate && (
        <div style={{ background: "rgba(255,60,60,0.05)", border: "1.5px solid rgba(255,60,60,0.2)", borderRadius: 16, padding: "16px 18px", marginBottom: 12, display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ textAlign: "center" }}>
            <div className="bebas" style={{ fontSize: 52, color: "var(--red)", lineHeight: 1 }}>{daysUntil(profile.raceDate)}</div>
            <div style={{ fontSize: 10, color: "#555", textTransform: "uppercase", letterSpacing: "0.08em" }}>jours</div>
          </div>
          <div style={{ flex: 1, borderLeft: "1px solid rgba(0,0,0,0.06)", paddingLeft: 16 }}>
            <div style={{ fontSize: 11, color: "var(--red)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 4 }}>🏁 Ta prochaine course</div>
            <div style={{ fontSize: 14, color: "var(--white)", fontWeight: 600 }}>HYROX {profile.hyroxCategorie?.toUpperCase() || "OPEN"}</div>
            <div style={{ fontSize: 12, color: "#555", marginTop: 3 }}>{new Date(profile.raceDate).toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}</div>
            {/* Progress bar */}
            {totalWeeks > 0 && (
              <div style={{ marginTop: 8 }}>
                <div style={{ height: 4, background: "rgba(0,0,0,0.06)", borderRadius: 99, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${Math.min(100, (currentWeek / totalWeeks) * 100)}%`, background: "var(--red)", borderRadius: 99, transition: "width 0.5s" }} />
                </div>
                <div style={{ fontSize: 10, color: "#777", marginTop: 4 }}>Semaine {currentWeek} / {totalWeeks} de préparation</div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── OBJECTIFS HYROX ── */}
      {(() => {
        const [editGoals, setEditGoals] = React.useState(false);
        const [goals, setGoals] = React.useState({
          targetTime: profile.goalTargetTime || "",
          weakStation: profile.goalWeakStation || "",
          targetLevel: profile.goalTargetLevel || "",
        });
        const STATIONS = ["SkiErg","Sled Push","Sled Pull","Burpee BJ","Rowing","Farmers Carry","Sandbag Lunges","Wall Balls"];
        const GOAL_LEVELS = ["Sub 1h00","Sub 1h15","Sub 1h30","Sub 1h45","Sub 2h00","Finisher"];
        async function saveGoals() {
          const updated = { ...profile, goalTargetTime: goals.targetTime, goalWeakStation: goals.weakStation, goalTargetLevel: goals.targetLevel };
          await storage.set(`athlete_${profile.name}`, updated);
          onUpdateProfile(updated);
          setEditGoals(false);
        }
        const hasGoals = profile.goalTargetTime || profile.goalWeakStation || profile.goalTargetLevel;
        return (
          <div style={{ background: "rgba(0,122,255,0.03)", border: "1px solid rgba(0,122,255,0.1)", borderRadius: 16, padding: "14px 16px", marginBottom: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: editGoals || hasGoals ? 14 : 0 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#555", textTransform: "uppercase", letterSpacing: "0.12em" }}>🎯 Mes Objectifs HYROX</div>
              <button onClick={editGoals ? saveGoals : () => setEditGoals(true)} style={{ background: editGoals ? "rgba(57,255,128,0.15)" : "rgba(0,0,0,0.04)", border: editGoals ? "1px solid rgba(57,255,128,0.3)" : "1px solid rgba(0,0,0,0.08)", borderRadius: 8, padding: "5px 12px", fontSize: 11, color: editGoals ? "var(--green)" : "#666", cursor: "pointer", fontWeight: 700 }}>{editGoals ? "✓ Sauver" : hasGoals ? "Modifier" : "Définir"}</button>
            </div>
            {editGoals ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <div>
                  <div style={{ fontSize: 10, color: "#555", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.08em" }}>Temps cible HYROX</div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {GOAL_LEVELS.map(l => (
                      <button key={l} onClick={() => setGoals(g => ({ ...g, targetLevel: l, targetTime: l }))} style={{ padding: "7px 13px", borderRadius: 20, fontSize: 12, fontWeight: 700, cursor: "pointer", background: goals.targetLevel === l ? "var(--yellow)" : "rgba(0,0,0,0.04)", border: goals.targetLevel === l ? "none" : "1px solid rgba(0,0,0,0.08)", color: goals.targetLevel === l ? "#000" : "#666" }}>{l}</button>
                    ))}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: 10, color: "#555", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.08em" }}>Station à améliorer en priorité</div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {STATIONS.map(s => (
                      <button key={s} onClick={() => setGoals(g => ({ ...g, weakStation: s }))} style={{ padding: "7px 13px", borderRadius: 20, fontSize: 11, fontWeight: 700, cursor: "pointer", background: goals.weakStation === s ? "var(--red)" : "rgba(0,0,0,0.04)", border: goals.weakStation === s ? "none" : "1px solid rgba(0,0,0,0.08)", color: goals.weakStation === s ? "#fff" : "#666" }}>{s}</button>
                    ))}
                  </div>
                </div>
              </div>
            ) : hasGoals ? (
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                {profile.goalTargetLevel && (
                  <div style={{ background: "rgba(0,122,255,0.08)", border: "1px solid rgba(0,122,255,0.2)", borderRadius: 12, padding: "10px 14px", flex: 1, minWidth: 120 }}>
                    <div style={{ fontSize: 9, color: "#777", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 4 }}>Objectif temps</div>
                    <div className="bebas" style={{ fontSize: 22, color: "var(--yellow)", lineHeight: 1 }}>{profile.goalTargetLevel}</div>
                  </div>
                )}
                {profile.goalWeakStation && (
                  <div style={{ background: "rgba(255,71,71,0.06)", border: "1px solid rgba(255,71,71,0.2)", borderRadius: 12, padding: "10px 14px", flex: 1, minWidth: 120 }}>
                    <div style={{ fontSize: 9, color: "#777", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 4 }}>Station à bosser</div>
                    <div className="bebas" style={{ fontSize: 18, color: "var(--red)", lineHeight: 1 }}>{profile.goalWeakStation}</div>
                  </div>
                )}
              </div>
            ) : (
              <div style={{ fontSize: 12, color: "#555", textAlign: "center", padding: "8px 0 4px", cursor: "pointer" }} onClick={() => setEditGoals(true)}>
                Définir ton temps cible et ta station à travailler →
              </div>
            )}
          </div>
        );
      })()}

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
          <div style={{ background: "rgba(0,0,0,0.02)", border: "1px solid rgba(0,0,0,0.05)", borderRadius: 16, padding: "14px", marginBottom: 12 }}>
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
                  {pr.unit && <div style={{ fontSize: 9, color: "#555", marginTop: 1 }}>{pr.unit}</div>}
                  <div style={{ fontSize: 9, color: "#777", marginTop: 3 }}>{pr.label}</div>
                </div>
              ))}
            </div>
          </div>
        );
      })()}

      {/* Bouton batterie de tests */}
      <Section title="Batterie de tests">
        <button onClick={() => setShowTests(true)} style={{ width: "100%", background: "var(--bg2)", border: "1px solid rgba(0,122,255,0.2)", borderRadius: 14, padding: "14px 16px", display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: "rgba(0,122,255,0.08)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>🧪</div>
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
        <Card style={{ border: "1.5px solid var(--yellow)55", background: "rgba(0,122,255,0.04)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 14 }}>
            <div style={{ fontSize: 32 }}>🔑</div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 15, color: "var(--white)" }}>Ton code d'accès Coach IA</div>
              <div style={{ fontSize: 12, color: "#888", marginTop: 2 }}>Débloque le générateur de programmes sur hybride-coaching.fr</div>
            </div>
          </div>
          <div style={{ background: "var(--bg)", border: "2px dashed rgba(0,122,255,0.4)", borderRadius: 10, padding: "14px 18px", display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
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
              <div style={{ fontSize: 11, color: "#555", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em" }}>Badges</div>
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
                    background: b.unlocked ? `${b.color}18` : "rgba(0,0,0,0.02)",
                    border: b.unlocked ? `1.5px solid ${b.color}44` : "1px solid rgba(0,0,0,0.05)",
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
        <div style={{ fontSize: 11, color: "#555", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 10 }}>Application</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>

          {/* Install PWA */}
          {!isInstalled ? (
            <button onClick={triggerInstall} style={{ display: "flex", alignItems: "center", gap: 14, background: "linear-gradient(135deg, rgba(0,122,255,0.06) 0%, rgba(0,0,0,0) 60%)", border: "1.5px solid rgba(0,122,255,0.2)", borderRadius: 14, padding: "14px 16px", cursor: "pointer", width: "100%", textAlign: "left" }}>
              <div style={{ width: 38, height: 38, borderRadius: 10, background: "rgba(0,122,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>📲</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: "var(--yellow)", marginBottom: 2 }}>Installer l'app</div>
                <div style={{ fontSize: 11, color: "#777" }}>{isIOS ? "Guide d'installation iPhone →" : installPrompt ? "Ajouter à l'écran d'accueil" : "Ouvre dans Chrome → ⋮ → Installer"}</div>
              </div>
              <div style={{ fontSize: 12, color: "var(--yellow)", fontWeight: 700 }}>→</div>
            </button>
          ) : (
            <div style={{ display: "flex", alignItems: "center", gap: 14, background: "rgba(57,255,128,0.04)", border: "1px solid rgba(57,255,128,0.15)", borderRadius: 14, padding: "14px 16px" }}>
              <div style={{ width: 38, height: 38, borderRadius: 10, background: "rgba(57,255,128,0.1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>✅</div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: "var(--green)", marginBottom: 2 }}>App installée</div>
                <div style={{ fontSize: 11, color: "#777" }}>FitRace est sur ton écran d'accueil</div>
              </div>
            </div>
          )}

          {/* Notifications */}
          <button onClick={notifGranted ? null : requestNotifPermission} style={{ display: "flex", alignItems: "center", gap: 14, background: notifGranted ? "rgba(57,255,128,0.04)" : "rgba(0,0,0,0.02)", border: `1px solid ${notifGranted ? "rgba(57,255,128,0.15)" : "rgba(0,0,0,0.06)"}`, borderRadius: 14, padding: "14px 16px", cursor: notifGranted ? "default" : "pointer", width: "100%", textAlign: "left" }}>
            <div style={{ width: 38, height: 38, borderRadius: 10, background: notifGranted ? "rgba(57,255,128,0.1)" : "rgba(0,0,0,0.04)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>{notifGranted ? "🔔" : "🔕"}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: notifGranted ? "var(--green)" : "#888", marginBottom: 2 }}>{notifGranted ? "Notifications actives" : "Activer les notifications"}</div>
              <div style={{ fontSize: 11, color: "#777" }}>{notifGranted ? "Rappels séance, nutrition & streak" : "Séance du jour · Bilan nutrition · Streak"}</div>
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
        <button onClick={onClose} style={{ background: "rgba(0,0,0,0.08)", border: "none", color: "#fff", fontSize: 18, borderRadius: 8, padding: "6px 12px", cursor: "pointer" }}>✕</button>
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
            <div style={{ fontSize: 11, color: "#777", textTransform: "uppercase", fontWeight: 700, marginBottom: 8 }}>Autres vidéos</div>
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
        <div style={{ background: "rgba(0,122,255,0.04)", border: "1px solid rgba(0,122,255,0.15)", borderRadius: 12, padding: 14, marginBottom: 12 }}>
          <div style={{ fontSize: 11, color: "var(--yellow)", fontWeight: 700, textTransform: "uppercase", marginBottom: 10 }}>✅ Points clés</div>
          {mouvement.cles.map((c, i) => <div key={i} style={{ fontSize: 13, color: "#ccc", marginBottom: 6, paddingLeft: 8, borderLeft: "2px solid rgba(0,122,255,0.3)" }}>{c}</div>)}
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
function TechniqueTab({ profile = {} }) {
  const [activeStation, setActiveStation] = useState(null);
  const [viewed, setViewed] = useState(() => {
    try { return JSON.parse(localStorage.getItem("fitrace_technique_viewed") || "{}"); } catch { return {}; }
  });
  const [favs, setFavs] = useState(() => {
    try { return JSON.parse(localStorage.getItem("fitrace_technique_favs") || "{}"); } catch { return {}; }
  });
  const stations = Object.values(VIDEOS_HYROX);

  function toggleFav(nomStation, e) {
    e.stopPropagation();
    const newFavs = { ...favs, [nomStation]: !favs[nomStation] };
    if (!newFavs[nomStation]) delete newFavs[nomStation];
    setFavs(newFavs);
    localStorage.setItem("fitrace_technique_favs", JSON.stringify(newFavs));
  }

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
  const cats = ["all", "⭐ Favoris", "Technique", "Force", "Cardio", "Résistance"];
  const favsCount = Object.keys(favs).length;
  const filtered = filterCat === "all" ? stations
    : filterCat === "⭐ Favoris" ? stations.filter(s => favs[s.nom])
    : stations.filter(s => (DIFFICULTY[s.nom]?.label || "Multi") === filterCat);
  const pct = Math.round((viewedCount / stations.length) * 100);

  return (
    <div className="fade-in">
      {activeStation && <VideoModal mouvement={activeStation} onClose={() => setActiveStation(null)} />}

      {/* ── HERO ── */}
      <div style={{ background: "linear-gradient(145deg, #131500 0%, #080808 55%, #001308 100%)", border: "1.5px solid rgba(0,122,255,0.15)", borderRadius: 20, padding: "20px 18px", marginBottom: 14, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -30, right: -20, fontSize: 120, opacity: 0.04 }}>🏋️</div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
          <div>
            <div style={{ fontSize: 10, color: "#555", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 6 }}>Maîtrise technique</div>
            <div className="bebas" style={{ fontSize: 52, color: pct === 100 ? "var(--green)" : "var(--yellow)", lineHeight: 1 }}>{pct}<span style={{ fontSize: 22, color: "#555" }}>%</span></div>
            <div style={{ fontSize: 12, color: "#777", marginTop: 2 }}>{viewedCount}/{stations.length} stations vues</div>
          </div>
          {/* Mini anneau */}
          <svg width="72" height="72" viewBox="0 0 72 72">
            <circle cx="36" cy="36" r="28" fill="none" stroke="rgba(0,0,0,0.05)" strokeWidth="6"/>
            <circle cx="36" cy="36" r="28" fill="none" stroke={pct === 100 ? "var(--green)" : "var(--yellow)"} strokeWidth="6" strokeLinecap="round"
              strokeDasharray={2*Math.PI*28} strokeDashoffset={2*Math.PI*28*(1-pct/100)} transform="rotate(-90 36 36)" style={{transition:"stroke-dashoffset 0.8s"}}/>
            <text x="36" y="40" textAnchor="middle" fontFamily="'Bebas Neue',sans-serif" fontSize="16" fill={pct===100?"#39ff80":"#007AFF"}>{viewedCount}/{stations.length}</text>
          </svg>
        </div>
        {/* Barre progression */}
        <div style={{ height: 5, background: "rgba(0,0,0,0.05)", borderRadius: 99, overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${pct}%`, background: pct === 100 ? "var(--green)" : "linear-gradient(90deg, var(--yellow), #b8cc00)", borderRadius: 99, transition: "width 0.6s" }}/>
        </div>
        {pct === 100 && (
          <div style={{ marginTop: 10, display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--green)" }}/>
            <span style={{ fontSize: 12, color: "var(--green)", fontWeight: 700 }}>Toutes les stations maîtrisées 🏆</span>
          </div>
        )}
      </div>

      {/* ── STATION À TRAVAILLER ── */}
      {profile.goalWeakStation && (() => {
        const ws = profile.goalWeakStation;
        const st = stations.find(s => s.nom?.toLowerCase().includes(ws.toLowerCase()) || ws.toLowerCase().includes(s.nom?.toLowerCase().split(" ")[0]?.toLowerCase()));
        return (
          <div onClick={() => st && openStation(st)} style={{ background: "rgba(255,71,71,0.05)", border: "1.5px solid rgba(255,71,71,0.2)", borderRadius: 14, padding: "12px 16px", marginBottom: 12, cursor: "pointer", display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ fontSize: 24, flexShrink: 0 }}>{st?.emoji || "⚡"}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 9, color: "var(--red)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 2 }}>🎯 Ta station prioritaire</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: "var(--white)" }}>{ws}</div>
              <div style={{ fontSize: 11, color: "#777" }}>Tape pour voir les conseils techniques</div>
            </div>
            <span style={{ color: "var(--red)", fontSize: 16 }}>→</span>
          </div>
        );
      })()}

      {/* ── FAQ DÉBUTANT ── */}
      {(profile.sessions||[]).length < 5 && (() => {
        const [openFaq, setOpenFaq] = React.useState(null);
        const FAQ = [
          { q: "C'est quoi HYROX exactement ?", a: "HYROX est une compétition mondiale de fitness fonctionnel. Le format est toujours identique : 1 km de running + 1 station de force × 8 répétitions. Total : ~8 km de course et 8 stations. Tout le monde fait le même parcours, du débutant au champion du monde." },
          { q: "Quel niveau faut-il pour commencer ?", a: "Aucun niveau minimum ! Les catégories vont du Rookies (débutant complet) au Pro. En 3 à 6 mois d'entraînement régulier, tu peux finir ta première HYROX. L'important c'est de commencer et d'être régulier." },
          { q: "Combien de fois par semaine s'entraîner ?", a: "Pour un débutant : 3 séances/semaine suffisent. 2 séances de force/stations + 1 séance de cardio. Ajoute progressivement. La régularité prime sur l'intensité — mieux vaut 3 séances modérées chaque semaine que 6 séances puis rien." },
          { q: "Zone 2 : c'est quoi ?", a: "La Zone 2 = allure où tu peux tenir une conversation sans être essoufflé. C'est environ 60-70% de ta FC max. C'est la base de l'endurance HYROX — la majorité de tes km de course en compétition seront à cette allure. Construis cette base !" },
          { q: "Comment éviter les blessures ?", a: "3 règles : 1) N'augmente pas le volume de plus de 10%/semaine. 2) Dors 7-9h — c'est là que tu progresses réellement. 3) Écoute ton corps — une douleur n'est pas de la fatigue normale. Si ça fait mal, on s'arrête, on consulte." },
        ];
        return (
          <div style={{ background: "rgba(255,255,255,0.015)", border: "1px solid rgba(0,0,0,0.06)", borderRadius: 18, padding: "14px 16px", marginBottom: 14 }}>
            <div style={{ fontSize: 10, color: "#777", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 12 }}>🎓 FAQ Débutant HYROX</div>
            {FAQ.map((item, i) => (
              <div key={i} style={{ marginBottom: 6 }}>
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  style={{ width: "100%", background: openFaq === i ? "rgba(0,122,255,0.05)" : "rgba(0,0,0,0.02)", border: `1px solid ${openFaq === i ? "rgba(0,122,255,0.2)" : "rgba(0,0,0,0.05)"}`, borderRadius: 10, padding: "10px 12px", textAlign: "left", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 12, color: openFaq === i ? "var(--yellow)" : "#888", fontWeight: openFaq === i ? 700 : 500, flex: 1 }}>{item.q}</span>
                  <span style={{ color: "#777", transition: "transform 0.2s", display: "inline-block", transform: openFaq === i ? "rotate(180deg)" : "none" }}>▼</span>
                </button>
                {openFaq === i && (
                  <div style={{ padding: "10px 12px", background: "rgba(0,122,255,0.03)", borderRadius: "0 0 10px 10px", borderLeft: "2px solid rgba(0,122,255,0.2)", margin: "-2px 0 0 0" }}>
                    <div style={{ fontSize: 12, color: "#888", lineHeight: 1.7 }}>{item.a}</div>
                  </div>
                )}
              </div>
            ))}
          </div>
        );
      })()}

      {/* ── FILTRES ── */}
      <div style={{ display: "flex", gap: 6, marginBottom: 14, overflowX: "auto", paddingBottom: 2, scrollbarWidth: "none" }}>
        {cats.map(c => (
          <button key={c} onClick={() => setFilterCat(c)} style={{
            flexShrink: 0, padding: "7px 14px", borderRadius: 20, fontSize: 12, fontWeight: 700, cursor: "pointer",
            background: filterCat === c ? "rgba(0,122,255,0.12)" : "rgba(0,0,0,0.03)",
            border: filterCat === c ? "1.5px solid rgba(0,122,255,0.4)" : "1px solid rgba(0,0,0,0.06)",
            color: filterCat === c ? "var(--yellow)" : "#444", transition: "all 0.2s",
          }}>{c === "all" ? `Toutes (${stations.length})` : c === "⭐ Favoris" ? `⭐ Favoris${favsCount > 0 ? ` (${favsCount})` : ""}` : c}</button>
        ))}
      </div>

      {/* ── LISTE STATIONS ── */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {filtered.map((s, i) => {
          const isViewed = viewed[s.nom];
          const diff = DIFFICULTY[s.nom] || { label: "Multi", color: "#555" };
          const diffColors = { "Technique": "#a78bfa", "Force": "var(--red)", "Cardio": "var(--yellow)", "Résistance": "var(--orange)", "Multi": "#555" };
          const dc = diffColors[diff.label] || "#555";
          const isFav = !!favs[s.nom];
          const isWeakStation = profile.goalWeakStation && (s.nom?.toLowerCase().includes(profile.goalWeakStation.toLowerCase()) || profile.goalWeakStation.toLowerCase().includes(s.nom?.toLowerCase().split(" ")[0]?.toLowerCase()));
          return (
            <div key={i} onClick={() => openStation(s)} className="card-hover" style={{
              background: isViewed ? "rgba(57,255,128,0.04)" : "rgba(0,0,0,0.02)",
              border: isWeakStation ? "1.5px solid rgba(255,71,71,0.3)" : isViewed ? "1.5px solid rgba(57,255,128,0.2)" : "1px solid rgba(0,0,0,0.05)",
              borderRadius: 16, padding: "14px 16px", cursor: "pointer",
              display: "flex", alignItems: "center", gap: 14, position: "relative", overflow: "hidden",
            }}>
              {isWeakStation && <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: "var(--red)" }} />}
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
                  {isWeakStation && <div style={{ fontSize: 9, background: "rgba(255,71,71,0.12)", color: "var(--red)", border: "1px solid rgba(255,71,71,0.3)", borderRadius: 5, padding: "2px 7px", fontWeight: 700 }}>🎯 Priorité</div>}
                </div>
                <div style={{ fontSize: 11, color: "#777" }}>{s.distance}</div>
                <div style={{ fontSize: 10, color: "#555", marginTop: 2 }}>{s.muscles}</div>
              </div>
              {/* Fav star */}
              <button onClick={(e) => toggleFav(s.nom, e)} style={{ width: 32, height: 32, borderRadius: "50%", background: isFav ? "rgba(0,122,255,0.1)" : "transparent", border: isFav ? "1px solid rgba(0,122,255,0.3)" : "1px solid rgba(0,0,0,0.06)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, color: isFav ? "var(--yellow)" : "#333", cursor: "pointer", flexShrink: 0 }}>
                {isFav ? "⭐" : "☆"}
              </button>
              <div style={{ width: 32, height: 32, borderRadius: "50%", background: isViewed ? "rgba(57,255,128,0.12)" : "rgba(0,122,255,0.08)", border: `1.5px solid ${isViewed ? "rgba(57,255,128,0.3)" : "rgba(0,122,255,0.2)"}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, color: isViewed ? "var(--green)" : "var(--yellow)", flexShrink: 0 }}>
                {isViewed ? "↺" : "▶"}
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div style={{ textAlign: "center", padding: "32px 20px", color: "#555", fontSize: 13 }}>Aucune station dans cette catégorie</div>
      )}

      {/* ── COMBOS HYROX RECOMMANDÉS ── */}
      {filterCat === "all" && (
        <div style={{ marginTop: 20 }}>
          <div style={{ fontSize: 11, color: "#555", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 12 }}>🔀 Combos à entraîner ensemble</div>
          {[
            {
              nom: "Combo Sled",
              emoji: "🛷",
              color: "var(--red)",
              stations: ["Sled Push", "Sled Pull"],
              reco: "Enchaîne Push → Pull sans pause. Travaille les quadriceps et le dos de manière complémentaire.",
              tags: ["Force", "Spécificité race"],
            },
            {
              nom: "Combo Cardio Upper",
              emoji: "⛷️",
              color: "#a78bfa",
              stations: ["SkiErg", "Rowing"],
              reco: "2x5min sur chaque. Développe l'endurance du haut du corps et optimise ta technique de tirage.",
              tags: ["Technique", "Endurance"],
            },
            {
              nom: "Combo Full Body",
              emoji: "🔥",
              color: "var(--orange)",
              stations: ["Burpee Broad Jump", "Wall Balls", "Sandbag Lunges"],
              reco: "Circuit 3 rounds. La combinaison la plus représentative de la fatigue en fin de race HYROX.",
              tags: ["Cardio", "Race-specific"],
            },
            {
              nom: "Combo Portage",
              emoji: "🧳",
              color: "var(--green)",
              stations: ["Farmers Carry", "Sandbag Lunges"],
              reco: "20-30m Farmers puis 20m Sandbag sans lâcher. Renforce les stabilisateurs du core sous charge.",
              tags: ["Résistance", "Core"],
            },
          ].map((combo, i) => (
            <div key={i} style={{ background: `${combo.color}06`, border: `1px solid ${combo.color}20`, borderRadius: 14, padding: "14px 16px", marginBottom: 8 }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                <div style={{ width: 42, height: 42, borderRadius: 12, background: `${combo.color}15`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>{combo.emoji}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
                    <div className="bebas" style={{ fontSize: 16, color: combo.color, letterSpacing: 0.5 }}>{combo.nom}</div>
                    <div style={{ display: "flex", gap: 4, flexWrap: "wrap", justifyContent: "flex-end" }}>
                      {combo.tags.map((t, j) => (
                        <div key={j} style={{ fontSize: 8, background: `${combo.color}15`, color: combo.color, borderRadius: 4, padding: "2px 6px", fontWeight: 700 }}>{t}</div>
                      ))}
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 6, marginBottom: 8, flexWrap: "wrap" }}>
                    {combo.stations.map((s, j) => (
                      <div key={j} style={{ fontSize: 10, background: "rgba(0,0,0,0.04)", border: "1px solid rgba(0,0,0,0.07)", borderRadius: 6, padding: "3px 9px", color: "#888" }}>{s}</div>
                    ))}
                  </div>
                  <div style={{ fontSize: 11, color: "#555", lineHeight: 1.55 }}>{combo.reco}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
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
  force_stations: { color: "#007AFF", bg: "rgba(0,122,255,0.1)", label: "Force", icon: "🏋️" },
  running_zone2: { color: "#39ff80", bg: "rgba(57,255,128,0.08)", label: "Zone 2", icon: "🏃" },
  running_qualite: { color: "#39ff80", bg: "rgba(57,255,128,0.08)", label: "Run", icon: "🎯" },
  hybride_compromis: { color: "#ff9a3c", bg: "rgba(255,154,60,0.08)", label: "Hybride", icon: "⚡" },
  repos: { color: "#777", bg: "rgba(0,0,0,0.02)", label: "Repos", icon: "😴" },
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
          <div style={{ background: "rgba(0,0,0,0.02)", border: "1px solid rgba(0,0,0,0.05)", borderRadius: 16, padding: "14px", marginBottom: 14 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: "var(--yellow)", textTransform: "capitalize" }}>{monthName}</div>
              <div style={{ fontSize: 10, color: "#555" }}>{sessionDates.size} séances ce mois</div>
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
                      background: done ? "rgba(57,255,128,0.15)" : isToday ? "rgba(0,122,255,0.12)" : "transparent",
                      border: done ? "1px solid rgba(57,255,128,0.3)" : isToday ? "1.5px solid var(--yellow)" : "none",
                      color: done ? "var(--green)" : isToday ? "var(--yellow)" : isPast ? "#2a2a2a" : "#444",
                    }}>{d}</div>
                  </div>
                );
              })}
            </div>
            <div style={{ display: "flex", gap: 12, justifyContent: "center", marginTop: 4 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 9, color: "#555" }}>
                <div style={{ width: 8, height: 8, borderRadius: 2, background: "rgba(57,255,128,0.3)", border: "1px solid rgba(57,255,128,0.4)" }} />Séance réalisée
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 9, color: "#555" }}>
                <div style={{ width: 8, height: 8, borderRadius: 2, border: "1.5px solid var(--yellow)" }} />Aujourd'hui
              </div>
            </div>
          </div>
        );
      })()}

      {/* ── PREPARATION PHASES TIMELINE ── */}
      {profile.raceDate && (() => {
        const raceDate = new Date(profile.raceDate);
        const now2 = new Date(); now2.setHours(0,0,0,0);
        const totalDays = Math.max(1, Math.ceil((raceDate - now2) / 86400000));
        const totalWeeksLeft = Math.ceil(totalDays / 7);

        // Phase model: Base=40%, Build=30%, Peak=20%, Taper=10%
        const PHASES = [
          { id: "base",  label: "BASE",  icon: "🏗️", color: "#38bdf8", pct: 0.40, tip: "Fondations aérobies" },
          { id: "build", label: "BUILD", icon: "📈", color: "var(--green)", pct: 0.30, tip: "Volume + intensité" },
          { id: "peak",  label: "PEAK",  icon: "🔥", color: "var(--yellow)", pct: 0.20, tip: "Spécificité course" },
          { id: "taper", label: "TAPER", icon: "✈️", color: "var(--purple)", pct: 0.10, tip: "Affûtage compétition" },
        ];

        // Determine current phase
        const elapsed = Math.ceil((now2 - (new Date(now2.getTime() - totalDays * 86400000))) / 86400000);
        // Figure out which phase we're in based on weeks left
        let currentPhase = "base";
        if (totalWeeksLeft <= 2) currentPhase = "taper";
        else if (totalWeeksLeft <= Math.ceil(totalWeeksLeft * 0.3)) currentPhase = "peak";
        else if (totalWeeksLeft <= Math.ceil(totalWeeksLeft * 0.6)) currentPhase = "build";

        // Calculate phase week ranges from now
        let cursor = 0;
        const phaseData = PHASES.map(p => {
          const wks = Math.max(1, Math.round(totalWeeksLeft * p.pct));
          const start = cursor; cursor += wks;
          return { ...p, weeks: wks, startWeek: start };
        });

        const currentPhaseObj = (() => {
          let rem = totalWeeksLeft;
          for (const p of phaseData) {
            if (rem > totalWeeksLeft - p.weeks) return { ...p, weeksLeft: Math.min(rem, p.weeks) };
            rem -= p.weeks;
          }
          return phaseData[phaseData.length - 1];
        })();

        return (
          <div style={{ background: "rgba(0,0,0,0.02)", border: "1px solid rgba(0,0,0,0.06)", borderRadius: 16, padding: "14px 14px", marginBottom: 14 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <div style={{ fontSize: 10, color: "#777", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em" }}>📅 Phases de préparation</div>
              <div style={{ fontSize: 10, color: "#777" }}>{totalWeeksLeft} semaines avant la course</div>
            </div>

            {/* Phases bar */}
            <div style={{ display: "flex", gap: 2, height: 8, borderRadius: 6, overflow: "hidden", marginBottom: 10 }}>
              {phaseData.map(p => (
                <div key={p.id} style={{ flex: p.pct, background: p.color, opacity: p.id === currentPhaseObj.id ? 1 : 0.3, transition: "opacity 0.3s" }} />
              ))}
            </div>

            {/* Phase labels */}
            <div style={{ display: "flex", gap: 6, marginBottom: 12 }}>
              {phaseData.map(p => (
                <div key={p.id} style={{ flex: p.pct, textAlign: "center" }}>
                  <div style={{ fontSize: 8, color: p.id === currentPhaseObj.id ? p.color : "#333", fontWeight: p.id === currentPhaseObj.id ? 700 : 400, textTransform: "uppercase", letterSpacing: "0.04em" }}>{p.label}</div>
                  <div style={{ fontSize: 8, color: "#222" }}>{p.weeks}S</div>
                </div>
              ))}
            </div>

            {/* Current phase detail */}
            <div style={{ background: `${currentPhaseObj.color}10`, border: `1px solid ${currentPhaseObj.color}30`, borderRadius: 12, padding: "10px 12px", display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 22 }}>{currentPhaseObj.icon}</span>
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, color: currentPhaseObj.color }}>Phase {currentPhaseObj.label} · {currentPhaseObj.tip}</div>
                <div style={{ fontSize: 10, color: "#555", marginTop: 2 }}>
                  {currentPhaseObj.id === "base" && "Construis ta base aérobie avec des sorties longues et faciles (Z1-Z2). Volume progressif."}
                  {currentPhaseObj.id === "build" && "Augmente l'intensité. Inclus des séances seuil + stations. Simule les formats HYROX."}
                  {currentPhaseObj.id === "peak" && "Séances spécifiques HYROX race-pace. Répétitions des 8 stations à pleine intensité."}
                  {currentPhaseObj.id === "taper" && "Réduis le volume de 40%. Garde l'intensité. Repos et nutrition race-day. Tu es prêt !"}
                </div>
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
          <button onClick={() => setShowPrefs(true)} style={{ background: "rgba(0,0,0,0.04)", border: "1px solid #222", borderRadius: 8, padding: "6px 10px", fontSize: 12, color: "#888", cursor: "pointer" }}>⚙️</button>
          <button onClick={() => refreshPlanning(prefs)} style={{ background: "rgba(0,122,255,0.08)", border: "1px solid rgba(0,122,255,0.2)", borderRadius: 8, padding: "6px 12px", fontSize: 12, color: "var(--yellow)", cursor: "pointer", fontWeight: 600 }}>↺</button>
        </div>
      </div>

      {loadingPlanning ? (
        <div className="fade-in" style={{ textAlign: "center", padding: "40px 20px", background: "var(--bg2)", borderRadius: 14, border: "1.5px solid rgba(0,122,255,0.12)" }}>
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
          <div style={{ background: "rgba(0,122,255,0.04)", border: "1px solid rgba(0,122,255,0.15)", borderRadius: 12, padding: "12px 14px", marginBottom: 14 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: planningWeek.conseil ? 8 : 0 }}>
              <div style={{ fontSize: 11, color: "var(--yellow)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em" }}>Charge semaine</div>
              <div style={{
                fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 20,
                background: planningWeek.charge_semaine === "élevée" ? "rgba(255,71,71,0.15)" : planningWeek.charge_semaine === "faible" ? "rgba(57,255,128,0.15)" : "rgba(0,122,255,0.12)",
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
                  background: isDone ? "rgba(57,255,128,0.05)" : isSelected ? t.bg : isToday ? "rgba(0,122,255,0.04)" : "rgba(0,0,0,0.02)",
                  border: isDone ? "1.5px solid rgba(57,255,128,0.3)" : isSelected ? `1.5px solid ${t.color}88` : isToday ? "1.5px solid rgba(0,122,255,0.35)" : "1px solid rgba(0,0,0,0.05)",
                  borderRadius: 14, padding: "12px 4px 10px", textAlign: "center", cursor: "pointer",
                  position: "relative", overflow: "hidden", transition: "all 0.2s",
                }}>
                  {/* Top color stripe */}
                  <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: isDone ? "var(--green)" : isToday ? "var(--yellow)" : t.color, opacity: isDone ? 1 : isToday ? 1 : 0.4, borderRadius: "14px 14px 0 0" }} />
                  <div style={{ fontSize: 9, color: isToday ? "var(--yellow)" : isDone ? "var(--green)" : "#333", fontWeight: isToday ? 700 : 500, marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.06em" }}>{j.jour.slice(0, 3)}</div>
                  <div style={{ fontSize: 20, marginBottom: 4 }}>{isDone ? "✅" : t.icon}</div>
                  {j.duree > 0 && <div style={{ fontSize: 8, color: "#555", letterSpacing: "0.04em" }}>{j.duree}m</div>}
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
                    {selectedJour.duree > 0 && <span style={{ fontSize: 11, color: "#666", background: "rgba(0,0,0,0.06)", padding: "2px 8px", borderRadius: 6 }}>⏱ {selectedJour.duree} min</span>}
                    {selectedJour.intensite && <span style={{ fontSize: 11, color: "#666", background: "rgba(0,0,0,0.06)", padding: "2px 8px", borderRadius: 6 }}>💥 {selectedJour.intensite}</span>}
                  </div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8 }}>
                  <div style={{ fontSize: 28 }}>{TYPE_COLORS[selectedJour.type]?.icon}</div>
                  {/* Bouton Fait / Non fait */}
                  <button
                    onClick={(e) => { e.stopPropagation(); toggleJourFait(selectedJour.jour); }}
                    style={{
                      padding: "5px 12px", borderRadius: 20, fontSize: 11, fontWeight: 700,
                      background: joursFaits[selectedJour.jour] ? "rgba(57,255,128,0.15)" : "rgba(0,0,0,0.05)",
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
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "7px 0", borderBottom: i < selectedJour.exercices_cles.length - 1 ? "1px solid rgba(0,0,0,0.04)" : "none" }}>
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
                    border: isSelected ? `1.5px solid ${t.color}66` : isFait ? "1.5px solid rgba(57,255,128,0.25)" : isToday ? "1.5px solid rgba(0,122,255,0.4)" : "1px solid var(--bg3)",
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
                      <div style={{ fontSize: 10, color: "#777", marginTop: 3 }}>{j.exercices_cles.slice(0,2).join(" · ")}{j.exercices_cles.length > 2 ? "…" : ""}</div>
                    )}
                    {!(j.exercices_cles?.length) && j.focus && <div style={{ fontSize: 11, color: "#777", marginTop: 2 }}>{j.focus}</div>}
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
    <div style={{ background: "rgba(0,0,0,0.02)", border: "1px solid rgba(0,0,0,0.06)", borderRadius: 14, padding: 12, marginBottom: 10 }}>
      <div style={{ fontSize: 11, color: "#777", textAlign: "center" }}>Chargement du planning…</div>
    </div>
  );

  if (!planningWeek) return null;

  return (
    <div onClick={onOpenPlanning} style={{ background: "rgba(0,0,0,0.02)", border: "1px solid rgba(0,0,0,0.06)", borderRadius: 14, padding: "12px 14px", marginBottom: 10, cursor: "pointer" }}>
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

      {/* ── HYDRATATION TRACKER ── */}
      {(() => {
        const waterKey = `water_${profile.name}_${today}`;
        const [waterMl, setWaterMl] = React.useState(() => {
          try { return parseInt(localStorage.getItem(waterKey)||"0"); } catch { return 0; }
        });
        const target = profile.poids ? Math.round(profile.poids * 35) : 2500; // 35ml/kg
        const glasses = Math.floor(waterMl / 250);
        const totalGlasses = Math.ceil(target / 250);
        const pct = Math.min(100, Math.round((waterMl / target) * 100));
        const addWater = (ml) => {
          const newVal = Math.max(0, waterMl + ml);
          setWaterMl(newVal);
          localStorage.setItem(waterKey, newVal.toString());
        };
        const col = pct >= 80 ? "var(--green)" : pct >= 50 ? "#38bdf8" : "var(--orange)";
        return (
          <div style={{ background: "linear-gradient(145deg, #000a1a 0%, #080808 60%)", border: `1.5px solid ${col === "#38bdf8" ? "rgba(56,189,248,0.25)" : col === "var(--green)" ? "rgba(57,255,128,0.2)" : "rgba(255,154,60,0.2)"}`, borderRadius: 16, padding: "14px 16px", marginBottom: 14 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
              <div>
                <div style={{ fontSize: 10, color: "#555", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 4 }}>💧 Hydratation</div>
                <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
                  <div className="bebas" style={{ fontSize: 32, color: col, lineHeight: 1 }}>{waterMl}</div>
                  <div style={{ fontSize: 12, color: "#555" }}>/ {target} ml</div>
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 10, color: "#555", marginBottom: 4 }}>Objectif</div>
                <div className="bebas" style={{ fontSize: 18, color: col }}>{pct}%</div>
              </div>
            </div>
            {/* Verres visuels */}
            <div style={{ display: "flex", gap: 4, marginBottom: 10, flexWrap: "wrap" }}>
              {Array.from({ length: Math.min(totalGlasses, 12) }, (_, i) => (
                <div key={i} onClick={() => addWater(i < glasses ? -250 : 250)} style={{ cursor: "pointer", opacity: i < glasses ? 1 : 0.25, fontSize: 18, filter: i < glasses ? "none" : "grayscale(1)" }}>
                  💧
                </div>
              ))}
            </div>
            {/* Barre */}
            <div style={{ height: 4, background: "rgba(0,0,0,0.05)", borderRadius: 99, overflow: "hidden", marginBottom: 10 }}>
              <div style={{ width: `${pct}%`, height: "100%", background: col, borderRadius: 99, transition: "width 0.5s" }} />
            </div>
            {/* Boutons */}
            <div style={{ display: "flex", gap: 6 }}>
              {[250, 500, 750].map(ml => (
                <button key={ml} onClick={() => addWater(ml)} style={{ flex: 1, padding: "8px 4px", background: "rgba(56,189,248,0.08)", border: "1px solid rgba(56,189,248,0.2)", borderRadius: 10, color: "#38bdf8", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>
                  +{ml}ml
                </button>
              ))}
              {waterMl > 0 && <button onClick={() => addWater(-250)} style={{ padding: "8px 12px", background: "rgba(0,0,0,0.03)", border: "1px solid rgba(0,0,0,0.06)", borderRadius: 10, color: "#777", fontSize: 12, cursor: "pointer" }}>-</button>}
            </div>
          </div>
        );
      })()}

      {/* ── HERO CALORIES ── */}
      <div style={{ background: "linear-gradient(145deg, #001a00 0%, #080808 60%)", border: `1.5px solid ${kcalColor === "var(--green)" ? "rgba(57,255,128,0.2)" : kcalColor === "var(--yellow)" ? "rgba(0,122,255,0.2)" : "rgba(255,71,71,0.2)"}`, borderRadius: 20, padding: "20px 20px 16px", marginBottom: 14, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -30, right: -20, fontSize: 110, opacity: 0.04 }}>🥗</div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
          <div>
            <div style={{ fontSize: 10, color: "#555", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 6 }}>Calories aujourd'hui</div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
              <div className="bebas" style={{ fontSize: 64, color: kcalColor, lineHeight: 1 }}>{totaux.kcal}</div>
              <div style={{ fontSize: 14, color: "#555" }}>/ {objectifs.kcal}</div>
            </div>
            <div style={{ fontSize: 11, color: "#777", marginTop: 2 }}>{objectifs.kcal - totaux.kcal > 0 ? `${objectifs.kcal - totaux.kcal} kcal restantes` : "Objectif atteint ✓"}</div>
          </div>
          {/* Anneau SVG */}
          <svg width="72" height="72" viewBox="0 0 72 72">
            <circle cx="36" cy="36" r="28" fill="none" stroke="rgba(0,0,0,0.05)" strokeWidth="7" />
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
                  <span style={{ fontSize: 9, color: "#777", textTransform: "uppercase" }}>{m.label}</span>
                  <span className="bebas" style={{ fontSize: 13, color: m.color }}>{m.val}<span style={{ fontSize: 9, color: "#555" }}>g</span></span>
                </div>
                <div style={{ height: 4, background: "rgba(0,0,0,0.05)", borderRadius: 99, overflow: "hidden" }}>
                  <div style={{ width: `${pct}%`, height: "100%", background: m.color, borderRadius: 99, transition: "width 0.6s" }} />
                </div>
                <div style={{ fontSize: 9, color: "#555", marginTop: 3 }}>/ {m.obj}g</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── SUB-TABS ── */}
      <div style={{ display: "flex", gap: 6, marginBottom: 16, background: "rgba(0,0,0,0.02)", borderRadius: 14, padding: 4 }}>
        {[
          { id: "journal", label: "📋 Journal" },
          { id: "timing", label: "⏱️ Timing" },
          { id: "recettes", label: "👨‍🍳 Recettes" },
          { id: "bilan", label: "🤖 Bilan IA" },
        ].map(t => (
          <button key={t.id} onClick={() => setSubTab(t.id)} style={{
            flex: 1, padding: "10px 4px", borderRadius: 10, fontSize: 12, fontWeight: 700,
            background: subTab === t.id ? "rgba(0,122,255,0.12)" : "transparent",
            border: subTab === t.id ? "1.5px solid rgba(0,122,255,0.3)" : "1.5px solid transparent",
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
                      flexShrink: 0, background: "rgba(0,0,0,0.03)", border: "1px solid rgba(0,0,0,0.07)",
                      borderRadius: 12, padding: "10px 12px", cursor: "pointer", textAlign: "center", minWidth: 76,
                    }}>
                      <div style={{ fontSize: 20, marginBottom: 4 }}>{f.emoji}</div>
                      <div style={{ fontSize: 9, color: "#888", lineHeight: 1.3, marginBottom: 3 }}>{f.nom.split(" ")[0]}</div>
                      <div style={{ fontSize: 10, fontWeight: 700, color: "var(--yellow)" }}>{f.kcal}</div>
                      <div style={{ fontSize: 8, color: "#555" }}>kcal</div>
                    </button>
                  ))}
                </div>
              </div>
            );
          })()}

          {/* Liste repas */}
          <div style={{ marginBottom: 14 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
              <div style={{ fontSize: 11, color: "#555", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em" }}>Repas · {repasJour.length} aliments</div>
              <button onClick={() => setShowAdd(true)} style={{ background: "var(--yellow)", border: "none", borderRadius: 10, padding: "7px 14px", fontSize: 13, fontFamily: "'Bebas Neue',sans-serif", letterSpacing: 1, color: "#000", cursor: "pointer" }}>+ AJOUTER</button>
            </div>

            {repasJour.length === 0 ? (
              <div style={{ background: "rgba(0,0,0,0.02)", border: "1px dashed rgba(0,0,0,0.07)", borderRadius: 16, padding: "32px 20px", textAlign: "center" }}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>🍽️</div>
                <div style={{ fontSize: 13, color: "#777", lineHeight: 1.7 }}>Aucun aliment aujourd'hui.<br/>Commence par ton petit-déjeuner !</div>
                <button onClick={() => setShowAdd(true)} style={{ marginTop: 14, background: "rgba(0,122,255,0.08)", border: "1px solid rgba(0,122,255,0.2)", borderRadius: 10, padding: "10px 20px", fontSize: 13, color: "var(--yellow)", cursor: "pointer", fontWeight: 600 }}>
                  Ajouter un aliment
                </button>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {repasJour.map((r, i) => {
                  const kcalPctItem = Math.round((r.kcal / objectifs.kcal) * 100);
                  return (
                    <div key={r.id || i} style={{ background: "rgba(0,0,0,0.02)", border: "1px solid rgba(0,0,0,0.05)", borderRadius: 14, padding: "12px 14px", display: "flex", alignItems: "center", gap: 12, position: "relative", overflow: "hidden" }}>
                      <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: `${Math.min(100, kcalPctItem * 3)}%`, background: "rgba(57,255,128,0.03)", pointerEvents: "none" }} />
                      <div style={{ width: 38, height: 38, borderRadius: 10, background: "rgba(0,0,0,0.04)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>{r.emoji || "🍽️"}</div>
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
                        {r.heure && <div style={{ fontSize: 10, color: "#555" }}>{r.heure}</div>}
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
              <div className="slide-up" style={{ background: "#0d0d0d", borderRadius: "22px 22px 0 0", padding: "0 0 32px", width: "100%", maxWidth: 480, margin: "0 auto", maxHeight: "92vh", overflowY: "auto", border: "1px solid rgba(0,0,0,0.06)" }}>
                {/* Poignée */}
                <div style={{ padding: "14px 0 0", textAlign: "center" }}>
                  <div style={{ width: 36, height: 4, background: "#222", borderRadius: 99, margin: "0 auto" }} />
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 20px 16px" }}>
                  <div className="bebas" style={{ fontSize: 22, color: "var(--yellow)", letterSpacing: 1 }}>AJOUTER UN ALIMENT</div>
                  <button onClick={() => { setShowAdd(false); setSearchText(""); setCustomAliment({ nom: "", kcal: "", p: "", g: "", l: "" }); }}
                    style={{ width: 32, height: 32, borderRadius: "50%", background: "rgba(0,0,0,0.05)", border: "none", color: "#555", fontSize: 16, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>✕</button>
                </div>

                <div style={{ padding: "0 16px" }}>
                  {/* PHOTO */}
                  <label style={{ display: "block", background: "rgba(0,122,255,0.04)", border: "1.5px dashed rgba(0,122,255,0.25)", borderRadius: 14, padding: 16, textAlign: "center", cursor: "pointer", marginBottom: 14 }}>
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
                        <div style={{ width: 44, height: 44, borderRadius: 12, background: "rgba(0,122,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>📸</div>
                        <div style={{ textAlign: "left" }}>
                          <div style={{ fontSize: 14, color: "var(--yellow)", fontWeight: 700 }}>Photo du repas</div>
                          <div style={{ fontSize: 11, color: "#777", marginTop: 2 }}>L'IA estime les macros automatiquement</div>
                        </div>
                      </div>
                    )}
                  </label>

                  {/* Ajout rapide */}
                  <div style={{ marginBottom: 14 }}>
                    <div style={{ fontSize: 10, color: "#555", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 700, marginBottom: 8 }}>Ajout rapide</div>
                    <div style={{ display: "flex", gap: 6, overflowX: "auto", paddingBottom: 4, scrollbarWidth: "none" }}>
                      {ALIMENTS_RAPIDES.map((a, i) => (
                        <button key={i} onClick={() => ajouterAliment(a)} style={{
                          flexShrink: 0, background: "rgba(0,0,0,0.03)", border: "1px solid rgba(0,0,0,0.06)", borderRadius: 12,
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
                    <div style={{ fontSize: 10, color: "#555", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 700, marginBottom: 8 }}>Recherche IA</div>
                    <div style={{ display: "flex", gap: 8 }}>
                      <input value={searchText} onChange={e => setSearchText(e.target.value)} onKeyDown={e => e.key === "Enter" && estimer()}
                        placeholder="ex: 2 œufs brouillés, tartine beurre..."
                        style={{ flex: 1, background: "rgba(0,0,0,0.04)", border: "1px solid rgba(0,0,0,0.08)", borderRadius: 12, padding: "12px 14px", color: "var(--white)", fontSize: 14, minWidth: 0, outline: "none" }} />
                      <button onClick={estimer} disabled={!searchText.trim() || loadingMacros} style={{
                        background: searchText.trim() && !loadingMacros ? "var(--yellow)" : "rgba(0,0,0,0.04)", border: "none", borderRadius: 12, padding: "0 18px",
                        fontSize: 16, fontFamily: "'Bebas Neue',sans-serif", letterSpacing: 1, color: searchText.trim() && !loadingMacros ? "#000" : "#333", cursor: "pointer", flexShrink: 0,
                      }}>{loadingMacros ? "…" : "GO"}</button>
                    </div>
                  </div>

                  {/* Champs manuels */}
                  <div style={{ background: "rgba(0,0,0,0.02)", border: "1px solid rgba(0,0,0,0.05)", borderRadius: 14, padding: "14px", marginBottom: 14 }}>
                    <div style={{ fontSize: 10, color: "#555", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 700, marginBottom: 10 }}>Valeurs nutritionnelles</div>
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
                            placeholder="0" style={{ width: "100%", background: "rgba(0,0,0,0.04)", border: "1px solid rgba(0,0,0,0.07)", borderRadius: 8, padding: "8px 10px", color: f.color, fontSize: 16, fontFamily: "'Bebas Neue',sans-serif", outline: "none", textAlign: "center" }} />
                        </div>
                      ))}
                    </div>
                  </div>

                  <button onClick={() => ajouterAliment({ ...customAliment, kcal: parseInt(customAliment.kcal)||0, p: parseInt(customAliment.p)||0, g: parseInt(customAliment.g)||0, l: parseInt(customAliment.l)||0 })}
                    disabled={!customAliment.nom} style={{
                      width: "100%", padding: 16, borderRadius: 14, border: "none",
                      background: customAliment.nom ? "var(--yellow)" : "rgba(0,0,0,0.04)",
                      color: customAliment.nom ? "#000" : "#333",
                      fontSize: 18, fontFamily: "'Bebas Neue',sans-serif", letterSpacing: 1, cursor: customAliment.nom ? "pointer" : "default",
                    }}>AJOUTER AU JOURNAL ✓</button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ══ TIMING NUTRITIONNEL ══ */}
      {subTab === "timing" && (() => {
        const lastSession = (profile.sessions||[]).slice(-1)[0];
        const sessionHour = lastSession?.date ? new Date(lastSession.date).getHours() : 10;
        const now = new Date();
        const hour = now.getHours();

        const MEAL_TEMPLATES = [
          {
            id: "breakfast",
            icon: "🌅",
            label: "Petit-déjeuner",
            timing: "Au réveil · 7h-9h",
            color: "#fbbf24",
            goal: "Recharge glycogène + protéines",
            items: [
              { name: "Flocons d'avoine 80g", kcal: 300, p: 10, g: 55, l: 6 },
              { name: "Lait d'amande 200ml", kcal: 30, p: 1, g: 2, l: 2 },
              { name: "Banane 1 grande", kcal: 100, p: 1, g: 27, l: 0 },
              { name: "Myrtilles poignée", kcal: 30, p: 0, g: 8, l: 0 },
              { name: "Beurre de cacahuète 20g", kcal: 120, p: 5, g: 4, l: 10 },
            ],
          },
          {
            id: "pre_workout",
            icon: "⚡",
            label: "Pré-séance",
            timing: "1h-2h avant la séance",
            color: "var(--yellow)",
            goal: "Énergie disponible · facile à digérer",
            items: [
              { name: "Pain de seigle 2 tranches", kcal: 160, p: 6, g: 32, l: 2 },
              { name: "Miel 1 cuillère", kcal: 60, p: 0, g: 17, l: 0 },
              { name: "Banane 1 moyenne", kcal: 89, p: 1, g: 23, l: 0 },
              { name: "Café ou thé vert", kcal: 5, p: 0, g: 1, l: 0 },
            ],
          },
          {
            id: "intra",
            icon: "🔥",
            label: "Pendant séance",
            timing: "Si > 75 min · toutes les 20-30 min",
            color: "var(--orange)",
            goal: "Maintenir glycémie · 30-60g glucides/h",
            items: [
              { name: "Gel énergétique (ou dattes x3)", kcal: 100, p: 0, g: 25, l: 0 },
              { name: "Eau 500ml + pincée sel", kcal: 0, p: 0, g: 0, l: 0 },
              { name: "Barre céréales (si besoin)", kcal: 150, p: 4, g: 30, l: 3 },
            ],
          },
          {
            id: "post_workout",
            icon: "💪",
            label: "Post-séance",
            timing: "Dans les 30-45 min après",
            color: "var(--green)",
            goal: "Resynthèse glycogène + réparation musculaire",
            items: [
              { name: "Shake protéiné (25g whey)", kcal: 120, p: 25, g: 5, l: 2 },
              { name: "Lait 250ml", kcal: 125, p: 8, g: 12, l: 5 },
              { name: "Banane 1", kcal: 89, p: 1, g: 23, l: 0 },
              { name: "Blanc de poulet 150g (+ tard)", kcal: 165, p: 31, g: 0, l: 3 },
              { name: "Riz complet 100g sec (+ tard)", kcal: 360, p: 8, g: 78, l: 2 },
            ],
          },
          {
            id: "race_day",
            icon: "🏁",
            label: "Jour de course",
            timing: "3h avant départ",
            color: "var(--purple)",
            goal: "Glycogène plein · zéro stress digestif",
            items: [
              { name: "Riz blanc 150g cuit", kcal: 200, p: 4, g: 44, l: 0 },
              { name: "Œufs brouillés x2", kcal: 140, p: 12, g: 1, l: 10 },
              { name: "Pain blanc 2 tranches grillées", kcal: 160, p: 5, g: 30, l: 2 },
              { name: "Confiture 1 cuillère", kcal: 50, p: 0, g: 13, l: 0 },
              { name: "Jus d'orange 200ml", kcal: 90, p: 1, g: 21, l: 0 },
              { name: "Café 1 (si habitué)", kcal: 5, p: 0, g: 1, l: 0 },
            ],
          },
        ];

        const TIMING_ADVICE = [
          { time: "3h avant", icon: "⏰", tip: "Repas complet riche en glucides complexes. Évite les fibres et les graisses lourdes.", color: "var(--yellow)" },
          { time: "1h avant", icon: "🍌", tip: "Snack léger : banane, toast miel, ou gel. Glucides simples uniquement.", color: "var(--orange)" },
          { time: "Pendant", icon: "💧", tip: "250ml eau toutes les 20min. Si > 75min : 30-60g glucides/h (gel ou dattes).", color: "#38bdf8" },
          { time: "0-30min après", icon: "🥛", tip: "Fenêtre anabolique ! Shake protéiné + glucides simples immédiatement.", color: "var(--green)" },
          { time: "1-2h après", icon: "🍗", tip: "Repas complet : protéines + glucides complexes + légumes. C'est la reconstruction musculaire.", color: "#a78bfa" },
        ];

        const [activeTemplate, setActiveTemplate] = React.useState(null);
        const [addingTemplate, setAddingTemplate] = React.useState(false);

        const totalTemplate = activeTemplate ? activeTemplate.items.reduce((a, i) => ({ kcal: a.kcal+i.kcal, p: a.p+i.p, g: a.g+i.g, l: a.l+i.l }), { kcal:0,p:0,g:0,l:0 }) : null;

        async function addAllToJournal() {
          if (!activeTemplate) return;
          haptic([10,20,10]);
          setAddingTemplate(true);
          const now2 = new Date().toLocaleTimeString("fr-FR", { hour:"2-digit", minute:"2-digit" });
          const newItems = activeTemplate.items.map(item => ({ ...item, id: Date.now() + Math.random(), heure: now2 }));
          const newRepas = [...repasJour, ...newItems];
          setRepasJour(newRepas);
          await storage.set(storageKey, newRepas);
          setAddingTemplate(false);
          setSubTab("journal");
          showToast(`✅ ${activeTemplate.label} ajouté au journal`, "success", 2500);
        }

        return (
          <div>
            {/* Timing advice strip */}
            <div style={{ background: "rgba(0,0,0,0.02)", border: "1px solid rgba(0,0,0,0.06)", borderRadius: 16, padding: "14px 14px", marginBottom: 16 }}>
              <div style={{ fontSize: 10, color: "#777", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 12 }}>⏱️ Timing optimal autour de la séance</div>
              {TIMING_ADVICE.map((a, i) => (
                <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start", marginBottom: 10, paddingBottom: 10, borderBottom: i < TIMING_ADVICE.length-1 ? "1px solid rgba(0,0,0,0.04)" : "none" }}>
                  <div style={{ fontSize: 16, lineHeight: 1, marginTop: 2 }}>{a.icon}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 10, color: a.color, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 2 }}>{a.time}</div>
                    <div style={{ fontSize: 11, color: "#666", lineHeight: 1.5 }}>{a.tip}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Meal template picker */}
            <div style={{ fontSize: 10, color: "#777", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 10 }}>🍽️ Templates repas — Ajouter au journal</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: activeTemplate ? 16 : 0 }}>
              {MEAL_TEMPLATES.map(tmpl => {
                const isActive = activeTemplate?.id === tmpl.id;
                return (
                  <div key={tmpl.id}>
                    <button onClick={() => { haptic([6]); setActiveTemplate(isActive ? null : tmpl); }}
                      style={{ width: "100%", background: isActive ? `rgba(0,0,0,0.04)` : "rgba(0,0,0,0.02)", border: `1.5px solid ${isActive ? tmpl.color+"60" : "rgba(0,0,0,0.06)"}`, borderRadius: 14, padding: "12px 14px", cursor: "pointer", textAlign: "left", transition: "all 0.2s var(--spring)" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <span style={{ fontSize: 22 }}>{tmpl.icon}</span>
                          <div>
                            <div style={{ fontSize: 13, fontWeight: 700, color: isActive ? tmpl.color : "var(--white)" }}>{tmpl.label}</div>
                            <div style={{ fontSize: 10, color: "#777", marginTop: 2 }}>{tmpl.timing}</div>
                          </div>
                        </div>
                        <div style={{ textAlign: "right" }}>
                          <div style={{ fontSize: 9, color: "#555", textTransform: "uppercase" }}>Objectif</div>
                          <div style={{ fontSize: 9, color: tmpl.color, fontWeight: 700, maxWidth: 100, lineHeight: 1.3, textAlign: "right" }}>{tmpl.goal}</div>
                        </div>
                      </div>
                    </button>
                    {isActive && (
                      <div style={{ background: "rgba(255,255,255,0.01)", border: `1px solid ${tmpl.color}20`, borderTop: "none", borderRadius: "0 0 14px 14px", padding: "10px 14px 14px" }}>
                        {tmpl.items.map((item, j) => (
                          <div key={j} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 0", borderBottom: j < tmpl.items.length-1 ? "1px solid rgba(0,0,0,0.03)" : "none" }}>
                            <span style={{ fontSize: 12, color: "#888" }}>{item.name}</span>
                            <span style={{ fontSize: 11, color: "#555" }}>{item.kcal}kcal · {item.p}g P</span>
                          </div>
                        ))}
                        <div style={{ display: "flex", gap: 8, marginTop: 12, paddingTop: 10, borderTop: "1px solid rgba(0,0,0,0.06)" }}>
                          {totalTemplate && [
                            { label: "kcal", val: totalTemplate.kcal, color: "var(--yellow)" },
                            { label: "Prot", val: `${totalTemplate.p}g`, color: "var(--green)" },
                            { label: "Gluc", val: `${totalTemplate.g}g`, color: "var(--orange)" },
                            { label: "Lip", val: `${totalTemplate.l}g`, color: "#a78bfa" },
                          ].map(m => (
                            <div key={m.label} style={{ flex: 1, textAlign: "center" }}>
                              <div className="bebas" style={{ fontSize: 16, color: m.color }}>{m.val}</div>
                              <div style={{ fontSize: 8, color: "#555", textTransform: "uppercase" }}>{m.label}</div>
                            </div>
                          ))}
                        </div>
                        <button onClick={addAllToJournal} disabled={addingTemplate}
                          style={{ width: "100%", marginTop: 10, padding: "12px", borderRadius: 12, border: "none", background: `linear-gradient(135deg, ${tmpl.color}, ${tmpl.color}aa)`, color: tmpl.id==="race_day"?"#000":"#000", fontSize: 13, fontWeight: 700, cursor: "pointer", opacity: addingTemplate ? 0.6 : 1 }}>
                          {addingTemplate ? "Ajout en cours..." : `✅ Ajouter au journal (${totalTemplate?.kcal} kcal)`}
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })()}

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
                background: recetteType === t.id ? `rgba(${t.rgb},0.1)` : "rgba(0,0,0,0.02)",
                border: recetteType === t.id ? `1.5px solid rgba(${t.rgb},0.4)` : "1px solid rgba(0,0,0,0.05)",
                color: recetteType === t.id ? t.color : "#444", cursor: "pointer", transition: "all 0.2s",
              }}><div style={{ fontSize: 18, marginBottom: 4 }}>{t.icon}</div>{t.label}</button>
            ))}
          </div>

          {!recetteIA && !loadingRecette && (
            <div>
              {/* CTA principal */}
              <div style={{ background: "linear-gradient(135deg, rgba(0,122,255,0.06) 0%, rgba(0,0,0,0) 60%)", border: "1.5px solid rgba(0,122,255,0.2)", borderRadius: 18, padding: "20px 18px", marginBottom: 14, position: "relative", overflow: "hidden" }}>
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
              <div style={{ fontSize: 10, color: "#555", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 700, marginBottom: 8 }}>Choisir un style</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {(CATEGORIES_RECETTES[recetteType] || []).map((cat, i) => (
                  <button key={i} onClick={() => genererRecetteIA(cat)} style={{
                    background: "rgba(0,0,0,0.03)", border: "1px solid rgba(0,0,0,0.06)", borderRadius: 20,
                    padding: "7px 14px", fontSize: 12, color: "#666", cursor: "pointer",
                  }}>{cat}</button>
                ))}
              </div>
            </div>
          )}

          {loadingRecette && (
            <div style={{ background: "rgba(0,0,0,0.02)", border: "1px solid rgba(0,0,0,0.05)", borderRadius: 18, padding: "40px 20px", textAlign: "center" }}>
              <div style={{ display: "flex", gap: 8, justifyContent: "center", marginBottom: 16 }}>
                {[0,1,2].map(i => <div key={i} style={{ width: 10, height: 10, borderRadius: "50%", background: "var(--yellow)", animation: `pulse 1.2s ${i*0.2}s ease-in-out infinite` }} />)}
              </div>
              <div style={{ fontSize: 13, color: "#555" }}>Ton coach prépare ta recette…</div>
            </div>
          )}

          {recetteIA && !loadingRecette && (
            <div className="float-up">
              {/* Header recette */}
              <div style={{ background: "rgba(0,0,0,0.02)", border: "1px solid rgba(0,0,0,0.06)", borderRadius: 18, overflow: "hidden", marginBottom: 10 }}>
                <div style={{ background: "linear-gradient(135deg, rgba(0,122,255,0.06) 0%, rgba(0,0,0,0) 60%)", padding: "18px 18px 14px", borderBottom: "1px solid rgba(0,0,0,0.04)" }}>
                  <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                    <div style={{ width: 56, height: 56, borderRadius: 14, background: "rgba(0,122,255,0.1)", border: "1px solid rgba(0,122,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 30, flexShrink: 0 }}>{recetteIA.emoji || "🍽️"}</div>
                    <div style={{ flex: 1 }}>
                      <div className="bebas" style={{ fontSize: 22, color: "var(--white)", lineHeight: 1.1, marginBottom: 4 }}>{recetteIA.nom}</div>
                      <div style={{ display: "flex", gap: 8 }}>
                        <span style={{ fontSize: 11, color: "#777" }}>⏱ {recetteIA.temps}</span>
                        {recetteIA.categorie && <span style={{ fontSize: 11, color: "#555" }}>· {recetteIA.categorie}</span>}
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
                      <div key={m.l} style={{ background: "rgba(0,0,0,0.03)", borderRadius: 10, padding: "8px 6px", textAlign: "center" }}>
                        <div className="bebas" style={{ fontSize: 20, color: m.c, lineHeight: 1 }}>{m.v}{m.u}</div>
                        <div style={{ fontSize: 9, color: "#777", marginTop: 2 }}>{m.l}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Ingrédients */}
                <div style={{ padding: "14px 18px", borderBottom: "1px solid rgba(0,0,0,0.04)" }}>
                  <div style={{ fontSize: 10, color: "var(--yellow)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 10 }}>Ingrédients</div>
                  {(recetteIA.ingredients || []).map((ing, i) => (
                    <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start", marginBottom: 7 }}>
                      <div style={{ width: 5, height: 5, borderRadius: "50%", background: "var(--yellow)", marginTop: 6, flexShrink: 0 }} />
                      <span style={{ fontSize: 13, color: "#ccc", lineHeight: 1.4 }}>{ing}</span>
                    </div>
                  ))}
                </div>

                {/* Préparation */}
                <div style={{ padding: "14px 18px", borderBottom: "1px solid rgba(0,0,0,0.04)" }}>
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
                <button onClick={() => setRecetteIA(null)} style={{ flex: 1, padding: "13px 0", borderRadius: 12, background: "rgba(0,0,0,0.04)", border: "1px solid rgba(0,0,0,0.07)", color: "#888", fontSize: 16, fontFamily: "'Bebas Neue',sans-serif", cursor: "pointer" }}>↺ AUTRE</button>
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
              { label: "Calories", val: totaux.kcal, obj: objectifs.kcal, unit: "kcal", color: kcalColor, bg: "rgba(0,122,255,0.05)", border: "rgba(0,122,255,0.15)" },
              { label: "Protéines", val: totaux.p, obj: objectifs.p, unit: "g", color: "var(--green)", bg: "rgba(57,255,128,0.05)", border: "rgba(57,255,128,0.15)" },
              { label: "Glucides", val: totaux.g, obj: objectifs.g, unit: "g", color: "#aaa", bg: "rgba(0,0,0,0.02)", border: "rgba(0,0,0,0.06)" },
              { label: "Lipides", val: totaux.l, obj: objectifs.l, unit: "g", color: "var(--orange)", bg: "rgba(255,154,60,0.05)", border: "rgba(255,154,60,0.15)" },
            ].map(m => {
              const pct = Math.min(100, Math.round((m.val / m.obj) * 100));
              return (
                <div key={m.label} style={{ background: m.bg, border: `1px solid ${m.border}`, borderRadius: 14, padding: "14px 12px" }}>
                  <div style={{ fontSize: 9, color: "#555", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 6 }}>{m.label}</div>
                  <div className="bebas" style={{ fontSize: 30, color: m.color, lineHeight: 1 }}>{m.val}<span style={{ fontSize: 13, color: "#777" }}>{m.unit}</span></div>
                  <div style={{ fontSize: 10, color: "#555", marginBottom: 6 }}>obj. {m.obj}{m.unit}</div>
                  <div style={{ height: 3, background: "rgba(0,0,0,0.05)", borderRadius: 99, overflow: "hidden" }}>
                    <div style={{ width: `${pct}%`, height: "100%", background: m.color, borderRadius: 99 }} />
                  </div>
                  <div style={{ fontSize: 9, color: m.color, marginTop: 4, fontWeight: 700 }}>{pct}%</div>
                </div>
              );
            })}
          </div>

          {/* Bouton / loading bilan */}
          {repasJour.length === 0 ? (
            <div style={{ background: "rgba(0,0,0,0.02)", border: "1px dashed rgba(0,0,0,0.06)", borderRadius: 14, padding: "24px 20px", textAlign: "center" }}>
              <div style={{ fontSize: 32, marginBottom: 10 }}>📋</div>
              <div style={{ fontSize: 13, color: "#777" }}>Ajoute des aliments dans le journal d'abord.</div>
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
                <div style={{ width: 60, height: 60, borderRadius: "50%", background: bilanIA.note >= 7 ? "rgba(57,255,128,0.12)" : bilanIA.note >= 5 ? "rgba(0,122,255,0.1)" : "rgba(255,71,71,0.1)", border: `2px solid ${bilanIA.note >= 7 ? "rgba(57,255,128,0.4)" : bilanIA.note >= 5 ? "rgba(0,122,255,0.3)" : "rgba(255,71,71,0.3)"}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <div className="bebas" style={{ fontSize: 26, color: bilanIA.note >= 7 ? "var(--green)" : bilanIA.note >= 5 ? "var(--yellow)" : "var(--red)", lineHeight: 1 }}>{bilanIA.note}</div>
                  <div style={{ fontSize: 9, color: "#777" }}>/10</div>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 10, color: "#555", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 5 }}>Analyse du coach</div>
                  <div style={{ fontSize: 13, color: "#ccc", lineHeight: 1.65 }}>{bilanIA.message}</div>
                </div>
              </div>

              {/* Cards feedback */}
              {[
                { key: "top", label: "✅ Point positif", color: "var(--green)", bg: "rgba(57,255,128,0.05)", border: "rgba(57,255,128,0.15)" },
                { key: "manque", label: "⚠️ Ce qui manque", color: "var(--red)", bg: "rgba(255,71,71,0.05)", border: "rgba(255,71,71,0.12)" },
                { key: "conseil_demain", label: "💡 Demain matin", color: "var(--yellow)", bg: "rgba(0,122,255,0.04)", border: "rgba(0,122,255,0.12)" },
                { key: "aliment_recommande", label: "🛒 À ajouter maintenant", color: "var(--orange)", bg: "rgba(255,154,60,0.05)", border: "rgba(255,154,60,0.12)" },
              ].filter(f => bilanIA[f.key]).map(f => (
                <div key={f.key} style={{ background: f.bg, border: `1px solid ${f.border}`, borderRadius: 14, padding: "12px 14px", marginBottom: 8 }}>
                  <div style={{ fontSize: 10, color: f.color, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 5 }}>{f.label}</div>
                  <div style={{ fontSize: 13, color: "#ccc", lineHeight: 1.6 }}>{bilanIA[f.key]}</div>
                </div>
              ))}

              <button onClick={genererBilan} style={{ width: "100%", padding: "13px 0", borderRadius: 12, background: "rgba(0,0,0,0.03)", border: "1px solid rgba(0,0,0,0.06)", color: "#555", fontSize: 14, fontFamily: "'Bebas Neue',sans-serif", cursor: "pointer", marginTop: 4 }}>
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
    <Card style={{ border: "1.5px solid rgba(0,122,255,0.2)", marginBottom: 12 }}>
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
      <div style={{ padding: "14px 20px", borderBottom: "1px solid rgba(0,0,0,0.07)", display: "flex", justifyContent: "space-between", alignItems: "center", background: "var(--bg)" }}>
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
                  <span style={{ fontSize: 11, color: "#777", marginLeft: "auto" }}>{s.distance}</span>
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
            <div className="fade-in" style={{ background: seg.type === "run" ? "rgba(57,255,128,0.06)" : "rgba(0,122,255,0.06)", border: `2px solid ${seg.color}44`, borderRadius: 18, padding: "28px 20px", textAlign: "center" }}>
              <div style={{ fontSize: 48, marginBottom: 8 }}>{seg.icon}</div>
              <div className="bebas" style={{ fontSize: 30, color: seg.color, letterSpacing: 1, lineHeight: 1 }}>{seg.label}</div>
              <div style={{ fontSize: 14, color: "#666", marginTop: 4 }}>{seg.distance}</div>
              <div className="bebas" style={{ fontSize: 60, color: "var(--white)", marginTop: 16, lineHeight: 1, letterSpacing: 2 }}>{fmtTime(elapsed)}</div>
              <div style={{ fontSize: 12, color: "#777", marginTop: 4 }}>sur ce segment</div>
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
                <div style={{ flex: totalStation, background: "rgba(0,122,255,0.08)", border: "1px solid rgba(0,122,255,0.2)", borderRadius: 8, padding: "8px 0", textAlign: "center" }}>
                  <div style={{ fontSize: 10, color: "var(--yellow)", textTransform: "uppercase", letterSpacing: "0.1em" }}>Stations</div>
                  <div className="bebas" style={{ fontSize: 22, color: "var(--yellow)" }}>{fmtTime(totalStation)}</div>
                </div>
              </div>
            </div>

            {/* Splits visuels */}
            <div style={{ background: "rgba(0,0,0,0.02)", border: "1px solid rgba(0,0,0,0.05)", borderRadius: 18, overflow: "hidden", marginBottom: 14 }}>
              <div style={{ padding: "12px 16px 8px", borderBottom: "1px solid rgba(0,0,0,0.04)" }}>
                <div className="bebas" style={{ fontSize: 15, color: "#666", letterSpacing: 1 }}>SPLITS DÉTAILLÉS</div>
              </div>
              {HYROX_SEGMENTS.map((s, i) => {
                const t = splits[s.id] || 0;
                const isRun = s.type === "run";
                const col = isRun ? "var(--green)" : "var(--yellow)";
                const bg = isRun ? "rgba(57,255,128,0.03)" : "rgba(0,122,255,0.03)";
                // Calcul pct relatif au total
                const pct = totalSecs > 0 ? (t / totalSecs) * 100 : 0;
                return (
                  <div key={s.id} style={{ background: bg, borderBottom: i < HYROX_SEGMENTS.length - 1 ? "1px solid rgba(0,0,0,0.03)" : "none", position: "relative", overflow: "hidden" }}>
                    {/* Barre de fond proportionnelle */}
                    <div style={{ position: "absolute", inset: 0, width: `${pct}%`, background: isRun ? "rgba(57,255,128,0.05)" : "rgba(0,122,255,0.04)" }} />
                    <div style={{ position: "relative", display: "flex", alignItems: "center", gap: 10, padding: "10px 16px" }}>
                      <div style={{ width: 26, height: 26, borderRadius: 8, background: isRun ? "rgba(57,255,128,0.12)" : "rgba(0,122,255,0.08)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, flexShrink: 0 }}>{s.icon}</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 13, color: col, fontWeight: 700, lineHeight: 1.2 }}>{s.label}</div>
                        <div style={{ fontSize: 10, color: "#555" }}>{s.distance}</div>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <div className="bebas" style={{ fontSize: 22, color: "var(--white)", lineHeight: 1 }}>{fmtTime(t)}</div>
                        <div style={{ fontSize: 10, color: "#555" }}>{pct.toFixed(0)}% total</div>
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
          <div style={{ position: "absolute", top: -50, right: -50, width: 200, height: 200, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,71,71,0.1) 0%, transparent 70%)", pointerEvents: "none", animation: days <= 7 ? "pulse 2s ease infinite" : "none" }} />

          <div style={{ fontSize: 10, color: "rgba(255,71,71,0.7)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.16em", marginBottom: 14 }}>🏁 {phaseLabel?.text}</div>

          {days !== null && days <= 7 ? (
            /* Mode compte à rebours précis — dernière semaine */
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8, marginBottom: 14 }}>
              {[
                { val: days, label: "JOURS" },
                { val: new Date().getHours(), label: "HEURES" },
                { val: new Date().getMinutes(), label: "MINUTES" },
              ].map(({ val, label }) => (
                <div key={label} style={{ textAlign: "center", background: "rgba(0,0,0,0.4)", borderRadius: 14, padding: "12px 6px", border: "1px solid rgba(255,71,71,0.2)" }}>
                  <div className="bebas" style={{ fontSize: 44, color: "var(--red)", lineHeight: 1, animation: "numberPop 0.5s var(--spring) both" }}>{String(val).padStart(2,"0")}</div>
                  <div style={{ fontSize: 8, color: "rgba(255,71,71,0.5)", fontWeight: 700, letterSpacing: "0.15em" }}>{label}</div>
                </div>
              ))}
            </div>
          ) : (
            /* Mode standard */
            <div style={{ display: "flex", alignItems: "flex-end", gap: 12, marginBottom: 14 }}>
              <div className="bebas number-pop" style={{ fontSize: 80, color: phaseLabel?.color || "var(--red)", lineHeight: 0.9, letterSpacing: -1 }}>{days}</div>
              <div style={{ marginBottom: 8 }}>
                <div style={{ fontSize: 16, color: "#555" }}>jours</div>
                <div style={{ fontSize: 11, color: "#555" }}>avant le départ</div>
              </div>
            </div>
          )}

          <div style={{ fontSize: 12, color: "#777", marginBottom: 14 }}>{new Date(profile.raceDate).toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}</div>

          {/* Barre de progression vers la course */}
          {profile.sessions && profile.sessions.length > 0 && (() => {
            const firstSession = new Date(profile.sessions[0].date);
            const raceDate = new Date(profile.raceDate);
            const total = Math.max(1, raceDate - firstSession);
            const elapsed = Math.max(0, Date.now() - firstSession);
            const pct = Math.min(100, Math.round((elapsed / total) * 100));
            return (
              <div style={{ marginBottom: 14 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 9, color: "#555", marginBottom: 4 }}>
                  <span>Début prépa</span>
                  <span style={{ color: "var(--red)" }}>{pct}% du chemin parcouru</span>
                  <span>Course 🏁</span>
                </div>
                <div style={{ height: 5, background: "rgba(0,0,0,0.05)", borderRadius: 99, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${pct}%`, background: "linear-gradient(90deg, var(--green), var(--yellow), var(--red))", borderRadius: 99, transition: "width 1s ease" }} />
                </div>
              </div>
            );
          })()}

          {/* Message contextuel */}
          <div style={{ background: "rgba(0,0,0,0.35)", borderRadius: 12, padding: "10px 14px", fontSize: 12, color: "#888", lineHeight: 1.6, marginBottom: 14 }}>
            {days <= 1 ? "🔥 Hydrate-toi, mange tes glucides, fais confiance à ton entraînement." : days <= 7 ? "⚡ Réduis le volume de 50%, maintiens 2 sessions d'activation courtes. Dors bien." : days <= 30 ? "🎯 Maximise la spécificité — simulations, allures de course, transitions enchaînées." : "📈 Construis ta base aérobie. Chaque séance compte."}
          </div>
          {/* Bouton simulation intégré */}
          <button onClick={() => setShowSim(true)} style={{ width: "100%", background: "var(--red)", border: "none", borderRadius: 14, padding: "14px", color: "#fff", fontFamily: "'Bebas Neue',sans-serif", fontSize: 18, letterSpacing: 2, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
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
            <div style={{ fontSize: 12, color: "#777", marginTop: 3 }}>Objectif temps · Stations · Mental · Checklist</div>
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
          <div style={{ background: "rgba(0,0,0,0.02)", border: "1px solid rgba(0,0,0,0.06)", borderRadius: 16, padding: "16px", marginBottom: 12 }}>
            <div style={{ fontSize: 10, color: "#555", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 4 }}>Poids de compétition</div>
            <div style={{ fontSize: 11, color: "#2a2a2a", marginBottom: 12 }}>{poidsHyrox.categorie}</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              {[
                { label: "Sled Push", val: poidsHyrox.sled_push, icon: "🛷" },
                { label: "Sled Pull", val: poidsHyrox.sled_pull, icon: "🔗" },
                { label: "Farmers Carry", val: poidsHyrox.farmers_carry, icon: "🧳" },
                { label: "Wall Balls", val: poidsHyrox.wall_balls, icon: "🏀" },
                { label: "Sandbag Lunges", val: poidsHyrox.sandbag_lunges, icon: "🎒" },
              ].map((s, i) => (
                <div key={i} style={{ background: "rgba(0,0,0,0.03)", borderRadius: 10, padding: "10px 12px", display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ fontSize: 20 }}>{s.icon}</span>
                  <div>
                    <div style={{ fontSize: 10, color: "#777", marginBottom: 1 }}>{s.label}</div>
                    <div style={{ fontSize: 15, fontWeight: 700, color: "var(--white)" }}>{s.val}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Stations — cartes numérotées */}
          <div style={{ marginBottom: 12 }}>
            <div style={{ fontSize: 10, color: "#555", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 12 }}>Station par station</div>
            {(strategy.stations || []).map((s, i) => {
              const isRun = i % 2 === 0;
              const col = isRun ? "var(--green)" : "var(--yellow)";
              return (
                <div key={i} style={{ background: isRun ? "rgba(57,255,128,0.03)" : "rgba(0,122,255,0.03)", border: `1px solid ${isRun ? "rgba(57,255,128,0.12)" : "rgba(0,122,255,0.1)"}`, borderLeft: `3px solid ${col}`, borderRadius: 14, padding: "14px 16px", marginBottom: 8 }}>
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

          <button onClick={() => setStrategy(null)} style={{ width: "100%", marginTop: 8, background: "rgba(0,0,0,0.03)", border: "1px solid rgba(0,0,0,0.07)", borderRadius: 12, padding: "13px", color: "#555", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
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
          { label: "Semi-Pro H", time: "5:30", mins: 330, color: "#007AFF" },
          { label: "Semi-Pro F", time: "6:15", mins: 375, color: "#007AFF" },
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
          <div style={{ background: "rgba(0,0,0,0.02)", border: "1px solid rgba(0,0,0,0.06)", borderRadius: 16, padding: "16px", marginTop: 12 }}>
            <div style={{ fontSize: 10, color: "#555", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 14 }}>🏆 Temps de référence HYROX ({gender === "H" ? "Homme" : "Femme"})</div>
            <div style={{ position: "relative", paddingBottom: 8 }}>
              {levelRefs.map((ref, i) => {
                const pct = ((ref.mins - minTime) / (maxTime - minTime)) * 80 + 5;
                return (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                    <div style={{ width: 72, fontSize: 10, color: "#777", textAlign: "right", flexShrink: 0 }}>{ref.label.replace(/ [HF]$/,'')}</div>
                    <div style={{ flex: 1, position: "relative", height: 6, background: "rgba(0,0,0,0.05)", borderRadius: 3 }}>
                      <div style={{ position: "absolute", left: 0, top: 0, width: `${pct}%`, height: "100%", background: ref.color, borderRadius: 3, opacity: 0.6 }} />
                      {objMins && Math.abs(objMins - ref.mins) <= 15 && (
                        <div style={{ position: "absolute", top: -14, left: `${pct}%`, transform: "translateX(-50%)", fontSize: 14, filter: "drop-shadow(0 0 4px #007AFF)" }}>🎯</div>
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

      {/* ── RÉSULTATS DE COURSES OFFICIELLES ── */}
      {(()=>{
        const raceLogKey = `fitrace_race_results_${profile.name}`;
        const [raceResults, setRaceResults] = React.useState([]);
        const [showAddRace, setShowAddRace] = React.useState(false);
        const [newRace, setNewRace] = React.useState({ date: "", location: "", category: profile.hyroxCategorie || "open", timeH: "", timeM: "", timeS: "", rank: "", totalParticipants: "", notes: "" });

        React.useEffect(() => {
          storage.get(raceLogKey).then(r => { if (r) setRaceResults(r); });
        }, []);

        const saveRace = async () => {
          if (!newRace.date || !newRace.timeH) return;
          const result = {
            ...newRace,
            id: Date.now(),
            totalTime: `${String(newRace.timeH).padStart(1,"0")}:${String(newRace.timeM||"00").padStart(2,"0")}:${String(newRace.timeS||"00").padStart(2,"0")}`,
            totalSecs: parseInt(newRace.timeH||0)*3600 + parseInt(newRace.timeM||0)*60 + parseInt(newRace.timeS||0),
          };
          const updated = [...raceResults, result].sort((a,b) => b.id - a.id);
          setRaceResults(updated);
          await storage.set(raceLogKey, updated);
          setShowAddRace(false);
          setNewRace({ date: "", location: "", category: profile.hyroxCategorie || "open", timeH: "", timeM: "", timeS: "", rank: "", totalParticipants: "", notes: "" });
        };

        const bestTime = raceResults.length ? raceResults.reduce((best, r) => r.totalSecs < (best?.totalSecs || Infinity) ? r : best, null) : null;

        return (
          <div style={{ marginBottom: 14 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <div style={{ fontSize: 10, color: "#555", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em" }}>🏅 Mes Résultats de Courses</div>
              <button onClick={() => setShowAddRace(true)} style={{ background: "rgba(0,122,255,0.1)", border: "1px solid rgba(0,122,255,0.25)", borderRadius: 20, padding: "5px 12px", fontSize: 11, color: "var(--yellow)", cursor: "pointer", fontWeight: 700 }}>+ Ajouter</button>
            </div>

            {/* Add race modal */}
            {showAddRace && (
              <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.9)", zIndex: 500, display: "flex", alignItems: "flex-end" }}
                onClick={() => setShowAddRace(false)}>
                <div className="slide-up" onClick={e => e.stopPropagation()}
                  style={{ background: "var(--bg2)", borderRadius: "20px 20px 0 0", padding: "24px 20px 40px", width: "100%", maxWidth: 480, margin: "0 auto", maxHeight: "80vh", overflowY: "auto" }}>
                  <div style={{ width: 40, height: 4, borderRadius: 99, background: "#333", margin: "0 auto 20px" }} />
                  <div className="bebas" style={{ fontSize: 22, color: "var(--yellow)", marginBottom: 20 }}>📝 NOUVELLE COURSE</div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 14 }}>
                    <div>
                      <div style={{ fontSize: 10, color: "#555", marginBottom: 6, textTransform: "uppercase" }}>Date</div>
                      <input type="date" value={newRace.date} onChange={e => setNewRace(r => ({ ...r, date: e.target.value }))}
                        style={{ width: "100%", background: "var(--bg3)", border: "1px solid rgba(0,0,0,0.08)", borderRadius: 10, padding: "10px", color: "var(--white)", fontSize: 13, outline: "none" }} />
                    </div>
                    <div>
                      <div style={{ fontSize: 10, color: "#555", marginBottom: 6, textTransform: "uppercase" }}>Ville</div>
                      <input type="text" value={newRace.location} onChange={e => setNewRace(r => ({ ...r, location: e.target.value }))} placeholder="Paris, Lyon..."
                        style={{ width: "100%", background: "var(--bg3)", border: "1px solid rgba(0,0,0,0.08)", borderRadius: 10, padding: "10px", color: "var(--white)", fontSize: 13, outline: "none" }} />
                    </div>
                  </div>

                  <div style={{ marginBottom: 14 }}>
                    <div style={{ fontSize: 10, color: "#555", marginBottom: 6, textTransform: "uppercase" }}>Catégorie</div>
                    <div style={{ display: "flex", gap: 6 }}>
                      {["Open","Pro","Mixed Relay","Doubles"].map(cat => (
                        <button key={cat} onClick={() => setNewRace(r => ({ ...r, category: cat.toLowerCase() }))}
                          style={{ flex: 1, padding: "8px 4px", borderRadius: 8, fontSize: 11, fontWeight: 700, background: newRace.category === cat.toLowerCase() ? "rgba(0,122,255,0.15)" : "var(--bg3)", border: `1.5px solid ${newRace.category === cat.toLowerCase() ? "var(--yellow)" : "transparent"}`, color: newRace.category === cat.toLowerCase() ? "var(--yellow)" : "#555", cursor: "pointer" }}>
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div style={{ marginBottom: 14 }}>
                    <div style={{ fontSize: 10, color: "#555", marginBottom: 6, textTransform: "uppercase" }}>Temps total</div>
                    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                      {[["timeH","H","0-3"],["timeM","min","00-59"],["timeS","sec","00-59"]].map(([k,lbl,pl]) => (
                        <div key={k} style={{ flex: 1, textAlign: "center" }}>
                          <input type="number" value={newRace[k]} onChange={e => setNewRace(r => ({ ...r, [k]: e.target.value }))} placeholder={pl}
                            style={{ width: "100%", background: "var(--bg3)", border: "1.5px solid rgba(0,0,0,0.08)", borderRadius: 10, padding: "14px 4px", color: "var(--white)", fontSize: 24, textAlign: "center", outline: "none", fontFamily: "'Bebas Neue',sans-serif" }} />
                          <div style={{ fontSize: 9, color: "#555", marginTop: 4 }}>{lbl}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 14 }}>
                    <div>
                      <div style={{ fontSize: 10, color: "#555", marginBottom: 6, textTransform: "uppercase" }}>Classement</div>
                      <input type="number" value={newRace.rank} onChange={e => setNewRace(r => ({ ...r, rank: e.target.value }))} placeholder="ex: 42"
                        style={{ width: "100%", background: "var(--bg3)", border: "1px solid rgba(0,0,0,0.08)", borderRadius: 10, padding: "10px", color: "var(--white)", fontSize: 16, textAlign: "center", outline: "none", fontFamily: "'Bebas Neue',sans-serif" }} />
                    </div>
                    <div>
                      <div style={{ fontSize: 10, color: "#555", marginBottom: 6, textTransform: "uppercase" }}>Total participants</div>
                      <input type="number" value={newRace.totalParticipants} onChange={e => setNewRace(r => ({ ...r, totalParticipants: e.target.value }))} placeholder="ex: 350"
                        style={{ width: "100%", background: "var(--bg3)", border: "1px solid rgba(0,0,0,0.08)", borderRadius: 10, padding: "10px", color: "var(--white)", fontSize: 16, textAlign: "center", outline: "none", fontFamily: "'Bebas Neue',sans-serif" }} />
                    </div>
                  </div>

                  <div style={{ marginBottom: 20 }}>
                    <div style={{ fontSize: 10, color: "#555", marginBottom: 6, textTransform: "uppercase" }}>Bilan / Notes</div>
                    <textarea value={newRace.notes} onChange={e => setNewRace(r => ({ ...r, notes: e.target.value }))} placeholder="Ce qui a bien marché, ce qui est à améliorer..."
                      style={{ width: "100%", background: "var(--bg3)", border: "1px solid rgba(0,0,0,0.08)", borderRadius: 10, padding: "10px", color: "var(--white)", fontSize: 13, minHeight: 60, resize: "vertical", outline: "none", fontFamily: "'DM Sans',sans-serif" }} />
                  </div>

                  <button onClick={saveRace} disabled={!newRace.date || !newRace.timeH}
                    style={{ width: "100%", padding: 16, background: newRace.date && newRace.timeH ? "var(--yellow)" : "rgba(0,0,0,0.05)", border: "none", borderRadius: 14, fontSize: 16, fontFamily: "'Bebas Neue',sans-serif", letterSpacing: 2, color: newRace.date && newRace.timeH ? "#000" : "#333", cursor: newRace.date && newRace.timeH ? "pointer" : "default" }}>
                    🏁 ENREGISTRER MA COURSE
                  </button>
                </div>
              </div>
            )}

            {raceResults.length === 0 ? (
              <div style={{ background: "rgba(0,0,0,0.02)", border: "1px dashed rgba(255,71,71,0.15)", borderRadius: 14, padding: "28px 20px", textAlign: "center" }}>
                <div style={{ fontSize: 40, marginBottom: 10 }}>🏅</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: "var(--white)", marginBottom: 6 }}>Aucun résultat encore</div>
                <div style={{ fontSize: 12, color: "#777" }}>Ajoute ton premier temps de course officiel</div>
              </div>
            ) : (
              <>
                {bestTime && (
                  <div style={{ background: "linear-gradient(135deg, rgba(255,71,71,0.08), rgba(0,122,255,0.04))", border: "1.5px solid rgba(255,71,71,0.2)", borderRadius: 16, padding: "14px 16px", marginBottom: 10, display: "flex", alignItems: "center", gap: 14 }}>
                    <div style={{ fontSize: 32 }}>🏆</div>
                    <div>
                      <div style={{ fontSize: 10, color: "var(--red)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 2 }}>Meilleur temps</div>
                      <div className="bebas" style={{ fontSize: 28, color: "var(--yellow)", lineHeight: 1 }}>{bestTime.totalTime}</div>
                      <div style={{ fontSize: 11, color: "#555" }}>{bestTime.location} · {new Date(bestTime.date + "T12:00:00").toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}</div>
                    </div>
                  </div>
                )}
                {raceResults.map((r, i) => (
                  <div key={r.id} style={{ background: "rgba(0,0,0,0.02)", border: "1px solid rgba(255,71,71,0.12)", borderLeft: "3px solid rgba(255,71,71,0.3)", borderRadius: 14, padding: "12px 14px", marginBottom: 8 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                      <div>
                        <div style={{ display: "flex", gap: 6, alignItems: "center", marginBottom: 3 }}>
                          <span style={{ fontSize: 9, color: "#777", background: "rgba(0,0,0,0.05)", borderRadius: 4, padding: "2px 6px", textTransform: "uppercase", fontWeight: 700 }}>{r.category}</span>
                          <span style={{ fontSize: 10, color: "#777" }}>{r.location || "HYROX"}</span>
                        </div>
                        <div className="bebas" style={{ fontSize: 24, color: r.id === bestTime?.id ? "var(--yellow)" : "var(--white)", lineHeight: 1 }}>{r.totalTime}</div>
                        <div style={{ fontSize: 10, color: "#555", marginTop: 2 }}>{new Date(r.date + "T12:00:00").toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" })}</div>
                      </div>
                      {r.rank && r.totalParticipants && (
                        <div style={{ textAlign: "center", background: "rgba(0,0,0,0.03)", border: "1px solid rgba(0,0,0,0.06)", borderRadius: 10, padding: "8px 12px" }}>
                          <div className="bebas" style={{ fontSize: 22, color: "var(--red)", lineHeight: 1 }}>{r.rank}</div>
                          <div style={{ fontSize: 9, color: "#777" }}>/ {r.totalParticipants}</div>
                          <div style={{ fontSize: 9, color: "#777" }}>Top {Math.round((r.rank / r.totalParticipants) * 100)}%</div>
                        </div>
                      )}
                    </div>
                    {r.notes && <div style={{ fontSize: 11, color: "#555", marginTop: 8, lineHeight: 1.5, fontStyle: "italic" }}>{r.notes}</div>}
                  </div>
                ))}
              </>
            )}
          </div>
        );
      })()}

      {/* ── CALCULATEUR DE SPLITS ── */}
      {(() => {
        const STATIONS_SPLITS = [
          { id: "ski", label: "SkiErg", icon: "⛷️", dist: "1000m", refH: 210, refF: 270 },
          { id: "sledpush", label: "Sled Push", icon: "🛷", dist: "50m", refH: 180, refF: 240 },
          { id: "sledpull", label: "Sled Pull", icon: "🔗", dist: "50m", refH: 150, refF: 200 },
          { id: "burpee", label: "Burpee BJ", icon: "🤸", dist: "80m", refH: 300, refF: 360 },
          { id: "rowing", label: "Rowing", icon: "🚣", dist: "1000m", refH: 210, refF: 270 },
          { id: "farmers", label: "Farmers Carry", icon: "🧳", dist: "200m", refH: 120, refF: 150 },
          { id: "sandbag", label: "Sandbag Lunges", icon: "🎒", dist: "100m", refH: 240, refF: 300 },
          { id: "wallballs", label: "Wall Balls", icon: "🏀", dist: "100 reps", refH: 300, refF: 420 },
        ];
        const RUN_DIST_KM = 1; // 1km par segment running × 8 = 8km
        const gender = profile.genre === "F" ? "F" : "H";

        const [targetH, setTargetH] = React.useState("1");
        const [targetM, setTargetM] = React.useState("30");
        const [splitsOpen, setSplitsOpen] = React.useState(false);

        const totalSecs = (parseInt(targetH)||0)*3600 + (parseInt(targetM)||0)*60;
        const stationsTotal = STATIONS_SPLITS.reduce((a,s) => a + (gender==="H" ? s.refH : s.refF), 0);
        const transitionsSecs = 8 * 30; // ~30s par transition
        const runSecs = Math.max(0, totalSecs - stationsTotal - transitionsSecs);
        const runPacePerKm = runSecs / 8;
        const paceMin = Math.floor(runPacePerKm / 60);
        const paceSec = Math.round(runPacePerKm % 60);
        const fmtSplit = (s) => `${Math.floor(s/60)}:${String(Math.round(s%60)).padStart(2,"0")}`;

        return (
          <div style={{ background: "rgba(0,0,0,0.02)", border: "1px solid rgba(0,0,0,0.06)", borderRadius: 16, padding: "16px", marginTop: 12 }}>
            <div onClick={() => setSplitsOpen(o=>!o)} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer", marginBottom: splitsOpen ? 14 : 0 }}>
              <div style={{ fontSize: 10, color: "#555", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em" }}>⏱ Calculateur de splits race</div>
              <div style={{ color: "#555", fontSize: 14, transform: splitsOpen ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}>▼</div>
            </div>
            {splitsOpen && (
              <>
                {/* Saisie temps cible */}
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                  <div style={{ fontSize: 12, color: "#666" }}>Temps cible :</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <input type="number" min="0" max="5" value={targetH} onChange={e => setTargetH(e.target.value)}
                      style={{ width: 50, background: "#111", border: "1px solid #333", borderRadius: 8, padding: "8px 10px", color: "var(--yellow)", fontSize: 16, fontWeight: 700, textAlign: "center" }} />
                    <span style={{ color: "#555", fontWeight: 700 }}>h</span>
                    <input type="number" min="0" max="59" value={targetM} onChange={e => setTargetM(e.target.value)}
                      style={{ width: 50, background: "#111", border: "1px solid #333", borderRadius: 8, padding: "8px 10px", color: "var(--yellow)", fontSize: 16, fontWeight: 700, textAlign: "center" }} />
                    <span style={{ color: "#555", fontWeight: 700 }}>min</span>
                  </div>
                </div>

                {/* Résumé running */}
                <div style={{ background: "rgba(0,122,255,0.06)", border: "1px solid rgba(0,122,255,0.15)", borderRadius: 12, padding: "12px 14px", marginBottom: 12 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                    <span style={{ fontSize: 12, color: "#777" }}>🏃 Allure running (8 × 1km)</span>
                    <span className="bebas" style={{ fontSize: 18, color: "var(--yellow)" }}>{paceMin}:{String(paceSec).padStart(2,"0")} /km</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ fontSize: 11, color: "#777" }}>Stations estimées</span>
                    <span style={{ fontSize: 11, color: "#555" }}>{fmtSplit(stationsTotal)}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginTop: 2 }}>
                    <span style={{ fontSize: 11, color: "#777" }}>Running total</span>
                    <span style={{ fontSize: 11, color: "#555" }}>{fmtSplit(runSecs)}</span>
                  </div>
                </div>

                {/* Splits par station */}
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  {STATIONS_SPLITS.map((st, i) => {
                    const refSecs = gender === "H" ? st.refH : st.refF;
                    const ratio = refSecs / stationsTotal;
                    const allocated = Math.round(ratio * (totalSecs - runSecs - transitionsSecs));
                    return (
                      <div key={st.id} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div style={{ width: 28, fontSize: 16, textAlign: "center", flexShrink: 0 }}>{st.icon}</div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 11, color: "#777", marginBottom: 2 }}>{st.label} <span style={{ color: "#555" }}>· {st.dist}</span></div>
                          <div style={{ height: 3, background: "rgba(0,0,0,0.05)", borderRadius: 99, overflow: "hidden" }}>
                            <div style={{ height: "100%", width: `${(refSecs/Math.max(...STATIONS_SPLITS.map(s=>gender==="H"?s.refH:s.refF)))*100}%`, background: "rgba(0,122,255,0.4)", borderRadius: 99 }} />
                          </div>
                        </div>
                        <div className="bebas" style={{ fontSize: 16, color: "var(--yellow)", minWidth: 42, textAlign: "right" }}>{fmtSplit(allocated)}</div>
                      </div>
                    );
                  })}
                </div>
                <div style={{ fontSize: 9, color: "#2a2a2a", textAlign: "center", marginTop: 10 }}>Estimations basées sur les temps de référence {gender === "H" ? "masculins" : "féminins"} HYROX</div>
              </>
            )}
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
      if (session && session.role === "athlete") {
        try {
          let existing = null;
          // 1. Chercher par email
          if (session.email) {
            existing = await storage.get(`athlete_email_${session.email}`);
          }
          // 2. Fallback par nom
          if (!existing && session.name) {
            existing = await storage.get(`athlete_${session.name}`);
          }
          // 3. Si trouvé, restaurer la session
          if (existing) {
            // S'assurer que l'email est dans le profil
            if (session.email && !existing.email) {
              existing = { ...existing, email: session.email };
              await storage.set(`athlete_email_${session.email}`, existing);
            }
            setProfile(existing);
            setNeedTests(!existing.onboardingComplete);
            setUser({ role: "athlete", name: session.name || existing.name, email: session.email || existing.email });
          } else if (session.email) {
            // Session existe mais profil perdu — relancer l'onboarding avec les infos connues
            setUser({ role: "athlete", name: session.name || "", email: session.email });
          }
        } catch (e) { console.error("Session restore error:", e); }
      } else if (session && session.role === "coach") {
        setUser({ role: "coach", name: "Coach" });
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

  async function handleTestsComplete(updatedProfile) {
    setProfile(updatedProfile);
    setNeedTests(false);
    // Sauvegarder les résultats de tests en localStorage
    const key = (user?.email || updatedProfile.email)
      ? `athlete_email_${user?.email || updatedProfile.email}`
      : `athlete_${updatedProfile.name}`;
    await storage.set(key, { ...updatedProfile, onboardingComplete: true });
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
          <circle cx="60" cy="60" r="50" fill="rgba(0,122,255,0.06)" />
          <circle cx="60" cy="60" r="50" fill="none" stroke="rgba(0,122,255,0.08)" strokeWidth="6"/>
          <circle cx="60" cy="60" r="50" fill="none" stroke="#007AFF" strokeWidth="6" strokeLinecap="round"
            strokeDasharray="352" strokeDashoffset="352"
            transform="rotate(-90 60 60)"
            style={{ animation: "splashRing 1.4s cubic-bezier(0.16,1,0.3,1) 0.2s forwards" }}/>
        </svg>
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 36, color: "#007AFF", letterSpacing: 3, lineHeight: 1, animation: "splashFade 0.6s 0.5s both" }}>FIT<span style={{ color: "#f0f0f0" }}>RACE</span></div>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#39ff80", marginTop: 4, animation: "splashPulse 1.2s 0.8s ease-in-out infinite" }}/>
        </div>
      </div>
      {/* Tagline */}
      <div style={{ fontSize: 13, color: "#555", letterSpacing: "0.08em", animation: "splashFade 0.6s 0.9s both" }}>
        Ton coach HYROX IA
      </div>
    </div>
  );

  if (!user) return <LoginScreen onLogin={handleLogin} />;
  if (user.role === "coach") return <CoachApp />;
  if (!profile) return <OnboardingScreen athleteName={user.name} athleteEmail={user.email} onComplete={handleOnboardingComplete} />;
  if (needTests && !profile.onboardingComplete) return <TestsBattery profile={profile} onComplete={handleTestsComplete} />;

  return (
    <ErrorBoundary>
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
    </ErrorBoundary>
  );
}
