# 📝 Task Manager

A full-stack task management system with authentication, task assignment, real-time notifications, and modern UI built with Tailwind CSS.

## 🚀 Features

- ✅ User Authentication (Signup, Login)
- ✅ JWT-based Auth
- ✅ Task Creation, Editing, Deletion
- ✅ Task Assignment to other users
- ✅ Search the tasks by title
- ✅ Filtering by Title, Priority, Status, Due Date
- ✅ Responsive UI using TailwindCSS
- ✅ Protected Routes with Auth Middleware

---

## 📦 Tech Stack

| Layer      | Tech                               |
|------------|------------------------------------|
| Frontend   | Next.js (App Router) + TailwindCSS |
| Backend    | Express.js + Prisma ORM            |
| Database   | PostgreSQL                         |
| Auth       | JWT (Access Token)                 |
| Hosting    | Render and Vercel                  |
---

## 📁 Project Structure
```
task-manager/
├── backend/
│ ├── index.ts
│ ├── prisma/
│ ├── routes/
│ 
├── frontend/
│ ├── app/
│ ├── components/
│ ├── utils/
│ └── public/


```

## ⚙️ Installation

### 1. Clone the repository
```bash
git clone https://github.com/saikumar1308/Task-Management-System.git
cd task-manager

```
### 2. Setup Backend
```
cd backend
npm install

# Create .env and add Environmental variables
.env
DATABASE_URL=postgresql://username:password@localhost:5432/taskdb
JWT_SECRET=your_jwt_secret


# Setup Prisma
npx prisma migrate dev --name init

# Start the backend
npm run dev
```
### 3. Setup the frontend
```
cd ../frontend
npm install

# Create .env and add Environmental variables
.env
NEXT_PUBLIC_API_URL=http://localhost:8080


# Start the frontend
npm run dev
```
## 📬 API Endpoints
```
## Auth
POST /api/user/signup

POST /api/user/login

## Tasks
GET /api/task

POST /api/task

PUT /api/task/

DELETE /api/task/

## Notifications
GET /api/notifications

POST /api/notifications/
```
## 🔐 Authentication
```
Uses JWT stored in local storage and attached via Authorization header for all requests to protected endpoints.
```

📄 License : 
MIT
