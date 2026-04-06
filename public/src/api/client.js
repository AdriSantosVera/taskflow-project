const isLocalhost = ["localhost", "127.0.0.1"].includes(window.location.hostname);
const BACKEND_URL = isLocalhost ? "http://localhost:3000" : "";
const TASKS_URL = `${BACKEND_URL}/api/v1/tasks`;
const CATEGORIES_URL = `${BACKEND_URL}/api/v1/categories`;

async function parseResponse(response, fallbackMessage) {
  if (response.status === 204) {
    return null;
  }

  let data = null;
  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    throw new Error(data?.error || fallbackMessage);
  }

  return data;
}

export async function obtenerTareas() {
  const response = await fetch(TASKS_URL);
  return parseResponse(response, "Error al obtener las tareas");
}

export async function crearTarea(payload) {
  const response = await fetch(TASKS_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  return parseResponse(response, "Error al crear la tarea");
}

export async function actualizarTarea(id, payload) {
  const response = await fetch(`${TASKS_URL}/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  return parseResponse(response, "Error al actualizar la tarea");
}

export async function eliminarTarea(id) {
  const response = await fetch(`${TASKS_URL}/${id}`, {
    method: "DELETE"
  });

  return parseResponse(response, "Error al eliminar la tarea");
}

export async function obtenerCategorias() {
  const response = await fetch(CATEGORIES_URL);
  return parseResponse(response, "Error al obtener las categorías");
}

export async function crearCategoria(nombre) {
  const response = await fetch(CATEGORIES_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nombre })
  });

  return parseResponse(response, "Error al crear la categoría");
}

export async function eliminarCategoria(nombre) {
  const response = await fetch(`${CATEGORIES_URL}/${encodeURIComponent(nombre)}`, {
    method: "DELETE"
  });

  return parseResponse(response, "Error al eliminar la categoría");
}
