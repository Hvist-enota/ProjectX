import React, { useState, useEffect } from "react";
import { ProgressBar } from "react-bootstrap";
import * as charityService from "../services/charityInitiativeService";
import apiClient from "../api/axiosConfig";
import "../styles/donate.css";

const Donate = () => {
  const [initiatives, setInitiatives] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedInitiative, setSelectedInitiative] = useState(null);
  const [amount, setAmount] = useState("");
  const [isRedirecting, setIsRedirecting] = useState(false);

  const fetchInitiatives = async () => {
    setLoading(true);
    try {
      const data = await charityService.getAllCharityInitiatives();
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
    setAmount("");
  };

  const handleClose = () => {
    setSelectedInitiative(null);
    setAmount("");
  };

  const handleDonate = async (e) => {
    e.preventDefault();
    if (!amount || parseFloat(amount) <= 0) {
      alert("Будь ласка, введіть суму пожертви");
      return;
    }

    setIsRedirecting(true);
    try {
      const { sessionUrl } = await charityService.createCheckoutSession(
        selectedInitiative.id,
        selectedInitiative.title,
        amount
      );
      // Redirect to Stripe Checkout
      window.location.href = sessionUrl;
    } catch (error) {
      console.error("Помилка при створенні платежу:", error);
      alert("Сталася помилка. Спробуйте пізніше.");
      setIsRedirecting(false);
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

      {/* Impact Dashboard */}
      <section className="impact-dashboard">
        <div className="container">
          <div className="row g-4 text-center">
            <div className="col-md-4">
              <div className="impact-stat-card">
                <div className="impact-number">540+</div>
                <div className="impact-label">Роздано продуктових наборів</div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="impact-stat-card">
                <div className="impact-number">150K</div>
                <div className="impact-label">Зібрано на потреби (грн)</div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="impact-stat-card">
                <div className="impact-number">45</div>
                <div className="impact-label">Родин отримали допомогу</div>
              </div>
            </div>
          </div>
        </div>
      </section>

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
      </section>

      {/* Donate Modal — amount only, card handled by Stripe */}
      {selectedInitiative && (
        <div className="stripe-modal-overlay" onClick={handleClose}>
          <div className="stripe-modal" onClick={(e) => e.stopPropagation()}>
            <button className="stripe-modal-close" onClick={handleClose}>✕</button>

            <div className="stripe-modal-header">
              <div className="stripe-modal-icon">🙏</div>
              <h2 className="stripe-modal-title">Пожертва</h2>
              <p className="stripe-modal-initiative">{selectedInitiative.title}</p>
            </div>

            <form onSubmit={handleDonate} className="stripe-modal-form">
              <label className="stripe-modal-label">Сума пожертви (₴)</label>

              {/* Quick amount buttons */}
              <div className="stripe-amount-presets">
                {[100, 200, 500, 1000].map(preset => (
                  <button
                    key={preset}
                    type="button"
                    className={`stripe-preset-btn ${amount == preset ? 'active' : ''}`}
                    onClick={() => setAmount(String(preset))}
                  >
                    {preset} ₴
                  </button>
                ))}
              </div>

              <input
                className="stripe-amount-input"
                type="number"
                placeholder="Або введіть свою суму"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                min="1"
                required
              />

              <div className="stripe-secure-note">
                <span>🔒</span>
                <span>Безпечна оплата через Stripe. Дані картки не передаються на наш сервер.</span>
              </div>

              <button
                type="submit"
                className="stripe-submit-btn"
                disabled={isRedirecting}
              >
                {isRedirecting ? (
                  <span>Перенаправлення... <span className="stripe-spinner" /></span>
                ) : (
                  <span>Перейти до оплати →</span>
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Donate;
