import { FunctionComponent } from "react";
import Header from "../layout/Header";
import Hero from "./Hero";
import styles from "./Team.module.css";

export type TeamType = {
  className?: string;
};

const Team: FunctionComponent<TeamType> = ({ className = "" }) => {
  return (
    <section className={[styles.thSectionWrapper, className].join(" ")}>
      <div className={styles.thSection}>
        <div className={styles.aHolisticEmotionalEcosystemWrapper}>
          <h2 className={styles.aHolisticEmotionalContainer}>
            <span className={styles.aHolistic}>{`A holistic `}</span>
            <span className={styles.emotional}>{`emotional `}</span>
            <span className={styles.aHolistic}>ecosystem</span>
          </h2>
        </div>
        <div className={styles.frameParent}>
          <Header
            icon="/Icon2.svg"
            journal="Journal"
            aSanctuaryForYourWrittenWords="A sanctuary for your written words and
private thoughts."
          />
          <Hero
            icon="/Icon3.svg"
            memory="Memory"
            anOptionalSecureLogOfYourGro="An optional, secure log of your growth
journey and breakthroughs."
          />
          <Hero
            frameDivPadding="24px 16px 21px 17px"
            icon="/Icon4.svg"
            iconHeight="20px"
            memory="Daily Pulse"
            anOptionalSecureLogOfYourGro="Visualizing your emotional trends to build
 self-awareness."
          />
          <Header
            frameDivPadding="18px 19px"
            frameDivWidth="227px"
            frameDivPadding1="23px 14px 21px 15px"
            icon="/Icon5.svg"
            iconHeight="29px"
            journal="Safe Circles"
            aSanctuaryForYourWrittenWords={`Anonymous, moderated 
small groups for
shared experiences.`}
          />
        </div>
      </div>
    </section>
  );
};

export default Team;
