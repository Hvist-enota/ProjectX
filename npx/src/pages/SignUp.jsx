import { useState, useContext } from 'react';
import { signUp } from '../services/authService';
import { Link, useNavigate } from 'react-router-dom';
import { Alert, Button } from 'react-bootstrap';
import { AuthContext } from '../context/AuthContext';
import '../styles/auth.css';

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
      await signUp(email, password, name);
      navigate('/signin');
    } catch {
      setError('Не вдалося зареєструватись. Можливо, користувач з таким email вже існує.');
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
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h3>Створення акаунта</h3>
        </div>
        <div className="auth-body">
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
                id="floatingConfirmPassword"
                placeholder="Підтвердіть пароль"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <label htmlFor="floatingConfirmPassword">Підтвердіть пароль</label>
            </div>
            <div className="d-grid mb-3">
              <Button type="submit" className="auth-btn auth-btn-primary" disabled={loading}>
                {loading ? (
                  <span className="spinner-border spinner-border-sm" role="status" />
                ) : (
                  'Зареєструватись'
                )}
              </Button>
            </div>
          </form>
          
          <div className="auth-divider">або</div>

          <div className="d-grid mb-3">
            <Button onClick={handleGoogleSignIn} className="auth-btn auth-btn-google" disabled={loading}>
              <img src="https://img.icons8.com/color/16/000000/google-logo.png" alt="Google" className="me-2"/>
              Продовжити з Google
            </Button>
          </div>

          <div className="auth-footer">
            <p>Вже маєте акаунт? <Link to="/signin">Увійдіть</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
}
