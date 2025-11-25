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

  const { isCreatingProduct, products, createNewProduct, fetchProducts } =
    useProduct();

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
    images: [], // existing URLs (string) or File objects
  });

  // imagePreviews matches order of formData.images and contains:
  // - for string URLs: that same string
  // - for File objects: a blob: URL created via URL.createObjectURL(file)
  const [imagePreviews, setImagePreviews] = useState([]);
  const mountedRef = useRef(false);

  useEffect(() => {
    mountedRef.current = true;

    if (typeof fetchProducts === "function") {
      try {
        fetchProducts();
      } catch (err) {
        // ignore
      }
    }

    return () => {
      // revoke only blob: urls we created
      imagePreviews.forEach((url) => {
        try {
          if (typeof url === "string" && url.startsWith("blob:")) {
            URL.revokeObjectURL(url);
          }
        } catch (err) {
          /* ignore */
        }
      });
      mountedRef.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // load product when products or productId changes
  useEffect(() => {
    if (!productId || !Array.isArray(products)) return;

    const product = products.find((p) => p._id === productId);
    if (!product) {
      // clear when product not found
      setFormData((prev) => ({
        ...prev,
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
      }));
      // revoke previous blob urls
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

    // prepare images array: product.images may be array of strings or {url}
    const images = (product.images || []).map((img) =>
      typeof img === "string" ? img : img.url ? img.url : img
    );

    // revoke previous blob urls
    imagePreviews.forEach((url) => {
      try {
        if (typeof url === "string" && url.startsWith("blob:")) {
          URL.revokeObjectURL(url);
        }
      } catch (err) {}
    });

    setFormData({
      productName: product.productName || "",
      sku: product.sku || "",
      category: product.category || "",
      brand: product.brand || "",
      price: product.price || "",
      salePrice: product.salePrice || "",
      stock: product.stock || "",
      lowStock: product.lowStock || "10",
      shortDesc: product.shortDesc || "",
      fullDesc: product.fullDesc || "",
      images: images, // all strings (existing URLs)
    });

    setImagePreviews(images); // previews are the same URLs for remote images
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [products, productId]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  /**
   * Merge new files into existing images array.
   * - Respect MAX_IMAGES total.
   * - Ignore files > MAX_FILE_SIZE.
   * - Deduplicate by name+size for File objects.
   * - Keep existing URL strings intact and do not recreate their previews.
   */
  const handleImageUpload = (e) => {
    const incomingFiles = Array.from(e.target.files || []);
    if (incomingFiles.length === 0) return;

    // count how many slots left
    const currentCount = formData.images.length;
    const slotsLeft = Math.max(0, MAX_IMAGES - currentCount);
    if (slotsLeft === 0) {
      alert(`Maximum ${MAX_IMAGES} images allowed.`);
      e.target.value = "";
      return;
    }

    // filter allowed size and take only up to slotsLeft
    const allowed = incomingFiles
      .filter((f) => f.size <= MAX_FILE_SIZE)
      .slice(0, slotsLeft);

    // deduplicate against existing File objects in formData.images
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

    // create blob URLs for the newly added files
    const newBlobPreviews = toAdd.map((f) => URL.createObjectURL(f));

    // build new arrays (preserve existing URLs and existing Files)
    const newImagesArray = [...formData.images, ...toAdd].slice(0, MAX_IMAGES);

    // Build new previews array:
    // - Start with the existing imagePreviews (which correspond index-wise to formData.images)
    // - Append the newly created blob urls for each added File
    const updatedPreviews = (() => {
      // existing previews already correspond to existing image entries
      const base = [...imagePreviews];
      // append only as many blob previews as were actually added (respect slicing)
      base.push(...newBlobPreviews);
      return base.slice(0, MAX_IMAGES);
    })();

    // Before replacing previews, it's safe to keep existing blob urls for other files,
    // and we only revoke when a preview gets removed in handleRemoveImage or on unmount.
    setFormData((prev) => ({ ...prev, images: newImagesArray }));
    setImagePreviews(updatedPreviews);

    // reset input so same file can be selected again
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
      if (typeof file === "string") return resolve(file); // already a URL or base64 string
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
      const payload = { ...formData, images: base64Images, _id: productId };
      await createNewProduct(payload, navigate);
      alert("✅ Product updated successfully!");
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
            <button
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
            </button>
          </div>
        </div>

        <form onSubmit={(e) => e.preventDefault()}>
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
 