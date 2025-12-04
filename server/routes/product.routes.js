const express = require("express");
const router = express.Router();
const isAdmin = require("../middlewares/is.admin");
const updateProductController = require("../product-controllers/update-product.controller");
const createProductController = require("../product-controllers/create-product.controller");
const getAllProducts = require("../product-controllers/get-all-products.controller");
const getSingleProduct = require("../product-controllers/get-single-product.controller");
const getFilteredProducts = require("../product-controllers/filtered-product.controller");
const deleteProductController = require("../product-controllers/delete-product.controller");

router.post("/create-product", isAdmin, createProductController);
router.put("/update-product", isAdmin, updateProductController);
// router.get("/get-all-products", isAdmin, getAllProducts);
router.get("/get-all-products", isAdmin, getFilteredProducts);
router.get("/get-product", isAdmin, getSingleProduct);
router.delete("/delete-product", isAdmin, deleteProductController);

module.exports = router;
