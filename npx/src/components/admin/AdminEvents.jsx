import  { useEffect, useState } from 'react';
import * as eventService from '../../services/eventService';

export default function AdminEvents() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    eventService.getAllEvents().then(setEvents);
  }, []);

  return (
    <div>
      <h2>Події</h2>
      <table className="table">
        <thead>
          <tr>
            <th>Назва</th>
            <th>Дата події</th>
          </tr>
        </thead>
        <tbody>
          {events.map(event => (
            <tr key={event.id}>
              <td>{event.title}</td>
              <td>{new Date(event.eventDate).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}