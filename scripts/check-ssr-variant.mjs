import fs from "node:fs";

const content = fs.readFileSync("src/lib/mountain-html.ts", "utf8");
const start = content.indexOf("export const mountainBody = ");
const jsonStart = content.indexOf('"', start);
let i = jsonStart + 1, escaped = false;
while (i < content.length) {
  const c = content[i];
  if (escaped) escaped = false;
  else if (c === "\\") escaped = true;
  else if (c === '"') break;
  i++;
}
const html = JSON.parse(content.slice(jsonStart, i + 1));

const idx1 = html.indexOf('data-framer-name="Event Cards"');
const idx2 = html.indexOf('data-framer-name="Event Cards"', idx1 + 100);

const v1 = html.lastIndexOf('ssr-variant', idx1);
const v2 = html.lastIndexOf('ssr-variant', idx2);

console.log("V1 tag:", html.slice(v1 - 10, v1 + 100));
console.log("V2 tag:", html.slice(v2 - 10, v2 + 100));

