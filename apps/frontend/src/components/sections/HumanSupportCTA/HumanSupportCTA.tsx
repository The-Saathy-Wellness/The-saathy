import React from "react";
import styles from "./HumanSupportCTA.module.css";

/**
 * Placeholder background image import.
 * Replace with the real asset path used in the project
 * (e.g. "../../assets/images/human-support-hero.jpg").
 */
import supportBackground from "../../../assets/images/conditions/human-support-hero.jpeg";

const ChatIcon: React.FC = () => (
  <svg
    className={styles.buttonIcon}
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    aria-hidden="true"
  >
    <path
      d="M1.5 7.8c0-3.2 2.8-5.8 6.5-5.8s6.5 2.6 6.5 5.8-2.8 5.8-6.5 5.8c-.74 0-1.45-.1-2.1-.3L2.5 14.5l.7-2.55C2 10.95 1.5 9.45 1.5 7.8Z"
      stroke="currentColor"
      strokeWidth="1.3"
      strokeLinejoin="round"
      strokeLinecap="round"
    />
  </svg>
);

const HumanSupportCTA: React.FC = () => {
  return (
    <section className={styles.section} aria-labelledby="human-support-heading">
      <div className={styles.media}>
        <img
          src={supportBackground}
          alt=""
          className={styles.bgImage}
          loading="lazy"
        />
        <div className={styles.overlay} aria-hidden="true" />
      </div>

      <div className={styles.content}>
        <h2 id="human-support-heading" className={styles.heading}>
          You don&apos;t have to carry this alone
        </h2>

        <p className={styles.subheading}>
          Talk freely. No judgement. A trained human Buddy is just one step away.
        </p>

        <div className={styles.actions}>
          <button type="button" className={styles.primaryButton}>
            <ChatIcon />
            <span>Talk to Saathy</span>
          </button>
          <button type="button" className={styles.secondaryButton}>
            Book a Saathy Listener
          </button>
        </div>
      </div>
    </section>
  );
};

export default HumanSupportCTA;