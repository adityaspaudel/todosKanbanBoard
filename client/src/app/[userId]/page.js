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

/* =======================
   Sortable Todo Item
======================= */
function SortableItem({ todo, handleEdit, deleteTodo }) {
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
			className="bg-white dark:bg-gray-800 p-3 rounded shadow mb-3 flex flex-col gap-2 cursor-grab active:cursor-grabbing"
		>
			<p className="font-semibold">{todo.title}</p>
			{todo.description && (
				<p className="text-sm text-gray-500">{todo.description}</p>
			)}

			<div className="flex gap-2 mt-2">
				<button
					onClick={() => handleEdit(todo)}
					className="bg-indigo-600 text-white px-3 py-1 rounded"
				>
					Edit
				</button>
				<button
					onClick={() => deleteTodo(todo._id)}
					className="bg-red-500 text-white px-3 py-1 rounded"
				>
					Delete
				</button>
			</div>
		</div>
	);
}

/* =======================
   Kanban Column
======================= */
function KanbanColumn({ status, todos, handleEdit, deleteTodo }) {
	const { setNodeRef } = useDroppable({ id: status });

	return (
		<div
			ref={setNodeRef}
			className="bg-gray-200 dark:bg-gray-700 p-3 rounded min-h-[320px] w-64"
		>
			<h2 className="font-bold mb-3 capitalize">{status}</h2>

			<SortableContext
				items={todos.map((t) => String(t._id))}
				strategy={verticalListSortingStrategy}
			>
				{todos.map((todo) => (
					<SortableItem
						key={todo._id}
						todo={todo}
						handleEdit={handleEdit}
						deleteTodo={deleteTodo}
					/>
				))}
			</SortableContext>

			{todos.length === 0 && (
				<p className="text-center text-gray-500 italic mt-6">Drop here</p>
			)}
		</div>
	);
}

/* =======================
   Main Page
======================= */
export default function KanbanPage() {
	const { userId } = useParams();
	const router = useRouter();

	const [todos, setTodos] = useState([]);
	const [loading, setLoading] = useState(true);
	const [activeId, setActiveId] = useState(null);

	const [formData, setFormData] = useState({
		title: "",
		description: "",
		status: "todo",
	});
	const [editingId, setEditingId] = useState(null);

	const sensors = useSensors(
		useSensor(PointerSensor, { activationConstraint: { distance: 6 } })
	);

	/* =======================
	   Fetch Todos
	======================= */
	const fetchTodos = async () => {
		if (!userId) return;
		setLoading(true);
		try {
			const res = await fetch(`${API_URL}/todo/${userId}/getTodos`);
			const data = await res.json();
			setTodos((data.todos || []).sort((a, b) => a.order - b.order));
		} catch (err) {
			console.error(err);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchTodos();
	}, [userId]);

	/* =======================
	   Drag End (FIXED)
	======================= */
	const handleDragEnd = async ({ active, over }) => {
		setActiveId(null);
		if (!active || !over) return;

		const dragged = todos.find((t) => String(t._id) === String(active.id));
		if (!dragged) return;

		let newStatus = dragged.status;
		let newIndex = 0;

		const overTodo = todos.find((t) => String(t._id) === String(over.id));

		if (overTodo) {
			newStatus = overTodo.status;
			const column = todos.filter(
				(t) => t.status === newStatus && t._id !== dragged._id
			);
			newIndex = column.findIndex((t) => t._id === overTodo._id);
		} else {
			newStatus = over.id;
		}

		const remaining = todos.filter((t) => t._id !== dragged._id);
		const targetColumn = remaining.filter((t) => t.status === newStatus);

		targetColumn.splice(newIndex, 0, { ...dragged, status: newStatus });

		const updated = [];
		["todo", "next", "doing", "done"].forEach((status) => {
			const col =
				status === newStatus
					? targetColumn
					: remaining.filter((t) => t.status === status);
			col.forEach((t, i) => updated.push({ ...t, order: i }));
		});

		// ✅ Optimistic UI (NO JUMP)
		setTodos(updated);

		// Persist only
		try {
			const moved = updated.find((t) => t._id === dragged._id);
			await fetch(`${API_URL}/todo/${dragged._id}/moveTodo`, {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					status: moved.status,
					order: moved.order,
				}),
			});
		} catch (err) {
			console.error(err);
			fetchTodos(); // fallback
		}
	};

	/* =======================
	   CRUD
	======================= */
	const submitTodo = async () => {
		if (!formData.title.trim()) return;

		const url = editingId
			? `${API_URL}/todo/${editingId}/updateTodo`
			: `${API_URL}/todo/${userId}/createTodo`;

		const method = editingId ? "PUT" : "POST";

		await fetch(url, {
			method,
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(formData),
		});

		setFormData({ title: "", description: "", status: "todo" });
		setEditingId(null);
		fetchTodos();
	};

	const deleteTodo = async (id) => {
		await fetch(`${API_URL}/todo/${id}/deleteTodo`, { method: "DELETE" });
		fetchTodos();
	};

	const handleEdit = (todo) => {
		setEditingId(todo._id);
		setFormData(todo);
	};

	const columns = {
		todo: todos.filter((t) => t.status === "todo"),
		next: todos.filter((t) => t.status === "next"),
		doing: todos.filter((t) => t.status === "doing"),
		done: todos.filter((t) => t.status === "done"),
	};

	/* =======================
	   Render
	======================= */
	return (
		<div className="flex flex-col content-center items-center min-h-screen p-6 bg-gray-100 dark:bg-gray-900">
			<div className="flex gap-2 justify-between items-center mb-6 w-full ">
				<span></span>
				<h1 className="text-2xl font-bold">Kanban Todos</h1>
				<button
					onClick={() => router.push("/")}
					className="bg-red-500 text-white px-4 py-2 rounded"
				>
					Logout
				</button>
			</div>

			{loading ? (
				<p>Loading...</p>
			) : (
				<DndContext
					sensors={sensors}
					collisionDetection={closestCenter}
					onDragStart={(e) => setActiveId(e.active.id)}
					onDragEnd={handleDragEnd}
					autoScroll={false} // ✅ FIX
				>
					<div className="flex gap-4 overflow-x-auto pb-4">
						{Object.keys(columns).map((status) => (
							<KanbanColumn
								key={status}
								status={status}
								todos={columns[status]}
								handleEdit={handleEdit}
								deleteTodo={deleteTodo}
							/>
						))}
					</div>

					<DragOverlay>
						{activeId && (
							<div className="bg-gray-600 p-3 rounded shadow">
								{todos.find((t) => String(t._id) === String(activeId)) && (
									<div className="bg-gray-600 p-3 rounded shadow space-y-1">
										{(() => {
											const t = todos.find(
												(todo) => String(todo._id) === String(activeId)
											);
											return (
												<>
													<div>{t.title}</div>
													<div>{t.description}</div>
													{/* <div>{t.status}</div> */}
													{/* <div>{t.order}</div> */}
												</>
											);
										})()}
									</div>
								)}
							</div>
						)}
					</DragOverlay>
				</DndContext>
			)}

			{/* Form */}
			<div className="bg-white dark:bg-gray-800 p-4 rounded shadow mt-6 space-y-3 max-w-2xl">
				<input
					name="title"
					placeholder="Title"
					value={formData.title}
					onChange={(e) => setFormData({ ...formData, title: e.target.value })}
					className="w-full p-2 border rounded"
				/>
				<textarea
					name="description"
					placeholder="Description"
					value={formData.description}
					onChange={(e) =>
						setFormData({ ...formData, description: e.target.value })
					}
					className="w-full p-2 border rounded"
				/>
				<select
					value={formData.status}
					onChange={(e) => setFormData({ ...formData, status: e.target.value })}
					className="p-2 border rounded bg-gray-600"
				>
					<option value="todo">Todo</option>
					<option value="next">Next</option>
					<option value="doing">Doing</option>
					<option value="done">Done</option>
				</select>

				<button
					onClick={submitTodo}
					className=" flex gap-2 bg-indigo-600 content-center items-center  text-white px-4 py-2 rounded"
				>
					{editingId ? "Update" : "Add"} Todo
				</button>
			</div>
		</div>
	);
}
