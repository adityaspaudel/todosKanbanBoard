const mongoose = require("mongoose");

const MONGODB_URI =
	"mongodb+srv://adityaspaudel_db_kanbanBoard:adityaspaudel_db_kanbanBoard@cluster0.g6jxcff.mongodb.net/?appName=Cluster0" ||
	"mongodb://localhost:27017/todosKanbanBoard";

const dbConnect = async () => {
	try {
		const isConnected = await mongoose.connect(`${MONGODB_URI}`);
		if (!isConnected)
			throw new Error(`could not connect to mongodb, ${MONGODB_URI}`);
		console.log(`connected to mongodb, ${MONGODB_URI}`);
	} catch (error) {
		console.error("error");
	}
};

module.exports = dbConnect;
