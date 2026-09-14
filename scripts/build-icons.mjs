// Offline icon packaging. Pass the path to an available Sharp module, or install Sharp locally.
// The supplied signature is not edited: an SVG viewport displays only its monogram.
import {readFile,writeFile} from 'node:fs/promises';
const {default:sharp}=await import(process.argv[2]||'sharp');
const source=await readFile('dist/assets/signature-ac.png');
const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512"><rect width="512" height="512" rx="92" fill="#090a0c"/><svg x="24" y="111" width="464" height="290" viewBox="480 480 1040 650" overflow="hidden"><image width="2000" height="2000" href="data:image/png;base64,${source.toString('base64')}"/></svg></svg>`;
await writeFile('dist/assets/favicon.svg',svg+'\n');
for(const [name,size] of [['favicon-32.png',32],['favicon-48.png',48],['favicon-192.png',192],['apple-touch-icon.png',180]])await sharp(Buffer.from(svg)).resize(size,size).png().toFile('dist/'+name);
const sizes=[16,32,48],images=await Promise.all(sizes.map(size=>sharp(Buffer.from(svg)).resize(size,size).png().toBuffer()));
const header=Buffer.alloc(6+16*sizes.length);header.writeUInt16LE(1,2);header.writeUInt16LE(sizes.length,4);let offset=header.length;
images.forEach((image,i)=>{const entry=6+16*i;header[entry]=sizes[i];header[entry+1]=sizes[i];header.writeUInt16LE(1,entry+4);header.writeUInt16LE(32,entry+6);header.writeUInt32LE(image.length,entry+8);header.writeUInt32LE(offset,entry+12);offset+=image.length;});
await writeFile('dist/favicon.ico',Buffer.concat([header,...images]));
console.log('AC favicon SVG, PNG, ICO and Apple touch icon generated.');
