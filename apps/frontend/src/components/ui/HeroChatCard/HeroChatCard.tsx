import React from 'react';
import styles from './HeroChatCard.module.css';

const HeroChatCard: React.FC = () => {
  return (
    <div className={styles.wrapper}>
      {/* Ambient blobs */}
      <div className={styles.blob1} aria-hidden="true" />
      <div className={styles.blob2} aria-hidden="true" />

      {/* Floating card 1 — top right */}
      <div className={`${styles.floatingCard} ${styles.floatingCard1}`} aria-hidden="true">
        <div className={styles.floatingAvatar}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6.2 10.6667H7.13333C7.74444 10.6667 8.26389 10.4722 8.69167 10.0833C9.11944 9.69444 9.33333 9.22222 9.33333 8.66667C9.33333 8.11111 9.11944 7.63889 8.69167 7.25C8.26389 6.86111 7.74444 6.66667 7.13333 6.66667H6.2C5.58889 6.66667 5.06944 6.86111 4.64167 7.25C4.21389 7.63889 4 8.11111 4 8.66667C4 9.22222 4.21389 9.69444 4.64167 10.0833C5.06944 10.4722 5.58889 10.6667 6.2 10.6667ZM6.2 9.66667C5.86667 9.66667 5.58333 9.56944 5.35 9.375C5.11667 9.18056 5 8.94444 5 8.66667C5 8.38889 5.11667 8.15278 5.35 7.95833C5.58333 7.76389 5.86667 7.66667 6.2 7.66667H7.13333C7.46667 7.66667 7.75 7.76389 7.98333 7.95833C8.21667 8.15278 8.33333 8.38889 8.33333 8.66667C8.33333 8.94444 8.21667 9.18056 7.98333 9.375C7.75 9.56944 7.46667 9.66667 7.13333 9.66667H6.2ZM2.66667 5.33333H4C4.55556 5.33333 5.02778 5.13889 5.41667 4.75C5.80556 4.36111 6 3.88889 6 3.33333H5C5 3.61111 4.90278 3.84722 4.70833 4.04167C4.51389 4.23611 4.27778 4.33333 4 4.33333H2.66667V5.33333ZM9.33333 5.33333H10.6667V4.33333H9.33333C9.05556 4.33333 8.81944 4.23611 8.625 4.04167C8.43056 3.84722 8.33333 3.61111 8.33333 3.33333H7.33333C7.33333 3.88889 7.52778 4.36111 7.91667 4.75C8.30556 5.13889 8.77778 5.33333 9.33333 5.33333ZM4.06667 12.8083C3.25556 12.4583 2.55 11.9833 1.95 11.3833C1.35 10.7833 0.875 10.0778 0.525 9.26667C0.175 8.45555 0 7.58889 0 6.66667C0 5.74444 0.175 4.87778 0.525 4.06667C0.875 3.25556 1.35 2.55 1.95 1.95C2.55 1.35 3.25556 0.875 4.06667 0.525C4.87778 0.175 5.74444 0 6.66667 0C7.58889 0 8.45555 0.175 9.26667 0.525C10.0778 0.875 10.7833 1.35 11.3833 1.95C11.9833 2.55 12.4583 3.25556 12.8083 4.06667C13.1583 4.87778 13.3333 5.74444 13.3333 6.66667C13.3333 7.58889 13.1583 8.45555 12.8083 9.26667C12.4583 10.0778 11.9833 10.7833 11.3833 11.3833C10.7833 11.9833 10.0778 12.4583 9.26667 12.8083C8.45555 13.1583 7.58889 13.3333 6.66667 13.3333C5.74444 13.3333 4.87778 13.1583 4.06667 12.8083ZM10.45 10.45C11.4833 9.41667 12 8.15555 12 6.66667C12 5.17778 11.4833 3.91667 10.45 2.88333C9.41667 1.85 8.15555 1.33333 6.66667 1.33333C5.17778 1.33333 3.91667 1.85 2.88333 2.88333C1.85 3.91667 1.33333 5.17778 1.33333 6.66667C1.33333 8.15555 1.85 9.41667 2.88333 10.45C3.91667 11.4833 5.17778 12 6.66667 12C8.15555 12 9.41667 11.4833 10.45 10.45Z" fill="#7C5CFF"/>
          </svg>
        </div>
        <div className={styles.floatingContent}>
          <span className={styles.floatingTitle}>How are you feeling?</span>
          <span className={styles.floatingSub}>Daily Pulse</span>
        </div>
      </div>

      {/* Main frosted card */}
      <div className={styles.card}>
        {/* Live indicator */}
        <div className={styles.liveRow}>
          <div className={styles.liveDot} aria-hidden="true" />
          <span className={styles.liveText}>Someone might be feeling this right now</span>
        </div>

        {/* Quote */}
        <p className={styles.quote}>
          Everyone is at home, yet there is no one you truly feel like talking to.
        </p>

        {/* CTA badge */}
        <div className={styles.ctaBadge}>You can start with just one line</div>
      </div>

      {/* Floating card 2 — bottom left */}
      <div className={`${styles.floatingCard} ${styles.floatingCard2}`} aria-hidden="true">
        <div className={styles.floatingAvatar}>
          <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15 5.5L11.5 1.5H3.5L0 5.5L7.5 14L15 5.5ZM10.75 5.5L11.5 2.5L14 5.5H10.75ZM10.5 6.25H13.25L8.5 12L10.5 6.25ZM10 5.5L8 2.25H10.75L10 5.5ZM5.5 6.25H9.5L7.5 12.5L5.5 6.25ZM5.75 5.5L7.5 2.5L9.25 5.5H5.75ZM5 5.5L4.25 2.25H7L5 5.5ZM6.5 12L1.5 6.25H4.5L6.5 12ZM3.5 2.5L4.25 5.5H1L3.5 2.5Z" fill="#7C5CFE"/>
          </svg>
        </div>
        <div className={styles.floatingContent}>
          <span className={styles.floatingTitleLg}>We remember you</span>
          <span className={styles.floatingSubSm}>Memory</span>
        </div>
      </div>
    </div>
  );
};

export default HeroChatCard;
