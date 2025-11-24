
import React from "react";
import "../styles/DiscordLinkModal.css";

export default function DiscordLinkModal({
  open,
  onClose,
  onConnect,
  discordUser, 
}) {
  if (!open) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) onClose?.();
  };

  const isLinked =
    !!discordUser && !!discordUser.username;

  return (
    <div
      className='discord-modal-backdrop'
      onClick={handleBackdropClick}
    >
      <div className='discord-modal'>
        <button
          className='discord-modal-close'
          type='button'
          onClick={onClose}
        >
          ✕
        </button>

        <div className='discord-modal-header'>
          <div className='discord-header-icon'>
            💬
          </div>
          <h2 className='discord-modal-title'>
            Liên kết Discord
          </h2>
        </div>

        {isLinked && (
          <>
            <p className='discord-success-text'>
              Liên kết Discord thành công!
            </p>
            <div className='discord-current-box'>
              <span className='discord-current-label'>
                Discord hiện tại:
              </span>
              <span className='discord-current-name'>
                {discordUser.username}
              </span>
            </div>

            
          </>
        )}

        <button
          type='button'
          className='discord-connect-btn'
          onClick={onConnect}
        >
          <span className='discord-connect-icon'>
            <svg
              viewBox='0 0 24 24'
              aria-hidden='true'
            >
              <path d='M20 4.5A19.6 19.6 0 0 0 15.9 3l-.5 1.1a18.3 18.3 0 0 0-3.8 0L11.1 3A19.5 19.5 0 0 0 7 4.5C4.4 8.2 3.8 11.8 4 15.4A19.7 19.7 0 0 0 9 17l.7-1.5a6.4 6.4 0 0 1-1-.5l.2-.2a8 8 0 0 0 6.2 0l.2.2a6.4 6.4 0 0 1-1 .5l.7 1.5a19.7 19.7 0 0 0 5-1.6c.3-3.6-.3-7.2-2.8-10.9ZM9.7 13.8c-.9 0-1.6-.7-1.6-1.6 0-.8.7-1.5 1.6-1.5s1.7.7 1.6 1.5c0 .9-.7 1.6-1.6 1.6Zm4.6 0c-.9 0-1.6-.7-1.6-1.6 0-.8.7-1.5 1.6-1.5s1.7.7 1.6 1.5c0 .9-.7 1.6-1.6 1.6Z' />
            </svg>
          </span>
          <span className='discord-connect-text'>
            {isLinked
              ? "Liên kết lại với Discord"
              : "Liên kết với Discord"}
          </span>
        </button>

        <p className='discord-modal-subtext'>
          {isLinked
            ? "Click để cập nhật thông tin Discord"
            : "Liên kết tài khoản Discord của bạn chỉ với 1 click"}
        </p>
      </div>
    </div>
  );
}
