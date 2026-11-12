import fs from "node:fs";

const html = fs.readFileSync("docs/research/mountain-source.html", "utf8");

// Search for RSVP or other buttons
let idx = html.indexOf("RSVP ke liye click karein");
console.log("RSVP at", idx);
if (idx !== -1) {
  console.log(html.slice(idx - 300, idx + 400));
}

let idx2 = html.indexOf("Map kholne ke liye click karein");
console.log("Map kholne at", idx2);
if (idx2 !== -1) {
  console.log(html.slice(idx2 - 300, idx2 + 400));
}

