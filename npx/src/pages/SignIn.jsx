import { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { Alert, Button } from 'react-bootstrap';
import '../styles/auth.css';

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login, loginWithGoogle } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const success = await login(email, password);
      if (success) navigate('/');
      else setError('Неправильні облікові дані');
    } catch {
      setError('Не вдалося увійти. Перевірте дані та спробуйте ще раз.');
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
          <h3>Вхід до системи</h3>
        </div>
        <div className="auth-body">
          {error && <Alert variant="danger">{error}</Alert>}
          <form onSubmit={handleSubmit}>
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
            <div className="form-floating mb-4">
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
            <div className="d-grid mb-3">
              <Button type="submit" className="auth-btn auth-btn-primary" disabled={loading}>
                {loading ? (
                  <span className="spinner-border spinner-border-sm" role="status" />
                ) : (
                  'Увійти'
                )}
              </Button>
            </div>
          </form>
          
          <div className="auth-divider">або</div>

          <div className="d-grid mb-3">
            <Button onClick={handleGoogleSignIn} className="auth-btn auth-btn-google" disabled={loading}>
              <img src="https://img.icons8.com/color/16/000000/google-logo.png" alt="Google" className="me-2"/>
              Увійти через Google
            </Button>
          </div>

          <div className="auth-footer">
            <p>Немає акаунта? <Link to="/signup">Зареєструйтесь</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
}
