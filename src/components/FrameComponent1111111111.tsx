import { FunctionComponent } from "react";
import styles from "./FrameComponent1111111111.module.css";

export type FrameComponent1111111111Type = {
  className?: string;
};

const FrameComponent1111111111: FunctionComponent<
  FrameComponent1111111111Type
> = ({ className = "" }) => {
  return (
    <section className={[styles.frameWrapper, className].join(" ")}>
      <div className={styles.frameParent}>
        <div className={styles.frameContainer}>
          <div className={styles.yourSafetyIsOurSoulWrapper}>
            <h2 className={styles.yourSafetyIsContainer}>
              <span className={styles.your}>{`Your `}</span>
              <span className={styles.safety}>safety</span>
              <span className={styles.your}> is our soul.</span>
            </h2>
          </div>
        </div>
        <div className={styles.thSection}>
          <div className={styles.thSectionInner}>
            <div className={styles.frameGroup}>
              <div className={styles.heading4Parent}>
                <div className={styles.heading4}>
                  <h3 className={styles.anonymous}>100% Anonymous</h3>
                </div>
                <div className={styles.container}>
                  <div className={styles.youNeverHave}>
                    You never have to share your real name,
                    <br />
                    location, or identity. Your privacy is
                    <br />
                    paramount.
                  </div>
                </div>
              </div>
              <div className={styles.heading5Parent}>
                <div className={styles.heading4}>
                  <h3 className={styles.consentBasedMemory}>
                    Consent-Based Memory
                  </h3>
                </div>
                <div className={styles.container}>
                  <div className={styles.youNeverHave}>
                    Our AI only remembers what you want it
                    <br />
                    to. You can wipe any session history with
                    <br />
                    one click.
                  </div>
                </div>
              </div>
              <div className={styles.heading5Group}>
                <div className={styles.heading4}>
                  <h3 className={styles.anonymous}>Zero Harassment</h3>
                </div>
                <div className={styles.container}>
                  <div className={styles.youNeverHave}>
                    Our listeners are vetted and monitored. We
                    <br />
                    have zero-tolerance for unsolicited DMs or
                    <br />
                    inappropriate content.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FrameComponent1111111111;
