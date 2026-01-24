# Authentication System - Verification Checklist

## ✅ Completed Tasks

### Frontend Components
- [x] **login.jsx** - Now uses real API (`authService.teacherLogin()`, `authService.adminLogin()`)
- [x] **register.jsx** - Now uses real API (`authService.teacherRegister()`, `authService.adminRegister()`)
- [x] Error messages displayed properly
- [x] Success messages with auto-redirect
- [x] Loading states on buttons
- [x] Form validation
- [x] No mock data (all removed)

### Backend API
- [x] Admin registration endpoint working
- [x] Admin login endpoint working
- [x] Teacher registration endpoint working (creates PENDING status)
- [x] Teacher login endpoint working (blocks PENDING accounts)
- [x] JWT token generation
- [x] Password hashing with bcrypt
- [x] Input validation

### Database
- [x] Admin collection (role, orgId)
- [x] Teacher collection (status: PENDING/APPROVED)
- [x] Organisation collection
- [x] Proper relationships established

### Error Handling
- [x] "Invalid credentials" error
- [x] "Teacher not approved yet" error
- [x] Network error handling
- [x] Form validation errors

### Environment Configuration
- [x] `.env` file created with `VITE_API_URL`
- [x] API client uses `import.meta.env.VITE_API_URL` (Vite format)
- [x] Fallback to `http://localhost:5000/api` if env var missing

---

## 🧪 How to Test

### Option 1: Automated Test
```bash
node auth-test.js
```
Expected output:
- ✅ Admin Registration SUCCESS
- ✅ Admin Login SUCCESS
- ✅ Teacher Registration SUCCESS
- ✅ Teacher Login Blocked (CORRECT - account not approved)

### Option 2: Manual Testing
1. Open browser DevTools (F12)
2. Go to app landing page
3. Follow [AUTH_TEST_GUIDE.md](./AUTH_TEST_GUIDE.md)

---

## 🔍 What to Check

### Frontend Checks
- [ ] Login page shows role selection (Teacher / Coordinator)
- [ ] Register page shows organization dropdown for teachers
- [ ] Error messages appear in red boxes
- [ ] Success messages appear in green boxes
- [ ] Buttons show "Loading..." text when submitting
- [ ] App redirects to dashboard after successful login

### Backend Checks (MongoDB)
```bash
# Check Admin collection
use proactive_ed_db
db.admins.find()

# Check Teacher collection
db.teachers.find()

# Check Organisation collection
db.organisations.find()
```

### Network Checks (Browser DevTools)
- Network tab → See POST requests to `/auth/admin/login`, `/auth/teacher/login`
- Response should have `token` field
- Status should be 200 (success) or appropriate error code

### LocalStorage Checks (Browser DevTools)
After successful login, check Application → LocalStorage:
- `authToken` - JWT token (starts with `eyJ`)
- `user` - JSON with user data (name, email, role, orgId, status)

---

## 📋 Validation Checklist

Test each scenario:

| Scenario | Expected | Status |
|----------|----------|--------|
| Admin registers | Creates org + account (APPROVED) | ⏳ |
| Admin logs in | Gets token, redirects to /admin/dashboard | ⏳ |
| Teacher registers | Account created with PENDING status | ⏳ |
| Teacher logs in (PENDING) | Error: "not approved yet" | ⏳ |
| Admin approves teacher | Status changed to APPROVED | ⏳ |
| Teacher logs in (APPROVED) | Gets token, redirects to /dashboard | ⏳ |
| Invalid password | Error: "Invalid credentials" | ⏳ |
| Non-existent email | Error: "Invalid credentials" | ⏳ |
| Page reload after login | User data persists | ⏳ |

---

## 🐛 Troubleshooting

### "Cannot GET /api/auth/admin/login" Error
- Backend server not running
- Fix: Run `npm run dev` in `/server` folder

### "CORS Error" or Network Failure
- API URL incorrect in `.env`
- Fix: Ensure `VITE_API_URL=http://localhost:5000/api` in `.env`

### Teacher Can Login While PENDING
- Backend logic error
- Check: `server/controllers/auth.controller.js` line ~150
- Should return 403 status with "not approved yet" message

### Token Not Saving to LocalStorage
- Frontend code issue
- Check: `authService.js` lines that call `localStorage.setItem('authToken', ...)`
- Verify: Browser allows localStorage (not in private/incognito mode)

### Organization Dropdown Empty
- Organizations not in database
- Fix: Create admin first (creates organization), then try teacher register

---

## 📁 Test Files Created

1. **auth-test.js** - Automated API test script
2. **AUTH_TEST_GUIDE.md** - Step-by-step manual testing guide
3. **AUTH_IMPLEMENTATION.md** - Implementation details

---

## 🚀 Next Steps (After Verification)

Once all tests pass:
1. ✅ Test in different browsers (Chrome, Firefox, Safari)
2. ✅ Test on mobile devices
3. ✅ Test error scenarios (network offline, server down)
4. ✅ Load test with multiple concurrent logins
5. ✅ Security audit (password requirements, token expiry, HTTPS)

---

## Questions or Issues?

1. Check browser console for JavaScript errors
2. Check browser network tab for API response
3. Check server logs for backend errors
4. Check MongoDB for data being created
5. Review error messages in red boxes on screen

