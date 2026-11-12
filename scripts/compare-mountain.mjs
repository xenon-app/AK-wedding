import fs from "node:fs";

const current = fs.readFileSync("src/lib/mountain-html.ts", "utf8");
const src = fs.readFileSync("docs/research/mountain-source.html", "utf8");

const styleRegex = /<style[^>]*>[\s\S]*?<\/style>/gi;
const styles = [...src.matchAll(styleRegex)].map(m => m[0]).join('\n');
const bodyMatch = src.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
const body = bodyMatch ? bodyMatch[1] : '';
const bodyNoScripts = body.replace(/<script[\s\S]*?<\/script>/gi, '');

const gen = `// Auto-generated from docs/research/mountain-source.html\nexport const mountainStyles = ${JSON.stringify(styles)};\nexport const mountainBody = ${JSON.stringify(bodyNoScripts)};\n`;

console.log("Current length:", current.length);
console.log("Generated length:", gen.length);
console.log("Identical?", current === gen);
if (current !== gen) {
  // Find where they differ
  for (let i = 0; i < Math.min(current.length, gen.length); i++) {
    if (current[i] !== gen[i]) {
      console.log("Diff at", i, "current:", JSON.stringify(current.slice(i, i + 50)), "gen:", JSON.stringify(gen.slice(i, i + 50)));
      break;
    }
  }
}

