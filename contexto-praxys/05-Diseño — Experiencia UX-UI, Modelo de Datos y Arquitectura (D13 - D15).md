# 05\-Diseño — Experiencia UX/UI, Modelo de Datos y Arquitectura \(D13 \- D15\)

# 05-Diseño: Experiencia UX/UI, Modelo de Datos y Arquitectura de Software

Especificaciones de la interfaz de usuario, arquitectura de bases de datos y diseño técnico del backend en PRAXIS (documentos D13, D14 y D15).

---

## D13: Diseño de Experiencia UX/UI

### 1. Recorridos de Usuario Principales (Wireflows)

- **Recorrido 1 (R01 Reportante):** Login/Anónimo -\> Formulario /reportes/nuevo -\> Selección cascada Sede/Bloque/Piso/Espacio -\> Selección de Categoría -\> Dropzone con previsualización de foto -\> Envío y generación de radicado #TKT-AAAA-####.
- **Recorrido 2 (R02 Gestor):** Bandeja /triaje -\> Filtrado de tickets nuevos E01 -\> Apertura de expediente -\> Visualización de posibles duplicados sugeridos -\> Validación o devolución con modal de aclaración.
- **Recorrido 3 (R03 Coordinador):** Vista /coordinacion/asignar -\> Inspección de tickets validados E05 -\> Tablero Kanban con badges de capacidad por técnico -\> Arrastre y asignación con validación de WIP limit.
- **Recorrido 4 (R04 Técnico):** Terminal móvil /atencion -\> Inspección de asignaciones activas -\> Registro de diagnóstico y causa raíz -\> Solicitud de repuestos -\> Marcado de inicio/fin y carga de fotos de trabajo terminado.
- **Recorrido 5 (R06 Verificador):** Módulo /calidad/verificacion -\> Lista de órdenes finalizadas E12 -\> Checklist de peritaje en sitio -\> Emisión de dictamen de aprobación o reporte de defectos para retrabajo.

### 2. Layout Shell y Directrices de Diseño

- **Estructura Global:** Topbar institucional con notificaciones en tiempo real, Sidebar colapsable con navegación según perfil RBAC, y contenedor principal fluido con padding estándar de 24px.
- **Accesibilidad:** Contraste de colores certificado WCAG 2.1 AA, etiquetas aria-label en controles interactivos y soporte completo de navegación por teclado.
- **Estados de Carga y Vacíos:** Skeletons de carga en grillas de datos y estados vacíos ilustrativos con botones de acción primaria en caso de cero resultados.

---

## D14: Modelo de Datos Relacional y Diccionario de Tablas

### 1. Principales Tablas del Esquema

| Tabla | Clave Primaria | Descripción y Relaciones Clave |
| --- | --- | --- |
| **Sedes** | Id (INT) | Sedes o campus universitarios (Sede Central, Sede Norte, etc.). |
| **Edificios** | Id (INT) | Bloques o edificios físicos. FK a Sedes. |
| **Pisos** | Id (INT) | Niveles o plantas dentro de un bloque. FK a Edificios. |
| **EspaciosFisicos** | Id (INT) | Aulas, laboratorios, oficinas, baños. FK a Pisos. Constraint UNIQUE(PisoId, CodigoEspacio). |
| **CategoriasIncidencia** | Id (INT) | Tipologías de daño (Hidrosanitario, Eléctrico, etc.). Columnas: ExigeEvidenciaFotografica (bool), RequiereConfirmacionCierre (bool). |
| **Incidencias** | Id (UUID) | Entidad central del sistema. Código #TKT-AAAA-####. FKs a EspacioFisicoId, CategoriaId, EstadoId, UsuarioCreadorId, TecnicoAsignadoId. |
| **EventosAuditoria** | Id (UUID) | Bitácora inmutable append-only. Registra cada transición de estado y decisión con usuario y timestamp UTC. |
| **OrdenesTrabajo** | Id (UUID) | Datos operativos de ejecución. FK a Incidencias. Registra horas hombre, fecha inicio, fecha fin y observaciones técnicas. |
| **SolicitudesMateriales** | Id (UUID) | Requisiciones de compras de insumos fuera de stock. FKs a Incidencias y UsuarioAutorizadorId. |
| **DictamenesVerificacion** | Id (UUID) | Actas de peritaje técnico de calidad. FKs a Incidencias y VerificadorId. Columna Conforme (bool). |

---

## D15: Arquitectura de Software y Servicios

### 1. Patrón Arquitectónico (Clean Architecture)

```
┌────────────────────────────────────────────────────────┐
│                   Presentation Layer                   │
│   React / Vite Web UI  │  Mobile App  │  REST API      │
└───────────────────────────┬────────────────────────────┘
                            │
┌───────────────────────────▼────────────────────────────┐
│                    Application Layer                   │
│   Use Cases  │  CQRS (MediatR)  │  FluentValidation   │
└───────────────────────────┬────────────────────────────┘
                            │
┌───────────────────────────▼────────────────────────────┐
│                      Domain Layer                      │
│   Entities  │  Value Objects  │  State Machine (RNs)  │
└───────────────────────────┬────────────────────────────┘
                            │
┌───────────────────────────▼────────────────────────────┐
│                  Infrastructure Layer                  │
│   PostgreSQL / EF Core  │  Redis Cache  │  S3 Storage  │
└────────────────────────────────────────────────────────┘
```

### 2. Decisiones Técnicas Críticas

- **Autenticación y Sesiones:** Integración con directorio activo universitario mediante OAuth2 / OIDC; emisión de tokens JWT de corta duración (15 min) y Refresh Tokens revocables en base de datos.
- **Caché en Memoria y Distribuido:** Almacenamiento en caché de catálogos estáticos (árbol de sedes, categorías, matriz ITIL) con invalidación reactiva por eventos al modificarse en administración.
- **Manejo de Errores y Resiliencia:** Middleware global de excepciones retornando RFC 7807 (Problem Details) y políticas de reintento exponencial con Polly en llamadas externas.
