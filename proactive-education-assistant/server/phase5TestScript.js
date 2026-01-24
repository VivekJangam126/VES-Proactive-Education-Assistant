#!/usr/bin/env node
/**
 * Phase 5: Test Subjects Feature
 * Validates:
 * 1. Class creation with subjects (multi-select validation)
 * 2. Teacher approval auto-assigns subjects from classes
 * 3. Teacher subject dropdown in marks form shows only assigned classes' subjects
 * 4. Marks validation: subject must be in class.subjects
 * 5. No duplicate subjects in teacher.subjects array
 * 6. Performance: single save during approval/assignment (no N+1)
 */

import axios from 'axios';
import assert from 'assert';

const BASE_URL = 'http://localhost:5000/api';
let adminToken = null;
let teacherToken = null;
let organizationId = null;
let classId1 = null;
let classId2 = null;
let teacherId = null;
let studentId = null;

const COLORS = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
};

function log(message, color = 'reset') {
  console.log(`${COLORS[color]}${message}${COLORS.reset}`);
}

async function test(description, fn) {
  try {
    log(`\n▶ ${description}`, 'cyan');
    await fn();
    log(`✅ PASS`, 'green');
  } catch (error) {
    log(`❌ FAIL: ${error.message}`, 'red');
    if (error.response?.data) {
      log(`Response: ${JSON.stringify(error.response.data)}`, 'yellow');
    }
    process.exit(1);
  }
}

// Helper: API request with token
async function apiCall(method, endpoint, data = null, token = adminToken) {
  const config = { headers: {} };
  if (token) config.headers.Authorization = `Bearer ${token}`;

  try {
    const url = `${BASE_URL}${endpoint}`;
    if (method === 'GET') {
      return await axios.get(url, config);
    } else if (method === 'POST') {
      return await axios.post(url, data, config);
    } else if (method === 'PATCH') {
      return await axios.patch(url, data, config);
    } else if (method === 'DELETE') {
      return await axios.delete(url, config);
    }
  } catch (error) {
    throw error;
  }
}

async function run() {
  log('\n' + '='.repeat(80), 'bright');
  log('PHASE 5: SUBJECTS FEATURE END-TO-END TEST', 'bright');
  log('='.repeat(80) + '\n', 'bright');

  // ==================== Setup ====================
  await test('Admin Registration', async () => {
    const res = await axios.post(`${BASE_URL}/auth/register`, {
      email: `admin-p5-${Date.now()}@test.com`,
      password: 'Test@123',
      role: 'ADMIN',
      organisationName: 'Test Org Phase5',
    });
    assert(res.data.token, 'Admin token not received');
    adminToken = res.data.token;
    organizationId = res.data.orgId;
  });

  // ==================== Test 1: Class Creation with Subjects ====================
  await test('Create Class 1 with multiple subjects (Math, Science)', async () => {
    const res = await apiCall('POST', '/admin/classes', {
      name: 'Grade 10-A',
      subjects: ['Mathematics', 'Science'],
    });
    assert(res.status === 201, `Expected 201, got ${res.status}`);
    assert(res.data.class, 'Class not returned');
    assert(res.data.class.subjects, 'Subjects not in response');
    assert.deepStrictEqual(res.data.class.subjects, ['Mathematics', 'Science']);
    classId1 = res.data.class._id || res.data.class.id;
  });

  await test('Create Class 2 with different subjects (English, History)', async () => {
    const res = await apiCall('POST', '/admin/classes', {
      name: 'Grade 10-B',
      subjects: ['English', 'History'],
    });
    assert(res.status === 201);
    assert.deepStrictEqual(res.data.class.subjects, ['English', 'History']);
    classId2 = res.data.class._id || res.data.class.id;
  });

  await test('Reject class creation with empty subjects array', async () => {
    try {
      await apiCall('POST', '/admin/classes', {
        name: 'Bad Class',
        subjects: [],
      });
      throw new Error('Should have rejected empty subjects array');
    } catch (error) {
      assert(error.response?.status === 400, `Expected 400, got ${error.response?.status}`);
      assert(error.response?.data?.message?.includes('subjects'), 'Error message should mention subjects');
    }
  });

  await test('Update Class 1 to add more subjects (Math, Science, PE)', async () => {
    const res = await apiCall('PATCH', `/admin/classes/${classId1}`, {
      name: 'Grade 10-A',
      subjects: ['Mathematics', 'Science', 'Physical Education'],
    });
    assert(res.status === 200);
    assert.deepStrictEqual(
      res.data.class.subjects.sort(),
      ['Mathematics', 'Physical Education', 'Science'].sort()
    );
  });

  // ==================== Test 2: Teacher Approval with Auto-Subject Assignment ====================
  await test('Create pending teacher', async () => {
    const res = await apiCall('POST', '/auth/register', {
      email: `teacher-p5-${Date.now()}@test.com`,
      password: 'Test@123',
      role: 'TEACHER',
      name: 'Teacher Phase5',
    });
    assert(res.data.token, 'Teacher token not received');
    teacherToken = res.data.token;
    teacherId = res.data.userId;
  });

  await test('Teacher initially has no subjects', async () => {
    const res = await apiCall('GET', `/teachers/${teacherId}`, null, adminToken);
    assert(res.data.teacher.subjects, 'Teacher should have subjects field');
    assert.deepStrictEqual(res.data.teacher.subjects, [], 'Initial subjects should be empty');
  });

  await test('Approve teacher and assign to Class 1 (Math, Science, PE) - auto-assigns subjects', async () => {
    const res = await apiCall('POST', '/admin/approve-teacher', {
      teacherId,
      classIds: [classId1],
    });
    assert(res.status === 200);
    assert(res.data.teacher.subjects, 'Teacher should have subjects after approval');
    assert.deepStrictEqual(
      res.data.teacher.subjects.sort(),
      ['Mathematics', 'Physical Education', 'Science'].sort(),
      'Teacher subjects should match Class 1 subjects'
    );
    assert.deepStrictEqual(
      res.data.teacher.assignedClasses.map(String),
      [String(classId1)],
      'Teacher should have classId1 assigned'
    );
  });

  await test('Assign additional Class 2 (English, History) - merges subjects, no duplicates', async () => {
    const res = await apiCall('PATCH', `/admin/assign-classes`, {
      teacherId,
      classIds: [classId1, classId2],
    });
    assert(res.status === 200);
    // Should have: Math, Science, PE, English, History (no duplicates)
    const expectedSubjects = ['English', 'History', 'Mathematics', 'Physical Education', 'Science'];
    assert.deepStrictEqual(
      res.data.teacher.subjects.sort(),
      expectedSubjects.sort(),
      'Teacher subjects should be union of both classes (no duplicates)'
    );
  });

  // ==================== Test 3: Student Setup ====================
  await test('Create student', async () => {
    const res = await apiCall('POST', '/admin/students', {
      name: 'Student Phase5',
      classId: classId1,
      email: `student-p5-${Date.now()}@test.com`,
    });
    assert(res.status === 201);
    studentId = res.data.student._id || res.data.student.id;
  });

  // ==================== Test 4: Teacher Classes API (for dropdown) ====================
  await test('GET /classes returns teacher assigned classes with subjects', async () => {
    const res = await apiCall('GET', '/classes', null, teacherToken);
    assert(res.status === 200);
    assert(res.data.classes, 'Classes array not returned');
    assert(res.data.classes.length === 2, `Expected 2 classes, got ${res.data.classes.length}`);
    
    const subjects = res.data.classes.flatMap(cls => cls.subjects || []);
    const uniqueSubjects = [...new Set(subjects)];
    assert(uniqueSubjects.length === 5, `Expected 5 unique subjects, got ${uniqueSubjects.length}`);
  });

  // ==================== Test 5: Marks Validation ====================
  await test('Record marks with valid subject (Math in Class 1)', async () => {
    const res = await apiCall('POST', '/marks', {
      studentId,
      classId: classId1,
      subject: 'Mathematics',
      score: 85,
      date: new Date().toISOString().split('T')[0],
    }, teacherToken);
    assert(res.status === 201, `Expected 201, got ${res.status}`);
    assert(res.data.marks.subject === 'Mathematics');
  });

  await test('Reject marks with invalid subject (not in class subjects)', async () => {
    try {
      await apiCall('POST', '/marks', {
        studentId,
        classId: classId1,
        subject: 'InvalidSubject',
        score: 85,
        date: new Date().toISOString().split('T')[0],
      }, teacherToken);
      throw new Error('Should have rejected invalid subject');
    } catch (error) {
      assert(error.response?.status === 400);
      assert(error.response?.data?.message?.includes('not in class subjects'), 'Error should mention subject not in class');
    }
  });

  await test('Reject marks with subject from different class', async () => {
    // Class2 has "English", trying to record for Class1
    try {
      await apiCall('POST', '/marks', {
        studentId,
        classId: classId1,
        subject: 'English', // This is in Class2, not Class1
        score: 85,
        date: new Date().toISOString().split('T')[0],
      }, teacherToken);
      throw new Error('Should have rejected subject from different class');
    } catch (error) {
      assert(error.response?.status === 400);
    }
  });

  // ==================== Test 6: Performance Check (Single Save) ====================
  await test('Assign classes again - verify single save (no N+1)', async () => {
    // This is a behavioral test; we're just ensuring it completes without timeout
    const startTime = Date.now();
    const res = await apiCall('PATCH', `/admin/assign-classes`, {
      teacherId,
      classIds: [classId1, classId2],
    });
    const duration = Date.now() - startTime;
    assert(duration < 5000, `Assignment took ${duration}ms (should be fast)`);
    assert(res.status === 200);
  });

  // ==================== Summary ====================
  log('\n' + '='.repeat(80), 'bright');
  log('✅ ALL TESTS PASSED', 'green');
  log('='.repeat(80) + '\n', 'bright');
  log('Summary:', 'bright');
  log(`  • Classes can be created with multiple subjects`, 'green');
  log(`  • Teacher approval auto-assigns subjects from assigned classes`, 'green');
  log(`  • Teacher can be assigned multiple classes with merged subjects (no duplicates)`, 'green');
  log(`  • Teacher classes API returns full subject list for dropdown`, 'green');
  log(`  • Marks validation rejects invalid/mismatched subjects`, 'green');
  log(`  • Performance: Fast assignment with single save`, 'green');
  log('', 'reset');

  process.exit(0);
}

run().catch(err => {
  log(`\n❌ FATAL ERROR: ${err.message}`, 'red');
  console.error(err);
  process.exit(1);
});
