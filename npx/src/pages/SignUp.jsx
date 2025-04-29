import { useState } from 'react';
import { signUp } from '../services/authService';
import { Link, useNavigate } from 'react-router-dom';
import { Alert } from 'react-bootstrap';

export default function SignUp() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

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
