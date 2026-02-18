import 'dotenv/config';

const BASE_URL = process.env.BASE_URL || 'http://localhost:5000';

const log = (step, data) => {
  console.log(`\n=== ${step} ===`);
  console.dir(data, { depth: null, colors: true });
};

const request = async ({ method = 'GET', path, body, token, expectedStatus }) => {
  const url = `${BASE_URL}${path}`;
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers.Authorization = `Bearer ${token}`;

  const response = await fetch(url, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const text = await response.text();
  let json;
  try {
    json = text ? JSON.parse(text) : {};
  } catch (err) {
    json = { parseError: err.message, raw: text };
  }

  if (expectedStatus && response.status !== expectedStatus) {
    throw new Error(`Expected status ${expectedStatus} but got ${response.status}: ${text}`);
  }

  return { status: response.status, data: json };
};

const run = async () => {
  const ts = Date.now();
  const orgName = `Phase1-Org-${ts}`;
  const adminEmail = `admin+${ts}@test.com`;
  const teacherEmail = `teacher+${ts}@test.com`;
  const password = 'Password123';

  // 0) Bootstrap: Register Org + Admin (Phase 0 flow)
  const { data: adminReg } = await request({
    method: 'POST',
    path: '/api/auth/admin/register',
    body: {
      orgName,
      orgType: 'School',
      name: 'Phase1 Admin',
      email: adminEmail,
      password,
    },
    expectedStatus: 201,
  });
  log('0) Admin Registered', adminReg);
  const adminToken = adminReg.token;
  const orgId = adminReg.organisation?._id || adminReg.organisation?.id;

  // 0.1) Admin Login (to verify)
  const { data: adminLogin } = await request({
    method: 'POST',
    path: '/api/auth/admin/login',
    body: { email: adminEmail, password },
    expectedStatus: 200,
  });
  log('0.1) Admin Logged In', adminLogin);
  const adminAuthToken = adminLogin.token || adminToken;

  // 1) Create Class (Admin only)
  const className = `Class-${ts}`;
  const subjects = ['Math', 'Science', 'English'];
  const { data: classCreate } = await request({
    method: 'POST',
    path: '/api/classes',
    token: adminAuthToken,
    body: { name: className, subjects },
    expectedStatus: 201,
  });
  log('1) Class Created', classCreate);
  const classId = classCreate?.class?.id || classCreate?.class?._id;

  // 1.1) Attempt duplicate class name in same org (should fail)
  const dupeCreate = await request({
    method: 'POST',
    path: '/api/classes',
    token: adminAuthToken,
    body: { name: className, subjects },
  });
  if (dupeCreate.status !== 400) {
    throw new Error(`Expected duplicate class creation to fail with 400, got ${dupeCreate.status}`);
  }
  log('1.1) Duplicate Class Prevented (expected)', dupeCreate);

  // 2) Get All Classes (Org scoped)
  const { data: classesList1 } = await request({
    method: 'GET',
    path: '/api/classes',
    token: adminAuthToken,
    expectedStatus: 200,
  });
  log('2) Classes Listed (Admin)', classesList1);

  // 3) Update Class (Admin only) - rename and deactivate
  const updatedName = `${className}-A`;
  const updatedSubjects = [...subjects, 'History'];
  const { data: classUpdate } = await request({
    method: 'PATCH',
    path: `/api/classes/${classId}`,
    token: adminAuthToken,
    body: { name: updatedName, subjects: updatedSubjects, isActive: false },
    expectedStatus: 200,
  });
  log('3) Class Updated', classUpdate);

  // 4) Get All Classes again and confirm update
  const { data: classesList2 } = await request({
    method: 'GET',
    path: '/api/classes',
    token: adminAuthToken,
    expectedStatus: 200,
  });
  log('4) Classes Listed After Update', classesList2);

  // 5) Register Teacher (pending) under org
  const { data: teacherReg } = await request({
    method: 'POST',
    path: '/api/auth/teacher/register',
    body: { name: 'Phase1 Teacher', email: teacherEmail, password, orgId },
    expectedStatus: 201,
  });
  log('5) Teacher Registered (pending)', teacherReg);
  const teacherId = teacherReg?.teacher?.id || teacherReg?.teacher?._id;

  // 6) Admin fetch pending teachers
  const { data: pendingTeachers } = await request({
    method: 'GET',
    path: '/api/admin/teachers/pending',
    token: adminAuthToken,
    expectedStatus: 200,
  });
  log('6) Pending Teachers', pendingTeachers);

  // 7) Admin approve teacher with valid class ID
  const { data: approval } = await request({
    method: 'PATCH',
    path: `/api/admin/teachers/${teacherId}/approve`,
    token: adminAuthToken,
    body: { assignedClasses: [classId] },
    expectedStatus: 200,
  });
  log('7) Teacher Approved with Class Assignment', approval);

  // 8) Teacher login
  const { data: teacherLogin } = await request({
    method: 'POST',
    path: '/api/auth/teacher/login',
    body: { email: teacherEmail, password },
    expectedStatus: 200,
  });
  log('8) Teacher Logged In', teacherLogin);
  const teacherToken = teacherLogin.token;

  // 9) Teacher attempts to create class -> should be blocked (403)
  const teacherCreate = await request({
    method: 'POST',
    path: '/api/classes',
    token: teacherToken,
    body: { name: `TeacherClass-${ts}`, subjects: ['Physics'] },
  });
  if (teacherCreate.status !== 403) {
    throw new Error(`Expected teacher create class to be blocked with 403, got ${teacherCreate.status}`);
  }
  log('9) Teacher Create Blocked (expected)', teacherCreate);

  // 10) Teacher attempts to update class -> should be blocked (403)
  const teacherUpdate = await request({
    method: 'PATCH',
    path: `/api/classes/${classId}`,
    token: teacherToken,
    body: { name: `${updatedName}-TeacherEdit` },
  });
  if (teacherUpdate.status !== 403) {
    throw new Error(`Expected teacher update class to be blocked with 403, got ${teacherUpdate.status}`);
  }
  log('10) Teacher Update Blocked (expected)', teacherUpdate);

  console.log('\nPhase 1 class management flow completed successfully');
};

run().catch((err) => {
  console.error('Phase 1 test script failed:', err.message);
  process.exit(1);
});
