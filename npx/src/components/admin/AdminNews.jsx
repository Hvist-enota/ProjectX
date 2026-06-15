import { useEffect, useState } from 'react';
import * as newsService from '../../services/newsService';
import { format, parseISO } from 'date-fns';
import { uk } from 'date-fns/locale';
import { Modal, Button, Form, Alert } from 'react-bootstrap';
import '../../styles/admin.css';

export default function AdminNews() {
  const [newsList, setNewsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('create');
  const [currentNews, setCurrentNews] = useState({
    title: '',
    content: '',
    publishDate: format(new Date(), 'yyyy-MM-dd')
  });
  const [currentNewsId, setCurrentNewsId] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    loadNews();
  }, []);

  const loadNews = async () => {
    try {
      setLoading(true);
      const data = await newsService.getAllNews();
      setNewsList(data);
      setError(null);
    } catch (err) {
      console.error("Failed to load news:", err);
      setError("Не вдалося завантажити новини");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentNews(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (validationErrors[name]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!currentNews.title.trim()) errors.title = "Заголовок обов'язковий";
    if (!currentNews.content.trim()) errors.content = "Контент обов'язковий";
    if (!currentNews.publishDate) errors.publishDate = "Дата публікації обов'язкова";
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      const payload = {
        title: currentNews.title,
        content: currentNews.content,
        publishDate: new Date(currentNews.publishDate).toISOString()
      };

      let savedNews;
      if (modalType === 'create') {
        savedNews = await newsService.createNews(payload);
      } else {
        savedNews = await newsService.updateNews(currentNewsId, payload);
      }

      const newsId = modalType === 'create' ? savedNews.id : currentNewsId;
      
      if (imageFile) {
        await newsService.uploadNewsImage(newsId, imageFile);
      }

      setShowModal(false);
      await loadNews();
    } catch (err) {
      console.error("Failed to save news:", err);
      setError("Не вдалося зберегти новину");
    }
  };

  const handleEdit = (news) => {
    setCurrentNews({
      title: news.title,
      content: news.content,
      publishDate: format(parseISO(news.publishDate), 'yyyy-MM-dd')
    });
    setCurrentNewsId(news.id);
    setImageFile(null);
    setModalType('edit');
    setShowModal(true);
  };

  const handleCreate = () => {
    setCurrentNews({
      title: '',
      content: '',
      publishDate: format(new Date(), 'yyyy-MM-dd')
    });
    setCurrentNewsId(null);
    setImageFile(null);
    setModalType('create');
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    try {
      await newsService.deleteNews(id);
      setDeleteConfirm(null);
      await loadNews();
    } catch (err) {
      console.error("Failed to delete news:", err);
      setError("Не вдалося видалити новину");
    }
  };

  const formatDate = (dateString) => {
    try {
      return format(parseISO(dateString), 'd MMMM yyyy', { locale: uk });
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Некоректна дата";
    }
  };

  return (
    <div>
      <div className="admin-header">
        <h2>📰 Новини</h2>
        <p>Керуйте новинами вашої церкви</p>
      </div>

      {error && (
        <div className="admin-alert admin-alert-error">
          ⚠️ {error}
        </div>
      )}

      <div className="admin-card">
        <div className="admin-card-header">
          <h3 className="admin-card-title">Список новин</h3>
          <button 
            className="admin-btn admin-btn-primary admin-btn-sm" 
            onClick={handleCreate}
          >
            ➕ Додати новину
          </button>
        </div>
        
        {loading ? (
          <div className="admin-loading">
            <div className="admin-spinner"></div>
            Завантаження новин...
          </div>
        ) : newsList.length === 0 ? (
          <div className="admin-empty-state">
            <div className="admin-empty-icon">📰</div>
            <h3 className="admin-empty-title">Немає новин</h3>
            <p className="admin-empty-text">Почніть додавати новини для вашої церкви</p>
          </div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Заголовок</th>
                <th>Дата публікації</th>
                <th style={{ width: '200px', textAlign: 'center' }}>Дії</th>
              </tr>
            </thead>
            <tbody>
              {newsList.map(news => (
                <tr key={news.id}>
                  <td><strong>{news.title}</strong></td>
                  <td>{formatDate(news.publishDate)}</td>
                  <td>
                    <div className="d-flex gap-2 justify-content-center">
                      <button 
                        className="admin-btn admin-btn-warning admin-btn-sm"
                        onClick={() => handleEdit(news)}
                      >
                        ✏️ Редагувати
                      </button>
                      <button 
                        className="admin-btn admin-btn-danger admin-btn-sm"
                        onClick={() => setDeleteConfirm(news.id)}
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

      {/* Create/Edit Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>
            {modalType === 'create' ? 'Додати новину' : 'Редагувати новину'}
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Заголовок</Form.Label>
              <Form.Control
                type="text"
                name="title"
                value={currentNews.title}
                onChange={handleInputChange}
                isInvalid={!!validationErrors.title}
              />
              <Form.Control.Feedback type="invalid">
                {validationErrors.title}
              </Form.Control.Feedback>
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Контент</Form.Label>
              <Form.Control
                as="textarea"
                rows={5}
                name="content"
                value={currentNews.content}
                onChange={handleInputChange}
                isInvalid={!!validationErrors.content}
              />
              <Form.Control.Feedback type="invalid">
                {validationErrors.content}
              </Form.Control.Feedback>
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Дата публікації</Form.Label>
              <Form.Control
                type="date"
                name="publishDate"
                value={currentNews.publishDate}
                onChange={handleInputChange}
                isInvalid={!!validationErrors.publishDate}
              />
              <Form.Control.Feedback type="invalid">
                {validationErrors.publishDate}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Фотографія</Form.Label>
              <Form.Control
                type="file"
                accept="image/*"
                onChange={(e) => setImageFile(e.target.files[0])}
              />
              <Form.Text className="text-muted">
                Виберіть зображення, щоб додати або оновити фотографію новини.
              </Form.Text>
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
          Ви впевнені, що хочете видалити цю новину? Цю дію неможливо скасувати.
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