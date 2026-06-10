// import { FunctionComponent, useState, useRef, useEffect, useCallback } from "react";
// import { useNavigate } from "react-router-dom";
// import styles from "./AnonymousChat.module.css";
// import logo from ".../media/logo.jpeg";
// // ─── Types ───────────────────────────────────────────────────────────────────
// type Role = "ai" | "user";
// interface Message {
//   id: string;
//   role: Role;
//   text: string;
// }

// // ─── Static data ─────────────────────────────────────────────────────────────
// const SUGGESTION_CHIPS = [
//   { emoji: "😔", label: "Feeling lonely" },
//   { emoji: "😰", label: "Anxious mind" },
//   { emoji: "💼", label: "Work is too much" },
//   { emoji: "💔", label: "Heart is heavy" },
//   { emoji: "🌙", label: "Just need to talk" },
// ];

// const AI_REPLIES = [
//   "That takes real courage to say. Can you tell me a bit more about when you started feeling this way?",
//   "I hear you — you don't have to carry this alone. What's been the heaviest part of your day?",
//   "That makes a lot of sense. Sometimes everything piles up at once. What would feel like relief right now, even just for a moment?",
//   "You reached out, and that already says something. What feels most overwhelming when you sit with it?",
//   "Thank you for trusting me with this. You deserve to feel supported. Are you somewhere safe right now? 🌿",
//   "That weight you're describing — it's real. A lot of people feel it but don't say it out loud. I'm glad you did. 💜",
//   "Sometimes the hardest thing is just not knowing who to tell. I'm here. Take your time.",
// ];

// const PAST_SESSIONS = [
//   { id: "s1", title: "Feeling lost after work", preview: "It all felt pointless…", time: "Yesterday" },
//   { id: "s2", title: "Couldn't sleep again", preview: "3am and still awake", time: "2 days ago" },
//   { id: "s3", title: "Missing home", preview: "Travel gets lonely", time: "Last week" },
// ];

// // ─── Helpers ─────────────────────────────────────────────────────────────────
// let msgCounter = 0;
// const uid = () => `msg-${++msgCounter}-${Date.now()}`;

// // ─── Component ───────────────────────────────────────────────────────────────
// const AnonymousChat: FunctionComponent = () => {
//   const navigate = useNavigate();
//   const [sidebarOpen, setSidebarOpen] = useState(true);
//   const [messages, setMessages] = useState<Message[]>([
//     {
//       id: uid(),
//       role: "ai",
//       text: "Hi, I'm Saathy. 🌿 This conversation is anonymous. What's on your mind today?",
//     },
//   ]);
//   const [input, setInput] = useState("");
//   const [isTyping, setIsTyping] = useState(false);
//   const [usedChips, setUsedChips] = useState<Set<string>>(new Set());
//   const [activeSession, setActiveSession] = useState("current");
//   const replyIdx = useRef(0);
//   const messagesEndRef = useRef<HTMLDivElement>(null);
//   const textareaRef = useRef<HTMLTextAreaElement>(null);

//   const scrollToBottom = useCallback(() => {
//     setTimeout(() => {
//       messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//     }, 50);
//   }, []);

//   useEffect(() => {
//     scrollToBottom();
//   }, [messages, isTyping, scrollToBottom]);

//   const autoResize = () => {
//     const el = textareaRef.current;
//     if (!el) return;
//     el.style.height = "auto";
//     el.style.height = Math.min(el.scrollHeight, 100) + "px";
//   };

//   const simulateReply = useCallback(() => {
//     setIsTyping(true);
//     const delay = 1600 + Math.random() * 700;
//     setTimeout(() => {
//       setIsTyping(false);
//       setMessages((prev) => [
//         ...prev,
//         {
//           id: uid(),
//           role: "ai",
//           text: AI_REPLIES[replyIdx.current % AI_REPLIES.length],
//         },
//       ]);
//       replyIdx.current++;
//     }, delay);
//   }, []);

//   const sendText = useCallback(
//     (text: string) => {
//       if (!text.trim() || isTyping) return;
//       setMessages((prev) => [...prev, { id: uid(), role: "user", text: text.trim() }]);
//       simulateReply();
//     },
//     [isTyping, simulateReply]
//   );

//   const handleSend = () => {
//     sendText(input);
//     setInput("");
//     if (textareaRef.current) textareaRef.current.style.height = "auto";
//   };

//   const handleKey = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
//     if (e.key === "Enter" && !e.shiftKey) {
//       e.preventDefault();
//       handleSend();
//     }
//   };

//   const handleChip = (label: string) => {
//     if (usedChips.has(label) || isTyping) return;
//     setUsedChips((prev) => new Set(prev).add(label));
//     sendText(label);
//   };

//   const startNewChat = () => {
//     setMessages([
//       {
//         id: uid(),
//         role: "ai",
//         text: "Fresh start 🌿 Whatever's on your mind, this is a safe place. How are you doing?",
//       },
//     ]);
//     setUsedChips(new Set());
//     replyIdx.current = 0;
//     setActiveSession("current");
//   };

//   return (
//     <div className={styles.shell}>
//       {/* ── Sidebar ── */}
//       <aside className={`${styles.sidebar} ${sidebarOpen ? "" : styles.sidebarCollapsed}`}>
//         <div className={styles.sbHeader}>
//           <span className={styles.sbLogo}>Saathy</span>
//           <button
//             className={styles.sbClose}
//             onClick={() => setSidebarOpen(false)}
//             title="Close sidebar"
//             aria-label="Close sidebar"
//           >
//             <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
//               <path d="M18 6L6 18M6 6l12 12" />
//             </svg>
//           </button>
//         </div>

//         <button className={styles.btnNewChat} onClick={startNewChat}>
//           <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
//             <path d="M12 5v14M5 12h14" />
//           </svg>
//           New conversation
//         </button>

//         <p className={styles.sbSectionLabel}>This session</p>
//         <div className={styles.convList}>
//           <div
//             className={`${styles.convItem} ${activeSession === "current" ? styles.convItemActive : ""}`}
//             onClick={() => setActiveSession("current")}
//           >
//             <span className={styles.convTitle}>Current chat</span>
//             <span className={styles.convPreview}>
//               {messages[messages.length - 1]?.text.slice(0, 36)}…
//             </span>
//             <span className={styles.convTime}>Just now</span>
//           </div>
//         </div>

//         <p className={`${styles.sbSectionLabel} ${styles.sbSectionLabelSpacing}`}>Past sessions</p>
//         <div className={styles.convList}>
//           {PAST_SESSIONS.map((s) => (
//             <div
//               key={s.id}
//               className={`${styles.convItem} ${activeSession === s.id ? styles.convItemActive : ""} ${styles.convItemLocked}`}
//               onClick={() => setActiveSession(s.id)}
//             >
//               <span className={styles.convTitle}>{s.title}</span>
//               <span className={styles.convPreview}>{s.preview}</span>
//               <span className={styles.convTime}>{s.time} · 🔒 sign up to access</span>
//             </div>
//           ))}
//         </div>

//         <div className={styles.sbFooter}>
//           <div className={styles.anonPill}>
//             <span className={styles.anonDot} />
//             Anonymous mode — no data stored
//           </div>
//           <button className={styles.sbFooterBtn} onClick={() => navigate("/register")}>
//             <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
//               <path d="M12 20h9M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z" />
//             </svg>
//             Sign up to save chats
//           </button>
//           <button className={styles.sbFooterBtn} onClick={() => navigate("/")}>
//             <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
//               <path d="M15 18l-6-6 6-6" />
//             </svg>
//             Back to home
//           </button>
//         </div>
//       </aside>

//       {/* ── Main ── */}
//       {/* <div className={styles.main}> */}
//       <div
//   className={`${styles.main} ${
//     sidebarOpen ? styles.mainSidebarOpen : styles.mainSidebarClosed
//   }`}
// >
//         {/* Topbar */}
//         <header className={styles.topbar}>
//           <div className={styles.topbarLeft}>
//             <button
//               className={styles.btnToggle}
//               onClick={() => setSidebarOpen((v) => !v)}
//               title={sidebarOpen ? "Hide sidebar" : "Show sidebar"}
//               aria-label="Toggle sidebar"
//             >
//               {sidebarOpen ? (
//                 <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
//                   <path d="M11 19l-7-7 7-7M4 12h16" />
//                 </svg>
//               ) : (
//                 <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
//                   <path d="M3 12h18M3 6h18M3 18h18" />
//                 </svg>
//               )}
//             </button>
//             <span className={styles.topbarTitle}>Saathy AI</span>
//           </div>
//           <div className={styles.topbarRight}>
//             <div className={styles.incogBadge}>
//               <span className={`${styles.anonDot} ${styles.anonDotTiny}`} />
//               🕶 Anonymous
//             </div>
//             <button className={styles.btnAccount} onClick={() => navigate("/register")}>
//               Create account
//             </button>
//           </div>
//         </header>

//         {/* Chat */}
//         <div className={styles.chatWrap}>
//           <div className={styles.chatInner}>

//             {/* Welcome */}
//             <div className={styles.welcome}>
//               <div className={styles.welcomeAvatar}>🤍</div>
//               <h1 className={styles.welcomeTitle}>
//                 Hi, I'm <em>Saathy</em>
//               </h1>
//               <p className={styles.welcomeSub}>
//                 This is a safe, anonymous space. Nothing you say is stored or linked to you.
//                 Just talk — I'm here. 💜
//               </p>
//             </div>

//             {/* Messages */}
//             <div className={styles.messages} role="log" aria-live="polite">
//               {messages.map((msg) => (
//                 <div
//                   key={msg.id}
//                   className={`${styles.msgRow} ${msg.role === "user" ? styles.msgRowUser : styles.msgRowAi}`}
//                 >
//                   {msg.role === "ai" && <div className={styles.msgAvatar}>🤍</div>}
//                   <div className={`${styles.bubble} ${msg.role === "user" ? styles.bubbleUser : styles.bubbleAi}`}>
//                     {msg.text}
//                   </div>
//                 </div>
//               ))}

//               {/* Typing indicator */}
//               {isTyping && (
//                 <div className={`${styles.msgRow} ${styles.msgRowAi}`}>
//                   <div className={styles.msgAvatar}>🤍</div>
//                   <div className={styles.typingDots}>
//                     <span />
//                     <span />
//                     <span />
//                   </div>
//                 </div>
//               )}
//               <div ref={messagesEndRef} />
//             </div>

//             {/* Suggestion chips */}
//             <div className={styles.chips}>
//               {SUGGESTION_CHIPS.map(({ emoji, label }) => (
//                 <button
//                   key={label}
//                   className={`${styles.chip} ${usedChips.has(label) ? styles.chipUsed : ""}`}
//                   onClick={() => handleChip(label)}
//                   disabled={usedChips.has(label) || isTyping}
//                 >
//                   {emoji} {label}
//                 </button>
//               ))}
//             </div>

//             {/* Input bar */}
//             <div className={styles.inputBar}>
//               <div className={styles.inputWrap}>
//                 <textarea
//                   ref={textareaRef}
//                   className={styles.input}
//                   rows={1}
//                   value={input}
//                   placeholder="Say anything — this is just between us…"
//                   onChange={(e) => {
//                     setInput(e.target.value);
//                     autoResize();
//                   }}
//                   onKeyDown={handleKey}
//                   aria-label="Message input"
//                 />
//                 <button
//                   className={styles.btnSend}
//                   onClick={handleSend}
//                   disabled={!input.trim() || isTyping}
//                   title="Send"
//                   aria-label="Send message"
//                 >
//                   <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
//                     <path d="M22 2L11 13M22 2L15 22 11 13 2 9l20-7z" />
//                   </svg>
//                 </button>
//               </div>
//               <p className={styles.inputHint}>
//                 🔒 End-to-end private · No account · Session clears on close
//               </p>
//             </div>

//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AnonymousChat;

import { FunctionComponent, useState, useRef, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./AnonymousChat.module.css";
import logo from "../media/logo.jpeg";

// ─── Types ───────────────────────────────────────────────────────────────────
type Role = "ai" | "user";

interface Message {
  id: string;
  role: Role;
  text: string;
}

interface Tone {
  emoji: string;
  label: string;
  desc: string;
  openingLine: string;
  replies: string[];
}

// ─── Tone Definitions ────────────────────────────────────────────────────────
const TONES: Tone[] = [
  {
    emoji: "🤗",
    label: "Friendly & Supportive",
    desc: "Warm, affirming, by your side",
    openingLine: "Hey, so glad you're here. 🌿 This is your space — completely anonymous. What's on your mind today?",
    replies: [
      "That takes real courage to put into words. Tell me more — I'm all here with you.",
      "You don't have to carry this alone. What's felt the heaviest today?",
      "I hear you, and what you're feeling makes complete sense. What would feel like a small relief right now?",
      "You reached out, and that already says something brave about you. What's sitting with you the most?",
      "Thank you for trusting this space. You deserve to be heard. 💜",
    ],
  },
  {
    emoji: "💡",
    label: "Advising & Practical",
    desc: "Grounded, clear, action-focused",
    openingLine: "Let's talk through what's going on. I'll help you think it through clearly. What's the situation?",
    replies: [
      "Okay, let's break this down. What's the core issue you're facing right now?",
      "That's a real challenge. Have you tried stepping back to identify which part is actually in your control?",
      "Sometimes we spiral on things that feel urgent but aren't. What's the one thing that would actually help most right now?",
      "That makes sense. What have you already tried, and what felt like it moved the needle even slightly?",
      "Let's focus on what's actionable. What's the smallest next step that could shift this?",
    ],
  },
  {
    emoji: "🔥",
    label: "Motivational",
    desc: "Energizing, bold, forward-moving",
    openingLine: "You showed up — that matters. 💪 What are you working through today?",
    replies: [
      "The fact that you're here and talking about it means you haven't given up. That's everything.",
      "Hard moments build the most resilient version of you. What's one thing you're still proud of today?",
      "You've come through things before. What got you through those times?",
      "This feeling is real, and it's also temporary. What's a small win you could claim today?",
      "You don't have to feel strong right now. But you are stronger than this moment. I believe that. 🚀",
    ],
  },
  {
    emoji: "🌊",
    label: "Calm & Reflective",
    desc: "Slow, spacious, thoughtful",
    openingLine: "Take a breath. There's no rush here. 🌙 What would you like to explore today?",
    replies: [
      "Sit with that for a moment. What does that feeling remind you of?",
      "There's something meaningful in what you just shared. Can you say more about where you feel it — is it in your body, your thoughts, somewhere else?",
      "What would it mean to simply allow this feeling to exist, without trying to fix it yet?",
      "Sometimes naming a feeling is enough to loosen its grip. What word comes closest to what you're experiencing?",
      "You're doing the quiet, important work of understanding yourself. That's not small. 🌿",
    ],
  },
  {
    emoji: "💜",
    label: "Empathetic Listener",
    desc: "Present, non-judgmental, gentle",
    openingLine: "I'm here, fully. 🤍 Nothing you say will be judged. What's going on for you right now?",
    replies: [
      "I hear you. That sounds genuinely painful.",
      "That makes a lot of sense given what you've been through. How long have you been carrying this?",
      "It takes a lot to even say that out loud. I want you to know I'm really listening.",
      "You're not too much. You're not being dramatic. What you feel is real and it matters.",
      "I'm not going anywhere. Take your time. 💜",
    ],
  },
  {
    emoji: "☕",
    label: "Casual Conversation",
    desc: "Easy, no pressure, just talk",
    openingLine: "Hey! Nothing serious required here — we can just talk. What's up with you today?",
    replies: [
      "Ah yeah, that kind of day. Those are rough. What happened?",
      "Honestly, sometimes you just need to vent to someone. I'm a good listener, go on.",
      "Wait, really? Tell me more about that.",
      "Ha, I totally get that. It's weirdly common to feel that way. You're not alone.",
      "Okay so what are you thinking of doing about it? Or do you just need to get it out first?",
    ],
  },
];

// ─── Static data ─────────────────────────────────────────────────────────────
const SUGGESTION_CHIPS = [
  { emoji: "😔", label: "Feeling lonely" },
  { emoji: "😰", label: "Anxious mind" },
  { emoji: "💼", label: "Work is too much" },
  { emoji: "💔", label: "Heart is heavy" },
  { emoji: "🌙", label: "Just need to talk" },
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

  // Tone modal state
  const [showToneModal, setShowToneModal] = useState(true);
  const [selectedToneIdx, setSelectedToneIdx] = useState<number | null>(null);
  const [activeTone, setActiveTone] = useState<Tone>(TONES[0]);

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [messages, setMessages] = useState<Message[]>([]);
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
    }, 40);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, scrollToBottom]);

  const autoResize = () => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 96) + "px";
  };

  const simulateReply = useCallback(
    (tone: Tone) => {
      setIsTyping(true);
      const delay = 1400 + Math.random() * 800;
      setTimeout(() => {
        setIsTyping(false);
        setMessages((prev) => [
          ...prev,
          {
            id: uid(),
            role: "ai",
            text: tone.replies[replyIdx.current % tone.replies.length],
          },
        ]);
        replyIdx.current++;
      }, delay);
    },
    []
  );

  const sendText = useCallback(
    (text: string, tone: Tone) => {
      if (!text.trim() || isTyping) return;
      setMessages((prev) => [...prev, { id: uid(), role: "user", text: text.trim() }]);
      simulateReply(tone);
    },
    [isTyping, simulateReply]
  );

  const handleSend = () => {
    sendText(input, activeTone);
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
    sendText(label, activeTone);
  };

  const handleStartChat = () => {
    if (selectedToneIdx === null) return;
    const tone = TONES[selectedToneIdx];
    setActiveTone(tone);
    setMessages([{ id: uid(), role: "ai", text: tone.openingLine }]);
    setShowToneModal(false);
  };

  const startNewChat = () => {
    setSelectedToneIdx(null);
    setShowToneModal(true);
    setMessages([]);
    setUsedChips(new Set());
    replyIdx.current = 0;
    setActiveSession("current");
  };

  return (
    <div className={styles.shell}>

      {/* ── Tone Selection Modal ── */}
      {showToneModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <img src={logo} alt="Saathy" className={styles.modalLogo} />
            <h2 className={styles.modalTitle}>How would you like to talk today?</h2>
            <p className={styles.modalSub}>
              Choose a conversation tone. You can always start fresh later.
            </p>
            <div className={styles.toneGrid}>
              {TONES.map((tone, i) => (
                <button
                  key={tone.label}
                  className={`${styles.toneBtn} ${selectedToneIdx === i ? styles.toneBtnActive : ""}`}
                  onClick={() => setSelectedToneIdx(i)}
                >
                  <span className={styles.toneEmoji}>{tone.emoji}</span>
                  <span className={styles.toneLabel}>{tone.label}</span>
                  <span className={styles.toneDesc}>{tone.desc}</span>
                </button>
              ))}
            </div>
            <button
              className={styles.modalStart}
              disabled={selectedToneIdx === null}
              onClick={handleStartChat}
            >
              Start conversation
            </button>
          </div>
        </div>
      )}

      {/* ── Sidebar ── */}
      <aside className={`${styles.sidebar} ${sidebarOpen ? "" : styles.sidebarCollapsed}`}>
        <div className={styles.sbHeader}>
          <div className={styles.sbLogoWrap}>
            <img src={logo} alt="Saathy" className={styles.sbLogoImg} />
            <span className={styles.sbLogoText}>Saathy</span>
          </div>
          <button
            className={styles.sbClose}
            onClick={() => setSidebarOpen(false)}
            title="Close sidebar"
            aria-label="Close sidebar"
          >
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <button className={styles.btnNewChat} onClick={startNewChat}>
          <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
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
              {messages[messages.length - 1]?.text.slice(0, 38)}…
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
            Anonymous — no data stored
          </div>
          <button className={styles.sbFooterBtn} onClick={() => navigate("/register")}>
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
              <path d="M12 20h9M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z" />
            </svg>
            Sign up to save chats
          </button>
          <button className={styles.sbFooterBtn} onClick={() => navigate("/")}>
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
              <path d="M15 18l-6-6 6-6" />
            </svg>
            Back to home
          </button>
        </div>
      </aside>

      {/* ── Main ── */}
      <div className={styles.main}>

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
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M11 19l-7-7 7-7M4 12h16" />
                </svg>
              ) : (
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M3 12h18M3 6h18M3 18h18" />
                </svg>
              )}
            </button>
            <div className={styles.topbarBrand}>
              <img src={logo} alt="Saathy" className={styles.topbarLogoImg} />
              <span className={styles.topbarTitle}>Saathy AI</span>
            </div>
          </div>
          <div className={styles.topbarRight}>
            <div className={styles.incogBadge}>
              <span className={`${styles.anonDot} ${styles.anonDotTiny}`} />
              Anonymous
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
              <div className={styles.welcomeLogoRow}>
                <img src={logo} alt="Saathy" className={styles.welcomeLogoImg} />
                <div>
                  <h1 className={styles.welcomeTitle}>
                    Hi, I'm <em>Saathy</em>
                  </h1>
                </div>
              </div>
              <p className={styles.welcomeSub}>
                Anonymous and private — nothing you share is stored or linked to you.
              </p>
              {!showToneModal && (
                <div className={styles.tonePillRow}>
                  <span className={styles.tonePillLabel}>Tone:</span>
                  <span className={styles.tonePill}>
                    {activeTone.emoji} {activeTone.label}
                  </span>
                </div>
              )}
            </div>

            {/* Messages */}
            <div className={styles.messages} role="log" aria-live="polite">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`${styles.msgRow} ${msg.role === "user" ? styles.msgRowUser : styles.msgRowAi}`}
                >
                  {msg.role === "ai" && (
                    <div className={styles.msgAvatar}>
                      <img src={logo} alt="Saathy" className={styles.msgAvatarImg} />
                    </div>
                  )}
                  <div
                    className={`${styles.bubble} ${msg.role === "user" ? styles.bubbleUser : styles.bubbleAi}`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className={`${styles.msgRow} ${styles.msgRowAi}`}>
                  <div className={styles.msgAvatar}>
                    <img src={logo} alt="Saathy" className={styles.msgAvatarImg} />
                  </div>
                  <div className={styles.typingDots}>
                    <span /><span /><span />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Suggestion chips */}
            {!showToneModal && (
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
            )}

            {/* Input bar */}
            <div className={styles.inputBar}>
              <div className={styles.inputBox}>
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
                  disabled={showToneModal}
                  aria-label="Message input"
                />
                <button
                  className={styles.btnSend}
                  onClick={handleSend}
                  disabled={!input.trim() || isTyping || showToneModal}
                  title="Send"
                  aria-label="Send message"
                >
                  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path d="M22 2L11 13M22 2L15 22 11 13 2 9l20-7z" />
                  </svg>
                </button>
              </div>
              <p className={styles.inputHint}>
                🔒 End-to-end private · No account needed · Clears on close
              </p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default AnonymousChat;