const express = require("express");
const { userRegistration } = require("../controllers/userController");
const router = express.Router();

router.post("/user/userRegistration", userRegistration);

module.exports = router;
