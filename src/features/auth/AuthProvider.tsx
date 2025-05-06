import { createContext, useState, useEffect, ReactNode } from 'react';
import { refreshAccessToken, getAccessToken, getRefreshToken } from './AuthService';

interface AuthContextType {
  accessToken: string | null;
  setAccessToken: (token: string | null) => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [accessToken, setAccessToken] = useState<string | null>(getAccessToken());

  useEffect(() => {
    const refreshToken = async () => {
      try {
        if (getRefreshToken()) {
          const newAccessToken = await refreshAccessToken();
          setAccessToken(newAccessToken);
        } else {
          console.warn('No refresh token available');
        }
      } catch (error) {
        console.error('Failed to refresh token:', error);
        setAccessToken(null);
      }
    };

    if (!accessToken) {
      refreshToken();
    }
  }, [accessToken]);

  return (
    <AuthContext.Provider value={{ accessToken, setAccessToken }}>
      {children}
    </AuthContext.Provider>
  );
};
