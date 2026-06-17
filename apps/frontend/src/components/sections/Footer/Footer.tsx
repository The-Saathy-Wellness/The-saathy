import React from "react";
import styles from "./Footer.module.css";

interface LinkGroup {
  title: string;
  links: string[];
}

const LINK_GROUPS: LinkGroup[] = [
  {
    title: "Product",
    links: ["The Saathy AI", "Trained Listeners", "Journal", "Check-in"],
  },
  {
    title: "Resources",
    links: ["Resources", "Blog", "FAQs", "Safety"],
  },
  {
    title: "Help",
    links: ["Contact", "Report a Concern", "SOS", "Delete Account"],
  },
  {
    title: "Legal",
    links: ["Privacy Policy", "Terms of Service", "Community Guidelines", "Refund & Cancellation"],
  },
];

const MailIcon: React.FC = () => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <rect x="1.5" y="3.5" width="13" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.2" />
    <path d="M2 4.5l6 4.5 6-4.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const PhoneIcon: React.FC = () => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path
      d="M3.6 2.2l2 .4.7 2.2-1.3 1.4c.5 1.4 1.6 2.5 3 3l1.4-1.3 2.2.7.4 2c0 .7-.6 1.4-1.4 1.4C6.9 12 4 9.1 4 5.5c0-.8.6-1.4 1.3-1.4z"
      stroke="currentColor"
      strokeWidth="1.1"
      strokeLinejoin="round"
    />
  </svg>
);

const ChatIcon: React.FC = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path
      d="M1.5 7.8c0-3.2 2.8-5.8 6.5-5.8s6.5 2.6 6.5 5.8-2.8 5.8-6.5 5.8c-.74 0-1.45-.1-2.1-.3L2.5 14.5l.7-2.55C2 10.95 1.5 9.45 1.5 7.8Z"
      stroke="currentColor"
      strokeWidth="1.3"
      strokeLinejoin="round"
      strokeLinecap="round"
    />
  </svg>
);

const Footer: React.FC = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.top}>
        <div className={styles.brandColumn}>
          <div className={styles.brandHeader}>
            <span className={styles.logo} aria-hidden="true">
              S
            </span>
            <span className={styles.brandName}>The Saathy</span>
          </div>

          <p className={styles.description}>
            A gentle companion for the moments loneliness feels heavy. Start with AI, or
            move to a trained listener when you want human support.
          </p>

          <ul className={styles.contactList}>
            <li>
              <a href="mailto:support@thesaathy.com" className={styles.contactLink}>
                <span className={styles.iconCircle} aria-hidden="true">
                  <MailIcon />
                </span>
                support@thesaathy.com
              </a>
            </li>
            <li>
              <a href="tel:+918791629433" className={styles.contactLink}>
                <span className={styles.iconCircle} aria-hidden="true">
                  <PhoneIcon />
                </span>
                +91-8791629433
              </a>
            </li>
          </ul>

          <a
            href="https://wa.me/918791629433"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.ctaButton}
          >
            <ChatIcon />
            <span>WhatsApp The Saathy</span>
          </a>
        </div>

        <nav className={styles.linkColumns} aria-label="Footer navigation">
          {LINK_GROUPS.map((group) => (
            <div className={styles.linkColumn} key={group.title}>
              <h3 className={styles.columnTitle}>{group.title}</h3>
              <ul className={styles.linkList}>
                {group.links.map((link) => (
                  <li key={link}>
                    {/* Placeholder href — wire up to real routes */}
                    <a href="#" className={styles.link}>
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </div>

      <div className={styles.divider} role="presentation" />

      <div className={styles.bottom}>
        <p className={styles.copyright}>© 2026 The Saathy. All rights reserved.</p>
        <p className={styles.tagline}>Made with care for people who need someone to talk to.</p>
      </div>
    </footer>
  );
};

export default Footer;