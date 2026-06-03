import { useEffect, useState } from 'react';
import { getAboutImages } from '../services/aboutService';
import apiClient from "../api/axiosConfig";
import "../styles/about.css";

export default function About() {
  const [images, setImages] = useState([]);

  useEffect(() => {
    getAboutImages().then(setImages);
  }, []);

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
            </div>
            <div className="col-lg-6 offset-lg-1">
              <div className="about-image-grid">
                <img src="/image/Church/puno.png" alt="Спільнота" className="img-fluid rounded shadow-lg main-img" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="about-gallery-section bg-light py-5">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="gallery-heading">Обличчя нашої спільноти</h2>
            <p className="text-muted">Люди, які творять історію церкви щодня.</p>
          </div>
          
          <div className="row g-4">
            {images.map(img => (
              <div key={img.id} className="col-12 col-sm-6 col-md-4 col-lg-3">
                <div className="about-member-card">
                  <div className="member-image-wrapper">
                    <img 
                      src={`${apiClient.defaults.baseURL}/images/aboutUsImages/${img?.filePath}`} 
                      className="member-image" 
                      alt={img.name} 
                    />
                  </div>
                  <div className="member-info">
                    <h3 className="member-name">{img.name}</h3>
                    <p className="member-role">{img.description}</p>
                  </div>
                </div>
              </div>
            ))}
            
            {images.length === 0 && (
              <div className="col-12 text-center text-muted">
                <p>Немає завантажених фотографій.</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
