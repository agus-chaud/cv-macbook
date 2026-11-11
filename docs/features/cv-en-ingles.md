# CV en inglés

**Estado:** Verificada
**Requisitos que cierra:** S-11
**Fecha de acuerdo:** 2026-11-11

## Qué se construye

La ventana Mi CV tiene un selector **ES / EN** en su barra. En español se ve como hoy. En inglés, el documento entero
(línea de presentación, gancho, Sobre mí, Experiencia, Proyectos, Habilidades) se ve traducido, y el botón Descargar
PDF baja el PDF en inglés.

El texto en inglés vive en su propio archivo, `src/content/sobre-mi.en.md`, con la misma estructura que el español. De él
salen la ventana en inglés y `public/cv-en.pdf`, con el mismo script que el PDF en español, así que documento y PDF
no pueden decir cosas distintas.

## Decisiones tomadas

- **Un archivo por idioma** (`sobre-mi.md` y `sobre-mi.en.md`), no una traducción automática: el texto en inglés se
  revisa como el español.
- **La traducción la propone el agente y la aprueba Agus** antes de publicarse: es su CV y cada frase tiene que ser suya.
- **Español por defecto**; el selector no se recuerda entre visitas (la mayoría de visitantes lee en español).
- **Solo cambia el documento**: la barra de la ventana y el resto del sitio siguen en español.
- **Dos PDF con nombre distinto**: `Agustin-Chaud-CV.pdf` y `Agustin-Chaud-CV-EN.pdf`, para no pisarse en la carpeta de
  descargas.
- **Una huella por PDF** (`sobre-mi.pdf.sha256` y `sobre-mi.en.pdf.sha256`): un test falla si cambia un texto y no se
  regenera su PDF.
- Los enlaces a apps del texto (`#abrir-proyectos`…) funcionan igual en inglés.

## Cobertura

| Requisito | Se implementa en | Se valida con |
|-----------|------------------|---------------|
| S-11 | `src/content/sobre-mi.en.md`, `src/os/apps/about/About.svelte`, `src/lib/cv.ts`, `src/pages/index.astro`, `src/os/items.ts`, `scripts/generar-cv.mjs`, `scripts/plantillas/cv.html`, `public/cv-en.pdf`, `src/content/sobre-mi.en.pdf.sha256` | `src/lib/cv.test.ts`, `tests/e2e/m-06-sobre-mi.spec.ts` |

Qué comprueba cada test:

- **Unitarios (`cv.test.ts`):** el CV en inglés tiene línea de presentación, gancho y las mismas secciones que el
  español, en el mismo orden; cumple las mismas guardas (solo el correo de contacto, sin teléfonos, enlaces https, a
  apps o al correo); cada sección tiene tantos puntos como en español; su PDF existe, es un PDF y se generó con el
  texto actual; el nombre de descarga del inglés lleva `-EN`.
  - *Negativo:* sin el PDF en inglés no hay botón de descarga en inglés (`pdfHref(false, '/cv-en.pdf')` es `null`). Se
    prueba en unitario y no en e2e: simularlo en e2e exigiría borrar `public/cv-en.pdf` con el servidor en marcha.
- **e2e (escritorio y móvil):** Mi CV abre en español; al elegir EN el documento pasa a inglés (saludo, línea de
  presentación, secciones y `lang="en"`) y Descargar PDF apunta a `cv-en.pdf`, que se sirve como PDF; al volver a ES
  vuelve todo. Sin errores de accesibilidad con el documento en inglés.

## Hallazgos al construir

- Refactorizar `generar-cv.mjs` para los dos idiomas no cambió el PDF en español: su huella siguió igual.
- Tres tests de `m-06` esperaban el contenido de ejemplo de la plantilla (un LinkedIn `tu-perfil`, un enlace a Correo y
  ningún correo publicado). Ahora leen el CV real; el de correos mantiene la misma regla que `cv.test.ts`: solo el de
  contacto.

## Fuera de esta feature

- Traducir el resto del sitio (notas, proyectos, menús, Terminal).
- Elegir el idioma según el navegador del visitante.
- Recordar el idioma elegido entre visitas.
