# Project (MERN Role-Based Academic Workflow(for FYP))

A full-stack **MERN** application with **role-based workflows** (HOD / Supervisor / Student), **JWT authentication**, **Mongoose ODM**, **Redis caching**, and **Socket.IO realtime notifications**.

- **Backend**: Node.js + Express + MongoDB (Mongoose) + Redis + Socket.IO
- **Frontend**: React (Vite) + Ant Design + Axios


## Features (implemented)
- JWT authentication with role-based authorization (RBAC)
- Logout via token revocation using `tokenVersion`
- Student project submission with document upload (multer)
- Supervisor review & project approval workflow (status transitions)
- HOD evaluation workflow
- Redis caching for frequently accessed project reads
- Socket.IO realtime notifications to connected clients



## Project structure
- `server.js` – Express + Socket.IO server entry
- `routes/` – API endpoints (auth, projects, events, meetings, discussions, etc.)
- `models/` – MongoDB schemas (Mongoose)
- `controller/` – business logic for routes
- `middleware/` – auth/role/upload middlewares
- `myapp/` – React frontend (Vite)


## Prerequisites
- Node.js (LTS recommended)
- MongoDB running (or provide remote connection)
- Redis running (local default expected)


## Environment variables
Create a `.env` file in the project root.

This project expects at least:
- `JWT_SECRET` – used to sign and verify JWT tokens
- `DB` – MongoDB connection string
- (optional) `PORT` – server port (default: `5000`)

Example:

JWT_SECRET=your_jwt_secret
DB=mongodb://localhost:27017/your_db_name
PORT=5000


## Setup & run (Backend)

npm install
npm run start

Backend starts on `http://localhost:5000`.


## Setup & run (Frontend)
From `myapp/` directory:

npm install
npm run dev

Frontend will typically starts on `http://localhost:5173`.


## API base URLs
- Backend base: `http://localhost:5000`
- Frontend uses Axios with `baseURL: /api` (served from the Vite dev server proxying style depending on your setup).

Routes mounted on backend:
- `/api/auth`
- `/api/projects`
- `/api/events`
- `/api/meetings`
- `/api/discussions`
- `/api/community`
- `/api/notifications`
- `/api/github`


## Socket.IO
- Server listens via Socket.IO on the same backend server.
- Client can emit `join` to join a user room.


## Demo workflow
1. Login as a user (role determines dashboard)
2. Student submits a project with a document upload
3. HOD assigns a supervisor
4. Supervisor approves (creates group)
5. HOD evaluates and finalizes approval/rejection
6. Verify notifications and realtime updates
Note: Any user cannot enter in order to add user you must add user by HOD(Admin) first or drect Database user entry for demo.


## Known limitations / next improvements
This project also includes features and operation needs to be re-engineered. So, limitation exists.


## License
ISC


Note: Plushie1i was my old ID.

