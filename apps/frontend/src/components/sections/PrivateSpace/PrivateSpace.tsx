import React from "react";
import styles from "./PrivateSpace.module.css";

interface Benefit {
  number: string;
  title: string;
  description: string;
}

interface Feature {
  title: string;
  description: string;
}

interface NavItem {
  label: string;
  Icon: React.FC;
}

const BENEFITS: Benefit[] = [
  {
    number: "1",
    title: "Start without pressure",
    description: "Use Saathy without sharing your real name on day one.",
  },
  {
    number: "2",
    title: "Stay inside Saathy",
    description: "No phone exchange, no WhatsApp shift, no random DMs.",
  },
  {
    number: "3",
    title: "Your journal is yours",
    description: "What you write privately is visible only to you unless you choose to share.",
  },
  {
    number: "4",
    title: "Safety stays close",
    description: "Report and Safety Net actions stay visible inside private spaces.",
  },
];

const FEATURES: Feature[] = [
  {
    title: "AI chat",
    description: "Say it without account pressure. Share only what feels safe.",
  },
  {
    title: "Human listener",
    description: "Talk by chat, audio or video without sharing your personal phone number.",
  },
  {
    title: "Private journal",
    description: "Write before you are ready to talk. Reflection happens only with your permission.",
  },
  {
    title: "Daily check-in",
    description: "Notice patterns without having to explain everything every day.",
  },
];

const StarIcon: React.FC = () => (
  <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path
      d="M8 1.5l1.6 3.9 4.2.3-3.2 2.8 1 4.1L8 10.5l-3.6 2.1 1-4.1-3.2-2.8 4.2-.3L8 1.5z"
      fill="currentColor"
    />
  </svg>
);

const ListenerIcon: React.FC = () => (
  <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path
      d="M3 8.2V7a5 5 0 0110 0v1.2M3 8.2v2a1.6 1.6 0 001.6 1.6H5V8H3.6A.6.6 0 003 8.6v-.4zM13 8.2v2a1.6 1.6 0 01-1.6 1.6H11V8h1.4a.6.6 0 01.6.6v-.4zM6.5 13.4h3"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const JournalIcon: React.FC = () => (
  <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path
      d="M11.3 1.9l2.8 2.8-7.9 7.9-3.2.4.4-3.2 7.9-7.9z"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinejoin="round"
    />
  </svg>
);

const MoonIcon: React.FC = () => (
  <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path
      d="M13.8 9.6A5.8 5.8 0 016.4 2.2a5.8 5.8 0 107.4 7.4z"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinejoin="round"
    />
  </svg>
);

const InfoIcon: React.FC = () => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.2" />
    <path d="M8 7.2v3.4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    <circle cx="8" cy="5.2" r="0.7" fill="currentColor" />
  </svg>
);

const NAV_ITEMS: NavItem[] = [
  { label: "AI chat", Icon: StarIcon },
  { label: "Listener", Icon: ListenerIcon },
  { label: "Journal", Icon: JournalIcon },
  { label: "Check-in", Icon: MoonIcon },
];

const PrivateSpace: React.FC = () => {
  return (
    <section className={styles.section} aria-labelledby="private-space-heading">
      <div className={styles.container}>
        <div className={styles.leftColumn}>
          <header className={styles.header}>
            <h2 id="private-space-heading" className={styles.heading}>
              One private space for every way you <span className={styles.highlight}>open up.</span>
            </h2>
            <p className={styles.subtext}>
              Talk to AI, connect with a listener, write privately or check in. The Saathy
              keeps the space controlled by you.
            </p>
          </header>

          <ol className={styles.benefitList}>
            {BENEFITS.map((benefit) => (
              <li key={benefit.number} className={styles.benefitCard}>
                <span className={styles.badge} aria-hidden="true">
                  {benefit.number}
                </span>
                <div className={styles.benefitText}>
                  <h3 className={styles.benefitTitle}>{benefit.title}</h3>
                  <p className={styles.benefitDescription}>{benefit.description}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        <div className={styles.rightColumn}>
          <div className={styles.previewWrapper}>
            <article className={styles.previewCard} aria-label="The Saathy product preview">
              <div className={styles.previewTopBar}>
                <div className={styles.previewBrand}>
                  <span className={styles.previewAvatar} aria-hidden="true">
                    S
                  </span>
                  <span className={styles.previewLabel}>The Saathy</span>
                </div>
                <span className={styles.statusPill}>
                  <span className={styles.statusDot} aria-hidden="true" />
                  Controlled by you
                </span>
              </div>

              <div className={styles.featureList}>
                {FEATURES.map((feature) => (
                  <div key={feature.title} className={styles.featureItem}>
                    <h3 className={styles.featureTitle}>{feature.title}</h3>
                    <p className={styles.featureDescription}>{feature.description}</p>
                  </div>
                ))}
              </div>

              <ul className={styles.previewNav}>
                {NAV_ITEMS.map((item, index) => (
                  <li
                    key={item.label}
                    className={`${styles.navItem} ${index === 0 ? styles.navItemActive : ""}`}
                  >
                    <item.Icon />
                    <span>{item.label}</span>
                  </li>
                ))}
              </ul>
            </article>

            <p className={styles.noticeBar}>
              <span className={styles.noticeIcon} aria-hidden="true">
                <InfoIcon />
              </span>
              <span>
                <strong>Please remember:</strong> Saathy is here for support and companionship.
                It is not therapy, medical care, or emergency support.
              </span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PrivateSpace;