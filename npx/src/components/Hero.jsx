import "../styles/hero.css";

const Hero = () => {
  const backgroundImage = '/image/Church/church.png'; 

  return (
    <section
      className="hero"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <h2>Ласкаво просимо до нашої церкви</h2>
    </section>
  );
};

export default Hero;
