import fs from 'node:fs';
let html = fs.readFileSync('docs/research/mountain-source.html', 'utf8');
html = html.split('Smt. Sita Devi &amp; Sm. Om Puri').join('Smt. Anita Devi &amp; Shri Arjun Chaudhary');
html = html.split('Smt. Sita Devi & Sm. Om Puri').join('Smt. Anita Devi & Shri Arjun Chaudhary');
html = html.split('Mrs. Lata &amp; Mr. Kishore Kapoor').join('Smt. Meena Devi &amp; Shri Jageshwar Chaudhary');
html = html.split('Mrs. Lata & Mr. Kishore Kapoor').join('Smt. Meena Devi & Shri Jageshwar Chaudhary');
fs.writeFileSync('docs/research/mountain-source.html', html);
const h = fs.readFileSync('docs/research/mountain-source.html','utf8');
for (const t of ['Sita Devi','Om Puri','Kishore Kapoor','Anita Devi','Jaggeshwar']) console.log(t, '->', (h.split(t).length-1));

