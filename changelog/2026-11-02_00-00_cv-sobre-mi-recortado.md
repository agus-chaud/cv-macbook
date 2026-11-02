# CV: «Sobre mí» en un solo párrafo y nuevas descripciones de dos proyectos

**Fecha:** 2026-11-02
**Tipo:** Contenido
**Requisitos:** ninguno

## Qué se hizo
- Se borra el segundo párrafo de «Sobre mí» («Hoy creo productos de datos con evals y guardrails…»). La docencia y la tutoría ya figuran en Experiencia.
- Nuevas descripciones del Marketing Mix Model y del RAG del libro de agentes en Proyectos: arrancan por la pregunta que responden. El RAG ya no dice «eval-first» en el CV; el repositorio sí tiene un set de evals (`RAG-LIBRO/EVAL.md`, `backend/eval_runner.py`), y lo siguen contando los detalles de la app Proyectos.
- En la app Proyectos, el resumen y la descripción de esos dos proyectos se alinean con el CV.
- Se regenera el PDF del CV.

## Qué se modificó
- `src/content/sobre-mi.md`, `public/cv.pdf`, `src/content/sobre-mi.pdf.sha256`, `src/content/projects/marketing-mix-modelling.json` y `src/content/projects/rag-libro-agentes.json`.

## Por qué
Agustín quiere que «Sobre mí» diga solo qué le gusta hacer y con qué sombreros lo hace. Las descripciones anteriores listaban herramientas sin decir qué problema resolvía cada proyecto.
