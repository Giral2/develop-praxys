# 02\-Negocio — Roles, RACI, Procesos, Reglas y Estados \(D03 \- D07\)

# 02-Negocio: Modelo Operativo, Roles, Reglas y Máquina de Estados

Especificación de las reglas de negocio institucionales, modelo de actores y dinámica de transiciones del sistema PRAXIS (documentos D03, D04, D05, D06 y D07).

---

## D03: Interesados, Roles y Matriz RACI

### 1. Catálogo Formal de Roles (R01 a R07)

| Código | Rol Institucional | Perfil y Responsabilidades Principales |
| --- | --- | --- |
| **R01** | Reportante | Comunidad universitaria (estudiantes, docentes, administrativos). Registra la incidencia, describe ubicación física y problema, adjunta evidencia fotográfica, responde aclaraciones y confirma conformidad de cierre. |
| **R02** | Gestor de incidencias | Personal de mesa de ayuda de infraestructura. Revisa reportes radicados, solicita información faltante, identifica duplicados, valida procedencia técnica y clasifica severidad preliminar. |
| **R03** | Coordinador de mantenimiento | Ingeniero o jefe operativo de área. Coordina inspecciones, evalúa diagnósticos técnicos, planifica intervenciones, asigna personal según capacidad (WIP limit) y supervisa avance de obras. |
| **R04** | Técnico de mantenimiento | Personal operativo de campo (electricistas, fontaneros, cerrajeros, etc.). Inspecciona físicamente, diagnostica causa raíz, ejecuta trabajos de reparación, registra insumos/tiempos y documenta evidencias fotográficas. |
| **R05** | Responsable de autorizaciones | Director de planta física / Ordenador del gasto. Evalúa y autoriza solicitudes de compra de materiales extraordinarios o contratación externa, registrando justificación y aval presupuestal. |
| **R06** | Verificador de intervenciones | Interventor o supervisor de calidad independiente. Comprueba los resultados técnicos en sitio, revisa evidencias finales, acepta o rechaza trabajos emitiendo actas de no conformidad para retrabajo. |
| **R07** | Administrador de plataforma | Administrador del sistema. Gestiona usuarios, permisos, árbol jerárquico de ubicaciones institucionales, categorías de daño y calibración de reglas del sistema (matriz ITIL, SLAs). |

### 2. Matriz de Responsabilidades RACI

*Convención: R = Responsible (Ejecuta), A = Accountable (Autoridad final/Aprueba), C = Consulted (Consultado), I = Informed (Informado).*

| Actividad Operativa | R01 Reportante | R02 Gestor | R03 Coordinador | R04 Técnico | R05 Autorizador | R06 Verificador | R07 Admin |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Registrar incidencia | **R / A** | I | I | - | - | - | - |
| Revisar información y solicitar datos | C | **R / A** | I | - | - | - | - |
| Validar procedencia y duplicidad | I | **R / A** | C | - | - | - | - |
| Evaluar diagnóstico en sitio | - | C | **A** | **R** | - | - | - |
| Planificar intervención y cuadrilla | I | C | **R / A** | C | - | - | - |
| Solicitar recursos y materiales | - | I | **R / A** | C | - | - | - |
| Aprobar compras y recursos sujetos a autorización | - | I | C | - | **R / A** | - | - |
| Ejecutar mantenimiento y bitácora | I | - | **A** | **R** | - | - | - |
| Verificar calidad técnica de intervención | I | - | C | C | - | **R / A** | - |
| Confirmar conformidad de usuario (E14) | **R / A** | - | I | - | - | - | - |
| Autorizar cierre operativo formal | I | C | **R / A** | C | - | C | - |
| Parametrización y gobernanza de catálogos | - | - | C | - | - | - | **R / A** |

---

## D04 y D05: Proceso Actual (AS-IS) y Flujo Digital (TO-BE)

### 1. Recorrido del Flujo Digital TO-BE

1. **Inicio / Registro:** Usuario radica incidencia en portal web/móvil con jerarquía de 4 niveles y fotos condicionales.
2. **Revisión de Información:** Gestor evalúa calidad de datos; si falta información devuelve a E02; si es duplicado vincula a ticket maestro; si no corresponde a infraestructura descarta a E16.
3. **Clasificación y Evaluación de Riesgo:** Si hay riesgo inmediato, se activa protocolo de emergencia con despacho express; en flujo ordinario se calcula la prioridad ITIL (Impacto x Urgencia).
4. **Inspección y Diagnóstico:** Técnico arriba al sitio; si no confirma daño se justifica y cierra; si confirma, formula alcance técnico y lista de insumos.
5. **Aprovisionamiento:** Si se requieren compras, se somete a aprobación de R05 en E08; si falta stock en almacén permanece en E09; al estar listos los insumos, transiciona a E10 Programada.
6. **Ejecución y Verificación:** Cuadrilla ejecuta en E11 registrando bitácora y fotos; al culminar pasa a E12 para control de calidad por R06; si no supera se devuelve a E13 En corrección; si aprueba, se solicita confirmación en E14 o se cierra directamente en E15.

---

## D06: Catálogo Maestro de Reglas de Negocio (RN-001 a RN-042)

### 1. Registro de Incidencias (RN-001 a RN-005)

- **RN-001:** Toda incidencia tiene un identificador único (#TKT-AAAA-####).
- **RN-002:** El registro contiene los datos obligatorios definidos para su tipo.
- **RN-003:** La ubicación debe identificarse con el nivel de detalle requerido (Sede -\> Edificio -\> Piso -\> Espacio).
- **RN-004:** Se registran fecha, hora y usuario creador de manera automática e inmutable.
- **RN-005:** La evidencia fotográfica es obligatoria solo cuando lo establezcan las reglas de la categoría.

### 2. Información Incompleta (RN-006 a RN-010)

- **RN-006:** El gestor puede devolver un reporte si no permite comprender o evaluar la incidencia.
- **RN-007:** La solicitud de aclaración debe indicar qué información falta.
- **RN-008:** Mientras se espera la información, el estado es Pendiente de información (E02).
- **RN-009:** Al recibir respuesta, vuelve a revisión (E03).
- **RN-010:** La falta de respuesta se gestiona según el procedimiento y el plazo institucional definido (5 días hábiles).

### 3. Duplicidad (RN-011 a RN-015)

- **RN-011:** Se identifican posibles duplicados usando criterios como ubicación, categoría, descripción y estado.
- **RN-012:** Una posible duplicidad no rechaza automáticamente el reporte.
- **RN-013:** Un usuario autorizado confirma si se trata de la misma incidencia.
- **RN-014:** Si se confirma, el reporte nuevo se vincula a la incidencia principal y conserva su origen.
- **RN-015:** Los reportes relacionados permiten consultar la incidencia principal.

### 4. Riesgo y Prioridad (RN-016 a RN-020)

- **RN-016:** Toda incidencia se evalúa para determinar si requiere atención urgente.
- **RN-017:** Ante riesgo inmediato se activa el protocolo de seguridad sin esperar el flujo normal.
- **RN-018:** Se registra evaluación, resultado, responsable y acciones adoptadas.
- **RN-019:** La prioridad se determina con criterios definidos por la institución (Matriz ITIL).
- **RN-020:** Los cambios de prioridad registran motivo y usuario responsable.

### 5. Asignación y Diagnóstico (RN-021 a RN-025)

- **RN-021:** Una incidencia validada que requiere mantenimiento debe tener responsable antes de iniciar la intervención.
- **RN-022:** La inspección registra hallazgos relevantes en sitio.
- **RN-023:** El diagnóstico describe el problema y la intervención propuesta, según corresponda.
- **RN-024:** Si no se confirma la incidencia, se registra justificación y se comunica el resultado.
- **RN-025:** La reasignación conserva responsable anterior, nuevo responsable, fecha y motivo.

### 6. Recursos y Autorizaciones (RN-026 a RN-031)

- **RN-026:** Si faltan recursos, se registra la necesidad técnica.
- **RN-027:** Las solicitudes sujetas a autorización identifican el recurso o decisión requerida.
- **RN-028:** La decisión registra resultado, fecha, responsable y justificación cuando corresponda.
- **RN-029:** Una intervención que requiere autorización previa no comienza sin aprobación, salvo protocolo de emergencia autorizado.
- **RN-030:** Si faltan recursos, se mantiene un estado que permita documentar y seguir la situación (E08 o E09).
- **RN-031:** La suspensión definitiva o imposibilidad de atención registra causa y comunicación correspondiente.

### 7. Ejecución y Verificación (RN-032 a RN-037)

- **RN-032:** Toda intervención ejecutada registra actividades realizadas y horas hombre.
- **RN-033:** Las evidencias obligatorias se adjuntan antes de solicitar verificación final.
- **RN-034:** El verificador registra el resultado formal de la evaluación técnica.
- **RN-035:** Si se detectan defectos, se registra el motivo del rechazo y la corrección requerida.
- **RN-036:** Una intervención rechazada vuelve a planificación o ejecución según el procedimiento (E13 En corrección).
- **RN-037:** No se cierra la incidencia con correcciones o verificaciones obligatorias pendientes.

### 8. Cierre y Conformidad (RN-038 a RN-042)

- **RN-038:** El cierre cumple las condiciones de aceptación de la incidencia al 100%.
- **RN-039:** El cierre registra fecha, responsable y resultado final alcanzado.
- **RN-040:** Si se requiere confirmación de usuario o supervisor, se registra antes del cierre (E14 Pendiente de confirmación).
- **RN-041:** Si no se requiere confirmación, puede cerrarse tras superar las verificaciones obligatorias.
- **RN-042:** La incidencia cerrada conserva inalterable su historial y evidencias asociadas.

---

## D07: Catálogo de Estados y Matriz de Transiciones

### 1. Los 18 Estados del Ciclo de Vida

| Código | Estado | Categoría Jira | Significado Operativo |
| --- | --- | --- | --- |
| E01 | Registrada | To Do | Creada por el usuario, pendiente de revisión inicial. |
| E02 | Pendiente de información | In Progress | Devuelta al solicitante por datos o fotos faltantes. |
| E03 | En revisión | In Progress | El gestor revisa procedencia técnica y duplicados. |
| E04 | En clasificación | In Progress | Determinación de categoría y prioridad ITIL. |
| E05 | Pendiente de asignación | To Do | Validada formalmente; requiere asignación de cuadrilla. |
| E06 | Pendiente de inspección | In Progress | Técnico designado en ruta para inspección física. |
| E07 | En diagnóstico | In Progress | Determinación de causa raíz, alcance y materiales. |
| E08 | Pendiente de autorización | In Progress | Requiere decisión presupuestal administrativa. |
| E09 | Pendiente de recursos | In Progress | En espera de insumos o repuestos en almacén. |
| E10 | Programada | To Do | Intervención con fecha y cuadrilla agendadas. |
| E11 | En atención | In Progress | Ejecución física de mantenimiento en sitio. |
| E12 | Pendiente de verificación | In Progress | Trabajo finalizado; pendiente de peritaje por R06. |
| E13 | En corrección | In Progress | Rechazada por defectos de calidad; requiere retrabajo. |
| E14 | Pendiente de confirmación | In Progress | Verificada técnicamente; esperando visto bueno de R01. |
| E15 | Cerrada | Done | Finalizada con conformidad de todas las partes. |
| E16 | No procedente | Done | Descartada por no corresponder a planta física. |
| E17 | Cancelada | Done | Anulada con causa justificada (duplicidad, desistimiento). |
| E18 | Suspendida | In Progress | Atención detenida temporalmente por fuerza mayor. |

### 2. Matriz de Transiciones y Condiciones de Negocio

| Estado Origen | Condición o Acción | Estado Destino | Rol Autorizado |
| --- | --- | --- | --- |
| E01 Registrada | Se inicia revisión | E03 En revisión | R02 Gestor |
| E03 En revisión | Falta información | E02 Pendiente de información | R02 Gestor |
| E02 Pendiente de información | Se recibe respuesta | E03 En revisión | R01 Reportante |
| E02 Pendiente de información | Caducidad de plazo (5 días hábiles) | E17 Cancelada | Sistema / R02 |
| E03 En revisión | Información completa | E04 En clasificación | R02 Gestor |
| E03 En revisión | No corresponde a infraestructura | E16 No procedente | R02 Gestor |
| E04 En clasificación | Validación finalizada | E05 Pendiente de asignación | R02 Gestor |
| E05 Pendiente de asignación | Se asigna responsable (WIP limit OK) | E06 Pendiente de inspección | R03 Coordinador |
| E06 Pendiente de inspección | Comienza inspección en sitio | E07 En diagnóstico | R04 Técnico |
| E07 En diagnóstico | Requiere autorización de compra | E08 Pendiente de autorización | R03 Coordinador |
| E07 En diagnóstico | Faltan recursos en almacén | E09 Pendiente de recursos | R03 Coordinador |
| E07 En diagnóstico | Intervención viable y autorizada | E10 Programada | R03 Coordinador |
| E08 Pendiente de autorización | Aprobada; recursos disponibles | E10 Programada | R05 Autorizador |
| E08 Pendiente de autorización | Aprobada; compra en trámite | E09 Pendiente de recursos | R05 Autorizador |
| E09 Pendiente de recursos | Recursos disponibles en almacén | E10 Programada | R03 Coordinador |
| E10 Programada | Comienza la intervención física | E11 En atención | R04 Técnico |
| E11 En atención | Trabajo registrado con fotos finales | E12 Pendiente de verificación | R04 Técnico |
| E12 Pendiente de verificación | Resultado no conforme (defectos) | E13 En corrección | R06 Verificador |
| E13 En corrección | Se planifica corrección | E10 Programada | R03 Coordinador |
| E12 Pendiente de verificación | Resultado conforme; confirmación requerida | E14 Pendiente de confirmación | R06 Verificador |
| E12 Pendiente de verificación | Resultado conforme; no requiere confirmación | E15 Cerrada | R06 Verificador |
| E14 Pendiente de confirmación | Se confirma la solución satisfactoria | E15 Cerrada | R01 Reportante |
| E14 Pendiente de confirmación | Se rechaza justificadamente | E13 En corrección | R01 Reportante |
