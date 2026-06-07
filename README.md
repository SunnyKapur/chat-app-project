# Real-Time Communication System

A full-stack real-time chat application built using React, Redux Toolkit, Node.js, Express.js, MongoDB, Socket.IO, and JWT Authentication.

The application allows users to register, log in, exchange private messages, view chat history, and communicate in real time.

---

# Tech Stack

## Frontend

* React
* Redux Toolkit
* React Router
* React Hook Form
* Axios
* Tailwind CSS

## Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT
* Cookie Parser
* Socket.IO

---

# Features

## Authentication

* User Registration
* User Login
* JWT Authentication
* HTTP Only Cookies
* Session Persistence
* Protected Routes
* Public Routes
* Logout Functionality

## Messaging

* Send Messages
* Retrieve Conversation History
* Message Validation
* Self Messaging Prevention

## Real-Time Communication

* Socket.IO Server Setup
* User Room Management
* Send Message Event
* Receive Message Event
* Connection Handling
* Disconnection Handling

---

# Backend API Endpoints

## Register User

Endpoint

POST /api/auth/register

Request Body

```json
{
  "username": "sunny",
  "email": "sunny@gmail.com",
  "password": "123456"
}
```

Response

```json
{
  "message": "User registered successfully"
}
```

---

## Login User

Endpoint

POST /api/auth/login

Request Body

```json
{
  "email": "sunny@gmail.com",
  "password": "123456"
}
```

Response

```json
{
  "message": "User logged in successfully",
  "user": {}
}
```

After successful login:

* JWT token is generated
* Token is stored inside an HTTP Only Cookie

---

## Current Logged-In User

Endpoint

GET /api/auth/me

Authentication Required

Response

```json
{
  "user": {}
}
```

Purpose:

* Verify JWT Token
* Restore Session
* Return Current User

---

## Logout User

Endpoint

GET /api/auth/logout

Response

```json
{
  "message": "User logged out"
}
```

Purpose:

* Clear Authentication Cookie
* Remove User Session

---

# Messaging APIs

## Send Message

Endpoint

POST /api/messages

Authentication Required

Request Body

```json
{
  "receiver": "USER_ID",
  "content": "Hello Rahul"
}
```

Validation

* Receiver is required
* Content is required
* Users cannot message themselves

Response

```json
{
  "message": "Message sent successfully"
}
```

---

## Get Conversation

Endpoint

GET /api/messages/:userId

Authentication Required

Purpose:

Returns the complete conversation between:

Current User ↔ Selected User

Example:

```text
Sunny ↔ Rahul
```

Response

```json
{
  "messages": []
}
```

Messages are returned in ascending order based on creation time.

---

# Database Models

## User Model

Fields

```javascript
username
email
password
avatar
lastSeen
createdAt
updatedAt
```

---

## Message Model

Fields

```javascript
sender
receiver
content
createdAt
updatedAt
```

---

# Authentication Flow

Step 1

User registers.

```text
Register Form
      ↓
POST /api/auth/register
      ↓
MongoDB
```

Step 2

User logs in.

```text
Login Form
      ↓
POST /api/auth/login
      ↓
JWT Generated
      ↓
Cookie Stored
```

Step 3

Protected requests.

```text
Request
      ↓
Auth Middleware
      ↓
Verify JWT
      ↓
Find User
      ↓
req.user
```

---

# Session Persistence Flow

When the application starts:

```text
Application Load
       ↓
GET /api/auth/me
       ↓
Token Exists?
       ↓
Yes
       ↓
Restore User
       ↓
Redirect to Chat
```

OR

```text
Application Load
       ↓
GET /api/auth/me
       ↓
No Token
       ↓
Show Login Page
```

---

# Redux Authentication Flow

Auth Slice State

```javascript
{
  user: null,
  isAuthenticated: false,
  isLoading: true
}
```

Implemented Actions

```javascript
addUser()
removeUser()
```

Implemented Async Actions

```javascript
loginAction()
```

Purpose

* Store logged-in user
* Manage authentication state
* Restore session
* Handle protected routes

---

# Route Protection

## Public Routes

Routes:

```text
/
/register
```

Behavior:

```text
User Logged In?
       ↓
Yes
       ↓
Redirect → /chat
```

---

## Protected Routes

Routes:

```text
/chat
```

Behavior:

```text
User Logged In?
       ↓
No
       ↓
Redirect → /
```

---

# Socket.IO Implementation

Implemented Events

## Connection

```javascript
io.on("connection")
```

Triggered when a user connects.

---

## Setup Event

Client

```javascript
socket.emit("setup", userId);
```

Server

```javascript
socket.join(userId);
```

Purpose:

Each user joins a private room using their user ID.

---

## Send Message Event

Client

```javascript
socket.emit("send-message", data);
```

---

## Receive Message Event

Server

```javascript
io.to(receiverId).emit(
  "receive-message",
  data
);
```

Purpose:

Deliver messages instantly to the receiver.

---

# Real-Time Messaging Flow

```text
User A
   ↓
Send Message
   ↓
Socket Event
   ↓
Server
   ↓
Receiver Room
   ↓
User B
```

No page refresh required.

---

# Frontend Features

## Authentication Pages

Completed

* Login Page
* Register Page

Built Using

* React Hook Form
* Tailwind CSS

---

## API Integration

Configured

* Axios Instance
* Base URL
* Cookie Support

Connected APIs

* Register
* Login
* Current User
* Logout

---

## Routing

Implemented Using

* React Router

Routes

```text
/
/register
/chat
```

Layouts

```text
AuthLayout
MainLayout
```

Guards

```text
PublicRoute
ProtectedRoute
```

---

# Project Structure

## Frontend

```text
frontend
│
└── src
    │
    ├── app
    │   └── store.jsx
    │
    ├── features
    │   ├── authSlice.jsx
    │   └── authAction.jsx
    │
    ├── layouts
    │   ├── AuthLayout.jsx
    │   └── MainLayout.jsx
    │
    ├── pages
    │   ├── Login.jsx
    │   ├── Register.jsx
    │   ├── Chat.jsx
    │   ├── PublicRoute.jsx
    │   └── Protected.jsx
    │
    ├── routes
    │   └── AppRoutes.jsx
    │
    ├── services
    │   └── api.js
    │
    ├── main.jsx
    └── index.css
```

---

## Backend

```text
backend
│
└── src
    │
    ├── config
    │
    ├── controllers
    │   ├── auth.controller.js
    │   └── message.controller.js
    │
    ├── middlewares
    │   └── auth.middleware.js
    │
    ├── models
    │   ├── user.model.js
    │   └── message.model.js
    │
    ├── routes
    │   ├── auth.routes.js
    │   ├── protected.routes.js
    │   └── message.route.js
    │
    ├── sockets
    │   └── socket.server.js
    │
    ├── app.js
    └── server.js
```

---

# Current Progress

## Completed

* User Registration
* User Login
* JWT Authentication
* HTTP Only Cookies
* Session Persistence
* Redux Authentication
* Protected Routes
* Public Routes
* Logout Functionality
* Send Message API
* Chat History API
* Socket.IO Setup
* React Router Setup
* React Hook Form Integration
* Axios Integration

---

# In Progress

* Users List API
* Users Sidebar
* Chat Interface
* Real-Time UI Integration

---

# Pending Features

* Online Users
* Group Chat
* Typing Indicator
* Last Seen Status
* Message Read Status
* File/Image Sharing
* Notifications
* Deployment
* Production Optimization

---

# Future Flow

```text
Register
    ↓
Login
    ↓
JWT Cookie
    ↓
Redux User
    ↓
Protected Route
    ↓
Users Sidebar
    ↓
Select User
    ↓
Load Messages
    ↓
Send Message
    ↓
Socket Event
    ↓
Real-Time Chat
```
