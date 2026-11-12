import fs from "node:fs";

function getPngDimensions(filePath) {
  const buf = fs.readFileSync(filePath);
  // PNG header is 8 bytes, IHDR chunk starts at offset 8, length at 8, type at 12, width at 16, height at 20
  if (buf.readUInt32BE(0) === 0x89504E47 && buf.readUInt32BE(4) === 0x0D0A1A0A) {
    const width = buf.readUInt32BE(16);
    const height = buf.readUInt32BE(20);
    return { width, height };
  }
  return null;
}

const f1 = 'public/images/Satyanarayan Puja ,Matkor  and Baba Bhuian Puja.png';
const f2 = 'public/images/Haldi and Mehendi Wedding Celebrations.png';
const f3 = 'public/images/Preetibhoj and Vivah Celebration.png';

console.log('1:', getPngDimensions(f1));
console.log('2:', getPngDimensions(f2));
console.log('3:', getPngDimensions(f3));

