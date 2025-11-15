import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function RequireAuth({ children }) {
  const { session, loading } = useAuth();

  if (loading) {
    return <div style={{ padding: 20 }}>Checking session…</div>;
  }

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
