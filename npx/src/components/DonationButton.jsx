import "../styles/donate.css";

const DonationButton = () => {
  return (
    <button className="donate-button" onClick={() => window.location.href = "https://1win.org.ua/uk/"}>
      Зробити пожертву
    </button>
  );
};

export default DonationButton;