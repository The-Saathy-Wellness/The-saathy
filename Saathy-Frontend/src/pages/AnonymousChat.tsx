import { FunctionComponent, useState, useRef, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./AnonymousChat.module.css";
import logo from ".../media/logo.jpeg";
// ─── Types ───────────────────────────────────────────────────────────────────
type Role = "ai" | "user";
interface Message {
  id: string;
  role: Role;
  text: string;
}

// ─── Static data ─────────────────────────────────────────────────────────────
const SUGGESTION_CHIPS = [
  { emoji: "😔", label: "Feeling lonely" },
  { emoji: "😰", label: "Anxious mind" },
  { emoji: "💼", label: "Work is too much" },
  { emoji: "💔", label: "Heart is heavy" },
  { emoji: "🌙", label: "Just need to talk" },
];

const AI_REPLIES = [
  "That takes real courage to say. Can you tell me a bit more about when you started feeling this way?",
  "I hear you — you don't have to carry this alone. What's been the heaviest part of your day?",
  "That makes a lot of sense. Sometimes everything piles up at once. What would feel like relief right now, even just for a moment?",
  "You reached out, and that already says something. What feels most overwhelming when you sit with it?",
  "Thank you for trusting me with this. You deserve to feel supported. Are you somewhere safe right now? 🌿",
  "That weight you're describing — it's real. A lot of people feel it but don't say it out loud. I'm glad you did. 💜",
  "Sometimes the hardest thing is just not knowing who to tell. I'm here. Take your time.",
];

const PAST_SESSIONS = [
  { id: "s1", title: "Feeling lost after work", preview: "It all felt pointless…", time: "Yesterday" },
  { id: "s2", title: "Couldn't sleep again", preview: "3am and still awake", time: "2 days ago" },
  { id: "s3", title: "Missing home", preview: "Travel gets lonely", time: "Last week" },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────
let msgCounter = 0;
const uid = () => `msg-${++msgCounter}-${Date.now()}`;

// ─── Component ───────────────────────────────────────────────────────────────
const AnonymousChat: FunctionComponent = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: uid(),
      role: "ai",
      text: "Hi, I'm Saathy. 🌿 This conversation is anonymous. What's on your mind today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [usedChips, setUsedChips] = useState<Set<string>>(new Set());
  const [activeSession, setActiveSession] = useState("current");
  const replyIdx = useRef(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = useCallback(() => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 50);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, scrollToBottom]);

  const autoResize = () => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 100) + "px";
  };

  const simulateReply = useCallback(() => {
    setIsTyping(true);
    const delay = 1600 + Math.random() * 700;
    setTimeout(() => {
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        {
          id: uid(),
          role: "ai",
          text: AI_REPLIES[replyIdx.current % AI_REPLIES.length],
        },
      ]);
      replyIdx.current++;
    }, delay);
  }, []);

  const sendText = useCallback(
    (text: string) => {
      if (!text.trim() || isTyping) return;
      setMessages((prev) => [...prev, { id: uid(), role: "user", text: text.trim() }]);
      simulateReply();
    },
    [isTyping, simulateReply]
  );

  const handleSend = () => {
    sendText(input);
    setInput("");
    if (textareaRef.current) textareaRef.current.style.height = "auto";
  };

  const handleKey = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleChip = (label: string) => {
    if (usedChips.has(label) || isTyping) return;
    setUsedChips((prev) => new Set(prev).add(label));
    sendText(label);
  };

  const startNewChat = () => {
    setMessages([
      {
        id: uid(),
        role: "ai",
        text: "Fresh start 🌿 Whatever's on your mind, this is a safe place. How are you doing?",
      },
    ]);
    setUsedChips(new Set());
    replyIdx.current = 0;
    setActiveSession("current");
  };

  return (
    <div className={styles.shell}>
      {/* ── Sidebar ── */}
      <aside className={`${styles.sidebar} ${sidebarOpen ? "" : styles.sidebarCollapsed}`}>
        <div className={styles.sbHeader}>
          <span className={styles.sbLogo}>Saathy</span>
          <button
            className={styles.sbClose}
            onClick={() => setSidebarOpen(false)}
            title="Close sidebar"
            aria-label="Close sidebar"
          >
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <button className={styles.btnNewChat} onClick={startNewChat}>
          <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path d="M12 5v14M5 12h14" />
          </svg>
          New conversation
        </button>

        <p className={styles.sbSectionLabel}>This session</p>
        <div className={styles.convList}>
          <div
            className={`${styles.convItem} ${activeSession === "current" ? styles.convItemActive : ""}`}
            onClick={() => setActiveSession("current")}
          >
            <span className={styles.convTitle}>Current chat</span>
            <span className={styles.convPreview}>
              {messages[messages.length - 1]?.text.slice(0, 36)}…
            </span>
            <span className={styles.convTime}>Just now</span>
          </div>
        </div>

        <p className={`${styles.sbSectionLabel} ${styles.sbSectionLabelSpacing}`}>Past sessions</p>
        <div className={styles.convList}>
          {PAST_SESSIONS.map((s) => (
            <div
              key={s.id}
              className={`${styles.convItem} ${activeSession === s.id ? styles.convItemActive : ""} ${styles.convItemLocked}`}
              onClick={() => setActiveSession(s.id)}
            >
              <span className={styles.convTitle}>{s.title}</span>
              <span className={styles.convPreview}>{s.preview}</span>
              <span className={styles.convTime}>{s.time} · 🔒 sign up to access</span>
            </div>
          ))}
        </div>

        <div className={styles.sbFooter}>
          <div className={styles.anonPill}>
            <span className={styles.anonDot} />
            Anonymous mode — no data stored
          </div>
          <button className={styles.sbFooterBtn} onClick={() => navigate("/register")}>
            <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
              <path d="M12 20h9M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z" />
            </svg>
            Sign up to save chats
          </button>
          <button className={styles.sbFooterBtn} onClick={() => navigate("/")}>
            <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
              <path d="M15 18l-6-6 6-6" />
            </svg>
            Back to home
          </button>
        </div>
      </aside>

      {/* ── Main ── */}
      {/* <div className={styles.main}> */}
      <div
  className={`${styles.main} ${
    sidebarOpen ? styles.mainSidebarOpen : styles.mainSidebarClosed
  }`}
>
        {/* Topbar */}
        <header className={styles.topbar}>
          <div className={styles.topbarLeft}>
            <button
              className={styles.btnToggle}
              onClick={() => setSidebarOpen((v) => !v)}
              title={sidebarOpen ? "Hide sidebar" : "Show sidebar"}
              aria-label="Toggle sidebar"
            >
              {sidebarOpen ? (
                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M11 19l-7-7 7-7M4 12h16" />
                </svg>
              ) : (
                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M3 12h18M3 6h18M3 18h18" />
                </svg>
              )}
            </button>
            <span className={styles.topbarTitle}>Saathy AI</span>
          </div>
          <div className={styles.topbarRight}>
            <div className={styles.incogBadge}>
              <span className={`${styles.anonDot} ${styles.anonDotTiny}`} />
              🕶 Anonymous
            </div>
            <button className={styles.btnAccount} onClick={() => navigate("/register")}>
              Create account
            </button>
          </div>
        </header>

        {/* Chat */}
        <div className={styles.chatWrap}>
          <div className={styles.chatInner}>

            {/* Welcome */}
            <div className={styles.welcome}>
              <div className={styles.welcomeAvatar}>🤍</div>
              <h1 className={styles.welcomeTitle}>
                Hi, I'm <em>Saathy</em>
              </h1>
              <p className={styles.welcomeSub}>
                This is a safe, anonymous space. Nothing you say is stored or linked to you.
                Just talk — I'm here. 💜
              </p>
            </div>

            {/* Messages */}
            <div className={styles.messages} role="log" aria-live="polite">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`${styles.msgRow} ${msg.role === "user" ? styles.msgRowUser : styles.msgRowAi}`}
                >
                  {msg.role === "ai" && <div className={styles.msgAvatar}>🤍</div>}
                  <div className={`${styles.bubble} ${msg.role === "user" ? styles.bubbleUser : styles.bubbleAi}`}>
                    {msg.text}
                  </div>
                </div>
              ))}

              {/* Typing indicator */}
              {isTyping && (
                <div className={`${styles.msgRow} ${styles.msgRowAi}`}>
                  <div className={styles.msgAvatar}>🤍</div>
                  <div className={styles.typingDots}>
                    <span />
                    <span />
                    <span />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Suggestion chips */}
            <div className={styles.chips}>
              {SUGGESTION_CHIPS.map(({ emoji, label }) => (
                <button
                  key={label}
                  className={`${styles.chip} ${usedChips.has(label) ? styles.chipUsed : ""}`}
                  onClick={() => handleChip(label)}
                  disabled={usedChips.has(label) || isTyping}
                >
                  {emoji} {label}
                </button>
              ))}
            </div>

            {/* Input bar */}
            <div className={styles.inputBar}>
              <div className={styles.inputWrap}>
                <textarea
                  ref={textareaRef}
                  className={styles.input}
                  rows={1}
                  value={input}
                  placeholder="Say anything — this is just between us…"
                  onChange={(e) => {
                    setInput(e.target.value);
                    autoResize();
                  }}
                  onKeyDown={handleKey}
                  aria-label="Message input"
                />
                <button
                  className={styles.btnSend}
                  onClick={handleSend}
                  disabled={!input.trim() || isTyping}
                  title="Send"
                  aria-label="Send message"
                >
                  <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path d="M22 2L11 13M22 2L15 22 11 13 2 9l20-7z" />
                  </svg>
                </button>
              </div>
              <p className={styles.inputHint}>
                🔒 End-to-end private · No account · Session clears on close
              </p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default AnonymousChat;