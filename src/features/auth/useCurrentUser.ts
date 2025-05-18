import { useEffect, useState } from 'react';
import axios from '../../api/axios';

export function getUserFromToken(): { id?: string; role?: string } | null {
  const token = localStorage.getItem('accessToken');
  if (!token) return null;
  try {

    const payload = JSON.parse(atob(token.split('.')[1]));

    const id = payload.sub || payload._id;
    const role = payload.role;
    return { id, role };
  } catch {
    return null;
  }
}

export interface User {
  _id: string;
  name: string;
  surname: string;
  email: string;
  role: string;
}

export function useCurrentUser() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(false);

  useEffect(() => {
    setLoading(true);
    axios.get('/users/me')
      .then(res => {
        setUser(res.data);
        setAuthError(false);
      })
      .catch(err => {
        if (err.response?.status === 401) setAuthError(true);
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  return { user, loading, authError, setUser };
}