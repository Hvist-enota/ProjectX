import { Link } from "react-router-dom";
import "../styles/donate.css";

export default function DonateCancel() {
  return (
    <div className="donate-result-page">
      <div className="donate-result-card">
        <div className="donate-result-icon cancel-icon">✕</div>
        <h1 className="donate-result-title">Платіж скасовано</h1>
        <p className="donate-result-text">
          Ви скасували оплату. Нічого не списано з вашої картки.
          Якщо виникли труднощі — спробуйте ще раз або зв'яжіться з нами.
        </p>
        <div className="donate-result-actions">
          <Link to="/donate" className="donate-result-btn primary">
            Спробувати знову
          </Link>
          <Link to="/" className="donate-result-btn secondary">
            На головну
          </Link>
        </div>
      </div>
    </div>
  );
}
