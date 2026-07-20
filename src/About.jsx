import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const gradientStyle = {
  background: "linear-gradient(135deg, #166534, #166534, #1a7a3e)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  backgroundClip: "text",
};

const SKILL_GROUPS = [
  {
    label: "DATA",
    skills: [
      { name: "Python", icon: "devicon-python-plain colored", bg: "#f0f0f0" },
      { name: "SQL", icon: "devicon-postgresql-plain colored", bg: "#f0f0f0" },
      { name: "Tableau", icon: null, custom: "T", bg: "#E97627", textColor: "#fff" },
      { name: "Power BI", icon: null, custom: "⚡", bg: "#F2C811", textColor: "#000" },
      { name: "Looker Studio", icon: null, custom: "L", bg: "#4285F4", textColor: "#fff" },
      { name: "Snowflake", icon: null, custom: "❄", bg: "#29B5E8", textColor: "#fff" },
    ],
  },
  {
    label: "ENGINEERING",
    skills: [
      { name: "Docker", icon: "devicon-docker-plain colored", bg: "#f0f0f0" },
      { name: "FastAPI", icon: "devicon-fastapi-plain colored", bg: "#f0f0f0" },
      { name: "Kubernetes", icon: "devicon-kubernetes-plain colored", bg: "#f0f0f0" },
      { name: "Spark", icon: "devicon-apachespark-plain colored", bg: "#f0f0f0" },
      { name: "BigQuery", icon: "devicon-googlecloud-plain colored", bg: "#f0f0f0" },
      { name: "Airflow", icon: "devicon-apacheairflow-plain colored", bg: "#f0f0f0" },
      { name: "Kafka", icon: null, custom: "K", bg: "#231F20", textColor: "#fff" },
    ],
  },
  {
    label: "ML · AI",
    skills: [
      { name: "XGBoost", icon: null, custom: "XG", bg: "#166534", textColor: "#4ade80" },
      { name: "MLflow", icon: null, custom: "M", bg: "#0194E2", textColor: "#fff" },
      { name: "Hugging Face", icon: null, custom: "🤗", bg: "#FFD21E", textColor: "#000" },
      { name: "LangChain", icon: null, custom: "LC", bg: "#1C3144", textColor: "#4ade80" },
    ],
  },
];

// Update these hrefs with your real links.
const LINKS = [
  { key: "email", href: "mailto:trishashishodiya10@gmail.com", display: "trishashishodiya10@gmail.com" },
  { key: "linkedin", href: "https://www.linkedin.com/in/trishashishodiya/", display: "linkedin.com/in/trishashishodiya" },
  { key: "github", href: "https://github.com/trisha108", display: "github.com/trisha108" },
  { key: "drive", href: "https://drive.google.com/drive/u/0/folders/1myK272K0iIXg-qCNdK82tl2UGvosc-Rk", display: "View Resume" },
];

const LINK_ICONS = {
  email: (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m2 7 10 6 10-6" />
    </svg>
  ),
  linkedin: (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="#0A66C2">
      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.34V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.38-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.07 2.07 0 1 1 0-4.13 2.07 2.07 0 0 1 0 4.13zM7.12 20.45H3.56V9h3.56v11.45z" />
    </svg>
  ),
  github: (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
      <path d="M12 .5C5.73.5.5 5.73.5 12.02c0 5.03 3.26 9.3 7.79 10.81.57.1.78-.25.78-.55v-2.15c-3.17.69-3.84-1.36-3.84-1.36-.52-1.32-1.27-1.67-1.27-1.67-1.04-.71.08-.7.08-.7 1.15.08 1.75 1.18 1.75 1.18 1.02 1.75 2.68 1.24 3.33.95.1-.74.4-1.24.72-1.53-2.53-.29-5.19-1.27-5.19-5.63 0-1.24.44-2.26 1.17-3.05-.12-.29-.51-1.45.11-3.02 0 0 .96-.31 3.14 1.16a10.9 10.9 0 0 1 5.72 0c2.18-1.47 3.14-1.16 3.14-1.16.62 1.57.23 2.73.11 3.02.73.79 1.17 1.81 1.17 3.05 0 4.37-2.67 5.34-5.21 5.62.41.36.77 1.07.77 2.15v3.19c0 .31.21.66.79.55A10.53 10.53 0 0 0 23.5 12.02C23.5 5.73 18.27.5 12 .5z" />
    </svg>
  ),
  drive: (
    <svg viewBox="0 0 24 24" width="22" height="22">
      <path fill="#0066DA" d="M8.5 3 3 12.5l2.7 4.7L11.2 3z" />
      <path fill="#00AC47" d="M15.5 3H8.5l5.7 14.2H21z" />
      <path fill="#EA4335" d="M3 12.5 5.7 17.2h12.6L21 12.5H3z" />
    </svg>
  ),
};

function SkillIcon({ skill }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "10px" }}>
      <div style={{
        width: "56px", height: "56px",
        borderRadius: "14px",
        background: skill.bg,
        display: "flex", alignItems: "center", justifyContent: "center",
        flexShrink: 0,
      }}>
        {skill.icon ? (
          <i className={skill.icon} style={{ fontSize: "32px" }} />
        ) : (
          <span style={{
            fontSize: skill.custom.length > 2 ? "18px" : "22px",
            fontWeight: "900",
            color: skill.textColor || "#fff",
            fontFamily: "'Helvetica Neue', Arial, sans-serif",
            lineHeight: 1,
          }}>{skill.custom}</span>
        )}
      </div>
      <span style={{
        fontFamily: "monospace",
        fontSize: "10px",
        color: "rgba(175,197,239,0.6)",
        letterSpacing: "0.05em",
        textAlign: "center",
        whiteSpace: "nowrap",
      }}>{skill.name}</span>
    </div>
  );
}

export default function About({ onClose, onEnd, onTop }) {
  const containerRef = useRef(null);

  useEffect(() => {
    gsap.fromTo(containerRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.5, ease: "power2.out" }
    );

    const sections = containerRef.current.querySelectorAll(".fade-section");
    sections.forEach(el => {
      gsap.fromTo(el,
        { opacity: 0, y: 30 },
        {
          opacity: 1, y: 0, duration: 0.7, ease: "power2.out",
          scrollTrigger: {
            trigger: el,
            scroller: containerRef.current,
            start: "top 85%",
            toggleActions: "play none none none",
          },
        }
      );
    });

    // ScrollTrigger measures the custom scroller before layout settles;
    // refresh after mount so section animations fire at the right positions
    const refreshTimer = setTimeout(() => ScrollTrigger.refresh(), 300);

    const el = containerRef.current;
    const onScroll = () => {
      const atBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 40;
      if (atBottom && onEnd) onEnd();
    };

    // Scroll UP while already at the top → go back to Work page
    let backFired = false;
    let wheelAcc = 0;
    const onWheel = (e) => {
      if (!onTop || backFired) return;
      if (el.scrollTop <= 0 && e.deltaY < 0) {
        wheelAcc += -e.deltaY;
        if (wheelAcc > 120) { backFired = true; onTop(); }
      } else {
        wheelAcc = 0;
      }
    };
    let touchStartY = null;
    const onTouchStart = (e) => { touchStartY = e.touches[0].clientY; };
    const onTouchMove = (e) => {
      if (!onTop || backFired || touchStartY === null) return;
      const dy = e.touches[0].clientY - touchStartY; // finger pulled down = scroll up
      if (el.scrollTop <= 0 && dy > 90) { backFired = true; onTop(); }
    };
    const onTouchEnd = () => { touchStartY = null; };

    el.addEventListener("scroll", onScroll);
    el.addEventListener("wheel", onWheel, { passive: true });
    el.addEventListener("touchstart", onTouchStart, { passive: true });
    el.addEventListener("touchmove", onTouchMove, { passive: true });
    el.addEventListener("touchend", onTouchEnd, { passive: true });
    return () => {
      clearTimeout(refreshTimer);
      ScrollTrigger.getAll().forEach(t => t.kill());
      el.removeEventListener("scroll", onScroll);
      el.removeEventListener("wheel", onWheel);
      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("touchmove", onTouchMove);
      el.removeEventListener("touchend", onTouchEnd);
    };
  }, []);

  const stripStyle = {
    backgroundColor: "#0a1a0e",
    borderBottom: "1px solid rgba(74,222,128,0.08)",
  };

  return (
    <div ref={containerRef} style={{
      position: "fixed", inset: 0,
      zIndex: 200,
      overflowY: "scroll",
      overflowX: "hidden",
      overscrollBehavior: "none",
      backgroundColor: "transparent",
    }}>
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/devicon.min.css" />

      <div style={{ position: "relative", zIndex: 2 }}>

        {/* Strip 1 — Name full viewport, centered */}
        <div style={{
          ...stripStyle,
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "28px",
          padding: "60px 40px",
          textAlign: "center",
        }}>
          <h1 className="fade-section" style={{
            fontSize: "clamp(60px, 12vw, 160px)",
            fontWeight: "800",
            fontFamily: "'Helvetica Neue', Arial, sans-serif",
            margin: 0, lineHeight: 1, letterSpacing: "-0.03em",
            ...gradientStyle,
          }}>TRISHA<br />SHISHODIYA</h1>

          <p className="fade-section" style={{
            fontSize: "clamp(16px, 2vw, 22px)",
            fontFamily: "Inter, 'Helvetica Neue', Arial, sans-serif",
            color: "rgba(175,197,239,0.7)",
            margin: 0,
            letterSpacing: "0.15em",
          }}>DATA · ML · AI</p>
        </div>

        {/* Strip 2 — Skills, fully centered */}
        <div style={{ ...stripStyle, minHeight: "100vh", padding: "80px 40px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          <h2 className="fade-section" style={{
            fontSize: "clamp(60px, 10vw, 140px)",
            fontWeight: "800",
            fontFamily: "'Helvetica Neue', Arial, sans-serif",
            margin: "0 0 60px 0", lineHeight: 1, letterSpacing: "-0.03em",
            textAlign: "center",
            ...gradientStyle,
          }}>SKILLS</h2>

          <div style={{
            display: "flex",
            flexDirection: "column",
            gap: "56px",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            maxWidth: "760px",
            margin: "0 auto",
          }}>
            {SKILL_GROUPS.map(group => (
              <div key={group.label} className="fade-section" style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "22px",
                width: "100%",
              }}>
                <div style={{
                  fontFamily: "monospace",
                  fontSize: "10px",
                  color: "rgba(74,222,128,0.4)",
                  letterSpacing: "0.25em",
                  textAlign: "center",
                }}>{group.label}</div>
                <div style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "28px",
                  justifyContent: "center",
                  alignItems: "flex-start",
                  width: "100%",
                }}>
                  {group.skills.map(skill => <SkillIcon key={skill.name} skill={skill} />)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Let's work together */}
        <div style={{
          minHeight: "100vh",
          backgroundColor: "#050d06",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "40px",
          borderTop: "1px solid rgba(74,222,128,0.08)",
          padding: "80px 40px",
          textAlign: "center",
        }}>
          <h2 className="fade-section" style={{
            fontFamily: "'Helvetica Neue', Arial, sans-serif",
            fontSize: "clamp(50px, 10vw, 130px)",
            fontWeight: "900",
            letterSpacing: "-4px",
            margin: 0,
            lineHeight: 1,
            ...gradientStyle,
          }}>let's work<br />together?</h2>

          <p className="fade-section" style={{
            fontFamily: "Inter, 'Helvetica Neue', Arial, sans-serif",
            fontSize: "clamp(14px, 1.4vw, 18px)",
            color: "rgba(175,197,239,0.6)",
            margin: 0,
            maxWidth: "500px",
            lineHeight: 1.6,
          }}>Open to roles in Data, ML and AI</p>

          {/* Uniform link grid — same format, all four clickable and consistent */}
          <div className="fade-section" style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "16px",
            width: "100%",
            maxWidth: "520px",
          }}>
            {LINKS.map(({ key, href, display }) => (
              <a
                key={key}
                href={href}
                target="_blank"
                rel="noreferrer"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "10px",
                  padding: "22px 14px",
                  border: "1px solid rgba(74,222,128,0.2)",
                  borderRadius: "8px",
                  textDecoration: "none",
                  background: "rgba(74,222,128,0.04)",
                  transition: "border-color 0.2s, background 0.2s, transform 0.15s",
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = "rgba(74,222,128,0.5)";
                  e.currentTarget.style.background = "rgba(74,222,128,0.08)";
                  e.currentTarget.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = "rgba(74,222,128,0.2)";
                  e.currentTarget.style.background = "rgba(74,222,128,0.04)";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                <span style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "rgba(175,197,239,0.85)",
                }} aria-hidden="true">{LINK_ICONS[key]}</span>
                <span style={{
                  fontFamily: "Inter, 'Helvetica Neue', Arial, sans-serif",
                  fontSize: "12px",
                  color: "rgba(175,197,239,0.85)",
                  letterSpacing: "0.01em",
                  overflowWrap: "anywhere",
                  wordBreak: "break-word",
                  textAlign: "center",
                  lineHeight: 1.4,
                }}>{display}</span>
              </a>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}