import { FunctionComponent } from "react";
import styles from "./FrameComponent11111111.module.css";

export type FrameComponent11111111Type = {
  className?: string;
};

const FrameComponent11111111: FunctionComponent<FrameComponent11111111Type> = ({
  className = "",
}) => {
  return (
    <section className={[styles.frameWrapper, className].join(" ")}>
      <div className={styles.ellipseParent}>
        <div className={styles.frameChild} />
        <div className={styles.overlayshadow}>
          <div className={styles.table}>
            <header className={styles.headerRow}>
              <div className={styles.cell}>
                <h2 className={styles.features}>Features</h2>
              </div>
              <div className={styles.cell2}>
                <h2 className={styles.features}>Most Apps</h2>
              </div>
              <div className={styles.cell3}>
                <h2 className={styles.theSaathy}>The Saathy</h2>
              </div>
            </header>
            <div className={styles.body}>
              <div className={styles.row}>
                <div className={styles.data}>
                  <h3 className={styles.builtForIndia}>Built for India</h3>
                </div>
                <div className={styles.data2}>
                  <h3 className={styles.genericwestern}>Generic/Western</h3>
                </div>
                <div className={styles.data3}>
                  <h3 className={styles.deepLocalContext}>
                    Deep Local Context
                  </h3>
                </div>
              </div>
              <div className={styles.row2}>
                <div className={styles.data4}>
                  <h3 className={styles.builtForIndia}>AI + Humans</h3>
                </div>
                <div className={styles.data5}>
                  <h3 className={styles.genericwestern}>One or the other</h3>
                </div>
                <div className={styles.data6}>
                  <h3 className={styles.deepLocalContext}>Seamless Hybrid</h3>
                </div>
              </div>
              <div className={styles.row2}>
                <div className={styles.data4}>
                  <h3 className={styles.builtForIndia}>Memory</h3>
                </div>
                <div className={styles.data5}>
                  <h3 className={styles.genericwestern}>Resets each time</h3>
                </div>
                <div className={styles.data6}>
                  <h3 className={styles.longTermContext}>Long-term context</h3>
                </div>
              </div>
              <div className={styles.row2}>
                <div className={styles.data4}>
                  <h3 className={styles.builtForIndia}>Warm Experience</h3>
                </div>
                <div className={styles.data5}>
                  <h3 className={styles.genericwestern}>Clinical or Cold</h3>
                </div>
                <div className={styles.data6}>
                  <h3 className={styles.emotionalSanctuary}>
                    Emotional sanctuary
                  </h3>
                </div>
              </div>
              <div className={styles.row2}>
                <div className={styles.data4}>
                  <h3 className={styles.builtForIndia}>Affordable Pricing</h3>
                </div>
                <div className={styles.data5}>
                  <h3 className={styles.genericwestern}>
                    Premium Subscriptions
                  </h3>
                </div>
                <div className={styles.data6}>
                  <h3 className={styles.startFor1}>Start for ₹1</h3>
                </div>
              </div>
              <div className={styles.row6}>
                <div className={styles.data}>
                  <h3 className={styles.builtForIndia}>Privacy Controls</h3>
                </div>
                <div className={styles.data2}>
                  <h3 className={styles.genericwestern}>Basic</h3>
                </div>
                <div className={styles.data18}>
                  <h3 className={styles.deepLocalContext}>Delete Anytime</h3>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FrameComponent11111111;
