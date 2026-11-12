import fs from 'node:fs';
const html = fs.readFileSync('docs/research/mountain-source.html', 'utf8');
// Find elements with data-framer-name in first section. Extract name + style transform/opacity
const re = /data-framer-name="([^"]+)"[^>]*style="([^"]*)"/g;
let m;
const items = [];
while ((m = re.exec(html)) !== null) {
  const name = m[1];
  const style = m[2];
  const op = style.match(/opacity:([^;]+)/);
  const tr = style.match(/transform:([^;]+)/);
  items.push({ name, opacity: op ? op[1].trim() : '?', transform: tr ? tr[1].trim().slice(0, 70) : 'none' });
}
// print unique-ish (hero-ish names)
const heroNames = ['Starbase 1','Hotel','Hot air balloon + jotti','The moon','Star base 3','Hills','Tree (left side) ','Tree (right side) (desktop)','Shiva','Leaves - Right','Leaves - Left','Paper border right','Big leaves - R','Paper border left','G - Vector (left)','Big leaves - L','G - vector (right)','Bottom flowers','Ganesha ji (left)','Ganesha ji (right)','Om '];
const seen = new Set();
for (const it of items) {
  if (heroNames.includes(it.name) && !seen.has(it.name)) {
    seen.add(it.name);
    console.log(JSON.stringify(it));
  }
}
console.log('total found:', items.length);

