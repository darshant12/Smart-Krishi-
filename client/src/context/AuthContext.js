import { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext(null);
const STORAGE_KEY = 'smartkrishiAuth';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;
    try {
      const parsed = JSON.parse(stored);
      return parsed.user || null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;
    try {
      const parsed = JSON.parse(stored);
      return parsed.token || null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (user && token) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ user, token }));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [user, token]);

  const login = (authData) => {
    if (!authData?.token) {
      throw new Error('Login failed: missing authorization token');
    }
    setUser(authData.user);
    setToken(authData.token);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated: Boolean(user && token), login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
