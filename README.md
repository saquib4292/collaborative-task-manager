# 🗂 Collaborative Task Manager

A full-stack collaborative task management application built using **React, TypeScript, Node.js, Express, MongoDB, and Socket.io**.

This project allows multiple users to create, assign, manage, and track tasks in real time with proper authentication and role-based access control.

---
## 🚀 Live Project Links

- 🌐 Frontend (Vercel):  
   https://collaborative-task-manager-czwx.vercel.app/

- ⚙️ Backend API (Render):  
  https://collaborative-task-manager-2.onrender.com/


## 📄 Project Documentation (PDF)
[Download PDF](./Collaborative_Task_Manager_README.pdf)


## 🚀 Features

### 🔐 Authentication
- User Register & Login
- JWT based authentication
- Protected API routes

### 📋 Task Management
- Create, Read, Update, Delete tasks
- Assign tasks to users
- Task fields:
  - Title
  - Description
  - Due Date
  - Priority (Low, Medium, High, Urgent)
  - Status (Pending, In Progress, Review, Completed)

### 👥 Role Based Access
- **Creator**
  - Can edit & delete tasks
- **Assigned User**
  - Can update task status only

### ⏰ Smart Features
- Overdue task detection
- Filter by status & priority
- Sort tasks by due date

### 🔁 Real-Time Updates
- Live dashboard updates using Socket.io
- Auto refresh when task is created/updated/deleted

---

## 🛠 Tech Stack

### Frontend
- React (Vite)
- TypeScript
- Tailwind CSS
- React Query (TanStack)
- Axios
- Socket.io Client

### Backend
- Node.js
- Express.js
- TypeScript
- MongoDB + Mongoose
- JWT Authentication
- Socket.io

---

## 🧠 Project Architecture






---

## 🔑 Authentication Flow

1. User logs in
2. Server returns JWT token
3. Token stored in localStorage
4. Token sent via `Authorization: Bearer <token>`
5. Backend verifies token using middleware
6. User gets access to protected routes

---

## 📡 API Endpoints

### Auth
- `POST /api/auth/register`
- `POST /api/auth/login`

### Tasks
- `GET /api/tasks`
- `POST /api/tasks`
- `PUT /api/tasks/:id`
- `DELETE /api/tasks/:id`
- `PATCH /api/tasks/:id/toggle-status`

---

## ⚙️ Local Setup

### 1️⃣ Clone Repository
```bash
git clone <your-repo-url>
cd collaborative-task-manager

##Backend Setup :

cd backend
npm install
npm run dev

##Frontend Setup :

cd frontend
npm install
npm run dev

📌 Assumptions

-JWT stored in localStorage for simplicity

-No unit tests included due to assignment scope

-UI focused on functionality & clarity

##Future Improvements

Edit task modal

Task comments

User profile page

Unit testing

Docker support


