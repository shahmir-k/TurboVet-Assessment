# Backend Setup Guide

## ✅ What's Been Completed

The NestJS backend is fully implemented with:

- ✅ TypeORM with SQLite/PostgreSQL support
- ✅ JWT Authentication
- ✅ Role-Based Access Control (RBAC)
- ✅ Task CRUD operations with permission checks
- ✅ Audit logging
- ✅ Organization hierarchy support
- ✅ Shared data library with DTOs and interfaces
- ✅ Validation with class-validator

## 🚀 How to Run the Backend

### Step 1: Create Environment File

Create a `.env` file in the `org` directory:

```bash
# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRATION=24h

# Database Configuration
DB_TYPE=sqlite
DB_DATABASE=turbovet.db

# API Configuration
API_PORT=3000
```

### Step 2: Start the API Server

```bash
cd org
npx nx serve api
```

The API will start on `http://localhost:3000/api`

### Step 3: Test with Sample Users

The database is automatically seeded with test users:

**Owner:**

- Email: `owner@turbovet.com`
- Password: `password123`
- Can: Create, Read, Update, Delete tasks, View audit logs

**Admin:**

- Email: `admin@turbovet.com`
- Password: `password123`
- Can: Create, Read, Update, Delete tasks, View audit logs

**Viewer:**

- Email: `viewer@turbovet.com`
- Password: `password123`
- Can: Read tasks only

## 📡 API Endpoints

### Authentication

**POST** `/api/auth/login`

```json
{
  "email": "owner@turbovet.com",
  "password": "password123"
}
```

Response:

```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid",
    "email": "owner@turbovet.com",
    "firstName": "John",
    "lastName": "Owner",
    "roleType": "owner",
    "organizationId": "uuid"
  }
}
```

### Tasks

All task endpoints require `Authorization: Bearer <token>` header.

**POST** `/api/tasks` - Create task (Owner/Admin only)

```json
{
  "title": "Complete project",
  "description": "Finish the TurboVet assessment",
  "status": "todo",
  "category": "work",
  "priority": 8
}
```

**GET** `/api/tasks` - List all accessible tasks

**GET** `/api/tasks/:id` - Get single task

**PATCH** `/api/tasks/:id` - Update task (Owner/Admin only)

```json
{
  "status": "done",
  "priority": 10
}
```

**DELETE** `/api/tasks/:id` - Delete task (Owner/Admin only)

### Audit Logs

**GET** `/api/audit-log` - View all audit logs (Owner/Admin only)

**GET** `/api/audit-log/my-logs` - View your own audit logs

## 🧪 Testing with cURL

```bash
# 1. Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"owner@turbovet.com","password":"password123"}'

# 2. Create Task (use token from login)
curl -X POST http://localhost:3000/api/tasks \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{"title":"Test Task","description":"Testing API","status":"todo","category":"work","priority":5}'

# 3. Get all tasks
curl -X GET http://localhost:3000/api/tasks \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"

# 4. View audit logs
curl -X GET http://localhost:3000/api/audit-log \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## 🏗️ Architecture

### Database Schema

- **users** - User accounts with role and organization
- **organizations** - 2-level hierarchy support
- **tasks** - Tasks with status, category, priority
- **audit_logs** - All CRUD operations logged

### RBAC Implementation

- **Owner** - Full access to organization and child organizations
- **Admin** - Full access to organization and child organizations
- **Viewer** - Read-only access to own organization

Role hierarchy: Owner > Admin > Viewer

### Organization Hierarchy

- Parent organizations can access child organization data
- Child organizations can only access their own data
- Enforced at the service layer

## ✨ Next Steps

Now you can:

1. Test the backend API endpoints
2. Build the Angular frontend
3. Integrate frontend with backend
4. Add tests
5. Write documentation

## 🐛 Troubleshooting

**Port already in use:**

```bash
# Change API_PORT in .env to a different port (e.g., 3001)
```

**Database errors:**

```bash
# Delete the database and restart (it will re-seed)
rm turbovet.db
npx nx serve api
```

**Build errors:**

```bash
# Clean and rebuild
npx nx reset
npx nx build api
```
