---
title: "Cómo está hecho este portfolio"
description: "Cómo funciona este portfolio por dentro: las tecnologías, cómo lo construí con IA, la actualización automática de datos y el Libro de visitas."
---

## Qué es

Es un cv con forma de sistema operativo de escritorio, dentro del navegador. Todo lo que ves (las ventanas, el dock, la barra de menú, la Terminal) es una web: no hay nada instalado ni un sistema detrás. Si lo abrís desde el celu, el contenido es el mismo.

Lo hice así porque quería mostrar cómo pienso un producto en vez de solo describirlo.

## En resumen

1. **El contenido** (CV, proyectos, notas, favoritos) son archivos Markdown y JSON del repositorio.
2. **Astro** los convierte en páginas al compilar, y **Cloudflare Workers** las sirve.
3. **El escritorio** es una isla de Svelte: lo único que se ejecuta en tu navegador.
4. **Cada día, una tarea de GitHub Actions** revisa mis repositorios y actualiza el Stack y los datos de cada proyecto.
5. **Lo construí con Claude Code**, con pruebas automáticas para cada requisito.

## Stack

Las piezas que lo sostienen:

{{tecnologias}}

## Cómo funciona por dentro

**Un sitio estático con un único trozo de servidor.** Casi todo son páginas generadas al compilar con Astro y servidas desde Cloudflare Workers. El único código que se ejecuta en un servidor son los endpoints del Libro de visitas.

**El escritorio es una «isla» de Svelte.** Es lo único que se activa en el navegador. El gestor de ventanas (mover, redimensionar, ampliar, colocar en mitades, minimizar) son funciones puras: reciben el estado y devuelven el siguiente. Por eso se prueban sin abrir un navegador.

**Cada app se carga al abrirla.** La pantalla de acceso tiene un presupuesto de JavaScript, y una prueba vigila que no lo supere: lo pesado (Mi CV, Proyectos, Stack, Notas, este documento) llega cuando lo abrís, no al entrar.

**El contenido son colecciones.** Los proyectos, las notas y las reseñas del Libro de visitas son archivos JSON y Markdown del repositorio, validados al compilar: un campo mal escrito rompe la compilación, no la web. El CV está en español y en inglés, y de cada versión sale su PDF con el mismo texto.

**Seguridad.** Una política de seguridad de contenido estricta: ningún script ni estilo en línea sin su huella, nadie puede incrustar esta web en otra, y el Navegador interno solo carga los sitios de los proyectos. Las respuestas del servidor llevan sus propias cabeceras.

**Lo que guarda tu navegador.** Solo tus preferencias (tema, fondo y tamaño del texto), en tu propio navegador. No hay cookies ni analítica.

**Accesibilidad.** Todo se puede manejar con el teclado, se respeta el movimiento reducido y hay pruebas automáticas de accesibilidad en claro y en oscuro.

## Cómo se actualizan solos los datos

Las herramientas del [Stack](#abrir-stack) y los datos de GitHub de cada proyecto no se escriben a mano. Una tarea de GitHub Actions los recalcula todos los días:

1. Usa un **token de GitHub de solo lectura**, guardado como secreto del repositorio, para listar mis repositorios: públicos, privados y las copias de otros repositorios en las que hice cambios.
2. Lee de cada uno los lenguajes, las dependencias (de JavaScript, Python, Rust y Gradle) y los imports de **todo** el código Python y de los notebooks, además de algunos archivos reveladores (un `Dockerfile`, un `CLAUDE.md`).
3. Lo traduce a herramientas con un catálogo (qué dependencia corresponde a qué herramienta). También cuenta lo que se usa sin importarlo, como la sesión de Spark en un notebook de Databricks.
4. Escribe **solo recuentos y años**: cuántos repositorios usan cada herramienta y desde cuándo. El año sale del primer commit que trajo esa herramienta. De los privados no sale ningún nombre, y el script se niega a publicar si alguno se colara.
5. Pasa las pruebas y, si hay cambios, los publica directamente en la rama principal. Esa fusión despliega la web.

Si el token caduca, la tarea falla al principio y avisa de que hay que renovarlo, en lugar de publicar números recortados. Los datos de cada proyecto (lenguajes, etiquetas y licencia) salen de la API pública de GitHub.

Claude Code no deja rastro en el código de todos los repositorios, así que lo cuento en los que lo usé aunque no aparezca un `CLAUDE.md`.

## El Correo y el Libro de visitas

**Correo.** No hay formulario: la ventana de Correo muestra el correo de contacto, LinkedIn y GitHub. El correo se abre en tu propio programa, así que no pasa nada por el servidor.

**Libro de visitas.** El [Libro de visitas](#abrir-visitas) no usa base de datos. Se abre desde este enlace o desde la Terminal, con `open guestbook`:

1. Escribís tu reseña y tu correo. El servidor la valida y te manda un enlace de confirmación, que lleva dentro tu petición **cifrada y autenticada** y caduca a las 48 horas.
2. Abrís el enlace y tocás «Confirmar». Es un botón a propósito: muchos programas de correo abren los enlaces por su cuenta para analizarlos y confirmarían solos.
3. La reseña me llega al correo ya en forma de archivo. Si la apruebo, la guardo en el repositorio y se publica con el siguiente despliegue.

Nada aparece sin aprobación, y tu correo nunca se publica ni se guarda en la web.

**Estado actual:** para que esos correos salgan hace falta un dominio propio verificado en Cloudflare, y este sitio todavía no lo tiene. Hasta entonces, el envío no está activo.

## Cómo lo construí con IA

El código lo escribió Claude Code, un agente de código, y yo dirigí cada paso. El método:

1. **Primero se acuerda, después se programa.** Cada pieza empieza con una ficha: qué se construye, qué queda fuera y con qué prueba se demuestra cada requisito. El agente no escribe código hasta que la apruebo.
2. **La prueba va antes que el código.** Para cada regla nueva se escribe una prueba que falla, después el código que la hace pasar.
3. **Un script comprueba que ningún requisito se queda sin su prueba.**

A noviembre de 2026 hay 568 pruebas unitarias y unas 290 en un navegador real, que corren en escritorio y en móvil, con comprobación de accesibilidad. Todo se prueba en local, nunca contra la web publicada, y el despliegue lo hago yo: el agente lo prepara, pero no lo lanza.

Un ejemplo de por qué vale la pena: una auditoría de mis repositorios mostró que el Stack enseñaba 37 herramientas en 21 repositorios cuando eran 67 en 23. El script se saltaba las copias, leía solo unos pocos archivos de Python y no conocía varias herramientas. Lo arreglamos con pruebas que fijan cada caso, para que no vuelva a pasar.
