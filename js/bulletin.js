const today = new Date().toDateString();
document.getElementById("bulletin").innerHTML =
`<h3>${today}</h3><p>Top breaches & advisories fetched automatically.</p>`;

const todayKey = "csb-" + new Date().toDateString();
if (!localStorage.getItem(todayKey)) {
  // remove only previous daily bulletin keys (don't clear other app data)
  try {
    for (let i = localStorage.length - 1; i >= 0; i--) {
      const key = localStorage.key(i);
      if (key && key.startsWith('csb-')) localStorage.removeItem(key);
    }
  } catch (e) {
    console.warn('Could not prune localStorage:', e);
  }
  localStorage.setItem(todayKey, "generated");
}
