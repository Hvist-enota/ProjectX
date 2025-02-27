import React, { useEffect, useState } from "react";
import { fetchNews } from "../features/newsService";

const NewsPage = () => {
  const [news, setNews] = useState([]);

  useEffect(() => {
    const loadNews = async () => {
      const newsData = await fetchNews();
      setNews(newsData);
    };

    loadNews();
  }, []);

  return (
    <div>
      <h2>Останні новини</h2>
      {news.length > 0 ? (
        news.map((item, index) => (
          <div key={index} className="news-item">
            <h3>{item.title}</h3>
            <p><strong>Дата:</strong> {item.date}</p>
            <p>{item.description}</p>
          </div>
        ))
      ) : (
        <p>Новин поки немає.</p>
      )}
    </div>
  );
};

export default NewsPage;