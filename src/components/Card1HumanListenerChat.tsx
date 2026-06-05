import { FunctionComponent, useMemo, type CSSProperties } from "react";
import styles from "./Card1HumanListenerChat.module.css";

export type Card1HumanListenerChatType = {
  className?: string;
  hugeiconsear?: string;
  saathyListenerChat?: string;
  realTimeTextSupportWithACompa?: string;
  startChatting?: string;

  /** Style props */
  card1HumanListenerChatPadding?: CSSProperties["padding"];
  card1HumanListenerChatHeight?: CSSProperties["height"];
  card1HumanListenerChatBorder?: CSSProperties["border"];
  hugeiconsearMaxHeight?: CSSProperties["maxHeight"];
  hugeiconsearHeight?: CSSProperties["height"];
  containerPadding?: CSSProperties["padding"];
  startChattingLetterSpacing?: CSSProperties["letterSpacing"];
  startChattingFontWeight?: CSSProperties["fontWeight"];
};

const Card1HumanListenerChat: FunctionComponent<Card1HumanListenerChatType> = ({
  className = "",
  card1HumanListenerChatPadding,
  card1HumanListenerChatHeight,
  card1HumanListenerChatBorder,
  hugeiconsear,
  hugeiconsearMaxHeight,
  hugeiconsearHeight,
  containerPadding,
  saathyListenerChat,
  realTimeTextSupportWithACompa,
  startChatting,
  startChattingLetterSpacing,
  startChattingFontWeight,
}) => {
  const card1HumanListenerChatStyle: CSSProperties = useMemo(() => {
    return {
      padding: card1HumanListenerChatPadding,
      height: card1HumanListenerChatHeight,
      border: card1HumanListenerChatBorder,
    };
  }, [
    card1HumanListenerChatPadding,
    card1HumanListenerChatHeight,
    card1HumanListenerChatBorder,
  ]);

  const hugeiconsearStyle: CSSProperties = useMemo(() => {
    return {
      maxHeight: hugeiconsearMaxHeight,
      height: hugeiconsearHeight,
    };
  }, [hugeiconsearMaxHeight, hugeiconsearHeight]);

  const containerStyle: CSSProperties = useMemo(() => {
    return {
      padding: containerPadding,
    };
  }, [containerPadding]);

  const startChattingStyle: CSSProperties = useMemo(() => {
    return {
      letterSpacing: startChattingLetterSpacing,
      fontWeight: startChattingFontWeight,
    };
  }, [startChattingLetterSpacing, startChattingFontWeight]);

  return (
    <div
      className={[styles.card1HumanListenerChat, className].join(" ")}
      style={card1HumanListenerChatStyle}
    >
      <div className={styles.background}>
        <img
          className={styles.hugeiconsear}
          loading="lazy"
          alt=""
          src={hugeiconsear}
          style={hugeiconsearStyle}
        />
      </div>
      <div className={styles.container} style={containerStyle}>
        <div className={styles.heading3}>
          <h3 className={styles.saathyListenerChat}>{saathyListenerChat}</h3>
        </div>
        <div className={styles.container2}>
          <div className={styles.realTimeTextSupport}>
            {realTimeTextSupportWithACompa}
          </div>
        </div>
        <div className={styles.link}>
          <div className={styles.startChatting} style={startChattingStyle}>
            {startChatting}
          </div>
          <div className={styles.container3}>
            <img className={styles.icon} alt="" src="/Icon.svg" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card1HumanListenerChat;
