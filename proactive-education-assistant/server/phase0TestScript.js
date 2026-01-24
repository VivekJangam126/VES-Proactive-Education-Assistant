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
  const orgName = `Phase0-Org-${ts}`;
  const adminEmail = `admin+${ts}@test.com`;
  const teacherEmail = `teacher+${ts}@test.com`;
  const password = 'Password123';

  // 1) Register Admin
  const { data: adminReg } = await request({
    method: 'POST',
    path: '/api/auth/admin/register',
    body: {
      orgName,
      orgType: 'School',
      name: 'Test Admin',
      email: adminEmail,
      password,
    },
    expectedStatus: 201,
  });
  log('1) Admin Registered', adminReg);

  const adminToken = adminReg.token;
  const orgId = adminReg.organisation?._id || adminReg.organisation?.id;

  // 2) Login Admin
  const { data: adminLogin } = await request({
    method: 'POST',
    path: '/api/auth/admin/login',
    body: { email: adminEmail, password },
    expectedStatus: 200,
  });
  log('2) Admin Logged In', adminLogin);
  const adminAuthToken = adminLogin.token || adminToken;

  // 3) Fetch Organisations
  const { data: orgs } = await request({ method: 'GET', path: '/api/organisations', expectedStatus: 200 });
  log('3) Organisations', orgs);

  // 4) Register Teacher (under org)
  const { data: teacherReg } = await request({
    method: 'POST',
    path: '/api/auth/teacher/register',
    body: { name: 'Test Teacher', email: teacherEmail, password, orgId },
    expectedStatus: 201,
  });
  log('4) Teacher Registered (pending)', teacherReg);

  // 5) Teacher login should fail (pending)
  const pendingLogin = await request({
    method: 'POST',
    path: '/api/auth/teacher/login',
    body: { email: teacherEmail, password },
  });
  if (pendingLogin.status !== 403) {
    throw new Error(`Expected teacher login to be blocked with 403, got ${pendingLogin.status}`);
  }
  log('5) Teacher Login Blocked (expected)', pendingLogin);

  // 6) Admin fetch pending teachers
  const { data: pendingTeachers } = await request({
    method: 'GET',
    path: '/api/admin/teachers/pending',
    token: adminAuthToken,
    expectedStatus: 200,
  });
  log('6) Pending Teachers', pendingTeachers);

  const teacherId = teacherReg?.teacher?.id || teacherReg?.teacher?._id || pendingTeachers?.teachers?.[0]?._id;

  // 7) Admin approve teacher with dummy class IDs
  const dummyClasses = ['000000000000000000000001'];
  const { data: approval } = await request({
    method: 'PATCH',
    path: `/api/admin/teachers/${teacherId}/approve`,
    token: adminAuthToken,
    body: { assignedClasses: dummyClasses },
    expectedStatus: 200,
  });
  log('7) Teacher Approved', approval);

  // 8) Teacher login should succeed
  const { data: teacherLogin } = await request({
    method: 'POST',
    path: '/api/auth/teacher/login',
    body: { email: teacherEmail, password },
    expectedStatus: 200,
  });
  log('8) Teacher Logged In', teacherLogin);

  console.log('\nPhase 0 flow completed successfully');
};

run().catch((err) => {
  console.error('Phase 0 test script failed:', err.message);
  process.exit(1);
});
