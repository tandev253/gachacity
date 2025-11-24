// src/components/Navbar.jsx
import {
  useEffect,
  useState,
  useRef,
} from "react";
import {
  Link,
  NavLink,
  useLocation,
  useNavigate,
} from "react-router-dom";
import "../styles/navbar.css";
import LoginModal from "./LoginModal";
import RegisterModal from "./RegisterModal";
import RegisterConfirmModal from "./RegisterConfirmModal";
import { useAuth } from "../contexts/AuthContext";

export default function Navbar() {
  const [isMobileOpen, setIsMobileOpen] =
    useState(false);
  const [isLoginOpen, setIsLoginOpen] =
    useState(false);
  const [isRegisterOpen, setIsRegisterOpen] =
    useState(false);
  const [
    isRegisterConfirmOpen,
    setIsRegisterConfirmOpen,
  ] = useState(false);
  const [tempUsername, setTempUsername] =
    useState("");

  const [
    isAccountMenuOpen,
    setIsAccountMenuOpen,
  ] = useState(false);
  const accountRef = useRef(null);

  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } =
    useAuth();

  useEffect(() => {
    setIsMobileOpen(false);
    setIsAccountMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    function handleClickOutside(e) {
      if (
        accountRef.current &&
        !accountRef.current.contains(e.target)
      ) {
        setIsAccountMenuOpen(false);
      }
    }

    document.addEventListener(
      "mousedown",
      handleClickOutside,
    );
    return () =>
      document.removeEventListener(
        "mousedown",
        handleClickOutside,
      );
  }, []);

  const MENU = [
    { name: "Trang chủ", url: "/" },
    { name: "Hướng dẫn", url: "/huong-dan" },
    { name: "Tin Tức", url: "/tin-tuc" },
    { name: "Donate", url: "/donate" },
    { name: "Tài khoản", url: null },
  ];

  const handleAccountClick = () => {
    if (isAuthenticated) {
      setIsAccountMenuOpen((open) => !open);
    } else {
      setIsLoginOpen(true);
    }
  };

  const handleGoProfile = () => {
    setIsAccountMenuOpen(false);
    navigate("/tai-khoan");
  };

  const handleLogout = () => {
    setIsAccountMenuOpen(false);
    logout();
    navigate("/");
  };

  return (
    <>
      <header className='gc-navbar'>
        <div className='gc-navbar-inner'>
          <Link to='/' className='gc-navbar-logo'>
            <img
              src='/images/logos/logo-navbar.png'
              alt='Gacha City'
              className='gc-navbar-logo-img'
            />
            <div className='gc-navbar-logo-text'>
              <span className='gc-logo-line1'>
                GACHA
              </span>
              <span className='gc-logo-line2'>
                CITY
              </span>
            </div>
          </Link>

          <nav className='gc-navbar-menu'>
            {MENU.map((item, index) => {
              if (item.url === null) {
                // nút tài khoản
                if (isAuthenticated) {
                  return (
                    <div
                      key={index}
                      className='gc-nav-AccountWrapper'
                      ref={accountRef}
                    >
                      <button
                        type='button'
                        className={`gc-nav-link gc-nav-link-account gc-nav-link-account--logged ${
                          location.pathname.startsWith(
                            "/tai-khoan",
                          )
                            ? "gc-nav-link--active"
                            : ""
                        }`}
                        onClick={
                          handleAccountClick
                        }
                      >
                        <div className='gc-nav-account-info'>
                          <img
                            src='/images/avatars/avatar-navbar.png'
                            alt='User avatar'
                            className='gc-nav-avatar'
                          />
                          <span className='gc-nav-username'>
                            {user?.username ||
                              "Người chơi"}
                          </span>
                        </div>
                        <span className='gc-nav-link-underline' />
                      </button>

                      {/* popup menu */}
                      {isAccountMenuOpen && (
                        <div className='gc-account-menu'>
                          <button
                            type='button'
                            className='gc-account-menu-item'
                            onClick={
                              handleGoProfile
                            }
                          >
                            Tài khoản
                          </button>
                          <button
                            type='button'
                            className='gc-account-menu-item'
                            onClick={handleLogout}
                          >
                            Đăng xuất
                          </button>
                        </div>
                      )}
                    </div>
                  );
                }

                // chưa login
                return (
                  <button
                    key={index}
                    type='button'
                    className='gc-nav-link gc-nav-link-account'
                    onClick={handleAccountClick}
                  >
                    <span className='gc-nav-link-label'>
                      {item.name}
                    </span>
                    <span className='gc-nav-link-underline' />
                  </button>
                );
              }

              // các menu khác
              return (
                <NavLink
                  key={index}
                  to={item.url}
                  className={({ isActive }) =>
                    [
                      "gc-nav-link",
                      isActive
                        ? "gc-nav-link--active"
                        : "",
                    ].join(" ")
                  }
                  end={item.url === "/"}
                >
                  <span className='gc-nav-link-label'>
                    {item.name}
                  </span>
                  <span className='gc-nav-link-underline' />
                </NavLink>
              );
            })}
          </nav>

          <button
            className={`gc-navbar-burger ${
              isMobileOpen ? "is-open" : ""
            }`}
            onClick={() =>
              setIsMobileOpen((o) => !o)
            }
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </header>

      {/* Modals */}
      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onOpenRegister={() => {
          setIsLoginOpen(false);
          setIsRegisterOpen(true);
        }}
      />

      <RegisterModal
        isOpen={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
        onOpenLogin={() => {
          setIsRegisterOpen(false);
          setIsLoginOpen(true);
        }}
        onOpenConfirm={(username) => {
          setIsRegisterOpen(false);
          setTempUsername(username);
          setIsRegisterConfirmOpen(true);
        }}
      />
      <RegisterConfirmModal
        isOpen={isRegisterConfirmOpen}
        username={tempUsername}
        onClose={() =>
          setIsRegisterConfirmOpen(false)
        }
        onBack={() => {
          setIsRegisterConfirmOpen(false);
          setIsRegisterOpen(true);
        }}
      />
    </>
  );
}
