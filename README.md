# Taskflow Registro

Aplicación web de gestión de tareas desarrollada durante el bootcamp. El proyecto reúne un frontend en HTML, Tailwind CSS y JavaScript vanilla, junto con un backend en Node.js + Express organizado por capas.

## Descripción

Taskflow Registro permite organizar tareas por carpeta, fecha y prioridad desde una interfaz visual compacta. La aplicación incluye calendario interactivo, filtros avanzados, estadísticas, modo claro/oscuro y conexión a una API REST propia.

## Tecnologías

- HTML5
- JavaScript vanilla
- Tailwind CSS
- Node.js
- Express
- CORS
- Dotenv
- Swagger UI
- Postman

## Funcionalidades

- Crear, editar, completar y eliminar tareas
- Organizar tareas por carpetas
- Crear y eliminar carpetas
- Seleccionar tareas por fecha desde el calendario
- Filtrar por estado, prioridad y búsqueda por texto
- Ordenar alfabéticamente
- Marcar todas las tareas visibles como completadas
- Borrar tareas completadas
- Visualizar estadísticas de tareas completadas y pendientes
- Cambiar entre modo claro y modo oscuro
- Mostrar feedback visual con mensajes de éxito y error
- Consumir una API REST mediante `fetch`
- Documentar y probar la API con Swagger y Postman

## Estructura del proyecto

```text
taskflow-registro/
  dist/
  docs/
    backend-api.md
  server/
    src/
      config/
      controllers/
      routes/
      services/
      index.js
    README.md
    package.json
  src/
    api/
      client.js
    input.css
    utils.js
  app.js
  index.html
  package.json
  postcss.config.js
  tailwind.config.js
```

## Arquitectura

### Frontend

El frontend está construido sin frameworks. La interfaz principal se organiza en:

- [index.html](/Users/adri/Developer/taskflow-project/taskflow-registro/index.html): estructura base de la aplicación
- [app.js](/Users/adri/Developer/taskflow-project/taskflow-registro/app.js): lógica de interacción, renderizado, estado global y eventos
- [client.js](/Users/adri/Developer/taskflow-project/taskflow-registro/src/api/client.js): capa de comunicación HTTP con el backend
- [utils.js](/Users/adri/Developer/taskflow-project/taskflow-registro/src/utils.js): utilidades de formato y clases CSS auxiliares

La aplicación trabaja con estados de interfaz para:

- carga inicial de datos
- éxito en operaciones de creación, edición y borrado
- error de red o validación

### Backend

El backend sigue una arquitectura por capas:

1. `routes`
   Reciben la petición HTTP y delegan en el controlador adecuado.

2. `controllers`
   Validan los datos de entrada, adaptan el contrato de red y construyen la respuesta HTTP.

3. `services`
   Contienen la lógica de negocio y la persistencia temporal en memoria.

La documentación detallada del backend está en [server/README.md](/Users/adri/Developer/taskflow-project/taskflow-registro/server/README.md).

## Middlewares

El backend utiliza varios middlewares con responsabilidades separadas:

- `express.json()`
  Convierte el cuerpo de las peticiones JSON en objetos JavaScript accesibles desde `req.body`.

- `cors()`
  Habilita el intercambio de recursos entre el frontend y el backend cuando se ejecutan en orígenes distintos.

- `loggerAcademico`
  Middleware personalizado que mide tiempo de ejecución y registra método, URL y código de estado al finalizar cada respuesta.

- middleware global de errores
  Captura excepciones no controladas y traduce errores semánticos a respuestas HTTP coherentes, por ejemplo `404` para `NOT_FOUND` y `500` para fallos internos.

## API REST

Base URL local:

```text
http://localhost:3000/api/v1
```

### Endpoints de tareas

- `GET /tasks`
- `POST /tasks`
- `PATCH /tasks/:id`
- `PUT /tasks/:id`
- `DELETE /tasks/:id`

### Endpoints de carpetas

- `GET /categories`
- `POST /categories`
- `DELETE /categories/:nombre`

### Ejemplos

Obtener tareas:

```bash
curl http://localhost:3000/api/v1/tasks
```

Crear una tarea:

```bash
curl -X POST http://localhost:3000/api/v1/tasks \
  -H "Content-Type: application/json" \
  -d '{"texto":"Nueva tarea","categoria":"Trabajo","prioridad":"media","fecha":"2026-04-03"}'
```

Actualizar una tarea:

```bash
curl -X PATCH http://localhost:3000/api/v1/tasks/ID \
  -H "Content-Type: application/json" \
  -d '{"completada":true}'
```

Eliminar una tarea:

```bash
curl -X DELETE http://localhost:3000/api/v1/tasks/ID
```

## Documentación de la API

Swagger está disponible en local en:

[http://localhost:3000/api-docs](http://localhost:3000/api-docs)

Además, la explicación conceptual de herramientas relacionadas con backend y testing está en:

[docs/backend-api.md](/Users/adri/Developer/taskflow-project/taskflow-registro/docs/backend-api.md)

## Pruebas

Se han realizado pruebas manuales e integración sobre la aplicación:

- carga inicial de tareas y carpetas
- creación de tareas válidas
- validación de título mínimo
- marcado de tareas como completadas
- borrado de tareas
- creación y borrado de carpetas
- filtrado por estado
- filtrado por prioridad
- búsqueda por texto
- orden alfabético
- selección y limpieza de filtro por fecha
- visualización responsive
- cambio de tema

Pruebas de integración con Postman:

- `GET /api/v1/tasks` devuelve `200 OK`
- `POST /api/v1/tasks` con body válido devuelve `201 Created`
- `POST /api/v1/tasks` inválido devuelve `400 Bad Request`
- `PATCH /api/v1/tasks/:id` con id válido actualiza correctamente
- `DELETE /api/v1/tasks/:id` con id inexistente devuelve `404 Not Found`

## Estado actual

Actualmente el backend utiliza persistencia en memoria. Esto significa que:

- las tareas funcionan correctamente mientras el servidor está encendido
- al reiniciar el backend, los datos se pierden

El siguiente paso natural sería incorporar persistencia real en archivo o base de datos.

## Ejecución local

### Frontend

Abre [index.html](/Users/adri/Developer/taskflow-project/taskflow-registro/index.html) con Live Server o un servidor estático local.

### Backend

Desde [server](/Users/adri/Developer/taskflow-project/taskflow-registro/server):

```bash
npm install
npm run dev
```

## Repositorio

[Ver repositorio en GitHub](https://github.com/AdriSantosVera/taskflow-project)
