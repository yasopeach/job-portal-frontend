import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Card, Button, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    surname: '',
    age: '',
    residence: ''
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Profilinizi görmek için giriş yapmanız gerekiyor.');
        return;
      }
      try {
        const response = await axios.get('https://localhost:7146/api/User/profile', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setProfile(response.data);
        setFormData({
          email: response.data.email,
          role: response.data.role,
          name: response.data.name,
          surname: response.data.surname,
          age: response.data.age,
          residence: response.data.residence
        });
      } catch (error) {
        setError('Profil yüklenirken bir hata oluştu.');
        console.error('Profil hatası:', error);
      }
    };

    fetchProfile();
  }, []);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      await axios.put('https://localhost:7146/api/User/profile', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      setEditMode(false);  // Güncellemeden sonra düzenleme modundan çık
      setProfile({ ...profile, ...formData });
      setError('');
    } catch (error) {
      setError('Profil güncellenirken bir hata oluştu.');
      console.error('Profil güncelleme hatası:', error.response ? error.response.data : error.message);
    }
  };

  if (error) {
    return <p style={{ color: 'red' }}>{error}</p>;
  }

  if (!profile) {
    return <p>Profil yükleniyor...</p>;
  }

  return (
    <Container>
      <h1>Profilim</h1>
      <Card>
        <Card.Body>
          {!editMode ? (
            <>
              <p>Ad: {profile.name}</p>
              <p>Soyad: {profile.surname}</p>
              <p>E-posta: {profile.email}</p>
              <p>Yaş: {profile.age}</p>
              <p>İkamet: {profile.residence}</p>
              <Button variant="primary" onClick={() => setEditMode(true)} className="mr-2">Profili Düzenle</Button>
              <Button variant="warning" onClick={() => navigate('/change-password')}>Şifre Değiştir</Button>
            </>
          ) : (
            <Form onSubmit={handleProfileUpdate}>
              <Form.Group>
                <Form.Label>Ad</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Soyad</Form.Label>
                <Form.Control
                  type="text"
                  name="surname"
                  value={formData.surname}
                  onChange={handleInputChange}
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>E-posta</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Yaş</Form.Label>
                <Form.Control
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleInputChange}
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>İkamet</Form.Label>
                <Form.Control
                  type="text"
                  name="residence"
                  value={formData.residence}
                  onChange={handleInputChange}
                />
              </Form.Group>
              <Button variant="success" type="submit">Güncelle</Button>
              <Button variant="secondary" onClick={() => setEditMode(false)} className="ml-2">İptal</Button>
            </Form>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Profile;
