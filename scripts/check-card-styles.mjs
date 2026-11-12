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

const classes = ['framer-1rpake', 'framer-1y6mu2p', 'framer-f7k6uh', 'framer-1ili1ku', 'framer-1coik32', 'framer-2z8xos', 'framer-1s5joo0', 'framer-styles-preset-thf6wm', 'framer-1mb953l-container', 'framer-68xp2y-container'];

classes.forEach(cls => {
  let idx = 0;
  console.log(`\n=================== ${cls} ===================`);
  while ((idx = styles.indexOf(cls, idx)) !== -1) {
    console.log(styles.slice(Math.max(0, idx - 20), Math.min(styles.length, idx + 250)));
    idx += cls.length;
  }
});

