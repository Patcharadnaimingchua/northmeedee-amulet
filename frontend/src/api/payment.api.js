import api from './axios';

export const paymentApi = {
  uploadSlip: (orderId, formData) =>
    api.post(`/payments/${orderId}/slip`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }),

  getAll: (params) =>
    api.get('/payments', { params }),

  review: (id, payload) =>
    api.put(`/payments/${id}/review`, payload),
};