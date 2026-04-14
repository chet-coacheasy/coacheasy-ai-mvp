"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import CoachHeroCard from "@/components/CoachHeroCard";
import DanielleWidget from "@/components/DanielleWidget.jsx";
import "./athlete.css";

/* ── Coach Data (for chat cards) ── */
const coachDB = {
  hockey: [
    { id: "velocity-hockey", name: "Velocity Hockey Academy", initials: "VH", location: "Montréal, QC", rating: 4.9, tags: ["Power Skating", "Elite Skills"], price: 85, badge: "Verified" },
    { id: "kayla-tutino", name: "Kayla Tutino", initials: "KT", location: "Montréal, QC", rating: 4.8, tags: ["Power Skating", "Skating & Edge Work"], price: 95, badge: "Verified" },
    { id: "martin-lee", name: "Martin Lee", initials: "ML", location: "Brossard, QC", rating: 4.7, tags: ["AAA Power Skating"], price: 75, badge: "Verified" },
    { id: "if-power-elite", name: "iF Power Elite", initials: "iF", location: "Ottawa, ON", rating: 5.0, tags: ["AAA Power Skating"], price: 110, badge: "Featured" },
  ],
  soccer: [
    { id: "ali-gerba", name: "Ali Gerba", initials: "AG", location: "Montréal, QC", rating: 4.9, tags: ["Elite Striker Training"], price: 90, badge: "Verified" },
    { id: "patrice-bernier", name: "Patrice Bernier", initials: "PB", location: "Montréal, QC", rating: 5.0, tags: ["Youth Development"], price: 100, badge: "Featured" },
    { id: "galaxy-soccer", name: "Galaxy Soccer Academy", initials: "GS", location: "Brossard, QC", rating: 4.7, tags: ["Team Training"], price: 70, badge: "Verified" },
    { id: "dead-fc", name: "Dead FC", initials: "DF", location: "Montréal, QC", rating: 4.8, tags: ["Skills Academy"], price: 80, badge: "Verified" },
  ],
  basketball: [
    { id: "toronto-basketball", name: "Toronto Basketball Academy", initials: "TB", location: "Toronto, ON", rating: 4.8, tags: ["Skills & Drills", "AAU Prep"], price: 80, badge: "Verified" },
    { id: "ottawa-hoops", name: "Ottawa Hoops Training", initials: "OH", location: "Ottawa, ON", rating: 4.7, tags: ["Shooting Clinics"], price: 75, badge: "Verified" },
    { id: "raptors-youth", name: "Raptors Youth Camp", initials: "RY", location: "Toronto, ON", rating: 4.9, tags: ["Youth Development"], price: 95, badge: "Featured" },
  ],
  fitness: [
    { id: "eagle-athletics", name: "Eagle Athletics", initials: "EA", location: "Toronto, ON", rating: 4.9, tags: ["S&C", "Sport-Specific"], price: 85, badge: "Verified" },
    { id: "peak-performance", name: "Peak Performance S&C", initials: "PP", location: "Ottawa, ON", rating: 4.8, tags: ["Athletic Performance"], price: 90, badge: "Verified" },
    { id: "iron-north", name: "Iron North Fitness", initials: "IN", location: "Mississauga, ON", rating: 4.7, tags: ["Strength Training"], price: 70, badge: "Verified" },
  ],
};

function detectSport(text) {
  const lower = text.toLowerCase();
  if (/hockey|skating|goalie|puck/.test(lower)) return "hockey";
  if (/soccer|football|striker|midfield/.test(lower)) return "soccer";
  if (/basketball|hoops|dunk|shooting/.test(lower)) return "basketball";
  if (/fitness|strength|conditioning|s&c|gym/.test(lower)) return "fitness";
  return null;
}

function shouldShowCards(text) {
  const lower = text.toLowerCase();
  return /session|coach|camp|clinic|training|weekend|this week|near me|find|show me|skating|hockey|soccer|basketball|fitness/.test(lower);
}

function ChatCoachCard({ coach, onBookNow }) {
  return (
    <div className="coach-card">
      <div className="coach-card-img">
        <div className="coach-card-initials">{coach.initials}</div>
        <span className="coach-card-badge">{coach.badge}</span>
      </div>
      <div className="coach-card-body">
        <div className="coach-card-name">{coach.name}</div>
        <div className="coach-card-rating">&#9733; {coach.rating}</div>
        <div className="coach-card-loc">{coach.location}</div>
        <div className="coach-card-tags">
          {coach.tags.map((t) => (
            <span key={t} className="coach-card-tag">{t}</span>
          ))}
        </div>
        <div className="coach-card-foot">
          <span className="coach-card-price">
            ${coach.price}<span>/session</span>
          </span>
          <button className="coach-card-book" onClick={() => onBookNow(coach.id)}>Book Now</button>
        </div>
      </div>
    </div>
  );
}

const INITIAL_MESSAGE = {
  role: "assistant",
  content:
    'Hi! I\'m Coach Danielle, your AI training assistant. Tell me what you\'re looking for — I\'ll find the best sessions and coaches for you. You can ask me anything, like "find me a power skating clinic this weekend" or "what hockey camps are available in March?"',
  id: "initial",
};

const suggestedPrompts = [
  "Find me sessions this weekend",
  "What hockey camps are near me?",
  "Show me AAA-level training",
];

const sportOptions = ["Hockey", "Basketball", "Power Skating", "Personal Fitness", "Soccer", "Baseball"];
const levelOptions = ["C/B", "A/AA", "AA/AAA", "AAA", "Elite/Pro"];
const cityOptions = ["Toronto, ON", "Mississauga, ON", "Brampton, ON", "Ottawa, ON", "Newmarket, ON", "Hamilton, ON", "Montréal, QC", "Québec City, QC"];

function formatMessage(text) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={i} style={{ fontWeight: 600 }}>{part.slice(2, -2)}</strong>;
    }
    return part;
  });
}

function parseCoachTag(content) {
  const match = content.match(/\[SHOW_COACHES:(\w+)\]/);
  if (match) {
    const sport = match[1].toLowerCase();
    const cleanContent = content.replace(/\[SHOW_COACHES:\w+\]/, "").trim();
    return { cleanContent, sport };
  }
  return { cleanContent: content, sport: null };
}

export default function AthleteChat() {
  const [messages, setMessages] = useState([INITIAL_MESSAGE]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState({
    sport: "Hockey",
    level: "AA/AAA",
    age: 13,
    city: "Toronto, ON",
  });
  const [showEditModal, setShowEditModal] = useState(false);
  const [editProfile, setEditProfile] = useState({ ...profile });
  const [cardMap, setCardMap] = useState({});
  const [heroModalCoachId, setHeroModalCoachId] = useState(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const lastUserMsgRef = useRef("");

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading, cardMap]);

  const openHeroModal = (coachId) => {
    setHeroModalCoachId(coachId);
  };

  const sendMessage = async (text) => {
    const messageText = text || input.trim();
    if (!messageText || loading) return;

    lastUserMsgRef.current = messageText;

    const userMessage = {
      role: "user",
      content: messageText,
      id: Date.now().toString(),
    };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    const apiMessages = newMessages
      .filter((m) => m.id !== "initial")
      .map((m) => ({ role: m.role, content: m.content }));

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: apiMessages, profile }),
      });

      if (!res.ok) throw new Error("Failed to get response");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();

      const assistantId = (Date.now() + 1).toString();
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "", id: assistantId },
      ]);
      setLoading(false);

      let fullContent = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value);
        fullContent += chunk;
        setMessages((prev) => {
          const updated = [...prev];
          const lastMsg = updated[updated.length - 1];
          updated[updated.length - 1] = {
            ...lastMsg,
            content: lastMsg.content + chunk,
          };
          return updated;
        });
      }

      const { cleanContent, sport: tagSport } = parseCoachTag(fullContent);
      let sportToShow = tagSport;

      if (!sportToShow && shouldShowCards(lastUserMsgRef.current)) {
        sportToShow = detectSport(lastUserMsgRef.current) || detectSport(fullContent);
        if (!sportToShow && shouldShowCards(lastUserMsgRef.current)) {
          sportToShow = "hockey";
        }
      }

      if (sportToShow) {
        setMessages((prev) => {
          const updated = [...prev];
          const lastMsg = updated[updated.length - 1];
          updated[updated.length - 1] = {
            ...lastMsg,
            content: cleanContent,
          };
          return updated;
        });
        setCardMap((prev) => ({ ...prev, [assistantId]: sportToShow }));
      }
    } catch {
      setLoading(false);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "I'm sorry, I'm having trouble connecting right now. Please try again in a moment!",
          id: (Date.now() + 1).toString(),
        },
      ]);
    }

    inputRef.current?.focus();
  };

  const saveProfile = () => {
    setProfile({ ...editProfile });
    setShowEditModal(false);
  };

  return (
    <div className="ath">
      {/* ── Top Bar ── */}
      <header className="ath-topbar">
        <Link href="/" className="ath-logo">
          Coach<span>Easy</span>
        </Link>

        <div className="ath-profile-bar">
          <span><strong>Sport:</strong> {profile.sport}</span>
          <span className="sep">|</span>
          <span><strong>Level:</strong> {profile.level}</span>
          <span className="sep">|</span>
          <span><strong>Age:</strong> {profile.age}</span>
          <span className="sep">|</span>
          <span><strong>Location:</strong> {profile.city}</span>
        </div>

        <div className="ath-right">
          <button
            className="ath-edit-link"
            onClick={() => {
              setEditProfile({ ...profile });
              setShowEditModal(true);
            }}
          >
            Edit Profile
          </button>
          <span className="ath-portal-btn">Athlete Portal</span>
        </div>
      </header>

      {/* ── Chat Area (full width now) ── */}
      <div className="ath-chat">
        <div className="ath-chat-inner">
          {messages.map((msg) => (
            <div key={msg.id}>
              <div className={`ath-msg${msg.role === "user" ? " user" : ""}`}>
                {msg.role === "assistant" && (
                  <div className="ath-avatar">D</div>
                )}
                <div className="ath-bubble">
                  {formatMessage(msg.content)}
                </div>
              </div>
              {/* Coach cards below assistant message */}
              {msg.role === "assistant" && cardMap[msg.id] && (
                <div className="ath-coach-cards">
                  {(coachDB[cardMap[msg.id]] || coachDB.hockey).map((c) => (
                    <ChatCoachCard key={c.name} coach={c} onBookNow={openHeroModal} />
                  ))}
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="ath-typing">
              <div className="ath-avatar">D</div>
              <div className="ath-typing-dots">
                <span className="ath-dot" />
                <span className="ath-dot" />
                <span className="ath-dot" />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* ── Input Area ── */}
      <div className="ath-input-area">
        <div className="ath-input-inner">
          {messages.length <= 1 && (
            <div className="ath-chips">
              {suggestedPrompts.map((sp) => (
                <button
                  key={sp}
                  className="ath-chip"
                  onClick={() => sendMessage(sp)}
                >
                  {sp}
                </button>
              ))}
            </div>
          )}

          <div className="ath-input-row">
            <input
              ref={inputRef}
              type="text"
              className="ath-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Ask Danielle anything..."
              disabled={loading}
            />
            <button
              className="ath-send"
              onClick={() => sendMessage()}
              disabled={loading || !input.trim()}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
              </svg>
            </button>
          </div>

          <p className="ath-footer">Powered by Claude AI</p>
        </div>
      </div>

      {/* ── Hero Card Modal Overlay ── */}
      {heroModalCoachId && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-start justify-center overflow-y-auto py-8">
          <button
            onClick={() => setHeroModalCoachId(null)}
            className="fixed top-4 right-4 z-50 w-10 h-10 rounded-full bg-white/10 text-white flex items-center justify-center text-xl hover:bg-white/20 transition-colors"
          >
            &times;
          </button>
          <div className="max-w-sm w-full">
            <CoachHeroCard coachId={heroModalCoachId} />
          </div>
        </div>
      )}

      {/* ── Edit Profile Modal ── */}
      {showEditModal && (
        <div className="ath-modal-overlay" onClick={() => setShowEditModal(false)}>
          <div className="ath-modal" onClick={(e) => e.stopPropagation()}>
            <h3>Edit Profile</h3>

            <label>Sport</label>
            <select
              value={editProfile.sport}
              onChange={(e) => setEditProfile({ ...editProfile, sport: e.target.value })}
            >
              {sportOptions.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>

            <label>Level</label>
            <select
              value={editProfile.level}
              onChange={(e) => setEditProfile({ ...editProfile, level: e.target.value })}
            >
              {levelOptions.map((l) => <option key={l} value={l}>{l}</option>)}
            </select>

            <label>Age</label>
            <input
              type="number"
              value={editProfile.age}
              onChange={(e) => setEditProfile({ ...editProfile, age: parseInt(e.target.value) || 0 })}
              min="5"
              max="25"
            />

            <label>City</label>
            <select
              value={editProfile.city}
              onChange={(e) => setEditProfile({ ...editProfile, city: e.target.value })}
            >
              {cityOptions.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>

            <div className="ath-modal-btns">
              <button className="ath-modal-save" onClick={saveProfile}>Save</button>
              <button className="ath-modal-cancel" onClick={() => setShowEditModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Danielle Support Widget */}
      <DanielleWidget />
    </div>
  );
}
