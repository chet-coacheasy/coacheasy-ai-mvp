"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import "./landing.css";

const quickChips = [
  { emoji: "🏒", text: "Hockey coach · Montréal" },
  { emoji: "⚽", text: "Youth soccer · Québec City" },
  { emoji: "🏀", text: "Basketball training · Toronto" },
  { emoji: "💪", text: "S&C coaching · Ottawa" },
];

const stats = [
  { val: "400+", label: "Verified coaches" },
  { val: "6", label: "Provinces" },
  { val: "12k+", label: "Sessions booked" },
  { val: "4.8★", label: "Avg coach rating" },
  { val: "EN/FR", label: "Bilingual support" },
];

const sportTabs = [
  "Hockey", "Soccer", "Basketball", "Baseball", "Boxing",
  "Football", "Swimming", "Track", "Duathlon", "Sports Psych", "Ski",
];

const hockeyCoaches = [
  {
    name: "Velocity Hockey Academy",
    initials: "VH",
    location: "Montréal, QC",
    distance: "2.1 km",
    rating: 4.9,
    tags: ["Power Skating", "Elite Skills"],
    price: 85,
    badge: "Verified",
    featured: true,
  },
  {
    name: "Kayla Tutino",
    initials: "KT",
    location: "Montréal, QC",
    distance: "3.4 km",
    rating: 4.8,
    tags: ["Power Skating", "Skating & Edge Work"],
    price: 95,
    badge: "Verified",
  },
  {
    name: "Martin Lee",
    initials: "ML",
    location: "Brossard, QC",
    distance: "8.2 km",
    rating: 4.7,
    tags: ["AAA Power Skating"],
    price: 75,
    badge: "Verified",
  },
  {
    name: "iF Power Elite",
    initials: "iF",
    location: "Ottawa, ON",
    distance: "190 km",
    rating: 5.0,
    tags: ["AAA Power Skating"],
    price: 110,
    badge: "Featured",
    featured: true,
  },
];

const soccerCoaches = [
  {
    name: "Ali Gerba",
    initials: "AG",
    location: "Montréal, QC",
    distance: "4.1 km",
    rating: 4.9,
    tags: ["Elite Striker Training", "1-on-1"],
    price: 90,
    badge: "Verified",
  },
  {
    name: "Patrice Bernier",
    initials: "PB",
    location: "Montréal, QC",
    distance: "5.8 km",
    rating: 5.0,
    tags: ["Midfield Mastery", "Youth Development"],
    price: 100,
    badge: "Featured",
    featured: true,
  },
  {
    name: "Galaxy Soccer Academy",
    initials: "GS",
    location: "Brossard, QC",
    distance: "9.0 km",
    rating: 4.7,
    tags: ["Team Training", "U14/U16"],
    price: 70,
    badge: "Verified",
  },
  {
    name: "Dead FC",
    initials: "DF",
    location: "Montréal, QC",
    distance: "3.2 km",
    rating: 4.8,
    tags: ["Skills Academy", "Competitive"],
    price: 80,
    badge: "Verified",
  },
];

function CoachCard({ coach }) {
  return (
    <div className="coach-card">
      <div className="coach-card-img">
        <div className="coach-card-initials">{coach.initials}</div>
        <span className="coach-card-badge">{coach.badge}</span>
        <button className="coach-card-fav">♡</button>
      </div>
      <div className="coach-card-body">
        <div className="coach-card-name">{coach.name}</div>
        <div className="coach-card-rating">★ {coach.rating}</div>
        <div className="coach-card-loc">
          {coach.location} · {coach.distance}
        </div>
        <div className="coach-card-tags">
          {coach.tags.map((t) => (
            <span key={t} className="coach-card-tag">{t}</span>
          ))}
        </div>
        <div className="coach-card-foot">
          <span className="coach-card-price">
            ${coach.price}<span>/session</span>
          </span>
          <button className="coach-card-book">Book</button>
        </div>
      </div>
    </div>
  );
}

export default function LandingPage() {
  const [query, setQuery] = useState("");
  const [activeToggle, setActiveToggle] = useState("athlete");
  const [activeSport, setActiveSport] = useState("Hockey");
  const router = useRouter();

  const handleSubmit = () => {
    if (query.trim()) {
      router.push("/athlete");
    }
  };

  const handleChipClick = () => {
    router.push("/athlete");
  };

  const scrollToSearch = () => {
    document
      .getElementById("danielle-bar")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="landing">
      {/* ── Navbar ── */}
      <nav className="ln-nav">
        <Link href="/" className="ln-logo">
          <span className="ce">CE</span>COACHEASY
        </Link>
        <div className="ln-nav-right">
          <div className="ln-toggle">
            <Link
              href="/athlete"
              className={`ln-toggle-btn${activeToggle === "athlete" ? " active" : ""}`}
              onClick={() => setActiveToggle("athlete")}
            >
              Athlete
            </Link>
            <Link
              href="/coach/dashboard"
              className={`ln-toggle-btn${activeToggle === "coach" ? " active" : ""}`}
              onClick={() => setActiveToggle("coach")}
            >
              Coach
            </Link>
          </div>
          <Link href="/coach" className="ln-list-link">
            List your coaching
          </Link>
          <div className="ln-avatar">☰</div>
        </div>
      </nav>

      {/* ── Hero Section ── */}
      <section className="ln-hero">
        <div className="ln-hero-bg" />
        <div className="ln-hero-content">
          <h1>
            Canada&apos;s coaches, ready for{" "}
            <span className="gold">your&nbsp;athlete.</span>
          </h1>
          <p className="ln-hero-sub">
            Find verified coaches for hockey, soccer, basketball and more —
            booked in minutes.
          </p>
          <button className="ln-cta" onClick={scrollToSearch}>
            FIND YOUR COACH
          </button>
        </div>
      </section>

      {/* ── Coach Danielle AI Bar ── */}
      <section className="ln-danielle" id="danielle-bar">
        <div className="ln-danielle-label">
          <span className="ln-danielle-dot" />
          <span className="ln-danielle-name">
            COACH DANIELLE <span>· AI-POWERED MATCHING</span>
          </span>
        </div>

        <div className="ln-input-wrap">
          <input
            type="text"
            className="ln-input"
            placeholder="Tell me your sport + location — e.g. 'Hockey coach for my 12-year-old in Montréal, weekends' or 'Soccer training in Ottawa for a competitive teen'"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          />
          <button className="ln-send-btn" onClick={handleSubmit}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
            </svg>
          </button>
        </div>

        <div className="ln-chips">
          {quickChips.map((chip) => (
            <button
              key={chip.text}
              className="ln-chip"
              onClick={handleChipClick}
            >
              <span>{chip.emoji}</span>
              {chip.text}
            </button>
          ))}
        </div>
      </section>

      {/* ── Stats Bar ── */}
      <section className="ln-stats">
        <div className="ln-stats-inner">
          {stats.map((s) => (
            <div key={s.label} className="ln-stat">
              <div className="ln-stat-val">{s.val}</div>
              <div className="ln-stat-label">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="ln-how">
        <div className="ln-how-inner">
          <div className="ln-how-label">SIMPLE. FAST. EFFECTIVE.</div>
          <h2 className="ln-how-heading">
            Book your first session in <span className="red">3&nbsp;steps</span>
          </h2>
          <div className="ln-steps">
            <div className="ln-step">
              <div className="ln-step-icon red">🔍</div>
              <div className="ln-step-title">Search &amp; Filter</div>
              <p className="ln-step-desc">
                Browse verified coaches by sport, city, age group, and
                availability. Every profile shows real credentials and honest
                ratings.
              </p>
            </div>
            <div className="ln-step">
              <div className="ln-step-icon dark">💬</div>
              <div className="ln-step-title">Match with Danielle</div>
              <p className="ln-step-desc">
                Tell Danielle what you need. Danielle understands your goals and
                finds coaches who fit your schedule, budget, and skill level.
              </p>
            </div>
            <div className="ln-step">
              <div className="ln-step-icon green">✓</div>
              <div className="ln-step-title">Book &amp; Train</div>
              <p className="ln-step-desc">
                Reserve your spot online in seconds. Get a confirmation
                instantly and manage all your sessions from one dashboard.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Coaches Section ── */}
      <section className="ln-coaches-section">
        <div className="ln-coaches-inner">
          {/* Sport Tabs */}
          <div className="ln-sport-tabs">
            {sportTabs.map((sport) => (
              <button
                key={sport}
                className={`ln-sport-tab${activeSport === sport ? " active" : ""}`}
                onClick={() => setActiveSport(sport)}
              >
                {sport}
              </button>
            ))}
          </div>

          {/* Hockey Coaches */}
          <div className="ln-coach-group">
            <div className="ln-coach-group-header">
              <div className="ln-coach-group-title">
                Hockey Coaches Near You
                <span className="ln-coach-count">{hockeyCoaches.length}</span>
              </div>
              <span className="ln-coach-showall">Show all</span>
            </div>
            <div className="ln-coach-scroll">
              {hockeyCoaches.map((c) => (
                <CoachCard key={c.name} coach={c} />
              ))}
            </div>
          </div>

          {/* Soccer Coaches */}
          <div className="ln-coach-group">
            <div className="ln-coach-group-header">
              <div className="ln-coach-group-title">
                Soccer Coaches Near You
                <span className="ln-coach-count">{soccerCoaches.length}</span>
              </div>
              <span className="ln-coach-showall">Show all</span>
            </div>
            <div className="ln-coach-scroll">
              {soccerCoaches.map((c) => (
                <CoachCard key={c.name} coach={c} />
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
