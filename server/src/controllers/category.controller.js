const categoryService = require("../services/category.service");

function getAll(req, res) {
  const categories = categoryService.obtenerTodas();
  res.json(categories);
}

function create(req, res) {
  const { nombre } = req.body;
  try {
    const created = categoryService.crear(nombre);
    return res.status(201).json({ nombre: created });
  } catch (err) {
    if (err.message === "INVALID") {
      return res.status(400).json({ error: "El nombre de la categoría es obligatorio." });
    }
    if (err.message === "DUPLICATE") {
      return res.status(400).json({ error: "La categoría ya existe." });
    }
    throw err;
  }
}

function remove(req, res) {
  const { nombre } = req.params;
  try {
    categoryService.eliminar(nombre);
    return res.status(204).send();
  } catch (err) {
    if (err.message === "FORBIDDEN") {
      return res.status(400).json({ error: "No se puede eliminar una categoría base." });
    }
    if (err.message === "NOT_FOUND") {
      return res.status(404).json({ error: "Categoría no encontrada." });
    }
    throw err;
  }
}

module.exports = {
  getAll,
  create,
  remove
};
