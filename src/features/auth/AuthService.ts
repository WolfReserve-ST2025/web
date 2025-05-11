import axios from '../../api/axios';

export const login = (data: { email: string; password: string }) => {
  return axios.post('/auth/login', data).then((response) => {

    // Store both accessToken and refreshToken in localStorage
    localStorage.setItem('accessToken', response.data.accessToken);
    localStorage.setItem('refreshToken', response.data.refreshToken);

    return response;
  });
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