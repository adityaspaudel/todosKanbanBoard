const dbConnect = require("./db/connection");

const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const app = express();

const cors = require("cors");
const userRoute = require("./routes/userRoute");
const todoRoute = require("./routes/todoRoute");

// middleware
app.use(express.json());
app.use(cors());

// database connection
dbConnect();

// routing

app.use(userRoute);

app.use(todoRoute);
// 404 HANDLER (Route Not Found)
app.use((req, res, next) => {
	const error = new Error(`Route not found - ${req.originalUrl}`);
	error.statusCode = 404;
	next(error);
});

// GLOBAL ERROR HANDLER
app.use((err, req, res, next) => {
	const statusCode = err.statusCode || 500;

	res.status(statusCode).json({
		success: false,
		message: err.message || "Internal Server Error",
	});
});

// application
const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
	console.log(`application is listening on port: ${PORT}`);
});
