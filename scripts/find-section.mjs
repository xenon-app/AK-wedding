import fs from 'node:fs';
const html = fs.readFileSync('docs/research/mountain-source.html', 'utf8');
const a = html.indexOf('<div class="framer-1mus9pp">');
const b = html.indexOf('<div class="framer-105zzlt"');
console.log('start', a, 'end', b, 'len', b - a);
console.log('start snippet:', html.slice(a, a + 80));
console.log('end snippet:', html.slice(b - 40, b + 40));
// count occurrences of framer-1mus9pp
console.log('occurrences framer-1mus9pp:', (html.split('framer-1mus9pp').length - 1));

