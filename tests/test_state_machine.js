const { setupMockEnvironment } = require('./mock_dom');

console.log('=== TEST SUITE 2: State Machine & Business Rules (D07 & RN-001..RN-042) ===\n');

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

// Helper to seed a test ticket
function createTestTicket(status, id = 'TKT-2026-TEST01') {
  const ticket = {
    id: id,
    title: 'Test Incident for QA Audit',
    category: 'Eléctrica',
    severity: 'MEDIA',
    sede: 'Campus Meléndez',
    bloque: 'Edificio 388 (Ingeniería Eléctrica)',
    piso: 'Piso 2',
    aula: 'Laboratorio de Alta Tensión 201',
    reporter: 'Prof. Laura Gómez',
    technician: 'Ing. Carlos Méndez',
    status: status,
    createdHoursAgo: 2.0,
    slaHours: 48,
    description: 'Falla de prueba automatizada para verificación de auditoría QA.',
    bitacora: [
      { date: '2026-10-29 10:00', user: 'Prof. Laura Gómez (R01)', note: 'Registro inicial de prueba.' }
    ]
  };
  app.tickets.push(ticket);
  return ticket;
}

// -------------------------------------------------------------
// Test 1: R01 Clarification (E02 -> E03)
// -------------------------------------------------------------
console.log('\n--- 1. Testing R01: E02 -> E03 (Aclaración) ---');
const t1 = createTestTicket('E02', 'TKT-2026-R01-01');
app.activeActionTicketId = t1.id;
doc.getElementById('r01ClarificationResponse').value = 'Se adjuntan detalles y foto del breaker disparado.';
const bitacoraCountBefore1 = t1.bitacora.length;
app.submitR01Clarification();

assert(t1.status === 'E03', 'R01 submits clarification -> Status transitions to E03 (En revisión)', `Got ${t1.status}`);
assert(t1.bitacora.length === bitacoraCountBefore1 + 1, 'Bitácora entry added on clarification');
assert(t1.bitacora[0].user.includes('R01'), 'Bitácora author corresponds to R01');
assert(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}/.test(t1.bitacora[0].date), 'Bitácora timestamp is formatted YYYY-MM-DD HH:mm');

// -------------------------------------------------------------
// Test 2: R01 Confirmation: Conforme (E14 -> E15)
// -------------------------------------------------------------
console.log('\n--- 2. Testing R01: E14 -> E15 (Confirmación Conforme) ---');
const t2 = createTestTicket('E14', 'TKT-2026-R01-02');
const bitacoraCountBefore2 = t2.bitacora.length;
app.confirmR01Solution(t2.id);

assert(t2.status === 'E15', 'R01 confirms solution -> Status transitions to E15 (Cerrada)', `Got ${t2.status}`);
assert(t2.bitacora.length === bitacoraCountBefore2 + 1, 'Bitácora entry added on confirmation');
assert(t2.bitacora[0].user.includes('R01'), 'Bitácora author corresponds to R01');

// -------------------------------------------------------------
// Test 3: R01 Reopen / Non-conformance (E14 -> E13)
// -------------------------------------------------------------
console.log('\n--- 3. Testing R01: E14 -> E13 (Rechazo / Reopen) ---');
const t3 = createTestTicket('E14', 'TKT-2026-R01-03');
app.activeActionTicketId = t3.id;
doc.getElementById('r01ReopenReason').value = 'El ruido en el motor del ventilador aún persiste tras encender.';
const bitacoraCountBefore3 = t3.bitacora.length;
app.submitR01Reopen();

assert(t3.status === 'E13', 'R01 rejects solution -> Status transitions to E13 (En corrección)', `Got ${t3.status}`);
assert(t3.bitacora.length === bitacoraCountBefore3 + 1, 'Bitácora entry added on reopen');
assert(t3.bitacora[0].user.includes('R01'), 'Bitácora author corresponds to R01');

// -------------------------------------------------------------
// Test 4: R02 Clarification Request (E03 -> E02)
// -------------------------------------------------------------
console.log('\n--- 4. Testing R02: E03 -> E02 (Devolver por Aclaración) ---');
const t4 = createTestTicket('E03', 'TKT-2026-R02-01');
app.activeActionTicketId = t4.id;
doc.getElementById('r02ClarificationReason').value = 'Foto no permite identificar si el daño es en la tubería o en el grifo.';
const bitacoraCountBefore4 = t4.bitacora.length;
app.submitR02Clarification();

assert(t4.status === 'E02', 'R02 requests clarification -> Status transitions to E02 (Pendiente info)', `Got ${t4.status}`);
assert(t4.bitacora.length === bitacoraCountBefore4 + 1, 'Bitácora entry added on clarification request');
assert(t4.bitacora[0].user.includes('R02'), 'Bitácora author corresponds to R02 Gestor');

// -------------------------------------------------------------
// Test 5: R02 Duplicity Link (E03 -> E17)
// -------------------------------------------------------------
console.log('\n--- 5. Testing R02: E03 -> E17 (Vincular Duplicado) ---');
const masterTicket = createTestTicket('E05', 'TKT-2026-MASTER');
const t5 = createTestTicket('E03', 'TKT-2026-R02-02');
app.activeActionTicketId = t5.id;
doc.getElementById('r02MasterTicketSelect').value = masterTicket.id;
const bitacoraCountBefore5 = t5.bitacora.length;
const masterBitacoraBefore = masterTicket.bitacora.length;
app.submitR02Duplicate();

assert(t5.status === 'E17', 'R02 links duplicate -> Status transitions to E17 (Cancelada)', `Got ${t5.status}`);
assert(t5.bitacora.length === bitacoraCountBefore5 + 1, 'Bitácora entry added to duplicate ticket');
assert(masterTicket.bitacora.length === masterBitacoraBefore + 1, 'Bitácora entry added to master ticket (bidirectional link RN-014)');

// -------------------------------------------------------------
// Test 6: R02 Dismissal (E03 -> E16)
// -------------------------------------------------------------
console.log('\n--- 6. Testing R02: E03 -> E16 (Desestimar improcedente) ---');
const t6 = createTestTicket('E03', 'TKT-2026-R02-03');
app.activeActionTicketId = t6.id;
doc.getElementById('r02DismissReasonType').value = 'No corresponde a infraestructura física universitaria';
doc.getElementById('r02DismissNotes').value = 'Corresponde a equipos personales de cómputo.';
const bitacoraCountBefore6 = t6.bitacora.length;
app.submitR02Dismiss();

assert(t6.status === 'E16', 'R02 dismisses -> Status transitions to E16 (No procedente)', `Got ${t6.status}`);
assert(t6.bitacora.length === bitacoraCountBefore6 + 1, 'Bitácora entry added on dismissal');
assert(t6.bitacora[0].user.includes('R02'), 'Bitácora author corresponds to R02');

// -------------------------------------------------------------
// Test 7: R02 ITIL Prioritization (E03/E04 -> E05)
// -------------------------------------------------------------
console.log('\n--- 7. Testing R02: ITIL Matrix Prioritization -> E05 ---');
const t7 = createTestTicket('E03', 'TKT-2026-R02-04');
app.activeActionTicketId = t7.id;
doc.getElementById('itilImpactSelect').value = 'ALTO';
doc.getElementById('itilUrgencySelect').value = 'ALTA';
app.calculateItilPriority();
assert(app.calculatedItil.priority === 'CRITICA' && app.calculatedItil.slaHours === 4, 'ITIL ALTO x ALTA calculates CRITICA 4h SLA');

const bitacoraCountBefore7 = t7.bitacora.length;
app.submitR02ItilMatrix();
assert(t7.status === 'E05', 'R02 prioritizes ITIL -> Status transitions to E05 (Pendiente de asignación)', `Got ${t7.status}`);
assert(t7.severity === 'CRITICA', 'Ticket severity set to CRITICA');
assert(t7.slaHours === 4, 'Ticket slaHours set to 4');
assert(t7.bitacora.length === bitacoraCountBefore7 + 1, 'Bitácora entry added on ITIL prioritization');

// -------------------------------------------------------------
// Test 8: R03 Crew Assignment with WIP Limits (E05 -> E10 or E06)
// -------------------------------------------------------------
console.log('\n--- 8. Testing R03: Crew Assignment (E05 -> E10 / E06) ---');
const t8 = createTestTicket('E05', 'TKT-2026-R03-01');
app.activeActionTicketId = t8.id;

// Setup mock radio selection
const mockRadio = doc.createElement('input');
mockRadio.value = 'Ing. Carlos Méndez';
doc.querySelector = (sel) => {
  if (sel.includes('r03SelectedTech')) return mockRadio;
  return null;
};
doc.getElementById('r03AssignTargetState').value = 'E10';
doc.getElementById('r03AssignSchedule').value = 'Turno Mañana 08:00 AM';

const bitacoraCountBefore8 = t8.bitacora.length;
app.submitR03AssignCrew();

assert(t8.status === 'E10', 'R03 assigns crew with target E10 -> Status is E10 (Programada)', `Got ${t8.status}`);
assert(t8.technician === 'Ing. Carlos Méndez', 'Technician assigned to Carlos Méndez');
assert(t8.bitacora.length === bitacoraCountBefore8 + 1, 'Bitácora entry added on assignment');
assert(t8.bitacora[0].user.includes('R03'), 'Bitácora author corresponds to R03 Coordinador');

// Test assignment to E06
const t8b = createTestTicket('E05', 'TKT-2026-R03-02');
app.activeActionTicketId = t8b.id;
doc.getElementById('r03AssignTargetState').value = 'E06';
app.submitR03AssignCrew();
assert(t8b.status === 'E06', 'R03 assigns crew with target E06 -> Status is E06 (Pendiente inspección)', `Got ${t8b.status}`);

// -------------------------------------------------------------
// Test 9: R03 Requisition (E05/E07 -> E08 or E09)
// -------------------------------------------------------------
console.log('\n--- 9. Testing R03: Requisitions (-> E08 / E09) ---');
const t9 = createTestTicket('E05', 'TKT-2026-R03-03');
app.activeActionTicketId = t9.id;
doc.getElementById('r03ReqType').value = 'E08';
doc.getElementById('r03ReqItems').value = '1x Tarjeta inversora HVAC VRF';
doc.getElementById('r03ReqBudget').value = '$3,200,000';
doc.getElementById('r03ReqJustification').value = 'Componente electrónico quemado sin repuesto en stock';

const bitacoraCountBefore9 = t9.bitacora.length;
app.submitR03Requisition();

assert(t9.status === 'E08', 'R03 requisitions extra purchase -> Status transitions to E08 (Pendiente autorización)', `Got ${t9.status}`);
assert(t9.bitacora.length === bitacoraCountBefore9 + 1, 'Bitácora entry added on requisition');
assert(t9.bitacora[0].user.includes('R03'), 'Bitácora author corresponds to R03 Coordinador');

// -------------------------------------------------------------
// Test 10: R04 Field Execution (E10 -> E11, E11 -> E12)
// -------------------------------------------------------------
console.log('\n--- 10. Testing R04: Field Execution (E10 -> E11 -> E12) ---');
const t10 = createTestTicket('E10', 'TKT-2026-R04-01');
const bitacoraCountBefore10 = t10.bitacora.length;
app.startR04Work(t10.id);

assert(t10.status === 'E11', 'R04 starts work -> Status transitions to E11 (En atención)', `Got ${t10.status}`);
assert(t10.bitacora.length === bitacoraCountBefore10 + 1, 'Bitácora entry added on start work');

// Field log submission in E11
app.activeActionTicketId = t10.id;
doc.getElementById('r04LogHours').value = '3.0';
doc.getElementById('r04LogRootCause').value = 'Desgaste por uso y fatiga de material';
doc.getElementById('r04LogMaterials').value = '2x breakers 20A, cable thw #12';
doc.getElementById('r04LogNotes').value = 'Reemplazo de tablero secundario';
app.submitR04FieldLog();
assert(t10.bitacora.length === bitacoraCountBefore10 + 2, 'Field log added to bitácora while keeping status E11');

// Finish work with evidence (E11 -> E12)
doc.getElementById('r04FinishSummary').value = 'Conexiones peinadas, rotuladas y calibradas a 20A. Fotos adjuntas.';
app.submitR04FinishWork();

assert(t10.status === 'E12', 'R04 finishes work -> Status transitions to E12 (Pendiente verificación)', `Got ${t10.status}`);
assert(t10.bitacora[0].note.includes('E12'), 'Bitácora note mentions transition to E12');

// -------------------------------------------------------------
// Test 11: R05 Authorizations Approval & Rejection (E08 -> E10/E09 or E05)
// -------------------------------------------------------------
console.log('\n--- 11. Testing R05: Authorizations (E08 -> E10 / E09 / E05) ---');
const t11a = createTestTicket('E08', 'TKT-2026-R05-01');
app.activeActionTicketId = t11a.id;
doc.getElementById('r05TargetStateSelect').value = 'E10';
doc.getElementById('r05BudgetCode').value = 'RUBRO-2026-CENTRAL';
app.submitR05Approve();

assert(t11a.status === 'E10', 'R05 approves purchase to E10 -> Status is E10 (Programada)', `Got ${t11a.status}`);
assert(t11a.bitacora[0].user.includes('R05'), 'Bitácora author corresponds to R05');

const t11b = createTestTicket('E08', 'TKT-2026-R05-02');
app.activeActionTicketId = t11b.id;
doc.getElementById('r05RejectReason').value = 'Presupuesto no asignado. Utilizar tarjeta equivalente de almacén Palmira.';
app.submitR05Reject();

assert(t11b.status === 'E05', 'R05 rejects purchase -> Status returns to E05 (Pendiente asignación)', `Got ${t11b.status}`);
assert(t11b.bitacora[0].user.includes('R05'), 'Bitácora author corresponds to R05');

// -------------------------------------------------------------
// Test 12: R06 Quality Verification (E12 -> E14 / E15 or E13)
// -------------------------------------------------------------
console.log('\n--- 12. Testing R06: Quality Verification (E12 -> E14 / E15 / E13) ---');
const t12a = createTestTicket('E12', 'TKT-2026-R06-01');
app.activeActionTicketId = t12a.id;
doc.getElementById('r06TargetStateSelect').value = 'E14';
doc.getElementById('r06ConformityNotes').value = 'Instalación cumple RETIE. Requiere firma del docente.';
app.submitR06Conformity();

assert(t12a.status === 'E14', 'R06 approves conformity to E14 -> Status is E14 (Pendiente confirmación)', `Got ${t12a.status}`);
assert(t12a.bitacora[0].user.includes('R06'), 'Bitácora author corresponds to R06 Interventoría');

const t12b = createTestTicket('E12', 'TKT-2026-R06-02');
app.activeActionTicketId = t12b.id;
doc.getElementById('r06TargetStateSelect').value = 'E15';
doc.getElementById('r06ConformityNotes').value = 'Cierre directo por tratarse de área común.';
app.submitR06Conformity();

assert(t12b.status === 'E15', 'R06 approves direct closure E15 -> Status is E15 (Cerrada)', `Got ${t12b.status}`);

const t12c = createTestTicket('E12', 'TKT-2026-R06-03');
app.activeActionTicketId = t12c.id;
doc.getElementById('r06DefectType').value = 'Acabado deficiente o residuos de obra en sitio';
doc.getElementById('r06ReworkInstructions').value = 'Retirar escombros y resanar pintura perimetral.';
app.submitR06NonConformity();

assert(t12c.status === 'E13', 'R06 issues non-conformity -> Status returns to E13 (En corrección)', `Got ${t12c.status}`);
assert(t12c.bitacora[0].user.includes('R06'), 'Bitácora author corresponds to R06');
assert(t12c.bitacora[0].note.includes('ACTA DE NO CONFORMIDAD'), 'Bitácora contains non-conformity act header');

// -------------------------------------------------------------
// Test 13: LocalStorage Persistence & Integrity
// -------------------------------------------------------------
console.log('\n--- 13. Testing LocalStorage Persistence & Data Integrity ---');
const rawStored = env.localStorage.getItem(app.storageKey);
assert(rawStored !== null && rawStored.length > 0, 'Tickets are serialized to localStorage');

let parsedStorage;
try {
  parsedStorage = JSON.parse(rawStored);
  assert(Array.isArray(parsedStorage), 'Serialized data in localStorage is a valid JSON Array');
  assert(parsedStorage.length === app.tickets.length, 'Stored count matches in-memory tickets count');
  
  // Verify that all stored tickets have essential fields
  let validRecords = true;
  for (const t of parsedStorage) {
    if (!t.id || !t.status || !Array.isArray(t.bitacora) || !t.title) {
      validRecords = false;
      break;
    }
  }
  assert(validRecords, 'All records in localStorage have required fields (id, status, title, bitacora)');
} catch (e) {
  assert(false, 'JSON parsing of localStorage data succeeded', e.message);
}

console.log(`\n=== STATE MACHINE AUDIT COMPLETE: ${passed} PASSED, ${failed} FAILED ===\n`);
process.exit(failed > 0 ? 1 : 0);
