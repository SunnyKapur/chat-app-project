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
- Send Private Messages
- Retrieve Full Conversation History
- Message Validation
- Self-Messaging Prevention

### Users
- Fetch All Users
- Users Sidebar with Online Status Indicator
- Select User to Open Chat

### Chat Interface
- Two-column layout (Sidebar + Chat Area)
- Messages displayed correctly — **sent messages on the right (indigo), received on the left (dark)**
- Sender vs. Receiver detection using `currentUser._id`
- Input box with Send button
- Chat header shows selected user's name and online status

### Real-Time Communication
- Socket.IO Server Setup
- User Room Management (each user joins private room by `userId`)
- `send-message` Event (Client → Server)
- `receive-message` Event (Server → Receiver)
- Connection & Disconnection Handling

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

## 🗃️ Database Models

### User Model
```javascript
{
  username,
  email,
  password,   // hashed
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

| Event | Direction | Purpose |
|---|---|---|
| `connection` | Server | User connects |
| `setup` | Client → Server | User joins private room (`socket.join(userId)`) |
| `send-message` | Client → Server | Sends message data |
| `receive-message` | Server → Client | Delivers message to receiver's room |
| `disconnect` | Server | User disconnects |

### Real-Time Messaging Flow

```
User A
   ↓
Send Message (API + Socket emit)
   ↓
Server → io.to(receiverId).emit("receive-message", data)
   ↓
User B receives message instantly
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
│   └── api.js
├── main.jsx
└── index.css
```

### Backend
```
backend/src/
├── config/
├── controllers/
│   ├── auth.controller.js
│   └── message.controller.js
├── middlewares/
│   └── auth.middleware.js
├── models/
│   ├── user.model.js
│   └── message.model.js
├── routes/
│   ├── auth.routes.js
│   ├── protected.routes.js
│   └── message.route.js
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
- Send Message API
- Chat History API
- Get All Users API
- Socket.IO Setup (server + client)
- Users Sidebar UI
- Chat Interface UI (send/receive bubbles, correct alignment)
- Message sender detection (`currentUser._id` comparison)
- React Router Setup
- React Hook Form Integration
- Axios Integration

### 🔧 In Progress
- Real-Time UI Integration (Socket receive-message event → update state)

---

## 🔮 Pending Features

- [ ] Online Users (real-time presence)
- [ ] Typing Indicator
- [ ] Last Seen Status
- [ ] Message Read / Delivered Status
- [ ] File & Image Sharing
- [ ] Push Notifications
- [ ] Group Chat
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
Users Sidebar → Fetch All Users
    ↓
Select User → Load Message History
    ↓
Send Message → API + Socket Emit
    ↓
Receiver Gets Message Instantly (Socket)
    ↓
UI Updates Without Refresh
```