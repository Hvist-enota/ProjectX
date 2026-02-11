import { useState, useContext } from 'react';
import { signUp } from '../services/authService';
import { Link, useNavigate } from 'react-router-dom';
import { Alert } from 'react-bootstrap';
import { AuthContext } from '../context/AuthContext';

export default function SignUp() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { loginWithGoogle } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Паролі не співпадають');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const result = await signUp(email, password, name);
      localStorage.setItem('token', result.token);
      navigate('/signin');
    } catch {
      setError('Не вдалося зареєструватись');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setLoading(true);

    try {
      const success = await loginWithGoogle();
      if (success) {
        navigate('/');
      } else {
        setError('Не вдалося увійти через Google');
      }
    } catch (error) {
      console.error('Google Sign In Error:', error);
      setError('Помилка при вході через Google');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-4 d-flex justify-content-center align-items-center min-vh-100">
      <div className="card shadow-sm w-100" style={{ maxWidth: '450px' }}>
        <div className="card-header bg-warning text-dark text-center py-3">
          <h5 className="mb-0">Реєстрація нового акаунта</h5>
        </div>
        <div className="card-body p-3">
          {error && <Alert variant="danger">{error}</Alert>}
          <form onSubmit={handleSubmit}>
            <div className="form-floating mb-3">
              <input
                type="text"
                className="form-control"
                id="floatingName"
                placeholder="Ім'я"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <label htmlFor="floatingName">Ім'я</label>
            </div>
            <div className="form-floating mb-3">
              <input
                type="email"
                className="form-control"
                id="floatingEmail"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <label htmlFor="floatingEmail">Email</label>
            </div>
            <div className="form-floating mb-3">
              <input
                type="password"
                className="form-control"
                id="floatingPassword"
                placeholder="Пароль"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <label htmlFor="floatingPassword">Пароль</label>
            </div>
            <div className="form-floating mb-4">
              <input
                type="password"
                className="form-control"
                id="floatingConfirm"
                placeholder="Підтвердження пароля"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <label htmlFor="floatingConfirm">Підтвердження пароля</label>
            </div>
            <div className="d-grid mb-3">
              <button type="submit" className="btn btn-outline-warning" disabled={loading}>
                {loading && (
                  <span className="spinner-border spinner-border-sm me-2" role="status" />
                )}
                Зареєструватись
              </button>
            </div>
          </form>

          <div className="text-center mb-3">
            <div className="d-flex align-items-center">
              <hr className="flex-grow-1" />
              <span className="px-3 text-muted">або</span>
              <hr className="flex-grow-1" />
            </div>
          </div>

          <div className="d-grid mb-3">
            <button 
              type="button" 
              className="btn btn-outline-danger d-flex align-items-center justify-content-center gap-2"
              onClick={handleGoogleSignIn}
              disabled={loading}
            >
              <svg width="18" height="18" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
              </svg>
              {loading ? 'Завантаження...' : 'Увійти через Google'}
            </button>
          </div>

          <div className="text-center">
            <small>
              Вже зареєстровані? <Link to="/signin" className="text-decoration-none">Увійти</Link>
            </small>
          </div>
        </div>
      </div>
    </div>
  );
}
