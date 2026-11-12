import fs from "node:fs";

const html = fs.readFileSync("docs/research/mountain-source.html", "utf8");

function divRange(html, openAt) {
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

const idx = html.indexOf('data-framer-name="Event Cards"');
const divStart = html.lastIndexOf("<div", idx);
const divEnd = divRange(html, divStart);
const ec1 = html.slice(divStart, divEnd);

console.log("ec1 opening tag:", ec1.slice(0, 100));

// Find child divs of ec1 at direct level
let pos = ec1.indexOf(">") + 1;
let children = [];
while (pos < ec1.length) {
  const nextOpen = ec1.indexOf("<div", pos);
  if (nextOpen === -1) break;
  // check if it's right after closing previous
  const childEnd = divRange(ec1, nextOpen);
  if (childEnd === -1) break;
  children.push(ec1.slice(nextOpen, childEnd));
  pos = childEnd;
}
console.log("Child containers in Event Cards 1:", children.length);
children.forEach((c, idx) => {
  const name = c.match(/data-framer-name="Event name"[\s\S]*?<p[^>]*>([\s\S]*?)<\/p>/)?.[1];
  const cls = c.match(/class="([^"]+)"/)?.[1];
  console.log(`Child ${idx + 1}: class="${cls}" Event name="${name}" len=${c.length}`);
});

