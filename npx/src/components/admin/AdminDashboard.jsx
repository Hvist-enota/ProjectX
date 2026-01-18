import { useEffect, useState } from 'react';
import * as newsService from '../../services/newsService';
import * as eventService from '../../services/eventService';
import '../../styles/admin.css';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    newsCount: 0,
    eventsCount: 0
  });

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const [news, events] = await Promise.all([
        newsService.getAllNews(),
        eventService.getAllEvents()
      ]);
      setStats({
        newsCount: news.length,
        eventsCount: events.length
      });
    } catch (error) {
      console.error('Failed to load stats:', error);
    }
  };

  return (
    <div>
      <div className="admin-header">
        <h2>Вітаємо в адмін-панелі! 👋</h2>
        <p>Керуйте вмістом вашого сайту з єдиного місця</p>
      </div>

      <div className="admin-stats-grid">
        <div className="admin-stat-card primary">
          <div className="admin-stat-icon primary">
            📰
          </div>
          <div className="admin-stat-content">
            <h3>{stats.newsCount}</h3>
            <p>Всього новин</p>
          </div>
        </div>

        <div className="admin-stat-card success">
          <div className="admin-stat-icon success">
            📅
          </div>
          <div className="admin-stat-content">
            <h3>{stats.eventsCount}</h3>
            <p>Всього подій</p>
          </div>
        </div>

        <div className="admin-stat-card warning">
          <div className="admin-stat-icon warning">
            👥
          </div>
          <div className="admin-stat-content">
            <h3>1</h3>
            <p>Активних адмінів</p>
          </div>
        </div>

        <div className="admin-stat-card danger">
          <div className="admin-stat-icon danger">
            ⭐
          </div>
          <div className="admin-stat-content">
            <h3>100%</h3>
            <p>Відсоток успіху</p>
          </div>
        </div>
      </div>

      <div className="admin-card">
        <div className="admin-card-header">
          <h3 className="admin-card-title">Швидкі дії</h3>
        </div>
        <div className="d-flex gap-3">
          <a href="/admin/news" className="admin-btn admin-btn-primary">
            ➕ Додати новину
          </a>
          <a href="/admin/events" className="admin-btn admin-btn-success">
            📅 Додати подію
          </a>
        </div>
      </div>
    </div>
  );
}