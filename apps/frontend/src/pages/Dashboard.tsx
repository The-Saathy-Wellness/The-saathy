
import { useState, useEffect, useRef } from "react";

// ─── GLOBAL CSS ───────────────────────────────────────────────────────────────
const GLOBAL_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Inter:wght@400;500;600&display=swap');
*{margin:0;padding:0;box-sizing:border-box}
:root{
  --p:#7C3AED;--pl:#A78BFA;--pp:#EDE9FE;
  --bg:#F5F3FF;--s:#fff;--b:#E5E0FA;
  --t:#1F1635;--m:#6B7280;
  --r:16px;--rs:10px;
  --sh:0 2px 12px rgba(124,58,237,.09);
  --shh:0 8px 28px rgba(124,58,237,.18);
  --tr:all 0.22s cubic-bezier(.4,0,.2,1);
}
body{background:var(--bg);font-family:'Inter',sans-serif;color:var(--t);font-size:13px}
button,input,textarea,select{font-family:'Inter',sans-serif}
@keyframes fadeUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
@keyframes fadeIn{from{opacity:0}to{opacity:1}}
@keyframes pulse{0%,100%{box-shadow:0 0 0 0 rgba(16,185,129,.4)}50%{box-shadow:0 0 0 5px rgba(16,185,129,0)}}
@keyframes ring{0%,100%{box-shadow:0 0 0 0 rgba(124,58,237,.4)}50%{box-shadow:0 0 0 5px rgba(124,58,237,0)}}
@keyframes shimmer{from{background-position:-200% 0}to{background-position:200% 0}}
.fu{animation:fadeUp .45s ease both}
.fi{animation:fadeIn .3s ease both}
`;

// ─── SIDEBAR CONFIG ───────────────────────────────────────────────────────────
const NAV_SECTIONS = [
  {
    label: "OVERVIEW",
    items: [
      { id: "dashboard", icon: "📊", name: "Dashboard" },
      { id: "journal",   icon: "📔", name: "Journal" },
    ],
  },
  {
    label: "SUPPORT",
    items: [
      { id: "saathy-ai", icon: "🤖", name: "Saathy AI" },
      { id: "listeners", icon: "👂", name: "Listeners" },
      { id: "chat",      icon: "💬", name: "Chat" },
      { id: "calls",     icon: "☎️", name: "Expert Calls" },
    ],
  },
  {
    label: "REFLECT",
    items: [
      { id: "daily-pulse", icon: "💓", name: "Daily Pulse" },
      { id: "memory",      icon: "💭", name: "Memory" },
      { id: "growth-path", icon: "🌱", name: "Showing Up Path" },
    ],
  },
  {
    label: "COMMUNITY",
    items: [
      { id: "circles",   icon: "👥", name: "Circles" },
      { id: "community-rooms", icon: "🏠", name: "Community Rooms" },
      { id: "offline",   icon: "📍", name: "Offline Circles" },
    ],
  },
];

// ─── SHARED DATA ──────────────────────────────────────────────────────────────
const MOODS = [
  { e: "🌟", l: "Glowing", c: "#FCD34D", bg: "#FFFBEB" },
  { e: "🌿", l: "Calm",    c: "#6EE7B7", bg: "#ECFDF5" },
  { e: "☁️", l: "Okay",   c: "#93C5FD", bg: "#EFF6FF" },
  { e: "🌧", l: "Low",     c: "#C4B5FD", bg: "#F5F3FF" },
  { e: "🌑", l: "Heavy",   c: "#F87171", bg: "#FEF2F2" },
];

const EXPERTS_LIST = [
  { ini: "RM", name: "Dr. Riya Menon",  spec: "Trauma · CBT",        badge: "today",    bg: "#EDE9FE", c: "#7C3AED", rating: "4.9", next: "Mon · 8:30 PM" },
  { ini: "AK", name: "Aarav Kapoor",    spec: "Trauma · CBT",        badge: "today",    bg: "#DBEAFE", c: "#2563EB", rating: "4.8", next: "Mon · 9:00 PM" },
  { ini: "SI", name: "Sana Iyer",       spec: "Relationships",        badge: "tomorrow", bg: "#D1FAE5", c: "#059669", rating: "4.7", next: "Tue · 3:00 PM" },
  { ini: "VD", name: "Vikram Das",      spec: "Sleep · Anxiety",      badge: "today",    bg: "#FEF3C7", c: "#D97706", rating: "4.6", next: "Mon · 6:00 PM" },
  { ini: "PS", name: "Priya Sharma",    spec: "Wellness Coach",       badge: "tomorrow", bg: "#FCE7F3", c: "#DB2777", rating: "4.9", next: "Tue · 5:00 PM" },
  { ini: "NK", name: "Nisha Kapoor",    spec: "Grief Counselor",      badge: "today",    bg: "#E0F2FE", c: "#0284C7", rating: "4.8", next: "Mon · 7:00 PM" },
];

const JOURNAL_ENTRIES = [
  { e: "🌟", title: "A small win at work",       time: "Wed · 4 min read", mood: "Glowing",  words: 320 },
  { e: "💌", title: "Letter I won't send",        time: "Tue · 4 min read", mood: "Heavy",    words: 410 },
  { e: "🌿", title: "Three things I noticed",     time: "Mon · 6 min read", mood: "Calm",     words: 580 },
  { e: "☁️", title: "The meeting I dreaded",     time: "Sun · 3 min read", mood: "Okay",     words: 290 },
  { e: "🌅", title: "Morning without a phone",    time: "Sat · 5 min read", mood: "Calm",     words: 470 },
  { e: "💔", title: "Missing someone far away",   time: "Fri · 7 min read", mood: "Low",      words: 620 },
];

const CIRCLES_LIST = [
  { e: "🌅", name: "Anxiety & Breath",       desc: "Tuesday Quiet Hour · Sun 8 AM",   members: 1248, tags: ["Anxiety","Burnout","Grief"],     joined: true  },
  { e: "🎙", name: "Community Rooms",         desc: "Sunday Quiet Hour · Sun 9 AM",    members: 3892, tags: ["Open mic","Listening","Reflect"], joined: false },
  { e: "🌙", name: "Quiet Mornings",          desc: "Daily · 6:30 AM",                 members: 744,  tags: ["Morning","Calm","Ritual"],        joined: true  },
  { e: "🌊", name: "Processing Together",     desc: "Wednesday · 8 PM",               members: 512,  tags: ["Grief","Loss","Healing"],         joined: false },
  { e: "🎨", name: "Creative Wellness",       desc: "Friday · 5 PM",                  members: 301,  tags: ["Art","Expression","Joy"],         joined: false },
  { e: "🤝", name: "Work Stress Support",     desc: "Thursday · 7 PM",               members: 892,  tags: ["Work","Burnout","Balance"],       joined: false },
];

const ACTIVITY_FEED = [
  { ico: "📔", bg: "#EDE9FE", title: "Journal · A small win at work",  sub: "Yesterday · 4:42 PM" },
  { ico: "👥", bg: "#DBEAFE", title: "Joined circle · Quiet mornings", sub: "Yesterday · 7:10 AM" },
  { ico: "🤖", bg: "#D1FAE5", title: "Chat with Saathy AI · 22 min",   sub: "Wed · 11:18 PM" },
  { ico: "☎️", bg: "#FEF3C7", title: "Call with Dr. Riya Menon",       sub: "Mon · 9:00 PM" },
  { ico: "📅", bg: "#FEE2E2", title: "RSVP'd · Sunday Quiet Hour",     sub: "Mon · 2:34 PM" },
];

const MILESTONES = [
  { done: true,  label: "Notice"   },
  { done: true,  label: "Name"     },
  { done: true,  label: "Soften"   },
  { done: false, label: "Reach out", active: true },
  { done: false, label: "Rest"     },
  { done: false, label: "Return"   },
];

const WEEK_BARS = [
  { l: "Journal",   p: 32, c: "#7C3AED" },
  { l: "Community", p: 28, c: "#A78BFA" },
  { l: "Sessions",  p: 22, c: "#6D28D9" },
  { l: "AI chats",  p: 18, c: "#DDD6FE" },
];

const MEMORY_ITEMS = [
  { e: "💜", text: "You said: 'I'm proud of myself for showing up today'", date: "3 days ago" },
  { e: "🌿", text: "Breakthrough: Noticed the tension before it became anxiety", date: "1 week ago" },
  { e: "🌟", text: "Dr. Riya noted: 'Your self-awareness is growing'", date: "2 weeks ago" },
  { e: "📔", text: "Pattern: You write more on days after poor sleep", date: "3 weeks ago" },
  { e: "🤝", text: "You reached out first — that took courage", date: "1 month ago" },
];

const LISTENERS_LIST = [
  { ini: "AP", name: "Ananya P.",    spec: "Anxiety · Relationships", status: "online",  bg: "#EDE9FE", c: "#7C3AED", sessions: 142, rating: "4.9" },
  { ini: "RK", name: "Rohan K.",     spec: "Work stress · Burnout",   status: "online",  bg: "#D1FAE5", c: "#059669", sessions: 98,  rating: "4.8" },
  { ini: "MJ", name: "Meera J.",     spec: "Grief · Loss",            status: "busy",    bg: "#FEE2E2", c: "#DC2626", sessions: 213, rating: "5.0" },
  { ini: "ST", name: "Siddharth T.", spec: "Identity · Career",       status: "online",  bg: "#DBEAFE", c: "#2563EB", sessions: 76,  rating: "4.7" },
  { ini: "PV", name: "Priya V.",     spec: "Family · Parenting",      status: "offline", bg: "#FEF3C7", c: "#D97706", sessions: 189, rating: "4.9" },
];

const OFFLINE_EVENTS = [
  { e: "🚶", name: "Bangalore Walk & Talk", time: "Sat · 5:30 AM", loc: "Cubbon Park, Bengaluru", members: 412, spots: 8 },
  { e: "🧘", name: "Mumbai Mindful Morning", time: "Sun · 7:00 AM", loc: "Juhu Beach, Mumbai", members: 280, spots: 12 },
  { e: "☕", name: "Delhi Chai & Share",     time: "Sat · 9:00 AM", loc: "India Gate Lawns", members: 156, spots: 6 },
  { e: "🌳", name: "Hyderabad Nature Walk",  time: "Sun · 6:00 AM", loc: "KBR Park, Hyderabad", members: 98,  spots: 15 },
];

// ─── CHART ────────────────────────────────────────────────────────────────────
function MoodChart({ height = 80 }) {
  const pts = [30, 45, 40, 60, 55, 70, 65];
  const W = 300, H = height;
  const mx = 80, mn = 20;
  const coords = pts.map((v, i) => ({
    x: (i / (pts.length - 1)) * W,
    y: H - ((v - mn) / (mx - mn)) * H,
  }));
  const d = coords.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
  const fill = `${d} L ${W} ${H} L 0 ${H} Z`;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height }} preserveAspectRatio="none">
      <defs>
        <linearGradient id="cg" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#7C3AED" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#7C3AED" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={fill} fill="url(#cg)" />
      <path d={d} fill="none" stroke="#7C3AED" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      {coords.map((p, i) => <circle key={i} cx={p.x} cy={p.y} r="3.5" fill="#7C3AED" />)}
    </svg>
  );
}

// ─── SHARED COMPONENTS ────────────────────────────────────────────────────────
function Card({ children, style, className = "", hover = true }) {
  return (
    <div
      className={`card ${className}`}
      style={{
        background: "var(--s)",
        border: "1px solid var(--b)",
        borderRadius: "var(--r)",
        padding: "20px",
        boxShadow: "var(--sh)",
        transition: hover ? "var(--tr)" : "none",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function PageHeader({ eyebrow, title, action }) {
  return (
    <div style={{ marginBottom: 24 }}>
      {eyebrow && (
        <div style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "1.2px", color: "var(--m)", marginBottom: 4 }}>
          {eyebrow}
        </div>
      )}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1 style={{ fontFamily: "'Fraunces',serif", fontSize: 26, fontWeight: 400, color: "var(--t)" }}>{title}</h1>
        {action}
      </div>
    </div>
  );
}

function Badge({ children, color = "#7C3AED", bg = "#EDE9FE" }) {
  return (
    <span style={{ background: bg, color, fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 20 }}>
      {children}
    </span>
  );
}

function Btn({ children, primary, onClick, style }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "9px 18px", borderRadius: 30, fontSize: 12, fontWeight: 600,
        cursor: "pointer", border: primary ? "none" : "1.5px solid var(--b)",
        background: primary ? "var(--p)" : "var(--s)",
        color: primary ? "white" : "var(--t)",
        transition: "var(--tr)", ...style,
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = "translateY(-2px)";
        e.currentTarget.style.boxShadow = primary ? "0 6px 18px rgba(124,58,237,.3)" : "var(--sh)";
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = "";
        e.currentTarget.style.boxShadow = "";
      }}
    >
      {children}
    </button>
  );
}

// ─── PAGES ────────────────────────────────────────────────────────────────────

// DASHBOARD PAGE
function DashboardPage({ navigate, mood, setMood }) {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    { id: "1", r: "ai", t: "Good morning, Aanya. How are you feeling today? 💜", tm: "8:00 AM" },
  ]);
  const endRef = useRef(null);
  useEffect(() => endRef.current?.scrollIntoView({ behavior: "smooth" }), [messages]);

  const sendMsg = () => {
    if (!input.trim()) return;
    const now = new Date();
    const tm = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    setMessages(p => [...p, { id: Date.now().toString(), r: "user", t: input.trim(), tm }]);
    setInput("");
    setTimeout(() => {
      const replies = [
        "Thank you for sharing that with me. I'm here to listen 💜",
        "That takes courage to say. Tell me more about how that feels.",
        "I hear you. You're doing better than you think, one step at a time.",
      ];
      const atm = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
      setMessages(p => [...p, { id: (Date.now() + 1).toString(), r: "ai", t: replies[Math.floor(Math.random() * replies.length)], tm: atm }]);
    }, 900);
  };

  const bars = [55, 70, 45, 78, 65, 80, 72];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>

      {/* HERO GRID */}
      <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 20, alignItems: "start" }}>
        {/* GREETING */}
        <Card className="fu" style={{ background: "linear-gradient(135deg,#fff 0%,#F5F3FF 100%)", position: "relative", overflow: "hidden", padding: 32 }}>
          <div style={{ position: "absolute", top: -40, right: -40, width: 180, height: 180, background: "radial-gradient(circle,rgba(167,139,250,.15) 0%,transparent 70%)", borderRadius: "50%", pointerEvents: "none" }} />
          <div style={{ fontSize: 10, color: "var(--m)", marginBottom: 10, display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ background: "var(--pp)", color: "var(--p)", padding: "2px 8px", borderRadius: 20, fontWeight: 500 }}>Friday morning · 5 Jun</span>
          </div>
          <h1 style={{ fontFamily: "'Fraunces',serif", fontSize: "clamp(24px,3vw,36px)", fontWeight: 400, lineHeight: 1.15, marginBottom: 8 }}>
            Good morning, <em style={{ color: "var(--p)", fontStyle: "italic" }}>Aanya.</em>
          </h1>
          <p style={{ fontSize: 14, fontWeight: 500, marginBottom: 5 }}>How is your heart today?</p>
          <p style={{ fontSize: 12, color: "var(--m)", lineHeight: 1.6, marginBottom: 22, maxWidth: 340 }}>
            A gentle check-in helps us tune the day around you. Pick a feeling — Saathy will meet you there.
          </p>
          <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
            {MOODS.map(m => (
              <button
                key={m.l}
                onClick={() => setMood(mood === m.l ? null : m.l)}
                style={{
                  display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
                  padding: "10px 14px", borderRadius: "var(--rs)",
                  border: `1.5px solid ${mood === m.l ? m.c : "var(--b)"}`,
                  background: mood === m.l ? m.bg : "var(--s)",
                  cursor: "pointer", fontSize: 11, fontWeight: mood === m.l ? 600 : 400,
                  color: mood === m.l ? "var(--t)" : "var(--m)",
                  transition: "all .25s cubic-bezier(.34,1.56,.64,1)",
                  transform: mood === m.l ? "translateY(-3px) scale(1.04)" : "",
                  boxShadow: mood === m.l ? "0 6px 18px rgba(124,58,237,.15)" : "",
                }}
                onMouseEnter={e => { if (mood !== m.l) { e.currentTarget.style.transform = "translateY(-4px) scale(1.05)"; e.currentTarget.style.boxShadow = "var(--shh)"; } }}
                onMouseLeave={e => { if (mood !== m.l) { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = ""; } }}
              >
                <span style={{ fontSize: 20 }}>{m.e}</span>
                <span>{m.l}</span>
              </button>
            ))}
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {[["🤖 Talk to Saathy AI", true, "saathy-ai"], ["👥 Join a Circle", false, "circles"], ["📔 Write Journal", false, "journal"], ["☎️ Book a Call", false, "calls"]].map(([lbl, pri, pg]) => (
              <button
                key={lbl}
                onClick={() => navigate(pg)}
                style={{
                  padding: "9px 16px", borderRadius: 30, fontSize: 12, fontWeight: 600, cursor: "pointer",
                  border: pri ? "none" : "1.5px solid var(--b)",
                  background: pri ? "var(--p)" : "var(--s)", color: pri ? "white" : "var(--t)",
                  transition: "var(--tr)",
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.background = pri ? "#6D28D9" : "var(--pp)"; e.currentTarget.style.color = pri ? "white" : "var(--p)"; }}
                onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.background = pri ? "var(--p)" : "var(--s)"; e.currentTarget.style.color = pri ? "white" : "var(--t)"; }}
              >
                {lbl}
              </button>
            ))}
          </div>
        </Card>

        {/* RIGHT COL */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {/* WELLNESS */}
          <Card>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
              <span style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, color: "var(--m)" }}>Weekly Wellbeing</span>
              <Badge color="#059669" bg="#ECFDF5">↑ 12%</Badge>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 10 }}>
              <div>
                <span style={{ fontFamily: "'Fraunces',serif", fontSize: 44, fontWeight: 700, lineHeight: 1 }}>78</span>
                <span style={{ fontSize: 12, color: "var(--m)" }}> / 100</span>
                <div style={{ fontSize: 11, color: "var(--m)", marginTop: 2 }}>gently rising</div>
              </div>
              <div style={{ display: "flex", gap: 5, flex: 1 }}>
                {bars.map((bh, i) => (
                  <div key={i} style={{ flex: 1, height: 36, borderRadius: 7, background: "var(--pp)", position: "relative", overflow: "hidden" }}>
                    <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: `${bh}%`, background: "var(--p)", borderRadius: 7, opacity: i === 5 ? 1 : 0.45 }} />
                  </div>
                ))}
              </div>
            </div>
            <div style={{ display: "flex", gap: 8, background: "var(--pp)", borderRadius: "var(--rs)", padding: 10 }}>
              <span style={{ fontSize: 16 }}>💜</span>
              <div>
                <div style={{ fontSize: 9, fontWeight: 700, color: "var(--p)", textTransform: "uppercase", letterSpacing: .5 }}>Saathy notices...</div>
                <div style={{ fontSize: 11, color: "var(--m)", marginTop: 2 }}>You sleep better on journaling days. Want to write tonight?</div>
              </div>
            </div>
          </Card>

          {/* MINI CHAT */}
          <Card style={{ padding: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <span style={{ fontSize: 13, fontWeight: 600 }}>Saathy AI</span>
              <span style={{ fontSize: 10, color: "var(--m)", background: "var(--bg)", padding: "2px 7px", borderRadius: 20 }}>Always here for you</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8, maxHeight: 160, overflowY: "auto", marginBottom: 10 }}>
              {messages.map(msg => (
                <div key={msg.id} style={{ display: "flex", flexDirection: msg.r === "user" ? "row-reverse" : "row", gap: 7 }}>
                  <div>
                    <div style={{ padding: "9px 12px", borderRadius: 13, fontSize: 12, lineHeight: 1.5, maxWidth: "80%", background: msg.r === "ai" ? "var(--pp)" : "var(--p)", color: msg.r === "ai" ? "var(--t)" : "white", borderBottomLeftRadius: msg.r === "ai" ? 3 : 13, borderBottomRightRadius: msg.r === "user" ? 3 : 13 }}>
                      {msg.t}
                    </div>
                    <div style={{ fontSize: 9, color: "var(--m)", marginTop: 2, textAlign: msg.r === "user" ? "right" : "left" }}>{msg.tm}</div>
                  </div>
                </div>
              ))}
              <div ref={endRef} />
            </div>
            <div style={{ display: "flex", gap: 7 }}>
              <textarea
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMsg(); } }}
                placeholder="Tell me what's on your mind..."
                rows={1}
                style={{ flex: 1, padding: "8px 12px", border: "1.5px solid var(--b)", borderRadius: "var(--rs)", fontSize: 12, resize: "none", outline: "none", background: "var(--bg)", color: "var(--t)" }}
              />
              <button
                onClick={sendMsg}
                disabled={!input.trim()}
                style={{ width: 34, height: 34, borderRadius: "var(--rs)", border: "none", background: input.trim() ? "var(--p)" : "var(--b)", color: "white", fontSize: 15, cursor: input.trim() ? "pointer" : "not-allowed", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}
              >
                →
              </button>
            </div>
          </Card>
        </div>
      </div>

      {/* CORE SUPPORT */}
      <div>
        <div style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "1.2px", color: "var(--m)", marginBottom: 5 }}>Core Support</div>
        <h2 style={{ fontFamily: "'Fraunces',serif", fontSize: 22, fontWeight: 400, marginBottom: 16 }}>Pick the shape of help you need today</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14 }}>
          {[
            { ico: "🤖", bg: "#EDE9FE", c: "#7C3AED", nm: "Saathy AI", d: "A judgement-free companion for anything on your mind. Always on, always patient.", st: "Available now", pg: "saathy-ai" },
            { ico: "👂", bg: "#DBEAFE", c: "#2563EB", nm: "Saathy Listeners", d: "Trained peer listeners ready to hold space for you over text — anonymously.", st: "12 listeners online", pg: "listeners" },
            { ico: "💬", bg: "#D1FAE5", c: "#059669", nm: "Saathy Chat", d: "Group rooms moderated with care — talk, share, and feel less alone.", st: "4 rooms active", pg: "chat" },
            { ico: "☎️", bg: "#FEF3C7", c: "#D97706", nm: "Saathy Calls", d: "Voice sessions with verified counsellors when words need a warmer wrap.", st: "Next slot: 11:30", pg: "calls" },
          ].map((card, i) => (
            <div
              key={card.nm}
              onClick={() => navigate(card.pg)}
              className="fu"
              style={{ background: "var(--s)", border: "1px solid var(--b)", borderRadius: "var(--r)", padding: 18, cursor: "pointer", transition: "all .3s cubic-bezier(.34,1.56,.64,1)", boxShadow: "var(--sh)", animationDelay: `${i * 0.05}s`, transformStyle: "preserve-3d" }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-6px) rotateX(3deg) rotateY(-2deg)"; e.currentTarget.style.boxShadow = "var(--shh)"; e.currentTarget.style.borderColor = "var(--pl)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = "var(--sh)"; e.currentTarget.style.borderColor = "var(--b)"; }}
            >
              <div style={{ width: 40, height: 40, borderRadius: 10, background: card.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, marginBottom: 12 }}>{card.ico}</div>
              <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 5 }}>{card.nm}</div>
              <div style={{ fontSize: 11, color: "var(--m)", lineHeight: 1.5, marginBottom: 12 }}>{card.d}</div>
              <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: card.c, display: "inline-block", animation: "pulse 2s infinite" }} />
                <span style={{ fontSize: 10, color: "var(--m)" }}>{card.st}</span>
              </div>
              <div style={{ fontSize: 11, color: "var(--p)", fontWeight: 600, marginTop: 8 }}>Open →</div>
            </div>
          ))}
        </div>
      </div>

      {/* COMMUNITY */}
      <div>
        <div style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "1.2px", color: "var(--m)", marginBottom: 5 }}>Community</div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <h2 style={{ fontFamily: "'Fraunces',serif", fontSize: 22, fontWeight: 400 }}>You don't have to do this alone</h2>
          <button onClick={() => navigate("circles")} style={{ fontSize: 12, color: "var(--p)", fontWeight: 600, background: "none", border: "none", cursor: "pointer" }}>Browse all →</button>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14 }}>
          {CIRCLES_LIST.slice(0, 3).map((c, i) => (
            <div
              key={c.name}
              className="fu"
              onClick={() => navigate("circles")}
              style={{ background: "var(--s)", border: "1px solid var(--b)", borderRadius: "var(--r)", padding: 18, cursor: "pointer", transition: "all .3s cubic-bezier(.34,1.56,.64,1)", boxShadow: "var(--sh)", animationDelay: `${i * 0.07}s` }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-5px)"; e.currentTarget.style.boxShadow = "var(--shh)"; e.currentTarget.style.borderColor = "var(--pl)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = "var(--sh)"; e.currentTarget.style.borderColor = "var(--b)"; }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <div style={{ fontFamily: "'Fraunces',serif", fontSize: 26, fontWeight: 700 }}>{c.members.toLocaleString()}</div>
                  <div style={{ fontSize: 9, color: "var(--m)", textTransform: "uppercase", letterSpacing: 1 }}>Active Members</div>
                </div>
                <span style={{ fontSize: 22 }}>{c.e}</span>
              </div>
              <div style={{ fontSize: 14, fontWeight: 600, margin: "8px 0 3px" }}>{c.name}</div>
              <div style={{ fontSize: 11, color: "var(--m)", marginBottom: 8 }}>{c.desc}</div>
              <div style={{ display: "flex", gap: 5, flexWrap: "wrap", marginBottom: 12 }}>
                {c.tags.map(t => <span key={t} style={{ fontSize: 9, padding: "2px 7px", borderRadius: 20, background: "var(--pp)", color: "var(--p)", fontWeight: 500 }}>{t}</span>)}
              </div>
              <button style={{ width: "100%", padding: "9px", borderRadius: "var(--rs)", border: "none", background: c.joined ? "#ECFDF5" : "var(--p)", color: c.joined ? "#059669" : "white", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
                {c.joined ? "✓ Joined" : "Join →"}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* GROWTH + PATH */}
      <div>
        <div style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "1.2px", color: "var(--m)", marginBottom: 5 }}>Personal Growth</div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <h2 style={{ fontFamily: "'Fraunces',serif", fontSize: 22, fontWeight: 400 }}>Your quiet practices, kept warm</h2>
          <button onClick={() => navigate("growth-path")} style={{ fontSize: 12, color: "var(--p)", fontWeight: 600, background: "none", border: "none", cursor: "pointer" }}>View timeline →</button>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: 14 }}>
          {/* JOURNAL */}
          <Card hover={false} style={{ cursor: "pointer" }} className="fu">
            <div onClick={() => navigate("journal")} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 16 }}>📓</span>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600 }}>Saathy Journal</div>
                  <div style={{ fontSize: 11, color: "var(--m)" }}>18 entries this month</div>
                </div>
              </div>
              <Badge color="#D97706" bg="#FEF3C7">🔥 12-day streak</Badge>
            </div>
            {JOURNAL_ENTRIES.slice(0, 3).map(e => (
              <div key={e.title} onClick={() => navigate("journal")} style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 0", borderBottom: "1px solid var(--b)", cursor: "pointer" }}
                onMouseEnter={ev => ev.currentTarget.style.paddingLeft = "4px"}
                onMouseLeave={ev => ev.currentTarget.style.paddingLeft = "0"}>
                <span style={{ fontSize: 18, width: 28, textAlign: "center" }}>{e.e}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 12, fontWeight: 500 }}>{e.title}</div>
                  <div style={{ fontSize: 10, color: "var(--m)" }}>{e.time}</div>
                </div>
                <span style={{ color: "var(--m)", fontSize: 11 }}>→</span>
              </div>
            ))}
            <button onClick={() => navigate("journal")} style={{ width: "100%", marginTop: 12, padding: 10, borderRadius: "var(--rs)", border: "none", background: "var(--t)", color: "white", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
              Write today's entry
            </button>
          </Card>
          {/* DAILY PULSE */}
          <Card style={{ cursor: "pointer" }} className="fu" onClick={() => navigate("daily-pulse")}>
            <div style={{ fontSize: 9, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, color: "var(--m)", marginBottom: 7 }}>Daily Pulse</div>
            <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 10 }}>Check-ins this week</div>
            <div>
              <span style={{ fontFamily: "'Fraunces',serif", fontSize: 38, fontWeight: 700, lineHeight: 1 }}>6</span>
              <span style={{ fontSize: 13, color: "var(--m)" }}>/7</span>
            </div>
            <div style={{ fontSize: 10, color: "var(--m)", marginTop: 3, marginBottom: 10 }}>checks done this week</div>
            <div style={{ height: 4, background: "var(--b)", borderRadius: 10, overflow: "hidden" }}>
              <div style={{ width: "86%", height: "100%", background: "var(--p)", borderRadius: 10 }} />
            </div>
          </Card>
          {/* MEMORY */}
          <Card style={{ background: "linear-gradient(135deg,#EDE9FE,#DDD6FE)", border: "1px solid #C4B5FD", cursor: "pointer" }} className="fu" onClick={() => navigate("memory")}>
            <div style={{ fontSize: 9, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, color: "var(--p)", marginBottom: 7 }}>Memory</div>
            <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 10 }}>Moments saved</div>
            <div style={{ fontFamily: "'Fraunces',serif", fontSize: 38, fontWeight: 700, lineHeight: 1 }}>48</div>
            <div style={{ fontSize: 11, color: "#6D28D9", marginBottom: 10 }}>moments saved</div>
            <div style={{ height: 4, background: "rgba(124,58,237,.2)", borderRadius: 10, overflow: "hidden" }}>
              <div style={{ width: "60%", height: "100%", background: "var(--p)", borderRadius: 10 }} />
            </div>
          </Card>
        </div>

        {/* SHOWING UP PATH */}
        <Card style={{ marginTop: 14 }} className="fu">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
            <div style={{ fontSize: 14, fontWeight: 600 }}>Showing Up Path</div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 12, color: "var(--p)", fontWeight: 600 }}>47% complete</span>
              <button onClick={() => navigate("growth-path")} style={{ fontSize: 11, color: "var(--m)", background: "none", border: "none", cursor: "pointer" }}>View all →</button>
            </div>
          </div>
          <div style={{ fontSize: 11, color: "var(--m)", marginBottom: 12 }}>Day 36 of 80 · Reconnecting</div>
          <div style={{ height: 5, background: "var(--b)", borderRadius: 10, overflow: "hidden", marginBottom: 18 }}>
            <div style={{ width: "47%", height: "100%", background: "linear-gradient(90deg,var(--p),var(--pl))", borderRadius: 10 }} />
          </div>
          <div style={{ display: "flex", alignItems: "center" }}>
            {MILESTONES.map((m, i) => (
              <div key={m.label} style={{ display: "flex", alignItems: "center", flex: 1 }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 5, flex: 1 }}>
                  <div style={{ width: 26, height: 26, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, background: m.done ? "var(--p)" : m.active ? "var(--pp)" : "var(--b)", color: m.done ? "white" : m.active ? "var(--p)" : "var(--m)", border: m.active ? "2px solid var(--p)" : "none", animation: m.active ? "ring 2s infinite" : "none" }}>
                    {m.done ? "✓" : i + 1}
                  </div>
                  <span style={{ fontSize: 9, color: "var(--m)", textAlign: "center" }}>{m.label}</span>
                </div>
                {i < MILESTONES.length - 1 && <div style={{ flex: 0.5, height: 2, background: m.done ? "var(--p)" : "var(--b)", marginBottom: 14 }} />}
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* INSIGHTS */}
      <div>
        <div style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "1.2px", color: "var(--m)", marginBottom: 5 }}>Insights</div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <h2 style={{ fontFamily: "'Fraunces',serif", fontSize: 22, fontWeight: 400 }}>Patterns we noticed, gently</h2>
          <span style={{ fontSize: 12, color: "var(--p)", fontWeight: 600, cursor: "pointer" }}>Full report →</span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          <Card>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 5 }}>
              <span style={{ fontSize: 9, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, color: "var(--m)" }}>Mood Trend · 7 Days</span>
              <div style={{ display: "flex", gap: 3 }}>
                {["7d", "30d", "90d"].map(t => (
                  <button key={t} style={{ padding: "2px 7px", borderRadius: 20, fontSize: 9, fontWeight: 600, cursor: "pointer", border: "none", background: t === "7d" ? "var(--t)" : "var(--b)", color: t === "7d" ? "white" : "var(--m)" }}>{t}</button>
                ))}
              </div>
            </div>
            <div style={{ marginTop: 6 }}>
              <span style={{ fontFamily: "'Fraunces',serif", fontSize: 20, fontWeight: 700 }}>Lifting</span>
              <span style={{ fontSize: 12, color: "#10B981", fontWeight: 600 }}> +18 pts</span>
            </div>
            <div style={{ height: 72, marginTop: 10, marginBottom: 8 }}><MoodChart height={72} /></div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 9, color: "var(--m)", marginBottom: 10 }}>
              {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => <span key={i}>{d}</span>)}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 6 }}>
              {[{ l: "Calmest day", v: "Sunday" }, { l: "Heaviest day", v: "Wednesday" }, { l: "Best routine", v: "Morning walk" }].map(b => (
                <div key={b.l} style={{ background: "var(--bg)", borderRadius: "var(--rs)", padding: 7, textAlign: "center" }}>
                  <div style={{ fontSize: 9, color: "var(--m)" }}>{b.l}</div>
                  <div style={{ fontSize: 11, color: "var(--t)", background: "var(--pp)", borderRadius: 5, padding: "3px 6px", fontWeight: 500, marginTop: 2 }}>{b.v}</div>
                </div>
              ))}
            </div>
          </Card>
          <div>
            <Card style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 9, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, color: "var(--m)", marginBottom: 12 }}>Where your week went</div>
              {WEEK_BARS.map(b => (
                <div key={b.l} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                  <span style={{ fontSize: 11, width: 65 }}>{b.l}</span>
                  <div style={{ flex: 1, height: 7, background: "var(--b)", borderRadius: 10, overflow: "hidden" }}>
                    <div style={{ width: `${b.p}%`, height: "100%", background: b.c, borderRadius: 10 }} />
                  </div>
                  <span style={{ fontSize: 11, color: "var(--m)", width: 28, textAlign: "right" }}>{b.p}%</span>
                </div>
              ))}
            </Card>
            <div style={{ background: "var(--pp)", borderRadius: "var(--rs)", padding: "10px 12px" }}>
              <div style={{ fontSize: 9, fontWeight: 700, textTransform: "uppercase", letterSpacing: .5, color: "var(--p)", marginBottom: 4 }}>Saathy Reflection</div>
              <div style={{ fontSize: 11, color: "var(--m)", lineHeight: 1.5 }}>You showed up 6 of 7 days. Your most settled hours were 7–8am — consider anchoring tougher tasks there.</div>
            </div>
          </div>
        </div>
      </div>

      {/* ACTIVITY + QUICK HELP */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18, paddingBottom: 8 }}>
        <div>
          <div style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "1.2px", color: "var(--m)", marginBottom: 5 }}>Recent Activity</div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <h2 style={{ fontFamily: "'Fraunces',serif", fontSize: 20, fontWeight: 400 }}>Your week, in soft strokes</h2>
            <span style={{ fontSize: 12, color: "var(--p)", fontWeight: 600, cursor: "pointer" }}>See all →</span>
          </div>
          <Card style={{ padding: 0 }}>
            {ACTIVITY_FEED.map(a => (
              <div key={a.title} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", cursor: "pointer", borderBottom: "1px solid var(--b)", transition: "var(--tr)" }}
                onMouseEnter={e => { e.currentTarget.style.background = "var(--pp)"; e.currentTarget.style.paddingLeft = "18px"; }}
                onMouseLeave={e => { e.currentTarget.style.background = ""; e.currentTarget.style.paddingLeft = "14px"; }}>
                <div style={{ width: 32, height: 32, borderRadius: 9, background: a.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, flexShrink: 0 }}>{a.ico}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 12, fontWeight: 500 }}>{a.title}</div>
                  <div style={{ fontSize: 10, color: "var(--m)" }}>{a.sub}</div>
                </div>
                <span style={{ color: "var(--m)", fontSize: 11 }}>→</span>
              </div>
            ))}
          </Card>
        </div>
        <div>
          <div style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "1.2px", color: "var(--m)", marginBottom: 5 }}>Quick Help</div>
          <h2 style={{ fontFamily: "'Fraunces',serif", fontSize: 20, fontWeight: 400, marginBottom: 12 }}>We're here, anytime</h2>
          <Card>
            {[
              { ico: "🎧", bg: "#DBEAFE", t: "Help Desk", s: "Open a ticket — we reply in <2h" },
              { ico: "❓", bg: "#EDE9FE", t: "FAQs", s: "Quick answers, common questions" },
              { ico: "🚨", bg: "#FEE2E2", t: "Emergency resources", s: "Helplines & 24×7 links" },
            ].map(hh => (
              <div key={hh.t} style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "9px 0", borderBottom: "1px solid var(--b)", cursor: "pointer", transition: "var(--tr)" }}
                onMouseEnter={e => e.currentTarget.style.paddingLeft = "4px"}
                onMouseLeave={e => e.currentTarget.style.paddingLeft = "0"}>
                <div style={{ width: 28, height: 28, borderRadius: 7, background: hh.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, flexShrink: 0 }}>{hh.ico}</div>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 500 }}>{hh.t}</div>
                  <div style={{ fontSize: 10, color: "var(--m)" }}>{hh.s}</div>
                </div>
              </div>
            ))}
            <div style={{ marginTop: 14, background: "var(--bg)", borderRadius: "var(--rs)", padding: 10 }}>
              <div style={{ fontSize: 9, fontWeight: 700, textTransform: "uppercase", letterSpacing: .5, color: "var(--m)", marginBottom: 3 }}>Contact Support</div>
              <div style={{ fontSize: 12, fontWeight: 600, color: "var(--p)" }}>care@saathy.app</div>
              <div style={{ fontSize: 10, color: "var(--m)" }}>Mon–Sun · 7am–11pm IST</div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

// JOURNAL PAGE
function JournalPage({ navigate }) {
  const [writing, setWriting] = useState(false);
  const [newEntry, setNewEntry] = useState("");
  return (
    <div className="fu">
      <PageHeader eyebrow="Reflect" title="Saathy Journal" action={
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Badge color="#D97706" bg="#FEF3C7">🔥 12-day streak</Badge>
          <Btn primary onClick={() => setWriting(true)}>+ New Entry</Btn>
        </div>
      } />
      {writing && (
        <Card style={{ marginBottom: 20, border: "1.5px solid var(--p)" }}>
          <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 10 }}>What's on your mind today?</div>
          <textarea
            autoFocus
            value={newEntry}
            onChange={e => setNewEntry(e.target.value)}
            placeholder="Start writing... this is your safe space."
            style={{ width: "100%", minHeight: 120, padding: 12, border: "1.5px solid var(--b)", borderRadius: "var(--rs)", fontSize: 13, resize: "vertical", outline: "none", background: "var(--bg)", color: "var(--t)", lineHeight: 1.6 }}
          />
          <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
            <Btn primary onClick={() => { setWriting(false); setNewEntry(""); }}>Save Entry</Btn>
            <Btn onClick={() => { setWriting(false); setNewEntry(""); }}>Cancel</Btn>
          </div>
        </Card>
      )}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14, marginBottom: 20 }}>
        {[{ l: "Entries this month", v: "18", ico: "📝" }, { l: "Time journaling", v: "4h 35m", ico: "⏱" }, { l: "Avg. words/entry", v: "420", ico: "✍️" }].map(s => (
          <Card key={s.l} style={{ textAlign: "center" }}>
            <div style={{ fontSize: 22, marginBottom: 6 }}>{s.ico}</div>
            <div style={{ fontFamily: "'Fraunces',serif", fontSize: 26, fontWeight: 700 }}>{s.v}</div>
            <div style={{ fontSize: 11, color: "var(--m)" }}>{s.l}</div>
          </Card>
        ))}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {JOURNAL_ENTRIES.map((e, i) => (
          <Card key={e.title} className="fu" style={{ animationDelay: `${i * 0.06}s`, cursor: "pointer" }}
            onMouseEnter={ev => { ev.currentTarget.style.transform = "translateY(-2px)"; ev.currentTarget.style.boxShadow = "var(--shh)"; }}
            onMouseLeave={ev => { ev.currentTarget.style.transform = ""; ev.currentTarget.style.boxShadow = "var(--sh)"; }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: "var(--pp)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>{e.e}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 2 }}>{e.title}</div>
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <span style={{ fontSize: 11, color: "var(--m)" }}>{e.time}</span>
                  <span style={{ fontSize: 10, padding: "1px 6px", borderRadius: 20, background: "var(--bg)", color: "var(--m)" }}>{e.mood}</span>
                  <span style={{ fontSize: 10, color: "var(--m)" }}>{e.words} words</span>
                </div>
              </div>
              <span style={{ color: "var(--p)", fontSize: 14 }}>→</span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

// SAATHY AI PAGE
function SaathyAIPage() {
  const [messages, setMessages] = useState([
    { id: "1", r: "ai", t: "Hi Aanya 💜 I'm your Saathy AI companion. I'm here for anything — big feelings, small worries, or just to think out loud. What's on your mind today?", tm: "Now" },
  ]);
  const [input, setInput] = useState("");
  const endRef = useRef(null);
  useEffect(() => endRef.current?.scrollIntoView({ behavior: "smooth" }), [messages]);

  const PROMPTS = ["I'm feeling anxious today", "Help me process something", "I just need to vent", "Tell me something calming"];
  const sendMsg = (text) => {
    const t = text || input.trim();
    if (!t) return;
    const now = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    setMessages(p => [...p, { id: Date.now().toString(), r: "user", t, tm: now }]);
    setInput("");
    setTimeout(() => {
      const replies = [
        "I hear you. That sounds really hard. Can you tell me more about what's been weighing on you?",
        "Thank you for trusting me with that. You don't have to carry it alone. What does it feel like in your body right now?",
        "That makes complete sense. Sometimes things just feel heavy. What would feel like even a small relief?",
        "You're doing the brave thing just by talking about it. What's one thing that's helped you in the past, even a little?",
      ];
      const atm = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
      setMessages(p => [...p, { id: (Date.now() + 1).toString(), r: "ai", t: replies[Math.floor(Math.random() * replies.length)], tm: atm }]);
    }, 1000);
  };

  return (
    <div className="fu" style={{ display: "flex", flexDirection: "column", height: "calc(100vh - 120px)" }}>
      <PageHeader eyebrow="Support" title="Saathy AI Companion" action={<Badge color="#059669" bg="#ECFDF5">● Always available</Badge>} />
      {messages.length === 1 && (
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16 }}>
          {PROMPTS.map(p => (
            <button key={p} onClick={() => sendMsg(p)} style={{ padding: "8px 14px", borderRadius: 30, border: "1.5px solid var(--b)", background: "var(--s)", fontSize: 12, cursor: "pointer", color: "var(--t)", transition: "var(--tr)" }}
              onMouseEnter={e => { e.currentTarget.style.background = "var(--pp)"; e.currentTarget.style.borderColor = "var(--p)"; e.currentTarget.style.color = "var(--p)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "var(--s)"; e.currentTarget.style.borderColor = "var(--b)"; e.currentTarget.style.color = "var(--t)"; }}>
              {p}
            </button>
          ))}
        </div>
      )}
      <Card style={{ flex: 1, display: "flex", flexDirection: "column", padding: 0, overflow: "hidden" }}>
        <div style={{ flex: 1, overflowY: "auto", padding: 20, display: "flex", flexDirection: "column", gap: 14 }}>
          {messages.map(msg => (
            <div key={msg.id} style={{ display: "flex", flexDirection: msg.r === "user" ? "row-reverse" : "row", gap: 10, alignItems: "flex-end" }}>
              {msg.r === "ai" && <div style={{ width: 30, height: 30, borderRadius: "50%", background: "var(--p)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, flexShrink: 0 }}>🤖</div>}
              <div style={{ maxWidth: "70%" }}>
                <div style={{ padding: "11px 14px", borderRadius: 16, fontSize: 13, lineHeight: 1.6, background: msg.r === "ai" ? "var(--pp)" : "var(--p)", color: msg.r === "ai" ? "var(--t)" : "white", borderBottomLeftRadius: msg.r === "ai" ? 4 : 16, borderBottomRightRadius: msg.r === "user" ? 4 : 16 }}>
                  {msg.t}
                </div>
                <div style={{ fontSize: 10, color: "var(--m)", marginTop: 4, textAlign: msg.r === "user" ? "right" : "left" }}>{msg.tm}</div>
              </div>
            </div>
          ))}
          <div ref={endRef} />
        </div>
        <div style={{ padding: "14px 20px", borderTop: "1px solid var(--b)", display: "flex", gap: 8 }}>
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMsg(); } }}
            placeholder="Tell Saathy what's on your mind..."
            rows={2}
            style={{ flex: 1, padding: "10px 14px", border: "1.5px solid var(--b)", borderRadius: "var(--rs)", fontSize: 13, resize: "none", outline: "none", background: "var(--bg)", color: "var(--t)", lineHeight: 1.5 }}
          />
          <button onClick={() => sendMsg()} disabled={!input.trim()} style={{ padding: "0 18px", borderRadius: "var(--rs)", border: "none", background: input.trim() ? "var(--p)" : "var(--b)", color: "white", fontSize: 14, cursor: input.trim() ? "pointer" : "not-allowed", transition: "var(--tr)" }}>→</button>
        </div>
      </Card>
    </div>
  );
}

// LISTENERS PAGE
function ListenersPage() {
  return (
    <div className="fu">
      <PageHeader eyebrow="Support" title="Saathy Listeners" action={<Badge color="#059669" bg="#ECFDF5">12 online now</Badge>} />
      <p style={{ fontSize: 13, color: "var(--m)", marginBottom: 24, lineHeight: 1.6 }}>Trained peer listeners ready to hold space for you — anonymously, without judgement.</p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 14 }}>
        {LISTENERS_LIST.map((l, i) => (
          <Card key={l.name} className="fu" style={{ animationDelay: `${i * 0.07}s` }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
              <div style={{ width: 46, height: 46, borderRadius: "50%", background: l.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700, color: l.c, flexShrink: 0 }}>{l.ini}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 600 }}>{l.name}</div>
                <div style={{ fontSize: 11, color: "var(--m)" }}>{l.spec}</div>
              </div>
              <span style={{ fontSize: 9, fontWeight: 700, padding: "3px 8px", borderRadius: 20, background: l.status === "online" ? "#ECFDF5" : l.status === "busy" ? "#FEF3C7" : "var(--bg)", color: l.status === "online" ? "#059669" : l.status === "busy" ? "#D97706" : "var(--m)" }}>
                ● {l.status}
              </span>
            </div>
            <div style={{ display: "flex", gap: 12, marginBottom: 12 }}>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 16, fontWeight: 700, fontFamily: "'Fraunces',serif" }}>{l.sessions}</div>
                <div style={{ fontSize: 9, color: "var(--m)" }}>Sessions</div>
              </div>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 16, fontWeight: 700, fontFamily: "'Fraunces',serif" }}>{l.rating}</div>
                <div style={{ fontSize: 9, color: "var(--m)" }}>Rating ⭐</div>
              </div>
            </div>
            <button disabled={l.status !== "online"} style={{ width: "100%", padding: "9px", borderRadius: "var(--rs)", border: "none", background: l.status === "online" ? "var(--p)" : "var(--b)", color: "white", fontSize: 12, fontWeight: 600, cursor: l.status === "online" ? "pointer" : "not-allowed", opacity: l.status === "online" ? 1 : 0.6 }}>
              {l.status === "online" ? "Start a chat" : l.status === "busy" ? "In a session" : "Offline"}
            </button>
          </Card>
        ))}
      </div>
    </div>
  );
}

// CHAT PAGE
function ChatPage() {
  const rooms = [
    { e: "🌅", name: "Anxiety & Breath", desc: "A space to breathe together", members: 12, live: true },
    { e: "🌙", name: "Midnight Thoughts", desc: "For when sleep won't come", members: 7, live: true },
    { e: "🌊", name: "Processing Together", desc: "Grief and loss, shared gently", members: 4, live: false },
    { e: "🌱", name: "Small Wins", desc: "Celebrate every step forward", members: 19, live: true },
  ];
  return (
    <div className="fu">
      <PageHeader eyebrow="Support" title="Saathy Chat" action={<Badge color="#059669" bg="#ECFDF5">4 rooms active</Badge>} />
      <p style={{ fontSize: 13, color: "var(--m)", marginBottom: 24 }}>Group rooms moderated with care — talk, share, and feel less alone.</p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 14 }}>
        {rooms.map((r, i) => (
          <Card key={r.name} className="fu" style={{ animationDelay: `${i * 0.07}s`, cursor: "pointer" }}
            onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "var(--shh)"; }}
            onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = "var(--sh)"; }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
              <span style={{ fontSize: 28 }}>{r.e}</span>
              {r.live && <span style={{ fontSize: 9, fontWeight: 700, padding: "2px 8px", borderRadius: 20, background: "#FEE2E2", color: "#DC2626" }}>● LIVE</span>}
            </div>
            <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 4 }}>{r.name}</div>
            <div style={{ fontSize: 12, color: "var(--m)", marginBottom: 12 }}>{r.desc}</div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 11, color: "var(--m)" }}>{r.members} members listening</span>
              <button style={{ padding: "7px 14px", borderRadius: 30, border: "none", background: "var(--p)", color: "white", fontSize: 11, fontWeight: 600, cursor: "pointer" }}>Join room</button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

// EXPERT CALLS PAGE
function CallsPage() {
  return (
    <div className="fu">
      <PageHeader eyebrow="Support" title="Expert Calls" action={<Badge color="#7C3AED" bg="#EDE9FE">49 verified experts</Badge>} />
      <p style={{ fontSize: 13, color: "var(--m)", marginBottom: 24 }}>Voice sessions with verified counsellors when words need a warmer wrap.</p>

      {/* SAFETY NET */}
      <Card style={{ background: "#FFFBEB", border: "1px solid #FDE68A", marginBottom: 20 }}>
        <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
          <span style={{ fontSize: 28 }}>🛡️</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 3 }}>Safety Net · 24×7 Crisis Access</div>
            <div style={{ fontSize: 12, color: "var(--m)" }}>If things feel too heavy, a trained responder will be with you in 90 seconds. Confidential · Anonymous · Free</div>
          </div>
          <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
            <Btn primary>Reach now</Btn>
            <Btn>Safety plan</Btn>
          </div>
        </div>
      </Card>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14 }}>
        {EXPERTS_LIST.map((e, i) => (
          <Card key={e.name} className="fu" style={{ animationDelay: `${i * 0.06}s` }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
              <div style={{ width: 44, height: 44, borderRadius: "50%", background: e.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700, color: e.c, flexShrink: 0 }}>{e.ini}</div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600 }}>{e.name}</div>
                <div style={{ fontSize: 11, color: "var(--m)" }}>{e.spec}</div>
              </div>
            </div>
            <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
              <span style={{ fontSize: 9, fontWeight: 700, padding: "2px 7px", borderRadius: 20, background: e.badge === "today" ? "#ECFDF5" : "#FEF3C7", color: e.badge === "today" ? "#059669" : "#D97706" }}>{e.badge}</span>
              <span style={{ fontSize: 11, color: "var(--m)" }}>⭐ {e.rating}</span>
            </div>
            <div style={{ fontSize: 11, color: "var(--m)", marginBottom: 12 }}>Next: {e.next}</div>
            <button style={{ width: "100%", padding: "9px", borderRadius: "var(--rs)", border: "none", background: "var(--p)", color: "white", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>Book a call</button>
          </Card>
        ))}
      </div>
    </div>
  );
}

// DAILY PULSE PAGE
function DailyPulsePage() {
  const days = ["M", "T", "W", "T", "F", "S", "S"];
  const checks = [true, true, true, true, true, true, false];
  return (
    <div className="fu">
      <PageHeader eyebrow="Reflect" title="Daily Pulse" action={<Badge color="#7C3AED" bg="#EDE9FE">6/7 this week</Badge>} />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>
        <Card>
          <div style={{ fontFamily: "'Fraunces',serif", fontSize: 44, fontWeight: 700, lineHeight: 1 }}>6</div>
          <div style={{ fontSize: 12, color: "var(--m)", marginBottom: 16 }}>/7 days checked in this week</div>
          <div style={{ display: "flex", gap: 8 }}>
            {days.map((d, i) => (
              <div key={i} style={{ flex: 1, textAlign: "center" }}>
                <div style={{ width: "100%", aspectRatio: 1, borderRadius: 8, background: checks[i] ? "var(--p)" : "var(--b)", display: "flex", alignItems: "center", justifyContent: "center", color: checks[i] ? "white" : "var(--m)", fontSize: 14, marginBottom: 4 }}>
                  {checks[i] ? "✓" : ""}
                </div>
                <div style={{ fontSize: 10, color: "var(--m)" }}>{d}</div>
              </div>
            ))}
          </div>
        </Card>
        <Card>
          <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 12 }}>Today's check-in</div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 14 }}>
            {MOODS.map(m => (
              <button key={m.l} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3, padding: "8px 10px", borderRadius: "var(--rs)", border: "1.5px solid var(--b)", background: "var(--s)", cursor: "pointer", fontSize: 10, color: "var(--m)" }}>
                <span style={{ fontSize: 18 }}>{m.e}</span>{m.l}
              </button>
            ))}
          </div>
          <Btn primary style={{ width: "100%" }}>Log check-in</Btn>
        </Card>
      </div>
      <Card>
        <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 12 }}>Mood over 7 days</div>
        <MoodChart height={100} />
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: "var(--m)", marginTop: 6 }}>
          {days.map((d, i) => <span key={i}>{d}</span>)}
        </div>
      </Card>
    </div>
  );
}

// MEMORY PAGE
function MemoryPage() {
  return (
    <div className="fu">
      <PageHeader eyebrow="Reflect" title="Memory" action={<span style={{ fontFamily: "'Fraunces',serif", fontSize: 22, color: "var(--p)", fontWeight: 700 }}>48 moments</span>} />
      <p style={{ fontSize: 13, color: "var(--m)", marginBottom: 24 }}>These are the moments Saathy has noticed and kept warm for you — breakthroughs, insights, and things worth remembering.</p>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {MEMORY_ITEMS.map((m, i) => (
          <Card key={i} className="fu" style={{ animationDelay: `${i * 0.08}s`, background: i === 0 ? "linear-gradient(135deg,#EDE9FE,#DDD6FE)" : "var(--s)", border: i === 0 ? "1px solid #C4B5FD" : "1px solid var(--b)" }}>
            <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
              <span style={{ fontSize: 22, flexShrink: 0 }}>{m.e}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, lineHeight: 1.6, color: "var(--t)" }}>{m.text}</div>
                <div style={{ fontSize: 11, color: "var(--m)", marginTop: 6 }}>{m.date}</div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

// GROWTH PATH PAGE
function GrowthPathPage() {
  const phases = [
    { name: "Notice", desc: "Recognise what's there without judgement", done: true, e: "👁" },
    { name: "Name", desc: "Put words to the feelings", done: true, e: "✍️" },
    { name: "Soften", desc: "Meet yourself with gentleness", done: true, e: "🌿" },
    { name: "Reach out", desc: "Connect with support — you're doing this now", done: false, active: true, e: "🤝" },
    { name: "Rest", desc: "Replenish before you rise", done: false, e: "🌙" },
    { name: "Return", desc: "Come back to yourself, grounded", done: false, e: "🌅" },
  ];
  return (
    <div className="fu">
      <PageHeader eyebrow="Reflect" title="Showing Up Path" action={<Badge color="#7C3AED" bg="#EDE9FE">47% · Day 36 of 80</Badge>} />
      <Card style={{ marginBottom: 20 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
          <span style={{ fontSize: 12, color: "var(--m)" }}>Day 36 of 80 · Reconnecting</span>
          <span style={{ fontSize: 12, color: "var(--p)", fontWeight: 600 }}>47% complete</span>
        </div>
        <div style={{ height: 8, background: "var(--b)", borderRadius: 10, overflow: "hidden" }}>
          <div style={{ width: "47%", height: "100%", background: "linear-gradient(90deg,var(--p),var(--pl))", borderRadius: 10 }} />
        </div>
      </Card>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {phases.map((ph, i) => (
          <Card key={ph.name} className="fu" style={{ animationDelay: `${i * 0.07}s`, border: ph.active ? "1.5px solid var(--p)" : "1px solid var(--b)", background: ph.active ? "linear-gradient(135deg,#fff,#F5F3FF)" : "var(--s)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{ width: 44, height: 44, borderRadius: "50%", background: ph.done ? "var(--p)" : ph.active ? "var(--pp)" : "var(--b)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0, animation: ph.active ? "ring 2s infinite" : "none" }}>
                {ph.done ? "✓" : ph.e}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: ph.done ? "var(--p)" : "var(--t)" }}>{ph.name}</div>
                  {ph.active && <Badge>Current phase</Badge>}
                  {ph.done && <Badge color="#059669" bg="#ECFDF5">Complete</Badge>}
                </div>
                <div style={{ fontSize: 12, color: "var(--m)" }}>{ph.desc}</div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

// CIRCLES PAGE
function CirclesPage() {
  const [joined, setJoined] = useState({ "Anxiety & Breath": true, "Quiet Mornings": true });
  return (
    <div className="fu">
      <PageHeader eyebrow="Community" title="Saathy Circles" action={<Badge color="#7C3AED" bg="#EDE9FE">{Object.keys(joined).length} joined</Badge>} />
      <p style={{ fontSize: 13, color: "var(--m)", marginBottom: 24 }}>Find your people. Safe, moderated spaces for shared healing.</p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14 }}>
        {CIRCLES_LIST.map((c, i) => (
          <Card key={c.name} className="fu" style={{ animationDelay: `${i * 0.06}s` }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
              <span style={{ fontSize: 28 }}>{c.e}</span>
              <span style={{ fontFamily: "'Fraunces',serif", fontSize: 20, fontWeight: 700, color: "var(--p)" }}>{c.members.toLocaleString()}</span>
            </div>
            <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 3 }}>{c.name}</div>
            <div style={{ fontSize: 11, color: "var(--m)", marginBottom: 10 }}>{c.desc}</div>
            <div style={{ display: "flex", gap: 5, flexWrap: "wrap", marginBottom: 14 }}>
              {c.tags.map(t => <span key={t} style={{ fontSize: 9, padding: "2px 7px", borderRadius: 20, background: "var(--pp)", color: "var(--p)", fontWeight: 500 }}>{t}</span>)}
            </div>
            <button
              onClick={() => setJoined(prev => { const next = { ...prev }; if (next[c.name]) delete next[c.name]; else next[c.name] = true; return next; })}
              style={{ width: "100%", padding: "9px", borderRadius: "var(--rs)", border: "none", background: joined[c.name] ? "#ECFDF5" : "var(--p)", color: joined[c.name] ? "#059669" : "white", fontSize: 12, fontWeight: 600, cursor: "pointer", transition: "var(--tr)" }}>
              {joined[c.name] ? "✓ Joined" : "Join →"}
            </button>
          </Card>
        ))}
      </div>
    </div>
  );
}

// COMMUNITY ROOMS PAGE
function CommunityRoomsPage() {
  const rooms = [
    { e: "🎙", name: "Sunday Quiet Hour", desc: "Open mic · Listening · Reflection", members: 3892, time: "Sun 9:00 AM", live: true },
    { e: "🌙", name: "Midnight Check-in", desc: "For late nights and heavy hearts", members: 1204, time: "Daily · 11:30 PM", live: false },
    { e: "☀️", name: "Morning Affirmations", desc: "Start the day with intention", members: 2100, time: "Daily · 7:00 AM", live: true },
    { e: "🌊", name: "Processing Space", desc: "Unstructured sharing, held safely", members: 876, time: "Wed · 8:00 PM", live: false },
  ];
  return (
    <div className="fu">
      <PageHeader eyebrow="Community" title="Community Rooms" action={<Badge color="#059669" bg="#ECFDF5">2 live now</Badge>} />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 14 }}>
        {rooms.map((r, i) => (
          <Card key={r.name} className="fu" style={{ animationDelay: `${i * 0.07}s`, cursor: "pointer" }}
            onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "var(--shh)"; }}
            onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = "var(--sh)"; }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
              <span style={{ fontSize: 28 }}>{r.e}</span>
              <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                {r.live && <span style={{ fontSize: 9, fontWeight: 700, padding: "2px 8px", borderRadius: 20, background: "#FEE2E2", color: "#DC2626" }}>● LIVE</span>}
                <span style={{ fontFamily: "'Fraunces',serif", fontSize: 18, fontWeight: 700, color: "var(--p)" }}>{r.members.toLocaleString()}</span>
              </div>
            </div>
            <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 3 }}>{r.name}</div>
            <div style={{ fontSize: 11, color: "var(--m)", marginBottom: 4 }}>{r.desc}</div>
            <div style={{ fontSize: 11, color: "var(--p)", fontWeight: 500, marginBottom: 14 }}>🕐 {r.time}</div>
            <button style={{ width: "100%", padding: "9px", borderRadius: "var(--rs)", border: "none", background: "var(--p)", color: "white", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>Join →</button>
          </Card>
        ))}
      </div>
    </div>
  );
}

// OFFLINE CIRCLES PAGE
function OfflineCirclesPage() {
  return (
    <div className="fu">
      <PageHeader eyebrow="Community" title="Offline Circles" action={<Badge color="#7C3AED" bg="#EDE9FE">4 upcoming</Badge>} />
      <p style={{ fontSize: 13, color: "var(--m)", marginBottom: 24 }}>Real-world gatherings. Walk, talk, and heal together in person.</p>
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {OFFLINE_EVENTS.map((ev, i) => (
          <Card key={ev.name} className="fu" style={{ animationDelay: `${i * 0.07}s` }}>
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <div style={{ width: 56, height: 56, borderRadius: 14, background: "var(--pp)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, flexShrink: 0 }}>{ev.e}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 3 }}>{ev.name}</div>
                <div style={{ fontSize: 12, color: "var(--m)", marginBottom: 3 }}>📍 {ev.loc}</div>
                <div style={{ display: "flex", gap: 10, fontSize: 11, color: "var(--m)" }}>
                  <span>🕐 {ev.time}</span>
                  <span>👥 {ev.members} members</span>
                  <span style={{ color: "#059669", fontWeight: 600 }}>{ev.spots} spots left</span>
                </div>
              </div>
              <Btn primary>RSVP →</Btn>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

// PLACEHOLDER PAGE
function PlaceholderPage({ id, title, eyebrow, desc, icon }) {
  return (
    <div className="fu" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: 400, textAlign: "center", gap: 16 }}>
      <div style={{ fontSize: 56 }}>{icon}</div>
      <h1 style={{ fontFamily: "'Fraunces',serif", fontSize: 28, fontWeight: 400, color: "var(--t)" }}>{title}</h1>
      <p style={{ fontSize: 14, color: "var(--m)", maxWidth: 360, lineHeight: 1.7 }}>{desc}</p>
      <div style={{ padding: "10px 20px", borderRadius: 30, background: "var(--pp)", color: "var(--p)", fontSize: 12, fontWeight: 600 }}>Coming soon</div>
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function SaathyApp() {
  const [page, setPage] = useState("dashboard");
  const [mood, setMood] = useState(null);
  const [collapsed, setCollapsed] = useState(false);
  const mainRef = useRef(null);

  const navigate = (pg) => {
    setPage(pg);
    mainRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  };

  const PAGE_MAP = {
    "dashboard":       <DashboardPage navigate={navigate} mood={mood} setMood={setMood} />,
    "journal":         <JournalPage navigate={navigate} />,
    "saathy-ai":       <SaathyAIPage />,
    "listeners":       <ListenersPage />,
    "chat":            <ChatPage />,
    "calls":           <CallsPage />,
    "daily-pulse":     <DailyPulsePage />,
    "memory":          <MemoryPage />,
    "growth-path":     <GrowthPathPage />,
    "circles":         <CirclesPage />,
    "community-rooms": <CommunityRoomsPage />,
    "offline":         <OfflineCirclesPage />,
  };

  const currentPageEl = PAGE_MAP[page] || (
    <PlaceholderPage id={page} title="Coming Soon" eyebrow="" desc="This section is being thoughtfully built." icon="🌱" />
  );

  return (
    <>
      <style>{GLOBAL_CSS}</style>
      <div style={{ display: "flex", minHeight: "100vh" }}>

        {/* ── SIDEBAR ── */}
        <aside style={{
          width: collapsed ? 68 : 210, minWidth: collapsed ? 68 : 210,
          background: "#fff", borderRight: "1px solid var(--b)",
          display: "flex", flexDirection: "column", padding: collapsed ? "20px 10px" : "20px 14px",
          position: "sticky", top: 0, height: "100vh", overflowY: "auto", overflowX: "hidden",
          transition: "all 0.3s cubic-bezier(.4,0,.2,1)", zIndex: 100,
        }}>
          {/* LOGO */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 24, overflow: "hidden" }}>
            <div style={{ width: 30, height: 30, background: "var(--p)", borderRadius: 9, display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: 15, flexShrink: 0 }}>💜</div>
            {!collapsed && (
              <div>
                <div style={{ fontFamily: "'Fraunces',serif", fontSize: 18, fontWeight: 700, color: "var(--p)", lineHeight: 1 }}>Saathy</div>
                <div style={{ fontSize: 9, color: "var(--m)", textTransform: "uppercase", letterSpacing: 1 }}>With you · Always</div>
              </div>
            )}
          </div>

          {/* NAV */}
          <div style={{ flex: 1 }}>
            {NAV_SECTIONS.map(sec => (
              <div key={sec.label} style={{ marginBottom: 18 }}>
                {!collapsed && (
                  <div style={{ fontSize: 9, fontWeight: 700, textTransform: "uppercase", letterSpacing: "1.2px", color: "var(--m)", padding: "0 8px", marginBottom: 3 }}>
                    {sec.label}
                  </div>
                )}
                {sec.items.map(item => {
                  const active = page === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => navigate(item.id)}
                      title={collapsed ? item.name : ""}
                      style={{
                        display: "flex", alignItems: "center", gap: 8,
                        padding: collapsed ? "8px" : "8px 10px",
                        justifyContent: collapsed ? "center" : "flex-start",
                        borderRadius: "var(--rs)", border: "none",
                        background: active ? "var(--pp)" : "none",
                        color: active ? "var(--p)" : "var(--m)",
                        fontSize: 12, fontWeight: active ? 600 : 400,
                        cursor: "pointer", width: "100%", textAlign: "left",
                        marginBottom: 1,
                        transition: "var(--tr)",
                        overflow: "hidden",
                      }}
                      onMouseEnter={e => { if (!active) { e.currentTarget.style.background = "var(--pp)"; e.currentTarget.style.color = "var(--p)"; e.currentTarget.style.transform = "translateX(2px)"; } }}
                      onMouseLeave={e => { if (!active) { e.currentTarget.style.background = "none"; e.currentTarget.style.color = "var(--m)"; e.currentTarget.style.transform = ""; } }}
                    >
                      <span style={{ fontSize: 16, flexShrink: 0 }}>{item.icon}</span>
                      {!collapsed && <span style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{item.name}</span>}
                      {!collapsed && active && <span style={{ width: 5, height: 5, background: "var(--p)", borderRadius: "50%", marginLeft: "auto", flexShrink: 0 }} />}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>

          {/* FOOTER */}
          <div style={{ borderTop: "1px solid var(--b)", paddingTop: 12 }}>
            <button
              onClick={() => setCollapsed(!collapsed)}
              style={{ display: "flex", alignItems: "center", gap: 8, padding: "7px 8px", borderRadius: "var(--rs)", border: "none", background: "none", cursor: "pointer", color: "var(--m)", fontSize: 12, width: "100%", justifyContent: collapsed ? "center" : "flex-start", marginBottom: 8, transition: "var(--tr)" }}
              onMouseEnter={e => { e.currentTarget.style.background = "var(--pp)"; e.currentTarget.style.color = "var(--p)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "none"; e.currentTarget.style.color = "var(--m)"; }}
            >
              <span style={{ fontSize: 14 }}>{collapsed ? "▶" : "◀"}</span>
              {!collapsed && <span>Collapse</span>}
            </button>
            {!collapsed && (
              <div style={{ display: "flex", alignItems: "center", gap: 8, padding: 9, borderRadius: "var(--rs)", background: "var(--pp)" }}>
                <div style={{ width: 28, height: 28, borderRadius: "50%", background: "var(--p)", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: 10, fontWeight: 700, flexShrink: 0 }}>AS</div>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 600, color: "var(--p)" }}>Aanya Sharma</div>
                  <div style={{ fontSize: 9, color: "var(--m)" }}>Day 23 · Showing up</div>
                </div>
              </div>
            )}
          </div>
        </aside>

        {/* ── MAIN ── */}
        <main ref={mainRef} style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column" }}>
          {/* TOPNAV */}
          <header style={{ display: "flex", alignItems: "center", gap: 14, padding: "13px 28px", background: "#fff", borderBottom: "1px solid var(--b)", position: "sticky", top: 0, zIndex: 50 }}>
            <div style={{ position: "relative", flex: 1, maxWidth: 340 }}>
              <span style={{ position: "absolute", left: 11, top: "50%", transform: "translateY(-50%)", fontSize: 13 }}>🔍</span>
              <input placeholder="Search circles, journals, experts..." style={{ width: "100%", padding: "8px 14px 8px 32px", border: "1.5px solid var(--b)", borderRadius: 30, background: "var(--bg)", fontSize: 12, color: "var(--t)", outline: "none", transition: "var(--tr)" }}
                onFocus={e => { e.target.style.borderColor = "var(--p)"; e.target.style.boxShadow = "0 0 0 3px rgba(124,58,237,.1)"; }}
                onBlur={e => { e.target.style.borderColor = "var(--b)"; e.target.style.boxShadow = ""; }} />
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginLeft: "auto" }}>
              <button style={{ position: "relative", background: "none", border: "none", fontSize: 17, width: 34, height: 34, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 9, cursor: "pointer", transition: "var(--tr)" }}
                onMouseEnter={e => { e.currentTarget.style.background = "var(--pp)"; e.currentTarget.style.transform = "scale(1.1)"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "none"; e.currentTarget.style.transform = ""; }}>
                🔔
                <span style={{ position: "absolute", top: 2, right: 2, width: 14, height: 14, background: "#EF4444", color: "white", borderRadius: "50%", fontSize: 8, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", border: "2px solid white" }}>3</span>
              </button>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ width: 32, height: 32, borderRadius: "50%", background: "var(--p)", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: 11, fontWeight: 600 }}>AS</div>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 600 }}>Aanya Sharma</div>
                  <div style={{ fontSize: 10, color: "var(--m)" }}>Day 23 · Showing up</div>
                </div>
              </div>
            </div>
          </header>

          {/* PAGE CONTENT */}
          <div key={page} style={{ padding: "26px 28px", flex: 1 }}>
            {currentPageEl}
          </div>

          <div style={{ padding: "14px 28px", textAlign: "center", fontSize: 10, color: "var(--m)", borderTop: "1px solid var(--b)", background: "#fff" }}>
            Saathy · Crafted with care · You are not alone.
          </div>
        </main>
      </div>
    </>
  );
}