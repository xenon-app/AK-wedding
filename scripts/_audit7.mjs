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

function texts(chunk) {
  return [...chunk.matchAll(/>([^<]{1,100})</g)]
    .map((m) => m[1].replace(/&amp;/g, "&").replace(/&nbsp;/g, " ").replace(/\s+/g, " ").trim())
    .filter((t) => t && !t.startsWith("<!--"));
}

const marker = html.indexOf("The countdown begins");
let divStart = html.lastIndexOf("<div", marker);
for (let level = 0; level < 8; level++) {
  const end = divRange(divStart);
  const chunk = html.slice(divStart, end);
  const cls = chunk.slice(0, 220).match(/class="([^"]+)"/)?.[1];
  const name = chunk.slice(0, 400).match(/data-framer-name="([^"]+)"/)?.[1];
  console.log("\nLEVEL", level, "len", chunk.length, "class", cls, "name", name);
  console.log(texts(chunk).slice(0, 15).join(" | "));
  divStart = html.lastIndexOf("<div", divStart - 1);
}

// all framer-1mus9pp occurrences context
let from = 0;
let n = 0;
while (n < 5) {
  const idx = html.indexOf("framer-1mus9pp", from);
  if (idx < 0) break;
  console.log("\nMUS", n, html.slice(idx - 60, idx + 80).replace(/\s+/g, " "));
  from = idx + 10;
  n++;
}

// music containers
console.log("\naudio count", (html.match(/<audio/g) || []).length);
console.log("buy stacks", (html.match(/Buy button stack/g) || []).length);
console.log("watermarks", (html.match(/data-framer-name="Watermark"/g) || []).length);

