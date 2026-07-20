import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

const projects = [
  {
    name: "YouTube ETL Analytics",
    cards: [
      { img: "/viz3.png", insight: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua." },
      { img: "/viz1.png", insight: "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat." },
      { img: "/viz2.png", insight: "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur." },
      { img: "/viz4.jpg", insight: "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum." },
    ],
  },
  {
    name: "ChainTrace",
    cards: [
      { img: "/viz4.jpg", insight: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore." },
      { img: "/viz2.png", insight: "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat." },
      { img: "/viz1.png", insight: "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur." },
      { img: "/viz3.png", insight: "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum." },
    ],
  },
  {
    name: "2008 Mortgage Crisis",
    cards: [
      { img: "/viz1.png", insight: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore." },
      { img: "/viz4.jpg", insight: "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat." },
      { img: "/viz3.png", insight: "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur." },
      { img: "/viz2.png", insight: "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum." },
    ],
  },
  {
    name: "Driver Risk Scoring System",
    cards: [
      { img: "/viz2.png", insight: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore." },
      { img: "/viz3.png", insight: "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat." },
      { img: "/viz4.jpg", insight: "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur." },
      { img: "/viz1.png", insight: "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum." },
    ],
  },
];

function getCardStyle(offset) {
  const absOffset = Math.abs(offset);
  if (absOffset > 2) return null; // don't render far cards

  const scale = offset === 0 ? 1 : absOffset === 1 ? 0.78 : 0.6;
  const x = offset * 280;
  const rotateY = offset * -18;
  const zIndex = 10 - absOffset;
  const opacity = absOffset === 2 ? 0.4 : absOffset === 1 ? 0.75 : 1;

  return { scale, x, rotateY, zIndex, opacity };
}

export default function CardSlider({ projectIndex = 0, onClose }) {
  const [currentProject, setCurrentProject] = useState(projectIndex);
  const [currentCard, setCurrentCard] = useState(0);
  const containerRef = useRef(null);
  const cardRefs = useRef([]);

  const project = projects[currentProject];

  useEffect(() => {
    gsap.fromTo(containerRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.5, ease: "power2.out" }
    );
  }, []);

  useEffect(() => {
    setCurrentCard(0);
  }, [currentProject]);

  useEffect(() => {
    project.cards.forEach((_, i) => {
      const offset = i - currentCard;
      const style = getCardStyle(offset);
      const el = cardRefs.current[i];
      if (!el) return;

      if (!style) {
        gsap.set(el, { opacity: 0, pointerEvents: "none" });
        return;
      }

      gsap.to(el, {
        x: style.x,
        scale: style.scale,
        rotateY: style.rotateY,
        opacity: style.opacity,
        zIndex: style.zIndex,
        duration: 0.5,
        ease: "power3.out",
        pointerEvents: offset === 0 ? "auto" : "none",
      });
    });
  }, [currentCard, currentProject]);

  const handleClose = () => {
    gsap.to(containerRef.current, {
      opacity: 0, duration: 0.4, ease: "power2.in", onComplete: onClose,
    });
  };

  const goNext = () => setCurrentCard((i) => (i + 1) % project.cards.length);
  const goPrev = () => setCurrentCard((i) => (i - 1 + project.cards.length) % project.cards.length);

  return (
    <div
      ref={containerRef}
      style={{
        position: "fixed", inset: 0,
        backgroundColor: "rgba(5,10,26,0.97)",
        zIndex: 200,
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        backdropFilter: "blur(16px)",
        perspective: "1200px",
      }}
    >
      {/* Close */}
      <button onClick={handleClose} style={{
        position: "absolute", top: "32px", right: "40px",
        background: "none", border: "1px solid rgba(175,197,239,0.3)",
        color: "rgba(175,197,239,0.7)", width: "40px", height: "40px",
        borderRadius: "50%", cursor: "pointer", fontSize: "16px",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>✕</button>

      {/* Project name */}
      <div style={{ textAlign: "center", marginBottom: "48px" }}>
        <p style={{
          color: "rgba(175,197,239,0.35)", fontSize: "10px",
          fontFamily: "monospace", letterSpacing: "0.25em", marginBottom: "8px",
        }}>
          PROJECT {currentProject + 1} / {projects.length}
        </p>
        <h2 style={{
          color: "white", fontSize: "24px", fontWeight: "300",
          letterSpacing: "0.06em", fontFamily: "monospace", margin: 0,
        }}>
          {project.name}
        </h2>
      </div>

      {/* Cards stage */}
      <div style={{
        position: "relative",
        width: "100%",
        height: "420px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transformStyle: "preserve-3d",
      }}>
        {project.cards.map((card, i) => {
          const offset = i - currentCard;
          if (Math.abs(offset) > 2) return null;

          return (
            <div
              key={`${currentProject}-${i}`}
              ref={(el) => (cardRefs.current[i] = el)}
              onClick={() => {
                if (offset !== 0) setCurrentCard(i);
              }}
              style={{
                position: "absolute",
                width: "340px",
                borderRadius: "16px",
                border: `1px solid ${offset === 0 ? "rgba(106,176,255,0.4)" : "rgba(175,197,239,0.1)"}`,
                background: "rgba(10,15,35,0.95)",
                overflow: "hidden",
                cursor: offset !== 0 ? "pointer" : "default",
                transformStyle: "preserve-3d",
                willChange: "transform",
              }}
            >
              <img
                src={card.img}
                alt={`viz ${i + 1}`}
                style={{
                  width: "100%",
                  height: "280px",
                  objectFit: "cover",
                  display: "block",
                  borderBottom: "1px solid rgba(175,197,239,0.08)",
                }}
              />
              <div style={{ padding: "18px" }}>
                <p style={{
                  color: "rgba(175,197,239,0.55)",
                  fontSize: "11px",
                  fontFamily: "monospace",
                  lineHeight: "1.8",
                  letterSpacing: "0.02em",
                  margin: 0,
                }}>
                  {card.insight}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Prev / Next */}
      <div style={{ display: "flex", gap: "16px", marginTop: "32px" }}>
        <button onClick={goPrev} style={arrowBtn}>Prev</button>
        <button onClick={goNext} style={arrowBtn}>Next</button>
      </div>

      {/* Dot indicators */}
      <div style={{ display: "flex", gap: "8px", marginTop: "20px" }}>
        {project.cards.map((_, i) => (
          <div key={i} onClick={() => setCurrentCard(i)} style={{
            width: i === currentCard ? "24px" : "6px",
            height: "6px", borderRadius: "999px", cursor: "pointer",
            background: i === currentCard ? "rgba(106,176,255,0.8)" : "rgba(175,197,239,0.2)",
            transition: "all 0.3s ease",
          }} />
        ))}
      </div>

      {/* Other projects */}
      <div style={{
        position: "absolute", bottom: "32px",
        display: "flex", gap: "10px", flexWrap: "wrap",
        justifyContent: "center", padding: "0 40px",
      }}>
        {projects.map((p, i) => (
          <button key={i} onClick={() => setCurrentProject(i)} style={{
            background: "none",
            border: `1px solid ${i === currentProject ? "rgba(106,176,255,0.6)" : "rgba(175,197,239,0.15)"}`,
            color: i === currentProject ? "rgba(106,176,255,0.9)" : "rgba(175,197,239,0.35)",
            padding: "6px 16px", borderRadius: "999px",
            cursor: "pointer", fontSize: "10px",
            fontFamily: "monospace", letterSpacing: "0.12em",
            transition: "all 0.3s ease",
          }}>
            {p.name}
          </button>
        ))}
      </div>
    </div>
  );
}

const arrowBtn = {
  background: "none",
  border: "1px solid rgba(175,197,239,0.2)",
  color: "rgba(175,197,239,0.6)",
  padding: "10px 28px",
  borderRadius: "999px",
  cursor: "pointer",
  fontSize: "12px",
  fontFamily: "monospace",
  letterSpacing: "0.1em",
};