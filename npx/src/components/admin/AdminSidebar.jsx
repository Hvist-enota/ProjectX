import { Link } from 'react-router-dom';

export default function AdminSidebar() {
  return (
    <nav className="bg-light p-3" style={{ width: "250px", height: "100vh" }}>
      <h5>Адмін-панель</h5>
      <ul className="list-unstyled">
        <li><Link to="/admin">Головна</Link></li>
        <li><Link to="/admin/news">Новини</Link></li>
        <li><Link to="/admin/events">Події</Link></li>
      </ul>
    </nav>
  );
}