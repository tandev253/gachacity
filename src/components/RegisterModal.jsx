// src/components/RegisterModal.jsx
import { useState } from "react";
import "../styles/register-modal.css";

export default function RegisterModal({
  isOpen,
  onClose,
  onOpenLogin,
  onOpenConfirm,
}) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirm) {
      setError("Mật khẩu xác nhận không khớp.");
      return;
    }
    const pending = {
      username,
      password,
    };

    try {
      sessionStorage.setItem(
        "pendingRegistration",
        JSON.stringify(pending),
      );
    } catch (err) {
      console.warn(
        "Không lưu được pendingRegistration:",
        err,
      );
    }

    if (onOpenConfirm) {
      onOpenConfirm(username);
    }
  };

  return (
    <div
      className='gc-modal-backdrop'
      onClick={onClose}
    >
      <div
        className='gc-register-modal'
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type='button'
          className='gc-register-close'
          onClick={onClose}
        >
          ✕
        </button>

        <h2 className='gc-register-title'>
          ĐĂNG KÝ
        </h2>

        <form
          className='gc-register-form'
          onSubmit={handleSubmit}
        >
          <label className='gc-register-field'>
            <span className='gc-register-label'>
              Tên đăng nhập
            </span>
            <div className='gc-register-input-wrap'>
              <input
                type='text'
                className='gc-register-input'
                placeholder='Nhập tên đăng nhập'
                value={username}
                onChange={(e) =>
                  setUsername(e.target.value)
                }
                required
              />
            </div>
          </label>

          <label className='gc-register-field'>
            <span className='gc-register-label'>
              Mật khẩu
            </span>
            <div className='gc-register-input-wrap'>
              <input
                type='password'
                className='gc-register-input'
                placeholder='Nhập mật khẩu'
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                required
              />
            </div>
          </label>

          <label className='gc-register-field'>
            <span className='gc-register-label'>
              Xác nhận mật khẩu
            </span>
            <div className='gc-register-input-wrap'>
              <input
                type='password'
                className='gc-register-input'
                placeholder='Nhập lại mật khẩu'
                value={confirm}
                onChange={(e) =>
                  setConfirm(e.target.value)
                }
                required
              />
            </div>
          </label>

          {error && (
            <div className='gc-register-error'>
              {error}
            </div>
          )}

          <button
            type='submit'
            className='gc-register-submit'
          >
            Tiếp tục
          </button>
        </form>

        <div className='gc-register-bottom'>
          <span>Bạn đã có tài khoản?</span>
          <button
            type='button'
            className='gc-register-link-btn'
            onClick={onOpenLogin}
          >
            Đăng nhập
          </button>
        </div>
      </div>
    </div>
  );
}
