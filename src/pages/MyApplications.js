import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, Container, Row, Col, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const MyApplications = () => {
  const [applications, setApplications] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchApplications = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Başvurularınızı görebilmek için giriş yapmanız gerekiyor.');
        return;
      }

      try {
        const response = await axios.get('https://localhost:7146/api/User/applications', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setApplications(response.data);
      } catch (err) {
        setError('Başvurularınız yüklenirken bir hata oluştu.');
        console.error('Başvuru hatası:', err);
      }
    };

    fetchApplications();
  }, []);

  const handleGoToJob = (jobId) => {
    navigate(`/jobs/${jobId}`); // İş ilanı detayına yönlendir
  };

  if (error) {
    return <p style={{ color: 'red' }}>{error}</p>;
  }

  return (
    <Container>
      <h1>Başvurularım</h1>
      <Row>
        {applications.map((app) => (
          <Col key={app.id} md={4}>
            <Card style={{ marginBottom: '20px' }}>
              <Card.Body>
                <Card.Title>{app.jobTitle}</Card.Title> {/* İş ilanı başlığı */}
                <Card.Text>Başvuran: {app.applicantUsername}</Card.Text> {/* Başvuran kullanıcı */}
                <Card.Text>Başvuru Durumu: {app.status}</Card.Text>
                <Card.Text>Başvuru Tarihi: {new Date(app.createdAt).toLocaleDateString()}</Card.Text> {/* Başvuru tarihi */}
                <Button onClick={() => handleGoToJob(app.jobId)} variant="primary">
                  İlana Git
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default MyApplications;
