import React from "react";
import api from "../services/api";
import { useDispatch } from "react-redux";
import { removeUser } from "../features/authSlice";

const Chat = () => {
  let dispatch = useDispatch();

  let handleLogout = async () => {
    await api.get("/auth/logout");
    dispatch(removeUser());
    alert("user logged out");
    navigate("/");
  };
  return (
    <div>
      <h1 className="text-4xl">Chat pages jo ki login ke baad dikhe ga</h1>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Chat;
