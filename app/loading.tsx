export default function Loading() {
  return (
    <main className="page-shell">
      <section className="panel">
        <div className="hero">
          <div>
            <p className="eyebrow">Loading</p>
            <h1>Fetching your rotation list</h1>
            <p className="muted">Plex and Tautulli data is being refreshed.</p>
          </div>
        </div>
        <div className="skeleton-grid" aria-hidden="true">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="series-card skeleton-card" />
          ))}
        </div>
      </section>
    </main>
  );
}
