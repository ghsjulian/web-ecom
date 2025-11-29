import React from "react";
import "../styles/view-product-skeleton.css";

const ViewProductSkeleton = () => {
  return (
    <div className="product-view">
      <div className="gallery">
        <div className="main-img">
          <div className="skeleton"></div>
        </div>
        <div className="thumbnails">
          <div className="thumb">
            <div className="skeleton"></div>
          </div>
          <div className="thumb">
            <div className="skeleton"></div>
          </div>
          <div className="thumb">
            <div className="skeleton"></div>
          </div>
          <div className="thumb">
            <div className="skeleton"></div>
          </div>
        </div>
      </div>
      <div className="info">
        <h1 className="skeleton"></h1>
        <div className="rating-line skeleton"></div>
        <div className="price-line skeleton"></div>
        <div className="desc-line skeleton"></div>
        <div className="desc-line skeleton"></div>
        <div className="desc-line skeleton"></div>
        <div className="color-title skeleton"></div>
        <div className="colors">
          <div className="color-skeleton skeleton"></div>
          <div className="color-skeleton skeleton"></div>
          <div className="color-skeleton skeleton"></div>
          <div className="color-skeleton skeleton"></div>
        </div>
        <div className="actions">
          <div className="quantity">
            <div className="qty-side skeleton"></div>
            <div className="qty-middle skeleton"></div>
            <div className="qty-side skeleton"></div>
          </div>
          <div className="add-to-cart skeleton"></div>
        </div>
      </div>
    </div>
  );
};

export default ViewProductSkeleton;
