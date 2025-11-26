const Product = require("../models/product.moldel");
const {
  Uploader /*, Destroyer (optional) */,
} = require("../configs/cloudinary.config");

/**
 * Update existing product controller
 * Expects: req.body contains fields (same as createProduct).
 * Requires: req.body._id or req.params.id to identify the product.
 */
const updateProduct = async (req, res) => {
  try {
    // allow id in body or route params
    const productId = req.query.id;
    if (!productId)
      return res.status(400).json({ error: "_id (product id) is required" });

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
      images = [], // can be base64 strings, url strings, or { id, url } objects
      isPublished,
      tags,
      attributes,
      draft,
    } = req.body || {};

    // ---------- Basic Validation (only required fields) ----------
    if (!productName)
      return res.status(400).json({ error: "productName is required" });
    if (!sku) return res.status(400).json({ error: "sku is required" });
    if (!category)
      return res.status(400).json({ error: "category is required" });
    if (price === undefined || price === null || isNaN(Number(price)))
      return res.status(400).json({ error: "price must be a valid number" });
    if (stock === undefined || stock === null || isNaN(Number(stock)))
      return res.status(400).json({ error: "stock must be a valid number" });
    if (!fullDesc)
      return res.status(400).json({ error: "fullDesc is required" });

    if (!Array.isArray(images) || images.length === 0)
      return res.status(400).json({ error: "At least one image is required" });

    if (images.length > 6)
      return res.status(400).json({ error: "Maximum 6 images allowed" });

    // ---------- Find existing product ----------
    const existingProduct = await Product.findById(productId);
    if (!existingProduct)
      return res.status(404).json({ error: "Product not found" });

    // ---------- SKU uniqueness ----------
    const skuUpper = sku.trim().toUpperCase();
    const otherWithSku = await Product.findOne({
      sku: skuUpper,
      _id: { $ne: productId },
    });
    if (otherWithSku)
      return res
        .status(409)
        .json({ error: "SKU already exists for another product" });

    // ---------- Process images ----------
    // Strategy:
    // - If item is base64 string (starts with data:image) -> upload and use returned id/url
    // - If item is object with id/url -> preserve it
    // - If item is url string (http/https) -> preserve as { id: null, url: string }
    // - Remove duplicates by url
    const finalImages = [];
    for (const img of images) {
      // base64 string
      if (typeof img === "string" && img.startsWith("data:image")) {
        // upload
        const uploaded = await Uploader(img);
        if (!uploaded?.secure_url)
          return res
            .status(500)
            .json({ error: "Failed to upload one of the images" });

        finalImages.push({
          id: uploaded.public_id || null,
          url: uploaded.secure_url,
        });
        continue;
      }

      // plain url string (existing remote)
      if (typeof img === "string" && /^https?:\/\//i.test(img)) {
        finalImages.push({
          id: null,
          url: img,
        });
        continue;
      }

      // object { id, url } or possibly { url } etc
      if (typeof img === "object" && img !== null) {
        const url = img.url || img.secure_url || img.path;
        const id = img.id || img.public_id || null;
        if (typeof url === "string" && /^https?:\/\//i.test(url)) {
          finalImages.push({ id: id || null, url });
          continue;
        }
      }

      // invalid image entry
      return res
        .status(400)
        .json({ error: "Invalid image entry in images array" });
    }

    // deduplicate by url and keep order (first occurrence preserved)
    const seen = new Set();
    const dedupedImages = [];
    for (const it of finalImages) {
      const key = it.url;
      if (!seen.has(key)) {
        seen.add(key);
        dedupedImages.push(it);
      }
    }

    if (dedupedImages.length === 0)
      return res
        .status(400)
        .json({ error: "At least one valid image is required" });
    if (dedupedImages.length > 6)
      return res
        .status(400)
        .json({ error: "Maximum 6 images allowed after processing" });

    // ---------- Prepare update payload ----------
    const updateDoc = {
      productName: productName.trim(),
      sku: skuUpper,
      category: category.trim(),
      brand: brand || "",
      price: Number(price),
      salePrice: salePrice ? Number(salePrice) : undefined,
      stock: Number(stock),
      lowStock: lowStock ? Number(lowStock) : 10,
      shortDesc: shortDesc || "",
      fullDesc,
      images: dedupedImages,
      isPublished: draft ? false : Boolean(isPublished),
      tags: Array.isArray(tags) ? tags : [],
      attributes: attributes || {},
    };

    // remove undefined fields so Mongo doesn't set them to null/undefined accidentally
    Object.keys(updateDoc).forEach((k) => {
      if (updateDoc[k] === undefined) delete updateDoc[k];
    });

    // ---------- Optional: handle deletion of removed cloud images ----------
    // If you want to remove images that were present on the existing product but not included
    // in the new `images` array, you can iterate existingProduct.images and call a destroy
    // function (if present in your cloudinary config). Example:
    //
    // const removed = existingProduct.images.filter(e =>
    //   !dedupedImages.some(n => n.url === e.url)
    // );
    // for (const r of removed) {
    //   if (r.id && typeof Destroyer === "function") {
    //     await Destroyer(r.id).catch(err => console.warn("Failed deleting cloud image", err));
    //   }
    // }
    //
    // NOTE: Uncomment and plug `Destroyer` if you provide a deletion utility.

    // ---------- Update document ----------
    const updated = await Product.findByIdAndUpdate(productId, updateDoc, {
      new: true,
    });

    return res.status(200).json({
      message: "Product updated successfully",
      product: updated,
    });
  } catch (error) {
    console.error("Update Product Error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = updateProduct;
