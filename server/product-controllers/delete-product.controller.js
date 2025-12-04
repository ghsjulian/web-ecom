const Product = require("../models/product.moldel");
const { Destroyer } = require("../configs/cloudinary.config");

const deleteProductController = async (req, res) => {
  try {
    const productId = req.query.id;
    if (!productId) {
      return res.status(400).json({ error: "_id (product id) is required" });
    }
    const existingProduct = await Product.findById(productId);
    if (!existingProduct)
      return res
        .status(404)
        .json({ success: false, error: "Product not found" });
    const deleted = await Product.findByIdAndDelete(productId);
    if (deleted) {
      return res
        .status(200)
        .json({ success: true, message: "Product deleted successfully!" });
    }
  } catch (error) {
    console.log("Error In Delete Product Controller : ", error.message);
  }
};

module.exports = deleteProductController;
