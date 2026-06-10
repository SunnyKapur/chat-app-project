# 💬 Real-Time Communication System

A full-stack real-time chat application built using **React**, **Redux Toolkit**, **Node.js**, **Express.js**, **MongoDB**, **Socket.IO**, and **JWT Authentication**.

Users can register, log in, exchange private messages, view chat history, and communicate in real time — no page refresh required.

---

## 🚀 Tech Stack

### Frontend

| Technology | Purpose |
|---|---|
| React | UI Framework |
| Redux Toolkit | State Management |
| React Router | Client-side Routing |
| React Hook Form | Form Handling |
| Axios | HTTP Requests |
| Tailwind CSS | Styling |
| Socket.IO Client | Real-Time Communication |

### Backend

| Technology | Purpose |
|---|---|
| Node.js | Runtime |
| Express.js | Server Framework |
| MongoDB | Database |
| Mongoose | ODM |
| JWT | Authentication |
| Cookie Parser | Cookie Handling |
| Socket.IO | Real-Time Communication |

---

## ✅ Features

### Authentication
- User Registration
- User Login
- JWT Authentication via HTTP Only Cookies
- Session Persistence on page reload
- Protected Routes (chat page)
- Public Routes (login, register)
- Logout Functionality

### Messaging
- Send Private Messages (One-to-One)
- Retrieve Full Conversation History
- Message Validation
- Self-Messaging Prevention

### Group Chat
- Create New Groups with custom name
- Add multiple members while creating group
- Send & receive messages in real time within the group
- Group chat history stored in database
- Group details shown in header (name + member count)
- Group avatar with first letter of group name

### Users
- Fetch All Users (excluding current user)
- Users Sidebar with Online Status Indicator
- Select User to Open Chat

### Chat Interface
- Two-column layout (Sidebar + Chat Area)
- **Direct Messages tab** and **Groups tab** in sidebar
- Messages displayed correctly — sent messages on the right (indigo), received on the left (dark)
- Group messages show sender's username above the bubble
- Sender vs. Receiver detection using `currentUser._id`
- Input box with smart Send button (works for both DM and Group)
- Chat header shows selected user/group name and online status / member count
- Create Group modal with member selection (checkbox style)

### Real-Time Communication
- Socket.IO Server Setup
- Private room per user (`socket.join(userId)`)
- Group room per group (`socket.join('group-' + groupId)`)
- `send-message` / `receive-message` Events (One-to-One)
- `send-group-message` / `receive-group-message` Events (Group)
- `join-group` Event — user joins group socket room on group select
- `setup` Event — user joins private room on login
- Connection & Disconnection Handling
- `useRef` used to prevent stale closure in socket listeners

---

## 📡 Backend API Endpoints

### Auth Routes

#### Register User
```
POST /api/auth/register
```
```json
// Request Body
{
  "username": "sunny",
  "email": "sunny@gmail.com",
  "password": "123456"
}

// Response
{
  "message": "User registered successfully"
}
```

#### Login User
```
POST /api/auth/login
```
```json
// Request Body
{
  "email": "sunny@gmail.com",
  "password": "123456"
}

// Response
{
  "message": "User logged in successfully",
  "user": {}
}
```
> JWT token is generated and stored inside an HTTP Only Cookie.

#### Current Logged-In User
```
GET /api/auth/me
```
```json
// Response
{
  "user": {}
}
```
> Verifies JWT token, restores session, returns current user.

#### Logout User
```
GET /api/auth/logout
```
```json
// Response
{
  "message": "User logged out"
}
```

---

### Message Routes

#### Send Message
```
POST /api/messages         (Auth Required)
```
```json
// Request Body
{
  "receiver": "USER_ID",
  "content": "Hello Rahul"
}

// Response
{
  "message": "Message sent successfully",
  "data": {}
}
```
> Validation: receiver required, content required, users cannot message themselves.

#### Get Conversation
```
GET /api/messages/:userId  (Auth Required)
```
```json
// Response
{
  "messages": []
}
```
> Returns full conversation between current user and selected user, sorted by creation time (ascending).

---

### User Routes

#### Get All Users
```
GET /api/users             (Auth Required)
```
```json
// Response
{
  "users": []
}
```
> Returns all registered users (excluding the current user).

---

### Group Routes

#### Create Group
```
POST /api/groups           (Auth Required)
```
```json
// Request Body
{
  "name": "MERN Group",
  "members": ["USER_ID_1", "USER_ID_2"]
}

// Response
{
  "message": "Group created",
  "group": {}
}
```
> Creator is automatically added as admin and member.

#### Get My Groups
```
GET /api/groups            (Auth Required)
```
```json
// Response
{
  "groups": []
}
```
> Returns all groups where current user is a member.

#### Send Group Message
```
POST /api/groups/:groupId/messages   (Auth Required)
```
```json
// Request Body
{
  "content": "Hello everyone!"
}

// Response
{
  "message": "Message sent",
  "data": {}
}
```

#### Get Group Messages
```
GET /api/groups/:groupId/messages    (Auth Required)
```
```json
// Response
{
  "messages": []
}
```
> Returns all messages of the group with sender username populated.

---

## 🗃️ Database Models

### User Model
```javascript
{
  username,
  email,
  password,   // bcrypt hashed
  avatar,
  lastSeen,
  createdAt,
  updatedAt
}
```

### Message Model
```javascript
{
  sender,     // ref: User
  receiver,   // ref: User
  content,
  createdAt,
  updatedAt
}
```

### Group Model
```javascript
{
  name,
  members,    // [ref: User]
  admin,      // ref: User
  messages: [
    {
      sender,   // ref: User
      content,
      createdAt
    }
  ],
  createdAt,
  updatedAt
}
```

---

## 🔐 Authentication Flow

```
Register Form
      ↓
POST /api/auth/register
      ↓
MongoDB (User Saved)
```

```
Login Form
      ↓
POST /api/auth/login
      ↓
JWT Generated → Stored in HTTP Only Cookie
```

```
Protected Request
      ↓
Auth Middleware → Verify JWT → Find User → req.user
```

---

## 🔄 Session Persistence Flow

```
App Loads
    ↓
GET /api/auth/me
    ↓
Token Found?
    ├── Yes → Restore User in Redux → Redirect to /chat
    └── No  → Show Login Page
```

---

## 🧠 Redux State

### Auth Slice
```javascript
{
  user: null,
  isAuthenticated: false,
  isLoading: true
}
```

Actions: `addUser()`, `removeUser()`

Async Actions: `loginAction()`

---

## 🛡️ Route Protection

| Route | Type | Behavior |
|---|---|---|
| `/` | Public | Redirects to `/chat` if logged in |
| `/register` | Public | Redirects to `/chat` if logged in |
| `/chat` | Protected | Redirects to `/` if not logged in |

---

## ⚡ Socket.IO Events

### One-to-One (DM)

| Event | Direction | Purpose |
|---|---|---|
| `connection` | Server | User connects |
| `setup` | Client → Server | User joins private room |
| `send-message` | Client → Server | Send DM data |
| `receive-message` | Server → Client | Deliver DM to receiver |
| `disconnect` | Server | User disconnects |

### Group Chat

| Event | Direction | Purpose |
|---|---|---|
| `join-group` | Client → Server | User joins group socket room |
| `send-group-message` | Client → Server | Send group message data |
| `receive-group-message` | Server → All members | Broadcast to group room |

### Real-Time Flow — DM

```
User A sends message
    ↓
API: POST /api/messages (saved to DB)
    ↓
socket.emit("send-message", data)
    ↓
Server: io.to(receiver).emit("receive-message", data)
    ↓
User B receives instantly ✅
```

### Real-Time Flow — Group

```
User A sends group message
    ↓
API: POST /api/groups/:id/messages (saved to DB)
    ↓
socket.emit("send-group-message", data)
    ↓
Server: io.to("group-<groupId>").emit("receive-group-message", data)
    ↓
All group members receive instantly ✅
```

---

## 🗂️ Project Structure

### Frontend
```
frontend/src/
├── app/
│   └── store.jsx
├── features/
│   ├── authSlice.jsx
│   └── authAction.jsx
├── layouts/
│   ├── AuthLayout.jsx
│   └── MainLayout.jsx
├── pages/
│   ├── Login.jsx
│   ├── Register.jsx
│   ├── Chat.jsx
│   ├── PublicRoute.jsx
│   └── Protected.jsx
├── routes/
│   └── AppRoutes.jsx
├── services/
│   ├── api.js
│   └── socket.js
├── main.jsx
└── index.css
```

### Backend
```
backend/src/
├── config/
├── controllers/
│   ├── auth.controller.js
│   ├── message.controller.js
│   ├── user.controller.js
│   └── group.controller.js
├── middlewares/
│   └── auth.middleware.js
├── models/
│   ├── user.model.js
│   ├── message.model.js
│   └── group.model.js
├── routes/
│   ├── auth.routes.js
│   ├── protected.routes.js
│   ├── message.route.js
│   ├── user.routes.js
│   └── group.routes.js
├── sockets/
│   └── socket.server.js
├── app.js
└── server.js
```

---

## 📊 Current Progress

### ✅ Completed
- User Registration & Login
- JWT Authentication with HTTP Only Cookies
- Session Persistence
- Redux Auth State Management
- Protected & Public Routes
- Logout Functionality
- Send Message API (One-to-One)
- Chat History API
- Get All Users API
- Group Chat APIs (Create, Get Groups, Send Message, Get Messages)
- Socket.IO Setup — DM + Group real-time events
- `useRef` fix for stale closure in socket listeners
- Users Sidebar UI with DM / Groups tabs
- Chat Interface UI (send/receive bubbles, correct alignment)
- Group Chat UI (create modal, member selection, group list)
- Group messages with sender username display
- React Router Setup
- React Hook Form Integration
- Axios Integration

### 🔮 Pending Features

- [ ] Online Users (real-time presence)
- [ ] Typing Indicator
- [ ] Last Seen Status
- [ ] Message Read / Delivered Status
- [ ] File & Image Sharing
- [ ] Push Notifications
- [ ] Deployment
- [ ] Production Optimization

---

## 🌊 Complete App Flow

```
Register
    ↓
Login → JWT Cookie → Redux User
    ↓
Protected Route → /chat
    ↓
Users Sidebar → Fetch All Users + Groups
    ↓
DM Tab → Select User → Load Message History
    ↓
Send Message → API + Socket Emit → Real-Time Delivery ✅
    ↓
Groups Tab → Create Group / Select Group
    ↓
Join Group Socket Room → Load Group Messages
    ↓
Send Group Message → API + Socket Broadcast → All Members Get It ✅
```