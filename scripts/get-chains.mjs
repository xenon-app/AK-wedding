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

function getParentChain(pos) {
  const stack = [];
  let p = 0;
  while (p < pos) {
    const nextOpen = html.indexOf("<div", p);
    const nextClose = html.indexOf("</div>", p);
    if (nextOpen === -1 || nextOpen > pos) break;
    if (nextClose !== -1 && nextClose < nextOpen) {
      stack.pop();
      p = nextClose + 6;
    } else {
      const tagEnd = html.indexOf(">", nextOpen);
      const tag = html.slice(nextOpen, tagEnd + 1);
      const name = tag.match(/data-framer-name="([^"]+)"/)?.[1] || "";
      const cls = tag.match(/class="([^"]+)"/)?.[1] || "";
      stack.push({ name, cls: cls.split(" ")[0] });
      p = tagEnd + 1;
    }
  }
  return stack;
}

console.log("Chain 1:", getParentChain(idx1).map(x => `${x.cls} (${x.name})`));
console.log("Chain 2:", getParentChain(idx2).map(x => `${x.cls} (${x.name})`));

