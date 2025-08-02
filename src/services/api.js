const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  // Helper method to get auth headers
  getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` })
    };
  }

  // Generic request method
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: this.getAuthHeaders(),
      ...options
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
      }

      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // Authentication methods
  async login(email, password) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
  }

  async register(userData) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData)
    });
  }

  async getCurrentUser() {
    return this.request('/auth/me');
  }

  async updateProfile(profileData) {
    return this.request('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData)
    });
  }

  async changePassword(currentPassword, newPassword) {
    return this.request('/auth/change-password', {
      method: 'PUT',
      body: JSON.stringify({ currentPassword, newPassword })
    });
  }

  async forgotPassword(email) {
    return this.request('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email })
    });
  }

  async resetPassword(token, newPassword) {
    return this.request('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ token, newPassword })
    });
  }

  // Items methods
  async getItems(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/items?${queryString}`);
  }

  async getItem(id) {
    return this.request(`/items/${id}`);
  }

  async createItem(itemData) {
    return this.request('/items', {
      method: 'POST',
      body: JSON.stringify(itemData)
    });
  }

  async updateItem(id, itemData) {
    return this.request(`/items/${id}`, {
      method: 'PUT',
      body: JSON.stringify(itemData)
    });
  }

  async deleteItem(id) {
    return this.request(`/items/${id}`, {
      method: 'DELETE'
    });
  }

  async resolveItem(id, notes) {
    return this.request(`/items/${id}/resolve`, {
      method: 'PATCH',
      body: JSON.stringify({ notes })
    });
  }

  async getUserItems(userId) {
    return this.request(`/items/user/${userId}`);
  }

  async getOrganizationItems(orgId, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/items/organization/${orgId}?${queryString}`);
  }

  // Users methods (admin only)
  async getUsers(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/users?${queryString}`);
  }

  async getUser(id) {
    return this.request(`/users/${id}`);
  }

  async createUser(userData) {
    return this.request('/users', {
      method: 'POST',
      body: JSON.stringify(userData)
    });
  }

  async updateUser(id, userData) {
    return this.request(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(userData)
    });
  }

  async deleteUser(id) {
    return this.request(`/users/${id}`, {
      method: 'DELETE'
    });
  }

  async updateUserStatus(id, status) {
    return this.request(`/users/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status })
    });
  }

  async getUserStats(id) {
    return this.request(`/users/${id}/stats`);
  }

  async getOrganizationUsers(orgId, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/users/organization/${orgId}?${queryString}`);
  }

  // Organizations methods
  async getOrganizations(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/organizations?${queryString}`);
  }

  async getOrganization(id) {
    return this.request(`/organizations/${id}`);
  }

  async createOrganization(orgData) {
    return this.request('/organizations', {
      method: 'POST',
      body: JSON.stringify(orgData)
    });
  }

  async updateOrganization(id, orgData) {
    return this.request(`/organizations/${id}`, {
      method: 'PUT',
      body: JSON.stringify(orgData)
    });
  }

  async deleteOrganization(id) {
    return this.request(`/organizations/${id}`, {
      method: 'DELETE'
    });
  }

  async getOrganizationStats(id) {
    return this.request(`/organizations/${id}/stats`);
  }

  async getOrganizationByCode(code) {
    return this.request(`/organizations/code/${code}`);
  }

  async updateOrganizationSettings(id, settings) {
    return this.request(`/organizations/${id}/settings`, {
      method: 'PATCH',
      body: JSON.stringify(settings)
    });
  }

  // Invite Codes methods
  async generateInviteCode(inviteData) {
    return this.request('/invite-codes/generate', {
      method: 'POST',
      body: JSON.stringify(inviteData)
    });
  }

  async getInviteCodes(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/invite-codes?${queryString}`);
  }

  async validateInviteCode(code) {
    return this.request('/invite-codes/validate', {
      method: 'POST',
      body: JSON.stringify({ code })
    });
  }

  async useInviteCode(code, userId) {
    return this.request('/invite-codes/use', {
      method: 'POST',
      body: JSON.stringify({ code, userId })
    });
  }

  async deleteInviteCode(id) {
    return this.request(`/invite-codes/${id}`, {
      method: 'DELETE'
    });
  }

  // Reports methods
  async getReports(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/reports?${queryString}`);
  }

  async getReport(id) {
    return this.request(`/reports/${id}`);
  }

  async createReport(reportData) {
    return this.request('/reports', {
      method: 'POST',
      body: JSON.stringify(reportData)
    });
  }

  async updateReport(id, reportData) {
    return this.request(`/reports/${id}`, {
      method: 'PUT',
      body: JSON.stringify(reportData)
    });
  }

  async deleteReport(id) {
    return this.request(`/reports/${id}`, {
      method: 'DELETE'
    });
  }

  async assignReport(id, assignedTo) {
    return this.request(`/reports/${id}/assign`, {
      method: 'PATCH',
      body: JSON.stringify({ assignedTo })
    });
  }

  async resolveReport(id, resolution, actionTaken) {
    return this.request(`/reports/${id}/resolve`, {
      method: 'PATCH',
      body: JSON.stringify({ resolution, actionTaken })
    });
  }

  // Notifications methods
  async getNotifications(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/notifications?${queryString}`);
  }

  async markNotificationAsRead(id) {
    return this.request(`/notifications/${id}/read`, {
      method: 'PATCH'
    });
  }

  async markAllNotificationsAsRead() {
    return this.request('/notifications/read-all', {
      method: 'PATCH'
    });
  }

  async deleteNotification(id) {
    return this.request(`/notifications/${id}`, {
      method: 'DELETE'
    });
  }

  async getUnreadCount() {
    return this.request('/notifications/unread-count');
  }

  async createNotification(notificationData) {
    return this.request('/notifications', {
      method: 'POST',
      body: JSON.stringify(notificationData)
    });
  }

  async createBulkNotifications(notifications) {
    return this.request('/notifications/bulk', {
      method: 'POST',
      body: JSON.stringify({ notifications })
    });
  }

  // File upload helper
  async uploadFile(file) {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${this.baseURL}/upload`, {
      method: 'POST',
      headers: {
        Authorization: this.getAuthHeaders().Authorization
      },
      body: formData
    });

    if (!response.ok) {
      throw new Error('File upload failed');
    }

    return response.json();
  }
}

// Create and export a singleton instance
const apiService = new ApiService();
export default apiService; 