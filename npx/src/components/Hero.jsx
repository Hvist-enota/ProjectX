import { Link } from "react-router-dom";
import "../styles/hero.css";

const Hero = () => {
  const backgroundImage = '/image/Church/church.png'; 

  return (
    <section
      className="hero"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="hero-content">
        <span className="hero-eyebrow">Вітаємо у Project Jesus</span>
        <h2>Дім Божий відчинено для кожного</h2>
        <p className="hero-subtitle">Місце для духовної зустрічі, щирої молитви та справжньої спільноти. Приєднуйтесь до нашої родини, щоб разом зростати у вірі.</p>
        <div className="hero-actions">
          <Link to="/about" className="btn btn-primary">Дізнатися більше</Link>
          <Link to="/donate" className="btn btn-outline-light ms-3">Підтримати</Link>
        </div>
      </div>
    </section>
  );
};

export default Hero;
