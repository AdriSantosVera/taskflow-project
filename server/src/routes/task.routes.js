const express = require("express");
const taskController = require("../controllers/task.controller");

const router = express.Router();

router.get("/", taskController.getAll);
router.post("/", taskController.create);
router.put("/:id", taskController.update);
router.patch("/:id", taskController.update);
router.delete("/:id", taskController.remove);

module.exports = router;
