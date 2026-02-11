// src/components/GoogleLogin.jsx
import { useState } from 'react';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../config/firebase';
import { jwtDecode } from 'jwt-decode';
import apiClient from '../api/axiosConfig';

/**
 * Компонент для Google Sign-In з кнопкою
 * @param {Function} onSuccess - Callback після успішного логіну
 * @param {Function} onError - Callback при помилці
 */
export default function GoogleLogin({ onSuccess, onError }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError(null);

    try {
      // 1. Логін через Google з Firebase
      const result = await signInWithPopup(auth, googleProvider);
      
      // 2. Отримати ID Token від Firebase
      const idToken = await result.user.getIdToken();
      
      // 3. Відправити idToken на бекенд для верифікації
      const response = await apiClient.post('/api/auth/firebase-login', { idToken });
      
      // 4. Отримати JWT токен від бекенду
      const jwtToken = response.data;
      
      if (!jwtToken || typeof jwtToken !== 'string') {
        throw new Error('Отримано невалідний токен від сервера');
      }
      
      // 5. Зберегти JWT токен в localStorage
      localStorage.setItem('token', jwtToken);
      
      // 6. Декодувати JWT токен
      const decoded = jwtDecode(jwtToken);
      
      // 7. Викликати callback з даними користувача
      if (onSuccess) {
        onSuccess({
          token: jwtToken,
          user: decoded
        });
      }
      
    } catch (err) {
      console.error('Google Sign-In error:', err);
      const errorMessage = err.message || 'Помилка при вході через Google';
      setError(errorMessage);
      
      if (onError) {
        onError(err);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="google-login-container">
      <button 
        type="button"
        className="btn btn-outline-danger d-flex align-items-center justify-content-center gap-2 w-100"
        onClick={handleGoogleSignIn}
        disabled={loading}
      >
        <svg width="18" height="18" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
          <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
          <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
          <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
          <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
        </svg>
        {loading ? (
          <>
            <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
            Завантаження...
          </>
        ) : (
          'Sign in with Google'
        )}
      </button>
      
      {error && (
        <div className="alert alert-danger mt-2 mb-0" role="alert">
          {error}
        </div>
      )}
    </div>
  );
}
