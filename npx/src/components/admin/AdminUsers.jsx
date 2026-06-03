import { useEffect, useState } from 'react';
import * as userService from '../../services/userService';
import { Modal, Button, Form } from 'react-bootstrap';
import '../../styles/admin.css';
import apiClient from '../../api/axiosConfig';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [showRolesModal, setShowRolesModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedRoles, setSelectedRoles] = useState([]);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const availableRoles = [
    { name: 'Administrator' },
    { name: 'User' }
  ];

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await userService.getAllUsers();
      setUsers(data);
      setError(null);
    } catch (err) {
      console.error('Failed to load users:', err);
      setError('Не вдалося завантажити користувачів');
    } finally {
      setLoading(false);
    }
  };

  const handleEditRoles = (user) => {
    setSelectedUser(user);
    setSelectedRoles(user.roles?.map(r => r.name) || []);
    setShowRolesModal(true);
  };

  const handleRoleToggle = (roleName) => {
    setSelectedRoles(prev => {
      if (prev.includes(roleName)) {
        return prev.filter(r => r !== roleName);
      } else {
        return [...prev, roleName];
      }
    });
  };

  const handleSaveRoles = async () => {
    try {
      const roles = selectedRoles.map(name => ({ name }));
      await userService.updateUserRoles(selectedUser.id, roles);
      setSuccess('Ролі успішно оновлено!');
      setShowRolesModal(false);
      await loadUsers();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error('Failed to update roles:', err);
      setError('Не вдалося оновити ролі');
    }
  };

  const handleDelete = async (userId) => {
    try {
      await userService.deleteUser(userId);
      setSuccess('Користувача успішно видалено!');
      setDeleteConfirm(null);
      await loadUsers();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error('Failed to delete user:', err);
      setError('Не вдалося видалити користувача');
    }
  };

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="admin-spinner"></div>
        Завантаження користувачів...
      </div>
    );
  }

  return (
    <div>
      <div className="admin-header">
        <h2>👥 Користувачі</h2>
        <p>Керуйте користувачами та їх ролями</p>
      </div>

      {error && (
        <div className="admin-alert admin-alert-error">
          ⚠️ {error}
        </div>
      )}

      {success && (
        <div className="admin-alert admin-alert-success">
          ✅ {success}
        </div>
      )}

      <div className="admin-card">
        <div className="admin-card-header">
          <h3 className="admin-card-title">Список користувачів ({users.length})</h3>
        </div>

        {users.length === 0 ? (
          <div className="admin-empty-state">
            <div className="admin-empty-icon">👥</div>
            <h3 className="admin-empty-title">Немає користувачів</h3>
            <p className="admin-empty-text">Користувачі з'являться після реєстрації</p>
          </div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Користувач</th>
                <th>Email</th>
                <th>Ролі</th>
                <th style={{ width: '250px', textAlign: 'center' }}>Дії</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      {user.image?.filePath ? (
                        <img 
                          src={`${apiClient.defaults.baseURL}/images/userImages/${user.image.filePath}`} 
                          alt={user.name}
                          style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '50%',
                            objectFit: 'cover',
                            border: '2px solid #e0e6ed'
                          }}
                        />
                      ) : (
                        <div style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: '50%',
                          background: 'linear-gradient(135deg, #1976d2, #1565c0)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'white',
                          fontWeight: 'bold',
                          fontSize: '1.2rem'
                        }}>
                          {user.name?.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <strong>{user.name}</strong>
                    </div>
                  </td>
                  <td>{user.email}</td>
                  <td>
                    <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
                      {user.roles?.map((role, idx) => (
                        <span 
                          key={idx}
                          className={`admin-badge ${
                            role.name === 'Administrator' ? 'admin-badge-danger' : 'admin-badge-info'
                          }`}
                        >
                          {role.name === 'Administrator' ? '👑 ' : ''}
                          {role.name}
                        </span>
                      ))}
                      {(!user.roles || user.roles.length === 0) && (
                        <span className="admin-badge admin-badge-warning">Немає ролей</span>
                      )}
                    </div>
                  </td>
                  <td>
                    <div className="d-flex gap-2 justify-content-center">
                      <button 
                        className="admin-btn admin-btn-warning admin-btn-sm"
                        onClick={() => handleEditRoles(user)}
                      >
                        🔐 Ролі
                      </button>
                      <button 
                        className="admin-btn admin-btn-danger admin-btn-sm"
                        onClick={() => setDeleteConfirm(user.id)}
                      >
                        🗑️ Видалити
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Edit Roles Modal */}
      <Modal show={showRolesModal} onHide={() => setShowRolesModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>🔐 Керування ролями користувача</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedUser && (
            <>
              <div className="mb-4">
                <h6 className="text-muted">Користувач:</h6>
                <h5>{selectedUser.name}</h5>
                <p className="text-muted mb-0">{selectedUser.email}</p>
              </div>

              <div>
                <h6 className="mb-3">Виберіть ролі:</h6>
                {availableRoles.map((role) => (
                  <Form.Check
                    key={role.name}
                    type="checkbox"
                    id={`role-${role.name}`}
                    label={role.name === 'Administrator' ? '👑 ' + role.name : role.name}
                    checked={selectedRoles.includes(role.name)}
                    onChange={() => handleRoleToggle(role.name)}
                    className="mb-2"
                  />
                ))}
              </div>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowRolesModal(false)}>
            Скасувати
          </Button>
          <Button variant="primary" onClick={handleSaveRoles}>
            Зберегти
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal show={!!deleteConfirm} onHide={() => setDeleteConfirm(null)} centered>
        <Modal.Header closeButton>
          <Modal.Title>⚠️ Підтвердження видалення</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Ви впевнені, що хочете видалити цього користувача?</p>
          <p className="text-danger mb-0">
            <strong>Увага:</strong> Цю дію неможливо скасувати!
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setDeleteConfirm(null)}>
            Скасувати
          </Button>
          <Button 
            variant="danger" 
            onClick={() => handleDelete(deleteConfirm)}
          >
            Видалити
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
