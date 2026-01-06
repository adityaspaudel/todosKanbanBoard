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
			required: true,
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
		indexes: [
			{
				fields: { userId: 1, status: 1, order: 1 },
				options: { unique: true },
			},
		],
	}
);

module.exports = mongoose.model("Todo", todoSchema);
