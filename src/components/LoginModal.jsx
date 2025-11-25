// src/components/LoginModal.jsx
import { useState, useEffect } from "react";
import "../styles/login-modal.css";
import { useAuth } from "../contexts/AuthContext";
import eyeIcon from "../assets/eye-Icon.png";


export default function LoginModal({
  isOpen,
  onClose,
  onOpenRegister,
}) {
  const [mounted, setMounted] = useState(false);
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [showPassword, setShowPassword] =
    useState(false);
  const [rememberMe, setRememberMe] =
    useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!mounted || !isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login({
        identifier: formData.username,
        password: formData.password,
        rememberMe,
      });

      onClose();
    } catch (err) {
      setError(
        err.message ||
        "Tên đăng nhập hoặc mật khẩu không đúng",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className='gc-modal-backdrop'
      onClick={handleBackdropClick}
    >
      <div
        className='gc-login-modal'
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type='button'
          className='gc-login-close'
          onClick={onClose}
        >
          ✕
        </button>

        <h2 className='gc-login-title'>
          ĐĂNG NHẬP
        </h2>

        <form
          className='gc-login-form'
          onSubmit={handleSubmit}
        >
          {error && (
            <div className='gc-error-box'>
              {error}
            </div>
          )}

          <label className='gc-field'>
            <span className='gc-field-label'>
              Tên đăng nhập
            </span>
            <div className='gc-input-wrapper'>
              <input
                type='text'
                className='gc-input'
                placeholder='Nhập tên đăng nhập'
                required
                value={formData.username}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    username: e.target.value,
                  })
                }
              />
            </div>
          </label>

          <label className='gc-field'>
            <span className='gc-field-label'>
              Mật khẩu
            </span>
            <div className='gc-input-wrapper gc-input-password'>
              <input
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                className='gc-input'
                placeholder='Nhập mật khẩu'
                required
                value={formData.password}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    password: e.target.value,
                  })
                }
              />
              <button
                type='button'
                className='gc-input-eye'
                onClick={() => setShowPassword((v) => !v)}
              >
                <img src={eyeIcon} alt="Toggle" />
              </button>
            </div>
          </label>

          <div className='gc-login-row'>
            <label className='gc-remember'>
              <input
                type='checkbox'
                checked={rememberMe}
                onChange={(e) =>
                  setRememberMe(e.target.checked)
                }
              />
              <span>Lưu mật khẩu</span>
            </label>

            <button
              type='button'
              className='gc-forgot-btn'
            >
              Quên mật khẩu?
            </button>
          </div>

          <button
            type='submit'
            className='gc-login-submit'
            disabled={loading}
          >
            {loading
              ? "Đang đăng nhập..."
              : "Vào thành phố"}
          </button>

          <div className='gc-login-bottom'>
            <span>Bạn chưa có tài khoản?</span>
            <button
              type='button'
              className='gc-register-link'
              onClick={onOpenRegister}
            >
              Đăng ký ngay
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
