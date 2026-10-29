# 06\-Calidad y Entrega — Plan de Pruebas, CI/CD y Despliegue \(D16, D17\)

# 06-Calidad y Entrega: Estrategia de Pruebas, CI/CD y Despliegue

Directrices de aseguramiento de calidad de software, pruebas automatizadas y automatización del ciclo de vida DevOps en PRAXIS (documentos D16 y D17).

---

## D16: Estrategia y Plan de Pruebas

### 1. Pirámide de Pruebas y Cobertura

- **Pruebas Unitarias (70%):** Verificación aislada de entidades de dominio, transiciones de la máquina de estados y las 42 reglas de negocio (xUnit / Jest). Cobertura mínima obligatoria del 80%.
- **Pruebas de Integración (20%):** Validación de la interacción con base de datos real (mediante Testcontainers PostgreSQL), transacciones atómicas de auditoría y endpoints de API con WebApplicationFactory.
- **Pruebas Funcionales y E2E (10%):** Automatización de los 5 flujos críticos de punta a punta con Playwright / Cypress, simulando la experiencia de cada rol desde la radicación hasta el peritaje de calidad.

### 2. Pruebas Especializadas

| Tipo de Prueba | Objetivo Operativo | Criterio de Aceptación |
| --- | --- | --- |
| **Pruebas de Reglas de Negocio** | Comprobar RN-005, RN-010, RN-021, RN-035, RN-037 y RN-040. | Bloqueo automático de radicaciones sin foto cuando la categoría lo exija; bloqueo de cierre sin peritaje de calidad. |
| **Pruebas de Permisos (RBAC)** | Comprobar que ningún rol ejecute transiciones no autorizadas. | Respuesta HTTP 403 Forbidden al intentar transicionar estados ajenos al perfil operativo del usuario. |
| **Pruebas de Inmutabilidad** | Validar la protección append-only de la bitácora. | Rechazo con error de base de datos ante sentencias UPDATE o DELETE sobre la tabla {{EventosAuditoria}}. |
| **Pruebas de Carga y Rendimiento** | Medir latencias en consultas complejas con alta concurrencia. | k6 / Locust simulando 500 peticiones/segundo con latencia percentil 95 (p95) menor a 500 ms. |

---

## D17: Plan de Desarrollo, CI/CD y Despliegue

### 1. Estrategia de Ramas (Git Flow)

- **main:** Código en producción 100% estable, protegido contra commits directos; solo recibe fusiones vía Pull Request aprobadas desde release o hotfix.
- **develop:** Rama de integración continua; consolida las características del sprint en curso.
- **feature/\*:** Ramas de trabajo vinculadas a historias de usuario específicas de Jira (ej. feature/KAN-131-registro-jerarquico).
- **release/\*:** Ramas de congelamiento de alcance para pruebas de regresión y validación de calidad antes del paso a producción.
- **hotfix/\*:** Corrección urgente de defectos críticos identificados en producción.

### 2. Pipeline de Integración y Despliegue Continuo (CI/CD)

1. **Lint & Static Analysis:** Ejecución de linter (ESLint / dotnet format) y análisis de seguridad estática con SonarQube (Quality Gate estricto).
2. **Automated Testing:** Ejecución de suites unitarias y de integración en contenedores efímeros; generación de reportes de cobertura.
3. **Security Scan:** Escaneo de dependencias (OWASP Dependency-Check / Trivy) para prevenir vulnerabilidades conocidas en librerías y contenedores.
4. **Build & Containerize:** Empaquetado de imágenes Docker multi-stage optimizadas y publicación en registro privado institucional.
5. **Continuous Deployment:** Despliegue automatizado con Helm / ArgoCD en clúster Kubernetes aplicando estrategia Rolling Update con cero tiempo de inactividad (Zero-Downtime).

### 3. Matriz de Entornos

| Entorno | Propósito | Base de Datos | Disponibilidad |
| --- | --- | --- | --- |
| **Desarrollo (Dev)** | Pruebas de integración de ramas activas. | Instancia aislada con datos sintéticos generados por Bogus/Faker. | Horario laboral |
| **Staging / QA** | Pruebas de regresión, homologación de usuario y validación de sprint. | Espejo anonimizado de datos de producción. | 24/7 |
| **Producción (Prod)** | Operación real para toda la comunidad universitaria. | Clúster PostgreSQL de alta disponibilidad con réplica de solo lectura. | 99.5% |
