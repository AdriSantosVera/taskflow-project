require("./config/env");

const express = require("express");
const cors = require("cors");
const { performance } = require("perf_hooks");
const taskRoutes = require("./routes/task.routes");
const categoryRoutes = require("./routes/category.routes");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./config/swagger");

const app = express();

app.use(cors());
app.use(express.json());

const loggerAcademico = (req, res, next) => {
  const inicio = performance.now();

  res.on("finish", () => {
    const duracion = performance.now() - inicio;
    // eslint-disable-next-line no-console
    console.log(`[${req.method}] ${req.originalUrl} - Estado: ${res.statusCode} (${duracion.toFixed(2)}ms)`);
  });

  next();
};

app.use(loggerAcademico);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get("/", (req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/v1/tasks", taskRoutes);
app.use("/api/v1/categories", categoryRoutes);

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  if (err && err.message === "NOT_FOUND") {
    return res.status(404).json({ error: "Recurso no encontrado" });
  }

  // eslint-disable-next-line no-console
  console.error(err);
  return res.status(500).json({ error: "Error interno del servidor" });
});

const PORT = Number(process.env.PORT);

if (require.main === module) {
  app.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;
