import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import "../styles/add-product.css";
import useProduct from "../store/useProduct";

const MAX_IMAGES = 6;
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const EditProduct = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const productId = searchParams.get("productId");

  const {
    getSingleProduct,
    singleProduct,
    isgetProduct, // optional, code will work without it
    updateProduct,
    isupdatingProduct,
  } = useProduct();

  const mountedRef = useRef(false);

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
    images: [], // mix of string URLs or File objects
  });

  // imagePreviews correspond index wise to formData.images
  const [imagePreviews, setImagePreviews] = useState([]);

  // Fetch product when productId becomes available
  useEffect(() => {
    if (!productId) return;
    getSingleProduct(productId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId]);

  // Populate form when singleProduct updates
  useEffect(() => {
    // avoid running on first render if not mounted yet
    if (!productId) return;

    // If the store tracks fetch completion, you can guard on isgetProduct
    // if (typeof isgetProduct !== "undefined" && !isgetProduct) return;

    const product = singleProduct;
    if (!product) {
      // Clear form if no product
      setFormData({
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
        images: [],
      });
      // revoke any existing blob URLs
      imagePreviews.forEach((url) => {
        try {
          if (typeof url === "string" && url.startsWith("blob:")) {
            URL.revokeObjectURL(url);
          }
        } catch (err) {}
      });
      setImagePreviews([]);
      return;
    }

    // build images array (strings for remote URLs)
    const images =
      (product.images || []).map((img) =>
        typeof img === "string" ? img : img?.url ? img.url : img
      ) || [];

    // revoke previous blob previews (we will replace previews)
    imagePreviews.forEach((url) => {
      try {
        if (typeof url === "string" && url.startsWith("blob:")) {
          URL.revokeObjectURL(url);
        }
      } catch (err) {}
    });

    setFormData({
      productName: product.productName ?? "",
      sku: product.sku ?? "",
      category: product.category ?? "",
      brand: product.brand ?? "",
      price: product.price ?? "",
      salePrice: product.salePrice ?? "",
      stock: product.stock ?? "",
      lowStock: product.lowStock ?? "10",
      shortDesc: product.shortDesc ?? "",
      fullDesc: product.fullDesc ?? "",
      images: images,
    });

    // previews initially same as remote URLs (no blob URLs yet)
    setImagePreviews(images);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [singleProduct, productId]);

  // cleanup on unmount: revoke any blob urls
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      imagePreviews.forEach((url) => {
        try {
          if (typeof url === "string" && url.startsWith("blob:")) {
            URL.revokeObjectURL(url);
          }
        } catch (err) {}
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleImageUpload = (e) => {
    const incomingFiles = Array.from(e.target.files || []);
    if (incomingFiles.length === 0) return;

    const currentCount = formData.images.length;
    const slotsLeft = Math.max(0, MAX_IMAGES - currentCount);
    if (slotsLeft === 0) {
      alert(`Maximum ${MAX_IMAGES} images allowed.`);
      e.target.value = "";
      return;
    }

    const allowed = incomingFiles
      .filter((f) => f.size <= MAX_FILE_SIZE)
      .slice(0, slotsLeft);

    const existingKeys = formData.images
      .filter((i) => typeof i !== "string")
      .map((f) => `${f.name}_${f.size}`);

    const toAdd = allowed.filter((f) => {
      const key = `${f.name}_${f.size}`;
      return !existingKeys.includes(key);
    });

    if (toAdd.length === 0) {
      e.target.value = "";
      return;
    }

    const newBlobPreviews = toAdd.map((f) => URL.createObjectURL(f));

    const newImagesArray = [...formData.images, ...toAdd].slice(0, MAX_IMAGES);

    const updatedPreviews = (() => {
      const base = [...imagePreviews];
      base.push(...newBlobPreviews);
      return base.slice(0, MAX_IMAGES);
    })();

    setFormData((prev) => ({ ...prev, images: newImagesArray }));
    setImagePreviews(updatedPreviews);

    e.target.value = "";
  };

  const handleRemoveImage = (idx) => {
    const newImages = [...formData.images];
    const newPreviews = [...imagePreviews];

    try {
      const previewUrl = newPreviews[idx];
      if (typeof previewUrl === "string" && previewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl);
      }
    } catch (err) {
      console.error(err);
    }

    newImages.splice(idx, 1);
    newPreviews.splice(idx, 1);

    setFormData((prev) => ({ ...prev, images: newImages }));
    setImagePreviews(newPreviews);
  };

  const fileToBase64 = (file) =>
    new Promise((resolve, reject) => {
      if (typeof file === "string") return resolve(file); // already a URL or base64
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (err) => reject(err);
    });

  const convertImagesToBase64 = async (images) => {
    if (!images || images.length === 0) return [];
    return Promise.all(images.map((f) => fileToBase64(f)));
  };

  const isFormValid = () => {
    const { productName, sku, category, price, stock, fullDesc, images } =
      formData;
    return (
      productName &&
      sku &&
      category &&
      price !== "" &&
      stock !== "" &&
      fullDesc &&
      images &&
      images.length > 0
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid()) {
      alert("⚠️ Please fill all required fields!");
      return;
    }

    try {
      const base64Images = await convertImagesToBase64(formData.images);
      const payload = {
        ...formData,
        images: base64Images,
        _id: productId,
      };
      await updateProduct(productId, payload, navigate);
      // alert("✅ Product updated successfully!");
    } catch (err) {
      console.error(err);
      alert("❌ Failed to update product.");
    }
  };

  return (
    <div className="add-product">
      <div className="form-card">
        <div className="form-header">
          <h2 className="form-title">Edit Product</h2>
          <div className="form-actions">
            {/* <button
              className="btn btn-primary"
              onClick={handleSubmit}
              disabled={isCreatingProduct}
              type="button"
            >
              {isCreatingProduct ? (
                <>
                  <div className="loading" />
                  <span className="loading-text"> Please Wait</span>
                </>
              ) : (
                <>
                  <i className="fas fa-paper-plane" /> Update
                </>
              )}
            </button> */}
            <button
              onClick={handleSubmit}
              disabled={isupdatingProduct}
              className={
                isupdatingProduct ? "loading-btn loading" : "loading-btn"
              }
            >
              {isupdatingProduct ? (
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

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Product Name *</label>
            <input
              type="text"
              id="productName"
              value={formData.productName}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>SKU *</label>
            <input
              type="text"
              id="sku"
              value={formData.sku}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Category *</label>
            <select
              id="category"
              value={formData.category}
              onChange={handleChange}
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
            <label>Brand</label>
            <select id="brand" value={formData.brand} onChange={handleChange}>
              <option value="">Select Brand</option>
              <option value="samsung">Samsung</option>
              <option value="apple">Apple</option>
              <option value="xiaomi">Xiaomi</option>
              <option value="oneplus">OnePlus</option>
              <option value="realme">Realme</option>
            </select>
          </div>

          <div className="form-group">
            <label>Price (BDT) *</label>
            <input
              type="number"
              id="price"
              value={formData.price}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Sale Price (BDT)</label>
            <input
              type="number"
              id="salePrice"
              value={formData.salePrice}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Stock Quantity *</label>
            <input
              type="number"
              id="stock"
              value={formData.stock}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Low Stock Alert</label>
            <input
              type="number"
              id="lowStock"
              value={formData.lowStock}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Full Description *</label>
            <textarea
              id="fullDesc"
              value={formData.fullDesc}
              onChange={handleChange}
            />
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
                <i className="fas fa-cloud-upload-alt" />
                <div>
                  <strong>Click to upload</strong> or drag and drop
                  <br />
                  <small>PNG, JPG, GIF up to 5MB each (Max 6 images)</small>
                </div>
              </label>
            </div>

            <div className="image-preview" id="imagePreview">
              {imagePreviews.map((src, idx) => (
                <div key={idx} className="preview-item">
                  <img src={src} alt={`preview-${idx}`} width={80} />
                  <button
                    style={{ cursor: "pointer" }}
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
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProduct;
