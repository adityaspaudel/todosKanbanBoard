const express = require("express");
const {
	createTodo,
	getTodos,
	updateTodo,
} = require("../controllers/todoController");

const router = express.Router();

router.post("/todo/:userId/createTodo", createTodo);
router.get("/todo/:userId/getTodos", getTodos);
router.put("/todo/:todoId/updateTodo", updateTodo);

module.exports = router;
