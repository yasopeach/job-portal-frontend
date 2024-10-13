import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
      // Kullanıcı rolünü almak için API çağrısı yapıyoruz
      axios.get('https://localhost:7146/api/User/profile', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then(response => {
          setUserRole(response.data.role);
        })
        .catch(error => {
          console.error('Kullanıcı rolü yüklenirken bir hata oluştu:', error);
        });
    }
  }, []);

  const login = async (token) => {
    localStorage.setItem('token', token);
    setIsAuthenticated(true);
    try {
      const response = await axios.get('https://localhost:7146/api/User/profile', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUserRole(response.data.role);
    } catch (error) {
      console.error('Kullanıcı rolü yüklenirken bir hata oluştu:', error);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    setUserRole('');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, userRole, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
