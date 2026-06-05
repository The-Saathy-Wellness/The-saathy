import { FunctionComponent } from "react";
import FrameComponent1 from "./FrameComponent1";
import FrameComponent11 from "./FrameComponent11";
import styles from "./FrameComponent111111111.module.css";

export type FrameComponent111111111Type = {
  className?: string;
};

const FrameComponent111111111: FunctionComponent<
  FrameComponent111111111Type
> = ({ className = "" }) => {
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
          <FrameComponent1
            icon="/Icon2.svg"
            journal="Journal"
            aSanctuaryForYourWrittenWords="A sanctuary for your written words and
private thoughts."
          />
          <FrameComponent11
            icon="/Icon3.svg"
            memory="Memory"
            anOptionalSecureLogOfYourGro="An optional, secure log of your growth
journey and breakthroughs."
          />
          <FrameComponent11
            frameDivPadding="24px 16px 21px 17px"
            icon="/Icon4.svg"
            iconHeight="20px"
            memory="Daily Pulse"
            anOptionalSecureLogOfYourGro="Visualizing your emotional trends to build
 self-awareness."
          />
          <FrameComponent1
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

export default FrameComponent111111111;
