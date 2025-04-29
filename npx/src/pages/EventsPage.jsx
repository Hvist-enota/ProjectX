import { useEffect, useState } from "react";
import { getAllEvents, searchEventsByTitle } from "../services/eventService";
import { format } from 'date-fns';
import { uk } from 'date-fns/locale';

const EventsPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const data = await getAllEvents();
      setEvents(data);
      setError(null);
    } catch (err) {
      console.error("Failed to fetch events:", err);
      setError("Не вдалося завантажити події. Будь ласка, спробуйте пізніше.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) {
      fetchEvents();
      return;
    }

    try {
      setLoading(true);
      const data = await searchEventsByTitle(searchTerm);
      setEvents(Array.isArray(data) ? data : [data]);
      setError(null);
    } catch (err) {
      console.error("Search failed:", err);
      setError("Не вдалося знайти події за вашим запитом.");
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  const formatEventDate = (dateString) => {
    try {
      if (!dateString) return "Дата буде оголошена";
      
      const date = new Date(dateString);
      
      if (isNaN(date.getTime())) {
        console.warn("Invalid date:", dateString);
        return "Некоректна дата";
      }
      
      return format(date, "d MMMM yyyy, HH:mm", { locale: uk });
    } catch (error) {
      console.error("Date formatting error:", error);
      return "Помилка форматування дати";
    }
  };

  return (
    <section className="container py-5 events-page">
      <div className="text-center mb-5">
        <h1 className="display-4 fw-bold text-primary">Події нашої громади</h1>
        <p className="lead text-muted">Долучайтеся до наших духовних та культурних заходів</p>
      </div>

      <div className="row justify-content-center mb-4">
        <div className="col-md-8">
          <form onSubmit={handleSearch} className="shadow-sm">
            <div className="input-group">
              <input
                type="text"
                className="form-control form-control-lg"
                placeholder="Пошук подій за назвою..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button className="btn btn-primary btn-lg" type="submit">
                <i className="bi bi-search"></i> Пошук
              </button>
            </div>
          </form>
        </div>
      </div>

      {error && (
        <div className="alert alert-danger text-center">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Завантаження...</span>
          </div>
          <p className="mt-2">Завантаження подій...</p>
        </div>
      ) : events.length === 0 ? (
        <div className="text-center py-5">
          <h4 className="text-muted">Події не знайдено</h4>
          <p>Спробуйте змінити параметри пошуку</p>
        </div>
      ) : (
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
          {events.map((event) => (
            <div key={event.id} className="col">
              <div className="card h-100 shadow-sm border-0">
                <div className="card-header bg-primary text-white">
                  <h5 className="card-title mb-0">{event.Title}</h5>
                </div>
                <div className="card-body">
                  <p className="card-text text-muted">
                    <i className="bi bi-calendar-event me-2"></i>
                    {formatEventDate(event.EventDate)}
                  </p>
                  <p className="card-text text-muted">
                    <i className="bi bi-geo-alt me-2"></i>
                    {event.Location || "Місце проведення буде оголошено"}
                  </p>
                  <p className="card-text">{event.Description}</p>
                </div>
                <div className="card-footer bg-transparent border-0">
                  <button className="btn btn-outline-primary w-100">
                    Детальніше
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-5 pt-4 border-top">
        <h3 className="text-center mb-4">Регулярні богослужіння</h3>
        <div className="row justify-content-center">
          <div className="col-md-6">
            <ul className="list-group list-group-flush">
              <li className="list-group-item d-flex justify-content-between align-items-center">
                <span><i className="bi bi-sun me-2 text-warning"></i> Неділя</span>
                <span className="badge bg-primary rounded-pill">10:00</span>
              </li>
              <li className="list-group-item d-flex justify-content-between align-items-center">
                <span><i className="bi bi-moon me-2 text-info"></i> Середа</span>
                <span className="badge bg-primary rounded-pill">19:00</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EventsPage;