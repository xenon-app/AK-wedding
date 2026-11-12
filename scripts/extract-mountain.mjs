import fs from 'node:fs';
const src = fs.readFileSync('docs/research/mountain-source.html', 'utf8');

// Extract all <style>...</style> from head (and body, just in case)
const styleRegex = /<style[^>]*>[\s\S]*?<\/style>/gi;
const styles = [...src.matchAll(styleRegex)].map(m => m[0]).join('\n');

// Extract body innerHTML
const bodyMatch = src.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
const body = bodyMatch ? bodyMatch[1] : '';

// Remove script tags from body
const bodyNoScripts = body.replace(/<script[\s\S]*?<\/script>/gi, '');

// Remove the overlay div? keep.

const out = `// Auto-generated from docs/research/mountain-source.html\nexport const mountainStyles = ${JSON.stringify(styles)};\nexport const mountainBody = ${JSON.stringify(bodyNoScripts)};\n`;
fs.writeFileSync('src/lib/mountain-html.ts', out);
console.log('styles bytes:', styles.length, 'body bytes:', bodyNoScripts.length);

