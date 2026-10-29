const fs = require('fs');
const path = require('path');
const vm = require('vm');

console.log('--- Construyendo PRAXIS index.html con Espacios de Rol R01 a R07 ---');

const parts = [
  '01_head.html',
  '02_nav.html',
  'OPEN_MAIN',
  '04_global_console.html',
  '05_workspaces.html',
  'CLOSE_MAIN',
  '06_modals.html',
  '07_app.js'
];

let html = '';

for (const part of parts) {
  if (part === 'OPEN_MAIN') {
    html += '\n  <!-- ==================== MAIN CONTENT CONTAINER ==================== -->\n  <main class="flex-1 flex flex-col max-w-[1720px] w-full mx-auto px-6 py-3 overflow-hidden">\n';
  } else if (part === 'CLOSE_MAIN') {
    html += '\n  </main>\n';
  } else {
    const filePath = path.join(__dirname, 'src', part);
    const content = fs.readFileSync(filePath, 'utf8');
    html += content + '\n';
  }
}

// Write to index.html
const outputPath = path.join(__dirname, 'index.html');
fs.writeFileSync(outputPath, html, 'utf8');
console.log(`✓ Archivo escrito con éxito en: ${outputPath} (${html.length} bytes, ${html.split('\n').length} líneas)`);

// Extract JavaScript from <script> tag and validate syntax with node vm
const scriptMatch = html.match(/<script>([\s\S]*?)<\/script>/);
if (scriptMatch) {
  const jsCode = scriptMatch[1];
  try {
    new vm.Script(jsCode);
    console.log('✓ Validación de sintaxis JavaScript en Node.js: 0 ERRORES DE SINTAXIS. Sintaxis 100% VÁLIDA.');
  } catch (err) {
    console.error('❌ Error de sintaxis en JavaScript:', err.message);
    process.exit(1);
  }
} else {
  console.warn('⚠️ No se encontró la etiqueta <script> para validar.');
}
