import { useState, useMemo } from "react";
import Footer from "../components/Footer";
import "../styles/DonatePage.css";

const PACKAGES = [
  { id: 1, amount: 50000, coins: 50 },
  { id: 2, amount: 50000, coins: 50 },
  { id: 3, amount: 50000, coins: 50 },
  { id: 4, amount: 50000, coins: 50 },
  { id: 5, amount: 50000, coins: 50 },
  { id: 6, amount: 50000, coins: 50 },
  { id: 7, amount: 50000, coins: 50 },
  { id: 8, amount: 50000, coins: 50 },
];

export default function DonatePage() {
  const [selectedId, setSelectedId] = useState(null);
  const [customAmount, setCustomAmount] = useState("");

  const selectedAmount = useMemo(() => {
    if (selectedId) {
      const pkg = PACKAGES.find((p) => p.id === selectedId);
      return pkg ? pkg.amount : 0;
    }
    return customAmount ? Number(customAmount) : 0;
  }, [selectedId, customAmount]);

  const receivedCoins = useMemo(() => {
    return selectedAmount > 0 ? selectedAmount / 1000 : 0;
  }, [selectedAmount]);

  function handleSelectPackage(id, amount) {
    setSelectedId(id);
    setCustomAmount("");
  }

  function handleCustomChange(e) {
    const value = e.target.value.replace(/[^\d]/g, "");
    setCustomAmount(value);
    setSelectedId(null);
  }

  function formatMoney(value) {
    if (!value) return "0đ";
    return value.toLocaleString("vi-VN") + "đ";
  }

  return (
    <>
    <main className="gc-donate-page">
      
      <div className="gc-donate-inner">
        <header className="gc-donate-heading">
          <h1>DONATE</h1>
          <p>
            Donate để nhận coin và các đặc quyền trong game
          </p>
        </header>

        <section className="gc-donate-layout">
          <div className="gc-donate-card gc-donate-packages">
            <div className="gc-donate-card-header">
              <h2>Mệnh giá</h2>
            </div>

            <div className="gc-donate-packages-grid">
              {PACKAGES.map((pkg) => (
                <button
                  key={pkg.id}
                  type="button"
                  className={
                    "gc-donate-package" +
                    (selectedId === pkg.id
                      ? " is-selected"
                      : "")
                  }
                  onClick={() =>
                    handleSelectPackage(pkg.id, pkg.amount)
                  }
                >
                  <span className="gc-donate-package-amount">
                    {formatMoney(pkg.amount)}
                  </span>
                  <span className="gc-donate-package-coins">
                    {pkg.coins} coin
                  </span>
                </button>
              ))}
            </div>

            <div className="gc-donate-custom-wrapper">
              <span className="gc-donate-custom-label">
                Hoặc nhập số tiền tùy chỉnh
              </span>
              <div className="gc-donate-custom-input-wrap">
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder="Tối thiểu 10.000đ"
                  value={
                    customAmount
                      ? customAmount.replace(
                          /\B(?=(\d{3})+(?!\d))/g,
                          "."
                        ) + "đ"
                      : ""
                  }
                  onChange={handleCustomChange}
                  className="gc-donate-custom-input"
                />
              </div>
            </div>
          </div>
          <div className="gc-donate-right">
            <div className="gc-donate-card gc-donate-bank">
              <div className="gc-donate-bank-header">
                <div className="gc-donate-bank-icon">
                  🏦
                </div>
                <div className="gc-donate-bank-title">
                  <div className="gc-donate-bank-main">
                    Chuyển khoản
                  </div>
                  <div className="gc-donate-bank-sub">
                    ngân hàng
                  </div>
                </div>
              </div>

              <div className="gc-donate-summary-card">
                <div className="gc-donate-summary-row">
                  <span className="label">Số tiền</span>
                  <span className="value">
                    {formatMoney(selectedAmount)}
                  </span>
                </div>
                <div className="gc-donate-summary-row">
                  <span className="label">
                    Coin nhận được
                  </span>
                  <span className="value highlight">
                    {receivedCoins.toLocaleString("vi-VN")}{" "}
                    coin
                  </span>
                </div>
                <div className="gc-donate-summary-row">
                  <span className="label">Nội dung CK</span>
                  <span className="value">
                    GACHACITY + ID
                  </span>
                </div>
              </div>

            <button
                type="button"
                className="gc-donate-qr-button"
              >
                Tạo mã QR thanh toán
              </button>  

              
            </div>
            <div className="gc-donate-card gc-donate-note">
              <div className="gc-donate-note-header">
                <span className="gc-donate-note-icon">▲</span>
                <span className="gc-donate-note-title">
                  Lưu ý:
                </span>
              </div>
              <ul className="gc-donate-note-list">
                <li>
                  <span className="gc-donate-note-highlight">
                    PHẢI ONLINE TRONG GAME HOẶC VÀO GAME NGAY TRƯỚC KHI SERVER KHỞI ĐỘNG LẠI
                  </span>
                </li>
                <li>
                  <span className="gc-donate-note-highlight">Nội dung chuyển khoản: GACHACITY + ID</span>
                </li>
                <li>
                  Số coin được cộng tự động sau khi thanh toán
                  thành công
                </li>
                <li>
                  Thời gian xử lý: 1–5 phút
                </li>
                <li>
                  Liên hệ Admin nếu sau 30 phút chưa nhận được
                  coin
                </li>
                <li>
                  Tỷ lệ: 10.000đ = 1 coin
                </li>
              </ul>
            </div>      
            
          </div>
          
        </section>
      </div>
    </main>
    <Footer />
    </>
  );
}
