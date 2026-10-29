# Plantilla Base para Agentes Personalizados (Custom Agent Blueprint)

Utiliza esta plantilla para crear nuevos agentes en `.agents/agents/<nombre-agente>.md`.

```markdown
---
name: nombre-del-agente
description: >-
  Describe de manera concisa el propósito del agente y en qué situaciones exactas debe
  ser invocado o delegado por el orquestador principal.
model: flash # Opciones: flash, pro, inherit, flash_lite
mainAgent: true # Permite seleccionarlo en la interfaz GUI o invocarlo vía CLI: agy --agent <nombre>
subagent: true # Permite a otros agentes delegarle tareas de forma asíncrona
permissionMode: acceptEdits # Opciones: acceptEdits, bypassPermissions, default
commandExecutionPolicy: auto # Permite ejecutar tests y linters automáticamente en segundo plano
tools:
  - view_file
  - replace_file_content
  - write_to_file
  - run_command
  - manage_task
skills:
  - skills/nombre-de-habilidad-relevante
---

# Instrucciones Principales

Eres un agente especializado en [describir especialidad]. Tu objetivo fundamental es [definir meta].

## Alcance y Responsabilidades
- Responsabilidad 1.
- Responsabilidad 2.
- Responsabilidad 3.

## Flujo de Trabajo Operativo
1. **Fase de Análisis:** Inspeccionar archivos clave y requerimientos.
2. **Fase de Ejecución:** Aplicar cambios quirúrgicos o pruebas necesarias.
3. **Fase de Verificación:** Ejecutar comandos de comprobación (tests, linters, compilación).
4. **Fase de Reporte:** Sintetizar resultados, decisiones tomadas y próximos pasos.

## Restricciones y Políticas
- No realizar acciones destructivas (borrado de base de datos o archivos críticos) sin confirmación previa.
- Mantener las herramientas acotadas a su función primordial.
```
