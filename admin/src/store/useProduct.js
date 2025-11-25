// stores/useProduct.js
import { create } from "zustand";
import axios from "../libs/axiosConfig";

const useProduct = create((set, get) => ({
  isCreatingProduct: false,
  createPercent: 0,
  createError: null,
  products: [],
  fetchingProducts: false,
  singleProduct: {},
  isgetProduct: false,

  createNewProduct: async (data = {}, navigate) => {
    set({ isCreatingProduct: true, createPercent: 0, createError: null });
    try {
      const res = await axios.post("/admin/product/create-product", data, {
        headers: { "Content-Type": "application/json" },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.lengthComputable) {
            const p = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            set({ createPercent: p });
          } else {
            // fallback smooth increment if length not computable
            set((s) => ({
              createPercent: Math.min(
                s.createPercent + Math.floor(Math.random() * 6) + 3,
                95
              ),
            }));
          }
        },
      });
      // normalize response
      const resp = res?.data;
      if (!resp) throw new Error("No response from server");
      if (!resp.success) {
        set({ createError: resp.message || "Failed to create product" });
        alert(resp.message || "Failed to create product");
        return null;
      }
      // success
      set({ createPercent: 100 });
      // small delay so UI can show 100%
      setTimeout(() => set({ createPercent: 0 }), 600);
      alert(resp.message || "Product created successfully");
      // return resp.product || resp.data || resp;
      console.log(resp);
    } catch (error) {
      const msg =
        error?.response?.data?.message || error.message || "Unknown error";
      set({ createError: msg });
      alert(msg);
      throw error; // rethrow so caller can also handle
    } finally {
      set({ isCreatingProduct: false });
    }
  },
  getAllProducts: async () => {
    // start loading
    set({ fetchingProducts: true });
    try {
      // use destructuring to get real response data and make logs clearer
      const { data } = await axios.get("/admin/product/get-all-products");

      // better checks: accept either `count` or `products` array length
      const hasProducts =
        (typeof data?.count === "number" && data.count > 0) ||
        (Array.isArray(data?.products) && data.products.length > 0);

      if (data?.success && hasProducts) {
        console.log("Products:", data.products);
        set({ products: data.products });
      } else {
        // If API returns success but no products, clear products (optional)
        console.log("No products returned from API:", data);
        set({ products: [] });
      }
    } catch (error) {
      // improve error logging to include server response when available
      console.error(
        "getAllProducts error:",
        error.response?.data ?? error.message ?? error
      );
      // optionally surface an error state in store, e.g. set({ productsError: true })
    } finally {
      // stop loading — this must be false
      set({ fetchingProducts: false });
    }
  },
  getSingleProduct: async (id) => {
    try {
      set({ isgetProduct: true });
      const response = await axios.get("/admin/product/get-product?id=" + id);
      console.log(response.data);
      set({ singleProduct: response?.data?.product });
    } catch (error) {
      console.log(error);
    } finally {
      set({ isgetProduct: false });
    }
  },
}));

export default useProduct;
