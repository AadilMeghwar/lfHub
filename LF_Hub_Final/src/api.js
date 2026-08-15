const API_BASE = '/api';

async function request(path, options = {}) {
  const token = localStorage.getItem('lfhub_token');
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {})
    }
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || 'Request failed');
  return data;
}
export const api = {
  register: (body) => request('/auth/register', {method:'POST', body:JSON.stringify(body)}),
  login: (body) => request('/auth/login', {method:'POST', body:JSON.stringify(body)}),
  me: () => request('/auth/me'),
  reports: (params='') => request(`/reports${params ? `?${params}` : ''}`),
  createReport: (body) => request('/reports', {method:'POST', body:JSON.stringify(body)}),
  updateReport: (id, body) => request(`/reports/${id}`, {method:'PUT', body:JSON.stringify(body)}),
  deleteReport: (id) => request(`/reports/${id}`, {method:'DELETE'}),
  resolveReport: (id) => request(`/reports/${id}/resolve`, {method:'PATCH'}),
  dashboard: () => request('/dashboard'),
  notifications: () => request('/notifications'),
  markNotification: (id) => request(`/notifications/${id}/read`, {method:'PATCH'}),
  markAllNotifications: () => request('/notifications/read-all', {method:'PATCH'}),
  profile: () => request('/profile'),
  updateProfile: (body) => request('/profile', {method:'PUT', body:JSON.stringify(body)}),
};
