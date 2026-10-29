const fs = require('fs');
const appJs = fs.readFileSync('src/07_app.js', 'utf8');

const targetMethods = [
  'submitR01Clarification',
  'confirmR01Solution',
  'submitR01Reopen',
  'submitR02Clarification',
  'submitR02Duplicate',
  'submitR02Dismiss',
  'submitR02ItilMatrix',
  'submitR03AssignCrew',
  'submitR03Requisition',
  'startR04Work',
  'submitR04FieldLog',
  'submitR04FinishWork',
  'submitR05Approve',
  'submitR05Reject',
  'submitR06Conformity',
  'submitR06NonConformity'
];

targetMethods.forEach(methodName => {
  const regex = new RegExp(`\\b${methodName}\\s*\\([^)]*\\)\\s*\\{([\\s\\S]*?)(?=\\n\\s{6}[a-zA-Z0-9_]+\\s*\\(|\\n\\s{4}\\})`);
  const match = appJs.match(regex);
  console.log(`\n================== ${methodName} ==================`);
  if (match) {
    console.log(match[0]);
  } else {
    console.log('NOT FOUND!');
  }
});
