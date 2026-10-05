/* Stamps the saved theme on <html> before the first paint, so a reader who chose
   dark never gets a white flash on load. "Sistema" writes nothing and lets the
   CSS media query decide — see src/index.css and src/stores/theme. */
try {
  var altotechTheme = localStorage.getItem('altotech:theme');
  if (altotechTheme === 'dark' || altotechTheme === 'light') {
    document.documentElement.dataset.theme = altotechTheme;
  }
} catch (error) { /* storage blocked: the system preference still applies */ }
