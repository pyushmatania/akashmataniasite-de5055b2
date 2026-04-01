import { useEffect, useMemo, useRef, useState, useCallback } from "react";

const MOODBOARD_SRC = "/moodboard.html";
const IFRAME_LOAD_TIMEOUT_MS = 12000;
const MAX_IFRAME_RETRIES = 1;
const LOADER_DURATION_MS = 3200;

const ROLES: [string, string][] = [
  ["🚀", "FOUNDER"],
  ["🛠", "BUILDER"],
  ["📦", "PRODUCT MANAGER"],
  ["🎨", "DESIGNER"],
  ["⚡", "ENGINEER"],
  ["✨", "CREATOR"],
];

const PM_STICKERS = [
  { icon: "📋", label: "SPRINT PLANNING", bg: "rgba(66,165,245,0.15)", color: "#64B5F6" },
  { icon: "🎯", label: "OKRs", bg: "rgba(255,183,77,0.15)", color: "#FFB74D" },
  { icon: "📊", label: "METRICS", bg: "rgba(129,199,132,0.15)", color: "#81C784" },
  { icon: "🚀", label: "SHIP IT", bg: "rgba(255,112,67,0.15)", color: "#FF7043" },
  { icon: "💡", label: "IDEATION", bg: "rgba(255,241,118,0.15)", color: "#FFF176" },
  { icon: "🔄", label: "RETRO", bg: "rgba(186,104,200,0.15)", color: "#CE93D8" },
  { icon: "📝", label: "USER STORY", bg: "rgba(77,182,172,0.15)", color: "#4DB6AC" },
  { icon: "⚡", label: "VELOCITY", bg: "rgba(255,213,79,0.15)", color: "#FFD54F" },
  { icon: "🏗️", label: "ROADMAP", bg: "rgba(144,164,174,0.15)", color: "#90A4AE" },
  { icon: "🎨", label: "DESIGN REVIEW", bg: "rgba(240,98,146,0.15)", color: "#F06292" },
  { icon: "🔍", label: "DISCOVERY", bg: "rgba(121,134,203,0.15)", color: "#7986CB" },
  { icon: "📦", label: "BACKLOG", bg: "rgba(255,138,101,0.15)", color: "#FF8A65" },
  { icon: "✅", label: "ACCEPTANCE", bg: "rgba(102,187,106,0.15)", color: "#66BB6A" },
  { icon: "🧪", label: "A/B TEST", bg: "rgba(171,71,188,0.15)", color: "#AB47BC" },
  { icon: "📈", label: "GROWTH", bg: "rgba(41,182,246,0.15)", color: "#29B6F6" },
  { icon: "🤝", label: "STANDUP", bg: "rgba(255,167,38,0.15)", color: "#FFA726" },
  { icon: "🛠", label: "BUILD", bg: "rgba(201,169,110,0.15)", color: "#C9A96E" },
  { icon: "💎", label: "MVP", bg: "rgba(0,188,212,0.15)", color: "#00BCD4" },
  { icon: "🔥", label: "P0 BUG", bg: "rgba(244,67,54,0.15)", color: "#EF5350" },
  { icon: "🎪", label: "DEMO DAY", bg: "rgba(156,39,176,0.15)", color: "#AB47BC" },
];

function rnd(a: number, b: number) { return a + Math.random() * (b - a); }
function pick<T>(arr: T[]): T { return arr[Math.floor(Math.random() * arr.length)]; }

interface Chip {
  id: number;
  sticker: typeof PM_STICKERS[0];
  left: string;
  top: string;
  sx: string; sy: string; dx: string; dy: string;
  sr: string; er: string; dur: string;
}

let chipId = 0;

function makeChip(): Chip {
  const angle = rnd(0, Math.PI * 2);
  const radius = rnd(80, 250);
  return {
    id: chipId++,
    sticker: pick(PM_STICKERS),
    left: `calc(50% + ${Math.cos(angle) * rnd(-40, 40)}px)`,
    top: `calc(50% + ${Math.sin(angle) * rnd(-40, 40)}px)`,
    sx: `${Math.cos(angle + Math.PI) * radius}px`,
    sy: `${Math.sin(angle + Math.PI) * radius}px`,
    dx: `${Math.cos(angle) * radius * 0.7}px`,
    dy: `${Math.sin(angle) * radius * 0.7}px`,
    sr: `${rnd(-120, 120)}deg`,
    er: `${rnd(-25, 25)}deg`,
    dur: `${rnd(2.2, 3.8)}s`,
  };
}

const Index = () => {
  const [loaded, setLoaded] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const [percent, setPercent] = useState(0);
  const [chips, setChips] = useState<Chip[]>([]);
  const loadTimerRef = useRef<number | null>(null);
  const startTimeRef = useRef(Date.now());

  const moodboardSrc = useMemo(
    () => (attempt === 0 ? MOODBOARD_SRC : `${MOODBOARD_SRC}?retry=${attempt}`),
    [attempt],
  );

  useEffect(() => {
    setLoaded(false);
    if (loadTimerRef.current !== null) window.clearTimeout(loadTimerRef.current);
    loadTimerRef.current = window.setTimeout(() => {
      setAttempt((c) => (c < MAX_IFRAME_RETRIES ? c + 1 : c));
    }, IFRAME_LOAD_TIMEOUT_MS);
    return () => { if (loadTimerRef.current !== null) window.clearTimeout(loadTimerRef.current); };
  }, [attempt]);

  // Chip spawner
  useEffect(() => {
    if (loaded) return;
    const iv = setInterval(() => {
      const count = Math.floor(rnd(2, 4));
      const newOnes = Array.from({ length: count }, () => makeChip());
      setChips(prev => [...prev.slice(-20), ...newOnes]);
    }, 500);
    return () => clearInterval(iv);
  }, [loaded]);

  useEffect(() => {
    if (chips.length === 0) return;
    const timer = setTimeout(() => {
      setChips(prev => prev.slice(Math.floor(rnd(2, 4))));
    }, 4200);
    return () => clearTimeout(timer);
  }, [chips.length]);

  // Percentage counter
  useEffect(() => {
    if (loaded) return;
    startTimeRef.current = Date.now();
    const iv = setInterval(() => {
      const elapsed = Date.now() - startTimeRef.current;
      const pct = Math.min(100, Math.round((elapsed / LOADER_DURATION_MS) * 100));
      setPercent(pct);
      if (pct >= 100) clearInterval(iv);
    }, 30);
    return () => clearInterval(iv);
  }, [loaded]);

  const handleLoad = useCallback(() => {
    if (loadTimerRef.current !== null) { window.clearTimeout(loadTimerRef.current); loadTimerRef.current = null; }
    setLoaded(true);
  }, []);

  const handleError = useCallback(() => {
    if (loadTimerRef.current !== null) { window.clearTimeout(loadTimerRef.current); loadTimerRef.current = null; }
    setAttempt((c) => (c < MAX_IFRAME_RETRIES ? c + 1 : c));
  }, []);

  return (
    <div className="relative w-full" style={{ height: "100dvh" }}>
      {!loaded && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center overflow-hidden" style={{ background: "#0a0812" }}>
          {/* PM sticker chips */}
          {chips.map((c) => (
            <div
              key={c.id}
              style={{
                position: "absolute",
                left: c.left,
                top: c.top,
                padding: "6px 14px",
                borderRadius: 20,
                fontFamily: "'Space Grotesk',sans-serif",
                fontSize: "0.72rem",
                fontWeight: 700,
                letterSpacing: "0.04em",
                whiteSpace: "nowrap",
                background: c.sticker.bg,
                color: c.sticker.color,
                border: `1.5px solid ${c.sticker.color}33`,
                backdropFilter: "blur(8px)",
                boxShadow: "0 4px 16px rgba(0,0,0,0.25)",
                display: "flex",
                alignItems: "center",
                gap: 6,
                opacity: 0,
                pointerEvents: "none",
                animation: `chipFly ${c.dur} cubic-bezier(0.22,1,0.36,1) forwards`,
                ["--sx" as string]: c.sx,
                ["--sy" as string]: c.sy,
                ["--dx" as string]: c.dx,
                ["--dy" as string]: c.dy,
                ["--sr" as string]: c.sr,
                ["--er" as string]: c.er,
              } as React.CSSProperties}
            >
              <span style={{ fontSize: "1rem" }}>{c.sticker.icon}</span>
              {c.sticker.label}
            </div>
          ))}

          {/* Name */}
          <h1 style={{
            fontFamily: "'Space Grotesk',sans-serif",
            fontSize: "clamp(2rem,7vw,3.2rem)",
            fontWeight: 900,
            letterSpacing: "-0.02em",
            lineHeight: 1,
            background: "linear-gradient(135deg,#fff 30%,#C9A96E 60%,#CE93D8 90%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            animation: "ldUp 0.6s 0.15s both",
            position: "relative",
            zIndex: 3,
          }}>Akash Matania</h1>

          {/* Role cycling */}
          <div style={{ height: "2rem", overflow: "hidden", marginTop: 12, position: "relative", zIndex: 3, animation: "ldUp 0.5s 0.4s both" }}>
            <div style={{ display: "flex", flexDirection: "column", animation: "roleScroll 2.4s 0.6s steps(1) forwards" }}>
              {ROLES.map(([icon, label]) => (
                <div key={label} style={{ height: "2rem", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, fontFamily: "'Space Grotesk',sans-serif", fontSize: "0.85rem", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", whiteSpace: "nowrap" }}>
                  <span>{icon}</span>
                  <span style={{ background: "linear-gradient(90deg,rgba(255,255,255,0.6),rgba(255,255,255,0.35))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>{label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Accent line */}
          <div style={{ width: 50, height: 2, marginTop: 20, background: "linear-gradient(90deg,transparent,#C9A96E,#CE93D8,transparent)", animation: "ldUp 0.4s 0.5s both", position: "relative", zIndex: 3 }} />

          {/* Percentage counter */}
          <div style={{
            fontFamily: "'Space Grotesk',sans-serif",
            fontSize: "clamp(4rem,15vw,8rem)",
            fontWeight: 900,
            letterSpacing: "-0.04em",
            lineHeight: 1,
            background: "linear-gradient(135deg,rgba(255,255,255,0.08),rgba(255,255,255,0.03))",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            position: "absolute",
            bottom: "12%",
            right: "8%",
            zIndex: 1,
            fontVariantNumeric: "tabular-nums",
          }}>{percent}</div>

          <style>{`
            @keyframes chipFly{
              0%{opacity:0;transform:translate(var(--sx,0),var(--sy,0)) rotate(var(--sr,0deg)) scale(0.4)}
              18%{opacity:1;transform:translate(calc(var(--sx,0)*0.3),calc(var(--sy,0)*0.3)) rotate(calc(var(--sr,0deg)*0.3)) scale(1.08)}
              45%{opacity:1;transform:translate(0,0) rotate(var(--er,0deg)) scale(1)}
              75%{opacity:0.8;transform:translate(var(--dx,0),var(--dy,0)) rotate(calc(var(--er,0deg)+10deg)) scale(0.92)}
              100%{opacity:0;transform:translate(calc(var(--dx,0)*1.8),calc(var(--dy,0)*1.8)) rotate(calc(var(--er,0deg)+30deg)) scale(0.4)}
            }
            @keyframes ldUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
            @keyframes roleScroll{0%{transform:translateY(0)}16%{transform:translateY(-2rem)}32%{transform:translateY(-4rem)}48%{transform:translateY(-6rem)}64%{transform:translateY(-8rem)}80%,100%{transform:translateY(-10rem)}}
          `}</style>
        </div>
      )}

      <iframe
        key={attempt}
        src={moodboardSrc}
        title="Akash's Moodboard"
        className="w-full border-0"
        style={{ height: "100dvh", overflow: "hidden", opacity: loaded ? 1 : 0, transition: "opacity 0.4s" }}
        onLoad={handleLoad}
        onError={handleError}
        allow="autoplay"
      />
    </div>
  );
};

export default Index;
