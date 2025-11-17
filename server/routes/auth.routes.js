const express = require("express");
const router = express.Router();
const isAdmin = require("../middlewares/is.admin");
const loginController = require("../auth-controllers/login.controller");
const signupController = require("../auth-controllers/signup.controller");
const adminLogoutController = require("../auth-controllers/admin-logout.controller");

router.post("/auth/login", loginController);
router.post("/auth/signup", signupController);
router.post("/admin-logout", isAdmin, adminLogoutController);

module.exports = router;
