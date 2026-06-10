import { FunctionComponent } from "react";
import { Link } from "react-router-dom";
import styles from "./FinalCTA.module.css";

export type FinalCTAType = {
  className?: string;
};

const FinalCTA: FunctionComponent<FinalCTAType> = ({
  className = "",
}) => {
  return (
    <section className={[styles.sectionFinalCta, className].join(" ")}>
      <div className={styles.decorativeElementsWrapper}>
        <div className={styles.decorativeElements} />
      </div>
      <div className={styles.frameParent}>
        <div className={styles.heading2Parent}>
          <div className={styles.heading2}>
            <h2 className={styles.youDoNot}>
              You do not have to go through it alone.
            </h2>
          </div>
          <div className={styles.container}>
            <div className={styles.talkFreelyNo}>
              Talk freely. No judgement. A trained human Buddy is just one step
              away
            </div>
          </div>
        </div>
        <div className={styles.container2}>
          <Link to="/register" className={styles.button}>
            <div className={styles.buttonshadow} />
            <div className={styles.startFreeToday}>Start Free Today</div>
          </Link>
          <div className={styles.previewWrapper}>
            <Link to="/anonymous-chat" className={styles.button2} title="Preview Saathy AI chat">
              <div className={styles.talkToSaathy}>Talk to Saathy AI</div>
            </Link>
            <div className={styles.previewNote}>Preview the anonymous chat experience instantly.</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FinalCTA;
