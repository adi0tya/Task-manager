# Secure Role-Based Task Management System

A production-ready full-stack web application demonstrating clean REST API design, JWT authentication, role-based access control, and a React frontend.

---

## Tech Stack

| Layer      | Technology                                      |
|------------|-------------------------------------------------|
| Backend    | Node.js, Express.js                             |
| Database   | MongoDB + Mongoose                              |
| Auth       | JWT (jsonwebtoken) + bcryptjs                   |
| Validation | Joi                                             |
| Docs       | Swagger (swagger-jsdoc + swagger-ui-express)    |
| Frontend   | React 18 + Vite + Tailwind CSS                  |
| HTTP       | Axios                                           |
| Docker     | Docker + Docker Compose                         |

---

## Project Structure

```
task-manager/
├── backend/
│   ├── src/
│   │   ├── config/          # Database connection
│   │   ├── controllers/     # Route handlers (auth, tasks, admin)
│   │   ├── middleware/       # auth, role, error, logger
│   │   ├── models/          # Mongoose schemas (User, Task)
│   │   ├── routes/          # Express routers (versioned)
│   │   ├── utils/           # JWT helper, error helper
│   │   ├── validations/     # Joi schemas
│   │   └── app.js           # Express app setup
│   ├── swagger.js           # Swagger config
│   ├── server.js            # Entry point
│   ├── .env.example
│   ├── Dockerfile
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/      # Navbar, TaskCard, TaskModal, ProtectedRoute
│   │   ├── context/         # AuthContext (React Context + localStorage)
│   │   ├── pages/           # Login, Register, Dashboard, Tasks, AdminPanel
│   │   └── services/        # Axios API service (auth, tasks, admin)
│   ├── Dockerfile
│   ├── nginx.conf
│   └── package.json
└── docker-compose.yml
```

---

## Setup Instructions

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- npm

### 1. Backend

```bash
cd task-manager/backend
npm install
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret
npm run dev
```

Backend runs at: `http://localhost:5000`  
API Docs (Swagger): `http://localhost:5000/api-docs`

### 2. Frontend

```bash
cd task-manager/frontend
npm install
npm run dev
```

Frontend runs at: `http://localhost:5173`

### 3. Docker (Full Stack)

```bash
cd task-manager
docker-compose up --build
```

- Frontend: `http://localhost`
- Backend: `http://localhost:5000`
- API Docs: `http://localhost:5000/api-docs`

---

## Environment Variables

### Backend `.env`

| Variable        | Description                        | Default                              |
|-----------------|------------------------------------|--------------------------------------|
| `PORT`          | Server port                        | `5000`                               |
| `NODE_ENV`      | Environment                        | `development`                        |
| `MONGO_URI`     | MongoDB connection string          | `mongodb://localhost:27017/task-manager` |
| `JWT_SECRET`    | JWT signing secret (keep private)  | —                                    |
| `JWT_EXPIRES_IN`| Token expiry                       | `7d`                                 |
| `CLIENT_URL`    | Frontend URL for CORS              | `http://localhost:5173`              |

---

## API Endpoints

### Auth — `/api/v1/auth`

| Method | Endpoint    | Access  | Description          |
|--------|-------------|---------|----------------------|
| POST   | `/register` | Public  | Register new user    |
| POST   | `/login`    | Public  | Login, get JWT token |
| GET    | `/me`       | Private | Get current user     |

### Tasks — `/api/v1/tasks`

| Method | Endpoint | Access  | Description                    |
|--------|----------|---------|--------------------------------|
| GET    | `/`      | Private | Get logged-in user's tasks     |
| POST   | `/`      | Private | Create a new task              |
| GET    | `/:id`   | Private | Get single task by ID          |
| PUT    | `/:id`   | Private | Update task                    |
| DELETE | `/:id`   | Private | Delete task                    |

Query params for GET `/`: `status`, `page`, `limit`

### Admin — `/api/v1/admin`

| Method | Endpoint       | Access | Description              |
|--------|----------------|--------|--------------------------|
| GET    | `/users`       | Admin  | Get all users            |
| GET    | `/users/:id`   | Admin  | Get user by ID           |
| DELETE | `/users/:id`   | Admin  | Delete user + their tasks|
| GET    | `/tasks`       | Admin  | Get all tasks            |

---

## Role-Based Access Control

| Role    | Permissions                                                  |
|---------|--------------------------------------------------------------|
| `user`  | Register, login, CRUD on **own tasks only**                  |
| `admin` | All user permissions + view/delete **all users and tasks**   |

### How it works

1. `authMiddleware` — verifies the JWT from `Authorization: Bearer <token>` header. Attaches `req.user`.
2. `roleMiddleware('admin')` — checks `req.user.role`. Returns 403 if not authorized.

---

## Security Features

- Passwords hashed with **bcrypt** (12 salt rounds)
- JWT tokens with configurable expiry
- `helmet` for HTTP security headers
- `express-rate-limit` — 100 req/15min per IP
- Input validation with **Joi** on all endpoints
- Password field excluded from all DB queries by default (`select: false`)
- CORS restricted to configured `CLIENT_URL`
- Request body size limited to 10kb

---

## Scalability Notes

This project is structured for easy horizontal scaling:

- **Modular architecture** — each concern (auth, tasks, admin) is a self-contained module. Adding a new feature means adding a new controller/route/model without touching existing code.
- **Stateless JWT auth** — no server-side sessions, scales across multiple instances behind a load balancer.
- **Microservices-ready** — auth, tasks, and admin modules can be extracted into separate services with minimal refactoring.
- **Redis caching** — task list queries and user lookups are ideal candidates for Redis caching to reduce DB load at scale.
- **Docker support** — containerized for consistent deployment. Add a load balancer (nginx/HAProxy) in front of multiple backend replicas.
- **Database indexing** — `userId` and `status` fields on Task are indexed for fast filtered queries.

Future additions:
- Redis for caching frequent reads
- Message queue (BullMQ/RabbitMQ) for async operations
- Horizontal scaling with PM2 cluster mode or Kubernetes
- Centralized logging (Winston + ELK stack)

---

## API Documentation

Interactive Swagger docs available at:  
`http://localhost:5000/api-docs`

All endpoints are documented with request/response schemas and authentication requirements.
