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

const idx1 = html.indexOf('data-framer-name="Event Cards"');
const idx2 = html.indexOf('data-framer-name="Event Cards"', idx1 + 100);
const divStart2 = html.lastIndexOf("<div", idx2);
const divEnd2 = divRange(html, divStart2);
const ec2 = html.slice(divStart2, divEnd2);

let pos = ec2.indexOf(">") + 1;
let children = [];
while (pos < ec2.length) {
  const nextOpen = ec2.indexOf("<div", pos);
  if (nextOpen === -1) break;
  const childEnd = divRange(ec2, nextOpen);
  if (childEnd === -1) break;
  children.push(ec2.slice(nextOpen, childEnd));
  pos = childEnd;
}
console.log("Child containers in Event Cards 2:", children.length);
children.forEach((c, idx) => {
  const name = c.match(/data-framer-name="Event name"[\s\S]*?<p[^>]*>([\s\S]*?)<\/p>/)?.[1];
  const cls = c.match(/class="([^"]+)"/)?.[1];
  console.log(`Child ${idx + 1}: class="${cls}" Event name="${name}" len=${c.length}`);
});

