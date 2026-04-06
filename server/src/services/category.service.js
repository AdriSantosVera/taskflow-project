const { BASE_CATEGORIES, readState, writeState } = require("./storage.service");

async function obtenerTodas() {
  const state = await readState();
  return state.categories;
}

async function crear(nombre) {
  const state = await readState();
  const trimmed = String(nombre || "").trim();
  if (!trimmed) {
    throw new Error("INVALID");
  }

  const exists = state.categories.some((cat) => cat.toLowerCase() === trimmed.toLowerCase());
  if (exists) {
    throw new Error("DUPLICATE");
  }

  state.categories.push(trimmed);
  await writeState(state);
  return trimmed;
}

async function eliminar(nombre) {
  const state = await readState();
  const trimmed = String(nombre || "").trim();
  if (!trimmed) {
    throw new Error("INVALID");
  }

  if (BASE_CATEGORIES.some((cat) => cat.toLowerCase() === trimmed.toLowerCase())) {
    throw new Error("FORBIDDEN");
  }

  const index = state.categories.findIndex((cat) => cat.toLowerCase() === trimmed.toLowerCase());
  if (index === -1) {
    return;
  }

  state.categories = state.categories.filter((cat) => cat.toLowerCase() !== trimmed.toLowerCase());
  await writeState(state);
}

module.exports = {
  obtenerTodas,
  crear,
  eliminar
};
