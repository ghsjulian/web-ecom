// EditProduct.jsx
import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../styles/add-product.css";
import useProduct from "../store/useProduct";
import NotFound from "./NotFound";

const MAX_IMAGES = 6;
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const EditProduct = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const {
    getSingleProduct,
    singleProduct,
    isgetProduct, // optional
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
    images: [], // mix: {id,url} | "https://..." | File/Blob | base64 string
  });

  // imagePreviews is an array of preview URLs (strings):
  // - for remote images: their http(s) url
  // - for newly added files: blob: URLs created from Files
  const [imagePreviews, setImagePreviews] = useState([]);

  // Fetch product when id becomes available
  useEffect(() => {
    if (!id) return;
    getSingleProduct(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // Populate form when singleProduct updates
  useEffect(() => {
    if (!id) return;

    const product = singleProduct;
    if (!product) {
      // clear
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
      // revoke any blob previews
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

    // product.images may be an array of:
    // - string URL
    // - object { id, url }
    // - maybe base64 (rare)
    const images = Array.isArray(product.images) ? product.images : [];

    // build initial previews array (strings)
    const previews = images.map((it) => {
      if (!it) return "";
      if (typeof it === "string") return it;
      if (typeof it === "object" && it.url) return it.url;
      return "";
    });

    // revoke previous blob previews
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
      images: images, // preserve original items (object/string)
    });

    setImagePreviews(previews);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [singleProduct, id]);

  // cleanup on unmount
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

    // only accept files under MAX_FILE_SIZE
    const allowed = incomingFiles
      .filter((f) => f.size <= MAX_FILE_SIZE)
      .slice(0, slotsLeft);

    // dedupe by name+size against existing File/Blob entries in formData.images
    const existingFileKeys = formData.images
      .filter((i) => i instanceof Blob)
      .map((f) => `${f.name}_${f.size}`);

    const toAdd = allowed.filter((f) => {
      const key = `${f.name}_${f.size}`;
      return !existingFileKeys.includes(key);
    });

    if (toAdd.length === 0) {
      e.target.value = "";
      return;
    }

    // create blob previews for new files
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

  // Convert File/Blob to base64, or pass through string/object
  const fileToBase64 = (file) =>
    new Promise((resolve, reject) => {
      // If it's already a string (could be base64 or URL), pass through
      if (typeof file === "string") return resolve(file);

      // If it's an object that isn't a Blob/File (e.g. {id,url}), pass through
      if (typeof file === "object" && !(file instanceof Blob))
        return resolve(file);

      // For File/Blob -> convert to base64
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (err) => reject(err);
    });

  /**
   * Prepare images for payload:
   * - File/Blob -> convert to base64 string
   * - base64 string -> keep as-is
   * - plain url string -> convert to { url }
   * - object (e.g. { id, url }) -> keep as-is
   */
  const prepareImagesForSubmit = async (images) => {
    if (!images || images.length === 0) return [];

    const out = [];
    for (const img of images) {
      // newly added file/blob
      if (img instanceof Blob) {
        const b64 = await fileToBase64(img);
        out.push(b64);
        continue;
      }

      // base64 string (already)
      if (typeof img === "string" && img.startsWith("data:image")) {
        out.push(img);
        continue;
      }

      // plain URL string
      if (typeof img === "string" && /^https?:\/\//i.test(img)) {
        out.push({ url: img });
        continue;
      }

      // object (preserve e.g., { id, url })
      if (typeof img === "object" && img !== null) {
        out.push(img);
        continue;
      }

      // skip bad entries
      console.warn("Skipping invalid image entry:", img);
    }

    return out;
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
      // Prepare images: new Files => base64, existing objects => preserved, urls => {url}
      const imagesPayload = await prepareImagesForSubmit(formData.images);
      // final payload
      const payload = {
        ...formData,
        images: imagesPayload,
        _id: id,
      };
      await updateProduct(id, payload, navigate);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="add-product">
      <div className="form-card">
        <div className="form-header">
          <h2 className="form-title">Update Product</h2>
          <div className="form-actions">
            <button
              onClick={handleSubmit}
              disabled={isupdatingProduct}
              className={
                isupdatingProduct ? "loading-btn loading" : "loading-btn"
              }
              type="button"
            >
              {isupdatingProduct ? (
                <>
                  <div className="spinner" />
                  <span className="loading-text">Please wait...</span>
                </>
              ) : (
                <>
                  <i className="fas fa-paper-plane" />
                  <span className="loading-text">Update</span>
                </>
              )}
            </button>
          </div>
        </div>

        <form id="addProductForm" onSubmit={handleSubmit}>
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
