import express from "express";
import Parser from "rss-parser";
import cors from "cors";

const app = express();
const parser = new Parser({
  timeout: 15000
});

app.use(cors());

/**
 * ALL CYBERSECURITY RSS SOURCES
 */
const feeds = [
  // Global cybersecurity
  { key: "hackernews", url: "https://thehackernews.com/feeds/posts/default?alt=rss", category: "latest" },
  { key: "bleeping", url: "https://www.bleepingcomputer.com/feed/", category: "latest" },
  { key: "darkreading", url: "https://www.darkreading.com/rss.xml", category: "latest" },
  { key: "securityweek", url: "https://www.securityweek.com/feed", category: "latest" },
  { key: "threatpost", url: "https://threatpost.com/feed/", category: "latest" },

  // Malware
  { key: "malwarebytes", url: "https://www.malwarebytes.com/blog/feed/index.xml", category: "malware" },
  { key: "kaspersky", url: "https://securelist.com/feed/", category: "malware" },
  { key: "crowdstrike", url: "https://www.crowdstrike.com/blog/feed/", category: "malware" },

  // Breaches
  { key: "hibp", url: "https://feeds.feedburner.com/HaveIBeenPwnedLatestBreaches", category: "breach" },
  { key: "recordedfuture", url: "https://www.recordedfuture.com/feed", category: "breach" },

  // Vulnerabilities
  { key: "cisa", url: "https://www.cisa.gov/cybersecurity-advisories/all.xml", category: "vulnerability" },
  { key: "nvd", url: "https://nvd.nist.gov/feeds/xml/cve/misc/nvd-rss.xml", category: "vulnerability" },

  // India specific
  { key: "certin", url: "https://www.cert-in.org.in/Feeds/CERT-In.xml", category: "india" }
];

/**
 * FETCH FROM ALL SOURCES
 */
app.get("/api/news/all", async (req, res) => {
  try {
    // 🚫 Disable cache
    res.setHeader("Cache-Control", "no-store");

    const results = [];

    await Promise.all(
      feeds.map(async feed => {
        try {
          const parsed = await parser.parseURL(feed.url);

          parsed.items.forEach(item => {
            results.push({
              title: item.title,
              description: item.contentSnippet || item.summary || "",
              link: item.link,
              source: parsed.title || feed.key,
              category: feed.category,
              published: item.pubDate || item.isoDate || null
            });
          });
        } catch (err) {
          console.error(`Feed failed: ${feed.key}`);
        }
      })
    );

    // Sort by latest publish date
    const sorted = results
      .filter(item => item.published)
      .sort((a, b) => new Date(b.published) - new Date(a.published))
      .slice(0, 100); // limit to latest 100 items

    res.status(200).json(sorted);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch news" });
  }
});

app.listen(5000, () => {
  console.log("Backend running on http://localhost:5000");
});
