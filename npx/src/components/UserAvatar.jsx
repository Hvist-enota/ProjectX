// src/components/UserAvatar.jsx
import { getUserImageUrl, getUserInitials } from '../utils/imageHelper';
import '../styles/avatar.css';

/**
 * Компонент для відображення аватара користувача
 * @param {Object} user - Об'єкт користувача з JWT токена
 * @param {string} size - Розмір аватара ('sm', 'md', 'lg')
 * @param {string} className - Додаткові CSS класи
 * @returns {JSX.Element}
 */
export default function UserAvatar({ user, size = 'md', className = '' }) {
  const imageUrl = getUserImageUrl(user);
  const initials = getUserInitials(user?.name);

  const sizeClasses = {
    sm: 'avatar-sm',
    md: 'avatar-md',
    lg: 'avatar-lg'
  };

  const sizeClass = sizeClasses[size] || sizeClasses.md;

  if (imageUrl) {
    return (
      <>
        <img 
          src={imageUrl} 
          alt={user?.name || 'User'} 
          className={`user-avatar ${sizeClass} ${className}`}
          referrerPolicy="no-referrer"
          crossOrigin="anonymous"
          onError={(e) => {
            // Якщо зображення не завантажилось, показуємо ініціали
            e.target.style.display = 'none';
            e.target.nextSibling.style.display = 'flex';
          }}
        />
        <div 
          className={`user-avatar-placeholder ${sizeClass} ${className}`}
          style={{ display: 'none' }}
        >
          {initials}
        </div>
      </>
    );
  }

  return (
    <div className={`user-avatar-placeholder ${sizeClass} ${className}`}>
      {initials}
    </div>
  );
}
