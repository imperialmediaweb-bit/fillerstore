// Scripturile de import rulează cu `node` simplu, care — spre deosebire de
// Next — nu citește singur fișierele .env. Le încărcăm aici, ca datele de
// acces să stea în .env.local (ignorat de git), nu în linia de comandă.
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

for (const file of [".env.local", ".env"]) {
  try {
    for (const line of readFileSync(resolve(process.cwd(), file), "utf8").split("\n")) {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/i);
      if (!m) continue;
      const [, key, raw] = m;
      if (process.env[key]) continue; // ce e deja în mediu are prioritate
      process.env[key] = raw.replace(/^["']|["']$/g, "");
    }
  } catch {
    /* fișierul lipsește — normal */
  }
}
