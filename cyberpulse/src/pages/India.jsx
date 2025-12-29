import news from "../data/news.json";
import NewsCard from "../components/NewsCard";

export default function India() {
  const indiaNews = news.filter(n => n.region === "india");

  return (
    <div className="news-grid">
      {indiaNews.map((item, i) => (
        <NewsCard key={i} {...item} />
      ))}
    </div>
  );
}
