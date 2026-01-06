const express = require("express");
const { createTodo, getTodos } = require("../controllers/todoController");

const router = express.Router();

router.post("/todo/:userId/createTodo", createTodo);
router.get("/todo/:userId/getTodos",getTodos)
module.exports = router;
