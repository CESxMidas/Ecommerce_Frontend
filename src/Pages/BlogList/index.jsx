import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchBlogs } from "../../services/cmsService";

const BlogList = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const data = await fetchBlogs();

        if (!cancelled) {
          setBlogs(data);
        }
      } catch {
        if (!cancelled) {
          setBlogs([]);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <main className="commercePage">
      <div className="container">
        <div className="commerceShell">
          <header className="commerceHero">
            <span className="commerceKicker">Articles</span>
            <h1>Latest Articles</h1>
            <p>Guides, product updates and digital software tips from KEYSHOP.</p>
          </header>

          {loading ? (
            <section className="commercePanel">
              <p>Loading articles...</p>
            </section>
          ) : blogs.length === 0 ? (
            <section className="commercePanel">
              <p>No articles available.</p>
            </section>
          ) : (
            <section className="blogGrid">
              {blogs.map((blog) => (
                <Link key={blog._id} to={`/blog/${blog._id}`} className="commerceCard">
                  <img
                    src={blog.image || "/images/bypass/cerberus-banner.png"}
                    alt={blog.title}
                    className="blogCardImage"
                  />
                  <span className="commerceKicker">{blog.category || "General"}</span>
                  <h3>{blog.title}</h3>
                  <p>{blog.description}</p>
                </Link>
              ))}
            </section>
          )}
        </div>
      </div>
    </main>
  );
};

export default BlogList;
