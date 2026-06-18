import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './StartWhereYouAreComfortable.module.css';

/* ==========================================================================
   Types
   ========================================================================== */

type TabKey = 'saathy-ai' | 'listener' | 'journal';

interface TabDefinition {
  key: TabKey;
  label: string;
}

const TABS: TabDefinition[] = [
  { key: 'saathy-ai', label: 'Saathy AI' },
  { key: 'listener', label: 'Listener' },
  { key: 'journal', label: 'Journal' },
];

const panelMotion = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: { duration: 0.4, ease: 'easeOut' as const },
};

/* ==========================================================================
   Small shared building blocks
   ========================================================================== */

const CheckIcon: React.FC = () => (
  <svg className={styles.checkIcon} viewBox="0 0 18 18" fill="none" aria-hidden="true">
    <path d="M4.5 9.2L7.3 12 13.5 5.6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const FeatureList: React.FC<{ items: string[] }> = ({ items }) => (
  <ul className={styles.featureList} style={{ listStyle: 'none', padding: 0, margin: 0 }}>
    {items.map((item) => (
      <li key={item} className={styles.featureItem}>
        <CheckIcon />
        <span>{item}</span>
      </li>
    ))}
  </ul>
);

const CTAButton: React.FC<{ label: string; variant?: 'purple' | 'pink' }> = ({ label, variant = 'purple' }) => (
  <button
    type="button"
    className={`${styles.ctaButton} ${variant === 'pink' ? styles.ctaButtonPink : ''}`}
  >
    {label}
  </button>
);

/* ==========================================================================
   Background decoration (blobs, curved lines, particle dots)
   ========================================================================== */

const BackgroundDecor: React.FC = () => (
  <div className={styles.bgDecor}>
    <div className={`${styles.blob} ${styles.blobOne}`} />
    <div className={`${styles.blob} ${styles.blobTwo}`} />
    <div className={`${styles.blob} ${styles.blobThree}`} />

    <svg className={styles.curveLine} viewBox="0 0 1440 800" preserveAspectRatio="none" aria-hidden="true">
      <path
        d="M-50 620 C 250 520, 480 700, 760 560 S 1280 420, 1500 540"
        stroke="rgba(124,92,255,0.10)"
        strokeWidth="1.5"
        fill="none"
      />
      <path
        d="M-80 160 C 220 60, 460 220, 740 120 S 1240 -20, 1520 140"
        stroke="rgba(168,85,247,0.10)"
        strokeWidth="1.5"
        fill="none"
      />
    </svg>

    <svg className={styles.dotField} viewBox="0 0 1440 800" preserveAspectRatio="none" aria-hidden="true">
      {Array.from({ length: 26 }).map((_, i) => {
        const x = (i * 173 + 40) % 1440;
        const y = (i * 251 + 80) % 800;
        const r = i % 5 === 0 ? 2.4 : 1.3;
        return <circle key={i} cx={x} cy={y} r={r} fill="rgba(124,92,255,0.18)" />;
      })}
    </svg>
  </div>
);

/* ==========================================================================
   Tab switcher
   ========================================================================== */

const TabSwitcher: React.FC<{ active: TabKey; onChange: (key: TabKey) => void }> = ({ active, onChange }) => {
  const activeIndex = TABS.findIndex((t) => t.key === active);

  return (
    <div className={styles.tabSwitcherWrap}>
      <div className={styles.tabSwitcher} role="tablist" aria-label="Support type">
        <motion.div
          className={styles.tabActivePill}
          style={{ width: `calc(${100 / TABS.length}% - 10px)` }}
          animate={{ left: `calc(${(100 / TABS.length) * activeIndex}% + 5px)` }}
          transition={{ type: 'spring', stiffness: 380, damping: 32 }}
        />
        {TABS.map((tab) => (
          <button
            key={tab.key}
            role="tab"
            type="button"
            aria-selected={active === tab.key}
            className={styles.tab}
            onClick={() => onChange(tab.key)}
          >
            <span className={active === tab.key ? styles.tabActiveLabel : undefined}>{tab.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

/* ==========================================================================
   Saathy AI dashboard mockup
   ========================================================================== */

const SaathyAIDashboard: React.FC = () => (
  <div className={styles.rightContent}>
    <motion.div className={`${styles.aiDashboard} ${styles.floatBob}`}>
      <div className={styles.breadcrumb}>Dashboard &nbsp;›&nbsp; Saathy AI</div>
      <div className={styles.dashLabel}>Companion</div>
      <h4 className={styles.dashTitle}>Saathy AI</h4>
      <p className={styles.dashSubtitle}>
        A judgement-free space to think out loud. Saathy listens, reflects, and gently guides — anytime you need.
      </p>

      <div className={styles.chatWindow}>
        <div className={styles.chatHeaderRow}>
          <div className={styles.avatarDot}>S</div>
          <div>
            <div className={styles.chatHeaderName}>Saathy</div>
            <div className={styles.chatHeaderStatus}>online · here for you</div>
          </div>
          <div className={styles.chatHeaderIcons}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" stroke="currentColor" strokeWidth="1.5" /></svg>
          </div>
        </div>

        <div className={styles.messageRow}>
          <div className={`${styles.messageBubble} ${styles.messageBubbleAI}`}>
            Hi Aanya — I'm glad you're here. How is your heart today?
          </div>
        </div>

        <div className={`${styles.messageRow} ${styles.messageRowUser}`}>
          <div className={`${styles.messageBubble} ${styles.messageBubbleUser}`}>
            Feeling a little scattered. Lots on my plate at work and I couldn't sleep well.
          </div>
        </div>

        <div className={styles.messageRow}>
          <div className={`${styles.messageBubble} ${styles.messageBubbleAI}`}>
            That sounds heavy — thank you for naming it. Would it help to slow the morning with a 3-minute breath, or would you like to talk through what's weighing on you first?
          </div>
        </div>

        <div className={styles.suggestionChips}>
          <span className={styles.chip}>Try the breath</span>
          <span className={styles.chip}>Let's talk it through</span>
          <span className={styles.chip}>Maybe later</span>
        </div>

        <div className={styles.messageRow}>
          <div className={styles.typingDots}>
            <span /><span /><span />
          </div>
        </div>

        <div className={styles.moodRow}>
          <span className={styles.moodChip}><span className={styles.moodDot} style={{ background: '#9bd1ff' }} /> Glowing</span>
          <span className={styles.moodChip}><span className={styles.moodDot} style={{ background: '#a7e3c5' }} /> Calm</span>
          <span className={styles.moodChip}><span className={styles.moodDot} style={{ background: '#f3d98a' }} /> Okay</span>
          <span className={styles.moodChip}><span className={styles.moodDot} style={{ background: '#f0b48e' }} /> Low</span>
          <span className={styles.moodChip}><span className={styles.moodDot} style={{ background: '#e497a8' }} /> Heavy</span>
        </div>

        <div className={styles.inputBar}>
          <span className={styles.inputBarText}>Share what's on your mind…</span>
          <span className={styles.sendButton}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M3 11l18-8-8 18-2-8-8-2z" fill="currentColor" /></svg>
          </span>
        </div>
      </div>

      <div className={styles.sideRail} aria-hidden="true">
        <div className={styles.sideRailLabel}>TRY</div>
        <div className={styles.sideRailDot} />
        <div className={styles.sideRailDot} />
        <div className={styles.sideRailDot} />
        <div className={styles.sideRailLabel} style={{ marginTop: 4 }}>RECENT</div>
        <div className={styles.sideRailDot} />
        <div className={styles.sideRailDot} />
      </div>

      <div className={styles.floatingCard} aria-hidden="true">
        <div className={styles.floatingCardTopRow}>
          <span className={`${styles.floatingCardTab} ${styles.floatingCardTabActive}`}>New conversation</span>
        </div>
        <div className={styles.floatingCardLine} style={{ width: '90%' }} />
        <div className={styles.floatingCardLine} style={{ width: '70%' }} />
        <div className={styles.floatingCardLine} style={{ width: '80%' }} />
        <div className={styles.floatingCardPill} />
      </div>
    </motion.div>
  </div>
);

/* ==========================================================================
   Listener dashboard mockup
   ========================================================================== */

interface ListenerProfile {
  initial: string;
  name: string;
  rating: string;
  blurb: string;
  tags: string[];
  avatarFrom: string;
  avatarTo: string;
}

const LISTENERS: ListenerProfile[] = [
  { initial: 'R', name: 'Riya M.', rating: '4.9', blurb: 'Soft-spoken & patient. 320+ sessions held.', tags: ['Anxiety', 'Burnout', 'EN', 'HI'], avatarFrom: '#ffd6b0', avatarTo: '#ffb87a' },
  { initial: 'A', name: 'Arjun K.', rating: '4.8', blurb: 'Calm presence for tough conversations.', tags: ['Relationships', 'Grief', 'EN', 'TA'], avatarFrom: '#bcd9ff', avatarTo: '#8fb8f0' },
  { initial: 'N', name: 'Naina S.', rating: '4.9', blurb: 'Walks with you through transitions.', tags: ['Career', 'Self-doubt', 'EN', 'MR'], avatarFrom: '#ffc9dd', avatarTo: '#ff9cc2' },
  { initial: 'D', name: 'Devansh P.', rating: '4.7', blurb: 'Holds space without judgement.', tags: ['Loneliness', 'EN'], avatarFrom: '#c8e6c9', avatarTo: '#9bd6a3' },
  { initial: 'T', name: 'Tara V.', rating: '4.9', blurb: 'Thoughtful listener, gentle follow-up.', tags: ['Family', 'Boundaries', 'EN'], avatarFrom: '#d8c8ff', avatarTo: '#b69bff' },
  { initial: 'K', name: 'Karan J.', rating: '4.8', blurb: 'Helps you unspool tangled days.', tags: ['Stress', 'Sleep', 'EN', 'HI'], avatarFrom: '#ffe2a8', avatarTo: '#ffc868' },
];

const ListenerCard: React.FC<{ listener: ListenerProfile }> = ({ listener }) => (
  <div className={styles.listenerCard}>
    <div className={styles.listenerCardTop}>
      <div
        className={styles.listenerAvatar}
        style={{ background: `linear-gradient(135deg, ${listener.avatarFrom}, ${listener.avatarTo})` }}
      />
      <div>
        <div className={styles.listenerName}>{listener.name}</div>
        <div className={styles.listenerRating}>★ {listener.rating}</div>
      </div>
    </div>
    <div className={styles.listenerBlurb}>{listener.blurb}</div>
    <div className={styles.listenerTags}>
      {listener.tags.map((tag) => (
        <span key={tag} className={styles.listenerTag}>{tag}</span>
      ))}
    </div>
    <button type="button" className={styles.connectButton}>Connect now</button>
  </div>
);

const ListenerDashboard: React.FC = () => (
  <div className={styles.rightContent}>
    <motion.div className={`${styles.listenerDashboard} ${styles.floatBob}`}>
      <div className={styles.listenerTopBar}>
        <div className={styles.searchBox}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.6" /><path d="M21 21l-3.5-3.5" stroke="currentColor" strokeWidth="1.6" /></svg>
          Search circles, journals, experts…
        </div>
        <div className={styles.profilePuck}>
          <div className={styles.profileAvatar} />
          <div className={styles.profileMeta}>Aanya Sharma<br />Day 28 · Showing up</div>
        </div>
      </div>

      <div className={styles.dashLabel}>Listeners</div>
      <h4 className={styles.listenerHeading}>Find a listener who feels right</h4>
      <p className={styles.listenerSubtext}>
        Trained peer listeners — anonymous, free, and always ready. Pick someone, and start whenever you're ready.
      </p>

      <div className={styles.filterRow}>
        <div className={styles.searchBox} style={{ flex: 1.4 }}>
          Search by name or what you'd like to talk about…
        </div>
        <span className={styles.filterChip}>All</span>
        <span className={styles.filterChip}>Any language</span>
        <span className={styles.filterChip}>Online now</span>
      </div>

      <div className={styles.listenerGrid}>
        {LISTENERS.map((listener) => (
          <ListenerCard key={listener.name} listener={listener} />
        ))}
      </div>
    </motion.div>

    <div className={styles.floatingListenerCard} aria-hidden="true">
      <div className={styles.listenerCardTop}>
        <div
          className={styles.listenerAvatar}
          style={{ background: 'linear-gradient(135deg, #ffd6b0, #ffb87a)' }}
        />
        <div>
          <div className={styles.listenerName}>Riya M.</div>
          <div className={styles.listenerRating}>★ 4.9</div>
        </div>
      </div>
      <div className={styles.listenerBlurb}>Soft-spoken &amp; patient.</div>
      <button type="button" className={styles.connectButton}>Connect now</button>
    </div>
  </div>
);

/* ==========================================================================
   Journal dashboard mockup
   ========================================================================== */

const TEMPLATES: { label: string; bg: string }[] = [
  { label: 'Daily reflection', bg: '#eef0ff' },
  { label: 'Gratitude', bg: '#eafaf0' },
  { label: "Letter I won't send", bg: '#fff1e8' },
  { label: 'Dream journal', bg: '#f3eefc' },
];

const JournalDashboard: React.FC = () => (
  <div className={styles.rightContent}>
    <motion.div className={`${styles.journalDashboard} ${styles.floatBob}`}>
      <div className={styles.journalLabel}>Journal</div>
      <h4 className={styles.journalTitle}>Write it out, gently</h4>
      <p className={styles.journalSubtitle}>
        A safe page for thoughts. Auto-saved, soft, and yours. Saathy can reflect back when you'd like.
      </p>

      <div className={styles.toolbar}>
        <span className={styles.toolbarFont}>Plus Jakarta · 16</span>
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none"><path d="M6 4h9a4 4 0 010 8H6zM6 12h10a4 4 0 010 8H6z" stroke="currentColor" strokeWidth="1.6" /></svg>
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none"><line x1="14" y1="4" x2="8" y2="20" stroke="currentColor" strokeWidth="1.6" /></svg>
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none"><line x1="4" y1="20" x2="20" y2="20" stroke="currentColor" strokeWidth="1.6" /><path d="M6 16l5-12 5 12" stroke="currentColor" strokeWidth="1.6" /></svg>
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" /></svg>
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none"><rect x="4" y="4" width="16" height="16" rx="2" stroke="currentColor" strokeWidth="1.6" /></svg>
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none"><circle cx="9" cy="9" r="2" stroke="currentColor" strokeWidth="1.5" /><path d="M3 19l5-6 4 4 5-7 4 5" stroke="currentColor" strokeWidth="1.5" /></svg>
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" stroke="currentColor" strokeWidth="1.5" /></svg>
        <span className={styles.toolbarAutosave}>Auto-saved · just now</span>
      </div>

      <div className={styles.entryCard}>
        <div className={styles.entryMeta}>Friday, 6 June · Mood before ●</div>
        <h5 className={styles.entryTitle}>On softer mornings</h5>
        <p className={styles.entryBody}>
          Today started slower than I expected. I didn't rush into the inbox. Instead I made tea, opened
          the window, and let the noise of the street feel like a kind of company.
        </p>
        <p className={styles.entryNote}>
          Saathy: I notice you mention "slower" twice — would you like to explore what that softness gave back to you?
        </p>
        <p className={styles.entryBody} style={{ marginBottom: 4 }}>
          There's a version of me that thinks rest is what happens after I deserve it. I'd like to stop
          negotiating with that voice.
        </p>

        <div className={styles.reflectionChips}>
          <span className={styles.reflectionChip}>✎ Rewrite gently</span>
          <span className={styles.reflectionChip}>≡ Summarize</span>
          <span className={styles.reflectionChip}>? Reflection questions</span>
        </div>
      </div>

      <div className={styles.journalInputBar}>
        <span>How do you feel after writing?</span>
        <div className={styles.journalInputIcons}>
          <span>🙂</span>
          <span>🌿</span>
          <span>💬</span>
          <span>🌙</span>
        </div>
      </div>
    </motion.div>

    <div className={styles.floatingTemplateCard} aria-hidden="true">
      <div className={styles.dashLabel} style={{ fontSize: 9.5 }}>Templates</div>
      <div className={styles.templateGrid}>
        {TEMPLATES.map((template) => (
          <span key={template.label} className={styles.templatePill} style={{ background: template.bg }}>
            {template.label}
          </span>
        ))}
      </div>
    </div>
  </div>
);

/* ==========================================================================
   Panels (left content + right dashboard) for each tab
   ========================================================================== */

const SaathyAIPanel: React.FC = () => (
  <div className={styles.panelGrid}>
    <div className={styles.leftContent}>
      <h3 className={styles.panelHeading}>Talk when your mind feels heavy</h3>
      <p className={styles.panelDesc}>
        When you feel alone, confused, stressed or unable to say things to people around you, Saathy AI
        is here to listen. You can type what happened, speak your thoughts, or simply start with "I do
        not know what to say." Saathy helps you slow down, understand what you are feeling and take one
        small next step.
      </p>
      <FeatureList items={['Available 24*7', 'Stay private and anonymous']} />
      <div className={styles.ctaRow}>
        <CTAButton label="Talk to Saathy AI" />
      </div>
      <p className={styles.caption}>A safer first place to say what is on your mind.</p>
    </div>
    <SaathyAIDashboard />
  </div>
);

const ListenerPanel: React.FC = () => (
  <div className={styles.panelGrid}>
    <div className={styles.leftContent}>
      <h3 className={styles.panelHeading}>Speak to a real person who will not judge</h3>
      <p className={styles.panelDesc}>
        Sometimes you do not need advice. You just need someone calm to hear you properly. Saathy
        Listeners are trained human listeners who give you space to talk freely through chat, audio or
        video. You can stay anonymous, share at your own pace and speak without fear of gossip, pressure
        or judgement.
      </p>
      <FeatureList items={['Trained human listeners', 'No phone sharing, no outside contact']} />
      <div className={styles.ctaRow}>
        <CTAButton label="Book a Listener" variant="pink" />
      </div>
      <p className={styles.caption}>A safer first place to say what is on your mind.</p>
    </div>
    <ListenerDashboard />
  </div>
);

const JournalPanel: React.FC = () => (
  <div className={styles.panelGrid}>
    <div className={styles.leftContent}>
      <h3 className={styles.panelHeading}>Write what you cannot say out loud</h3>
      <p className={styles.panelDesc}>
        Some feelings are difficult to speak. Saathy Journal gives you a private place to write honestly,
        without worrying about how it sounds. Write your thoughts, add your mood, record a voice note or
        come back later to understand what has been repeating in your mind. Your journal stays yours, and
        you can delete it anytime.
      </p>
      <FeatureList items={['Private by default', 'Write or record your thoughts']} />
      <div className={styles.ctaRow}>
        <CTAButton label="Open Journal" />
      </div>
      <p className={styles.caption}>Safe space for the thoughts you keep to yourself.</p>
    </div>
    <JournalDashboard />
  </div>
);

/* ==========================================================================
   Main exported section
   ========================================================================== */

const StartWhereYouAreComfortable: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabKey>('saathy-ai');

  return (
    <section className={styles.section}>
      <BackgroundDecor />

      <div className={styles.headerRow}>
        <h2 className={styles.heading}>
          Start where your are
          <br />
          <span className={styles.accent}>Comfortable</span>
        </h2>
        <p className={styles.subcopy}>
          Saathy offers support for 30+ mental health conditions. Explore some of the most common ones
          below to see approach care.
        </p>
      </div>

      <div className={styles.container}>
        <TabSwitcher active={activeTab} onChange={setActiveTab} />
        <div className={styles.divider} />

        <AnimatePresence mode="wait">
          {activeTab === 'saathy-ai' && (
            <motion.div key="saathy-ai" {...panelMotion}>
              <SaathyAIPanel />
            </motion.div>
          )}
          {activeTab === 'listener' && (
            <motion.div key="listener" {...panelMotion}>
              <ListenerPanel />
            </motion.div>
          )}
          {activeTab === 'journal' && (
            <motion.div key="journal" {...panelMotion}>
              <JournalPanel />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default StartWhereYouAreComfortable;