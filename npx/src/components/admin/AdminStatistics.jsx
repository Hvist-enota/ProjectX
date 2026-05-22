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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadStatistics();
    // Оновлювати статистику кожні 30 секунд
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

      // Підрахунок онлайн користувачів (активних за останні 5 хвилин)
      const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
      const onlineCount = users.filter(user => {
        const lastActive = user.lastActive ? new Date(user.lastActive) : null;
        return lastActive && lastActive > fiveMinutesAgo;
      }).length;

      // Підрахунок подій
      const now = new Date();
      const activeEvents = events.filter(event => {
        const eventDate = new Date(event.date);
        const eventEndDate = event.endDate ? new Date(event.endDate) : eventDate;
        return eventDate <= now && eventEndDate >= now;
      });

      const pastEvents = events.filter(event => {
        const eventEndDate = event.endDate ? new Date(event.endDate) : new Date(event.date);
        return eventEndDate < now;
      });

      const upcomingEvents = events.filter(event => {
        const eventDate = new Date(event.date);
        return eventDate > now;
      });

      setStatistics({
        onlineUsers: onlineCount,
        totalUsers: users.length,
        activeEvents: activeEvents.length,
        pastEvents: pastEvents.length,
        upcomingEvents: upcomingEvents.length
      });
      setError(null);
    } catch (err) {
      console.error('Failed to load statistics:', err);
      setError('Не вдалося завантажити статистику');
    } finally {
      setLoading(false);
    }
  };

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

      <div className="admin-stats-grid">
        {/* Користувачі онлайн */}
        <div className="admin-stat-card success">
          <div className="admin-stat-icon success">
            🟢
          </div>
          <div className="admin-stat-content">
            <h3>{statistics.onlineUsers}</h3>
            <p>Користувачів онлайн</p>
            <small className="stat-subtitle">Активні за останні 5 хвилин</small>
          </div>
        </div>

        {/* Всього користувачів */}
        <div className="admin-stat-card primary">
          <div className="admin-stat-icon primary">
            👥
          </div>
          <div className="admin-stat-content">
            <h3>{statistics.totalUsers}</h3>
            <p>Всього користувачів</p>
            <small className="stat-subtitle">Зареєстровано в системі</small>
          </div>
        </div>

        {/* Активні події */}
        <div className="admin-stat-card warning">
          <div className="admin-stat-icon warning">
            ⏰
          </div>
          <div className="admin-stat-content">
            <h3>{statistics.activeEvents}</h3>
            <p>Активні події</p>
            <small className="stat-subtitle">Зараз відбуваються</small>
          </div>
        </div>

        {/* Майбутні події */}
        <div className="admin-stat-card info">
          <div className="admin-stat-icon info">
            📅
          </div>
          <div className="admin-stat-content">
            <h3>{statistics.upcomingEvents}</h3>
            <p>Майбутні події</p>
            <small className="stat-subtitle">Заплановані події</small>
          </div>
        </div>

        {/* Минулі події */}
        <div className="admin-stat-card secondary">
          <div className="admin-stat-icon secondary">
            ✅
          </div>
          <div className="admin-stat-content">
            <h3>{statistics.pastEvents}</h3>
            <p>Минулі події</p>
            <small className="stat-subtitle">Завершені події</small>
          </div>
        </div>

        {/* Відсоток онлайн користувачів */}
        <div className="admin-stat-card danger">
          <div className="admin-stat-icon danger">
            📈
          </div>
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

      {/* Детальна інформація */}
      <div className="admin-card mt-4">
        <div className="admin-card-header">
          <h3>📋 Детальна статистика</h3>
        </div>
        <div className="admin-card-body">
          <div className="statistics-details">
            <div className="stat-detail-section">
              <h4>👥 Користувачі</h4>
              <ul className="stat-detail-list">
                <li>
                  <span className="stat-label">Онлайн зараз:</span>
                  <span className="stat-value text-success">{statistics.onlineUsers}</span>
                </li>
                <li>
                  <span className="stat-label">Офлайн:</span>
                  <span className="stat-value">{statistics.totalUsers - statistics.onlineUsers}</span>
                </li>
                <li>
                  <span className="stat-label">Всього зареєстровано:</span>
                  <span className="stat-value text-primary">{statistics.totalUsers}</span>
                </li>
              </ul>
            </div>

            <div className="stat-detail-section">
              <h4>📅 Події</h4>
              <ul className="stat-detail-list">
                <li>
                  <span className="stat-label">Активні події:</span>
                  <span className="stat-value text-warning">{statistics.activeEvents}</span>
                </li>
                <li>
                  <span className="stat-label">Майбутні події:</span>
                  <span className="stat-value text-info">{statistics.upcomingEvents}</span>
                </li>
                <li>
                  <span className="stat-label">Минулі події:</span>
                  <span className="stat-value text-secondary">{statistics.pastEvents}</span>
                </li>
                <li>
                  <span className="stat-label">Всього подій:</span>
                  <span className="stat-value text-primary">
                    {statistics.activeEvents + statistics.pastEvents + statistics.upcomingEvents}
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Легенда */}
      <div className="admin-alert admin-alert-info mt-3">
        <strong>ℹ️ Примітка:</strong> Користувачі вважаються онлайн, якщо вони були активні протягом останніх 5 хвилин. 
        Статистика автоматично оновлюється кожні 30 секунд.
      </div>
    </div>
  );
}
