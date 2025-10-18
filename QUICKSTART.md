# 🚀 Quick Start Guide

Get the TurboVet Task Management System running in under 5 minutes!

## Step 1: Environment Setup

1. Make sure you're in the `org` directory:

   ```bash
   cd org
   ```

2. The `.env` file should already exist. If not, create it:
   ```env
   JWT_SECRET=turbovet-super-secret-jwt-key-2024-change-in-production
   JWT_EXPIRATION=24h
   DB_TYPE=sqlite
   DB_DATABASE=turbovet.db
   API_PORT=3000
   ```

## Step 2: Start the Backend

Open a terminal and run:

```bash
npx nx serve api
```

✅ Backend will start on: `http://localhost:3000/api`

The database will automatically seed with test users:

- owner@turbovet.com / password123
- admin@turbovet.com / password123
- viewer@turbovet.com / password123

## Step 3: Start the Frontend

Open a **new terminal** (keep the first one running) and run:

```bash
npx nx serve turbovet_shahmir_khan
```

✅ Frontend will start on: `http://localhost:4200`

## Step 4: Login & Test

1. Open your browser to: `http://localhost:4200`
2. You'll be redirected to the login page
3. Login with: **owner@turbovet.com** / **password123**
4. Start creating and managing tasks!

## 🎯 What You Can Do

### As Owner/Admin:

- ✅ Create new tasks
- ✅ Edit existing tasks
- ✅ Delete tasks
- ✅ Drag & drop tasks between statuses
- ✅ Filter and sort tasks
- ✅ View audit logs

### As Viewer:

- ✅ View all tasks in your organization
- ❌ Cannot create, edit, or delete

## 🧪 Test the API

Run the included test script:

```bash
powershell -ExecutionPolicy Bypass -File test-api.ps1
```

This will test all API endpoints and verify RBAC is working correctly.

## 📱 Try These Features

1. **Drag & Drop**: Drag a task from "To Do" to "In Progress" or "Done"
2. **Create Task**: Click "+ New Task" button
3. **Filter**: Use the dropdowns to filter by status or category
4. **Edit**: Click "Edit" on any task to modify it
5. **Delete**: Click "Delete" to remove a task

## 🛑 Troubleshooting

**Backend not starting?**

- Check if port 3000 is available
- Delete `turbovet.db` and restart

**Frontend not starting?**

- Make sure Node.js v18+ is installed
- Run `npm install` again

**Can't login?**

- Verify backend is running on port 3000
- Check browser console for errors
- Try clearing localStorage: `localStorage.clear()`

---

**That's it! You're ready to go! 🎉**
