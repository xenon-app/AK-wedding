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

function textOf(chunk) {
  return chunk
    .replace(/<style[\s\S]*?<\/style>/g, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 500);
}

const id = html.indexOf('id="instagram"');
console.log("INSTAGRAM BLOCK TEXT");
console.log(textOf(html.slice(id, id + 12000)));
const imgs = [...html.slice(id, id + 20000).matchAll(/src="([^"]+)"/g)].map(m => m[1]);
console.log("imgs", imgs.length, imgs.slice(0, 8));

const cd = html.indexOf("The countdown begins");
console.log("\nCOUNTDOWN CONTEXT classes");
console.log(html.slice(cd - 500, cd + 200).replace(/\s+/g, " "));

console.log("\nframer-1mus9pp count", (html.match(/framer-1mus9pp/g) || []).length);
console.log("framer-lpl8ib count", (html.match(/framer-lpl8ib/g) || []).length);

const buy = html.indexOf("Buy button stack");
console.log("\nBUY parent names");
console.log(html.slice(buy - 800, buy + 100).replace(/\s+/g, " "));

// anchors without href
const anchors = [...html.matchAll(/<a\b([^>]*)>/g)];
let noHref = 0;
for (const a of anchors) {
  if (!/\bhref=/.test(a[1])) noHref++;
}
console.log("anchors", anchors.length, "no href", noHref);

// route dekhein tag
const r = html.indexOf("Route dekhein");
console.log("\nROUTE TAG");
console.log(html.slice(r - 600, r + 80).replace(/\s+/g, " "));

