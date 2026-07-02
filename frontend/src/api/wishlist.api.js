import api from './axios';

export const wishlistApi = {
  getAll: () => api.get('/wishlist'),
  add: (productId) => api.post('/wishlist', { productId }),
  remove: (id) => api.delete(`/wishlist/${id}`),
};
