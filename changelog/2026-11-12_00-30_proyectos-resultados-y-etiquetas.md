# Proyectos: resultados clave y etiquetas reales

**Fecha:** 2026-11-12 00:30
**Tipo:** Feature
**Requisitos:** ninguno

## Qué se hizo
- El detalle de cada proyecto tiene un apartado **Resultados** con hasta tres cifras clave (campo nuevo `highlights` en la colección). Solo cifras que ya contaba cada proyecto: por ejemplo, en el Marketing Mix Model, «45 %» de error medio por canal, «+227» altas por semana y «31» tests de datos.
- La etiqueta interna `showcase` (la que elige qué sale en la ventana GitHub) ya no se muestra en el detalle.
- Los seis repositorios tienen topics reales en GitHub (por ejemplo `rag`, `langchain`, `faiss` en el RAG), y los datos de cada proyecto se actualizaron con el script de la tarea diaria.
- El stack del scoring crediticio vuelve a incluir «Anthropic API»: el explicador con LLM existe en la rama `feat/preprocesador-y-modelizacion-pd` (con `anthropic` en sus dependencias). La auditoría del 2026-10-25 solo miró `main` y lo quitó por error. Docker sigue fuera: no está en ninguna rama.
- Arreglado antes de publicar: el texto de cada resultado no llegaba al contraste mínimo en el tema oscuro (4,41:1); ahora usa el color de texto principal.

## Qué se modificó
- `src/content.config.ts`, `src/os/items.ts`, `src/pages/index.astro`, `src/os/apps/projects/projects-view.ts`, `src/os/apps/projects/ProjectDetail.svelte`.
- Datos: `src/content/projects/*.json`.
- Tests: `src/os/apps/projects/projects-view.test.ts`, `tests/e2e/s-08-proyectos.spec.ts`, `tests/e2e/helpers.ts`.
- Docs: `docs/design-system.md`.

## Por qué
Las cifras que más venden estaban enterradas en el texto, y cada proyecto enseñaba una etiqueta interna que no le decía nada al visitante.
