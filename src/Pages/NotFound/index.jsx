import { Link } from "react-router-dom";

const NotFound = () => (
  <main className="commercePage">
    <div className="container">
      <div className="commerceShell">
        <header className="commerceHero">
          <span className="commerceKicker">404</span>
          <h1>Page not found</h1>
          <p>The page may have moved, expired or the URL may be incorrect.</p>
        </header>

        <section className="commercePanel">
          <div className="commerceActions">
            <Link to="/" className="commerceBtn">
              Back home
            </Link>
            <Link to="/productListing" className="commerceGhostBtn">
              Browse products
            </Link>
          </div>
        </section>
      </div>
    </div>
  </main>
);

export default NotFound;
