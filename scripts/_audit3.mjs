import fs from "node:fs";

const src = fs.readFileSync("src/lib/mountain-html.ts", "utf8");
function extract(name) {
  const start = src.indexOf(`export const ${name} = `);
  const jsonStart = src.indexOf('"', start);
  let i = jsonStart + 1;
  let escaped = false;
  while (i < src.length) {
    const c = src[i];
    if (escaped) escaped = false;
    else if (c === "\\") escaped = true;
    else if (c === '"') break;
    i++;
  }
  return JSON.parse(src.slice(jsonStart, i + 1));
}
const html = extract("mountainBody");

const anchors = [...html.matchAll(/<a\b[^>]*>[\s\S]*?<\/a>/g)];
console.log("ANCHOR COUNT", anchors.length);
for (const m of anchors) {
  const tag = m[0];
  const href = tag.match(/href="([^"]*)"/)?.[1] ?? "";
  const name = tag.match(/data-framer-name="([^"]*)"/)?.[1] ?? "";
  const text = tag
    .replace(/<style[\s\S]*?<\/style>/g, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 120);
  console.log("\nHREF", href);
  console.log("NAME", name);
  console.log("TEXT", text);
}

// music
const music = html.indexOf("Add your music");
console.log("\n\n=== MUSIC ===");
console.log(html.slice(music - 1500, music + 800).replace(/\s+/g, " ").slice(0, 2500));

// Aaditya leftover
let from = 0;
let n = 0;
while (n < 4) {
  const idx = html.indexOf("Aaditya", from);
  if (idx < 0) break;
  console.log("\n=== AADITYA", n, "===");
  console.log(html.slice(idx - 200, idx + 200).replace(/\s+/g, " "));
  from = idx + 7;
  n++;
}

// maps / google
for (const key of ["maps", "google", "goo.gl", "instagram", "hashtag"]) {
  console.log(key, html.toLowerCase().includes(key));
}

// link rel in styles? fonts
const styles = extract("mountainStyles");
const fontUrls = [...styles.matchAll(/https?:[^)"']+/g)].map((m) => m[0]);
console.log("\nSTYLE URLS", [...new Set(fontUrls)].slice(0, 40));
console.log("styles length", styles.length);

// opacity hidden count
console.log("opacity 0.001", (html.match(/opacity:\s*0\.001/g) || []).length);
console.log("opacity:0", (html.match(/opacity:\s*0[;"]/g) || []).length);

