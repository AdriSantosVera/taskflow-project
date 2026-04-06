const { randomUUID } = require("crypto");

let tasks = [];

function obtenerTodas() {
  return tasks;
}

function crearTarea(data) {
  const now = new Date().toISOString();
  const task = {
    id: randomUUID(),
    title: data.title,
    completed: data.completed ?? false,
    createdAt: now,
    folder: data.folder || "General",
    date: data.date || null,
    priority: data.priority || "media"
  };

  tasks.unshift(task);
  return task;
}

function actualizarTarea(id, updates) {
  const index = tasks.findIndex((task) => task.id === id);
  if (index === -1) {
    throw new Error("NOT_FOUND");
  }

  const current = tasks[index];
  const next = {
    ...current,
    ...updates
  };

  tasks[index] = next;
  return next;
}

function eliminarTarea(id) {
  const index = tasks.findIndex((task) => task.id === id);
  if (index === -1) {
    throw new Error("NOT_FOUND");
  }

  tasks = tasks.filter((task) => task.id !== id);
}

module.exports = {
  obtenerTodas,
  crearTarea,
  actualizarTarea,
  eliminarTarea
};
