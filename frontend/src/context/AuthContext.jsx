import { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../api/auth.api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      const token = localStorage.getItem('accessToken');

      if (token) {
        try {
          const { data } = await authApi.me();

          setUser(data.data);

          localStorage.setItem(
            'user',
            JSON.stringify(data.data)
          );
        } catch {
          logout();
        }
      }

      setLoading(false);
    };

    init();
  }, []);

  const login = async (email, password) => {
    const { data } = await authApi.login({
      email,
      password,
    });

    localStorage.setItem(
      'accessToken',
      data.data.accessToken
    );

    localStorage.setItem(
      'refreshToken',
      data.data.refreshToken
    );

    localStorage.setItem(
      'user',
      JSON.stringify(data.data.user)
    );

    setUser(data.data.user);

    return data.data.user;
  };

  const register = async (payload) => {
    await authApi.register(payload);
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } catch (err) {}

    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');

    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'ADMIN',
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
