import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check for saved user on mount
    const savedUser = localStorage.getItem('dayflow_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    // Mock login logic
    setLoading(true);
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (email === 'admin@dayflow.com') {
          const adminUser = { id: 1, name: 'John Doe', email, role: 'admin' };
          setUser(adminUser);
          localStorage.setItem('dayflow_user', JSON.stringify(adminUser));
          setLoading(false);
          resolve(adminUser);
        } else if (email === 'employee@dayflow.com') {
          const empUser = { id: 2, name: 'Sarah Johnson', email, role: 'employee' };
          setUser(empUser);
          localStorage.setItem('dayflow_user', JSON.stringify(empUser));
          setLoading(false);
          resolve(empUser);
        } else {
          setLoading(false);
          reject(new Error('Invalid credentials'));
        }
      }, 800);
    });
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('dayflow_user');
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
