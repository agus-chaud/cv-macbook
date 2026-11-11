# Docs y código propios, y tarea diaria más robusta

**Fecha:** 2026-11-11 14:09
**Tipo:** Refactor
**Requisitos:** ninguno

## Qué se hizo
- El proyecto deja de nombrar al autor de la plantilla original en docs, `CLAUDE.md`, README, changelog, comentarios, tests y textos de la interfaz. «Agus OS» y «Agus» ocupan su lugar; las decisiones que no son de Agus se dejan neutras («decidido el 2026-10-10»). Se borran los pasajes que solo tenían sentido con datos del sitio original (su libro, su newsletter, sus proyectos y recuentos). C-04 (chatbot) sigue pendiente, sin el motivo de espera anterior.
- La Terminal saca usuario y sistema de `PERSONA`: el prompt pasa a ser `agus@agus-os ~ %` (antes, fijo con el nombre del original), igual que el título de la ventana, `neofetch` y `sudo`. Nuevo `src/os/terminal/identity.ts` con sus tests.
- La ayuda de `open` usa `open lead-scoring` como ejemplo, un proyecto que existe.
- Identificadores renombrados: la acción de menú «Escribir a…» pasa a llamarse `write-to-me`; la clave de la vista de las damas → `os:damas:vista` (la vista guardada vuelve a la de por defecto); el separador del token del Libro de visitas → `os-guestbook-v1` (un enlace de confirmación enviado antes de este cambio deja de valer); los user-agents de los scripts → `cv-macbook-actualizar-*`.
- La guarda de privacidad de `stack.json` ya no lista nombres de repositorios de otra persona: comprueba que no aparezca el usuario de GitHub ni ninguna ruta `dueño/repo`.
- Tarea diaria: las actions pasan a versiones que corren en Node 24 (`checkout@v7`, `setup-node@v7`, `pnpm/action-setup@v6`), con un test que lo vigila. El job de cobertura desactiva la caché automática de `setup-node`, que desde la v5 necesita pnpm instalado. Con un token inválido o vencido, `actualizar-stack.mjs` falla al principio con un `::error::` que dice qué hacer, en lugar de un `401` genérico.
- `LICENSE` no cambia: la licencia MIT obliga a conservar el aviso de copyright del autor original.

## Qué se modificó
- Docs: `CLAUDE.md`, `README.md`, `docs/*.md`, `docs/features/*.md` y dos entradas antiguas de `changelog/`.
- Código: `src/os/terminal/identity.ts` (nuevo), `src/os/terminal/commands.ts`, `src/os/apps/terminal/Terminal.svelte`, `src/os/apps/registry.ts`, `src/os/menus.ts`, `src/lib/checkers/view.ts`, `src/lib/guestbook-token.ts`, comentarios en `src/` y `astro.config.mjs`.
- Scripts: `actualizar-stack.mjs`, `actualizar-repos.mjs`, `actualizar-proyectos.mjs`, `generar-portadas-ejemplo.mjs`.
- Workflows: `.github/workflows/actualizar-datos.yml` y `cobertura.yml`.
- Tests: `src/os/terminal/identity.test.ts` (nuevo), `src/lib/workflow.test.ts`, `src/lib/stack-content.test.ts` y fixtures de varios tests unitarios y e2e.

## Por qué
Agus quiere que el proyecto hable de él y no nombre al autor de la plantilla. La tarea diaria falló dos semanas sin un mensaje que dijera qué hacer, y sus actions apuntaban a Node 20, ya retirado de los runners de GitHub.
