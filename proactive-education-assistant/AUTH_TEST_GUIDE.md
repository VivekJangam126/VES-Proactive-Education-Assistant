# Authentication Testing Guide

## Prerequisites
1. **Backend server** must be running: `npm run dev` in `/server`
2. **Frontend dev server** must be running: `npm run dev` in root
3. **MongoDB** must be running (ensure connection in `server/config/db.js`)
4. **Environment variables** set correctly in `src/.env` (VITE_API_URL)

---

## Testing Workflow

### Phase 1: Admin Registration
**Goal**: Create an admin account and organization

1. Go to landing page → Click "Register"
2. Fill form:
   - **Full Name**: `Admin User`
   - **Email**: `admin@testschool.org`
   - **Password**: `Test123456` (min 6 chars)
   - **Role**: Select "Coordinator / Admin"
   - **Organization Name**: `Test High School`
3. Click "Create Account"

**Expected Result**:
- ✅ Success message: "Admin account created successfully! You can now login."
- ✅ Auto-redirected to login after 2 seconds
- ✅ New organization created in database

---

### Phase 2: Admin Login
**Goal**: Login as admin and verify access to admin dashboard

1. In login modal:
   - **Email**: `admin@testschool.org`
   - **Password**: `Test123456`
   - **Role**: Select "Coordinator / Admin"
2. Click "Login"

**Expected Result**:
- ✅ Login successful
- ✅ Token stored in localStorage
- ✅ Redirected to `/admin/dashboard`
- ✅ Can see admin interface

---

### Phase 3: Teacher Registration
**Goal**: Register teacher (requires admin approval)

1. Go to landing page → Click "Register"
2. Fill form:
   - **Full Name**: `John Teacher`
   - **Email**: `john@testschool.org`
   - **Password**: `Test123456`
   - **Role**: Select "Teacher / Field Worker"
   - **Select Organization**: Choose the organization created in Phase 1
3. Click "Create Account"

**Expected Result**:
- ✅ Success message: "Registration successful! Your account is pending admin approval..."
- ✅ Teacher created with status "PENDING" in database
- ✅ Auto-redirected to login

---

### Phase 4: Teacher Login (Before Approval) - Should FAIL
**Goal**: Verify pending teachers cannot login

1. In login modal:
   - **Email**: `john@testschool.org`
   - **Password**: `Test123456`
   - **Role**: Select "Teacher / Field Worker"
2. Click "Login"

**Expected Result**:
- ❌ Login fails with error: "Teacher not approved yet" or similar
- ❌ **Not** redirected to dashboard
- ✅ Error message displayed

---

### Phase 5: Admin Approves Teacher
**Goal**: Admin approves pending teacher

1. Login as admin (Phase 2)
2. Go to **Teacher Management** page
3. Find "John Teacher" with status "PENDING"
4. Click **Approve** button

**Expected Result**:
- ✅ Teacher status changed to "APPROVED" in database
- ✅ UI updates to show "APPROVED" status

---

### Phase 6: Teacher Login (After Approval) - Should SUCCEED
**Goal**: Login as approved teacher

1. Logout as admin (if needed)
2. In login modal:
   - **Email**: `john@testschool.org`
   - **Password**: `Test123456`
   - **Role**: Select "Teacher / Field Worker"
3. Click "Login"

**Expected Result**:
- ✅ Login successful
- ✅ Token stored in localStorage
- ✅ User data stored (name, email, role, orgId, status)
- ✅ Redirected to `/dashboard`
- ✅ Can see teacher dashboard

---

## API Endpoints Tested

### Admin Endpoints
- **POST** `/auth/admin/register` - Create admin account
- **POST** `/auth/admin/login` - Admin login

### Teacher Endpoints
- **POST** `/auth/teacher/register` - Register teacher (creates PENDING status)
- **POST** `/auth/teacher/login` - Teacher login (fails if PENDING)

---

## Database Collections Created

### Admin Collection
```json
{
  "_id": "...",
  "name": "Admin User",
  "email": "admin@testschool.org",
  "password": "bcrypt_hash",
  "role": "ADMIN",
  "orgId": "...",
  "createdAt": "...",
  "updatedAt": "..."
}
```

### Teacher Collection
```json
{
  "_id": "...",
  "name": "John Teacher",
  "email": "john@testschool.org",
  "password": "bcrypt_hash",
  "role": "TEACHER",
  "orgId": "...",
  "status": "PENDING" or "APPROVED",
  "createdAt": "...",
  "updatedAt": "..."
}
```

### Organisation Collection
```json
{
  "_id": "...",
  "name": "Test High School",
  "type": "School",
  "createdAt": "...",
  "updatedAt": "..."
}
```

---

## Troubleshooting

### "Invalid credentials" error
- Check email/password are correct
- Verify user exists in database
- Check password is not empty

### "Teacher not approved yet" error (expected behavior)
- This is correct! Teachers must be approved by admin first
- Login to admin account to approve the teacher

### "Failed to connect to API" error
- Verify backend server is running: `npm run dev` in `/server`
- Check `VITE_API_URL` in `.env` matches backend URL
- Check MongoDB is connected

### Form submission does nothing
- Check browser console for errors
- Verify authService is imported correctly
- Check network tab to see API calls

---

## Success Checklist

- ✅ Admin can register and login
- ✅ Teacher can register (status = PENDING)
- ✅ Teacher login fails when PENDING
- ✅ Admin can approve teachers
- ✅ Teacher can login after APPROVED
- ✅ Tokens stored in localStorage
- ✅ User data persists across page reload
- ✅ Logout clears all data

---

## Test Data for Quick Testing

### Admin Credentials (after registration)
- **Email**: `admin@testschool.org`
- **Password**: `Test123456`
- **Role**: Coordinator/Admin

### Teacher Credentials (after approval)
- **Email**: `john@testschool.org`
- **Password**: `Test123456`
- **Role**: Teacher/Field Worker

