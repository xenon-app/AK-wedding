import fs from "node:fs";

const src = fs.readFileSync("src/lib/mountain-html.ts", "utf8");
const start = src.indexOf("export const mountainBody = ");
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
const html = JSON.parse(src.slice(jsonStart, i + 1));

const hrefs = [...html.matchAll(/href="([^"]+)"/g)].map((m) => m[1]);
console.log("--- HREFS ---");
console.log([...new Set(hrefs)].join("\n"));

const srcs = [...html.matchAll(/\ssrc="([^"]+)"/g)].map((m) => m[1]);
console.log("\n--- SRC ---");
console.log([...new Set(srcs)].join("\n"));

// context around Buy Now
const idx = html.indexOf("Buy Now");
console.log("\n--- BUY NOW CONTEXT ---");
console.log(html.slice(Math.max(0, idx - 800), idx + 400).replace(/\s+/g, " ").slice(0, 2000));

const idx2 = html.indexOf("missingpiece");
console.log("\n--- MISSING PIECE ---");
console.log(html.slice(Math.max(0, idx2 - 400), idx2 + 500).replace(/\s+/g, " ").slice(0, 1500));

const idx3 = html.indexOf("wa.me");
console.log("\n--- WA ---");
console.log(html.slice(Math.max(0, idx3 - 200), idx3 + 400).replace(/\s+/g, " ").slice(0, 800));

const idx4 = html.indexOf("rzp.io");
console.log("\n--- RZP ---");
console.log(html.slice(Math.max(0, idx4 - 300), idx4 + 300).replace(/\s+/g, " ").slice(0, 800));

// broken empty links
const empty = [...html.matchAll(/<a[^>]*href="(#[^"]*|)"[^>]*>/g)].slice(0, 30);
console.log("\nempty/hash anchors", empty.length);

// data-framer-name list
const names = [...html.matchAll(/data-framer-name="([^"]+)"/g)].map((m) => m[1]);
const counts = {};
for (const n of names) counts[n] = (counts[n] || 0) + 1;
console.log("\n--- FRAMER NAMES ---");
console.log(Object.entries(counts).map(([k,v]) => `${v}\t${k}`).join("\n"));

