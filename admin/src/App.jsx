import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Layouts from "./layouts/Layouts";
import NotFound from "./pages/NotFound";
import Dashboard from "./pages/Dashboard";
import AdminLogin from "./pages/AminLogin";
import Signup from "./pages/Signup";
import UsersPage from "./pages/UsersPage";
import ViewUser from "./pages/ViewUser";
import AddProduct from "./pages/AddProduct";
import EditProduct from "./pages/EditProduct";
import Analytics from "./pages/Analytics";
import Overview from "./pages/Overview";
import ProductsPage from "./pages/ProductsPage";
import OrdersPage from "./pages/OrdersPage";
import BillingInfo from "./pages/BillingInfo";
import AdminProtector from "./protector/AdminProtector";
import useAuth from "./store/useAuth";
import { useEffect } from "react";
import Loader from "./components/Loader";
import ForgetPassword from "./pages/ForgetPassword";
import ViewProductPage from "./pages/ViewProductPage";

const App = () => {
  const { admin, isAuth, isChecking } = useAuth();
  useEffect(() => {
    isAuth();
  }, [isAuth]);
  return (
    <>
      {isChecking ? (
        <Loader />
      ) : (
        <Router>
          <Routes>
            <Route
              path="/"
              element={
                <AdminProtector>
                  <Layouts />
                </AdminProtector>
              }
            >
              <Route index element={<Dashboard />} />
              <Route path="analytics" element={<Analytics />} />
              <Route path="overview" element={<Overview />} />
              <Route path="products" element={<ProductsPage />} />
              <Route path="orders" element={<OrdersPage />} />
              <Route path="view-user" element={<ViewUser />} />
              <Route path="customers" element={<UsersPage />} />
              <Route path="billing-info" element={<BillingInfo />} />
              <Route path="add-product" element={<AddProduct />} />
              <Route path="edit-product/:id" element={<EditProduct />} />
              <Route path="view-product/:id" element={<ViewProductPage />} />
            </Route>
            <Route
              path="/admin-login"
              element={!admin ? <AdminLogin /> : <Navigate to="/" />}
            />
            <Route path="/create-user" element={<Signup />} />
            <Route path="/reset-password" element={<ForgetPassword />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
      )}
    </>
  );
};

export default App;
