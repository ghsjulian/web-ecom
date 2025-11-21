// product.model.js
const mongoose = require("mongoose");

const { Schema } = mongoose;

// Simple slugify helper (no external deps)
const slugify = (text) =>
  text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/[^\w\-]+/g, "") // Remove all non-word chars
    .replace(/\-\-+/g, "-"); // Replace multiple - with single -

const productSchema = new Schema(
  {
    productName: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
      minlength: 1,
      maxlength: 255,
    },

    slug: {
      type: String,
      index: true,
      unique: false, // optional: set to true if you want unique slugs
    },

    sku: {
      type: String,
      required: [true, "SKU is required"],
      trim: true,
      uppercase: true,
      unique: true,
      index: true,
    },

    category: {
      type: String,
      required: [true, "Category is required"],
      enum: ["smartphones", "laptops", "accessories", "audio", "wearables"],
      lowercase: true,
      index: true,
    },

    brand: {
      type: String,
      enum: ["samsung", "apple", "xiaomi", "oneplus", "realme", ""],
      lowercase: true,
      trim: true,
      default: "",
    },

    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price cannot be negative"],
    },

    salePrice: {
      type: Number,
      min: [0, "Sale price cannot be negative"],
      validate: {
        validator: function (v) {
          // if salePrice exists, it should be <= price (optional)
          if (v == null) return true;
          return this.price == null ? true : v <= this.price;
        },
        message: "Sale price must be less than or equal to regular price",
      },
    },

    stock: {
      type: Number,
      required: [true, "Stock quantity is required"],
      min: [0, "Stock cannot be negative"],
      default: 0,
    },

    lowStock: {
      type: Number,
      min: [0, "Low stock alert cannot be negative"],
      default: 10,
    },

    shortDesc: {
      type: String,
      trim: true,
      maxlength: [160, "Short description cannot exceed 160 characters"],
      default: "",
    },

    fullDesc: {
      type: String,
      required: [true, "Full description is required"],
    },

    /**
     * images: array of strings
     * - Accepts either:
     *   - Base64 data URLs (e.g. "data:image/png;base64,....")
     *   - Or remote URLs (if you later store on CDN)
     */
    images: {
      type: [String],
      validate: [
        {
          validator: function (arr) {
            return arr.length <= 6;
          },
          message: "Maximum 6 images allowed",
        },
      ],
      default: [],
    },

    isPublished: {
      type: Boolean,
      default: false,
      index: true,
    },

    // optional reference to the user who created the product
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },

    // Metadata (optional)
    tags: {
      type: [String],
      default: [],
    },

    attributes: {
      // flexible place for key-value specs (e.g., color, ram, storage)
      type: Schema.Types.Mixed,
      default: {},
    },

    views: {
      type: Number,
      default: 0,
      min: 0,
    },

    rating: {
      // average rating
      type: Number,
      min: 0,
      max: 5,
      default: 0,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Text index for searching productName, shortDesc, fullDesc
productSchema.index({
  productName: "text",
  shortDesc: "text",
  fullDesc: "text",
});

// Pre-save hook to generate slug from productName (only if not set or if name changed)
productSchema.pre("save", function (next) {
  if (this.isModified("productName") || !this.slug) {
    this.slug = slugify(this.productName || `${this._id}`);
  }
  next();
});

// Optional: instance method to check low stock
productSchema.methods.isLowStock = function () {
  return this.stock <= this.lowStock;
};

module.exports = mongoose.model("Product", productSchema);
