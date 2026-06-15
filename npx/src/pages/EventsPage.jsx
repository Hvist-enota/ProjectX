import { useEffect, useState } from "react";
import { getAllEvents, searchEventsByTitle } from "../services/eventService";
import { format } from 'date-fns';
import { uk } from 'date-fns/locale';

const EventsPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);

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
          {events.map((event) => {
            const eventTitle = event.Title || event.title || 'Без назви';
            const eventDateStr = event.EventDate || event.eventDate || event.date;
            const eventLocation = event.Location || event.location || "Місце проведення буде оголошено";
            const eventDescription = event.Description || event.description || "";
            
            return (
              <div key={event.id} className="col">
                <div className="card h-100 shadow-sm border-0">
                  {event.photoUrl && (
                    <img 
                      src={`${import.meta.env.VITE_API_URL || 'http://localhost:5132'}/images/eventImages/${event.photoUrl}`} 
                      className="card-img-top" 
                      alt={eventTitle} 
                      style={{ height: '200px', objectFit: 'cover' }}
                    />
                  )}
                  <div className="card-header bg-primary text-white">
                    <h5 className="card-title mb-0">{eventTitle}</h5>
                  </div>
                  <div className="card-body">
                    <p className="card-text text-muted">
                      <i className="bi bi-calendar-event me-2"></i>
                      {formatEventDate(eventDateStr)}
                    </p>
                    <p className="card-text text-muted">
                      <i className="bi bi-geo-alt me-2"></i>
                      {eventLocation}
                    </p>
                    <p className="card-text">
                      {eventDescription.length > 100 
                        ? `${eventDescription.substring(0, 100)}...` 
                        : eventDescription}
                    </p>
                  </div>
                  <div className="card-footer bg-transparent border-0">
                    <button 
                      className="btn btn-outline-primary w-100"
                      onClick={() => setSelectedEvent({
                        title: eventTitle,
                        date: formatEventDate(eventDateStr),
                        location: eventLocation,
                        description: eventDescription,
                        photoUrl: event.photoUrl
                      })}
                    >
                      Детальніше
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
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

      {/* Модальне вікно для відображення деталей події */}
      {selectedEvent && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content">
              <div className="modal-header bg-primary text-white">
                <h5 className="modal-title">{selectedEvent.title}</h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setSelectedEvent(null)} aria-label="Close"></button>
              </div>
              <div className="modal-body p-4">
                <div className="d-flex flex-column gap-3">
                  <div className="d-flex align-items-center text-muted">
                    <i className="bi bi-calendar-event fs-4 me-3 text-primary"></i>
                    <span className="fs-5">{selectedEvent.date}</span>
                  </div>
                  <div className="d-flex align-items-center text-muted">
                    <i className="bi bi-geo-alt fs-4 me-3 text-primary"></i>
                    <span className="fs-5">{selectedEvent.location}</span>
                  </div>
                  {selectedEvent.photoUrl && (
                    <div className="mt-3 text-center">
                      <img 
                        src={`${import.meta.env.VITE_API_URL || 'http://localhost:5132'}/images/eventImages/${selectedEvent.photoUrl}`} 
                        alt={selectedEvent.title}
                        className="img-fluid rounded shadow-sm"
                        style={{ maxHeight: '300px', objectFit: 'cover' }}
                      />
                    </div>
                  )}
                  <hr />
                  <div>
                    <h6 className="fw-bold mb-3">Опис події:</h6>
                    <p style={{ whiteSpace: 'pre-wrap' }}>{selectedEvent.description}</p>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setSelectedEvent(null)}>
                  Закрити
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default EventsPage;