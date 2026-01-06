const Todo = require("../models/todoModel");
const mongoose = require("mongoose");

const createTodo = async (req, res) => {
	try {
		const { userId } = req.params;
		const { title, description = "", status = "todo" } = req.body;

		if (!title) {
			return res.status(400).json({ message: "Title is required" });
		}

		if (!mongoose.Types.ObjectId.isValid(userId)) {
			return res.status(400).json({ message: "Invalid userId" });
		}

		const lastTodo = await Todo.findOne({ userId, status })
			.sort({ order: -1 })
			.select("order");

		const nextOrder = lastTodo ? lastTodo.order + 1 : 0;

		const todo = await Todo.create({
			title,
			description,
			status,
			order: nextOrder,
			userId,
		});

		res.status(201).json({
			message: "Todo created successfully",
			todo,
		});
	} catch (error) {
		if (error.code === 11000) {
			return res.status(409).json({ message: "Order conflict, retry" });
		}
		res.status(500).json({ error: error.message });
	}
};

const getTodos = async (req, res) => {
	try {
		const { userId } = req.params;

		if (!mongoose.Types.ObjectId.isValid(userId)) {
			return res.status(400).json({ message: "Invalid userId" });
		}

		const todos = await Todo.find({ userId }).sort({ status: 1, order: 1 });

		res.status(200).json({
			message: "Todos fetched successfully",
			todos,
		});
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

module.exports = { createTodo, getTodos };
