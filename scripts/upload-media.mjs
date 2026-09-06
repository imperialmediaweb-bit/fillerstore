#!/usr/bin/env node
// Urcă pe Cloudinary toate pozele găsite de `npm run import` și scrie
// harta `content/media-map.json` (adresa veche din WordPress → id-ul de pe
// CDN). Site-ul folosește harta ca să servească pozele optimizate automat
// (WebP/AVIF, dimensiunea potrivită ecranului) — vezi lib/img.js.
//
// Cloudinary aduce pozele singur de pe adresa lor publică, deci nu se
// descarcă nimic local. Rularea e idempotentă: ce s-a urcat o dată se sare.
//
//     CLOUDINARY_URL=cloudinary://cheie:secret@nume-cloud npm run upload-media
//     # sau CLOUDINARY_CLOUD_NAME / CLOUDINARY_API_KEY / CLOUDINARY_API_SECRET
//
// Steaguri:  --force  reurcă tot,  --limit=N  doar primele N poze.

import "./load-env.mjs";
import { readFile, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import { resolve } from "node:path";

const CONTENT = resolve(process.cwd(), "content");
const MAP_FILE = resolve(CONTENT, "media-map.json");
const FOLDER = process.env.CLOUDINARY_FOLDER || "filler";
const CONCURRENCY = 4;

const args = process.argv.slice(2);
const force = args.includes("--force");
const limit = Number((args.find((a) => a.startsWith("--limit=")) || "").split("=")[1]) || Infinity;

function credentials() {
  const url = process.env.CLOUDINARY_URL;
  if (url) {
    const m = url.match(/^cloudinary:\/\/([^:]+):([^@]+)@(.+)$/);
    if (m) return { apiKey: m[1], apiSecret: m[2], cloudName: m[3] };
  }
  const { CLOUDINARY_CLOUD_NAME: cloudName, CLOUDINARY_API_KEY: apiKey, CLOUDINARY_API_SECRET: apiSecret } = process.env;
  if (cloudName && apiKey && apiSecret) return { cloudName, apiKey, apiSecret };
  return null;
}

// Adresa din WordPress → id stabil pe Cloudinary.
// .../wp-content/uploads/2024/05/profhilo-h-l-800x800.jpg → fillerstore/2024/05/profhilo-h-l
function publicIdFor(url) {
  let path;
  try {
    path = decodeURIComponent(new URL(url).pathname);
  } catch {
    path = url;
  }
  path = path.replace(/^.*\/wp-content\/uploads\//, "").replace(/^\/+/, "");
  path = path.replace(/\.[a-z0-9]+$/i, "");     // fără extensie
  path = path.replace(/-\d{2,4}x\d{2,4}$/i, ""); // fără sufixul de mărime pus de WP
  path = path.replace(/[^a-zA-Z0-9/_-]+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");
  return `${FOLDER}/${path || createHash("sha1").update(url).digest("hex").slice(0, 16)}`;
}

function sign(params, apiSecret) {
  const base = Object.keys(params)
    .sort()
    .map((k) => `${k}=${params[k]}`)
    .join("&");
  return createHash("sha1").update(base + apiSecret).digest("hex");
}

async function upload(url, { cloudName, apiKey, apiSecret }) {
  const params = {
    folder: "",                       // folderul e deja în public_id
    overwrite: "true",
    public_id: publicIdFor(url),
    timestamp: String(Math.floor(Date.now() / 1000)),
    unique_filename: "false",
    use_filename: "false",
  };
  delete params.folder;

  const body = new URLSearchParams({
    ...params,
    signature: sign(params, apiSecret),
    api_key: apiKey,
    file: url,                        // Cloudinary aduce poza singur
  });

  const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
    method: "POST",
    body,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.error?.message || `HTTP ${res.status}`);
  return {
    publicId: data.public_id,
    format: data.format,
    width: data.width,
    height: data.height,
    bytes: data.bytes,
    version: data.version,
  };
}

// Rulează `worker` peste listă, cu cel mult `n` cereri în paralel.
async function pool(items, n, worker) {
  const queue = [...items.entries()];
  const runners = Array.from({ length: Math.min(n, queue.length) }, async () => {
    while (queue.length) {
      const [i, item] = queue.shift();
      await worker(item, i);
    }
  });
  await Promise.all(runners);
}

async function main() {
  const creds = credentials();
  if (!creds) {
    console.error(
      "Lipsesc datele Cloudinary. Setează CLOUDINARY_URL (din tabloul de bord\n" +
        "Cloudinary → Dashboard → API Environment variable), de exemplu:\n" +
        "  CLOUDINARY_URL=cloudinary://123456789:abcdef@numele-cloudului npm run upload-media"
    );
    process.exit(1);
  }

  let urls;
  try {
    urls = JSON.parse(await readFile(resolve(CONTENT, "images.json"), "utf8"));
  } catch {
    console.error("Nu găsesc content/images.json. Rulează întâi:  npm run import");
    process.exit(1);
  }

  let map = {};
  if (!force) {
    try { map = JSON.parse(await readFile(MAP_FILE, "utf8")); } catch { map = {}; }
  }

  const todo = urls.filter((u) => !map[u]).slice(0, limit);
  console.log(`\n${urls.length} poze în total · ${urls.length - todo.length} deja pe CDN · ${todo.length} de urcat\n`);
  if (!todo.length) { console.log("Nimic de făcut.\n"); return; }

  let done = 0, failed = 0;
  await pool(todo, CONCURRENCY, async (url) => {
    try {
      map[url] = await upload(url, creds);
      done++;
      process.stdout.write(`\r  urcate ${done}/${todo.length}${failed ? ` (${failed} eșecuri)` : ""}   `);
    } catch (err) {
      failed++;
      console.warn(`\n  ! ${url}\n    ${err.message}`);
    }
  });

  await writeFile(MAP_FILE, JSON.stringify(map, null, 2) + "\n", "utf8");
  console.log(`\n\nGata: ${done} urcate, ${failed} eșuate. Harta: content/media-map.json\n`);
}

main().catch((err) => { console.error(err); process.exit(1); });
