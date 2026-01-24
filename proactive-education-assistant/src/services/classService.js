/**
 * Class Service
 * Manages classes (admin only: create/update, all roles: read)
 */

import { apiClient } from './apiClient';

export const classService = {
  // Create a new class (admin only)
  async createClass(name, subjects) {
    const response = await apiClient.post('/classes', {
      name,
      subjects,
    });
    return response.class;
  },

  // Get all classes in user's organisation (org-scoped)
  async getClasses() {
    const response = await apiClient.get('/classes');
    return response.classes || [];
  },

  async getClassById(id) {
    const response = await apiClient.get(`/classes/${id}`);
    return response.class;
  },

  // Update a class (admin only)
  async updateClass(classId, updates) {
    const response = await apiClient.patch(`/classes/${classId}`, updates);
    return response.class;
  },

  // Deactivate a class (convenience method)
  async deactivateClass(classId) {
    return this.updateClass(classId, { isActive: false });
  },

  // Activate a class (convenience method)
  async activateClass(classId) {
    return this.updateClass(classId, { isActive: true });
  },
};
