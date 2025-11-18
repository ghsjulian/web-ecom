// src/components/ProtectedRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";
import useAuth from "../store/useAuth";

const AdminProtector = ({ children }) => {
  const { admin } = useAuth();
  if (!admin && admin?.role !== "ADMIN") {
    return <Navigate to="/admin-login" replace />;
  }

  return children;
};

export default AdminProtector;
