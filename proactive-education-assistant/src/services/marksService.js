/**
 * Marks Service
 * Records subject-wise marks (manual & CSV import)
 * Ensures subjects come from assigned classes only
 */

import { apiClient } from './apiClient';

export const marksService = {
  // Record marks for a student in a subject on a date
  async recordMarks(studentId, classId, subject, score, date) {
    const response = await apiClient.post('/marks', {
      studentId,
      classId,
      subject,
      score,
      date,
    });
    return response.marks;
  },

  // Fetch teacher's assigned classes with their subjects
  async getTeacherClassesWithSubjects() {
    // Teacher gets their classes from their profile
    // This is derived from teacher.assignedClasses and class.subjects
    const response = await apiClient.get('/classes');
    return response.classes || [];
  },

  // Bulk import marks from CSV
  // Expected columns: studentId, classId, subject, score (0-100), date (YYYY-MM-DD)
  async importMarksCSV(file) {
    const formData = new FormData();
    formData.append('file', file);
    const response = await apiClient.postFormData('/marks/import', formData);
    return {
      inserted: response.inserted,
      skipped: response.skipped,
      errors: response.errors || [],
    };
  },

  // Helper: format date to YYYY-MM-DD
  formatDate(date) {
    if (typeof date === 'string') return date;
    return date.toISOString().split('T')[0];
  },
};
