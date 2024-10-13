import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Button, Form, Card, Container, Spinner } from 'react-bootstrap';

const JobDetails = () => {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [error, setError] = useState('');
  const [isFavorite, setIsFavorite] = useState(false);
  const [currentUser, setCurrentUser] = useState('');
  const [currentUserRole, setCurrentUserRole] = useState('');
  const [cvFile, setCvFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false); // Bekleme durumu için state

  useEffect(() => {
    // İş detaylarını, favori durumu ve yorumları çekiyoruz
    const fetchJobDetails = async () => {
      try {
        const response = await axios.get(`https://localhost:7146/api/Job/${id}`);
        setJob(response.data);
      } catch (error) {
        console.error('İş ilanı detayları yüklenirken bir hata oluştu:', error);
      }
    };

    const fetchComments = async () => {
      try {
        const response = await axios.get(`https://localhost:7146/api/Job/${id}/comments`);
        setComments(response.data);
      } catch (error) {
        console.error('Yorumları yüklerken bir hata oluştu:', error);
        setError('Yorumlar yüklenirken bir hata oluştu.');
      }
    };

    const checkIfFavorite = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        const response = await axios.get('https://localhost:7146/api/User/favorites', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const favoriteJobs = response.data.map((favJob) => favJob.id);
        setIsFavorite(favoriteJobs.includes(parseInt(id)));
      } catch (error) {
        console.error('Favori durumunu kontrol ederken bir hata oluştu:', error);
      }
    };

    const fetchUserProfile = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        const response = await axios.get('https://localhost:7146/api/User/profile', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setCurrentUser(response.data.username);
        setCurrentUserRole(response.data.role);
      } catch (error) {
        console.error('Kullanıcı bilgileri yüklenirken bir hata oluştu:', error);
      }
    };

    fetchJobDetails();
    fetchComments();
    checkIfFavorite();
    fetchUserProfile();
  }, [id]);

  const handleCommentSubmit = async (event) => {
    event.preventDefault();

    const token = localStorage.getItem('token');
    if (!token) {
      setError('Yorum yapmak için giriş yapmanız gerekiyor.');
      return;
    }

    try {
      const response = await axios.post(
        `https://localhost:7146/api/Job/${id}/comment`,
        `"${newComment}"`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      // Backend'den dönen yeni yorumu tüm bilgileriyle birlikte alıp state'e ekliyoruz
      const addedComment = response.data;
      setComments([...comments, addedComment]);
      setNewComment('');
      setError('');
    } catch (error) {
      setError('Yorum eklenirken bir hata oluştu.');
      console.error('Yorum ekleme hatası:', error);
    }
  };

  const toggleFavorite = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Favorilere eklemek için giriş yapmanız gerekiyor.');
      return;
    }

    try {
      if (isFavorite) {
        await axios.delete(`https://localhost:7146/api/Job/${id}/favorite`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setIsFavorite(false);
      } else {
        await axios.post(`https://localhost:7146/api/Job/${id}/favorite`, {}, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setIsFavorite(true);
      }
    } catch (error) {
      console.error('Favori durumu güncellenirken bir hata oluştu:', error);
      setError('Favori durumu güncellenirken bir hata oluştu.');
    }
  };

  const deleteComment = async (commentId) => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Yorum silmek için giriş yapmanız gerekiyor.');
      return;
    }

    try {
      await axios.delete(`https://localhost:7146/api/Job/comment/${commentId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Yorum başarıyla silindikten sonra listeyi güncelle
      setComments(comments.filter((comment) => comment.id !== commentId));
    } catch (error) {
      console.error('Yorum silme hatası:', error);
      setError('Yorum silinirken bir hata oluştu.');
    }
  };

  const handleApplyToJob = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('İlana başvurmak için giriş yapmanız gerekiyor.');
      return;
    }

    if (!cvFile) {
      setError('Başvuru yapabilmek için CV yüklemeniz gerekiyor.');
      return;
    }

    setIsLoading(true); // Bekleme durumunu başlat
    const formData = new FormData();
    formData.append('cvFile', cvFile);

    try {
      await axios.post(`https://localhost:7146/api/Job/${id}/apply`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      alert('Başvurunuz başarıyla alındı.');
    } catch (error) {
      console.error('Başvuru yaparken bir hata oluştu:', error);
      setError('Başvuru yaparken bir hata oluştu.');
    } finally {
      setIsLoading(false); // Bekleme durumunu bitir
    }
  };

  if (!job) {
    return <div>Yükleniyor...</div>;
  }

  return (
    <Container>
      <h1>{job.title}</h1>
      <p>{job.description}</p>
      <p>Şirket: {job.companyName}</p>
      <p>Lokasyon: {job.location}</p>

      {/* Favorilere ekleme/kaldırma butonu */}
      <Button onClick={toggleFavorite} variant={isFavorite ? 'danger' : 'primary'}>
        {isFavorite ? 'Favorilerden Kaldır' : 'Favorilere Ekle'}
      </Button>

      {/* Başvuru butonu ve CV yükleme alanı */}
      <Form className="mt-4">
        <Form.Group controlId="formCvFile">
          <Form.Label>CV Yükleyin</Form.Label>
          <Form.Control type="file" onChange={(e) => setCvFile(e.target.files[0])} />
        </Form.Group>
        <Button variant="success" onClick={handleApplyToJob} className="mt-2">
          {isLoading ? (
            <>
              <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" /> Başvuruluyor...
            </>
          ) : (
            'Başvur'
          )}
        </Button>
      </Form>

      <h3 className="mt-4">Yorumlar</h3>
      {comments.length === 0 ? (
        <p>Bu iş ilanı için henüz yorum yapılmamış.</p>
      ) : (
        comments.map((comment) => (
          <Card key={comment.id} className="mb-3">
            <Card.Body>
              <Card.Text>{comment.content}</Card.Text>
              <Card.Footer className="text-muted">
                Yazan: {comment.username}
                {(comment.username === currentUser || currentUserRole === 'Employer') && (
                  <Button
                    variant="danger"
                    size="sm"
                    className="ml-2"
                    onClick={() => deleteComment(comment.id)}
                  >
                    Sil
                  </Button>
                )}
              </Card.Footer>
            </Card.Body>
          </Card>
        ))
      )}

      <h4>Yorum Ekle</h4>
      <Form onSubmit={handleCommentSubmit}>
        <Form.Group>
          <Form.Control
            type="text"
            placeholder="Yorum yazın..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
        </Form.Group>
        <Button variant="primary" type="submit">
          Yorum Ekle
        </Button>
      </Form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </Container>
  );
};

export default JobDetails;
