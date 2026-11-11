# Escritorio: sin icono del Libro de visitas, dos columnas de cuatro

**Fecha:** 2026-11-11 21:30
**Tipo:** Feature
**Requisitos:** ninguno

## Qué se hizo
- El Libro de visitas deja de tener icono en el escritorio. Se sigue abriendo desde la Terminal (`open guestbook`), y en móvil conserva su icono.
- LinkedIn ocupa su sitio, después de Favoritos. El escritorio queda en dos columnas de cuatro: Proyectos, Mi CV, Notas y Favoritos; LinkedIn, Stack, Cómo está hecho y GitHub.
- Las columnas tienen como mucho cuatro iconos (`max-height` en la cuadrícula), también en pantallas altas. Comprobado a 1280×800, 1440×1000 y 1280×560.
- Los tests que abrían el Libro de visitas con su icono del escritorio lo abren ahora desde la Terminal (`openGuestbookOnDesktop`).

## Qué se modificó
- `src/os/items.ts`, `src/os/shell/Desktop.svelte`.
- Tests: `src/os/items.test.ts` (nuevo), `tests/e2e/helpers.ts`, `m-02-escritorio`, `s-04-terminal`, `s-05-menus`, `s-09-libro-de-visitas` y `tests/csp/m-11-csp.spec.ts`.
- Docs: `docs/design-system.md`, `docs/features/libro-de-visitas.md`.

## Por qué
Agus quiere un escritorio más limpio, con LinkedIn a la vista.
