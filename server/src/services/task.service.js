const { randomUUID } = require("crypto");
const { readState, writeState } = require("./storage.service");

async function obtenerTodas() {
  const state = await readState();
  return state.tasks;
}

async function crearTarea(data) {
  const state = await readState();
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

  state.tasks.unshift(task);
  await writeState(state);
  return task;
}

async function actualizarTarea(id, updates) {
  const state = await readState();
  const index = state.tasks.findIndex((task) => task.id === id);
  if (index === -1) {
    throw new Error("NOT_FOUND");
  }

  const current = state.tasks[index];
  const next = {
    ...current,
    ...updates
  };

  state.tasks[index] = next;
  await writeState(state);
  return next;
}

async function eliminarTarea(id) {
  const state = await readState();
  const index = state.tasks.findIndex((task) => task.id === id);
  if (index === -1) {
    throw new Error("NOT_FOUND");
  }

  state.tasks = state.tasks.filter((task) => task.id !== id);
  await writeState(state);
}

module.exports = {
  obtenerTodas,
  crearTarea,
  actualizarTarea,
  eliminarTarea
};
