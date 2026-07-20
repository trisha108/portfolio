import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ScrollCube from "./ScrollCube";

gsap.registerPlugin(ScrollTrigger);

// true when viewport is phone-sized
function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" ? window.innerWidth <= breakpoint : false
  );
  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth <= breakpoint);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [breakpoint]);
  return isMobile;
}

const colorStops = [
  { bg: "#050a1a", ts: "#4ade80" },
  { bg: "#071a0d", ts: "#bbf7d0" },
  { bg: "#0a1a0e", ts: "#4ade80" },
  { bg: "#071a0d", ts: "#bbf7d0" },
  { bg: "#050a1a", ts: "#4ade80" },
  { bg: "#050a1a", ts: "#4ade80" },
];

function lerp(a, b, t) {
  const parse = hex => [
    parseInt(hex.slice(1, 3), 16),
    parseInt(hex.slice(3, 5), 16),
    parseInt(hex.slice(5, 7), 16),
  ];
  const ca = parse(a), cb = parse(b);
  const r = Math.round(ca[0] + (cb[0] - ca[0]) * t);
  const g = Math.round(ca[1] + (cb[1] - ca[1]) * t);
  const b2 = Math.round(ca[2] + (cb[2] - ca[2]) * t);
  return `rgb(${r},${g},${b2})`;
}

function getColorAtScroll(scrollFraction) {
  const total = colorStops.length - 1;
  const pos = scrollFraction * total;
  const idx = Math.min(Math.floor(pos), total - 1);
  const t = pos - idx;
  return {
    bg: lerp(colorStops[idx].bg, colorStops[idx + 1].bg, t),
    ts: lerp(colorStops[idx].ts, colorStops[idx + 1].ts, t),
  };
}

const gradientColor = "linear-gradient(135deg, #166534, #4ade80, #bbf7d0)";

function ToolCard({ name, isMobile }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        backgroundColor: "#fff",
        borderRadius: "12px",
        padding: isMobile ? "24px 16px" : "40px 32px",
        minHeight: isMobile ? "90px" : "160px",
        display: "flex", alignItems: "center", justifyContent: "center",
        cursor: "default",
        transition: "transform 0.3s ease, box-shadow 0.3s ease",
        transform: hovered ? "translateY(-6px)" : "translateY(0)",
        boxShadow: hovered ? "0 16px 40px rgba(0,0,0,0.12)" : "0 2px 12px rgba(0,0,0,0.04)",
      }}
    >
      <span style={{
        fontFamily: "Inter, 'Helvetica Neue', Arial, sans-serif",
        fontSize: isMobile ? "16px" : "clamp(20px, 2.5vw, 32px)",
        fontWeight: "800", letterSpacing: "-0.5px",
        textAlign: "center",
        background: hovered ? gradientColor : "none",
        WebkitBackgroundClip: hovered ? "text" : "unset",
        WebkitTextFillColor: hovered ? "transparent" : "#1a1a1a",
        transition: "all 0.3s ease",
      }}>{name}</span>
    </div>
  );
}

function StatBox({ value, description, colors, isMobile }) {
  return (
    <div style={{
      backgroundColor: "#fff", borderRadius: "12px",
      overflow: "hidden", boxShadow: "0 2px 24px rgba(0,0,0,0.07)",
    }}>
      <div style={{
        backgroundColor: "#1a1a1a", padding: "10px 16px",
        display: "flex", gap: "6px", alignItems: "center",
      }}>
        {["#ff5f57", "#febc2e", "#28c840"].map(c => (
          <div key={c} style={{ width: "10px", height: "10px", borderRadius: "50%", backgroundColor: c }} />
        ))}
      </div>
      <div style={{
        padding: isMobile ? "28px 20px" : "40px",
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
      }}>
        <span style={{
          fontFamily: "Inter, 'Helvetica Neue', Arial, sans-serif",
          fontSize: isMobile ? "56px" : "clamp(60px, 10vw, 100px)",
          fontWeight: "900", color: colors.ts,
          lineHeight: 1, letterSpacing: "-3px", transition: "color 0.4s",
        }}>{value}</span>
        <p style={{
          fontFamily: "Inter, 'Helvetica Neue', Arial, sans-serif",
          fontSize: isMobile ? "15px" : "20px", color: "#888",
          textAlign: "center", margin: "12px 0 0",
          maxWidth: "240px", lineHeight: "1.6",
        }}>{description}</p>
      </div>
    </div>
  );
}

function DateBox({ start, end, colors, isMobile }) {
  return (
    <div style={{
      backgroundColor: "#050a1a", borderRadius: "12px",
      padding: isMobile ? "28px 16px" : "40px 24px",
      minHeight: isMobile ? "110px" : "160px",
      display: "flex", alignItems: "center", justifyContent: "center",
      gap: "12px",
    }}>
      <span style={{
        fontFamily: "Inter, 'Helvetica Neue', Arial, sans-serif",
        fontSize: "clamp(20px, 2vw, 30px)",
        fontWeight: "300", color: colors.ts, opacity: 0.5, lineHeight: 1,
      }}>{"{"}</span>
      <span style={{
        fontFamily: "Inter, 'Helvetica Neue', Arial, sans-serif",
        fontSize: isMobile ? "13px" : "clamp(12px, 1.2vw, 16px)",
        fontWeight: "800", color: colors.ts,
        textAlign: "center", lineHeight: 1.4, transition: "color 0.4s",
      }}>{start}<br />—<br />{end}</span>
      <span style={{
        fontFamily: "Inter, 'Helvetica Neue', Arial, sans-serif",
        fontSize: "clamp(20px, 2vw, 30px)",
        fontWeight: "300", color: colors.ts, opacity: 0.5, lineHeight: 1,
      }}>{"}"}</span>
    </div>
  );
}

function WorkSection({ number, company, role, location, bullet, colors, boxRefs, boxStartIdx, tools, stat, testimonial, dateStart, dateEnd }) {
  const isMobile = useIsMobile();
  return (
    <section style={{
      backgroundColor: "#eeece8",
      padding: isMobile ? "56px 20px 40px" : "80px 40px 60px",
      borderBottom: "1px solid rgba(0,0,0,0.1)",
    }}>
      <div style={{
        paddingBottom: isMobile ? "20px" : "32px",
        borderBottom: "1px solid rgba(0,0,0,0.1)",
        marginBottom: isMobile ? "28px" : "40px",
      }}>
        <span style={{
          fontFamily: "Inter, 'Helvetica Neue', Arial, sans-serif",
          fontSize: isMobile ? "13px" : "15px", color: "#888", letterSpacing: "0.1em",
        }}>Work Experience</span>
      </div>

      <div style={{
        display: "grid",
        gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
        gap: isMobile ? "28px" : "40px",
        alignItems: "start",
      }}>
        {/* On mobile put text first, number+stat second for better reading order */}
        <div style={{
          display: "flex", flexDirection: "column",
          gap: isMobile ? "14px" : "20px",
          paddingTop: "8px",
          order: isMobile ? 1 : 2,
        }}>
          <h2 style={{
            fontFamily: "Inter, 'Helvetica Neue', Arial, sans-serif",
            fontSize: isMobile ? "30px" : "clamp(32px, 4vw, 54px)",
            fontWeight: "800", color: "#1a1a1a",
            margin: 0, lineHeight: 1.1, letterSpacing: "-1px",
          }}>{company}</h2>
          <span style={{
            fontFamily: "Inter, 'Helvetica Neue', Arial, sans-serif",
            fontSize: isMobile ? "15px" : "20px", color: "#888", letterSpacing: "0.08em",
          }}>{role}{location ? ` · ${location}` : ""}</span>

          <p style={{
            fontFamily: "Inter, 'Helvetica Neue', Arial, sans-serif",
            fontSize: isMobile ? "15px" : "clamp(16px, 1.6vw, 22px)",
            fontWeight: "700", color: "#1a1a1a",
            lineHeight: "1.5", margin: 0,
          }}>{bullet}</p>

          <div ref={el => { if (boxRefs) boxRefs.current[boxStartIdx + 1] = el; }}>
            <DateBox start={dateStart} end={dateEnd} colors={colors} isMobile={isMobile} />
          </div>
        </div>

        <div style={{
          display: "flex", flexDirection: "column",
          gap: isMobile ? "20px" : "32px",
          order: isMobile ? 2 : 1,
        }}>
          <span style={{
            fontFamily: "Inter, 'Helvetica Neue', Arial, sans-serif",
            fontSize: isMobile ? "64px" : "clamp(60px, 10vw, 180px)",
            fontWeight: "900", color: "#1a1a1a",
            lineHeight: "0.85", letterSpacing: "-4px",
          }}>{number}</span>
          {stat && (
            <div ref={el => { if (boxRefs) boxRefs.current[boxStartIdx] = el; }}>
              <StatBox {...stat} colors={colors} isMobile={isMobile} />
            </div>
          )}
        </div>
      </div>

      {tools && tools.length > 0 && (
        <div style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "repeat(2, 1fr)" : `repeat(${tools.length}, 1fr)`,
          gap: isMobile ? "12px" : "20px",
          marginTop: isMobile ? "28px" : "40px",
        }}>
          {tools.map((tool, i) => (
            <div key={tool} ref={el => { if (boxRefs) boxRefs.current[boxStartIdx + 2 + i] = el; }}>
              <ToolCard name={tool} isMobile={isMobile} />
            </div>
          ))}
        </div>
      )}

      {testimonial && (
        <div style={{
          marginTop: isMobile ? "40px" : "60px",
          paddingTop: isMobile ? "28px" : "40px",
          borderTop: "1px solid rgba(0,0,0,0.08)",
        }}>
          <div style={{
            fontFamily: "Inter, 'Helvetica Neue', Arial, sans-serif",
            fontSize: isMobile ? "20px" : "clamp(18px, 2.5vw, 36px)",
            fontWeight: "800", color: "#1a1a1a",
            lineHeight: 1.25, letterSpacing: "-0.5px", marginBottom: "20px",
          }}>
            "{testimonial.quote}"
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <div style={{ width: "32px", height: "1px", backgroundColor: "#1a1a1a", flexShrink: 0 }} />
            <div>
              <div style={{ fontFamily: "Inter, 'Helvetica Neue', Arial, sans-serif", fontSize: "13px", color: "#1a1a1a", fontWeight: "600" }}>{testimonial.name}</div>
              <div style={{ fontFamily: "Inter, 'Helvetica Neue', Arial, sans-serif", fontSize: "12px", color: "#888" }}>{testimonial.title}</div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

function GapDivider() {
  return (
    <div style={{
      height: "80px",
      backgroundImage: "url('/bg.svg')",
      backgroundSize: "cover",
      backgroundPosition: "center",
      borderTop: "1px solid rgba(74,222,128,0.08)",
      borderBottom: "1px solid rgba(74,222,128,0.08)",
    }} />
  );
}

function AchievementSection({ company, role, highlight, colors, dateStart, dateEnd }) {
  const isMobile = useIsMobile();
  return (
    <section style={{
      padding: isMobile ? "56px 20px" : "80px 40px",
      borderBottom: "1px solid rgba(255,255,255,0.06)",
      background: "transparent",
    }}>
      <div style={{
        paddingBottom: isMobile ? "20px" : "32px",
        borderBottom: "1px solid rgba(255,255,255,0.08)",
        marginBottom: isMobile ? "28px" : "40px",
      }}>
        <span style={{
          fontFamily: "Inter, 'Helvetica Neue', Arial, sans-serif",
          fontSize: isMobile ? "13px" : "15px", color: "rgba(175,197,239,0.4)", letterSpacing: "0.1em",
        }}>Achievement</span>
      </div>

      <div style={{
        display: "grid",
        gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
        gap: isMobile ? "24px" : "40px",
        alignItems: "center",
      }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <h2 style={{
            fontFamily: "Inter, 'Helvetica Neue', Arial, sans-serif",
            fontSize: isMobile ? "26px" : "clamp(28px, 3.5vw, 48px)",
            fontWeight: "800", color: "#fff",
            margin: 0, lineHeight: 1.1, letterSpacing: "-1px",
          }}>{company}</h2>
          <span style={{
            fontFamily: "Inter, 'Helvetica Neue', Arial, sans-serif",
            fontSize: "12px", color: "rgba(175,197,239,0.5)", letterSpacing: "0.08em",
          }}>{role}</span>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "8px" }}>
            <div style={{ width: "20px", height: "1px", backgroundColor: `${colors.ts}60` }} />
            <span style={{
              fontFamily: "Inter, 'Helvetica Neue', Arial, sans-serif",
              fontSize: "11px", color: "rgba(175,197,239,0.35)", letterSpacing: "0.15em",
            }}>{dateStart} — {dateEnd}</span>
          </div>
        </div>

        <div style={{
          border: `1px solid ${colors.ts}40`,
          borderRadius: "12px",
          padding: isMobile ? "24px 20px" : "32px 40px",
          display: "flex", alignItems: "center", justifyContent: "center",
          background: `${colors.ts}08`,
        }}>
          <span style={{
            fontFamily: "Inter, 'Helvetica Neue', Arial, sans-serif",
            fontSize: isMobile ? "17px" : "clamp(16px, 1.8vw, 22px)",
            fontWeight: "700", color: colors.ts,
            textAlign: "center", lineHeight: "1.4",
            transition: "color 0.4s",
            whiteSpace: "pre-line",
          }}>{highlight}</span>
        </div>
      </div>
    </section>
  );
}

function QuotePage({ quote, name, title, colors }) {
  const isMobile = useIsMobile();
  return (
    <section style={{
      minHeight: isMobile ? "auto" : "70vh",
      background: "transparent",
      display: "flex", flexDirection: "column",
      padding: isMobile ? "40px 20px 60px" : "40px 40px 80px",
      position: "relative", overflow: "hidden",
      borderBottom: "1px solid rgba(255,255,255,0.06)",
    }}>
      <div style={{
        paddingBottom: isMobile ? "20px" : "32px",
        borderBottom: "1px solid rgba(255,255,255,0.08)",
        marginBottom: isMobile ? "36px" : "60px",
      }}>
        <span style={{
          fontFamily: "Inter, 'Helvetica Neue', Arial, sans-serif",
          fontSize: isMobile ? "13px" : "15px", color: "rgba(255,255,255,0.4)", letterSpacing: "0.15em",
        }}>Quotes</span>
      </div>

      <div style={{ maxWidth: isMobile ? "100%" : "60%", zIndex: 2 }}>
        <div style={{
          fontFamily: "Inter, 'Helvetica Neue', Arial, sans-serif",
          fontSize: isMobile ? "24px" : "clamp(28px, 4vw, 56px)",
          fontWeight: "900", color: "#fff",
          lineHeight: 1.2, letterSpacing: "-1px", marginBottom: isMobile ? "28px" : "40px",
        }}>"{quote}"</div>
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div style={{ width: "40px", height: "1px", backgroundColor: "rgba(255,255,255,0.4)", flexShrink: 0 }} />
          <div>
            <div style={{ fontFamily: "Inter, 'Helvetica Neue', Arial, sans-serif", fontSize: "14px", color: "#fff", fontWeight: "600" }}>{name}</div>
            <div style={{ fontFamily: "Inter, 'Helvetica Neue', Arial, sans-serif", fontSize: "12px", color: "rgba(255,255,255,0.5)" }}>{title}</div>
          </div>
        </div>
      </div>

      <div style={{
        position: "absolute", right: isMobile ? "-30px" : "-60px", top: "50%",
        transform: "translateY(-50%)",
        zIndex: 1, userSelect: "none", pointerEvents: "none",
        fontFamily: "Inter, 'Helvetica Neue', Arial, sans-serif",
        fontSize: isMobile ? "160px" : "clamp(240px, 32vw, 420px)",
        fontWeight: "900", letterSpacing: isMobile ? "-10px" : "-20px",
        color: colors.ts, opacity: 0.1, lineHeight: 1,
        transition: "color 0.4s",
      }}>TS</div>
    </section>
  );
}

export default function Work({ onClose, onEnd }) {
  const containerRef = useRef(null);
  const scrollRef = useRef(null);
  const heroRef = useRef(null);
  const boxRefs = useRef([]);
  const [colors, setColors] = useState({ bg: "#050a1a", ts: "#4ade80" });
  const isMobile = useIsMobile();

  useEffect(() => {
    gsap.fromTo(containerRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.5, ease: "power2.out" }
    );

    const el = scrollRef.current;

    const setupBoxAnimations = () => {
      boxRefs.current.forEach((box) => {
        if (!box) return;
        gsap.fromTo(box,
          { opacity: 0, scale: 0.85, y: 50 },
          {
            opacity: 1, scale: 1, y: 0,
            duration: 0.6, ease: "back.out(1.7)",
            scrollTrigger: {
              trigger: box,
              scroller: el,
              start: "top 88%",
              toggleActions: "play none none reverse",
            },
          }
        );
      });
    };

    setTimeout(setupBoxAnimations, 300);

    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const maxScroll = el.scrollHeight - el.clientHeight;
        const fraction = maxScroll > 0 ? el.scrollTop / maxScroll : 0;
        setColors(getColorAtScroll(fraction));
        ticking = false;
      });
    };

    const checkEnd = () => {
      const maxScroll = el.scrollHeight - el.clientHeight;
      if (el.scrollTop >= maxScroll - 40 && onEnd) onEnd();
    };

    el.addEventListener("scroll", onScroll);
    el.addEventListener("scroll", checkEnd);
    return () => {
      el.removeEventListener("scroll", onScroll);
      el.removeEventListener("scroll", checkEnd);
    };
  }, []);

  const handleClose = () => {
    gsap.to(containerRef.current, { opacity: 0, duration: 0.4, onComplete: onClose });
  };

  return (
    <div ref={containerRef} style={{
      position: "fixed", inset: 0, zIndex: 200,
      backgroundColor: "transparent",
    }}>
      {!isMobile && <ScrollCube scrollRef={scrollRef} />}

      <div ref={scrollRef} style={{
        position: "absolute", inset: 0,
        overflowY: "scroll", overflowX: "hidden",
      }}>
        {/* HERO */}
        <section ref={heroRef} style={{
          height: "100vh", display: "flex", flexDirection: "column",
          justifyContent: "space-between",
          padding: isMobile ? "80px 20px 32px" : "32px 40px 40px",
          position: "relative", overflow: "hidden",
          background: "transparent",
        }}>
          <div style={{
            position: "absolute", right: isMobile ? "-20px" : "-40px", top: "50%",
            transform: "translateY(-50%)",
            fontFamily: "Inter, 'Helvetica Neue', Arial, sans-serif",
            fontSize: isMobile ? "200px" : "clamp(280px, 40vw, 520px)",
            fontWeight: "900", letterSpacing: isMobile ? "-10px" : "-20px",
            color: colors.ts, opacity: 0.12, lineHeight: 1,
            userSelect: "none", transition: "color 0.4s", zIndex: 1,
          }}>TS</div>
          <div style={{ zIndex: 2 }}>
            <div style={{ marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
              <div style={{ width: "1px", height: "32px", background: `linear-gradient(to bottom, transparent, ${colors.ts}90)` }} />
              <span style={{ fontFamily: "monospace", fontSize: "9px", color: "rgba(175,197,239,0.3)", letterSpacing: "0.2em" }}>SCROLL DOWN</span>
            </div>
            <h1 style={{
              fontFamily: "Inter, 'Helvetica Neue', Arial, sans-serif",
              fontSize: isMobile ? "34px" : "clamp(36px, 5vw, 72px)",
              fontWeight: "900", color: "#fff", margin: 0,
              lineHeight: 1.1, letterSpacing: "-1.5px", maxWidth: "700px",
              marginTop: isMobile ? "24px" : "40px",
            }}>Tech is the what.<br />Business is the why.<br />I build for both.</h1>
          </div>
        </section>

        {/* #1 Barkley Bites */}
        <WorkSection
          number="#1"
          company="Barkley Bites"
          role="AI Engineer"
          location=""
          bullet="Built and deployed an end-to-end AI system combining an XGBoost lifecycle classification model and an LLM-powered agentic chatbot, with custom evaluation frameworks and failure mode testing for both before production release."
          colors={colors}
          boxRefs={boxRefs}
          boxStartIdx={0}
          stat={{ value: "90.6%", description: "accuracy across 8 lifecycle segments" }}
          tools={["Python", "XGBoost", "LLM Integration", "REST APIs"]}
          dateStart="Jan 2026"
          dateEnd="May 2026"
        />

        {/* #2 DFW */}
        <WorkSection
          number="#2"
          company="DFW Airport"
          role="Data Analyst Intern"
          location="Dallas, TX"
          bullet="Diagnosed and resolved cross-system data pipeline failures through root cause analysis on distributed data flows, and built containerized Python validation workflows to reason about data consistency, concurrency, and I/O bottlenecks across Snowflake pipelines."
          colors={colors}
          boxRefs={boxRefs}
          boxStartIdx={5}
          stat={{ value: "30%", description: "reduction in data inconsistencies across airport IT systems" }}
          tools={["Python", "Snowflake", "Power BI"]}
          dateStart="Sep 2025"
          dateEnd="Dec 2025"
          testimonial={{
            quote: "Your expertise in data mapping across platforms, including Snowflake and AI tools such as Copilot, added immense value.",
            name: "Irfan Hasanali",
            title: "Director of IT Quality Services, Dallas Fort Worth International Airport",
          }}
        />

        <QuotePage
          quote="Trisha unquestionably ranks among the very best."
          name="Rami El-Youssef, D.Eng."
          title="Professor, The University of Texas at Dallas"
          colors={colors}
        />

        <GapDivider />

        <AchievementSection
          company="Nash Leaders Program"
          role="University of Texas at Dallas"
          highlight="Top 1% of graduating students at UTD"
          colors={colors}
          dateStart="Jan 2026"
          dateEnd="May 2026"
        />

        <GapDivider />

        {/* #3 UTD Dean's Council */}
        <WorkSection
          number="#3"
          company="University of Texas at Dallas"
          role="Junior Data Analyst"
          location="Dallas, TX"
          bullet="Automated academic data processing using Power Query and VBA, streamlining reporting workflows for the Dean's office."
          colors={colors}
          boxRefs={boxRefs}
          boxStartIdx={10}
          stat={{ value: "80%", description: "reduction in manual lookup time through automation" }}
          tools={["Power Query", "VBA"]}
          dateStart="Sep 2024"
          dateEnd="Sep 2025"
          testimonial={{
            quote: "Her performance was top notch and really enhanced the overall work and success of the Dean's office.",
            name: "Kent Seaver",
            title: "Director of Academic Operations, University of Texas at Dallas",
          }}
        />

        <AchievementSection
          company="AWS She Builds Mentorship Program"
          role="Amazon Web Services"
          highlight="Selected among top 45% of applicants worldwide"
          colors={colors}
          dateStart="Sep 2025"
          dateEnd="Nov 2025"
        />

        <AchievementSection
          company="Entrepreneurship Cell, S.P.I.T."
          role="Vice-Chairperson & Head of Social Media"
          highlight={"National Rank 1\namong 900 teams — IIT Bombay"}
          colors={colors}
          dateStart="Feb 2021"
          dateEnd="Aug 2023"
        />

        <GapDivider />

        <QuotePage
          quote="Trisha exhibited remarkable grit, persistence and passion following through a year-long campaign towards a national win."
          name="Kaisar Katchi"
          title="Faculty Mentor, National Entrepreneurship Challenge"
          colors={colors}
        />

        <GapDivider />

        {/* #4 IIT Bombay */}
        <WorkSection
          number="#4"
          company="IIT-Bombay, C-MInDS"
          role="Data Analyst Intern"
          location="Mumbai, India"
          bullet="Engineered distributed data pipelines processing high-frequency sensor readings across 200+ networked instruments, and built automated test suites to validate model outputs (XGBoost, Random Forest) against accuracy thresholds and flag anomalous behavior pre-deployment."
          colors={colors}
          boxRefs={boxRefs}
          boxStartIdx={13}
          stat={{ value: "15%", description: "improvement in failure prediction accuracy" }}
          tools={["Python", "Snowflake", "Power BI"]}
          dateStart="Jan 2023"
          dateEnd="Jun 2023"
        />

      </div>
    </div>
  );
}