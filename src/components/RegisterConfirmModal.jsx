import { useState } from "react";
import { useGoogleLogin } from "@react-oauth/google";
import "../styles/register-confirm-modal.css";
import { AUTH_BACKEND_URL } from "../api/auth/auth";

export default function RegisterConfirmModal({
  isOpen,
  onClose,
  username,
  onBack,
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setLoading(true);
      setError("");

      try {
        const userInfoResponse = await fetch(
          "https://www.googleapis.com/oauth2/v3/userinfo",
          {
            headers: {
              Authorization: `Bearer ${tokenResponse.access_token}`,
            },
          },
        );
        const userInfo =
          await userInfoResponse.json();

        let pending = null;
        try {
          const raw = sessionStorage.getItem(
            "pendingRegistration",
          );
          if (raw) pending = JSON.parse(raw);
        } catch (err) {
          console.warn(
            "Không đọc được pendingRegistration:",
            err,
          );
        }

        if (!pending) {
          setError(
            "Không tìm thấy thông tin đăng ký. Vui lòng thử lại từ đầu.",
          );
          setLoading(false);
          return;
        }

        const response = await fetch(
          `${AUTH_BACKEND_URL}/api/auth/complete-registration`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              username:
                pending.username || username,
              password: pending.password,
              email: userInfo.email,
              googleVerified: true,
            }),
          },
        );

        const data = await response.json();

        if (response.ok) {
          try {
            sessionStorage.removeItem(
              "pendingRegistration",
            );
          } catch {}

          onClose();
        } else {
          setError(
            data.error ||
              "Có lỗi xảy ra khi đăng ký",
          );
        }
      } catch (err) {
        console.error(
          "Google registration error:",
          err,
        );
        setError(
          "Có lỗi xảy ra khi kết nối với Google",
        );
      } finally {
        setLoading(false);
      }
    },
    onError: () => {
      setError("Đăng nhập Google thất bại");
      setLoading(false);
    },
  });

  const handleGoogleClick = () => {
    setError("");
    setLoading(true);
    googleLogin();
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className='gc-modal-backdrop'
      onClick={handleBackdropClick}
    >
      <div
        className='gc-register-confirm-modal'
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className='gc-register-confirm-close'
          onClick={onClose}
        >
          ✕
        </button>

        <h2 className='gc-register-confirm-title'>
          ĐĂNG KÝ
        </h2>

        <div className='gc-register-confirm-content'>
          <div className='gc-check-line'>
            <span className='gc-check-icon'>
              ✅
            </span>
            <span className='gc-check-label'>
              Thông tin tài khoản đã xác nhận!
              <br />
              <span className='gc-username-line'>
                Tên đăng nhập:{" "}
                <span className='gc-username'>
                  {username}
                </span>
              </span>
            </span>
          </div>

          <p className='gc-register-confirm-desc'>
            Bước cuối: Xác thực email bằng tài
            khoản Google của bạn.
          </p>

          <div className='gc-register-confirm-box'>
            <p>
              <strong>
                💡 Email sẽ được lấy từ tài khoản
                Google
              </strong>
            </p>
          </div>

          {error && (
            <div className='gc-register-confirm-error'>
              {error}
            </div>
          )}

          <button
            className='gc-google-btn'
            onClick={handleGoogleClick}
            disabled={loading}
          >
            <img
              src='/images/icons/icon-google.png'
              alt=''
              className='gc-google-icon'
            />
            {loading
              ? "Đang xử lý..."
              : "Tiếp tục với Google"}
          </button>

          <button
            className='gc-back-btn'
            onClick={onBack}
            disabled={loading}
          >
            ← Quay lại
          </button>
        </div>
      </div>
    </div>
  );
}
