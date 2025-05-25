import axios from 'axios';

export const BASE_URL = 'http://localhost:5000';

const instance = axios.create({
  baseURL: 'http://localhost:5000/api',
});

instance.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default instance;
