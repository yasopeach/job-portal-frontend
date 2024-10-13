import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Button } from 'react-bootstrap';

const AdminJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('https://localhost:7146/api/Admin/jobs', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setJobs(response.data);
      } catch (err) {
        setError('İş ilanları yüklenirken bir hata oluştu.');
        console.error(err);
      }
    };

    fetchJobs();
  }, []);

  const handleDeleteJob = async (jobId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`https://localhost:7146/api/Admin/jobs/${jobId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setJobs(jobs.filter((job) => job.id !== jobId));
    } catch (err) {
      console.error('İş ilanı silinirken bir hata oluştu.', err);
    }
  };

  return (
    <div className="container mt-4">
      <h2>İş İlanları Yönetimi</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Başlık</th>
            <th>Şirket</th>
            <th>Lokasyon</th>
            <th>İşlemler</th>
          </tr>
        </thead>
        <tbody>
          {jobs.map((job) => (
            <tr key={job.id}>
              <td>{job.title}</td>
              <td>{job.companyName}</td>
              <td>{job.location}</td>
              <td>
                <Button variant="danger" onClick={() => handleDeleteJob(job.id)}>
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

export default AdminJobs;
