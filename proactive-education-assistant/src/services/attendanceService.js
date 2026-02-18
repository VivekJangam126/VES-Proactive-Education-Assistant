/**
 * Attendance Service
 * Records daily attendance (manual & CSV import)
 */

import { apiClient } from './apiClient';

export const attendanceService = {
  // Record attendance for a student on a date
  async recordAttendance(studentId, classId, date, status) {
    const response = await apiClient.post('/attendance', {
      studentId,
      classId,
      date,
      status,
    });
    return response.attendance;
  },

  // Bulk import attendance from CSV
  // Expected columns: studentId, classId, date (YYYY-MM-DD), status (PRESENT/ABSENT)
  async importAttendanceCSV(file) {
    const formData = new FormData();
    formData.append('file', file);
    const response = await apiClient.postFormData('/attendance/import', formData);
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
