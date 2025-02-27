import "../styles/about.css";

const About = () => {
  return (
    <section className="about-section">
      <h2>Про нашу церкву</h2>
      <p>Церква має історію служіння своїй громаді та мешканцям села.</p>
      
      <div className="gallery">
        <img src="/image/Church/poc.png" alt="Церква 1" />
        <div className="desc">Батюшка</div>
      </div>
      <div className="gallery">
        <img src="/image/Church/tianka.png" alt="Церква 2" />
        <div className="desc">монашка</div>
      </div>
      <div className="gallery">
        <img src="/image/Church/army.png" alt="Церква 3" />
        <div className="desc">Прихожани</div>
      </div>
      <div className="gallery">
        <img src="/image/about/about1.gif" alt="Церква 4" />
        <div className="desc">Святкові служіння</div>
      </div>
      <div className="gallery">
        <img src="/image/about/about2.gif" alt="Церква 4" />
        <div className="desc">Святкові служіння</div>
      </div>
      <div className="gallery">
        <img src="/image/about/about3.gif" alt="Церква 4" />
        <div className="desc">Святкові служіння</div>
      </div>
      <div className="gallery">
        <img src="/image/about/about4.gif" alt="Церква 4" />
        <div className="desc">Святкові служіння</div>
      </div>
    </section>
  );
};

export default About;
