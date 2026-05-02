# Secure Role-Based Task Management System

A full-stack web application built as a backend-focused internship assignment. It features a scalable REST API with JWT authentication, role-based access control, full CRUD operations, and a clean React frontend to interact with the API.

---

## Tech Stack

**Backend**
- Node.js + Express.js
- MongoDB + Mongoose
- JWT (jsonwebtoken) — authentication
- bcryptjs — password hashing
- Joi — input validation
- Swagger UI — API documentation
- Helmet + express-rate-limit — security

**Frontend**
- React.js (Vite)
- Tailwind CSS
- Axios
- React Router DOM
- React Hot Toast

**Tools**
- Swagger (`/api-docs`)
- Postman
- GitHub
- Docker + Docker Compose

---

## Project Structure

```
task-manager/
├── backend/
│   ├── src/
│   │   ├── config/         # DB connection
│   │   ├── controllers/    # Auth, Tasks, Admin
│   │   ├── middleware/     # Auth, Role, Error, Logger
│   │   ├── models/         # User, Task schemas
│   │   ├── routes/         # Versioned API routes
│   │   ├── utils/          # JWT & error helpers
│   │   └── validations/    # Joi schemas
│   ├── swagger.js
│   └── server.js
├── frontend/
│   └── src/
│       ├── components/     # Navbar, TaskCard, TaskModal
│       ├── context/        # AuthContext
│       ├── pages/          # Login, Register, Dashboard, Tasks, Admin
│       └── services/       # Axios API service
└── docker-compose.yml
```

---

## Setup Instructions

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)

### Backend

```bash
# 1. Clone the repository
git clone https://github.com/adi0tya/Task-manager.git
cd Task-manager/backend

# 2. Install dependencies
npm install

# 3. Create environment file
cp .env.example .env
# Edit .env with your values

# 4. Start the server
npm run dev
```

Server runs at: `http://localhost:5000`  
Swagger docs at: `http://localhost:5000/api-docs`

### Frontend

```bash
cd Task-manager/frontend

# 1. Install dependencies
npm install

# 2. Start the dev server
npm run dev
```

Frontend runs at: `http://localhost:5173`

### Docker (Full Stack)

```bash
cd Task-manager
docker-compose up --build
```

---

## Environment Variables

Create a `.env` file inside the `backend/` folder:

```env
PORT=5000
NODE_ENV=development
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
```

---

## API Endpoints

### Auth — `/api/v1/auth`

| Method | Endpoint    | Access | Description       |
|--------|-------------|--------|-------------------|
| POST   | `/register` | Public | Register new user |
| POST   | `/login`    | Public | Login, get token  |
| GET    | `/me`       | Private | Get current user |

### Tasks — `/api/v1/tasks`

| Method | Endpoint | Access  | Description              |
|--------|----------|---------|--------------------------|
| GET    | `/`      | Private | Get logged-in user tasks |
| POST   | `/`      | Private | Create a new task        |
| GET    | `/:id`   | Private | Get task by ID           |
| PUT    | `/:id`   | Private | Update task              |
| DELETE | `/:id`   | Private | Delete task              |

> Supports query params: `?status=pending&page=1&limit=10`

### Admin — `/api/v1/admin`

| Method | Endpoint       | Access | Description               |
|--------|----------------|--------|---------------------------|
| GET    | `/users`       | Admin  | Get all users             |
| GET    | `/users/:id`   | Admin  | Get user by ID            |
| DELETE | `/users/:id`   | Admin  | Delete user + their tasks |
| GET    | `/tasks`       | Admin  | Get all tasks             |

---

## Role-Based Access Control

| Role    | Permissions                                                    |
|---------|----------------------------------------------------------------|
| `user`  | Register, login, create and manage **own tasks only**          |
| `admin` | All user permissions + view/delete **all users and all tasks** |

**How it works:**

1. On login, a signed JWT token is returned and stored in `localStorage`.
2. Every protected request sends the token via `Authorization: Bearer <token>`.
3. `authMiddleware` verifies the token and attaches the user to the request.
4. `roleMiddleware('admin')` checks the user's role and returns `403` if unauthorized.

---

## Scalability

The project follows a modular, separation-of-concerns architecture that makes it easy to scale:

- Each feature (auth, tasks, admin) is a self-contained module — adding a new feature means adding a new controller, route, and model without touching existing code.
- Stateless JWT authentication scales horizontally across multiple server instances behind a load balancer.
- The codebase is **microservices-ready** — auth, tasks, and admin can be extracted into independent services with minimal refactoring.

**Planned improvements:**
- Redis caching for frequent task/user queries
- Message queues (BullMQ) for async operations
- Kubernetes or PM2 cluster mode for horizontal scaling
- Centralized logging with Winston + ELK stack
- Full Docker orchestration for production deployment

---

## Demo Credentials

> Register via the UI or API. To test admin access, register with `"role": "admin"` in the request body.

**Admin**
```
Email:    admin@demo.com
Password: admin123
Role:     admin
```

**User**
```
Email:    user@demo.com
Password: user123
Role:     user
```

---

## Live Demo

| Service     | URL                                          |
|-------------|----------------------------------------------|
| Frontend    | _Coming soon_                                |
| Backend API | _Coming soon_                                |
| API Docs    | `http://localhost:5000/api-docs` (local)     |

---

## License

MIT
