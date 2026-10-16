try {
  const saved = JSON.parse(localStorage.getItem("wisdom.appearance") || "null");
  const hex = /^#[0-9a-f]{6}$/i;
  if (saved && hex.test(saved.accent) && hex.test(saved.onAccent)) {
    const root = document.documentElement;
    root.classList.toggle("dark", saved.dark === true);
    root.style.setProperty("--accent", saved.accent);
    root.style.setProperty("--on-accent", saved.onAccent);
  }
} catch {}
