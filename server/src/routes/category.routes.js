const express = require("express");
const categoryController = require("../controllers/category.controller");

const router = express.Router();

router.get("/", categoryController.getAll);
router.post("/", categoryController.create);
router.delete("/:nombre", categoryController.remove);

module.exports = router;
