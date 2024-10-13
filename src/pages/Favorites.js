import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Container, Card, Row, Col, Button } from 'react-bootstrap';

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchFavorites = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Favori iş ilanlarını görebilmek için giriş yapmanız gerekiyor.');
        return;
      }

      try {
        const response = await axios.get('https://localhost:7146/api/Job/favorites', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setFavorites(response.data);
      } catch (err) {
        setError('Favori iş ilanları yüklenirken bir hata oluştu.');
        console.error('Favori hata:', err);
      }
    };

    fetchFavorites();
  }, []);

  const handleRemoveFavorite = async (jobId) => {
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`https://localhost:7146/api/Job/${jobId}/favorite`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setFavorites(favorites.filter((fav) => fav.id !== jobId));
    } catch (error) {
      console.error('Favorilerden kaldırma hatası:', error);
    }
  };

  if (error) {
    return <p style={{ color: 'red' }}>{error}</p>;
  }

  return (
    <Container>
      <h1>Favori İş İlanlarım</h1>
      <Row>
        {favorites.map((job) => (
          <Col key={job.id} md={4}>
            <Card style={{ marginBottom: '20px' }}>
              <Card.Body>
                <Card.Title>{job.title}</Card.Title>
                <Card.Text>Şirket: {job.companyName}</Card.Text>
                <Card.Text>Lokasyon: {job.location}</Card.Text>
                <Link to={`/jobs/${job.id}`}>
                  <Button variant="primary">İlana Git</Button>
                </Link>
                <Button 
                  variant="danger" 
                  style={{ marginLeft: '10px' }} 
                  onClick={() => handleRemoveFavorite(job.id)}
                >
                  Favorilerden Kaldır
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default Favorites;
