import { FunctionComponent, useMemo, type CSSProperties } from "react";
import styles from "./Hero.module.css";

export type HeroType = {
  className?: string;
  icon?: string;
  memory?: string;
  anOptionalSecureLogOfYourGro?: string;

  /** Style props */
  frameDivPadding?: CSSProperties["padding"];
  iconHeight?: CSSProperties["height"];
};

const Hero: FunctionComponent<HeroType> = ({
  className = "",
  frameDivPadding,
  icon,
  iconHeight,
  memory,
  anOptionalSecureLogOfYourGro,
}) => {
  const frameDiv3Style: CSSProperties = useMemo(() => {
    return {
      padding: frameDivPadding,
    };
  }, [frameDivPadding]);

  const icon1Style: CSSProperties = useMemo(() => {
    return {
      height: iconHeight,
    };
  }, [iconHeight]);

  return (
    <div className={[styles.frameWrapper, className].join(" ")}>
      <div className={styles.frameParent}>
        <div className={styles.containerWrapper} style={frameDiv3Style}>
          <div className={styles.container}>
            <img
              className={styles.icon}
              loading="lazy"
              alt=""
              src={icon}
              style={icon1Style}
            />
          </div>
        </div>
        <div className={styles.frameGroup}>
          <div className={styles.memoryWrapper}>
            <h3 className={styles.memory}>{memory}</h3>
          </div>
          <div className={styles.anOptionalSecure}>
            {anOptionalSecureLogOfYourGro}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
