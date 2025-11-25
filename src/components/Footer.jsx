// src/components/Footer.jsx
import "../styles/Footer.css";

export default function Footer() {
  return (
    <footer className='gc-footer'>
      <div className='gc-footer-center'>
        <div className='gc-footer-center-inner'>
          Powered by <span className='gc-footer-center-inner-text'>Gacha City</span>
        </div>
      </div>
      <div className='gc-footer-inner'>
        {/* Facebook */}
        <a
          href='https://facebook.com'
          target='_blank'
          rel='noreferrer'
          className='footer-social'
        >
          <span className='footer-icon-circle'>
            <img
              src='/images/icons/icon-facebook.png'
              alt='Facebook'
              className='footer-img'
            />
          </span>
          <span className='footer-label'>
            Gacha city
          </span>
        </a>

        {/* Discord */}
        <a
          href='https://discord.com'
          target='_blank'
          rel='noreferrer'
          className='footer-social'
        >
          <span className='footer-icon-circle'>
            <img
              src='/images/icons/icon-discord.png'
              alt='Discord'
              className='footer-img'
            />
          </span>
          <span className='footer-label'>
            Gacha city
          </span>
        </a>
      </div>
    </footer>
  );
}
