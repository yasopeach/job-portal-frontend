import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Navbar, Nav, Container, NavDropdown, Badge } from 'react-bootstrap';
import { AuthContext } from '../contexts/AuthContext';
import { FiBriefcase, FiMessageSquare, FiBell, FiHeart, FiUser, FiUsers } from 'react-icons/fi';
import axios from 'axios';
import './CustomNavbar.css';

const CustomNavbar = () => {
  const { isAuthenticated, userRole, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const [username, setUsername] = useState('');

  useEffect(() => {
    const fetchUnreadNotifications = async () => {
      if (isAuthenticated) {
        const token = localStorage.getItem('token');
        try {
          const response = await axios.get('https://localhost:7146/api/Notification', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setNotifications(response.data);
          const unreadCount = response.data.filter((notification) => !notification.isRead).length;
          setUnreadNotifications(unreadCount);
        } catch (error) {
          console.error('Bildirim sayısı yüklenirken bir hata oluştu:', error);
        }
      }
    };

    const fetchUserProfile = async () => {
      if (isAuthenticated) {
        const token = localStorage.getItem('token');
        try {
          const response = await axios.get('https://localhost:7146/api/User/profile', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setUsername(response.data.name);
        } catch (error) {
          console.error('Kullanıcı bilgileri yüklenirken bir hata oluştu:', error);
        }
      }
    };

    fetchUnreadNotifications();
    fetchUserProfile();
  }, [isAuthenticated]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

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
      setUnreadNotifications(unreadNotifications - 1);
    } catch (error) {
      console.error('Bildirim okundu olarak işaretlenirken bir hata oluştu:', error);
    }
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Container fluid>
        <Navbar.Brand className="ms-4">Hoşgeldin, {username}</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mx-auto d-flex align-items-center justify-content-between gap-5">

            <Nav.Link as={Link} to="/" className="d-flex align-items-center">
              <FiBriefcase size={20} className="me-2" />
              <span>Ana Sayfa</span>
            </Nav.Link>
            <Nav.Link as={Link} to="/jobs" className="d-flex align-items-center">
              <FiBriefcase size={20} className="me-2" />
              <span>İş İlanları</span>
            </Nav.Link>


            {!isAuthenticated && (
              <>
                <Nav.Link as={Link} to="/login" className="mx-2">Giriş</Nav.Link>
                <Nav.Link as={Link} to="/register" className="mx-2">Kayıt Ol</Nav.Link>
              </>
            )}

            {isAuthenticated && (
              <>
                <Nav.Link as={Link} to="/favorites" className="d-flex align-items-center">
                  <FiHeart size={20} className="me-2" />
                  <span>Favorilerim</span>
                </Nav.Link>
                <Nav.Link as={Link} to="/MyApplications" className="d-flex align-items-center">
                  <FiBriefcase size={20} className="me-2" />
                  <span>Başvurduğum İlanlar</span>
                </Nav.Link>
                {/* İşveren Paneli sadece Employer ve Admin rolleri tarafından görülebilir */}
                {(userRole === 'Employer' || userRole === 'Admin') && (
                  <Nav.Link as={Link} to="/EmployerApplications" className="d-flex align-items-center">
                    <FiUsers size={20} className="me-2" />
                    <span>İşveren Panel</span>
                  </Nav.Link>
                )}
                <Nav.Link as={Link} to="/profile" className="d-flex align-items-center">
                  <FiUser size={20} className="me-2" />
                  <span>Profil</span>
                </Nav.Link>
                <Nav.Link as={Link} to="/messages" className="d-flex align-items-center">
              <FiMessageSquare size={20} className="me-2" />
              <span>Mesajlaşma</span>
            </Nav.Link>
              </>
            )}

            {userRole === 'Admin' && (
              <NavDropdown title="Admin" id="admin-nav-dropdown" className="d-flex align-items-center">
                <NavDropdown.Item as={Link} to="/admin/jobs">Admin İş İlanları</NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/admin/users">Admin Kullanıcılar</NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/admin/applications">Admin Başvurular</NavDropdown.Item>
              </NavDropdown>
            )}

            

            <NavDropdown
              title={
                <div className="d-flex align-items-center position-relative">
                  <FiBell size={20} className="me-2" />
                  <span>Bildirimler</span>
                  {unreadNotifications > 0 && (
                    <Badge
                      bg="danger"
                      pill
                      className="position-absolute top-0 start-100 translate-middle badge-notification"
                    >
                      {unreadNotifications}
                    </Badge>
                  )}
                </div>
              }
              id="notification-nav-dropdown"
            >
              {notifications.length === 0 ? (
                <NavDropdown.Item>Bildiriminiz yok</NavDropdown.Item>
              ) : (
                notifications.map((notification) => (
                  <NavDropdown.Item key={notification.id} onClick={() => markAsRead(notification.id)}>
                    {notification.message}
                    {!notification.isRead && <Badge bg="primary" className="ms-2">Yeni</Badge>}
                  </NavDropdown.Item>
                ))
              )}
            </NavDropdown>
          </Nav>

          {isAuthenticated && (
            <Nav className="ms-auto">
              <Nav.Link onClick={handleLogout} style={{ cursor: 'pointer' }}>
                Çıkış Yap
              </Nav.Link>
            </Nav>
          )}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default CustomNavbar;
