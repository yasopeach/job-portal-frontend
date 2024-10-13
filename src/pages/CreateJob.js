import React, { useState } from 'react';
import axios from 'axios';
import { Form, Button, Container } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const CreateJob = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    companyName: '',
    location: '',
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

  const handleCreateJob = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const token = localStorage.getItem('token');
    if (!token) {
      setError('İş ilanı oluşturmak için giriş yapmanız gerekiyor.');
      return;
    }

    try {
      const response = await axios.post('https://localhost:7146/api/Job', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      setSuccess("İş ilanı başarıyla oluşturuldu. Yönlendiriliyorsunuz...");
      setTimeout(() => {
        navigate('/jobs'); // İş ilanları listesine yönlendirme
      }, 2000);
    } catch (error) {
      setError('İş ilanı oluşturulurken bir hata oluştu.');
      console.error('İş ilanı oluşturma hatası:', error);
    }
  };

  return (
    <Container className="mt-5">
      <h1 className="text-center">İş İlanı Oluştur</h1>
      <Form onSubmit={handleCreateJob} className="mx-auto" style={{ maxWidth: '400px' }}>
        <Form.Group controlId="formTitle" className="mb-3">
          <Form.Label>İş Başlığı</Form.Label>
          <Form.Control
            type="text"
            name="title"
            placeholder="İş başlığını girin"
            value={formData.title}
            onChange={handleInputChange}
            required
          />
        </Form.Group>

        <Form.Group controlId="formDescription" className="mb-3">
          <Form.Label>Açıklama</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            name="description"
            placeholder="İş açıklamasını girin"
            value={formData.description}
            onChange={handleInputChange}
            required
          />
        </Form.Group>

        <Form.Group controlId="formCompanyName" className="mb-3">
          <Form.Label>Şirket Adı</Form.Label>
          <Form.Control
            type="text"
            name="companyName"
            placeholder="Şirket adını girin"
            value={formData.companyName}
            onChange={handleInputChange}
            required
          />
        </Form.Group>

        <Form.Group controlId="formLocation" className="mb-3">
          <Form.Label>Lokasyon</Form.Label>
          <Form.Control
            type="text"
            name="location"
            placeholder="Lokasyonu girin"
            value={formData.location}
            onChange={handleInputChange}
            required
          />
        </Form.Group>

        <Button variant="primary" type="submit" className="w-100">
          İlanı Oluştur
        </Button>

        {error && <p className="text-danger text-center mt-3">{error}</p>}
        {success && <p className="text-success text-center mt-3">{success}</p>}
      </Form>
    </Container>
  );
};

export default CreateJob;
