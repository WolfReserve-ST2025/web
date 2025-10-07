import axios from 'axios';

export const BASE_URL = 'process.env.REACT_APP_API_URL';

const instance = axios.create({
  baseURL: 'process.env.REACT_APP_API_URL/api',
});

instance.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default instance;
