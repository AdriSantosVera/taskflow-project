const taskService = require("../services/task.service");

function isValidPriority(priority) {
  return ["alta", "media", "baja"].includes(priority);
}

function isValidDate(date) {
  return typeof date === "string" && /^\d{4}-\d{2}-\d{2}$/.test(date);
}

function toClientPayload(task) {
  return {
    ...task,
    texto: task.title,
    categoria: task.folder,
    fecha: task.date,
    prioridad: task.priority,
    completada: task.completed
  };
}

function getAll(req, res) {
  const tasks = taskService.obtenerTodas();
  res.json(tasks.map(toClientPayload));
}

function create(req, res) {
  const { title, texto, folder, categoria, date, fecha, priority, prioridad, completed, completada } = req.body;

  const rawTitle = texto ?? title;
  const rawFolder = categoria ?? folder;
  const rawDate = fecha ?? date;
  const rawPriority = prioridad ?? priority;
  const rawCompleted = completada ?? completed;

  if (!rawTitle || typeof rawTitle !== "string" || rawTitle.trim().length < 3) {
    return res.status(400).json({ error: "El título es obligatorio y debe tener al menos 3 caracteres." });
  }

  if (rawPriority && !isValidPriority(rawPriority)) {
    return res.status(400).json({ error: "La prioridad debe ser alta, media o baja." });
  }

  if (rawDate && !isValidDate(rawDate)) {
    return res.status(400).json({ error: "La fecha debe tener formato YYYY-MM-DD." });
  }

  if (rawFolder && typeof rawFolder !== "string") {
    return res.status(400).json({ error: "La carpeta debe ser un texto válido." });
  }

  if (rawCompleted !== undefined && typeof rawCompleted !== "boolean") {
    return res.status(400).json({ error: "El estado completada debe ser booleano." });
  }

  const task = taskService.crearTarea({
    title: rawTitle.trim(),
    folder: rawFolder ? rawFolder.trim() : undefined,
    date: rawDate ?? null,
    priority: rawPriority ?? undefined,
    completed: rawCompleted
  });

  return res.status(201).json(toClientPayload(task));
}

function update(req, res) {
  const { id } = req.params;
  const { title, texto, completed, completada, folder, categoria, date, fecha, priority, prioridad } = req.body;
  const rawTitle = texto ?? title;
  const rawCompleted = completada ?? completed;
  const rawFolder = categoria ?? folder;
  const rawDate = fecha ?? date;
  const rawPriority = prioridad ?? priority;

  if (rawTitle !== undefined && (typeof rawTitle !== "string" || rawTitle.trim().length < 3)) {
    return res.status(400).json({ error: "El título debe tener al menos 3 caracteres." });
  }

  if (rawCompleted !== undefined && typeof rawCompleted !== "boolean") {
    return res.status(400).json({ error: "El campo completed debe ser booleano." });
  }

  if (rawPriority !== undefined && !isValidPriority(rawPriority)) {
    return res.status(400).json({ error: "La prioridad debe ser alta, media o baja." });
  }

  if (rawDate !== undefined && rawDate !== null && !isValidDate(rawDate)) {
    return res.status(400).json({ error: "La fecha debe tener formato YYYY-MM-DD." });
  }

  if (rawFolder !== undefined && typeof rawFolder !== "string") {
    return res.status(400).json({ error: "La carpeta debe ser un texto válido." });
  }

  const updated = taskService.actualizarTarea(id, {
    title: rawTitle ? rawTitle.trim() : undefined,
    completed: rawCompleted,
    folder: rawFolder ? rawFolder.trim() : undefined,
    date: rawDate,
    priority: rawPriority
  });

  return res.json(toClientPayload(updated));
}

function remove(req, res) {
  const { id } = req.params;
  taskService.eliminarTarea(id);
  return res.status(204).send();
}

module.exports = {
  getAll,
  create,
  update,
  remove
};
