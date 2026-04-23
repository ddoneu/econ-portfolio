"use client";

import { useEffect, useMemo, useRef, useState } from "react";

const RINGS = [
  {
    id: 0,
    label: "Statistics",
    radius: 140,
    speed: 20,
    direction: 1,
    skills: ["Econometrics", "OLS/IV", "Causal Inference", "Logit/Probit", "Time Series"],
  },
  {
    id: 1,
    label: "Machine Learning",
    radius: 220,
    speed: 30,
    direction: -1,
    skills: ["scikit-learn", "Random Forest", "TF-IDF", "PCA", "K-Means", "NLP"],
  },
  {
    id: 2,
    label: "Finance",
    radius: 300,
    speed: 45,
    direction: 1,
    skills: ["DCF Modeling", "Bloomberg", "Excel", "Financial Modeling", "Valuation"],
  },
  {
    id: 3,
    label: "Tools",
    radius: 390,
    speed: 60,
    direction: -1,
    skills: ["Python", "R", "SQL", "Pandas", "Git", "Jupyter", "Plotly", "statsmodels"],
  },
];

// Proficiency range per ring (innermost → outermost), all ≥ 95
const PROF_RANGES: [number, number][] = [
  [98, 100],
  [97,  99],
  [96,  98],
  [95,  97],
];

// Canvas constants — outermost ring 390px + ~50px pill overhang → need 440px from center
const SYS = 920;
const CX  = 460;
const CY  = 460;

export function Skills() {
  const [hoveredRing,  setHoveredRing]  = useState<number | null>(null);
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null);
  const [barFill,      setBarFill]      = useState(0);
  const [centerLabel,  setCenterLabel]  = useState("");
  const [angles,       setAngles]       = useState<number[]>(RINGS.map(() => 0));

  const containerRef = useRef<HTMLDivElement>(null);
  const frameRef     = useRef<number>(0);
  const lastTimeRef  = useRef<number>(0);
  const [scale, setScale] = useState(1);

  // Fixed proficiency values — computed once on mount
  const proficiencies = useMemo(() => {
    const map: Record<string, number> = {};
    RINGS.forEach((ring, ri) => {
      const [lo, hi] = PROF_RANGES[ri];
      ring.skills.forEach((skill) => {
        map[skill] = Math.round(lo + Math.random() * (hi - lo));
      });
    });
    return map;
  }, []);

  // Responsive scaling
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const obs = new ResizeObserver(([entry]) => {
      setScale(Math.min(1, entry.contentRect.width / SYS));
    });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // RAF animation loop — pauses whichever ring is hovered
  useEffect(() => {
    const tick = (t: number) => {
      const dt = lastTimeRef.current ? (t - lastTimeRef.current) / 1000 : 0;
      lastTimeRef.current = t;
      setAngles((prev) =>
        prev.map((a, i) =>
          hoveredRing === i ? a : a + (360 / RINGS[i].speed) * RINGS[i].direction * dt
        )
      );
      frameRef.current = requestAnimationFrame(tick);
    };
    frameRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameRef.current);
  }, [hoveredRing]);

  // Tooltip open: reset bar to 0 first, then animate to proficiency
  const openTooltip = (skill: string) => {
    setHoveredSkill(skill);
    setBarFill(0);
    setTimeout(() => setBarFill(proficiencies[skill] ?? 0), 50);
  };
  const closeTooltip = () => {
    setHoveredSkill(null);
    setBarFill(0);
  };

  return (
    <section
      id="skills"
      style={{ borderTop: "1px solid var(--rule)", overflow: "hidden" }}
    >
      <div className="max-w-6xl mx-auto px-8 py-24">

        {/* Heading */}
        <div>
          <p
            className="font-sans text-xs font-semibold tracking-widest uppercase mb-3"
            style={{ color: "#2251FF" }}
          >
            Expertise
          </p>
          <div className="w-10 h-0.5 bg-[#2251FF] mb-4" />
          <h2
            className="font-display font-bold tracking-tight"
            style={{ fontSize: "clamp(1.75rem, 3vw, 2.5rem)", color: "var(--heading)" }}
          >
            Skills &amp; Expertise
          </h2>
        </div>

        {/* Subtitle — centered between heading and orbit */}
        <p
          style={{
            textAlign: "center",
            fontSize: "1.4rem",
            fontWeight: 700,
            color: "var(--heading)",
            marginTop: 32,
            fontFamily: "var(--font-playfair), Georgia, 'Times New Roman', serif",
            lineHeight: 1.2,
          }}
        >
          Hover any orbit to explore
        </p>

        {/* Orbit container — scales to fit narrow viewports */}
        <div
          ref={containerRef}
          className="relative w-full"
          style={{ height: SYS, marginTop: 48 }}
        >
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: `translate(-50%, -50%) scale(${scale})`,
              transformOrigin: "center center",
              width: SYS,
              height: SYS,
            }}
          >

            {/* ── Center node group anchored at (CX, CY) ── */}
            <div
              style={{
                position: "absolute",
                top: CY,
                left: CX,
                transform: "translate(-50%, -50%)",
                zIndex: 20,
              }}
            >
              {/* Sonar pulses */}
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  aria-hidden
                  style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: 70,
                    height: 70,
                    borderRadius: "50%",
                    border: "1px solid #2251FF",
                    animation: `pulse-ring 3s ease-out ${i}s infinite`,
                    opacity: 0,
                  }}
                />
              ))}

              {/* Blue circle */}
              <div
                style={{
                  width: 70,
                  height: 70,
                  borderRadius: "50%",
                  background: "#2251FF",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 0 30px rgba(34,81,255,0.5)",
                  position: "relative",
                  zIndex: 10,
                }}
              >
                <span
                  style={{
                    color: "#fff",
                    fontSize: 11,
                    fontWeight: 700,
                    fontFamily: "var(--font-playfair), Georgia, serif",
                    textAlign: "center",
                    lineHeight: 1.2,
                    userSelect: "none",
                  }}
                >
                  Dat<br />Do
                </span>
              </div>

              {/* Ring category label — shown while a ring is hovered */}
              {centerLabel && (
                <div
                  style={{
                    position: "absolute",
                    top: 80,
                    left: "50%",
                    transform: "translateX(-50%)",
                    whiteSpace: "nowrap",
                    color: "#2251FF",
                    fontSize: 11,
                    fontWeight: 700,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    fontFamily: "var(--font-inter), system-ui, sans-serif",
                    userSelect: "none",
                  }}
                >
                  {centerLabel}
                </div>
              )}

            </div>

            {/* ── Orbital rings ──
                Rendered outermost-first so inner rings sit on top in DOM
                stacking order and win pointer-event hit tests at their radius.
                border-radius: 50% makes each div's hit area circular, so the
                inner ring's circle cleanly overlaps the outer ring's centre.   */}
            {[...RINGS].reverse().map((ring) => {
              const isHovered = hoveredRing === ring.id;
              const angle     = angles[ring.id];

              return (
                <div
                  key={ring.id}
                  style={{
                    position: "absolute",
                    top: CY,
                    left: CX,
                    width: ring.radius * 2,
                    height: ring.radius * 2,
                    marginLeft: -ring.radius,
                    marginTop: -ring.radius,
                    borderRadius: "50%",
                    border: `1px solid rgba(34,81,255,${isHovered ? 0.6 : 0.2})`,
                    transition: "border-color 0.3s",
                    zIndex: 5,
                    cursor: "pointer",
                  }}
                  onMouseEnter={() => { setHoveredRing(ring.id); setCenterLabel(ring.label); }}
                  onMouseLeave={() => { setHoveredRing(null); setCenterLabel(""); }}
                >
                  {/* Traveling accent dot */}
                  <div
                    aria-hidden
                    style={{
                      position: "absolute",
                      top: "50%",
                      left: "50%",
                      width: 6,
                      height: 6,
                      borderRadius: "50%",
                      background: "#2251FF",
                      transform: `rotate(${angle}deg) translateX(${ring.radius}px) translate(-50%, -50%)`,
                      boxShadow: "0 0 6px #2251FF",
                      opacity: isHovered ? 0 : 0.8,
                      transition: "opacity 0.3s",
                    }}
                  />

                  {/* ── Skill pills ── */}
                  {ring.skills.map((skill, si) => {
                    const rad        = ((si / ring.skills.length) * 360 + angle) * (Math.PI / 180);
                    const x          = ring.radius * Math.cos(rad);
                    const y          = ring.radius * Math.sin(rad);
                    const isThisHov  = hoveredSkill === skill;
                    // Pills in lower half → tooltip above; upper half → tooltip below
                    const tipAbove   = y > 0;

                    return (
                      <div
                        key={skill}
                        style={{
                          position: "absolute",
                          top: "50%",
                          left: "50%",
                          transform: `translate(calc(${x}px - 50%), calc(${y}px - 50%))`,
                          zIndex: isThisHov ? 30 : 10,
                          pointerEvents: "none",
                        }}
                      >
                        {/* Pill badge */}
                        <div
                          style={{
                            background: isHovered ? "rgba(34,81,255,0.1)" : "var(--bg)",
                            border: `1px solid rgba(34,81,255,${isThisHov ? 0.9 : isHovered ? 0.65 : 0.3})`,
                            borderRadius: 4,
                            padding: "6px 12px",
                            whiteSpace: "nowrap",
                            fontSize: 11,
                            fontWeight: isHovered ? 600 : 400,
                            fontFamily: "var(--font-inter), system-ui, sans-serif",
                            color: isHovered ? "#2251FF" : "var(--body)",
                            transition: "all 0.3s",
                            transform: `scale(${isThisHov ? 1.1 : isHovered ? 1.05 : 1})`,
                            boxShadow: isThisHov
                              ? "0 0 12px rgba(34,81,255,0.4)"
                              : "none",
                            cursor: "default",
                            userSelect: "none",
                            pointerEvents: "auto",
                          }}
                          onMouseEnter={() => openTooltip(skill)}
                          onMouseLeave={closeTooltip}
                        >
                          {skill}
                        </div>

                        {/* Proficiency tooltip */}
                        {isThisHov && (
                          <div
                            style={{
                              position: "absolute",
                              ...(tipAbove
                                ? { bottom: "calc(100% + 10px)" }
                                : { top:    "calc(100% + 10px)" }),
                              left: "50%",
                              transform: "translateX(-50%)",
                              background: "#051C2C",
                              border: "1px solid rgba(34,81,255,0.3)",
                              borderRadius: 6,
                              padding: "10px 14px",
                              width: 164,
                              zIndex: 50,
                              pointerEvents: "none",
                              boxShadow: "0 8px 24px rgba(0,0,0,0.35)",
                            }}
                          >
                            <div style={{
                              color: "#fff",
                              fontSize: 12,
                              fontWeight: 600,
                              marginBottom: 8,
                              fontFamily: "var(--font-inter), system-ui, sans-serif",
                              whiteSpace: "nowrap",
                            }}>
                              {skill}
                            </div>

                            {/* Animated progress bar */}
                            <div style={{
                              background: "rgba(255,255,255,0.12)",
                              borderRadius: 999,
                              height: 6,
                              overflow: "hidden",
                            }}>
                              <div style={{
                                height: "100%",
                                width: `${barFill}%`,
                                background: "linear-gradient(90deg, #22C55E, #86EFAC)",
                                borderRadius: 999,
                                transition: "width 0.8s ease",
                              }} />
                            </div>

                            <div style={{
                              color: "#86EFAC",
                              fontSize: 11,
                              fontWeight: 600,
                              marginTop: 5,
                              textAlign: "right",
                              fontFamily: "var(--font-inter), system-ui, sans-serif",
                            }}>
                              {proficiencies[skill]}%
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes pulse-ring {
          0%   { transform: translate(-50%, -50%) scale(1); opacity: 0.6; }
          100% { transform: translate(-50%, -50%) scale(3); opacity: 0;   }
        }
      `}</style>
    </section>
  );
}
