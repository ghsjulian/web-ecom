import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/orders.css";
import PageLoader from "../components/PageLoader";
import useProduct from "../store/useProduct";

const ProductsPage = () => {
  const navigate = useNavigate();
  const { products = [], getAllProducts, fetchingProducts } = useProduct();

  useEffect(() => {
    getAllProducts();
  }, [getAllProducts]);

  if (fetchingProducts) {
    return (
      <div className="container">
        <PageLoader />
      </div>
    );
  }

  return (
    <div className="container">
      <>
        <div className="header">
          <h1>Product Management</h1>
          <button
            onClick={() => navigate("/add-product")}
            className="add-btn"
            type="button"
            aria-label="Add product"
          >
            <span className="icon-plus" /> Add Product
          </button>
        </div>

        <div className="controls">
          <div className="search-box">
            <input
              type="text"
              placeholder="Search products by name, SKU, or category..."
              aria-label="Search products"
            />
          </div>

          <select className="filter-select" aria-label="Filter by category">
            <option>All Categories</option>
            <option>Electronics</option>
            <option>Clothing</option>
            <option>Books</option>
            <option>Home &amp; Garden</option>
          </select>

          <select className="filter-select" aria-label="Filter by status">
            <option>All Status</option>
            <option>Active</option>
            <option>Inactive</option>
          </select>
        </div>

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Product</th>
                <th>SKU</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {products.length === 0 ? (
                <tr>
                  <td
                    colSpan="6"
                    style={{ textAlign: "center", padding: "1rem" }}
                  >
                    No products found.
                  </td>
                </tr>
              ) : (
                products.map((p) => (
                  <tr key={p._id ?? p.sku}>
                    <td data-label="Product">
                      <div className="product-info">
                        <img
                          src={
                            p.images[0] && p.images.length
                              ? p.images[0]?.url
                              : "https://via.placeholder.com/50"
                          }
                          alt={p.productName || "Product"}
                          className="product-img"
                        />
                        <div>
                          <div className="product-name">{p.productName}</div>
                          <div className="product-category">{p.category}</div>
                        </div>
                      </div>
                    </td>

                    <td data-label="SKU">{p.sku}</td>
                    <td data-label="Price" className="price">
                      {typeof p.salePrice === "number"
                        ? `$${p.salePrice.toFixed(2)}`
                        : p.price
                        ? `$${p.price.toFixed(2)}`
                        : "-"}
                    </td>

                    <td
                      data-label="Stock"
                      className={`stock ${
                        p.stock === 0
                          ? "out"
                          : p.stock <= (p.lowStock ?? 1)
                          ? "low"
                          : ""
                      }`}
                    >
                      {p.stock ?? "-"}
                    </td>

                    <td data-label="Status">
                      <span
                        className={`status ${
                          p.isPublished ? "active" : "inactive"
                        }`}
                      >
                        {p.isPublished ? "Active" : "Inactive"}
                      </span>
                    </td>

                    <td data-label="Actions">
                      <div className="actions">
                        <button
                          className="btn btn-view"
                          title="View"
                          type="button"
                          aria-label={`View ${p.productName}`}
                        >
                          <span className="icon-view" />
                        </button>
                        <button
                          onClick={() =>
                            navigate("/edit-product?productId=" + p._id)
                          }
                          className="btn btn-edit"
                          title="Edit"
                          type="button"
                          aria-label={`Edit ${p.productName}`}
                        >
                          <span className="icon-edit" />
                        </button>
                        <button
                          className="btn btn-delete"
                          title="Delete"
                          type="button"
                          aria-label={`Delete ${p.productName}`}
                        >
                          <span className="icon-delete" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* basic pagination placeholder — adapt to your paging data */}
        <div className="pagination">
          <div className="pagination-info">
            Showing {products.length} result{products.length !== 1 ? "s" : ""}
          </div>
          <div className="pagination-controls">
            <button
              className="page-btn disabled"
              type="button"
              aria-label="Previous page"
            >
              <span className="icon-prev" />
            </button>
            <button className="page-btn active" type="button">
              1
            </button>
            <button className="page-btn" type="button">
              2
            </button>
            <button className="page-btn" type="button">
              3
            </button>
            <button className="page-btn" type="button">
              4
            </button>
            <button className="page-btn" type="button">
              5
            </button>
            <button className="page-btn" type="button" aria-label="Next page">
              <span className="icon-next" />
            </button>
          </div>
        </div>
      </>
    </div>
  );
};

export default ProductsPage;
