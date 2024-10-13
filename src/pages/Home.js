import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Row, Col, Button, Form, Card, Carousel } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './Home.css';  // Yeni stil dosyası ekleyelim

const Home = () => {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [searchTitle, setSearchTitle] = useState('');
  const [searchLocation, setSearchLocation] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const jobsPerPage = 6; // Sayfa başına gösterilecek ilan sayısı

  useEffect(() => {
    // Başlangıçta tüm işleri getirin (One çıkan ilanlar)
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const response = await axios.get('https://localhost:7146/api/Job');
      setJobs(response.data);
      setTotalPages(Math.ceil(response.data.length / jobsPerPage)); // Toplam sayfa sayısını hesapla
    } catch (error) {
      console.error('İş ilanları yüklenirken bir hata oluştu:', error);
      setErrorMessage('Bir hata oluştu. Lütfen daha sonra tekrar deneyin.');
    }
  };

  const fetchFilteredJobs = async (params = {}) => {
    try {
      const response = await axios.get('https://localhost:7146/api/Job/search', {
        params: params,
      });
      setFilteredJobs(response.data);
      setErrorMessage('');
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setErrorMessage('Aradığınız kriterlere uygun iş ilanı bulunamadı.');
        setFilteredJobs([]);
      } else {
        console.error('İş ilanları yüklenirken bir hata oluştu:', error);
        setErrorMessage('Bir hata oluştu. Lütfen daha sonra tekrar deneyin.');
      }
    }
  };

  const handleSearch = () => {
    const params = {
      title: searchTitle,
      location: searchLocation,
    };
    fetchFilteredJobs(params);
  };

  const handlePopularSearch = (keyword) => {
    fetchFilteredJobs({ title: keyword });
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  // Sayfada gösterilecek iş ilanlarını belirlemek için slice kullanıyoruz
  const paginatedJobs = jobs.slice((currentPage - 1) * jobsPerPage, currentPage * jobsPerPage);

  return (
    <Container className="mt-4 home-container">
      <h1 className="text-center mb-4" style={{ color: '#003366' }}>Kariyer Fırsatlarını Keşfet</h1>
      <Row className="justify-content-center mb-4">
        <Col md={4}>
          <Form.Control
            type="text"
            placeholder="İş pozisyonu ara"
            value={searchTitle}
            onChange={(e) => setSearchTitle(e.target.value)}
            className="search-input"
          />
        </Col>
        <Col md={4}>
          <Form.Control
            type="text"
            placeholder="Şehir ara"
            value={searchLocation}
            onChange={(e) => setSearchLocation(e.target.value)}
            className="search-input"
          />
        </Col>
        <Col md={2} className="d-flex justify-content-center">
          <Button variant="primary" onClick={handleSearch} className="search-button">
            İş Bul
          </Button>
        </Col>
      </Row>

      {/* Popüler Aramalar */}
      <Row className="mb-4">
        <Col>
          <h4 style={{ color: '#003366' }}>Popüler Aramalar</h4>
          <div className="d-flex flex-wrap">
            {['İnsan Kaynakları Uzmanı', 'Grafik Tasarımcı', 'Yazılım Geliştirme Uzmanı', 'Proje Yöneticisi', 'Muhasebe Uzmanı', 'Temizlikçi'].map((keyword) => (
              <Button
                variant="outline-primary"
                className="m-1 popular-search-button"
                key={keyword}
                onClick={() => handlePopularSearch(keyword)}
              >
                {keyword}
              </Button>
            ))}
          </div>
        </Col>
      </Row>

      {/* Arama Sonuçları */}
      {filteredJobs.length > 0 && (
        <Row className="mb-4">
          <Col>
            <h4 style={{ color: '#003366' }}>Arama Sonuçları</h4>
            <Row>
              {filteredJobs.map((job) => (
                <Col md={4} key={job.id} className="mb-4">
                  <Card className="job-card">
                    <Card.Body>
                      <Card.Title>{job.title}</Card.Title>
                      <Card.Text>Şirket: {job.companyName}</Card.Text>
                      <Card.Text>Lokasyon: {job.location}</Card.Text>
                      <Button variant="primary" as={Link} to={`/jobs/${job.id}`} className="details-button">
                        Detayları Görüntüle
                      </Button>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          </Col>
        </Row>
      )}

      {/* Kaydırılabilir Reklam Alanı */}
      <Row className="mb-4">
        <Col>
          <Carousel>
            <Carousel.Item>
              <img
                className="d-block w-100 carousel-image"
                src="https://via.placeholder.com/800x200"
                alt="First slide"
              />
              <Carousel.Caption>
                <h3 style={{ color: '#ffffff' }}>İlk İş Deneyiminiz İçin Kariyer Fırsatları</h3>
                <Button variant="primary">İlanları İncele!</Button>
              </Carousel.Caption>
            </Carousel.Item>
            <Carousel.Item>
              <img
                className="d-block w-100 carousel-image"
                src="https://via.placeholder.com/800x200"
                alt="Second slide"
              />
              <Carousel.Caption>
                <h3 style={{ color: '#ffffff' }}>Hızlı Başvuru İmkanı</h3>
                <Button variant="primary">Hemen Başvur</Button>
              </Carousel.Caption>
            </Carousel.Item>
          </Carousel>
        </Col>
      </Row>

      {/* Öne Çıkan İlanlar (Sayfalama) */}
      <Row className="mb-4">
        <Col>
          <h4 style={{ color: '#003366' }}>Öne Çıkan İlanlar</h4>
          {errorMessage && !filteredJobs.length && <p className="text-danger">{errorMessage}</p>}
          <Row>
            {paginatedJobs.map((job) => (
              <Col md={4} key={job.id} className="mb-4">
                <Card className="job-card">
                  <Card.Body>
                    <Card.Title>{job.title}</Card.Title>
                    <Card.Text>Şirket: {job.companyName}</Card.Text>
                    <Card.Text>Lokasyon: {job.location}</Card.Text>
                    <Button variant="primary" as={Link} to={`/jobs/${job.id}`} className="details-button">
                      Detayları Görüntüle
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>

          {/* Sayfalama Kontrolleri */}
          <div className="d-flex justify-content-center mt-4">
            <Button
              variant="secondary"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="me-2 pagination-button"
            >
              Önceki
            </Button>
            <span className="pagination-info">Sayfa {currentPage} / {totalPages}</span>
            <Button
              variant="secondary"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="ms-2 pagination-button"
            >
              Sonraki
            </Button>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Home;