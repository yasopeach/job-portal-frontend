import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Button, Form } from 'react-bootstrap';

const AdminApplications = () => {
  const [applications, setApplications] = useState([]);
  const [error, setError] = useState('');
  const [newStatus, setNewStatus] = useState('');

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('https://localhost:7146/api/Admin/applications', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setApplications(response.data);
      } catch (err) {
        setError('Başvurular yüklenirken bir hata oluştu.');
        console.error(err);
      }
    };

    fetchApplications();
  }, []);

  const handleUpdateStatus = async (applicationId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `https://localhost:7146/api/Admin/applications/${applicationId}`,
        newStatus,
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
      setNewStatus('');
    } catch (err) {
      console.error('Başvuru durumu güncellenirken bir hata oluştu.', err);
    }
  };

  const handleDownloadCv = async (applicationId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`https://localhost:7146/api/Admin/applications/${applicationId}/download-cv`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        responseType: 'blob', // Dosya indirilecek olduğu için blob türünde yanıt bekliyoruz
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
      <h2>Başvuru Yönetimi</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Başvuran</th>
            <th>İlan ID</th>
            <th>Durum</th>
            <th>İşlemler</th>
          </tr>
        </thead>
        <tbody>
          {applications.map((application) => (
            <tr key={application.id}>
              <td>{application.applicantUsername}</td>
              <td>{application.jobId}</td>
              <td>{application.status}</td>
              <td>
                <Form.Control
                  type="text"
                  placeholder="Yeni Durum"
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="mb-2"
                />
                <Button
                  variant="primary"
                  onClick={() => handleUpdateStatus(application.id)}
                  className="ml-2"
                >
                  Güncelle
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
    </div>
  );
};

export default AdminApplications;
