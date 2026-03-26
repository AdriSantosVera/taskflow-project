# Bootcamp Project

Repositorio con dos entregables del bootcamp: una landing estática y una app completa de tareas con frontend + backend.

## Proyectos

### Solvion IA

Landing page estática para una empresa ficticia de IA.

Tecnologías:
- HTML5
- CSS3

Características:
- HTML semántico
- Layout con Flexbox y Grid
- Secciones: presentación, servicios, proyectos y contacto
- Estilos personalizados y hover

---

### TaskFlow Registro

Aplicación de gestión de tareas con UI premium y backend REST.

Tecnologías:
- HTML5
- JavaScript vanilla
- Tailwind CSS
- Node.js + Express

Funciones clave:
- CRUD de tareas con fecha, carpeta y prioridad
- Filtros por estado, prioridad y orden alfabético
- Calendario interactivo + reloj
- Modo claro/oscuro
- Backend REST con validaciones
- UI responsive y feedback visual (loading/error/toast)

Cambios recientes:
- UI más compacta en móvil
- Filtros convertidos a selectores
- Estadísticas simplificadas
- Fondo con partículas animadas
- Frontend conectado a API vía `fetch` (sin LocalStorage)

## Backend TaskFlow

Arquitectura por capas:

```
server/
  src/
    config/
      env.js
    controllers/
      task.controller.js
    routes/
      task.routes.js
    services/
      task.service.js
    index.js
```

Flujo:
1. **Routes** → mapean rutas HTTP a controladores.
2. **Controllers** → validan `req.body` y devuelven códigos HTTP correctos.
3. **Services** → lógica pura en memoria (`tasks = []`), sin dependencia de Express.

Documentación completa del backend en [server/README.md](/Users/adri/Developer/taskflow-project/server/README.md).

### Middlewares
- `express.json()` para parseo de JSON.
- `cors()` para habilitar CORS.
- **Logger académico**: registra método, URL y tiempo de respuesta.
- **Middleware global de errores**: traduce `NOT_FOUND` a 404 y el resto a 500.

### API REST (ejemplos)
Base URL: `http://localhost:3000/api/v1/tasks`

**GET /tasks**
```bash
curl http://localhost:3000/api/v1/tasks
```

**POST /tasks**
```bash
curl -X POST http://localhost:3000/api/v1/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"Nueva tarea","priority":"media","date":"2026-03-23","folder":"General"}'
```

**PATCH /tasks/:id**
```bash
curl -X PATCH http://localhost:3000/api/v1/tasks/ID \
  -H "Content-Type: application/json" \
  -d '{"completed": true}'
```

**DELETE /tasks/:id**
```bash
curl -X DELETE http://localhost:3000/api/v1/tasks/ID
```

## Objetivos del proyecto

Este repositorio refleja el trabajo realizado durante el bootcamp y la aplicación práctica de:
- HTML semántico
- CSS y diseño visual
- Layout responsive
- Manipulación del DOM con JavaScript
- Persistencia de datos mediante API
- Organización de interfaces interactivas
- Despliegue de aplicaciones frontend

## Testing

Las pruebas manuales y de integración (Postman) están documentadas en:

- [server/README.md](/Users/adri/Developer/taskflow-project/server/README.md)

## Despliegue

### Vercel
[Ver proyecto en Vercel](https://taskflow-registro.vercel.app/)

### GitHub
[Ver repositorio en GitHub](https://github.com/AdriSantosVera/taskflow-project)
