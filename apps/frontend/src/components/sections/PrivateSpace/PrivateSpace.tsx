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
  icon: string;
  label: string;
}

export default function PrivateSpace() {
  const benefits: Benefit[] = [
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
      description:
        "What you write privately is visible only to you unless you choose to share.",
    },
    {
      number: "4",
      title: "Safety stays close",
      description:
        "Report and Safety Net actions stay visible inside private spaces.",
    },
  ];

  const features: Feature[] = [
    {
      title: "AI chat",
      description: "Say it without account pressure. Share only what feels safe.",
    },
    {
      title: "Human listener",
      description:
        "Talk by chat, audio or video without sharing your personal phone number.",
    },
    {
      title: "Private journal",
      description:
        "Write before you are ready to talk. Reflection happens only with your permission.",
    },
    {
      title: "Daily check-in",
      description:
        "Notice patterns without having to explain everything every day.",
    },
  ];

  const navItems: NavItem[] = [
    { icon: "✦", label: "AI chat" },
    { icon: "◉", label: "Listener" },
    { icon: "✎", label: "Journal" },
    { icon: "☾", label: "Check in" },
  ];

  return (
    <main className={styles.container}>
      <div className={styles.wrapper}>
        <div className={styles.grid}>
          {/* Left column */}
          <div className={styles.leftColumn}>
            {/* Heading */}
            <h2 className={styles.heading}>
              One private space for every way you{" "}
              <span className={styles.highlight}>openup.</span>
            </h2>

            {/* Subtext */}
            <p className={styles.subtext}>
              Talk to AI, connect with a listener, write privately or check in.
              The Saathy keeps the space controlled by you.
            </p>

            {/* Benefits list */}
            <ul className={styles.benefitsList}>
              {benefits.map((benefit) => (
                <li key={benefit.number} className={styles.benefitCard}>
                  {/* Badge */}
                  <div className={styles.badge}>{benefit.number}</div>
                  {/* Text */}
                  <div className={styles.benefitTextContainer}>
                    <p className={styles.benefitTitle}>{benefit.title}</p>
                    <p className={styles.benefitDescription}>
                      {benefit.description}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Right column */}
          <div className={styles.rightColumn}>
            {/* Dark card */}
            <div className={styles.darkCard}>
              {/* Top bar */}
              <div className={styles.topBar}>
                {/* Brand */}
                <div className={styles.brand}>
                  <div className={styles.avatar}>S</div>
                  <span className={styles.brandLabel}>The Saathy</span>
                </div>
                {/* Status pill */}
                <div className={styles.statusPill}>
                  <div className={styles.statusDot} />
                  <span className={styles.statusLabel}>Controlled by you</span>
                </div>
              </div>

              {/* Features list */}
              <div className={styles.featuresList}>
                {features.map((feature) => (
                  <div key={feature.title} className={styles.featureCard}>
                    <h3 className={styles.featureTitle}>{feature.title}</h3>
                    <p className={styles.featureDescription}>
                      {feature.description}
                    </p>
                  </div>
                ))}
              </div>

              {/* Navigation grid */}
              <div className={styles.navGrid}>
                {navItems.map((item) => (
                  <div key={item.label} className={styles.navItem}>
                    <span className={styles.navIcon}>{item.icon}</span>
                    <span className={styles.navLabel}>{item.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Disclaimer bar */}
            <div className={styles.disclaimerBar}>
              <div className={styles.disclaimerIcon}>!</div>
              <p className={styles.disclaimerText}>
                <strong>Please remember</strong>: Saathy is here for support and
                companionship. It is not therapy, medical care, or emergency
                support.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
