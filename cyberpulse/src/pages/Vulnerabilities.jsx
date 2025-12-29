import news from "../data/news.json";
import NewsCard from "../components/NewsCard";

export default function Vulnerabilities() {
  const vulnNews = news.filter(n => {
    const c = (n.category || "").toLowerCase();
    return (
      c.includes("vuln") ||
      c.includes("cve") ||
      c.includes("vulnerability")
    );
  });

  return (
    <div className="news-grid">
      {vulnNews.length === 0 ? (
        <p>No vulnerability news available.</p>
      ) : (
        vulnNews.map((item, i) => <NewsCard key={i} {...item} />)
      )}
    </div>
  );
}
