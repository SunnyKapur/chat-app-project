import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router";

const PublicRoute = () => {
  let { user, isAuthenticated } = useSelector((state) => state.auth);
  if (user) {
    return <Navigate to="/chat" />;
  }
  return <Outlet />;
};

export default PublicRoute;
