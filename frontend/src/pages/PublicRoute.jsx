import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router";

const PublicRoute = () => {
  let { user, isLoading } = useSelector((state) => state.auth);
    if(isLoading) return <h1>Loading....</h1>

  if (user) {
    return <Navigate to="/chat" />;
  }
  return <Outlet />;
};

export default PublicRoute;
