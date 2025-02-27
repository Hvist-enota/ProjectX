import "../styles/donate.css";
import DonationButton from "../components/DonationButton";

const Donate = () => {
  const handleDonate = () => {
    alert("Дякуємо за вашу пожертву!");
  };

  return (
    <section className="donate-section">
      <h2>Підтримайте нашу церкву</h2>
      <DonationButton onClick={handleDonate} />
    </section>
  );
};

export default Donate;
