import { Link } from "react-router-dom";
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';

const Header = () => {
    const { user, logout, isAuthenticated } = useContext(AuthContext);

    return (
        <header className="bg-white shadow-sm">
            <div className="container py-3">
                <nav className="navbar navbar-expand-lg navbar-light p-0">
                    {/* Логотип */}
                    <Link className="navbar-brand fw-bold text-primary fs-4" to="/">Church</Link>

                    {/* Мобільна кнопка меню */}
                    <button
                        className="navbar-toggler"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#navbarNav"
                        aria-controls="navbarNav"
                        aria-expanded="false"
                        aria-label="Toggle navigation"
                    >
                        <span className="navbar-toggler-icon"></span>
                    </button>

                    {/* Навігаційне меню */}
                    <div className="collapse navbar-collapse justify-content-between" id="navbarNav">
                        {/* Основні посилання */}
                        <ul className="navbar-nav mb-2 mb-lg-0">
                            <li className="nav-item"><Link className="nav-link" to="/about">Про нас</Link></li>
                            <li className="nav-item"><Link className="nav-link" to="/events">Події</Link></li>
                            <li className="nav-item"><Link className="nav-link" to="/contact">Контакти</Link></li>
                            <li className="nav-item"><Link className="nav-link" to="/donate">Пожертви</Link></li>
                            <li className="nav-item"><Link className="nav-link" to="/newspage">Новини</Link></li>
                        </ul>

                        {/* Авторизація */}
                        <ul className="navbar-nav">
                            {isAuthenticated ? (
                                <li className="nav-item dropdown">
                                    <a
                                        className="nav-link dropdown-toggle d-flex align-items-center"
                                        href="#"
                                        id="navbarDropdown"
                                        role="button"
                                        data-bs-toggle="dropdown"
                                        aria-expanded="false"
                                    >
                                        <i className="bi bi-person-circle me-2"></i>
                                        <span>{user.name || 'Профіль'}</span>
                                    </a>
                                    <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdown">
                                        {user.role?.includes("Administrator") && (
                                            <li><Link className="dropdown-item" to="/admin">🔧 Адмін-панель</Link></li>
                                        )}
                                        <li><Link className="dropdown-item" to="/profile">👤 Профіль</Link></li>
                                        <li><hr className="dropdown-divider" /></li>
                                        <li>
                                            <button
                                                className="dropdown-item text-danger"
                                                onClick={logout}
                                            >
                                                <i className="bi bi-box-arrow-right me-2"></i>Вийти
                                            </button>
                                        </li>
                                    </ul>
                                </li>
                            ) : (
                                <>
                                    <li className="nav-item me-2">
                                        <Link className="btn btn-outline-primary btn-sm" to="/signin">Увійти</Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link className="btn btn-primary btn-sm text-white" to="/signup">Реєстрація</Link>
                                    </li>
                                </>
                            )}
                        </ul>
                    </div>
                </nav>
            </div>
        </header>
    );
};

export default Header;