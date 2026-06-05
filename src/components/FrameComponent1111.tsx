import { FunctionComponent } from "react";
import styles from "./FrameComponent1111.module.css";

export type FrameComponent1111Type = {
  className?: string;
};

const FrameComponent1111: FunctionComponent<FrameComponent1111Type> = ({
  className = "",
}) => {
  return (
    <main className={[styles.frameWrapper, className].join(" ")}>
      <div className={styles.frameParent}>
        <div className={styles.bannerHeaderWrapper}>
          <header className={styles.bannerHeader}>
            <nav className={styles.navigation}>
              <div className={styles.container}>
                <h2 className={styles.saathy}>Saathy</h2>
              </div>
              <div className={styles.linkParent}>
                <div className={styles.link}>
                  <div className={styles.about}>About</div>
                </div>
                <div className={styles.link}>
                  <div className={styles.service}>Service</div>
                </div>
                <div className={styles.link}>
                  <div className={styles.service}>Pricing</div>
                </div>
                <div className={styles.link}>
                  <div className={styles.service}>Privacy policy</div>
                </div>
              </div>
              <div className={styles.frameGroup}>
                <div className={styles.loginWrapper}>
                  <div className={styles.service}>Login</div>
                </div>
                <button className={styles.button}>
                  <div className={styles.getStarted}>Get Started</div>
                </button>
              </div>
            </nav>
          </header>
        </div>
        <img
          className={styles.bannerBgIcon}
          loading="lazy"
          alt=""
          src="/banner-bg.svg"
        />
      </div>
    </main>
  );
};

export default FrameComponent1111;
