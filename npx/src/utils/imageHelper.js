// src/utils/imageHelper.js

/**
 * Отримує повний URL зображення користувача
 * @param {Object|string} userData - Об'єкт користувача з JWT токена або шлях до зображення
 * @param {string} baseUrl - Базовий URL API (за замовчуванням з .env)
 * @returns {string|null} - Повний URL або null якщо немає зображення
 */
export const getUserImageUrl = (userData, baseUrl = null) => {
  // Якщо передано об'єкт користувача
  if (typeof userData === 'object' && userData !== null) {
    // Пріоритет: photoUrl (Google) -> image (локальний файл)
    const imagePath = userData.photoUrl || userData.image;
    
    if (!imagePath || imagePath === 'N/A') {
      return null;
    }
    
    // Якщо це повний URL (Google фото)
    if (imagePath.startsWith('http')) {
      return imagePath;
    }
    
    // Локальний файл
    const apiUrl = baseUrl || import.meta.env.VITE_API_URL || 'http://localhost:5132';
    const cleanPath = imagePath.replace(/^\/images\//, '');
    return `${apiUrl}/images/${cleanPath}`;
  }
  
  // Якщо передано просто шлях (string)
  const imagePath = userData;
  
  if (!imagePath || imagePath === 'N/A') {
    return null;
  }

  // Якщо це повний URL (Google фото)
  if (imagePath.startsWith('http')) {
    return imagePath;
  }

  // Локальний файл
  const apiUrl = baseUrl || import.meta.env.VITE_API_URL || 'http://localhost:5132';
  const cleanPath = imagePath.replace(/^\/images\//, '');
  return `${apiUrl}/images/${cleanPath}`;
};

/**
 * Отримує ініціали користувача для аватара-заглушки
 * @param {string} name - Ім'я користувача
 * @returns {string} - Ініціали (наприклад: "JD" для John Doe)
 */
export const getUserInitials = (name) => {
  if (!name) return '?';
  
  const parts = name.trim().split(' ');
  if (parts.length === 1) {
    return parts[0].charAt(0).toUpperCase();
  }
  
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
};
