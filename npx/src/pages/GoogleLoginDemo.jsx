// src/pages/GoogleLoginDemo.jsx
import { useState, useEffect } from 'react';
import GoogleLogin from '../components/GoogleLogin';
import GoogleUserProfile from '../components/GoogleUserProfile';

/**
 * Demo сторінка для тестування Google Login
 */
export default function GoogleLoginDemo() {
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Перевірити чи є збережений токен
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
    }
    setIsLoading(false);
  }, []);

  const handleLoginSuccess = ({ token, user }) => {
    console.log('Login successful!');
    console.log('Token:', token);
    console.log('User:', user);
    setToken(token);
  };

  const handleLoginError = (error) => {
    console.error('Login failed:', error);
  };

  const handleLogout = () => {
    setToken(null);
  };

  if (isLoading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Завантаження...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="text-center mb-5">
        <h1 className="mb-3">Google Authentication Demo</h1>
        <p className="text-muted">
          Тестування Google Sign-In з Firebase і Backend JWT
        </p>
      </div>

      {!token ? (
        <div style={{ maxWidth: '400px', margin: '0 auto' }}>
          <div className="card shadow-sm">
            <div className="card-body">
              <h5 className="card-title text-center mb-4">Увійти в систему</h5>
              <GoogleLogin 
                onSuccess={handleLoginSuccess}
                onError={handleLoginError}
              />
            </div>
          </div>
          
          <div className="mt-4 text-center">
            <small className="text-muted">
              ℹ️ Натисніть кнопку вище для входу через Google
            </small>
          </div>
        </div>
      ) : (
        <GoogleUserProfile 
          token={token}
          onLogout={handleLogout}
        />
      )}
    </div>
  );
}
