import 'dotenv/config';

const BASE_URL = process.env.BASE_URL || 'http://localhost:5000';

const log = (step, data) => {
  console.log(`\n=== ${step} ===`);
  if (data !== undefined) {
    console.dir(data, { depth: null, colors: true });
  }
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
  const twoWeeksAgo = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  const oneMonthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  const orgName = `Phase4-Org-${ts}`;
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
      name: 'Phase4 Admin',
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

  // 1) Create class
  const className = `Class-${ts}`;
  const { data: classCreate } = await request({
    method: 'POST',
    path: '/api/classes',
    token: adminAuthToken,
    body: { name: className, subjects: ['Math', 'Science', 'English'] },
    expectedStatus: 201,
  });
  const classId = classCreate?.class?.id || classCreate?.class?._id;
  log('1) Class Created', classCreate);

  // 2) Create 3 students: LOW-risk, MEDIUM-risk, HIGH-risk
  const studentNames = ['Good Student', 'Average Student', 'At-Risk Student'];
  const studentIds = [];

  for (const name of studentNames) {
    const { data: studentCreate } = await request({
      method: 'POST',
      path: '/api/students',
      token: adminAuthToken,
      body: { name, classId },
      expectedStatus: 201,
    });
    const id = studentCreate?.student?.id || studentCreate?.student?._id;
    studentIds.push(id);
    log(`2) Student Created: ${name}`, studentCreate);
  }

  const lowRiskStudentId = studentIds[0];
  const mediumRiskStudentId = studentIds[1];
  const highRiskStudentId = studentIds[2];

  // 3) Register and approve teacher
  const { data: teacherReg } = await request({
    method: 'POST',
    path: '/api/auth/teacher/register',
    body: { name: 'Phase4 Teacher', email: teacherEmail, password, orgId },
    expectedStatus: 201,
  });
  const teacherId = teacherReg?.teacher?.id || teacherReg?.teacher?._id;

  const { data: teacherApproval } = await request({
    method: 'PATCH',
    path: `/api/admin/teachers/${teacherId}/approve`,
    token: adminAuthToken,
    body: { assignedClasses: [classId] },
    expectedStatus: 200,
  });
  log('3) Teacher Approved', teacherApproval);

  const { data: teacherLogin } = await request({
    method: 'POST',
    path: '/api/auth/teacher/login',
    body: { email: teacherEmail, password },
    expectedStatus: 200,
  });
  const teacherToken = teacherLogin.token;

  // 4) LOW-RISK STUDENT: Good attendance, good marks, no behaviour issues
  // 28 attendance records, 26 present (92%)
  for (let i = 0; i < 26; i++) {
    const date = new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    await request({
      method: 'POST',
      path: '/api/attendance',
      token: adminAuthToken,
      body: { studentId: lowRiskStudentId, classId, date, status: 'PRESENT' },
      expectedStatus: 201,
    });
  }
  for (let i = 0; i < 2; i++) {
    const date = new Date(Date.now() - (26 + i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    await request({
      method: 'POST',
      path: '/api/attendance',
      token: adminAuthToken,
      body: { studentId: lowRiskStudentId, classId, date, status: 'ABSENT' },
      expectedStatus: 201,
    });
  }
  log('4) LOW-RISK: Attendance recorded (26 present, 2 absent)');

  // Marks for low-risk: all above 70
  for (const subject of ['Math', 'Science', 'English']) {
    await request({
      method: 'POST',
      path: '/api/marks',
      token: adminAuthToken,
      body: { studentId: lowRiskStudentId, classId, subject, score: 75, date: today },
      expectedStatus: 201,
    });
  }
  log('4.1) LOW-RISK: Marks recorded (75 each)');

  // 5) MEDIUM-RISK STUDENT: Fair attendance, borderline marks, 1-2 behaviour issues
  // 20 attendance records, 14 present (70%)
  for (let i = 0; i < 14; i++) {
    const date = new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    await request({
      method: 'POST',
      path: '/api/attendance',
      token: adminAuthToken,
      body: { studentId: mediumRiskStudentId, classId, date, status: 'PRESENT' },
      expectedStatus: 201,
    });
  }
  for (let i = 0; i < 6; i++) {
    const date = new Date(Date.now() - (14 + i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    await request({
      method: 'POST',
      path: '/api/attendance',
      token: adminAuthToken,
      body: { studentId: mediumRiskStudentId, classId, date, status: 'ABSENT' },
      expectedStatus: 201,
    });
  }
  log('5) MEDIUM-RISK: Attendance recorded (14 present, 6 absent = 70%)');

  // Marks for medium-risk: around 50-60 (low)
  for (const subject of ['Math', 'Science', 'English']) {
    await request({
      method: 'POST',
      path: '/api/marks',
      token: adminAuthToken,
      body: { studentId: mediumRiskStudentId, classId, subject, score: 52, date: today },
      expectedStatus: 201,
    });
  }
  log('5.1) MEDIUM-RISK: Marks recorded (52 each)');

  // Behaviour: 1 disengagement + 1 late submission
  await request({
    method: 'POST',
    path: '/api/behaviour',
    token: adminAuthToken,
    body: { studentId: mediumRiskStudentId, classId, type: 'class_disengagement', date: today },
    expectedStatus: 201,
  });
  await request({
    method: 'POST',
    path: '/api/behaviour',
    token: adminAuthToken,
    body: { studentId: mediumRiskStudentId, classId, type: 'late_submission', date: today },
    expectedStatus: 201,
  });
  log('5.2) MEDIUM-RISK: Behaviour recorded (disengagement + late_submission)');

  // 6) HIGH-RISK STUDENT: Poor attendance, very low marks, multiple behaviour issues
  // 12 attendance records, 4 present (33%)
  for (let i = 0; i < 4; i++) {
    const date = new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    await request({
      method: 'POST',
      path: '/api/attendance',
      token: adminAuthToken,
      body: { studentId: highRiskStudentId, classId, date, status: 'PRESENT' },
      expectedStatus: 201,
    });
  }
  for (let i = 0; i < 8; i++) {
    const date = new Date(Date.now() - (4 + i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    await request({
      method: 'POST',
      path: '/api/attendance',
      token: adminAuthToken,
      body: { studentId: highRiskStudentId, classId, date, status: 'ABSENT' },
      expectedStatus: 201,
    });
  }
  log('6) HIGH-RISK: Attendance recorded (4 present, 8 absent = 33%)');

  // Marks for high-risk: very low (30-35)
  for (const subject of ['Math', 'Science', 'English']) {
    await request({
      method: 'POST',
      path: '/api/marks',
      token: adminAuthToken,
      body: { studentId: highRiskStudentId, classId, subject, score: 32, date: today },
      expectedStatus: 201,
    });
  }
  log('6.1) HIGH-RISK: Marks recorded (32 each)');

  // Behaviour: multiple issues
  const behaviourTypes = ['frequent_absence', 'class_disengagement', 'home_issues_reported', 'disciplinary_notice'];
  for (const type of behaviourTypes) {
    await request({
      method: 'POST',
      path: '/api/behaviour',
      token: adminAuthToken,
      body: { studentId: highRiskStudentId, classId, type, date: today },
      expectedStatus: 201,
    });
  }
  log('6.2) HIGH-RISK: Behaviour recorded (4 different behaviour events)');

  // 7) COMPUTE RISKS
  log('\n7) COMPUTING RISKS...\n');

  const { data: lowRisk } = await request({
    method: 'GET',
    path: `/api/risk/${lowRiskStudentId}`,
    token: adminAuthToken,
    expectedStatus: 200,
  });
  log('7a) LOW-RISK Student Risk Result', lowRisk);

  const { data: mediumRisk } = await request({
    method: 'GET',
    path: `/api/risk/${mediumRiskStudentId}`,
    token: adminAuthToken,
    expectedStatus: 200,
  });
  log('7b) MEDIUM-RISK Student Risk Result', mediumRisk);

  const { data: highRisk } = await request({
    method: 'GET',
    path: `/api/risk/${highRiskStudentId}`,
    token: adminAuthToken,
    expectedStatus: 200,
  });
  log('7c) HIGH-RISK Student Risk Result', highRisk);

  // 8) Get class-level risk summary
  const { data: classRisk } = await request({
    method: 'GET',
    path: `/api/risk?classId=${classId}`,
    token: adminAuthToken,
    expectedStatus: 200,
  });
  log('8) Class-Level Risk Summary', classRisk);

  // 9) Verify risk levels are correct
  if (lowRisk.risk.riskLevel !== 'LOW') {
    throw new Error(`Expected LOW-RISK student to have LOW risk level, got ${lowRisk.risk.riskLevel}`);
  }
  if (mediumRisk.risk.riskLevel !== 'MEDIUM' && mediumRisk.risk.riskLevel !== 'LOW') {
    throw new Error(`Expected MEDIUM-RISK student to have MEDIUM or LOW risk level, got ${mediumRisk.risk.riskLevel}`);
  }
  if (highRisk.risk.riskLevel !== 'HIGH') {
    throw new Error(`Expected HIGH-RISK student to have HIGH risk level, got ${highRisk.risk.riskLevel}`);
  }

  log('9) Risk Level Validation PASSED', {
    low: lowRisk.risk.riskLevel,
    medium: mediumRisk.risk.riskLevel,
    high: highRisk.risk.riskLevel,
  });

  console.log('\nPhase 4 explainable risk engine flow completed successfully');
};

run().catch((err) => {
  console.error('Phase 4 test script failed:', err.message);
  process.exit(1);
});
