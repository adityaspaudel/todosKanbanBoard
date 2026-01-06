"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function KanbanPage() {
	const { userId } = useParams();

	const [todos, setTodos] = useState([]);
	const [formData, setFormData] = useState({
		title: "",
		description: "",
		status: "todo",
	});
	const [loading, setLoading] = useState(false);
	const [editingTodoId, setEditingTodoId] = useState(null);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	// GET TODOS
	const fetchTodos = async () => {
		if (!userId) return;
		setLoading(true);

		const res = await fetch(`${API_URL}/todo/${userId}/getTodos`, {
			cache: "no-store",
		});
		const data = await res.json();

		// sort by order ascending
		const sortedTodos = (data.todos || []).sort((a, b) => a.order - b.order);

		setTodos(sortedTodos);
		setLoading(false);
	};

	// CREATE OR UPDATE TODO
	const submitTodo = async () => {
		if (!formData.title.trim()) return;

		if (editingTodoId) {
			await fetch(`${API_URL}/todo/${editingTodoId}/updateTodo`, {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(formData),
			});
		} else {
			await fetch(`${API_URL}/todo/${userId}/createTodo`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(formData),
			});
		}

		setFormData({ title: "", description: "", status: "todo" });
		setEditingTodoId(null);
		fetchTodos();
	};

	// DELETE TODO
	const deleteTodo = async (todoId) => {
		await fetch(`${API_URL}/todo/${todoId}/deleteTodo`, { method: "DELETE" });
		fetchTodos();
	};

	// CLICK EDIT
	const handleEdit = (todo) => {
		setFormData({
			title: todo.title,
			description: todo.description || "",
			status: todo.status,
		});
		setEditingTodoId(todo._id);
	};

	useEffect(() => {
		fetchTodos();
	}, [userId]);

	// divide todos by status
	const todoColumns = {
		todo: todos.filter((t) => t.status === "todo"),
		new: todos.filter((t) => t.status === "new"),
		doing: todos.filter((t) => t.status === "doing"),
		done: todos.filter((t) => t.status === "done"),
	};

	return (
		<div className="min-h-screen bg-gray-100 p-6 text-black">
			<h1 className="text-2xl font-bold mb-4">Kanban Todos</h1>

			{/* CREATE / EDIT FORM */}
			<div className="bg-white p-4 rounded shadow mb-6 space-y-3">
				<input
					type="text"
					name="title"
					value={formData.title}
					onChange={handleChange}
					placeholder="Todo title *"
					className="w-full p-2 border rounded"
				/>
				<textarea
					name="description"
					value={formData.description}
					onChange={handleChange}
					placeholder="Description (optional)"
					className="w-full p-2 border rounded"
				/>
				<div className="flex gap-3">
					<select
						name="status"
						value={formData.status}
						onChange={handleChange}
						className="p-2 border rounded"
					>
						<option value="todo">Todo</option>
						<option value="new">New</option>
						<option value="doing">Doing</option>
						<option value="done">Done</option>
					</select>
				</div>
				<button
					onClick={submitTodo}
					className="bg-blue-600 text-white px-4 py-2 rounded"
				>
					{editingTodoId ? "Update Todo" : "Add Todo"}
				</button>
			</div>

			{/* LOADING */}
			{loading && <p>Loading...</p>}

			{/* KANBAN COLUMNS */}
			<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
				{["todo", "new", "doing", "done"].map((status) => (
					<div key={status} className="bg-gray-200 p-3 rounded">
						<h2 className="font-bold text-lg mb-2 capitalize">{status}</h2>
						{todoColumns[status].map((todo) => (
							<div
								key={todo._id}
								className="bg-white p-3 rounded shadow mb-2 flex flex-col gap-2"
							>
								<p className="font-medium">{todo.title}</p>
								<p className="text-sm text-gray-500">{todo.description}</p>
								<div className="flex justify-between items-center gap-2">
									<select
										value={todo.status}
										onChange={(e) =>
											submitTodo(todo._id, { status: e.target.value })
										}
										className="border rounded p-1"
									>
										<option value="todo">Todo</option>
										<option value="new">New</option>
										<option value="doing">Doing</option>
										<option value="done">Done</option>
									</select>
									<div className="flex gap-1">
										<button
											onClick={() => handleEdit(todo)}
											className="bg-yellow-500 text-white px-3 rounded"
										>
											Edit
										</button>
										<button
											onClick={() => deleteTodo(todo._id)}
											className="bg-red-500 text-white px-3 rounded"
										>
											Delete
										</button>
									</div>
								</div>
							</div>
						))}
					</div>
				))}
			</div>
		</div>
	);
}
