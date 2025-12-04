// stores/useOrder.js
import { create } from "zustand";
import axios from "../libs/axiosConfig";

const useOrder = create((set, get) => ({
  isFetchingOrder: false,
  totalOrders: [],

  getTotalOrders: async (filter = {}) => {
    try {
      const response = await axios.get("/admin/order/get-all-orders");
      console.log(response);
      set({ isFetchingOrder: false });
    } catch (error) {
      console.log(error.message);
    } finally {
      set({ isFetchingOrder: false });
    }
  },
}));

export default useOrder;
