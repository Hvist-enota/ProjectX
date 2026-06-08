import { Link } from "react-router-dom";
import Hero from "../components/Hero";
import "../styles/home.css";

const Home = () => {
  return (
    <div className="home-wrapper">
      <Hero />
      
      {/* Welcome Section - Editorial Layout */}
      <section className="welcome-section">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6 mb-5 mb-lg-0">
              <div className="welcome-image-wrapper">
                <img src="/image/Church/puno.png" alt="Церква" className="welcome-image img-fluid" />
              </div>
            </div>
            <div className="col-lg-6 ps-lg-5">
              <span className="section-eyebrow">Наша місія</span>
              <h2 className="section-heading">Віра, Надія та Любов у дії</h2>
              <p className="section-text">
                Ми віримо, що церква — це не просто будівля, а жива спільнота людей, об'єднаних Божою любов'ю. 
                Наше покликання полягає в тому, щоб ділитися цією любов'ю зі світом, підтримувати тих, хто 
                потребує допомоги, та разом зростати духовно.
              </p>
              <p className="section-text mb-4">
                Незалежно від того, на якому етапі духовного шляху ви знаходитесь, тут для вас завжди знайдеться місце.
              </p>
              <Link to="/new-here" className="btn btn-primary me-3">Я тут вперше</Link>
              <Link to="/about" className="btn btn-outline-secondary">Про нашу історію</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Links Section */}
      <section className="quick-links-section">
        <div className="container">
          <div className="row g-4 text-center">
            <div className="col-md-4">
              <div className="quick-link-card">
                <div className="icon-wrapper">
                  <i className="bi bi-calendar-event"></i>
                </div>
                <h3>Події</h3>
                <p>Долучайтесь до наших богослужінь та зустрічей.</p>
                <Link to="/events" className="text-link">Переглянути розклад <i className="bi bi-arrow-right"></i></Link>
              </div>
            </div>
            <div className="col-md-4">
              <div className="quick-link-card">
                <div className="icon-wrapper">
                  <i className="bi bi-heart"></i>
                </div>
                <h3>Служіння</h3>
                <p>Станьте частиною благодійних ініціатив.</p>
                <Link to="/donate" className="text-link">Підтримати місію <i className="bi bi-arrow-right"></i></Link>
              </div>
            </div>
            <div className="col-md-4">
              <div className="quick-link-card">
                <div className="icon-wrapper">
                  <i className="bi bi-newspaper"></i>
                </div>
                <h3>Новини</h3>
                <p>Дізнавайтесь про останні події нашої спільноти.</p>
                <Link to="/news" className="text-link">Читати останні <i className="bi bi-arrow-right"></i></Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
