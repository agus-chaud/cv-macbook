# Tests e2e con el contenido real

**Fecha:** 2026-11-11 20:30
**Tipo:** Fix
**Requisitos:** ninguno

## Qué se hizo
- La suite e2e completa (578 tests en escritorio y móvil) tenía 68 fallos: casi todos esperaban el contenido de ejemplo de la plantilla. Ahora los tests leen el contenido real de `src/content/`.
- Decisión de Agus: las funciones que el contenido no usa se comprueban **apagadas** (sin WhatsApp ni newsletter no hay icono, entrada de menú ni invitación; sin proyectos incrustables ningún detalle ofrece el Navegador; sin iconos propios no hay proyectos sueltos en el escritorio; con una sola captura no hay anterior ni siguiente; sin redes en las reseñas no hay enlaces).
- Donde no hay estado apagado que comprobar, el test se salta solo si el contenido no tiene ese caso, con el motivo escrito: ningún proyecto con GIF, ninguno sin repositorio. Es la misma regla que ya usaba el test de «proyecto sin capturas».
- Playwright usa 2 workers en local (`E2E_WORKERS` lo cambia; en CI, los de por defecto): con más, el servidor de desarrollo no daba abasto y fallaban tests al azar (Memory, Favoritos, accesibilidad de menús).
- Sigue fallando en local `s-09-libro-de-visitas-api` («a partir de la sexta petición… da 429»), como antes de este cambio: el código aplica el límite por IP igual en los dos endpoints, pero la simulación local de `ratelimits` es irregular. No se ha tocado el test.

## Qué se modificó
- `playwright.config.ts`.
- Tests: `m-02-escritorio`, `m-03-movil`, `m-04-proyectos`, `m-07-accesos`, `m-10-navegador`, `s-01-notas`, `s-04-terminal`, `s-05-menus`, `s-08-proyectos`, `s-09-libro-de-visitas` (todos en `tests/e2e/`).
- `odd/tasks/e2e-contenido-real.md`: registro de la tarea.

## Por qué
Con 68 tests fallando «por costumbre», un error real en el sitio pasaba desapercibido.
