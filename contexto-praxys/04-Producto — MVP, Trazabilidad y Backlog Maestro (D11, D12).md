# 04\-Producto — MVP, Trazabilidad y Backlog Maestro \(D11, D12\)

# 04-Producto: MVP, Trazabilidad y Backlog Maestro de 11 Épicas

Definición del Producto Mínimo Viable (MVP), criterios de finalización (DoD) y desglose del backlog maestro en Jira/Confluence (documentos D11 y D12).

---

## D11: Alcance y Definición del MVP

### 1. Capacidades Propuestas para el MVP

El MVP de PRAXIS no es un simple formulario de captura; debe permitir probar un **recorrido completo de una incidencia punta a punta**, desde el reporte inicial hasta la verificación física y el cierre formal:

- **Usuarios y Permisos:** Inicio de sesión con autenticación unificada y segregación de vistas por rol.
- **Registro:** Creación de incidencias con árbol jerárquico de 4 niveles y subida de fotos condicionales.
- **Validación:** Revisión de datos, devolución por aclaración y motor de detección de duplicados.
- **Clasificación y Asignación:** Tipificación del daño, cálculo de prioridad ITIL y asignación con control de capacidad.
- **Diagnóstico:** Inspección en sitio, diagnóstico de causa raíz y formulación de plan de trabajo.
- **Recursos:** Requisición de insumos y registro de autorización con justificación administrativa.
- **Programación y Ejecución:** Agendamiento de cuadrilla y registro de bitácora técnica con fotos finales.
- **Verificación y Cierre:** Inspección técnica independiente, dictamen de calidad y confirmación de satisfacción.
- **Trazabilidad:** Línea de tiempo inmutable con registro de todas las transiciones y autores.

### 2. Definición de Terminado (Definition of Done - DoD)

1. La funcionalidad satisface al 100% los criterios de aceptación en formato Gherkin (Dado que / Cuando / Entonces).
2. Las validaciones de permisos RBAC y reglas de negocio asociadas (RN) están implementadas y probadas.
3. La cobertura de pruebas unitarias supera el 80% en lógica de negocio y las pruebas de integración pasan en verde.
4. Cada transición de estado genera su correspondiente registro inmutable en {{EventosAuditoria}}.
5. El código fuente supera el análisis estático en SonarQube sin vulnerabilidades ni olores de código bloqueantes.
6. La documentación de API (OpenAPI/Swagger) y manuales de usuario están actualizados.

---

## D12: Backlog Maestro de las 11 Épicas (41 Historias y 164 Subtareas)

| Código Épica | Clave Jira | Nombre de la Épica | Historias | Subtareas Técnicas | Módulos Principales |
| --- | --- | --- | --- | --- | --- |
| **E01** | KAN-104 | Portal público y registro de incidencias | 5 HUs | 20 Subtasks | Registro jerárquico, visor de estado, línea de tiempo pública, alertas. |
| **E02** | KAN-105 | Triaje, validación y priorización técnica | 3 HUs | 12 Subtasks | Bandeja de triaje, motor de aclaraciones, duplicados y matriz ITIL. |
| **E03** | KAN-106 | Asignación, gestión y despacho de cuadrillas | 5 HUs | 20 Subtasks | Asignación con WIP limits, calendario, reasignaciones y balanceo de carga. |
| **E04** | KAN-98 | Diagnóstico en campo y solicitud de materiales | 4 HUs | 16 Subtasks | Inspección en sitio, causa raíz, solicitud de repuestos y descarte de falsos daños. |
| **E05** | KAN-99 | Aprobación de compras y control de almacén | 3 HUs | 12 Subtasks | Autorización financiera de compras, despacho de almacén y control de esperas. |
| **E06** | KAN-100 | Ejecución técnica y bitácora de mantenimiento | 4 HUs | 16 Subtasks | Bitácora de campo, registro de horas/materiales, fotos finales y aviso de terminación. |
| **E07** | KAN-101 | Cierre operativo, control de calidad y reaperturas | 3 HUs | 12 Subtasks | Verificación técnica independiente (R06), confirmación R01 y acta de cierre. |
| **E08** | KAN-102 | Gestión de reclamos y garantías con contratistas | 3 HUs | 12 Subtasks | Reapertura por fallas en garantía (30 días), control de reincidencias y pólizas. |
| **E09** | KAN-103 | Módulo de acceso, perfiles y seguridad institucional | 4 HUs | 16 Subtasks | Autenticación SSO, gestión RBAC, tokens JWT y auditoría de sesiones. |
| **E10** | KAN-107 | Consola unificada de seguimiento y analítica de datos | 4 HUs | 16 Subtasks | Consola general multicriterio, semáforos SLA, motor inmutable y tablero MTTR. |
| **E11** | KAN-108 | Administración de la plataforma | 3 HUs | 12 Subtasks | Árbol físico de sedes/espacios, tipologías de daño, matriz ITIL y parámetros del sistema. |
| **TOTAL CONSOLIDADO** | **11 Épicas Maestras** | **41 HUs** | **164 Subtasks** | **100% Sincronizado en Jira Cloud** |  |
