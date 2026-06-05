import { FunctionComponent } from "react";
import styles from "./FrameComponent1111111111111.module.css";

export type FrameComponent1111111111111Type = {
  className?: string;
};

const FrameComponent1111111111111: FunctionComponent<
  FrameComponent1111111111111Type
> = ({ className = "" }) => {
  return (
    <section className={[styles.frameWrapper, className].join(" ")}>
      <div className={styles.frameParent}>
        <div className={styles.containerParent}>
          <div className={styles.container}>
            <h2 className={styles.saathy}>Saathy</h2>
            <div className={styles.container2}>
              <div className={styles.humanAi}>
                Human + AI companionship platform for people who want a safe
                place to talk, reflect, and feel heard.
              </div>
            </div>
          </div>
          <div className={styles.logosfacebookParent}>
            <img
              className={styles.logosfacebookIcon}
              alt=""
              src="/logos-facebook.svg"
            />
            <img
              className={styles.skillIconsinstagram}
              alt=""
              src="/skill-icons-instagram.svg"
            />
            <img className={styles.groupIcon} alt="" src="/Group.svg" />
            <img
              className={styles.mditwitterIcon}
              alt=""
              src="/mdi-twitter.svg"
            />
          </div>
        </div>
        <div className={styles.frameContainer}>
          <div className={styles.frameGroup}>
            <div className={styles.frameDiv}>
              <input
                className={styles.frameChild}
                placeholder="Enter your email..."
                type="text"
              />
              <button className={styles.subscribeWrapper}>
                <div className={styles.subscribe}>Subscribe</div>
              </button>
            </div>
            <div className={styles.thSectionParent}>
              <div className={styles.thSection}>
                <img
                  className={styles.thSectionIcon}
                  alt=""
                  src="/5th-Section@2x.png"
                />
              </div>
              <div className={styles.frameParent2}>
                <div className={styles.heading5Parent}>
                  <div className={styles.heading5}>
                    <div className={styles.company}>
                      Company
                      <br />
                    </div>
                  </div>
                  <div className={styles.ecosystemParent}>
                    <div className={styles.ecosystem}>Ecosystem</div>
                    <div className={styles.ecosystem}>About Us</div>
                    <div className={styles.ecosystem}>Our Mission</div>
                    <div className={styles.careers}>Careers</div>
                    <div className={styles.contactUs}>
                      Contact Us
                      <br />
                    </div>
                  </div>
                </div>
                <div className={styles.heading5Group}>
                  <div className={styles.heading5}>
                    <div className={styles.company}>
                      Product
                      <br />
                    </div>
                  </div>
                  <div className={styles.saathyAiParent}>
                    <div className={styles.careers}>Saathy AI</div>
                    <div className={styles.humanListeners}>Human Listeners</div>
                    <div className={styles.saathyJournal}>Saathy Journal</div>
                    <div className={styles.careers}>Daily Pulse</div>
                    <div className={styles.saathyMemory}>Saathy Memory</div>
                    <div className={styles.pricing}>{`Pricing `}</div>
                  </div>
                </div>
                <div className={styles.heading5Container}>
                  <div className={styles.heading5}>
                    <h3
                      className={styles.safetyPrivacy}
                    >{`Safety & Privacy`}</h3>
                  </div>
                  <div className={styles.privacyPolicyParent}>
                    <div className={styles.careers}>Privacy Policy</div>
                    <div className={styles.careers}>{`Terms & Conditions`}</div>
                    <div className={styles.careers}>Data Deletion Request</div>
                    <div className={styles.careers}>Community Guidelines</div>
                    <div className={styles.safetyCenter}>Safety Center</div>
                  </div>
                </div>
                <div className={styles.heading5Parent2}>
                  <div className={styles.heading5}>
                    <h3 className={styles.support}>Support</h3>
                  </div>
                  <div className={styles.ecosystemParent}>
                    <div className={styles.careers}>Help Center</div>
                    <div className={styles.careers}>FAQs</div>
                    <div className={styles.careers}>Report a Concern</div>
                    <div className={styles.crisisResources}>
                      Crisis Resources
                      <br />
                    </div>
                    <div className={styles.feedback}>
                      Feedback
                      <br />
                    </div>
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

export default FrameComponent1111111111111;
