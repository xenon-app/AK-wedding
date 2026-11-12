import fs from "node:fs";

const content = fs.readFileSync("src/lib/mountain-html.ts", "utf8");
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

// Let's find the parent container of the 6 events
// Search around 124517
let idx = html.indexOf("Satyanarayan");
console.log("Found Satyanarayan at", idx);

// Find parent classes or enclosing elements
let before = html.slice(idx - 2000, idx);
console.log("--- BEFORE EVENT 1 ---");
console.log(before.slice(-1000));

// Let's inspect the container of event cards
let after = html.slice(idx, idx + 4000);
console.log("--- EVENT 1 CONTENT ---");
console.log(after.slice(0, 1500));

