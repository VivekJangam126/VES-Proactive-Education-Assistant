/**
 * Admin Service
 * Admin-only operations (approve teachers, manage org)
 */

import { apiClient } from './apiClient';

export const adminService = {
  // Dashboard stats (admin home)
  async getAdminDashboardStats() {
    const res = await apiClient.get('/admin/dashboard');
    return { success: true, data: res.data };
  },

  // Analytics (risk distribution, trends)
  async getAdminAnalytics() {
    const res = await apiClient.get('/admin/analytics');
    return { success: true, data: res.data };
  },

  // Teachers
  async getPendingTeachers() {
    const res = await apiClient.get('/admin/teachers/pending');
    return res.teachers || [];
  },

  async getTeachers() {
    const res = await apiClient.get('/admin/teachers');
    return { success: true, data: res.teachers || [] };
  },

  async approveTeacher(teacherId, classIds = []) {
    const res = await apiClient.patch(`/admin/teachers/${teacherId}/approve`, {
      assignedClasses: classIds,
    });
    return { success: true, data: res.teacher };
  },

  async rejectTeacher(teacherId) {
    const res = await apiClient.patch(`/admin/teachers/${teacherId}/reject`);
    return { success: true, data: res.teacher };
  },

  async assignClasses(teacherId, classIds = []) {
    const res = await apiClient.patch(`/admin/teachers/${teacherId}/assign-classes`, {
      assignedClasses: classIds,
    });
    return { success: true, data: res.teacher };
  },

  // Classes
  async getClasses() {
    const res = await apiClient.get('/admin/classes');
    return { success: true, data: res.classes || [] };
  },

  async addClass(payload) {
    const res = await apiClient.post('/admin/classes', { name: payload.name, subjects: payload.subjects });
    return { success: true, data: res };
  },

  async updateClass(id, payload) {
    const res = await apiClient.patch(`/admin/classes/${id}`, { name: payload.name, subjects: payload.subjects });
    return { success: true, data: res };
  },

  async deactivateClass(classId) {
    const res = await apiClient.patch(`/admin/classes/${classId}/deactivate`);
    return { success: true, data: res };
  },

  // Students
  async getAllStudents() {
    const res = await apiClient.get('/admin/students');
    return { success: true, data: res.students || [] };
  },

  // Import data (CSV only supported on backend)
  async importData(file, importType) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', importType);
    const res = await apiClient.postFormData('/admin/import', formData);
    return { success: true, data: res.summary };
  },
};
