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
const s1 = html.lastIndexOf("<div", idx1);
const e1 = divRange(html, s1);
const ec1 = html.slice(s1, e1);

const idx2 = html.indexOf('data-framer-name="Event Cards"', idx1 + 100);
const s2 = html.lastIndexOf("<div", idx2);
const e2 = divRange(html, s2);
const ec2 = html.slice(s2, e2);

console.log("ec1 length:", ec1.length, "ec2 length:", ec2.length);
console.log("Identical?", ec1 === ec2);

