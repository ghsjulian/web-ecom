const productModel = require("../models/product.moldel");

const getAllProducts = async (req, res) => {
  try {
    const filter = {}; // all products
    const products = await productModel
      .find(filter)
      .sort({ createdAt: -1 }) // newest first
      .limit(5)
      .populate("createdBy", "name email") // optional: include creator short info
      .lean()
      .exec();

    return res.status(200).json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    console.error("getLatestProducts error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Unexpected Server Error",
    });
  }
};

module.exports = getAllProducts;
