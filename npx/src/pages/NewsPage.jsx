import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAllNews } from "../services/newsService";
import "../styles/news.css";

const NewsPage = () => {
  const [newsList, setNewsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNewsData = async () => {
      try {
        const data = await getAllNews();
        console.log(data);
        
        setNewsList(data);
      } catch (err) {
        console.error("Помилка завантаження новин:", err);
        setError("Не вдалося завантажити новини. Спробуйте пізніше.");
      } finally {
        setLoading(false);
      }
    };

    fetchNewsData();
  }, []);

  if (loading) {
    return <div className="text-center mt-5">Завантаження новин...</div>;
  }

  if (error) {
    return <div className="text-center text-danger mt-5">{error}</div>;
  }

  // Separate first featured news from the rest
  const featuredNews = newsList.length > 0 ? newsList[0] : null;
  const regularNews = newsList.length > 1 ? newsList.slice(1) : [];

  return (
    <div className="news-wrapper">
      <div className="news-header">
        <div className="container text-center">
          <span className="section-eyebrow">Останні Події</span>
          <h1 className="news-page-title">Життя нашої церкви</h1>
          <p className="news-page-subtitle">Дізнавайтесь про останні новини, служіння та важливі події в нашій спільноті.</p>
        </div>
      </div>

      <div className="container pb-5">
        {newsList.length > 0 ? (
          <>
            {/* Featured News Article */}
            {featuredNews && (
              <div className="featured-news-card mb-5">
                <div className="row g-0">
                  <div className="col-lg-5">
                    <div className="featured-news-content">
                      <span className="news-date">{new Date(featuredNews.publishDate).toLocaleDateString()}</span>
                      <h2 className="featured-news-title">{featuredNews.title}</h2>
                      <p className="featured-news-text">
                        {featuredNews.content.substring(0, 250)}
                        {featuredNews.content.length > 250 ? "..." : ""}
                      </p>
                      <Link to={`/news/${featuredNews.id}`} className="btn btn-outline-primary mt-4">
                        Читати статтю
                      </Link>
                    </div>
                  </div>
                  {featuredNews.photoUrl && (
                    <div className="col-lg-7">
                      <div className="featured-news-image-wrapper">
                        <img 
                          src={`${import.meta.env.VITE_API_URL || 'http://localhost:5132'}/images/newsImages/${featuredNews.photoUrl}`}
                          alt={featuredNews.title} 
                          className="featured-news-image"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Regular News Grid */}
            {regularNews.length > 0 && (
              <div className="row g-4">
                {regularNews.map((news) => (
                  <div className="col-md-6 col-lg-4" key={news.id}>
                    <div className="news-card">
                      {news.photoUrl && (
                        <div className="news-image-wrapper">
                          <img 
                            src={`${import.meta.env.VITE_API_URL || 'http://localhost:5132'}/images/newsImages/${news.photoUrl}`}
                            alt={news.title} 
                            className="news-image"
                          />
                        </div>
                      )}
                      <div className="news-content">
                        <span className="news-date">{new Date(news.publishDate).toLocaleDateString()}</span>
                        <h3 className="news-title">{news.title}</h3>
                        <p className="news-text">
                          {news.content.substring(0, 120)}{news.content.length > 120 ? "..." : ""}
                        </p>
                        <Link to={`/news/${news.id}`} className="news-read-more">
                          Детальніше <i className="bi bi-arrow-right"></i>
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="alert alert-info text-center py-5">
            <h4 className="alert-heading mb-0">Наразі немає новин.</h4>
          </div>
        )}
      </div>
    </div>
  );
};

export default NewsPage;