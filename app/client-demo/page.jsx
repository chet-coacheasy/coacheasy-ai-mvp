"use client";

import DanielleWidget from "@/components/DanielleWidget";

const navLinks = ["Home", "Products", "Support", "Contact"];

const features = [
  {
    title: "Easy Setup",
    desc: "Our solution integrates with equipment you already have",
  },
  {
    title: "Work on the Go",
    desc: "Cloud-based and mobile friendly from anywhere",
  },
  {
    title: "24/7 Support",
    desc: "Our technical support team is here around the clock",
  },
];

export default function ClientDemoPage() {
  return (
    <div style={{ margin: 0, fontFamily: "'Segoe UI', Arial, sans-serif" }}>
      {/* Nav */}
      <nav
        style={{
          backgroundColor: "#003580",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 32px",
          height: 60,
        }}
      >
        <span style={{ color: "#fff", fontWeight: 700, fontSize: 20 }}>
          Expert Service Solutions
        </span>
        <div style={{ display: "flex", gap: 24 }}>
          {navLinks.map((l) => (
            <a
              key={l}
              href="#"
              style={{
                color: "#fff",
                textDecoration: "none",
                fontSize: 15,
                fontWeight: 500,
              }}
            >
              {l}
            </a>
          ))}
        </div>
      </nav>

      {/* Hero */}
      <section
        style={{
          backgroundColor: "#003580",
          color: "#fff",
          textAlign: "center",
          padding: "80px 24px",
        }}
      >
        <h1 style={{ fontSize: 40, margin: "0 0 16px" }}>
          The Complete ERP Solution For Your Business
        </h1>
        <p style={{ fontSize: 20, margin: "0 0 32px", opacity: 0.9 }}>
          Streamline your operations with Mobile Office Manager
        </p>
        <a
          href="#"
          style={{
            display: "inline-block",
            backgroundColor: "#fff",
            color: "#003580",
            padding: "14px 36px",
            borderRadius: 6,
            fontWeight: 700,
            fontSize: 16,
            textDecoration: "none",
          }}
        >
          Learn More
        </a>
      </section>

      {/* Features */}
      <section style={{ backgroundColor: "#f5f5f5", padding: "64px 24px" }}>
        <div
          style={{
            display: "flex",
            gap: 24,
            maxWidth: 960,
            margin: "0 auto",
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          {features.map((f) => (
            <div
              key={f.title}
              style={{
                backgroundColor: "#fff",
                borderRadius: 8,
                padding: "32px 24px",
                flex: "1 1 260px",
                maxWidth: 300,
                textAlign: "center",
                boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
              }}
            >
              <h3 style={{ margin: "0 0 12px", color: "#003580" }}>
                {f.title}
              </h3>
              <p style={{ margin: 0, color: "#555", lineHeight: 1.5 }}>
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer
        style={{
          textAlign: "center",
          padding: "24px 0",
          color: "#888",
          fontSize: 14,
        }}
      >
        &copy; Expert Service Solutions 2026
      </footer>

      {/* ESS Support Widget */}
      <DanielleWidget />
    </div>
  );
}
