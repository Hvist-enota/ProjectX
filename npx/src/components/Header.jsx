import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="bg-white shadow-md py-4 px-6 flex justify-between items-center">
      <h1 className="text-2xl font-bold">Церква</h1>
      <nav>
        <ul className="flex gap-6">
          <li><Link to="/" className="hover:text-blue-500">Головна</Link></li>
          <li><Link to="/about" className="hover:text-blue-500">Про нас</Link></li>
          <li><Link to="/services" className="hover:text-blue-500">Служіння</Link></li>
          <li><Link to="/contact" className="hover:text-blue-500">Контакти</Link></li>
          <li><Link to="/donate" className="bg-blue-500 text-white px-4 py-2 rounded-md">Пожертви</Link></li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;