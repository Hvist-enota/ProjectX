import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/newhere.css';

const NewHere = () => {
  const [activeFaq, setActiveFaq] = useState(null);

  const faqs = [
    {
      id: 1,
      question: "Що мені одягнути?",
      answer: "Одягайтесь так, як вам комфортно! У нас немає жодного дрес-коду. Ви побачите людей як у джинсах і футболках, так і в костюмах."
    },
    {
      id: 2,
      question: "Що робити, якщо я прийду з дітьми?",
      answer: "Ми обожнюємо дітей! Під час служіння працює дитяча кімната з кваліфікованими волонтерами, де ваші діти зможуть весело та з користю провести час, поки ви на зібранні."
    },
    {
      id: 3,
      question: "Скільки триває богослужіння?",
      answer: "Наше богослужіння зазвичай триває близько 1.5 - 2 годин. Воно включає в себе сучасну музику (прославлення), молитву та практичну проповідь на актуальні життєві теми."
    },
    {
      id: 4,
      question: "Чи потрібно мені давати гроші?",
      answer: "Абсолютно ні. Збір пожертв — це частина нашого поклоніння для тих, хто вважає цю церкву своїм домом. Як наш гість, ви не зобов'язані нічого давати."
    }
  ];

  const toggleFaq = (id) => {
    setActiveFaq(activeFaq === id ? null : id);
  };

  return (
    <div className="newhere-wrapper">
      {/* Hero Section */}
      <section className="newhere-hero">
        <div className="container text-center">
          <span className="section-eyebrow">Для нових гостей</span>
          <h1 className="newhere-title">Ласкаво просимо додому</h1>
          <p className="newhere-subtitle">
            Ми знаємо, що прийти до церкви вперше може бути хвилююче. 
            Ми створили цю сторінку, щоб ви точно знали, на що очікувати, і почувалися як вдома.
          </p>
        </div>
      </section>

      {/* What to expect */}
      <section className="expect-section py-5">
        <div className="container">
          <div className="row g-5 align-items-center">
            <div className="col-lg-6">
              <div className="expect-image-wrapper">
                <img src="/image/Church/puno.png" alt="Церковне зібрання" className="expect-image" />
              </div>
            </div>
            <div className="col-lg-6">
              <h2 className="section-heading mb-4">Чого очікувати під час візиту?</h2>
              
              <div className="expect-item">
                <div className="expect-icon"><i className="bi bi-music-note-beamed"></i></div>
                <div className="expect-text">
                  <h3>Сучасна музика</h3>
                  <p>Наше зібрання починається з музичної частини (прославлення). Ми співаємо сучасні пісні під живі інструменти. Ви можете підспівувати або просто слухати.</p>
                </div>
              </div>
              
              <div className="expect-item">
                <div className="expect-icon"><i className="bi bi-book"></i></div>
                <div className="expect-text">
                  <h3>Зрозуміле послання</h3>
                  <p>Ми ділимося практичними істинами з Біблії, які легко застосувати у сучасному повсякденному житті, роботі та стосунках.</p>
                </div>
              </div>
              
              <div className="expect-item">
                <div className="expect-icon"><i className="bi bi-cup-hot"></i></div>
                <div className="expect-text">
                  <h3>Тепле спілкування</h3>
                  <p>Після зібрання у нас завжди є час на каву та знайомство. Ніхто не залишиться непоміченим!</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="faq-section py-5 bg-light">
        <div className="container">
          <h2 className="text-center section-heading mb-5">Поширені запитання</h2>
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <div className="faq-accordion">
                {faqs.map(faq => (
                  <div 
                    key={faq.id} 
                    className={`faq-item ${activeFaq === faq.id ? 'active' : ''}`}
                    onClick={() => toggleFaq(faq.id)}
                  >
                    <div className="faq-question">
                      {faq.question}
                      <i className={`bi bi-chevron-${activeFaq === faq.id ? 'up' : 'down'}`}></i>
                    </div>
                    <div className="faq-answer">
                      <p>{faq.answer}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="newhere-cta py-5 text-center">
        <div className="container">
          <h2 className="section-heading">Ми чекаємо на вас цієї неділі!</h2>
          <p className="section-text mx-auto" style={{ maxWidth: '600px' }}>
            Якщо у вас залишилися запитання або ви хочете, щоб вас хтось зустрів перед входом, напишіть нам.
          </p>
          <div className="mt-4">
            <Link to="/contact" className="btn btn-primary me-3">Зв'язатися з нами</Link>
            <Link to="/events" className="btn btn-outline-secondary">Розклад подій</Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default NewHere;
