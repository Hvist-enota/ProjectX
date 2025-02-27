import "../styles/contact.css";
import ContactForm from "../components/ContactForm";

const Contact = () => {
  return (
    <section className="contact-section">
      <h2>Контакти</h2>
      <p>Адреса: вул. Церковна, 10</p>
      <p>Телефон: +380123456789</p>
      <ContactForm />
    </section>
  );
};

export default Contact;