import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Form, Button, Container } from 'react-bootstrap';

const UpdateJob = () => {
  const { jobId } = useParams(); // URL'den jobId'yi alıyoruz
  const [job, setJob] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`https://localhost:7146/api/Job/${jobId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setJob(response.data);
      } catch (err) {
        console.error('İlan bilgisi yüklenirken bir hata oluştu:', err);
        setError('İlan bilgisi yüklenirken bir hata oluştu.');
      }
    };

    fetchJob();
  }, [jobId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setJob({ ...job, [name]: value });
  };

  const handleUpdateJob = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) {
      alert('İlanı güncellemek için giriş yapmanız gerekiyor.');
      return;
    }

    try {
      await axios.put(`https://localhost:7146/api/Job/${jobId}`, job, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      alert('İlan başarıyla güncellendi.');
      navigate('/EmployerApplications'); // Güncelleme sonrası işveren başvuruları sayfasına yönlendir
    } catch (error) {
      console.error('İlan güncellenirken bir hata oluştu:', error);
      setError('İlan güncellenirken bir hata oluştu.');
    }
  };

  if (!job) {
    return <div>Yükleniyor...</div>;
  }

  return (
    <Container className="mt-4">
      <h2>İlanı Güncelle</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <Form onSubmit={handleUpdateJob}>
        <Form.Group controlId="formTitle" className="mb-3">
          <Form.Label>Başlık</Form.Label>
          <Form.Control
            type="text"
            name="title"
            value={job.title}
            onChange={handleInputChange}
            required
          />
        </Form.Group>

        <Form.Group controlId="formCompanyName" className="mb-3">
          <Form.Label>Şirket Adı</Form.Label>
          <Form.Control
            type="text"
            name="companyName"
            value={job.companyName}
            onChange={handleInputChange}
            required
          />
        </Form.Group>

        <Form.Group controlId="formLocation" className="mb-3">
          <Form.Label>Lokasyon</Form.Label>
          <Form.Control
            type="text"
            name="location"
            value={job.location}
            onChange={handleInputChange}
            required
          />
        </Form.Group>

        <Form.Group controlId="formDescription" className="mb-3">
          <Form.Label>Açıklama</Form.Label>
          <Form.Control
            as="textarea"
            name="description"
            value={job.description}
            onChange={handleInputChange}
            rows={3}
            required
          />
        </Form.Group>

        <Button variant="primary" type="submit">
          Güncelle
        </Button>
      </Form>
    </Container>
  );
};

export default UpdateJob;
