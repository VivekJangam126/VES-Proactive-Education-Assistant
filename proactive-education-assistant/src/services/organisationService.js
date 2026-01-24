/**
 * Organisation Service
 * Fetches available organisations (for teacher registration)
 */

import { apiClient } from './apiClient';

export const organisationService = {
  // Get all organisations (for teacher registration dropdown)
  async getOrganisations() {
    const response = await apiClient.get('/organisations');
    return response.organisations || [];
  },
};
