import { useState, useRef, useEffect } from "react";
import { gsap } from "gsap";
import Loader from "./Loader";
import About from "./About";
import Work from "./Work";
import ProjectCube from "./ProjectCube";

// Simple hook: true when viewport is phone-sized
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

export default function App() {
  const [loaded, setLoaded] = useState(false);
  const [splineReady, setSplineReady] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [workOpen, setWorkOpen] = useState(false);
  const [activeCubeProject, setActiveCubeProject] = useState(null);
  const splineRef = useRef(null);
  const hintRef = useRef(null);
  const isMobile = useIsMobile();

  useEffect(() => {
    if (loaded && hintRef.current) {
      gsap.fromTo(hintRef.current,
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 1, delay: 1.5, ease: "power2.out" }
      );
    }
  }, [loaded]);

  // FIX: Wait for Spline to load before allowing navigation
  // Keep loader until spline iframe has had time to initialize
  const handleLoaderComplete = () => {
    setLoaded(true);
    // Give Spline 3 seconds to load in background before enabling nav
    setTimeout(() => setSplineReady(true), 3000);
    setTimeout(() => {
      if (splineRef.current) {
        gsap.fromTo(splineRef.current,
          { scale: 1.4, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.8, ease: "power3.out" }
        );
      }
    }, 50);
  };

  const goHome = () => {
    setAboutOpen(false);
    setWorkOpen(false);
    setActiveCubeProject(null);
  };

  const handleWorkEnd = () => {
    setWorkOpen(false);
    setTimeout(() => setAboutOpen(true), 100);
  };

  const handleAboutEnd = () => { };

  const isLightPage = !workOpen && !aboutOpen && !activeCubeProject;
  const isGreenPage = isLightPage || activeCubeProject;
  const isAboutPage = aboutOpen;
  const navColor = isAboutPage ? "#050a1a" : isGreenPage ? "#4ade80" : "rgba(175,197,239,0.85)";
  const navBorder = isAboutPage ? "rgba(30,30,30,0.6)" : isGreenPage ? "rgba(74,222,128,0.5)" : "rgba(175,197,239,0.45)";

  // Nav actions gated behind splineReady for work/about/projects
  const safeAction = (fn) => () => {
    if (!splineReady && !workOpen && !aboutOpen && !activeCubeProject) return;
    fn();
  };

  return (
    <div style={{
      backgroundImage: "url('/bg.svg')",
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
      height: "100vh", width: "100vw",
      overflow: "hidden",
    }}>
      {!loaded && <Loader onComplete={handleLoaderComplete} />}

      {loaded && (
        <div ref={splineRef} style={{
          width: "100vw", height: "100vh",
          overflow: "hidden", opacity: 0,
          position: "relative",
        }}>
          <iframe
            src={!splineReady || aboutOpen || workOpen || activeCubeProject ? undefined : "https://my.spline.design/cubegrid-xPAkTLRkTzAIBg5gnhcsRmHE/"}
            frameBorder="0" width="100%" height="100%"
            title="Portfolio Cube"
          />

          {!aboutOpen && !workOpen && !activeCubeProject && (
            <div style={{
              position: "absolute", inset: 0, zIndex: 15,
              pointerEvents: "none",
            }}>
              {[
                { id: "chain", top: "28%", left: "28%", w: "14%", h: "14%" },
                { id: "churn", top: "25%", left: "58%", w: "14%", h: "14%" },
                { id: "youtube", top: "42%", left: "53%", w: "14%", h: "14%" },
                { id: "eval", top: "45%", left: "24%", w: "14%", h: "14%" },
              ].map(({ id, top, left, w, h }) => (
                <div
                  key={id}
                  onClick={(e) => { e.stopPropagation(); setActiveCubeProject(id); }}
                  style={{
                    position: "absolute", top, left,
                    width: w, height: h,
                    cursor: "pointer",
                    pointerEvents: "all",
                    // background: "rgba(255,0,0,0.3)",
                  }}
                />
              ))}
            </div>
          )}

          {/* HOVER A FACE hint — only on cube page */}
          {!aboutOpen && !workOpen && !activeCubeProject && (
            <div ref={hintRef} style={{
              position: "absolute", bottom: "32px", left: "50%",
              transform: "translateX(-50%)", opacity: 0,
              display: "flex", alignItems: "center", gap: "8px",
              pointerEvents: "none",
              width: "max-content",
              maxWidth: "90vw",
            }}>
              <span style={{
                color: "rgba(175,197,239,0.4)", fontSize: "11px",
                fontFamily: "monospace", letterSpacing: "0.2em",
                textAlign: "center",
              }}>{isMobile ? "TAP A FACE TO EXPLORE" : "HOVER A FACE · CLICK TO EXPLORE"}</span>
            </div>
          )}
        </div>
      )}

      {workOpen && (
        <Work onClose={() => setWorkOpen(false)} onEnd={handleWorkEnd} />
      )}

      {aboutOpen && (
        <About onClose={() => setAboutOpen(false)} onEnd={handleAboutEnd} />
      )}

      {activeCubeProject && (
        <ProjectCube
          projectId={activeCubeProject}
          onClose={() => setActiveCubeProject(null)}
          onEnd={() => {
            setActiveCubeProject(null);
            setTimeout(() => setWorkOpen(true), 100);
          }}
        />
      )}

      {/* GLOBAL NAV */}
      {loaded && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0,
          zIndex: 1000,
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          alignItems: isMobile ? "flex-start" : "center",
          justifyContent: "space-between",
          gap: isMobile ? "10px" : 0,
          padding: isMobile ? "12px 16px" : "16px 40px",
          pointerEvents: "none",
          background: workOpen ? "rgba(5,10,26,0.9)" : "none",
          backdropFilter: workOpen ? "blur(6px)" : "none",
          borderBottom: workOpen ? "1px solid rgba(74,222,128,0.06)" : "none",
          transition: "background 0.3s ease",
        }}>

          {!aboutOpen ? (
            <span
              onClick={goHome}
              style={{
                fontFamily: "'Helvetica Neue', Arial, sans-serif",
                fontSize: isMobile ? "20px" : "28px",
                fontWeight: "900",
                letterSpacing: isMobile ? "-1px" : "-2px",
                background: "linear-gradient(135deg, #166534, #4ade80, #bbf7d0)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                cursor: "pointer",
                pointerEvents: "all",
              }}>trisha shishodiya</span>
          ) : (
            <div />
          )}

          <div style={{
            display: "flex",
            flexWrap: "wrap",
            gap: isMobile ? "6px" : "8px",
            pointerEvents: "all",
            maxWidth: "100%",
          }}>
            {[
              { label: "CUBE", action: goHome },
              { label: "PROJECTS", action: () => { goHome(); setTimeout(() => setActiveCubeProject("__overview__"), 50); } },
              { label: "WORK & ACHIEVEMENTS", action: () => { goHome(); setTimeout(() => setWorkOpen(true), 50); } },
              { label: "ABOUT ME", action: () => { goHome(); setTimeout(() => setAboutOpen(true), 50); } },
            ].map(({ label, action }) => (
              <button
                key={label}
                onClick={(e) => { e.stopPropagation(); action(); }}
                style={{
                  background: isAboutPage ? "#4ade80" : "none",
                  border: `1px solid ${navBorder}`,
                  color: navColor,
                  fontSize: isMobile ? "9px" : "10px",
                  fontFamily: "monospace",
                  letterSpacing: isMobile ? "0.12em" : "0.2em",
                  padding: isMobile ? "7px 12px" : "8px 20px",
                  borderRadius: "2px", cursor: "pointer",
                  transition: "all 0.2s",
                  whiteSpace: "nowrap",
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = isAboutPage ? "#050a1a" : isGreenPage ? "#4ade80" : "rgba(175,197,239,0.15)";
                  e.currentTarget.style.color = isAboutPage ? "#4ade80" : isGreenPage ? "#050a1a" : "#fff";
                  e.currentTarget.style.borderColor = isAboutPage ? "#4ade80" : isGreenPage ? "#4ade80" : "rgba(175,197,239,0.8)";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = isAboutPage ? "#4ade80" : "none";
                  e.currentTarget.style.color = navColor;
                  e.currentTarget.style.borderColor = navBorder;
                }}
              >{label}</button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}