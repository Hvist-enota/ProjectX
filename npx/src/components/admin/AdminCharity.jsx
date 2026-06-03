import { useEffect, useState } from 'react';
import * as charityService from '../../services/charityInitiativeService';
import apiClient from '../../api/axiosConfig';
import { Modal, Button, Form } from 'react-bootstrap';
import '../../styles/admin.css';

export default function AdminCharity() {
  const [initiatives, setInitiatives] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('create');
  
  const [currentInitiative, setCurrentInitiative] = useState({
    title: '',
    description: '',
    targetAmount: '',
    currentAmount: '',
    isActive: true
  });
  
  const [currentId, setCurrentId] = useState(null);
  const [currentPhotoUrl, setCurrentPhotoUrl] = useState('');
  const [photoFile, setPhotoFile] = useState(null);
  
  const [validationErrors, setValidationErrors] = useState({});
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  useEffect(() => {
    loadInitiatives();
  }, []);

  const loadInitiatives = async () => {
    try {
      setLoading(true);
      const data = await charityService.getAllCharityInitiatives();
      setInitiatives(data);
      setError(null);
    } catch (err) {
      console.error("Failed to load initiatives:", err);
      setError("Не вдалося завантажити ініціативи");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCurrentInitiative(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    if (validationErrors[name]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setPhotoFile(e.target.files[0]);
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!currentInitiative.title.trim()) errors.title = "Заголовок обов'язковий";
    if (!currentInitiative.description.trim()) errors.description = "Опис обов'язковий";
    if (currentInitiative.targetAmount === '' || currentInitiative.targetAmount < 0) errors.targetAmount = "Цільова сума обов'язкова";
    if (currentInitiative.currentAmount === '' || currentInitiative.currentAmount < 0) errors.currentAmount = "Поточна сума обов'язкова";
    if (modalType === 'create' && !photoFile) errors.photoFile = "Фото обов'язкове";
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      const formData = new FormData();
      formData.append("title", currentInitiative.title);
      formData.append("description", currentInitiative.description);
      formData.append("targetAmount", currentInitiative.targetAmount);
      formData.append("currentAmount", currentInitiative.currentAmount);
      formData.append("isActive", currentInitiative.isActive);
      
      if (photoFile) {
        formData.append("photoFile", photoFile);
      }

      if (modalType === 'create') {
        await charityService.createCharityInitiative(formData);
      } else {
        await charityService.updateCharityInitiative(currentId, formData);
      }
      
      setShowModal(false);
      await loadInitiatives();
    } catch (err) {
      console.error("Failed to save initiative:", err);
      setError("Не вдалося зберегти ініціативу");
    }
  };

  const handleEdit = (initiative) => {
    setCurrentInitiative({
      title: initiative.title,
      description: initiative.description,
      targetAmount: initiative.targetAmount,
      currentAmount: initiative.currentAmount,
      isActive: initiative.isActive
    });
    setCurrentPhotoUrl(initiative.photoUrl);
    setPhotoFile(null);
    setCurrentId(initiative.id);
    setModalType('edit');
    setShowModal(true);
  };

  const handleCreate = () => {
    setCurrentInitiative({
      title: '',
      description: '',
      targetAmount: '',
      currentAmount: '',
      isActive: true
    });
    setCurrentPhotoUrl('');
    setPhotoFile(null);
    setCurrentId(null);
    setModalType('create');
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    try {
      await charityService.deleteCharityInitiative(id);
      setDeleteConfirm(null);
      await loadInitiatives();
    } catch (err) {
      console.error("Failed to delete initiative:", err);
      setError("Не вдалося видалити ініціативу");
    }
  };

  return (
    <div>
      <div className="admin-header">
        <h2>❤️ Благодійність</h2>
        <p>Керуйте благодійними ініціативами та зборами</p>
      </div>

      {error && (
        <div className="admin-alert admin-alert-error">
          ⚠️ {error}
        </div>
      )}

      <div className="admin-card">
        <div className="admin-card-header">
          <h3 className="admin-card-title">Список ініціатив</h3>
          <button 
            className="admin-btn admin-btn-primary admin-btn-sm" 
            onClick={handleCreate}
          >
            ➕ Додати ініціативу
          </button>
        </div>
        
        {loading ? (
          <div className="admin-loading">
            <div className="admin-spinner"></div>
            Завантаження...
          </div>
        ) : initiatives.length === 0 ? (
          <div className="admin-empty-state">
            <div className="admin-empty-icon">❤️</div>
            <h3 className="admin-empty-title">Немає ініціатив</h3>
            <p className="admin-empty-text">Почніть додавати благодійні ініціативи</p>
          </div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Фото</th>
                <th>Назва</th>
                <th>Ціль / Зібрано</th>
                <th>Статус</th>
                <th style={{ width: '200px', textAlign: 'center' }}>Дії</th>
              </tr>
            </thead>
            <tbody>
              {initiatives.map(item => (
                <tr key={item.id}>
                  <td>
                    <img 
                      src={item.photoUrl ? `${apiClient.defaults.baseURL}images/charity-initiatives/${item.photoUrl}` : ''} 
                      alt={item.title} 
                      style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px' }} 
                    />
                  </td>
                  <td><strong>{item.title}</strong></td>
                  <td>{item.targetAmount} ₴ / {item.currentAmount} ₴</td>
                  <td>
                    {item.isActive 
                      ? <span className="badge bg-success">Активно</span> 
                      : <span className="badge bg-secondary">Неактивно</span>}
                  </td>
                  <td>
                    <div className="d-flex gap-2 justify-content-center">
                      <button 
                        className="admin-btn admin-btn-warning admin-btn-sm"
                        onClick={() => handleEdit(item)}
                      >
                        ✏️
                      </button>
                      <button 
                        className="admin-btn admin-btn-danger admin-btn-sm"
                        onClick={() => setDeleteConfirm(item.id)}
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Create/Edit Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            {modalType === 'create' ? 'Додати ініціативу' : 'Редагувати ініціативу'}
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Назва ініціативи</Form.Label>
              <Form.Control
                type="text"
                name="title"
                value={currentInitiative.title}
                onChange={handleInputChange}
                isInvalid={!!validationErrors.title}
              />
              <Form.Control.Feedback type="invalid">
                {validationErrors.title}
              </Form.Control.Feedback>
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Опис</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                name="description"
                value={currentInitiative.description}
                onChange={handleInputChange}
                isInvalid={!!validationErrors.description}
              />
              <Form.Control.Feedback type="invalid">
                {validationErrors.description}
              </Form.Control.Feedback>
            </Form.Group>

            <div className="row">
              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label>Цільова сума (₴)</Form.Label>
                  <Form.Control
                    type="number"
                    name="targetAmount"
                    value={currentInitiative.targetAmount}
                    onChange={handleInputChange}
                    isInvalid={!!validationErrors.targetAmount}
                  />
                  <Form.Control.Feedback type="invalid">
                    {validationErrors.targetAmount}
                  </Form.Control.Feedback>
                </Form.Group>
              </div>
              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label>Зібрана сума (₴)</Form.Label>
                  <Form.Control
                    type="number"
                    name="currentAmount"
                    value={currentInitiative.currentAmount}
                    onChange={handleInputChange}
                    isInvalid={!!validationErrors.currentAmount}
                  />
                  <Form.Control.Feedback type="invalid">
                    {validationErrors.currentAmount}
                  </Form.Control.Feedback>
                </Form.Group>
              </div>
            </div>

            <Form.Group className="mb-3">
              <Form.Label>Фото</Form.Label>
              {currentPhotoUrl && (
                <div className="mb-2">
                  <img 
                    src={`${apiClient.defaults.baseURL}images/charity-initiatives/${currentPhotoUrl}`} 
                    alt="Preview" 
                    style={{ maxWidth: '200px', borderRadius: '8px' }} 
                  />
                </div>
              )}
              <Form.Control
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                isInvalid={!!validationErrors.photoFile}
              />
              <Form.Control.Feedback type="invalid">
                {validationErrors.photoFile}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Check
                type="switch"
                id="isActive-switch"
                label="Активна ініціатива"
                name="isActive"
                checked={currentInitiative.isActive}
                onChange={handleInputChange}
              />
            </Form.Group>

          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Скасувати
            </Button>
            <Button variant="primary" type="submit">
              Зберегти
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal show={!!deleteConfirm} onHide={() => setDeleteConfirm(null)}>
        <Modal.Header closeButton>
          <Modal.Title>Підтвердження видалення</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Ви впевнені, що хочете видалити цю ініціативу? Цю дію неможливо скасувати.
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
