import fs from "node:fs";

const content = fs.readFileSync("src/lib/mountain-html.ts", "utf8");

// Parse the mountainBody JSON string
const start = content.indexOf("export const mountainBody = ");
const jsonStart = content.indexOf('"', start);
let i = jsonStart + 1;
let escaped = false;
while (i < content.length) {
  const c = content[i];
  if (escaped) escaped = false;
  else if (c === "\\") escaped = true;
  else if (c === '"') break;
  i++;
}
const html = JSON.parse(content.slice(jsonStart, i + 1));
console.log("HTML length:", html.length);

const idx2 = html.indexOf("Satyanarayan");
console.log("Satyanarayan index in unescaped html:", idx2);

// Look backwards
let sub = html.slice(Math.max(0, idx2 - 5000), idx2);
let matches = [...sub.matchAll(/data-framer-name="([^"]+)"/g)];
console.log("Data framer names before:", matches.slice(-15).map(m => m[1]));

// Events found after
let after = html.slice(idx2 - 500, idx2 + 60000);
let eventNames = [...after.matchAll(/data-framer-name="Event name"[\s\S]*?<p[^>]*>([\s\S]*?)<\/p>/g)];
console.log("Event names found in 1st occurrence set:", eventNames.map(m => m[1]));

let idx3 = html.indexOf("Satyanarayan", idx2 + 100);
console.log("Second Satyanarayan index:", idx3);
if (idx3 !== -1) {
  let after2 = html.slice(idx3 - 500, idx3 + 60000);
  let eventNames2 = [...after2.matchAll(/data-framer-name="Event name"[\s\S]*?<p[^>]*>([\s\S]*?)<\/p>/g)];
  console.log("Event names found in 2nd occurrence set:", eventNames2.map(m => m[1]));
}


