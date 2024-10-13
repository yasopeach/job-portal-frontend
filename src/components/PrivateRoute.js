import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ element }) => {
  const token = localStorage.getItem('token'); // Token'ı localStorage'den alıyoruz

  return token ? element : <Navigate to="/login" />;
};

export default PrivateRoute;
