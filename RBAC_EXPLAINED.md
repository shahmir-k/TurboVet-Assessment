# RBAC & Organization Hierarchy Explained

## 🏢 What are Organizations?

Organizations are **logical groups** that contain users and their tasks. Think of them like:

- Companies
- Departments
- Teams
- Business units

## 🌳 2-Level Organization Hierarchy

Your system supports a **parent-child** relationship:

```
┌─────────────────────────────────────┐
│   TurboVet HQ (Parent Org)         │
│   ID: xyz-123                       │
│                                     │
│   Users:                            │
│   • Owner (John)                    │
│   • Admin (Jane)                    │
│                                     │
│   └─────────────────────────────┐  │
│     │ Branch Office (Child Org) │  │
│     │ ID: abc-456               │  │
│     │ parentId: xyz-123         │  │
│     │                           │  │
│     │ Users:                    │  │
│     │ • Viewer (Bob)            │  │
│     └───────────────────────────┘  │
└─────────────────────────────────────┘
```

## 🔒 Access Control Rules

### Rule 1: Owner & Admin (Parent Org)

**Can access:**

- ✅ Tasks from **their own** organization (HQ)
- ✅ Tasks from **child** organizations (Branch)

**Example:**

```typescript
// Owner/Admin at HQ queries GET /tasks

// Backend returns tasks from:
const orgIds = [
  'xyz-123', // TurboVet HQ (their org)
  'abc-456', // Branch Office (child org)
];

// Returns ALL tasks from both organizations
```

### Rule 2: Viewer (Any Org)

**Can access:**

- ✅ Tasks from **their own** organization ONLY
- ❌ Tasks from parent organizations
- ❌ Tasks from sibling organizations

**Example:**

```typescript
// Viewer at Branch Office queries GET /tasks

// Backend returns tasks from:
const orgIds = ['abc-456']; // ONLY Branch Office

// Returns tasks from Branch Office only
// Cannot see HQ tasks even though HQ is parent
```

## 🎯 Real-World Scenarios

### Scenario 1: Owner Creates a Task

```
Owner (at HQ) creates task:
  ↓
Task saved with organizationId = 'xyz-123' (HQ)
  ↓
Who can see this task?
  ├── Owner ✅ (same org)
  ├── Admin ✅ (same org)
  └── Viewer ❌ (different org, can't see parent tasks)
```

### Scenario 2: Task Created in Branch Office

```
If a task exists in Branch Office (organizationId = 'abc-456'):
  ↓
Who can see this task?
  ├── Owner ✅ (parent org can see child tasks)
  ├── Admin ✅ (parent org can see child tasks)
  └── Viewer ✅ (same org)
```

### Scenario 3: Multi-Branch Company

Imagine you add another branch:

```
TurboVet HQ
  ├── Branch A
  │     └── Viewer A
  └── Branch B
        └── Viewer B

Owner at HQ can see:
  ├── HQ tasks
  ├── Branch A tasks
  └── Branch B tasks

Viewer A can see:
  └── Branch A tasks ONLY (not B, not HQ)

Viewer B can see:
  └── Branch B tasks ONLY (not A, not HQ)
```

## 💡 Why This Design?

### 1. **Data Isolation**

- Branch offices can't see each other's data
- Prevents data leaks between departments

### 2. **Management Oversight**

- HQ (Owners/Admins) can monitor all branches
- Useful for reporting and oversight

### 3. **Scalability**

- Easy to add new branches
- Each branch is independent

### 4. **Security**

- Principle of least privilege
- Users only see what they need

## 🔍 Code Implementation

### Database Schema

**Organization Table:**

```typescript
{
  id: 'xyz-123',
  name: 'TurboVet HQ',
  parentId: null  // ← null means it's a parent org
}

{
  id: 'abc-456',
  name: 'Branch Office',
  parentId: 'xyz-123'  // ← points to parent
}
```

**User Table:**

```typescript
{
  id: 'user-1',
  email: 'owner@turbovet.com',
  roleType: 'owner',
  organizationId: 'xyz-123'  // ← belongs to HQ
}

{
  id: 'user-2',
  email: 'viewer@turbovet.com',
  roleType: 'viewer',
  organizationId: 'abc-456'  // ← belongs to Branch
}
```

**Task Table:**

```typescript
{
  id: 'task-1',
  title: 'Important task',
  userId: 'user-1',
  organizationId: 'xyz-123'  // ← HQ task
}
```

### Access Check Logic

```typescript
// In tasks.service.ts - findAll()

if (user.roleType === 'owner' || user.roleType === 'admin') {
  // Get their org
  const org = user.organization; // { id: 'xyz-123', ... }

  // Get org IDs to query
  const orgIds = [org.id]; // ['xyz-123']

  // Add child org IDs
  if (org.children) {
    orgIds.push(...org.children.map((c) => c.id));
    // Now: ['xyz-123', 'abc-456']
  }

  // Query tasks from ALL these orgs
  return tasksFromTheseOrganizations(orgIds);
}

// Viewers only get their own org
return tasksFromOrganization(user.organizationId);
```

## 🧪 Test It Yourself!

1. **Login as Owner** (owner@turbovet.com)

   - Create 2 tasks
   - They'll be in HQ organization

2. **Login as Viewer** (viewer@turbovet.com)

   - You **won't see** the Owner's tasks
   - This proves org-level isolation

3. **To see it in action:**
   - You'd need to manually create a task with `organizationId: 'abc-456'` (Branch)
   - Then Owner would see it
   - But Viewer would also see it (same org)

## 📝 Summary

**Organizations** = Groups of users
**Org-Level Access** = Who can see tasks from which organizations

- **Parent orgs (Owner/Admin)**: See own + children ⬇️
- **Child orgs (any role)**: See only their own ➡️
- **Viewers (any org)**: See only their own 🔒

This creates a **hierarchical access control** system where management can oversee everything, but individual teams have data privacy from each other!
