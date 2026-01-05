const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");

// ------------------ Helpers ------------------
const saltRounds = 10;
const hashPassword = async (password) =>
	await bcrypt.hash(password, saltRounds);
const SECRET_KEY = process.env.SECRET_KEY;

const userRegistration = async (req, res) => {
	try {
		const { fullName, email, password } = req.body;
		if (!fullName || !email || !password) {
			res.status(204).send({
				message: "please enter fullName, email and password",
				success: false,
			});
		}
		const existingUserByEmail = await User.findOne({ email });
		if (existingUserByEmail) {
			res.status(409).send({
				message: "email already exist, try different email",
				success: false,
			});
		} else {
			const hashedPassword = await hashPassword(password);

			const newUser = new User({ fullName, email, password: hashedPassword });
			newUser.save();
			res.status(201).send({
				message: "user registration successful",
				success: true,
				email: newUser.email,
				fullName: newUser.fullName,
			});
		}
	} catch (error) {
		res
			.status(500)
			.send({ message: "user registration failed", success: false });
	}
};

module.exports = { userRegistration };
