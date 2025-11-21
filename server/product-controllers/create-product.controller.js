const Product = require("../models/product.moldel");
const { Uploader } = require("../configs/cloudinary.config");

const createProduct = async (req, res) => {
  try {
    const {
      productName,
      sku,
      category,
      brand,
      price,
      salePrice,
      stock,
      lowStock,
      shortDesc,
      fullDesc,
      images = [],
      isPublished,
      tags,
      attributes,
      draft,
    } = req.body || {};

    // ---------- Basic Validation ----------
    if (!productName)
      return res.status(400).json({ error: "productName is required" });
    if (!sku) return res.status(400).json({ error: "sku is required" });
    if (!category)
      return res.status(400).json({ error: "category is required" });
    if (!price || isNaN(Number(price)))
      return res.status(400).json({ error: "price must be a valid number" });
    if (!stock || isNaN(Number(stock)))
      return res.status(400).json({ error: "stock must be a valid number" });
    if (!fullDesc)
      return res.status(400).json({ error: "fullDesc is required" });

    if (!Array.isArray(images) || images.length === 0)
      return res.status(400).json({ error: "At least one image is required" });

    if (images.length > 6)
      return res.status(400).json({ error: "Maximum 6 images allowed" });

    // Check if SKU already exists
    const exist = await Product.findOne({ sku: sku.toUpperCase() });
    if (exist) return res.status(409).json({ error: "SKU already exists" });

    // ---------- Upload images ----------
    const finalImages = [];

    for (const base64 of images) {
      if (!base64.startsWith("data:image"))
        return res.status(400).json({ error: "Invalid Base64 image format" });

      // If your uploader accepts single base64:
      const url = await Uploader(base64);
      finalImages.push(url);
    }

    // ---------- Prepare document ----------
    const newProduct = new Product({
      productName: productName.trim(),
      sku: sku.trim().toUpperCase(),
      category: category.trim(),
      brand: brand || "",
      price: Number(price),
      salePrice: salePrice ? Number(salePrice) : undefined,
      stock: Number(stock),
      lowStock: lowStock ? Number(lowStock) : 10,
      shortDesc: shortDesc || "",
      fullDesc,
      images: finalImages,
      isPublished: draft ? false : isPublished,
      tags: Array.isArray(tags) ? tags : [],
      attributes: attributes || {},
    });

    // ---------- Save to DB ----------
    const saved = await newProduct.save();

    return res.status(201).json({
      message: "Product created successfully",
      product: saved,
    });
  } catch (error) {
    console.error("Create Product Error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = createProduct;
