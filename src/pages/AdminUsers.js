import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Button } from 'react-bootstrap';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('https://localhost:7146/api/Admin/users', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUsers(response.data);
      } catch (err) {
        setError('Kullanıcılar yüklenirken bir hata oluştu.');
        console.error(err);
      }
    };

    fetchUsers();
  }, []);

  const handleDeleteUser = async (userId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`https://localhost:7146/api/Admin/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUsers(users.filter((user) => user.id !== userId));
    } catch (err) {
      console.error('Kullanıcı silinirken bir hata oluştu.', err);
    }
  };

  return (
    <div className="container mt-4">
      <h2>Kullanıcı Yönetimi</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Kullanıcı Adı</th>
            <th>E-posta</th>
            <th>İşlemler</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.username}</td>
              <td>{user.email}</td>
              <td>
                <Button variant="danger" onClick={() => handleDeleteUser(user.id)}>
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

export default AdminUsers;
