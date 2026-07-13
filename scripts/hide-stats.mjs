import fs from "fs";
const p = "src/App.jsx";
let lines = fs.readFileSync(p, "utf8").split("\n");

// Commentaire de widget au niveau onglet = exactement 12 espaces d'indentation.
const isSib = (l) => /^ {12,16}\{\/\* ── /.test(l);

// Désactive le rendu d'un widget SANS rien supprimer : insère `false && ` juste
// après l'accolade ouvrante de l'expression qui suit le commentaire.
// Aucune ligne retirée, aucun <div> touché → zéro risque de casser le nesting.
function hideBlock(name) {
  let found = 0;
  for (let start = 0; start < lines.length; start++) {
    if (!(isSib(lines[start]) && lines[start].includes(name))) continue;
    // Ligne d'expression = première ligne non vide après le commentaire.
    let i = start + 1;
    while (i < lines.length && lines[i].trim() === "") i++;
    const line = lines[i];
    if (!line.trimStart().startsWith("{")) { console.log("SKIP (pas une expression {): " + name); continue; }
    const idx = line.indexOf("{");
    const after = line.slice(idx + 1);
    if (after.startsWith("false && ")) { continue; }
    lines[i] = line.slice(0, idx + 1) + "false && " + after;
    found++;
  }
  console.log((found ? "OK masqué x" + found : "rien à masquer") + ": " + name);
}

const names = (process.argv[2] || "").split("|").filter(Boolean);
for (const n of names) hideBlock(n);
fs.writeFileSync(p, lines.join("\n"));
