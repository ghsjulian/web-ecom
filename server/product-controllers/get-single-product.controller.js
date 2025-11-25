const productmodel = require("../models/product.moldel");

const getSingleProduct = async (req, res) => {
  try {
    const { id } = req.params.query;
    console.log(id);
    return;
    const products = await productmodel.findById(id);
  } catch (error) {
    console.log(error.message);
  }
};

module.exports = getSingleProduct;
