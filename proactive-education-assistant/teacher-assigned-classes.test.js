// teacher-assigned-classes.test.js
// Script to test teacher login and verify assigned classes

import axios from 'axios';

const API_URL = 'http://localhost:5000/api';
const email = 'teacher@asissms.org.in';
const password = '123456';

async function loginAndCheckAssignedClasses() {
  try {
    // Login as teacher
    const loginRes = await axios.post(`${API_URL}/auth/teacher/login`, { email, password });
    const { token, teacher } = loginRes.data;
    console.log('Login successful:', teacher.name, teacher.id);
    if (!teacher.assignedClasses || !Array.isArray(teacher.assignedClasses)) {
      throw new Error('assignedClasses not present in teacher object!');
    }
    if (teacher.assignedClasses.length === 0) {
      console.warn('No assigned classes for this teacher.');
    } else {
      console.log('Assigned Classes:', teacher.assignedClasses);
    }
    // Optionally, fetch class details
    const classRes = await axios.get(`${API_URL}/classes`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const allClasses = classRes.data.classes;
    const assigned = allClasses.filter(cls => teacher.assignedClasses.includes(cls.id || cls._id));
    console.log('Full class details for assigned:', assigned);
    // Test pass/fail output
    if (teacher.assignedClasses.length > 0 && assigned.length === 0) {
      throw new Error('assignedClasses present but no matching classes found!');
    }
    console.log('Test passed: assignedClasses are present and valid.');
  } catch (err) {
    if (err.response) {
      console.error('API Error:', err.response.data);
    } else {
      console.error('Test failed:', err.message);
    }
    process.exit(1);
  }
}

loginAndCheckAssignedClasses();
