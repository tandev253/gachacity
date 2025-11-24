import { useEffect, useState } from "react";
import Hero from "../components/Hero";
import { getDashboard } from "../api/strapi";
import Footer from "../components/Footer";
import GuideSection from "../components/GuideSection";
import NewsSection from "../components/NewsSection";
import BusinessSection from "../components/BusinessSection";
import MediaAboutSection from "../components/MediaAboutSection";

import "../styles/homepage.css";

export default function Home() {
  const [dashboard, setDashboard] = useState({
    totalPlayers: 0,
    onlinePlayers: 0,
  });

  useEffect(() => {
    getDashboard().then((data) => {
      if (data) {
        setDashboard({
          totalPlayers: data.totalPlayers || 0,
          onlinePlayers: data.onlinePlayers || 0,
        });
      }
    });
  }, []);

  return (
    <div className='home-page'>
      {/* ==== HERO SECTION WITH FIGMA GRADIENT + MULTIPLY ==== */}
      <section className='home-bg-1'>
        <div className='hero-inner'>
          <Hero
            total={dashboard.totalPlayers}
            online={dashboard.onlinePlayers}
          />
        </div>
      </section>

      {/* ==== BACKGROUND 2: GUIDE + NEWS ==== */}
      <section className='home-bg-2'>
        <GuideSection />
        <NewsSection />
      </section>

      {/* ==== BACKGROUND 3: BUSINESS + MEDIA + ABOUT + FOOTER ==== */}
      <section className='home-bg-3'>
        <BusinessSection />
        <MediaAboutSection />
        <Footer />
      </section>
    </div>
  );
}
