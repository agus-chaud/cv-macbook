# cv-macbook

Un CV con forma de **sistema operativo de escritorio mac**: pantalla de acceso, ventanas,
dock,  proyectos que se abren en un navegador interno, el CV como documento y notas.

## Qué incluye

- **Proyectos**: una carpeta con mis proyectos, su detalle, capturas  y un **Navegador** interno que los abre en una ventana.
- **Mi CV**: tu currículum como documento, con su PDF descargable generado a partir del mismo texto.
- **Notas**: una carpeta de entradas en Markdown. Cada una tiene además su página pública, con vista previa al compartir, para que Google la encuentre.
- **Favoritos**: mi top de deportes, películas, libros y música, con un mini reproductor de YouTube.
- **Stack** y **GitHub**: mis herramientas y mis repositorios destacados (los que llevan el topic `showcase`), calculados desde GitHub por una tarea programada.
- **Terminal**: comandos, huevos de Pascua y `minigames` (Wordle, ahorcado, adivina el número, `memory` y `checkers`, damas en 3D contra la máquina).
- **Ajustes**: tema claro u oscuro, fondo de pantalla y tamaño del texto.
- **Cómo está hecho**: un documento que explica el sistema por dentro.

Sin cuentas ni base de datos: el contenido vive en el repositorio y cada cambio es un commit.

## Stack

Astro 7 con una isla de Svelte 5, en Cloudflare Workers con activos estáticos.. TypeScript estricto, Vitest y Playwright.
El detalle y el porqué de cada decisión están en [`docs/architecture.md`](docs/architecture.md).

## El método

Se construyó con Claude Code , con foco en que nada se programa sin entender antes qué se
construye y con qué prueba se demostrará cada requisito. Se ve en el repositorio:

- [`docs/`](docs): el PRD (requisitos por prioridad MoSCoW), la arquitectura, el sistema de diseño y la estrategia de pruebas.
  Son los documentos de Agus OS: déjalos como ejemplo o reescríbelos para tu proyecto.
- [`docs/features/`](docs/features): una ficha por cada funcionalidad, con su tabla de cobertura. `node scripts/verificar-cobertura.mjs`
  comprueba que ningún requisito se quede sin su test, y un workflow lo vigila en cada pull request.
- [`CLAUDE.md`](CLAUDE.md) y [`.claude/skills/`](.claude/skills): las reglas y los procedimientos que sigue el agente.

## Licencia

MIT. Ver [`LICENSE`](LICENSE).
