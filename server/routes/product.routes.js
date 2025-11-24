const express = require("express");
const router = express.Router();
const isAdmin = require("../middlewares/is.admin");
const createProductController = require("../product-controllers/create-product.controller");
const getAllProducts = require("../product-controllers/get-all-products.controller");

router.post("/create-product", isAdmin, createProductController);
router.get("/get-all-products", isAdmin, getAllProducts);

module.exports = router;
