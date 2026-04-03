## Introducción

En este documento se describe cómo se ha utilizado Cursor como entorno de desarrollo asistido por inteligencia artificial.

Se explicará cómo esta herramienta puede ayudar a analizar código, generar sugerencias, detectar errores y mejorar la productividad durante el desarrollo de software gracias a su integración con asistentes de IA.

# Cursor Workflow en TaskFlow

## 1. Objetivo
En este documento explico cómo he utilizado Cursor dentro del proyecto TaskFlow para explorar el código, entender mejor su estructura, modificar funciones existentes y generar mejoras asistidas por IA.

## 2. Instalación y apertura del proyecto
Instalé Cursor y abrí el repositorio TaskFlow desde el explorador de archivos del editor. Una vez dentro, revisé la estructura general del proyecto y confirmé que podía acceder al código, a la terminal integrada y al chat contextual.

## 3. Exploración de la interfaz
Durante la práctica utilicé estas partes de la interfaz de Cursor:

- **Explorador de archivos**: para moverme entre HTML, CSS y JavaScript del proyecto.
- **Terminal integrada**: para ejecutar comandos y revisar archivos del repositorio.
- **Chat contextual**: para pedir explicaciones sobre funciones y bloques de código.
- **Editor**: para escribir comentarios, probar autocompletado y aplicar cambios inline.

##  Prueba de autocompletado
Probé el autocompletado escribiendo comentarios que describían funciones que quería crear o mejorar. Por ejemplo:

```js
// función para guardar tareas en localStorage
// función para filtrar tareas completadas

 ### Uso del chat contextual

También utilicé el chat integrado de Cursor para entender mejor algunas partes del código.

Por ejemplo, le pedí cosas como:

"Explícame qué hace esta función"

"¿Se puede simplificar este código?"

"¿Hay errores o mejoras posibles aquí?"

Esto fue bastante útil porque a veces cuando lees código de un proyecto grande cuesta entender todo a la primera.

### Uso de edición inline

Probé también la función de edición inline, que permite modificar directamente una función usando instrucciones en lenguaje natural.

La utilicé principalmente para:

corregir pequeños errores,

mejorar nombres de variables,

simplificar funciones demasiado largas.

Esto fue cómodo porque no tuve que reescribir todo el código manualmente.

### Cambios en varios archivos con Composer

También probé una petición más grande usando Composer para ver cómo funcionaba cuando los cambios afectan a varios archivos.

Por ejemplo pedí mejorar la organización del código relacionado con las tareas. Cursor propuso cambios en diferentes partes del proyecto para mantener coherencia entre los archivos.

Esto demuestra que la herramienta puede ayudar no solo en pequeños cambios, sino también en mejoras más generales del proyecto.

### Atajos de teclado que más utilicé.
Cmd + P -  Buscar y abrir archivos
Cmd + B -  Mostrar/ocultar barra lateral
Cmd + K -  Editar código con IA en línea
Cmd + L -  Abrir el chat de IA
Cmd + J -  Mostrar/ocultar terminal
    


# Ejemplos donde Cursor mejoró mi código

Correcciones – Bug en loadTasks y unificación del filtrado (DRY).
Seguridad – Uso de escapeHtml para evitar XSS al pintar nombres de carpetas en el DOM.
Rendimiento – Debounce de 180 ms en el input de búsqueda.
UX y accesibilidad – Cierre con Escape, formulario de carpeta con Enter, y gestión de foco (restaurar foco al cerrar y focus trap con Tab).
Fechas e internacionalización – Nombres de mes con Intl.DateTimeFormat("es-ES", ...).
Estructura del código – Extracción del estado y persistencia a state.js y uso de módulos ES.

## Mejoras de mi código


- **`src/state.js`** – Estado y persistencia:
  - `state` (carpetas, tareas, selección, filtros, modales).
  - Carga/guardado: `loadFolders`, `loadTasks`, `saveFolders`, `saveTasks`.
  - Fechas: `formatDateKey`, `formatDisplayDate`.
  - Sincronización: `syncInitialSelection`, `syncDateForSelectedFolder`.

- **`src/utils.js`** – Helpers sin dependencias de DOM ni estado:
  - `escapeHtml`, `pluralize`, `toggleElementClasses`.
  - `getPriorityCssClasses`, `taskMatchesFilter`.

- **`app.js`** – Punto de entrada:
  - Referencias al DOM (nombres descriptivos: `foldersContainer`, `taskModal`, `clockHoursEl`, etc.).
  - Render y lógica de UI (modales, focus).
  - Registro de eventos.

## Instalación de MCP

1. inicie sesión en github.
2. fui a Developer settings.
3. tuve que generar un  access tokens > Tokens (classic).
4. Genere el token y lo copie.
5. Abrí Cursor y fui a Cursor Settings.
6. Busque  la sección MCP.
7. Add new server o en Open mcp.json para editar el archivo directamente.
8. Puse la configuración y el Tokens.
9. reiniciar el IDE. 

## casos en que se puede utilizar el MCP.

Cursor + GitHub
Estás programando y le dices al agente: "Crea un issue con los bugs que hemos encontrado hoy." El agente accede a tu repositorio y lo crea directamente, sin que abras el navegador.
2. Cursor + PostgreSQL
Le preguntas: "¿Cuántos usuarios se registraron esta semana?" El agente lanza la consulta a tu base de datos y te devuelve el resultado interpretado.
3. Claude + Google Drive
Le dices: "Busca el informe de marzo y resúmeme los puntos clave." El agente entra en tu Drive, localiza el archivo y te lo resume sin que lo abras ni copies nada.



