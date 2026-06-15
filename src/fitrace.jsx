import { useState, useEffect, useCallback } from "react";

// ============================================================
// STYLES GLOBAUX
// ============================================================
const GLOBAL_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500;600;700&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg: #0a0a0a;
    --bg2: #111111;
    --bg3: #1a1a1a;
    --yellow: #e8ff47;
    --red: #ff4747;
    --green: #39ff80;
    --white: #f0f0f0;
    --gray: #555;
    --gray2: #333;
    --font-title: 'Bebas Neue', sans-serif;
    --font-body: 'DM Sans', sans-serif;
  }

  html, body { background: var(--bg); color: var(--white); font-family: var(--font-body); min-height: 100vh; overflow-x: hidden; }

  #root { min-height: 100vh; }

  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: var(--bg2); }
  ::-webkit-scrollbar-thumb { background: var(--yellow); border-radius: 2px; }

  .bebas { font-family: var(--font-title); letter-spacing: 0.04em; }

  button { cursor: pointer; border: none; outline: none; font-family: var(--font-body); transition: all 0.2s; }
  input, select, textarea { font-family: var(--font-body); }

  input:focus, select:focus, textarea:focus { outline: 2px solid var(--yellow); outline-offset: 2px; }

  @keyframes fadeIn { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.5; } }
  @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
  @keyframes slideIn { from { opacity: 0; transform: translateX(-20px); } to { opacity: 1; transform: translateX(0); } }

  .fade-in { animation: fadeIn 0.4s ease both; }
  .pulse { animation: pulse 2s infinite; }
`;

// ============================================================
// STORAGE HELPERS
// ============================================================
const storage = {
  async get(key) {
    try {
      const r = await window.storage.get(key);
      return r ? JSON.parse(r.value) : null;
    } catch { return null; }
  },
  async set(key, value) {
    try {
      await window.storage.set(key, JSON.stringify(value));
    } catch (e) { console.error("Storage error", e); }
  },
  async list(prefix) {
    try {
      const r = await window.storage.list(prefix);
      return r?.keys || [];
    } catch { return []; }
  }
};

// ============================================================
// CONSTANTES
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

function calcVMA(distanceMeters) {
  // Demi-Cooper 6min : VMA (km/h) = distance (m) / 100
  return parseFloat((distanceMeters / 100).toFixed(1));
}

function epley1RM(weight, reps) {
  return Math.round(weight * (1 + reps / 30));
}

function paceFromVMA(vmaKmh, pct) {
  const speed = vmaKmh * (pct / 100);
  const minPerKm = 60 / speed;
  const min = Math.floor(minPerKm);
  const sec = Math.round((minPerKm - min) * 60);
  return `${min}:${sec.toString().padStart(2, "0")}/km`;
}

function daysUntil(dateStr) {
  if (!dateStr) return null;
  const diff = new Date(dateStr) - new Date();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

// ============================================================
// API ANTHROPIC
// ============================================================
async function callClaude(systemPrompt, userPrompt, maxTokens = 1000) {
  try {
    // Passe par /api/claude (Vercel Function) pour ne pas exposer la clé API
    const response = await fetch("/api/claude", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: maxTokens,
        system: systemPrompt,
        messages: [{ role: "user", content: userPrompt }],
      }),
    });
    const data = await response.json();
    if (data.error) throw new Error(data.error.message);
    return data.content?.map(b => b.text || "").join("") || "";
  } catch (e) {
    console.error("Claude API error", e);
    return null;
  }
}

// ============================================================
// COMPOSANTS UI DE BASE
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
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        borderRadius: 8,
        fontFamily: "var(--font-body)",
        transition: "all 0.18s",
        opacity: disabled ? 0.45 : 1,
        ...styles[variant],
        ...sizes[size],
        ...style,
      }}
    >
      {children}
    </button>
  );
}

function Card({ children, style, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{
        background: "var(--bg2)",
        border: "1px solid var(--bg3)",
        borderRadius: 12,
        padding: 18,
        cursor: onClick ? "pointer" : "default",
        transition: onClick ? "border-color 0.2s" : undefined,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function Input({ label, value, onChange, type = "text", placeholder, style, min, max, step }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      {label && <label style={{ fontSize: 12, color: "#aaa", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.06em" }}>{label}</label>}
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        min={min} max={max} step={step}
        style={{
          background: "var(--bg3)",
          border: "1px solid var(--gray2)",
          borderRadius: 8,
          padding: "10px 14px",
          color: "var(--white)",
          fontSize: 15,
          width: "100%",
          ...style,
        }}
      />
    </div>
  );
}

function Select({ label, value, onChange, options, style }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      {label && <label style={{ fontSize: 12, color: "#aaa", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.06em" }}>{label}</label>}
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        style={{
          background: "var(--bg3)",
          border: "1px solid var(--gray2)",
          borderRadius: 8,
          padding: "10px 14px",
          color: "var(--white)",
          fontSize: 15,
          width: "100%",
          ...style,
        }}
      >
        {options.map(o => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </div>
  );
}

function Badge({ label, color = "var(--yellow)" }) {
  return (
    <span style={{ background: color + "22", color, border: `1px solid ${color}44`, borderRadius: 20, padding: "3px 10px", fontSize: 12, fontWeight: 600 }}>
      {label}
    </span>
  );
}

function Spinner() {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16, padding: 40 }}>
      <div style={{ width: 40, height: 40, border: "3px solid var(--bg3)", borderTop: "3px solid var(--yellow)", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
      <span style={{ color: "#aaa", fontSize: 14 }}>L'IA réfléchit…</span>
    </div>
  );
}

function ProgressBar({ value, max = 100, color = "var(--yellow)", height = 6 }) {
  return (
    <div style={{ background: "var(--bg3)", borderRadius: 99, height, overflow: "hidden" }}>
      <div style={{ width: `${Math.min(100, (value / max) * 100)}%`, height: "100%", background: color, borderRadius: 99, transition: "width 0.5s ease" }} />
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
// ÉCRAN DE CONNEXION / ACCUEIL
// ============================================================
function LoginScreen({ onLogin }) {
  const [mode, setMode] = useState("choose"); // choose | athlete | coach
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const COACH_CODE = "FITRACE2025";

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 24, background: "var(--bg)" }}>
      <style>{GLOBAL_STYLES}</style>

      {/* Logo */}
      <div style={{ textAlign: "center", marginBottom: 48 }}>
        <div className="bebas fade-in" style={{ fontSize: 72, color: "var(--yellow)", lineHeight: 0.9, letterSpacing: 2 }}>FIT</div>
        <div className="bebas fade-in" style={{ fontSize: 72, color: "var(--white)", lineHeight: 0.9, letterSpacing: 2 }}>RACE</div>
        <div style={{ marginTop: 12, color: "#888", fontSize: 13, letterSpacing: "0.1em", textTransform: "uppercase" }}>Entraînement HYROX · IA Adaptative</div>
      </div>

      {mode === "choose" && (
        <div className="fade-in" style={{ display: "flex", flexDirection: "column", gap: 16, width: "100%", maxWidth: 320 }}>
          <Btn size="lg" onClick={() => setMode("athlete")} style={{ width: "100%" }}>
            👤 Je suis un athlète
          </Btn>
          <Btn size="lg" variant="ghost" onClick={() => setMode("coach")} style={{ width: "100%" }}>
            🏅 Je suis le coach
          </Btn>
        </div>
      )}

      {mode === "athlete" && (
        <div className="fade-in" style={{ display: "flex", flexDirection: "column", gap: 16, width: "100%", maxWidth: 320 }}>
          <Input label="Ton prénom" value={name} onChange={setName} placeholder="ex: Sophie" />
          <Btn size="lg" disabled={!name.trim()} onClick={() => onLogin("athlete", name.trim())} style={{ width: "100%" }}>
            Commencer →
          </Btn>
          <Btn variant="dark" size="sm" onClick={() => setMode("choose")} style={{ width: "100%" }}>← Retour</Btn>
        </div>
      )}

      {mode === "coach" && (
        <div className="fade-in" style={{ display: "flex", flexDirection: "column", gap: 16, width: "100%", maxWidth: 320 }}>
          <Input label="Code coach" value={code} onChange={setCode} placeholder="Code secret" type="password" />
          <Btn size="lg" disabled={!code} onClick={() => {
            if (code === COACH_CODE) onLogin("coach", "Coach");
            else alert("Code incorrect !");
          }} style={{ width: "100%" }}>
            Accès Coach →
          </Btn>
          <Btn variant="dark" size="sm" onClick={() => setMode("choose")} style={{ width: "100%" }}>← Retour</Btn>
        </div>
      )}

      <div style={{ marginTop: 40, color: "#444", fontSize: 12, textAlign: "center" }}>
        FITRACE · Powered by Claude Sonnet
      </div>
    </div>
  );
}

// ============================================================
// ONBOARDING ATHLÈTE
// ============================================================
function OnboardingScreen({ athleteName, onComplete }) {
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState({
    name: athleteName,
    poids: "",
    age: "",
    sexe: "homme",
    raceDate: "",
    niveauRessenti: "intermédiaire",
    dejaFaitHyrox: "non",
    previousChrono: "",
    previousDate: "",
    squat1RM: "",
    deadlift1RM: "",
    squatReps: "",
    squatWeight: "",
    deadliftReps: "",
    deadliftWeight: "",
    aiProfile: "",
  });
  const set = (k, v) => setProfile(p => ({ ...p, [k]: v }));

  const steps = [
    { title: "Profil de base", icon: "👤" },
    { title: "Niveau & historique", icon: "📊" },
    { title: "Force estimée", icon: "💪" },
    { title: "Profil IA généré", icon: "🤖" },
  ];

  async function generateAIProfile() {
    setLoading(true);
    const squat = profile.squat1RM || (profile.squatWeight && profile.squatReps
      ? epley1RM(parseFloat(profile.squatWeight), parseInt(profile.squatReps))
      : Math.round(parseFloat(profile.poids || 70) * 1.2));
    const dl = profile.deadlift1RM || (profile.deadliftWeight && profile.deadliftReps
      ? epley1RM(parseFloat(profile.deadliftWeight), parseInt(profile.deadliftReps))
      : Math.round(parseFloat(profile.poids || 70) * 1.5));

    const prompt = `Tu es un coach HYROX expert. Génère un profil athlète court (200 mots max) en français pour :
- Prénom: ${profile.name}
- Âge: ${profile.age} ans, Poids: ${profile.poids}kg, Sexe: ${profile.sexe}
- Niveau ressenti: ${profile.niveauRessenti}
- Déjà fait HYROX: ${profile.dejaFaitHyrox}${profile.previousChrono ? `, chrono: ${profile.previousChrono}` : ""}
- Squat 1RM estimé: ${squat}kg
- Deadlift 1RM estimé: ${dl}kg
- Date de course: ${profile.raceDate || "non définie"}

Inclus: analyse du profil, zones d'entraînement cardio estimées (VMA supposée selon niveau), points forts/faibles probables, objectif HYROX réaliste, et ton d'encouragement. Utilise des emojis. Sois direct et personnalisé.`;

    const result = await callClaude(
      "Tu es un coach HYROX expert et bienveillant. Réponds toujours en français.",
      prompt
    );

    set("aiProfile", result || "Profil généré — complète tes tests pour affiner ton programme !");
    set("squat1RM_calc", squat);
    set("deadlift1RM_calc", dl);
    setLoading(false);
    setStep(3);
  }

  async function finishOnboarding() {
    const finalProfile = {
      ...profile,
      createdAt: new Date().toISOString(),
      tests: {},
      sessions: [],
      adaptations: [],
      alerts: [],
      week: 1,
    };
    await storage.set(`athlete_${athleteName}`, finalProfile);
    onComplete(finalProfile);
  }

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", padding: "24px 20px" }}>
      <style>{GLOBAL_STYLES}</style>

      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: 32 }}>
        <div className="bebas" style={{ fontSize: 42, color: "var(--yellow)" }}>FITRACE</div>
        <div style={{ color: "#888", fontSize: 13, marginTop: 4 }}>
          {steps[step].icon} {steps[step].title}
        </div>
        {/* Progress */}
        <div style={{ display: "flex", gap: 6, justifyContent: "center", marginTop: 16 }}>
          {steps.map((s, i) => (
            <div key={i} style={{ height: 4, flex: 1, maxWidth: 60, borderRadius: 99, background: i <= step ? "var(--yellow)" : "var(--bg3)", transition: "background 0.3s" }} />
          ))}
        </div>
      </div>

      <div className="fade-in" style={{ maxWidth: 480, margin: "0 auto" }}>

        {/* ÉTAPE 0 : Profil */}
        {step === 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            <Card>
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <Input label="Poids (kg)" value={profile.poids} onChange={v => set("poids", v)} type="number" placeholder="ex: 72" />
                <Input label="Âge" value={profile.age} onChange={v => set("age", v)} type="number" placeholder="ex: 28" />
                <Select label="Sexe" value={profile.sexe} onChange={v => set("sexe", v)} options={[
                  { value: "homme", label: "Homme" }, { value: "femme", label: "Femme" }
                ]} />
                <Input label="Date de ta course HYROX" value={profile.raceDate} onChange={v => set("raceDate", v)} type="date" />
              </div>
            </Card>
            <Btn size="lg" disabled={!profile.poids || !profile.age} onClick={() => setStep(1)} style={{ width: "100%" }}>
              Suivant →
            </Btn>
          </div>
        )}

        {/* ÉTAPE 1 : Niveau */}
        {step === 1 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            <Card>
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <Select label="Niveau ressenti" value={profile.niveauRessenti} onChange={v => set("niveauRessenti", v)} options={[
                  { value: "débutant", label: "🟢 Débutant" },
                  { value: "intermédiaire", label: "🟡 Intermédiaire" },
                  { value: "avancé", label: "🟠 Avancé" },
                  { value: "compétiteur", label: "🔴 Compétiteur" },
                ]} />
                <Select label="Déjà fait une course HYROX ?" value={profile.dejaFaitHyrox} onChange={v => set("dejaFaitHyrox", v)} options={[
                  { value: "non", label: "Non, c'est ma première" },
                  { value: "oui", label: "Oui" },
                ]} />
                {profile.dejaFaitHyrox === "oui" && (
                  <>
                    <Input label="Ton chrono (ex: 1:45:30)" value={profile.previousChrono} onChange={v => set("previousChrono", v)} placeholder="hh:mm:ss" />
                    <Input label="Date de cette course" value={profile.previousDate} onChange={v => set("previousDate", v)} type="date" />
                  </>
                )}
              </div>
            </Card>
            <div style={{ display: "flex", gap: 12 }}>
              <Btn variant="dark" onClick={() => setStep(0)} style={{ flex: 1 }}>← Retour</Btn>
              <Btn onClick={() => setStep(2)} style={{ flex: 2 }}>Suivant →</Btn>
            </div>
          </div>
        )}

        {/* ÉTAPE 2 : Force */}
        {step === 2 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            <Card>
              <p style={{ color: "#aaa", fontSize: 14, marginBottom: 16 }}>Si tu connais ton 1RM exact, entre-le directement. Sinon, entre le poids et les reps utilisés et on calcule automatiquement.</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                <div>
                  <div style={{ color: "var(--yellow)", fontWeight: 700, marginBottom: 10 }}>Back Squat</div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
                    <Input label="1RM (kg)" value={profile.squat1RM} onChange={v => set("squat1RM", v)} type="number" placeholder="Optionnel" />
                    <Input label="Poids utilisé" value={profile.squatWeight} onChange={v => set("squatWeight", v)} type="number" placeholder="kg" />
                    <Input label="Reps" value={profile.squatReps} onChange={v => set("squatReps", v)} type="number" placeholder="3-5" />
                  </div>
                </div>
                <div>
                  <div style={{ color: "var(--yellow)", fontWeight: 700, marginBottom: 10 }}>Deadlift</div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
                    <Input label="1RM (kg)" value={profile.deadlift1RM} onChange={v => set("deadlift1RM", v)} type="number" placeholder="Optionnel" />
                    <Input label="Poids utilisé" value={profile.deadliftWeight} onChange={v => set("deadliftWeight", v)} type="number" placeholder="kg" />
                    <Input label="Reps" value={profile.deadliftReps} onChange={v => set("deadliftReps", v)} type="number" placeholder="3-5" />
                  </div>
                </div>
              </div>
              <div style={{ marginTop: 12, padding: "10px 14px", background: "var(--bg3)", borderRadius: 8, fontSize: 13, color: "#888" }}>
                💡 Si tu ne sais pas, laisse vide — on estimera d'après ton poids.
              </div>
            </Card>
            <div style={{ display: "flex", gap: 12 }}>
              <Btn variant="dark" onClick={() => setStep(1)} style={{ flex: 1 }}>← Retour</Btn>
              <Btn onClick={generateAIProfile} style={{ flex: 2 }}>Générer mon profil ✨</Btn>
            </div>
          </div>
        )}

        {/* ÉTAPE 3 : Profil IA */}
        {step === 3 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            {loading ? <Spinner /> : (
              <>
                <Card style={{ border: "1.5px solid var(--yellow)44" }}>
                  <div className="bebas" style={{ fontSize: 18, color: "var(--yellow)", marginBottom: 12 }}>TON PROFIL ATHLÈTE</div>
                  <p style={{ fontSize: 14, lineHeight: 1.7, color: "var(--white)", whiteSpace: "pre-wrap" }}>{profile.aiProfile}</p>
                </Card>
                {profile.raceDate && (
                  <Card style={{ textAlign: "center", border: "1.5px solid var(--red)44" }}>
                    <div className="bebas" style={{ fontSize: 48, color: "var(--red)" }}>{daysUntil(profile.raceDate)}</div>
                    <div style={{ color: "#aaa", fontSize: 13 }}>jours avant ta course HYROX</div>
                  </Card>
                )}
                <div style={{ padding: "14px", background: "var(--bg3)", borderRadius: 10, fontSize: 13, color: "#aaa" }}>
                  🧪 <strong style={{ color: "var(--white)" }}>Semaine 1 :</strong> Complète la batterie de tests pour calibrer ton programme avec précision.
                </div>
                <Btn size="lg" onClick={finishOnboarding} style={{ width: "100%" }}>
                  C'est parti ! 🚀
                </Btn>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================
// BATTERIE DE TESTS (Semaine 1)
// ============================================================
function TestsBattery({ profile, onComplete }) {
  const [activeTest, setActiveTest] = useState(null);
  const [results, setResults] = useState(profile.tests || {});
  const [loading, setLoading] = useState(false);
  const [levelResult, setLevelResult] = useState(null);

  const tests = [
    { id: "vma", label: "Test VMA Demi-Cooper", icon: "🏃", desc: "6 min de course, note la distance en mètres", unit: "mètres" },
    { id: "squat", label: "Back Squat 1RM", icon: "🏋️", desc: "3-5 reps pour estimer ton max", unit: "kg", sub: ["poids", "reps"] },
    { id: "deadlift", label: "Deadlift 1RM", icon: "⚡", desc: "3-5 reps pour estimer ton max", unit: "kg", sub: ["poids", "reps"] },
    { id: "bench", label: "Bench Press 1RM", icon: "💪", desc: "3-5 reps pour estimer ton max", unit: "kg", sub: ["poids", "reps"] },
    { id: "ski", label: "SkiErg 500m", icon: "⛷️", desc: "Chrono sur 500m au SkiErg", unit: "secondes" },
    { id: "row", label: "Rowing 500m", icon: "🚣", desc: "Chrono sur 500m au rameur", unit: "secondes" },
    { id: "wallball", label: "Wall Balls max 2min", icon: "🏀", desc: "Nombre de reps en 2 minutes", unit: "reps" },
    { id: "sled", label: "Sled Push 25m", icon: "🛷", desc: "Chrono sur 25m", unit: "secondes" },
    { id: "burpee", label: "Burpee Broad Jump 20m", icon: "💥", desc: "Chrono sur 20m", unit: "secondes" },
    { id: "farmers", label: "Farmers Carry 50m", icon: "🧳", desc: "Chrono sur 50m", unit: "secondes" },
  ];

  const completedCount = Object.keys(results).length;

  async function analyzeAndLevel() {
    setLoading(true);
    const vma = results.vma?.distance ? calcVMA(results.vma.distance) : null;
    const squat1RM = results.squat?.poids && results.squat?.reps ? epley1RM(results.squat.poids, results.squat.reps) : profile.squat1RM_calc;
    const dl1RM = results.deadlift?.poids && results.deadlift?.reps ? epley1RM(results.deadlift.poids, results.deadlift.reps) : profile.deadlift1RM_calc;

    const prompt = `Analyse ces résultats de tests HYROX et classe l'athlète dans un niveau (1-4) :
- Prénom: ${profile.name}, Poids: ${profile.poids}kg, Âge: ${profile.age}, Sexe: ${profile.sexe}
- VMA: ${vma ? vma + " km/h" : "non testé"}
- Squat 1RM: ${squat1RM ? squat1RM + "kg" : "non testé"}
- Deadlift 1RM: ${dl1RM ? dl1RM + "kg" : "non testé"}
- SkiErg 500m: ${results.ski?.value ? results.ski.value + "s" : "non testé"}
- Rowing 500m: ${results.row?.value ? results.row.value + "s" : "non testé"}
- Wall Balls: ${results.wallball?.value ? results.wallball.value + " reps" : "non testé"}
- Sled Push: ${results.sled?.value ? results.sled.value + "s" : "non testé"}
- Burpee Broad Jump: ${results.burpee?.value ? results.burpee.value + "s" : "non testé"}
- Farmers Carry: ${results.farmers?.value ? results.farmers.value + "s" : "non testé"}

Niveaux HYROX :
- Niveau 1 🟢 : Découverte (objectif : finir)
- Niveau 2 🟡 : Développement (objectif : finir)
- Niveau 3 🟠 : Performance (objectif : sub-1h30)
- Niveau 4 🔴 : Compétition (objectif : sub-1h / podium)

Réponds EN JSON UNIQUEMENT, sans backticks ni markdown :
{
  "level": 1,
  "objectif": "string court",
  "analyse": "2-3 phrases d'analyse personnalisée",
  "pointsForts": ["liste de 2 points forts"],
  "axesTravail": ["liste de 2 axes d'amélioration"],
  "vmaKmh": 0,
  "squat1RM": 0,
  "deadlift1RM": 0
}`;

    const raw = await callClaude("Tu es un coach HYROX expert. Réponds uniquement en JSON valide sans aucun texte autour.", prompt);
    try {
      const parsed = JSON.parse(raw?.replace(/```json|```/g, "").trim() || "{}");
      setLevelResult(parsed);

      const updatedProfile = {
        ...profile,
        tests: { ...results, analyzed: true },
        level: parsed.level,
        vmaKmh: parsed.vmaKmh || (results.vma?.distance ? calcVMA(results.vma.distance) : null),
        squat1RM_final: parsed.squat1RM || profile.squat1RM_calc,
        deadlift1RM_final: parsed.deadlift1RM || profile.deadlift1RM_calc,
        levelAnalysis: parsed,
        onboardingComplete: true,
      };
      await storage.set(`athlete_${profile.name}`, updatedProfile);
    } catch (e) {
      console.error("Parse error", e, raw);
    }
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
      <div style={{ maxWidth: 480, margin: "0 auto" }}>

        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div className="bebas" style={{ fontSize: 36, color: "var(--yellow)" }}>BATTERIE DE TESTS</div>
          <div style={{ color: "#888", fontSize: 13, marginTop: 4 }}>Semaine 1 · Calibration du programme</div>
          <div style={{ marginTop: 12 }}>
            <ProgressBar value={completedCount} max={tests.length} />
            <div style={{ color: "#aaa", fontSize: 12, marginTop: 6 }}>{completedCount}/{tests.length} tests complétés</div>
          </div>
        </div>

        {levelResult ? (
          <div className="fade-in">
            <Card style={{ border: `2px solid ${lvlColors[levelResult.level]}44`, marginBottom: 20 }}>
              <div style={{ textAlign: "center", marginBottom: 16 }}>
                <div className="bebas" style={{ fontSize: 56, color: lvlColors[levelResult.level] }}>
                  NIVEAU {levelResult.level}
                </div>
                <div style={{ color: lvlColors[levelResult.level], fontWeight: 700, fontSize: 18 }}>
                  {LEVELS[levelResult.level - 1]?.emoji} {LEVELS[levelResult.level - 1]?.label}
                </div>
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

            {completedCount >= 3 && !loading && (
              <Btn size="lg" onClick={analyzeAndLevel} style={{ width: "100%", marginBottom: 12 }}>
                Analyser mes résultats ✨
              </Btn>
            )}
            {loading && <Spinner />}
          </>
        )}

        {/* Modal Test */}
        {activeTest && (
          <TestModal test={activeTest} onSave={saveTestResult} onClose={() => setActiveTest(null)} existing={results[activeTest.id]} />
        )}
      </div>
    </div>
  );
}

function TestModal({ test, onSave, onClose, existing }) {
  const [val, setVal] = useState(existing?.value || "");
  const [poids, setPoids] = useState(existing?.poids || "");
  const [reps, setReps] = useState(existing?.reps || "");
  const [distance, setDistance] = useState(existing?.distance || "");

  function save() {
    if (test.sub) {
      onSave(test.id, { poids: parseFloat(poids), reps: parseInt(reps) });
    } else if (test.id === "vma") {
      onSave(test.id, { distance: parseFloat(distance), vma: calcVMA(parseFloat(distance)) });
    } else {
      onSave(test.id, { value: parseFloat(val) });
    }
  }

  return (
    <div style={{ position: "fixed", inset: 0, background: "#000a", display: "flex", alignItems: "flex-end", zIndex: 1000 }}>
      <div className="fade-in" style={{ background: "var(--bg2)", borderRadius: "16px 16px 0 0", padding: 24, width: "100%", maxWidth: 480, margin: "0 auto", border: "1.5px solid var(--bg3)" }}>
        <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 6 }}>{test.icon} {test.label}</div>
        <div style={{ color: "#888", fontSize: 13, marginBottom: 20 }}>{test.desc}</div>

        {test.id === "vma" ? (
          <Input label="Distance parcourue (mètres)" value={distance} onChange={setDistance} type="number" placeholder="ex: 1580" />
        ) : test.sub ? (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <Input label="Poids (kg)" value={poids} onChange={setPoids} type="number" placeholder="ex: 80" />
            <Input label="Reps effectuées" value={reps} onChange={setReps} type="number" placeholder="3-5" />
          </div>
        ) : (
          <Input label={test.unit === "secondes" ? "Temps (secondes)" : "Reps"} value={val} onChange={setVal} type="number" placeholder="Résultat" />
        )}

        {test.id === "vma" && distance && (
          <div style={{ marginTop: 12, padding: "10px 14px", background: "var(--bg3)", borderRadius: 8, fontSize: 14 }}>
            VMA calculée : <strong style={{ color: "var(--yellow)" }}>{calcVMA(parseFloat(distance))} km/h</strong>
          </div>
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
// APP PRINCIPALE ATHLÈTE
// ============================================================
function AthleteApp({ profile, onUpdateProfile }) {
  const [tab, setTab] = useState("today");
  const [dailyData, setDailyData] = useState({ fatigue: 2, temps: 60, materiel: "tout" });
  const [session, setSession] = useState(null);
  const [loadingSession, setLoadingSession] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [loadingFeedback, setLoadingFeedback] = useState(false);
  const [feedbackData, setFeedbackData] = useState({ ressenti: "bien", notes: "", performances: "" });

  const days = daysUntil(profile.raceDate);

  async function generateSession() {
    setLoadingSession(true);
    const week = profile.week || 1;
    const phase = week <= 2 ? "base" : week <= 5 ? "développement" : week <= 7 ? "pic" : "affûtage";

    const recentSessions = (profile.sessions || []).slice(-3).map(s => s.summary).join("\n");
    const lastAdaptation = (profile.adaptations || []).slice(-1)[0]?.message || "aucune";

    const prompt = `Génère une séance d'entraînement HYROX personnalisée EN JSON UNIQUEMENT (sans backticks) pour :
- Athlète: ${profile.name}, Niveau ${profile.level}, VMA ${profile.vmaKmh || "?"}km/h
- 1RM Squat: ${profile.squat1RM_final || "?"}kg, Deadlift: ${profile.deadlift1RM_final || "?"}kg
- Fatigue du jour: ${dailyData.fatigue}/4, Temps dispo: ${dailyData.temps}min
- Matériel: ${dailyData.materiel}
- Semaine: ${week}/8, Phase: ${phase}
- Dernière adaptation IA: ${lastAdaptation}
- 3 dernières séances: ${recentSessions || "aucune"}

Format JSON :
{
  "titre": "string",
  "duree": number,
  "explication": "2-3 phrases expliquant POURQUOI cette séance est adaptée à ce profil (cite ses données réelles : VMA, 1RM, etc.)",
  "echauffement": "description",
  "exercices": [
    {"nom": "string", "detail": "sets x reps @ charge ou allure", "note": "conseil technique"}
  ],
  "retourCalme": "description",
  "nutrition": {"avant": "conseil", "apres": "conseil"},
  "metrique": "ce à quoi faire attention"
}`;

    const raw = await callClaude("Tu es coach HYROX expert. Génère uniquement du JSON valide sans backticks ni markdown.", prompt, 1200);
    try {
      const parsed = JSON.parse(raw?.replace(/```json|```/g, "").trim() || "{}");
      setSession(parsed);
      setFeedback(null);
      setShowFeedback(false);
    } catch (e) {
      console.error(e, raw);
      setSession({ titre: "Erreur", explication: "Impossible de générer la séance. Vérifie ta connexion.", exercices: [] });
    }
    setLoadingSession(false);
  }

  async function submitFeedback() {
    setLoadingFeedback(true);
    const prompt = `Un athlète HYROX vient de terminer une séance et donne son feedback.
Athlète: ${profile.name}, Niveau ${profile.level}
Séance effectuée: ${session?.titre}
Ressenti: ${feedbackData.ressenti}
Performances réalisées: ${feedbackData.performances || "non renseigné"}
Notes: ${feedbackData.notes || "aucune"}

Génère une adaptation pour la prochaine séance EN JSON UNIQUEMENT (sans backticks) :
{
  "message": "message personnalisé à l'athlète (1-2 phrases, explique ce que tu as analysé et ce que tu changes)",
  "adaptation": "description de l'ajustement (charges +5%, réduction intensité, etc.)",
  "alerteCoach": false,
  "raisonAlerte": ""
}
Si ressenti et performances sont contradictoires, mets alerteCoach: true.`;

    const raw = await callClaude("Tu es coach HYROX expert. Réponds uniquement JSON valide sans backticks.", prompt);
    try {
      const adapt = JSON.parse(raw?.replace(/```json|```/g, "").trim() || "{}");

      const newSessions = [...(profile.sessions || []), {
        date: new Date().toISOString(),
        titre: session?.titre,
        ressenti: feedbackData.ressenti,
        performances: feedbackData.performances,
        summary: `${session?.titre} — ressenti: ${feedbackData.ressenti}`
      }];
      const newAdaptations = [...(profile.adaptations || []), { ...adapt, date: new Date().toISOString() }];
      const newAlerts = adapt.alerteCoach
        ? [...(profile.alerts || []), { type: "contradiction", athlete: profile.name, message: adapt.raisonAlerte || "Contradiction ressenti/performances", date: new Date().toISOString(), read: false }]
        : (profile.alerts || []);

      const updated = { ...profile, sessions: newSessions, adaptations: newAdaptations, alerts: newAlerts };
      await storage.set(`athlete_${profile.name}`, updated);
      onUpdateProfile(updated);
      setFeedback(adapt);
      setShowFeedback(false);
    } catch (e) {
      console.error(e);
    }
    setLoadingFeedback(false);
  }

  const tabs = [
    { id: "today", label: "Séance", icon: "⚡" },
    { id: "progress", label: "Progression", icon: "📈" },
    { id: "zones", label: "Zones", icon: "🎯" },
    { id: "race", label: "Course", icon: "🏁" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", paddingBottom: 80 }}>
      <style>{GLOBAL_STYLES}</style>

      {/* Header */}
      <div style={{ background: "var(--bg2)", padding: "16px 20px", borderBottom: "1px solid var(--bg3)", position: "sticky", top: 0, zIndex: 100 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div className="bebas" style={{ fontSize: 26, color: "var(--yellow)", lineHeight: 1 }}>FITRACE</div>
            <div style={{ fontSize: 12, color: "#888" }}>{profile.name} · Niveau {profile.level}</div>
          </div>
          <div style={{ textAlign: "right" }}>
            {days !== null && (
              <>
                <div className="bebas" style={{ fontSize: 32, color: "var(--red)", lineHeight: 1 }}>{days}</div>
                <div style={{ fontSize: 10, color: "#666" }}>jours restants</div>
              </>
            )}
          </div>
        </div>
      </div>

      <div style={{ padding: "20px 16px", maxWidth: 480, margin: "0 auto" }}>

        {/* TODAY */}
        {tab === "today" && (
          <div className="fade-in">
            {/* Daily Check-in */}
            <Section title="Comment tu vas ?">
              <Card>
                <div style={{ marginBottom: 16 }}>
                  <div style={{ fontSize: 12, color: "#aaa", fontWeight: 600, textTransform: "uppercase", marginBottom: 10 }}>Niveau de fatigue</div>
                  <div style={{ display: "flex", gap: 10 }}>
                    {[
                      { v: 1, emoji: "😴", label: "Très reposé" },
                      { v: 2, emoji: "😊", label: "Bien" },
                      { v: 3, emoji: "😓", label: "Fatigué" },
                      { v: 4, emoji: "🥵", label: "Épuisé" },
                    ].map(f => (
                      <button key={f.v} onClick={() => setDailyData(d => ({ ...d, fatigue: f.v }))} style={{
                        flex: 1, padding: "10px 6px", borderRadius: 8, fontSize: 22, background: dailyData.fatigue === f.v ? "var(--yellow)22" : "var(--bg3)",
                        border: dailyData.fatigue === f.v ? "2px solid var(--yellow)" : "1.5px solid var(--bg3)", color: "var(--white)", transition: "all 0.2s"
                      }}>
                        {f.emoji}
                      </button>
                    ))}
                  </div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  <Select label="Temps dispo" value={dailyData.temps} onChange={v => setDailyData(d => ({ ...d, temps: v }))} options={[
                    { value: 30, label: "30 min" }, { value: 45, label: "45 min" }, { value: 60, label: "1h" }, { value: 90, label: "1h30" }, { value: 120, label: "2h" }
                  ]} />
                  <Select label="Matériel dispo" value={dailyData.materiel} onChange={v => setDailyData(d => ({ ...d, materiel: v }))} options={[
                    { value: "tout", label: "Tout (Box)" }, { value: "cardio", label: "Cardio seul" }, { value: "halteres", label: "Haltères" }, { value: "rien", label: "Sans matériel" }
                  ]} />
                </div>
              </Card>
            </Section>

            {/* Generate Session */}
            {!session && !loadingSession && (
              <Btn size="lg" onClick={generateSession} style={{ width: "100%", marginBottom: 20 }}>
                ⚡ Générer ma séance du jour
              </Btn>
            )}
            {loadingSession && <Spinner />}

            {/* Session Display */}
            {session && !showFeedback && !feedback && (
              <div className="fade-in">
                <Card style={{ border: "1.5px solid var(--yellow)33", marginBottom: 16 }}>
                  <div className="bebas" style={{ fontSize: 24, color: "var(--yellow)", marginBottom: 4 }}>{session.titre}</div>
                  <div style={{ color: "#888", fontSize: 13, marginBottom: 12 }}>⏱ {session.duree} min</div>
                  <div style={{ background: "var(--bg3)", borderRadius: 8, padding: 12, marginBottom: 12, fontSize: 13, color: "#ccc", lineHeight: 1.6 }}>
                    💡 {session.explication}
                  </div>
                  {session.echauffement && (
                    <div style={{ marginBottom: 12 }}>
                      <div style={{ fontWeight: 700, fontSize: 12, color: "#888", textTransform: "uppercase", marginBottom: 6 }}>Échauffement</div>
                      <div style={{ fontSize: 14, color: "#ccc" }}>{session.echauffement}</div>
                    </div>
                  )}
                  <div style={{ marginBottom: 12 }}>
                    <div style={{ fontWeight: 700, fontSize: 12, color: "var(--yellow)", textTransform: "uppercase", marginBottom: 10 }}>Programme</div>
                    {(session.exercices || []).map((ex, i) => (
                      <div key={i} style={{ background: "var(--bg)", borderRadius: 8, padding: "10px 12px", marginBottom: 8 }}>
                        <div style={{ fontWeight: 700, fontSize: 15 }}>{ex.nom}</div>
                        <div style={{ color: "var(--yellow)", fontSize: 14, marginTop: 2 }}>{ex.detail}</div>
                        {ex.note && <div style={{ color: "#666", fontSize: 12, marginTop: 4 }}>💬 {ex.note}</div>}
                      </div>
                    ))}
                  </div>
                  {session.retourCalme && (
                    <div style={{ marginBottom: 12 }}>
                      <div style={{ fontWeight: 700, fontSize: 12, color: "#888", textTransform: "uppercase", marginBottom: 6 }}>Retour au calme</div>
                      <div style={{ fontSize: 14, color: "#ccc" }}>{session.retourCalme}</div>
                    </div>
                  )}
                  {session.nutrition && (
                    <div style={{ background: "var(--bg3)", borderRadius: 8, padding: 12 }}>
                      <div style={{ fontWeight: 700, fontSize: 12, color: "var(--green)", textTransform: "uppercase", marginBottom: 8 }}>Nutrition</div>
                      <div style={{ fontSize: 13, color: "#ccc" }}>🍌 Avant : {session.nutrition.avant}</div>
                      <div style={{ fontSize: 13, color: "#ccc", marginTop: 6 }}>🥤 Après : {session.nutrition.apres}</div>
                    </div>
                  )}
                </Card>
                <div style={{ display: "flex", gap: 12 }}>
                  <Btn variant="dark" onClick={() => setSession(null)} style={{ flex: 1 }}>↺ Regénérer</Btn>
                  <Btn variant="success" onClick={() => setShowFeedback(true)} style={{ flex: 2 }}>✓ Séance terminée</Btn>
                </div>
              </div>
            )}

            {/* Feedback Form */}
            {showFeedback && (
              <div className="fade-in">
                <Card style={{ border: "1.5px solid var(--green)44" }}>
                  <div className="bebas" style={{ fontSize: 22, color: "var(--green)", marginBottom: 16 }}>RETOUR DE SÉANCE</div>
                  <div style={{ marginBottom: 16 }}>
                    <div style={{ fontSize: 12, color: "#aaa", fontWeight: 600, textTransform: "uppercase", marginBottom: 10 }}>Comment était cette séance ?</div>
                    <div style={{ display: "flex", gap: 10 }}>
                      {[
                        { v: "facile", emoji: "😴", label: "Trop facile" },
                        { v: "bien", emoji: "💪", label: "Bien calibré" },
                        { v: "dur", emoji: "🔥", label: "Trop dur" },
                      ].map(r => (
                        <button key={r.v} onClick={() => setFeedbackData(d => ({ ...d, ressenti: r.v }))} style={{
                          flex: 1, padding: "12px 6px", borderRadius: 8, fontSize: 20, background: feedbackData.ressenti === r.v ? "var(--yellow)22" : "var(--bg3)",
                          border: feedbackData.ressenti === r.v ? "2px solid var(--yellow)" : "1.5px solid var(--bg3)", color: "var(--white)"
                        }}>
                          <div>{r.emoji}</div>
                          <div style={{ fontSize: 11, marginTop: 4 }}>{r.label}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    <div>
                      <label style={{ fontSize: 12, color: "#aaa", fontWeight: 600, textTransform: "uppercase", display: "block", marginBottom: 6 }}>Performances réalisées</label>
                      <textarea
                        value={feedbackData.performances}
                        onChange={e => setFeedbackData(d => ({ ...d, performances: e.target.value }))}
                        placeholder="ex: Squat 85kg x5, Run 2km en 11min..."
                        style={{ width: "100%", background: "var(--bg3)", border: "1px solid var(--gray2)", borderRadius: 8, padding: "10px 14px", color: "var(--white)", fontSize: 14, minHeight: 80, resize: "vertical", fontFamily: "var(--font-body)" }}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: 12, color: "#aaa", fontWeight: 600, textTransform: "uppercase", display: "block", marginBottom: 6 }}>Notes (optionnel)</label>
                      <textarea
                        value={feedbackData.notes}
                        onChange={e => setFeedbackData(d => ({ ...d, notes: e.target.value }))}
                        placeholder="Ressenti, douleurs, commentaires..."
                        style={{ width: "100%", background: "var(--bg3)", border: "1px solid var(--gray2)", borderRadius: 8, padding: "10px 14px", color: "var(--white)", fontSize: 14, minHeight: 60, resize: "vertical", fontFamily: "var(--font-body)" }}
                      />
                    </div>
                  </div>
                  {loadingFeedback ? <Spinner /> : (
                    <div style={{ display: "flex", gap: 12, marginTop: 16 }}>
                      <Btn variant="dark" onClick={() => setShowFeedback(false)} style={{ flex: 1 }}>← Retour</Btn>
                      <Btn onClick={submitFeedback} style={{ flex: 2 }}>Envoyer 🚀</Btn>
                    </div>
                  )}
                </Card>
              </div>
            )}

            {/* Adaptation Message */}
            {feedback && (
              <div className="fade-in">
                <Card style={{ border: "1.5px solid var(--green)66" }}>
                  <div className="bebas" style={{ fontSize: 18, color: "var(--green)", marginBottom: 10 }}>🤖 ADAPTATION IA</div>
                  <p style={{ fontSize: 14, color: "#ccc", lineHeight: 1.7, marginBottom: 10 }}>{feedback.message}</p>
                  <div style={{ background: "var(--bg3)", borderRadius: 8, padding: 10, fontSize: 13, color: "var(--yellow)" }}>
                    📋 {feedback.adaptation}
                  </div>
                  {feedback.alerteCoach && (
                    <div style={{ marginTop: 10, background: "var(--red)22", border: "1px solid var(--red)44", borderRadius: 8, padding: 10, fontSize: 13, color: "var(--red)" }}>
                      ⚠️ Alerte envoyée au coach — {feedback.raisonAlerte}
                    </div>
                  )}
                  <Btn onClick={() => { setSession(null); setFeedback(null); setFeedbackData({ ressenti: "bien", notes: "", performances: "" }); }} style={{ marginTop: 16, width: "100%" }}>
                    Nouvelle séance →
                  </Btn>
                </Card>
              </div>
            )}
          </div>
        )}

        {/* PROGRESS */}
        {tab === "progress" && (
          <div className="fade-in">
            <Section title="Progression">
              <Card>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  <StatBox label="Séances" value={profile.sessions?.length || 0} unit="total" color="var(--yellow)" />
                  <StatBox label="Niveau" value={profile.level || "?"} unit="HYROX" color={LEVELS[(profile.level || 1) - 1]?.color} />
                  <StatBox label="VMA" value={profile.vmaKmh || "?"} unit="km/h" color="var(--green)" />
                  <StatBox label="Squat 1RM" value={profile.squat1RM_final || "?"} unit="kg" color="var(--yellow)" />
                </div>
              </Card>
            </Section>

            <Section title="Historique">
              {(profile.sessions || []).slice(-10).reverse().map((s, i) => (
                <Card key={i} style={{ marginBottom: 8 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 14 }}>{s.titre}</div>
                      <div style={{ color: "#666", fontSize: 12 }}>{new Date(s.date).toLocaleDateString("fr-FR")}</div>
                    </div>
                    <Badge label={s.ressenti === "bien" ? "💪 Bien" : s.ressenti === "facile" ? "😴 Facile" : "🔥 Dur"}
                      color={s.ressenti === "bien" ? "var(--green)" : s.ressenti === "facile" ? "var(--yellow)" : "var(--red)"} />
                  </div>
                </Card>
              ))}
              {(!profile.sessions || profile.sessions.length === 0) && (
                <div style={{ color: "#555", fontSize: 14, textAlign: "center", padding: 20 }}>Aucune séance enregistrée pour le moment.</div>
              )}
            </Section>

            <Section title="Adaptations IA">
              {(profile.adaptations || []).slice(-5).reverse().map((a, i) => (
                <Card key={i} style={{ marginBottom: 8, border: "1px solid var(--green)33" }}>
                  <div style={{ fontSize: 13, color: "#ccc", lineHeight: 1.6 }}>{a.message}</div>
                  <div style={{ fontSize: 12, color: "#555", marginTop: 6 }}>{new Date(a.date).toLocaleDateString("fr-FR")}</div>
                </Card>
              ))}
              {(!profile.adaptations || profile.adaptations.length === 0) && (
                <div style={{ color: "#555", fontSize: 14, textAlign: "center", padding: 20 }}>Pas encore d'adaptations.</div>
              )}
            </Section>
          </div>
        )}

        {/* ZONES */}
        {tab === "zones" && (
          <div className="fade-in">
            <Section title="Zones d'entraînement">
              {profile.vmaKmh ? (
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {ZONES.map(z => (
                    <Card key={z.z} style={{ display: "flex", alignItems: "center", gap: 16 }}>
                      <div className="bebas" style={{ fontSize: 28, color: "var(--yellow)", width: 40 }}>{z.z}</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 600, fontSize: 14 }}>{z.label}</div>
                        <div style={{ color: "#888", fontSize: 12 }}>{z.pct[0]}-{z.pct[1]}% VMA</div>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <div style={{ color: "var(--yellow)", fontWeight: 700, fontSize: 14 }}>{paceFromVMA(profile.vmaKmh, (z.pct[0] + z.pct[1]) / 2)}</div>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <div style={{ color: "#555", textAlign: "center", padding: 24 }}>Complète le test VMA pour voir tes zones.</div>
              )}
            </Section>

            <Section title="Pourcentages de force">
              {profile.squat1RM_final ? (
                <Card>
                  <div style={{ marginBottom: 12 }}>
                    <div style={{ fontWeight: 700, fontSize: 14, color: "var(--yellow)", marginBottom: 10 }}>Back Squat (1RM: {profile.squat1RM_final}kg)</div>
                    {[50, 60, 70, 75, 80, 85, 90].map(pct => (
                      <div key={pct} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px solid var(--bg3)", fontSize: 14 }}>
                        <span style={{ color: "#888" }}>{pct}%</span>
                        <span style={{ fontWeight: 600 }}>{Math.round(profile.squat1RM_final * pct / 100)} kg</span>
                      </div>
                    ))}
                  </div>
                </Card>
              ) : (
                <div style={{ color: "#555", textAlign: "center", padding: 24 }}>Complète les tests de force pour voir tes %.</div>
              )}
            </Section>
          </div>
        )}

        {/* RACE */}
        {tab === "race" && <RaceTab profile={profile} />}

      </div>

      {/* Bottom Nav */}
      <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: "var(--bg2)", borderTop: "1px solid var(--bg3)", display: "flex", justifyContent: "space-around", padding: "8px 0", zIndex: 100 }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            background: "none", color: tab === t.id ? "var(--yellow)" : "#555",
            padding: "8px 16px", borderRadius: 8, fontSize: 20, display: "flex", flexDirection: "column", alignItems: "center", gap: 2
          }}>
            <span>{t.icon}</span>
            <span style={{ fontSize: 10, fontWeight: 600 }}>{t.label}</span>
          </button>
        ))}
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

function RaceTab({ profile }) {
  const [strategy, setStrategy] = useState(null);
  const [loading, setLoading] = useState(false);

  const days = daysUntil(profile.raceDate);

  async function generateStrategy() {
    setLoading(true);
    const prompt = `Génère une stratégie de course HYROX détaillée station par station pour :
- Athlète: ${profile.name}, Niveau ${profile.level}
- VMA: ${profile.vmaKmh || "?"}km/h
- 1RM Squat: ${profile.squat1RM_final || "?"}kg
- Objectif: ${profile.levelAnalysis?.objectif || "finir"}
- Date de course: ${profile.raceDate}

Réponds EN JSON UNIQUEMENT (sans backticks) :
{
  "objectifTemps": "string",
  "strategieCourse": "2-3 phrases de stratégie globale",
  "stations": [
    {"nom": "string", "objectif": "string", "chrono": "string", "conseil": "string"}
  ],
  "runningRythme": "allure cible pour chaque segment de running",
  "piege": "erreur principale à éviter",
  "mental": "conseil mental pour le jour J"
}
Stations HYROX dans l'ordre : SkiErg 1000m, Sled Push 50m, Sled Pull 50m, Burpee Broad Jump 80m, Rowing 1000m, Farmers Carry 200m, Sandbag Lunges 100m, Wall Balls 100 reps`;

    const raw = await callClaude("Coach HYROX expert. JSON uniquement sans backticks.", prompt, 1200);
    try {
      setStrategy(JSON.parse(raw?.replace(/```json|```/g, "").trim() || "{}"));
    } catch (e) { console.error(e); }
    setLoading(false);
  }

  return (
    <div className="fade-in">
      <Section title="Ta course HYROX">
        {profile.raceDate ? (
          <Card style={{ textAlign: "center", marginBottom: 20, border: "2px solid var(--red)44" }}>
            <div className="bebas" style={{ fontSize: 72, color: "var(--red)", lineHeight: 1 }}>{days}</div>
            <div style={{ color: "#888", fontSize: 15 }}>jours avant le départ</div>
            <div style={{ color: "#555", fontSize: 13, marginTop: 4 }}>{new Date(profile.raceDate).toLocaleDateString("fr-FR", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</div>
          </Card>
        ) : (
          <div style={{ color: "#555", textAlign: "center", padding: 16 }}>Aucune date de course renseignée.</div>
        )}
      </Section>

      {!strategy && !loading && (
        <Btn size="lg" onClick={generateStrategy} style={{ width: "100%", marginBottom: 20 }}>
          🏁 Générer ma stratégie de course
        </Btn>
      )}
      {loading && <Spinner />}

      {strategy && (
        <div className="fade-in">
          <Card style={{ border: "1.5px solid var(--red)44", marginBottom: 16 }}>
            <div className="bebas" style={{ fontSize: 24, color: "var(--red)", marginBottom: 8 }}>OBJECTIF : {strategy.objectifTemps}</div>
            <p style={{ fontSize: 14, color: "#ccc", lineHeight: 1.7, marginBottom: 12 }}>{strategy.strategieCourse}</p>
            {strategy.runningRythme && (
              <div style={{ background: "var(--bg3)", borderRadius: 8, padding: 10, fontSize: 13, color: "var(--yellow)", marginBottom: 12 }}>
                🏃 Running : {strategy.runningRythme}
              </div>
            )}
          </Card>

          <Section title="Stratégie station par station">
            {(strategy.stations || []).map((s, i) => (
              <Card key={i} style={{ marginBottom: 10, borderLeft: "3px solid var(--yellow)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 15 }}>{i + 1}. {s.nom}</div>
                    <div style={{ color: "var(--yellow)", fontSize: 13, marginTop: 2 }}>🎯 {s.objectif}</div>
                    {s.conseil && <div style={{ color: "#888", fontSize: 12, marginTop: 4 }}>💬 {s.conseil}</div>}
                  </div>
                  {s.chrono && <Badge label={s.chrono} color="var(--yellow)" />}
                </div>
              </Card>
            ))}
          </Section>

          {(strategy.piege || strategy.mental) && (
            <Card style={{ border: "1px solid var(--red)33" }}>
              {strategy.piege && <div style={{ marginBottom: 12 }}>
                <div style={{ color: "var(--red)", fontWeight: 700, fontSize: 12, textTransform: "uppercase", marginBottom: 6 }}>⚠️ Piège principal</div>
                <div style={{ fontSize: 14, color: "#ccc" }}>{strategy.piege}</div>
              </div>}
              {strategy.mental && <div>
                <div style={{ color: "var(--green)", fontWeight: 700, fontSize: 12, textTransform: "uppercase", marginBottom: 6 }}>🧠 Mental</div>
                <div style={{ fontSize: 14, color: "#ccc" }}>{strategy.mental}</div>
              </div>}
            </Card>
          )}
        </div>
      )}
    </div>
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

  useEffect(() => {
    loadAthletes();
  }, []);

  async function loadAthletes() {
    setLoading(true);
    const keys = await storage.list("athlete_");
    const data = await Promise.all(keys.map(k => storage.get(k)));
    setAthletes(data.filter(Boolean));
    setLoading(false);
  }

  const alerts = athletes.flatMap(a => (a.alerts || []).filter(al => !al.read));
  const avgAdherence = athletes.length > 0
    ? Math.round(athletes.reduce((acc, a) => acc + Math.min(100, ((a.sessions?.length || 0) / 8) * 100), 0) / athletes.length)
    : 0;

  const tabs = [
    { id: "dashboard", label: "Dashboard", icon: "📊" },
    { id: "athletes", label: "Athlètes", icon: "👥" },
    { id: "alerts", label: `Alertes${alerts.length > 0 ? ` (${alerts.length})` : ""}`, icon: "🔔" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", paddingBottom: 80 }}>
      <style>{GLOBAL_STYLES}</style>

      {/* Header Coach */}
      <div style={{ background: "var(--bg2)", padding: "16px 20px", borderBottom: "1px solid var(--bg3)", position: "sticky", top: 0, zIndex: 100 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div className="bebas" style={{ fontSize: 26, color: "var(--yellow)", lineHeight: 1 }}>FITRACE COACH</div>
            <div style={{ fontSize: 12, color: "#888" }}>{athletes.length} athlètes · {alerts.length} alertes</div>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            {alerts.length > 0 && (
              <div style={{ background: "var(--red)", color: "#fff", borderRadius: 99, width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700 }}>
                {alerts.length}
              </div>
            )}
            <Btn variant="dark" size="sm" onClick={loadAthletes}>↺</Btn>
          </div>
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
                    <StatBox label="Alertes" value={alerts.length} unit="en cours" color={alerts.length > 0 ? "var(--red)" : "var(--gray)"} />
                    <StatBox label="Adaptations IA" value={athletes.reduce((a, b) => a + (b.adaptations?.length || 0), 0)} unit="total" color="var(--yellow)" />
                  </div>
                </Section>

                <Section title="Répartition niveaux">
                  <Card>
                    {LEVELS.map(lvl => {
                      const count = athletes.filter(a => a.level === lvl.id).length;
                      return (
                        <div key={lvl.id} style={{ marginBottom: 12 }}>
                          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                            <span style={{ fontSize: 14 }}>{lvl.emoji} Niveau {lvl.id} — {lvl.label}</span>
                            <span style={{ fontSize: 14, fontWeight: 700 }}>{count}</span>
                          </div>
                          <ProgressBar value={count} max={Math.max(athletes.length, 1)} color={lvl.color} />
                        </div>
                      );
                    })}
                  </Card>
                </Section>

                <Section title="Fatigue générale">
                  <Card>
                    {[1, 2, 3, 4].map(f => {
                      const emojis = ["😴", "😊", "😓", "🥵"];
                      const count = athletes.filter(a => {
                        const last = a.sessions?.slice(-1)[0];
                        return last?.fatigue === f;
                      }).length;
                      return (
                        <div key={f} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
                          <span style={{ fontSize: 20 }}>{emojis[f - 1]}</span>
                          <div style={{ flex: 1 }}>
                            <ProgressBar value={count} max={Math.max(athletes.length, 1)} color={f <= 2 ? "var(--green)" : f === 3 ? "var(--yellow)" : "var(--red)"} />
                          </div>
                          <span style={{ fontSize: 12, color: "#888", width: 20 }}>{count}</span>
                        </div>
                      );
                    })}
                  </Card>
                </Section>
              </>
            )}
          </div>
        )}

        {/* ATHLETES */}
        {tab === "athletes" && (
          <div className="fade-in">
            {selected ? (
              <AthleteDetail athlete={selected} onBack={() => setSelected(null)} onUpdate={async (updated) => {
                await storage.set(`athlete_${updated.name}`, updated);
                setSelected(updated);
                loadAthletes();
              }} />
            ) : (
              <>
                <Section title={`Athlètes (${athletes.length})`}>
                  {loading ? <Spinner /> : athletes.length === 0 ? (
                    <div style={{ color: "#555", textAlign: "center", padding: 24 }}>Aucun athlète inscrit pour le moment.</div>
                  ) : (
                    athletes.map((a, i) => (
                      <Card key={i} onClick={() => setSelected(a)} style={{ marginBottom: 10, display: "flex", alignItems: "center", gap: 14 }}>
                        <div style={{ width: 44, height: 44, borderRadius: "50%", background: "var(--yellow)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, color: "#000", fontWeight: 700, flexShrink: 0 }}>
                          {a.name[0].toUpperCase()}
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 700, fontSize: 16 }}>{a.name}</div>
                          <div style={{ fontSize: 12, color: "#888" }}>
                            Niveau {a.level || "?"} · {a.sessions?.length || 0} séances · {a.vmaKmh ? `VMA ${a.vmaKmh} km/h` : "Tests à faire"}
                          </div>
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4 }}>
                          {(a.alerts || []).filter(al => !al.read).length > 0 && (
                            <Badge label={`⚠️ ${(a.alerts || []).filter(al => !al.read).length}`} color="var(--red)" />
                          )}
                          <span style={{ color: "#555", fontSize: 18 }}>→</span>
                        </div>
                      </Card>
                    ))
                  )}
                </Section>
              </>
            )}
          </div>
        )}

        {/* ALERTES */}
        {tab === "alerts" && (
          <div className="fade-in">
            <Section title="Alertes coach">
              {alerts.length === 0 ? (
                <div style={{ color: "#555", textAlign: "center", padding: 24, fontSize: 14 }}>✅ Aucune alerte active — tout le monde est en forme !</div>
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
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            background: "none", color: tab === t.id ? "var(--yellow)" : "#555",
            padding: "8px 16px", borderRadius: 8, display: "flex", flexDirection: "column", alignItems: "center", gap: 2
          }}>
            <span style={{ fontSize: 20 }}>{t.icon}</span>
            <span style={{ fontSize: 10, fontWeight: 600 }}>{t.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function AthleteDetail({ athlete, onBack, onUpdate }) {
  const [editNote, setEditNote] = useState("");
  const [loading, setLoading] = useState(false);

  async function addNote() {
    if (!editNote.trim()) return;
    const updated = {
      ...athlete,
      coachNotes: [...(athlete.coachNotes || []), { text: editNote, date: new Date().toISOString() }]
    };
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

      {/* Profil IA */}
      {athlete.aiProfile && (
        <Card style={{ marginBottom: 16, border: "1px solid var(--yellow)22" }}>
          <div style={{ fontWeight: 700, fontSize: 12, color: "var(--yellow)", textTransform: "uppercase", marginBottom: 8 }}>Profil IA</div>
          <p style={{ fontSize: 13, color: "#ccc", lineHeight: 1.6 }}>{athlete.aiProfile}</p>
        </Card>
      )}

      {/* Dernières adaptations */}
      {athlete.adaptations?.length > 0 && (
        <Card style={{ marginBottom: 16 }}>
          <div style={{ fontWeight: 700, fontSize: 12, color: "var(--green)", textTransform: "uppercase", marginBottom: 10 }}>Dernières adaptations IA</div>
          {athlete.adaptations.slice(-3).reverse().map((a, i) => (
            <div key={i} style={{ borderBottom: i < 2 ? "1px solid var(--bg3)" : "none", paddingBottom: 8, marginBottom: 8 }}>
              <div style={{ fontSize: 13, color: "#ccc" }}>{a.message}</div>
              <div style={{ fontSize: 11, color: "#555", marginTop: 4 }}>{new Date(a.date).toLocaleDateString("fr-FR")}</div>
            </div>
          ))}
        </Card>
      )}

      {/* Alertes athlète */}
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
        <textarea
          value={editNote}
          onChange={e => setEditNote(e.target.value)}
          placeholder="Ajouter une note..."
          style={{ width: "100%", background: "var(--bg3)", border: "1px solid var(--gray2)", borderRadius: 8, padding: "10px 14px", color: "var(--white)", fontSize: 14, minHeight: 60, resize: "vertical", fontFamily: "var(--font-body)", marginTop: 8 }}
        />
        <Btn size="sm" onClick={addNote} disabled={!editNote.trim()} style={{ marginTop: 10 }}>Ajouter la note</Btn>
      </Card>
    </div>
  );
}

// ============================================================
// MAIN APP
// ============================================================
export default function App() {
  const [user, setUser] = useState(null); // { role, name }
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [needTests, setNeedTests] = useState(false);

  useEffect(() => {
    // Inject global styles
    const style = document.createElement("style");
    style.innerHTML = GLOBAL_STYLES;
    document.head.appendChild(style);
    setLoading(false);
    return () => document.head.removeChild(style);
  }, []);

  async function handleLogin(role, name) {
    if (role === "coach") {
      setUser({ role: "coach", name });
      return;
    }
    // Athlete
    const existing = await storage.get(`athlete_${name}`);
    if (existing) {
      setProfile(existing);
      setNeedTests(!existing.onboardingComplete);
    }
    setUser({ role: "athlete", name });
  }

  function handleOnboardingComplete(newProfile) {
    setProfile(newProfile);
    setNeedTests(true); // Go to tests
  }

  function handleTestsComplete(updatedProfile) {
    setProfile(updatedProfile);
    setNeedTests(false);
  }

  if (loading) {
    return <div style={{ minHeight: "100vh", background: "#0a0a0a", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <style>{GLOBAL_STYLES}</style>
      <Spinner />
    </div>;
  }

  if (!user) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  if (user.role === "coach") {
    return <CoachApp />;
  }

  // Athlete
  if (!profile) {
    return <OnboardingScreen athleteName={user.name} onComplete={handleOnboardingComplete} />;
  }

  if (needTests && !profile.onboardingComplete) {
    return <TestsBattery profile={profile} onComplete={handleTestsComplete} />;
  }

  return <AthleteApp profile={profile} onUpdateProfile={async (updated) => {
    setProfile(updated);
    await storage.set(`athlete_${updated.name}`, updated);
  }} />;
}
