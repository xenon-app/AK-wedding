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

const links = [...html.matchAll(/<a[^>]*href="([^"]*)"[^>]*>([\s\S]*?)<\/a>/g)];
links.forEach(l => {
  console.log('href:', l[1], 'text:', l[2].replace(/<[^>]*>/g, '').trim());
});

// Also check all <a> without href
const allLinks = [...html.matchAll(/<a[^>]*>([\s\S]*?)<\/a>/g)];
console.log('Total <a> tags:', allLinks.length);
allLinks.slice(0, 15).forEach(l => {
  console.log('a tag:', l[0].slice(0, 150));
});

