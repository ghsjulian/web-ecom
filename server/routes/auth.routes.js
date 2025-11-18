const express = require("express");
const router = express.Router();
const isAdmin = require("../middlewares/is.admin");
const loginController = require("../auth-controllers/login.controller");
const signupController = require("../auth-controllers/signup.controller");
const adminLogoutController = require("../auth-controllers/admin-logout.controller");
const isAdminController = require("../auth-controllers/is-admin.controller");

router.post("/auth/login", loginController);
router.post("/auth/signup", signupController);
router.post("/auth/admin-logout", isAdmin, adminLogoutController);
router.get("/auth/is-admin", isAdmin, isAdminController);

module.exports = router;
