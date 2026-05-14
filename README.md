# Team Task Manager

Team Task Manager is a full-stack project management application built with a Node.js/Express backend and a React + Vite frontend. It supports user authentication, role-based access, project creation, task creation, and status updates.

## Features

- User signup and login with JWT authentication
- Role-based access control (`admin` and `member`)
- Admin-only project creation
- Task creation for authenticated users
- View projects and project-specific tasks
- Update project status and task status

## Technologies

- Backend: Node.js, Express, MongoDB, Mongoose, JWT, bcryptjs
- Frontend: React, Vite, React Router, Axios, Tailwind CSS

## Project Structure

- `backend/`
  - `server.js` - Express app entrypoint
  - `config/db.js` - MongoDB connection
  - `controllers/` - business logic for auth, projects, tasks
  - `middleware/` - JWT auth and role-based access
  - `models/` - Mongoose schemas for User, Project, Task
  - `routes/` - API routes for authentication, projects, tasks

- `frontend/`
  - `src/` - React app source code
  - `src/pages/` - app pages for login, dashboard, create project, create task
  - `src/services/api.js` - Axios instance configured for the backend API

## Setup Instructions

### Prerequisites

- Node.js
- npm
- MongoDB instance or MongoDB Atlas connection

### Backend Setup

1. Open a terminal in `backend/`
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in `backend/` with:
   ```env
   MONGO_URI=<your-mongodb-connection-string>
   ```
4. Start the backend server:
   ```bash
   npm run dev
   ```

The backend runs on `http://localhost:5000` by default.

### Frontend Setup

1. Open a terminal in `frontend/`
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the frontend app:
   ```bash
   npm run dev
   ```

The frontend runs on Vite's default port (usually `http://localhost:5173`).

## API Endpoints

- `POST /api/auth/signup` - register a new user
- `POST /api/auth/login` - authenticate and receive a JWT
- `GET /api/auth/users` - get user list (authenticated)
- `GET /api/projects` - list projects (authenticated)
- `POST /api/projects` - create a new project (admin only)
- `PATCH /api/projects/:id/status` - update project status
- `GET /api/tasks` - list tasks (authenticated)
- `POST /api/tasks` - create a new task (authenticated)
- `PUT /api/tasks/:id` - update a task status (authenticated)

## Notes

- The frontend uses `http://localhost:5000/api` as the backend base URL.
- Auth tokens are stored in `localStorage` after login.
- Admin users can create projects; all authenticated users can create and update tasks.

## License

This project is available under the ISC license.

## both frontend and backend deployed on render





