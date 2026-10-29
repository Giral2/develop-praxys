# PRAXIS — Plataforma de Gestión y Trazabilidad de Infraestructura Universitaria

Sistema web integral y ecosistema de agentes IA para la gestión, seguimiento, trazabilidad y resolución de incidencias en la infraestructura física de campus universitarios.

---

## 🌟 Características Principales

- **Gestión de Incidencias de Infraestructura:** Registro, clasificación, asignación y seguimiento de incidencias físicas en tiempo real.
- **Flujo de Estados:** Trazabilidad completa con matriz de estados de ciclo de vida.
- **Interfaz Moderna y Responsiva:** Implementada con HTML5 semántico, Tailwind CSS y diseño adaptado a modo claro/oscuro.
- **Ecosistema de Agentes IA Integrado:** Estructura modular en `.agents/` configurada para Google Antigravity (Orquestador, Frontend, Backend y QA).

---

## 📁 Estructura del Repositorio

```plaintext
develop-praxys/
├── .agents/
│   ├── agents/
│   │   ├── agente-orquestador.md  # Tech Lead / Coordinación
│   │   ├── agente-frontend.md      # UI / UX e interactividad
│   │   ├── agente-backend.md       # API / Datos y reglas
│   │   ├── agente-qa.md            # Control de calidad y pruebas
│   │   └── README.md               # Guía del equipo de agentes
│   └── skills/
│       └── agentes-personalizados/ # Habilidades y plantillas
├── index.html                      # Aplicación web frontend (Single-Page App)
├── .gitignore
└── README.md
```

---

## 🚀 Despliegue en GitHub Pages

Para publicar este proyecto como sitio web en vivo a través de GitHub:

1. Ve a los **Settings** (Configuración) de tu repositorio en GitHub.
2. En la sección lateral izquierda, selecciona **Pages**.
3. En **Build and deployment > Source**, elige **Deploy from a branch**.
4. Selecciona la rama `main` (o `master`) y la carpeta `/ (root)`.
5. Haz clic en **Save**. En unos minutos tu sitio estará en línea en `https://<tu-usuario>.github.io/<nombre-repo>/`.

---

## 💻 Ejecución Local

Para visualizar la plataforma localmente, simplemente abre `index.html` en tu navegador o levanta un servidor estático local:

```bash
# Con Python
python -m http.server 8000

# O con npx serve
npx serve .
```
