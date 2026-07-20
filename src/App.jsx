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

const SPLINE_URL = "https://my.spline.design/cubegrid-xPAkTLRkTzAIBg5gnhcsRmHE/";

export default function App() {
  const [loaded, setLoaded] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [workOpen, setWorkOpen] = useState(false);
  const [activeCubeProject, setActiveCubeProject] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
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

  useEffect(() => {
    if (!isMobile) setMenuOpen(false);
  }, [isMobile]);

  const handleLoaderComplete = () => {
    setLoaded(true);
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

  // Bottom of Work → About (single render, no flash)
  const handleWorkEnd = () => {
    setWorkOpen(false);
    setAboutOpen(true);
  };

  // Scroll up at top of About → back to Work
  const handleAboutTop = () => {
    setAboutOpen(false);
    setWorkOpen(true);
  };

  const handleAboutEnd = () => { };

  const isLightPage = !workOpen && !aboutOpen && !activeCubeProject;
  const isGreenPage = isLightPage || activeCubeProject;
  const isAboutPage = aboutOpen;
  const navColor = isAboutPage ? "#050a1a" : isGreenPage ? "#4ade80" : "rgba(175,197,239,0.85)";
  const navBorder = isAboutPage ? "rgba(30,30,30,0.6)" : isGreenPage ? "rgba(74,222,128,0.5)" : "rgba(175,197,239,0.45)";

  const onCubePage = !aboutOpen && !workOpen && !activeCubeProject;

  // State set directly — no goHome + setTimeout dance (that caused a
  // one-frame flash of the cube page when switching pages)
  const NAV_ITEMS = [
    { label: "CUBE", action: goHome },
    {
      label: "PROJECTS", action: () => {
        setAboutOpen(false); setWorkOpen(false);
        setActiveCubeProject("__overview__");
      }
    },
    {
      label: "WORK & ACHIEVEMENTS", action: () => {
        setAboutOpen(false); setActiveCubeProject(null);
        setWorkOpen(true);
      }
    },
    {
      label: "ABOUT ME", action: () => {
        setWorkOpen(false); setActiveCubeProject(null);
        setAboutOpen(true);
      }
    },
  ];

  const runNav = (action) => {
    setMenuOpen(false);
    action();
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

      {/* Spline mounts IMMEDIATELY (behind the loader) so it loads during
          the 0-100 counter — and its src never changes, so navigating away
          and back doesn't force a reload */}
      <div ref={splineRef} style={{
        width: "100vw", height: "100vh",
        overflow: "hidden",
        opacity: loaded ? undefined : 0,
        position: "relative",
        // hide the cube page underneath overlays so it can't bleed through
        visibility: onCubePage || !loaded ? "visible" : "hidden",
      }}>
        <iframe
          src={SPLINE_URL}
          frameBorder="0" width="100%" height="100%"
          title="Portfolio Cube"
        />

        {loaded && onCubePage && (
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
                }}
              />
            ))}
          </div>
        )}

        {/* Hint — only on cube page */}
        {loaded && onCubePage && (
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

      {workOpen && (
        <Work onClose={() => setWorkOpen(false)} onEnd={handleWorkEnd} />
      )}

      {aboutOpen && (
        <About
          onClose={() => setAboutOpen(false)}
          onEnd={handleAboutEnd}
          onTop={handleAboutTop}
        />
      )}

      {activeCubeProject && (
        <ProjectCube
          projectId={activeCubeProject}
          onClose={() => setActiveCubeProject(null)}
          onEnd={() => {
            setActiveCubeProject(null);
            setWorkOpen(true);
          }}
        />
      )}

      {/* ============ GLOBAL NAV ============ */}
      {loaded && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0,
          zIndex: 1000,
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: isMobile ? "14px 20px" : "16px 40px",
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

          {/* Desktop: button row */}
          {!isMobile && (
            <div style={{ display: "flex", gap: "8px", pointerEvents: "all" }}>
              {NAV_ITEMS.map(({ label, action }) => (
                <button
                  key={label}
                  onClick={(e) => { e.stopPropagation(); action(); }}
                  style={{
                    background: isAboutPage ? "#4ade80" : "none",
                    border: `1px solid ${navBorder}`,
                    color: navColor,
                    fontSize: "10px", fontFamily: "monospace",
                    letterSpacing: "0.2em", padding: "8px 20px",
                    borderRadius: "2px", cursor: "pointer",
                    transition: "all 0.2s",
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
          )}

          {/* Mobile: hamburger button */}
          {isMobile && (
            <button
              onClick={(e) => { e.stopPropagation(); setMenuOpen(o => !o); }}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              style={{
                pointerEvents: "all",
                background: menuOpen ? "rgba(74,222,128,0.12)" : "none",
                border: `1px solid ${isAboutPage ? "rgba(74,222,128,0.5)" : navBorder}`,
                borderRadius: "4px",
                width: "40px", height: "40px",
                display: "flex", flexDirection: "column",
                alignItems: "center", justifyContent: "center",
                gap: "5px",
                cursor: "pointer",
                transition: "all 0.2s",
              }}
            >
              <span style={{
                display: "block", width: "18px", height: "2px",
                background: isAboutPage && !menuOpen ? "#050a1a" : "#4ade80",
                borderRadius: "1px",
                transition: "transform 0.25s, opacity 0.25s",
                transform: menuOpen ? "translateY(7px) rotate(45deg)" : "none",
              }} />
              <span style={{
                display: "block", width: "18px", height: "2px",
                background: isAboutPage && !menuOpen ? "#050a1a" : "#4ade80",
                borderRadius: "1px",
                transition: "opacity 0.2s",
                opacity: menuOpen ? 0 : 1,
              }} />
              <span style={{
                display: "block", width: "18px", height: "2px",
                background: isAboutPage && !menuOpen ? "#050a1a" : "#4ade80",
                borderRadius: "1px",
                transition: "transform 0.25s",
                transform: menuOpen ? "translateY(-7px) rotate(-45deg)" : "none",
              }} />
            </button>
          )}
        </div>
      )}

      {/* Mobile: full-screen menu overlay */}
      {loaded && isMobile && menuOpen && (
        <div
          onClick={() => setMenuOpen(false)}
          style={{
            position: "fixed", inset: 0, zIndex: 999,
            background: "rgba(5, 13, 6, 0.96)",
            backdropFilter: "blur(8px)",
            display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center",
            gap: "8px",
          }}
        >
          {NAV_ITEMS.map(({ label, action }) => (
            <button
              key={label}
              onClick={(e) => { e.stopPropagation(); runNav(action); }}
              style={{
                background: "none",
                border: "none",
                color: "#4ade80",
                fontSize: "22px",
                fontWeight: "800",
                fontFamily: "'Helvetica Neue', Arial, sans-serif",
                letterSpacing: "0.04em",
                padding: "16px 24px",
                cursor: "pointer",
                width: "100%",
                textAlign: "center",
              }}
            >{label}</button>
          ))}
          <span style={{
            marginTop: "24px",
            fontFamily: "monospace",
            fontSize: "10px",
            letterSpacing: "0.25em",
            color: "rgba(175,197,239,0.35)",
          }}>TAP ANYWHERE TO CLOSE</span>
        </div>
      )}
    </div>
  );
}