import React from "react";
import api from "../services/api";
import { useDispatch, useSelector } from "react-redux";
import { removeUser } from "../features/authSlice";
import { useNavigate } from "react-router";
import { useState } from "react";
import { useEffect } from "react";

const Chat = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);

  const { user: currentUser } = useSelector((state) => state.auth);

  const fetchMessages = async (userId) => {
    try {
      const res = await api.get(`/messages/${userId}`);

      setMessages(res.data.messages);
      console.log(res.data.messages);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchUsers = async () => {
    const res = await api.get("/users");
    setUsers(res.data.users);
    console.log(res.data.users);
  };

  useEffect(() => {
    fetchUsers();
  }, []);
  useEffect(() => {
    if (selectedUser) {
      fetchMessages(selectedUser._id);
    }
  }, [selectedUser]);

  let dispatch = useDispatch();

  const navigate = useNavigate();
  let handleLogout = async () => {
    await api.get("/auth/logout");
    dispatch(removeUser());
    alert("user logged out");
    navigate("/");
  };
  return (
    <div className="h-screen bg-slate-950 text-white flex overflow-hidden">
      {/* Sidebar */}
      <div className="w-[30%] min-w-[320px] bg-slate-900 border-r border-slate-800 flex flex-col">
        {/* Profile */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src="https://i.pravatar.cc/150?img=12"
              alt=""
              className="w-12 h-12 rounded-full"
            />
            <div>
              <h2 className="font-semibold">{currentUser?.username}</h2>
              <p className="text-xs text-green-400">Online</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-500 hover:bg-red-600 rounded-lg text-sm transition"
          >
            Logout
          </button>
        </div>

        {/* Search */}
        <div className="p-4">
          <input
            type="text"
            placeholder="Search users..."
            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 outline-none focus:border-indigo-500"
          />
        </div>

        {/* Users */}
        <div className="flex-1 overflow-y-auto px-2">
          {users.map((user) => (
            <div
              key={user._id}
              onClick={() => setSelectedUser(user)}
              className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition mb-2 ${
                selectedUser?._id === user._id
                  ? "bg-indigo-600"
                  : "hover:bg-slate-800"
              }`}
            >
              <div className="relative">
                <img
                  src="https://i.pravatar.cc/150?img=12"
                  alt=""
                  className="w-12 h-12 rounded-full"
                />
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-slate-900"></span>
              </div>

              <div>
                <h3 className="font-medium">{user.username}</h3>
                <p className="text-xs text-slate-400">
                  Click to start chatting
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="w-[70%] flex flex-col bg-slate-950">
        {/* Header */}
        <div className="h-20 px-6 border-b border-slate-800 flex items-center gap-3 bg-slate-900">
          <img
            src="https://i.pravatar.cc/150?img=1"
            alt=""
            className="w-12 h-12 rounded-full"
          />

          <div>
            <h2 className="font-semibold text-lg">
              {selectedUser?.username || "Selected User"}
            </h2>
            <p className="text-sm text-green-400">
              {selectedUser ? "Online" : "No user selected"}{" "}
            </p>
          </div>
        </div>

        {/* Messages */}
        {/* <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4"> */}
          {/* Received */}

          <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4">
            {messages.map((msg) => (
              <div key={msg._id}>
                {msg.sender.toString() === currentUser._id.toString() ? (
                  <div className="flex justify-start">
                    <div className="max-w-md bg-slate-800 px-4 py-3 rounded-2xl">
                      {msg.content}
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-end">
                    <div className="max-w-md bg-indigo-600 px-4 py-3 rounded-2xl">
                      {msg.content}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Sent */}
          {/* <div className="flex justify-end">
            <div className="max-w-md bg-indigo-600 px-4 py-3 rounded-2xl rounded-br-md">
              <p>Hey! How are you?</p>
              <span className="text-xs text-indigo-200 mt-1 block">
                10:31 AM
              </span>
            </div>
          </div> */}

          {/* <div className="flex justify-start">
            <div className="max-w-md bg-slate-800 px-4 py-3 rounded-2xl rounded-bl-md">
              <p>I'm doing great. Working on a chat application UI.</p>
              <span className="text-xs text-slate-400 mt-1 block">
                10:32 AM
              </span>
            </div>
          </div> */}

          {/* <div className="flex justify-end">
            <div className="max-w-md bg-indigo-600 px-4 py-3 rounded-2xl rounded-br-md">
              <p>Looks awesome 🔥</p>
              <span className="text-xs text-indigo-200 mt-1 block">
                10:33 AM
              </span>
            </div>
          </div> */}
        {/* </div> */}

        {/* Input */}
        <div className="p-4 border-t border-slate-800 bg-slate-900 sticky bottom-0">
          <div className="flex gap-3">
            <input
              type="text"
              placeholder="Type a message..."
              className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 outline-none focus:border-indigo-500"
            />

            <button className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 rounded-xl font-medium transition">
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
