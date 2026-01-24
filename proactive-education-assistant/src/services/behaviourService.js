/**
 * Behaviour Service
 * Records behaviour events (manual & CSV import)
 */

import { apiClient } from './apiClient';

export const BEHAVIOUR_TYPES = {
  FREQUENT_ABSENCE: 'frequent_absence',
  CLASS_DISENGAGEMENT: 'class_disengagement',
  LATE_SUBMISSION: 'late_submission',
  HOME_ISSUES_REPORTED: 'home_issues_reported',
  DISCIPLINARY_NOTICE: 'disciplinary_notice',
};

export const BEHAVIOUR_LABELS = {
  frequent_absence: 'Frequent Absence',
  class_disengagement: 'Class Disengagement',
  late_submission: 'Late Submission',
  home_issues_reported: 'Home Issues Reported',
  disciplinary_notice: 'Disciplinary Notice',
};

export const behaviourService = {
  // Record a behaviour event for a student
  async recordBehaviour(studentId, classId, type, date) {
    const response = await apiClient.post('/behaviour', {
      studentId,
      classId,
      type,
      date,
    });
    return response.behaviour;
  },

  // Bulk import behaviour from CSV
  // Expected columns: studentId, classId, type, date (YYYY-MM-DD)
  async importBehaviourCSV(file) {
    const formData = new FormData();
    formData.append('file', file);
    const response = await apiClient.postFormData('/behaviour/import', formData);
    return {
      inserted: response.inserted,
      skipped: response.skipped,
      errors: response.errors || [],
    };
  },

  // Get readable label for behaviour type
  getLabel(type) {
    return BEHAVIOUR_LABELS[type] || type;
  },

  // Helper: format date to YYYY-MM-DD
  formatDate(date) {
    if (typeof date === 'string') return date;
    return date.toISOString().split('T')[0];
  },
};
