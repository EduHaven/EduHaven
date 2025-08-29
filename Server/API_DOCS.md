# 📘 EduHaven Backend API Documentation

**Base URL:**
https://eduhaven-backend.onrender.com

---

## 📑 Table of Contents

- [🔑 Authentication Endpoints](#🔑-authentication-endpoints)

  - [Google OAuth (Redirect to Google)](#1-google-oauth-redirect-to-google) → `googleAuth`
  - [Google OAuth Callback](#2-google-oauth-callback) → `googleCallback`
  - [User Signup](#3-user-signup) → `signup`
  - [Verify User (OTP Verification after Signup)](#4-verify-user-otp-verification-after-signup) → `verifyUser`
  - [User Login](#5-user-login) → `login`
  - [User Logout](#6-user-logout) → `logout`
  - [Refresh Access Token](#7-refresh-access-token) → `refreshAccessToken`
  - [Delete Account](#8-delete-account) → `deleteAccount`

- [📝 Notes Endpoints](#📝-notes-endpoints)

  - [ Create Todo](#1-create-todo) → `createTodo`
  - [ Get All Todos](#2-get-all-todos) → `getAllTodos`
  - [ Get Todo by ID](#3-get-todo-by-id) → `getTodoById`
  - [ Get Todos by User ID](#4-get-todos-by-user-id) → `getTodoByUserId`
  - [ Update Todo](#5-update-todo) → `updateTodo`
  - [ Delete Todo](#6-delete-todo) → `deleteTodo`
  - [ Recreate Daily Habits](#7-recreate-daily-habits) → `recreateDailyHabits`

- [📝 Todo Endpoints](#📝-todo-endpoints)

  - [Create Note](#1-create-note) → `createNote`
  - [Get All Notes](#2-get-all-notes) → `getAllNotes`
  - [Get Note by ID](#3-get-note-by-id) → `getNoteById`
  - [Update Note](#4-update-note) → `updateNote`
  - [Delete Note](#5-delete-note) → `deleteNote`

- [📅 Events Endpoints](#📅-events-endpoints)

  - [Get All Events](#1-get-all-events) → `getAllEvents`
  - [Get Event by Date](#2-get-event-by-date) → `getEventByDate`
  - [Get Event by ID](#3-get-event-by-id) → `getEventById`
  - [Create Event](#4-create-event) → `createEvent`
  - [Update Event](#5-update-event) → `updateEvent`
  - [Delete Event](#6-delete-event) → `deleteEvent`

- [⏲️ Study Session Endpoints](#⏲️-study-session-endpoints)

  - [Create Study Session](#1-create-study-session) → `createStudySession`
  - [Get Study Session Stats](#2-get-study-session-stats) → `getStudySessionStats`
  - [Get User Study Stats](#3-get-user-study-stats) → `getUserStudyStats`
  - [Get Leaderboard](#4-get-leaderboard) → `getLeaderboard`

- [🏠 Session Room Endpoints](#🏠-session-room-endpoints)

  - [Get All Session Rooms](#1-get-all-session-rooms) → `getRoomLists`
  - [Create a Session Room](#2-create-a-session-room) → `createRoom`
  - [Delete a Session Room](#3-delete-a-session-room) → `deleteRoom`
- [👥 Friends Endpoints](#👥-friends-endpoints)

  - [Get Friends List](#1-get-friends-list) → `friendList`
  - [Get Friend Suggestions](#2-get-friend-suggestions) → `userList`
  - [Send Friend Request](#3-send-friend-request) → `sendRequest`
  - [View Sent Requests](#4-view-sent-requests) → `viewSentRequests`
  - [View Incoming Requests](#5-view-incoming-requests) → `incomingRequests`
  - [Accept Friend Request](#6-accept-friend-request) → `acceptRequest`
  - [Reject Friend Request](#7-reject-friend-request) → `rejectRequest`
  - [Remove Friend](#8-remove-friend) → `removeFriend`
  - [Get Friends Count](#9-get-friends-count) → `getFriendsCount`
  - [Get User Stats](#10-get-user-stats) → `getUserStats`
  - [Cancel Sent Request](#11-cancel-sent-request) → `removeSentRequest`

- [👤 User Endpoints](#👤-user-endpoints)

  - [Give Kudos](#1-give-kudos) → `giveKudos`
  - [Get User Details](#2-get-user-details) → `getUserDetails`
  - [Get User Badges](#3-get-user-badges) → `getUserBadges`
  - [Update Profile](#4-update-profile) → `updateProfile`
  - [Upload Profile Picture](#5-upload-profile-picture) → `uploadProfilePicture`

---

## 🔑 Authentication Endpoints

### 1. **Google OAuth (Redirect to Google)**

**Controller:** `googleAuth`

**Endpoint:**

```
GET /auth/google
```

**Description:**
Redirects the user to Google OAuth consent screen for authentication.

**Response:**

- Redirects to Google login page.

---

### 2. **Google OAuth Callback**

**Controller:** `googleCallback`

**Endpoint:**

```
GET /auth/google/callback
```

**Description:**
Handles the callback from Google after successful OAuth authentication.

**Response (Redirects):**

- On success: Redirects to frontend with tokens.

```
{CORS\_ORIGIN}/auth/google/callback?token=<appToken>\&refreshToken=<refreshToken>
```

- On failure:

```
{CORS\_ORIGIN}/login?error=oauth\_failed
```

---

### 3. **User Signup**

**Controller:** `signup`

**Endpoint:**

```
POST /auth/signup
```

**Request Body Example:**

```json
{
  "FirstName": "John",
  "LastName": "Doe",
  "Email": "johndoe@example.com",
  "Password": "password123"
}
```

**Success Response:**

```json
{
  "message": "OTP sent to your email.",
  "token": "<jwt_token_here>",
  "activationToken": "<activation_token_here>"
}
```

**Error Responses:**

```json
{ "error": "Please fill all the fields" }
{ "error": "User already exists" }
{ "error": "Internal server error" }
```

---

### 4. **Verify User (OTP Verification after Signup)**

**Controller:** `verifyUser`

**Endpoint:**

```
POST /auth/verify
```

**Headers:**

```
Authorization: Bearer <activationToken>
```

**Request Body Example:**

```json
{
  "otp": "123456"
}
```

**Success Response:**

```json
{
  "message": "User Signup Successfully"
}
```

**Error Responses:**

```json
{ "message": "Authorization header is required" }
{ "message": "Activation token is required" }
{ "message": "Invalid or expired activation token" }
{ "message": "Incorrect OTP" }
{ "message": "Internal server error" }
```

---

### 5. **User Login**

**Controller:** `login`

**Endpoint:**

```
POST /auth/login
```

**Request Body Example:**

```json
{
  "Email": "johndoe@example.com",
  "Password": "password123"
}
```

**Success Response:**

```json
{
  "message": "User Login Successfully",
  "token": "<jwt_token_here>",
  "refreshToken": "<refresh_token_here>",
  "user": {
    "_id": "userId",
    "FirstName": "John",
    "LastName": "Doe",
    "Email": "johndoe@example.com",
    "ProfilePicture": "https://cdn-icons-png.flaticon.com/512/219/219986.png",
    "friends": []
  }
}
```

**Error Responses:**

```json
{ "error": "Please fill all the fields" }
{ "error": "User not found" }
{ "error": "Invalid credentials" }
{ "error": "Internal server error" }
```

---

### 6. **User Logout**

**Controller:** `logout`

**Endpoint:**

```
POST /auth/logout
```

**Description:**
Clears user cookies (`token`, `refreshToken`).

**Success Response:**

```json
{
  "message": "User logged out successfully"
}
```

**Error Response:**

```json
{ "error": "Logout failed" }
```

---

### 7. **Refresh Access Token**

**Controller:** `refreshAccessToken`

**Endpoint:**

```
POST /auth/refresh
```

**Request Body Example:**

```json
{
  "refreshToken": "<refresh_token_here>"
}
```

**Success Response:**

```json
{
  "success": true,
  "token": "<new_jwt_token>"
}
```

**Error Responses:**

```json
{ "success": false, "message": "Unauthorized request" }
{ "message": "User not found" }
{ "success": false, "message": "Internal server error" }
```

---

### 8. **Delete Account**

**Controller:** `deleteAccount`

**Endpoint:**

```
POST /auth/delete
```

**Description:**
Deletes the user account and all related data (friends, notes, events, study sessions, session rooms, todos).

**Success Response:**

```json
{
  "message": "Account and related data deleted successfully"
}
```

**Error Responses:**

```json
{ "error": "Unauthorized" }
{ "error": "Failed to delete account" }
```

---

## 📝 Notes Endpoints

### 1. **Create Todo**

**Controller:** `createTodo`

**Endpoint:**

```
POST /todo
```

**Description:**
Creates a new todo task for the authenticated user.

**Request Body Example:**

```json
{
  "title": "Finish assignment",
  "dueDate": "2025-08-30T23:59:59.000Z",
  "deadline": "2025-08-30T22:00:00.000Z",
  "repeatEnabled": true,
  "repeatType": "daily",
  "reminderTime": "18:00",
  "timePreference": "evening"
}
```

**Success Response Example:**

```json
{
  "success": true,
  "data": {
    "_id": "64f2c123456789",
    "title": "Finish assignment",
    "dueDate": "2025-08-30T23:59:59.000Z",
    "status": "open",
    "completed": false,
    "user": "64f1b123456789",
    "repeatEnabled": true,
    "repeatType": "daily",
    "reminderTime": "18:00",
    "timePreference": "evening",
    "createdAt": "2025-08-29T12:00:00.000Z"
  }
}
```

**Error Responses:**

```json
{ "success": false, "error": "Title and due date are required." }
```

```json
{ "success": false, "error": "Unauthorized. User ID missing." }
```

---

### 2. **Get All Todos**

**Controller:** `getAllTodos`

**Endpoint:**

```
GET /todo?view=all|daily|weekly|monthly
```

**Description:**
Fetch all todos for the logged-in user with optional filtering by time range. Returns chart data grouped by day/week/month.

**Success Response Example:**

```json
{
  "success": true,
  "data": [
    {
      "_id": "64f2c123456789",
      "title": "Finish assignment",
      "completed": false,
      "createdAt": "2025-08-29T12:00:00.000Z"
    }
  ],
  "chartData": [
    { "name": "Mon", "completed": 1, "pending": 2 },
    { "name": "Tue", "completed": 0, "pending": 1 }
  ],
  "total": 3,
  "completed": 1
}
```

**Error Responses:**

```json
{ "success": false, "error": "Unauthorized. User ID missing." }
```

```json
{ "success": false, "error": "Internal Server Error" }
```

---

### 3. **Get Todo by ID**

**Controller:** `getTodoById`

**Endpoint:**

```
GET /todo/:id
```

**Description:**
Fetch a single todo by its ID.

**Success Response Example:**

```json
{
  "success": true,
  "data": {
    "_id": "64f2c123456789",
    "title": "Finish assignment",
    "dueDate": "2025-08-30T23:59:59.000Z",
    "completed": false
  }
}
```

**Error Responses:**

```json
{ "success": false, "error": "Task not found" }
```

```json
{ "success": false, "error": "Internal Server Error" }
```

---

### 4. **Get Todos by User ID**

**Controller:** `getTodoByUserId`

**Endpoint:**

```
GET /todo/user/:id?view=all|daily|weekly|monthly
```

**Description:**
Fetch todos of a specific user with optional filtering by time range. Returns chart data.

**Success Response Example:**

```json
{
  "success": true,
  "chartData": [
    { "name": "Week 1", "completed": 2, "pending": 1 },
    { "name": "Week 2", "completed": 0, "pending": 3 }
  ],
  "total": 5,
  "completed": 2
}
```

**Error Responses:**

```json
{ "success": false, "error": "Unauthorized. User ID missing." }
```

```json
{ "success": false, "error": "Internal Server Error" }
```

---

### 5. **Update Todo**

**Controller:** `updateTodo`

**Endpoint:**

```
PUT /todo/:id
```

**Description:**
Update an existing todo. Supports partial updates. Also awards a "Kickstarter badge" if the task is marked completed.

**Request Body Example:**

```json
{
  "title": "Finish assignment (updated)",
  "completed": true,
  "status": "closed",
  "deadline": "2025-08-30T22:00:00.000Z"
}
```

**Success Response Example:**

```json
{
  "success": true,
  "data": {
    "_id": "64f2c123456789",
    "title": "Finish assignment (updated)",
    "status": "closed",
    "completed": true
  }
}
```

**Error Responses:**

```json
{ "success": false, "error": "Task not found" }
```

```json
{ "success": false, "error": "Internal Server Error" }
```

---

### 6. **Delete Todo**

**Controller:** `deleteTodo`

**Endpoint:**

```
DELETE /todo/:id
```

**Description:**
Delete a todo by its ID.

**Success Response Example:**

```json
{ "success": true, "message": "Task deleted successfully" }
```

**Error Responses:**

```json
{ "success": false, "error": "Task not found" }
```

```json
{ "success": false, "error": "Internal Server Error" }
```

---

### 7. **Recreate Daily Habits**

**Controller:** `recreateDailyHabits`

**Endpoint:**

```
POST /todo/recreate-daily-habits
```

**Description:**
Recreates all completed daily habit tasks for the current day.

**Success Response Example:**

```json
{
  "success": true,
  "message": "Created 2 daily habits",
  "data": [
    {
      "_id": "64f2c123456790",
      "title": "Morning workout",
      "status": "open",
      "completed": false
    }
  ]
}
```

**Error Responses:**

```json
{ "success": false, "error": "Internal Server Error" }
```

---

## 📝 Todo Endpoints

### 1. **Create Note**

**Controller:** `createNote`

**Endpoint:**

```
POST /note
```

**Description:**
Creates a new note for the authenticated user.

**Request Body Example:**

```json
{
  "title": "Meeting Notes",
  "content": "Discussed project roadmap and deadlines.",
  "tags": ["work", "meeting"]
}
```

**Success Response:**

```json
{
  "success": true,
  "data": {
    "_id": "64d8a7e3c2a5c4f7e8e9d123",
    "title": "Meeting Notes",
    "content": "Discussed project roadmap and deadlines.",
    "tags": ["work", "meeting"],
    "user": "64d8a7a1c2a5c4f7e8e9d101",
    "__v": 0
  }
}
```

**Error Responses:**

```json
{ "success": false, "error": "Title and content are required." }
{ "success": false, "error": "Bad Request" }
{ "success": false, "error": "Internal server error" }
```

---

### 2. **Get All Notes**

**Controller:** `getAllNotes`

**Endpoint:**

```
GET /note
```

**Description:**
Fetches all notes created by the authenticated user.

**Success Response:**

```json
{
  "success": true,
  "data": [
    {
      "_id": "64d8a7e3c2a5c4f7e8e9d123",
      "title": "Meeting Notes",
      "content": "Discussed project roadmap and deadlines.",
      "tags": ["work", "meeting"],
      "user": "64d8a7a1c2a5c4f7e8e9d101",
      "__v": 0
    },
    {
      "_id": "64d8a8a4c2a5c4f7e8e9d145",
      "title": "Shopping List",
      "content": "Milk, Bread, Eggs",
      "tags": ["personal"],
      "user": "64d8a7a1c2a5c4f7e8e9d101",
      "__v": 0
    }
  ]
}
```

**Error Responses:**

```json
{ "success": false, "error": "Internal server error" }
```

---

### 3. **Get Note by ID**

**Controller:** `getNoteById`

**Endpoint:**

```
GET /note/:id
```

**Description:**
Fetches a specific note by its ID.

**Success Response:**

```json
{
  "success": true,
  "data": {
    "_id": "64d8a7e3c2a5c4f7e8e9d123",
    "title": "Meeting Notes",
    "content": "Discussed project roadmap and deadlines.",
    "tags": ["work", "meeting"],
    "user": "64d8a7a1c2a5c4f7e8e9d101",
    "__v": 0
  }
}
```

**Error Responses:**

```json
{ "success": false, "error": "Note not found" }
{ "success": false, "error": "Internal server error" }
```

---

### 4. **Update Note**

**Controller:** `updateNote`

**Endpoint:**

```
PUT /note/:id
```

**Description:**
Updates an existing note by ID. Only `title`, `content`, and `tags` can be updated.

**Request Body Example:**

```json
{
  "title": "Updated Meeting Notes",
  "content": "Added decisions and assigned tasks.",
  "tags": ["work", "updated"]
}
```

**Success Response:**

```json
{
  "success": true,
  "data": {
    "_id": "64d8a7e3c2a5c4f7e8e9d123",
    "title": "Updated Meeting Notes",
    "content": "Added decisions and assigned tasks.",
    "tags": ["work", "updated"],
    "user": "64d8a7a1c2a5c4f7e8e9d101",
    "__v": 0
  }
}
```

**Error Responses:**

```json
{ "success": false, "error": "Note not found" }
{ "success": false, "error": "Internal server error" }
```

---

### 5. **Delete Note**

**Controller:** `deleteNote`

**Endpoint:**

```
DELETE /note/:id
```

**Description:**
Deletes a note by its ID.

**Success Response:**

```json
{
  "success": true,
  "message": "Note deleted successfully"
}
```

**Error Responses:**

```json
{ "success": false, "error": "Note not found" }
{ "success": false, "error": "Internal server error" }
```

---

## 📅 Events Endpoints

### 1. **Get All Events**

**Controller:** `getAllEvents`

**Endpoint:**

```
GET /events
```

**Description:**
Fetches all events created by the authenticated user.

**Success Response:**

```json
{
  "success": true,
  "data": [
    {
      "_id": "64e1b9e3a9d2f5c8b3a1c101",
      "title": "Team Meeting",
      "date": "2025-08-30T00:00:00.000Z",
      "time": "10:00 AM",
      "createdBy": "64d8a7a1c2a5c4f7e8e9d101"
    },
    {
      "_id": "64e1b9e3a9d2f5c8b3a1c102",
      "title": "Doctor Appointment",
      "date": "2025-09-01T00:00:00.000Z",
      "time": "4:00 PM",
      "createdBy": "64d8a7a1c2a5c4f7e8e9d101"
    }
  ]
}
```

**Error Responses:**

```json
{ "success": false, "error": "Internal server error" }
```

---

### 2. **Get Event by Date**

**Controller:** `getEventByDate`

**Endpoint:**

```
GET /events/by-date?date=2025-08-30
```

**Description:**
Fetches all events for a specific date belonging to the authenticated user.

**Success Response:**

```json
{
  "success": true,
  "data": [
    {
      "_id": "64e1b9e3a9d2f5c8b3a1c101",
      "title": "Team Meeting",
      "date": "2025-08-30T00:00:00.000Z",
      "time": "10:00 AM",
      "createdBy": "64d8a7a1c2a5c4f7e8e9d101"
    }
  ]
}
```

**Error Responses:**

```json
{ "success": false, "error": "Date query parameter is required." }
{ "success": false, "error": "No events found for the specified date." }
{ "success": false, "error": "Internal server error" }
```

---

### 3. **Get Event by ID**

**Controller:** `getEventById`

**Endpoint:**

```
GET /events/:id
```

**Description:**
Fetches a specific event by its ID (only if created by the authenticated user).

**Success Response:**

```json
{
  "success": true,
  "data": {
    "_id": "64e1b9e3a9d2f5c8b3a1c101",
    "title": "Team Meeting",
    "date": "2025-08-30T00:00:00.000Z",
    "time": "10:00 AM",
    "createdBy": "64d8a7a1c2a5c4f7e8e9d101"
  }
}
```

**Error Responses:**

```json
{ "success": false, "error": "Event not found" }
{ "success": false, "error": "Internal server error" }
```

---

### 4. **Create Event**

**Controller:** `createEvent`

**Endpoint:**

```
POST /events
```

**Description:**
Creates a new event for the authenticated user.

**Request Body Example:**

```json
{
  "title": "Conference",
  "date": "2025-09-05",
  "time": "2:00 PM"
}
```

**Success Response:**

```json
{
  "success": true,
  "data": {
    "_id": "64e1c0b3a9d2f5c8b3a1c105",
    "title": "Conference",
    "date": "2025-09-05T00:00:00.000Z",
    "time": "2:00 PM",
    "createdBy": "64d8a7a1c2a5c4f7e8e9d101"
  }
}
```

**Error Responses:**

```json
{ "success": false, "error": "Title, date, and time are required." }
{ "success": false, "error": "Internal server error" }
```

---

### 5. **Update Event**

**Controller:** `updateEvent`

**Endpoint:**

```
PUT /events/:id
```

**Description:**
Updates an existing event by ID (only if created by the authenticated user).

**Request Body Example:**

```json
{
  "title": "Updated Conference",
  "date": "2025-09-06",
  "time": "3:00 PM"
}
```

**Success Response:**

```json
{
  "success": true,
  "data": {
    "_id": "64e1c0b3a9d2f5c8b3a1c105",
    "title": "Updated Conference",
    "date": "2025-09-06T00:00:00.000Z",
    "time": "3:00 PM",
    "createdBy": "64d8a7a1c2a5c4f7e8e9d101"
  }
}
```

**Error Responses:**

```json
{ "success": false, "error": "Event not found or unauthorized" }
{ "success": false, "error": "Internal server error" }
```

---

### 6. **Delete Event**

**Controller:** `deleteEvent`

**Endpoint:**

```
DELETE /events/:id
```

**Description:**
Deletes an event by its ID (only if created by the authenticated user).

**Success Response:**

```json
{
  "success": true,
  "message": "Event deleted successfully"
}
```

**Error Responses:**

```json
{ "success": false, "error": "Event not found or unauthorized" }
{ "success": false, "error": "Internal server error" }
```

---

## ⏲️ Study Session Endpoints

### 1. **Create Study Session**

**Controller:** `createStudySession`

**Endpoint:**

```
POST /study-sessions
```

**Description:**
Records a new study session for the authenticated user.

- If `duration > 10` minutes, it updates the user's streak.

**Request Body Example:**

```json
{
  "startTime": "2025-08-29T10:00:00.000Z",
  "endTime": "2025-08-29T11:30:00.000Z",
  "duration": 90
}
```

**Success Response:**

```json
{
  "_id": "64f2d3e1a9d2f5c8b3a1c201",
  "user": "64d8a7a1c2a5c4f7e8e9d101",
  "startTime": "2025-08-29T10:00:00.000Z",
  "endTime": "2025-08-29T11:30:00.000Z",
  "duration": 90,
  "__v": 0
}
```

**Error Responses:**

```json
{ "error": "Internal server error" }
```

---

### 2. **Get Study Session Stats**

**Controller:** `getStudySessionStats`

**Endpoint:**

```
GET /study-sessions/stats?period=daily
```

**Description:**
Returns aggregated statistics for the authenticated user based on the given period.

**Query Parameters:**

- `period`: `"hourly" | "daily" | "weekly" | "monthly"` (required)

**Success Response Example (daily):**

```json
{
  "totalSessions": 3,
  "totalHours": 4.5,
  "averageDuration": 90
}
```

**Error Responses:**

```json
"Invalid period"
{ "error": "Internal server error" }
```

---

### 3. **Get User Study Stats**

**Controller:** `getUserStudyStats`

**Endpoint:**

```
GET /study-sessions/user-stats
```

**Description:**
Provides detailed statistics for the authenticated user, including streaks, level, rank, and total study hours across time ranges.

**Success Response:**

```json
{
  "timePeriods": {
    "today": "1.5",
    "thisWeek": "5.0",
    "thisMonth": "12.0",
    "allTime": "50.0"
  },
  "rank": 3,
  "totalUsers": 25,
  "streak": 7,
  "maxStreak": 15,
  "level": {
    "name": "Expert",
    "current": 26,
    "hoursInCurrentLevel": "0.5",
    "hoursToNextLevel": "1.5",
    "progress": "25.0"
  }
}
```

**Error Responses:**

```json
{ "error": "Internal server error" }
```

---

### 4. **Get Leaderboard**

**Controller:** `getLeaderboard`

**Endpoint:**

```
GET /study-sessions/leaderboard?period=weekly&friendsOnly=true
```

**Description:**
Retrieves the leaderboard of users ranked by total study time.

- Can return global or **friends-only** leaderboard.

**Query Parameters:**

- `period`: `"daily" | "weekly" | "monthly"` (required)
- `friendsOnly`: `"true" | "false"` (optional, defaults to `"false"`)

**Success Response (friendsOnly=true):**

```json
[
  {
    "userId": "64d8a7a1c2a5c4f7e8e9d101",
    "username": "Alice",
    "totalDuration": 300
  },
  {
    "userId": "64d8b8b1c2a5c4f7e8e9d102",
    "username": "Bob",
    "totalDuration": 250
  }
]
```

**Error Responses:**

```json
{ "error": "Invalid period" }
{ "error": "Internal server error" }
```

---

## 🏠 Session Room Endpoints

### 1. **Get All Session Rooms**

**Controller:** `getRoomLists`  
**Endpoint:**

```
GET /session-room
```

**Description:**  
Fetches all session rooms. Divides them into `myRooms` (created by the user) and `otherRooms` (created by others).

**Success Response:**

```json
{
  "myRooms": [
    {
      "_id": "64f1a2b9c9eabc1234567890",
      "name": "My First Room",
      "createdBy": "64f19f1a9c9eabc123456789",
      "createdAt": "2025-08-29T10:12:34.567Z"
    }
  ],
  "otherRooms": [
    {
      "_id": "64f1a2b9c9eabc1234567891",
      "name": "Another Room",
      "createdBy": "64f19f1a9c9eabc123456780",
      "createdAt": "2025-08-28T09:11:22.333Z"
    }
  ]
}
```

**Error Responses:**

```json
{ "error": "Server error message" }
```

---

### 2. **Create a Session Room**

**Controller:** `createRoom`
**Endpoint:**

```
POST /session-room
```

**Description:**
Creates a new session room linked to the authenticated user.

**Request Body Example:**

```json
{
  "name": "DSA Study Room",
  "description": "A room to discuss DSA problems"
}
```

**Success Response:**

```json
{
  "_id": "64f1a2b9c9eabc1234567892",
  "name": "DSA Study Room",
  "description": "A room to discuss DSA problems",
  "createdBy": "64f19f1a9c9eabc123456789",
  "createdAt": "2025-08-29T11:22:33.444Z"
}
```

**Error Responses:**

```json
{ "error": "invalid input" }
{ "error": "Server error message" }
```

---

### 3. **Delete a Session Room**

**Controller:** `deleteRoom`
**Endpoint:**

```
DELETE /session-room/:id
```

**Description:**
Deletes a session room if the logged-in user is the creator.

**Success Response:**

```json
{
  "success": true,
  "message": "Room deleted"
}
```

**Error Responses:**

```json
{ "error": "Room not found" }
{ "error": "Not authorized to delete this room" }
{ "error": "Server error" }
```

---

## 👥 Friends Endpoints

### 1. **Get Friends List**

**Controller:** `friendList`  
**Endpoint:**

```
GET /friends
```

**Description:**  
Fetches the authenticated user’s list of friends.

**Success Response:**

```json
[
  {
    "_id": "64f1a2b9c9eabc1234567890",
    "FirstName": "Alice",
    "LastName": "Smith",
    "ProfilePicture": "https://cdn-icons-png.flaticon.com/512/219/219986.png"
  }
]
```

**Error Responses:**

```json
{ "error": "Server error message" }
```

---

### 2. **Get Friend Suggestions**

**Controller:** `userList`
**Endpoint:**

```
GET /friends/friend-suggestions?page=1&limit=20
```

**Description:**
Fetches suggested users that the authenticated user may add as friends. Supports pagination.

**Success Response (paginated):**

```json
{
  "users": [
    {
      "_id": "64f1a2b9c9eabc1234567891",
      "FirstName": "Bob",
      "LastName": "Brown",
      "ProfilePicture": "https://cdn-icons-png.flaticon.com/512/219/219983.png",
      "Bio": "Love coding",
      "OtherDetails": {}
    }
  ],
  "hasMore": true
}
```

**Success Response (all users, if `all=true`):**

```json
[
  {
    "_id": "64f1a2b9c9eabc1234567892",
    "FirstName": "Charlie",
    "LastName": "Green",
    "ProfilePicture": "https://cdn-icons-png.flaticon.com/512/219/219989.png",
    "Bio": "Student",
    "OtherDetails": {}
  }
]
```

**Error Responses:**

```json
{ "error": "Server error message" }
```

---

### 3. **Send Friend Request**

**Controller:** `sendRequest`
**Endpoint:**

```
POST /friends/request/:friendId
```

**Description:**
Sends a friend request to another user.

**Success Response:**

```json
{ "message": "Friend request sent." }
```

**Error Responses:**

```json
{ "message": "You cannot add yourself as a friend." }
{ "message": "User not found." }
{ "message": "Friend not found." }
{ "message": "Already friends." }
{ "message": "Request already sent." }
{ "error": "Server error message" }
```

---

### 4. **View Sent Requests**

**Controller:** `viewSentRequests`
**Endpoint:**

```
GET /friends/sent-requests
```

**Description:**
Fetches all sent friend requests of the authenticated user.

**Success Response:**

```json
[
  {
    "_id": "64f1a2b9c9eabc1234567893",
    "FirstName": "David",
    "LastName": "Miller",
    "ProfilePicture": "https://cdn-icons-png.flaticon.com/512/219/219988.png",
    "Bio": "Learning React"
  }
]
```

**Error Responses:**

```json
{ "error": "Server error message" }
```

---

### 5. **View Incoming Requests**

**Controller:** `incomingRequests`
**Endpoint:**

```
GET /friends/requests
```

**Description:**
Fetches all incoming friend requests for the authenticated user.

**Success Response:**

```json
[
  {
    "_id": "64f1a2b9c9eabc1234567894",
    "FirstName": "Eva",
    "LastName": "Johnson",
    "ProfilePicture": "https://cdn-icons-png.flaticon.com/512/219/219982.png",
    "Bio": "Tech enthusiast"
  }
]
```

**Error Responses:**

```json
{ "error": "Server error message" }
```

---

### 6. **Accept Friend Request**

**Controller:** `acceptRequest`
**Endpoint:**

```
POST /friends/accept/:friendId
```

**Description:**
Accepts a pending friend request.

**Success Response:**

```json
{ "message": "Friend request accepted." }
```

**Error Responses:**

```json
{ "message": "No pending request from this user." }
{ "error": "Server error message" }
```

---

### 7. **Reject Friend Request**

**Controller:** `rejectRequest`
**Endpoint:**

```
DELETE /friends/reject/:friendId
```

**Description:**
Rejects a pending friend request.

**Success Response:**

```json
{ "message": "Friend request rejected." }
```

**Error Responses:**

```json
{ "error": "Server error message" }
```

---

### 8. **Remove Friend**

**Controller:** `removeFriend`
**Endpoint:**

```
DELETE /friends/:friendId
```

**Description:**
Removes an existing friend from the user’s friend list.

**Success Response:**

```json
{ "message": "Friend removed successfully." }
```

**Error Responses:**

```json
{ "error": "Server error message" }
```

---

### 9. **Get Friends Count**

**Controller:** `getFriendsCount`
**Endpoint:**

```
GET /friends/count
```

**Description:**
Returns the total number of friends the authenticated user has.

**Success Response:**

```json
{ "count": 5 }
```

**Error Responses:**

```json
{ "error": "Server error message" }
```

---

### 10. **Get User Stats**

**Controller:** `getUserStats`
**Endpoint:**

```
GET /friends/:userId/stats
```

**Description:**
Fetches detailed user statistics including sessions, hours studied, streaks, and friends.

**Success Response:**

```json
{
  "success": true,
  "userInfo": {
    "firstName": "Alice",
    "lastName": "Smith",
    "bio": "Software Engineer",
    "profilePicture": "https://cdn-icons-png.flaticon.com/512/219/219986.png"
  },
  "stats": {
    "totalSessions": 12,
    "totalHours": 48,
    "streak": 5,
    "lastActive": "2025-08-28T09:11:22.333Z",
    "friends": [
      {
        "_id": "64f1a2b9c9eabc1234567891",
        "FirstName": "Bob",
        "LastName": "Brown",
        "ProfilePicture": "https://cdn-icons-png.flaticon.com/512/219/219983.png"
      }
    ]
  }
}
```

**Error Responses:**

```json
{ "success": false, "message": "User not found" }
{ "success": false, "error": "Server error message" }
```

---

### 11. **Cancel Sent Request**

**Controller:** `removeSentRequest`
**Endpoint:**

```
DELETE /friends/sent-requests/:friendId
```

**Description:**
Cancels a previously sent friend request.

**Success Response:**

```json
{ "message": "Friend request canceled successfully." }
```

**Error Responses:**

```json
{ "error": "Server error message" }
```

---

Here’s the **complete clean API documentation** for your **User routes & controllers** in the same Markdown style we’ve been building:

---

## 👤 User Endpoints

### 1. **Give Kudos**

**Controller:** `giveKudos`
**Endpoint:**

```http
POST /user/kudos
```

**Description:**
Allows a user to give kudos to another user. A user cannot give kudos to themselves or the same user multiple times.

**Request Body Example:**

```json
{
  "receiverId": "64f9c8a1b8d9f4a123456789"
}
```

**Success Response:**

```json
{
  "message": "Kudos given successfully!",
  "receiverKudos": 5
}
```

**Error Responses:**

```json
{ "message": "You cannot give kudos to yourself." }
{ "message": "Receiver not found." }
{ "message": "You have already given kudos to this user." }
{ "message": "Server error" }
```

---

### 2. **Get User Details**

**Controller:** `getUserDetails`
**Endpoint:**

```http
GET /user/details?id=<userId>
```

**Description:**
Fetch detailed information about a user. Also determines the relationship status between the current logged-in user and the target user.

**Success Response Example:**

```json
{
  "_id": "64f9c8a1b8d9f4a123456789",
  "FirstName": "John",
  "LastName": "Doe",
  "Email": "johndoe@example.com",
  "Bio": "Computer Science Student",
  "ProfilePicture": "https://cdn.example.com/user.png",
  "relationshipStatus": "Friends"
}
```

**Possible `relationshipStatus` values:**

- `"Friends"` → already friends
- `"Add Friend"` → no connection
- `"Cancel Request"` → current user sent a request
- `"Accept Request"` → current user has a pending incoming request
- `"unknown"` → if user cannot be determined

**Error Responses:**

```json
{ "error": "User ID is required and cannot be undefined" }
{ "error": "User not found" }
{ "error": "Failed to fetch user details" }
```

---

### 3. **Get User Badges**

**Controller:** `getUserBadges`
**Endpoint:**

```http
GET /user/badges
```

**Description:**
Fetch all badges for the authenticated user. If any new badges are earned, they are also included in the response.

**Success Response Example:**

```json
{
  "badges": ["Rookie", "Consistency King"],
  "newBadges": ["Rookie"],
  "availableBadges": ["Rookie", "Consistency King", "Marathoner", "Leader"]
}
```

**Error Responses:**

```json
{ "error": "Unauthorized" }
{ "error": "User not found" }
{ "error": "Failed to get badges" }
```

---

### 4. **Update Profile**

**Controller:** `updateProfile`
**Endpoint:**

```http
PUT /user/profile
```

**Description:**
Updates the user’s profile information (e.g., bio, graduation year, other details). Certain fields like `_id`, `Email`, and `Password` are not allowed to be updated.

**Request Body Example:**

```json
{
  "Bio": "Passionate about AI and open-source.",
  "GraduationYear": 2026,
  "OtherDetails": {
    "GitHub": "https://github.com/johndoe",
    "LinkedIn": "https://linkedin.com/in/johndoe"
  }
}
```

**Success Response Example:**

```json
{
  "_id": "64f9c8a1b8d9f4a123456789",
  "FirstName": "John",
  "LastName": "Doe",
  "Bio": "Passionate about AI and open-source.",
  "GraduationYear": 2026,
  "OtherDetails": {
    "GitHub": "https://github.com/johndoe",
    "LinkedIn": "https://linkedin.com/in/johndoe"
  },
  "ProfilePicture": "https://cdn.example.com/user.png",
  "badges": ["Rookie"]
}
```

**Error Responses:**

```json
{ "error": "Unauthorized" }
{ "error": "Invalid graduation year" }
{ "error": "Bio cannot exceed 500 characters" }
{ "error": "OtherDetails must be an object" }
{ "error": "User not found" }
{ "error": "Failed to update profile" }
```

---

### 5. **Upload Profile Picture**

**Controller:** `uploadProfilePicture`
**Endpoint:**

```http
POST /user/upload-profile-picture
```

**Description:**
Uploads a new profile picture for the authenticated user. Only image file types are supported.

**Request Body:**

- Form-data with field: `profilePicture` (image file, max 5MB).

**Success Response Example:**

```json
{
  "message": "Profile picture uploaded successfully",
  "profilePictureUrl": "https://res.cloudinary.com/app/profile_pictures/abc123.png",
  "user": {
    "_id": "64f9c8a1b8d9f4a123456789",
    "FirstName": "John",
    "LastName": "Doe",
    "ProfilePicture": "https://res.cloudinary.com/app/profile_pictures/abc123.png"
  }
}
```

**Error Responses:**

```json
{ "error": "Unauthorized" }
{ "error": "No image uploaded" }
{ "error": "Invalid file type. Only images are allowed." }
{ "error": "Failed to upload profile picture" }
```
