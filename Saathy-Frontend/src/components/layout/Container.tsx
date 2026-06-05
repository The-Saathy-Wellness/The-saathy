import { FunctionComponent, useMemo, type CSSProperties } from "react";
import styles from "./Container.module.css";

export type ContainerType = {
  className?: string;
  videoConversations?: string;
  faceToFaceConnectionForMore?: string;
  bookSession?: string;

  /** Style props */
  containerPadding?: CSSProperties["padding"];
  bookSessionLetterSpacing?: CSSProperties["letterSpacing"];
  bookSessionFontWeight?: CSSProperties["fontWeight"];
  bookSessionFontFamily?: CSSProperties["fontFamily"];
};

const Container: FunctionComponent<ContainerType> = ({
  className = "",
  containerPadding,
  videoConversations,
  faceToFaceConnectionForMore,
  bookSession,
  bookSessionLetterSpacing,
  bookSessionFontWeight,
  bookSessionFontFamily,
}) => {
  const container1Style: CSSProperties = useMemo(() => {
    return {
      padding: containerPadding,
    };
  }, [containerPadding]);

  const bookSessionStyle: CSSProperties = useMemo(() => {
    return {
      letterSpacing: bookSessionLetterSpacing,
      fontWeight: bookSessionFontWeight,
      fontFamily: bookSessionFontFamily,
    };
  }, [bookSessionLetterSpacing, bookSessionFontWeight, bookSessionFontFamily]);

  return (
    <div
      className={[styles.container, className].join(" ")}
      style={container1Style}
    >
      <div className={styles.heading3}>
        <h3 className={styles.videoConversations}>{videoConversations}</h3>
      </div>
      <div className={styles.container2}>
        <div className={styles.faceToFaceConnectionFor}>
          {faceToFaceConnectionForMore}
        </div>
      </div>
      <div className={styles.link}>
        <div className={styles.bookSession} style={bookSessionStyle}>
          {bookSession}
        </div>
        <div className={styles.container3}>
          <img className={styles.icon} alt="" src="/Icon.svg" />
        </div>
      </div>
    </div>
  );
};

export default Container;
