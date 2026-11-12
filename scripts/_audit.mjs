import fs from "node:fs";

const src = fs.readFileSync("src/lib/mountain-html.ts", "utf8");
const start = src.indexOf("export const mountainBody = ");
const jsonStart = src.indexOf('"', start);
let i = jsonStart + 1;
let escaped = false;
while (i < src.length) {
  const c = src[i];
  if (escaped) {
    escaped = false;
  } else if (c === "\\") {
    escaped = true;
  } else if (c === '"') {
    break;
  }
  i++;
}
const html = JSON.parse(src.slice(jsonStart, i + 1));

const imgs = [...html.matchAll(/https?:[^"'\s)]+/g)].map((m) => m[0]);
const urls = [...new Set(imgs)];
console.log("URL COUNT", urls.length);
const hosts = {};
for (const u of urls) {
  try {
    const h = new URL(u).host;
    hosts[h] = (hosts[h] || 0) + 1;
  } catch {
    hosts.bad = (hosts.bad || 0) + 1;
  }
}
console.log("HOSTS", hosts);

const text = html
  .replace(/<style[\s\S]*?<\/style>/gi, "")
  .replace(/<script[\s\S]*?<\/script>/gi, "")
  .replace(/<[^>]+>/g, "\n")
  .replace(/&amp;/g, "&")
  .replace(/&nbsp;/g, " ")
  .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
  .replace(/&quot;/g, '"');
const lines = text
  .split(/\n+/)
  .map((s) => s.replace(/\s+/g, " ").trim())
  .filter((s) => s && s.length < 240);
const uniq = [];
const seen = new Set();
for (const l of lines) {
  if (!seen.has(l)) {
    seen.add(l);
    uniq.push(l);
  }
}
fs.writeFileSync("scripts/_audit-text.txt", uniq.join("\n"));
fs.writeFileSync("scripts/_audit-urls.txt", urls.join("\n"));
console.log("UNIQUE TEXT", uniq.length);
console.log(uniq.slice(0, 200).join("\n"));

