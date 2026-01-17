import api from './axios'

// ============ AUTH API ============
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  googleLogin: () => window.location.href = '/api/auth/google',
  logout: () => api.post('/auth/logout'),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (data) => api.put('/auth/profile', data),
  changePassword: (data) => api.put('/auth/change-password', data),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  resetPassword: (token, password) => api.post('/auth/reset-password', { token, password })
}

// ============ PRODUCTS API ============
export const productsAPI = {
  getAll: (params) => api.get('/products', { params }),
  getById: (id) => api.get(`/products/${id}`),
  getByCategory: (categoryId, params) => api.get(`/products/category/${categoryId}`, { params }),
  search: (query) => api.get('/products/search', { params: { q: query } }),
  getFeatured: () => api.get('/products/featured'),
  getOnSale: () => api.get('/products/on-sale')
}

// ============ PETS API ============
export const petsAPI = {
  getAll: (params) => api.get('/pets', { params }),
  getById: (id) => api.get(`/pets/${id}`),
  getByType: (type, params) => api.get(`/pets/type/${type}`, { params }),
  search: (query) => api.get('/pets/search', { params: { q: query } }),
  getFeatured: () => api.get('/pets/featured')
}

// ============ CATEGORIES API ============
export const categoriesAPI = {
  getAll: () => api.get('/categories'),
  getById: (id) => api.get(`/categories/${id}`)
}

// ============ CART API ============
export const cartAPI = {
  getCart: () => api.get('/cart'),
  addItem: (productId, quantity) => api.post('/cart/add', { productId, quantity }),
  updateItem: (itemId, quantity) => api.put(`/cart/item/${itemId}`, { quantity }),
  removeItem: (itemId) => api.delete(`/cart/item/${itemId}`),
  clearCart: () => api.delete('/cart/clear'),
  applyCoupon: (code) => api.post('/cart/coupon', { code })
}

// ============ ORDERS API ============
export const ordersAPI = {
  getAll: () => api.get('/orders'),
  getById: (id) => api.get(`/orders/${id}`),
  create: (orderData) => api.post('/orders', orderData),
  cancel: (id) => api.put(`/orders/${id}/cancel`)
}

// ============ REVIEWS API ============
export const reviewsAPI = {
  getByProduct: (productId) => api.get(`/reviews/product/${productId}`),
  getByPet: (petId) => api.get(`/reviews/pet/${petId}`),
  create: (reviewData) => api.post('/reviews', reviewData),
  update: (id, reviewData) => api.put(`/reviews/${id}`, reviewData),
  delete: (id) => api.delete(`/reviews/${id}`)
}

// ============ VOUCHER API ============
export const voucherAPI = {
  validate: (code) => api.post('/vouchers/validate', { code }),
  getAll: () => api.get('/vouchers'),
  create: (voucherData) => api.post('/vouchers', voucherData),
  update: (id, voucherData) => api.put(`/vouchers/${id}`, voucherData),
  delete: (id) => api.delete(`/vouchers/${id}`)
}

export default api
