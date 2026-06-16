import { useEffect } from "react";
import { Link } from "react-router-dom";
import "../styles/donate.css";

export default function DonateSuccess() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="donate-result-page">
      <div className="donate-result-card">
        <div className="donate-result-icon success-icon">✓</div>
        <h1 className="donate-result-title">Дякуємо від усього серця!</h1>
        <p className="donate-result-text">
          Ваша пожертва успішно прийнята. Це дуже важливо для нашої громади.
          Кожна гривня допомагає нам творити добро і підтримувати тих, хто цього потребує.
        </p>
        <p className="donate-result-quote">
          "Блаженніше давати, ніж приймати." — Дії 20:35
        </p>
        <div className="donate-result-actions">
          <Link to="/donate" className="donate-result-btn primary">
            Інші ініціативи
          </Link>
          <Link to="/" className="donate-result-btn secondary">
            На головну
          </Link>
        </div>
      </div>
    </div>
  );
}
