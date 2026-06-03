import React, { useState, useEffect } from "react";
import { Modal, Button, Form, ProgressBar, Row, Col } from "react-bootstrap";
import * as charityService from "../services/charityInitiativeService";
import apiClient from "../api/axiosConfig";
import "../styles/donate.css";

const Donate = () => {
  const [initiatives, setInitiatives] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedInitiative, setSelectedInitiative] = useState(null);
  const [lastName, setLastName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [patronymic, setPatronymic] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [amount, setAmount] = useState("");
  const [showModal, setShowModal] = useState(false);

  const fetchInitiatives = async () => {
    setLoading(true);
    try {
      const data = await charityService.getAllCharityInitiatives();
      // Фільтруємо лише активні
      setInitiatives(data.filter(item => item.isActive));
    } catch (error) {
      console.error("Помилка завантаження ініціатив:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInitiatives();
  }, []);

  const handleOpen = (initiative) => {
    setSelectedInitiative(initiative);
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
    setLastName("");
    setFirstName("");
    setPatronymic("");
    setCardNumber("");
    setExpiryDate("");
    setCvv("");
    setAmount("");
    setSelectedInitiative(null);
  };

  const handleDonate = async (e) => {
    e.preventDefault();
    if (!lastName || !firstName || !patronymic || !cardNumber || !expiryDate || !cvv || !amount) {
      alert("Будь ласка, заповніть всі поля");
      return;
    }
    // Basic format validation
    if (cardNumber.replace(/\s/g, '').length !== 16) {
      alert("Номер картки має містити 16 цифр");
      return;
    }
    
    try {
      await charityService.donateToCharityInitiative(selectedInitiative.id, parseFloat(amount));
      alert(`Дякуємо, ${firstName} ${lastName}! Ваша пожертва у розмірі ${amount} ₴ на "${selectedInitiative.title}" успішно прийнята.`);
      handleClose();
      fetchInitiatives(); // Refresh the list to show updated amounts/remove inactive
    } catch (error) {
      console.error("Помилка при пожертві:", error);
      alert("Сталася помилка при обробці пожертви. Спробуйте пізніше.");
    }
  };

  return (
    <div className="donate-wrapper">
      <div className="donate-header-banner">
        <div className="container">
          <div className="row justify-content-center text-center">
            <div className="col-lg-8">
              <span className="section-eyebrow">Служіння та Підтримка</span>
              <h1 className="donate-page-title">Дар любові</h1>
              <p className="donate-page-subtitle">
                "Кожен нехай дає за велінням серця, не з жалем чи з примусу, бо Бог любить того, хто дає з радістю" (2 Кор. 9:7). 
                Ваша підтримка допомагає нам нести світло, надію та практичну допомогу тим, хто цього найбільше потребує.
              </p>
            </div>
          </div>
        </div>
      </div>

      <section className="donate-section">
        <h2 className="mb-5 text-center">Активні Ініціативи</h2>
        
        {loading ? (
          <div className="text-center my-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Завантаження...</span>
            </div>
          </div>
        ) : initiatives.length === 0 ? (
          <div className="text-center my-5">
            <h4 className="text-muted">Наразі немає активних ініціатив</h4>
          </div>
        ) : (
          <div className="initiatives-grid">
          {initiatives.map((item) => (
            <div key={item.id} className="initiative-card" onClick={() => handleOpen(item)}>
              {item.photoUrl ? (
                <div className="initiative-image-container">
                  <img src={`${apiClient.defaults.baseURL}/images/charity-initiatives/${item.photoUrl}`} alt={item.title} className="initiative-image" />
                </div>
              ) : (
                <div className="initiative-icon">❤️</div>
              )}
              <div className="initiative-content">
                <h3>{item.title}</h3>
                <p>{item.description}</p>
                
                <div className="progress-section mt-3 mb-3">
                  <div className="d-flex justify-content-between mb-1" style={{ fontSize: '0.85rem' }}>
                    <span>Зібрано: <strong>{item.currentAmount} ₴</strong></span>
                    <span>Ціль: <strong>{item.targetAmount} ₴</strong></span>
                  </div>
                  <ProgressBar 
                    now={item.targetAmount > 0 ? (item.currentAmount / item.targetAmount) * 100 : 0} 
                    variant="success" 
                    style={{ height: '8px' }}
                  />
                </div>
                
                <button className="donate-button-small mt-auto">Підтримати</button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal show={showModal} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Пожертва: {selectedInitiative?.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleDonate}>
            <h6 className="mb-3 border-bottom pb-2">Ваші дані</h6>
            <Form.Group className="mb-3" controlId="formLastName">
              <Form.Label>Прізвище</Form.Label>
              <Form.Control 
                type="text" 
                placeholder="Введіть прізвище" 
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required 
              />
            </Form.Group>
            
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group controlId="formFirstName">
                  <Form.Label>Ім'я</Form.Label>
                  <Form.Control 
                    type="text" 
                    placeholder="Введіть ім'я" 
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required 
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="formPatronymic">
                  <Form.Label>По батькові</Form.Label>
                  <Form.Control 
                    type="text" 
                    placeholder="Введіть по батькові" 
                    value={patronymic}
                    onChange={(e) => setPatronymic(e.target.value)}
                    required 
                  />
                </Form.Group>
              </Col>
            </Row>

            <h6 className="mb-3 mt-4 border-bottom pb-2">Реквізити картки</h6>
            <Form.Group className="mb-3" controlId="formCardNumber">
              <Form.Label>Номер картки</Form.Label>
              <Form.Control 
                type="text" 
                placeholder="XXXX XXXX XXXX XXXX" 
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, '').substring(0, 16))}
                required 
              />
            </Form.Group>

            <Row className="mb-3">
              <Col xs={6}>
                <Form.Group controlId="formExpiryDate">
                  <Form.Label>Термін дії (ММ/РР)</Form.Label>
                  <Form.Control 
                    type="text" 
                    placeholder="ММ/РР" 
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(e.target.value.substring(0, 5))}
                    required 
                  />
                </Form.Group>
              </Col>
              <Col xs={6}>
                <Form.Group controlId="formCvv">
                  <Form.Label>CVV</Form.Label>
                  <Form.Control 
                    type="password" 
                    placeholder="XXX" 
                    value={cvv}
                    onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').substring(0, 3))}
                    required 
                  />
                </Form.Group>
              </Col>
            </Row>

            <h6 className="mb-3 mt-4 border-bottom pb-2">Сума пожертви</h6>
            <Form.Group className="mb-4" controlId="formAmount">
              <Form.Label>Сума (₴)</Form.Label>
              <Form.Control 
                type="number" 
                placeholder="Введіть суму" 
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                min="1"
                required 
              />
            </Form.Group>
            
            <Button variant="success" type="submit" className="w-100 donate-submit-btn py-2">
              Зробити внесок
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
      </section>
    </div>
  );
};

export default Donate;
