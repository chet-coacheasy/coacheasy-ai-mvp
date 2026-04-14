"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getCoachProfile, calcProfileQuality } from "@/lib/coach-profile-store";
import "./dashboard.css";

const COACH_ID = "tim-turk";

/* ── Mock Data ── */
const kpis = [
  { label: "Total Revenue", value: "$12,480", trend: "+14%", up: true, bars: [12, 18, 14, 22, 20, 28, 32] },
  { label: "Active Sessions", value: "18", trend: "+3", up: true, bars: [8, 12, 10, 14, 15, 16, 18] },
  { label: "Total Athletes", value: "64", trend: "+8", up: true, bars: [40, 44, 48, 50, 55, 58, 64] },
  { label: "Avg Fill Rate", value: "78%", trend: "-2%", up: false, bars: [82, 80, 84, 79, 76, 80, 78] },
  { label: "This Month Earnings", value: "$3,240", trend: "+22%", up: true, bars: [1800, 2100, 2400, 2600, 2800, 3000, 3240] },
];

const sidebarItems = [
  { icon: "📊", label: "Dashboard", active: true, href: "/coach/dashboard" },
  { icon: "🏒", label: "My Sessions", href: "#" },
  { icon: "👥", label: "Athletes", href: "#" },
  { icon: "💰", label: "Revenue", href: "#" },
  { icon: "🤖", label: "AI Tools", href: "/coach" },
  { icon: "💬", label: "Messages", href: "#" },
  { icon: "⚙️", label: "Settings", href: "#" },
  { icon: "👤", label: "Coach Profile", href: "/coach/settings/profile", isChild: true },
];

const activeSessions = [
  { name: "AAA Power Skating Elite", sport: "Hockey", color: "#3b82f6", fill: 92, price: "$85", spots: "12/13" },
  { name: "Advanced Shooting Clinic", sport: "Hockey", color: "#3b82f6", fill: 75, price: "$80", spots: "9/12" },
  { name: "Bantam Skills Development", sport: "Hockey", color: "#3b82f6", fill: 60, price: "$65", spots: "6/10" },
  { name: "Conditioning Camp Week 1", sport: "Fitness", color: "#f59e0b", fill: 88, price: "$70", spots: "14/16" },
  { name: "Goalie-Specific Training", sport: "Hockey", color: "#3b82f6", fill: 50, price: "$95", spots: "4/8" },
  { name: "Summer Multi-Sport Camp", sport: "Multi", color: "#8b5cf6", fill: 45, price: "$55", spots: "9/20" },
];

const recentAthletes = [
  { name: "Jake Morrison", sport: "Hockey — AAA", status: "active", initials: "JM" },
  { name: "Sophia Chen", sport: "Hockey — AA", status: "new", initials: "SC" },
  { name: "Liam Patel", sport: "Fitness — Elite", status: "active", initials: "LP" },
  { name: "Emma Dubois", sport: "Hockey — A", status: "inactive", initials: "ED" },
  { name: "Noah Williams", sport: "Hockey — AAA", status: "active", initials: "NW" },
  { name: "Ava Thompson", sport: "Multi-Sport", status: "new", initials: "AT" },
];

const revenueBreakdown = [
  { label: "Single Sessions", amount: "$4,280", pct: 34 },
  { label: "Multi-Session Packs", amount: "$5,100", pct: 41 },
  { label: "Camps", amount: "$2,400", pct: 19 },
  { label: "Private 1-on-1", amount: "$700", pct: 6 },
];

const weeklyBookings = [
  { day: "Mon", val: 8 },
  { day: "Tue", val: 12 },
  { day: "Wed", val: 6 },
  { day: "Thu", val: 14 },
  { day: "Fri", val: 10 },
  { day: "Sat", val: 18 },
  { day: "Sun", val: 4 },
];

const retentionData = [
  { label: "30-Day Return", pct: 82 },
  { label: "60-Day Return", pct: 68 },
  { label: "90-Day Return", pct: 54 },
  { label: "Season Loyalty", pct: 45 },
];

export default function CoachDashboard() {
  const [activeTab, setActiveTab] = useState("All Sessions");
  const [insightText, setInsightText] = useState("");
  const [insightLoading, setInsightLoading] = useState(true);
  const [profileQuality, setProfileQuality] = useState(100);
  const [profileComplete, setProfileComplete] = useState(true);

  useEffect(() => {
    const p = getCoachProfile(COACH_ID);
    if (p) {
      const q = calcProfileQuality(p);
      setProfileQuality(q);
      setProfileComplete(p.isComplete);
    }
  }, []);

  useEffect(() => {
    async function fetchInsight() {
      try {
        const res = await fetch("/api/ai-insight", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            prompt:
              "Generate one short, specific AI coaching insight for a coach named Tim Turk who coaches hockey in Toronto. The insight should be about session fill rates, pricing, or athlete retention. Keep it to 2 sentences max. Be direct and actionable.",
          }),
        });
        if (res.ok) {
          const data = await res.json();
          setInsightText(data.insight);
        } else {
          throw new Error("API error");
        }
      } catch {
        setInsightText(
          "Your Goalie-Specific Training session is only at 50% capacity. Consider dropping the price from $95 to $80 or bundling it with your Power Skating session to boost fill rate."
        );
      } finally {
        setInsightLoading(false);
      }
    }
    fetchInsight();
  }, []);

  const tabs = ["All Sessions", "Single", "Multiple Sessions", "Camp"];
  const maxWeekly = Math.max(...weeklyBookings.map((w) => w.val));

  return (
    <div className="dash">
      {/* ── Top Nav ── */}
      <header className="topnav">
        <div className="topnav-left">
          <Link href="/" className="topnav-logo" style={{ textDecoration: "none" }}>
            Coach<span>Easy</span>
          </Link>
          <span className="topnav-label">Coach Dashboard</span>
        </div>
        <div className="topnav-right">
          <div className="coach-pill">
            <div className="coach-pill-avatar">TT</div>
            <span className="coach-pill-name">Tim Turk</span>
          </div>
          <div className="notif-bell">
            🔔
            <span className="notif-badge">3</span>
          </div>
        </div>
      </header>

      {/* ── Sidebar ── */}
      <aside className="sidebar">
        {sidebarItems.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className={`sidebar-item${item.active ? " active" : ""}${item.isChild ? " child" : ""}`}
            style={item.isChild ? { paddingLeft: 52, fontSize: "12.5px" } : undefined}
          >
            <span className="sidebar-icon">{item.icon}</span>
            {item.label}
            {item.label === "Coach Profile" && !profileComplete && (
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#e53935", marginLeft: "auto", flexShrink: 0 }} />
            )}
          </Link>
        ))}
      </aside>

      {/* ── Main ── */}
      <main className="main">
        {/* Profile incomplete banner */}
        {!profileComplete && (
          <Link href="/coach/settings/profile" style={{ textDecoration: "none" }}>
            <div style={{ background: "rgba(251,191,36,0.1)", border: "1px solid rgba(251,191,36,0.3)", borderRadius: 12, padding: "14px 20px", marginBottom: 20, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ fontSize: 13, color: "#fbbf24" }}>
                Your profile is {profileQuality}% complete — athletes can&apos;t find you yet. <strong>Complete your profile &rarr;</strong>
              </span>
            </div>
          </Link>
        )}
        {/* KPI Row */}
        <div className="kpi-row">
          {kpis.map((kpi) => {
            const maxBar = Math.max(...kpi.bars);
            return (
              <div className="kpi-card" key={kpi.label}>
                <div className="kpi-label">{kpi.label}</div>
                <div className="kpi-value">{kpi.value}</div>
                <span className={`kpi-trend ${kpi.up ? "up" : "down"}`}>
                  {kpi.up ? "▲" : "▼"} {kpi.trend}
                </span>
                <div className="kpi-mini-bars">
                  {kpi.bars.map((b, i) => (
                    <div
                      key={i}
                      className="kpi-mini-bar"
                      style={{ height: `${(b / maxBar) * 28}px` }}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Session Tabs */}
        <div className="session-tabs">
          {tabs.map((tab) =>
            tab === "Single" ? (
              <Link
                key={tab}
                href="/coach"
                className={`session-tab${activeTab === tab ? " active" : ""}`}
              >
                {tab}
              </Link>
            ) : (
              <button
                key={tab}
                className={`session-tab${activeTab === tab ? " active" : ""}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            )
          )}
        </div>

        {/* Two-Col: Active Sessions + Recent Athletes */}
        <div className="two-col">
          <div className="panel">
            <div className="panel-header">
              <div>
                <div className="panel-title">Active Sessions</div>
                <div className="panel-subtitle">6 sessions running</div>
              </div>
              <Link href="/coach" className="panel-link">+ Create New</Link>
            </div>
            {activeSessions.map((s) => (
              <div className="session-row" key={s.name}>
                <div className="session-dot" style={{ background: s.color }} />
                <div className="session-info">
                  <div className="session-name">{s.name}</div>
                  <div className="session-meta">{s.sport} · {s.spots} spots</div>
                </div>
                <div className="fill-bar-wrap">
                  <div className="fill-bar" style={{ width: `${s.fill}%` }} />
                </div>
                <div className="session-price">{s.price}</div>
              </div>
            ))}
          </div>

          <div className="panel">
            <div className="panel-header">
              <div>
                <div className="panel-title">Recent Athletes</div>
                <div className="panel-subtitle">Latest sign-ups &amp; activity</div>
              </div>
              <span className="panel-link">View All</span>
            </div>
            {recentAthletes.map((a) => (
              <div className="athlete-row" key={a.name}>
                <div className="athlete-avatar">{a.initials}</div>
                <div className="athlete-info">
                  <div className="athlete-name">{a.name}</div>
                  <div className="athlete-sport">{a.sport}</div>
                </div>
                <span className={`status-badge ${a.status}`}>
                  {a.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Two-Col: Revenue Breakdown + Weekly Bookings */}
        <div className="two-col">
          <div className="panel">
            <div className="panel-header">
              <div className="panel-title">Revenue Breakdown</div>
              <span className="panel-link">Full Report</span>
            </div>
            {revenueBreakdown.map((r) => (
              <div className="rev-row" key={r.label}>
                <span className="rev-label">{r.label}</span>
                <div className="rev-bar-wrap">
                  <div className="rev-bar" style={{ width: `${r.pct}%` }} />
                </div>
                <span className="rev-amount">{r.amount}</span>
              </div>
            ))}
          </div>

          <div className="panel">
            <div className="panel-header">
              <div className="panel-title">Weekly Bookings</div>
              <span className="panel-subtitle">This week</span>
            </div>
            <div className="weekly-chart">
              {weeklyBookings.map((w) => (
                <div className="weekly-bar-col" key={w.day}>
                  <div
                    className="weekly-bar"
                    style={{ height: `${(w.val / maxWeekly) * 80}px` }}
                  />
                  <span className="weekly-bar-label">{w.day}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* AI Insight Banner */}
        <div className="ai-banner">
          <div className="ai-banner-left">
            <span className="ai-icon">🧠</span>
            <div style={{ flex: 1 }}>
              <div className="ai-label">AI Insight</div>
              {insightLoading ? (
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  <div className="ai-skeleton" style={{ width: "90%" }} />
                  <div className="ai-skeleton" style={{ width: "70%" }} />
                </div>
              ) : (
                <div className="ai-text">{insightText}</div>
              )}
            </div>
          </div>
          <button className="ai-btn">Apply Suggestion</button>
        </div>

        {/* Two-Col: Email Campaign + (placeholder) */}
        <div className="two-col">
          <div className="panel">
            <div className="panel-header">
              <div className="panel-title">Email Campaigns</div>
              <span className="panel-subtitle">Last 30 days</span>
            </div>
            <div className="email-stats">
              <div className="email-stat">
                <div className="email-stat-val">1,240</div>
                <div className="email-stat-label">Sent</div>
              </div>
              <div className="email-stat">
                <div className="email-stat-val">68%</div>
                <div className="email-stat-label">Open Rate</div>
              </div>
              <div className="email-stat">
                <div className="email-stat-val">12%</div>
                <div className="email-stat-label">Click Rate</div>
              </div>
            </div>
            <button className="email-btn">Compose New Email</button>
          </div>

          {/* Spot Fill Rate Donut */}
          <div className="panel">
            <div className="panel-header">
              <div className="panel-title">Spot Fill Rate</div>
              <span className="panel-subtitle">Overall</span>
            </div>
            <div className="donut-wrap">
              <div className="donut-ring">
                <svg width="120" height="120" viewBox="0 0 120 120">
                  <circle cx="60" cy="60" r="50" fill="none" stroke="#2a2a2a" strokeWidth="10" />
                  <circle
                    cx="60"
                    cy="60"
                    r="50"
                    fill="none"
                    stroke="#ED1C24"
                    strokeWidth="10"
                    strokeDasharray={`${0.78 * 314} ${314}`}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="donut-center">
                  <span className="donut-pct">78%</span>
                  <span className="donut-sub">Fill Rate</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Row: Athlete Retention + Payout Summary */}
        <div className="two-col">
          <div className="panel">
            <div className="panel-header">
              <div className="panel-title">Athlete Retention</div>
              <span className="panel-subtitle">Returning athletes</span>
            </div>
            {retentionData.map((r) => (
              <div className="retention-row" key={r.label}>
                <div className="retention-label-row">
                  <span className="retention-label">{r.label}</span>
                  <span className="retention-val">{r.pct}%</span>
                </div>
                <div className="retention-bar-wrap">
                  <div className="retention-bar" style={{ width: `${r.pct}%` }} />
                </div>
              </div>
            ))}
          </div>

          <div className="panel">
            <div className="panel-header">
              <div className="panel-title">Payout Summary</div>
              <span className="panel-subtitle">March 2026</span>
            </div>
            <div className="payout-row">
              <span className="payout-label">Completed Sessions</span>
              <span className="payout-value">$2,640</span>
            </div>
            <div className="payout-row">
              <span className="payout-label">Pending Sessions</span>
              <span className="payout-value pending">$600</span>
            </div>
            <div className="payout-row">
              <span className="payout-label">Platform Fee (8%)</span>
              <span className="payout-value">-$259</span>
            </div>
            <div className="payout-row">
              <span className="payout-label">Next Payout</span>
              <span className="payout-value">Apr 1, 2026</span>
            </div>
            <div className="payout-row" style={{ borderTop: "1px solid #333", marginTop: 4 }}>
              <span className="payout-label" style={{ fontWeight: 600, color: "#ccc" }}>
                Net Payout
              </span>
              <span className="payout-value total">$2,981</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
