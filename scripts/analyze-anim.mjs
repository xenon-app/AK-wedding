import fs from 'node:fs';
const html = fs.readFileSync('docs/research/mountain-source.html', 'utf8');
const re = /style="([^"]*will-change:transform[^"]*)"/g;
let m; const set = new Set();
let n = 0;
while ((m = re.exec(html)) !== null) {
  n++;
  const t = m[1].match(/transform:([^;]+)/);
  if (t) set.add(t[1].trim().slice(0, 80));
}
console.log('will-change count', n);
console.log('transforms:');
[...set].forEach((x) => console.log(' ', x));

