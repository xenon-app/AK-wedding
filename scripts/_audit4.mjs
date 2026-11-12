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

// empty href anchors with surrounding context
let from = 0;
let n = 0;
while (n < 14) {
  const idx = html.indexOf('href=""', from);
  if (idx < 0) break;
  console.log("\n==== EMPTY", n, "====");
  console.log(html.slice(idx - 120, idx + 350).replace(/\s+/g, " "));
  from = idx + 6;
  n++;
}

console.log("\n\n==== INSTAGRAM HITS ====");
let f2 = 0;
let k = 0;
const low = html;
while (k < 8) {
  const idx = low.toLowerCase().indexOf("instagram", f2);
  if (idx < 0) break;
  console.log("\n--", k, "--");
  console.log(html.slice(idx - 180, idx + 220).replace(/\s+/g, " "));
  f2 = idx + 9;
  k++;
}

// event names text near Satyanarayan
for (const label of ["Satyanarayan", "Haldi", "Baba Bhuian", "Preetibhoj", "Vivah", "Baraat"]) {
  const idx = html.indexOf(label);
  console.log("\n==== EVENT", label, "====");
  const chunk = html.slice(idx, idx + 2500);
  const texts = [...chunk.matchAll(/>([^<]{2,80})</g)].map((m) => m[1].replace(/&amp;/g, "&").trim()).filter(Boolean);
  console.log(texts.slice(0, 20).join(" | "));
}

// opacity:0 contexts (not 0.001)
const re = /opacity:\s*0(?!\.)/g;
let m;
let c = 0;
while ((m = re.exec(html)) && c < 8) {
  console.log("\n==== OP0", c, "====");
  console.log(html.slice(m.index - 80, m.index + 160).replace(/\s+/g, " "));
  c++;
}

// check aaditya visible text
const idxA = html.indexOf('data-framer-name="Aaditya"');
console.log("\n==== NAME BLOCK ====");
console.log(html.slice(idxA, idxA + 1800).replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").slice(0, 600));

