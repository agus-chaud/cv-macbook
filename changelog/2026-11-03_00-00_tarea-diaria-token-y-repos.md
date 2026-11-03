# Tarea diaria: token renovado y script de repositorios

**Fecha:** 2026-11-03
**Tipo:** Fix
**Requisitos:** ninguno

## Qué se hizo
- La tarea diaria fallaba desde el 26/10 con `401 Unauthorized`: el secreto `STACK_GITHUB_TOKEN` no era válido. Agustín lo renovó.
- Con el token renovado, la tarea fallaba un paso después: `scripts/actualizar-repos.mjs` importaba `src/lib/repos.ts`, que cargaba `../content/persona` sin extensión, y Node no lo resuelve sin compilar. Se añade `.ts`, como ya hacían `stack.ts` y el resto de módulos que usan los scripts.

## Qué se modificó
- `src/lib/repos.ts`.

## Por qué
Sin la tarea, el Stack y los datos de GitHub de los proyectos dejaban de actualizarse.
