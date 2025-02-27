import { useState } from "react";
import "../styles/contact.css";

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000); // Ховаємо повідомлення через 3 секунди
  };

  return (
    <div className="contact-form-container">
      {submitted && (
        <div className="success-message">Дякую! Дані успішно відправлені.</div>
      )}
      <h2 className="contact-title">Зворотній зв'язок</h2>
      <p className="contact-subtitle">Напишіть нам</p>
      <form onSubmit={handleSubmit} className="contact-form">
        <input
          type="text"
          name="name"
          placeholder="Ім'я"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="E-mail"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="message"
          placeholder="Текст"
          value={formData.message}
          onChange={handleChange}
          required
        />
        <button type="submit" className="contact-button">Відправити</button>
      </form>
    </div>
  );
};

export default ContactForm;