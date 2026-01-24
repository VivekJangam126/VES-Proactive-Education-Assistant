// clean-add-students.js
// Script to remove duplicate students and add 20 clean students to every class assigned to teacher@aissms.org.in

import axios from 'axios';

const API_URL = 'http://localhost:5000/api';
const email = 'teacher@asissms.org.in';
const password = '123456';

async function main() {
  // 1. Login as teacher
  const loginRes = await axios.post(`${API_URL}/auth/teacher/login`, { email, password });
  const { token, teacher } = loginRes.data;
  if (!teacher.assignedClasses || teacher.assignedClasses.length === 0) {
    throw new Error('No assigned classes for this teacher!');
  }
  console.log('Teacher assigned classes:', teacher.assignedClasses);

  // 2. Remove duplicate students (by name+classId or by _id)
  const allStudents = [];
  for (const classId of teacher.assignedClasses) {
    const res = await axios.get(`${API_URL}/students?classId=${classId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    allStudents.push(...(res.data.students || []));
  }
  // Find duplicates by name+classId
  const seen = new Set();
  const duplicates = [];
  for (const s of allStudents) {
    const key = `${s.name.toLowerCase()}-${s.classId}`;
    if (seen.has(key)) {
      duplicates.push(s);
    } else {
      seen.add(key);
    }
  }
  // Delete duplicates
  for (const dup of duplicates) {
    try {
      await axios.delete(`${API_URL}/students/${dup._id || dup.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log('Deleted duplicate student:', dup.name, dup._id || dup.id);
    } catch (err) {
      console.warn('Failed to delete:', dup.name, err.response?.data || err.message);
    }
  }

  // 3. Add 20 clean students to each class
  for (const classId of teacher.assignedClasses) {
    for (let i = 1; i <= 20; i++) {
      const studentName = `Student_${classId.slice(-4)}_${i}`;
      try {
        await axios.post(`${API_URL}/students`, {
          name: studentName,
          classId,
        }, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log(`Added ${studentName} to class ${classId}`);
      } catch (err) {
        console.warn(`Failed to add ${studentName}:`, err.response?.data || err.message);
      }
    }
  }
  console.log('Done!');
}

main().catch(err => {
  console.error('Script failed:', err);
  process.exit(1);
});
