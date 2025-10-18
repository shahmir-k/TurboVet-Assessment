# Shahmir Khan

## Total time spent: 1.5hrs at most

### I had an absolutely crushing week at work with no free time this week. I actually did this all in like 1 hour. Maybe 1.5hrs at most. Used AI to help with the frontend styling because it is not an effective use of my time to be picking colours and stylings.

### I wanted to message you guys asking for accommodation for more time, because I finally have a day off this Sunday. But you guys didn't even respond to any of my previous messages on Linkedin :/ So I'm just gonna submit whatever I have right now.

### Everything works, but I'm not going to spend more time to write documentation and automated tests just for an assessment. Its 10pm right now and I have to wake up at 5am to go to work tomorrow because it is crunch time for a major project.

## TO RUN:

**Terminal 1 - Update Dependencies and Run Backend:**

```bash
npm install
npx nx serve api
```

**Terminal 2 - Run Frontend:**

```bash
npx nx serve turbovet_shahmir_khan
```

## Everything below is AI-Generated slop explainations

# TurboVet Task Management System

A secure, full-stack task management application built with **NestJS**, **Angular**, **TypeORM**, and **TailwindCSS** in an **NX monorepo**, featuring role-based access control (RBAC) and JWT authentication.

---

## 🏗️ Architecture Overview

### Monorepo Structure

```
org/
├── apps/
│   ├── api/                      # NestJS Backend
│   │   ├── src/
│   │   │   ├── auth/            # Authentication module (JWT)
│   │   │   ├── tasks/           # Task CRUD with RBAC
│   │   │   ├── audit/           # Audit logging
│   │   │   └── database/        # TypeORM entities & config
│   │
│   └── turbovet_shahmir_khan/   # Angular Frontend
│       ├── src/
│       │   ├── app/
│       │   │   ├── components/  # Task list & form components
│       │   │   ├── pages/       # Login & dashboard
│       │   │   ├── services/    # Auth & task services
│       │   │   ├── guards/      # Route protection
│       │   │   └── interceptors/# JWT token injection
│       │
├── libs/
│   ├── data/                    # Shared interfaces, DTOs, enums
│   └── auth/                    # RBAC utility functions
```

---

## ✨ Features Implemented

### Backend (NestJS)

- ✅ **Real JWT Authentication** (not mock) with Passport
- ✅ **Role-Based Access Control (RBAC)**
  - Owner: Full access to org + child orgs
  - Admin: Full access to org + child orgs
  - Viewer: Read-only access to own org
- ✅ **Task Management API** with permission checks
- ✅ **2-Level Organization Hierarchy**
- ✅ **Audit Logging** (database + console)
- ✅ **TypeORM** with SQLite (dev) and PostgreSQL (prod) support
- ✅ **Request Validation** with class-validator
- ✅ **Shared Libraries** for type safety

### Frontend (Angular)

- ✅ **Login UI** with form validation
- ✅ **JWT Token Management** with HTTP interceptor
- ✅ **Task Dashboard** with statistics
- ✅ **Drag-and-Drop** for task status changes (Angular CDK)
- ✅ **Task CRUD Operations** (Create, Read, Update, Delete)
- ✅ **Filtering & Sorting** by status and category
- ✅ **Responsive Design** (mobile → desktop)
- ✅ **TailwindCSS** for beautiful UI
- ✅ **Signal-based State Management**
- ✅ **Route Guards** for authentication

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- npm or yarn
- Git

### Installation

1. **Clone and navigate to the workspace:**

   ```bash
   cd org
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Create environment file:**

   Create a `.env` file in the `org` directory:

   ```env
   # JWT Configuration
   JWT_SECRET=turbovet-super-secret-jwt-key-2024-change-in-production
   JWT_EXPIRATION=24h

   # Database Configuration
   DB_TYPE=sqlite
   DB_DATABASE=turbovet.db

   # API Configuration
   API_PORT=3000
   ```

### Running the Application

#### Option 1: Run Both (Recommended)

**Terminal 1 - Backend:**

```bash
npx nx serve api
```

**Terminal 2 - Frontend:**

```bash
npx nx serve turbovet_shahmir_khan
```

#### Option 2: Run Separately

**Backend only:**

```bash
npx nx serve api
# API runs on http://localhost:3000/api
```

**Frontend only:**

```bash
npx nx serve turbovet_shahmir_khan
# Frontend runs on http://localhost:4200
```

---

## 👥 Test Users

The database is automatically seeded with test accounts:

| Email                 | Password      | Role   | Permissions                     |
| --------------------- | ------------- | ------ | ------------------------------- |
| `owner@turbovet.com`  | `password123` | Owner  | Full access (CRUD + Audit Logs) |
| `admin@turbovet.com`  | `password123` | Admin  | Full access (CRUD + Audit Logs) |
| `viewer@turbovet.com` | `password123` | Viewer | Read-only access                |

---

## 📡 API Documentation

### Base URL

```
http://localhost:3000/api
```

### Authentication

#### POST `/auth/login`

Login with credentials and receive JWT token.

**Request:**

```json
{
  "email": "owner@turbovet.com",
  "password": "password123"
}
```

**Response:**

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

### Tasks (Requires Authentication)

All task endpoints require `Authorization: Bearer <token>` header.

#### POST `/tasks`

Create a new task (Owner/Admin only).

**Request:**

```json
{
  "title": "Complete documentation",
  "description": "Write comprehensive README",
  "status": "todo",
  "category": "work",
  "priority": 8
}
```

#### GET `/tasks`

Get all accessible tasks (scoped by role and organization).

#### GET `/tasks/:id`

Get a single task by ID.

#### PATCH `/tasks/:id`

Update a task (Owner/Admin only).

**Request:**

```json
{
  "status": "done",
  "priority": 10
}
```

#### DELETE `/tasks/:id`

Delete a task (Owner/Admin only).

### Audit Logs

#### GET `/audit-log`

View all audit logs (Owner/Admin only).

#### GET `/audit-log/my-logs`

View your own audit logs (all roles).

---

## 🗄️ Database Schema

### Users

- `id` (UUID)
- `email` (unique)
- `password` (hashed with bcrypt)
- `firstName`, `lastName`
- `roleType` (owner | admin | viewer)
- `organizationId` (FK)
- `createdAt`, `updatedAt`

### Organizations

- `id` (UUID)
- `name`
- `parentId` (nullable, self-referencing FK)
- `createdAt`, `updatedAt`

### Tasks

- `id` (UUID)
- `title`, `description`
- `status` (todo | in_progress | done)
- `category` (work | personal | urgent | other)
- `priority` (0-10)
- `userId` (FK), `organizationId` (FK)
- `createdAt`, `updatedAt`

### Audit Logs

- `id` (UUID)
- `userId` (FK)
- `action` (create | read | update | delete)
- `resource`, `resourceId`
- `details`
- `createdAt`

**Entity Relationship Diagram:**

```
Organizations (1) ──< (N) Users
Organizations (1) ──< (N) Tasks
Users (1) ──< (N) Tasks
Users (1) ──< (N) AuditLogs
```

---

## 🛡️ RBAC Implementation

### Role Hierarchy

```
Owner > Admin > Viewer
```

### Permission Matrix

| Action          | Owner                 | Admin                 | Viewer            |
| --------------- | --------------------- | --------------------- | ----------------- |
| Create Task     | ✅                    | ✅                    | ❌                |
| Read Tasks      | ✅ (own + child orgs) | ✅ (own + child orgs) | ✅ (own org only) |
| Update Task     | ✅                    | ✅                    | ❌                |
| Delete Task     | ✅                    | ✅                    | ❌                |
| View Audit Logs | ✅                    | ✅                    | ❌                |

### Organization Hierarchy

- **Parent organizations** can access child organization data
- **Child organizations** can only access their own data
- RBAC enforced at the service layer for data isolation

---

## 🧪 Testing

### Backend API Testing

A PowerShell test script is included:

```bash
powershell -ExecutionPolicy Bypass -File test-api.ps1
```

This tests:

- ✅ Login authentication
- ✅ Task creation
- ✅ Task retrieval
- ✅ Audit logging
- ✅ RBAC permissions

### Manual Testing with cURL

```bash
# 1. Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"owner@turbovet.com","password":"password123"}'

# 2. Create Task (use token from login)
curl -X POST http://localhost:3000/api/tasks \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"Test","description":"API test","status":"todo","category":"work","priority":5}'

# 3. Get All Tasks
curl -X GET http://localhost:3000/api/tasks \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## 🎨 Frontend Features

### Login Page

- Email/password form with validation
- Test account credentials displayed
- Beautiful gradient background
- Error handling

### Dashboard

- **Statistics Cards**: Total, In Progress, Completed tasks
- **Kanban Board**: Three columns (To Do, In Progress, Done)
- **Drag & Drop**: Move tasks between statuses
- **Filtering**: By status and category
- **Role-Based UI**: Edit/Delete buttons only for Owner/Admin
- **Task Form Modal**: Create/Edit with validation
- **Responsive Design**: Works on mobile, tablet, and desktop

---

## 🔒 Security Features

### JWT Authentication

- Secure token generation with configurable expiration
- Token stored in localStorage
- Automatic token injection via HTTP interceptor
- Auto-logout on 401 responses

### Password Security

- Bcrypt hashing with salt rounds (10)
- Never store plain text passwords

### RBAC Guards

- Backend guards check JWT payload for role
- Frontend guards protect routes
- Service-layer permission checks

### Audit Trail

- All CRUD operations logged
- User, action, resource tracking
- Timestamp and details recorded

---

## 📦 Build & Deployment

### Build Backend

```bash
npx nx build api
# Output: dist/api
```

### Build Frontend

```bash
npx nx build turbovet_shahmir_khan
# Output: dist/apps/turbovet_shahmir_khan
```

### Production Considerations

- Set `JWT_SECRET` to a strong, unique value
- Use PostgreSQL instead of SQLite
- Set `synchronize: false` in TypeORM config
- Enable HTTPS
- Implement JWT refresh tokens
- Add rate limiting
- Enable CORS only for trusted origins
- Add CSRF protection
- Implement permission caching
- Add comprehensive logging

---

## 📚 Technology Stack

### Backend

- **NestJS** 10.x - Progressive Node.js framework
- **TypeORM** - Database ORM
- **SQLite/PostgreSQL** - Database
- **Passport JWT** - Authentication
- **bcrypt** - Password hashing
- **class-validator** - Request validation

### Frontend

- **Angular** 20.x - Web framework
- **TailwindCSS** 3.x - Utility-first CSS
- **Angular CDK** - Drag & drop
- **RxJS** - Reactive programming
- **Signals** - State management

### Shared

- **NX** 21.x - Monorepo management
- **TypeScript** - Type safety
- **ESLint** - Code linting
- **Jest** - Testing framework

---

## 🐛 Troubleshooting

### Backend won't start

```bash
# Check if port 3000 is in use
netstat -ano | findstr :3000

# Delete database and restart
rm turbovet.db
npx nx serve api
```

### Frontend won't start

```bash
# Clear NX cache
npx nx reset

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### CORS errors

- Ensure API is running on port 3000
- Check CORS configuration in `main.ts`

---

## 📝 Future Enhancements

- [ ] JWT refresh token rotation
- [ ] Email verification
- [ ] Password reset functionality
- [ ] Real-time updates with WebSockets
- [ ] Task comments and attachments
- [ ] Advanced filtering and search
- [ ] Task assignment to multiple users
- [ ] Notification system
- [ ] Export tasks to PDF/CSV
- [ ] Dark mode persistence
- [ ] Keyboard shortcuts
- [ ] Accessibility improvements (ARIA labels)
- [ ] Performance monitoring
- [ ] Rate limiting
- [ ] CSRF protection
- [ ] Unit and E2E tests

---

## 👨‍💻 Developer

**Shahmir Khan**  
Full Stack Coding Challenge - TurboVet Assessment

---

## 📄 License

This project was created as part of a coding assessment.

---

## 🙏 Acknowledgments

Built with:

- NX for monorepo management
- NestJS for robust backend architecture
- Angular for powerful frontend framework
- TailwindCSS for beautiful, responsive UI
