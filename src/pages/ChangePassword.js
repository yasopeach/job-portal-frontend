import React, { useState } from 'react';
import axios from 'axios';
import { Container, Form, Button } from 'react-bootstrap';

const ChangePassword = () => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setError('Yeni şifreler uyuşmuyor.');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        'https://localhost:7146/api/User/change-password',
        { OldPassword: oldPassword, NewPassword: newPassword },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      setSuccess(response.data);
      setError('');
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      setError('Şifre değiştirilirken bir hata oluştu. Eski şifrenizi kontrol edin.');
      console.error('Şifre değiştirme hatası:', error);
    }
  };

  return (
    <Container className="mt-4">
      <h2>Şifre Değiştir</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
      <Form onSubmit={handleChangePassword}>
        <Form.Group>
          <Form.Label>Eski Şifre</Form.Label>
          <Form.Control
            type="password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Yeni Şifre</Form.Label>
          <Form.Control
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Yeni Şifre (Tekrar)</Form.Label>
          <Form.Control
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </Form.Group>
        <Button variant="primary" type="submit">Şifre Değiştir</Button>
      </Form>
    </Container>
  );
};

export default ChangePassword;
