// src/pages/NewsDetail.jsx
import { useEffect, useState } from "react";
import {
  useNavigate,
  useParams,
} from "react-router-dom";
import "../styles/news-detail-page.css";
import { getNewsDetail } from "../api/strapi";
import copyIcon from "../assets/copy-link.png";
import fbIcon from "../assets/fb-icon.png";
import xIcon from "../assets/x-icon.png";

export default function NewsDetail() {
  const navigate = useNavigate();
  const { slug } = useParams();

  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!slug) {
      setError("Không tìm thấy bài viết này.");
      setLoading(false);
      return;
    }

    let isMounted = true;

    async function load() {
      try {
        setLoading(true);
        const data = await getNewsDetail(slug);
        if (!isMounted) return;

        setItem(data);
        setError("");
      } catch (err) {
        if (isMounted) {
          setError(
            "Không tìm thấy bài viết này.",
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
  }, [slug]);

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleDateString(
      "vi-VN",
      {
        day: "2-digit",
        month: "long",
        year: "numeric",
      },
    );
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(
        window.location.href,
      );
      alert("Đã copy link!");
    } catch { }
  };

  const handleShareFB = () => {
    const url = encodeURIComponent(
      window.location.href,
    );
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${url}`,
      "_blank",
    );
  };

  const handleShareTwitter = () => {
    const url = encodeURIComponent(
      window.location.href,
    );
    const text = encodeURIComponent(
      item?.title || "",
    );
    window.open(
      `https://twitter.com/intent/tweet?url=${url}&text=${text}`,
      "_blank",
    );
  };

  return (
    <main className='gc-news-detail-page'>
      <div className='gc-news-detail-inner'>
        <button
          className='gc-news-detail-back'
          type='button'
          onClick={() => navigate("/tin-tuc")}
        >
          ‹ Quay lại danh sách tin tức
        </button>

        {loading && (
          <p className='gc-news-detail-status'>
            Đang tải...
          </p>
        )}

        {error && !loading && (
          <p className='gc-news-detail-status gc-news-detail-status--error'>
            {error}
          </p>
        )}

        {!loading && !error && item && (
          <article className='gc-news-detail-card'>
            <header className='gc-news-detail-header'>
              <h1 className='gc-news-detail-title'>
                {item.title}
              </h1>
              <p className='gc-news-detail-date'>
                {formatDate(item.publishedAt)}
              </p>
            </header>

            <section className='gc-news-detail-body'>
              <p className='gc-news-detail-body-text'>
                {item.content}
              </p>
            </section>

            <footer className='gc-news-detail-footer'>
              <span className='gc-news-detail-share-label'>
                Chia sẻ bài viết
              </span>
              <div className='gc-news-detail-share-buttons'>
                <button onClick={handleCopyLink} className='gc-news-detail-share-btn'>
                  <img src={copyIcon} alt="" className="gc-share-icon" />
                  Copy link
                </button>
                <button onClick={handleShareFB} className='gc-news-detail-share-btn'>
                  <img src={fbIcon} alt="" className="gc-share-icon" />
                  Facebook
                </button>
                <button onClick={handleShareTwitter} className='gc-news-detail-share-btn'>
                  <img src={xIcon} alt="" className="gc-share-icon" />
                  Twitter
                </button>
              </div>
            </footer>
          </article>
        )}
      </div>
    </main>
  );
}