import React from "react";
import api from "../services/api";
import { useDispatch, useSelector } from "react-redux";
import { removeUser } from "../features/authSlice";
import { useNavigate } from "react-router";
import { useState, useEffect, useRef } from "react";
import socket from "../services/socket";

const Chat = () => {
  const { user: currentUser } = useSelector((state) => state.auth);

  let dispatch = useDispatch();

  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [content, setContent] = useState("");

  // activeTab      → sidebar mein DM ya Groups tab select hai
  // groups         → meri saari groups ki list
  // selectedGroup  → jis group par click kiya
  // groupMessages  → us group ke messages
  // showCreateGroup→ "Create Group" modal open/close
  // groupName      → input field ka value
  // selectedMembers→ checkboxes se jo members choose kiye
  const [groups, setGroups] = useState([]); // sari groups
  const [selectedGroup, setSelectedGroup] = useState(null); //selected group
  const [groupMessages, setGroupMessages] = useState([]); // group ke messages
  const [activeTab, setActiveTab] = useState("dm"); // "dm" ya "group tab"
  const [showCreateGroup, setShowCreateGroup] = useState(false); // modal
  const [groupName, setGroupName] = useState(""); //naya group ka naam
  const [selectedMembers, setSelectedMembers] = useState([]); //group members

  const handleSendMessage = async () => {
    const res = await api.post("/messages", {
      receiver: selectedUser._id,
      content,
    });

    // frontend se real time data send
    socket.emit("send-message", {
      _id: res.data.data._id,
      sender: currentUser._id,
      receiver: selectedUser._id,
      content,
    });

    setMessages((prev) => [...prev, res.data.data]);
    setContent("");
    console.log(res.data);
  };

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

  let handleLogout = async () => {
    await api.get("/auth/logout");
    dispatch(removeUser());
    alert("user logged out");
    navigate("/");
  };

  // Saari groups fetch karo
  const fetchGroups = async () => {
    const res = await api.get("/groups");
    console.log(res.data.groups);
    setGroups(res.data.groups);
  };

  // Group ke messages fetch karo
  const fetchGroupMessages = async (groupId) => {
    const res = await api.get(`/groups/${groupId}/messages`);
    setGroupMessages(res.data.messages);
  };

  //Naya group banao
  const handleCreateGroup = async () => {
    if (!groupName || selectedMembers.length === 0) return;

    await api.post("/groups", {
      name: groupName,
      members: selectedMembers,
    });

    // Rest karo sab
    setGroupName("");
    setSelectedMembers([]);
    setShowCreateGroup(false);
    fetchGroups(); // list refresh karo
  };

  // Group message bejo
  const handleSendGroupMessage = async () => {
    const res = await api.post(`/groups/${selectedGroup._id}/messages`, {
      content,
    });

    // Socket se real-time broadcast
    socket.emit("send-group-message", {
      groupId: selectedGroup._id,
      sender: currentUser._id,
      senderName: currentUser.username,
      content,
      _id: res.data.data._id,
    });

    // setGroupMessages((prev) => [...prev, res.data.data]);
    setContent("");
  };

  // Member checkbox toggle
  const toggleMember = (userId) => {
    setSelectedMembers(
      (prev) =>
        prev.includes(userId)
          ? prev.filter((id) => id !== userId) // already selected -> remove
          : [...prev, userId], //nahi tha -> add
    );
  };

  const selectedUserRef = useRef(null);
  const selectedGroupRef = useRef(null);

  useEffect(() => {
    selectedUserRef.current = selectedUser;
  }, [selectedUser]);

  useEffect(() => {
    selectedGroupRef.current = selectedGroup;
  }, [selectedGroup]);

  // Group fetch karo start mein
  useEffect(() => {
    fetchGroups();
  }, []);

  // Jab group select ho
  useEffect(() => {
    if (selectedGroup) {
      fetchGroupMessages(selectedGroup._id);
      socket.emit("join-group", selectedGroup._id); // socket room join karo
    }
  }, [selectedGroup]);

  // Group ka real-time message sunna
  // useEffect(() => {
  //   socket.on("receive-group-message", (data) => {
  //     // Srif tab add karo jab same group open ho
  //     if (selectedGroup?._id === data.groupId) {
  //       setGroupMessages((prev) => [
  //         ...prev,
  //         {
  //           _id: data._id,
  //           sender: { _id: data.sender, username: data.senderName },
  //           content: data.content,
  //         },
  //       ]);
  //     }
  //   });

  //   return () => socket.off("receive-group-message");
  // }, [selectedGroup]);

  useEffect(() => {
    socket.on("receive-group-message", (data) => {
      if (selectedGroupRef.current?._id === data.groupId) {
        // ← ref
        setGroupMessages((prev) => [
          ...prev,
          {
            _id: data._id,
            sender: { _id: data.sender, username: data.senderName },
            content: data.content,
          },
        ]);
      }
    });
    return () => socket.off("receive-group-message");
  }, []);

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (selectedUser) {
      fetchMessages(selectedUser._id);
    }
  }, [selectedUser]);

  //useEffect mein-component mount hone par setup karo
  useEffect(() => {
    if (currentUser?._id) {
      socket.emit("setup", currentUser._id);
    }
  }, [currentUser]);

  // useEffect mein - recevie-message sun-te  raho

  // useEffect(() => {
  //   socket.on("receive-message", (data) => {
  //     // tab add karo jab same conversation open ho
  //     if (selectedUser?._id === data.sender) {
  //       setMessages((prev) => [
  //         ...prev,
  //         {
  //           _id: data._id,
  //           sender: data.sender,
  //           receiver: data.receiver,
  //           content: data.content,
  //         },
  //       ]);
  //     }
  //   });

  //   return () => socket.off("receive-message"); // cleanup
  // }, [selectedUser]);
  useEffect(() => {
    socket.on("receive-message", (data) => {
      if (selectedUserRef.current?._id === data.sender) {
        // ← ref
        setMessages((prev) => [
          ...prev,
          {
            _id: data._id,
            sender: data.sender,
            receiver: data.receiver,
            content: data.content,
          },
        ]);
      }
    });
    return () => socket.off("receive-message");
  }, []);

  return (
    <div className="h-screen bg-slate-950 text-white flex overflow-hidden">
      {/* Create Group Modal */}
      {showCreateGroup && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-slate-900 rounded-2xl p-6 w-[400px] border border-slate-700">
            <h2 className="text-lg font-semibold mb-4">Create New Group</h2>

            <input
              type="text"
              placeholder="Group name..."
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 outline-none focus:border-indigo-500 mb-4"
            />

            <p className="text-sm text-slate-400 mb-2">Select Members:</p>
            <div className="max-h-48 overflow-y-auto space-y-2 mb-4">
              {users.map((user) => (
                <div
                  key={user._id}
                  onClick={() => toggleMember(user._id)}
                  className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition ${
                    selectedMembers.includes(user._id)
                      ? "bg-indigo-600"
                      : "hover:bg-slate-800"
                  }`}
                >
                  <img
                    src="https://i.pravatar.cc/150?img=12"
                    className="w-8 h-8 rounded-full"
                  />
                  <span>{user.username}</span>
                  {selectedMembers.includes(user._id) && (
                    <span className="ml-auto text-sm">✓</span>
                  )}
                </div>
              ))}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowCreateGroup(false)}
                className="flex-1 py-2 bg-slate-700 hover:bg-slate-600 rounded-xl transition"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateGroup}
                className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-xl transition"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
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
        {/* Tabs */}
        <div className="flex border-b border-slate-800">
          <button
            onClick={() => setActiveTab("dm")}
            className={`flex-1 py-3 text-sm font-medium transition ${
              activeTab === "dm"
                ? "text-white border-b-2 border-indigo-500"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Direct Messages
          </button>
          <button
            onClick={() => setActiveTab("group")}
            className={`flex-1 py-3 text-sm font-medium transition ${
              activeTab === "group"
                ? "text-white border-b-2 border-indigo-500"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Groups
          </button>
        </div>

        {/* DM Tab */}
        {activeTab === "dm" && (
          <div className="flex-1 overflow-y-auto px-2 pt-2">
            {users.map((user) => (
              <div
                key={user._id}
                onClick={() => {
                  setSelectedUser(user);
                  setSelectedGroup(null); // group deselect karo
                }}
                className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition mb-2 ${
                  selectedUser?._id === user._id
                    ? "bg-indigo-600"
                    : "hover:bg-slate-800"
                }`}
              >
                <div className="relative">
                  <img
                    src="https://i.pravatar.cc/150?img=12"
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
        )}

        {/* Groups Tab */}
        {activeTab === "group" && (
          <div className="flex-1 overflow-y-auto px-2 pt-2">
            <button
              onClick={() => setShowCreateGroup(true)}
              className="w-full mb-3 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-xl text-sm font-medium transition"
            >
              + Create Group
            </button>

            {groups.map((group) => (
              <div
                key={group._id}
                onClick={() => {
                  setSelectedGroup(group);
                  setSelectedUser(null); // DM deselect karo
                }}
                className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition mb-2 ${
                  selectedGroup?._id === group._id
                    ? "bg-indigo-600"
                    : "hover:bg-slate-800"
                }`}
              >
                {/* Group ka pehla letter avatar */}
                <div className="w-12 h-12 rounded-full bg-indigo-700 flex items-center justify-center font-bold text-lg">
                  {group.name[0].toUpperCase()}
                </div>
                <div>
                  <h3 className="font-medium">{group.name}</h3>
                  <p className="text-xs text-slate-400">
                    {group.members?.length || 0} members
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
        {/* <div className="flex-1 overflow-y-auto px-2">
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
        </div> */}
      </div>

      {/* Chat Area */}
      {/* Chat Area */}
      <div className="w-[70%] flex flex-col bg-slate-950">
        {/* Header */}
        <div className="h-20 px-6 border-b border-slate-800 flex items-center gap-3 bg-slate-900">
          {/* Group ho to letter, DM ho to avatar */}
          {selectedGroup ? (
            <div className="w-12 h-12 rounded-full bg-indigo-700 flex items-center justify-center font-bold text-lg">
              {selectedGroup.name[0].toUpperCase()}
            </div>
          ) : (
            <img
              src="https://i.pravatar.cc/150?img=1"
              className="w-12 h-12 rounded-full"
            />
          )}
          <div>
            <h2 className="font-semibold text-lg">
              {selectedGroup?.name || selectedUser?.username || "Select a chat"}
            </h2>
            <p className="text-sm text-slate-400">
              {selectedGroup
                ? `${selectedGroup.members?.length || 0} members`
                : selectedUser
                  ? "Online"
                  : ""}
            </p>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4">
          {/* DM Messages — selectedGroup nahi hai tab */}
          {!selectedGroup &&
            messages.map((msg) => {
              if (!msg?.sender || !currentUser?._id) return null;
              return (
                <div key={msg._id}>
                  {msg.sender.toString() === currentUser._id.toString() ? (
                    <div className="flex justify-end">
                      <div className="max-w-md bg-indigo-600 px-4 py-3 rounded-2xl">
                        {msg.content}
                      </div>
                    </div>
                  ) : (
                    <div className="flex justify-start">
                      <div className="max-w-md bg-slate-800 px-4 py-3 rounded-2xl">
                        {msg.content}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}

          {/* Group Messages — selectedGroup hai tab */}
          {selectedGroup &&
            groupMessages.map((msg) => (
              <div key={msg._id}>
                {msg?.sender?._id?.toString() === currentUser._id.toString() ? (
                  // Mera message — right side
                  <div className="flex justify-end">
                    <div className="max-w-md bg-indigo-600 px-4 py-3 rounded-2xl">
                      {msg.content}
                    </div>
                  </div>
                ) : (
                  // Kisi aur ka message — left side + naam dikhao
                  <div className="flex flex-col items-start">
                    <span className="text-xs text-slate-400 mb-1 ml-1">
                      {msg.sender.username}
                    </span>
                    <div className="max-w-md bg-slate-800 px-4 py-3 rounded-2xl">
                      {msg.content}
                    </div>
                  </div>
                )}
              </div>
            ))}
        </div>

        {/* Input */}
        <div className="p-4 border-t border-slate-800 bg-slate-900">
          <div className="flex gap-3">
            <input
              type="text"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 outline-none focus:border-indigo-500"
            />
            <button
              onClick={
                selectedGroup ? handleSendGroupMessage : handleSendMessage
              }
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 rounded-xl font-medium transition"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
