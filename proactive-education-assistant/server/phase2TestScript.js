import 'dotenv/config';

const BASE_URL = process.env.BASE_URL || 'http://localhost:5000';

const log = (step, data) => {
  console.log(`\n=== ${step} ===`);
  console.dir(data, { depth: null, colors: true });
};

const request = async ({ method = 'GET', path, body, token, expectedStatus, isMultipart = false }) => {
  const url = `${BASE_URL}${path}`;
  const headers = isMultipart ? {} : { 'Content-Type': 'application/json' };
  if (token) headers.Authorization = `Bearer ${token}`;

  const response = await fetch(url, {
    method,
    headers,
    body: isMultipart ? body : body ? JSON.stringify(body) : undefined,
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
  const orgName = `Phase2-Org-${ts}`;
  const adminEmail = `admin+${ts}@test.com`;
  const teacherEmail = `teacher+${ts}@test.com`;
  const password = 'Password123';

  // 0) Bootstrap: Register Org + Admin
  const { data: adminReg } = await request({
    method: 'POST',
    path: '/api/auth/admin/register',
    body: {
      orgName,
      orgType: 'School',
      name: 'Phase2 Admin',
      email: adminEmail,
      password,
    },
    expectedStatus: 201,
  });
  log('0) Admin Registered', adminReg);
  const adminToken = adminReg.token;
  const orgId = adminReg.organisation?._id || adminReg.organisation?.id;

  // 0.1) Admin Login
  const { data: adminLogin } = await request({
    method: 'POST',
    path: '/api/auth/admin/login',
    body: { email: adminEmail, password },
    expectedStatus: 200,
  });
  log('0.1) Admin Logged In', adminLogin);
  const adminAuthToken = adminLogin.token || adminToken;

  // 1) Admin creates a class
  const className = `Class-${ts}`;
  const subjects = ['Math', 'Science'];
  const { data: classCreate } = await request({
    method: 'POST',
    path: '/api/classes',
    token: adminAuthToken,
    body: { name: className, subjects },
    expectedStatus: 201,
  });
  log('1) Class Created', classCreate);
  const classId = classCreate?.class?.id || classCreate?.class?._id;

  // 1.1) Admin creates another class (to test teacher restriction)
  const otherClassName = `OtherClass-${ts}`;
  const { data: otherClassCreate } = await request({
    method: 'POST',
    path: '/api/classes',
    token: adminAuthToken,
    body: { name: otherClassName, subjects: ['English'] },
    expectedStatus: 201,
  });
  log('1.1) Other Class Created', otherClassCreate);
  const otherClassId = otherClassCreate?.class?.id || otherClassCreate?.class?._id;

  // 2) Register Teacher under org
  const { data: teacherReg } = await request({
    method: 'POST',
    path: '/api/auth/teacher/register',
    body: { name: 'Phase2 Teacher', email: teacherEmail, password, orgId },
    expectedStatus: 201,
  });
  log('2) Teacher Registered (pending)', teacherReg);
  const teacherId = teacherReg?.teacher?.id || teacherReg?.teacher?._id;

  // 3) Admin approves teacher with assigned class
  const { data: approval } = await request({
    method: 'PATCH',
    path: `/api/admin/teachers/${teacherId}/approve`,
    token: adminAuthToken,
    body: { assignedClasses: [classId] },
    expectedStatus: 200,
  });
  log('3) Teacher Approved with Assigned Class', approval);

  // 4) Teacher login
  const { data: teacherLogin } = await request({
    method: 'POST',
    path: '/api/auth/teacher/login',
    body: { email: teacherEmail, password },
    expectedStatus: 200,
  });
  log('4) Teacher Logged In', teacherLogin);
  const teacherToken = teacherLogin.token;

  // 5) Admin creates student in class
  const { data: studentAdminCreate } = await request({
    method: 'POST',
    path: '/api/students',
    token: adminAuthToken,
    body: { name: 'Alice Admin', classId },
    expectedStatus: 201,
  });
  log('5) Student Created by Admin', studentAdminCreate);

  // 6) Teacher creates student in assigned class (allowed)
  const { data: studentTeacherCreateOK } = await request({
    method: 'POST',
    path: '/api/students',
    token: teacherToken,
    body: { name: 'Bob Teacher', classId },
    expectedStatus: 201,
  });
  log('6) Student Created by Teacher (Assigned Class)', studentTeacherCreateOK);

  // 7) Teacher attempts to create student in unassigned class (should fail)
  const teacherCreateBad = await request({
    method: 'POST',
    path: '/api/students',
    token: teacherToken,
    body: { name: 'Charlie Teacher', classId: otherClassId },
  });
  if (teacherCreateBad.status !== 403) {
    throw new Error(`Expected teacher create student in unassigned class to be 403, got ${teacherCreateBad.status}`);
  }
  log('7) Teacher Create Blocked for Unassigned Class (expected)', teacherCreateBad);

  // 8) Get students by class
  const { data: studentsList } = await request({
    method: 'GET',
    path: `/api/students?classId=${classId}`,
    token: adminAuthToken,
    expectedStatus: 200,
  });
  log('8) Students Listed by Class', studentsList);

  // 9) CSV import (admin) with valid+invalid rows
  const csvText = [
    'name,className',
    `Diana,${className}`,
    `Evan,${className}`,
    `Frank,UnknownClass-${ts}`,
  ].join('\n');
  const formData = new FormData();
  formData.append('file', new Blob([csvText], { type: 'text/csv' }), 'students.csv');

  const { data: importSummaryAdmin } = await request({
    method: 'POST',
    path: '/api/students/import',
    token: adminAuthToken,
    body: formData,
    isMultipart: true,
    expectedStatus: 200,
  });
  log('9) CSV Import (Admin)', importSummaryAdmin);

  // 10) CSV import (teacher) with a row for unassigned class -> should skip with error
  const csvTextTeacher = [
    'name,className',
    `Gina,${className}`,
    `Hank,${otherClassName}`,
  ].join('\n');
  const formDataTeacher = new FormData();
  formDataTeacher.append('file', new Blob([csvTextTeacher], { type: 'text/csv' }), 'students_teacher.csv');

  const { data: importSummaryTeacher } = await request({
    method: 'POST',
    path: '/api/students/import',
    token: teacherToken,
    body: formDataTeacher,
    isMultipart: true,
    expectedStatus: 200,
  });
  log('10) CSV Import (Teacher with unassigned row)', importSummaryTeacher);

  console.log('\nPhase 2 student management flow completed successfully');
};

run().catch((err) => {
  console.error('Phase 2 test script failed:', err.message);
  process.exit(1);
});
