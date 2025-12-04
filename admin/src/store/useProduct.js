// stores/useProduct.js
import { create } from "zustand";
import axios from "../libs/axiosConfig";

const DEFAULT_LIMIT = 5;

const useProduct = create((set, get) => ({
  // UI / loading state
  isCreatingProduct: false,
  createPercent: 0,
  createError: null,

  products: [],
  fetchingProducts: false,
  total: 0,
  page: 1,
  pages: 1,

  singleProduct: {},
  isgetProduct: false,
  isupdatingProduct: false,

  isDeleteing: false,

  // Create product (unchanged logic except small fixes)
  createNewProduct: async (data = {}, navigate) => {
    set({ isCreatingProduct: true, createPercent: 0, createError: null });
    try {
      const res = await axios.post("/admin/product/create-product", data, {
        headers: { "Content-Type": "application/json" },
        onUploadProgress: (p) => {
          if (p.lengthComputable) {
            const percent = Math.round((p.loaded * 100) / p.total);
            set({ createPercent: percent });
          } else {
            set((s) => ({ createPercent: Math.min(s.createPercent + 5, 95) }));
          }
        },
      });

      const resp = res?.data;
      if (!resp) throw new Error("No response from server");
      if (!resp.success) {
        set({ createError: resp.message || "Failed to create product" });
        alert(resp.message || "Failed to create product");
        return null;
      }

      set({ createPercent: 100 });
      setTimeout(() => set({ createPercent: 0 }), 500);
      alert(resp.message || "Product created successfully");
      navigate("/products");
      return resp;
    } catch (error) {
      const msg =
        error?.response?.data?.message || error.message || "Unknown error";
      set({ createError: msg });
      alert(msg);
      throw error;
    } finally {
      set({ isCreatingProduct: false });
    }
  },

  updateProduct: async (id, data = {}, navigate) => {
    set({ isupdatingProduct: true, createError: null });
    try {
      const res = await axios.put(
        "/admin/product/update-product?id=" + id,
        data,
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      const resp = res?.data;
      if (!resp) throw new Error("No response from server");
      if (!resp.success) {
        set({ createError: resp.message || "Failed to update product" });
        return null;
      }
      navigate("/products");
      return resp;
    } catch (error) {
      const msg =
        error?.response?.data?.message || error.message || "Unknown error";
      set({ createError: msg });
      throw error;
    } finally {
      set({ isupdatingProduct: false });
    }
  },

  /**
   * getAllProducts(filters)
   * filters: { q, category, status, page, limit, sortBy, minPrice, maxPrice }
   * default limit = 5 (server also defaults to 5)
   */
  getAllProducts: async (filters = {}) => {
    set({ fetchingProducts: true });

    // Normalize filters: ensure numbers where needed
    const params = { ...filters };
    if (!params.limit) params.limit = DEFAULT_LIMIT;
    if (!params.page) params.page = 1;

    try {
      const { data } = await axios.get("/admin/product/get-all-products", {
        params,
      });

      const success = !!data?.success;
      const products = Array.isArray(data?.products) ? data.products : [];
      const total =
        typeof data?.total === "number"
          ? data.total
          : typeof data?.count === "number"
          ? data.count
          : products.length;
      const page =
        typeof data?.page === "number" ? data.page : Number(params.page) || 1;
      const pages =
        typeof data?.pages === "number"
          ? data.pages
          : Math.max(1, Math.ceil(total / Number(params.limit)));

      if (success) {
        set({ products, total, page, pages });
      } else {
        // clear list on failure
        set({ products: [], total: 0, page: 1, pages: 1 });
      }

      return { success, products, total, page, pages };
    } catch (error) {
      console.error(
        "getAllProducts error:",
        error.response?.data ?? error.message ?? error
      );
      set({ products: [], total: 0, page: 1, pages: 1 });
      throw error;
    } finally {
      set({ fetchingProducts: false });
    }
  },

  /**
   * Convenience: searchProducts(query, extraFilters)
   * Will call getAllProducts with q=query and page reset to 1 by default
   */
  searchProducts: async (query = "", extraFilters = {}) => {
    const filters = {
      ...extraFilters,
      q: query?.trim?.() ?? "",
      page: extraFilters.page ?? 1,
      limit: extraFilters.limit ?? DEFAULT_LIMIT,
    };
    return get().getAllProducts(filters);
  },

  getSingleProduct: async (id) => {
    try {
      set({ isgetProduct: true });
      const response = await axios.get("/admin/product/get-product?id=" + id);
      set({ singleProduct: response?.data?.product ?? {} });
      return response?.data;
    } catch (error) {
      console.log(error);
    } finally {
      set({ isgetProduct: false });
    }
  },
  deleteProduct: async (id, target) => {
    try {
      target.textContent = "...";
      set({ isDeleteing: true });
      const response = await axios.delete(
        "/admin/product/delete-product?id=" + id
      );
      await get().getAllProducts();
      set({ page: 1, pages: 1 });
      return response?.data;
    } catch (error) {
      console.error(
        "deleteProduct error:",
        error.response?.data ?? error.message ?? error
      );
      throw error;
    } finally {
      set({ isDeleteing: false });
    }
  },
}));

export default useProduct;
