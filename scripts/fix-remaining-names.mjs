import fs from 'node:fs';
let html = fs.readFileSync('docs/research/mountain-source.html', 'utf8');
// Replace remaining plain-text names (not already replaced letter spans)
html = html.split('>Abhishek<').join('>Akhilesh<');
html = html.split('>Kanika<').join('>Rakhi<');
// Also handle any quoted attribute values if present
html = html.split('"Abhishek"').join('"Akhilesh"');
html = html.split('"Kanika"').join('"Rakhi"');
fs.writeFileSync('docs/research/mountain-source.html', html);
const h = fs.readFileSync('docs/research/mountain-source.html','utf8');
console.log('Abhishek ->', (h.split('Abhishek').length-1));
console.log('Kanika ->', (h.split('Kanika').length-1));
console.log('Akhilesh ->', (h.split('Akhilesh').length-1));
console.log('Rakhi ->', (h.split('Rakhi').length-1));

