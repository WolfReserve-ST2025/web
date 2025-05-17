import { useEffect, useState } from 'react';
import axios from '../../api/axios';

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
