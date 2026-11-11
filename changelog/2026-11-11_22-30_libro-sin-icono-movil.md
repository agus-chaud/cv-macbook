# Libro de visitas sin icono en móvil

**Fecha:** 2026-11-11 22:30
**Tipo:** Feature
**Requisitos:** ninguno

## Qué se hizo
- El Libro de visitas deja de tener icono también en la pantalla de inicio del móvil. Se abre desde la Terminal (`open guestbook`), igual que en el escritorio.
- El helper de los tests pasa a llamarse `openGuestbook` y abre el libro desde la Terminal en los dos tamaños.
- «Cómo está hecho» ya no enlaza a la plantilla de método del autor original: quedaba un enlace que se había pasado por alto al quitar sus menciones.

## Qué se modificó
- `src/os/items.ts`, `src/content/como-esta-hecho.md`.
- Tests: `src/os/items.test.ts`, `tests/e2e/helpers.ts`, `m-03-movil`, `s-04-terminal`, `s-05-menus`, `s-09-libro-de-visitas` y `tests/csp/m-11-csp.spec.ts`.
- Docs: `docs/design-system.md`, `docs/features/libro-de-visitas.md` y una entrada anterior de `changelog/`.

## Por qué
Agus quiere el Libro de visitas fuera de la vista también en el celular.
