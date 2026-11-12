import fs from 'node:fs';
const html = fs.readFileSync('docs/research/mountain-source.html', 'utf8');
const idx = html.indexOf('data-framer-name="Abhishek"');
const slice = html.slice(idx, idx + 1200);
const m = slice.match(/<span style="display:inline-block;opacity:0\.001[^>]*>[^<]<\/span>/g);
console.log('letter spans:', m ? m.map(x => x.replace(/.*>/, '').replace('</span>', '')) : null);
fs.writeFileSync('C:/Users/divya/AppData/Local/Temp/opencode/abhi2.txt', slice);

