import React from "react";
import "../styles/orders.css";
import { CiEdit } from "react-icons/ci";
import { MdDelete } from "react-icons/md";
import { FiEye } from "react-icons/fi";
import { TbPlayerTrackNext } from "react-icons/tb";
import { GrChapterPrevious } from "react-icons/gr";
import ProductsTableSkeleton from "../skeletons/ProductPageSkeleton";

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
                  <button
                    className="btn btn-view"
                    title="View Product"
                    type="button"
                    aria-label={`View`}
                  >
                    <FiEye size={20} />
                  </button>

                  <button
                    className="btn btn-edit"
                    title="Edit Product"
                    type="button"
                    aria-label={`Edit`}
                  >
                    <CiEdit size={20} />
                  </button>

                  <button
                    className="btn btn-delete"
                    title="Delete Order"
                    type="button"
                    aria-label={`Delete}`}
                  >
                    <MdDelete size={20} />
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
