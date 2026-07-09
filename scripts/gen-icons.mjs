import sharp from "sharp";
import { mkdirSync } from "fs";

// Recadre le "A" (partie haute du logo) en carré, puis génère les icônes.
// Le logo fait 1254x1254 ; le sommet "A" occupe la moitié haute, centré.
const SRC = "public/apex-logo.png";
const OUT = "public/icons";
mkdirSync(OUT, { recursive: true });

// Zone du "A" (carré) — recadrage centré horizontalement sur le sommet.
const crop = { left: 297, top: 108, width: 660, height: 660 };
const sizes = [72, 96, 128, 144, 152, 180, 192, 512];

const base = sharp(SRC).extract(crop);

for (const s of sizes) {
  await base
    .clone()
    .resize(s, s, { fit: "cover" })
    // Aplatit sur fond noir (icône opaque, l'OS arrondit les coins).
    .flatten({ background: "#0a0a08" })
    .png()
    .toFile(`${OUT}/icon-${s}.png`);
  console.log(`✓ icon-${s}.png`);
}
console.log("Icônes générées.");
