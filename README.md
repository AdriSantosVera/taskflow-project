# Bootcamp Project

Repositorio que reúne dos proyectos desarrollados durante el bootcamp, enfocados en maquetación web, diseño responsive y desarrollo frontend con JavaScript.

## Proyectos

### 1. Solvion IA

Landing page estática creada para una empresa ficticia especializada en inteligencia artificial.

#### Tecnologías
- HTML5
- CSS3

#### Características
- Estructura HTML semántica
- Diseño visual con CSS
- Layout con Flexbox y Grid
- Secciones de presentación, servicios, proyectos y contacto
- Estilos personalizados y efectos hover

---

### 2. TaskFlow Registro

Aplicación web de gestión de tareas desarrollada con JavaScript y Tailwind CSS.

#### Tecnologías
- HTML5
- JavaScript vanilla
- Tailwind CSS
- LocalStorage

#### Funcionalidades
- Crear tareas
- Editar tareas
- Marcar tareas como completadas
- Eliminar tareas
- Organización por carpetas
- Calendario para asignar fecha
- Prioridad de tareas
- Búsqueda por texto
- Filtros por estado (selector)
- Orden alfabético (A-Z)
- Filtro por prioridad
- Estadísticas de tareas (completadas y pendientes)
- Modo claro y oscuro
- Persistencia de datos con LocalStorage
- Fondo animado con partículas
- Diseño responsive para escritorio y móvil

#### Cambios recientes
- Interfaz más compacta en móvil (botones y filtros ordenados, menos separación vertical).
- Calendario con ajustes de spacing para mejor legibilidad.
- Filtros convertidos a selectores (estado, orden y prioridad).
- Estadísticas simplificadas a dos tarjetas (completadas y pendientes).
- Fondo con partículas animadas para dar profundidad visual.

## Objetivos del proyecto

Este repositorio refleja el trabajo realizado durante el bootcamp y la aplicación práctica de:
- HTML semántico
- CSS y diseño visual
- Layout responsive
- Manipulación del DOM con JavaScript
- Persistencia de datos en el navegador
- Organización de interfaces interactivas
- Despliegue de aplicaciones frontend

## Testing manual

Se han realizado pruebas manuales sobre la aplicación TaskFlow Registro para verificar su funcionamiento:

- Lista vacía: la interfaz muestra un estado vacío sin errores.
- Crear tarea sin título: la tarea no se guarda y el foco permanece en el campo de entrada.
- Crear tarea con título largo: el contenido se mantiene dentro del diseño sin romper la interfaz.
- Marcar tareas como completadas: el estado cambia correctamente y las estadísticas se actualizan.
- Eliminar tareas: las tareas desaparecen de la lista y se actualiza la persistencia.
- Persistencia: al recargar la página, los datos permanecen guardados en LocalStorage.
- Filtros: las vistas de todas, pendientes y completadas funcionan correctamente.
- Búsqueda: el filtrado por texto devuelve resultados coherentes.
- Calendario: las tareas se asocian correctamente a la fecha seleccionada.
- Carpetas: las tareas se organizan y muestran por carpeta.
- Prioridad: cada tarea puede guardar y mostrar su nivel de prioridad.
- Orden A-Z: las tareas se ordenan alfabéticamente cuando se selecciona la opción.
- Filtro por prioridad: se muestran solo las tareas según la prioridad seleccionada.
- Responsive: la aplicación se ha probado en escritorio y móvil.
- Modo oscuro: se ha comprobado la legibilidad general de la interfaz.

## Despliegue

### Vercel
[Ver proyecto en Vercel](https://taskflow-registro.vercel.app/)

### GitHub
[Ver repositorio en GitHub](https://github.com/AdriSantosVera/taskflow-project)
