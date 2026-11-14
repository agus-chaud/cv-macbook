# Proyectos por rol

**Fecha:** 2026-11-14 20:00
**Tipo:** Feature
**Requisitos:** S-13

## Qué se hizo
- La vista general de Proyectos tiene un selector «Todos / Data Engineering / Data Science». Al elegir un rol quedan los
  3 o 4 proyectos elegidos para ese rol, en su orden; «Todos» enseña la carpeta entera y es la opción con la que abre.
  Al volver del detalle se mantiene el rol elegido. Funciona con teclado y en móvil.
- Cuatro proyectos nuevos: Pipeline e-commerce con DLT, Lakehouse NYC Taxi y Gobierno con Unity Catalog (Data
  Engineering) y Test A/B de marketing (Data Science). Sus lenguajes y etiquetas salen de `scripts/actualizar-proyectos.mjs`.
- Roles de los actuales: Marketing Mix Model en los dos; Scoring crediticio y Triage de leads en Data Science. ETL en
  Databricks, RAG del libro y Agus OS quedan sin rol: solo salen en «Todos».

## Qué se modificó
- `src/content.config.ts` (campo `roles`), `src/os/items.ts`, `src/pages/index.astro`,
  `src/os/apps/projects/projects-view.ts` (`projectsForRole`, `roleFilters`), `src/os/apps/projects/Projects.svelte`.
- Contenido: `src/content/projects/` (cuatro JSON nuevos y `roles` en tres).
- Tests: `src/os/apps/projects/projects-view.test.ts`, `src/lib/projects-content.test.ts`,
  `tests/e2e/s-13-proyectos-por-rol.spec.ts` (nuevo), `tests/e2e/helpers.ts`, `playwright.config.ts` (S-13 también en móvil).
- Docs: `docs/prd.md` (S-13), `docs/features/proyectos-por-rol.md` (nueva), `docs/architecture.md`,
  `docs/design-system.md`, `mejoras/backlog.md` (preseleccionar el rol desde un enlace).

## Por qué
Agus se postula a puestos de Data Engineer y de Data Scientist, y quien entra por un rol tiene que encontrar rápido los
proyectos que lo demuestran, sin una cuadrícula de diez.
