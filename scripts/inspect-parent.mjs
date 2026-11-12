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

// Let's find each event container
// In Framer, each event card has a container like framer-XXXXX-container or similar
// Let's search for "Satyanarayan" and inspect 2000 chars before it
let idx = html.indexOf('data-framer-name="Event Cards"');
console.log("Found Event Cards at", idx);

// Find end of this div using divRange
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

const divStart = html.lastIndexOf("<div", idx);
const divEnd = divRange(html, divStart);
console.log("Event Cards length:", divEnd - divStart);
const chunk = html.slice(divStart, divEnd);

// How many event cards or child containers are in Event Cards?
const containers = [...chunk.matchAll(/class="([^"]*container[^"]*)"/g)];
console.log("Containers count:", containers.length);
containers.forEach(c => console.log(c[1]));

let idx2 = html.indexOf('data-framer-name="Event Cards"', idx + 100);
console.log("Found 2nd Event Cards at", idx2);
if (idx2 !== -1) {
  const divStart2 = html.lastIndexOf("<div", idx2);
  const divEnd2 = divRange(html, divStart2);
  console.log("2nd Event Cards length:", divEnd2 - divStart2);
  const chunk2 = html.slice(divStart2, divEnd2);
// Let's check classes of Event Cards and its parents
console.log("1st Event cards start:", html.slice(divStart, divStart + 200));
console.log("2nd Event cards start:", html.slice(divStart2, divStart2 + 200));

// Let's check the parents of both
console.log("Parent 1:", html.slice(Math.max(0, divStart - 200), divStart));
console.log("Parent 2:", html.slice(Math.max(0, divStart2 - 200), divStart2));
}


