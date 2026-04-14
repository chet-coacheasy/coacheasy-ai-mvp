"use client";

import { useState, useEffect } from "react";
import { getCoachProfile, getCoachSessions } from "@/lib/coach-profile-store";
import MediaLightbox from "@/components/MediaLightbox";

/* ─── SVG Icon Helpers ─── */
function PhoneIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#e53935" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6A19.79 19.79 0 012.12 4.18 2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
    </svg>
  );
}
function EnvelopeIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#e53935" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="4" width="20" height="16" rx="2" /><path d="M22 7l-10 7L2 7" />
    </svg>
  );
}
function GlobeIcon() {
  return (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10A15.3 15.3 0 0112 2z" /></svg>);
}
function InstagramIcon() {
  return (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" /><circle cx="12" cy="12" r="5" /><circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none" /></svg>);
}
function FacebookIcon() {
  return (<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" /></svg>);
}
function TikTokIcon() {
  return (<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.34-6.34V8.73a8.19 8.19 0 004.76 1.52v-3.4a4.85 4.85 0 01-1-.16z" /></svg>);
}
function YouTubeIcon() {
  return (<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" /></svg>);
}
function CalendarIcon() {
  return (<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>);
}
function ClockIcon() {
  return (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>);
}
function PinIcon() {
  return (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" /></svg>);
}
function ChevronDown({ open }) {
  return (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transition: "transform 0.2s", transform: open ? "rotate(180deg)" : "rotate(0deg)" }}><polyline points="6 9 12 15 18 9" /></svg>);
}
function ImageIcon() {
  return (<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><path d="M21 15l-5-5L5 21" /></svg>);
}
function PlayIcon() {
  return (<svg width="20" height="20" viewBox="0 0 24 24" fill="white"><path d="M8 5v14l11-7z" /></svg>);
}
function CheckIcon() {
  return (<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>);
}

/* ─── Session Detail Bottom Sheet ─── */
function SessionDetailSheet({ session, onClose, onBook }) {
  if (!session) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60" />
      <div className="relative w-full max-w-sm bg-white rounded-t-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()} style={{ animation: "slideUp 0.3s ease-out" }}>
        <div className="flex justify-center pt-3 pb-1"><div className="w-10 h-1 bg-gray-300 rounded-full" /></div>
        <div className="flex items-center justify-between px-5 pb-3 border-b border-gray-100">
          <h3 className="font-semibold text-base text-gray-900">{session.title}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-lg font-light p-1">&times;</button>
        </div>
        <div className="px-5 py-4 flex items-center gap-3">
          <span className="text-2xl font-bold text-red-600" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>${session.price}</span>
          <span className="text-xs text-gray-500">{session.priceLabel}</span>
          {session.spotsLeft !== null && session.spotsLeft <= 5 && (
            <span className="ml-auto text-xs font-semibold text-white bg-red-500 px-2 py-0.5 rounded-full">{session.spotsLeft} spots left</span>
          )}
        </div>
        <div className="px-5 pb-4">
          <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Schedule & Location</h4>
          <div className="space-y-2.5">
            <div className="flex items-start gap-2.5 text-sm text-gray-700"><span className="mt-0.5 text-gray-400"><CalendarIcon /></span><span>{session.date}</span></div>
            <div className="flex items-start gap-2.5 text-sm text-gray-700"><span className="mt-0.5 text-gray-400"><ClockIcon /></span><span>{session.time}</span></div>
            <div className="flex items-start gap-2.5 text-sm text-gray-700"><span className="mt-0.5 text-gray-400"><PinIcon /></span><div><span>{session.location}</span><a href="#" className="block text-xs text-blue-500 mt-0.5 hover:underline">Get Directions</a></div></div>
          </div>
        </div>
        <div className="px-5 pb-4">
          <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Session Details</h4>
          <div className="grid grid-cols-3 gap-2">
            {[
              { label: "Sport", value: session.sport },
              { label: "Level", value: session.level },
              { label: "Age", value: session.ageRange },
              { label: "Duration", value: session.duration },
              { label: "Type", value: session.sessionType },
              { label: "Spots", value: session.spotsLeft !== null ? session.spotsLeft : "Open" },
            ].map((item) => (
              <div key={item.label} className="bg-gray-50 rounded-lg p-2.5 text-center">
                <div className="text-sm font-bold text-red-600" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>{item.value}</div>
                <div className="text-xs text-gray-500 mt-0.5">{item.label}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="px-5 pb-5">
          <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Description</h4>
          <p className="text-sm text-gray-600 leading-relaxed">{session.description}</p>
        </div>
        <div className="px-5 pb-6 space-y-2.5">
          <button onClick={() => onBook(session)} className="w-full py-3 rounded-xl text-white font-semibold text-sm uppercase tracking-wide transition-colors" style={{ backgroundColor: "#e53935" }}>Book This Session</button>
          <button className="w-full py-3 rounded-xl text-white font-semibold text-sm transition-colors" style={{ backgroundColor: "#1E7AE6" }}>Message Coach About This Session</button>
        </div>
      </div>
    </div>
  );
}

/* ─── Login / Booking Modal ─── */
function BookingModal({ session, onClose }) {
  const [loginStep, setLoginStep] = useState("login");
  const [bookingRef, setBookingRef] = useState("");
  const handleBook = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let ref = "CE-";
    for (let i = 0; i < 6; i++) ref += chars.charAt(Math.floor(Math.random() * chars.length));
    setBookingRef(ref);
    setLoginStep("confirm");
  };
  if (!session) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60" />
      <div className="relative w-full max-w-sm bg-white rounded-2xl overflow-hidden" onClick={(e) => e.stopPropagation()} style={{ animation: "slideUp 0.3s ease-out" }}>
        {loginStep === "login" ? (
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Sign in to book</h3>
            <div className="bg-gray-50 rounded-xl p-3 mb-5 border border-gray-100">
              <div className="font-semibold text-sm text-gray-900">{session.title}</div>
              <div className="text-xs text-gray-500 mt-1">{session.dateShort} &middot; {session.time}</div>
              <div className="text-sm font-bold mt-1" style={{ color: "#e53935", fontFamily: "'Barlow Condensed', sans-serif" }}>${session.price} <span className="text-xs font-normal text-gray-500">{session.priceLabel}</span></div>
            </div>
            <input type="email" placeholder="Email address" className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm mb-3 outline-none focus:border-gray-400 text-gray-900" />
            <input type="password" placeholder="Password" className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm mb-4 outline-none focus:border-gray-400 text-gray-900" />
            <button onClick={handleBook} className="w-full py-3 rounded-xl text-white font-semibold text-sm uppercase tracking-wide transition-colors" style={{ backgroundColor: "#e53935" }}>Sign In & Book</button>
            <div className="flex items-center gap-3 my-4"><div className="flex-1 h-px bg-gray-200" /><span className="text-xs text-gray-400">new to CoachEasy?</span><div className="flex-1 h-px bg-gray-200" /></div>
            <button onClick={handleBook} className="w-full py-3 rounded-xl text-white font-semibold text-sm transition-colors" style={{ backgroundColor: "#1E7AE6" }}>Create Free Account & Book</button>
            <button onClick={onClose} className="w-full py-2.5 mt-3 text-sm text-gray-400 hover:text-gray-600 transition-colors">Cancel</button>
          </div>
        ) : (
          <div className="p-6 text-center">
            <div className="mx-auto w-16 h-16 rounded-full bg-green-500 flex items-center justify-center mb-4"><CheckIcon /></div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">Booking Confirmed!</h3>
            <p className="text-sm text-gray-500 mb-1">{session.title}</p>
            <p className="text-xs text-gray-400 mb-4">{session.dateShort} &middot; {session.time}</p>
            <div className="bg-gray-50 rounded-lg px-4 py-3 mb-5 inline-block"><span className="text-xs text-gray-500">Booking Reference</span><div className="text-base font-bold text-gray-900 tracking-wider">{bookingRef}</div></div>
            <br />
            <button onClick={onClose} className="w-full py-3 rounded-xl text-white font-semibold text-sm transition-colors" style={{ backgroundColor: "#e53935" }}>Done</button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Main CoachHeroCard Component ─── */
export default function CoachHeroCard({ coachId, coach: coachProp, preview }) {
  const [storeCoach, setStoreCoach] = useState(null);
  const [storeSessions, setStoreSessions] = useState([]);
  const [mediaOpen, setMediaOpen] = useState(false);
  const [sessionsOpen, setSessionsOpen] = useState(true);
  const [detailSession, setDetailSession] = useState(null);
  const [bookingSession, setBookingSession] = useState(null);
  const [lightboxIndex, setLightboxIndex] = useState(-1);

  useEffect(() => {
    if (coachId && !coachProp) {
      const p = getCoachProfile(coachId);
      if (p) {
        setStoreCoach(p);
        setStoreSessions(getCoachSessions(coachId));
      }
    }
  }, [coachId, coachProp]);

  // Build the coach object from either prop or store
  let coach;
  if (coachProp) {
    // Direct coach prop (from profile page preview or legacy usage)
    coach = {
      ...coachProp,
      photos: coachProp.photos || (coachProp.media || []).filter((m) => m.type === "photo"),
      videos: coachProp.videos || (coachProp.media || []).filter((m) => m.type === "video"),
      sessions: coachProp.sessions || [],
    };
  } else if (storeCoach) {
    // From store
    coach = {
      ...storeCoach,
      photos: (storeCoach.media || []).filter((m) => m.type === "photo"),
      videos: (storeCoach.media || []).filter((m) => m.type === "video"),
      sessions: storeSessions,
    };
  } else {
    // Skeleton loading
    return (
      <div className="max-w-sm mx-auto bg-white rounded-2xl overflow-hidden shadow-lg animate-pulse">
        <div className="h-28 bg-gray-200" />
        <div className="p-5 space-y-3">
          <div className="h-4 bg-gray-200 rounded w-2/3" />
          <div className="h-3 bg-gray-200 rounded w-1/2" />
          <div className="h-20 bg-gray-200 rounded" />
          <div className="h-10 bg-gray-200 rounded" />
        </div>
      </div>
    );
  }

  if (!coach.firstName) return null;

  const initials = ((coach.firstName?.[0] || "") + (coach.lastName?.[0] || "")).toUpperCase();
  const allMedia = [...(coach.photos || []), ...(coach.videos || [])];
  const photoCount = coach.photos?.length || 0;
  const videoCount = coach.videos?.length || 0;
  const lowestPrice = coach.sessions.length ? Math.min(...coach.sessions.map((s) => s.price)) : 0;

  const socialLinks = [
    { key: "website", url: coach.website, icon: <GlobeIcon /> },
    { key: "instagram", url: coach.instagram, icon: <InstagramIcon /> },
    { key: "facebook", url: coach.facebook, icon: <FacebookIcon /> },
    { key: "tiktok", url: coach.tiktok, icon: <TikTokIcon /> },
    { key: "youtube", url: coach.youtube, icon: <YouTubeIcon /> },
  ].filter((s) => s.url);

  return (
    <>
      <div className="max-w-sm mx-auto bg-white rounded-2xl overflow-hidden shadow-lg" style={{ fontFamily: "'Inter', sans-serif" }}>
        {/* 1. Hero Banner */}
        <div className="relative h-28" style={{ backgroundColor: "#1a0808" }}>
          <span className="absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-semibold text-white" style={{ backgroundColor: "#e53935" }}>{coach.sport}</span>
          <div className="absolute bottom-0 left-0 right-0 h-[3px]" style={{ backgroundColor: "#e53935" }} />
        </div>

        {/* 2. Identity Row */}
        <div className="relative px-5 pt-1 pb-3">
          <div className="absolute -mt-8 w-[60px] h-[60px] rounded-full flex items-center justify-center text-white text-xl font-bold border-4 border-white shadow-md" style={{ backgroundColor: "#e53935", fontFamily: "'Barlow Condensed', sans-serif", top: 0 }}>{initials}</div>
          <div className="ml-[72px] pt-1">
            <h2 className="text-xl font-bold text-gray-900 leading-tight" style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "20px" }}>{coach.firstName} {coach.lastName}</h2>
            <p className="text-gray-500" style={{ fontSize: "11px" }}>{coach.orgName} &middot; {coach.city}, {coach.province}</p>
          </div>
        </div>

        {/* 3. Match Pill */}
        {coach.matchScore != null && (
          <div className="px-5 pb-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border" style={{ backgroundColor: "#eaf3de", borderColor: "#97c459", color: "#4a7c10" }}>
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: "#6aad1e" }} />
              {coach.matchScore}% match &middot; {coach.matchReason}
            </div>
          </div>
        )}

        {/* 4. Contact Row */}
        <div className="px-5 pb-3 flex items-center gap-4 text-xs text-gray-600">
          <a href={`tel:${coach.phone}`} className="flex items-center gap-1.5 hover:text-gray-900 transition-colors"><PhoneIcon /> {coach.phone}</a>
          <a href={`mailto:${coach.email}`} className="flex items-center gap-1.5 hover:text-gray-900 transition-colors"><EnvelopeIcon /> {coach.email}</a>
        </div>

        {/* 5. Social Icons */}
        {socialLinks.length > 0 && (
          <div className="px-5 pb-3 flex gap-2">
            {socialLinks.map((s) => (
              <a key={s.key} href={s.url} target="_blank" rel="noopener noreferrer" className="w-[30px] h-[30px] flex items-center justify-center border border-gray-200 rounded-lg text-gray-500 hover:border-red-500 hover:text-red-500 transition-colors">{s.icon}</a>
            ))}
          </div>
        )}

        {/* 6. Info Pills */}
        <div className="px-5 pb-3 flex flex-wrap gap-1.5">
          <span className="px-2.5 py-1 rounded-full text-xs font-medium border bg-red-50 border-red-200 text-red-800">{coach.sport}</span>
          <span className="px-2.5 py-1 rounded-full text-xs font-medium border bg-gray-50 border-gray-200 text-gray-600">{coach.city}, {coach.province}</span>
          {coach.levels?.length > 0 && <span className="px-2.5 py-1 rounded-full text-xs font-medium border bg-gray-50 border-gray-200 text-gray-600">{coach.levels.join(", ")}</span>}
          {coach.ageRange && <span className="px-2.5 py-1 rounded-full text-xs font-medium border bg-gray-50 border-gray-200 text-gray-600">Ages {coach.ageRange}</span>}
          {coach.languages?.length > 0 && <span className="px-2.5 py-1 rounded-full text-xs font-medium border bg-gray-50 border-gray-200 text-gray-600">{coach.languages.join(", ")}</span>}
        </div>

        {/* 7. Stats Row */}
        <div className="mx-5 mb-3 grid grid-cols-4 border border-gray-100 rounded-xl overflow-hidden">
          {[
            { value: coach.rating, label: "Rating" },
            { value: coach.athleteCount, label: "Athletes" },
            { value: coach.yearsExp, label: "Yrs Exp" },
            { value: coach.reviewCount, label: "Reviews" },
          ].map((stat, i) => (
            <div key={stat.label} className={`text-center py-3 ${i > 0 ? "border-l border-gray-100" : ""}`}>
              <div className="text-lg font-bold" style={{ color: "#e53935", fontFamily: "'Barlow Condensed', sans-serif" }}>{stat.value}</div>
              <div className="text-xs text-gray-500 uppercase tracking-wide" style={{ fontSize: "9px" }}>{stat.label}</div>
            </div>
          ))}
        </div>

        {/* 8. Bio */}
        <div className="mx-5 mb-3 pb-3 border-b border-gray-100">
          <p className="text-xs text-gray-500 italic leading-relaxed">{coach.bio}</p>
        </div>

        {/* 9. Photos & Videos (collapsible) */}
        {allMedia.length > 0 && (
          <div className="mx-5 mb-3 border border-gray-100 rounded-xl overflow-hidden">
            <button onClick={() => setMediaOpen(!mediaOpen)} className="w-full flex items-center justify-between px-4 py-3 bg-white hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-gray-900">Photos & Videos</span>
                <span className="text-xs text-gray-400">{photoCount} photos &middot; {videoCount} videos</span>
              </div>
              <ChevronDown open={mediaOpen} />
            </button>
            {mediaOpen && (
              <div className="px-4 pb-4">
                <div className="grid grid-cols-3 gap-2">
                  {coach.photos.map((photo, i) => (
                    <div key={`photo-${i}`} className="cursor-pointer" onClick={() => !preview && setLightboxIndex(i)}>
                      <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                        {photo.url ? <img src={photo.url} alt={photo.caption} className="w-full h-full object-cover" /> : <ImageIcon />}
                      </div>
                      <p className="text-xs text-gray-500 mt-1 truncate text-center">{photo.caption}</p>
                    </div>
                  ))}
                  {coach.videos.map((video, i) => (
                    <div key={`video-${i}`} className="cursor-pointer" onClick={() => !preview && setLightboxIndex(photoCount + i)}>
                      <div className="aspect-square bg-gray-800 rounded-lg flex items-center justify-center relative">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: "#e53935" }}><PlayIcon /></div>
                      </div>
                      <p className="text-xs text-gray-500 mt-1 truncate text-center">{video.caption}</p>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-gray-400 mt-3 text-center">Tap any photo or video to expand &middot; Uploaded by coach</p>
              </div>
            )}
          </div>
        )}

        {/* 10. Sessions (collapsible) */}
        <div className="mx-5 mb-3 border border-gray-100 rounded-xl overflow-hidden">
          <button onClick={() => setSessionsOpen(!sessionsOpen)} className="w-full flex items-center justify-between px-4 py-3 bg-white hover:bg-gray-50 transition-colors">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-gray-900">Sessions</span>
              <span className="text-xs text-gray-400">{coach.sessions.length > 0 ? `${coach.sessions.length} available · from $${lowestPrice}` : "No sessions yet"}</span>
            </div>
            <ChevronDown open={sessionsOpen} />
          </button>
          {sessionsOpen && (
            <div className="px-4 pb-4 space-y-3">
              {coach.sessions.length === 0 ? (
                <p className="text-xs text-gray-400 text-center py-4">No sessions yet — create one from the dashboard</p>
              ) : (
                coach.sessions.map((session) => (
                  <div key={session.id} className="border border-gray-100 rounded-xl p-3">
                    <div className="mb-2">
                      <h4 className="font-semibold text-gray-900" style={{ fontSize: "13px" }}>{session.title}</h4>
                      <div className="flex items-center gap-1.5 mt-1 text-gray-500" style={{ fontSize: "11px" }}><CalendarIcon /><span>{session.dateShort} &middot; {session.time}</span></div>
                    </div>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-xl font-bold" style={{ color: "#e53935", fontFamily: "'Barlow Condensed', sans-serif", fontSize: "20px" }}>${session.price}</span>
                      <span className="text-xs text-gray-500">{session.priceLabel}</span>
                      {session.spotsLeft !== null && session.spotsLeft <= 5 && (
                        <span className="ml-auto text-xs font-semibold text-white px-2 py-0.5 rounded-full" style={{ backgroundColor: "#e53935" }}>{session.spotsLeft} spots left</span>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <button onClick={() => !preview && setDetailSession(session)} className="py-2 rounded-lg text-xs font-semibold border border-gray-200 text-gray-700 hover:border-red-500 hover:text-red-600 transition-colors" title={preview ? "Preview only" : undefined}>View Details</button>
                      <button onClick={() => !preview && setBookingSession(session)} className="py-2 rounded-lg text-xs font-semibold text-white uppercase tracking-wide transition-colors hover:opacity-90" style={{ backgroundColor: "#e53935" }} title={preview ? "Preview only" : undefined}>Book Now</button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* 11. Bottom CTAs */}
        <div className="px-5 pb-5 space-y-2.5">
          <button className="w-full py-3 rounded-xl text-white font-semibold text-sm transition-colors hover:opacity-90" style={{ backgroundColor: "#1E7AE6" }} title={preview ? "Preview only" : undefined}>Message {coach.firstName}</button>
          <button className="w-full py-3 rounded-xl text-sm font-semibold border transition-colors hover:bg-red-50" style={{ color: "#e53935", borderColor: "#e53935" }}>Compare with other coaches &#8599;</button>
        </div>
      </div>

      {/* Session Detail Sheet */}
      {detailSession && !preview && (
        <SessionDetailSheet session={detailSession} onClose={() => setDetailSession(null)} onBook={(s) => { setDetailSession(null); setBookingSession(s); }} />
      )}

      {/* Booking Modal */}
      {bookingSession && !preview && (
        <BookingModal session={bookingSession} onClose={() => setBookingSession(null)} />
      )}

      {/* Media Lightbox */}
      {lightboxIndex >= 0 && !preview && (
        <MediaLightbox media={allMedia} currentIndex={lightboxIndex} onClose={() => setLightboxIndex(-1)} onNavigate={setLightboxIndex} />
      )}

      <style jsx global>{`
        @keyframes slideUp {
          from { transform: translateY(100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </>
  );
}
