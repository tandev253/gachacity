import { useEffect, useMemo, useState } from "react";
import "../styles/GuidePage.css";
import { getGuides, getGuidePageConfig } from "../api/strapi";

export default function GuidePage() {
  const [activeTab, setActiveTab] = useState("");         // label tab hiện tại
  const [expandedId, setExpandedId] = useState(null);     // id guide đang mở
  const [guides, setGuides] = useState([]);               // danh sách guide từ Strapi
  const [pageConfig, setPageConfig] = useState({});       // config header + label "Tất cả"
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Load data từ Strapi
  useEffect(() => {
    let isMounted = true;

    async function load() {
      try {
        setLoading(true);

        const [config, guidesData] = await Promise.all([
          getGuidePageConfig(),
          getGuides(),
        ]);

        if (!isMounted) return;

        setPageConfig(config || {});
        setGuides(guidesData || []);

        // set tab mặc định là "Tất cả" hoặc label từ config
        const allLabel = config?.allTabLabel || "Tất cả";
        setActiveTab(allLabel);
      } catch (err) {
        console.error(err);
        if (isMounted) {
          setError("Không tải được dữ liệu hướng dẫn.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    load();

    return () => {
      isMounted = false;
    };
  }, []);

  // Tạo danh sách tabs từ category của guides
  const tabs = useMemo(() => {
    const allLabel = pageConfig?.allTabLabel || "Tất cả";
    const categories = Array.from(
      new Set(guides.map((g) => g.category).filter(Boolean))
    );

    // Có thể sort nếu muốn
    categories.sort((a, b) => a.localeCompare(b, "vi"));

    return [allLabel, ...categories];
  }, [guides, pageConfig]);

  // Lọc guides theo tab hiện tại
  const filteredGuides = useMemo(() => {
    const allLabel = pageConfig?.allTabLabel || "Tất cả";
    if (!activeTab || activeTab === allLabel) return guides;
    return guides.filter((g) => g.category === activeTab);
  }, [guides, activeTab, pageConfig]);

  const handleToggleItem = (id) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  if (loading) {
    return (
      <div className="guide-page-container">
        <h1 className="guide-title">
          {pageConfig?.title || "HƯỚNG DẪN"}
        </h1>
        <p className="guide-loading">Đang tải hướng dẫn...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="guide-page-container">
        <h1 className="guide-title">
          {pageConfig?.title || "HƯỚNG DẪN"}
        </h1>
        <p className="guide-error">{error}</p>
      </div>
    );
  }

  return (
    <div className="guide-page-container">
      {/* HEADER lấy từ Strapi */}
      <h1 className="guide-title">
        {pageConfig?.title || "HƯỚNG DẪN"}
      </h1>

      {/* TABS lấy từ category + allTabLabel */}
      <div className="guide-filters">
        {tabs.map((tab) => (
          <button
            key={tab}
            className={`guide-btn ${activeTab === tab ? "active" : ""}`}
            onClick={() => {
              setActiveTab(tab);
              setExpandedId(null); // reset item mở khi đổi tab
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* LIST GUIDES */}
      <div className="guide-list">
        {filteredGuides.length === 0 && (
          <p className="guide-empty">Chưa có hướng dẫn nào trong mục này.</p>
        )}

        {filteredGuides.map((item) => {
          const isExpanded = expandedId === item.id;

          return (
            <div
              key={item.id}
              className={`guide-item ${isExpanded ? "expanded" : ""}`}
              onClick={() => handleToggleItem(item.id)}
            >
              <div className="guide-header">
                <span className="guide-item-text">{item.title}</span>
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className={`guide-item-icon ${isExpanded ? "rotated" : ""}`}
                >
                  <path
                    d="M9 18L15 12L9 6"
                    stroke="#24D56D"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>

              {isExpanded && (
                <div className="guide-content">
                  {item.sections && item.sections.length > 0 ? (
                    item.sections.map((section, idx) => (
                      <div className="guide-section" key={idx}>
                        {section.heading && (
                          <h3 className="guide-section-title">
                            {section.heading}
                          </h3>
                        )}

                        {section.content && (
                          <p
                            className="guide-section-text"
                            // Nếu dùng Rich Text của Strapi (HTML)
                            dangerouslySetInnerHTML={{
                              __html: section.content,
                            }}
                          />
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="guide-section">
                      <p className="guide-section-text">
                        Chưa có nội dung chi tiết cho hướng dẫn này.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
