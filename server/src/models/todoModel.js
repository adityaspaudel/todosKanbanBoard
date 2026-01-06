const mongoose = require("mongoose");

const todoSchema = new mongoose.Schema(
	{
		title: {
			type: String,
			required: true,
			trim: true,
			maxlength: 150,
		},

		description: {
			type: String,
			trim: true,
			maxlength: 1000,
			default: "",
		},

		status: {
			type: String,
			enum: ["todo", "new", "doing", "done"],
			default: "todo",
			index: true,
		},

		order: {
			type: Number,
			default: 0, // <-- make it optional, default 0
			min: 0,
			index: true,
		},

		userId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
			index: true,
		},
	},
	{
		timestamps: true,
	}
);

// Optional: index to speed up queries
todoSchema.index({ userId: 1, status: 1, order: 1 });

module.exports = mongoose.model("Todo", todoSchema);
