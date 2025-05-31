import axios from '../../api/axios';
import { indexedDBService } from '../../utils/indexDB';

export const login = async (data: { email: string; password: string }) => {
  try {
    const response = await axios.post('/auth/login', data);

    // Store both accessToken and refreshToken in localStorage
    localStorage.setItem('accessToken', response.data.accessToken);
    localStorage.setItem('refreshToken', response.data.refreshToken);

    // NEW: Also save to IndexedDB for service worker access
    await indexedDBService.saveAuthToken(response.data.accessToken);

    return response;
  } catch (error) {
    throw error;
  }
};

export const register = (data: { name: string; surname: string; email: string; password: string; role: string }) =>
  axios.post('/auth/register', data);

export const getRefreshToken = () => localStorage.getItem('refreshToken');

export const refreshAccessToken = async () => {
  const refreshToken = getRefreshToken();

  if (!refreshToken) {
    throw new Error('No refresh token found in localStorage');
  }

  const response = await axios.post('/auth/refresh-token', { refreshToken });

  // Update the accessToken in localStorage
  localStorage.setItem('accessToken', response.data.accessToken);

  return response.data.accessToken;
};

export const getAccessToken = () => localStorage.getItem('accessToken');