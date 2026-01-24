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
  const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
  const orgName = `Phase3-Org-${ts}`;
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
      name: 'Phase3 Admin',
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
  const adminAuthToken = adminLogin.token || adminToken;
  log('0.1) Admin Logged In', { token: adminAuthToken.substring(0, 20) + '...' });

  // 1) Admin creates a class with subjects
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

  // 2) Create two students in class
  const { data: student1Create } = await request({
    method: 'POST',
    path: '/api/students',
    token: adminAuthToken,
    body: { name: 'Alice', classId },
    expectedStatus: 201,
  });
  const student1Id = student1Create?.student?.id || student1Create?.student?._id;
  log('2) Student 1 Created (Alice)', student1Create);

  const { data: student2Create } = await request({
    method: 'POST',
    path: '/api/students',
    token: adminAuthToken,
    body: { name: 'Bob', classId },
    expectedStatus: 201,
  });
  const student2Id = student2Create?.student?.id || student2Create?.student?._id;
  log('2.1) Student 2 Created (Bob)', student2Create);

  // 3) Register and approve teacher
  const { data: teacherReg } = await request({
    method: 'POST',
    path: '/api/auth/teacher/register',
    body: { name: 'Phase3 Teacher', email: teacherEmail, password, orgId },
    expectedStatus: 201,
  });
  const teacherId = teacherReg?.teacher?.id || teacherReg?.teacher?._id;
  log('3) Teacher Registered', teacherReg);

  const { data: teacherApproval } = await request({
    method: 'PATCH',
    path: `/api/admin/teachers/${teacherId}/approve`,
    token: adminAuthToken,
    body: { assignedClasses: [classId] },
    expectedStatus: 200,
  });
  log('3.1) Teacher Approved', teacherApproval);

  const { data: teacherLogin } = await request({
    method: 'POST',
    path: '/api/auth/teacher/login',
    body: { email: teacherEmail, password },
    expectedStatus: 200,
  });
  const teacherToken = teacherLogin.token;
  log('3.2) Teacher Logged In', { token: teacherToken.substring(0, 20) + '...' });

  // ===== ATTENDANCE TESTS =====

  // 4) Admin creates attendance entry
  const { data: attendanceCreate } = await request({
    method: 'POST',
    path: '/api/attendance',
    token: adminAuthToken,
    body: { studentId: student1Id, classId, date: today, status: 'PRESENT' },
    expectedStatus: 201,
  });
  log('4) Attendance Created (Admin)', attendanceCreate);

  // 5) Teacher creates attendance entry for assigned class
  const { data: teacherAttendance } = await request({
    method: 'POST',
    path: '/api/attendance',
    token: teacherToken,
    body: { studentId: student2Id, classId, date: today, status: 'ABSENT' },
    expectedStatus: 201,
  });
  log('5) Attendance Created (Teacher)', teacherAttendance);

  // 6) CSV attendance import (mixed valid/duplicate rows)
  const attendanceCSV = [
    'studentId,classId,date,status',
    `${student1Id},${classId},${today},PRESENT`, // Duplicate of step 4
    `${student2Id},${classId},${today},ABSENT`, // Duplicate of step 5
  ].join('\n');
  const formDataAttendance = new FormData();
  formDataAttendance.append('file', new Blob([attendanceCSV], { type: 'text/csv' }), 'attendance.csv');

  const { data: attendanceImport } = await request({
    method: 'POST',
    path: '/api/attendance/import',
    token: adminAuthToken,
    body: formDataAttendance,
    isMultipart: true,
    expectedStatus: 200,
  });
  log('6) Attendance CSV Import (Admin)', attendanceImport);

  // ===== MARKS TESTS =====

  // 7) Admin creates marks entry
  const { data: marksCreate } = await request({
    method: 'POST',
    path: '/api/marks',
    token: adminAuthToken,
    body: { studentId: student1Id, classId, subject: 'Math', score: 85, date: today },
    expectedStatus: 201,
  });
  log('7) Marks Created (Admin)', marksCreate);

  // 8) Teacher creates marks for assigned class
  const { data: teacherMarks } = await request({
    method: 'POST',
    path: '/api/marks',
    token: teacherToken,
    body: { studentId: student2Id, classId, subject: 'Science', score: 92, date: today },
    expectedStatus: 201,
  });
  log('8) Marks Created (Teacher)', teacherMarks);

  // 9) Attempt to create marks for invalid subject (should fail)
  const invalidSubjectMarks = await request({
    method: 'POST',
    path: '/api/marks',
    token: adminAuthToken,
    body: { studentId: student1Id, classId, subject: 'Physics', score: 75, date: today },
  });
  if (invalidSubjectMarks.status !== 400) {
    throw new Error(`Expected invalid subject to be 400, got ${invalidSubjectMarks.status}`);
  }
  log('9) Invalid Subject Blocked (expected)', invalidSubjectMarks);

  // 10) Attempt to create marks with score out of range (should fail)
  const invalidScoreMarks = await request({
    method: 'POST',
    path: '/api/marks',
    token: adminAuthToken,
    body: { studentId: student1Id, classId, subject: 'Math', score: 150, date: today },
  });
  if (invalidScoreMarks.status !== 400) {
    throw new Error(`Expected invalid score to be 400, got ${invalidScoreMarks.status}`);
  }
  log('10) Invalid Score Blocked (expected)', invalidScoreMarks);

  // 11) CSV marks import (valid + invalid subject + invalid score rows)
  const marksCSV = [
    'studentId,classId,subject,score,date',
    `${student1Id},${classId},Math,88,${today}`,
    `${student2Id},${classId},Science,95,${today}`,
    `${student1Id},${classId},InvalidSubject,80,${today}`, // Invalid subject
    `${student2Id},${classId},English,120,${today}`, // Invalid score
  ].join('\n');
  const formDataMarks = new FormData();
  formDataMarks.append('file', new Blob([marksCSV], { type: 'text/csv' }), 'marks.csv');

  const { data: marksImport } = await request({
    method: 'POST',
    path: '/api/marks/import',
    token: adminAuthToken,
    body: formDataMarks,
    isMultipart: true,
    expectedStatus: 200,
  });
  log('11) Marks CSV Import (Admin with mixed valid/invalid)', marksImport);

  console.log('\nPhase 3 attendance & marks flow completed successfully');
};

run().catch((err) => {
  console.error('Phase 3 test script failed:', err.message);
  process.exit(1);
});
