import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

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

const PROJECTS = [
  {
    id: "chain",
    name: "ChainTrace",
    subtitle: "Blockchain AML Detection Platform for Financial Intelligence Units",
    tools: "Python · FastAPI · NetworkX · XGBoost · Pandas · React · TypeScript · Plotly · Docker · Hugging Face",
    color: "#c084fc",
    bg: "linear-gradient(135deg, #0d0a1a, #120d24)",
    border: "rgba(192,132,252,0.7)",
    metric: {
      label: "WALLETS FLAGGED",
      value: "6,678",
      subtitle: "suspicious wallets across 7 behavioral detection patterns · 32 criminal networks detected",
    },
    images: [
      "/projects/chain-1.png",
      "/projects/chain-2.png",
      "/projects/chain-3.png",
      "/projects/chain-4.png",
    ],
    captions: [
      "Criminal networks spin up hundreds of wallets and layer transactions within hours — ChainTrace maps the entire network automatically",
      "Fan-in dominates — wallets acting as consolidation points are the most common criminal pattern across 203,769 transactions",
      "Click any network and the globe draws the money trail — curved lines connecting every wallet from entry to exit across jurisdictions",
      "Every detected network ships with a confidence score built from 3 signals — not a black box, every flag is explainable",
    ],
    faces: [
      { l: "THE PROBLEM", t: "Investigators trace money laundering manually, wallet by wallet" },
      { l: "DETECTION", t: "Pattern frequency analysis across 203,769 Bitcoin transactions" },
      { l: "THE GLOBE", t: "Criminal networks plotted by geographic concentration and risk" },
      { l: "INTELLIGENCE", t: "Network detail — confidence breakdown across 3 signals" },
    ],
  },
  {
    id: "churn",
    name: "Churn Prediction",
    subtitle: "Employee Attrition and Retention Intelligence",
    tools: "Python · XGBoost · SHAP · MLflow · FastAPI · Docker · Claude API",
    color: "#67e8f9",
    bg: "linear-gradient(135deg, #0a1a2e, #0d2a40)",
    border: "rgba(103,232,249,0.7)",
    metric: {
      label: "MODEL INSIGHT",
      value: "0.83",
      subtitle: "AUC-ROC — Logistic Regression beat tuned XGBoost",
    },
    images: [
      "/projects/churn-1.png",
      "/projects/churn-2.png",
      "/projects/churn-3.png",
      "/projects/churn-4.png",
    ],
    captions: [
      "Logistic Regression outperformed tuned XGBoost — 0.83 vs 0.81 AUC-ROC — complexity is not always better",
      "Environment satisfaction and job involvement outranked salary as churn drivers — this is a culture problem",
      "HR's attrition climbs to 7% monthly within 6 months — 5x Sales and R&D combined",
      "8 of 10 highest-risk employees needed career growth intervention — not a raise",
    ],
    faces: [
      { l: "INSIGHT 1", t: "Model benchmarking across LR, RF, and XGBoost" },
      { l: "INSIGHT 2", t: "SHAP feature impact on churn probability" },
      { l: "INSIGHT 3", t: "6-month churn forecast by department" },
      { l: "METRIC", t: "0.83", s: "AUC-ROC — Logistic Regression", m: true },
    ],
  },
  {
    id: "youtube",
    name: "YouTube Analytics",
    subtitle: "Cross-Channel Performance Intelligence",
    tools: "Python · YouTube Data API · Snowflake · dbt · BigQuery · Looker Studio",
    color: "#afc5ef",
    bg: "linear-gradient(135deg, #050a1a, #0a1530)",
    border: "rgba(175,197,239,0.7)",
    metric: {
      label: "SCALE OF INSIGHT",
      value: "478.7x",
      subtitle: "more views from one creator than two institutions combined",
    },
    images: [
      "/projects/youtube-1.png",
      "/projects/youtube-2.png",
      "/projects/youtube-3.png",
      "/projects/youtube-4.png",
    ],
    captions: [
      "MrBeast generated 130.7B views — 478.7x more than ESPN and NASA combined",
      "NASA posted the highest engagement rate — peaking near 3.4% — views and engagement are different metrics",
      "One MrBeast video drew 1.82B views — more than ESPN's entire 500-video sample combined",
      "ESPN published 500 videos in 11 days — MrBeast took 8 years — a 280x gap in upload cadence",
    ],
    faces: [
      { l: "INSIGHT 1", t: "Total views comparison across 3 channels" },
      { l: "INSIGHT 2", t: "Engagement rate trend by channel 2018-2026" },
      { l: "INSIGHT 3", t: "Top 10 most-viewed videos across all channels" },
      { l: "METRIC", t: "478.7x", s: "view gap between creator and institutions", m: true },
    ],
  },
  {
    id: "eval",
    name: "Coding Agent Eval Harness",
    subtitle: "Automated grading infrastructure for AI coding agents — beyond pass/fail",
    tools: "Claude API · Supabase · PostgreSQL · React",
    color: "#6ee7b7",
    bg: "linear-gradient(135deg, #0a1a0e, #0d2a14)",
    border: "rgba(110,231,183,0.7)",
    metric: {
      label: "FAILURE MODES IDENTIFIED",
      value: "3",
      subtitle: "distinct failure modes · 0 human reviewers · 0 false categorizations",
    },
    images: [
      "/projects/eval-1.png",
      "/projects/eval-2.png",
      "/projects/eval-3.png",
      "/projects/eval-4.png",
    ],
    captions: [
      "Same task. Three submissions. Three completely different failure shapes — invisible to a binary pass/fail check.",
      "The grader doesn't just flag failure — it explains exactly why, naming the specific bug the agent missed.",
      "Wrong approach scores 1.0 on correctness but 0.0 on efficiency — the code works, but solves a different problem than asked.",
      "Correctness and efficiency scores were inversely correlated across failure types — a single score would have hidden this entirely.",
    ],
    faces: [
      { l: "THE PROBLEM", t: "Binary pass/fail misses what actually went wrong" },
      { l: "LIVE EVAL", t: "Task → buggy code → scores → failure mode → reasoning" },
      { l: "RESULTS", t: "Task names, scores, colored failure badges" },
      { l: "SCORING", t: "Radar chart — three failure types across three dimensions" },
    ],
  },
];

const PERSPECTIVE = 1200;
const ZOOM_DURATION = 0.85;
const BLUR_START_AT = 0.40;
const MAX_BLUR = 4;

const FR = [
  { x: 0, y: 0 },
  { x: 0, y: -90 },
  { x: 0, y: -180 },
  { x: 0, y: -270 },
  { x: 90, y: 0 },
  { x: -90, y: 0 },
];

function calcWrapperSize(targetW, targetH) {
  return {
    w: (targetW * PERSPECTIVE) / (PERSPECTIVE + targetW / 2),
    h: (targetH * PERSPECTIVE) / (PERSPECTIVE + targetH / 2),
  };
}

function MetricCard({ project, small }) {
  return (
    <div style={{
      width: "100%", height: "100%",
      background: project.color,
      borderRadius: "10px",
      display: "flex", flexDirection: "column",
      justifyContent: "center", alignItems: "flex-start",
      padding: small ? "12px" : "22px",
      boxSizing: "border-box",
    }}>
      <div style={{
        fontFamily: "monospace",
        fontSize: small ? "8px" : "11px",
        color: "rgba(0,0,0,0.5)",
        letterSpacing: "0.12em",
        marginBottom: small ? "6px" : "10px",
      }}>{project.metric.label}</div>
      <div style={{
        fontFamily: "Inter, 'Helvetica Neue', Arial, sans-serif",
        fontSize: small ? "28px" : "52px",
        fontWeight: "900",
        color: "#050a1a",
        lineHeight: 1,
        letterSpacing: "-1px",
      }}>{project.metric.value}</div>
      <div style={{
        fontFamily: "monospace",
        fontSize: small ? "8px" : "12px",
        color: "rgba(0,0,0,0.6)",
        marginTop: small ? "6px" : "12px",
        lineHeight: 1.4,
        maxWidth: "100%",
      }}>{project.metric.subtitle}</div>
    </div>
  );
}

/* ═══════════════════════ MOBILE EXPERIENCE ═══════════════════════ */

function MobileProjectList({ onSelect }) {
  return (
    <div style={{
      position: "absolute", inset: 0,
      overflowY: "auto", overflowX: "hidden",
      WebkitOverflowScrolling: "touch",
      padding: "80px 20px 40px",
      boxSizing: "border-box",
    }}>
      <div style={{
        fontFamily: "monospace", fontSize: "10px",
        color: "rgba(74,222,128,0.5)", letterSpacing: "0.25em",
        textAlign: "center", marginBottom: "24px",
      }}>PROJECTS · TAP TO EXPLORE</div>

      <div style={{ display: "flex", flexDirection: "column", gap: "16px", maxWidth: "480px", margin: "0 auto" }}>
        {PROJECTS.map((p, i) => (
          <div
            key={p.id}
            onClick={() => onSelect(i)}
            style={{
              background: p.bg,
              border: `1px solid ${p.color}70`,
              borderRadius: "12px",
              padding: "22px 20px",
              cursor: "pointer",
              display: "flex", flexDirection: "column", gap: "10px",
            }}
          >
            <div style={{
              fontFamily: "Inter, 'Helvetica Neue', Arial, sans-serif",
              fontSize: "20px", fontWeight: "900", color: "#fff", lineHeight: 1.15,
            }}>{p.name.toUpperCase()}</div>
            <div style={{
              fontFamily: "Inter, 'Helvetica Neue', Arial, sans-serif",
              fontSize: "14px", color: `${p.color}b0`, lineHeight: 1.4,
            }}>{p.subtitle}</div>
            <div style={{
              fontFamily: "Inter, 'Helvetica Neue', Arial, sans-serif",
              fontSize: "11px", color: `${p.color}70`, lineHeight: 1.6, letterSpacing: "0.03em",
            }}>{p.tools}</div>
            <div style={{
              fontFamily: "monospace", fontSize: "9px",
              color: p.color, letterSpacing: "0.2em", marginTop: "4px",
            }}>VIEW PROJECT →</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function MobileProjectDetail({ projectIdx, onBack, onNext, isLast }) {
  const p = PROJECTS[projectIdx];
  const scrollRef = useRef(null);

  // reset scroll to top when project changes
  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = 0;
  }, [projectIdx]);

  return (
    <div ref={scrollRef} style={{
      position: "absolute", inset: 0,
      overflowY: "auto", overflowX: "hidden",
      WebkitOverflowScrolling: "touch",
      padding: "80px 20px 40px",
      boxSizing: "border-box",
    }}>
      <div style={{ maxWidth: "520px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "18px" }}>

        {/* back link */}
        <button
          onClick={onBack}
          style={{
            alignSelf: "flex-start",
            background: "none", border: "none", cursor: "pointer",
            fontFamily: "monospace", fontSize: "10px",
            color: "rgba(175,197,239,0.6)", letterSpacing: "0.2em",
            padding: "4px 0",
          }}
        >← ALL PROJECTS</button>

        {/* header card */}
        <div style={{
          background: p.bg,
          border: `1px solid ${p.border}`,
          borderRadius: "12px",
          padding: "24px 20px",
          display: "flex", flexDirection: "column", gap: "12px",
        }}>
          <div style={{
            fontFamily: "Inter, 'Helvetica Neue', Arial, sans-serif",
            fontSize: "26px", fontWeight: "900", color: "#fff",
            lineHeight: 1.1, letterSpacing: "-0.5px",
          }}>{p.name.toUpperCase()}</div>
          <div style={{
            fontFamily: "Inter, 'Helvetica Neue', Arial, sans-serif",
            fontSize: "14px", color: `${p.color}b0`, lineHeight: 1.4,
          }}>{p.subtitle}</div>
          <div style={{
            fontFamily: "Inter, 'Helvetica Neue', Arial, sans-serif",
            fontSize: "11px", color: `${p.color}70`, lineHeight: 1.7,
          }}>{p.tools}</div>
        </div>

        {/* metric card */}
        <div style={{ borderRadius: "12px", overflow: "hidden", minHeight: "170px", display: "flex" }}>
          <MetricCard project={p} small={false} />
        </div>

        {/* images with captions */}
        {p.images.map((src, i) => (
          <div key={src} style={{
            border: `1px solid ${p.color}40`,
            borderRadius: "12px",
            overflow: "hidden",
            background: p.id === "youtube" ? "#f8f9fb" : "#050a1a",
          }}>
            <img
              src={src}
              alt={p.captions[i] || `${p.name} insight ${i + 1}`}
              style={{ width: "100%", height: "auto", display: "block" }}
            />
            {p.captions[i] && (
              <div style={{
                padding: "12px 14px",
                background: "rgba(0,0,0,0.75)",
                fontFamily: "monospace", fontSize: "11px",
                color: "rgba(255,255,255,0.85)",
                lineHeight: 1.6, letterSpacing: "0.03em",
              }}>{p.captions[i]}</div>
            )}
          </div>
        ))}

        {/* prev / next navigation */}
        <div style={{ display: "flex", gap: "12px", marginTop: "8px" }}>
          <button
            onClick={onBack}
            style={{
              flex: 1,
              background: "none",
              border: "1px solid rgba(175,197,239,0.35)",
              borderRadius: "8px",
              color: "rgba(175,197,239,0.85)",
              fontFamily: "monospace", fontSize: "10px",
              letterSpacing: "0.15em",
              padding: "14px 10px", cursor: "pointer",
            }}
          >ALL PROJECTS</button>
          <button
            onClick={onNext}
            style={{
              flex: 1,
              background: `${p.color}18`,
              border: `1px solid ${p.color}`,
              borderRadius: "8px",
              color: p.color,
              fontFamily: "monospace", fontSize: "10px",
              letterSpacing: "0.15em",
              padding: "14px 10px", cursor: "pointer",
            }}
          >{isLast ? "WORK & MORE →" : "NEXT PROJECT →"}</button>
        </div>
      </div>
    </div>
  );
}

function MobileProjects({ projectId, onEnd }) {
  const startIdx = projectId === "__overview__" || !projectId
    ? null
    : Math.max(PROJECTS.findIndex(pr => pr.id === projectId), 0);

  // If opened from a specific cube face, jump straight to that project's detail
  const [selectedIdx, setSelectedIdx] = useState(startIdx);

  const handleNext = () => {
    if (selectedIdx >= PROJECTS.length - 1) {
      if (onEnd) onEnd();
    } else {
      setSelectedIdx(selectedIdx + 1);
    }
  };

  return (
    <div style={{ position: "absolute", inset: 0 }}>
      {selectedIdx === null ? (
        <MobileProjectList onSelect={setSelectedIdx} />
      ) : (
        <MobileProjectDetail
          projectIdx={selectedIdx}
          onBack={() => setSelectedIdx(null)}
          onNext={handleNext}
          isLast={selectedIdx === PROJECTS.length - 1}
        />
      )}
    </div>
  );
}

/* ═══════════════════════ DESKTOP EXPERIENCE (unchanged) ═══════════════════════ */

// ── SINGLE PROJECT CARD (birds-eye) ──
function ProjectCard({ project, index, isLeft, onSelect }) {
  const [hovered, setHovered] = useState(false);
  const CUBE_H = 280, CUBE_W = 280, CARD_W = 280, CARD_H = 280, STEP = 84;

  const fanCards = [
    { type: "image", src: project.images[0], label: "INSIGHT 1" },
    { type: "image", src: project.images[1], label: "INSIGHT 2" },
    { type: "image", src: project.images[2], label: "INSIGHT 3" },
    { type: "metric" },
  ];

  return (
    <div style={{ position: "relative", width: `${CUBE_W}px`, height: `${CUBE_H}px`, overflow: "visible" }}>
      <div
        onClick={() => onSelect(index)}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          width: `${CUBE_W}px`, height: `${CUBE_H}px`,
          background: project.bg,
          border: `1px solid ${project.color}80`,
          borderRadius: "10px", cursor: "pointer",
          display: "flex", flexDirection: "column",
          justifyContent: "space-between", padding: "20px",
          flexShrink: 0,
          transition: "transform 0.2s, box-shadow 0.2s",
          transform: hovered ? "scale(1.02)" : "scale(1)",
          boxShadow: hovered ? `0 0 24px ${project.color}30` : "none",
          position: "relative", zIndex: 10,
        }}
      >
        {/* CHANGE 1: font size 20px */}
        <div style={{ fontFamily: "Inter, 'Helvetica Neue', Arial, sans-serif", fontSize: "20px", fontWeight: "900", color: "#fff", lineHeight: 1.1 }}>{project.name.toUpperCase()}</div>
        {/* CHANGE 2: Inter font, 15px */}
        <div style={{ fontFamily: "Inter, 'Helvetica Neue', Arial, sans-serif", fontSize: "15px", color: `${project.color}90`, lineHeight: 1.4 }}>{project.subtitle}</div>
        {/* CHANGE 3: Inter font, 12px */}
        <div style={{ fontFamily: "Inter, 'Helvetica Neue', Arial, sans-serif", fontSize: "12px", color: `${project.color}60`, letterSpacing: "0.05em", lineHeight: 1.6 }}>{project.tools}</div>
      </div>

      {fanCards.map((fc, fi) => (
        <div key={fi} style={{
          position: "absolute", top: 0,
          left: isLeft ? `${-(CUBE_W * 0.6 + fi * STEP)}px` : `${CUBE_W * 0.6 + fi * STEP}px`,
          right: "auto",
          width: `${CARD_W}px`, height: `${CARD_H}px`,
          borderRadius: "8px",
          overflow: "hidden",
          opacity: hovered ? 1 : 0,
          transform: hovered ? "translateX(0)" : `translateX(${isLeft ? 30 : -30}px)`,
          transition: `opacity 0.3s ${fi * 0.05}s, transform 0.4s cubic-bezier(.05,.43,.25,.95) ${fi * 0.05}s`,
          pointerEvents: hovered ? "all" : "none",
          zIndex: 9 - fi,
          background: fc.type === "metric" ? project.color : "#0d0d1a",
          border: `1px solid ${project.color}50`,
        }}>
          {fc.type === "image" ? (
            <div style={{ width: "100%", height: "100%", position: "relative" }}>
              <img
                src={fc.src}
                alt={fc.label}
                style={{ width: "100%", height: "100%", objectFit: "cover", background: "#050a1a", display: "block" }}
              />
              <div style={{
                position: "absolute", bottom: 0, left: 0, right: 0,
                padding: "6px 8px",
                background: "rgba(0,0,0,0.7)",
                fontFamily: "monospace", fontSize: "8px",
                color: `${project.color}cc`, letterSpacing: "0.08em",
              }}>{fc.label}</div>
            </div>
          ) : (
            <MetricCard project={project} small={true} />
          )}
        </div>
      ))}
    </div>
  );
}

// ── BIRDS-EYE OVERLAY ──
function BirdsEyeOverlay({ projectId, onSelectProject }) {
  const [zoomingIdx, setZoomingIdx] = useState(null);
  const startIdx = projectId === "__overview__"
    ? 0 : Math.max(PROJECTS.findIndex(p => p.id === projectId), 0);
  const orderedProjects = [...PROJECTS.slice(startIdx), ...PROJECTS.slice(0, startIdx)];
  const sceneRef = useRef(null);
  const wrapRef = useRef(null);

  const handleCardClick = (idx) => {
    if (zoomingIdx !== null) return;
    setZoomingIdx(idx);

    const projCard = document.querySelectorAll(".proj-card")[idx];
    const innerCard = projCard.querySelector("div");

    const rootRect = sceneRef.current.getBoundingClientRect();
    const cardRect = innerCard.getBoundingClientRect();
    const offsetX = (rootRect.width / 2) - (cardRect.left - rootRect.left + cardRect.width / 2);
    const offsetY = (rootRect.height / 2) - (cardRect.top - rootRect.top + cardRect.height / 2);

    document.querySelectorAll(".proj-card").forEach((c, i) => {
      if (i !== idx) { c.style.transition = "opacity 0.3s"; c.style.opacity = "0"; }
      c.style.pointerEvents = "none";
    });

    const origRect = innerCard.getBoundingClientRect();
    const { w: origW, h: origH } = calcWrapperSize(origRect.width, origRect.height);

    requestAnimationFrame(() => {
      wrapRef.current.style.transition = `transform ${ZOOM_DURATION}s cubic-bezier(0.77,0,0.18,1)`;
      wrapRef.current.style.transform = `translate(${offsetX}px,${offsetY}px) translateZ(350px)`;
    });

    const blurDelay = ZOOM_DURATION * BLUR_START_AT * 1000;
    const blurDuration = ZOOM_DURATION * (1 - BLUR_START_AT);
    const blurObj = { val: 0 };
    setTimeout(() => {
      gsap.to(blurObj, {
        val: MAX_BLUR,
        duration: blurDuration,
        ease: "sine.inOut",
        onUpdate: () => {
          innerCard.style.filter = `blur(${blurObj.val}px)`;
        },
      });
    }, blurDelay);

    wrapRef.current.addEventListener("transitionend", function onEnd(e) {
      if (e.propertyName !== "transform") return;
      wrapRef.current.removeEventListener("transitionend", onEnd);
      const finalRect = innerCard.getBoundingClientRect();
      const { w: fw, h: fh } = calcWrapperSize(finalRect.width, finalRect.height);
      wrapRef.current.style.transition = "none";
      wrapRef.current.style.opacity = "0";
      wrapRef.current.style.pointerEvents = "none";
      onSelectProject(idx, { w: fw, h: fh, origW, origH });
    });
  };

  return (
    <div ref={sceneRef} style={{
      position: "absolute", inset: 0, zIndex: 10,
      perspective: `${PERSPECTIVE}px`, perspectiveOrigin: "50% 50%",
    }}>
      <div ref={wrapRef} style={{
        position: "absolute", inset: 0,
        transformStyle: "preserve-3d",
        background: "transparent",
      }}>
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column" }}>
          <div style={{ paddingTop: "80px", flexShrink: 0, paddingBottom: "12px" }} />
          <div style={{
            flex: 1, display: "grid", gridTemplateColumns: "1fr 1fr",
            gridTemplateRows: "1fr 1fr", gap: "20px",
            padding: "0 60px 20px 60px",
            maxWidth: "700px", margin: "0 auto", width: "100%",
            overflow: "visible",
          }}>
            {orderedProjects.map((p, i) => (
              <div key={p.id} className="proj-card" style={{ overflow: "visible" }}>
                <ProjectCard
                  project={p} index={i}
                  isLeft={i === 0 || i === 2}
                  onSelect={handleCardClick}
                />
              </div>
            ))}
          </div>
          {/* HOVER TO PREVIEW — no dashes */}
          <div style={{ textAlign: "center", fontFamily: "monospace", fontSize: "9px", color: "rgba(74,222,128,0.4)", letterSpacing: "0.2em", paddingBottom: "16px", flexShrink: 0 }}>
            HOVER TO PREVIEW · CLICK TO EXPLORE
          </div>
        </div>
      </div>
    </div>
  );
}

// ── ZIGZAG VIEW ──
function ZigzagView({ startProjectIdx, onBack, onEnd, cubeDims }) {
  const containerRef = useRef(null);
  const initializedRef = useRef(false);
  const scroll3Ref = useRef(null);
  const stRef = useRef({ face: 0, isAnim: false, acc: 0 });

  useEffect(() => {
    if (!cubeDims || !containerRef.current) return;

    const container = containerRef.current;

    const handleWheel = (e) => {
      e.preventDefault();
      stRef.current.acc += e.deltaY;
      if (Math.abs(stRef.current.acc) >= 80) {
        const dir = stRef.current.acc > 0 ? 1 : -1;
        stRef.current.acc = 0;
        if (scroll3Ref.current) scroll3Ref.current(dir);
      }
    };
    window.addEventListener("wheel", handleWheel, { passive: false });

    if (initializedRef.current) {
      return () => window.removeEventListener("wheel", handleWheel);
    }
    initializedRef.current = true;

    container.innerHTML = `
      <div id="cubeScene" style="position:absolute;inset:0;perspective:${PERSPECTIVE}px;perspective-origin:50% 40%;transform-style:preserve-3d;opacity:1;pointer-events:all;">
        <div id="cubeWrapper" style="position:absolute;top:44%;left:50%;transform-style:preserve-3d;transform:translateZ(0);">
          <div id="cube" style="transform-style:preserve-3d;position:relative;">
            <div class="face" id="fFront" style="position:absolute;backface-visibility:hidden;border-radius:10px;overflow:hidden;"></div>
            <div class="face" id="fRight" style="position:absolute;backface-visibility:hidden;border-radius:10px;overflow:hidden;"></div>
            <div class="face" id="fBack" style="position:absolute;backface-visibility:hidden;border-radius:10px;overflow:hidden;"></div>
            <div class="face" id="fLeft" style="position:absolute;backface-visibility:hidden;border-radius:10px;overflow:hidden;"></div>
            <div class="face" id="fTop" style="position:absolute;backface-visibility:hidden;border-radius:10px;overflow:hidden;"></div>
            <div class="face" id="fBottom" style="position:absolute;backface-visibility:hidden;border-radius:10px;overflow:hidden;"></div>
          </div>
        </div>
      </div>
      <div id="faceCaption" style="position:absolute;bottom:100px;left:50%;transform:translateX(-50%);width:${Math.round(cubeDims.w * 1.7)}px;font-family:monospace;font-size:13px;color:rgba(255,255,255,0.85);text-align:center;letter-spacing:0.05em;;pointer-events:none;line-height:1.6;"></div>
      <div id="zzUI" style="position:absolute;inset:0;z-index:20;pointer-events:none;opacity:0;transition:opacity 0.3s;display:flex;flex-direction:column;align-items:center;justify-content:flex-end;padding-bottom:28px;">
        <div style="font-family:monospace;font-size:10px;color:rgba(175,197,239,0.4);;letter-spacing:0.2em;margin-bottom:8px;">SCROLL TO EXPLORE FACES</div>
        <button id="backBtn" style="display:none;"></button>
      </div>
    `;

    container.querySelector("#backBtn").addEventListener("click", onBack);

    const vo = [0, 1, 2, 3].map(i => (startProjectIdx + i) % 4);
    let cs = 0;
    const st = stRef.current;

    function setDims(w, h) {
      const half = Math.round(Math.min(w, h) / 2);
      container.querySelector("#cube").style.width = w + "px";
      container.querySelector("#cube").style.height = h + "px";
      container.querySelector("#cubeWrapper").style.marginLeft = (-w / 2) + "px";
      container.querySelector("#cubeWrapper").style.marginTop = (-h / 2) + "px";
      container.querySelectorAll(".face").forEach(f => {
        f.style.width = w + "px";
        f.style.height = h + "px";
      });
      container.querySelector("#fFront").style.transform = `translateZ(${half}px)`;
      container.querySelector("#fRight").style.transform = `rotateY(90deg) translateZ(${half}px)`;
      container.querySelector("#fBack").style.transform = `rotateY(180deg) translateZ(${half}px)`;
      container.querySelector("#fLeft").style.transform = `rotateY(-90deg) translateZ(${half}px)`;
      container.querySelector("#fTop").style.transform = `rotateX(90deg) translateZ(${half}px)`;
      container.querySelector("#fBottom").style.transform = `rotateX(-90deg) translateZ(${half}px)`;
    }

    function frontHTML(p) {
      return `<div style="width:100%;height:100%;background:${p.bg};border:1px solid ${p.border};padding:24px;box-sizing:border-box;display:flex;flex-direction:column;justify-content:space-between;border-radius:10px;">
        <div style="font-family:Inter,'Helvetica Neue',sans-serif;font-size:26px;font-weight:900;color:#fff;line-height:1.1;letter-spacing:-0.5px;">${p.name.toUpperCase()}</div>
        <div style="font-family:Inter,'Helvetica Neue',sans-serif;font-size:13px;color:${p.color}90;line-height:1.4;">${p.subtitle}</div>
        <div style="font-family:Inter,'Helvetica Neue',sans-serif;font-size:10px;color:${p.color}60;line-height:1.7;">${p.tools}</div>
      </div>`;
    }

    function imageHTML(src, bg = "#050a1a") {
      return `<div style="width:100%;height:100%;background:${bg};border-radius:10px;overflow:hidden;display:flex;align-items:center;justify-content:center;">
        <img src="${src}" style="width:100%;height:100%;object-fit:contain;display:block;" />
      </div>`;
    }

    function metricHTML(p) {
      return `<div style="width:100%;height:100%;background:${p.color};padding:24px;box-sizing:border-box;display:flex;flex-direction:column;justify-content:center;align-items:flex-start;border-radius:10px;">
        <div style="font-family:monospace;font-size:11px;color:rgba(0,0,0,0.5);letter-spacing:0.12em;margin-bottom:12px;">${p.metric.label}</div>
        <div style="font-family:Inter,'Helvetica Neue',sans-serif;font-size:56px;font-weight:900;color:#050a1a;line-height:1;letter-spacing:-1px;">${p.metric.value}</div>
        <div style="font-family:monospace;font-size:12px;color:rgba(0,0,0,0.6);margin-top:14px;line-height:1.5;">${p.metric.subtitle}</div>
      </div>`;
    }

    function populate(pi) {
      const cube = container.querySelector("#cube");
      cube.style.transition = "none";
      cube.style.transform = "rotateX(0deg) rotateY(0deg)";
      const p = PROJECTS[pi];
      container.querySelector("#fFront").innerHTML = frontHTML(p);
      const imgBg = p.id === "youtube" ? "#f8f9fb" : "#050a1a";
      container.querySelector("#fRight").innerHTML = imageHTML(p.images[0], imgBg);
      container.querySelector("#fBack").innerHTML = imageHTML(p.images[1], imgBg);
      container.querySelector("#fLeft").innerHTML = imageHTML(p.images[2], imgBg);
      container.querySelector("#fTop").innerHTML = metricHTML(p);
      container.querySelector("#fBottom").innerHTML = imageHTML(p.images[3], imgBg);
      requestAnimationFrame(() => requestAnimationFrame(() => {
        container.querySelector("#cube").style.transition = "transform 0.65s cubic-bezier(0.4,0,0.2,1)";
      }));
    }

    function rotateTo(fi) {
      const r = FR[fi];
      container.querySelector("#cube").style.transform = `rotateX(${r.x}deg) rotateY(${r.y}deg)`;
      const caption = container.querySelector("#faceCaption");
      const p = PROJECTS[vo[cs]];
      if (caption && p) {
        const captionMap = { 1: 0, 3: 1, 2: 2, 4: 3 };
        if (captionMap[fi] !== undefined && p.captions[captionMap[fi]]) {
          caption.textContent = p.captions[captionMap[fi]];
          // CHANGE 7: fixed light green color instead of project color
          caption.style.color = "#ffffff";
          caption.style.opacity = "1";
        } else {
          caption.style.opacity = "0";
        }
      }
    }

    function dots() { }

    function scroll3(dir) {
      if (st.isAnim) return;
      st.isAnim = true;
      const nf = st.face + dir;
      if (nf >= 0 && nf <= 5) {
        st.face = nf; rotateTo(nf); dots();
        setTimeout(() => { st.isAnim = false; }, 680);
      } else if (nf > 5) {
        const ns = cs + 1;
        if (ns >= 4) { st.isAnim = false; if (onEnd) onEnd(); return; }
        const wr = container.querySelector("#cubeWrapper");
        gsap.to(wr, {
          x: -500, opacity: 0, duration: 0.4, ease: "power2.in", onComplete: () => {
            cs = ns; st.face = 0; populate(vo[cs]);
            requestAnimationFrame(() => requestAnimationFrame(() => {
              rotateTo(0);
              gsap.fromTo(wr, { x: 500, opacity: 0 }, {
                x: 0, opacity: 1, duration: 0.4, ease: "power2.out",
                onComplete: () => { dots(); st.isAnim = false; },
              });
            }));
          },
        });
      } else {
        if (cs === 0) { st.isAnim = false; onBack(); return; }
        const wr = container.querySelector("#cubeWrapper");
        gsap.to(wr, {
          x: 500, opacity: 0, duration: 0.4, ease: "power2.in", onComplete: () => {
            cs--; st.face = 5; populate(vo[cs]);
            requestAnimationFrame(() => requestAnimationFrame(() => {
              rotateTo(5);
              gsap.fromTo(wr, { x: -500, opacity: 0 }, {
                x: 0, opacity: 1, duration: 0.4, ease: "power2.out",
                onComplete: () => { dots(); st.isAnim = false; },
              });
            }));
          },
        });
      }
    }

    scroll3Ref.current = scroll3;

    setDims(cubeDims.origW, cubeDims.origH);
    populate(vo[0]);
    setDims(cubeDims.w * 1.7, cubeDims.h * 1.7);
    container.querySelector("#cubeWrapper").style.transform = "translateZ(0)";

    const cube = container.querySelector("#cube");
    cube.style.filter = `blur(${MAX_BLUR}px)`;
    setTimeout(() => {
      cube.style.transition = "filter 0.25s ease-out, transform 0.65s cubic-bezier(0.4,0,0.2,1)";
      cube.style.filter = "blur(0px)";
      setTimeout(() => {
        if (cube) cube.style.filter = "";
      }, 280);
    }, 32);

    setTimeout(() => {
      const zzUI = container.querySelector("#zzUI");
      if (zzUI) { zzUI.style.opacity = "1"; zzUI.style.pointerEvents = "all"; }
      dots();
      setTimeout(() => {
        st.face = 1;
        rotateTo(1);
        dots();
      }, 300);
    }, 60);

    return () => window.removeEventListener("wheel", handleWheel);
  }, [cubeDims]);

  return (
    <div
      ref={containerRef}
      style={{
        position: "absolute", inset: 0, zIndex: 5,
        background: "transparent",
      }}
    />
  );
}

// ── MAIN COMPONENT ──
export default function ProjectCube({ projectId, onClose, onEnd }) {
  const isMobile = useIsMobile();

  const startIdx = projectId === "__overview__"
    ? 0 : Math.max(PROJECTS.findIndex(p => p.id === projectId), 0);

  const [mode, setMode] = useState("birdseye");
  const [selectedProjectIdx, setSelectedProjectIdx] = useState(0);
  const [cubeDims, setCubeDims] = useState(null);

  const handleSelectProject = (idx, dims) => {
    setCubeDims(dims);
    const actualIdx = (startIdx + idx) % 4;
    setSelectedProjectIdx(actualIdx);
    setMode("zigzag");
    setTimeout(() => setMode("zigzag_settled"), 400);
  };

  const handleBack = () => {
    setMode("birdseye");
    setSelectedProjectIdx(0);
    setCubeDims(null);
  };

  // ── MOBILE: touch-friendly list + scrollable detail ──
  if (isMobile) {
    return (
      <div style={{ position: "fixed", inset: 0, zIndex: 500, backgroundColor: "transparent" }}>
        <MobileProjects projectId={projectId} onEnd={onEnd} />
      </div>
    );
  }

  // ── DESKTOP: original birds-eye + 3D cube ──
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 500, backgroundColor: "transparent" }}>
      {(mode === "zigzag" || mode === "zigzag_settled") && (
        <ZigzagView
          startProjectIdx={selectedProjectIdx}
          onBack={handleBack}
          onEnd={onEnd}
          cubeDims={cubeDims}
        />
      )}
      {(mode === "birdseye" || mode === "zigzag") && (
        <BirdsEyeOverlay projectId={projectId} onSelectProject={handleSelectProject} />
      )}
    </div>
  );
}