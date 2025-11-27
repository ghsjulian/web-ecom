// controllers/updateProduct.controller.js
const Product = require("../models/product.moldel");
const {
  Uploader,
  Destroyer, // function(public_id) -> Promise
} = require("../configs/cloudinary.config");

/**
 * Update existing product controller
 * - product id must be provided as req.query.id
 * - req.body contains fields similar to createProduct
 *
 * Images array may contain:
 * - base64 strings (data:image/...) -> will be uploaded and stored as { id, url }
 * - plain url strings ("https://...") -> preserved as { id: null, url }
 * - objects { id, url } or { url } or { secure_url } -> preserved
 *
 * If an existing product image (has id) was removed by the client,
 * this controller will attempt to delete it from Cloudinary using Destroyer(id).
 */
const updateProduct = async (req, res) => {
  try {
    const productId = req.query.id;
    if (!productId) {
      return res.status(400).json({ error: "_id (product id) is required" });
    }

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
      return res
        .status(400)
        .json({ success: false, error: "productName is required" });
    if (!sku)
      return res.status(400).json({ success: false, error: "sku is required" });
    if (!category)
      return res
        .status(400)
        .json({ success: false, error: "category is required" });
    if (price === undefined || price === null || isNaN(Number(price)))
      return res
        .status(400)
        .json({ success: false, error: "price must be a valid number" });
    if (stock === undefined || stock === null || isNaN(Number(stock)))
      return res
        .status(400)
        .json({ success: false, error: "stock must be a valid number" });
    if (!fullDesc)
      return res
        .status(400)
        .json({ success: false, error: "fullDesc is required" });

    if (!Array.isArray(images) || images.length === 0)
      return res
        .status(400)
        .json({ success: false, error: "At least one image is required" });

    if (images.length > 6)
      return res
        .status(400)
        .json({ success: false, error: "Maximum 6 images allowed" });

    // ---------- Find existing product ----------
    const existingProduct = await Product.findById(productId);
    if (!existingProduct)
      return res
        .status(404)
        .json({ success: false, error: "Product not found" });

    // ---------- SKU uniqueness (exclude current product) ----------
    const skuUpper = sku.trim().toUpperCase();
    const otherWithSku = await Product.findOne({
      sku: skuUpper,
      _id: { $ne: productId },
    });
    if (otherWithSku)
      return res.status(409).json({
        success: false,
        error: "SKU already exists for another product",
      });

    // ---------- Process incoming images ----------
    // Build finalImages as array of { id: string|null, url: string }
    const finalImages = [];

    for (const img of images) {
      // 1) base64 string => upload
      if (typeof img === "string" && img.startsWith("data:image")) {
        const uploaded = await Uploader(img);
        if (!uploaded?.secure_url) {
          console.error("Uploader returned invalid response for base64 image");
          return res.status(500).json({
            success: false,
            error: "Failed to upload one of the images",
          });
        }
        finalImages.push({
          id: uploaded.public_id || null,
          url: uploaded.secure_url,
        });
        continue;
      }

      // 2) plain url string => preserve
      if (typeof img === "string" && /^https?:\/\//i.test(img)) {
        finalImages.push({ id: null, url: img });
        continue;
      }

      // 3) object form => accept { url } / { id, url } / { secure_url } / { path }
      if (typeof img === "object" && img !== null) {
        const url =
          typeof img.url === "string"
            ? img.url
            : typeof img.secure_url === "string"
            ? img.secure_url
            : typeof img.path === "string"
            ? img.path
            : null;

        const id = img.id || img.public_id || null;

        // If object contains nested base64 in e.g. img.data, upload it.
        if (
          !url &&
          typeof img.data === "string" &&
          img.data.startsWith("data:image")
        ) {
          const uploaded = await Uploader(img.data);
          if (!uploaded?.secure_url) {
            console.error(
              "Uploader returned invalid response for nested base64 image"
            );
            return res.status(500).json({
              success: false,
              error: "Failed to upload one of the images",
            });
          }
          finalImages.push({
            id: uploaded.public_id || null,
            url: uploaded.secure_url,
          });
          continue;
        }

        if (typeof url === "string" && /^https?:\/\//i.test(url)) {
          finalImages.push({ id: id || null, url });
          continue;
        }
      }

      // if we reach here, the image entry is invalid
      return res
        .status(400)
        .json({ success: false, error: "Invalid image entry in images array" });
    }

    // ---------- Deduplicate by url, preserve order ----------
    const seen = new Set();
    const dedupedImages = [];
    for (const it of finalImages) {
      if (!it || !it.url) continue;
      if (!seen.has(it.url)) {
        seen.add(it.url);
        dedupedImages.push(it);
      }
    }

    if (dedupedImages.length === 0)
      return res.status(400).json({
        success: false,
        error: "At least one valid image is required",
      });
    if (dedupedImages.length > 6)
      return res.status(400).json({
        success: false,
        error: "Maximum 6 images allowed after processing",
      });

    // ---------- Determine removed images to delete from Cloudinary ----------
    // existingProduct.images may contain strings or objects.
    const existingImages = Array.isArray(existingProduct.images)
      ? existingProduct.images
      : [];

    // Map existing images to normalized { id, url } if possible
    const existingNormalized = existingImages
      .map((e) => {
        if (!e) return null;
        if (typeof e === "string") {
          return { id: null, url: e };
        }
        if (typeof e === "object") {
          const url =
            typeof e.url === "string"
              ? e.url
              : typeof e.secure_url === "string"
              ? e.secure_url
              : typeof e.path === "string"
              ? e.path
              : null;
          const id = e.id || e.public_id || null;
          if (!url) return null;
          return { id: id || null, url };
        }
        return null;
      })
      .filter(Boolean);

    // removed = those in existingNormalized whose url is NOT present in dedupedImages
    const dedupedUrls = new Set(dedupedImages.map((d) => d.url));
    const removed = existingNormalized.filter((ex) => !dedupedUrls.has(ex.url));

    // ---------- Attempt deletion of removed images from Cloudinary ----------
    // Only delete if we have a public id and Destroyer function available
    if (removed.length > 0 && typeof Destroyer === "function") {
      const deletePromises = removed
        .filter((r) => r.id) // only items with an id
        .map(async (r) => {
          try {
            await Destroyer(r.id);
            return { id: r.id, url: r.url, status: "deleted" };
          } catch (err) {
            // Log and continue
            console.warn("Failed to delete cloud image", r.id, err);
            return {
              id: r.id,
              url: r.url,
              status: "failed",
              error: err?.message || err,
            };
          }
        });

      // Wait for all deletions to settle
      const deletionResults = await Promise.allSettled(deletePromises);
      // we already handle errors per-item above; log overall
      // (optional) You could inspect deletionResults and return 207 multi-status if needed
      // For now we proceed regardless of delete outcome.
      // console.log("Deletion results:", deletionResults);
    }

    // ---------- Prepare update document ----------
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

    // remove undefined fields to avoid accidental null/undefined writes
    Object.keys(updateDoc).forEach((k) => {
      if (updateDoc[k] === undefined) delete updateDoc[k];
    });

    // ---------- Update product ----------
    const updated = await Product.findByIdAndUpdate(productId, updateDoc, {
      new: true,
    });

    return res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product: updated,
    });
  } catch (error) {
    console.error("Update Product Error:", error);
    return res
      .status(500)
      .json({ success: false, error: "Internal server error" });
  }
};

module.exports = updateProduct;
