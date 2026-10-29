# 03\-Requisitos — Requisitos del Sistema, Permisos y Auditoría \(D08 \- D10\)

# 03-Requisitos: Requisitos del Sistema, Permisos y Auditoría Inmutable

Especificación de los requisitos funcionales, no funcionales, matriz de autorización RBAC y arquitectura de auditoría forense de PRAXIS (documentos D08, D09 y D10).

---

## D08: Requisitos del Sistema (ISO/IEC/IEEE 29148)

### 1. Requisitos Funcionales (RF-001 a RF-010)

| Identificador | Requisito Funcional | Reglas de Negocio Vinculadas |
| --- | --- | --- |
| **RF-001** | El sistema permitirá registrar una incidencia con los datos obligatorios definidos para su categoría y ubicación jerárquica de 4 niveles. | RN-001, RN-002, RN-003, RN-004, RN-005 |
| **RF-002** | El sistema permitirá solicitar información adicional al reportante, congelando el SLA y registrando la respuesta formalmente. | RN-006, RN-007, RN-008, RN-009, RN-010 |
| **RF-003** | El sistema identificará automáticamente posibles incidencias duplicadas mediante coincidencia espacial y temporal, vinculándolas a la principal tras confirmación humana. | RN-011, RN-012, RN-013, RN-014, RN-015 |
| **RF-004** | El sistema permitirá evaluar la criticidad, calcular la prioridad bajo la matriz ITIL (Impacto x Urgencia) y activar protocolos de seguridad ante emergencias. | RN-016, RN-017, RN-018, RN-019, RN-020 |
| **RF-005** | El sistema permitirá asignar técnicos u operarios respetando topes de carga simultánea (WIP limit) y preservando el historial de reasignaciones. | RN-021, RN-025 |
| **RF-006** | El sistema permitirá documentar diagnósticos en sitio, causas raíz, intervenciones propuestas y hallazgos técnicos. | RN-022, RN-023, RN-024, RN-032 |
| **RF-007** | El sistema gestionará solicitudes formales de compra de materiales y registrará resoluciones de autorización con firma digital del ordenador del gasto. | RN-026, RN-027, RN-028, RN-029, RN-030, RN-031 |
| **RF-008** | El sistema registrará los resultados de las inspecciones de verificación de calidad independientes con actas de conformidad o no conformidad. | RN-033, RN-034, RN-035, RN-036, RN-037 |
| **RF-009** | El sistema permitirá cerrar incidencias únicamente cuando se cumplan el 100% de los criterios de aceptación y las firmas requeridas. | RN-038, RN-039, RN-040, RN-041, RN-042 |
| **RF-010** | El sistema proveerá una línea de tiempo pública y una consola interna para consultar el historial completo de eventos según los permisos del usuario. | D10 Trazabilidad, RN-004, RN-042 |

### 2. Requisitos No Funcionales (RNF)

- **Seguridad:** Autenticación centralizada mediante OAuth2 / OpenID Connect, autorización basada en roles (RBAC) con tokens JWT firmados, y cifrado de datos en reposo (AES-256) y en tránsito (TLS 1.3).
- **Rendimiento:** Tiempos de respuesta p95 inferiores a 500 ms en consultas de consola con 100,000 registros y soporte de concurrencia para 2,000 usuarios activos simultáneos.
- **Disponibilidad:** Nivel de servicio del 99.5% en horario de operación académica y administrativa (6:00 a 22:00 horas).
- **Auditoría e Inmutabilidad:** Arquitectura append-only en la bitácora de eventos con revocación de privilegios UPDATE y DELETE en el motor de base de datos.
- **Usabilidad y Accesibilidad:** Cumplimiento de pautas WCAG 2.1 Nivel AA en las interfaces públicas de registro y consulta de tickets.
- **Respaldo y Recuperación:** RPO (Recovery Point Objective) inferior a 15 minutos y RTO (Recovery Time Objective) menor a 2 horas mediante copias continuas transaccionales.

---

## D09: Matriz de Roles y Permisos (RBAC)

| Módulo / Pantalla / Operación | R01 Reportante | R02 Gestor | R03 Coordinador | R04 Técnico | R05 Autorizador | R06 Verificador | R07 Admin |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Portal público: Crear ticket | Permitido | Permitido | Permitido | Permitido | Denegado | Denegado | Permitido |
| Mis Solicitudes: Ver propios | Permitido | Permitido | Permitido | Permitido | Permitido | Permitido | Permitido |
| Bandeja de Triaje (/triaje) | Denegado | Permitido | Permitido | Denegado | Denegado | Denegado | Permitido |
| Devolver ticket por aclaración | Denegado | Permitido | Permitido | Denegado | Denegado | Denegado | Permitido |
| Asignación de cuadrillas (/asignar) | Denegado | Denegado | Permitido | Denegado | Denegado | Denegado | Permitido |
| Bitácora técnica en sitio (/atencion) | Denegado | Denegado | Solo lectura | Permitido | Denegado | Denegado | Permitido |
| Aprobación de compras (/autorizaciones) | Denegado | Denegado | Solo lectura | Denegado | Permitido | Denegado | Permitido |
| Dictamen de calidad (/verificacion) | Denegado | Denegado | Solo lectura | Denegado | Denegado | Permitido | Permitido |
| Confirmar cierre de ticket (E14) | Permitido | Denegado | Denegado | Denegado | Denegado | Denegado | Permitido |
| Consola de operaciones (/consola) | Denegado | Permitido | Permitido | Solo asignadas | Permitido | Permitido | Permitido |
| Administración y catálogos (/admin) | Denegado | Denegado | Solo lectura | Denegado | Denegado | Denegado | Permitido |

---

## D10: Trazabilidad y Auditoría Inmutable

### 1. Los Cuatro Conceptos de Trazabilidad

1. **Datos Actuales:** Estado operativo vigente, prioridad asignada, responsable técnico y porcentaje de avance.
2. **Historial de Estados:** Registro secuencial y temporal de cada estado por el que ha transitado la incidencia.
3. **Historial de Actividades:** Bitácoras de inspección, horas de mano de obra reportadas, consumos de repuestos y comentarios operativos.
4. **Auditoría Forense:** Registro criptográficamente verificable y append-only de cada decisión, usuario responsable y evidencias asociadas.

### 2. Esquema del Evento de Auditoría

| Atributo | Tipo de Dato | Descripción y Propósito |
| --- | --- | --- |
| **EventoId** | UUID | Identificador único global del acontecimiento. |
| **IncidenciaId** | UUID | Llave foránea a la incidencia auditada. |
| **TipoEvento** | VARCHAR(50) | CREACION, CAMBIO\_ESTADO, ASIGNACION, DIAGNOSTICO, AUTORIZACION, DICTAMEN, CIERRE. |
| **FechaHora** | TIMESTAMP UTC | Momento exacto del registro emitido por el servidor. |
| **UsuarioId** | UUID | Identidad del usuario autenticado que ejecutó la acción. |
| **RolId** | VARCHAR(10) | Rol operativo bajo el cual se efectuó la operación (R01 a R07). |
| **EstadoAnteriorId** | VARCHAR(10) | Estado previo (E01 a E18) si aplica. |
| **EstadoNuevoId** | VARCHAR(10) | Estado resultante (E01 a E18) tras la acción. |
| **MotivoJustificacion** | TEXT | Explicación obligatoria en devoluciones, rechazos o cambios de prioridad. |
| **EvidenciasJson** | JSONB | Arreglo de hashes SHA-256, URIs de archivos adjuntos y metadatos. |
