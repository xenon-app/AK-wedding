import fs from "node:fs";

const content = fs.readFileSync("src/lib/mountain-html.ts", "utf8");
const start = content.indexOf("export const mountainStyles = ");
const jsonStart = content.indexOf('"', start);
let i = jsonStart + 1, escaped = false;
while (i < content.length) {
  const c = content[i];
  if (escaped) escaped = false;
  else if (c === "\\") escaped = true;
  else if (c === '"') break;
  i++;
}
const styles = JSON.parse(content.slice(jsonStart, i + 1));
let idx = 0;
while ((idx = styles.indexOf("1qb2nt1", idx)) !== -1) {
  console.log("Found 1qb2nt1 at", idx);
  console.log(styles.slice(Math.max(0, idx - 40), Math.min(styles.length, idx + 300)));
  idx += 7;
}

// Also check the event card containers: framer-1mb953l-container etc.
for (const cls of ['1mb953l', '68xp2y', '1l21y3k', 'j2h2je', '1coik32']) {
  let cIdx = styles.indexOf(cls);
  console.log(`\n--- Class: ${cls} (at ${cIdx}) ---`);
  if (cIdx !== -1) {
    console.log(styles.slice(Math.max(0, cIdx - 20), Math.min(styles.length, cIdx + 300)));
  }
}

