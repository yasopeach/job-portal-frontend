import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Container } from 'react-bootstrap';
import axios from 'axios';
import { AuthContext } from '../contexts/AuthContext';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await axios.post('https://localhost:7146/api/Auth/login', {
        username,
        password,
      });
      login(response.data.token);
      navigate('/'); // Başarılı giriş sonrası ana sayfaya yönlendir
    } catch (error) {
      setError('Giriş sırasında bir hata oluştu. Kullanıcı adı veya şifre hatalı olabilir.');
    }
  };

  return (
    <Container className="mt-5">
      <h1 className="text-center">Giriş Yap</h1>
      <Form onSubmit={handleLogin} className="mx-auto" style={{ maxWidth: '400px' }}>
        <Form.Group controlId="formUsername" className="mb-3">
          <Form.Label>Kullanıcı Adı</Form.Label>
          <Form.Control
            type="text"
            placeholder="Kullanıcı adınızı girin"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group controlId="formPassword" className="mb-3">
          <Form.Label>Şifre</Form.Label>
          <Form.Control
            type="password"
            placeholder="Şifrenizi girin"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </Form.Group>

        <Button variant="primary" type="submit" className="w-100">
          Giriş Yap
        </Button>

        {error && <p className="text-danger text-center mt-3">{error}</p>}
      </Form>
    </Container>
  );
};

export default Login;
