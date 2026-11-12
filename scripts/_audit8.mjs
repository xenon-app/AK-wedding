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

function divRange(openAt) {
  let depth = 0;
  let pos = openAt;
  while (pos < html.length) {
    const nextOpen = html.indexOf("<div", pos);
    const nextClose = html.indexOf("</div>", pos);
    if (nextClose < 0) return -1;
    if (nextOpen !== -1 && nextOpen < nextClose) {
      depth++;
      pos = nextOpen + 4;
    } else {
      depth--;
      pos = nextClose + 6;
      if (depth === 0) return pos;
    }
  }
  return -1;
}

let from = 0;
let n = 0;
while (true) {
  const idx = html.indexOf("framer-f5ej2j", from);
  if (idx < 0) break;
  const divStart = html.lastIndexOf("<div", idx);
  const end = divRange(divStart);
  const chunk = html.slice(divStart, end);
  const texts = [...chunk.matchAll(/>([^<]{1,80})</g)]
    .map((m) => m[1].replace(/\s+/g, " ").trim())
    .filter((t) => t && !t.startsWith("<!--"));
  console.log(n, "len", chunk.length, texts.join(" | "));
  from = idx + 12;
  n++;
}

// jpeg usage context
for (const id of ["gRww6exo", "97fFKjBl", "kIF0ETtg", "cxldxuk5"]) {
  const idx = html.indexOf(id);
  console.log("\nIMG", id, "at", idx);
  console.log(html.slice(idx - 120, idx + 40).replace(/\s+/g, " "));
}

