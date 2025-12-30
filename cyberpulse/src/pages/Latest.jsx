import { useEffect, useState } from "react";
import { fetchNews } from "../services/fetchNews";
import NewsCard from "../components/NewsCard";

export default function Latest() {
  const [news, setNews] = useState([]);

  useEffect(() => {
    fetchNews().then(setNews);
  }, []);

  return (
    <div className="news-grid">
      {news.map((item, i) => (
        <NewsCard
          key={i}
          title={item.title}      // ✅ REAL RSS TITLE
          description={item.description}
          source={item.source}
          time={item.time}
          category={item.category}
          url={item.url}
        />
      ))}
    </div>
  );
}
