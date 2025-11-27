// controllers/product.controller.js
const Product = require("../models/product.moldel");
const mongoose = require("mongoose");

const getFilteredProducts = async (req, res) => {
  try {
    const {
      q,
      category,
      status,
      page = 1,
      limit = 5,
      sortBy = "-createdAt",
      minPrice,
      maxPrice,
    } = req.query;

    const pageNum = Math.max(parseInt(page, 10) || 1, 1);
    const perPage = Math.max(parseInt(limit, 10) || 5, 1);
    const skip = (pageNum - 1) * perPage;

    // Build filter object
    const filter = {};

    // Text search (productName, sku, category)
    if (q && String(q).trim()) {
      const regex = new RegExp(String(q).trim(), "i");
      filter.$or = [
        { productName: regex },
        { sku: regex },
        { category: regex },
      ];
    }

    // Category exact match
    if (
      category &&
      category !== "All Categories" &&
      category.toLowerCase() !== "all"
    ) {
      filter.category = category;
    }

    // Status filter -> Active / Inactive
    if (status && status.toLowerCase() === "active") {
      filter.isPublished = true;
    } else if (status && status.toLowerCase() === "inactive") {
      filter.isPublished = false;
    }

    // Price range
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
      if (Object.keys(filter.price).length === 0) delete filter.price;
    }

    // Count total
    const [total, products] = await Promise.all([
      Product.countDocuments(filter),
      Product.find(filter).sort(sortBy).skip(skip).limit(perPage).lean().exec(),
    ]);

    return res.json({
      success: true,
      total,
      count: products.length,
      page: pageNum,
      pages: Math.max(1, Math.ceil(total / perPage)),
      products,
    });
  } catch (err) {
    console.error("getAllProducts error:", err);
    return res
      .status(500)
      .json({ success: false, message: "Server error", error: err.message });
  }
};

module.exports = getFilteredProducts;
