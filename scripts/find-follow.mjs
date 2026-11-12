import fs from 'node:fs';
const html = fs.readFileSync('docs/research/mountain-source.html', 'utf8');
const a = html.indexOf('<div class="framer-105zzlt"');
// find next section or end
const b = html.indexOf('<div id="overlay"');
console.log('start', a, 'end', b, 'len', b - a);
console.log('occurrences framer-105zzlt:', (html.split('framer-105zzlt').length - 1));
fs.writeFileSync('C:/Users/divya/AppData/Local/Temp/opencode/follow.txt', html.slice(a, b));

