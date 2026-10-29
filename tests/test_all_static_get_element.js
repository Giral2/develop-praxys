const fs = require('fs');
const path = require('path');

const indexPath = path.join(__dirname, '..', 'index.html');
const appJsPath = path.join(__dirname, '..', 'src', '07_app.js');

const html = fs.readFileSync(indexPath, 'utf8');
const appJs = fs.readFileSync(appJsPath, 'utf8');

// Collect all static getElementById calls
const regex = /document\.getElementById\s*\(\s*['"]([^'"]+)['"]\s*\)/g;
const staticIds = new Set();
let match;
while ((match = regex.exec(appJs)) !== null) {
  staticIds.add(match[1]);
}

// Find all id="..." in html
const idRegex = /\bid=["']([^"']+)["']/g;
const domIds = new Set();
while ((match = idRegex.exec(html)) !== null) {
  domIds.add(match[1]);
}

console.log(`Checking ${staticIds.size} static document.getElementById references...`);

const missing = [];
for (const id of staticIds) {
  if (!domIds.has(id)) {
    missing.push(id);
  }
}

if (missing.length > 0) {
  console.error(`❌ Missing static IDs in index.html (${missing.length}):`);
  missing.forEach(id => console.error(`  - ${id}`));
  process.exit(1);
} else {
  console.log(`✓ 100% PASS: All ${staticIds.size} static getElementById targets exist in index.html!`);
  process.exit(0);
}
