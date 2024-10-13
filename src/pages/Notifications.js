import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ListGroup, Button } from 'react-bootstrap';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchNotifications = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Bildirimlerinizi görmek için giriş yapmanız gerekiyor.');
        return;
      }
      try {
        const response = await axios.get('https://localhost:7146/api/Notification', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setNotifications(response.data);
      } catch (error) {
        setError('Bildirimler yüklenirken bir hata oluştu.');
        console.error('Bildirim hatası:', error);
      }
    };

    fetchNotifications();
  }, []);

  const markAsRead = async (notificationId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`https://localhost:7146/api/Notification/${notificationId}/mark-as-read`, null, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setNotifications(notifications.map((notification) =>
        notification.id === notificationId ? { ...notification, isRead: true } : notification
      ));
    } catch (error) {
      console.error('Bildirim okundu olarak işaretlenirken bir hata oluştu:', error);
    }
  };

  return (
    <div className="container mt-4">
      <h2>Bildirimlerim</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <ListGroup>
        {notifications.length === 0 && <p>Henüz bildiriminiz bulunmuyor.</p>}
        {notifications.map((notification) => (
          <ListGroup.Item key={notification.id} variant={notification.isRead ? 'light' : 'primary'}>
            <div className="d-flex justify-content-between align-items-center">
              <span>{notification.message}</span>
              {!notification.isRead && (
                <Button variant="outline-secondary" onClick={() => markAsRead(notification.id)}>
                  Okundu Olarak İşaretle
                </Button>
              )}
            </div>
          </ListGroup.Item>
        ))}
      </ListGroup>
    </div>
  );
};

export default Notifications;
