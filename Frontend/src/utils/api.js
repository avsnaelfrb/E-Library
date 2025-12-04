import axios from 'axios';
const api = axios.create({ baseURL: import.meta.env.VITE_API_BASE || process.env.REACT_APP_API_BASE });
api.interceptors.request.use(cfg => {
  const token = localStorage.getItem('token');
  if (token) cfg.headers.Authorization = `Bearer ${token}`;
  return cfg;
});
export default api;
