import fs from "node:fs";

const html = fs.readFileSync("docs/research/mountain-source.html", "utf8");

let idx = 0;
let occurrences = [];
while ((idx = html.indexOf('data-framer-name="Event Cards"', idx)) !== -1) {
  occurrences.push(idx);
  idx += 30;
}
console.log("Event Cards occurrences in mountain-source.html:", occurrences.length, occurrences);

