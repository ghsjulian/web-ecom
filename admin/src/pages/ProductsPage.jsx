// src/pages/ProductsPage.jsx
import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/orders.css";
import PageLoader from "../components/PageLoader";
import useProduct from "../store/useProduct";
import { CiEdit } from "react-icons/ci";
import { MdDelete } from "react-icons/md";
import { FiEye } from "react-icons/fi";
import { TbPlayerTrackNext } from "react-icons/tb";
import { GrChapterPrevious } from "react-icons/gr";

/* Debounce hook */
function useDebounce(value, delay = 300) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

const ProductsPage = () => {
  const navigate = useNavigate();
  const {
    products = [],
    getAllProducts,
    searchProducts,
    fetchingProducts,
    total = 0,
    page: storePage = 1,
    pages: storePages = 1,
  } = useProduct();

  // UI filter state
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 350);

  const [category, setCategory] = useState("All Categories");
  const [status, setStatus] = useState("All Status");

  // pagination
  const [currentPage, setCurrentPage] = useState(storePage || 1);
  const [pages, setPages] = useState(storePages || 1);
  const PAGE_SIZE = 5; // strict requirement

  // Sync store -> local
  useEffect(() => {
    if (typeof storePage === "number") setCurrentPage(storePage);
  }, [storePage]);

  useEffect(() => {
    if (typeof storePages === "number") setPages(storePages);
  }, [storePages]);

  // Build filters
  const buildFilters = useCallback(
    (opts = {}) => {
      const f = {
        page: opts.page ?? currentPage,
        limit: opts.limit ?? PAGE_SIZE,
        sortBy: opts.sortBy ?? "-createdAt",
      };

      if (debouncedSearch && debouncedSearch.trim())
        f.q = debouncedSearch.trim();
      if (category && category !== "All Categories") f.category = category;
      if (status && status !== "All Status") f.status = status;
      return { ...f, ...opts };
    },
    [debouncedSearch, category, status, currentPage]
  );

  // Initial + filters effect: when search/category/status change -> fetch page 1
  useEffect(() => {
    let mounted = true;
    const doFetch = async () => {
      try {
        const filters = buildFilters({ page: 1 });
        setCurrentPage(1);
        let resp;
        if (filters.q) {
          resp = await searchProducts(filters.q, filters);
        } else {
          resp = await getAllProducts(filters);
        }
        if (!mounted) return;
        if (resp?.page) setCurrentPage(resp.page);
        if (resp?.pages) setPages(resp.pages);
      } catch (err) {
        console.error("Filter/search fetch error:", err);
      }
    };
    doFetch();
    return () => {
      mounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch, category, status]);

  // Page change effect
  useEffect(() => {
    let mounted = true;
    const fetchPage = async () => {
      try {
        const filters = buildFilters({ page: currentPage });
        const resp = await getAllProducts(filters);
        if (!mounted) return;
        if (resp?.page) setCurrentPage(resp.page);
        if (resp?.pages) setPages(resp.pages);
      } catch (err) {
        console.error("Page fetch error:", err);
      }
    };
    fetchPage();
    return () => {
      mounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  const onSearchChange = (e) => setSearch(e.target.value);
  const onCategoryChange = (e) => setCategory(e.target.value);
  const onStatusChange = (e) => setStatus(e.target.value);

  const goToPage = (p) => {
    const pn = Number(p || 1);
    if (pn < 1 || pn > pages) return;
    if (pn === currentPage) return;
    setCurrentPage(pn);
  };
  const goPrev = () => goToPage(Math.max(1, currentPage - 1));
  const goNext = () => goToPage(Math.min(pages, currentPage + 1));

  // Page buttons rendering (compact)
  const renderPageButtons = () => {
    const maxButtons = 7;
    const out = [];
    if (pages <= maxButtons) {
      for (let i = 1; i <= pages; i++) out.push(i);
    } else {
      const half = Math.floor(maxButtons / 2);
      let start = Math.max(1, currentPage - half);
      let end = start + maxButtons - 1;
      if (end > pages) {
        end = pages;
        start = pages - maxButtons + 1;
      }
      for (let i = start; i <= end; i++) out.push(i);
    }

    return (
      <>
        {currentPage > 4 && (
          <>
            <button className="page-btn" onClick={() => goToPage(1)}>
              1
            </button>
            <span className="ellipsis">...</span>
          </>
        )}

        {out.map((p) => (
          <button
            key={p}
            className={`page-btn ${p === currentPage ? "active" : ""}`}
            onClick={() => goToPage(p)}
            aria-current={p === currentPage ? "page" : undefined}
          >
            {p}
          </button>
        ))}

        {currentPage < pages - 3 && (
          <>
            <span className="ellipsis">...</span>
            <button className="page-btn" onClick={() => goToPage(pages)}>
              {pages}
            </button>
          </>
        )}
      </>
    );
  };

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
              value={search}
              onChange={onSearchChange}
              type="text"
              placeholder="Search products by name, SKU, or category..."
              aria-label="Search products"
            />
          </div>

          <select
            className="filter-select"
            value={category}
            onChange={onCategoryChange}
            aria-label="Filter by category"
          >
            <option>All Categories</option>
            <option>Electronics</option>
            <option>Clothing</option>
            <option>Books</option>
            <option>Home &amp; Garden</option>
          </select>

          <select
            className="filter-select"
            value={status}
            onChange={onStatusChange}
            aria-label="Filter by status"
          >
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
              {!products || products.length === 0 ? (
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
                            p.images && p.images.length
                              ? p.images[0].url
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
                          title="View Product"
                          type="button"
                          aria-label={`View ${p.productName}`}
                        >
                          <FiEye size={20} />
                        </button>

                        <button
                          onClick={() =>
                            navigate("/edit-product?productId=" + p._id)
                          }
                          className="btn btn-edit"
                          title="Edit Product"
                          type="button"
                          aria-label={`Edit ${p.productName}`}
                        >
                          <CiEdit size={20} />
                        </button>

                        <button
                          className="btn btn-delete"
                          title="Delete Product"
                          type="button"
                          aria-label={`Delete ${p.productName}`}
                        >
                          <MdDelete size={20} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="pagination">
          <div className="pagination-info">
            Showing {products.length} of {total} result{total !== 1 ? "s" : ""}
          </div>
          <div className="pagination-controls">
            <button
              className="page-btn"
              onClick={goPrev}
              disabled={currentPage <= 1}
              aria-label="Previous page"
            >
              <GrChapterPrevious size={20} />
            </button>
            {renderPageButtons()}
            <button
              className="page-btn"
              onClick={goNext}
              disabled={currentPage >= pages}
              aria-label="Next page"
            >
              <TbPlayerTrackNext size={20} />
            </button>
          </div>
        </div>
      </>
    </div>
  );
};

export default ProductsPage;
