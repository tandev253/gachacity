// src/pages/AccountPage.jsx
import { useEffect, useState } from "react";
import "../styles/AccountPage.css";
import { getAccount } from "../api/strapi";
import DiscordLinkModal from "../components/DiscordLinkModal";
import ChangePassword from "../components/ChangePassword";
export default function AccountPage() {
  const [user, setUser] = useState(null);
  const [loginHistory, setLoginHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showDiscordModal, setShowDiscordModal] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);

  const handleDiscordConnect = () => {
    const token = localStorage.getItem("gc_token"); 
    if (!token) {
      alert("Bạn cần đăng nhập trước.");
      return;
    }

      window.location.href =
      `${import.meta.env.VITE_AUTH_BACKEND_URL}/api/discord/login?token=${encodeURIComponent(
        token,
      )}`;
  };

  useEffect(() => {
    let isMounted = true;

    const params = new URLSearchParams(window.location.search);
    const discordStatus = params.get("discord");
    if (discordStatus === "success") {
      setShowDiscordModal(true);
      params.delete("discord");
      const newQuery = params.toString();
      const newUrl =
        window.location.pathname +
        (newQuery ? `?${newQuery}` : "");
      window.history.replaceState({}, "", newUrl);
    }

    async function load() {
      try {
        setLoading(true);
        const data = await getAccount();

        if (!isMounted) return;

        setUser({
          username: data.username,
          email: data.email,
          createdAt: data.createdAt
            ? new Date(data.createdAt).toLocaleDateString("vi-VN")
            : "",
          priorityLevel: data.level ?? 0,
          discord: data.discord || null,
        });

        setLoginHistory(data.loginHistory || []);
      } catch (err) {
        console.error(err);
        if (!isMounted) return;

        if (err.message === "NOT_AUTHENTICATED") {
          setError("Bạn chưa đăng nhập.");
        } else if (err.message === "UNAUTHORIZED") {
          setError("Phiên đăng nhập đã hết hạn, hãy đăng nhập lại.");
        } else {
          setError("Không tải được thông tin tài khoản.");
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

  if (loading) {
    return (
      <main className="profile-page">
        <div className="profile-container">
          <h1 className="profile-title">TÀI KHOẢN</h1>
          <p style={{ textAlign: "center", marginTop: 40 }}>
            Đang tải thông tin tài khoản...
          </p>
        </div>
      </main>
    );
  }

  if (error || !user) {
    return (
      <main className="profile-page">
        <div className="profile-container">
          <h1 className="profile-title">TÀI KHOẢN</h1>
          <p style={{ textAlign: "center", marginTop: 40 }}>
            {error}
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="profile-page">
      <div className="profile-container">
        <h1 className="profile-title">TÀI KHOẢN</h1>

        <div className="profile-top-grid">
          {/* ==== THÔNG TIN CÁ NHÂN ==== */}
          <section className="profile-card profile-card--info">
            <div className="profile-card-header">Thông tin cá nhân</div>

            <div className="profile-fields">
              <div className="profile-field">
                <span className="profile-field-label">Tên đăng nhập:</span>
                <div className="profile-field-value">{user.username}</div>
              </div>

              <div className="profile-field">
                <span className="profile-field-label">Email:</span>
                <div className="profile-field-value">{user.email}</div>
              </div>

              <div className="profile-field">
                <span className="profile-field-label">Discord:</span>
                <div className="profile-field-value profile-field-value--discord">
                  {user.discord && user.discord.username ? (
                    <>
                      {user.discord.avatarUrl && (
                        <img
                          src={user.discord.avatarUrl}
                          alt={user.discord.username}
                          className="discord-avatar"
                        />
                      )}
                      <span className="discord-username">
                        {user.discord.username}
                      </span>
                    </>
                  ) : (
                    "✕ Chưa liên kết"
                  )}
                </div>
              </div>

              <div className="profile-field">
                <span className="profile-field-label">Ngày tạo:</span>
                <div className="profile-field-value">{user.createdAt}</div>
              </div>
            </div>
          </section>

          {/* ==== THỐNG KÊ ==== */}
          <section className="profile-card profile-card--stats">
            <div className="profile-card-header">Thống kê</div>

            <div className="profile-stat-block">
              <span className="profile-stat-label">Ưu tiên</span>
              <div className="profile-stat-level">
                Level {user.priorityLevel}
              </div>
            </div>

            <button className="gc-btn gc-btn-gradient profile-donate-btn">
              <span className="gc-btn-icon">💎</span>
              <span>Donate ngay</span>
            </button>
          </section>
        </div>

        {/* ==== HÀNH ĐỘNG ==== */}
        <section className="profile-card profile-card--actions">
          <div className="profile-card-header">Hành động</div>

          <div className="profile-actions-grid">
            <button
              className="gc-btn gc-btn-outline"
              onClick={() => setShowChangePassword(true)}
              >
              <span className="gc-btn-icon">🔒</span>
              <span>Đổi mật khẩu</span>
            </button>

            <button
              className="gc-btn gc-btn-outline"
              onClick={() => setShowDiscordModal(true)}
             >
              <span className="gc-btn-icon">🕹️</span>
              <span>Liên kết Discord</span>
            </button>
          </div>
        </section>


        {/* ==== LỊCH SỬ ĐĂNG NHẬP ==== */}
        <section className="profile-card profile-card--logins">
          <div className="profile-card-header">Lịch sử đăng nhập</div>

          <div className="login-table">
            <div className="login-table-header">
              <div>Thời gian</div>
              <div>IP Address</div>
              <div>Thiết bị</div>
              <div>Trạng thái</div>
            </div>

            <div className="login-table-body">
              {loginHistory.length === 0 && (
                <div className="login-table-row">
                  <div>—</div>
                  <div>—</div>
                  <div>Chưa có lịch sử đăng nhập</div>
                  <div>—</div>
                </div>
              )}

              {loginHistory.map((item, index) => (
                <div className="login-table-row" key={index}>
                  <div>{item.time}</div>
                  <div className="login-ip">{item.ip}</div>
                  <div>{item.device}</div>

                  <div>
                    <span
                      className={
                        "login-status " +
                        (item.status?.toLowerCase() === "success"
                          ? "success"
                          : "failed")
                      }
                    >
                      {item.status?.toLowerCase() === "success"
                        ? "✓ Thành công"
                        : "✕ Thất bại"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>

      {/* ==== MODAL DISCORD ==== */}
      <DiscordLinkModal
        open={showDiscordModal}
        onClose={() => setShowDiscordModal(false)}
        onConnect={handleDiscordConnect}
        discordUser={user?.discord}
      />
      <ChangePassword
        open={showChangePassword}
        onClose={() => setShowChangePassword(false)}
      />  
    </main>
  );
}
