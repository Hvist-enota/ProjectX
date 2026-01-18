import { useEffect, useState } from 'react';
import * as eventService from '../../services/eventService';
import '../../styles/admin.css';

export default function AdminEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

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
          <button className="admin-btn admin-btn-primary admin-btn-sm">
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
                const eventDate = new Date(event.eventDate);
                const isPast = eventDate < new Date();
                return (
                  <tr key={event.id}>
                    <td><strong>{event.title}</strong></td>
                    <td>{eventDate.toLocaleDateString('uk-UA')}</td>
                    <td>
                      <span className={`admin-badge ${isPast ? 'admin-badge-danger' : 'admin-badge-success'}`}>
                        {isPast ? 'Минула' : 'Майбутня'}
                      </span>
                    </td>
                    <td>
                      <div className="d-flex gap-2">
                        <button className="admin-btn admin-btn-warning admin-btn-sm">
                          ✏️ Редагувати
                        </button>
                        <button className="admin-btn admin-btn-danger admin-btn-sm">
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
    </div>
  );
}