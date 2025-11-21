const express = require("express");
const router = express.Router();
const isAdmin = require("../middlewares/is.admin");
const createProductController = require("../product-controllers/create-product.controller");

router.post("/create-product", isAdmin, createProductController);

module.exports = router;
