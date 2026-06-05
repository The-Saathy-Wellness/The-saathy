import { FunctionComponent } from "react";
import styles from "./FrameComponent11111.module.css";

export type FrameComponent11111Type = {
  className?: string;
};

const FrameComponent11111: FunctionComponent<FrameComponent11111Type> = ({
  className = "",
}) => {
  return (
    <section className={[styles.whySaathyWrapper, className].join(" ")}>
      <div className={styles.whySaathy}>
        <div className={styles.frameParent}>
          <div className={styles.whySaathyExistsWrapper}>
            <h1 className={styles.whySaathyExistsContainer}>
              <span className={styles.why}>{`Why `}</span>
              <span className={styles.saathy}>Saathy</span>
              <span className={styles.why}> exists</span>
            </h1>
          </div>
          <div className={styles.wereMoreConnectedThanEverWrapper}>
            <div className={styles.wereMoreConnected}>
              We’re more connected than ever yet feel more alone than ever
            </div>
          </div>
        </div>
        <section className={styles.frameGroup}>
          <div className={styles.whatsappImage20260529At8Parent}>
            <img
              className={styles.whatsappImage20260529At8}
              alt=""
              src="/WhatsApp-Image-2026-05-29-at-8-00-46-AM-2-1@2x.png"
            />
            <div className={styles.rectangleParent}>
              <div className={styles.frameChild} />
              <div className={styles.frameContainer}>
                <div className={styles.studySocialPressureParent}>
                  <h3
                    className={styles.studySocial}
                  >{`Study & Social Pressure `}</h3>
                  <div className={styles.frameItem} />
                </div>
                <img
                  className={styles.weuiarrowFilledIcon}
                  loading="lazy"
                  alt=""
                  src="/weui-arrow-filled.svg"
                />
              </div>
            </div>
          </div>
          <div className={styles.whatsappImage20260529At8Group}>
            <img
              className={styles.whatsappImage20260529At82}
              alt=""
              src="/WhatsApp-Image-2026-05-29-at-8-00-46-AM-1-1@2x.png"
            />
            <div className={styles.rectangleGroup}>
              <div className={styles.frameInner} />
              <div className={styles.frameContainer}>
                <div className={styles.studySocialPressureParent}>
                  <h3
                    className={styles.stressSelfDoubt}
                  >{`Stress & Self-Doubt`}</h3>
                  <div className={styles.frameItem} />
                </div>
                <img
                  className={styles.weuiarrowFilledIcon2}
                  loading="lazy"
                  alt=""
                  src="/weui-arrow-filled.svg"
                />
              </div>
            </div>
          </div>
          <div className={styles.whatsappImage20260531At8Parent}>
            <img
              className={styles.whatsappImage20260531At8}
              alt=""
              src="/WhatsApp-Image-2026-05-31-at-8-19-46-AM-1@2x.png"
            />
            <div className={styles.rectangleContainer}>
              <div className={styles.rectangleDiv} />
              <div className={styles.frameContainer}>
                <div className={styles.studySocialPressureParent}>
                  <h3
                    className={styles.stressSelfDoubt}
                  >{`Work Stress & Burnout`}</h3>
                  <div className={styles.frameItem} />
                </div>
                <img
                  className={styles.weuiarrowFilledIcon2}
                  loading="lazy"
                  alt=""
                  src="/weui-arrow-filled.svg"
                />
              </div>
            </div>
          </div>
        </section>
      </div>
    </section>
  );
};

export default FrameComponent11111;
