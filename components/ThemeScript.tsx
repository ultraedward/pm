// Injected before first paint — reads localStorage and sets data-theme on <html>
// This prevents a flash of wrong theme on hard reload.
export default function ThemeScript() {
  const script = `
    (function() {
      try {
        var stored = localStorage.getItem('theme');
        if (stored === 'light' || stored === 'dark') {
          document.documentElement.setAttribute('data-theme', stored);
        } else if (window.matchMedia('(prefers-color-scheme: light)').matches) {
          document.documentElement.setAttribute('data-theme', 'light');
        }
      } catch(e) {}
    })();
  `;
  return (
    <script
      dangerouslySetInnerHTML={{ __html: script }}
      suppressHydrationWarning
    />
  );
}
