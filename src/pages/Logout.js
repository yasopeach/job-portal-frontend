import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.removeItem('token'); // Token'ı temizliyoruz
    navigate('/login'); // Kullanıcıyı login sayfasına yönlendiriyoruz
  }, [navigate]);

  return <div>Çıkış yapılıyor...</div>;
};

export default Logout;
