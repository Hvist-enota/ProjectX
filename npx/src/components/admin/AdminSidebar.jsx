import { Link, useLocation } from 'react-router-dom';
import '../../styles/admin.css';

export default function AdminSidebar() {
  const location = useLocation();

  const isActive = (path) => {
    if (path === '/admin' && location.pathname === '/admin') return true;
    if (path !== '/admin' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <nav className="admin-sidebar">
      <div className="admin-sidebar-header">
        <h5 className="admin-sidebar-title">⚙️ Адмін-панель</h5>
      </div>
      <ul className="admin-nav">
        <li className="admin-nav-item">
          <Link 
            to="/admin" 
            className={`admin-nav-link ${isActive('/admin') ? 'active' : ''}`}
          >
            <span className="admin-nav-icon">🏠</span>
            Головна
          </Link>
        </li>
        <li className="admin-nav-item">
          <Link 
            to="/admin/statistics" 
            className={`admin-nav-link ${isActive('/admin/statistics') ? 'active' : ''}`}
          >
            <span className="admin-nav-icon">📊</span>
            Статистика
          </Link>
        </li>
        <li className="admin-nav-item">
          <Link 
            to="/admin/news" 
            className={`admin-nav-link ${isActive('/admin/news') ? 'active' : ''}`}
          >
            <span className="admin-nav-icon">📰</span>
            Новини
          </Link>
        </li>
        <li className="admin-nav-item">
          <Link 
            to="/admin/events" 
            className={`admin-nav-link ${isActive('/admin/events') ? 'active' : ''}`}
          >
            <span className="admin-nav-icon">📅</span>
            Події
          </Link>
        </li>
        <li className="admin-nav-item">
          <Link 
            to="/admin/charity" 
            className={`admin-nav-link ${isActive('/admin/charity') ? 'active' : ''}`}
          >
            <span className="admin-nav-icon">❤️</span>
            Благодійність
          </Link>
        </li>
        <li className="admin-nav-item">
          <Link 
            to="/admin/users" 
            className={`admin-nav-link ${isActive('/admin/users') ? 'active' : ''}`}
          >
            <span className="admin-nav-icon">👥</span>
            Користувачі
          </Link>
        </li>
      </ul>
    </nav>
  );
}