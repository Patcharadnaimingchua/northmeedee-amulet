import api from './axios';

export const orderApi = {
  checkout: (data) => api.post('/orders/checkout', data),
  getMyOrders: () => api.get('/orders/my'),
  getOne: (id) => api.get(`/orders/${id}`),
  cancel: (id) => api.post(`/orders/${id}/cancel`),
  getAll: (params) => api.get('/orders', { params }),
  updateStatus: (id, status) =>
    api.put(`/orders/${id}/status`, { status }),
};
