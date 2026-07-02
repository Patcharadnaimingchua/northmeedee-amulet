import api from './axios';

export const adminApi = {
  dashboard: () => api.get('/admin/dashboard'),
};
