// stores/useProduct.js
import { create } from "zustand";
import axios from "../libs/axiosConfig";



const useProduct = create((set, get) => ({
  isCreatingProduct: false,
  createPercent: 0,
  createError: null,
  createNewProduct: async (data = {}, navigate) => {
    set({ isCreatingProduct: true, createPercent: 0, createError: null });
    try {
      const res = await axios.post("/admin/product/create-product", data, {
        headers: { "Content-Type": "application/json" },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.lengthComputable) {
            const p = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            set({ createPercent: p });
          } else {
            // fallback smooth increment if length not computable
            set((s) => ({ createPercent: Math.min(s.createPercent + Math.floor(Math.random() * 6) + 3, 95) }));
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
      console.log(resp)
    } catch (error) {
      const msg = error?.response?.data?.message || error.message || "Unknown error";
      set({ createError: msg });
      alert(msg);
      throw error; // rethrow so caller can also handle
    } finally {
      set({ isCreatingProduct: false });
    }
  },
}));

export default useProduct;
