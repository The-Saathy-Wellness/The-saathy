// import { FunctionComponent, useState, useEffect, useRef } from "react";
// import { useNavigate } from "react-router-dom";
// import styles from "./Dashboard.module.css";

// // ─── Types ───────────────────────────────────────────────────────────────────
// interface Message {
//   id: string;
//   role: "ai" | "user";
//   text: string;
//   timestamp: Date;
// }

// interface ActivityItem {
//   id: string;
//   type: "journal" | "chat" | "call" | "circle";
//   title: string;
//   subtitle: string;
//   time: string;
//   icon: string;
// }

// // ─── Data ────────────────────────────────────────────────────────────────────
// const MOOD_OPTIONS = [
//   { emoji: "😊", label: "Glowing", color: "#FCD34D" },
//   { emoji: "😌", label: "Calm", color: "#A78BFA" },
//   { emoji: "😐", label: "Okay", color: "#93C5FD" },
//   { emoji: "😔", label: "Low", color: "#C4B5FD" },
//   { emoji: "😞", label: "Heavy", color: "#F87171" },
// ];

// const EXPERT_SUPPORT = [
//   {
//     id: "1",
//     name: "Dr. Riya Menon",
//     title: "Clinical Psychologist",
//     badge: "Featured",
//     nextSession: "Mon, 8:30 PM",
//     avatar: "🧑‍⚕️",
//   },
//   {
//     id: "2",
//     name: "Priya Sharma",
//     title: "Wellness Coach",
//     badge: "Available",
//     nextSession: "Tomorrow, 3 PM",
//     avatar: "👩‍⚕️",
//   },
//   {
//     id: "3",
//     name: "Vikram Das",
//     title: "Grief Counselor",
//     badge: "Available",
//     nextSession: "Wed, 6 PM",
//     avatar: "🧑‍⚖️",
//   },
// ];

// const ACTIVITY_FEED: ActivityItem[] = [
//   {
//     id: "1",
//     type: "journal",
//     title: "Journal: A small win at work",
//     subtitle: "You wrote something today",
//     time: "Today · 4:35 PM",
//     icon: "📔",
//   },
//   {
//     id: "2",
//     type: "chat",
//     title: "Joined circle: Quiet mornings",
//     subtitle: "3 members listening",
//     time: "Today · 3:10 AM",
//     icon: "💬",
//   },
//   {
//     id: "3",
//     type: "call",
//     title: "Call with Dr. Riya Menon",
//     subtitle: "45 minutes — insights gained",
//     time: "Yesterday · 8:30 PM",
//     icon: "☎️",
//   },
//   {
//     id: "4",
//     type: "circle",
//     title: "RSVP: Sunday Quiet Hour",
//     subtitle: "Bengaluru Walk & Talk — 5:30 AM",
//     time: "3 days ago",
//     icon: "👥",
//   },
// ];

// // ─── Component ───────────────────────────────────────────────────────────────
// const Dashboard: FunctionComponent = () => {
//   const navigate = useNavigate();
//   const [sidebarOpen, setSidebarOpen] = useState(true);
//   const [darkMode, setDarkMode] = useState(false);
//   const [currentMood, setCurrentMood] = useState<string | null>(null);
//   const [wellnessScore, setWellnessScore] = useState(78);
//   const [showMoodPicker, setShowMoodPicker] = useState(false);
//   const [messages, setMessages] = useState<Message[]>([
//     {
//       id: "1",
//       role: "ai",
//       text: "Good morning, Aanya. How are you feeling today? 💜",
//       timestamp: new Date(Date.now() - 300000),
//     },
//   ]);
//   const [inputValue, setInputValue] = useState("");
//   const messagesEndRef = useRef<HTMLDivElement>(null);

//   // Scroll to bottom of messages
//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages]);

//   // Handle mood selection
//   const handleMoodSelect = (mood: string) => {
//     setCurrentMood(mood);
//     setShowMoodPicker(false);
//     // TODO: POST to /api/user/mood-check with { mood, timestamp }
//     console.log("Mood selected:", mood);
//   };

//   // Handle message send
//   const handleSendMessage = () => {
//     if (!inputValue.trim()) return;

//     const newMessage: Message = {
//       id: Date.now().toString(),
//       role: "user",
//       text: inputValue.trim(),
//       timestamp: new Date(),
//     };

//     setMessages([...messages, newMessage]);
//     setInputValue("");

//     // TODO: POST to /api/chat/send with { text, conversationId }
//     // Simulate AI response
//     setTimeout(() => {
//       const aiMessage: Message = {
//         id: (Date.now() + 1).toString(),
//         role: "ai",
//         text: "Thank you for sharing that with me. I'm here to listen. Tell me more about how that made you feel.",
//         timestamp: new Date(),
//       };
//       setMessages((prev) => [...prev, aiMessage]);
//     }, 1000);
//   };

//   return (
//     <div className={`${styles.dashboardContainer} ${darkMode ? styles.darkMode : ""}`}>
//       {/* ─── SIDEBAR ─────────────────────────────────────────────────────────── */}
//       <aside className={`${styles.sidebar} ${sidebarOpen ? styles.open : styles.closed}`}>
//         <div className={styles.sidebarHeader}>
//           <div className={styles.logo}>
//             <span className={styles.logoEmoji}>💜</span>
//             {sidebarOpen && <span className={styles.logoText}>Saathy</span>}
//           </div>
//           <button
//             className={styles.toggleBtn}
//             onClick={() => setSidebarOpen(!sidebarOpen)}
//             aria-label="Toggle sidebar"
//           >
//             {sidebarOpen ? "◀" : "▶"}
//           </button>
//         </div>

//         <nav className={styles.sidebarNav}>
//           <div className={styles.navSection}>
//             <span className={styles.navLabel}>{sidebarOpen && "OVERVIEW"}</span>
//             <a href="#dashboard" className={`${styles.navItem} ${styles.active}`}>
//               <span className={styles.navIcon}>📊</span>
//               {sidebarOpen && <span>Dashboard</span>}
//             </a>
//             <a href="#journals" className={styles.navItem}>
//               <span className={styles.navIcon}>📔</span>
//               {sidebarOpen && <span>Journals</span>}
//             </a>
//           </div>

//           <div className={styles.navSection}>
//             <span className={styles.navLabel}>{sidebarOpen && "SUPPORT"}</span>
//             <a href="#saathy-ai" className={styles.navItem}>
//               <span className={styles.navIcon}>🤖</span>
//               {sidebarOpen && <span>Saathy AI</span>}
//             </a>
//             <a href="#listeners" className={styles.navItem}>
//               <span className={styles.navIcon}>👂</span>
//               {sidebarOpen && <span>Listeners</span>}
//             </a>
//             <a href="#circles" className={styles.navItem}>
//               <span className={styles.navIcon}>👥</span>
//               {sidebarOpen && <span>Community</span>}
//             </a>
//             <a href="#calls" className={styles.navItem}>
//               <span className={styles.navIcon}>☎️</span>
//               {sidebarOpen && <span>Expert Calls</span>}
//             </a>
//           </div>

//           <div className={styles.navSection}>
//             <span className={styles.navLabel}>{sidebarOpen && "GROWTH"}</span>
//             <a href="#memory" className={styles.navItem}>
//               <span className={styles.navIcon}>💭</span>
//               {sidebarOpen && <span>Memory</span>}
//             </a>
//             <a href="#journey" className={styles.navItem}>
//               <span className={styles.navIcon}>🌱</span>
//               {sidebarOpen && <span>Growth Path</span>}
//             </a>
//           </div>
//         </nav>

//         <div className={styles.sidebarFooter}>
//           <button
//             className={styles.modeToggle}
//             onClick={() => setDarkMode(!darkMode)}
//             title={darkMode ? "Light mode" : "Dark mode"}
//           >
//             {darkMode ? "☀️" : "🌙"}
//           </button>
//           {sidebarOpen && (
//             <button
//               className={styles.logoutBtn}
//               onClick={() => navigate("/login")}
//             >
//               Logout
//             </button>
//           )}
//         </div>
//       </aside>

//       {/* ─── MAIN CONTENT ──────────────────────────────────────────────────────── */}
//       <main className={styles.mainContent}>
//         {/* ─── TOP NAV ───────────────────────────────────────────────────────── */}
//         <header className={styles.topNav}>
//           <div className={styles.searchContainer}>
//             <input
//               type="text"
//               placeholder="Search circles, journals, experts..."
//               className={styles.searchInput}
//             />
//             <span className={styles.searchIcon}>🔍</span>
//           </div>

//           <div className={styles.topNavRight}>
//             <button className={styles.notificationBtn} aria-label="Notifications">
//               🔔
//               <span className={styles.badge}>3</span>
//             </button>
//             <div className={styles.userProfile}>
//               <img
//                 src="https://via.placeholder.com/40"
//                 alt="User avatar"
//                 className={styles.avatar}
//               />
//               <span className={styles.userName}>Aanya Sharma</span>
//             </div>
//           </div>
//         </header>

//         {/* ─── CONTENT GRID ──────────────────────────────────────────────────── */}
//         <section className={styles.contentGrid}>
//           {/* ─── LEFT COLUMN: GREETING & CHECK-IN ─────────────────────────── */}
//           <div className={styles.leftCol}>
//             {/* GREETING CARD */}
//             <div className={styles.greetingCard}>
//               <div className={styles.greetingContent}>
//                 <h1 className={styles.greetingTitle}>
//                   Good morning, <em>Aanya</em>.
//                 </h1>
//                 <p className={styles.greetingSubtitle}>How is your heart today?</p>
//                 <p className={styles.greetingDesc}>
//                   A gentle check-in helps us tune the day around you. Pick a feeling — Saathy will meet you there.
//                 </p>
//               </div>

//               <div className={styles.moodSelector}>
//                 {MOOD_OPTIONS.map((mood) => (
//                   <button
//                     key={mood.label}
//                     className={`${styles.moodBtn} ${
//                       currentMood === mood.label ? styles.selected : ""
//                     }`}
//                     onClick={() => handleMoodSelect(mood.label)}
//                     style={
//                       currentMood === mood.label ? { borderColor: mood.color } : {}
//                     }
//                     title={mood.label}
//                   >
//                     <span className={styles.moodEmoji}>{mood.emoji}</span>
//                     <span className={styles.moodLabel}>{mood.label}</span>
//                   </button>
//                 ))}
//               </div>

//               <div className={styles.actionButtons}>
//                 <button className={`${styles.actionBtn} ${styles.primary}`}>
//                   Talk to Saathy AI
//                 </button>
//                 <button className={`${styles.actionBtn} ${styles.secondary}`}>
//                   Join a Circle
//                 </button>
//                 <button className={`${styles.actionBtn} ${styles.secondary}`}>
//                   Write Journal
//                 </button>
//               </div>
//             </div>

//             {/* AI CHAT WIDGET */}
//             <div className={styles.chatWidget}>
//               <div className={styles.chatHeader}>
//                 <h3>Saathy AI Companion</h3>
//                 <span className={styles.chatStatus}>Always here for you</span>
//               </div>

//               <div className={styles.chatMessages}>
//                 {messages.map((msg) => (
//                   <div
//                     key={msg.id}
//                     className={`${styles.chatMessage} ${styles[msg.role]}`}
//                   >
//                     <div className={styles.messageBubble}>{msg.text}</div>
//                     <span className={styles.messageTime}>
//                       {msg.timestamp.toLocaleTimeString([], {
//                         hour: "2-digit",
//                         minute: "2-digit",
//                       })}
//                     </span>
//                   </div>
//                 ))}
//                 <div ref={messagesEndRef} />
//               </div>

//               <div className={styles.chatInput}>
//                 <textarea
//                   value={inputValue}
//                   onChange={(e) => setInputValue(e.target.value)}
//                   onKeyPress={(e) => {
//                     if (e.key === "Enter" && !e.shiftKey) {
//                       e.preventDefault();
//                       handleSendMessage();
//                     }
//                   }}
//                   placeholder="Tell me what's on your mind..."
//                   className={styles.inputField}
//                   rows={1}
//                 />
//                 <button
//                   onClick={handleSendMessage}
//                   className={styles.sendBtn}
//                   disabled={!inputValue.trim()}
//                 >
//                   →
//                 </button>
//               </div>
//             </div>
//           </div>

//           {/* ─── RIGHT COLUMN: WIDGETS ────────────────────────────────────── */}
//           <div className={styles.rightCol}>
//             {/* WELLNESS SCORE CARD */}
//             <div className={styles.wellnessCard}>
//               <div className={styles.scoreHeader}>
//                 <h3>Weekly Wellness</h3>
//                 <span className={styles.scoreBadge}>📈 {wellnessScore}%</span>
//               </div>

//               <svg className={styles.scoreCircle} viewBox="0 0 120 120">
//                 <circle cx="60" cy="60" r="50" className={styles.scoreBackground} />
//                 <circle
//                   cx="60"
//                   cy="60"
//                   r="50"
//                   className={styles.scoreProgress}
//                   style={{
//                     strokeDashoffset: 314 - (wellnessScore / 100) * 314,
//                   }}
//                 />
//                 <text x="60" y="65" className={styles.scoreText}>
//                   {wellnessScore}%
//                 </text>
//               </svg>

//               <p className={styles.scoreDesc}>
//                 You're feeling better, one step at a time.
//               </p>

//               <div className={styles.metricsGrid}>
//                 <div className={styles.metric}>
//                   <span>📊</span>
//                   <span>Journaled</span>
//                   <strong>5 days</strong>
//                 </div>
//                 <div className={styles.metric}>
//                   <span>💬</span>
//                   <span>Shared</span>
//                   <strong>3 circles</strong>
//                 </div>
//                 <div className={styles.metric}>
//                   <span>☎️</span>
//                   <span>Talked</span>
//                   <strong>2 experts</strong>
//                 </div>
//               </div>
//             </div>

//             {/* GROWTH JOURNEY CARD */}
//             <div className={styles.growthCard}>
//               <h3>Showing Up Path</h3>
//               <div className={styles.progressBar}>
//                 <div className={styles.progressFill} style={{ width: "65%" }} />
//               </div>
//               <p className={styles.progressLabel}>65% Complete</p>

//               <div className={styles.milestones}>
//                 <div className={styles.milestone}>
//                   <span className={styles.milestoneEmoji}>✓</span>
//                   <span>First check-in</span>
//                 </div>
//                 <div className={styles.milestone}>
//                   <span className={styles.milestoneEmoji}>✓</span>
//                   <span>Wrote 5 journals</span>
//                 </div>
//                 <div className={styles.milestone}>
//                   <span className={styles.milestoneEmoji}>●</span>
//                   <span>Joined circle</span>
//                 </div>
//                 <div className={styles.milestone}>
//                   <span className={styles.milestoneEmoji}>○</span>
//                   <span>Call with expert</span>
//                 </div>
//               </div>
//             </div>

//             {/* QUICK STATS */}
//             <div className={styles.statsCard}>
//               <h3>This Month</h3>
//               <div className={styles.statRow}>
//                 <span>Entries written</span>
//                 <strong>12</strong>
//               </div>
//               <div className={styles.statRow}>
//                 <span>Time journaling</span>
//                 <strong>4h 35m</strong>
//               </div>
//               <div className={styles.statRow}>
//                 <span>Circle moments</span>
//                 <strong>8</strong>
//               </div>
//             </div>
//           </div>
//         </section>

//         {/* ─── SUPPORT SECTIONS ────────────────────────────────────────────── */}
//         <section className={styles.supportSection}>
//           <h2 className={styles.sectionTitle}>Core Support</h2>

//           <div className={styles.supportsGrid}>
//             {/* EXPERT SUPPORT CARDS */}
//             <div className={styles.expertCard}>
//               <div className={styles.cardHeader}>
//                 <h3>
//                   <span className={styles.cardIcon}>👩‍⚕️</span>Expert Support
//                 </h3>
//               </div>

//               <div className={styles.expertList}>
//                 {EXPERT_SUPPORT.slice(0, 2).map((expert) => (
//                   <div key={expert.id} className={styles.expertItem}>
//                     <span className={styles.expertAvatar}>{expert.avatar}</span>
//                     <div className={styles.expertInfo}>
//                       <h4>{expert.name}</h4>
//                       <p className={styles.expertTitle}>{expert.title}</p>
//                       <p className={styles.nextSession}>{expert.nextSession}</p>
//                     </div>
//                   </div>
//                 ))}
//               </div>

//               <button className={styles.browseBtn}>Browse all experts →</button>
//             </div>

//             {/* COMMUNITY CIRCLES */}
//             <div className={styles.communityCard}>
//               <div className={styles.cardHeader}>
//                 <h3>
//                   <span className={styles.cardIcon}>👥</span>Community Circles
//                 </h3>
//               </div>

//               <div className={styles.circleItem}>
//                 <span className={styles.circleEmoji}>🌅</span>
//                 <div className={styles.circleInfo}>
//                   <h4>Anxiety & Breath</h4>
//                   <p>Tuesday Quiet Hour · Sun 8:00 AM</p>
//                   <span className={styles.memberCount}>12 members</span>
//                 </div>
//               </div>

//               <div className={styles.circleItem}>
//                 <span className={styles.circleEmoji}>🚶</span>
//                 <div className={styles.circleInfo}>
//                   <h4>Bangalore Walk & Talk</h4>
//                   <p>Sunday · 5:30 AM</p>
//                   <span className={styles.memberCount}>8 members</span>
//                 </div>
//               </div>

//               <button className={styles.browseBtn}>Discover circles →</button>
//             </div>

//             {/* JOURNAL INSIGHTS */}
//             <div className={styles.journalCard}>
//               <div className={styles.cardHeader}>
//                 <h3>
//                   <span className={styles.cardIcon}>📔</span>Journal Insights
//                 </h3>
//               </div>

//               <div className={styles.journalEntry}>
//                 <span className={styles.entryEmoji}>🌟</span>
//                 <div className={styles.entryInfo}>
//                   <h4>A small win at work</h4>
//                   <p>Wednesday · 4:35 PM</p>
//                 </div>
//               </div>

//               <div className={styles.journalEntry}>
//                 <span className={styles.entryEmoji}>💔</span>
//                 <div className={styles.entryInfo}>
//                   <h4>Letter I won't send</h4>
//                   <p>Tuesday · 8:22 PM</p>
//                 </div>
//               </div>

//               <button className={styles.browseBtn}>Write new entry →</button>
//             </div>
//           </div>
//         </section>

//         {/* ─── ACTIVITY TIMELINE ───────────────────────────────────────────── */}
//         <section className={styles.activitySection}>
//           <div className={styles.activityHeader}>
//             <h2>Your Recent Activity</h2>
//             <span className={styles.viewAll}>See all →</span>
//           </div>

//           <div className={styles.timeline}>
//             {ACTIVITY_FEED.map((item) => (
//               <div key={item.id} className={styles.timelineItem}>
//                 <span className={styles.timelineIcon}>{item.icon}</span>
//                 <div className={styles.timelineContent}>
//                   <h4>{item.title}</h4>
//                   <p>{item.subtitle}</p>
//                   <span className={styles.timelineTime}>{item.time}</span>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </section>
//       </main>
//     </div>
//   );
// };

// export default Dashboard;
import { useState, useEffect, useRef } from "react";

const MOOD_OPTIONS = [
  { emoji: "🌟", label: "Glowing", color: "#FCD34D", bg: "#FFFBEB" },
  { emoji: "🌿", label: "Calm", color: "#6EE7B7", bg: "#ECFDF5" },
  { emoji: "☁️", label: "Okay", color: "#93C5FD", bg: "#EFF6FF" },
  { emoji: "🌧", label: "Low", color: "#C4B5FD", bg: "#F5F3FF" },
  { emoji: "🌑", label: "Heavy", color: "#F87171", bg: "#FEF2F2" },
];

const EXPERTS = [
  { id: 1, initials: "RM", name: "Dr. Riya Menon", title: "Clinical Psychologist", badge: "Featured", session: "Mon · 9 Jun, 8:30 PM", color: "#7C3AED", bg: "#EDE9FE" },
  { id: 2, initials: "PS", name: "Priya Sharma", title: "Wellness Coach", badge: "Available", session: "Tomorrow · 3 PM", color: "#059669", bg: "#D1FAE5" },
  { id: 3, initials: "VD", name: "Vikram Das", title: "Grief Counselor", badge: "Available", session: "Wed · 6 PM", color: "#2563EB", bg: "#DBEAFE" },
];

const CIRCLES = [
  { id: 1, emoji: "🌅", name: "Anxiety & Breath", desc: "Tuesday Quiet Hour · Sun 8 AM", members: 1248, tags: ["Anxiety", "Burnout", "Grief"] },
  { id: 2, emoji: "🎙", name: "Community Rooms", desc: "Sunday Quiet Hour · Sun 9 AM", members: 3892, tags: ["Open mic", "Listening", "Reflection"] },
  { id: 3, emoji: "📍", name: "Offline Circles", desc: "Bangalore Walk & Talk · Sat 8:30 AM", members: 412, tags: ["Mumbai", "Delhi", "Bengaluru"] },
];

const ACTIVITY = [
  { id: 1, icon: "📔", color: "#7C3AED", bg: "#EDE9FE", title: "Journal · A small win at work", sub: "Yesterday · 4:42 PM" },
  { id: 2, icon: "👥", color: "#2563EB", bg: "#DBEAFE", title: "Joined circle · Quiet mornings", sub: "Yesterday · 7:10 AM" },
  { id: 3, icon: "🤖", color: "#059669", bg: "#D1FAE5", title: "Chat with Saathy AI · 22 min", sub: "Wed · 11:18 PM" },
  { id: 4, icon: "☎️", color: "#D97706", bg: "#FEF3C7", title: "Call with Dr. Riya Menon", sub: "Mon · 9:00 PM" },
  { id: 5, icon: "📅", color: "#DC2626", bg: "#FEE2E2", title: "RSVP'd · Sunday Quiet Hour", sub: "Mon · 2:34 PM" },
];

const JOURNAL_ENTRIES = [
  { emoji: "🌟", title: "A small win at work", time: "Wed · 4 min read", streak: "12-day streak" },
  { emoji: "💌", title: "Letter I won't send", time: "Tue · 4 min read" },
  { emoji: "🌿", title: "Three things I noticed", time: "Mon · 6 min read" },
];

const MILESTONES = [
  { done: true, label: "First check-in" },
  { done: true, label: "Wrote 5 journals" },
  { done: true, label: "Joined a circle" },
  { done: false, label: "Reach out", active: true },
  { done: false, label: "Rest" },
  { done: false, label: "Return" },
];

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400;1,600&family=Inter:wght@300;400;500;600&display=swap');

  * { margin:0; padding:0; box-sizing:border-box; }

  :root {
    --primary: #7C3AED;
    --primary-light: #A78BFA;
    --primary-pale: #EDE9FE;
    --bg: #F5F3FF;
    --surface: #FFFFFF;
    --border: #E5E0FA;
    --text: #1F1635;
    --muted: #6B7280;
    --radius: 16px;
    --radius-sm: 10px;
    --shadow: 0 2px 12px rgba(124,58,237,0.08);
    --shadow-hover: 0 8px 32px rgba(124,58,237,0.18);
  }

  body { background: var(--bg); font-family: 'Inter', sans-serif; color: var(--text); }

  .dash { display:flex; min-height:100vh; }

  /* SIDEBAR */
  .sidebar {
    width: 220px; min-width: 220px; background: var(--surface);
    border-right: 1px solid var(--border); display:flex; flex-direction:column;
    padding: 24px 16px; position:sticky; top:0; height:100vh; overflow-y:auto;
    transition: all 0.3s ease;
  }
  .logo { display:flex; align-items:center; gap:8px; margin-bottom:28px; }
  .logo-icon { width:32px; height:32px; background: var(--primary); border-radius:10px;
    display:flex; align-items:center; justify-content:center; color:white; font-size:16px; }
  .logo-text { font-family:'Fraunces',serif; font-size:20px; font-weight:700; color:var(--primary); }
  .logo-sub { font-size:9px; color:var(--muted); text-transform:uppercase; letter-spacing:1px; margin-left:1px; }

  .nav-section { margin-bottom:20px; }
  .nav-label { font-size:10px; font-weight:600; text-transform:uppercase; letter-spacing:1.2px;
    color:var(--muted); padding:0 10px; margin-bottom:4px; display:block; }
  .nav-item { display:flex; align-items:center; gap:10px; padding:8px 10px; border-radius:var(--radius-sm);
    color:var(--muted); text-decoration:none; font-size:13px; cursor:pointer; transition:all 0.2s;
    border:none; background:none; width:100%; text-align:left; }
  .nav-item:hover { background:var(--primary-pale); color:var(--primary); transform:translateX(2px); }
  .nav-item.active { background:var(--primary-pale); color:var(--primary); font-weight:600; }
  .nav-dot { width:6px; height:6px; background:var(--primary); border-radius:50%; margin-left:auto; }

  .sidebar-footer { margin-top:auto; padding-top:16px; border-top:1px solid var(--border); }
  .user-chip { display:flex; align-items:center; gap:10px; padding:10px; border-radius:var(--radius-sm);
    background:var(--primary-pale); }
  .user-av { width:32px; height:32px; border-radius:50%; background:var(--primary);
    display:flex; align-items:center; justify-content:center; color:white; font-size:12px; font-weight:600; }
  .user-name { font-size:12px; font-weight:600; color:var(--primary); }
  .user-streak { font-size:10px; color:var(--muted); }

  /* MAIN */
  .main { flex:1; overflow-y:auto; }

  /* TOPNAV */
  .topnav { display:flex; align-items:center; gap:16px; padding:16px 32px;
    background:var(--surface); border-bottom:1px solid var(--border); position:sticky; top:0; z-index:50; }
  .search-wrap { position:relative; flex:1; max-width:380px; }
  .search-input { width:100%; padding:9px 16px 9px 36px; border:1.5px solid var(--border);
    border-radius:30px; background:var(--bg); font-size:13px; color:var(--text);
    transition:all 0.2s; outline:none; font-family:'Inter',sans-serif; }
  .search-input:focus { border-color:var(--primary); box-shadow:0 0 0 3px rgba(124,58,237,0.1); }
  .search-icon { position:absolute; left:12px; top:50%; transform:translateY(-50%); font-size:14px; }
  .topnav-right { display:flex; align-items:center; gap:12px; margin-left:auto; }
  .notif-btn { position:relative; background:none; border:none; cursor:pointer; font-size:18px;
    width:36px; height:36px; display:flex; align-items:center; justify-content:center;
    border-radius:10px; transition:all 0.2s; }
  .notif-btn:hover { background:var(--primary-pale); transform:scale(1.1); }
  .notif-badge { position:absolute; top:2px; right:2px; width:16px; height:16px;
    background:#EF4444; color:white; border-radius:50%; font-size:9px; font-weight:700;
    display:flex; align-items:center; justify-content:center; border:2px solid white; }
  .topnav-user { display:flex; align-items:center; gap:8px; }
  .topnav-av { width:36px; height:36px; border-radius:50%; background:var(--primary);
    display:flex; align-items:center; justify-content:center; color:white; font-size:13px; font-weight:600; }
  .topnav-name { font-size:13px; font-weight:600; color:var(--text); }
  .topnav-day { font-size:11px; color:var(--muted); }

  /* CONTENT */
  .content { padding:28px 32px; display:flex; flex-direction:column; gap:28px; }

  /* HERO GRID */
  .hero-grid { display:grid; grid-template-columns:1.4fr 1fr; gap:20px; align-items:start; }

  /* GREETING CARD */
  .greeting-card {
    background: linear-gradient(135deg, #FFFFFF 0%, #F5F3FF 100%);
    border:1px solid var(--border); border-radius:var(--radius); padding:32px;
    box-shadow: var(--shadow); position:relative; overflow:hidden;
    animation: fadeUp 0.6s ease both;
  }
  .greeting-card::before {
    content:''; position:absolute; top:-40px; right:-40px; width:180px; height:180px;
    background:radial-gradient(circle, rgba(167,139,250,0.15) 0%, transparent 70%);
    border-radius:50%; pointer-events:none;
  }
  .greeting-meta { font-size:11px; color:var(--muted); margin-bottom:12px; display:flex; align-items:center; gap:6px; }
  .greeting-meta span { background:var(--primary-pale); color:var(--primary); padding:2px 8px; border-radius:20px; font-weight:500; }
  .greeting-title { font-family:'Fraunces',serif; font-size:clamp(26px,3.5vw,38px); font-weight:400;
    line-height:1.15; margin-bottom:8px; color:var(--text); }
  .greeting-title em { color:var(--primary); font-style:italic; }
  .greeting-sub { font-size:15px; color:var(--text); font-weight:500; margin-bottom:6px; }
  .greeting-desc { font-size:13px; color:var(--muted); line-height:1.6; margin-bottom:24px; max-width:360px; }

  .mood-row { display:flex; gap:8px; margin-bottom:20px; flex-wrap:wrap; }
  .mood-btn {
    display:flex; flex-direction:column; align-items:center; gap:4px; padding:10px 14px;
    border-radius:var(--radius-sm); border:1.5px solid var(--border); background:var(--surface);
    cursor:pointer; transition:all 0.25s cubic-bezier(0.34,1.56,0.64,1); font-size:11px; color:var(--muted);
    transform-style:preserve-3d;
  }
  .mood-btn:hover { transform:translateY(-4px) scale(1.05); box-shadow:var(--shadow-hover); }
  .mood-btn.selected { border-color:var(--primary); background:var(--primary-pale); color:var(--primary); font-weight:600;
    transform:translateY(-3px) scale(1.04); box-shadow:0 6px 20px rgba(124,58,237,0.2); }
  .mood-emoji { font-size:22px; }

  .cta-row { display:flex; gap:10px; flex-wrap:wrap; }
  .cta-btn { padding:10px 18px; border-radius:30px; font-size:13px; font-weight:600;
    cursor:pointer; transition:all 0.25s cubic-bezier(0.34,1.56,0.64,1); border:none;
    display:flex; align-items:center; gap:6px; font-family:'Inter',sans-serif; }
  .cta-primary { background:var(--primary); color:white; }
  .cta-primary:hover { background:#6D28D9; transform:translateY(-2px) scale(1.03); box-shadow:0 6px 20px rgba(124,58,237,0.3); }
  .cta-secondary { background:var(--surface); color:var(--text); border:1.5px solid var(--border); }
  .cta-secondary:hover { background:var(--primary-pale); color:var(--primary); border-color:var(--primary);
    transform:translateY(-2px); box-shadow:var(--shadow); }

  /* WELLNESS CARD */
  .wellness-card {
    background:var(--surface); border:1px solid var(--border); border-radius:var(--radius);
    padding:24px; box-shadow:var(--shadow); animation:fadeUp 0.6s 0.1s ease both;
  }
  .wellness-header { display:flex; justify-content:space-between; align-items:center; margin-bottom:16px; }
  .wellness-label { font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:1px; color:var(--muted); }
  .wellness-badge { background:#ECFDF5; color:#059669; font-size:12px; font-weight:600; padding:3px 10px; border-radius:20px; }
  .wellness-score-wrap { display:flex; align-items:center; gap:16px; margin-bottom:12px; }
  .score-big { font-family:'Fraunces',serif; font-size:52px; font-weight:700; color:var(--text); line-height:1; }
  .score-denom { font-size:13px; color:var(--muted); }
  .score-note { font-size:12px; color:var(--muted); margin-top:2px; }
  .wellness-bars { display:flex; gap:6px; margin-bottom:12px; }
  .wellness-bar { flex:1; height:40px; border-radius:8px; background:var(--primary-pale);
    position:relative; overflow:hidden; }
  .wellness-bar-fill { position:absolute; bottom:0; left:0; right:0; background:var(--primary);
    border-radius:8px; transition:height 1s ease; }
  .wellness-bar.active .wellness-bar-fill { background:var(--primary); }
  .saathy-notice { display:flex; gap:10px; background:var(--primary-pale); border-radius:var(--radius-sm); padding:12px; margin-top:12px; }
  .notice-icon { font-size:18px; }
  .notice-label { font-size:10px; font-weight:700; color:var(--primary); text-transform:uppercase; letter-spacing:0.5px; }
  .notice-text { font-size:12px; color:var(--muted); margin-top:2px; }

  /* SECTION TITLE */
  .section-eyebrow { font-size:10px; font-weight:700; text-transform:uppercase; letter-spacing:1.2px; color:var(--muted); margin-bottom:6px; }
  .section-title { font-family:'Fraunces',serif; font-size:26px; font-weight:400; color:var(--text); margin-bottom:20px; }

  /* SUPPORT GRID */
  .support-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:16px; }
  .support-card {
    background:var(--surface); border:1px solid var(--border); border-radius:var(--radius); padding:20px;
    cursor:pointer; transition:all 0.3s cubic-bezier(0.34,1.56,0.64,1); transform-style:preserve-3d;
    box-shadow:var(--shadow);
  }
  .support-card:hover { transform:translateY(-6px) rotateX(3deg) rotateY(-2deg); box-shadow:var(--shadow-hover); border-color:var(--primary-light); }
  .support-icon { width:44px; height:44px; border-radius:12px; display:flex; align-items:center; justify-content:center; font-size:20px; margin-bottom:14px; }
  .support-name { font-size:15px; font-weight:600; color:var(--text); margin-bottom:6px; }
  .support-desc { font-size:12px; color:var(--muted); line-height:1.5; margin-bottom:14px; }
  .support-meta { display:flex; align-items:center; gap:6px; }
  .support-status { width:7px; height:7px; border-radius:50%; background:#10B981; animation:pulse 2s infinite; }
  .support-meta-text { font-size:11px; color:var(--muted); }
  .support-cta { font-size:12px; color:var(--primary); font-weight:600; cursor:pointer; margin-top:auto; padding-top:10px; }

  /* COMMUNITY */
  .community-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:16px; }
  .community-card {
    background:var(--surface); border:1px solid var(--border); border-radius:var(--radius); padding:20px;
    cursor:pointer; transition:all 0.3s cubic-bezier(0.34,1.56,0.64,1); box-shadow:var(--shadow);
  }
  .community-card:hover { transform:translateY(-5px); box-shadow:var(--shadow-hover); border-color:var(--primary-light); }
  .community-count { font-family:'Fraunces',serif; font-size:28px; font-weight:700; color:var(--text); }
  .community-count-label { font-size:10px; color:var(--muted); text-transform:uppercase; letter-spacing:1px; }
  .community-name { font-size:15px; font-weight:600; color:var(--text); margin:10px 0 4px; }
  .community-desc { font-size:12px; color:var(--muted); margin-bottom:10px; }
  .community-tags { display:flex; gap:6px; flex-wrap:wrap; margin-bottom:14px; }
  .tag { font-size:10px; padding:3px 8px; border-radius:20px; background:var(--primary-pale); color:var(--primary); font-weight:500; }
  .community-join { width:100%; padding:10px; border-radius:var(--radius-sm); border:none;
    background:var(--primary); color:white; font-size:13px; font-weight:600; cursor:pointer;
    transition:all 0.2s; font-family:'Inter',sans-serif; }
  .community-join:hover { background:#6D28D9; transform:scale(1.02); }

  /* PERSONAL GROWTH GRID */
  .growth-grid { display:grid; grid-template-columns:2fr 1fr 1fr; gap:16px; }

  /* JOURNAL CARD */
  .journal-card {
    background:var(--surface); border:1px solid var(--border); border-radius:var(--radius); padding:20px;
    box-shadow:var(--shadow); cursor:pointer; transition:all 0.3s ease;
  }
  .journal-card:hover { box-shadow:var(--shadow-hover); transform:translateY(-3px); }
  .journal-card-header { display:flex; justify-content:space-between; align-items:center; margin-bottom:16px; }
  .journal-title-row { display:flex; align-items:center; gap:8px; }
  .journal-icon { font-size:18px; }
  .journal-name { font-size:15px; font-weight:600; color:var(--text); }
  .journal-entries-count { font-size:12px; color:var(--muted); }
  .streak-badge { background:#FEF3C7; color:#D97706; font-size:11px; font-weight:600; padding:3px 8px; border-radius:20px; display:flex; align-items:center; gap:4px; }
  .journal-entry-row { display:flex; align-items:center; gap:12px; padding:10px 0; border-bottom:1px solid var(--border); cursor:pointer; transition:all 0.2s; }
  .journal-entry-row:last-child { border-bottom:none; }
  .journal-entry-row:hover { padding-left:4px; }
  .journal-entry-emoji { font-size:20px; width:32px; text-align:center; }
  .journal-entry-title { font-size:13px; font-weight:500; color:var(--text); }
  .journal-entry-time { font-size:11px; color:var(--muted); }
  .journal-write-btn { width:100%; margin-top:14px; padding:11px; border-radius:var(--radius-sm);
    border:none; background:var(--text); color:white; font-size:13px; font-weight:600;
    cursor:pointer; transition:all 0.2s; font-family:'Inter',sans-serif; }
  .journal-write-btn:hover { background:var(--primary); transform:scale(1.01); }

  /* DAILY PULSE */
  .pulse-card {
    background:var(--surface); border:1px solid var(--border); border-radius:var(--radius); padding:20px;
    box-shadow:var(--shadow); cursor:pointer; transition:all 0.3s ease; position:relative; overflow:hidden;
  }
  .pulse-card:hover { box-shadow:var(--shadow-hover); transform:translateY(-3px); }
  .pulse-card-label { font-size:10px; font-weight:700; text-transform:uppercase; letter-spacing:1px; color:var(--muted); margin-bottom:8px; }
  .pulse-name { font-size:15px; font-weight:600; color:var(--text); margin-bottom:12px; }
  .pulse-score-big { font-family:'Fraunces',serif; font-size:42px; font-weight:700; color:var(--text); line-height:1; }
  .pulse-score-denom { font-size:14px; color:var(--muted); }
  .pulse-note { font-size:11px; color:var(--muted); margin-top:4px; }
  .pulse-bar-wrap { margin-top:12px; }
  .pulse-bar-bg { height:5px; background:var(--border); border-radius:10px; overflow:hidden; }
  .pulse-bar-fill { height:100%; background:var(--primary); border-radius:10px; transition:width 1s ease; }
  .pulse-arrow { position:absolute; top:20px; right:20px; font-size:14px; color:var(--primary); opacity:0.5; }

  /* MEMORY */
  .memory-card {
    background:linear-gradient(135deg,#EDE9FE,#DDD6FE); border:1px solid #C4B5FD;
    border-radius:var(--radius); padding:20px; box-shadow:var(--shadow);
    cursor:pointer; transition:all 0.3s ease; position:relative; overflow:hidden;
  }
  .memory-card:hover { box-shadow:var(--shadow-hover); transform:translateY(-3px); }
  .memory-label { font-size:10px; font-weight:700; text-transform:uppercase; letter-spacing:1px; color:#7C3AED; margin-bottom:8px; }
  .memory-name { font-size:15px; font-weight:600; color:var(--text); margin-bottom:12px; }
  .memory-count { font-family:'Fraunces',serif; font-size:42px; font-weight:700; color:var(--text); line-height:1; }
  .memory-count-label { font-size:12px; color:#6D28D9; }
  .memory-bar-wrap { margin-top:12px; }

  /* SHOWING UP PATH */
  .path-section { margin-top:16px; background:var(--surface); border:1px solid var(--border); border-radius:var(--radius); padding:20px; box-shadow:var(--shadow); }
  .path-header { display:flex; justify-content:space-between; align-items:center; margin-bottom:8px; }
  .path-title { font-size:15px; font-weight:600; color:var(--text); }
  .path-percent { font-size:13px; color:var(--primary); font-weight:600; }
  .path-note { font-size:12px; color:var(--muted); margin-bottom:14px; }
  .path-progress { height:6px; background:var(--border); border-radius:10px; overflow:hidden; margin-bottom:20px; }
  .path-fill { height:100%; background:linear-gradient(90deg,var(--primary),var(--primary-light)); border-radius:10px; transition:width 1.2s ease; }
  .milestones-row { display:flex; gap:12px; align-items:center; }
  .milestone-step { display:flex; flex-direction:column; align-items:center; gap:6px; flex:1; }
  .milestone-dot { width:28px; height:28px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:12px; font-weight:700; transition:all 0.3s; }
  .milestone-dot.done { background:var(--primary); color:white; }
  .milestone-dot.active { background:var(--primary-pale); color:var(--primary); border:2px solid var(--primary); animation:ring 2s infinite; }
  .milestone-dot.pending { background:var(--border); color:var(--muted); }
  .milestone-label { font-size:10px; color:var(--muted); text-align:center; }
  .milestone-line { flex:1; height:2px; background:var(--border); margin-bottom:14px; }
  .milestone-line.done { background:var(--primary); }

  /* PROFESSIONAL SUPPORT */
  .pro-grid { display:grid; grid-template-columns:1.2fr 1.2fr 1fr; gap:16px; }
  .anchor-card { background:var(--surface); border:1px solid var(--border); border-radius:var(--radius); padding:20px; box-shadow:var(--shadow); }
  .anchor-header { display:flex; justify-content:space-between; margin-bottom:14px; }
  .anchor-label { font-size:11px; font-weight:700; color:var(--text); text-transform:uppercase; letter-spacing:0.5px; }
  .anchor-desc { font-size:11px; color:var(--muted); }
  .expert-row { display:flex; align-items:center; gap:10px; background:var(--bg); border-radius:var(--radius-sm); padding:10px; margin-bottom:10px; transition:all 0.2s; cursor:pointer; }
  .expert-row:hover { background:var(--primary-pale); transform:translateX(3px); }
  .expert-av { width:36px; height:36px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:12px; font-weight:700; }
  .expert-name { font-size:13px; font-weight:600; color:var(--text); }
  .expert-spec { font-size:11px; color:var(--muted); }
  .expert-today { background:#ECFDF5; color:#059669; font-size:10px; font-weight:700; padding:2px 8px; border-radius:20px; margin-left:auto; }
  .expert-tomorrow { background:#FEF3C7; color:#D97706; font-size:10px; font-weight:700; padding:2px 8px; border-radius:20px; margin-left:auto; }
  .anchor-open-btn { width:100%; padding:10px; border-radius:var(--radius-sm); border:none;
    background:var(--text); color:white; font-size:13px; font-weight:600; cursor:pointer;
    transition:all 0.2s; font-family:'Inter',sans-serif; margin-top:4px; }
  .anchor-open-btn:hover { background:var(--primary); }

  .experts-card { background:var(--surface); border:1px solid var(--border); border-radius:var(--radius); padding:20px; box-shadow:var(--shadow); }
  .safety-card { background:#FFFBEB; border:1px solid #FDE68A; border-radius:var(--radius); padding:20px; box-shadow:var(--shadow); }
  .safety-icon { font-size:24px; margin-bottom:10px; }
  .safety-title { font-size:15px; font-weight:600; color:var(--text); margin-bottom:6px; }
  .safety-desc { font-size:12px; color:var(--muted); line-height:1.5; margin-bottom:14px; }
  .safety-btns { display:flex; gap:8px; }
  .safety-reach { flex:1; padding:9px; border-radius:var(--radius-sm); border:none; background:var(--text); color:white; font-size:12px; font-weight:600; cursor:pointer; font-family:'Inter',sans-serif; transition:all 0.2s; }
  .safety-reach:hover { background:var(--primary); }
  .safety-plan { flex:1; padding:9px; border-radius:var(--radius-sm); border:1.5px solid var(--border); background:transparent; color:var(--text); font-size:12px; font-weight:600; cursor:pointer; font-family:'Inter',sans-serif; transition:all 0.2s; }
  .safety-plan:hover { border-color:var(--primary); color:var(--primary); }

  /* INSIGHTS */
  .insights-grid { display:grid; grid-template-columns:1fr 1fr; gap:16px; }
  .mood-trend-card { background:var(--surface); border:1px solid var(--border); border-radius:var(--radius); padding:20px; box-shadow:var(--shadow); }
  .trend-header { display:flex; justify-content:space-between; align-items:center; margin-bottom:6px; }
  .trend-title { font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:1px; color:var(--muted); }
  .trend-tabs { display:flex; gap:4px; }
  .trend-tab { padding:3px 8px; border-radius:20px; font-size:10px; font-weight:600; cursor:pointer; border:none; font-family:'Inter',sans-serif; }
  .trend-tab.active { background:var(--text); color:white; }
  .trend-tab:not(.active) { background:var(--border); color:var(--muted); }
  .trend-big { font-family:'Fraunces',serif; font-size:22px; font-weight:700; color:var(--text); }
  .trend-up { font-size:12px; color:#10B981; font-weight:600; }
  .chart-area { height:80px; position:relative; margin:12px 0; }
  .chart-svg { width:100%; height:100%; }
  .day-labels { display:flex; justify-content:space-between; font-size:10px; color:var(--muted); }
  .trend-bottoms { display:grid; grid-template-columns:repeat(3,1fr); gap:8px; margin-top:12px; }
  .trend-bottom-item { background:var(--bg); border-radius:var(--radius-sm); padding:8px; text-align:center; }
  .trend-bottom-label { font-size:10px; color:var(--muted); }
  .trend-bottom-val { font-size:12px; font-weight:600; color:var(--text); }
  .trend-bottom-day { font-size:11px; color:var(--muted); background:var(--primary-pale); border-radius:6px; padding:4px 8px; font-weight:500; }

  .week-went-card { background:var(--surface); border:1px solid var(--border); border-radius:var(--radius); padding:20px; box-shadow:var(--shadow); }
  .week-title { font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:1px; color:var(--muted); margin-bottom:16px; }
  .week-bars { display:flex; flex-direction:column; gap:8px; margin-bottom:16px; }
  .week-bar-row { display:flex; align-items:center; gap:10px; }
  .week-bar-label { font-size:12px; color:var(--text); width:60px; }
  .week-bar-track { flex:1; height:8px; background:var(--border); border-radius:10px; overflow:hidden; }
  .week-bar-fill { height:100%; border-radius:10px; }
  .week-bar-pct { font-size:12px; color:var(--muted); width:30px; text-align:right; }
  .saathy-reflection { background:var(--primary-pale); border-radius:var(--radius-sm); padding:12px; margin-top:12px; }
  .reflection-label { font-size:10px; font-weight:700; text-transform:uppercase; letter-spacing:0.5px; color:var(--primary); margin-bottom:6px; }
  .reflection-text { font-size:12px; color:var(--muted); line-height:1.5; }

  /* ACTIVITY + QUICK HELP */
  .bottom-grid { display:grid; grid-template-columns:1fr 1fr; gap:20px; }
  .activity-card { background:var(--surface); border:1px solid var(--border); border-radius:var(--radius); padding:20px; box-shadow:var(--shadow); }
  .activity-header { display:flex; justify-content:space-between; align-items:center; margin-bottom:16px; }
  .activity-row { display:flex; align-items:center; gap:12px; padding:10px 12px; border-radius:var(--radius-sm); cursor:pointer; transition:all 0.2s; }
  .activity-row:hover { background:var(--primary-pale); transform:translateX(3px); }
  .activity-icon { width:36px; height:36px; border-radius:10px; display:flex; align-items:center; justify-content:center; font-size:16px; flex-shrink:0; }
  .activity-title { font-size:13px; font-weight:500; color:var(--text); }
  .activity-time { font-size:11px; color:var(--muted); }
  .activity-arrow { margin-left:auto; color:var(--muted); font-size:12px; }

  .quick-help-card { background:var(--surface); border:1px solid var(--border); border-radius:var(--radius); padding:20px; box-shadow:var(--shadow); }
  .quick-help-header { margin-bottom:16px; }
  .help-item { display:flex; align-items:flex-start; gap:12px; padding:10px 0; border-bottom:1px solid var(--border); cursor:pointer; transition:all 0.2s; }
  .help-item:last-child { border-bottom:none; padding-bottom:0; }
  .help-item:hover { padding-left:4px; }
  .help-icon { width:32px; height:32px; border-radius:8px; display:flex; align-items:center; justify-content:center; font-size:14px; flex-shrink:0; }
  .help-title { font-size:13px; font-weight:500; color:var(--text); }
  .help-sub { font-size:11px; color:var(--muted); }
  .contact-support { margin-top:16px; background:var(--bg); border-radius:var(--radius-sm); padding:12px; }
  .contact-label { font-size:10px; font-weight:700; text-transform:uppercase; letter-spacing:0.5px; color:var(--muted); margin-bottom:4px; }
  .contact-email { font-size:13px; font-weight:600; color:var(--primary); }
  .contact-hours { font-size:11px; color:var(--muted); }

  /* FOOTER */
  .dash-footer { padding:16px 32px; text-align:center; font-size:11px; color:var(--muted); border-top:1px solid var(--border); background:var(--surface); }

  /* CHAT WIDGET */
  .chat-card { background:var(--surface); border:1px solid var(--border); border-radius:var(--radius); padding:20px; box-shadow:var(--shadow); margin-top:0; }
  .chat-header { display:flex; justify-content:space-between; align-items:center; margin-bottom:14px; }
  .chat-title { font-size:14px; font-weight:600; color:var(--text); }
  .chat-always { font-size:11px; color:var(--muted); background:var(--bg); padding:3px 8px; border-radius:20px; }
  .chat-messages { display:flex; flex-direction:column; gap:10px; max-height:180px; overflow-y:auto; margin-bottom:12px; }
  .msg-row { display:flex; gap:8px; }
  .msg-row.user { flex-direction:row-reverse; }
  .msg-bubble { padding:10px 14px; border-radius:14px; font-size:13px; line-height:1.5; max-width:78%; }
  .msg-ai { background:var(--primary-pale); color:var(--text); border-bottom-left-radius:4px; }
  .msg-user { background:var(--primary); color:white; border-bottom-right-radius:4px; }
  .msg-time { font-size:10px; color:var(--muted); margin-top:3px; text-align:right; }
  .chat-input-row { display:flex; gap:8px; }
  .chat-textarea { flex:1; padding:9px 14px; border:1.5px solid var(--border); border-radius:var(--radius-sm);
    font-size:13px; resize:none; outline:none; transition:all 0.2s; font-family:'Inter',sans-serif;
    background:var(--bg); color:var(--text); }
  .chat-textarea:focus { border-color:var(--primary); box-shadow:0 0 0 3px rgba(124,58,237,0.1); }
  .chat-send { width:36px; height:36px; border-radius:var(--radius-sm); border:none;
    background:var(--primary); color:white; font-size:16px; cursor:pointer; transition:all 0.2s;
    display:flex; align-items:center; justify-content:center; flex-shrink:0; }
  .chat-send:hover { background:#6D28D9; transform:scale(1.08); }
  .chat-send:disabled { background:var(--border); cursor:not-allowed; transform:none; }

  /* ANIMATIONS */
  @keyframes fadeUp {
    from { opacity:0; transform:translateY(16px); }
    to { opacity:1; transform:translateY(0); }
  }
  @keyframes pulse {
    0%,100% { box-shadow:0 0 0 0 rgba(16,185,129,0.4); }
    50% { box-shadow:0 0 0 5px rgba(16,185,129,0); }
  }
  @keyframes ring {
    0%,100% { box-shadow:0 0 0 0 rgba(124,58,237,0.4); }
    50% { box-shadow:0 0 0 5px rgba(124,58,237,0); }
  }
  @keyframes float {
    0%,100% { transform:translateY(0); }
    50% { transform:translateY(-4px); }
  }
  @keyframes shimmer {
    from { background-position:-200% 0; }
    to { background-position:200% 0; }
  }

  .card-animate { animation:fadeUp 0.5s ease both; }
  .card-animate:nth-child(1) { animation-delay:0.05s; }
  .card-animate:nth-child(2) { animation-delay:0.1s; }
  .card-animate:nth-child(3) { animation-delay:0.15s; }
  .card-animate:nth-child(4) { animation-delay:0.2s; }

  .see-all { font-size:12px; color:var(--primary); font-weight:600; cursor:pointer; }
  .see-all:hover { text-decoration:underline; }

  .browse-link { font-size:12px; color:var(--primary); font-weight:500; cursor:pointer; margin-top:8px; display:block; }
  .browse-link:hover { text-decoration:underline; }

  .divider { height:1px; background:var(--border); margin:4px 0; }
`;

const DAY_LABELS = ["M", "T", "W", "T", "F", "S", "S"];
const WEEK_BARS = [
  { label: "Journal", pct: 32, color: "#7C3AED" },
  { label: "Community", pct: 28, color: "#A78BFA" },
  { label: "Sessions", pct: 22, color: "#6D28D9" },
  { label: "AI chats", pct: 18, color: "#DDD6FE" },
];

function MoodTrendChart() {
  const pts = [30, 45, 40, 60, 55, 70, 65];
  const w = 280, h = 70;
  const maxV = 80, minV = 20;
  const coords = pts.map((v, i) => {
    const x = (i / (pts.length - 1)) * w;
    const y = h - ((v - minV) / (maxV - minV)) * h;
    return { x, y };
  });
  const d = coords.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
  const fill = `${d} L ${w} ${h} L 0 ${h} Z`;
  return (
    <svg className="chart-svg" viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none">
      <defs>
        <linearGradient id="chartGrad" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#7C3AED" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#7C3AED" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={fill} fill="url(#chartGrad)" />
      <path d={d} fill="none" stroke="#7C3AED" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      {coords.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r="3.5" fill="#7C3AED" />
      ))}
    </svg>
  );
}

export default function SaathyDashboard() {
  const [mood, setMood] = useState(null);
  const [messages, setMessages] = useState([
    { id: "1", role: "ai", text: "Good morning, Aanya. How are you feeling today? 💜", time: "8:00 AM" },
  ]);
  const [input, setInput] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [bars] = useState([55, 70, 45, 78, 65, 80, 72]);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMsg = () => {
    if (!input.trim()) return;
    const now = new Date();
    const t = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    setMessages(prev => [...prev, { id: Date.now().toString(), role: "user", text: input.trim(), time: t }]);
    setInput("");
    setTimeout(() => {
      const aiReplies = [
        "Thank you for sharing that with me. I'm here to listen 💜",
        "That takes courage to say. Tell me more about how that feels.",
        "I hear you. You're doing better than you think, one step at a time.",
      ];
      const aiT = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
      setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), role: "ai", text: aiReplies[Math.floor(Math.random() * aiReplies.length)], time: aiT }]);
    }, 1000);
  };

  return (
    <>
      <style>{css}</style>
      <div className="dash">
        {/* SIDEBAR */}
        <aside className="sidebar" style={{ width: sidebarOpen ? 220 : 72, minWidth: sidebarOpen ? 220 : 72 }}>
          <div className="logo">
            <div className="logo-icon">💜</div>
            {sidebarOpen && (
              <div>
                <div className="logo-text">Saathy</div>
                <div className="logo-sub">With you · Always</div>
              </div>
            )}
          </div>

          {[
            { label: "OVERVIEW", items: [{ icon: "📊", name: "Dashboard", active: true }, { icon: "📔", name: "Journal" }] },
            { label: "SUPPORT", items: [{ icon: "🤖", name: "Saathy AI" }, { icon: "👂", name: "Listeners" }, { icon: "💬", name: "Chat" }, { icon: "☎️", name: "Calls" }] },
            { label: "REFLECT", items: [{ icon: "📓", name: "Journal" }, { icon: "💓", name: "Daily Pulse" }, { icon: "💭", name: "Memory" }, { icon: "🌱", name: "Showing Up Path" }] },
            { label: "COMMUNITY", items: [{ icon: "👥", name: "Circles" }, { icon: "🏠", name: "Community Rooms" }, { icon: "📍", name: "Offline Circles" }] },
          ].map(sec => (
            <div className="nav-section" key={sec.label}>
              {sidebarOpen && <span className="nav-label">{sec.label}</span>}
              {sec.items.map(item => (
                <button key={item.name} className={`nav-item${item.active ? " active" : ""}`}>
                  <span>{item.icon}</span>
                  {sidebarOpen && <span>{item.name}</span>}
                  {item.active && sidebarOpen && <span className="nav-dot" />}
                </button>
              ))}
            </div>
          ))}

          <div className="sidebar-footer">
            <button className="nav-item" onClick={() => setSidebarOpen(!sidebarOpen)} style={{ marginBottom: 8 }}>
              <span>{sidebarOpen ? "◀" : "▶"}</span>
              {sidebarOpen && <span>Collapse</span>}
            </button>
            {sidebarOpen && (
              <div className="user-chip">
                <div className="user-av">AS</div>
                <div>
                  <div className="user-name">Aanya Sharma</div>
                  <div className="user-streak">Day 23 · Showing up</div>
                </div>
              </div>
            )}
          </div>
        </aside>

        {/* MAIN */}
        <main className="main">
          {/* TOPNAV */}
          <header className="topnav">
            <div className="search-wrap">
              <span className="search-icon">🔍</span>
              <input className="search-input" placeholder="Search circles, journals, experts..." />
            </div>
            <div className="topnav-right">
              <button className="notif-btn">
                🔔<span className="notif-badge">3</span>
              </button>
              <div className="topnav-user">
                <div className="topnav-av">AS</div>
                <div>
                  <div className="topnav-name">Aanya Sharma</div>
                  <div className="topnav-day">Day 23 · Showing up</div>
                </div>
              </div>
            </div>
          </header>

          <div className="content">

            {/* HERO GRID */}
            <div className="hero-grid">
              {/* GREETING */}
              <div className="greeting-card">
                <div className="greeting-meta">
                  <span>Friday morning · 5 Jun</span>
                </div>
                <h1 className="greeting-title">Good morning, <em>Aanya.</em></h1>
                <p className="greeting-sub">How is your heart today?</p>
                <p className="greeting-desc">A gentle check-in helps us tune the day around you. Pick a feeling — Saathy will meet you there.</p>

                <div className="mood-row">
                  {MOOD_OPTIONS.map(m => (
                    <button
                      key={m.label}
                      className={`mood-btn${mood === m.label ? " selected" : ""}`}
                      onClick={() => setMood(m.label)}
                      style={mood === m.label ? { borderColor: m.color, background: m.bg } : {}}
                    >
                      <span className="mood-emoji">{m.emoji}</span>
                      <span>{m.label}</span>
                    </button>
                  ))}
                </div>

                <div className="cta-row">
                  <button className="cta-btn cta-primary">🤖 Talk to Saathy AI</button>
                  <button className="cta-btn cta-secondary">👥 Join a Circle</button>
                  <button className="cta-btn cta-secondary">📔 Write Journal</button>
                  <button className="cta-btn cta-secondary">☎️ Book a Call</button>
                </div>
              </div>

              {/* WELLNESS + CHAT */}
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <div className="wellness-card">
                  <div className="wellness-header">
                    <span className="wellness-label">Weekly Wellbeing</span>
                    <span className="wellness-badge">↑ 12%</span>
                  </div>
                  <div className="wellness-score-wrap">
                    <div>
                      <span className="score-big">78</span>
                      <span className="score-denom"> / 100</span>
                      <div className="score-note">gently rising</div>
                    </div>
                    <div className="wellness-bars" style={{ flex: 1 }}>
                      {bars.map((h, i) => (
                        <div key={i} className={`wellness-bar${i === 5 ? " active" : ""}`}>
                          <div className="wellness-bar-fill" style={{ height: `${h}%`, opacity: i === 5 ? 1 : 0.45 }} />
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="saathy-notice">
                    <span className="notice-icon">💜</span>
                    <div>
                      <div className="notice-label">Saathy notices...</div>
                      <div className="notice-text">You sleep better on journaling days. Want to write tonight?</div>
                    </div>
                  </div>
                </div>

                {/* AI CHAT */}
                <div className="chat-card">
                  <div className="chat-header">
                    <span className="chat-title">Saathy AI</span>
                    <span className="chat-always">Always here for you</span>
                  </div>
                  <div className="chat-messages">
                    {messages.map(msg => (
                      <div key={msg.id} className={`msg-row${msg.role === "user" ? " user" : ""}`}>
                        <div>
                          <div className={`msg-bubble ${msg.role === "ai" ? "msg-ai" : "msg-user"}`}>{msg.text}</div>
                          <div className="msg-time">{msg.time}</div>
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                  <div className="chat-input-row">
                    <textarea
                      className="chat-textarea"
                      value={input}
                      onChange={e => setInput(e.target.value)}
                      onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMsg(); } }}
                      placeholder="Tell me what's on your mind..."
                      rows={1}
                    />
                    <button className="chat-send" onClick={sendMsg} disabled={!input.trim()}>→</button>
                  </div>
                </div>
              </div>
            </div>

            {/* CORE SUPPORT */}
            <div>
              <div className="section-eyebrow">Core Support</div>
              <div className="section-title">Pick the shape of help you need today</div>
              <div className="support-grid">
                {[
                  { icon: "🤖", bg: "#EDE9FE", color: "#7C3AED", name: "Saathy AI", desc: "A judgement-free companion for anything on your mind. Always on, always patient.", status: "Available now", cta: "Start chatting →" },
                  { icon: "👂", bg: "#DBEAFE", color: "#2563EB", name: "Saathy Listeners", desc: "Trained peer listeners ready to hold space for you over text — anonymously.", status: "12 listeners online", cta: "Find a listener →" },
                  { icon: "💬", bg: "#D1FAE5", color: "#059669", name: "Saathy Chat", desc: "Group rooms moderated with care — talk, share, and feel less alone.", status: "4 rooms active", cta: "Open chat →" },
                  { icon: "☎️", bg: "#FEF3C7", color: "#D97706", name: "Saathy Calls", desc: "Voice sessions with verified counsellors when words need a warmer wrap.", status: "Next slot: 11:30", cta: "Book a call →" },
                ].map(card => (
                  <div key={card.name} className="support-card card-animate">
                    <div className="support-icon" style={{ background: card.bg }}>{card.icon}</div>
                    <div className="support-name">{card.name}</div>
                    <div className="support-desc">{card.desc}</div>
                    <div className="support-meta">
                      <span className="support-status" style={{ background: card.color }} />
                      <span className="support-meta-text">{card.status}</span>
                    </div>
                    <div className="support-cta">{card.cta}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* COMMUNITY */}
            <div>
              <div className="section-eyebrow">Community</div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                <div className="section-title" style={{ marginBottom: 0 }}>You don't have to do this alone</div>
                <span className="see-all">Browse all →</span>
              </div>
              <div className="community-grid">
                {CIRCLES.map(c => (
                  <div key={c.id} className="community-card card-animate">
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                      <div>
                        <div className="community-count">{c.members.toLocaleString()}</div>
                        <div className="community-count-label">Active Members</div>
                      </div>
                      <span style={{ fontSize: 24 }}>{c.emoji}</span>
                    </div>
                    <div className="community-name">{c.name}</div>
                    <div className="community-desc">{c.desc}</div>
                    <div className="community-tags">
                      {c.tags.map(t => <span key={t} className="tag">{t}</span>)}
                    </div>
                    <button className="community-join">Join →</button>
                  </div>
                ))}
              </div>
            </div>

            {/* PERSONAL GROWTH */}
            <div>
              <div className="section-eyebrow">Personal Growth</div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                <div className="section-title" style={{ marginBottom: 0 }}>Your quiet practices, kept warm</div>
                <span className="see-all">View timeline →</span>
              </div>
              <div className="growth-grid">
                {/* JOURNAL */}
                <div className="journal-card">
                  <div className="journal-card-header">
                    <div className="journal-title-row">
                      <span className="journal-icon">📓</span>
                      <div>
                        <div className="journal-name">Saathy Journal</div>
                        <div className="journal-entries-count">18 entries this month</div>
                      </div>
                    </div>
                    <div className="streak-badge">🔥 12-day streak</div>
                  </div>
                  {JOURNAL_ENTRIES.map(e => (
                    <div key={e.title} className="journal-entry-row">
                      <span className="journal-entry-emoji">{e.emoji}</span>
                      <div style={{ flex: 1 }}>
                        <div className="journal-entry-title">{e.title}</div>
                        <div className="journal-entry-time">{e.time}</div>
                      </div>
                      <span style={{ color: "var(--muted)", fontSize: 12 }}>→</span>
                    </div>
                  ))}
                  <button className="journal-write-btn">Write today's entry</button>
                </div>

                {/* DAILY PULSE */}
                <div className="pulse-card">
                  <span className="pulse-arrow">→</span>
                  <div className="pulse-card-label">Daily Pulse</div>
                  <div className="pulse-name">Check-ins this week</div>
                  <div>
                    <span className="pulse-score-big">6</span>
                    <span className="pulse-score-denom">/7</span>
                  </div>
                  <div className="pulse-note">checks done this week</div>
                  <div className="pulse-bar-wrap">
                    <div className="pulse-bar-bg">
                      <div className="pulse-bar-fill" style={{ width: "86%" }} />
                    </div>
                  </div>
                </div>

                {/* MEMORY */}
                <div className="memory-card">
                  <span className="pulse-arrow" style={{ color: "#7C3AED" }}>→</span>
                  <div className="memory-label">Memory</div>
                  <div className="memory-name">Moments saved</div>
                  <div className="memory-count">48</div>
                  <div className="memory-count-label">moments saved</div>
                  <div className="memory-bar-wrap">
                    <div className="pulse-bar-bg" style={{ background: "rgba(124,58,237,0.2)" }}>
                      <div className="pulse-bar-fill" style={{ width: "60%", background: "#7C3AED" }} />
                    </div>
                  </div>
                </div>
              </div>

              {/* SHOWING UP PATH */}
              <div className="path-section" style={{ marginTop: 16 }}>
                <div className="path-header">
                  <div className="path-title">Showing Up Path</div>
                  <div className="path-percent">47% complete</div>
                </div>
                <div className="path-note">Day 36 of 80 · Reconnecting</div>
                <div className="path-progress">
                  <div className="path-fill" style={{ width: "47%" }} />
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  {MILESTONES.map((m, i) => (
                    <div key={m.label} style={{ display: "flex", alignItems: "center", flex: 1 }}>
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, flex: 1 }}>
                        <div className={`milestone-dot ${m.done ? "done" : m.active ? "active" : "pending"}`}>
                          {m.done ? "✓" : i + 1}
                        </div>
                        <div className="milestone-label">{m.label}</div>
                      </div>
                      {i < MILESTONES.length - 1 && (
                        <div style={{ height: 2, flex: 0.5, background: m.done ? "var(--primary)" : "var(--border)", marginBottom: 14 }} />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* PROFESSIONAL SUPPORT */}
            <div>
              <div className="section-eyebrow">Professional Support</div>
              <div className="section-title">When you'd like someone trained beside you</div>
              <div className="pro-grid">
                {/* ANCHOR */}
                <div className="anchor-card">
                  <div className="anchor-header">
                    <div>
                      <div className="anchor-label">Saathy Anchor</div>
                      <div className="anchor-desc">Your dedicated guide</div>
                    </div>
                  </div>
                  {EXPERTS.slice(0, 1).map(e => (
                    <div key={e.id} className="expert-row">
                      <div className="expert-av" style={{ background: e.bg, color: e.color }}>{e.initials}</div>
                      <div>
                        <div className="expert-name">{e.name}</div>
                        <div className="expert-spec">4.9 · MSc Clinical Psych</div>
                        <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 2 }}>Next session: {e.session}</div>
                      </div>
                    </div>
                  ))}
                  <button className="anchor-open-btn">Open Anchor space</button>
                </div>

                {/* EXPERTS */}
                <div className="experts-card">
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                    <div>
                      <div className="anchor-label">Saathy Experts</div>
                      <div className="anchor-desc">49 verified · 7 online</div>
                    </div>
                  </div>
                  {[
                    { initials: "AK", name: "Aarav Kapoor", spec: "Trauma · CBT", badge: "today", bg: "#DBEAFE", color: "#2563EB" },
                    { initials: "SI", name: "Sana Iyer", spec: "Relationships", badge: "tomorrow", bg: "#D1FAE5", color: "#059669" },
                    { initials: "VD", name: "Vikram Das", spec: "Sleep · Anxiety", badge: "today", bg: "#EDE9FE", color: "#7C3AED" },
                  ].map(e => (
                    <div key={e.name} className="expert-row">
                      <div className="expert-av" style={{ background: e.bg, color: e.color, fontSize: 11 }}>{e.initials}</div>
                      <div style={{ flex: 1 }}>
                        <div className="expert-name">{e.name}</div>
                        <div className="expert-spec">{e.spec}</div>
                      </div>
                      <span className={e.badge === "today" ? "expert-today" : "expert-tomorrow"}>{e.badge}</span>
                    </div>
                  ))}
                  <a className="browse-link">Browse experts →</a>
                </div>

                {/* SAFETY NET */}
                <div className="safety-card">
                  <div className="safety-icon">🛡️</div>
                  <div className="safety-title">Safety Net</div>
                  <div className="safety-desc">If things feel too heavy right now, a trained responder will be with you in 90 seconds.</div>
                  <div style={{ fontSize: 10, color: "#D97706", marginBottom: 12, fontWeight: 600 }}>Confidential · Anonymous · Free</div>
                  <div className="safety-btns">
                    <button className="safety-reach">Reach now</button>
                    <button className="safety-plan">Safety plan</button>
                  </div>
                </div>
              </div>
            </div>

            {/* INSIGHTS */}
            <div>
              <div className="section-eyebrow">Insights</div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                <div className="section-title" style={{ marginBottom: 0 }}>Patterns we noticed, gently</div>
                <span className="see-all">Full report →</span>
              </div>
              <div className="insights-grid">
                <div className="mood-trend-card">
                  <div className="trend-header">
                    <span className="trend-title">Mood Trend · 7 Days</span>
                    <div className="trend-tabs">
                      {["7d", "30d", "90d"].map(t => (
                        <button key={t} className={`trend-tab${t === "7d" ? " active" : ""}`}>{t}</button>
                      ))}
                    </div>
                  </div>
                  <div style={{ marginTop: 8 }}>
                    <span className="trend-big">Lifting</span>
                    <span className="trend-up"> +18 pts</span>
                  </div>
                  <div className="chart-area">
                    <MoodTrendChart />
                  </div>
                  <div className="day-labels">
                    {DAY_LABELS.map((d, i) => <span key={i}>{d}</span>)}
                  </div>
                  <div className="trend-bottoms">
                    {[
                      { label: "Calmest day", val: "Sunday" },
                      { label: "Heaviest day", val: "Wednesday" },
                      { label: "Best routine", val: "Morning walk" },
                    ].map(b => (
                      <div key={b.label} className="trend-bottom-item">
                        <div className="trend-bottom-label">{b.label}</div>
                        <div className="trend-bottom-day">{b.val}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="week-went-card" style={{ marginBottom: 16 }}>
                    <div className="week-title">Where your week went</div>
                    <div className="week-bars">
                      {WEEK_BARS.map(b => (
                        <div key={b.label} className="week-bar-row">
                          <span className="week-bar-label">{b.label}</span>
                          <div className="week-bar-track">
                            <div className="week-bar-fill" style={{ width: `${b.pct}%`, background: b.color }} />
                          </div>
                          <span className="week-bar-pct">{b.pct}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="saathy-reflection">
                    <div className="reflection-label">Saathy Reflection</div>
                    <div className="reflection-text">You showed up 6 of 7 days. The week leaned gentle. Your most settled hours were 7–8am — consider anchoring tougher tasks there.</div>
                  </div>
                </div>
              </div>
            </div>

            {/* ACTIVITY + QUICK HELP */}
            <div>
              <div className="bottom-grid">
                <div>
                  <div className="section-eyebrow">Recent Activity</div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                    <div className="section-title" style={{ marginBottom: 0 }}>Your week, in soft strokes</div>
                    <span className="see-all">See all →</span>
                  </div>
                  <div className="activity-card">
                    {ACTIVITY.map(a => (
                      <div key={a.id} className="activity-row">
                        <div className="activity-icon" style={{ background: a.bg }}>{a.icon}</div>
                        <div style={{ flex: 1 }}>
                          <div className="activity-title">{a.title}</div>
                          <div className="activity-time">{a.sub}</div>
                        </div>
                        <span className="activity-arrow">→</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="section-eyebrow">Quick Help</div>
                  <div className="section-title" style={{ marginBottom: 16 }}>We're here, anytime</div>
                  <div className="quick-help-card">
                    {[
                      { icon: "🎧", bg: "#DBEAFE", title: "Help Desk", sub: "Open a ticket — we reply in <2h" },
                      { icon: "❓", bg: "#EDE9FE", title: "FAQs", sub: "Quick answers, common questions" },
                      { icon: "🚨", bg: "#FEE2E2", title: "Emergency resources", sub: "Helplines & 24×7 links" },
                    ].map(h => (
                      <div key={h.title} className="help-item">
                        <div className="help-icon" style={{ background: h.bg }}>{h.icon}</div>
                        <div>
                          <div className="help-title">{h.title}</div>
                          <div className="help-sub">{h.sub}</div>
                        </div>
                      </div>
                    ))}
                    <div className="contact-support">
                      <div className="contact-label">Contact Support</div>
                      <div className="contact-email">care@saathy.app</div>
                      <div className="contact-hours">Mon–Sun · 7am–11pm IST</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>

          <div className="dash-footer">
            Saathy · Crafted with care · You are not alone.
          </div>
        </main>
      </div>
    </>
  );
}