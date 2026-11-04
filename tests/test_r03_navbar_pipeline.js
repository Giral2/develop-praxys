const { setupMockEnvironment } = require('./mock_dom');
const path = require('path');

console.log('=== TEST SUITE 4: Coordinator (R03) Sub-Navbar Pipeline & Tabla Switcher ===\n');

const env = setupMockEnvironment();
const app = env.app;
const doc = env.document;

let passed = 0;
let failed = 0;

function assert(condition, testName, details = '') {
  if (condition) {
    console.log(`✓ PASS: ${testName}`);
    passed++;
  } else {
    console.error(`❌ FAIL: ${testName} ${details ? '- ' + details : ''}`);
    failed++;
  }
}

// 1. Select Coordinator Role (R03)
app.selectRole('R03');
assert(app.currentRole === 'R03', 'Current role is R03');

const switcher = doc.getElementById('r03ViewSwitcher');
const btnPip = doc.getElementById('r03BtnPipeline');
const btnTab = doc.getElementById('r03BtnTable');
const opsMod = doc.getElementById('r03Module-operations');
const kanbanCont = doc.getElementById('kanbanViewContainer');
const tableCont = doc.getElementById('tableViewContainer');

assert(!!switcher, 'r03ViewSwitcher exists in DOM');
assert(!!btnPip, 'r03BtnPipeline exists in DOM');
assert(!!btnTab, 'r03BtnTable exists in DOM');
assert(!!opsMod, 'r03Module-operations exists in DOM inside workspace-R03');
assert(!!kanbanCont, 'kanbanViewContainer exists in DOM');
assert(!!tableCont, 'tableViewContainer exists in DOM');

// 2. Test Switching to Pipeline (Kanban) View
console.log('\n--- Testing setR03ViewMode("pipeline") ---');
app.setR03ViewMode('pipeline');

assert(app.r03ActiveModule === 'operations', 'r03ActiveModule set to operations');
assert(app.r03ActiveView === 'pipeline', 'r03ActiveView set to pipeline');
assert(app.viewMode === 'kanban', 'Internal viewMode set to kanban');
assert(!opsMod.classList.contains('hidden'), 'r03Module-operations is visible (hidden removed)');
assert(!kanbanCont.classList.contains('hidden'), 'kanbanViewContainer is visible');
assert(tableCont.classList.contains('hidden'), 'tableViewContainer is hidden');
assert(btnPip.className.includes('bg-slate-800') && btnPip.className.includes('text-sky-400'), 'r03BtnPipeline has active styling with sky-400 text');
assert(btnTab.className.includes('border-transparent'), 'r03BtnTable has inactive styling');

// Verify standard module containers are hidden
const standardMods = ['dashboard', 'triaje', 'despacho', 'inventario', 'telemetria', 'reportes'];
const allStandardHidden = standardMods.every(id => doc.getElementById(`r03Module-${id}`).classList.contains('hidden'));
assert(allStandardHidden, 'All 6 standard module containers are hidden when in operations view');

// Verify cards rendered
const countE01 = doc.getElementById('colCount-E01_E03');
assert(parseInt(countE01.innerText, 10) >= 0, `Kanban column E01-E03 rendered cards badge (got ${countE01.innerText})`);

// 3. Test Switching to Tabla View
console.log('\n--- Testing setR03ViewMode("table") ---');
app.setR03ViewMode('table');

assert(app.r03ActiveModule === 'operations', 'r03ActiveModule is operations');
assert(app.r03ActiveView === 'table', 'r03ActiveView set to table');
assert(app.viewMode === 'table', 'Internal viewMode set to table');
assert(!opsMod.classList.contains('hidden'), 'r03Module-operations remains visible');
assert(kanbanCont.classList.contains('hidden'), 'kanbanViewContainer is hidden');
assert(!tableCont.classList.contains('hidden'), 'tableViewContainer is visible (flex mode)');
assert(btnTab.className.includes('bg-slate-800') && btnTab.className.includes('text-sky-400'), 'r03BtnTable has active styling with sky-400 text');
assert(btnPip.className.includes('border-transparent'), 'r03BtnPipeline has inactive styling');

// Verify table headers and rows rendered
const tbody = doc.getElementById('ticketsTableBody');
assert(tbody.children.length > 0, `Table rendered rows (found ${tbody.children.length} rows)`);

// 4. Test Switching back to standard module (e.g. Tablero Principal)
console.log('\n--- Testing setR03Module("dashboard") ---');
app.setR03Module('dashboard');

assert(app.r03ActiveModule === 'dashboard', 'r03ActiveModule set to dashboard');
assert(opsMod.classList.contains('hidden'), 'r03Module-operations is hidden');
const dashMod = doc.getElementById('r03Module-dashboard');
assert(!dashMod.classList.contains('hidden'), 'r03Module-dashboard is visible');
assert(btnPip.className.includes('border-transparent'), 'r03BtnPipeline reset to neutral/inactive');
assert(btnTab.className.includes('border-transparent'), 'r03BtnTable reset to neutral/inactive');

console.log(`\n=== COORDINATOR NAVBAR TESTS COMPLETE: ${passed} PASSED, ${failed} FAILED ===`);
if (failed > 0) process.exit(1);
