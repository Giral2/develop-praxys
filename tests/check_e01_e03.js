const fs = require('fs');
const appJs = fs.readFileSync('src/07_app.js', 'utf8');

const lines = appJs.split('\n');
console.log('--- Lines mentioning E01 ---');
lines.forEach((l, i) => {
  if (l.includes('E01')) {
    console.log(`${i+1}: ${l.trim()}`);
  }
});

console.log('\n--- Lines assigning status to E03 ---');
lines.forEach((l, i) => {
  if (l.includes('E03') && l.includes('status')) {
    console.log(`${i+1}: ${l.trim()}`);
  }
});
