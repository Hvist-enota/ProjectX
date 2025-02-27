import Hero from "../components/Hero";
import "../styles/home.css";

const Home = () => {
  return (
    <div>
      <Hero />
      <section className="home-section">
        <h2>Приєднуйтесь до наших богослужінь</h2>
        <p>Ми чекаємо на вас кожної неділі!</p>
      </section>
    </div>
  );
};

export default Home;
