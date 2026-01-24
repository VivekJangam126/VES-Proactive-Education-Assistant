/**
 * Student Service
 * Manages students (create, list, import CSV)
 * Real data only - all from backend API
 */

import { apiClient } from './apiClient';

export const studentService = {
  // Get all students in a class (org-scoped, teacher-visible only assigned classes)
  async getStudents(classId) {
    const response = await apiClient.get(`/students?classId=${classId}`);
    return response.students || [];
  },

  // Get a single student by ID
  async getStudentById(id) {
    const response = await apiClient.get(`/students/${id}`);
    return response.student;
  },

  // Create a new student (teacher for assigned classes, admin for any)
  async createStudent(payload) {
    const response = await apiClient.post('/students', {
      name: payload.name,
      classId: payload.classId,
    });
    return response.student;
  },

  // Import students from CSV
  // Expected CSV columns: name, classId (order independent)
  async importStudentsCSV(formDataObj) {
    const response = await apiClient.postFormData('/students/import', formDataObj);
    return {
      inserted: response.inserted,
      skipped: response.skipped,
      errors: response.errors || [],
    };
  },
};
