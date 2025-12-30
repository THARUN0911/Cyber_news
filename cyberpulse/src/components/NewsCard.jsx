export default function NewsCard({
  title,
  description,
  source,
  time,
  category,
  url
}) {
  return (
    <div className="news-card visible">
      <span className="badge">
        {(category || "latest").toUpperCase()}
      </span>

      {/* SHOW TITLE AS-IS */}
      <h3>{title}</h3>

      <p>{description}</p>

      <div className="meta">
        <span>{source}</span>
        <span>{time}</span>
      </div>

      <button
        className="read-more"
        onClick={() => window.open(url, "_blank")}
      >
        Read more →
      </button>
    </div>
  );
}
