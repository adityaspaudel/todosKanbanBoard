const express = require("express");
const {
	userRegistration,
	userLogin,
} = require("../controllers/userController");
const router = express.Router();

router.post("/user/userRegistration", userRegistration);
router.post("/user/userLogin", userLogin);

module.exports = router;
