import { Link } from "react-router-dom";
import "../styles/header.css";

const Header = () => {
  return (
    <header className="header">
      <h1>Церква</h1>
      <nav>
        <ul>
          <li><Link to="/">Головна</Link></li>
          <li><Link to="/about">Про нас</Link></li>
          <li><Link to="/services">Служіння</Link></li>
          <li><Link to="/contact">Контакти</Link></li>
          <li><Link to="/newspage">Новини</Link></li>
          <li><Link to="/donate" className="donate-button">Пожертви</Link></li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
