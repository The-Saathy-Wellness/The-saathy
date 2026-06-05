import { FunctionComponent } from "react";
import styles from "./FrameComponent1111111.module.css";

export type FrameComponent1111111Type = {
  className?: string;
};

const FrameComponent1111111: FunctionComponent<FrameComponent1111111Type> = ({
  className = "",
}) => {
  return (
    <section className={[styles.thSectionWrapper, className].join(" ")}>
      <div className={styles.thSection}>
        <section className={styles.frameParent}>
          <div className={styles.frameWrapper}>
            <div className={styles.whatBringsPeopleToSaathyWrapper}>
              <h1 className={styles.whatBringsPeopleContainer}>
                <span className={styles.whatBringsPeopleContainer2}>
                  <span className={styles.whatBrings}>{`What brings `}</span>
                  <span className={styles.people}>{`people `}</span>
                  <span className={styles.whatBrings}>to Saathy</span>
                </span>
              </h1>
            </div>
          </div>
          <div className={styles.saathyOffersSupportFor30Wrapper}>
            <div className={styles.saathyOffersSupport}>
              Saathy offers support for 30+ mental health conditions. Explore
              some of the most common ones below to see how we approach care.
            </div>
          </div>
        </section>
        <div className={styles.anxietyParent}>
          <section className={styles.anxiety}>
            <img
              className={styles.anxietyChild}
              loading="lazy"
              alt=""
              src="/Frame-1495@2x.png"
            />
            <div className={styles.anxietyInner}>
              <div className={styles.frameGroup}>
                <div className={styles.anxietyWrapper}>
                  <h3 className={styles.anxiety2}>Anxiety</h3>
                </div>
                <div className={styles.whenWorriesAndOverthinkingWrapper}>
                  <div className={styles.whenWorriesAnd}>
                    When worries and overthinking start to feel overwhelming.
                  </div>
                </div>
              </div>
            </div>
          </section>
          <section className={styles.anxiety}>
            <div className={styles.amirMalekyBqcippvormmUnsplaParent}>
              <img
                className={styles.amirMalekyBqcippvormmUnsplaIcon}
                loading="lazy"
                alt=""
                src="/amir-maleky-bqCIPPvORmM-unsplash-12@2x.png"
              />
              <div className={styles.frameChild} />
            </div>
            <div className={styles.anxietyInner}>
              <div className={styles.frameGroup}>
                <div className={styles.lifeTransitionsWrapper}>
                  <h3 className={styles.anxiety2}>Life Transitions</h3>
                </div>
                <div className={styles.lifeChangesAdjustingToNewWrapper}>
                  <div className={styles.lifeChangesAdjusting}>
                    Life Changes Adjusting to new jobs, cities, routines, or
                    major lifeevents.
                  </div>
                </div>
              </div>
            </div>
          </section>
          <section className={styles.relationship}>
            <div className={styles.amirMalekyBqcippvormmUnsplaParent}>
              <img
                className={styles.amirMalekyBqcippvormmUnsplaIcon}
                loading="lazy"
                alt=""
                src="/amir-maleky-bqCIPPvORmM-unsplash-11@2x.png"
              />
              <div className={styles.frameItem} />
            </div>
            <div className={styles.frameDiv}>
              <div className={styles.frameGroup}>
                <div className={styles.anxietyWrapper}>
                  <h3 className={styles.anxiety2}>{`Relationship `}</h3>
                </div>
                <div className={styles.whenWorriesAndOverthinkingWrapper}>
                  <div className={styles.whenWorriesAnd}>
                    Navigating conflicts, breakups, and emotional distance.
                  </div>
                </div>
              </div>
              <div className={styles.container} />
            </div>
          </section>
          <section className={styles.stressBurnout}>
            <div className={styles.stressBurnoutParent}>
              <div className={styles.amirMalekyBqcippvormmUnsplaParent}>
                <img
                  className={styles.amirMalekyBqcippvormmUnsplaIcon}
                  alt=""
                  src="/amir-maleky-bqCIPPvORmM-unsplash-1@2x.png"
                />
                <div className={styles.stressBurnoutChild} />
              </div>
              <div className={styles.frameDiv}>
                <div className={styles.frameGroup}>
                  <div className={styles.anxietyWrapper}>
                    <h3 className={styles.anxiety2}>{`Stress & Burnout`}</h3>
                  </div>
                  <div className={styles.whenWorriesAndOverthinkingWrapper}>
                    <div className={styles.stressManagingPressure}>
                      Stress Managing pressure work, studies, and daily
                      responsibilities.
                    </div>
                  </div>
                </div>
                <div className={styles.container2}>
                  <img className={styles.icon} alt="" src="/Icon1.svg" />
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </section>
  );
};

export default FrameComponent1111111;
