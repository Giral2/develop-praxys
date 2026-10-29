const { setupMockEnvironment } = require('./mock_dom');
const fs = require('fs');
const path = require('path');

console.log('=== TEST SUITE 3: UI/UX Multi-Role Consistency & Event Bindings ===\n');

const env = setupMockEnvironment();
const app = env.app;
const doc = env.document;
const indexPath = path.join(__dirname, '..', 'index.html');
const indexHtml = fs.readFileSync(indexPath, 'utf8');

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

// -------------------------------------------------------------
// Part 1: Test selectRole for all 7 roles (R01..R07)
// -------------------------------------------------------------
const roles = ['R01', 'R02', 'R03', 'R04', 'R05', 'R06', 'R07'];

roles.forEach(roleCode => {
  console.log(`\n--- Testing Role Switching to ${roleCode} ---`);
  
  app.selectRole(roleCode);
  
  assert(app.currentRole === roleCode, `selectRole('${roleCode}') updates currentRole to ${roleCode}`);
  assert(env.localStorage.getItem(app.roleKey) === roleCode, `Role '${roleCode}' persisted to localStorage`);
  
  const activeWs = doc.getElementById(`workspace-${roleCode}`);
  assert(!activeWs.classList.contains('hidden'), `Active workspace for ${roleCode} is visible (hidden removed)`);
  
  // Verify all other 6 workspaces are hidden
  const otherRoles = roles.filter(r => r !== roleCode);
  const othersHidden = otherRoles.every(r => doc.getElementById(`workspace-${r}`).classList.contains('hidden'));
  assert(othersHidden, `All other 6 role workspaces are hidden when ${roleCode} is active`);
  
  // Verify UI headers and badges
  const navBadge = doc.getElementById('navRoleBadge').innerText;
  assert(navBadge.includes(roleCode), `Header navigation badge includes ${roleCode} (Got: "${navBadge}")`);
});

// -------------------------------------------------------------
// Part 2: Context View Toggling (Workspace vs Global OPS)
// -------------------------------------------------------------
console.log('\n--- Testing Context View Alternation ---');

const globalCont = doc.getElementById('globalConsoleContainer');
const workspaceCont = doc.getElementById('roleWorkspaceContainer');
const btnToggleText = doc.getElementById('btnToggleContextText');

// Ensure starting in workspace
app.switchContextView('workspace');
assert(globalCont.classList.contains('hidden'), 'Global Console is hidden in workspace mode');
assert(!workspaceCont.classList.contains('hidden'), 'Role Workspace is visible in workspace mode');
assert(btnToggleText.innerText.includes('Global'), 'Toggle button invites switching to Consola Global OPS');

// Toggle to Global Console
app.toggleContextView();
assert(app.contextView === 'global', 'Toggled to global mode');
assert(env.localStorage.getItem(app.contextViewKey) === 'global', 'Context view mode persisted in localStorage');
assert(!globalCont.classList.contains('hidden'), 'Global Console is visible in global mode');
assert(workspaceCont.classList.contains('hidden'), 'Role Workspace is hidden in global mode');
assert(btnToggleText.innerText.includes('Espacio'), 'Toggle button invites switching back to Espacio');

// Toggle back to Workspace
app.toggleContextView();
assert(app.contextView === 'workspace', 'Toggled back to workspace mode');
assert(globalCont.classList.contains('hidden'), 'Global Console is hidden again');
assert(!workspaceCont.classList.contains('hidden'), 'Role Workspace is visible again');

// -------------------------------------------------------------
// Part 3: Validate ALL inline onclick/onchange/onsubmit bindings
// -------------------------------------------------------------
console.log('\n--- Validating Inline HTML Event Handler Bindings ---');

// Match all onclick="app.foo(...)", onchange="app.foo(...)", onsubmit="app.foo(...)", oninput="app.foo(...)"
const eventAttrRegex = /\b(onclick|onchange|onsubmit|oninput)=["']app\.([a-zA-Z0-9_]+)\s*\(([^)]*)\)["']/g;
const invokedMethods = new Set();
let match;

while ((match = eventAttrRegex.exec(indexHtml)) !== null) {
  const eventName = match[1];
  const methodName = match[2];
  invokedMethods.add(methodName);
}

console.log(`Total unique methods called via inline event attributes: ${invokedMethods.size}`);

const missingMethods = [];
for (const method of invokedMethods) {
  if (typeof app[method] !== 'function') {
    missingMethods.push(method);
  }
}

if (missingMethods.length > 0) {
  assert(false, 'All inline event handlers map to genuine PraxisApp methods', `Missing methods: ${missingMethods.join(', ')}`);
} else {
  assert(true, `All ${invokedMethods.size} methods called in inline HTML event handlers exist and are functions on PraxisApp!`);
}

// Check closeModal calls from buttons
const closeModalCalls = [...indexHtml.matchAll(/app\.closeModal\s*\(\s*['"]([^'"]+)['"]\s*\)/g)].map(m => m[1]);
console.log(`Total app.closeModal('...') calls: ${closeModalCalls.length}`);
const missingModalTargets = closeModalCalls.filter(id => !doc.getElementById(id));
assert(missingModalTargets.length === 0, 'All closeModal calls reference existing DOM modal IDs');

console.log(`\n=== UI/UX CONSISTENCY AUDIT COMPLETE: ${passed} PASSED, ${failed} FAILED ===\n`);
process.exit(failed > 0 ? 1 : 0);
