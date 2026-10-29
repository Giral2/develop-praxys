# PRAXIS — Documentación Oficial y Arquitectura del Sistema

# PRAXIS: Portal Maestro de Documentación y Arquitectura

Bienvenido al espacio oficial de documentación técnica, funcional y metodológica del proyecto **PRAXIS** (*Plataforma de gestión y trazabilidad de incidencias de infraestructura física universitaria*), desarrollado bajo los estándares **Atlassian Jira / Confluence Cloud** e **ISO/IEC/IEEE 29148**.

---

## 1. Resumen Ejecutivo del Proyecto

PRAXIS es una solución institucional integral orientada a resolver las deficiencias históricas de la gestión manual de mantenimiento en planta física universitaria (reportes verbales, notas en papel, compras no controladas y ausencia de auditoría). La plataforma digitaliza la totalidad del ciclo de vida de una incidencia a través de **18 estados operativos (E01 a E18)**, gobernados por **7 roles institucionales (R01 a R07)** y **42 reglas de negocio estrictas (RN-001 a RN-042)**.

---

## 2. Estructura Oficial de Navegación Documental (D01 a D17)

Este espacio de Confluence está estructurado en 6 carpetas oficiales que consolidan los 17 artefactos documentales del proyecto:

| Módulo Oficial | Documentos Comprendidos | Propósito Principal |
| --- | --- | --- |
| **01-Contexto** | D01 (Acta de inicio), D02 (Análisis del problema) | Justificación, objetivos estratégicos, diagnóstico del proceso manual AS-IS y necesidades. |
| **02-Negocio** | D03 (Roles y RACI), D04 (AS-IS), D05 (TO-BE), D06 (Reglas RN-001 a RN-042), D07 (Estados E01 a E18) | Modelo operativo digital, matriz de responsabilidades, catálogo de reglas invariables y máquina de estados. |
| **03-Requisitos** | D08 (Requisitos funcionales y no funcionales), D09 (Matriz RBAC), D10 (Trazabilidad y auditoría) | Especificación formal de ingeniería, matriz de permisos de usuario y arquitectura append-only inmutable. |
| **04-Producto** | D11 (Alcance y MVP), D12 (Backlog maestro de 11 Épicas) | Límites de entrega del MVP, Definition of Done y trazabilidad de las 41 Historias de Usuario con 164 subtareas en Jira. |
| **05-Diseño** | D13 (Diseño UX/UI), D14 (Modelo de datos relacional), D15 (Arquitectura de software) | Wireflows, layout responsive, diccionario de tablas SQL, índices y Clean Architecture en capas. |
| **06-Calidad y Entrega** | D16 (Plan de pruebas y calidad), D17 (CI/CD y despliegue) | Pirámide de pruebas automatizadas, casos de prueba para RNs, pipelines de entrega continua y despliegue en Kubernetes. |

### Páginas del Espacio Documental

- [**01-Contexto — Definición y Análisis del Problema (D01, D02)**](/spaces/P/pages/11042817/01-Contexto+Definici+n+y+An+lisis+del+Problema+D01+D02)
- [**02-Negocio — Roles, RACI, Procesos, Reglas y Estados (D03 - D07)**](/spaces/P/pages/11075585/02-Negocio+Roles+RACI+Procesos+Reglas+y+Estados+D03+-+D07)
- [**03-Requisitos — Requisitos del Sistema, Permisos y Auditoría (D08 - D10)**](/spaces/P/pages/10878998/03-Requisitos+Requisitos+del+Sistema+Permisos+y+Auditor+a+D08+-+D10)
- [**04-Producto — MVP, Trazabilidad y Backlog Maestro (D11, D12)**](/spaces/P/pages/10420241/04-Producto+MVP+Trazabilidad+y+Backlog+Maestro+D11+D12)
- [**05-Diseño — Experiencia UX/UI, Modelo de Datos y Arquitectura (D13 - D15)**](/spaces/P/pages/11108353/05-Dise+o+Experiencia+UX+UI+Modelo+de+Datos+y+Arquitectura+D13+-+D15)
- [**06-Calidad y Entrega — Plan de Pruebas, CI/CD y Despliegue (D16, D17)**](/spaces/P/pages/10813442/06-Calidad+y+Entrega+Plan+de+Pruebas+CI+CD+y+Despliegue+D16+D17)

---

## 3. Gobernanza e Integración con Jira Software

- **Proyecto en Jira:** `PraxTeam` (Clave: `KAN` / `PRX`)
- **Épicas Maestras Mapeadas:** 11 Épicas preexistentes (E01 a E11) vinculadas bidireccionalmente con los requisitos y documentación funcional.
- **Auditoría Append-Only:** Los cambios de estado y dictámenes de calidad se sincronizan de forma inmutable preservando autor, timestamp UTC y justificación técnica.

---

## 4. Métricas Clave de Operación Institucional

- **MTTR (Mean Time to Repair):** Medición continua de horas hábiles reales desde la radicación hasta el dictamen de verificación conforme.
- **Cumplimiento de ANS / SLA:** Semáforo visual en tiempo real (Verde / Amarillo / Rojo) según la criticidad asignada en la matriz ITIL.
- **Tasa de Calidad en Primera Entrega:** Porcentaje de intervenciones técnicas aprobadas por el verificador (R06) en su primera inspección sin devoluciones a E13.
