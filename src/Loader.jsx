import { useEffect, useRef } from "react";
import { gsap } from "gsap";

export default function Loader({ onComplete }) {
  const containerRef = useRef(null);
  const countRef = useRef(null);

  useEffect(() => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += gsap.utils.random(4, 9);
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        if (countRef.current) countRef.current.textContent = "100";
        setTimeout(() => {
          gsap.to(containerRef.current, {
            opacity: 0,
            duration: 0.5,
            ease: "power2.inOut",
            onComplete,
          });
        }, 200);
      }
      if (countRef.current) {
        countRef.current.textContent = Math.floor(progress);
      }
    }, 40);

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1000,
        overflow: "hidden",
        background: `
          radial-gradient(ellipse at 20% 50%, rgba(22,101,52,0.45) 0%, transparent 55%),
          radial-gradient(ellipse at 80% 20%, rgba(74,222,128,0.25) 0%, transparent 50%),
          radial-gradient(ellipse at 60% 80%, rgba(22,101,52,0.35) 0%, transparent 50%),
          linear-gradient(135deg, #050a1a 0%, #080c20 100%)
        `,
      }}
    >
      {/* Counter bottom center */}
      <div style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        display: "flex",
        alignItems: "baseline",
        gap: "2px",
      }}>
        <span
          ref={countRef}
          style={{
            fontFamily: "'Helvetica Neue', Arial, sans-serif",
            fontSize: "clamp(48px, 8vw, 80px)",
            fontWeight: "900",
            letterSpacing: "-3px",
            background: "linear-gradient(135deg, #166534, #4ade80, #bbf7d0)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            lineHeight: 1,
          }}
        >0</span>
        <span style={{
          fontFamily: "monospace",
          fontSize: "clamp(14px, 2vw, 20px)",
          color: "rgba(74,222,128,0.5)",
          letterSpacing: "0.1em",
          paddingBottom: "8px",
        }}>/100</span>
      </div>
    </div>
  );
}