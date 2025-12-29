import news from "../data/news.json";
import NewsCard from "../components/NewsCard";

export default function Latest() {
  return (
    <>
      <div className="headline">
        <h1>Latest Cybersecurity News</h1>
        <p>Aggregated from trusted global & Indian sources</p>
      </div>

      <div className="news-grid">
        {news.map((item, index) => (
          <NewsCard
            key={index}
            title={item.title}
            description={item.description}
            source={item.source}
            time={item.time}
            badge={item.category}
            url={item.url}
          />
        ))}
      </div>
    </>
  );
}
