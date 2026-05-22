import { useEffect, useState } from 'react';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import * as userService from '../services/userService';
import { Modal, Button, Form } from 'react-bootstrap';
import { getUserImageUrl, getUserInitials } from '../utils/imageHelper';
import '../styles/admin.css';
import '../styles/profile.css';
import '../styles/avatar.css';

export default function UserProfile() {
  const { user } = useContext(AuthContext);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    email: ''
  });
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    if (user?.id) {
      loadUserData();
    }
  }, [user]);

  const loadUserData = async () => {
    try {
      setLoading(true);
      const data = await userService.getUserById(user.id);
      console.log('API userData:', data); // Debug log
      console.log('JWT user:', user); // Debug log
      
      // Об'єднуємо дані з API та JWT токена
      // JWT токен містить photoUrl, який може відсутній в API відповіді
      const mergedData = {
        ...data,
        photoUrl: user.photoUrl || data.photoUrl, // Пріоритет JWT токену
        image: data.image // Локальне зображення з API
      };
      
      console.log('Merged userData:', mergedData); // Debug log
      setUserData(mergedData);
      setEditForm({
        name: data.name || '',
        email: data.email || ''
      });
      setError(null);
    } catch (err) {
      console.error('Failed to load user data:', err);
      setError('Не вдалося завантажити дані користувача');
    } finally {
      setLoading(false);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await userService.updateUser(user.id, editForm);
      setSuccess('Профіль успішно оновлено!');
      setShowEditModal(false);
      await loadUserData();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error('Failed to update user:', err);
      setError('Не вдалося оновити профіль');
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageUpload = async (e) => {
    e.preventDefault();
    if (!selectedImage) return;

    try {
      await userService.updateUserImage(user.id, selectedImage);
      setSuccess('Зображення успішно оновлено!');
      setShowImageModal(false);
      setSelectedImage(null);
      setImagePreview(null);
      await loadUserData();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error('Failed to upload image:', err);
      setError('Не вдалося завантажити зображення');
    }
  };

  if (loading) {
    return (
      <div className="profile-container">
        <div className="admin-loading">
          <div className="admin-spinner"></div>
          Завантаження профілю...
        </div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="profile-container">
        <div className="admin-alert admin-alert-error">
          ⚠️ Не вдалося завантажити дані користувача
        </div>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <div className="admin-header">
        <h2>👤 Мій профіль</h2>
        <p>Керуйте своїм обліковим записом</p>
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

      <div className="profile-card">
        <div className="profile-header-section">
          <div className="profile-image-wrapper">
            <div className="profile-avatar">
              {(() => {
                const imageUrl = getUserImageUrl(userData);
                const initials = getUserInitials(userData.name);
                
                console.log('Profile page - imageUrl:', imageUrl); // Debug log
                console.log('Profile page - userData:', userData); // Debug log
                
                if (imageUrl) {
                  return (
                    <>
                      <img 
                        src={imageUrl} 
                        alt={userData.name}
                        className="user-avatar avatar-lg"
                        referrerPolicy="no-referrer"
                        crossOrigin="anonymous"
                        onError={(e) => {
                          console.error('Image failed to load:', imageUrl); // Debug log
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                      <div className="user-avatar-placeholder avatar-lg" style={{ display: 'none' }}>
                        {initials}
                      </div>
                    </>
                  );
                }
                
                return (
                  <div className="user-avatar-placeholder avatar-lg">
                    {initials}
                  </div>
                );
              })()}
            </div>
            <button 
              className="profile-image-edit-btn"
              onClick={() => setShowImageModal(true)}
              title="Змінити фото"
            >
              📷
            </button>
          </div>

          <div className="profile-info-header">
            <h1 className="profile-name">{userData.name}</h1>
            <p className="profile-email">{userData.email}</p>
            <div className="profile-roles">
              {userData.roles?.map((role, index) => (
                <span key={index} className="profile-role-badge">
                  {role.name === 'Administrator' ? '👑 Адміністратор' : role.name}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="profile-details-section">
          <div className="profile-section-header">
            <h3>📋 Інформація профілю</h3>
            <button 
              className="admin-btn admin-btn-primary admin-btn-sm"
              onClick={() => setShowEditModal(true)}
            >
              ✏️ Редагувати
            </button>
          </div>

          <div className="profile-info-grid">
            <div className="profile-info-item">
              <label>Ім'я користувача</label>
              <div className="profile-info-value">{userData.name}</div>
            </div>

            <div className="profile-info-item">
              <label>Email</label>
              <div className="profile-info-value">{userData.email}</div>
            </div>

            <div className="profile-info-item">
              <label>ID користувача</label>
              <div className="profile-info-value profile-id">{userData.id}</div>
            </div>

            <div className="profile-info-item">
              <label>Ролі</label>
              <div className="profile-info-value">
                {userData.roles?.map(role => role.name).join(', ') || 'Немає ролей'}
              </div>
            </div>
          </div>
        </div>

        <div className="profile-stats-section">
          <h3>📊 Статистика</h3>
          <div className="profile-stats-grid">
            <div className="profile-stat-card">
              <div className="profile-stat-icon">📝</div>
              <div className="profile-stat-content">
                <h4>Останній вхід</h4>
                <p>Сьогодні</p>
              </div>
            </div>

            <div className="profile-stat-card">
              <div className="profile-stat-icon">🔐</div>
              <div className="profile-stat-content">
                <h4>Рівень доступу</h4>
                <p>Адміністратор</p>
              </div>
            </div>

            <div className="profile-stat-card">
              <div className="profile-stat-icon">⚡</div>
              <div className="profile-stat-content">
                <h4>Статус акаунту</h4>
                <p>Активний</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>✏️ Редагувати профіль</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleEditSubmit}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Ім'я користувача</Form.Label>
              <Form.Control
                type="text"
                value={editForm.name}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                placeholder="Введіть ім'я"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={editForm.email}
                onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                placeholder="Введіть email"
                required
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowEditModal(false)}>
              Скасувати
            </Button>
            <Button variant="primary" type="submit">
              Зберегти зміни
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Upload Image Modal */}
      <Modal show={showImageModal} onHide={() => setShowImageModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>📷 Змінити фото профілю</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleImageUpload}>
          <Modal.Body>
            <div className="image-upload-section">
              {imagePreview ? (
                <div className="image-preview">
                  <img src={imagePreview} alt="Preview" />
                </div>
              ) : userData.image?.filePath ? (
                <div className="image-preview">
                  <img src={userData.image.filePath} alt="Current" />
                </div>
              ) : (
                <div className="image-placeholder">
                  <div className="placeholder-icon">📷</div>
                  <p>Виберіть зображення</p>
                </div>
              )}

              <Form.Group className="mt-3">
                <Form.Label>Вибрати файл</Form.Label>
                <Form.Control
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  required
                />
                <Form.Text className="text-muted">
                  Формати: JPG, PNG, GIF. Макс. розмір: 5MB
                </Form.Text>
              </Form.Group>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => {
              setShowImageModal(false);
              setSelectedImage(null);
              setImagePreview(null);
            }}>
              Скасувати
            </Button>
            <Button variant="primary" type="submit" disabled={!selectedImage}>
              Завантажити
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
}
