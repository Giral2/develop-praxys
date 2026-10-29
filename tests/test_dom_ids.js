const fs = require('fs');
const path = require('path');

console.log('=== TEST SUITE 1: DOM IDs, Workspace Containers, and Modals Integrity ===');

const indexPath = path.join(__dirname, '..', 'index.html');
const appJsPath = path.join(__dirname, '..', 'src', '07_app.js');
const modalsPath = path.join(__dirname, '..', 'src', '06_modals.html');
const workspacesPath = path.join(__dirname, '..', 'src', '05_workspaces.html');

const indexHtml = fs.readFileSync(indexPath, 'utf8');
const appJs = fs.readFileSync(appJsPath, 'utf8');
const modalsHtml = fs.readFileSync(modalsPath, 'utf8');
const workspacesHtml = fs.readFileSync(workspacesPath, 'utf8');

// 1. Extract all static IDs in index.html and detect duplicates
const idRegex = /\bid=["']([^"']+)["']/g;
const allIds = [];
const idCounts = {};
let match;

while ((match = idRegex.exec(indexHtml)) !== null) {
  const id = match[1];
  allIds.push(id);
  idCounts[id] = (idCounts[id] || 0) + 1;
}

const uniqueIds = new Set(allIds);
console.log(`Total id attributes found in index.html: ${allIds.length}`);
console.log(`Unique IDs count in index.html: ${uniqueIds.size}`);

const duplicateIds = Object.entries(idCounts).filter(([_, count]) => count > 1);
if (duplicateIds.length > 0) {
  console.warn(`⚠️ Warning: Duplicate IDs found in index.html (${duplicateIds.length}):`);
  duplicateIds.forEach(([id, count]) => console.warn(`   - ${id} (${count} occurrences)`));
} else {
  console.log('✓ 0 duplicate IDs found in index.html.');
}

// 2. Extract getElementById calls
const staticGetElemRegex = /document\.getElementById\s*\(\s*['"]([^'"]+)['"]\s*\)/g;
const staticAccessedIds = new Set();
while ((match = staticGetElemRegex.exec(appJs)) !== null) {
  staticAccessedIds.add(match[1]);
}
console.log(`\nTotal static string IDs passed to getElementById: ${staticAccessedIds.size}`);

// Verify that all static getElementById calls exist in index.html
const missingStatic = [];
for (const id of staticAccessedIds) {
  if (!uniqueIds.has(id)) {
    missingStatic.push(id);
  }
}

if (missingStatic.length > 0) {
  console.error(`❌ FAIL: Missing static IDs in index.html (${missingStatic.length}):`);
  missingStatic.forEach(id => console.error(`   - ${id}`));
} else {
  console.log(`✓ PASS: All ${staticAccessedIds.size} static IDs referenced in 07_app.js exist in index.html.`);
}

// 3. Verify Dynamic Template Patterns
console.log('\n--- Checking Dynamic Template ID Patterns ---');

// A. Workspaces: workspace-R01 to workspace-R07
const roles = ['R01', 'R02', 'R03', 'R04', 'R05', 'R06', 'R07'];
const missingWorkspaces = roles.filter(r => !uniqueIds.has(`workspace-${r}`));
if (missingWorkspaces.length > 0) {
  console.error(`❌ FAIL: Missing role workspaces: ${missingWorkspaces.join(', ')}`);
} else {
  console.log(`✓ PASS: All 7 role workspaces (workspace-R01 .. workspace-R07) exist in DOM.`);
}

// B. Role pills: pill-R01 to pill-R07 in role bar
const missingPills = roles.filter(r => !uniqueIds.has(`pill-${r}`));
if (missingPills.length > 0) {
  console.error(`❌ FAIL: Missing role pills in 03_role_bar.html: ${missingPills.join(', ')}`);
} else {
  console.log(`✓ PASS: All 7 role selector pills (pill-R01 .. pill-R07) exist in DOM.`);
}

// C. Quick filter chips in global console: chip-ALL, chip-CRITICAL, chip-PENDIENTE_ASIGNACION, chip-EN_ATENCION, chip-SLA_BREACH
const expectedChips = ['chip-ALL', 'chip-CRITICAL', 'chip-PENDIENTE_ASIGNACION', 'chip-EN_ATENCION', 'chip-SLA_BREACH'];
const missingChips = expectedChips.filter(c => !uniqueIds.has(c));
if (missingChips.length > 0) {
  console.error(`❌ FAIL: Missing filter chips: ${missingChips.join(', ')}`);
} else {
  console.log(`✓ PASS: All ${expectedChips.length} filter chips exist in DOM.`);
}

// D. R01 filter buttons: r01Filter-ALL, r01Filter-E02, r01Filter-E14, r01Filter-E15
const expectedR01Filters = ['r01Filter-ALL', 'r01Filter-E02', 'r01Filter-E14', 'r01Filter-E15'];
const missingR01Filters = expectedR01Filters.filter(f => !uniqueIds.has(f));
if (missingR01Filters.length > 0) {
  console.error(`❌ FAIL: Missing R01 filter buttons: ${missingR01Filters.join(', ')}`);
} else {
  console.log(`✓ PASS: All ${expectedR01Filters.length} R01 filter buttons exist in DOM.`);
}

// 4. Check Modal IDs in 06_modals.html and closeModal calls
console.log('\n--- Checking Modal Dialogs and Controls ---');
const modalOverlayRegex = /id=["']([a-zA-Z0-9_-]+Modal)["']/g;
const modalDialogs = new Set();
while ((match = modalOverlayRegex.exec(modalsHtml)) !== null) {
  modalDialogs.add(match[1]);
}
console.log(`Total Modal Dialog containers detected: ${modalDialogs.size}`);
modalDialogs.forEach(m => console.log(`   - ${m}`));

const closeModalRegex = /closeModal\s*\(\s*['"]([^'"]+)['"]\s*\)/g;
const closeModalTargets = new Set();
while ((match = closeModalRegex.exec(indexHtml)) !== null) {
  closeModalTargets.add(match[1]);
}
console.log(`Total modal IDs targeted by closeModal(): ${closeModalTargets.size}`);
const missingCloseTargets = [...closeModalTargets].filter(m => !uniqueIds.has(m));
if (missingCloseTargets.length > 0) {
  console.error(`❌ FAIL: closeModal() targets missing IDs: ${missingCloseTargets.join(', ')}`);
} else {
  console.log(`✓ PASS: All ${closeModalTargets.size} closeModal() targets exist in DOM.`);
}

// 5. Check if all form inputs referenced in modal submit handlers exist
console.log('\n--- Checking Modal Form Input Controls ---');
const modalInputs = [
  // R01 Clarification Modal
  'r01ClarifTicketId', 'r01ClarifTicketBadge', 'r01ClarifQuestionText', 'r01ClarifResponse', 'r01ClarifPhoto',
  // R01 Reopen Modal
  'r01ReopenTicketId', 'r01ReopenBadge', 'r01ReopenReason',
  // R02 Clarification Modal
  'r02ClarifTicketId', 'r02ClarifBadge', 'r02ClarifQuestion',
  // R02 Duplicate Modal
  'r02DuplTicketId', 'r02DuplBadge', 'r02DuplCurrentDesc', 'r02MasterTicketSelect', 'r02DuplReason',
  // R02 Dismiss Modal
  'r02DismissTicketId', 'r02DismissBadge', 'r02DismissReason',
  // R02 ITIL Matrix Modal
  'r02ItilTicketId', 'r02ItilBadge', 'r02ItilImpact', 'r02ItilUrgency', 'r02ItilResultBadge', 'r02ItilJustification',
  // R03 Assign Crew Modal
  'r03AssignTicketId', 'r03AssignBadge', 'r03TechSelect', 'r03WorkloadInfo', 'r03ScheduleDate', 'r03ScheduleTime', 'r03AssignNotes',
  // R03 Requisition Modal
  'r03ReqTicketId', 'r03ReqBadge', 'r03ReqDescription', 'r03ReqCost', 'r03ReqSupplier',
  // R04 Field Log Modal
  'r04LogTicketId', 'r04LogBadge', 'r04DiagnosisNotes', 'r04ActionTaken', 'r04MaterialsUsed',
  // R04 Finish Work Modal
  'r04FinishTicketId', 'r04FinishBadge', 'r04HoursWorked', 'r04FinishNotes', 'r04FinishEvidence',
  // R05 Approve Modal
  'r05ApproveTicketId', 'r05ApproveBadge', 'r05ApproveNotes',
  // R05 Reject Modal
  'r05RejectTicketId', 'r05RejectBadge', 'r05RejectReason',
  // R06 Conformity Modal
  'r06ConfTicketId', 'r06ConfBadge', 'r06ConfNotes',
  // R06 Non-Conformity Modal
  'r06NonConfTicketId', 'r06NonConfBadge', 'r06NonConfFailures', 'r06ReworkPlan',
  // Detail Modal
  'detailModal', 'modalTicketId', 'modalTicketBadge', 'modalTicketTitle', 'modalDescription', 'modalSede', 'modalBloque', 'modalPiso', 'modalAula', 'modalReporter', 'modalCreated', 'modalCategory', 'modalStatus', 'modalSeverity', 'modalTechnician', 'bitacoraList', 'newBitacoraNote',
  // New Incident Modal
  'newIncidentModal', 'newTitle', 'newCategory', 'newSede', 'newBloque', 'newPiso', 'newAula', 'newDescription', 'newSeverity', 'newReporter',
  // Omnibox Modal
  'omniboxModal', 'omniboxInput', 'omniboxResults'
];

const missingFormInputs = modalInputs.filter(id => !uniqueIds.has(id));
if (missingFormInputs.length > 0) {
  console.error(`❌ FAIL: Missing modal form input IDs (${missingFormInputs.length}):`);
  missingFormInputs.forEach(id => console.error(`   - ${id}`));
} else {
  console.log(`✓ PASS: All ${modalInputs.length} modal input IDs exist in DOM.`);
}

console.log('\n=== DOM INTEGRITY AUDIT COMPLETE ===\n');

const hasFailed = missingStatic.length > 0 ||
                  missingWorkspaces.length > 0 ||
                  missingPills.length > 0 ||
                  missingChips.length > 0 ||
                  missingR01Filters.length > 0 ||
                  missingCloseTargets.length > 0 ||
                  missingFormInputs.length > 0;

process.exit(hasFailed ? 1 : 0);
