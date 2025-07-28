# 🧱 Microservices Architecture with Docker Compose

## 📖 Overview

This project demonstrates a basic **microservices architecture** using Docker Compose, designed for local development on Windows. It includes:

- 🛡️ An Authentication Service (Node.js + MongoDB – handles user registration and login, with /health endpoint for Docker monitoring)
- ⚙️ A Core API Service (Node.js – handles business logic, includes /health endpoint for healthchecks)
- 🌐 A Frontend UI (Nginx + static HTML – served via reverse proxy)
- 🔀 An NGINX Reverse Proxy for routing and service discovery (/, /auth, /api)
- 🍃 A MongoDB Container for persistent user data storage
- 🧪 A Mongo Express GUI for inspecting MongoDB documents and collections
- 💓 Integrated Healthcheck Endpoints (/health) for auth and api services to support Docker’s service monitoring and readiness probes
---

## 🖼️ Screenshots
| Screenshot                                                    | Description                                      |
| --------------------------------------------------------------| -------------------------------------------------|
| [Frontend](screenshots/frontend-ui.png)                       | 🌐 **Frontend UI** – Served by NGINX            |
| [Register/Login](screenshots/auth-response.png)               | 🔐 **Auth Service** – Register + Login with JWT |
| [Mongo GUI](screenshots/mongo-express.png)                    | 📊 **Mongo Express** – Document view of users   |
| [Public API](screenshots/Api/public_endpoint.png)             | 📟 **Public API Response** – `/api/public` OK   |
| [Protected Fail](screenshots/Api/protected_endpoint.png)      | ❌ **Protected API Without Token** – Rejected   |
| [Protected Success](screenshots/Api/protected_successful.png) | ✅ **Protected API With JWT** – Access granted  |
| [Healthcheck](screenshots/healthcheck.png)                    | 💓 Docker healthcheck route `/health`           |


---

## 🛠 Architecture

```
                ┌────────────┐
                │  Frontend  │
                │ (port 3000)│
                └─────┬──────┘
                      │
                      ▼
                ┌────────────┐
                │   NGINX    │  <-- Reverse Proxy
                │  (port 80) │
                └─┬────┬─────┘
          ┌──────┘    └──────┐
          ▼                 ▼
  ┌────────────┐     ┌────────────┐
  │  Auth Svc  │     │  API Svc   │
  │ (port 4000)│     │ (port 5000)│
  └─────┬──────┘     └────────────┘
        │
        ▼
  ┌────────────┐
  │  MongoDB   │
  │ (27017)    │
  └─────┬──────┘
        │
        ▼
  ┌──────────────┐
  │ Mongo Express│
  │  (port 8081) │
  └──────────────┘
```

---

## 📦 Services

| Service       | Description                           | Port |
|---------------|---------------------------------------|------|
| auth          | Handles login & registation (Express) | 4000 |
| api           | Core logic, depends on auth service   | 5000 |
| frontend      | Static site served by Nginx           | 3000 |
| nginx         | Routes `/auth`, `/api`, `/` traffic   | 80   |
| mongodb       | Stores user data for auth-service     | 27017|
| mongo-express | Web UI for MongoDB database inspection| 8081 |


---

###🔐 API Features

**Endpoints**
✅ GET /api/public
Open access – no token required

🔒 GET /api/protected
Protected route – requires JWT in header
**Header:**

    Authorization: Bearer <your_token_here>

**Response:**

    {
      "message": "Access granted to protected data",
      "userId": "65b..."
    }

--- 

💾 MongoDB Usage
- MongoDB stores registered users
- Connected using Mongoose ORM
- Database: authdb
- Collection: users
- Containerized in docker-compose.yml
- 🔒 Users persist even after container restarts

---
💓 Healthcheck Routes (Docker monitoring)

- GET /health
  Available in both auth and api services
  Returns 200 OK if service is healthy.
Used internally by Docker for service monitoring.
--- 

🧪 Sample Registration & Login (PowerShell)

    #Register
    $headers = @{ "Content-Type" = "application/json" }
    $body = '{"username":"demo","password":"demo123"}'
    Invoke-WebRequest -Uri http://localhost/auth/register -Method POST -Headers $headers -Body $body
    
    # Login
    $response = Invoke-RestMethod -Uri http://localhost/auth/login -Method POST -Headers $headers -Body $body
    $response.token


--- 

## 🚀 Setup Instructions

### 1. Clone the repository:
```
git clone https://github.com/sanjog-shrestha/microservices-architecture.git
cd microservices-architecture
```

### 2. Create .env file
```
MONGO_URI=mongodb://mongo:27017/authdb
JWT_SECRET=supersecretkey123
```

### 3. Start the service
```
docker-compose up --build
```

### 4. Access the services:
- Frontend: [http://localhost/](http://localhost/)
- Auth: [http://localhost/auth/](http://localhost/auth/)
- API: [http://localhost/api/](http://localhost/api/)
- Mongo UI: [http://localhost/api/](http://localhost:8081)

---

## 📁 Directory Structure

```
microservices-architecture/
├── docker-compose.yml
├── .env
├── nginx/
│   └── default.conf
├── auth-service/
│   ├── Dockerfile
│   ├── package.json
│   ├── index.js
│   └── models/User.js
├── api-service/
│   ├── Dockerfile
│   ├── package.json
│   └── index.js
├── frontend/
│   ├── Dockerfile
│   └── index.html
└── README.md


```

## 📃 License

MIT License
