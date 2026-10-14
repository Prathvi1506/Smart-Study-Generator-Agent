import React, { createContext, useContext, useState, useEffect } from 'react';

export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  studyGoal?: string;
  subjects?: string[];
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null, token: null, isAuthenticated: false, isLoading: false,
  login: async () => {}, register: async () => {}, logout: () => {},
});

const API = import.meta.env.VITE_API_URL || '';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem('auth');
    if (saved) {
      try {
        const { user: u, token: t } = JSON.parse(saved);
        setUser(u);
        setToken(t);
      } catch {
        localStorage.removeItem('auth');
      }
    }
    setIsLoading(false);
  }, []);

  const persist = (u: User, t: string) => {
    setUser(u);
    setToken(t);
    localStorage.setItem('auth', JSON.stringify({ user: u, token: t }));
  };

  const login = async (email: string, password: string) => {
    const res = await fetch(`${API}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: 'Login failed' }));
      throw new Error(err.detail || 'Login failed');
    }
    const data = await res.json();
    persist(data.user, data.token);
  };

  const register = async (name: string, email: string, password: string) => {
    const res = await fetch(`${API}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: 'Registration failed' }));
      throw new Error(err.detail || 'Registration failed');
    }
    const data = await res.json();
    persist(data.user, data.token);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('auth');
  };

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated: !!user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
