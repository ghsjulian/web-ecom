// src/components/ProductsTableSkeleton.jsx
import React from "react";
import "../styles/product-page-skeleton.css";

const ProductPageSkeleton = () => {
  return (
    <div className="skeleton-table-container">
      <table className="skeleton-table">
        <thead>
          <tr>
            <th>
              <div className="skeleton-th skeleton-line short"></div>
            </th>
            <th>
              <div className="skeleton-th skeleton-line short"></div>
            </th>
            <th>
              <div className="skeleton-th skeleton-line short"></div>
            </th>
            <th>
              <div className="skeleton-th skeleton-line short"></div>
            </th>
            <th>
              <div className="skeleton-th skeleton-line short"></div>
            </th>
            <th>
              <div className="skeleton-th skeleton-line short"></div>
            </th>
          </tr>
        </thead>
        <tbody>
          {[...Array(5)].map((_, i) => (
            <tr key={i}>
              {/* Product Column */}
              <td>
                <div className="skeleton-product-cell">
                  <div className="skeleton-img"></div>
                  <div className="skeleton-text-lines">
                    <div className="skeleton-line long"></div>
                    <div className="skeleton-line medium"></div>
                  </div>
                </div>
              </td>

              {/* SKU */}
              <td>
                <div className="skeleton-line medium"></div>
              </td>

              {/* Price */}
              <td>
                <div className="skeleton-line short"></div>
              </td>

              {/* Stock */}
              <td>
                <div className="skeleton-line short"></div>
              </td>

              {/* Status */}
              <td>
                <div className="skeleton-line badge"></div>
              </td>

              {/* Actions */}
              <td>
                <div className="skeleton-actions">
                  <div className="skeleton-btn"></div>
                  <div className="skeleton-btn"></div>
                  <div className="skeleton-btn"></div>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductPageSkeleton;
