export default function NewsCard({
  title,
  description,
  source,
  time,
  badge = "latest",
  severity,
  url
}) {
  const openArticle = () => {
    if (url) {
      window.open(url, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <div className="news-card visible">

      {badge && (
        <span className={`badge ${badge}`}>
          {badge.toUpperCase()}
        </span>
      )}

      {severity && (
        <span className={`sev sev-${severity}`}>
          {severity.toUpperCase()}
        </span>
      )}

      <h3>{title || "Cybersecurity Update"}</h3>

      <p>{description || "See full article for details."}</p>

      <div className="meta">
        <span>{source || "Unknown Source"}</span>
        <span>{time || "Today"}</span>
      </div>

      <button className="read-more" onClick={openArticle}>
        Read more →
      </button>
    </div>
  );
}
