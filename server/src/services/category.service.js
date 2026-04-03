const BASE_CATEGORIES = ["Todas", "Trabajo", "Estudios", "Personal"];

let categories = [...BASE_CATEGORIES];

function obtenerTodas() {
  return categories;
}

function crear(nombre) {
  const trimmed = String(nombre || "").trim();
  if (!trimmed) {
    throw new Error("INVALID");
  }

  const exists = categories.some((cat) => cat.toLowerCase() === trimmed.toLowerCase());
  if (exists) {
    throw new Error("DUPLICATE");
  }

  categories.push(trimmed);
  return trimmed;
}

function eliminar(nombre) {
  const trimmed = String(nombre || "").trim();
  if (!trimmed) {
    throw new Error("INVALID");
  }

  if (BASE_CATEGORIES.some((cat) => cat.toLowerCase() === trimmed.toLowerCase())) {
    throw new Error("FORBIDDEN");
  }

  const index = categories.findIndex((cat) => cat.toLowerCase() === trimmed.toLowerCase());
  if (index === -1) {
    throw new Error("NOT_FOUND");
  }

  categories = categories.filter((cat) => cat.toLowerCase() !== trimmed.toLowerCase());
}

module.exports = {
  obtenerTodas,
  crear,
  eliminar
};
