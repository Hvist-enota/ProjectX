import { useEffect, useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import * as eventService from '../../services/eventService';
import '../../styles/admin.css';

export default function AdminEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [location, setLocation] = useState('');
  const [imageFile, setImageFile] = useState(null);
  
  // Edit State
  const [modalType, setModalType] = useState('create');
  const [currentEventId, setCurrentEventId] = useState(null);

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      setLoading(true);
      const data = await eventService.getAllEvents();
      setEvents(data);
    } catch (error) {
      console.error('Failed to load events:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseAddModal = () => {
    setShowAddModal(false);
    setTitle('');
    setDescription('');
    setEventDate('');
    setLocation('');
    setImageFile(null);
    setCurrentEventId(null);
    setModalType('create');
  };

  const handleEditClick = (event) => {
    const eventDateStr = event.EventDate || event.eventDate || event.date;
    const eventTitle = event.Title || event.title || '';
    const eventDesc = event.Description || event.description || '';
    const eventLoc = event.Location || event.location || '';
    const dateObj = new Date(eventDateStr);
    
    // Format date for datetime-local input (YYYY-MM-DDThh:mm)
    const tzOffset = dateObj.getTimezoneOffset() * 60000;
    const localISOTime = new Date(dateObj - tzOffset).toISOString().slice(0, 16);

    setTitle(eventTitle);
    setDescription(eventDesc);
    setEventDate(localISOTime);
    setLocation(eventLoc);
    setCurrentEventId(event.id);
    setImageFile(null);
    setModalType('edit');
    setShowAddModal(true);
  };

  const handleDeleteClick = async (eventId) => {
    if (window.confirm('Ви впевнені, що хочете видалити цю подію?')) {
      try {
        await eventService.deleteEvent(eventId);
        loadEvents();
      } catch (error) {
        console.error('Failed to delete event:', error);
        alert('Помилка при видаленні події');
      }
    }
  };

  const handleAddEvent = async (e) => {
    e.preventDefault();
    if (!title || !description || !eventDate) {
      alert('Будь ласка, заповніть обов\'язкові поля');
      return;
    }
    
    try {
      setIsSubmitting(true);
      const payload = {
        title: title,
        description: description,
        eventDate: new Date(eventDate).toISOString(),
        location: location
      };

      let savedEvent;
      if (modalType === 'create') {
        savedEvent = await eventService.createEvent(payload);
        alert('Подію успішно додано!');
      } else {
        savedEvent = await eventService.updateEvent(currentEventId, payload);
        alert('Подію успішно оновлено!');
      }

      const eventIdToUpload = modalType === 'create' ? savedEvent.id : currentEventId;

      if (imageFile) {
        await eventService.uploadEventImage(eventIdToUpload, imageFile);
      }

      handleCloseAddModal();
      loadEvents();
    } catch (error) {
      console.error('Failed to save event:', error);
      alert('Сталася помилка при збереженні події');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="admin-spinner"></div>
        Завантаження подій...
      </div>
    );
  }

  return (
    <div>
      <div className="admin-header">
        <h2>📅 Події</h2>
        <p>Керуйте церковними подіями та заходами</p>
      </div>

      <div className="admin-card">
        <div className="admin-card-header">
          <h3 className="admin-card-title">Список подій</h3>
          <button 
            className="admin-btn admin-btn-primary admin-btn-sm"
            onClick={() => setShowAddModal(true)}
          >
            ➕ Додати подію
          </button>
        </div>

        {events.length === 0 ? (
          <div className="admin-empty-state">
            <div className="admin-empty-icon">📅</div>
            <h3 className="admin-empty-title">Немає подій</h3>
            <p className="admin-empty-text">Почніть додавати події для вашої церкви</p>
          </div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Назва</th>
                <th>Дата події</th>
                <th>Статус</th>
                <th>Дії</th>
              </tr>
            </thead>
            <tbody>
              {events.map(event => {
                const eventDateStr = event.EventDate || event.eventDate || event.date;
                const eventTitle = event.Title || event.title || 'Без назви';
                const eventDate = new Date(eventDateStr);
                const isPast = eventDate < new Date();
                return (
                  <tr key={event.id}>
                    <td><strong>{eventTitle}</strong></td>
                    <td>{eventDate.toLocaleDateString('uk-UA')}</td>
                    <td>
                      <span className={`admin-badge ${isPast ? 'admin-badge-danger' : 'admin-badge-success'}`}>
                        {isPast ? 'Минула' : 'Майбутня'}
                      </span>
                    </td>
                    <td>
                      <div className="d-flex gap-2">
                        <button 
                          className="admin-btn admin-btn-warning admin-btn-sm"
                          onClick={() => handleEditClick(event)}
                        >
                          ✏️ Редагувати
                        </button>
                        <button 
                          className="admin-btn admin-btn-danger admin-btn-sm"
                          onClick={() => handleDeleteClick(event.id)}
                        >
                          🗑️ Видалити
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Модальне вікно для додавання/редагування події */}
      <Modal show={showAddModal} onHide={handleCloseAddModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>{modalType === 'create' ? 'Додати нову подію' : 'Редагувати подію'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleAddEvent}>
            <Form.Group className="mb-3">
              <Form.Label>Назва події *</Form.Label>
              <Form.Control 
                type="text" 
                placeholder="Введіть назву" 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required 
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Дата та час події *</Form.Label>
              <Form.Control 
                type="datetime-local" 
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
                required 
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Місце проведення</Form.Label>
              <Form.Control 
                type="text" 
                placeholder="Введіть місце або адресу" 
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label>Опис *</Form.Label>
              <Form.Control 
                as="textarea" 
                rows={4}
                placeholder="Детальний опис події" 
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required 
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Фотографія</Form.Label>
              <Form.Control
                type="file"
                accept="image/*"
                onChange={(e) => setImageFile(e.target.files[0])}
              />
              <Form.Text className="text-muted">
                Виберіть зображення для події.
              </Form.Text>
            </Form.Group>

            <div className="d-flex justify-content-end gap-2">
              <Button variant="secondary" onClick={handleCloseAddModal}>
                Скасувати
              </Button>
              <Button variant="primary" type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Збереження...' : (modalType === 'create' ? 'Додати подію' : 'Зберегти зміни')}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
}