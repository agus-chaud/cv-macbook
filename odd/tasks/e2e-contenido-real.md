# e2e con el contenido real

Objetivo: que la suite e2e pase con el contenido de Agus. Rama: `main`. Test runner: Playwright (`escritorio` y `movil`).

## Specs

- S1. L1 (decisión de Agus, 2026-11-11): «Test them as off». Para las funciones que el contenido no usa (WhatsApp,
  newsletter, proyectos con icono propio, proyectos incrustables, GIF, redes en las reseñas), los tests comprueban que
  están apagadas en lugar de probar el comportamiento de la plantilla.
- S2. Los tests leen el contenido real (`src/content/`) en lugar de esperar el de ejemplo.
- S3. «Lower the local workers to avoid instability»: menos workers de Playwright en local.
- S4. No se desactiva ni se vacía de aserciones ningún test para que deje de fallar (CLAUDE.md). Donde no hay estado
  apagado que comprobar (un GIF que no existe), el test se salta solo si el contenido no lo tiene, con el motivo escrito.

## Tasks

- T1 (S3) workers locales — inline
- T2 (S1, S2) proyectos: m-02, m-04, m-10, s-05 (Archivo), s-08 — inline
- T3 (S1, S2) enlaces y Terminal: m-03, m-07, s-04, s-05 (Ayuda, Teclado) — inline
- T4 (S1, S2) notas, favoritos, reproductor y Libro de visitas: s-01, s-03, s-09 — inline
- T5 suite e2e completa, changelog y commit — inline

## Log

- L1 (2026-11-11) Agus: «Test them as off». Suite completa: 68 fallos de 578; 3 de m-06 ya adaptados con el CV en inglés.
- L2 T1 hecho: `workers` local = 2 (`E2E_WORKERS` lo cambia). Con más, Memory, Favoritos y la accesibilidad de menús fallaban
  al azar por tiempo de espera; aislados pasaban.
- L3 T2 hecho: m-02, m-04, m-10, s-05, s-08 pasan en escritorio y móvil. Saltos por contenido, con motivo: GIF (ninguno) y
  proyecto sin repositorio (todos tienen).
- L4 T3 hecho: m-03, m-07, s-04 pasan. WhatsApp y newsletter se comprueban apagados.
- L5 T4 hecho: s-01, s-03, s-09 pasan. Queda `s-09-libro-de-visitas-api` «a partir de la sexta petición… da 429»: falla
  también antes del cambio. El límite por IP se aplica igual en los dos endpoints (`readJson`); la simulación local de
  `ratelimits` es irregular. No se toca el test.
- L6 T5: suite completa con 2 workers: 526 pasan, 57 se saltan, 2 fallan (antes, 68). Los 2: el 429 de s-09 (L5) y la
  accesibilidad de s-08, que vio un aviso «fetch failed» del servidor de desarrollo; repetido 3 veces en escritorio y
  móvil, pasa 6 de 6.
