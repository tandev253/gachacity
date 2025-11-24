// src/pages/App.jsx
import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage.jsx";
import GuidePage from "./pages/GuidePage.jsx";
import NewsPage from "./pages/NewsPage.jsx";
import DonatePage from "./pages/DonatePage.jsx";
import AccountPage from "./pages/AccountPage.jsx";
import NewsDetail from "./components/NewsDetail.jsx";
import Navbar from "./components/Navbar.jsx";

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route
          path='/huong-dan'
          element={<GuidePage />}
        />
        <Route
          path='/tin-tuc'
          element={<NewsPage />}
        />
        <Route
          path='/tin-tuc/:slug'
          element={<NewsDetail />}
        />
        <Route
          path='/donate'
          element={<DonatePage />}
        />
        <Route
          path='/tai-khoan'
          element={<AccountPage />}
        />
      </Routes>
    </>
  );
}
