import React from 'react';
import styles from './Bentogrid.module.css';

/* ==========================================================================
   Types
   ========================================================================== */
import anxietyImg from '../../../assets/images/conditions/anxiety.jpeg';
import lifeTransitionsImg from '../../../assets/images/conditions/life-transitions.jpeg';
import relationshipIssuesImg from '../../../assets/images/conditions/relationship-issues.jpeg';
import stressBurnoutImg from '../../../assets/images/conditions/stress-burnout.jpeg';
import depressionImg from '../../../assets/images/conditions/depression.jpeg';
export interface BentoCardData {
  /** Unique key for the card */
  id: string;
  /** Label shown in the glass strip */
  title: string;
  /** Short line revealed on hover, above the title */
  description: string;
  /** Image source. Drop real photography here — see asset notes below. */
  image: string;
  /** Accessible alt text for the image */
  imageAlt: string;
  /** Reference width from the design, in px — used to derive aspect-ratio */
  width: number;
  /** Reference height from the design, in px — used to derive aspect-ratio */
  height: number;
}

export interface BentoGridProps {
  /** Text before the highlighted word, e.g. "What brings " */
  headingPrefix?: string;
  /** The highlighted word, rendered in purple, e.g. "people" */
  headingHighlight?: string;
  /** Text after the highlighted word on the same line, e.g. " to" */
  headingSuffix?: string;
  /** Second line of the heading, e.g. "Saathy" */
  headingSecondLine?: string;
  /** Supporting copy on the right of the header */
  description?: string;
  /** The five bento cards, in layout order: tall, top-mid, top-right, bottom-left, wide */
  cards?: [BentoCardData, BentoCardData, BentoCardData, BentoCardData, BentoCardData];
}

/* ==========================================================================
   Default content
   ==========================================================================
   Image paths below are intentionally named placeholders. Drop matching
   photography into /public/assets/bento/ (or point `image` at your CDN)
   at roughly the dimensions noted per card for a pixel-exact result.
   ========================================================================== */

const DEFAULT_CARDS: BentoGridProps['cards'] = [
  {
    id: 'anxiety',
    title: 'Anxiety',
    description: 'Racing thoughts, restlessness, or a constant sense of worry.',
    image: anxietyImg,
    imageAlt: 'Man pausing quietly by a sunlit window',
    width: 363,
    height: 439,
  },
  {
    id: 'life-transitions',
    title: 'Life Transitions',
    description: 'New chapters, big changes, and the uncertainty that comes with them.',
    image: lifeTransitionsImg,
    imageAlt: 'Man sitting quietly by a river surrounded by trees',
    width: 363,
    height: 374,
  },
  {
    id: 'relationship-issues',
    title: 'Relationship Issues',
    description: 'Conflict, distance, or trouble feeling close to the people you love.',
    image: relationshipIssuesImg,
    imageAlt: 'Two people holding hands in a comforting gesture',
    width: 363,
    height: 373,
  },
  {
    id: 'stress-burnout',
    title: 'Stress & Burnout',
    description: 'Feeling stretched thin, exhausted, or unable to switch off.',
    image: stressBurnoutImg,
    imageAlt: 'Woman sitting on a sofa with her head in her hands',
    width: 363,
    height: 331,
  },
  {
    id: 'depression',
    title: 'Depression',
    description: 'Low mood, lost motivation, or feeling disconnected from life.',
    image:  depressionImg,
    imageAlt: 'Man looking out over a hazy skyline, lost in thought',
    width: 751,
    height: 389,
  },
] as BentoGridProps['cards'];

const ArrowIcon: React.FC = () => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      d="M7 17L17 7M17 7H9M17 7V15"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/* ==========================================================================
   Card
   ========================================================================== */

const BentoCard: React.FC<{ data: BentoCardData }> = ({ data }) => (
  <article
    className={styles.card}
    style={{ aspectRatio: `${data.width} / ${data.height}` }}
  >
    <img className={styles.image} src={data.image} alt={data.imageAlt} loading="lazy" />
    <div className={styles.overlay} />

    <div className={styles.glassStrip}>
      <p className={styles.cardDescription}>{data.description}</p>
      <div className={styles.titleRow}>
        <h3 className={styles.title}>{data.title}</h3>
        <button type="button" className={styles.arrowButton} aria-label={`Explore ${data.title}`}>
          <ArrowIcon />
        </button>
      </div>
    </div>
  </article>
);

/* ==========================================================================
   Background decoration
   ========================================================================== */

const BackgroundDecor: React.FC = () => (
  <div className={styles.bgDecor} aria-hidden="true">
    <div className={`${styles.blob} ${styles.blobOne}`} />
    <div className={`${styles.blob} ${styles.blobTwo}`} />
    <div className={styles.glow} />
  </div>
);

/* ==========================================================================
   Section
   ========================================================================== */

const BentoGrid: React.FC<BentoGridProps> = ({
  headingPrefix = 'What brings ',
  headingHighlight = 'people',
  headingSuffix = ' to',
  headingSecondLine = 'Saathy',
  description = 'Saathy offers support for 30+ mental health conditions. Explore some of the most common ones below to see how we approach care.',
  cards = DEFAULT_CARDS,
}) => {
  const [card1, card2, card3, card4, card5] = cards as BentoCardData[];

  return (
    <section className={styles.section}>
      <BackgroundDecor />

      <header className={styles.header}>
        <h2 className={styles.heading}>
          {headingPrefix}
          <span className={styles.headingAccent}>{headingHighlight}</span>
          {headingSuffix}
          <br />
          {headingSecondLine}
        </h2>

        <div className={styles.descBlock}>
          <span className={styles.diamond} />
          <p className={styles.description}>{description}</p>
        </div>
      </header>

      <div className={styles.grid}>
        <div className={styles.leftCol}>
          <BentoCard data={card1} />
          <BentoCard data={card4} />
        </div>

        <div className={styles.rightArea}>
          <div className={styles.rightTopRow}>
            <BentoCard data={card2} />
            <BentoCard data={card3} />
          </div>
          <BentoCard data={card5} />
        </div>
      </div>
    </section>
  );
};

export default BentoGrid;
