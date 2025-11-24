import { useEffect, useState } from "react";
import "../styles/change-password.css";

export default function ChangePassword({ open, onClose }) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return;

    function handleKey(e) {
      if (e.key === "Escape") {
        onClose?.();
      }
    }

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [open, onClose]);

  if (!open) return null;

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!currentPassword || !newPassword || !confirmPassword) {
      setError("Vui lòng điền đầy đủ thông tin.");
      return;
    }

    if (newPassword.length < 6) {
      setError("Mật khẩu mới phải có ít nhất 6 ký tự.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Xác nhận mật khẩu mới không khớp.");
      return;
    }

    const token = localStorage.getItem("gc_token");
    if (!token) {
      setError("Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại.");
      return;
    }

    try {
      setLoading(true);

      // TODO: chỉnh lại endpoint cho đúng theo backend của bạn
      const res = await fetch(
        `${import.meta.env.VITE_AUTH_BACKEND_URL}/api/change-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            currentPassword,
            newPassword,
          }),
        },
      );

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(
          data?.message ||
            data?.error ||
            "Đổi mật khẩu thất bại. Vui lòng thử lại.",
        );
        return;
      }

      setSuccess("Đổi mật khẩu thành công.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

      // đóng sau 1s cho giống cảm giác Figma
      setTimeout(() => {
        onClose?.();
        setSuccess("");
      }, 1000);
    } catch (err) {
      console.error(err);
      setError("Có lỗi xảy ra, vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  }

  function handleBackdropClick(e) {
    if (e.target === e.currentTarget) {
      onClose?.();
    }
  }

  return (
    <div
      className="cp-backdrop"
      onClick={handleBackdropClick}
    >
      <div className="cp-modal">
        <button
          className="cp-close-btn"
          type="button"
          onClick={onClose}
          aria-label="Đóng"
        >
          ×
        </button>

        <h2 className="cp-title">ĐỔI MẬT KHẨU</h2>

        <form className="cp-form" onSubmit={handleSubmit}>
          <div className="cp-field">
            <label className="cp-label">Mật khẩu hiện tại</label>
            <input
              type="password"
              className="cp-input"
              placeholder="Nhập mật khẩu hiện tại"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
          </div>

          <div className="cp-field">
            <label className="cp-label">Mật khẩu mới</label>
            <input
              type="password"
              className="cp-input"
              placeholder="Ít nhất 6 ký tự"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>

          <div className="cp-field">
            <label className="cp-label">Xác nhận mật khẩu mới</label>
            <input
              type="password"
              className="cp-input"
              placeholder="Nhập mật khẩu mới"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          {error && <div className="cp-message cp-message--error">{error}</div>}
          {success && (
            <div className="cp-message cp-message--success">{success}</div>
          )}

          <button
            type="submit"
            className="cp-submit-btn"
            disabled={loading}
          >
            {loading ? "Đang xử lý..." : "Đổi mật khẩu"}
          </button>
        </form>
      </div>
    </div>
  );
}
