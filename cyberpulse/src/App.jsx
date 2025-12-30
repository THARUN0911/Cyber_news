import { useEffect, useState } from "react";
import NewsCard from "./components/NewsCard";

/* --- SIMPLE KEYWORD CLASSIFIER --- */
function detectCategory(title = "", description = "") {
  const text = (title + " " + description).toLowerCase();

  if (text.includes("india") || text.includes("cert-in") || text.includes("i4c")) {
    return "india";
  }
  if (text.includes("malware") || text.includes("ransomware") || text.includes("trojan")) {
    return "malware";
  }
  if (text.includes("breach") || text.includes("leak") || text.includes("exposed")) {
    return "breach";
  }
  if (text.includes("cve") || text.includes("vulnerability") || text.includes("exploit")) {
    return "vulnerability";
  }
  return "latest";
}

export default function App() {
  const [news, setNews] = useState([]);
  const [active, setActive] = useState("latest");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/news/all")
      .then(res => res.json())
      .then(data => {
        console.log("Fetched:", data);

        const processed = data.map(item => {
          const category = detectCategory(item.title, item.description);

          return {
            title: item.title,
            description: item.description || "",
            source: item.source,
            time: item.published
                  ? new Date(item.published).toLocaleString()
                  : "Unknown",    
            category,
            url: item.link
          };
        });

        setNews(processed);
        setLoading(false);
      })
      .catch(err => {
        console.error("Fetch failed:", err);
        setLoading(false);
      });
  }, []);

  const filteredNews =
    active === "latest"
      ? news
      : news.filter(n => n.category === active);

  return (
    <>
      {/* TOP BAR */}
      <div className="topbar">
        <div className="logo">CyberPulse</div>

        <div className="top-actions">
          <input
            className="site-search"
            placeholder="Search cyber news…"
          />
          <button onClick={() => window.toggleTheme()}>
            🌗
          </button>
        </div>
      </div>

      <div className="app-layout">
        {/* SIDEBAR */}
        <nav className="sidebar">
          {["latest", "india", "malware", "breach", "vulnerability"].map(cat => (
            <a
              key={cat}
              className={active === cat ? "active" : ""}
              onClick={() => setActive(cat)}
            >
              {cat.toUpperCase()}
            </a>
          ))}
        </nav>

        {/* CONTENT */}
        <main className="content">
          <h1>{active.toUpperCase()} Cybersecurity News</h1>

          {loading && <p>Loading…</p>}

          {!loading && filteredNews.length === 0 && (
            <p style={{ opacity: 0.7 }}>
              No news available for this category.
            </p>
          )}

          <div className="news-grid">
            {filteredNews.map((item, i) => (
              <NewsCard
                key={i}
                title={item.title}
                description={item.description}
                source={item.source}
                time={item.time}
                category={item.category}
                url={item.url}
              />
            ))}
          </div>
        </main>
      </div>
    </>
  );
}
