import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './Navbar.module.css';

const Navbar: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className={styles.nav}>
      <div className={styles.inner}>
        {/* Logo */}
        <Link to="/" className={styles.logo}>
          <img
            src="https://api.builder.io/api/v1/image/assets/TEMP/cf3eef850220778baa97d77f1b26608b2c096a8f?width=152"
            alt="Saathy"
            className={styles.logoImage}
          />
          <span className={styles.logoText}>Saathy</span>
        </Link>

        {/* Desktop nav links */}
        <nav aria-label="Main navigation">
          <ul className={styles.links}>
            <li><a href="#" className={`${styles.link} ${styles.linkMuted}`}>About</a></li>
            <li><a href="#" className={styles.link}>Services</a></li>
            <li><a href="#" className={styles.link}>Saathy AI</a></li>
            <li><a href="#" className={styles.link}>Resouces</a></li>
            <li><a href="#" className={styles.link}>Contact Us</a></li>
          </ul>
        </nav>

        {/* Desktop auth */}
        <div className={styles.auth}>
          <Link to="/login" className={styles.signIn}>Sign in</Link>
          <Link to="/login" className={styles.startBtn}>Start Free</Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className={styles.hamburger}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      {/* Mobile menu */}
      <div className={`${styles.mobileMenu} ${menuOpen ? styles.open : ''}`}>
        <a href="#" className={styles.mobileLink}>About</a>
        <a href="#" className={styles.mobileLink}>Services</a>
        <a href="#" className={styles.mobileLink}>Saathy AI</a>
        <a href="#" className={styles.mobileLink}>Resouces</a>
        <a href="#" className={styles.mobileLink}>Contact Us</a>
        <div className={styles.mobileAuth}>
          <Link to="/login" className={styles.signIn}>Sign in</Link>
          <Link to="/login" className={styles.startBtn}>Start Free</Link>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
