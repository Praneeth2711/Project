import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('hostelhub_token') || null);
  const [loading, setLoading] = useState(true);

  // Initialize auth state
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('hostelhub_token');
      if (storedToken) {
        try {
          const res = await api.get('/auth/me');
          if (res.data.success) {
            setUser(res.data.user);
          } else {
            logout();
          }
        } catch (err) {
          console.error('Failed to restore session:', err);
          logout();
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const loginStudent = async (email, password) => {
    const res = await api.post('/auth/student/login', { email, password });
    if (res.data.success) {
      setToken(res.data.token);
      setUser(res.data.user);
      localStorage.setItem('hostelhub_token', res.data.token);
      localStorage.setItem('hostelhub_role', 'student');
      return res.data;
    }
  };

  const registerStudent = async (formData) => {
    const res = await api.post('/auth/student/register', formData);
    if (res.data.success) {
      setToken(res.data.token);
      setUser(res.data.user);
      localStorage.setItem('hostelhub_token', res.data.token);
      localStorage.setItem('hostelhub_role', 'student');
      return res.data;
    }
  };

  const loginOwner = async (email, password) => {
    const res = await api.post('/auth/owner/login', { email, password });
    if (res.data.success) {
      setToken(res.data.token);
      setUser(res.data.user);
      localStorage.setItem('hostelhub_token', res.data.token);
      localStorage.setItem('hostelhub_role', 'owner');
      return res.data;
    }
  };

  const registerOwner = async (formData) => {
    const res = await api.post('/auth/owner/register', formData);
    if (res.data.success) {
      setToken(res.data.token);
      setUser(res.data.user);
      localStorage.setItem('hostelhub_token', res.data.token);
      localStorage.setItem('hostelhub_role', 'owner');
      return res.data;
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('hostelhub_token');
    localStorage.removeItem('hostelhub_role');
  };

  const refreshUser = async () => {
    try {
      const res = await api.get('/auth/me');
      if (res.data.success) {
        setUser(res.data.user);
      }
    } catch (err) {
      console.error('Error refreshing user:', err);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        role: user?.role || localStorage.getItem('hostelhub_role'),
        isAuthenticated: !!token && !!user,
        loading,
        loginStudent,
        registerStudent,
        loginOwner,
        registerOwner,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
