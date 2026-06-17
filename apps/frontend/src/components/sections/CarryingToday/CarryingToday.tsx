import React from 'react';
import styles from './CarryingToday.module.css';

const ArrowIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M3.33337 8H12.6667M12.6667 8L8.66671 4M12.6667 8L8.66671 12" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

interface CardData {
  label: string;
  image: string;
  alt: string;
}

const cards: CardData[] = [
  {
    label: 'Office politics and burnout',
    image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&q=80&fit=crop',
    alt: 'Man in metro looking stressed',
  },
  {
    label: '2 AM lonely moments',
    image: 'https://images.unsplash.com/photo-1511367461989-f85a21fda167?w=800&q=80&fit=crop',
    alt: 'Person using phone in the dark late at night',
  },
  {
    label: 'Family pressure',
    image: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=800&q=80&fit=crop',
    alt: 'Woman looking out window lost in thought',
  },
  {
    label: 'New city loneliness',
    image: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=800&q=80&fit=crop',
    alt: 'Person alone in a crowded city',
  },
  {
    label: 'Relationship confusion',
    image: 'https://images.unsplash.com/photo-1534008757030-27299c4371b6?w=800&q=80&fit=crop',
    alt: 'Person lying in bed staring at phone',
  },
  {
    label: 'Career and future stress',
    image: 'https://images.unsplash.com/photo-1521737852567-6949f3f9f2b5?w=800&q=80&fit=crop',
    alt: 'Man working on laptop looking stressed',
  },
];

const CarryingToday: React.FC = () => {
  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        {/* Heading row */}
        <div className={styles.header}>
          <h2 className={styles.heading}>
            What are you carrying <span className={styles.headingAccent}>today?</span>
          </h2>
          <p className={styles.description}>
            We're more connected than ever yet feel more alone than ever
          </p>
        </div>

        {/* Card grid */}
        <div className={styles.grid}>
          {cards.map((card) => (
            <a key={card.label} href="#" className={styles.card}>
              <img
                src={card.image}
                alt={card.alt}
                className={styles.cardImage}
              />
              <div className={styles.cardOverlay} aria-hidden="true" />
              <div className={styles.cardLabel}>
                <span className={styles.cardLabelText}>{card.label}</span>
                <div className={styles.cardArrow} aria-hidden="true">
                  <ArrowIcon />
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CarryingToday;
