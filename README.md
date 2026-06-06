# Real-Time Communication System (Backend)

## Overview

This project is a backend for a real-time communication system built with:

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT Authentication

The application currently supports:

* User Registration
* User Login
* JWT Authentication
* Protected Routes
* Sending Messages
* Retrieving Chat History

---

# Features Implemented

## 1. User Registration

Users can create a new account by providing:

* Username
* Email
* Password

### Endpoint

POST /api/auth/register

### Request Body

```json
{
  "username": "sunny",
  "email": "sunny@gmail.com",
  "password": "123456"
}
```

---

## 2. User Login

Registered users can log in using their email and password.

A JWT token is generated and stored in an HTTP-only cookie.

### Endpoint

POST /api/auth/login

### Request Body

```json
{
  "email": "sunny@gmail.com",
  "password": "123456"
}
```

---

## 3. Protected Route

Protected routes can only be accessed by authenticated users.

The authentication middleware:

* Reads JWT token from cookies
* Verifies the token
* Finds the user from the database
* Attaches the user to `req.user`

### Endpoint

GET /api/me

### Response

Returns the currently logged-in user information.

---

## 4. Message Model

Each message contains:

* Sender ID
* Receiver ID
* Message Content
* Created Time
* Updated Time

### Schema Fields

```javascript
sender
receiver
content
createdAt
updatedAt
```

---

## 5. Send Message

Authenticated users can send messages to another user.

### Endpoint

POST /api/messages

### Request Body

```json
{
  "receiver": "RECEIVER_USER_ID",
  "content": "Hello Rahul"
}
```

### Validation

* Receiver is required
* Content is required
* Users cannot send messages to themselves

### Response

```json
{
  "message": "Message sent successfully"
}
```

---

## 6. Get Chat History

Returns the complete conversation between the logged-in user and another user.

### Endpoint

GET /api/messages/:userId

### Example

```http
GET /api/messages/USER_ID
```

### What It Returns

The API returns:

* Messages sent by the logged-in user
* Messages received from the selected user

Example:

```text
Sunny -> Rahul
Rahul -> Sunny
Sunny -> Rahul
Rahul -> Sunny
```

This creates a complete chat history similar to WhatsApp or Messenger conversations.

---

# Project Structure

```text
backend
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
│   └── message.routes.js
│
├── app.js
└── server.js
```

---

# Authentication Flow

### Step 1

Register a user.

```text
POST /api/auth/register
```

### Step 2

Login using email and password.

```text
POST /api/auth/login
```

### Step 3

Server creates a JWT token.

### Step 4

Token is stored in an HTTP-only cookie.

### Step 5

Protected routes verify the token using middleware.

### Step 6

Authenticated user information becomes available through:

```javascript
req.user
```

---

# Messaging Flow

### Step 1

User logs in.

Example:

```text
Sunny logs in
```

### Step 2

User sends a message.

```text
POST /api/messages
```

Request:

```json
{
  "receiver": "Rahul_ID",
  "content": "Hello Rahul"
}
```

### Step 3

Message is stored in MongoDB.

Stored data:

```text
Sender
Receiver
Content
Timestamp
```

### Step 4

Retrieve conversation.

```text
GET /api/messages/Rahul_ID
```

### Step 5

Server returns all messages between:

```text
Sunny ↔ Rahul
```

including:

```text
Sunny -> Rahul
Rahul -> Sunny
```

ordered by creation time.

---

# Current Progress

Completed:

* User Registration
* User Login
* JWT Authentication
* Protected Routes
* Message Model
* Send Message API
* Chat History API

Next:

* Socket.IO Integration
* Real-Time Messaging
* Online Users
* Group Chat
* Typing Indicators
* Deployment

```
```
