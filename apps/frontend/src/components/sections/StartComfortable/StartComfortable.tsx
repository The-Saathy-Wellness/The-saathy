import React, { useState } from 'react';
import styles from './StartComfortable.module.css';

type Tab = 'saathy-ai' | 'listener' | 'journal';

const CheckIcon = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M2 6L4.8 9L10 3" stroke="#7C5CFF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const SendIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M14 2L7.33333 8.66667M14 2L9.33333 14L7.33333 8.66667M14 2L2 6.66667L7.33333 8.66667" stroke="white" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const AISparkIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M8 1.5L9.2 5.8L13.5 7L9.2 8.2L8 12.5L6.8 8.2L2.5 7L6.8 5.8L8 1.5Z" fill="white" fillOpacity="0.9"/>
  </svg>
);

interface TabContent {
  heading: string;
  description: string;
  features: string[];
  ctaLabel: string;
  note: string;
}

const tabContent: Record<Tab, TabContent> = {
  'saathy-ai': {
    heading: 'Talk when your mind feels heavy',
    description:
      'When you feel alone, confused, stressed or unable to see things to people around you, Saathy AI is here to listen. You can express what happened, speak your thoughts, or simply start with "I do not know what to say." Saathy helps you slow down, understand what you are feeling and take one small next step.',
    features: ['Available 24/7', 'Stay private and anonymous'],
    ctaLabel: 'Talk to Saathy AI',
    note: 'A safer first place closer to our chest',
  },
  listener: {
    heading: 'Connect with a trained human listener',
    description:
      'Sometimes you need a real person who gets it. Our trained Saathy Listeners are empathetic volunteers available for chat, audio, or video sessions. No judgment, no advice pushing — just a compassionate ear.',
    features: ['Scheduled & on-demand sessions', 'Chat, audio or video'],
    ctaLabel: 'Book a Saathy Listener',
    note: 'Always a real human, always kind',
  },
  journal: {
    heading: 'Your private space to think out loud',
    description:
      'Use Saathy\'s guided journal to process your feelings at your own pace. Prompts help you reflect on your day, track your mood over time, and notice patterns that matter to your wellbeing.',
    features: ['Private to you only', 'Mood tracking over time'],
    ctaLabel: 'Start Journaling',
    note: 'No one else ever reads your journal',
  },
};

const ChatPreview: React.FC = () => (
  <div className={styles.chatPreview}>
    {/* Header */}
    <div className={styles.chatHeader}>
      <div className={styles.chatAvatar}>
        <AISparkIcon />
      </div>
      <div className={styles.chatHeaderInfo}>
        <div className={styles.chatHeaderName}>Saathy AI</div>
        <div className={styles.chatHeaderStatus}>● Online</div>
      </div>
      <div className={styles.chatHeaderDots}>
        <span /><span /><span />
      </div>
    </div>

    {/* Body */}
    <div className={styles.chatBody}>
      {/* AI message */}
      <div className={styles.bubbleAI}>
        <div className={styles.bubbleAIAvatar}><AISparkIcon /></div>
        <div className={styles.bubbleAIText}>
          Hey, I'm Saathy. This is a safe space — no judgment, no pressure. What's on your mind today?
        </div>
      </div>

      {/* User message */}
      <div className={styles.bubbleUser}>
        <div className={styles.bubbleUserText}>
          I've been feeling really overwhelmed lately. Work, family, everything piling up...
        </div>
      </div>

      {/* AI response */}
      <div className={styles.bubbleAI}>
        <div className={styles.bubbleAIAvatar}><AISparkIcon /></div>
        <div className={styles.bubbleAIText}>
          That sounds really heavy. Carrying that much at once can feel like you can't breathe. 
          Can you tell me — is there one thing that's weighing on you the most right now?
        </div>
      </div>

      {/* Suggestion chips */}
      <div className={styles.chips}>
        <span className={styles.chip}>Work stress</span>
        <span className={styles.chip}>Family tension</span>
        <span className={styles.chip}>I'm not sure</span>
      </div>

      {/* Typing */}
      <div className={styles.typing}>
        <div className={styles.bubbleAIAvatar}><AISparkIcon /></div>
        <div className={styles.typingDots}>
          <span /><span /><span />
        </div>
      </div>
    </div>

    {/* Input */}
    <div className={styles.chatInput}>
      <input
        className={styles.chatInputField}
        placeholder="Type something, anything..."
        readOnly
      />
      <button className={styles.chatSendBtn} aria-label="Send">
        <SendIcon />
      </button>
    </div>
  </div>
);

const StartComfortable: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('saathy-ai');
  const active = tabContent[activeTab];

  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        {/* Header */}
        <div className={styles.header}>
          <h2 className={styles.heading}>
            Start where your are{' '}
            <span className={styles.headingAccent}>Comfortable</span>
          </h2>
          <p className={styles.headerDesc}>
            Saathy offers support for 30+ mental health conditions. Explore some of the most common ones below to see how we approach care.
          </p>
        </div>

        {/* Tabs */}
        <div className={styles.tabBar} role="tablist">
          {(['saathy-ai', 'listener', 'journal'] as Tab[]).map((tab) => {
            const labels: Record<Tab, string> = {
              'saathy-ai': 'Saathy AI',
              listener: 'Listener',
              journal: 'Journal',
            };
            return (
              <button
                key={tab}
                role="tab"
                aria-selected={activeTab === tab}
                className={`${styles.tab} ${activeTab === tab ? styles.tabActive : ''}`}
                onClick={() => setActiveTab(tab)}
              >
                {labels[tab]}
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div className={styles.content}>
          {/* Left */}
          <div className={styles.left}>
            <h3 className={styles.contentHeading}>{active.heading}</h3>
            <p className={styles.contentDesc}>{active.description}</p>

            <div className={styles.features}>
              {active.features.map((f) => (
                <div key={f} className={styles.feature}>
                  <div className={styles.featureIcon}>
                    <CheckIcon />
                  </div>
                  <span className={styles.featureText}>{f}</span>
                </div>
              ))}
            </div>

            <button className={styles.ctaBtn}>{active.ctaLabel}</button>
            <span className={styles.ctaNote}>{active.note}</span>
          </div>

          {/* Right */}
          <div className={styles.right}>
            <ChatPreview />
          </div>
        </div>
      </div>
    </section>
  );
};

export default StartComfortable;
