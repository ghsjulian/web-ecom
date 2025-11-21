import { create } from "zustand";
import axios from "../libs/axiosConfig";

const useProduct = create((set, get) => ({
  isCreatingProduct: false,

  createNewProduct: async (data, navigate) => {
    try {
      set({ isCreatingProduct: true });
      const res = await axios.post("/admin/product/create-product", data);
      if (!res?.data.success) {
        alert(res?.data?.message);
        return;
      }
      alert(res?.data?.message);
    } catch (error) {
      alert(error?.response?.data?.message);
    } finally {
      set({ isCreatingProduct: false });
    }
  },
}));

export default useProduct;
