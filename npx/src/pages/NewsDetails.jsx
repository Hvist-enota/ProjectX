import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getNewsById } from "../services/newsService";

const NewsDetails = () => {
  const { id } = useParams(); // Отримуємо ID з URL
  const [news, setNews] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const data = await getNewsById(id);
        setNews(data);
      } catch (err) {
        console.error("Помилка завантаження новини:", err);
        setError("Новину не знайдено або сталася помилка.");
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [id]);

  if (loading) {
    return <div className="text-center mt-5">Завантаження...</div>;
  }

  if (error) {
    return <div className="alert alert-danger text-center mt-5">{error}</div>;
  }

  if (!news) {
    return <div className="text-center mt-5">Новина не знайдена</div>;
  }

  return (
    <div className="container mt-5">
      <h2>{news.title}</h2>
      <p className="text-muted">Дата публікації: {new Date(news.publishDate).toLocaleDateString()}</p>
      {news.filePath && (
        <img
          src={news.filePath}
          alt={news.title}
          className="img-fluid my-4"
          style={{ maxHeight: "400px", objectFit: "cover" }}
        />
      )}
      <p style={{ whiteSpace: "pre-line" }}>{news.content}</p>
    </div>
  );
};

export default NewsDetails;
