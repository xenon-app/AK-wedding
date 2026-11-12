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
console.log("html length", html.length);

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

function firstDivBefore(marker) {
  const idx = html.indexOf(marker);
  const divStart = html.lastIndexOf("<div", idx);
  return { idx, divStart, end: divRange(divStart) };
}

const inst = html.indexOf('id="instagram"');
const instDiv = html.lastIndexOf("<div", inst);
const instEnd = divRange(instDiv);
console.log("instagram range", instDiv, instEnd, "len", instEnd - instDiv);

for (const marker of [
  "The countdown begins",
  "WITH GRATITUDE",
  "framer-1mus9pp",
  'data-framer-name="Buy button stack"',
  "Follow the action",
  "00:00:00:00",
]) {
  const idx = html.indexOf(marker);
  console.log(marker, "inside instagram", idx > instDiv && idx < instEnd, "at", idx);
}

const mus = html.indexOf("framer-1mus9pp");
const musDiv = html.lastIndexOf("<div", mus);
const musEnd = divRange(musDiv);
const musHtml = html.slice(musDiv, musEnd);
const texts = [...musHtml.matchAll(/>([^<]{1,80})</g)]
  .map((m) => m[1].replace(/\s+/g, " ").trim())
  .filter((t) => t && t !== "<!--$-->" && !t.startsWith("<!--"));
console.log("\n1mus9pp length", musHtml.length);
console.log("texts", texts.slice(0, 40));

const buy = html.indexOf('data-framer-name="Buy button stack"');
const buyDiv = html.lastIndexOf("<div", buy);
const buyEnd = divRange(buyDiv);
const buyHtml = html.slice(buyDiv, Math.min(buyEnd, buyDiv + 500));
console.log("\nbuy length", buyEnd - buyDiv);
console.log(buyHtml.replace(/\s+/g, " ").slice(0, 300));

