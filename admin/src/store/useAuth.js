import { create } from "zustand";
import axios from "../libs/axiosConfig";

const useAuth = create((set, get) => ({
    admin: JSON.parse(localStorage.getItem("ecom-admin")) || null,
    isSigningIn: false,

    loginNow: async (data, showMessage, navigate) => {
        try {
            set({ isSigningIn: true });
            const res = await axios.post("/auth/login", data);
            if (!res?.data.success) {
                showMessage(res?.data?.message, false);
                return;
            }
            localStorage.setItem("ecom-admin", JSON.stringify(res?.data?.user));
            showMessage(res?.data?.message, true);
            setTimeout(() => {
                navigate("/dashboard");
                set({ admin: res?.data?.user });
            }, 1500);
        } catch (error) {
            showMessage(error?.response?.data?.message, false);
        } finally {
            set({ isSigningIn: false });
        }
    },
    createUser: async (data, showMessage, navigate) => {
        try {
            set({ isSigningIn: true });
            const res = await axios.post("/auth/signup", data);
            if (!res?.data.success) {
                showMessage(res?.data?.message, false);
                return;
            }
            localStorage.setItem("ecom-admin", JSON.stringify(res?.data?.user));
            showMessage(res?.data?.message, true);
            setTimeout(() => {
                navigate("/");
                set({ admin: res?.data?.user });
            }, 1500);
        } catch (error) {
            showMessage(error?.response?.data?.message, false);
        } finally {
            set({ isSigningIn: false });
        }
    },
    isAuth: async () => {
        try {
            const res = axios.get("/is-admin");
            if (res?.data?.success) {
                console.log(res.data);
            }
        } catch (err) {
            console.error("Error:", err);
        }
    },
    logout: async () => {
        try {
            const res = await axios.post("/logout");
            if (res?.data?.success) {
                localStorage.removeItem("ecom-admin");
                set({ admin: null });
            }
        } catch (error) {
            console.log(error);
        }
    }
}));

export default useAuth;
