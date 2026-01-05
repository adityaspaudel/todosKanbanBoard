# 🗂️ Todos Kanban Board

A simple and intuitive **Kanban-style Todo Board** that helps you organize tasks visually across **four workflow stages**:

- 📝 **Todo Tasks**
- ⏭️ **Next Tasks**
- 🔄 **Doing**
- ✅ **Done**


---

## ✨ Features (Progress Tracker)

- [ ] Create tasks
- [ ] Display tasks in Kanban board layout
- [ ] Four Kanban columns
  - [ ] **Todo Tasks** – Tasks to be started
  - [ ] **Next Tasks** – Tasks queued up next
  - [ ] **Doing** – Tasks currently in progress
  - [ ] **Done** – Completed tasks
- [ ] Move tasks between columns
- [ ] Clean and minimal UI
<!-- - [ ] Responsive layout -->

### 🚧 In Progress / Planned
- [ ] Drag & drop task movement
- [ ] Edit task title and description
- [ ] Delete tasks
- [ ] Persist data (LocalStorage / Database)
<!-- - [ ] User authentication -->
<!-- - [ ] Task priority (Low / Medium / High) -->
<!-- - [ ] Due dates for tasks -->

---

## 🧩 Kanban Columns Overview

| Column Name | Description |
|------------|------------|
| **Todo**   | Tasks that are planned but not started |
| **Next**   | Tasks that will be done soon |
| **Doing**  | Tasks currently being worked on |
| **Done**   | Tasks that are completed |

---

## 🛠️ Tech Stack

- **Frontend:** Next.js / React
- **Styling:** Tailwind CSS
- **State Management:**  React-Redux, Redux Toolkit, Redux-Persist
- **Backend :** Node.js, Express
- **Database :** MongoDB

---

---

## 🚀 Getting Started

Follow the steps below to run both **Frontend (Next.js/React)** and **Backend (Node.js, Express, MongoDB)** locally.

---

### 📦 Prerequisites

- Node.js (v18+ recommended)
- npm or yarn
- MongoDB (local or MongoDB Atlas)

---


## Getting Started

1. Clone the repository

   ```
   git clone https://github.com/adityaspaudel/todosKanbanBoard.git
   ```

2. Install dependencies for both the client and server

   ```
   cd client
   npm install

   cd ../server
   npm install
   ```

3. Set up environment variables
   Create a `.env` file in the root directory of both the client and server and add necessary variables.

4. Run the development server

   ```
   cd client
   npm run dev
   ```

   For the backend server:

   ```
   cd ../server
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the frontend.

6. Backend server will run on [http://localhost:8000](http://localhost:8000) by default.

