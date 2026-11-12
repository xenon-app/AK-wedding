import fs from 'node:fs';
let html = fs.readFileSync('docs/research/mountain-source.html', 'utf8');
html = html.split('Smt. Lata Devi &amp; Sm. Kamal Kapoor').join('Smt. Anita Devi &amp; Shri Arjun Chaudhary');
html = html.split('Mrs. Reena &amp; Mr. Rajiv Kapoor').join('Smt. Anita Devi &amp; Shri Arjun Chaudhary');
html = html.split('Mrs. Shalini &amp; Mr. Aakash Mittal').join('Smt. Meena Devi &amp; Shri Jageshwar Chaudhary');
// couple message (uses & ? check)
fs.writeFileSync('docs/research/mountain-source.html', html);
console.log('done');
// verify
const h = fs.readFileSync('docs/research/mountain-source.html','utf8');
for (const t of ['Anita Devi','Jageshwar','Lata Devi','Shalini']) console.log(t, '->', (h.split(t).length-1));

