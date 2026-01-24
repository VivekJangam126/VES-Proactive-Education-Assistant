/**
 * Authentication Service
 * Handles login, registration, token management
 */

import { apiClient } from './apiClient';

export const authService = {
  // Admin registration (creates organisation + admin)
  async adminRegister(orgName, orgType, name, email, password) {
    const response = await apiClient.post('/auth/admin/register', {
      orgName,
      orgType,
      name,
      email,
      password,
    });

    // Normalize response to { token, user }
    return {
      token: response.token,
      user: {
        id: response.admin.id,
        name: response.admin.name,
        email: response.admin.email,
        role: response.admin.role,
        orgId: response.admin.orgId,
      },
      organisation: response.organisation,
    };
  },

  // Admin login
  async adminLogin(email, password) {
    const response = await apiClient.post('/auth/admin/login', { email, password });

    return {
      token: response.token,
      user: {
        id: response.admin.id,
        name: response.admin.name,
        email: response.admin.email,
        role: response.admin.role,
        orgId: response.admin.orgId,
      },
    };
  },

  // Teacher registration (select organisation, start as PENDING)
  async teacherRegister(name, email, password, orgId) {
    const response = await apiClient.post('/auth/teacher/register', {
      name,
      email,
      password,
      orgId,
    });
    return response;
  },

  // Teacher login (blocked if not APPROVED)
  async teacherLogin(email, password) {
    const response = await apiClient.post('/auth/teacher/login', { email, password });

    return {
      token: response.token,
      user: {
        id: response.teacher.id,
        name: response.teacher.name,
        email: response.teacher.email,
        role: response.teacher.role,
        orgId: response.teacher.orgId,
        status: response.teacher.status,
        assignedClasses: response.teacher.assignedClasses || [],
        subjects: response.teacher.subjects || [],
      },
    };
  },

  // Get current user from localStorage
  getCurrentUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  // Get auth token
  getToken() {
    return localStorage.getItem('token') || localStorage.getItem('authToken');
  },

  // Check if user is authenticated
  isAuthenticated() {
    return !!this.getToken();
  },

  // Logout
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    localStorage.removeItem('role');
  },

  // Check if user is admin
  isAdmin() {
    const user = this.getCurrentUser();
    return user?.role === 'ADMIN';
  },

  // Check if user is teacher
  isTeacher() {
    const user = this.getCurrentUser();
    return user?.role === 'TEACHER';
  },
};
