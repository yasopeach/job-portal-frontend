import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Button, Form } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';

const EmployerApplications = () => {
  const [applications, setApplications] = useState([]);
  const [jobs, setJobs] = useState([]); // İşverenin açtığı ilanları tutacak state
  const [error, setError] = useState('');
  const [newStatus, setNewStatus] = useState('Pending');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('https://localhost:7146/api/Job/employer/applications', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setApplications(response.data);
      } catch (err) {
        setError('Sadece İşverenler görebilir.');
        console.error(err);
      }
    };

    const fetchJobs = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('https://localhost:7146/api/Job/employer/post', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setJobs(response.data);
      } catch (err) {
        console.error('İlanlar yüklenirken bir hata oluştu:', err);
      }
    };

    fetchApplications();
    fetchJobs();
  }, []);

  const handleUpdateStatus = async (applicationId, jobId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `https://localhost:7146/api/Job/${jobId}/applications/${applicationId}`,
        `"${newStatus}"`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      setApplications(
        applications.map((app) =>
          app.id === applicationId ? { ...app, status: newStatus } : app
        )
      );
      setNewStatus('Pending');
    } catch (err) {
      console.error('Başvuru durumu güncellenirken bir hata oluştu.', err);
    }
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

  const handleUpdateJob = (jobId) => {
    // İş ilanı güncelleme sayfasına yönlendirme
    navigate(`/update-job/${jobId}`);
  };

  const handleDownloadCv = async (applicationId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`https://localhost:7146/api/Job/employer/applications/${applicationId}/download-cv`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        responseType: 'blob',
      });

      // Dosyayı indirmek için bir bağlantı (link) oluştur
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', response.headers['content-disposition']?.split('filename=')[1] || 'cv.pdf');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error('CV indirilirken bir hata oluştu.', err);
    }
  };

  return (
    <div className="container mt-4">
      <h2>Gelen Başvurular</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Başvuran</th>
            <th>İlan Başlığı</th>
            <th>Durum</th>
            <th>İşlemler</th>
          </tr>
        </thead>
        <tbody>
          {applications.map((application) => (
            <tr key={application.id}>
              <td>{application.applicantUsername}</td>
              <td>{application.job.title}</td>
              <td>{application.status}</td>
              <td>
                <Form.Select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="mb-2"
                >
                  <option value="Beklemede">Beklemede</option>
                  <option value="Onaylandı">Onay</option>
                  <option value="Reddedildi">Red</option>
                </Form.Select>
                <Button
                  variant="primary"
                  onClick={() => handleUpdateStatus(application.id, application.jobId)}
                  className="ml-2"
                >
                  Durumu Güncelle
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => handleDownloadCv(application.id)}
                  className="ml-2"
                >
                  CV İndir
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <h2 className="mt-5">İlanlarım</h2>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>İlan Başlığı</th>
            <th>Şirket</th>
            <th>Lokasyon</th>
            <th>Başvuru Sayısı</th>
            <th>İşlemler</th>
          </tr>
        </thead>
        <tbody>
          {jobs.map((job) => (
            <tr key={job.id}>
              <td>{job.title}</td>
              <td>{job.companyName}</td>
              <td>{job.location}</td>
              <td>{job.applicationCount}</td>
              <td>
                <Button variant="primary" as={Link} to={`/jobs/${job.id}`} className="mx-2">
                  Detayları Görüntüle
                </Button>
                <Button
                  variant="warning"
                  onClick={() => handleUpdateJob(job.id)}
                  className="mx-2"
                >
                  Güncelle
                </Button>
                <Button
                  variant="danger"
                  onClick={() => handleDeleteJob(job.id)}
                  className="mx-2"
                >
                  Sil
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default EmployerApplications;
