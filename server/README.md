# Taskflow Registro Backend

Backend RESTful de `Taskflow Registro`, desarrollado con Node.js y Express. Este servicio expone la API que consume el frontend, centraliza la validación de datos y organiza la lógica mediante una arquitectura por capas.

## Objetivo

El propósito de este backend es desacoplar la lógica de persistencia y validación del navegador, permitiendo que el frontend trabaje contra un contrato HTTP claro, documentado y reutilizable.

## Stack técnico

- Node.js
- Express
- CORS
- Dotenv
- Swagger UI
- Swagger JSDoc
- Nodemon

## Estructura

```text
server/
  src/
    config/
      env.js
      swagger.js
    controllers/
      task.controller.js
      category.controller.js
    routes/
      task.routes.js
      category.routes.js
    services/
      task.service.js
      category.service.js
    index.js
  .env
  package.json
  README.md
  vercel.json
```

## Arquitectura por capas

La API sigue una separación estricta de responsabilidades:

### 1. Capa de rutas

Los archivos en `routes/` definen los endpoints y conectan cada verbo HTTP con su controlador correspondiente. Esta capa no contiene lógica de negocio.

### 2. Capa de controladores

Los controladores reciben `req`, validan la entrada, adaptan el contrato de red y devuelven la respuesta HTTP. Aquí se traduce el payload del frontend al formato interno del servidor.

### 3. Capa de servicios

Los servicios encapsulan la lógica de negocio y el almacenamiento temporal en memoria. Esta capa no depende de Express y puede evolucionar en el futuro hacia persistencia en archivo o base de datos.

## Flujo de petición

1. El cliente envía una petición HTTP.
2. Express la recibe y ejecuta los middlewares globales.
3. La ruta correspondiente delega en el controlador.
4. El controlador valida datos y llama al servicio.
5. El servicio ejecuta la lógica y devuelve el resultado.
6. El controlador responde con el código HTTP adecuado.
7. Si ocurre un error, el middleware global de errores lo transforma en una respuesta controlada.

## Variables de entorno

Archivo requerido:

```env
PORT=3000
```

La configuración se carga en [src/config/env.js](/Users/adri/Developer/taskflow-project/taskflow-registro/server/src/config/env.js).

El servidor no arranca si `PORT` no está definido. Esto fuerza una configuración mínima válida desde el inicio.

## Scripts

Instalación:

```bash
npm install
```

Desarrollo:

```bash
npm run dev
```

Este script ejecuta `nodemon src/index.js`, reiniciando automáticamente el servidor cuando se guardan cambios.

## Middlewares

### `express.json()`

Parsea cuerpos JSON y los expone como objetos en `req.body`. Es imprescindible para procesar correctamente peticiones `POST`, `PATCH` y `PUT`.

### `cors()`

Permite que el frontend consuma la API desde otro origen, por ejemplo desde Live Server en `127.0.0.1:5500`.

### `loggerAcademico`

Middleware personalizado que registra:

- método HTTP
- URL solicitada
- código de estado
- duración de la petición en milisegundos

Su objetivo es mejorar la trazabilidad y facilitar el debugging durante desarrollo.

### Middleware global de errores

Se declara al final del ciclo de Express con la firma:

```js
(err, req, res, next)
```

Responsabilidades:

- traducir `NOT_FOUND` a `404 Not Found`
- registrar errores inesperados con `console.error`
- devolver `500 Internal Server Error` sin exponer detalles sensibles

## Modelo de datos

### Tarea

Internamente el backend trabaja con este esquema:

```json
{
  "id": "uuid",
  "title": "string",
  "completed": false,
  "createdAt": "ISO8601",
  "folder": "string",
  "date": "YYYY-MM-DD",
  "priority": "alta | media | baja"
}
```

Además, por compatibilidad con el frontend actual, el backend acepta y devuelve alias como:

- `texto` ↔ `title`
- `categoria` ↔ `folder`
- `fecha` ↔ `date`
- `prioridad` ↔ `priority`
- `completada` ↔ `completed`

### Categoría

Las categorías se gestionan como una colección simple de nombres.

Categorías base iniciales:

- `Todas`
- `Trabajo`
- `Estudios`
- `Personal`

## Validación de entrada

La validación ocurre en la frontera de red, antes de que los datos lleguen a la lógica de negocio.

### Reglas de tareas

- `title` o `texto`: obligatorio, string, mínimo 3 caracteres
- `priority` o `prioridad`: opcional, pero si existe debe ser `alta`, `media` o `baja`
- `date` o `fecha`: opcional, formato `YYYY-MM-DD`
- `folder` o `categoria`: opcional, string
- `completed` o `completada`: opcional, booleano

### Reglas de categorías

- `nombre`: obligatorio, string no vacío

Si falla alguna validación, la API devuelve `400 Bad Request`.

## API REST

Base URL:

```text
http://localhost:3000/api/v1
```

### Endpoints de tareas

- `GET /tasks`
- `POST /tasks`
- `PATCH /tasks/:id`
- `PUT /tasks/:id`
- `DELETE /tasks/:id`

### Endpoints de categorías

- `GET /categories`
- `POST /categories`
- `DELETE /categories/:nombre`

## Ejemplos de uso

### Obtener tareas

```bash
curl http://localhost:3000/api/v1/tasks
```

### Crear una tarea

```bash
curl -X POST http://localhost:3000/api/v1/tasks \
  -H "Content-Type: application/json" \
  -d '{"texto":"Preparar entrega","categoria":"Trabajo","prioridad":"alta","fecha":"2026-04-03"}'
```

### Marcar una tarea como completada

```bash
curl -X PATCH http://localhost:3000/api/v1/tasks/ID \
  -H "Content-Type: application/json" \
  -d '{"completada": true}'
```

### Eliminar una tarea

```bash
curl -X DELETE http://localhost:3000/api/v1/tasks/ID
```

### Obtener categorías

```bash
curl http://localhost:3000/api/v1/categories
```

### Crear categoría

```bash
curl -X POST http://localhost:3000/api/v1/categories \
  -H "Content-Type: application/json" \
  -d '{"nombre":"Clientes"}'
```

## Códigos HTTP

- `200 OK`: lectura o actualización correcta
- `201 Created`: creación correcta
- `204 No Content`: borrado correcto
- `400 Bad Request`: validación fallida
- `404 Not Found`: recurso inexistente
- `500 Internal Server Error`: fallo no controlado

## Casos de error

### Crear tarea sin título válido

```json
{
  "error": "El título es obligatorio y debe tener al menos 3 caracteres."
}
```

### Eliminar o actualizar un recurso inexistente

```json
{
  "error": "Recurso no encontrado"
}
```

## Integraciones

### Integración con el frontend

El frontend de `Taskflow Registro` consume esta API mediante `fetch` desde:

[src/api/client.js](/Users/adri/Developer/taskflow-project/taskflow-registro/src/api/client.js)

Durante desarrollo local, la integración se realiza contra:

```text
http://localhost:3000
```

Esto permite:

- cargar tareas al arrancar la interfaz
- crear tareas desde el modal
- actualizar estado de completado
- borrar tareas completadas
- crear y eliminar carpetas

### Integración con Swagger

La API está documentada de forma interactiva mediante Swagger UI en:

[http://localhost:3000/api-docs](http://localhost:3000/api-docs)

La especificación se genera desde:

[src/config/swagger.js](/Users/adri/Developer/taskflow-project/taskflow-registro/server/src/config/swagger.js)

Swagger permite:

- explorar endpoints
- revisar esquemas de entrada y salida
- probar peticiones sin necesidad de Postman

### Integración con Postman

Postman se utiliza para pruebas de integración manuales y verificación de errores HTTP.

Casos probados:

- `GET /api/v1/tasks`
- `POST /api/v1/tasks` válido
- `POST /api/v1/tasks` inválido
- `PATCH /api/v1/tasks/:id`
- `DELETE /api/v1/tasks/:id`
- `GET /api/v1/categories`
- `POST /api/v1/categories`

### Integración con Vercel

El backend incluye:

[vercel.json](/Users/adri/Developer/taskflow-project/taskflow-registro/server/vercel.json)

Esto prepara el proyecto para despliegue en Vercel. No obstante, hay una limitación importante:

- actualmente la persistencia es en memoria
- en entornos serverless esta estrategia no garantiza conservación de datos entre ejecuciones

Para un despliegue estable en producción sería necesario incorporar persistencia real.

## Swagger

Documentación interactiva disponible en:

```text
http://localhost:3000/api-docs
```

## Pruebas de integración

Pruebas realizadas:

- `GET /api/v1/tasks` devuelve `200 OK`
- `POST /api/v1/tasks` con body válido devuelve `201 Created`
- `POST /api/v1/tasks` con título inválido devuelve `400 Bad Request`
- `PATCH /api/v1/tasks/:id` actualiza correctamente el estado de una tarea
- `DELETE /api/v1/tasks/:id` devuelve `204 No Content`
- `DELETE /api/v1/tasks/:id` con id inexistente devuelve `404 Not Found`
- `GET /api/v1/categories` devuelve categorías base
- `POST /api/v1/categories` crea nuevas carpetas

## Limitaciones actuales

La persistencia está implementada en memoria:

- los datos funcionan correctamente mientras el proceso Node sigue activo
- si el servidor se reinicia, las tareas y categorías dinámicas se pierden
- en Vercel esta estrategia no es adecuada como solución definitiva

## Próxima mejora recomendada

Para convertir esta API en una solución más robusta, el siguiente paso recomendado es sustituir la persistencia en memoria por:

- archivo JSON
- SQLite
- MongoDB

## Proyecto relacionado

La aplicación frontend asociada está documentada en:

[README.md](/Users/adri/Developer/taskflow-project/taskflow-registro/README.md)
