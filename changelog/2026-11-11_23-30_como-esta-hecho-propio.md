# «Cómo está hecho»: propio, al día y con el proceso con IA

**Fecha:** 2026-11-11 23:30
**Tipo:** Contenido
**Requisitos:** S-10 (redefinido)

## Qué se hizo
- Se quita la sección de los bloqueos de LaLiga: afectan a operadoras de España y venían del sitio del que nace la plantilla. También su fila en `docs/despliegue.md`.
- Se corrige lo que ya no era cierto: la tarea del Stack corre cada día, cuenta las copias con commits propios, lee todo el Python y los notebooks y fecha cada herramienta por su primer commit. El Libro de visitas dice su estado real: sin un dominio propio verificado en Cloudflare, el envío de correos no está activo.
- Nueva sección «Cómo lo construí con IA» (antes «Cómo se trabaja»): el método (ficha antes de código, prueba antes que el código, un script de cobertura), los números de pruebas a noviembre de 2026 y la auditoría del Stack como ejemplo.
- Nueva sección «En resumen»: cómo fluye todo en cinco pasos.
- Todo el texto habla de vos (antes mezclaba voseo y el tú de España).
- Tests: las secciones acordadas, que no se mezcle el tú de España, que no vuelva LaLiga y que el enlace del texto al Libro de visitas lo abra.

## Qué se modificó
- `src/content/como-esta-hecho.md`.
- Tests: `src/lib/howto.test.ts`, `tests/e2e/s-10-como-esta-hecho.spec.ts`, `tests/csp/s-10-como-esta-hecho.spec.ts`.
- Docs: `docs/prd.md` (S-10), `docs/features/como-esta-hecho.md`, `docs/despliegue.md`.

## Por qué
Agus aprobó las cuatro mejoras propuestas: el documento tenía contenido de otra persona, datos desfasados, una voz mezclada y no contaba lo que más vende su perfil.
