import { FunctionComponent } from "react";
import styles from "./Questions.module.css";

export type QuestionsType = {
  className?: string;
};

const Questions: FunctionComponent<QuestionsType> = ({ className = "" }) => {
  return (
    <section className={[styles.frameWrapper, className].join(" ")}>
      <div className={styles.frameContainer}>
        <div className={styles.rectangleParent}>
          <div className={styles.frameChild} />
          <div className={styles.thSection}>
            <div className={styles.thSection2}>
              <div className={styles.generalQuestionsAskedByUseWrapper}>
                <h1 className={styles.generalQuestionsAskedContainer}>
                  <span className={styles.generalQuestionsAskedContainer2}>
                    <span className={styles.general}>{`General `}</span>
                    <span className={styles.questions}>{`questions `}</span>
                    <span className={styles.general}>asked by users</span>
                  </span>
                </h1>
              </div>
            </div>
            <section className={styles.frameParent}>
              <div className={styles.frameDiv}>
                <div className={styles.whatIsSaathyParent}>
                  <h3 className={styles.whatIsSaathy}>What is Saathy?</h3>
                  <img
                    className={styles.weuiarrowFilledIcon}
                    alt=""
                    src="/weui-arrow-filled.svg"
                  />
                </div>
              </div>
              <div className={styles.frameDiv}>
                <div className={styles.whatIsSaathyParent}>
                  <h3 className={styles.whatIsSaathy}>
                    Why to use Saathy Daily ?
                  </h3>
                  <img
                    className={styles.weuiarrowFilledIcon}
                    alt=""
                    src="/weui-arrow-filled.svg"
                  />
                </div>
              </div>
              <div className={styles.frameWrapper3}>
                <div className={styles.whatsTheDifferenceBetweenParent}>
                  <div className={styles.whatsTheDifference}>
                    What’s the Difference between Saathy Ai and Saathy Human?
                  </div>
                  <img
                    className={styles.weuiarrowFilledIcon}
                    alt=""
                    src="/weui-arrow-filled.svg"
                  />
                </div>
              </div>
              <div className={styles.frameDiv}>
                <div className={styles.whatIsSaathyParent}>
                  <h3 className={styles.whatIsSaathy}>
                    How does Saathy Benefits me?
                  </h3>
                  <img
                    className={styles.weuiarrowFilledIcon}
                    alt=""
                    src="/weui-arrow-filled.svg"
                  />
                </div>
              </div>
              <div className={styles.frameDiv}>
                <div className={styles.whatIsSaathyParent}>
                  <h3 className={styles.whatIsSaathy}>
                    Can I choose voice or video?
                  </h3>
                  <img
                    className={styles.weuiarrowFilledIcon}
                    alt=""
                    src="/weui-arrow-filled.svg"
                  />
                </div>
              </div>
              <div className={styles.frameDiv}>
                <div className={styles.whatIsSaathyParent}>
                  <h3 className={styles.canSaathySpeak}>
                    Can Saathy speak Hindi?
                  </h3>
                  <img
                    className={styles.weuiarrowFilledIcon}
                    alt=""
                    src="/weui-arrow-filled.svg"
                  />
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Questions;
