# Stack: en qué proyectos se usa cada herramienta

**Estado:** Verificada
**Requisitos que cierra:** S-12 (y redefine el negativo de M-05)
**Fecha de acuerdo:** 2026-11-14

## Qué se construye

En el detalle por herramienta del Stack, cada herramienta se puede pulsar. Al pulsarla (o con Enter o Espacio) se
despliega debajo la lista de los proyectos de la app Proyectos que la usan, cada uno con un enlace que abre su detalle
en Proyectos. Por ejemplo, pandas lista el Marketing Mix Model, el triage de leads y el scoring crediticio.

Si ningún proyecto de Proyectos la usa, lo dice: «Se usa en N repositorios que no están en Proyectos». La lista solo
nombra proyectos que ya son públicos en el portfolio: nunca un repositorio privado ni uno que no esté en Proyectos.

## Decisiones tomadas

- **Qué proyecto usa qué herramienta lo decide el script, no una lista a mano.** `scripts/actualizar-stack.mjs` ya
  detecta las herramientas de cada repositorio: además del recuento, guarda en `stack.json` qué proyectos de Proyectos
  (por su campo `repo`) usan cada una. Así el clic y el recuento nunca se contradicen, y el campo `stack` escrito a mano
  de cada proyecto no tiene que coincidir con los nombres del catálogo.
- **Privacidad:** `stack.json` gana ids de proyectos, que ya son públicos en el sitio. La red de seguridad del script se
  ajusta: sigue rechazando cualquier nombre de repositorio privado o que no esté en Proyectos.
- **Se despliega en el sitio, no en una ventana nueva:** una herramienta abierta a la vez; al abrir otra se cierra la
  anterior. Sin ratón: es un botón con `aria-expanded`.
- **El enlace abre el detalle del proyecto en Proyectos**, no GitHub: el detalle ya lleva el botón al repositorio.
- **Las cifras de resumen, el año a año y el reparto por categoría siguen sin nada clicable.**

## Cobertura

| Requisito | Se implementa en | Se valida con |
|-----------|------------------|---------------|
| S-12 | `scripts/actualizar-stack.mjs`, `src/lib/stack.ts`, `src/content/stack.json`, `src/os/apps/stack/Stack.svelte` | `src/lib/stack.test.ts`, `src/lib/stack-content.test.ts`, `tests/e2e/m-05-stack.spec.ts` |

Qué comprueba cada test:

- **Unitarios (`stack.test.ts`):** de los repositorios analizados, cada herramienta se asocia a los proyectos de
  Proyectos cuyo repositorio la usa, y a ningún otro; un repositorio que no está en Proyectos solo suma al recuento.
- **Contenido (`stack-content.test.ts`):** cada id de proyecto de `stack.json` existe en `src/content/projects/`, y
  ningún dato nombra un repositorio privado.
- **e2e (escritorio y móvil):** pulsar una herramienta despliega sus proyectos; su enlace abre ese proyecto en
  Proyectos; Enter y Espacio hacen lo mismo; abrir otra cierra la anterior; sin errores de accesibilidad con una abierta.
  - *Negativo:* una herramienta sin proyectos en Proyectos dice en cuántos repositorios se usa y no enlaza a nada; las
    cifras, el año a año y el reparto siguen sin elementos clicables.

## Fuera de esta feature

- Enlazar a repositorios que no están en Proyectos.
- Filtrar la app Proyectos por herramienta.
- Hacer clicables los gráficos de año a año y del reparto por categoría.
