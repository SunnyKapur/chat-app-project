# Real-Time Communication System

## Overview

A full-stack real-time chat application built using:

* React
* Redux Toolkit
* React Router
* Tailwind CSS
* Node.js
* Express.js
* MongoDB
* Socket.IO
* JWT Authentication

The application supports user authentication, protected routes, private messaging, chat history, and real-time communication.

---

# Backend Features

## Authentication

Implemented:

* User Registration
* User Login
* JWT Token Generation
* HTTP Only Cookie Authentication
* Authentication Middleware
* Protected Routes
* Session Restore API

### Register

Endpoint:

POST /api/auth/register

Request:

```json
{
  "username": "sunny",
  "email": "sunny@gmail.com",
  "password": "123456"
}
```

---

### Login

Endpoint:

POST /api/auth/login

Request:

```json
{
  "email": "sunny@gmail.com",
  "password": "123456"
}
```

After successful login:

* JWT Token is generated
* Token is stored inside HTTP Only Cookie

---

### Current User

Endpoint:

GET /api/auth/me

Purpose:

Returns currently authenticated user information.

Authentication Middleware:

* Reads cookie token
* Verifies JWT
* Finds user in MongoDB
* Attaches user to req.user

---

# Messaging System

## Message Model

Fields:

* sender
* receiver
* content
* createdAt
* updatedAt

---

## Send Message

Endpoint:

POST /api/messages

Request:

```json
{
  "receiver": "USER_ID",
  "content": "Hello Rahul"
}
```

Validation:

* Receiver required
* Content required
* User cannot send message to themselves

---

## Get Conversation

Endpoint:

GET /api/messages/:userId

Purpose:

Returns complete conversation between:

Current User ↔ Selected User

Example:

Sunny ↔ Rahul

Includes:

* Sent messages
* Received messages

Sorted by creation time.

---

# Socket.IO

Implemented:

* Socket Server Setup
* Connection Event
* Disconnection Event
* Setup Event
* Join User Room
* Send Message Event
* Receive Message Event

---

## Socket Flow

User connects

↓

Socket Connected

↓

socket.emit("setup", userId)

↓

Server joins private room

↓

socket.emit("send-message")

↓

Server forwards message

↓

Receiver gets real-time message

---

# Frontend Features

## UI

Completed:

* Register Page
* Login Page
* Chat Page Placeholder
* Responsive Forms
* Tailwind CSS Setup

---

## React Hook Form

Implemented:

* Register Form
* Login Form
* Validation
* Form Submission Handling

---

## Axios

Configured:

* Base URL
* Cookie Support
* API Integration

Connected APIs:

* Register
* Login
* Current User

---

# Redux Toolkit

Implemented:

## Auth Slice

State:

```javascript
{
  user: null,
  isAuthenticated: false,
  isLoading: true
}
```

Actions:

* addUser()
* setLoadingFalse()

Purpose:

* Store authenticated user
* Manage route protection
* Restore login session

---

# Route Protection

## Public Routes

Protected from authenticated users.

Example:

/
/register

If user already exists:

Redirect → /chat

---

## Protected Routes

Example:

/chat

If user is not authenticated:

Redirect → /

---

# Session Persistence

Application Startup Flow:

App Load

↓

GET /api/auth/me

↓

Cookie Valid?

↓

Yes → Redux User Updated

↓

Redirect to Chat

OR

↓

No → Stop Loading

↓

Show Login Page

---

# React Router Structure

Routes:

/

* Login

/register

* Register

/chat

* Chat Application

---

# Current Project Structure

Frontend

src

├── app

├── features

├── layouts

├── pages

│ ├── Login.jsx

│ ├── Register.jsx

│ ├── Chat.jsx

│ ├── PublicRoute.jsx

│ └── Protected.jsx

├── routes

│ └── AppRoutes.jsx

├── services

│ └── api.js

└── main.jsx

Backend

src

├── controllers

├── middlewares

├── models

├── routes

├── sockets

├── config

├── app.js

└── server.js

---

# Current Application Flow

Register

↓

Login

↓

JWT Cookie Created

↓

Redux User Updated

↓

Protected Route Access

↓

Chat Page

↓

Send Message API

↓

Get Chat History API

↓

Socket Connection

↓

Real-Time Messaging

---

# Completed

* Authentication
* JWT Cookies
* Protected Routes
* Redux Auth State
* Session Restore
* Messaging APIs
* Chat History APIs
* Socket.IO Setup
* React Router
* React Hook Form
* Axios Integration

---

# In Progress

* Users Sidebar
* User List API
* Chat UI
* Real-Time UI Integration

---

# Pending

* Online Users
* Group Chat
* Typing Indicator
* Last Seen
* File Sharing
* Message Read Status
* Deployment
* README Improvements
