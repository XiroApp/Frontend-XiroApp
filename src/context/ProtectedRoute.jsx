import React from "react";
import { Navigate, Outlet } from "react-router-dom";

export default function ProtectedRoute({
  children,
  user,
  isAllowed,
  redirectTo,
}) {
  if (!isAllowed) {
    return <Navigate to={redirectTo} />;
  }

  return children ? children : <Outlet />;
}
