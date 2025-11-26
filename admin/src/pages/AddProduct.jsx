import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/add-product.css";
import useProduct from "../store/useProduct";

const AddProduct = () => {
  const navigate = useNavigate();
  const { isCreatingProduct, createPercent, createNewProduct } = useProduct();
  const [formData, setFormData] = useState({
    productName: "",
    sku: "",
    category: "",
    brand: "",
    price: "",
    salePrice: "",
    stock: "",
    lowStock: "10",
    shortDesc: "",
    fullDesc: "",
    images: [], // File objects
  });

  const [imagePreviews, setImagePreviews] = useState([]); // object URLs
  const mountedRef = useRef(true);

  useEffect(() => {
    // cleanup object URLs on unmount
    return () => {
      mountedRef.current = false;
      imagePreviews.forEach((url) => {
        try {
          URL.revokeObjectURL(url);
        } catch (err) {
          console.log(err);
        }
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Convert a single File -> base64 data URL
  const fileToBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (err) => reject(err);
    });

  // Convert all File objects -> array of base64 strings
  const convertImagesToBase64 = async (images) => {
    // images: array of File
    if (!images || images.length === 0) return [];
    // convert in parallel
    const promises = images.map((f) => fileToBase64(f));
    return Promise.all(promises);
  };

  // Handle input changes
  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  // Handle file upload + preview
  const handleImageUpload = (e) => {
    const newFiles = Array.from(e.target.files || []);

    // Combine old + new images (but max 6)
    const combined = [...formData.images, ...newFiles].slice(0, 6);

    // Validate max image count
    if (combined.length > 6) {
      alert("Maximum 6 images allowed!");
    }

    // Filter by size (<= 5MB)
    const filtered = combined.filter((file) => file.size <= 5 * 1024 * 1024);
    if (filtered.length < combined.length) {
      alert("Some images exceeded 5MB limit!");
    }

    // Revoke previous previews to avoid leaks
    imagePreviews.forEach((url) => {
      try {
        URL.revokeObjectURL(url);
      } catch (err) {
        console.log(err);
      }
    });

    // Generate preview URLs for all images
    const previews = filtered.map((file) => URL.createObjectURL(file));

    // Update states
    setFormData((prev) => ({ ...prev, images: filtered }));
    setImagePreviews(previews);
  };

  // Remove an image by index
  const handleRemoveImage = (idx) => {
    const newImages = [...formData.images];
    const newPreviews = [...imagePreviews];

    // Revoke selected object URL
    try {
      URL.revokeObjectURL(newPreviews[idx]);
    } catch (err) {
      console.log(err);
    }

    newImages.splice(idx, 1);
    newPreviews.splice(idx, 1);

    setFormData((prev) => ({ ...prev, images: newImages }));
    setImagePreviews(newPreviews);
  };

  // Function to check required fields
  const isFormValid = () => {
    const { productName, sku, category, price, stock, fullDesc, images } =
      formData;

    // Check required fields
    if (
      !productName.trim() ||
      !sku.trim() ||
      !category.trim() ||
      !price ||
      !stock ||
      !fullDesc.trim() ||
      images.length === 0
    ) {
      return false;
    }

    return true;
  };

  // Handle form submit (Publish)
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid()) {
      alert("⚠️ Please fill all required fields before publishing!");
      return;
    }

    try {
      // Convert all images to Base64
      const base64Images = await convertImagesToBase64(formData.images);

      // New final payload
      const payload = {
        ...formData,
        images: base64Images, // now base64 strings
      };

      // Call store action
      // If your createNewProduct expects something else (like FormData), adapt accordingly.
      createNewProduct(payload, navigate);

      // console.log("Publishing Product:", payload);
      // alert("✅ Product Published Successfully!");
    } catch (err) {
      console.error("Error converting images to Base64:", err);
      alert("❌ Failed to convert images. Try again.");
    }
  };

  // Save Draft
  const handleSaveDraft = async (e) => {
    e.preventDefault();
    try {
      const base64Images = await convertImagesToBase64(formData.images);

      const payload = {
        ...formData,
        images: base64Images,
      };

      // If you want to persist drafts via createNewProduct, call it here with a draft flag:
      // createNewProduct({ ...payload, draft: true });
      console.log("Draft Saved:", payload);
      alert("📝 Draft Saved Successfully!");
    } catch (err) {
      console.error("Error converting images for draft:", err);
      alert("❌ Failed to save draft due to image conversion error.");
    }
  };

  return (
    <div className="add-product">
      <div className="form-card">
        <div className="form-header">
          <h2 className="form-title">Product Information</h2>
          <div className="form-actions">
            <button className="btn btn-secondary" onClick={handleSaveDraft}>
              <i className="fas fa-save"></i> Save Draft
            </button>
            {/*
            <button
              className="btn btn-primary"
              onClick={handleSubmit}
              disabled={isCreatingProduct}
            >
              {isCreatingProduct ? (
                <div className="loading"></div>
              ) : (
                <i className="fas fa-paper-plane"></i>
              )}
              {isCreatingProduct
                ? "Please Wait" && <span className="loading-text"></span>
                : "Publish"}
            </button>
            */}
            <button
              onClick={handleSubmit}
              disabled={isCreatingProduct}
              className={
                isCreatingProduct ? "loading-btn loading" : "loading-btn"
              }
            >
              {isCreatingProduct ? (
                <>
                  <div className="spinner"></div>
                  <span className="loading-text">Please wait...</span>
                </>
              ) : (
                <>
                  <i className="fas fa-paper-plane"></i>
                  <span className="loading-text">Publish</span>
                </>
              )}
            </button>
          </div>
        </div>

        <form id="addProductForm" onSubmit={(e) => e.preventDefault()}>
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="productName">
                Product Name <span style={{ color: "#dc3545" }}>*</span>
              </label>
              <input
                type="text"
                id="productName"
                value={formData.productName}
                onChange={handleChange}
                placeholder="e.g., Samsung Galaxy A55"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="sku">
                SKU <span style={{ color: "#dc3545" }}>*</span>
              </label>
              <input
                type="text"
                id="sku"
                value={formData.sku}
                onChange={handleChange}
                placeholder="e.g., SAM-A55-BLK"
                required
              />
            </div>
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="category">
                Category <span style={{ color: "#dc3545" }}>*</span>
              </label>
              <select
                id="category"
                value={formData.category}
                onChange={handleChange}
                required
              >
                <option value="">Select Category</option>
                <option value="smartphones">Smartphones</option>
                <option value="laptops">Laptops</option>
                <option value="accessories">Accessories</option>
                <option value="audio">Audio</option>
                <option value="wearables">Wearables</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="brand">Brand</label>
              <select id="brand" value={formData.brand} onChange={handleChange}>
                <option value="">Select Brand</option>
                <option value="samsung">Samsung</option>
                <option value="apple">Apple</option>
                <option value="xiaomi">Xiaomi</option>
                <option value="oneplus">OnePlus</option>
                <option value="realme">Realme</option>
              </select>
            </div>
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="price">
                Regular Price (BDT) <span style={{ color: "#dc3545" }}>*</span>
              </label>
              <input
                type="number"
                id="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="e.g., 35990"
                min="0"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="salePrice">Sale Price (BDT)</label>
              <input
                type="number"
                id="salePrice"
                value={formData.salePrice}
                onChange={handleChange}
                placeholder="e.g., 32990"
                min="0"
              />
            </div>

            <div className="form-group">
              <label htmlFor="stock">
                Stock Quantity <span style={{ color: "#dc3545" }}>*</span>
              </label>
              <input
                type="number"
                id="stock"
                value={formData.stock}
                onChange={handleChange}
                placeholder="e.g., 50"
                min="0"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="lowStock">Low Stock Alert</label>
              <input
                type="number"
                id="lowStock"
                value={formData.lowStock}
                onChange={handleChange}
                placeholder="e.g., 10"
                min="0"
              />
            </div>
          </div>

          <div className="form-group full-width">
            <label htmlFor="shortDesc">Short Description</label>
            <textarea
              id="shortDesc"
              value={formData.shortDesc}
              onChange={handleChange}
              placeholder="Brief overview (max 160 chars)"
            ></textarea>
          </div>

          <div className="form-group full-width">
            <label htmlFor="fullDesc">
              Full Description <span style={{ color: "#dc3545" }}>*</span>
            </label>
            <textarea
              id="fullDesc"
              value={formData.fullDesc}
              onChange={handleChange}
              placeholder="Detailed product description, features, specs..."
              required
            ></textarea>
          </div>

          <div className="form-group full-width">
            <label>
              Product Images <span style={{ color: "#dc3545" }}>*</span>
            </label>
            <div className="file-upload">
              <input
                type="file"
                id="productImages"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
              />
              <label htmlFor="productImages" className="file-upload-label">
                <i className="fas fa-cloud-upload-alt"></i>
                <div>
                  <strong>Click to upload</strong> or drag and drop
                  <br />
                  <small>PNG, JPG, GIF up to 5MB each (Max 6 images)</small>
                </div>
              </label>
            </div>

            {imagePreviews.length > 0 && (
              <div className="image-preview" id="imagePreview">
                {imagePreviews.map((src, idx) => (
                  <div key={idx} className="preview-item">
                    <img src={src} alt={`Preview ${idx}`} />
                    <button
                      type="button"
                      className="remove-btn"
                      title="Remove Image"
                      onClick={() => handleRemoveImage(idx)}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="alert alert-info">
            <i className="fas fa-info-circle"></i>
            <div>
              <strong>Tip:</strong> All fields marked with{" "}
              <span style={{ color: "#dc3545" }}>*</span> are required. Product
              will be live immediately if published.
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;
