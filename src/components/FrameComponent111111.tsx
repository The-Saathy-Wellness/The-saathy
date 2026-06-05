import { FunctionComponent } from "react";
import Card1HumanListenerChat from "./Card1HumanListenerChat";
import Container from "./Container";
import styles from "./FrameComponent111111.module.css";

export type FrameComponent111111Type = {
  className?: string;
};

const FrameComponent111111: FunctionComponent<FrameComponent111111Type> = ({
  className = "",
}) => {
  return (
    <section className={[styles.frameWrapper, className].join(" ")}>
      <div className={styles.ellipseParent}>
        <div className={styles.frameChild} />
        <div className={styles.thSection}>
          <section className={styles.frameParent}>
            <div className={styles.talkToSomeoneRealWrapper}>
              <h2 className={styles.talkToSomeoneContainer}>
                <span className={styles.talkToSomeoneContainer2}>
                  <span className={styles.talkTo}>{`Talk to `}</span>
                  <span className={styles.someone}>someone</span>
                  <span className={styles.talkTo}> real</span>
                </span>
              </h2>
            </div>
            <div className={styles.wheneverAiIsNotEnoughARWrapper}>
              <div className={styles.wheneverAiIs}>
                Whenever AI is not enough, a real human is available. Connect
                with our trained human listeners for deeper support and
                authentic connection.
              </div>
            </div>
          </section>
          <div className={styles.frameGroup}>
            <section className={styles.frameContainer}>
              <div className={styles.card1HumanListenerChatParent}>
                <Card1HumanListenerChat
                  className={styles.cardHuman}
                  hugeiconsear="/hugeicons-ear.svg"
                  saathyListenerChat="Saathy Listener chat"
                  realTimeTextSupportWithACompa={`Real-time text support with a
companion who understands.`}
                  startChatting="Start Chatting"
                />
                <div className={styles.card3VideoConversations}>
                  <div className={styles.background}>
                    <div className={styles.videoIcon}>
                      <img
                        className={styles.materialSymbolsvideoCallOuIcon}
                        loading="lazy"
                        alt=""
                        src="/material-symbols-video-call-outline-rounded.svg"
                      />
                    </div>
                  </div>
                  <Container
                    videoConversations="Video Conversations"
                    faceToFaceConnectionForMore={`Face-to-face connection for more
personal, guided respite.`}
                    bookSession="Book Session"
                  />
                </div>
              </div>
              <div className={styles.whiteSmallCloudPngClipartWrapper}>
                <img
                  className={styles.whiteSmallCloudPngClipartIcon}
                  alt=""
                  src="/White-Small-Cloud-PNG-Clipart-879-13@2x.png"
                />
              </div>
            </section>
            <section className={styles.frameSection}>
              <div className={styles.frameDiv}>
                <div className={styles.whiteSmallCloudPngClipartParent}>
                  <img
                    className={styles.whiteSmallCloudPngClipartIcon2}
                    loading="lazy"
                    alt=""
                    src="/White-Small-Cloud-PNG-Clipart-879-13@2x.png"
                  />
                  <img
                    className={styles.whiteSmallCloudPngClipartIcon3}
                    loading="lazy"
                    alt=""
                    src="/White-Small-Cloud-PNG-Clipart-879-13@2x.png"
                  />
                </div>
              </div>
              <div className={styles.card1HumanListenerChatParent}>
                <div className={styles.card2AudioSupportCalls}>
                  <img
                    className={styles.backgroundIcon}
                    loading="lazy"
                    alt=""
                    src="/Background.svg"
                  />
                  <Container
                    containerPadding="0px 12px"
                    videoConversations="Audio Support Calls"
                    faceToFaceConnectionForMore={`A gentle voice to hear your thoughts
and provide comfort.`}
                    bookSession="Schedule Call"
                    bookSessionLetterSpacing="unset"
                    bookSessionFontWeight="unset"
                    bookSessionFontFamily="'Plus Jakarta Sans'"
                  />
                </div>
                <Card1HumanListenerChat
                  className={styles.cardAnchor}
                  card1HumanListenerChatPadding="30px 32px"
                  card1HumanListenerChatHeight="292.5px"
                  card1HumanListenerChatBorder="1px solid #fff"
                  hugeiconsear="/material-symbols-anchor-rounded.svg"
                  hugeiconsearMaxHeight="unset"
                  hugeiconsearHeight="24px"
                  containerPadding="0px 6px"
                  saathyListenerChat="Saathy Anchor"
                  realTimeTextSupportWithACompa={`Long-term dedicated human support
to guide your wellness journey.`}
                  startChatting="Learn More"
                  startChattingLetterSpacing="unset"
                  startChattingFontWeight="unset"
                />
              </div>
            </section>
            <div className={styles.rectangleParent}>
              <div className={styles.frameItem} />
              <img
                className={styles.whiteSmallCloudPngClipartIcon4}
                alt=""
                src="/White-Small-Cloud-PNG-Clipart-879-13@2x.png"
              />
              <img
                className={styles.whiteSmallCloudPngClipartIcon5}
                alt=""
                src="/White-Small-Cloud-PNG-Clipart-879-13@2x.png"
              />
              <img
                className={styles.whiteSmallCloudPngClipartIcon6}
                loading="lazy"
                alt=""
                src="/White-Small-Cloud-PNG-Clipart-879-13@2x.png"
              />
              <img
                className={styles.whiteSmallCloudPngClipartIcon7}
                loading="lazy"
                alt=""
                src="/White-Small-Cloud-PNG-Clipart-879-13@2x.png"
              />
              <img
                className={styles.file000000006f6c7207a0226aebeIcon}
                alt=""
                src="/file-000000006f6c7207a0226aebe42c2765-1@2x.png"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FrameComponent111111;
