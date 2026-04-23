"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const COLS = 18;
const ROWS = 17;

interface Particle {
  x: number;
  y: number;
  phase: number;
  speed: number;
  amplitude: number;
}

function initParticles(w: number, h: number): Particle[] {
  const particles: Particle[] = [];
  const cellW = w / COLS;
  const cellH = h / ROWS;
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      particles.push({
        x: (c + 0.15 + Math.random() * 0.7) * cellW,
        y: (r + 0.15 + Math.random() * 0.7) * cellH,
        phase:     Math.random() * Math.PI * 2,
        speed:     0.2 + Math.random() * 0.3,
        amplitude: 4 + Math.random() * 4,
      });
    }
  }
  return particles;
}

export function Hero() {
  const canvasRef  = useRef<HTMLCanvasElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const mouseRef   = useRef<{ x: number | null; y: number | null }>({ x: null, y: null });
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    const canvas  = canvasRef.current;
    const section = sectionRef.current;
    if (!canvas || !section) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Theme detection
    const theme = { dark: document.documentElement.classList.contains("dark") };
    const themeObs = new MutationObserver(() => {
      theme.dark = document.documentElement.classList.contains("dark");
    });
    themeObs.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

    // Sizing
    const syncSize = () => {
      canvas.width  = section.offsetWidth;
      canvas.height = section.offsetHeight;
    };
    syncSize();
    let particles = initParticles(canvas.width, canvas.height);

    // Window-level mouse tracking — convert to canvas-relative coords
    const onMove = (e: MouseEvent) => {
      const r = canvas.getBoundingClientRect();
      mouseRef.current = { x: e.clientX - r.left, y: e.clientY - r.top };
    };
    const onLeave = () => { mouseRef.current = { x: null, y: null }; };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseleave", onLeave);

    // Resize — regenerate particles
    const onResize = () => {
      syncSize();
      particles = initParticles(canvas.width, canvas.height);
    };
    window.addEventListener("resize", onResize);

    // Draw loop
    let rafId: number;

    const tick = (ts: number) => {
      const W  = canvas.width;
      const H  = canvas.height;
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;
      const t  = ts * 0.001;
      const rgb = theme.dark ? "255,255,255" : "5,28,44";

      ctx.clearRect(0, 0, W, H);

      const hasMouse = mx !== null && my !== null;
      const count = particles.length;

      // Compute current positions and opacities
      const posX = new Float32Array(count);
      const posY = new Float32Array(count);
      const ops  = new Float32Array(count);

      for (let i = 0; i < count; i++) {
        const p  = particles[i];
        const ox = Math.sin(t * p.speed + p.phase) * p.amplitude;
        const oy = Math.cos(t * p.speed + p.phase * 1.3) * p.amplitude;
        posX[i]  = p.x + ox;
        posY[i]  = p.y + oy;

        if (hasMouse) {
          const dx   = posX[i] - mx!;
          const dy   = posY[i] - my!;
          const dist = Math.sqrt(dx * dx + dy * dy);
          ops[i] = Math.max(0.1, 1 - dist / 350);
        } else {
          ops[i] = 0.1;
        }
      }

      // Cursor lines — only when mouse is on screen
      if (hasMouse) {
        ctx.lineWidth = 1;
        for (let i = 0; i < count; i++) {
          if (ops[i] <= 0.3) continue;   // only meaningfully lit particles
          const lineOp = ops[i];
          ctx.strokeStyle = `rgba(${rgb},${lineOp.toFixed(3)})`;
          ctx.beginPath();
          ctx.moveTo(posX[i], posY[i]);
          ctx.lineTo(mx!, my!);
          ctx.stroke();
        }
      }

      // Particle-to-particle lines — only between cursor-lit particles (op > 0.1)
      ctx.lineWidth = 1;
      for (let i = 0; i < count; i++) {
        if (ops[i] <= 0.1) continue;
        for (let j = i + 1; j < count; j++) {
          if (ops[j] <= 0.1) continue;
          const dx = posX[i] - posX[j];
          const dy = posY[i] - posY[j];
          if (dx * dx + dy * dy >= 80 * 80) continue;
          const lineOp = Math.min(ops[i], ops[j]) * 0.4;
          ctx.strokeStyle = `rgba(${rgb},${lineOp.toFixed(3)})`;
          ctx.beginPath();
          ctx.moveTo(posX[i], posY[i]);
          ctx.lineTo(posX[j], posY[j]);
          ctx.stroke();
        }
      }

      // Particle dots
      for (let i = 0; i < count; i++) {
        ctx.fillStyle = `rgba(${rgb},${ops[i].toFixed(3)})`;
        ctx.beginPath();
        ctx.arc(posX[i], posY[i], 1.5, 0, Math.PI * 2);
        ctx.fill();
      }

      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseleave", onLeave);
      window.removeEventListener("resize", onResize);
      themeObs.disconnect();
    };
  }, []);

  return (
    <section ref={sectionRef} id="about" className="pt-16 relative overflow-hidden">

      {/* Particle canvas — always active, transparent background */}
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        style={{
          position: "absolute",
          top: 0, left: 0,
          width: "100%", height: "100%",
          zIndex: 0,
          pointerEvents: "none",
        }}
      />

      {/* Hero content — above canvas */}
      <div className="max-w-6xl mx-auto px-8 py-24 relative z-10">
        <div className="grid md:grid-cols-[1fr_260px] gap-16 md:gap-24 items-start">

          {/* Left: heading + bio + CTAs */}
          <div>
            <p
              className="font-sans text-xs font-semibold tracking-widest uppercase mb-6"
              style={{ color: "#2251FF" }}
            >
              Portfolio
            </p>

            <h1
              className="font-display font-bold leading-[1.08] tracking-tight"
              style={{ fontSize: "clamp(2.8rem, 6vw, 5rem)", color: "var(--heading)" }}
            >
              Dat Do
            </h1>
            <div className="mt-5 w-14 h-0.5 bg-[#2251FF]" />

            <p
              className="font-sans text-lg leading-relaxed mt-8 max-w-xl"
              style={{ color: "var(--body)" }}
            >
              Senior at Northeastern studying Finance and Quantitative Economics
              with a concurrent Master&apos;s in Finance. My work sits at the
              intersection of{" "}
              <span className="font-semibold" style={{ color: "var(--heading)" }}>
                corporate finance
              </span>
              ,{" "}
              <span className="font-semibold" style={{ color: "var(--heading)" }}>
                behavioral economics
              </span>
              , and{" "}
              <span className="font-semibold" style={{ color: "var(--heading)" }}>
                Southeast Asian business
              </span>{" "}
              — from DCF modeling at a Japanese construction firm in Vietnam to
              econometrics research on racial hiring discrimination.
            </p>

            <div className="mt-8 flex flex-wrap gap-2">
              {[
                "BS Finance + Quantitative Economics",
                "MS Finance (PlusOne)",
                "D'Amore-McKim · Northeastern",
              ].map((label) => (
                <span
                  key={label}
                  className="font-sans text-xs font-medium px-3 py-1.5 border"
                  style={{
                    borderColor: "var(--rule)",
                    color: "var(--muted)",
                    background: "var(--surface)",
                  }}
                >
                  {label}
                </span>
              ))}
            </div>

            <div className="mt-10 flex items-center gap-6">
              <a
                href="#projects"
                className="font-sans text-sm font-semibold px-7 py-3 text-white bg-[#2251FF] hover:bg-[#1840e0] transition-colors duration-150 rounded-[2px]"
              >
                View Projects
              </a>
              <a
                href="#contact"
                className="font-sans text-sm font-semibold border-b border-[#2251FF]/40 hover:border-[#2251FF] transition-colors pb-px"
                style={{ color: "#2251FF" }}
              >
                Get in touch →
              </a>
            </div>
          </div>

          {/* Right: headshot or placeholder */}
          <div className="hidden md:flex flex-col items-center">
            <div
              className="relative w-full aspect-square overflow-hidden rounded-2xl"
              style={{ border: "1px solid var(--rule)", background: "var(--surface)" }}
            >
              {imgError ? (
                <div
                  className="absolute inset-0 flex flex-col items-center justify-center gap-3"
                  style={{ color: "var(--muted)" }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="48" height="48"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.25"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="8" r="4" />
                    <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
                  </svg>
                  <span className="font-sans text-xs">headshot.jpg</span>
                </div>
              ) : (
                <Image
                  src="/headshot.jpg"
                  alt="Dat Do"
                  fill
                  className="object-cover"
                  priority
                  onError={() => setImgError(true)}
                />
              )}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
