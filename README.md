# Secure Role-Based Task Management System

> A scalable, production-ready REST API with JWT authentication, role-based access control, and a React frontend — built as part of a Backend Developer Internship assignment.

[![Node.js](https://img.shields.io/badge/Node.js-18+-green?style=flat-square&logo=node.js)](https://nodejs.org)
[![Express](https://img.shields.io/badge/Express.js-4.x-black?style=flat-square&logo=express)](https://expressjs.com)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-green?style=flat-square&logo=mongodb)](https://mongodb.com)
[![React](https://img.shields.io/badge/React-18-blue?style=flat-square&logo=react)](https://reactjs.org)
[![License](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)](LICENSE)

---

## 👨‍💻 Developer

**Aditya Dash** — MERN Stack Developer  
📍 Bhubaneswar, India  
📧 [adityadash05@gmail.com](mailto:adityadash05@gmail.com)  
📞 +91 8260540773  
🌐 [Portfolio](https://adityadash-portfolio.vercel.app) &nbsp;|&nbsp; [LinkedIn](https://www.linkedin.com/in/aditya-dash-421748311) &nbsp;|&nbsp; [GitHub](https://github.com/adi0tya)

> Results-driven MERN Stack Developer specializing in scalable, real-time web applications. Strong experience in building REST APIs, optimizing database performance, and developing full-stack systems using React, Node.js, Express, and MongoDB.

---

## 📖 Project Overview

This project is a **secure and scalable REST API system** designed to demonstrate production-level backend development practices. It includes:

- **JWT-based authentication** — register, login, and protected routes
- **Role-based access control** — separate permissions for `user` and `admin` roles
- **Full CRUD operations** — create, read, update, and delete tasks
- **Basic frontend UI** — React app to register, login, and interact with all APIs
- **API documentation** — interactive Swagger docs at `/api-docs`
- **Security** — bcrypt hashing, helmet headers, rate limiting, Joi validation

---

## ⚙️ Tech Stack

**Backend**
- Node.js + Express.js
- MongoDB + Mongoose
- JWT (`jsonwebtoken`) — authentication
- bcryptjs — password hashing
- Joi — input validation
- Swagger UI — API documentation
- Helmet + express-rate-limit — security middleware

**Frontend**
- React.js (Vite)
- Tailwind CSS
- Axios
- React Router DOM
- React Hot Toast

**Tools**
- GitHub
- Postman / Swagger
- VS Code
- Docker + Docker Compose

---

## 📂 Project Structure

```
task-manager/
├── backend/
│   ├── src/
│   │   ├── config/         # Database connection
│   │   ├── controllers/    # Auth, Tasks, Admin logic
│   │   ├── middleware/     # Auth, Role, Error, Logger
│   │   ├── models/         # User & Task schemas
│   │   ├── routes/         # Versioned API routes
│   │   ├── utils/          # JWT & error helpers
│   │   └── validations/    # Joi validation schemas
│   ├── swagger.js
│   └── server.js
├── frontend/
│   └── src/
│       ├── components/     # Navbar, TaskCard, TaskModal
│       ├── context/        # AuthContext (JWT + localStorage)
│       ├── pages/          # Login, Register, Dashboard, Tasks, Admin
│       └── services/       # Axios API service layer
└── docker-compose.yml
```

---

## 🚀 Setup Instructions

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)

### Backend

```bash
# Clone the repository
git clone https://github.com/adi0tya/Task-manager.git

# Navigate to backend
cd Task-manager/backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env
# Fill in your values (see Environment Variables section)

# Start the development server
npm run dev
```

> Server: `http://localhost:5000`  
> Swagger Docs: `http://localhost:5000/api-docs`

### Frontend

```bash
# Navigate to frontend
cd Task-manager/frontend

# Install dependencies
npm install

# Start the dev server
npm run dev
```

> Frontend: `http://localhost:5173`

### Docker (Full Stack)

```bash
cd Task-manager
docker-compose up --build
```

---

## 🔐 Environment Variables

Create a `.env` file inside the `backend/` directory:

```env
PORT=5000
NODE_ENV=development
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
```

---

## 📡 API Endpoints

### Auth — `/api/v1/auth`

| Method | Endpoint    | Access  | Description        |
|--------|-------------|---------|--------------------|
| POST   | `/register` | Public  | Register new user  |
| POST   | `/login`    | Public  | Login, get token   |
| GET    | `/me`       | Private | Get current user   |

### Tasks — `/api/v1/tasks`

| Method | Endpoint | Access  | Description               |
|--------|----------|---------|---------------------------|
| GET    | `/`      | Private | Get logged-in user tasks  |
| POST   | `/`      | Private | Create a new task         |
| GET    | `/:id`   | Private | Get task by ID            |
| PUT    | `/:id`   | Private | Update task               |
| DELETE | `/:id`   | Private | Delete task               |

> Supports query params: `?status=pending&page=1&limit=10`

### Admin — `/api/v1/admin`

| Method | Endpoint       | Access | Description                |
|--------|----------------|--------|----------------------------|
| GET    | `/users`       | Admin  | Get all users              |
| GET    | `/users/:id`   | Admin  | Get user by ID             |
| DELETE | `/users/:id`   | Admin  | Delete user + their tasks  |
| GET    | `/tasks`       | Admin  | Get all tasks              |

---

## 🛡️ Role-Based Access Control

| Role    | Permissions                                                      |
|---------|------------------------------------------------------------------|
| `user`  | Register, login, and manage **own tasks only**                   |
| `admin` | All user permissions + view/delete **all users and all tasks**   |

**Flow:**
1. On login, a signed JWT is returned and stored in `localStorage`.
2. Every protected request sends the token via `Authorization: Bearer <token>`.
3. `authMiddleware` verifies the token and attaches the user to `req.user`.
4. `roleMiddleware('admin')` checks the role — returns `403` if unauthorized.

---

## 📈 Scalability

The project is built with a **modular, separation-of-concerns architecture** that makes it straightforward to scale:

- Each feature (auth, tasks, admin) is a self-contained module — new features can be added without touching existing code.
- **Stateless JWT** authentication scales horizontally across multiple instances behind a load balancer.
- The codebase is **microservices-ready** — each module can be extracted into an independent service with minimal refactoring.

**Planned improvements:**
- Redis caching for high-frequency task/user queries
- Microservices architecture for independent scaling
- Load balancing with Nginx or AWS ALB
- Full Docker orchestration for production deployment
- Centralized logging with Winston + ELK stack

---

## 🧪 Demo Credentials

> Register via the UI or use these pre-seeded accounts for testing.

**Admin Account**
```
Email:    admin@test.com
Password: 123456
```

**User Account**
```
Email:    user@test.com
Password: 123456
```

---

## 🌐 Live Links

| Service     | URL                                              |
|-------------|--------------------------------------------------|
| Frontend    | _Coming soon_                                    |
| Backend API | _Coming soon_                                    |
| API Docs    | `http://localhost:5000/api-docs` (local)         |
| GitHub Repo | https://github.com/adi0tya/Task-manager          |

---

## 🗂️ Other Projects

### [SyncSpace](https://github.com/adi0tya)
A real-time collaborative study platform designed for students.
- **Features:** Live chat, study rooms, file sharing, Pomodoro timer, voice communication
- **Stack:** React, Node.js, Express, MongoDB, Socket.io

### [Dynamic API Generator](https://github.com/adi0tya)
A platform to create and manage REST APIs dynamically without writing backend code.
- **Features:** Live endpoint routing, API testing interface, dynamic schema management
- **Stack:** React, Node.js, Express

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

<p align="center">
  Built with ❤️ by <a href="https://adityadash-portfolio.vercel.app">Aditya Dash</a>
</p>
