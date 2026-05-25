import axios from 'axios';

const api = axios.create({
  baseURL: 'https://calm-reflection.up.railway.app/api',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const getProducts = () => api.get('/products');
export const getProduct = (id) => api.get(`/products/${id}`);
export const login = (data) => api.post('/auth/login', data);
export const register = (data) => api.post('/auth/register', data);

export default api;