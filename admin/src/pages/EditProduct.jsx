import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import "../styles/add-product.css";
import useProduct from "../store/useProduct";

const EditProduct = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const productId = searchParams.get("productId");
  const { isCreatingProduct, products, createNewProduct } = useProduct();

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
    images: [], // will hold File objects or existing URLs
  });

  const [imagePreviews, setImagePreviews] = useState([]); // URLs
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;

    // Get product from mock data
    const product = products.find((p) => p._id === productId);
    if (product) {
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
        images: product.images || [],
      });

      // Populate previews with existing URLs
      setImagePreviews(product.images.map((img) => img.url));
    }

    return () => {
      mountedRef.current = false;
      imagePreviews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [productId]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleImageUpload = (e) => {
    const newFiles = Array.from(e.target.files || []);

    // Max 6 images
    const combined = [...formData.images, ...newFiles].slice(0, 6);

    const filtered = combined.filter(
      (file) => file.size <= 5 * 1024 * 1024 || typeof file === "string"
    );

    const previews = filtered.map((f) =>
      typeof f === "string" ? f : URL.createObjectURL(f)
    );

    setFormData((prev) => ({ ...prev, images: filtered }));
    setImagePreviews(previews);
  };

  const handleRemoveImage = (idx) => {
    const newImages = [...formData.images];
    const newPreviews = [...imagePreviews];

    try {
      if (typeof newPreviews[idx] !== "string")
        URL.revokeObjectURL(newPreviews[idx]);
    } catch (err) {
      console.log(err);
    }

    newImages.splice(idx, 1);
    newPreviews.splice(idx, 1);

    setFormData((prev) => ({ ...prev, images: newImages }));
    setImagePreviews(newPreviews);
  };

  const fileToBase64 = (file) =>
    new Promise((resolve, reject) => {
      if (typeof file === "string") return resolve(file); // already URL
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
      price &&
      stock &&
      fullDesc &&
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
      const payload = { ...formData, images: base64Images };
      createNewProduct(payload, navigate);
      alert("✅ Product updated successfully!");
    } catch (err) {
      console.error(err);
      alert("❌ Failed to update product.");
    }
  };

  return (
    <div className="add-product">
      <div className="form-card">
        <h2>Edit Product</h2>
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
            ></textarea>
          </div>
          <div className="form-group">
            <label>Images *</label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageUpload}
            />
            <div className="image-preview">
              {imagePreviews.map((src, idx) => (
                <div key={idx}>
                  <img src={src} alt={`preview-${idx}`} width={80} />
                  <button type="button" onClick={() => handleRemoveImage(idx)}>
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isCreatingProduct}
          >
            {isCreatingProduct ? "Updating..." : "Update Product"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditProduct;
