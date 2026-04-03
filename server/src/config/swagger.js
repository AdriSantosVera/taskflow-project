const swaggerJSDoc = require("swagger-jsdoc");

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "TaskFlow API",
    version: "1.0.0",
    description: "API REST para gestión de tareas en TaskFlow."
  },
  servers: [
    { url: "http://localhost:3000", description: "Local" }
  ]
};

const options = {
  swaggerDefinition,
  apis: []
};

const swaggerSpec = swaggerJSDoc(options);

swaggerSpec.paths = {
  "/api/v1/tasks": {
    get: {
      summary: "Obtener todas las tareas",
      responses: {
        200: {
          description: "Lista de tareas"
        }
      }
    },
    post: {
      summary: "Crear una tarea",
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["title"],
              properties: {
                title: { type: "string" },
                folder: { type: "string" },
                date: { type: "string", example: "2026-03-25" },
                priority: { type: "string", enum: ["alta", "media", "baja"] }
              }
            }
          }
        }
      },
      responses: {
        201: { description: "Tarea creada" },
        400: { description: "Validación fallida" }
      }
    }
  },
  "/api/v1/tasks/{id}": {
    patch: {
      summary: "Actualizar una tarea",
      parameters: [
        { name: "id", in: "path", required: true, schema: { type: "string" } }
      ],
      requestBody: {
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                title: { type: "string" },
                completed: { type: "boolean" },
                folder: { type: "string" },
                date: { type: "string" },
                priority: { type: "string", enum: ["alta", "media", "baja"] }
              }
            }
          }
        }
      },
      responses: {
        200: { description: "Tarea actualizada" },
        400: { description: "Validación fallida" },
        404: { description: "No encontrada" }
      }
    },
    delete: {
      summary: "Eliminar una tarea",
      parameters: [
        { name: "id", in: "path", required: true, schema: { type: "string" } }
      ],
      responses: {
        204: { description: "Eliminada" },
        404: { description: "No encontrada" }
      }
    }
  }
};

module.exports = swaggerSpec;
