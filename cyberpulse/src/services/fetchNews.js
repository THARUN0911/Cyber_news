export async function fetchNews(source) {
  const res = await fetch(`http://localhost:5000/api/news/${source}`);
  return await res.json();
}