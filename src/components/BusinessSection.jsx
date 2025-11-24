import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../styles/business-section.css";
import { getBusinesses } from "../api/strapi"; // hàm gọi Strapi

export default function BusinessSection() {
  const [items, setItems] = useState([]);
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    async function load() {
      try {
        setLoading(true);
        const data = await getBusinesses(); // trả về array
        if (!isMounted) return;

        setItems(data || []);
        setCurrent(0);
      } catch (err) {
        console.error(err);
        if (isMounted) {
          setError(
            "Không tải được danh sách doanh nghiệp.",
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

  const handlePrev = () => {
    if (!items.length) return;
    setCurrent(
      (prev) =>
        (prev - 1 + items.length) % items.length,
    );
  };

  const handleNext = () => {
    if (!items.length) return;
    setCurrent(
      (prev) => (prev + 1) % items.length,
    );
  };

  // chỉ hiển thị 3 thằng: prev - current - next
  const getVisibleItems = () => {
    if (items.length === 0) return [];

    if (items.length === 1) {
      // chỉ có 1 doanh nghiệp → chỉ trả đúng 1 card
      return [
        {
          item: items[0],
          index: 0,
        },
      ];
    }

    if (items.length === 2) {
      // có 2 → hiển thị 2
      return [
        { item: items[0], index: 0 },
        { item: items[1], index: 1 },
      ];
    }

    // >= 3 bình thường
    const prevIndex =
      (current - 1 + items.length) % items.length;
    const nextIndex =
      (current + 1) % items.length;

    return [
      {
        item: items[prevIndex],
        index: prevIndex,
      },
      { item: items[current], index: current },
      {
        item: items[nextIndex],
        index: nextIndex,
      },
    ];
  };


  if (loading) {
    return (
      <section className='gc-business-section'>
        <div className='gc-business-inner'>
          <p className='gc-business-loading'>
            Đang tải doanh nghiệp...
          </p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className='gc-business-section'>
        <div className='gc-business-inner'>
          <p className='gc-business-error'>
            {error}
          </p>
        </div>
      </section>
    );
  }

  if (!items.length) {
    return (
      <section className='gc-business-section'>
        <div className='gc-business-inner'>
          <p className='gc-business-empty'>
            Chưa có doanh nghiệp nào.
          </p>
        </div>
      </section>
    );
  }

  const visible = getVisibleItems();

  return (
    <section className='gc-business-section'>
      <div className='gc-business-inner'>
        {/* Tiêu đề */}
        <div className='gc-business-header'>
          <h2 className='gc-business-title'>
            DOANH NGHIỆP
          </h2>
          <p className='gc-business-subtitle'>
            Các doanh nghiệp trong thành phố và
            tìm kiếm công việc phù hợp với bạn
          </p>
        </div>

        {/* Slider */}
        <div className='gc-business-slider'>
          <button
            className='gc-business-arrow gc-business-arrow-left'
            onClick={handlePrev}
          ></button>

          <div className='gc-business-cards'>
            {visible.map(({ item, index }) => {
              if (!item) return null; // tránh crash toàn bộ UI
              const isActive = index === current;

              // tùy Strapi: chỉnh field cho đúng
              const name =
                item.name ||
                item.title ||
                "Tên doanh nghiệp";
              const logoUrl = item.logoUrl;

              const slug = item.slug || item.id;

              return (
                <div
                  key={index}
                  className={
                    "gc-business-card" +
                    (isActive
                      ? " gc-business-card--active"
                      : "")
                  }
                >
                  <div className='gc-business-card-inner'>
                    {logoUrl && (
                      <img
                        src={logoUrl}
                        alt={name}
                        className='gc-business-logo'
                      />
                    )}
                    <div className='gc-business-card-footer'>
                      {isActive && (
                        <Link
                          to={`/business/${slug}`}
                          className='gc-business-button'
                        >
                          Xem chi tiết
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <button
            className='gc-business-arrow gc-business-arrow-right'
            onClick={handleNext}
          ></button>
        </div>
      </div>
    </section>
  );
}
