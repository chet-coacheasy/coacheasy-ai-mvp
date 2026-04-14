"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import CoachHeroCard from "@/components/CoachHeroCard";
import { getCoachProfile, saveCoachProfile, getCoachSessions, calcProfileQuality } from "@/lib/coach-profile-store";
import "./profile.css";

const COACH_ID = "tim-turk";

const sportOptions = ["Hockey", "Soccer", "Basketball", "Baseball", "Football", "Lacrosse", "Golf", "Tennis", "Gymnastics", "Boxing", "Martial Arts", "Personal Fitness", "Multi Sport", "Confidence Coaching"];
const levelOptions = ["C/B", "A/AA", "AA/AAA", "AAA", "Elite/Pro"];
const langOptions = ["EN", "FR"];

const sidebarItems = [
  { icon: "📊", label: "Dashboard", href: "/coach/dashboard" },
  { icon: "🏒", label: "My Sessions", href: "#" },
  { icon: "👥", label: "Athletes", href: "#" },
  { icon: "💰", label: "Revenue", href: "#" },
  { icon: "🤖", label: "AI Tools", href: "/coach" },
  { icon: "💬", label: "Messages", href: "#" },
  { icon: "⚙️", label: "Settings", href: "#", children: [
    { icon: "👤", label: "Coach Profile", href: "/coach/settings/profile", active: true },
  ]},
];

function flatSidebarItems() {
  const items = [];
  sidebarItems.forEach((item) => {
    items.push(item);
    if (item.children) item.children.forEach((c) => items.push({ ...c, isChild: true }));
  });
  return items;
}

export default function CoachProfilePage() {
  const [profile, setProfile] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [scanUrl, setScanUrl] = useState("");
  const [scanning, setScanning] = useState(false);
  const [scanStep, setScanStep] = useState("");
  const [aiFilled, setAiFilled] = useState({});
  const [toast, setToast] = useState("");
  const [previewMode, setPreviewMode] = useState(true);
  const [newTag, setNewTag] = useState("");
  const [uploadError, setUploadError] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const fileInputRef = useRef(null);
  const dropdownRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    const p = getCoachProfile(COACH_ID);
    if (p) {
      setProfile(p);
    } else {
      setProfile({
        id: COACH_ID, firstName: "", lastName: "", orgName: "",
        city: "", province: "", sport: "Hockey", levels: [], ageRange: "",
        languages: [], phone: "", email: "", website: "", instagram: "",
        facebook: "", tiktok: "", youtube: "", bio: "", bioFr: "",
        rating: 0, reviewCount: 0, athleteCount: 0, yearsExp: "",
        expertise: [], media: [], isComplete: false, lastUpdated: "",
      });
    }
    setSessions(getCoachSessions(COACH_ID));
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!profile) return null;

  const quality = calcProfileQuality(profile);
  const qualityColor = quality < 50 ? "#f87171" : quality < 80 ? "#fbbf24" : "#34d399";

  const update = (field, value) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
  };

  const toggleLevel = (level) => {
    setProfile((prev) => ({
      ...prev,
      levels: prev.levels.includes(level) ? prev.levels.filter((l) => l !== level) : [...prev.levels, level],
    }));
  };

  const toggleLang = (lang) => {
    setProfile((prev) => ({
      ...prev,
      languages: prev.languages.includes(lang) ? prev.languages.filter((l) => l !== lang) : [...prev.languages, lang],
    }));
  };

  const addTag = () => {
    const tag = newTag.trim();
    if (tag && !profile.expertise.includes(tag)) {
      update("expertise", [...profile.expertise, tag]);
    }
    setNewTag("");
  };

  const removeTag = (tag) => {
    update("expertise", profile.expertise.filter((t) => t !== tag));
  };

  /* ── AI Scan ── */
  const scanProfile = async () => {
    if (!scanUrl.trim()) return;
    setScanning(true);
    setAiFilled({});

    const steps = ["Scanning your website...", "Extracting coach info...", "Writing AI bio...", "Translating to French..."];
    for (const step of steps) {
      setScanStep(step);
      await new Promise((r) => setTimeout(r, 800));
    }

    try {
      const res = await fetch("/api/scan-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: scanUrl.trim() }),
      });

      if (!res.ok) throw new Error("Scan failed");
      const data = await res.json();

      const filled = {};
      const newProfile = { ...profile };
      Object.entries(data).forEach(([key, val]) => {
        if (val && (typeof val === "string" ? val.trim() : Array.isArray(val) ? val.length > 0 : true)) {
          newProfile[key] = val;
          filled[key] = true;
        }
      });
      newProfile.isComplete = calcProfileQuality(newProfile) >= 80;
      setProfile(newProfile);
      setAiFilled(filled);
    } catch {
      setToast("Couldn't scan that URL — fill in manually");
      setTimeout(() => setToast(""), 3000);
    } finally {
      setScanning(false);
      setScanStep("");
    }
  };

  /* ── Bio regenerate ── */
  const regenerateBio = async () => {
    try {
      const res = await fetch("/api/scan-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: `${profile.firstName} ${profile.lastName} ${profile.orgName} ${profile.sport} coach ${profile.city}` }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.bio) update("bio", data.bio);
        if (data.bioFr) update("bioFr", data.bioFr);
      }
    } catch { /* silent */ }
  };

  /* ── Auto-translate ── */
  const autoTranslate = async () => {
    if (!profile.bio) return;
    try {
      const res = await fetch("/api/scan-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: `Translate this bio to French: "${profile.bio}"` }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.bioFr) update("bioFr", data.bioFr);
      }
    } catch { /* silent */ }
  };

  /* ── Photo upload ── */
  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files || []);
    setUploadError("");

    for (const file of files) {
      if (file.size > 5 * 1024 * 1024) {
        setUploadError("File too large — max 5MB");
        return;
      }
    }

    const photoCount = profile.media.filter((m) => m.type === "photo").length;
    const videoCount = profile.media.filter((m) => m.type === "video").length;

    files.forEach((file) => {
      const isVideo = file.type.startsWith("video/");
      if (isVideo && videoCount >= 5) return;
      if (!isVideo && photoCount >= 10) return;

      const reader = new FileReader();
      reader.onload = (ev) => {
        const mediaItem = {
          id: `m-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          type: isVideo ? "video" : "photo",
          url: ev.target.result,
          caption: "",
          uploadedAt: new Date().toISOString(),
        };
        setProfile((prev) => ({ ...prev, media: [...prev.media, mediaItem] }));
      };
      reader.readAsDataURL(file);
    });
  };

  const removeMedia = (id) => {
    setProfile((prev) => ({ ...prev, media: prev.media.filter((m) => m.id !== id) }));
  };

  const updateMediaCaption = (id, caption) => {
    setProfile((prev) => ({
      ...prev,
      media: prev.media.map((m) => m.id === id ? { ...m, caption } : m),
    }));
  };

  /* ── Save ── */
  const handleSave = () => {
    const updated = { ...profile, isComplete: calcProfileQuality(profile) >= 80 };
    saveCoachProfile(updated);
    setProfile(updated);
    setToast("Profile saved — athletes can now find you");
    setTimeout(() => setToast(""), 3000);
  };

  /* ── Map profile to hero card shape ── */
  const heroCoach = {
    ...profile,
    photos: (profile.media || []).filter((m) => m.type === "photo"),
    videos: (profile.media || []).filter((m) => m.type === "video"),
    sessions: sessions.map((s) => ({ ...s })),
  };

  const fieldClass = (field) =>
    aiFilled[field] ? "cp-input cp-ai-filled" : "cp-input";

  const allSidebar = flatSidebarItems();

  return (
    <div className="cp-layout">
      {/* ── Top Nav ── */}
      <header className="cp-topnav">
        <div className="cp-topnav-left">
          <Link href="/" className="cp-logo">Coach<span>Easy</span></Link>
          <span className="cp-nav-label">Coach Profile</span>
        </div>
        <div className="cp-topnav-right" ref={dropdownRef}>
          <div className="cp-pill" onClick={() => setDropdownOpen(!dropdownOpen)}>
            <div className="cp-pill-avatar">{profile.firstName?.[0] || "T"}{profile.lastName?.[0] || "T"}</div>
            <span className="cp-pill-name">{profile.firstName || "Coach"} {profile.lastName}</span>
            <span className={`cp-pill-chevron${dropdownOpen ? " open" : ""}`}>&#9660;</span>
          </div>
          {dropdownOpen && (
            <div className="cp-dropdown">
              <Link href="/coach/settings/profile" className="cp-dropdown-item" onClick={() => setDropdownOpen(false)}>
                <span>👤</span> Profile
              </Link>
              <Link href="/coach/settings" className="cp-dropdown-item" onClick={() => setDropdownOpen(false)}>
                <span>⚙️</span> Settings
              </Link>
              <div className="cp-dropdown-sep" />
              <button className="cp-dropdown-item danger" onClick={() => { setDropdownOpen(false); router.push("/"); }}>
                <span>🚪</span> Sign Out
              </button>
            </div>
          )}
        </div>
      </header>

      {/* ── Sidebar ── */}
      <aside className="cp-sidebar">
        {allSidebar.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className={`cp-sidebar-item${item.active ? " active" : ""}${item.isChild ? " child" : ""}`}
          >
            <span className="cp-sidebar-icon">{item.icon}</span>
            {item.label}
          </Link>
        ))}
      </aside>

      {/* ── Split Content ── */}
      <div className="cp-split">
        {/* LEFT — Form */}
        <div className="cp-form-panel">
          <div className="cp-form-scroll">
            {/* Header */}
            <div className="cp-form-header">
              <div>
                <h1 className="cp-form-title">Coach Profile</h1>
                <p className="cp-form-sub">This is what athletes see when they find you</p>
              </div>
              <button className="cp-toggle-btn" onClick={() => setPreviewMode(!previewMode)}>
                {previewMode ? "Raw Data" : "Hero Card"} Preview
              </button>
            </div>

            {/* AI URL Scan */}
            <div className="cp-section">
              <div className="cp-section-label">AI URL SCAN</div>
              <div className="cp-scan-row">
                <input
                  className="cp-input"
                  placeholder="Enter your website URL..."
                  value={scanUrl}
                  onChange={(e) => setScanUrl(e.target.value)}
                />
                <button className="cp-scan-btn" onClick={scanProfile} disabled={scanning || !scanUrl.trim()}>
                  {scanning ? "Scanning..." : "Scan with AI"}
                </button>
              </div>
              {scanning && (
                <div className="cp-scan-status">
                  <div className="cp-scan-dot" />
                  <span>{scanStep}</span>
                </div>
              )}
              {Object.keys(aiFilled).length > 0 && (
                <div className="cp-scan-success">AI pre-filled {Object.keys(aiFilled).length} fields — review and edit below</div>
              )}
            </div>

            {/* IDENTITY */}
            <div className="cp-section">
              <div className="cp-section-label">IDENTITY</div>
              <div className="cp-grid-2">
                <div>
                  <label className="cp-label">First Name</label>
                  <input className={fieldClass("firstName")} value={profile.firstName} onChange={(e) => update("firstName", e.target.value)} />
                </div>
                <div>
                  <label className="cp-label">Last Name</label>
                  <input className={fieldClass("lastName")} value={profile.lastName} onChange={(e) => update("lastName", e.target.value)} />
                </div>
              </div>
              <label className="cp-label">Organization / Academy Name</label>
              <input className={fieldClass("orgName")} value={profile.orgName} onChange={(e) => update("orgName", e.target.value)} />
              <label className="cp-label">Years Experience</label>
              <input className={fieldClass("yearsExp")} value={profile.yearsExp} onChange={(e) => update("yearsExp", e.target.value)} style={{ maxWidth: 120 }} />
            </div>

            {/* LOCATION */}
            <div className="cp-section">
              <div className="cp-section-label">LOCATION</div>
              <div className="cp-grid-2">
                <div>
                  <label className="cp-label">City</label>
                  <input className={fieldClass("city")} value={profile.city} onChange={(e) => update("city", e.target.value)} />
                </div>
                <div>
                  <label className="cp-label">Province</label>
                  <input className={fieldClass("province")} value={profile.province} onChange={(e) => update("province", e.target.value)} />
                </div>
              </div>
            </div>

            {/* SPORT & EXPERTISE */}
            <div className="cp-section">
              <div className="cp-section-label">SPORT & EXPERTISE</div>
              <label className="cp-label">Primary Sport</label>
              <select className="cp-input" value={profile.sport} onChange={(e) => update("sport", e.target.value)}>
                {sportOptions.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>

              <label className="cp-label">Skill Levels</label>
              <div className="cp-chip-row">
                {levelOptions.map((l) => (
                  <button
                    key={l}
                    className={`cp-chip${profile.levels.includes(l) ? " active" : ""}`}
                    onClick={() => toggleLevel(l)}
                  >
                    {l}
                  </button>
                ))}
              </div>

              <label className="cp-label">Age Range</label>
              <input className={fieldClass("ageRange")} placeholder="e.g. 8–18" value={profile.ageRange} onChange={(e) => update("ageRange", e.target.value)} style={{ maxWidth: 120 }} />

              <label className="cp-label">Languages</label>
              <div className="cp-chip-row">
                {langOptions.map((l) => (
                  <button
                    key={l}
                    className={`cp-chip${profile.languages.includes(l) ? " active" : ""}`}
                    onClick={() => toggleLang(l)}
                  >
                    {l}
                  </button>
                ))}
              </div>

              <label className="cp-label">Expertise Tags</label>
              <div className="cp-tags-wrap">
                {profile.expertise.map((tag) => (
                  <span key={tag} className="cp-tag">
                    {tag}
                    <button className="cp-tag-x" onClick={() => removeTag(tag)}>&times;</button>
                  </span>
                ))}
                <input
                  className="cp-tag-input"
                  placeholder="Add tag..."
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addTag(); } }}
                />
              </div>
            </div>

            {/* CONTACT & SOCIAL */}
            <div className="cp-section">
              <div className="cp-section-label">CONTACT & SOCIAL</div>
              <div className="cp-grid-2">
                <div>
                  <label className="cp-label">Phone</label>
                  <input className={fieldClass("phone")} value={profile.phone} onChange={(e) => update("phone", e.target.value)} />
                </div>
                <div>
                  <label className="cp-label">Email</label>
                  <input className={fieldClass("email")} value={profile.email} onChange={(e) => update("email", e.target.value)} />
                </div>
              </div>
              <label className="cp-label">Website URL</label>
              <input className={fieldClass("website")} value={profile.website} onChange={(e) => update("website", e.target.value)} />
              <label className="cp-label">Instagram URL</label>
              <input className={fieldClass("instagram")} value={profile.instagram} onChange={(e) => update("instagram", e.target.value)} />
              <label className="cp-label">Facebook URL</label>
              <input className={fieldClass("facebook")} value={profile.facebook} onChange={(e) => update("facebook", e.target.value)} />
              <label className="cp-label">TikTok URL</label>
              <input className={fieldClass("tiktok")} value={profile.tiktok} onChange={(e) => update("tiktok", e.target.value)} />
              <label className="cp-label">YouTube URL</label>
              <input className={fieldClass("youtube")} value={profile.youtube} onChange={(e) => update("youtube", e.target.value)} />
            </div>

            {/* BIO */}
            <div className="cp-section">
              <div className="cp-section-label">BIO</div>
              <div className="cp-bio-header">
                <label className="cp-label">Bio (English)</label>
                <button className="cp-link-btn" onClick={regenerateBio}>Regenerate with AI</button>
              </div>
              <textarea className={`cp-textarea ${aiFilled.bio ? "cp-ai-filled" : ""}`} rows={4} value={profile.bio} onChange={(e) => update("bio", e.target.value)} />
              <div className="cp-char-count">{profile.bio.length} characters</div>

              <div className="cp-bio-header">
                <label className="cp-label">Bio (Fran&ccedil;ais)</label>
                <button className="cp-link-btn" onClick={autoTranslate}>Auto-translate</button>
              </div>
              <textarea className={`cp-textarea ${aiFilled.bioFr ? "cp-ai-filled" : ""}`} rows={3} value={profile.bioFr} onChange={(e) => update("bioFr", e.target.value)} />
            </div>

            {/* PHOTOS & VIDEOS */}
            <div className="cp-section">
              <div className="cp-section-label">PHOTOS & VIDEOS</div>
              <div
                className="cp-upload-zone"
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => { e.preventDefault(); e.currentTarget.classList.add("hover"); }}
                onDragLeave={(e) => e.currentTarget.classList.remove("hover")}
                onDrop={(e) => {
                  e.preventDefault();
                  e.currentTarget.classList.remove("hover");
                  const dt = e.dataTransfer;
                  if (dt.files.length) handleFileUpload({ target: { files: dt.files } });
                }}
              >
                <div className="cp-upload-icon">+</div>
                <span>Drop files here or click to upload</span>
                <span className="cp-upload-hint">JPG, PNG, WEBP, MP4, MOV — max 5MB each</span>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,video/mp4,video/quicktime"
                  multiple
                  style={{ display: "none" }}
                  onChange={handleFileUpload}
                />
              </div>
              {uploadError && <div className="cp-upload-error">{uploadError}</div>}

              {profile.media.length > 0 && (
                <div className="cp-media-grid">
                  {profile.media.map((m) => (
                    <div key={m.id} className="cp-media-thumb">
                      <div className={`cp-thumb-img ${m.type === "video" ? "video" : ""}`}>
                        {m.url && m.type === "photo" ? (
                          <img src={m.url} alt={m.caption} />
                        ) : m.type === "video" ? (
                          <div className="cp-thumb-play">&#9654;</div>
                        ) : (
                          <div className="cp-thumb-placeholder" />
                        )}
                        <button className="cp-thumb-delete" onClick={() => removeMedia(m.id)}>&times;</button>
                      </div>
                      <input
                        className="cp-thumb-caption"
                        placeholder="Caption..."
                        value={m.caption}
                        onChange={(e) => updateMediaCaption(m.id, e.target.value)}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* STATS (read-only) */}
            <div className="cp-section">
              <div className="cp-section-label">STATS</div>
              <div className="cp-stats-row">
                <div className="cp-stat"><span className="cp-stat-val">{profile.rating}</span><span className="cp-stat-label">Rating</span></div>
                <div className="cp-stat"><span className="cp-stat-val">{profile.athleteCount}</span><span className="cp-stat-label">Athletes</span></div>
                <div className="cp-stat"><span className="cp-stat-val">{profile.reviewCount}</span><span className="cp-stat-label">Reviews</span></div>
              </div>
            </div>

            {/* Spacer for sticky bar */}
            <div style={{ height: 80 }} />
          </div>

          {/* Sticky bottom bar */}
          <div className="cp-bottom-bar">
            <div className="cp-quality">
              <div className="cp-quality-dot" style={{ background: qualityColor }} />
              <span>Profile Quality: <strong>{quality}%</strong></span>
            </div>
            <div className="cp-bottom-actions">
              <button className="cp-save-btn" onClick={handleSave}>Save Profile</button>
            </div>
          </div>
        </div>

        {/* RIGHT — Live Preview */}
        <div className="cp-preview-panel">
          <div className="cp-preview-label">This is what athletes see</div>
          <div className="cp-preview-scroll">
            {previewMode ? (
              <CoachHeroCard coach={heroCoach} preview />
            ) : (
              <pre className="cp-raw-data">{JSON.stringify(profile, null, 2)}</pre>
            )}
          </div>
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div className="cp-toast">
          <div className="cp-toast-inner">{toast}</div>
        </div>
      )}

    </div>
  );
}
