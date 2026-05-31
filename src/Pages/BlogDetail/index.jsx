import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { fetchBlogById } from "../../services/cmsService";

const BlogDetail = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const data = await fetchBlogById(id);

        if (!cancelled) {
          setBlog(data);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message || "Article not found");
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
  }, [id]);

  return (
    <main className="commercePage">
      <div className="container">
        <div className="commerceShell">
          {loading ? (
            <section className="commercePanel">
              <p>Loading article...</p>
            </section>
          ) : error || !blog ? (
            <section className="commercePanel">
              <p className="commerceNotice">{error || "Article not found"}</p>
              <div className="commerceActions">
                <Link to="/blog" className="commerceBtn">
                  Back to articles
                </Link>
              </div>
            </section>
          ) : (
            <>
              <header className="commerceHero">
                <span className="commerceKicker">{blog.category || "Article"}</span>
                <h1>{blog.title}</h1>
                <p>
                  {blog.publishedAt
                    ? new Date(blog.publishedAt).toLocaleDateString()
                    : "KEYSHOP"}
                </p>
              </header>

              <section className="commercePanel">
                <img
                  src={blog.image || "/images/bypass/cerberus-banner.png"}
                  alt={blog.title}
                  className="blogArticleImage"
                />
                <p>{blog.description}</p>
                <div className="commerceActions">
                  <Link to="/blog" className="commerceGhostBtn">
                    Back to articles
                  </Link>
                  <Link to="/productListing" className="commerceBtn">
                    Browse products
                  </Link>
                </div>
              </section>
            </>
          )}
        </div>
      </div>
    </main>
  );
};

export default BlogDetail;
