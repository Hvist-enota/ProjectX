import { Link } from 'react-router-dom';
import "../styles/about.css";

export default function About() {

  return (
    <div className="about-wrapper">
      {/* Story Section */}
      <section className="about-story-section">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-5 mb-5 mb-lg-0">
              <span className="section-eyebrow">Наша Історія</span>
              <h1 className="about-heading">Світло для нашого міста</h1>
              <p className="about-text">
                Ми — спільнота, об'єднана вірою та любов'ю до ближнього. Наша історія почалася з невеликої 
                групи людей, які прагнули зробити цей світ трішки добрішим і світлішим. Сьогодні ми 
                збираємо сотні людей різного віку та професій, створюючи атмосферу прийняття і підтримки.
              </p>
              <blockquote className="about-quote">
                "Ми - сім'я, в якій кожен має своє місце, незалежно від минулого."
              </blockquote>
              <div className="mt-4">
                <Link to="/new-here" className="btn btn-primary btn-lg">Я тут вперше</Link>
              </div>
            </div>
            <div className="col-lg-6 offset-lg-1">
              <div className="about-image-grid">
                <img src="/image/Church/puno.png" alt="Спільнота" className="img-fluid rounded shadow-lg main-img" />
              </div>
            </div>
          </div>
        </div>
      </section>


    </div>
  );
}
