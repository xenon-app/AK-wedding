import fs from 'node:fs';
let html = fs.readFileSync('docs/research/mountain-source.html', 'utf8');
const old = 'Chaudhary parivaar aap sabhi ko apne is shubh avasar par aamantrit karta hai.';
const neu = 'WITH GRATITUDE<br>We cordially invite you to be part of our<br>journey and seek your presence and<br>blessings for our new beginning.<br>Akhilesh &amp; Rakhi<br>Shri Arjun Chaudhary &amp; Family<br>+91 99392 06876&nbsp;&nbsp;+91 75638 01193<br>Hasanpur Bujurg, Rampur Ratnakar, Jandaha, Vaishali';
const n = html.split(old).length - 1;
html = html.split(old).join(neu);
fs.writeFileSync('docs/research/mountain-source.html', html);
console.log('replaced', n);
// verify
const h = fs.readFileSync('docs/research/mountain-source.html','utf8');
console.log('new present:', (h.split('WITH GRATITUDE').length-1));

