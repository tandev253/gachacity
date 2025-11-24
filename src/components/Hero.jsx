import { Link } from "react-router-dom";
import "../styles/Hero.css";

export default function Hero({
  totalPlayers = 1500,
  onlinePlayers = 700,
}) {
  return (
    <section className='gc-hero'>
      <div className='gc-hero-inner'>
        {/* LEFT: TEXT */}
        <div className='gc-hero-left'>
          <p className='gc-hero-kicker'>
            Chào mừng đến với
          </p>

          <h1 className='gc-hero-title'>
            GACHA CITY
          </h1>

          <div className='gc-hero-stats-row'>
            <div className='gc-hero-stat'>
              <span className='gc-hero-stat-label'>
                Total
              </span>
              <span className='gc-hero-stat-value'>
                {totalPlayers}
              </span>
            </div>

            <div className='gc-hero-stat'>
              <span className='gc-hero-stat-label'>
                Online
              </span>
              <span className='gc-hero-stat-value'>
                {onlinePlayers}
              </span>
            </div>
          </div>

          <div className='gc-hero-actions'>
            <Link
              to='/guide'
              className='gc-hero-btn'
            >
              Join with us
            </Link>
          </div>
        </div>

        {/* RIGHT: CHARACTER IMAGE */}
        <div className='gc-hero-right'>
          <div className='gc-hero-art-wrapper'>
            <div className='gc-hero-glow' />
            <img
              src='/images/hero/character-hero.png'
              alt='Gacha City Characters'
              className='gc-hero-art'
            />
          </div>
        </div>
      </div>
    </section>
  );
}
