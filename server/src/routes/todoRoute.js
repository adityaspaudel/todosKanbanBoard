const express = require("express");
const {
	createTodo,
	getTodos,
	updateTodo,
	deleteTodo,
} = require("../controllers/todoController");

const router = express.Router();

router.post("/todo/:userId/createTodo", createTodo);
router.get("/todo/:userId/getTodos", getTodos);
router.put("/todo/:todoId/updateTodo", updateTodo);
router.delete("/todo/:todoId/deleteTodo", deleteTodo);

module.exports = router;
