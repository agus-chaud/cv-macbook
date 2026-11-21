# Proyecto nuevo: medallion en Databricks con datos de publicidad digital

**Fecha:** 2026-11-21 12:00
**Tipo:** Contenido
**Requisitos:** S-08, S-13

## Qué se hizo
- Nuevo proyecto «Medallion architecture en Databricks, con datos de publicidad digital» (`agus-chaud/utn-databricks`),
  en Data Engineering y en «Todos». Sus lenguajes y etiquetas salen de `scripts/actualizar-proyectos.mjs`.
- ETL en Databricks sale del portfolio: el proyecto nuevo cubre lo mismo (medallion en Databricks) y es más completo.
  Data Engineering sigue con 4 proyectos.
- `stack.json` deja de nombrar a ETL en Databricks en «Usado en»; la tarea automática del Stack añadirá el proyecto nuevo
  en su próxima ejecución.
- El CV (`sobre-mi.md` y `sobre-mi.en.md`) cambia la entrada de ETL en Databricks por la del proyecto nuevo, y sus PDF
  se regeneran con `scripts/generar-cv.mjs`.

## Qué se modificó
- `src/content/projects/medallion-publicidad-databricks.json` (nuevo), `src/content/projects/etl-databricks.json` (borrado),
  `src/content/stack.json`, `src/content/sobre-mi.md`, `src/content/sobre-mi.en.md`, `public/cv.pdf`, `public/cv-en.pdf`
  y sus `.sha256`.
- Docs: `docs/features/proyectos-por-rol.md`.

## Por qué
Agus quiere enseñar en Data Engineering su proyecto más completo en Databricks en lugar del ETL anterior.
