import { useEffect, useState } from 'react';
import * as newsService from '../../services/newsService';
import { format, parseISO } from 'date-fns';
import { uk } from 'date-fns/locale';
import { Modal, Button, Form, Alert } from 'react-bootstrap';

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

      if (modalType === 'create') {
        await newsService.createNews(payload);
      } else {
        await newsService.updateNews(currentNewsId, payload);
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
    <div className="card shadow-sm">
      <div className="card-header bg-white d-flex justify-content-between align-items-center">
        <h5 className="mb-0">Новини</h5>
        <button 
          className="btn btn-success btn-sm" 
          onClick={handleCreate}
        >
          + Додати новину
        </button>
      </div>
      
      <div className="card-body p-0">
        {error && (
          <Alert variant="danger" className="m-3">
            {error}
          </Alert>
        )}
        
        {loading ? (
          <div className="text-center p-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Завантаження...</span>
            </div>
          </div>
        ) : (
          <table className="table table-hover table-striped table-bordered mb-0">
            <thead className="table-light">
              <tr>
                <th>Заголовок</th>
                <th>Дата публікації</th>
                <th className="text-center" style={{ width: '120px' }}>Дії</th>
              </tr>
            </thead>
            <tbody>
              {newsList.map(news => (
                <tr key={news.id}>
                  <td>{news.title}</td>
                  <td>{formatDate(news.publishDate)}</td>
                  <td className="text-center">
                    <button 
                      className="btn btn-sm btn-outline-primary me-1"
                      onClick={() => handleEdit(news)}
                    >
                      <i className="bi bi-pencil"></i>
                    </button>
                    <button 
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => setDeleteConfirm(news.id)}
                    >
                      <i className="bi bi-trash"></i>
                    </button>
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