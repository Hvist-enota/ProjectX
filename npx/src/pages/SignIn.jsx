import { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { Alert } from 'react-bootstrap';

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const success = await login(email, password);
      if (success) navigate('/');
    } catch {
      setError('Неправильні облікові дані');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-4 d-flex justify-content-center align-items-center min-vh-100">
      <div className="card shadow-sm w-100" style={{ maxWidth: '400px' }}>
        <div className="card-header bg-info text-white text-center py-3">
          <h5 className="mb-0">Вхід до системи</h5>
        </div>
        <div className="card-body p-3">
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
            <div className="d-grid mb-3">
              <button type="submit" className="btn btn-outline-info" disabled={loading}>
                {loading && (
                  <span className="spinner-border spinner-border-sm me-2" role="status" />
                )}
                Увійти
              </button>
            </div>
          </form>
          <div className="text-center">
            <small>
              Не маєте акаунта? <Link to="/signup" className="text-decoration-none">Реєстрація</Link>
            </small>
          </div>
        </div>
      </div>
    </div>
  );
}
