import { FunctionComponent, useMemo, type CSSProperties } from "react";
import styles from "./FrameComponent1.module.css";

export type FrameComponent1Type = {
  className?: string;
  icon?: string;
  journal?: string;
  aSanctuaryForYourWrittenWords?: string;

  /** Style props */
  frameDivPadding?: CSSProperties["padding"];
  frameDivWidth?: CSSProperties["width"];
  frameDivPadding1?: CSSProperties["padding"];
  iconHeight?: CSSProperties["height"];
};

const FrameComponent1: FunctionComponent<FrameComponent1Type> = ({
  className = "",
  frameDivPadding,
  frameDivWidth,
  frameDivPadding1,
  icon,
  iconHeight,
  journal,
  aSanctuaryForYourWrittenWords,
}) => {
  const frameDivStyle: CSSProperties = useMemo(() => {
    return {
      padding: frameDivPadding,
    };
  }, [frameDivPadding]);

  const frameDiv1Style: CSSProperties = useMemo(() => {
    return {
      width: frameDivWidth,
    };
  }, [frameDivWidth]);

  const frameDiv2Style: CSSProperties = useMemo(() => {
    return {
      padding: frameDivPadding1,
    };
  }, [frameDivPadding1]);

  const iconStyle: CSSProperties = useMemo(() => {
    return {
      height: iconHeight,
    };
  }, [iconHeight]);

  return (
    <div
      className={[styles.frameWrapper, className].join(" ")}
      style={frameDivStyle}
    >
      <div className={styles.frameParent} style={frameDiv1Style}>
        <div className={styles.iconWrapper} style={frameDiv2Style}>
          <img
            className={styles.icon}
            loading="lazy"
            alt=""
            src={icon}
            style={iconStyle}
          />
        </div>
        <div className={styles.frameGroup}>
          <div className={styles.journalWrapper}>
            <h3 className={styles.journal}>{journal}</h3>
          </div>
          <div className={styles.aSanctuaryFor}>
            {aSanctuaryForYourWrittenWords}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FrameComponent1;
