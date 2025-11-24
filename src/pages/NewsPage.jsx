// src/pages/NewsPage.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../styles/NewsPage.css"; 
import NewsDetail from "../components/NewsDetail";
import { getNewsItems } from "../api/strapi";
import Footer from "../components/Footer";

export default function NewsPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function load() {
      try {
        setLoading(true);
        const data = await getNewsItems();
        if (!isMounted) return;

        setItems(data || []);
        setError("");
      } catch (err) {
        console.error(err);
        if (isMounted) {
          setError(
            "Không tải được tin tức, thử lại sau nhé.",
          );
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    load();
    return () => {
      isMounted = false;
    };
  }, []);

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    try {
      return new Date(dateStr).toLocaleDateString(
        "vi-VN",
        {
          day: "2-digit",
          month: "long",
          year: "numeric",
        },
      );
    } catch {
      return dateStr;
    }
  };

  return (
    <><main className='gc-news-page'>
      <div className='gc-news-page-inner'>
        <h1 className='gc-news-page-title'>
          TIN TỨC
        </h1>

        {loading && (
          <p className='gc-news-page-status'>
            Đang tải tin tức...
          </p>
        )}

        {error && !loading && (
          <p className='gc-news-page-status gc-news-page-status--error'>
            {error}
          </p>
        )}

        {!loading &&
          !error &&
          items.length === 0 && (
            <p className='gc-news-page-status'>
              Hiện chưa có bài viết nào.
            </p>
          )}

        {!loading &&
          !error &&
          items.length > 0 && (
            <section className='gc-news-grid'>
              {items.map((item) => (
                <article
                  key={item.id}
                  className='gc-news-card'
                >
                  <Link
                    to={`/tin-tuc/${item.slug}`}
                    className='gc-news-card-link'
                  >
                    <div className='gc-news-card-image-wrap'>
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className='gc-news-card-image' />
                    </div>

                    <div className='gc-news-card-body'>
                      <p className='gc-news-card-date'>
                        {formatDate(
                          item.publishedAt
                        )}
                      </p>

                      <h2 className='gc-news-card-title'>
                        {item.title}
                      </h2>

                      <p className='gc-news-card-desc'>
                        {item.seoDescription ||
                          (item.content
                            ? item.content.slice(
                              0,
                              120
                            ) + "..."
                            : "")}
                      </p>
                    </div>
                  </Link>
                </article>
              ))}
            </section>
          )}
      </div>
    </main><Footer /></>
  );
}
