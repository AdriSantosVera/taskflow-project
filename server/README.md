# TaskFlow Backend (Express API)

Backend RESTful para TaskFlow Registro, construido con Node.js + Express y arquitectura por capas.
Este documento describe la arquitectura, los middlewares, el modelo de datos y el contrato HTTP de la API.

## Requisitos

- Node.js 18+
- npm

## Instalación

```bash
cd server
npm install
```

## Arranque rápido

```bash
npm run dev
```

Servidor disponible en:
```
http://localhost:3000
```

## Variables de entorno

Crea un archivo `.env` con:

```
PORT=3000
```

El servidor valida que `PORT` exista en `src/config/env.js`. Si falta, se lanza un error y el servidor no inicia.

## Scripts

```bash
npm run dev
```

Inicia el servidor con `nodemon` en `src/index.js`.

## Arquitectura por capas

```
server/
  src/
    config/
      env.js
      swagger.js
    controllers/
      task.controller.js
    routes/
      task.routes.js
    services/
      task.service.js
    index.js
```

### Flujo de una petición

1. **Routes**: mapean ruta y verbo HTTP → controlador.
2. **Controllers**: validan datos (`req.body`, `req.params`) y construyen la respuesta HTTP.
3. **Services**: lógica de negocio pura en memoria (`tasks = []`).

La capa de servicios **no conoce Express** y es testeable de forma aislada.

## Modelo de datos

Cada tarea sigue este esquema:

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

## Middlewares

### `express.json()`
Middleware de parseo. Convierte el body JSON en un objeto accesible desde `req.body`.

### `cors()`
Habilita CORS para permitir que el frontend consuma la API desde otro origen.

### Logger académico (middleware propio)
Registra método, URL, status y duración de la petición. Útil para trazabilidad básica.

### Middleware global de errores
Middleware de 4 parámetros `(err, req, res, next)` que captura fallos no controlados:

- Si `err.message === 'NOT_FOUND'` → `404 Not Found`.
- Cualquier otro error → `500 Internal Server Error` y `console.error(err)`.

## Validaciones (frontera de red)

Antes de llegar a la capa de servicios, el controlador valida:

- `title`: obligatorio, tipo string, mínimo 3 caracteres.
- `priority`: opcional; si existe debe ser `alta`, `media` o `baja`.
- `date`: opcional; debe tener formato `YYYY-MM-DD`.
- `folder`: opcional; string.

Si falla la validación → `400 Bad Request` con mensaje de error.

## API REST

Base URL:
```
http://localhost:3000/api/v1/tasks
```

### GET /tasks
```bash
curl http://localhost:3000/api/v1/tasks
```

**Response 200**
```json
[
  {
    "id": "uuid",
    "title": "Llamar comercial",
    "completed": false,
    "createdAt": "2026-03-26T10:13:35.612Z",
    "folder": "General",
    "date": "2026-03-26",
    "priority": "media"
  }
]
```

### POST /tasks
```bash
curl -X POST http://localhost:3000/api/v1/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"Nueva tarea","priority":"media","date":"2026-03-26","folder":"General"}'
```

**Response 201**
```json
{
  "id": "uuid",
  "title": "Nueva tarea",
  "completed": false,
  "createdAt": "2026-03-26T10:13:35.612Z",
  "folder": "General",
  "date": "2026-03-26",
  "priority": "media"
}
```

### PATCH /tasks/:id
```bash
curl -X PATCH http://localhost:3000/api/v1/tasks/ID \
  -H "Content-Type: application/json" \
  -d '{"completed": true}'
```

**Response 200**
```json
{
  "id": "uuid",
  "title": "Nueva tarea",
  "completed": true,
  "createdAt": "2026-03-26T10:13:35.612Z",
  "folder": "General",
  "date": "2026-03-26",
  "priority": "media"
}
```

### DELETE /tasks/:id
```bash
curl -X DELETE http://localhost:3000/api/v1/tasks/ID
```

## Respuestas y códigos HTTP

- `200 OK`: lectura y actualización correctas.
- `201 Created`: creación correcta.
- `204 No Content`: eliminación correcta.
- `400 Bad Request`: datos inválidos (validación).
- `404 Not Found`: recurso inexistente.
- `500 Internal Server Error`: error no controlado.

## Casos de error (ejemplos)

**POST sin título**
```json
{ "error": "El título es obligatorio y debe tener al menos 3 caracteres." }
```

**PATCH/DELETE con ID inexistente**
```json
{ "error": "Recurso no encontrado" }
```

## Pruebas de integración (Postman)

- GET `/api/v1/tasks` → `200 OK`
- POST válido → `201 Created`
- POST sin `title` → `400 Bad Request`
- PATCH con id válido → `200 OK`
- PATCH con id inexistente → `404 Not Found`
- DELETE con id válido → `204 No Content`
- DELETE con id inexistente → `404 Not Found`

## Swagger

Documentación interactiva disponible en:

```
http://localhost:3000/api-docs
```

## Notas importantes

- Persistencia **en memoria**: al reiniciar el servidor se pierden las tareas.
- Para persistencia real, se requiere base de datos (MongoDB / SQLite).
