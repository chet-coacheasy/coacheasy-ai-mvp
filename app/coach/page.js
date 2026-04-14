"use client";

import { useState } from "react";
import Link from "next/link";
import { saveSession as saveToStore } from "@/lib/coach-profile-store";
import "./coach.css";

const sidebarItems = [
  { icon: "📊", label: "Dashboard", href: "/coach/dashboard" },
  { icon: "🏒", label: "My Sessions", href: "#" },
  { icon: "👥", label: "Athletes", href: "#" },
  { icon: "💰", label: "Revenue", href: "#" },
  { icon: "🤖", label: "AI Tools", href: "#", active: true },
  { icon: "💬", label: "Messages", href: "#" },
  { icon: "⚙️", label: "Settings", href: "#" },
  { icon: "👤", label: "Coach Profile", href: "/coach/settings/profile" },
];

const examplePrompts = [
  "Power skating camp for AA bantam girls, weekday evenings in Mississauga, $65",
  "Basketball skills training for teens, Saturday mornings Ottawa, small group max 8, $50",
  "Personal fitness strength & conditioning for elite hockey players 15-18, Newmarket, $55",
];

const athleteGroups = [
  { key: "basketball_teens", name: "Basketball \u2013 Teens 13\u201317", initials: "BB", color: "bb", location: "Ottawa", level: "C/B", count: 12 },
  { key: "hockey_aa_bantam", name: "Hockey \u2013 AA Bantam Girls", initials: "HK", color: "hk", location: "Mississauga", level: "AA", count: 9 },
  { key: "fitness_hockey", name: "Fitness \u2013 Hockey Players 15\u201318", initials: "FT", color: "ft", location: "Newmarket", level: "Elite", count: 11 },
];

const COACH_NAME = "Tim Turk";

function EditableSessionCard({ session, onChange }) {
  const update = (field, value) => onChange({ ...session, [field]: value });

  return (
    <div className="csc-card">
      {session.badgeLabel && (
        <span className="csc-card-badge">{session.badgeLabel}</span>
      )}
      <input
        className="csc-inline-field csc-inline-title"
        value={session.title || ""}
        onChange={(e) => update("title", e.target.value)}
      />
      <div className="csc-card-price-wrap">
        <span className="csc-card-price-dollar">$</span>
        <input
          className="csc-inline-field csc-inline-price"
          type="number"
          value={session.price || ""}
          onChange={(e) => update("price", Number(e.target.value))}
        />
        <span className="csc-card-price-label">/ session</span>
      </div>
      <div className="csc-card-rows">
        {[
          { icon: "🏅", label: "Sport", field: "sport" },
          { icon: "👤", label: "Age Group", field: "ageGroup" },
          { icon: "📊", label: "Level", field: "level" },
          { icon: "📋", label: "Format", field: "format" },
          { icon: "📅", label: "Schedule", field: "schedule" },
          { icon: "📍", label: "Location", field: "location" },
          { icon: "👥", label: "Max Athletes", field: "maxAthletes" },
        ].map((row) => (
          <div className="csc-card-row" key={row.field}>
            <span className="csc-card-row-icon">{row.icon}</span>
            <div style={{ flex: 1 }}>
              <div className="csc-card-row-label">{row.label}</div>
              <input
                className="csc-inline-field"
                value={session[row.field] ?? ""}
                onChange={(e) => update(row.field, row.field === "maxAthletes" ? Number(e.target.value) || e.target.value : e.target.value)}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function CoachSessionCreator() {
  const [prompt, setPrompt] = useState("");
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState("");
  const [published, setPublished] = useState(false);

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [modalStep, setModalStep] = useState(1);

  // Step 1 — match group
  const [groupDesc, setGroupDesc] = useState("");
  const [matchLoading, setMatchLoading] = useState(false);
  const [matchSent, setMatchSent] = useState(false);
  const [matchUserMsg, setMatchUserMsg] = useState("");
  const [matchReply, setMatchReply] = useState("");
  const [selectedGroup, setSelectedGroup] = useState(null);

  // Step 2 — email
  const [emailLoading, setEmailLoading] = useState(false);
  const [emailDraft, setEmailDraft] = useState("");
  const [emailSubject, setEmailSubject] = useState("");

  const generateSession = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setError("");
    setSession(null);
    setPublished(false);

    try {
      const res = await fetch("/api/engine", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "generate_session", prompt: prompt.trim() }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to generate session");
      }
      const data = await res.json();
      setSession(data.session);
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const publishSession = () => {
    // Save session to coach profile store
    const coachId = typeof window !== "undefined" ? (localStorage.getItem("coacheasy_coach") || "tim-turk") : "tim-turk";
    const storeSession = {
      id: `session-${Date.now()}`,
      coachId,
      title: session.title || "Untitled Session",
      sport: session.sport || "Hockey",
      level: session.level || "All levels",
      ageRange: session.ageGroup || "All ages",
      sessionType: session.format || "Single",
      price: session.price || 0,
      priceLabel: "per athlete",
      date: session.schedule || "TBD",
      dateShort: session.schedule ? session.schedule.slice(0, 12) : "TBD",
      time: session.schedule || "TBD",
      duration: "60 min",
      location: session.location || "TBD",
      spotsTotal: session.maxAthletes || 12,
      spotsLeft: session.maxAthletes || 12,
      description: `${session.title} — ${session.sport || "Sports"} session for ${session.ageGroup || "all ages"} at ${session.level || "all"} level. ${session.format || "Single session"} format.`,
      status: "live",
      createdAt: new Date().toISOString(),
    };
    saveToStore(storeSession);

    setPublished(true);
    setToastMsg("Session published successfully!");
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const openModal = () => {
    setModalOpen(true);
    setModalStep(1);
    resetMatchState();
    setEmailDraft("");
    setEmailSubject("");
    setEmailLoading(false);
  };

  const resetMatchState = () => {
    setGroupDesc("");
    setMatchLoading(false);
    setMatchSent(false);
    setMatchUserMsg("");
    setMatchReply("");
    setSelectedGroup(null);
  };

  const askDanielle = async () => {
    if (!groupDesc.trim()) return;
    setMatchUserMsg(groupDesc.trim());
    setMatchSent(true);
    setMatchLoading(true);
    setMatchReply("");
    setSelectedGroup(null);

    try {
      const res = await fetch("/api/engine", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "match_group",
          coachName: COACH_NAME,
          groups: athleteGroups,
          description: groupDesc.trim(),
        }),
      });
      if (!res.ok) throw new Error("Failed");
      const data = await res.json();
      setMatchReply(data.message);
      if (data.selectedGroup) {
        const g = athleteGroups.find((x) => x.key === data.selectedGroup);
        setSelectedGroup(g || { key: data.selectedGroup, name: data.selectedGroup, count: 0, initials: "??", color: "hk" });
      }
    } catch {
      setMatchReply("Sorry, could you be more specific about which group?");
    } finally {
      setMatchLoading(false);
    }
  };

  const prefillGroup = (g) => {
    setGroupDesc(`${g.name} — ${g.location}, ${g.level} level, ${g.count} athletes`);
  };

  const goToStep2 = async () => {
    setModalStep(2);
    setEmailLoading(true);
    setEmailSubject(`New session: ${session.title} \u2013 ${session.schedule}, ${session.location}`);

    try {
      const res = await fetch("/api/engine", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "draft_email",
          session,
          coachName: COACH_NAME,
          groupName: selectedGroup.name,
        }),
      });
      if (!res.ok) throw new Error("Failed");
      const data = await res.json();
      setEmailDraft(data.email);
    } catch {
      setEmailDraft("Failed to generate email draft. Please try again.");
    } finally {
      setEmailLoading(false);
    }
  };

  const sendEmail = () => {
    setModalOpen(false);
    setToastMsg(`Email sent to ${selectedGroup.name}`);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const fakeEmails = ["j.morrison@mail.com", "s.chen@mail.com", "l.patel@mail.com"];

  return (
    <div className="csc">
      {/* ── Top Nav ── */}
      <header className="csc-topnav">
        <div className="csc-topnav-left">
          <Link href="/" className="csc-logo">Coach<span>Easy</span></Link>
          <span className="csc-nav-label">AI Session Creator</span>
        </div>
        <div className="csc-topnav-right">
          <div className="csc-pill">
            <div className="csc-pill-avatar">TT</div>
            <span className="csc-pill-name">{COACH_NAME}</span>
          </div>
        </div>
      </header>

      {/* ── Sidebar ── */}
      <aside className="csc-sidebar">
        {sidebarItems.map((item) => (
          <Link key={item.label} href={item.href} className={`csc-sidebar-item${item.active ? " active" : ""}`}>
            <span className="csc-sidebar-icon">{item.icon}</span>
            {item.label}
          </Link>
        ))}
      </aside>

      {/* ── Main ── */}
      <main className="csc-main">
        <div className="csc-grid">
          {/* Left: Input */}
          <div className="csc-panel">
            <div className="csc-panel-title">Create a Session with AI</div>
            <div className="csc-panel-sub">Describe your session and let AI do the rest.</div>
            <textarea
              className="csc-textarea"
              placeholder='Describe your session in plain English... e.g. "AAA hockey shooting clinic for 10-13 year olds, Sunday mornings at Canlan Toronto, $80 per session"'
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />
            <button className="csc-gen-btn" onClick={generateSession} disabled={loading || !prompt.trim()}>
              {loading ? "Generating..." : "Generate Session"}
            </button>
            <div className="csc-examples-label">Try an example:</div>
            <div className="csc-examples">
              {examplePrompts.map((ep, i) => (
                <button key={i} className="csc-example" onClick={() => setPrompt(ep)}>
                  &ldquo;{ep}&rdquo;
                </button>
              ))}
            </div>
          </div>

          {/* Right: Preview */}
          <div className="csc-panel">
            <div className="csc-panel-title-row">
              <span className="csc-panel-title">Session Preview</span>
              {session && !loading && <span className="csc-edit-hint">click any field to edit</span>}
            </div>
            <div className="csc-panel-sub">Your AI-generated session will appear here.</div>

            {loading && (
              <div className="csc-loading">
                <div className="csc-loading-dots"><span className="csc-loading-dot" /><span className="csc-loading-dot" /><span className="csc-loading-dot" /></div>
                <span className="csc-loading-text">Generating your session...</span>
              </div>
            )}
            {error && <div className="csc-error"><p>{error}</p><p className="sub">Try adjusting your description.</p></div>}
            {!loading && !error && !session && (
              <div className="csc-preview-empty"><div className="csc-preview-empty-icon">✨</div><p>Your session preview will appear here</p><p className="sub">Describe a session on the left to get started</p></div>
            )}
            {!loading && session && (
              <>
                <EditableSessionCard session={session} onChange={setSession} />
                <button className="csc-publish" onClick={publishSession}>Publish Session</button>
                <button className="csc-send-group-btn" onClick={openModal}>Send to athlete group</button>
                <button className="csc-regen" onClick={generateSession}>↻ Regenerate</button>
                {published && <Link href="/coach/dashboard" className="csc-dashboard-link">View Dashboard →</Link>}
              </>
            )}
          </div>
        </div>
      </main>

      {/* ══ MODAL ══ */}
      {modalOpen && (
        <div className="csc-modal-overlay" onClick={() => setModalOpen(false)}>
          <div className="csc-modal" onClick={(e) => e.stopPropagation()}>
            <div className="csc-modal-body">
              {modalStep === 1 && (
                <>
                  <div className="csc-modal-title">Send to athlete group</div>
                  <div className="csc-modal-sub">Describe who should receive this session, or pick from the examples below.</div>

                  {!matchSent ? (
                    <>
                      <textarea
                        className="csc-modal-ta"
                        placeholder="Describe who should receive this session\u2026"
                        value={groupDesc}
                        onChange={(e) => setGroupDesc(e.target.value)}
                      />
                      <button className="csc-ask-btn" onClick={askDanielle} disabled={!groupDesc.trim()}>Ask Danielle</button>

                      <div className="csc-modal-examples-label">TRY AN EXAMPLE:</div>
                      <div className="csc-modal-groups">
                        {athleteGroups.map((g) => (
                          <div key={g.key} className="csc-modal-group-card" onClick={() => prefillGroup(g)}>
                            <div className={`csc-modal-group-avatar ${g.color}`}>{g.initials}</div>
                            <div className="csc-modal-group-info">
                              <div className="csc-modal-group-name">{g.name}</div>
                              <div className="csc-modal-group-meta">{g.location} · {g.level} level · {g.count} athletes</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  ) : (
                    <div className="csc-modal-chat">
                      <div className="csc-modal-user-bubble">{matchUserMsg}</div>

                      {matchLoading && (
                        <div className="csc-modal-typing">
                          <span className="csc-modal-typing-dot" />
                          <span className="csc-modal-typing-dot" />
                          <span className="csc-modal-typing-dot" />
                        </div>
                      )}

                      {matchReply && (
                        <>
                          <div className="csc-modal-danielle-label">DANIELLE</div>
                          <div className="csc-modal-danielle-bubble">{matchReply}</div>
                        </>
                      )}

                      {selectedGroup && (
                        <div className="csc-matched-card">
                          <div className={`csc-modal-group-avatar ${selectedGroup.color || "hk"}`}>{selectedGroup.initials || "??"}</div>
                          <div className="csc-matched-info">
                            <div className="csc-matched-name">{selectedGroup.name}</div>
                            <div className="csc-matched-count">{selectedGroup.count} athletes</div>
                          </div>
                          <span className="csc-matched-check">✓</span>
                        </div>
                      )}

                      {!matchLoading && (
                        <button className="csc-ask-diff" onClick={() => { resetMatchState(); }}>
                          ← Ask differently
                        </button>
                      )}
                    </div>
                  )}
                </>
              )}

              {modalStep === 2 && (
                <>
                  <div className="csc-modal-title">Preview &amp; send email</div>
                  <div className="csc-modal-sub">Review the email Danielle drafted for {selectedGroup?.name}.</div>

                  {emailLoading ? (
                    <div className="csc-email-spinner">
                      <div className="csc-modal-typing">
                        <span className="csc-modal-typing-dot" />
                        <span className="csc-modal-typing-dot" />
                        <span className="csc-modal-typing-dot" />
                      </div>
                      <span className="csc-email-spinner-text">Danielle is drafting your email…</span>
                    </div>
                  ) : (
                    <>
                      <div className="csc-email-recipients">
                        {fakeEmails.map((e) => <span key={e} className="csc-email-pill">{e}</span>)}
                        <span className="csc-email-pill">+{(selectedGroup?.count || 6) - 3} more</span>
                      </div>
                      <input
                        className="csc-email-subject"
                        value={emailSubject}
                        onChange={(e) => setEmailSubject(e.target.value)}
                        placeholder="Subject line..."
                      />
                      <textarea
                        className="csc-email-body"
                        value={emailDraft}
                        onChange={(e) => setEmailDraft(e.target.value)}
                      />
                    </>
                  )}
                </>
              )}
            </div>

            {/* Progress */}
            <div className="csc-modal-progress">
              <div className="csc-modal-progress-bar">
                <div className="csc-modal-progress-seg filled" />
                <div className={`csc-modal-progress-seg${modalStep === 2 ? " filled" : ""}`} />
              </div>
              <div className="csc-modal-progress-label">Step {modalStep} of 2</div>
            </div>

            {/* Footer */}
            <div className="csc-modal-footer">
              {modalStep === 1 ? (
                <>
                  <button className="csc-modal-cancel" onClick={() => setModalOpen(false)}>Cancel</button>
                  <button className="csc-modal-next" onClick={goToStep2} disabled={!selectedGroup}>
                    Next: preview email →
                  </button>
                </>
              ) : (
                <>
                  <button className="csc-modal-back" onClick={() => setModalStep(1)}>← Back</button>
                  <button className="csc-modal-next" onClick={sendEmail} disabled={emailLoading}>
                    Send to group
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── Toast ── */}
      {showToast && (
        <div className="csc-toast">
          <div className="csc-toast-inner">
            <span>✓</span>
            {toastMsg}
          </div>
        </div>
      )}
    </div>
  );
}
