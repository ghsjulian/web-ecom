import React from "react";
import "../styles/orders.css";

const OrdersPage = () => {
  return (
    <div class="container">
      <div class="header">
        <h1>Orders Management</h1>
        <button class="add-btn">
          <span class="icon-plus"></span> Add Product
        </button>
      </div>
      <div class="controls">
        <div class="search-box">
          <input
            type="text"
            placeholder="Search products by name, SKU, or category..."
          />
        </div>
        <select class="filter-select">
          <option>All Categories</option>
          <option>Electronics</option>
          <option>Clothing</option>
          <option>Books</option>
          <option>Home & Garden</option>
        </select>
        <select class="filter-select">
          <option>All Status</option>
          <option>Active</option>
          <option>Inactive</option>
        </select>
      </div>
      <div class="table-container">
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
            <tr>
              <td data-label="Product">
                <div class="product-info">
                  <img
                    src="https://via.placeholder.com/50"
                    alt="Laptop"
                    class="product-img"
                  />
                  <div>
                    <div class="product-name">Dell XPS 13</div>
                    <div class="product-category">Electronics</div>
                  </div>
                </div>
              </td>
              <td data-label="SKU">LAP-001</td>
              <td data-label="Price" class="price">
                $999.00
              </td>
              <td data-label="Stock" class="stock">
                47
              </td>
              <td data-label="Status">
                <span class="status active">Active</span>
              </td>
              <td data-label="Actions">
                <div class="actions">
                  <button class="btn btn-view" title="View">
                    <span class="icon-view"></span>
                  </button>
                  <button class="btn btn-edit" title="Edit">
                    <span class="icon-edit"></span>
                  </button>
                  <button class="btn btn-delete" title="Delete">
                    <span class="icon-delete"></span>
                  </button>
                </div>
              </td>
            </tr>
            <tr>
              <td data-label="Product">
                <div class="product-info">
                  <img
                    src="https://via.placeholder.com/50"
                    alt="T-Shirt"
                    class="product-img"
                  />
                  <div>
                    <div class="product-name">Cotton T-Shirt</div>
                    <div class="product-category">Clothing</div>
                  </div>
                </div>
              </td>
              <td data-label="SKU">TSH-045</td>
              <td data-label="Price" class="price">
                $24.99
              </td>
              <td data-label="Stock" class="stock low">
                8
              </td>
              <td data-label="Status">
                <span class="status active">Active</span>
              </td>
              <td data-label="Actions">
                <div class="actions">
                  <button class="btn btn-view" title="View">
                    <span class="icon-view"></span>
                  </button>
                  <button class="btn btn-edit" title="Edit">
                    <span class="icon-edit"></span>
                  </button>
                  <button class="btn btn-delete" title="Delete">
                    <span class="icon-delete"></span>
                  </button>
                </div>
              </td>
            </tr>
            <tr>
              <td data-label="Product">
                <div class="product-info">
                  <img
                    src="https://via.placeholder.com/50"
                    alt="Book"
                    class="product-img"
                  />
                  <div>
                    <div class="product-name">Atomic Habits</div>
                    <div class="product-category">Books</div>
                  </div>
                </div>
              </td>
              <td data-label="SKU">BOK-112</td>
              <td data-label="Price" class="price">
                $16.50
              </td>
              <td data-label="Stock" class="stock out">
                0
              </td>
              <td data-label="Status">
                <span class="status inactive">Inactive</span>
              </td>
              <td data-label="Actions">
                <div class="actions">
                  <button class="btn btn-view" title="View">
                    <span class="icon-view"></span>
                  </button>
                  <button class="btn btn-edit" title="Edit">
                    <span class="icon-edit"></span>
                  </button>
                  <button class="btn btn-delete" title="Delete">
                    <span class="icon-delete"></span>
                  </button>
                </div>
              </td>
            </tr>
            <tr>
              <td data-label="Product">
                <div class="product-info">
                  <img
                    src="https://via.placeholder.com/50"
                    alt="Chair"
                    class="product-img"
                  />
                  <div>
                    <div class="product-name">Ergonomic Office Chair</div>
                    <div class="product-category">Home & Garden</div>
                  </div>
                </div>
              </td>
              <td data-label="SKU">CHR-078</td>
              <td data-label="Price" class="price">
                $189.00
              </td>
              <td data-label="Stock" class="stock">
                23
              </td>
              <td data-label="Status">
                <span class="status active">Active</span>
              </td>
              <td data-label="Actions">
                <div class="actions">
                  <button class="btn btn-view" title="View">
                    <span class="icon-view"></span>
                  </button>
                  <button class="btn btn-edit" title="Edit">
                    <span class="icon-edit"></span>
                  </button>
                  <button class="btn btn-delete" title="Delete">
                    <span class="icon-delete"></span>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="pagination">
        <div class="pagination-info">Showing 1 to 4 of 48 results</div>
        <div class="pagination-controls">
          <button class="page-btn disabled">
            <span class="icon-prev"></span>
          </button>
          <button class="page-btn active">1</button>
          <button class="page-btn">2</button>
          <button class="page-btn">3</button>
          <button class="page-btn">4</button>
          <button class="page-btn">5</button>
          <button class="page-btn">
            <span class="icon-next"></span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrdersPage;
