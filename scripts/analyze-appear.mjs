import fs from 'node:fs';
// Analyze the raw source html (not the generated TS module).
const html = fs.readFileSync('docs/research/mountain-source.html', 'utf8');
const re = /style="([^"]*opacity:\s*0\.001[^"]*)"/g;
let m; const transforms = new Set();
let count = 0;
while ((m = re.exec(html)) !== null) {
  count++;
  const t = m[1].match(/transform:([^;]+)/);
  if (t) transforms.add(t[1].trim());
}
console.log('appear elements:', count);
console.log('distinct transforms:');
[...transforms].forEach(t => console.log(' ', t));

