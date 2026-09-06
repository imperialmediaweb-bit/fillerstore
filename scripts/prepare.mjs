#!/usr/bin/env node
// Rulează automat înaintea fiecărui build (`prebuild`).
//
// Dacă variabilele de mediu sunt setate, aduce conținutul din WordPress și
// urcă pozele pe Cloudinary. Dacă nu sunt, nu face nimic și lasă build-ul
// să continue — site-ul merge oricum, cu ce are în content/.
//
// NU oprește niciodată build-ul: o eroare de rețea la import nu trebuie să
// dărâme un deploy. În cel mai rău caz se publică ultimul conținut bun.

import "./load-env.mjs";
import { spawn } from "node:child_process";

const run = (file) =>
  new Promise((resolve) => {
    const child = spawn(process.execPath, [new URL(file, import.meta.url).pathname], {
      stdio: "inherit",
      env: process.env,
    });
    child.on("exit", (code) => resolve(code === 0));
    child.on("error", () => resolve(false));
  });

const hasCloudinary = Boolean(
  process.env.CLOUDINARY_URL ||
    (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET)
);

if (!process.env.WORDPRESS_URL) {
  console.log("\n[prepare] WORDPRESS_URL nu e setat — sar peste import, folosesc content/ așa cum e.\n");
} else {
  const ok = await run("./import-wp.mjs");
  if (!ok) console.warn("\n[prepare] Importul nu a reușit — continui cu ultimul conținut bun.\n");

  // sliderele din prima pagină; dacă content/slides.json are deja texte
  // scrise de mână, scriptul nu le suprascrie
  if (ok) await run("./import-slides.mjs");

  if (ok && hasCloudinary) {
    const uploaded = await run("./upload-media.mjs");
    if (!uploaded) console.warn("\n[prepare] Urcarea pozelor nu a reușit — pozele se vor servi din WordPress.\n");
  } else if (ok) {
    console.log("[prepare] Fără date Cloudinary — pozele se servesc direct din WordPress.\n");
  }
}
