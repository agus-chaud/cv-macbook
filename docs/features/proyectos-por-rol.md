# Proyectos por rol

**Estado:** Verificada
**Requisitos que cierra:** S-13
**Fecha de acuerdo:** 2026-11-14

## Qué se construye

Agus se postula a puestos de Data Engineer y de Data Scientist. Quien entra por uno de esos roles quiere ver
3 o 4 proyectos que lo demuestren, no una cuadrícula de diez.

En la vista general de Proyectos aparece un selector con tres opciones: **Todos**, **Data Engineering** y
**Data Science**. Al elegir un rol, la cuadrícula se queda con los proyectos elegidos para ese rol, en su orden de
siempre. «Todos» enseña la carpeta entera, como hasta ahora. Si se abre un proyecto y se vuelve con «‹ Proyectos», el
rol elegido sigue puesto. Funciona igual en escritorio y en móvil.

Entran cuatro proyectos nuevos a la carpeta, y tres de los actuales reciben su rol:

| Proyecto | Data Engineering | Data Science | Nuevo |
|----------|:---:|:---:|:---:|
| Pipeline e-commerce con Lakeflow (DLT) — `agus-chaud/Ecommerce-Data-Pipeline-con-DLT` | ✓ | | ✓ |
| Lakehouse NYC Taxi con Airflow — `agus-chaud/student-lakehouse` | ✓ | | ✓ |
| Gobierno de datos con Unity Catalog — `agus-chaud/Governance-en-Databricks` | ✓ | | ✓ |
| Medallion architecture en Databricks, con datos de publicidad digital — `agus-chaud/utn-databricks` | ✓ | | ✓ |
| Marketing Mix Model | | ✓ | |
| Scoring crediticio | | ✓ | |
| Triage de leads | | ✓ | |
| Test A/B de marketing — `agus-chaud/A-B-Testing-Marketing` | | ✓ | ✓ |

RAG del libro de agentes y Agus OS siguen en la carpeta, sin rol: solo salen en «Todos». *(Cambio del 2026-11-14, pedido
por Agus: ETL en Databricks entra en Data Engineering y Marketing Mix Model sale de ese rol, para no pasar de 4. Cambio del 2026-11-21, pedido por Agus: el
proyecto de publicidad digital en Databricks reemplaza a ETL en Databricks, que sale del portfolio.)*

## Decisiones tomadas

- **Por defecto está elegido «Todos».** Quien no viene por un rol concreto ve el portfolio entero, y quien sí viene
  llega a su selección con un clic. *(Es la decisión que más conviene confirmar: la alternativa es abrir en
  «Data Engineering» o quitar «Todos».)*
- **El rol vive en el JSON de cada proyecto**: un campo nuevo y opcional, `roles`, con valores `de` y/o `ds`, validado
  al compilar. Así un proyecto está en los dos roles sin duplicarse, y el texto de cada opción sale del código.
- **El selector es el control segmentado que ya existe** (idioma del CV en S-11, nivel de las damas): botones con
  `aria-pressed`, que se manejan con teclado sin código extra. Colores y radios, de las variables de `src/styles/`.
- **El filtro es una función pura** en `projects-view.ts` (`projectsForRole`), que se prueba sin navegador. Mantiene el
  orden por `order`.
- **El rol elegido es estado de la ventana**: no se guarda en `localStorage` ni en la dirección. Al cerrar y volver a
  abrir Proyectos, vuelve a «Todos».
- **Un test de contenido exige de 3 a 4 proyectos por rol**, para que la regla de «no abrumar» no se pierda al añadir
  proyectos más adelante. Si no hay ningún proyecto con un rol, ese botón no se enseña.
- **Los proyectos nuevos solo enlazan GitHub**: no tienen web propia, así que su URL es la del repositorio,
  `embeddable: false` y el botón es «Ver en GitHub». No llevan capturas en esta feature.
- **Sus lenguajes, etiquetas y licencia los rellena `scripts/actualizar-proyectos.mjs`**, como en el resto de
  proyectos (API pública de GitHub, sin claves).
- **El texto de cada proyecto nuevo (`summary`, `details`, `highlights`) lo redacto yo a partir de su README y su
  código**, y queda pendiente de tu revisión: no afirmo nada que no esté ahí.
  - **student-lakehouse** se describe por lo que escribió Agus (los DAGs de `dags/` y los pipelines de `nivel-1/` y
    `nivel-2/`), sin nombrar el curso de origen (decidido por Agus el 2026-11-14). No se presenta como suyo el
    entorno de contenedores (`docker-compose.yml`), que viene de la plantilla.
- **Lo que cambia en otras partes del sitio, y se acepta:**
  - La barra de favoritos del Navegador (M-10) muestra todos los proyectos y pasa de 6 a 10. M-10 no cambia.
  - Los proyectos nuevos aparecen en «Usado en» del Stack (S-12) cuando corra la tarea automática que actualiza
    sus datos. Esa tarea no se toca.

## Cobertura

| Requisito | Se implementa en | Se valida con |
|-----------|------------------|---------------|
| S-13 | `src/content.config.ts`, `src/os/apps/projects/projects-view.ts`, `src/os/apps/projects/Projects.svelte`, `src/content/projects/*.json`, `docs/design-system.md`, `docs/architecture.md` | `src/os/apps/projects/projects-view.test.ts`, `src/lib/projects-content.test.ts`, `tests/e2e/s-13-proyectos-por-rol.spec.ts` |

Qué comprueba cada test, según el criterio del PRD:

- **unit (`projects-view.test.ts`):** `projectsForRole` devuelve para `de` y `ds` solo los proyectos con ese rol, en
  orden; para «Todos» devuelve todos; un proyecto con los dos roles sale en los dos; uno sin rol solo sale en
  «Todos». Los roles con proyectos se calculan aparte, y uno sin proyectos no se ofrece.
- **contenido (`projects-content.test.ts`):** cada rol tiene entre 3 y 4 proyectos de la carpeta; los valores de
  `roles` son solo `de` y `ds`, sin repetidos.
- **e2e (escritorio y móvil, `s-13-proyectos-por-rol.spec.ts`):**
  - El selector aparece con «Todos» marcado (`aria-pressed="true"`), y la cuadrícula tiene tantas tarjetas como
    proyectos de la carpeta.
  - Elegir «Data Engineering» deja exactamente las tarjetas de los proyectos con rol `de`, en su orden; lo mismo con
    «Data Science».
  - Abrir un proyecto con un rol elegido y volver con «‹ Proyectos» mantiene ese rol y esas tarjetas.
  - El selector se maneja con teclado (Tab y Enter o Espacio).
  - *Negativo:* un proyecto sin rol (RAG del libro de agentes) no aparece en ninguno de los dos roles, pero sí en «Todos».
- `tests/e2e/s-08-proyectos.spec.ts` no se toca: con «Todos» por defecto, su vista general sigue igual.

## Fuera de esta feature

- Preseleccionar un rol desde un enlace (por ejemplo, `?rol=de` en el CV). Va a `mejoras/`.
- Comandos de la Terminal por rol (`open proyectos de`).
- Capturas de pantalla e iconos propios de los proyectos nuevos: salen con su inicial, como permite S-08.
- Cambiar el CV (`sobre-mi.md`) o el orden de los proyectos actuales.
- Los demás candidatos revisados (Fraude, churn, utn-databricks, forecasting-retail, Openseizure…): no entran.
- Corregir el CV de Data Engineer en PDF: vive fuera del repo. Le faltan dos correcciones del scoring crediticio, que
  no usa Docker ni tiene MCP.
