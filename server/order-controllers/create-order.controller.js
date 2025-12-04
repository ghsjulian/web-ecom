const { validationResult } = require("express-validator");
const Order = require("../models/Order");
const asyncHandler = require("../middlewares/asyncHandler");


const createOrder = async (req, res) => {
  // express-validator already ran; final safety check
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ message: "Validation failed",success : false, errors: errors.array() });
  }
try {
    const {
        product,
        name,
        sku,
        quantity,
        price,
        payment,
        image
      } = req.body;
    
      // Basic defensive validation
      if (quantity <= 0) {
        return res.status(400).json({ message: "Quantity must be greater than zero", success : false });
      }
      if (price < 0) {
        return res.status(400).json({ message: "Price cannot be negative", success : false });
      }
    
      const order = new Order({
        product,
        name,
        sku,
        quantity,
        price,
        payment,
        image
      });
      await order.save();
      res.status(201).json({ message: "Order created successfully", order });
} catch (error) {
    console.log("Error In CreateOrder Controller : ", error.message)
}
}
