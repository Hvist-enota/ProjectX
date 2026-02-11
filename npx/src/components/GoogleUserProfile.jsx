// src/components/GoogleUserProfile.jsx
import { useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import { getUserImageUrl, getUserInitials } from '../utils/imageHelper';
import '../styles/avatar.css';

/**
 * Компонент для відображення профілю після Google Sign-In
 * @param {string} token - JWT токен
 * @param {Function} onLogout - Callback для logout
 */
export default function GoogleUserProfile({ token, onLogout }) {
  const [user] = useState(() => {
    try {
      return jwtDecode(token);
    } catch (err) {
      console.error('Failed to decode token:', err);
      return null;
    }
  });

  const handleLogout = () => {
    localStorage.removeItem('token');
    if (onLogout) {
      onLogout();
    }
  };

  if (!user) {
    return (
      <div className="alert alert-danger">
        Не вдалося декодувати токен
      </div>
    );
  }

  const imageUrl = getUserImageUrl(user);
  const initials = getUserInitials(user.name);

  return (
    <div className="card shadow-sm" style={{ maxWidth: '500px', margin: '50px auto' }}>
      <div className="card-body text-center">
        <h5 className="card-title mb-4">Вітаємо! 🎉</h5>
        
        {/* Аватар */}
        <div className="d-flex justify-content-center mb-3">
          {imageUrl ? (
            <>
              <img 
                src={imageUrl} 
                alt={user.name}
                className="user-avatar avatar-lg"
                referrerPolicy="no-referrer"
                crossOrigin="anonymous"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
              <div 
                className="user-avatar-placeholder avatar-lg"
                style={{ display: 'none' }}
              >
                {initials}
              </div>
            </>
          ) : (
            <div className="user-avatar-placeholder avatar-lg">
              {initials}
            </div>
          )}
        </div>
        
        {/* Інформація користувача */}
        <h4 className="mb-2">{user.name}</h4>
        <p className="text-muted mb-1">{user.email}</p>
        <span className="badge bg-primary mb-4">{user.role}</span>
        
        {/* ID користувача */}
        <div className="mb-3">
          <small className="text-muted d-block">User ID</small>
          <code style={{ fontSize: '0.75rem', wordBreak: 'break-all' }}>
            {user.id}
          </code>
        </div>
        
        {/* JWT Token (перші 50 символів) */}
        <div className="mb-4">
          <small className="text-muted d-block">JWT Token</small>
          <code style={{ fontSize: '0.75rem', wordBreak: 'break-all' }}>
            {token.substring(0, 50)}...
          </code>
        </div>
        
        {/* Кнопка Logout */}
        <button 
          className="btn btn-danger"
          onClick={handleLogout}
        >
          <i className="bi bi-box-arrow-right me-2"></i>
          Вийти
        </button>
      </div>
    </div>
  );
}
