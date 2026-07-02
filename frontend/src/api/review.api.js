import api from './axios';

export const reviewApi = {
  getByProduct: (productId) =>
    api.get(`/reviews/product/${productId}`),
  create: (data) => api.post('/reviews', data),
  remove: (id) => api.delete(`/reviews/${id}`),
};
