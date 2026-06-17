import React from "react";
import styles from "./ConditionsGrid.module.css";

/**
 * Placeholder image imports.
 * Replace these paths with the real asset paths used in the project
 * (e.g. imported from "../../assets/images/conditions/...").
 */
import anxietyImg from "../../../assets/images/conditions/anxiety.jpeg";
import lifeTransitionsImg from "../../../assets/images/conditions/life-transitions.jpeg";
import relationshipIssuesImg from "../../../assets/images/conditions/relationship-issues.jpeg";
import stressBurnoutImg from "../../../assets/images/conditions/stress-burnout.jpeg";
import depressionImg from "../../../assets/images/conditions/depression.jpeg";
interface Condition {
  id: string;
  title: string;
  description: string;
  image: string;
}

const CONDITIONS: Condition[] = [
  {
    id: "anxiety",
    title: "Anxiety",
    description:
      "Racing thoughts, overthinking, and constant worry can feel exhausting. Saathy helps you process what you're feeling.",
    image: anxietyImg,
  },
  {
    id: "life-transitions",
    title: "Life Transitions",
    description:
      "Major life changes can bring uncertainty. Explore your thoughts in a safe and supportive space.",
    image: lifeTransitionsImg,
  },
  {
    id: "relationship-issues",
    title: "Relationship Issues",
    description:
      "Navigate conflicts, communication challenges, and emotional difficulties with guided reflection.",
    image: relationshipIssuesImg,
  },
  {
    id: "stress-burnout",
    title: "Stress & Burnout",
    description:
      "When everything feels overwhelming, take a moment to pause, reflect, and regain clarity.",
    image: stressBurnoutImg,
  },
  {
    id: "depression",
    title: "Depression",
    description:
      "Express difficult emotions without judgment and take small steps toward understanding how you feel.",
    image: depressionImg,
  },
];

function getCondition(id: string): Condition {
  const condition = CONDITIONS.find((item) => item.id === id);
  if (!condition) {
    throw new Error(`Unknown condition id: ${id}`);
  }
  return condition;
}

interface ConditionCardProps {
  condition: Condition;
  variantClassName: string;
}

const ArrowIcon: React.FC = () => (
  <svg
    className={styles.arrowIcon}
    width="14"
    height="14"
    viewBox="0 0 14 14"
    fill="none"
    aria-hidden="true"
  >
    <path
      d="M2.5 11.5L11.5 2.5M11.5 2.5H4.75M11.5 2.5V9.25"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const ConditionCard: React.FC<ConditionCardProps> = ({ condition, variantClassName }) => {
  return (
    <article className={`${styles.card} ${variantClassName}`}>
      <img
        src={condition.image}
        alt=""
        className={styles.cardImage}
        loading="lazy"
      />
      <div className={styles.overlay} aria-hidden="true" />

      <div className={styles.cardContent}>
        <h3 className={styles.cardTitle}>{condition.title}</h3>
        <div className={styles.descriptionRow}>
          <p className={styles.cardDescription}>{condition.description}</p>
        </div>
      </div>

      <button
        type="button"
        className={styles.arrowButton}
        aria-label={`Learn more about ${condition.title}`}
      >
        <ArrowIcon />
      </button>
    </article>
  );
};

const ConditionsGrid: React.FC = () => {
  return (
    <section className={styles.section} aria-labelledby="conditions-heading">
      <div className={styles.header}>
        <h2 id="conditions-heading" className={styles.heading}>
          What brings <span className={styles.highlight}>people</span> to Saathy
        </h2>

        <div className={styles.descriptionWrap}>
          <span className={styles.bullet} aria-hidden="true" />
          <p className={styles.description}>
            Saathy offers support for 30+ mental health conditions. Explore some of the
            most common ones below to see how we approach care.
          </p>
        </div>
      </div>

      <div className={styles.grid}>
        <div className={styles.leftColumn}>
          <ConditionCard condition={getCondition("anxiety")} variantClassName={styles.anxiety} />
          <ConditionCard
            condition={getCondition("stress-burnout")}
            variantClassName={styles.stressBurnout}
          />
        </div>

        <div className={styles.rightColumn}>
          <div className={styles.rightTop}>
            <ConditionCard
              condition={getCondition("life-transitions")}
              variantClassName={styles.lifeTransitions}
            />
            <ConditionCard
              condition={getCondition("relationship-issues")}
              variantClassName={styles.relationshipIssues}
            />
          </div>
          <ConditionCard
            condition={getCondition("depression")}
            variantClassName={styles.depression}
          />
        </div>
      </div>
    </section>
  );
};

export default ConditionsGrid;