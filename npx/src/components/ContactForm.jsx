import { useState } from "react";
import apiClient from "../api/axiosConfig";

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      await apiClient.post("/user-messages/create", formData);
      setSubmitted(true);
      setFormData({
        name: "",
        email: "",
        phoneNumber: "",
        message: "",
      });
      setTimeout(() => setSubmitted(false), 3000);
    } catch (err) {
      console.error("Помилка при надсиланні повідомлення:", err);
      setError("Не вдалося надіслати повідомлення. Спробуйте пізніше.");
    }
  };

  return (
    <div
      className="min-vh-100 d-flex align-items-center justify-content-center"
      style={{
        backgroundImage: `url("/image/Church/puno.png")`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        padding: "50px 15px",
      }}
    >
      <div className="bg-dark bg-opacity-75 p-5 rounded shadow-lg text-white" style={{ maxWidth: "600px", width: "100%" }}>
        {submitted && (
          <div className="alert alert-success text-center" role="alert">
            Дякую! Дані успішно відправлені.
          </div>
        )}
        {error && (
          <div className="alert alert-danger text-center" role="alert">
            {error}
          </div>
        )}
        <h2 className="text-center mb-3">Зворотній зв'язок</h2>
        <p className="text-center mb-4">Напишіть нам</p>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <input
              type="text"
              className="form-control"
              name="name"
              placeholder="Ім'я"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <input
              type="email"
              className="form-control"
              name="email"
              placeholder="E-mail"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <input
              type="tel"
              className="form-control"
              name="phoneNumber"
              placeholder="Номер телефону"
              value={formData.phoneNumber}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-4">
            <textarea
              className="form-control"
              name="message"
              rows="4"
              placeholder="Повідомлення"
              value={formData.message}
              onChange={handleChange}
              required
            ></textarea>
          </div>
          <div className="text-center">
            <button type="submit" className="btn btn-warning px-4 py-2">
              Відправити
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ContactForm;
