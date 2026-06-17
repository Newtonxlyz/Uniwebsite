// 读 .md, 转 UTF-8
const fs = require('fs');
const path = require('path');

const src = process.argv[2];
if (!src) {
  console.error('Usage: node read-md.js <file>');
  process.exit(1);
}

const buf = fs.readFileSync(src);
const decoder = new TextDecoder('gb18030', { fatal: false });
const text = decoder.decode(buf);
process.stdout.write(text);
