const fs = require('fs');
const modalsHtml = fs.readFileSync('src/06_modals.html', 'utf8');
const idMatches = [...modalsHtml.matchAll(/\bid=["']([^"']+)["']/g)].map(m => m[1]);
console.log('All IDs in 06_modals.html (' + idMatches.length + '):');
idMatches.forEach(id => console.log('  ' + id));
