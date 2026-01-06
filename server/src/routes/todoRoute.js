const express = require("express");
const { createTodo } = require("../controllers/todoController");

const router = express.Router();

router.post("/todo/:userId/createTodo", createTodo);

module.exports = router;
