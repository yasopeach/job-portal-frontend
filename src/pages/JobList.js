import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { Card, Button } from 'react-bootstrap'; // Bootstrap bileşenleri

const JobList = () => {
  const [jobs, setJobs] = useState([]);
  const [userRole, setUserRole] = useState('');
  const [currentUser, setCurrentUser] = useState(''); // Kullanıcı adı bilgisi için
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const jobsPerPage = 6; // Sayfa başına gösterilecek ilan sayısı
  const navigate = useNavigate();

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await axios.get('https://localhost:7146/api/Job');
        setJobs(response.data);
        setTotalPages(Math.ceil(response.data.length / jobsPerPage)); // Toplam sayfa sayısını hesapla
      } catch (error) {
        console.error('İş ilanları yüklenirken bir hata oluştu:', error);
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
        setUserRole(response.data.role);
        setCurrentUser(response.data.username); // Kullanıcının adı
      } catch (error) {
        console.error('Kullanıcı bilgileri yüklenirken bir hata oluştu:', error);
      }
    };

    fetchJobs();
    fetchUserProfile();
  }, []);

  const handleCreateJob = () => {
    navigate('/create-job'); // İş ilanı oluşturma sayfasına yönlendir
  };

  const handleDeleteJob = async (jobId) => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('İlanı silmek için giriş yapmanız gerekiyor.');
      return;
    }

    // Kullanıcıdan onay al
    if (!window.confirm('Bu ilanı silmek istediğinizden emin misiniz?')) {
      return;
    }

    try {
      await axios.delete(`https://localhost:7146/api/Job/${jobId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // Başarıyla silindikten sonra ilan listesini güncelle
      setJobs(jobs.filter((job) => job.id !== jobId));
      alert('İlan başarıyla silindi.');
    } catch (error) {
      console.error('İlan silinirken bir hata oluştu:', error);
      alert('İlan silinirken bir hata oluştu.');
    }
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  // Sayfada gösterilecek iş ilanlarını belirlemek için slice kullanıyoruz
  const paginatedJobs = jobs.slice((currentPage - 1) * jobsPerPage, currentPage * jobsPerPage);

  return (
    <div className="container mt-4">
      <h1 className="mb-4">İş İlanları</h1>

      {/* Eğer kullanıcı rolü "Employer" ya da "Admin" ise iş ilanı oluşturma butonunu göster */}
      {(userRole === 'Employer' || userRole === 'Admin') && (
        <Button variant="success" className="mb-4" onClick={handleCreateJob}>
          İş İlanı Oluştur
        </Button>
      )}

      <div className="row">
        {paginatedJobs.map((job) => (
          <div className="col-md-4 mb-4" key={job.id}>
            <Card>
              <Card.Body>
                <Card.Title>{job.title}</Card.Title>
                <Card.Text>Şirket: {job.companyName}</Card.Text>
                <Card.Text>Lokasyon: {job.location}</Card.Text>
                <Button variant="primary" as={Link} to={`/jobs/${job.id}`} className="mr-2">
                  Detayları Görüntüle
                </Button>

                {/* Eğer kullanıcı "Admin" ya da ilan sahibi ise ilanı silme butonunu göster */}
                {(userRole === 'Admin' || job.createdByUserId === currentUser) && (
                  <Button
                    variant="danger"
                    onClick={() => handleDeleteJob(job.id)}
                    className="ml-2"
                  >
                    İlanı Sil
                  </Button>
                )}
              </Card.Body>
            </Card>
          </div>
        ))}
      </div>

      {/* Sayfalama Kontrolleri */}
      <div className="d-flex justify-content-center mt-4">
        <Button
          variant="secondary"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="me-2"
        >
          Önceki
        </Button>
        <span>Sayfa {currentPage} / {totalPages}</span>
        <Button
          variant="secondary"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="ms-2"
        >
          Sonraki
        </Button>
      </div>
    </div>
  );
};

export default JobList;
