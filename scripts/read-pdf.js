const pdfModule = require('pdf-parse');
const pdf = pdfModule.default || pdfModule;
const fs = require('fs');
const path = require('path');

const pdfsDir = path.join(__dirname, '..', 'Pdfs');
const files = fs.readdirSync(pdfsDir);
const cap3 = files.find(f => f.toLowerCase().includes('cap 3') || f.toLowerCase().includes('cap3'));
console.log('File found:', cap3);

const filePath = path.join(pdfsDir, cap3);
const buf = fs.readFileSync(filePath);

pdf(buf).then(data => {
  console.log('Pages:', data.numpages);
  console.log('=== TEXT ===');
  console.log(data.text.substring(0, 15000));
}).catch(e => console.error('Error:', e.message, e.stack));
