/**
 * Risk Service
 * Fetches explainable risk assessments for students
 */

import { apiClient } from './apiClient';

export const RISK_LEVELS = {
  LOW: 'LOW',
  MEDIUM: 'MEDIUM',
  HIGH: 'HIGH',
};

export const RISK_COLORS = {
  LOW: '#10b981', // Green
  MEDIUM: '#f59e0b', // Amber
  HIGH: '#ef4444', // Red
};

export const riskService = {
  // Get risk assessment for a single student
  // Returns: { student, risk: { riskLevel, score, explanation, factors, metrics } }
  async getStudentRisk(studentId) {
    const response = await apiClient.get(`/risk/${studentId}`);
    return response;
  },

  // Get risk summary for all students in a class
  // Returns: { class, risks: [], summary: { total, high, medium, low } }
  async getClassRisk(classId) {
    const response = await apiClient.get(`/risk?classId=${classId}`);
    return response;
  },

  // Get color for risk level (for UI badges)
  getColor(riskLevel) {
    return RISK_COLORS[riskLevel] || '#6b7280'; // Gray fallback
  },

  // Get readable label for risk level
  getLabel(riskLevel) {
    return riskLevel || 'UNKNOWN';
  },

  // Sort students by risk level (HIGH first)
  sortByRisk(students) {
    const riskOrder = { HIGH: 0, MEDIUM: 1, LOW: 2 };
    return [...students].sort((a, b) => {
      const orderA = riskOrder[a.risk?.riskLevel] ?? 999;
      const orderB = riskOrder[b.risk?.riskLevel] ?? 999;
      return orderA - orderB;
    });
  },

  // Filter students by risk level
  filterByRiskLevel(students, level) {
    return students.filter((s) => s.risk?.riskLevel === level);
  },
};
