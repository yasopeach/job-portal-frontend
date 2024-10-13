import React, { useState } from 'react';
import axios from 'axios';
import { Form, Button, Container } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: '',
    name: '',
    surname: '',
    role: 'Employee', // Varsayılan olarak Employee rolü
    residence: '', // Yeni eklenen İkamet alanı
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const response = await axios.post('https://localhost:7146/api/Auth/register', formData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      setSuccess("Kayıt başarılı. Yönlendiriliyorsunuz...");
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (error) {
      if (error.response?.data) {
        // Eğer response.data bir nesne ise ve 'errors' alanı varsa, bu alanı kullanıcıya göster
        if (typeof error.response.data === 'object' && error.response.data.errors) {
          const validationErrors = error.response.data.errors;
          const errorMessages = Object.values(validationErrors).flat().join(' ');
          setError(errorMessages);
        } else {
          // Diğer durumlarda string olarak göster
          setError(typeof error.response.data === 'string' ? error.response.data : JSON.stringify(error.response.data));
        }
      } else {
        setError('Kayıt sırasında bir hata oluştu.');
      }
    }
  };

  return (
    <Container className="mt-5">
      <h1 className="text-center">Kayıt Ol</h1>
      <Form onSubmit={handleRegister} className="mx-auto" style={{ maxWidth: '400px' }}>
        <Form.Group controlId="formUsername" className="mb-3">
          <Form.Label>Kullanıcı Adı</Form.Label>
          <Form.Control
            type="text"
            name="username"
            placeholder="Kullanıcı adınızı girin"
            value={formData.username}
            onChange={handleInputChange}
            required
          />
        </Form.Group>

        <Form.Group controlId="formPassword" className="mb-3">
          <Form.Label>Şifre</Form.Label>
          <Form.Control
            type="password"
            name="password"
            placeholder="Şifrenizi girin"
            value={formData.password}
            onChange={handleInputChange}
            required
          />
        </Form.Group>

        <Form.Group controlId="formEmail" className="mb-3">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            name="email"
            placeholder="Email adresinizi girin"
            value={formData.email}
            onChange={handleInputChange}
            required
          />
        </Form.Group>

        <Form.Group controlId="formName" className="mb-3">
          <Form.Label>Ad</Form.Label>
          <Form.Control
            type="text"
            name="name"
            placeholder="Adınızı girin"
            value={formData.name}
            onChange={handleInputChange}
            required
          />
        </Form.Group>

        <Form.Group controlId="formSurname" className="mb-3">
          <Form.Label>Soyad</Form.Label>
          <Form.Control
            type="text"
            name="surname"
            placeholder="Soyadınızı girin"
            value={formData.surname}
            onChange={handleInputChange}
            required
          />
        </Form.Group>

        <Form.Group controlId="formResidence" className="mb-3">
          <Form.Label>İkamet</Form.Label>
          <Form.Control
            type="text"
            name="residence"
            placeholder="İkamet yerinizi girin"
            value={formData.residence}
            onChange={handleInputChange}
            required
          />
        </Form.Group>

        <Form.Group controlId="formRole" className="mb-3">
          <Form.Label>Rol</Form.Label>
          <Form.Control as="select" name="role" value={formData.role} onChange={handleInputChange} required>
            <option value="Employee">Çalışan (Employee)</option>
            <option value="Employer">İşveren (Employer)</option>
          </Form.Control>
        </Form.Group>

        <Button variant="primary" type="submit" className="w-100">
          Kayıt Ol
        </Button>

        {error && <p className="text-danger text-center mt-3">{error}</p>}
        {success && <p className="text-success text-center mt-3">{success}</p>}
      </Form>
    </Container>
  );
};

export default Register;
