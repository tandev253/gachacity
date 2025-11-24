// src/components/NewsSection.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../styles/news-section.css";
import { getNewsItems } from "../api/strapi";

export default function NewsSection() {
  const [items, setItems] = useState([]);
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {

    let isMounted = true;

    async function load() {
      try {
        setLoading(true);
        const data = await getNewsItems();

        if (!isMounted) return;
        setItems(data || []);
        setCurrent(0);
      } catch (err) {
        console.error(err);
        if (isMounted) {
          setError("Không tải được tin tức.");
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

  const hasNews = items.length > 0;
  const currentItem = hasNews
    ? items[current]
    : null;

  const handlePrev = () => {
    if (!hasNews) return;
    setCurrent((prev) =>
      prev === 0 ? items.length - 1 : prev - 1,
    );
  };

  const handleNext = () => {
    if (!hasNews) return;
    setCurrent((prev) =>
      prev === items.length - 1 ? 0 : prev + 1,
    );
  };

  // loading / chưa có dữ liệu
  if ((loading && !hasNews) || !currentItem) {
    return (
      <section className='gc-news'>
        <div className='gc-news-inner'>
          <div className='gc-news-header'>
            <h2 className='gc-news-title'>
              TIN TỨC
            </h2>
            <p className='gc-news-subtitle'>
              Cập nhật tin tức mới nhất của thành
              phố
            </p>
          </div>
          <div className='gc-news-skeleton' />
        </div>
      </section>
    );
  }

  if (error || !hasNews) {
    return null;
  }

  return (
    <section className='gc-news'>
      <div className='gc-news-inner'>
        {/* Header */}
        <div className='gc-news-header'>
          <h2 className='gc-news-title'>
            TIN TỨC
          </h2>
          <p className='gc-news-subtitle'>
            Cập nhật tin tức mới nhất của thành
            phố
          </p>
        </div>

        <div className='gc-news-content'>
          {/* Left: text */}
          <div className='gc-news-text'>
            <h3 className='gc-news-article-title'>
              {currentItem.title}
            </h3>
            <p className='gc-news-article-desc'>
              {currentItem.shortDescription}
            </p>

            <Link
              to={`/news/${currentItem.slug}`}
              className='gc-news-button'
            >
              Xem chi tiết
            </Link>
          </div>

          {/* Center: image + arrows + dots */}
          <div className='gc-news-media'>
            <button
              type='button'
              className='gc-news-arrow gc-news-arrow-left'
              onClick={handlePrev}
            >
              ‹
            </button>

            <div className='gc-news-media-frame'>
              {currentItem.imageUrl && (
                <img
                  src={currentItem.imageUrl}
                  alt={currentItem.title}
                  className='gc-news-image'
                />
              )}
            </div>

            <button
              type='button'
              className='gc-news-arrow gc-news-arrow-right'
              onClick={handleNext}
            >
              ›
            </button>

            {/* Dots */}
            <div className='gc-news-dots'>
              {items.map((item, index) => (
                <button
                  key={item.id}
                  type='button'
                  className={
                    "gc-news-dot" +
                    (index === current
                      ? " is-active"
                      : "")
                  }
                  onClick={() =>
                    setCurrent(index)
                  }
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}