/**
 * DanielleWidget — CoachEasy AI Support Chat Widget
 *
 * Embeddable floating chat widget powered by the /api/danielle endpoint.
 *
 * To generate the embeddable script for coacheasy.com:
 *   Option A: `npx next build && npx next export` — reference the bundled output
 *   Option B: Use esbuild to compile standalone:
 *     npx esbuild components/DanielleWidget.jsx --bundle --outfile=public/danielle-embed.js \
 *       --define:process.env.NODE_ENV=\"production\" --format=iife --global-name=DanielleWidget
 *
 * Then add to coacheasy.com:
 *   <script src="https://[your-domain]/danielle-embed.js" defer></script>
 *   <div id="danielle-widget"></div>
 */

"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import ReactDOM from "react-dom/client";

/* ── Constants ── */
const GREETING =
  "Hi! I'm Danielle, CoachEasy's AI assistant. How can I help you today? I can answer questions about booking sessions, finding coaches, payments, and more.";

const HUMAN_SUPPORT_MSG =
  "I'd be happy to connect you with our support team! You can reach us at:\n\n\u{1F4E7} Email: info@coacheasy.com\n\u{1F4DE} Phone: (800) 284-4602 or (514) 819-1013\n\nOur team is available Monday\u2013Friday, 9 AM \u2013 5 PM ET.";

const QUICK_REPLIES = [
  "How do I book a session?",
  "How does payment work?",
  "I need to cancel",
  "Talk to a human",
];

const API_PATH = "/api/danielle";
const AVATAR_SRC = "/danielle-avatar.png";

/* ── Inline Styles ── */
const styles = {
  trigger: {
    position: "fixed",
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: "50%",
    background: "#e53935",
    border: "none",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 4px 16px rgba(0,0,0,0.4)",
    transition: "transform 0.2s ease",
    zIndex: 9999,
  },
  unreadDot: {
    position: "absolute",
    top: 0,
    right: 0,
    width: 14,
    height: 14,
    borderRadius: "50%",
    background: "#4caf50",
    border: "2px solid #111",
  },
  panel: {
    position: "fixed",
    bottom: 92,
    right: 24,
    width: 360,
    height: 520,
    borderRadius: 16,
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
    background: "#111111",
    boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
    zIndex: 9999,
    animation: "danielle-slide-up 0.25s ease-out",
  },
  panelMobile: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: "100%",
    height: "100%",
    borderRadius: 0,
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
    background: "#111111",
    zIndex: 9999,
  },
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    height: 64,
    padding: "0 16px",
    background: "#111111",
    borderBottom: "1px solid #222",
  },
  headerLeft: {
    display: "flex",
    alignItems: "center",
    gap: 12,
  },
  headerAvatar: {
    width: 38,
    height: 38,
    borderRadius: "50%",
    objectFit: "cover",
    border: "2px solid #e53935",
    flexShrink: 0,
  },
  headerTitle: {
    color: "#fff",
    fontSize: 15,
    fontWeight: 600,
    margin: 0,
    lineHeight: 1.2,
  },
  headerSubtitle: {
    color: "#aaaaaa",
    fontSize: 12,
    fontWeight: 400,
    margin: 0,
    lineHeight: 1.2,
  },
  closeBtn: {
    background: "none",
    border: "none",
    color: "#999",
    fontSize: 22,
    cursor: "pointer",
    padding: "0 4px",
    lineHeight: 1,
  },
  messagesArea: {
    flex: 1,
    overflowY: "auto",
    padding: "16px 12px",
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },
  assistantRow: {
    display: "flex",
    alignItems: "flex-start",
    gap: 8,
    alignSelf: "flex-start",
    maxWidth: "90%",
  },
  bubbleAvatar: {
    width: 28,
    height: 28,
    borderRadius: "50%",
    objectFit: "cover",
    flexShrink: 0,
  },
  bubbleAssistant: {
    padding: "10px 14px",
    borderRadius: "14px 14px 14px 4px",
    background: "#1a1a1a",
    color: "#fff",
    fontSize: 14,
    lineHeight: 1.5,
    whiteSpace: "pre-wrap",
    wordBreak: "break-word",
  },
  bubbleUser: {
    maxWidth: "85%",
    padding: "10px 14px",
    borderRadius: "14px 14px 4px 14px",
    background: "#e53935",
    color: "#fff",
    fontSize: 14,
    lineHeight: 1.5,
    alignSelf: "flex-end",
    whiteSpace: "pre-wrap",
    wordBreak: "break-word",
  },
  quickReplies: {
    display: "flex",
    flexWrap: "wrap",
    gap: 6,
    padding: "0 12px 8px",
  },
  chip: {
    padding: "6px 12px",
    borderRadius: 20,
    border: "1px solid #333",
    background: "#1a1a1a",
    color: "#ccc",
    fontSize: 12,
    cursor: "pointer",
    transition: "background 0.15s, color 0.15s",
  },
  inputArea: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    padding: "10px 12px",
    borderTop: "1px solid #222",
    background: "#111111",
  },
  input: {
    flex: 1,
    padding: "10px 14px",
    borderRadius: 24,
    border: "1px solid #333",
    background: "#1a1a1a",
    color: "#fff",
    fontSize: 14,
    outline: "none",
  },
  sendBtn: {
    width: 38,
    height: 38,
    borderRadius: "50%",
    border: "none",
    background: "#e53935",
    color: "#fff",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  typingDots: {
    display: "flex",
    gap: 4,
    padding: "10px 14px",
    alignSelf: "flex-start",
    background: "#1a1a1a",
    borderRadius: "14px 14px 14px 4px",
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: "50%",
    background: "#666",
  },
};

/* ── CSS keyframes injected once ── */
let stylesInjected = false;
function injectKeyframes() {
  if (stylesInjected) return;
  stylesInjected = true;
  const sheet = document.createElement("style");
  sheet.textContent = `
    @keyframes danielle-slide-up {
      from { opacity: 0; transform: translateY(16px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    @keyframes danielle-bounce {
      0%, 80%, 100% { transform: translateY(0); }
      40% { transform: translateY(-5px); }
    }
  `;
  document.head.appendChild(sheet);
}

/* ── Chat Icon SVG ── */
function ChatIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}

/* ── Send Icon SVG ── */
function SendIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="22" y1="2" x2="11" y2="13" />
      <polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
  );
}

/* ── Typing Indicator ── */
function TypingIndicator() {
  return (
    <div style={styles.typingDots}>
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          style={{
            ...styles.dot,
            animation: `danielle-bounce 1.2s ease-in-out ${i * 0.15}s infinite`,
          }}
        />
      ))}
    </div>
  );
}

/* ── Main Widget Component ── */
export default function DanielleWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showQuickReplies, setShowQuickReplies] = useState(true);
  const [hasGreeted, setHasGreeted] = useState(false);
  const [hoverTrigger, setHoverTrigger] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    injectKeyframes();
    const check = () => setIsMobile(window.innerWidth < 480);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
    }
  }, [open]);

  /* Load greeting on first open */
  const handleOpen = useCallback(() => {
    setOpen(true);
    if (!hasGreeted) {
      setMessages([{ role: "assistant", content: GREETING }]);
      setHasGreeted(true);
    }
  }, [hasGreeted]);

  /* Send message */
  const sendMessage = useCallback(
    async (text) => {
      const trimmed = text.trim();
      if (!trimmed || isTyping) return;

      /* "Talk to a human" shortcut */
      if (trimmed === "Talk to a human") {
        setMessages((prev) => [
          ...prev,
          { role: "user", content: trimmed },
          { role: "assistant", content: HUMAN_SUPPORT_MSG },
        ]);
        setShowQuickReplies(false);
        setInput("");
        return;
      }

      const userMsg = { role: "user", content: trimmed };
      const updatedHistory = [...messages, userMsg];

      setMessages(updatedHistory);
      setInput("");
      setIsTyping(true);
      setShowQuickReplies(false);

      try {
        const res = await fetch(API_PATH, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages: updatedHistory }),
        });

        if (!res.ok) {
          const errorData = await res.json().catch(() => null);
          const errorMsg =
            errorData?.error ||
            "I'm having trouble connecting right now. Please contact us at info@coacheasy.com or call (800) 284-4602.";
          setMessages((prev) => [
            ...prev,
            { role: "assistant", content: errorMsg },
          ]);
          setIsTyping(false);
          return;
        }

        const reader = res.body?.getReader();
        if (!reader) throw new Error("No reader");
        const decoder = new TextDecoder();
        let assistantContent = "";

        /* Append a placeholder assistant message */
        setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          assistantContent += decoder.decode(value, { stream: true });
          const snapshot = assistantContent;
          setMessages((prev) => {
            const copy = [...prev];
            copy[copy.length - 1] = { role: "assistant", content: snapshot };
            return copy;
          });
        }

        setIsTyping(false);
      } catch (err) {
        setMessages((prev) => [
          ...prev.filter((m) => m.content !== ""),
          {
            role: "assistant",
            content:
              "I'm having trouble connecting right now. Please contact us at info@coacheasy.com or call (800) 284-4602.",
          },
        ]);
        setIsTyping(false);
      }
    },
    [messages, isTyping],
  );

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  /* ── Render ── */
  return (
    <>
      {/* Trigger button */}
      {!open && (
        <button
          onClick={handleOpen}
          onMouseEnter={() => setHoverTrigger(true)}
          onMouseLeave={() => setHoverTrigger(false)}
          style={{
            ...styles.trigger,
            transform: hoverTrigger ? "scale(1.05)" : "scale(1)",
          }}
          aria-label="Open support chat"
        >
          <ChatIcon />
          {hasGreeted && <div style={styles.unreadDot} />}
        </button>
      )}

      {/* Chat panel */}
      {open && (
        <div style={isMobile ? styles.panelMobile : styles.panel}>
          {/* Header */}
          <div style={styles.header}>
            <div style={styles.headerLeft}>
              <img src={AVATAR_SRC} alt="Danielle" style={styles.headerAvatar} />
              <div>
                <p style={styles.headerTitle}>Assistant Coach Danielle</p>
                <p style={styles.headerSubtitle}>CE's Virtual Assistant Coach</p>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              style={styles.closeBtn}
              aria-label="Close chat"
            >
              &#x2715;
            </button>
          </div>

          {/* Messages */}
          <div style={styles.messagesArea}>
            {messages.map((msg, i) =>
              msg.role === "assistant" ? (
                <div key={i} style={styles.assistantRow}>
                  <img src={AVATAR_SRC} alt="Danielle" style={styles.bubbleAvatar} />
                  <div style={styles.bubbleAssistant}>{msg.content}</div>
                </div>
              ) : (
                <div key={i} style={styles.bubbleUser}>
                  {msg.content}
                </div>
              )
            )}
            {isTyping && (
              <div style={styles.assistantRow}>
                <img src={AVATAR_SRC} alt="Danielle" style={styles.bubbleAvatar} />
                <TypingIndicator />
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick replies */}
          {showQuickReplies && messages.length === 1 && (
            <div style={styles.quickReplies}>
              {QUICK_REPLIES.map((text) => (
                <button
                  key={text}
                  style={styles.chip}
                  onMouseEnter={(e) => {
                    e.target.style.background = "#e53935";
                    e.target.style.color = "#fff";
                    e.target.style.borderColor = "#e53935";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = "#1a1a1a";
                    e.target.style.color = "#ccc";
                    e.target.style.borderColor = "#333";
                  }}
                  onClick={() => sendMessage(text)}
                >
                  {text}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div style={styles.inputArea}>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type a message..."
              style={styles.input}
              disabled={isTyping}
            />
            <button
              onClick={() => sendMessage(input)}
              style={{
                ...styles.sendBtn,
                opacity: input.trim() && !isTyping ? 1 : 0.5,
              }}
              disabled={!input.trim() || isTyping}
              aria-label="Send message"
            >
              <SendIcon />
            </button>
          </div>
        </div>
      )}
    </>
  );
}

/* ── Embed helper ── */
export function initDanielle() {
  if (typeof window === "undefined") return;

  let container = document.getElementById("danielle-widget");
  if (!container) {
    container = document.createElement("div");
    container.id = "danielle-widget";
    document.body.appendChild(container);
  }

  const root = ReactDOM.createRoot(container);
  root.render(React.createElement(DanielleWidget));
}
