import news from "../data/news.json";
import NewsCard from "../components/NewsCard";

export default function Breaches() {
  const breachNews = news.filter(
    n => (n.category || "").toLowerCase().includes("breach")
  );

  return (
    <div className="news-grid">
      {breachNews.length === 0 ? (
        <p>No breach news available.</p>
      ) : (
        breachNews.map((item, i) => <NewsCard key={i} {...item} />)
      )}
    </div>
  );
}
