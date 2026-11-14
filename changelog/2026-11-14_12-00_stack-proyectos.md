# Stack: en qué proyectos se usa cada herramienta

**Fecha:** 2026-11-14 12:00
**Tipo:** Feature
**Requisitos:** S-12 (y redefine el negativo de M-05)

## Qué se hizo
- En el detalle por herramienta del Stack, cada herramienta es un botón: al pulsarla (o con Enter o Espacio) despliega los proyectos de la app Proyectos que la usan, cada uno con un enlace que abre su detalle. Una abierta a la vez. Si ningún proyecto la usa, dice en cuántos repositorios se usa.
- `scripts/actualizar-stack.mjs` asocia cada repositorio público con su proyecto de Proyectos (por el campo `repo`) y guarda en `stack.json`, para cada herramienta, los ids de esos proyectos. La red de seguridad sigue rechazando cualquier nombre de repositorio privado o que no esté en Proyectos.
- El proyecto del portfolio apunta al repositorio con su nombre actual (`agus-chaud/cv-macbook`).
- Arreglado antes de publicar: las etiquetas de proyecto no llegaban al contraste mínimo en el tema oscuro (4,18:1); ahora usan el color de texto principal.
- Las cifras, el año a año y el reparto por categoría siguen sin nada clicable.

## Qué se modificó
- `src/lib/stack.ts`, `scripts/actualizar-stack.mjs`, `src/content/stack.json`, `src/os/apps/stack/Stack.svelte`, `src/os/apps/AppView.svelte`, `src/content/projects/este-portfolio.json`.
- Tests: `src/lib/stack.test.ts`, `src/lib/stack-content.test.ts`, `tests/e2e/m-05-stack.spec.ts`.
- Docs: `docs/prd.md` (M-05 y S-12), `docs/features/stack-proyectos.md` (nueva), `docs/features/stack.md`, `docs/design-system.md`.

## Por qué
Agus quiere que, al ver una herramienta en el Stack, se pueda saber en qué proyectos la usó y llegar a ellos.
