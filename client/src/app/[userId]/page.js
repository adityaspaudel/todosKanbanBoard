"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
	DndContext,
	closestCenter,
	PointerSensor,
	useSensor,
	useSensors,
	DragOverlay,
	useDroppable,
} from "@dnd-kit/core";
import {
	SortableContext,
	verticalListSortingStrategy,
	useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Sortable Todo Item
function SortableItem({ todo, status, handleEdit, deleteTodo }) {
	const { attributes, listeners, setNodeRef, transform, transition } =
		useSortable({ id: String(todo._id) });

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
	};

	return (
		<div
			ref={setNodeRef}
			style={style}
			{...attributes}
			{...listeners}
			data-status={status}
			data-id={String(todo._id)}
			className="bg-white p-3 rounded shadow mb-2 flex flex-col gap-2 cursor-pointer"
		>
			<p className="font-medium">{todo.title}</p>
			<p className="text-sm text-gray-500">{todo.description}</p>
			<p className="text-sm text-gray-700">Status: {todo.status}</p>
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
	);
}


// Kanban Column Droppable

function KanbanColumn({ status, todos, handleEdit, deleteTodo }) {
	const { setNodeRef } = useDroppable({ id: status });

	return (
		<div
			ref={setNodeRef}
			data-status={status}
			className="bg-gray-200 p-3 rounded min-h-75 w-64 shrink-0"
		>
			<h2 className="font-bold text-lg mb-2 capitalize">{status}</h2>
			{todos.map((todo) => (
				<SortableItem
					key={todo._id}
					todo={todo}
					status={status}
					handleEdit={handleEdit}
					deleteTodo={deleteTodo}
				/>
			))}
		</div>
	);
}


// Main KanbanPage Component

export default function KanbanPage() {
	const { userId } = useParams();
	const router = useRouter();

	const [todos, setTodos] = useState([]);
	const [formData, setFormData] = useState({
		title: "",
		description: "",
		status: "todo",
	});
	const [loading, setLoading] = useState(true);
	const [editingTodoId, setEditingTodoId] = useState(null);
	const [activeId, setActiveId] = useState(null);

	// DnD Sensors
	const sensors = useSensors(
		useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
	);

	// Fetch Todos
	const fetchTodos = async () => {
		if (!userId) return;
		setLoading(true);
		try {
			const res = await fetch(`${API_URL}/todo/${userId}/getTodos`);
			const data = await res.json();
			const sorted = (data.todos || []).sort((a, b) => a.order - b.order);
			setTodos(sorted);
		} catch (err) {
			console.error(err);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchTodos();
	}, [userId]);

	// Form Handlers
	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const submitTodo = async () => {
		if (!formData.title.trim()) return;
		try {
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
		} catch (err) {
			console.error(err);
		}
	};

	const deleteTodo = async (todoId) => {
		try {
			await fetch(`${API_URL}/todo/${todoId}/deleteTodo`, { method: "DELETE" });
			fetchTodos();
		} catch (err) {
			console.error(err);
		}
	};

	const handleEdit = (todo) => {
		setFormData({
			title: todo.title,
			description: todo.description || "",
			status: todo.status,
		});
		setEditingTodoId(todo._id);
	};

	// Organize Todos by Status
	const todoColumns = {
		todo: todos.filter((t) => t.status === "todo"),
		new: todos.filter((t) => t.status === "new"),
		doing: todos.filter((t) => t.status === "doing"),
		done: todos.filter((t) => t.status === "done"),
	};

	// Handle Drag End
	const handleDragEnd = async ({ active, over }) => {
		setActiveId(null);
		if (!active || !over) return;

		const dragged = todos.find((t) => String(t._id) === String(active.id));
		if (!dragged) return;

		let overStatus = dragged.status;
		let newIndex = 0;

		// Dropped on a todo item
		const overTodo = todos.find((t) => String(t._id) === String(over.id));
		if (overTodo) {
			overStatus = overTodo.status;
			const targetColumn = todos
				.filter((t) => t._id !== dragged._id)
				.filter((t) => t.status === overStatus);
			newIndex = targetColumn.findIndex((t) => t._id === overTodo._id);
			if (newIndex === -1) newIndex = targetColumn.length;
		}
		// Dropped on empty column
		else if (["todo", "new", "doing", "done"].includes(over.id)) {
			overStatus = over.id;
			newIndex = 0;
		}

		// Remove dragged
		const newTodos = todos.filter((t) => t._id !== dragged._id);
		const targetColumn = newTodos.filter((t) => t.status === overStatus);

		// Insert dragged
		targetColumn.splice(newIndex, 0, { ...dragged, status: overStatus });

		// Rebuild updatedTodos with correct order
		const updatedTodos = [];
		for (const status of ["todo", "new", "doing", "done"]) {
			const column =
				status === overStatus
					? targetColumn
					: newTodos.filter((t) => t.status === status);
			column.forEach((t, idx) => updatedTodos.push({ ...t, order: idx }));
		}

		setTodos(updatedTodos);

		// Backend update
		try {
			const movedTodo = updatedTodos.find((t) => t._id === dragged._id);
			await fetch(`${API_URL}/todo/${dragged._id}/moveTodo`, {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					status: movedTodo.status,
					order: movedTodo.order,
				}),
			});
			fetchTodos();
		} catch (err) {
			console.error("Error moving todo:", err);
			fetchTodos();
		}
	};

	
	return (
		<div className="min-h-screen bg-gray-100 p-6 text-black">
			{/* Header */}
			<div className="flex justify-between items-center mb-4">
				<h1 className="text-2xl font-bold">Kanban Todos</h1>
				<button
					onClick={() => router.push("/")}
					className="text-white bg-red-500 hover:bg-red-600 px-4 py-2 rounded"
				>
					Logout
				</button>
			</div>

			{/* Todo Form */}
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
				<button
					onClick={submitTodo}
					className="bg-blue-600 text-white px-4 py-2 rounded"
				>
					{editingTodoId ? "Update Todo" : "Add Todo"}
				</button>
			</div>

			{/* Kanban Columns */}
			{loading ? (
				<p>Loading...</p>
			) : (
				<DndContext
					sensors={sensors}
					collisionDetection={closestCenter}
					onDragEnd={handleDragEnd}
					onDragStart={(e) => setActiveId(e.active.id)}
				>
					<div className="flex gap-4 overflow-x-auto">
						{["todo", "new", "doing", "done"].map((status) => (
							<KanbanColumn
								key={status}
								status={status}
								todos={todoColumns[status]}
								handleEdit={handleEdit}
								deleteTodo={deleteTodo}
							/>
						))}
					</div>

					<DragOverlay>
						{activeId ? (
							<div className="bg-white p-3 rounded shadow">
								{todos.find((t) => String(t._id) === String(activeId))?.title}
							</div>
						) : null}
					</DragOverlay>
				</DndContext>
			)}
		</div>
	);
}
