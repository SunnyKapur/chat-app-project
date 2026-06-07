import React, { useEffect } from "react";
import { createBrowserRouter, data, RouterProvider } from "react-router";
import AuthLayout from "../layouts/AuthLayout";
import MainLayout from "../layouts/MainLayout";
import Chat from "../pages/Chat";
import Login from "../pages/Login";
import Register from "../pages/Register";
import PublicRoute from "../pages/PublicRoute";
import Protected from "../pages/Protected";
import api from "../services/api";
import { useDispatch } from "react-redux";
import { addUser, removeUser } from "../features/authSlice";

const AppRoutes = () => {
  let dispatch = useDispatch();

  let getMeFromServer = async () => {
    try {
      const res = await api.get("/auth/me");
      dispatch(addUser(res.data.user));
      console.log(res);
    } catch (error) {
      dispatch(removeUser());
    }
  };

  useEffect(() => {
    getMeFromServer();
  }, []);

  const router = createBrowserRouter([
    {
      path: "/",
      element: <PublicRoute />,
      children: [
        {
          path: "",
          element: <AuthLayout />,
          children: [
            {
              path: "",
              element: <Login />,
            },
            {
              path: "register",
              element: <Register />,
            },
          ],
        },
      ],
    },
    {
      path: "/chat",
      element: <Protected />,
      children: [
        {
          path: "",
          element: <MainLayout />,
          children: [
            {
              path: "",
              element: <Chat />,
            },
          ],
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
};

export default AppRoutes;
