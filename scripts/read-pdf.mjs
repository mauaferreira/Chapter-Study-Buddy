import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const pdfModule = require('pdf-parse');
const { PDFParse } = pdfModule;

import { readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath, pathToFileURL } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const pdfsDir = join(__dirname, '..', 'Pdfs');
const files = readdirSync(pdfsDir);
const cap3 = files.find(f => f.toLowerCase().includes('cap 3') || f.toLowerCase().includes('cap3'));
console.log('File found:', cap3);

const filePath = join(pdfsDir, cap3);
const fileUrl = pathToFileURL(filePath).href;
console.log('File URL:', fileUrl);

// Use getText with URL
const parser = new PDFParse({ verbosity: 0 });
parser.getText(fileUrl).then(data => {
  console.log('Pages:', data.numpages);
  console.log('=== TEXT ===');
  console.log(data.text.substring(0, 15000));
}).catch(e => console.error('Error:', e.message));
