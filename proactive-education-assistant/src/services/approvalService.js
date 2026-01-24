// Approval Service - Calls admin API for approval flows
import { apiClient } from './apiClient';

export const approvalService = {
  // Approve a teacher
  async approveTeacher(teacherId, assignedClassIds = []) {
    const res = await apiClient.patch(`/admin/teachers/${teacherId}/approve`, {
      assignedClasses: assignedClassIds,
    });
    return { success: true, data: res.teacher };
  },

  // Reject a teacher
  async rejectTeacher(teacherId) {
    const res = await apiClient.patch(`/admin/teachers/${teacherId}/reject`);
    return { success: true, data: res.teacher };
  },

  // Assign classes to a teacher
  async assignClasses(teacherId, classIds = []) {
    const res = await apiClient.patch(`/admin/teachers/${teacherId}/assign-classes`, {
      assignedClasses: classIds,
    });
    return { success: true, data: res.teacher };
  },
};
