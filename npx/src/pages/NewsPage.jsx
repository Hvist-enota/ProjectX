import React, { useEffect, useState } from "react";
import { getAllNews } from "../services/newsService";

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

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Останні новини</h2>
      {newsList.length > 0 ? (
        <div className="row">
          {newsList.map((news) => (
            <div className="col-md-4 mb-4" key={news.id}>
              <div className="card h-100 shadow-sm">
                {/* Якщо є зображення */}
                {news.filePath && (
                  <img 
                    src={news.filePath} 
                    alt={news.title || 'Новина'} 
                    className="card-img-top"
                    style={{ height: "200px", objectFit: "cover" }}
                  />
                )}
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title">{news.title}</h5>
                  <p className="card-text text-muted">
                    <small>Дата публікації: {new Date(news.publishDate).toLocaleDateString()}</small>
                  </p>
                  <p className="card-text flex-grow-1">{news.content.substring(0, 150)}{news.content.length > 150 ? "..." : ""}</p>
                  {/* Детальніше */}
                  <a href={`/news/${news.id}`} className="btn btn-primary mt-3">Детальніше</a>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="alert alert-info text-center">Наразі немає новин.</div>
      )}
    </div>
  );
};

export default NewsPage;