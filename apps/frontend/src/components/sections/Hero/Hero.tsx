import React from 'react';
import styles from './Hero.module.css';
import HeroChatCard from '../../ui/HeroChatCard/HeroChatCard';

const LockIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M4 6.66668V5.33334C4 4.27248 4.42143 3.25506 5.17157 2.50492C5.92172 1.75477 6.93913 1.33334 8 1.33334C9.06087 1.33334 10.0783 1.75477 10.8284 2.50492C11.5786 3.25506 12 4.27248 12 5.33334V6.66668" stroke="#7C5CFF" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M11.333 6.66666H4.66634C3.92996 6.66666 3.33301 7.26361 3.33301 7.99999V12C3.33301 12.7364 3.92996 13.3333 4.66634 13.3333H11.333C12.0694 13.3333 12.6663 12.7364 12.6663 12V7.99999C12.6663 7.26361 12.0694 6.66666 11.333 6.66666Z" stroke="#7C5CFF" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const SmileIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M7.99967 2C6.762 2 5.57501 2.49167 4.69984 3.36683C3.82467 4.242 3.33301 5.42899 3.33301 6.66667V8.66667C3.33301 9.90434 3.82467 11.0913 4.69984 11.9665C5.57501 12.8417 6.762 13.3333 7.99967 13.3333C9.23735 13.3333 10.4243 12.8417 11.2995 11.9665C12.1747 11.0913 12.6663 9.90434 12.6663 8.66667V6.66667C12.6663 5.42899 12.1747 4.242 11.2995 3.36683C10.4243 2.49167 9.23735 2 7.99967 2Z" stroke="#7C5CFF" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M6 9.33334C6.46667 9.86668 7.06667 10.1333 8 10.1333C8.93333 10.1333 9.53333 9.86668 10 9.33334" stroke="#7C5CFF" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const LanguageIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M2.66699 4.66666H13.3337M4.66699 7.99999H11.3337M6.00033 11.3333H10.0003" stroke="#7C5CFF" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const PhoneOffIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M4 3.99999L12 12V3.99999C12 3.64637 11.8595 3.30723 11.6095 3.05718C11.3594 2.80713 11.0203 2.66666 10.6667 2.66666H5.33333M4 5.33332V12C4 12.3536 4.14048 12.6928 4.39052 12.9428C4.64057 13.1928 4.97971 13.3333 5.33333 13.3333H10.6667" stroke="#7C5CFF" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const ChatIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M5.25 6H12.75M5.25 9H10.5M3.75 14.25L6.375 12H12.75C13.5456 12 14.3087 11.6839 14.8713 11.1213C15.4339 10.5587 15.75 9.79565 15.75 9V6C15.75 5.20435 15.4339 4.44129 14.8713 3.87868C14.3087 3.31607 13.5456 3 12.75 3H5.25C4.45435 3 3.69129 3.31607 3.12868 3.87868C2.56607 4.44129 2.25 5.20435 2.25 6V9C2.25 9.79565 2.56607 10.5587 3.12868 11.1213C3.69129 11.6839 4.45435 12 5.25 12" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const Hero: React.FC = () => {
  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        {/* Left column */}
        <div className={styles.left}>
          <h1 className={styles.heading}>
            Feel <span className={styles.headingAccent}>heard</span> when{'\n'}loneliness feels{'\n'}heavy.
          </h1>

          <p className={styles.subtext}>
            Talk anonymously to Saathy AI anytime or connect with a trained human listener on chat, audio or video. Not therapy. Not dating. Private by default.
          </p>

          <div className={styles.trustRow}>
            <div className={styles.trustItem}>
              <LockIcon />
              <span className={styles.trustLabel}>Private by default</span>
            </div>
            <div className={styles.trustItem}>
              <SmileIcon />
              <span className={styles.trustLabel}>No judgement</span>
            </div>
            <div className={styles.trustItem}>
              <LanguageIcon />
              <span className={styles.trustLabel}>Hindi / English</span>
            </div>
            <div className={styles.trustItem}>
              <PhoneOffIcon />
              <span className={styles.trustLabel}>No phone sharing</span>
            </div>
          </div>

          <div className={styles.buttonRow}>
            <button className={styles.btnPrimary}>
              <ChatIcon />
              Talk to Saathy
            </button>
            <button className={styles.btnSecondary}>
              Book a Saathy Listener
            </button>
          </div>

          <p className={styles.finePrint}>
            Saathy is free to start. No sign-up required. No one will know you were here.
          </p>
        </div>

        {/* Right column */}
        <div className={styles.right}>
          <HeroChatCard />
        </div>
      </div>
    </section>
  );
};

export default Hero;
