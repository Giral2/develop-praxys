const fs = require('fs');
const appJs = fs.readFileSync('src/07_app.js', 'utf8');

const modalMethods = [
  'openR01ClarificationModal', 'submitR01Clarification',
  'confirmR01Solution',
  'openR01ReopenModal', 'submitR01Reopen',
  'openR02ClarificationModal', 'submitR02Clarification',
  'openR02DuplicateModal', 'submitR02Duplicate',
  'openR02DismissModal', 'submitR02Dismiss',
  'openR02ItilMatrixModal', 'submitR02ItilMatrix', 'calculateItilPriority',
  'openR03AssignCrewModal', 'submitR03AssignCrew',
  'openR03RequisitionModal', 'submitR03Requisition',
  'startR04Work',
  'openR04FieldLogModal', 'submitR04FieldLog',
  'openR04FinishWorkModal', 'submitR04FinishWork',
  'openR05ApproveModal', 'submitR05Approve',
  'openR05RejectModal', 'submitR05Reject',
  'openR06ConformityModal', 'submitR06Conformity',
  'openR06NonConformityModal', 'submitR06NonConformity',
  'openAddSpaceModal', 'submitAddSpace',
  'openDetailModal', 'handleSaveDetailChanges', 'handleDismissIncident',
  'openNewIncidentModal', 'handleCreateIncident',
  'openOmniboxModal', 'onOmniboxSearch'
];

console.log('Inspecting method bodies for getElementById calls:');

modalMethods.forEach(methodName => {
  const regex = new RegExp(`\\b${methodName}\\s*\\([^)]*\\)\\s*\\{([\\s\\S]*?)(?=\\n\\s{6}[a-zA-Z0-9_]+\\s*\\(|\\n\\s{4}\\})`);
  const match = appJs.match(regex);
  if (match) {
    const body = match[1];
    const ids = [...body.matchAll(/getElementById\s*\(\s*['"`]([^'"`]+)['"`]\s*\)/g)].map(m => m[1]);
    console.log(`\nMethod: ${methodName}`);
    console.log(`  Accessed IDs: ${ids.join(', ') || 'None'}`);
  } else {
    console.log(`\nMethod: ${methodName} NOT FOUND!`);
  }
});
