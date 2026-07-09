import fs from "fs";
const p = "src/App.jsx";
let lines = fs.readFileSync(p, "utf8").split("\n");

// Commentaire de widget au niveau onglet = exactement 12 espaces d'indentation.
const isSib = (l) => /^ {12}\{\/\* ── /.test(l);

// Désactive le rendu d'un widget SANS rien supprimer : insère `false && ` juste
// après l'accolade ouvrante de l'expression qui suit le commentaire.
// Aucune ligne retirée, aucun <div> touché → zéro risque de casser le nesting.
function hideBlock(name) {
  const start = lines.findIndex((l) => isSib(l) && l.includes(name));
  if (start < 0) { console.log("SKIP introuvable: " + name); return; }
  // Ligne d'expression = première ligne non vide après le commentaire.
  let i = start + 1;
  while (i < lines.length && lines[i].trim() === "") i++;
  const line = lines[i];
  if (!line.trimStart().startsWith("{")) { console.log("SKIP (pas une expression {): " + name); return; }
  const idx = line.indexOf("{");
  const after = line.slice(idx + 1);
  if (after.startsWith("false && ")) { console.log("DÉJÀ masqué: " + name); return; }
  // Insère "false && " juste après la 1re accolade — préserve le reste (y compris \r).
  lines[i] = line.slice(0, idx + 1) + "false && " + after;
  console.log("OK masqué: " + name);
}

const names = (process.argv[2] || "").split("|").filter(Boolean);
for (const n of names) hideBlock(n);
fs.writeFileSync(p, lines.join("\n"));
