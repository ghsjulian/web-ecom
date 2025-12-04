const express = require("express");
const router = express.Router();
const isAdmin = require("../middlewares/is.admin");
const getAllOrders = require("../order-controllers/get-all-orders.controller")

router.get("/get-all-orders", isAdmin, getAllOrders);

module.exports = router