# 01\-Contexto — Definición y Análisis del Problema \(D01, D02\)

# 01-Contexto: Definición del Proyecto y Análisis del Problema

Documentación fundacional del proyecto **PRAXIS** correspondiente a los documentos D01 y D02 según la metodología de gestión documental institucional.

---

## D01: Acta de Inicio y Definición del Proyecto

### 1. Identificación General

| Campo | Descripción Formal |
| --- | --- |
| **Nombre Oficial** | Plataforma de gestión y trazabilidad de incidencias de infraestructura física universitaria (PRAXIS) |
| **Organización / Entorno** | Universidad ECCI — Dirección de Planta Física e Infraestructura |
| **Versión de Guía Base** | 0.1 Formalizada |
| **Modelo Metodológico** | ISO/IEC/IEEE 29148 / Atlassian Agile Framework |

### 2. Propósito y Justificación

Desarrollar una plataforma de software para gestionar integralmente incidencias de infraestructura física de una institución universitaria, desde su reporte inicial hasta la ejecución, verificación y cierre de las actividades de mantenimiento correspondientes.

La plataforma centraliza la información de las incidencias y permite registrar revisiones, validaciones, asignaciones, diagnósticos, planificación, recursos, intervenciones, evidencias, decisiones y resultados en un esquema auditable e inmutable.

### 3. Objetivos del Proyecto

#### 3.1 Objetivo General

Desarrollar una plataforma de software que permita gestionar integralmente las incidencias de infraestructura física universitaria mediante la digitalización de los procesos de reporte, validación, planificación, atención y cierre, manteniendo la trazabilidad de las actividades y decisiones asociadas.

#### 3.2 Objetivos Específicos

- **Objetivo A:** Digitalizar el registro y la consulta ciudadana/universitaria de incidencias de planta física.
- **Objetivo B:** Gestionar la revisión, validación, clasificación y asignación balanceada de los reportes.
- **Objetivo C:** Documentar diagnósticos técnicos de campo, recursos, autorizaciones presupuestales y planificación de intervenciones.
- **Objetivo D:** Registrar trabajos realizados en campo, insumos consumidos, evidencias fotográficas y resultados de verificación de calidad.
- **Objetivo E:** Conservar un historial inmutable de acontecimientos bajo el estándar append-only para facilitar el seguimiento operativo y la auditoría forense.

### 4. Resultado Esperado

Disponer de una herramienta centralizada que permita conocer el estado en tiempo real de cada incidencia y reconstruir con absoluta fidelidad su evolución, responsables asignados, decisiones adoptadas y resultado técnico final.

---

## D02: Análisis del Problema Operativo (AS-IS)

### 1. Diagnóstico de la Situación Actual

La gestión de incidencias de infraestructura física comprende actividades que abarcan desde la identificación y el reporte de una novedad hasta su revisión, validación, asignación, atención y cierre.

Cuando el proceso se gestiona de forma manual y fragmentada (mediante llamadas telefónicas, correos electrónicos informales y formatos físicos de papel), se generan severos problemas operativos:

- **Pérdida de Información:** Reportes verbales que se extravían sin radicado oficial ni responsables trazables.
- **Duplicidad Incontrolada:** Múltiples miembros de la comunidad reportan el mismo daño físico (ej. daño en tubería de baño), originando dispersión de esfuerzos y falsas estadísticas.
- **Tiempos Muertos sin Registro:** Demoras en compras de materiales o solicitudes de repuestos que quedan en el limbo, distorsionando los tiempos de respuesta del equipo técnico.
- **Cierres Ficticios:** Obras cerradas administrativamente sin verificación física de calidad independiente, lo que produce fallas recurrentes y sobrecostos.
- **Inexistencia de Auditoría Forense:** Imposibilidad de determinar qué usuario autorizó un gasto o modificó la prioridad de una intervención.

### 2. Necesidad Identificada

Contar con una plataforma que permita gestionar digitalmente las incidencias de infraestructura física, desde el registro hasta el cierre, conservando información fidedigna sobre su evolución, responsables, decisiones, actividades y resultados.

### 3. Dimensiones de Investigación Operativa

| Dimensión Crítica | Pregunta de Investigación | Solución Sistémica en PRAXIS |
| --- | --- | --- |
| **Dificultades Concretas** | ¿Qué obstáculos bloquean el flujo actual? | Flujo estructurado de 18 estados con compuertas lógicas y pausas de SLA justificadas. |
| **Almacenamiento y Datos** | ¿Dónde se guarda hoy la información y qué datos se capturan? | Base de datos relacional con esquema normalizado, árbol jerárquico de sedes y repositorio S3 de evidencias fotográficas. |
| **Perfiles Operativos** | ¿Qué roles participan en cada etapa? | Definición formal de 7 roles (R01 a R07) con matriz de responsabilidades RACI. |
| **Consulta de Información** | ¿Qué datos requieren consultar los usuarios? | Consola unificada con filtros combinados, vistas diferenciadas por rol y línea de tiempo pública del ticket. |
| **Métricas de Éxito** | ¿Qué indicadores medirán el impacto del sistema? | Tiempo medio de resolución (MTTR), cumplimiento de SLA por criticidad y tasa de rechazo en verificación de calidad. |
