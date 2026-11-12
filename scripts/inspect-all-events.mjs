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

// Let's print out the text and structure around each of the 6 events
const eventTitles = ["Satyanarayan", "Haldi", "Baba Bhuian", "Preetibhoj", "Vivah", "Baraat"];
eventTitles.forEach(title => {
  const idx = html.indexOf(title);
  console.log(`\n================= ${title} (idx: ${idx}) =================`);
  if (idx !== -1) {
    console.log(html.slice(idx - 200, idx + 600));
  }
});

