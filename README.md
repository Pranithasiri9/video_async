# video_async
# 🎥 Asynchronous Video Processing System

An asynchronous video upload and processing application built using **Node.js, Express, and React**.  
The system ensures large video uploads and long-running processing tasks do **not block the server or user interface**.

---

## 🚀 Features

- Upload video files asynchronously
- Task-based processing pipeline
- Real-time task state updates
- Background worker for video processing
- Conditional UI actions (Download / Delete)
- Backend file validation (size & format)

---

## 🏗️ Architecture Overview

Frontend (React)
↓
Backend API (Node.js + Express)
↓
Background Worker (Async Processing)

---

## 📂 Project Structure

backend_video/
├── server.js # Backend entry point
├── worker.js # Background task processor
├── tasksStore.js # Shared in-memory task store
├── routes/
│ ├── uploads.js # Video upload & validation
│ └── tasks.js # Task status, download, delete APIs
├── uploads/ # Uploaded videos
└── outputs/ # Processed videos

frontend/
├── src/
│ ├── App.js # UI logic & polling
│ ├── api.js # Backend API calls
│ └── App.css # UI styling


---

## 🔄 Task Lifecycle

Each uploaded video becomes a **task** that moves through the following states:

QUEUED → PROCESSING → COMPLETED

---

## 🧠 Core Components

### `server.js`
- Entry point of the backend
- Starts the Express server
- Registers API routes
- Enables middleware (CORS, JSON parsing)
- Starts the background worker

---

### `uploads.js`
- Handles video uploads
- Validates:
  - Maximum file size: **200 MB**
  - Supported formats: **MP4, MOV, WebM**
- Creates a task in `QUEUED` state

### `tasksStore.js`
Shared in-memory store
Single source of truth for all task states
Accessible by routes and worker
## ⚙️ Background Worker (`worker.js`)

- Acts as a **background processor** for video processing tasks
- Continuously monitors tasks in the `QUEUED` state
- Transitions task state from:
  - `QUEUED` → `PROCESSING`
- Performs video processing asynchronously
- Updates task state to:
  - `COMPLETED` on success
  - `FAILED` on error
- Ensures long-running operations do **not block** the API server

---

## 📌 Task APIs (`tasks.js`)

- Exposes REST APIs related to task management
- Allows the frontend to:
  - Fetch the list of all tasks
  - Download processed videos (only after completion)
  - Delete tasks
- Used by the frontend for **periodic polling** to display real-time task state updates
- Acts as the communication layer between backend task state and UI


