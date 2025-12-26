function detectCategory(title) {
  title = title.toLowerCase();

  if (title.includes("breach") || title.includes("leak") || title.includes("exposed"))
    return { name: "Data Breach", class: "breach" };

  if (title.includes("ransomware") || title.includes("malware") || title.includes("trojan"))
    return { name: "Malware", class: "malware" };

  if (title.includes("cve") || title.includes("vulnerability") || title.includes("zero-day"))
    return { name: "Vulnerability", class: "vuln" };

  return { name: "Latest", class: "latest" };
}

async function loadNews(filter = "all") {
  const container = document.getElementById("news-container");
  const feedNotice = document.getElementById('feed-notice');
  if (feedNotice) feedNotice.innerHTML = '';
  container.innerHTML = "";
  const failed = [];

  for (const feed of FEEDS) {
    try {
      const items = await fetchFeed(feed);
      if (!items || !items.length) continue;

      items.slice(0, 6).forEach(item => {
        const category = detectCategory(item.title || '');

        if (filter !== "all" && category.name !== filter) return;

        const card = document.createElement("div");
        card.className = `news-card ${category.class}`;

        const desc = (item.description || '').replace(/<[^>]*>/g, '');

        card.innerHTML = `
          <span class="badge ${category.class}">${category.name}</span>
          <h3>${item.title || 'Untitled'}</h3>
          <p>${desc.slice(0, 120)}${desc.length>120? '...' : ''}</p>

          <div class="meta">
            <span>📰 ${feed.name}</span>
            <span>🕒 ${item.pubDate ? new Date(item.pubDate).toLocaleString() : '—'}</span>
          </div>

          <a href="${item.link || '#'}" target="_blank" rel="noopener">Read full →</a>
        `;

        container.appendChild(card);
      });
    } catch (err) {
      console.warn('Failed to load feed', feed.name, err);
      failed.push({ name: feed.name, message: err.message });
      continue;
    }
  }

  if (failed.length && feedNotice) {
    const list = failed.map(f => `<li><strong>${f.name}:</strong> ${f.message}</li>`).join('');
    feedNotice.innerHTML = `<div class="feed-warning"><strong>Some feeds failed to load:</strong><ul>${list}</ul></div>`;
  }
}

async function loadNewsByRegion(region, filter = 'all') {
  const container = document.getElementById("news-container");
  if (!container) return;
  container.innerHTML = "";

  for (const feed of FEEDS.filter(f => f.region === region)) {
    try {
      const items = await fetchFeed(feed);
      if (!items || !items.length) continue;

      items.slice(0, 8).forEach(item => {
        const category = detectCategory(item.title || '');
        if (filter !== 'all' && category.name !== filter) return;

        const card = document.createElement('div');
        card.className = `news-card ${category.class}`;
        const desc = (item.description || '').replace(/<[^>]*>/g, '');

        card.innerHTML = `
          <span class="badge ${category.class}">${category.name}</span>

  // if nothing rendered for the region, show a fallback to global latest
  const container = document.getElementById('news-container');
  const feedNotice = document.getElementById('feed-notice');
  if (container && container.children.length === 0) {
    if (feedNotice) feedNotice.innerHTML = '<div class="feed-warning">No regional items available — showing global latest instead.</div>';
    await loadNews('all');
  }
          <h3>${item.title || 'Untitled'}</h3>
          <p>${desc.slice(0,120)}${desc.length>120? '...' : ''}</p>
          <div class="meta">
            <span>📰 ${feed.name}</span>
            <span>🕒 ${item.pubDate ? new Date(item.pubDate).toLocaleString() : '—'}</span>
          </div>
          <a href="${item.link || '#'}" target="_blank" rel="noopener">Read full →</a>
        `;

        container.appendChild(card);
      });
    } catch (err) {
      console.warn('Failed to load feed', feed.name, err);
      // for region pages, append a small notice below the headline
      const feedNotice = document.getElementById('feed-notice');
      if (feedNotice) {
        const li = document.createElement('div');
        li.className = 'feed-warning-item';
        li.innerHTML = `<strong>${feed.name}:</strong> ${err.message}`;
        feedNotice.appendChild(li);
      }
      continue;
    }
  }
}

  async function fetchFeed(feed) {
    // If developer set `localProxy`, use the local Flask proxy (http://localhost:5000)
    if (feed.localProxy) {
      try {
        const r = await fetch(`http://localhost:5000/proxy?url=${encodeURIComponent(feed.rss)}`);
        if (!r.ok) throw new Error('Local proxy fetch failed');
        const xmlText = await r.text();
        const doc = new DOMParser().parseFromString(xmlText, 'application/xml');
        const items = Array.from(doc.querySelectorAll('item')).map(it => ({
          title: it.querySelector('title') ? it.querySelector('title').textContent : '',
          description: it.querySelector('description') ? it.querySelector('description').textContent : '',
          pubDate: it.querySelector('pubDate') ? it.querySelector('pubDate').textContent : '',
          link: it.querySelector('link') ? it.querySelector('link').textContent : ''
        }));
        return items;
      } catch (e) {
        throw new Error('Local proxy error: ' + e.message);
      }
    }

    // primary: rss2json JSON proxy (cache-busting param)
    const proxy = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(feed.rss)}&_=${Date.now()}`;
    try {
      const res = await fetch(proxy);
      if (res.ok) {
        const data = await res.json();
        if (data && data.items) return data.items;
        throw new Error('Invalid JSON feed');
      }
      throw new Error('Network response not ok');
    } catch (err) {
      // fallback for CERT-In: try a public raw proxy then parse XML
      if (feed.rss && feed.rss.includes('cert-in')) {
        try {
          const alt = `https://api.allorigins.win/raw?url=${encodeURIComponent(feed.rss)}`;
          const r = await fetch(alt);
          if (!r.ok) throw new Error('Proxy fetch failed');
          const xmlText = await r.text();
          const doc = new DOMParser().parseFromString(xmlText, 'application/xml');
          const items = Array.from(doc.querySelectorAll('item')).map(it => ({
            title: it.querySelector('title') ? it.querySelector('title').textContent : '',
            description: it.querySelector('description') ? it.querySelector('description').textContent : '',
            pubDate: it.querySelector('pubDate') ? it.querySelector('pubDate').textContent : '',
            link: it.querySelector('link') ? it.querySelector('link').textContent : ''
          }));
          return items;
        } catch (e) {
          throw new Error('Fallback parse failed: ' + e.message);
        }
      }
      throw err;
    }
  }

// Expose region loader to global scope for pages to call
window.loadNewsByRegion = loadNewsByRegion;

document.getElementById("last-updated").innerText =
  "Last updated: " + new Date().toLocaleString();


loadNews();

