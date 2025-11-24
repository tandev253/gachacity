// src/components/GuideSection.jsx
import "../styles/guide-section.css";

export default function GuideSection() {
  return (
    <section className='gc-guide'>
      <div className='gc-guide-inner'>
        <h2 className='gc-guide-title'>
          HƯỚNG DẪN VÀO THÀNH PHỐ
        </h2>
        <p className='gc-guide-subtitle'>
          Bạn là người mới? Hãy gia nhập cùng
          chúng tôi!
        </p>

        <div className='gc-guide-steps'>
          {/* STEP 1 */}
          <div className='gc-guide-step gc-guide-step--left'>
            <div className='gc-guide-badge'>
              <svg width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="gc-guide-badge-bg">
                <path d="M50 3.5L90.4 26.8C92.6 28.1 94 30.5 94 33.1V66.9C94 69.5 92.6 71.9 90.4 73.2L50 96.5C47.8 97.8 45.1 97.8 42.9 96.5L9.6 73.2C7.4 71.9 6 69.5 6 66.9V33.1C6 30.5 7.4 28.1 9.6 26.8L50 3.5Z"
                  fill="url(#badge-glow)"
                  stroke="#24D56D"
                  strokeWidth="0.5" />
                <defs>
                  <radialGradient id="badge-glow" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(50 50) rotate(90) scale(50)">
                    <stop offset="0.6" stopColor="#000000" />
                    <stop offset="1" stopColor="#24D56D" stopOpacity="0.6" />
                  </radialGradient>
                </defs>
              </svg>
              <span>01</span> {/* . */}
            </div>

            <h3 className='gc-guide-step-title'>
              MUA GTA V
            </h3>
            <p className='gc-guide-step-desc'>
              Tải và cài đặt Grand Theft Auto V từ
              Epic Games hoặc Steam. Đảm bảo bạn
              có bản game gốc để chơi được server.
            </p>

            <div className='gc-guide-step-platforms'>
              <img
                src='/images/icons/epic-icon.png'
                alt='Epic Games'
                className='gc-guide-platform-icon'
              />
              <img
                src='/images/icons/steam-icon.png'
                alt='Steam'
                className='gc-guide-platform-icon'
              />
            </div>
          </div>

          {/* STEP 2 */}
          <div className='gc-guide-step gc-guide-step--center'>
            <div className='gc-guide-badge'>
              <svg width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="gc-guide-badge-bg">
                <path d="M50 3.5L90.4 26.8C92.6 28.1 94 30.5 94 33.1V66.9C94 69.5 92.6 71.9 90.4 73.2L50 96.5C47.8 97.8 45.1 97.8 42.9 96.5L9.6 73.2C7.4 71.9 6 69.5 6 66.9V33.1C6 30.5 7.4 28.1 9.6 26.8L50 3.5Z"
                  fill="url(#badge-glow)"
                  stroke="#24D56D"
                  strokeWidth="0.5" />
                <defs>
                  <radialGradient id="badge-glow" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(50 50) rotate(90) scale(50)">
                    <stop offset="0.6" stopColor="#000000" />
                    <stop offset="1" stopColor="#24D56D" stopOpacity="0.6" />
                  </radialGradient>
                </defs>
              </svg>
              <span>02</span> {/* 02 */}
            </div>

            <h3 className='gc-guide-step-title'>
              TẢI LAUNCHER
            </h3>
            <p className='gc-guide-step-desc'>
              Mở GTA V và nhập IP Server được cung
              cấp để kết nối vào thành phố. Hãy
              tuân thủ luật để có trải nghiệm tốt
              nhất.
            </p>
          </div>

          {/* STEP 3 */}
          <div className='gc-guide-step gc-guide-step--right'>
            <div className='gc-guide-badge'>
              <svg width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="gc-guide-badge-bg">
                <path d="M50 3.5L90.4 26.8C92.6 28.1 94 30.5 94 33.1V66.9C94 69.5 92.6 71.9 90.4 73.2L50 96.5C47.8 97.8 45.1 97.8 42.9 96.5L9.6 73.2C7.4 71.9 6 69.5 6 66.9V33.1C6 30.5 7.4 28.1 9.6 26.8L50 3.5Z"
                  fill="url(#badge-glow)"
                  stroke="#24D56D"
                  strokeWidth="0.5" />
                <defs>
                  <radialGradient id="badge-glow" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(50 50) rotate(90) scale(50)">
                    <stop offset="0.6" stopColor="#000000" />
                    <stop offset="1" stopColor="#24D56D" stopOpacity="0.6" />
                  </radialGradient>
                </defs>
              </svg>
              <span>03</span> {/* 03 */}
            </div>

            <h3 className='gc-guide-step-title'>
              VÀO DISCORD
            </h3>
            <p className='gc-guide-step-desc'>
              Tham gia Discord chính thức của
              thành phố để nhận hướng dẫn chi
              tiết, luật lệ và IP server. Nhớ xác
              minh tài khoản để nhận quyền truy
              cập đầy đủ.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
