import { FunctionComponent } from "react";
import styles from "./Stories.module.css";

export type StoriesType = {
  className?: string;
};

const Stories: FunctionComponent<StoriesType> = ({ className = "" }) => {
  return (
    <section className={[styles.rectangleParent, className].join(" ")}>
      <div className={styles.frameChild} />
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
          <div className={styles.frameGroup}>
            <img
              className={styles.frameItem}
              loading="lazy"
              alt=""
              src="/Frame-1450.svg"
            />
            <img
              className={styles.frameInner}
              loading="lazy"
              alt=""
              src="/Frame-1450.svg"
            />
          </div>
        </section>
        <section className={styles.component76Parent}>
          <div className={styles.component76}>
            <div className={styles.frameContainer}>
              <div className={styles.frameDiv}>
                <div className={styles.lineMdstarFilledParent}>
                  <img
                    className={styles.lineMdstarFilledIcon}
                    loading="lazy"
                    alt=""
                    src="/line-md-star-filled.svg"
                  />
                  <img
                    className={styles.lineMdstarFilledIcon}
                    loading="lazy"
                    alt=""
                    src="/line-md-star-filled.svg"
                  />
                  <img
                    className={styles.lineMdstarFilledIcon}
                    loading="lazy"
                    alt=""
                    src="/line-md-star-filled.svg"
                  />
                  <img
                    className={styles.lineMdstarFilledIcon}
                    loading="lazy"
                    alt=""
                    src="/line-md-star-filled.svg"
                  />
                  <img
                    className={styles.lineMdstarFilledIcon}
                    loading="lazy"
                    alt=""
                    src="/line-md-star-filled.svg"
                  />
                </div>
                <h3 className={styles.iMovedTo}>
                  “I moved to Mumbai alone and had no one to talk to. Saathy
                  made me feel less invisible.”
                </h3>
              </div>
              <div className={styles.frameWrapper2}>
                <div className={styles.ellipseParent}>
                  <img
                    className={styles.ellipseIcon}
                    loading="lazy"
                    alt=""
                    src="/Ellipse-90@2x.png"
                  />
                  <div className={styles.frameParent2}>
                    <div className={styles.akashJainWrapper}>
                      <h3 className={styles.akashJain}>Akash Jain</h3>
                    </div>
                    <div className={styles.southDelhi}>South Delhi</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className={styles.component77}>
            <div className={styles.frameContainer}>
              <div className={styles.frameParent4}>
                <div className={styles.lineMdstarFilledGroup}>
                  <img
                    className={styles.lineMdstarFilledIcon6}
                    alt=""
                    src="/line-md-star-filled.svg"
                  />
                  <img
                    className={styles.lineMdstarFilledIcon6}
                    alt=""
                    src="/line-md-star-filled.svg"
                  />
                  <img
                    className={styles.lineMdstarFilledIcon6}
                    alt=""
                    src="/line-md-star-filled.svg"
                  />
                  <img
                    className={styles.lineMdstarFilledIcon6}
                    alt=""
                    src="/line-md-star-filled.svg"
                  />
                  <img
                    className={styles.lineMdstarFilledIcon6}
                    alt=""
                    src="/line-md-star-filled.svg"
                  />
                </div>
                <h3 className={styles.iMovedTo2}>
                  “I moved to Mumbai alone and had no one to talk to. Saathy
                  made me feel less invisible.”
                </h3>
              </div>
              <div className={styles.frameWrapper3}>
                <div className={styles.ellipseParent}>
                  <img
                    className={styles.ellipseIcon}
                    loading="lazy"
                    alt=""
                    src="/Ellipse-902@2x.png"
                  />
                  <div className={styles.frameParent2}>
                    <div className={styles.akashJainWrapper}>
                      <h3 className={styles.akashJain}>Akash Jain</h3>
                    </div>
                    <div className={styles.southDelhi}>South Delhi</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className={styles.component77}>
            <div className={styles.frameContainer}>
              <div className={styles.frameParent4}>
                <div className={styles.lineMdstarFilledGroup}>
                  <img
                    className={styles.lineMdstarFilledIcon6}
                    alt=""
                    src="/line-md-star-filled.svg"
                  />
                  <img
                    className={styles.lineMdstarFilledIcon6}
                    alt=""
                    src="/line-md-star-filled.svg"
                  />
                  <img
                    className={styles.lineMdstarFilledIcon6}
                    alt=""
                    src="/line-md-star-filled.svg"
                  />
                  <img
                    className={styles.lineMdstarFilledIcon6}
                    alt=""
                    src="/line-md-star-filled.svg"
                  />
                  <img
                    className={styles.lineMdstarFilledIcon6}
                    alt=""
                    src="/line-md-star-filled.svg"
                  />
                </div>
                <h3 className={styles.iMovedTo2}>
                  “I moved to Mumbai alone and had no one to talk to. Saathy
                  made me feel less invisible.”
                </h3>
              </div>
              <div className={styles.frameWrapper3}>
                <div className={styles.ellipseParent}>
                  <img
                    className={styles.ellipseIcon}
                    loading="lazy"
                    alt=""
                    src="/Ellipse-901@2x.png"
                  />
                  <div className={styles.frameParent2}>
                    <div className={styles.akashJainWrapper}>
                      <h3 className={styles.akashJain}>Akash Jain</h3>
                    </div>
                    <div className={styles.southDelhi}>South Delhi</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <div className={styles.thSectionChild} />
        <div className={styles.thSectionItem} />
      </div>
    </section>
  );
};

export default Stories;
