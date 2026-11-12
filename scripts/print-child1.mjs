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
const ec = html.slice(divStart, divEnd);

// Let's get child 1 (framer-1mb953l-container)
const c1Start = ec.indexOf('<div class="framer-1mb953l-container">');
const c1End = divRange(ec, c1Start);
console.log("=== CHILD 1 ===");
console.log(ec.slice(c1Start, c1End));

