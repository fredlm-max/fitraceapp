import fs from "fs";
const p = "src/App.jsx";
let lines = fs.readFileSync(p, "utf8").split("\n");

// Commentaire de widget au niveau onglet = exactement 12 espaces d'indentation.
const isSib = (l) => /^ {12}\{\/\* ── /.test(l);

// Supprime le bloc dont le commentaire contient `name`, du commentaire jusqu'au
// prochain sibling (exclu). Garde-fou : refuse si la dernière ligne du bloc n'est
// pas une fermeture d'expression propre (évite d'emporter un </div> de wrapper).
function removeBlock(name) {
  const start = lines.findIndex((l) => isSib(l) && l.includes(name));
  if (start < 0) { console.log("SKIP introuvable: " + name); return false; }
  let end = -1;
  for (let i = start + 1; i < lines.length; i++) { if (isSib(lines[i])) { end = i; break; } }
  if (end < 0) { console.log("SKIP pas de fin: " + name); return false; }
  let li = end - 1;
  while (li > start && lines[li].trim() === "") li--;
  const lastClose = lines[li].trim();
  if (lastClose !== "})()}" && lastClose !== ")}") {
    console.log('ABORT fin non propre "' + lastClose + '": ' + name); return false;
  }
  lines.splice(start, end - start);
  console.log("OK supprime: " + name + " (" + (end - start) + " lignes)");
  return true;
}

// Les noms passés en argument (séparés par |).
const names = (process.argv[2] || "").split("|").filter(Boolean);
for (const n of names) removeBlock(n);
fs.writeFileSync(p, lines.join("\n"));
