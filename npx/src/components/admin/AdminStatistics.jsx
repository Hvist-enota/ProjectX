import { useEffect, useState } from 'react';
import * as userService from '../../services/userService';
import * as eventService from '../../services/eventService';
import '../../styles/admin.css';

export default function AdminStatistics() {
  const [statistics, setStatistics] = useState({
    onlineUsers: 0,
    totalUsers: 0,
    activeEvents: 0,
    pastEvents: 0,
    upcomingEvents: 0
  });
  const [eventLists, setEventLists] = useState({
    active: [],
    upcoming: [],
    past: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('upcoming');

  useEffect(() => {
    loadStatistics();
    const interval = setInterval(loadStatistics, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadStatistics = async () => {
    try {
      setLoading(true);
      const [users, events] = await Promise.all([
        userService.getAllUsers(),
        eventService.getAllEvents()
      ]);

      const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
      const onlineCount = users.filter(user => {
        const lastActive = user.lastActive ? new Date(user.lastActive) : null;
        return lastActive && lastActive > fiveMinutesAgo;
      }).length;

      const now = new Date();

      const activeEvents = events.filter(event => {
        const eventDate = new Date(event.date);
        const eventEndDate = event.endDate ? new Date(event.endDate) : eventDate;
        return eventDate <= now && eventEndDate >= now;
      });

      const pastEvents = events.filter(event => {
        const eventEndDate = event.endDate ? new Date(event.endDate) : new Date(event.date);
        return eventEndDate < now;
      }).sort((a, b) => new Date(b.date) - new Date(a.date));

      const upcomingEvents = events.filter(event => {
        const eventDate = new Date(event.date);
        return eventDate > now;
      }).sort((a, b) => new Date(a.date) - new Date(b.date));

      setStatistics({
        onlineUsers: onlineCount,
        totalUsers: users.length,
        activeEvents: activeEvents.length,
        pastEvents: pastEvents.length,
        upcomingEvents: upcomingEvents.length
      });

      setEventLists({ active: activeEvents, upcoming: upcomingEvents, past: pastEvents });
      setError(null);
    } catch (err) {
      console.error('Failed to load statistics:', err);
      setError('Не вдалося завантажити статистику');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('uk-UA', {
      day: '2-digit', month: '2-digit', year: 'numeric'
    });
  };

  const formatTime = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleTimeString('uk-UA', {
      hour: '2-digit', minute: '2-digit'
    });
  };

  const EventTable = ({ events, emptyText }) => (
    events.length === 0 ? (
      <div className="admin-empty-state" style={{ padding: '30px', textAlign: 'center', color: 'var(--text-secondary)' }}>
        {emptyText}
      </div>
    ) : (
      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Назва події</th>
              <th>Дата</th>
              <th>Час</th>
              <th>Місце</th>
            </tr>
          </thead>
          <tbody>
            {events.map(event => (
              <tr key={event.id}>
                <td><strong>{event.title}</strong></td>
                <td>{formatDate(event.date)}</td>
                <td>{formatTime(event.date)}</td>
                <td>{event.location || '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  );

  if (loading && statistics.totalUsers === 0) {
    return (
      <div>
        <div className="admin-header">
          <h2>📊 Статистика</h2>
          <p>Аналітика активності сайту</p>
        </div>
        <div className="admin-loading">
          <div className="admin-spinner"></div>
          Завантаження статистики...
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="admin-header">
        <h2>📊 Статистика</h2>
        <p>Аналітика активності сайту</p>
        <div className="admin-header-actions">
          <button
            className="admin-btn admin-btn-primary admin-btn-sm"
            onClick={loadStatistics}
            disabled={loading}
          >
            {loading ? '🔄 Оновлення...' : '🔄 Оновити'}
          </button>
        </div>
      </div>

      {error && (
        <div className="admin-alert admin-alert-error">
          ⚠️ {error}
        </div>
      )}

      {/* Картки статистики */}
      <div className="admin-stats-grid">
        <div className="admin-stat-card success">
          <div className="admin-stat-icon success">🟢</div>
          <div className="admin-stat-content">
            <h3>{statistics.onlineUsers}</h3>
            <p>Користувачів онлайн</p>
            <small className="stat-subtitle">Активні за останні 5 хвилин</small>
          </div>
        </div>

        <div className="admin-stat-card primary">
          <div className="admin-stat-icon primary">👥</div>
          <div className="admin-stat-content">
            <h3>{statistics.totalUsers}</h3>
            <p>Всього користувачів</p>
            <small className="stat-subtitle">Зареєстровано в системі</small>
          </div>
        </div>

        <div className="admin-stat-card warning">
          <div className="admin-stat-icon warning">⏰</div>
          <div className="admin-stat-content">
            <h3>{statistics.activeEvents}</h3>
            <p>Активні події</p>
            <small className="stat-subtitle">Зараз відбуваються</small>
          </div>
        </div>

        <div className="admin-stat-card info">
          <div className="admin-stat-icon info">📅</div>
          <div className="admin-stat-content">
            <h3>{statistics.upcomingEvents}</h3>
            <p>Майбутні події</p>
            <small className="stat-subtitle">Заплановані події</small>
          </div>
        </div>

        <div className="admin-stat-card secondary">
          <div className="admin-stat-icon secondary">✅</div>
          <div className="admin-stat-content">
            <h3>{statistics.pastEvents}</h3>
            <p>Минулі події</p>
            <small className="stat-subtitle">Завершені події</small>
          </div>
        </div>

        <div className="admin-stat-card danger">
          <div className="admin-stat-icon danger">📈</div>
          <div className="admin-stat-content">
            <h3>
              {statistics.totalUsers > 0
                ? Math.round((statistics.onlineUsers / statistics.totalUsers) * 100)
                : 0}%
            </h3>
            <p>Активність</p>
            <small className="stat-subtitle">Відсоток онлайн користувачів</small>
          </div>
        </div>
      </div>

      {/* Таблиця подій з вкладками */}
      <div className="admin-card mt-4">
        <div className="admin-card-header">
          <h3>📅 Події</h3>
        </div>

        {/* Вкладки */}
        <div style={{ display: 'flex', borderBottom: '1px solid var(--admin-border)', padding: '0 20px' }}>
          {[
            { key: 'upcoming', label: `Майбутні (${statistics.upcomingEvents})`, color: '#3b82f6' },
            { key: 'active',   label: `Активні (${statistics.activeEvents})`,   color: '#f59e0b' },
            { key: 'past',     label: `Минулі (${statistics.pastEvents})`,       color: '#6b7280' }
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              style={{
                background: 'none',
                border: 'none',
                padding: '14px 20px',
                cursor: 'pointer',
                fontSize: '0.9rem',
                fontWeight: activeTab === tab.key ? '600' : '400',
                color: activeTab === tab.key ? tab.color : 'var(--admin-text-muted)',
                borderBottom: activeTab === tab.key ? `2px solid ${tab.color}` : '2px solid transparent',
                marginBottom: '-1px',
                transition: 'all 0.2s'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="admin-card-body" style={{ padding: '0' }}>
          {activeTab === 'upcoming' && (
            <EventTable events={eventLists.upcoming} emptyText="Немає запланованих подій" />
          )}
          {activeTab === 'active' && (
            <EventTable events={eventLists.active} emptyText="Зараз немає активних подій" />
          )}
          {activeTab === 'past' && (
            <EventTable events={eventLists.past} emptyText="Немає минулих подій" />
          )}
        </div>
      </div>

      <div className="admin-alert admin-alert-info mt-3">
        <strong>ℹ️ Примітка:</strong> Користувачі вважаються онлайн, якщо вони були активні протягом останніх 5 хвилин.
        Статистика автоматично оновлюється кожні 30 секунд.
      </div>
    </div>
  );
}
