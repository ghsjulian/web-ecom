// src/pages/ViewProductPage.jsx
import React, { useEffect, useState } from "react";
import "../styles/view-product.css";
import useProduct from "../store/useProduct";
import { useParams, useNavigate } from "react-router-dom";
import ViewProductSkeleton from "../skeletons/ViewProductSkeleton";

const FALLBACK_IMAGES = [
  "https://images.unsplash.com/photo-1505740420928-3ebfa8f6d529?w=1200",
  "https://images.unsplash.com/photo-1617008598551-2c8f0d9203f3?w=1200",
  "https://images.unsplash.com/photo-1583391733981-5c93f99f2c6e?w=1200",
];

const DEFAULT_COLORS = ["#1a1a1a", "#bdc3c7", "#3498db", "#e74c3c"];

const ViewProductPage = () => {
  const navigate = useNavigate();
  const { getSingleProduct, isgetProduct, singleProduct } = useProduct();
  const { id } = useParams();

  // local UI state
  const [selectedColor, setSelectedColor] = useState(DEFAULT_COLORS[0]);
  const [quantity, setQuantity] = useState(1);
  const [mainImageIndex, setMainImageIndex] = useState(0);

  useEffect(() => {
    if (!id) return;
    // trigger fetch; assume getSingleProduct handles errors internally
    getSingleProduct(id);
    // reset local UI state when id changes
    setQuantity(1);
    setSelectedColor(DEFAULT_COLORS[0]);
    setMainImageIndex(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // While loading (or no product yet), show skeleton
  if (isgetProduct || !singleProduct) {
    return <ViewProductSkeleton />;
  }

  // Safely read product fields with fallbacks
  const images =
    (singleProduct.images && singleProduct.images.map((it) => it.url)) ||
    FALLBACK_IMAGES;
  const title = singleProduct.productName || singleProduct.name || "Product";
  const rating = singleProduct.rating ?? 4.8;
  const reviews = singleProduct.reviewsCount ?? 0;
  const price =
    typeof singleProduct.salePrice === "number"
      ? singleProduct.salePrice
      : singleProduct.price ?? null;
  const oldPrice = singleProduct.oldPrice ?? null;
  const description =
    singleProduct.description || "No description available for this product.";

  const handleQtyChange = (next) => {
    const n = Number(next);
    if (Number.isNaN(n)) return;
    if (n < 1) return setQuantity(1);
    setQuantity(Math.floor(n));
  };

  const decQty = () => handleQtyChange(quantity - 1);
  const incQty = () => handleQtyChange(quantity + 1);

  return (
    <div className="product-view">
      <div className="gallery">
        <div className="main-img">
          <img
            src={images[mainImageIndex] || FALLBACK_IMAGES[0]}
            alt={title}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </div>

        <div className="thumbnails" role="list">
          {images.map((img, idx) => (
            <div
              key={img + idx}
              className={`thumb ${idx === mainImageIndex ? "active" : ""}`}
              role="listitem"
            >
              <button
                type="button"
                onClick={() => setMainImageIndex(idx)}
                aria-label={`Show image ${idx + 1}`}
                className="thumb-btn"
              >
                <img src={img} alt={`${title} thumbnail ${idx + 1}`} />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="info">
        <h1>{title}</h1>

        <div className="rating" aria-hidden>
          <span className="stars">{"★★★★★"}</span>
          <span className="reviews">
            {rating} ({reviews} review{reviews !== 1 ? "s" : ""})
          </span>
        </div>

        <div className="price" aria-label="Product price">
          {price !== null ? (
            <>
              ${Number(price).toFixed(2)}{" "}
              {oldPrice && (
                <span className="old-price">
                  ${Number(oldPrice).toFixed(2)}
                </span>
              )}
            </>
          ) : (
            <span>-</span>
          )}
        </div>

        <p className="description">{description}</p>

        <div className="option">
          <h3>Color</h3>
          <div className="colors" role="radiogroup" aria-label="Color options">
            {DEFAULT_COLORS.map((c) => (
              <label key={c} className="color-label">
                <input
                  type="radio"
                  name="color"
                  value={c}
                  checked={selectedColor === c}
                  onChange={() => setSelectedColor(c)}
                />
                <span
                  className="color-swatch"
                  style={{ background: c }}
                  aria-hidden
                />
                <span className="sr-only">{c}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="actions">
          <div className="quantity" aria-label="Quantity selector">
            <button
              className="qty-btn"
              type="button"
              aria-label="Decrease quantity"
              onClick={decQty}
            >
              −
            </button>
            <input
              type="number"
              className="qty-input"
              value={quantity}
              min="1"
              onChange={(e) => handleQtyChange(e.target.value)}
              aria-label="Quantity"
            />
            <button
              className="qty-btn"
              type="button"
              aria-label="Increase quantity"
              onClick={incQty}
            >
              +
            </button>
          </div>

          <button
            className="add-to-cart"
            type="button"
            aria-label="Edit Product"
            onClick={() => navigate("/edit-product/" + id)}
          >
            Edit Product
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewProductPage;
