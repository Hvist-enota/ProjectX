import React from "react";
import { Link } from "react-router-dom";
import "../../styles/footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="row gy-5">
          <div className="col-lg-4 col-md-6">
            <h3 className="footer-brand">Project Jesus</h3>
            <p className="footer-text mt-4">
              Дім Божий відчинено для кожного. Місце для духовної зустрічі, щирої молитви 
              та справжньої спільноти.
            </p>
            <div className="social-links mt-4">
              <a href="#" className="social-link"><i className="bi bi-facebook"></i></a>
              <a href="#" className="social-link"><i className="bi bi-instagram"></i></a>
              <a href="#" className="social-link"><i className="bi bi-youtube"></i></a>
            </div>
          </div>
          
          <div className="col-lg-3 col-md-6 offset-lg-1">
            <h4 className="footer-heading">Швидкі Посилання</h4>
            <ul className="footer-links">
              <li><Link to="/">Головна</Link></li>
              <li><Link to="/about">Про нас</Link></li>
              <li><Link to="/news">Новини</Link></li>
              <li><Link to="/events">Події</Link></li>
              <li><Link to="/donate">Підтримати</Link></li>
            </ul>
          </div>
          
          <div className="col-lg-4 col-md-12">
            <h4 className="footer-heading">Контакти</h4>
            <ul className="footer-contact-info">
              <li>
                <i className="bi bi-geo-alt"></i>
                <span>м. Київ, вул. Хрещатик 1</span>
              </li>
              <li>
                <i className="bi bi-envelope"></i>
                <span>info@projectjesus.ua</span>
              </li>
              <li>
                <i className="bi bi-telephone"></i>
                <span>+380 (44) 123-45-67</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="footer-bottom">
          <div className="row">
            <div className="col-md-6 text-center text-md-start">
              <p>&copy; {new Date().getFullYear()} Project Jesus. Всі права захищено.</p>
            </div>
            <div className="col-md-6 text-center text-md-end">
              <p>Створено з любов'ю та вірою.</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
